use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

pub struct AlarmState {
    pub sink: Arc<Mutex<Option<Sink>>>,
    pub _stream: Arc<Mutex<Option<SendOutputStream>>>,
}

/// rodio's OutputStream is not Send/Sync, so we wrap it and unsafe impl Send/Sync.
/// This is safe because we only hold it in a Mutex and it's dropped when the alarm stops.
pub struct SendOutputStream(pub OutputStream);
unsafe impl Send for SendOutputStream {}
unsafe impl Sync for SendOutputStream {}

#[tauri::command]
pub fn play_alarm(state: tauri::State<'_, AlarmState>) -> Result<(), String> {
    play_alarm_impl(state.sink.clone(), state._stream.clone())
}

pub fn play_alarm_impl(
    sink_mutex: Arc<Mutex<Option<Sink>>>,
    stream_mutex: Arc<Mutex<Option<SendOutputStream>>>,
) -> Result<(), String> {
    let (stream, stream_handle) = OutputStream::try_default().map_err(|e| e.to_string())?;
    let sink = Sink::try_new(&stream_handle).map_err(|e| e.to_string())?;

    let file = File::open("assets/alarm.ogg").map_err(|e| e.to_string())?;
    let source = Decoder::new(BufReader::new(file)).map_err(|e| e.to_string())?;

    sink.append(source);
    sink.play();

    let mut sink_lock = sink_mutex.lock().unwrap();
    *sink_lock = Some(sink);
    
    let mut stream_lock = stream_mutex.lock().unwrap();
    *stream_lock = Some(SendOutputStream(stream));

    Ok(())
}

#[tauri::command]
pub fn stop_alarm(state: tauri::State<'_, AlarmState>) -> Result<(), String> {
    let mut sink_lock = state.sink.lock().unwrap();
    if let Some(sink) = sink_lock.take() {
        sink.stop();
    }
    let mut stream_lock = state._stream.lock().unwrap();
    *stream_lock = None;
    Ok(())
}
