pub mod timer;
pub mod alarm;
pub mod notification;

use std::sync::{Arc, Mutex};
use crate::timer::TimerState;
use crate::alarm::AlarmState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .manage(TimerState {
            tx: Arc::new(Mutex::new(None)),
        })
        .manage(AlarmState {
            sink: Arc::new(Mutex::new(None)),
            _stream: Arc::new(Mutex::new(None)),
        })
        .invoke_handler(tauri::generate_handler![
            timer::start_timer,
            timer::stop_timer,
            alarm::play_alarm,
            alarm::stop_alarm,
            notification::show_notification,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
