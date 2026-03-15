use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use tokio::sync::mpsc;
use tokio::time::{self, Duration};

#[derive(Clone, serde::Serialize)]
struct TimerTickPayload {
    remaining_sec: u32,
}

pub struct TimerState {
    pub tx: Arc<Mutex<Option<mpsc::Sender<()>>>>,
}

#[tauri::command]
pub async fn start_timer(
    minutes: u32,
    state: tauri::State<'_, TimerState>,
    app_handle: AppHandle,
) -> Result<(), String> {
    let old_tx = {
        let mut tx_lock = state.tx.lock().unwrap();
        tx_lock.take()
    };
    if let Some(old_tx) = old_tx {
        let _ = old_tx.send(()).await;
    }

    let (tx, mut rx) = mpsc::channel(1);
    {
        let mut tx_lock = state.tx.lock().unwrap();
        *tx_lock = Some(tx);
    }

    let mut remaining_sec = minutes * 60;

    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(1));
        loop {
            tokio::select! {
                _ = interval.tick() => {
                    let _ = app_handle.emit("timer_tick", TimerTickPayload { remaining_sec });
                    if remaining_sec == 0 {
                        let _ = app_handle.emit("timer_finished", ());
                        break;
                    }
                    remaining_sec -= 1;
                }
                _ = rx.recv() => {
                    break;
                }
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub async fn stop_timer(state: tauri::State<'_, TimerState>) -> Result<(), String> {
    let tx = {
        let mut tx_lock = state.tx.lock().unwrap();
        tx_lock.take()
    };
    if let Some(tx) = tx {
        let _ = tx.send(()).await;
    }
    Ok(())
}
