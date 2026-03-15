use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

pub struct AlarmState {
    pub sink: Arc<Mutex<Option<Sink>>>,
    pub _stream: Arc<Mutex<Option<OutputStream>>>,
}

#[tauri::command]
pub fn play_alarm(state: tauri::State<'_, AlarmState>) -> Result<(), String> {
    let (stream, stream_handle) = OutputStream::try_default().map_err(|e| e.to_string())?;
    let sink = Sink::try_new(&stream_handle).map_err(|e| e.to_string())?;

    // 本来はアセットから読み込むが、ここではパス指定とする
    // docx/detail-design/file-structure.md に基づき、src-tauri/assets/alarm.ogg を使用
    let file = File::open("assets/alarm.ogg").map_err(|e| e.to_string())?;
    let source = Decoder::new(BufReader::new(file)).map_err(|e| e.to_string())?;

    sink.append(source);
    sink.play();

    let mut sink_lock = state.sink.lock().unwrap();
    *sink_lock = Some(sink);
    
    let mut stream_lock = state._stream.lock().unwrap();
    *stream_lock = Some(stream);

    Ok(())
}

#[tauri::command]
pub fn stop_alarm(state: tauri::State<'_, AlarmState>) -> Result<(), String> {
    let mut sink_lock = state.sink.lock().unwrap();
    if let Some(sink) = sink_lock.take() {
        sink.stop();
    }
    Ok(())
}
