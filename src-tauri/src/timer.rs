use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use tokio::sync::mpsc;
use tokio::time::{self, Duration};

use crate::alarm::{AlarmState, play_alarm_inner};
use crate::notification::show_notification;

#[derive(Clone, serde::Serialize)]
struct TimerTickPayload {
    remaining_sec: u32,
}

pub struct TimerState {
    pub tx: Arc<Mutex<Option<mpsc::Sender<()>>>>,
}

#[tauri::command]
pub async fn start_timer(
    seconds: u32,
    state: tauri::State<'_, TimerState>,
    alarm_state: tauri::State<'_, AlarmState>,
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

    let mut remaining_sec = seconds;
    let alarm_sink = Arc::clone(&alarm_state.sink);
    let alarm_stream = Arc::clone(&alarm_state._stream);

    tokio::spawn(async move {
        let mut interval = time::interval(Duration::from_secs(1));
        loop {
            tokio::select! {
                _ = interval.tick() => {
                    if remaining_sec == 0 {
                        // タイマー終了イベントを発火
                        let _ = app_handle.emit("timer_finished", ());
                        
                        // ✅ 修正: エラーハンドリングを追加してアラーム失敗をログ
                        if let Err(e) = play_alarm_inner(&alarm_sink, &alarm_stream) {
                            eprintln!("Failed to play alarm: {}", e);
                        }
                        
                        // 通知を表示
                        show_notification(
                            app_handle.clone(),
                            "タイマー終了".to_string(),
                            "設定時間が経過しました！".to_string()
                        );
                        break;
                    }
                    
                    // tickイベントを発火
                    let _ = app_handle.emit("timer_tick", TimerTickPayload { remaining_sec });
                    remaining_sec -= 1;
                }
                _ = rx.recv() => {
                    // タイマー停止
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