use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::sync::{Arc, Mutex};

pub struct AlarmState {
    pub sink: Arc<Mutex<Option<Sink>>>,
    pub _stream: Arc<Mutex<Option<SendOutputStream>>>,
}

pub struct SendOutputStream(pub OutputStream);
unsafe impl Send for SendOutputStream {}
unsafe impl Sync for SendOutputStream {}

/// tokio::spawn内から呼べるよう、tauri::Stateを使わないバージョン
pub fn play_alarm_inner(
    sink_arc: &Arc<Mutex<Option<Sink>>>,
    stream_arc: &Arc<Mutex<Option<SendOutputStream>>>,
) -> Result<(), String> {
    // ✅ 修正1: OutputStreamとSinkを作成
    let (stream, stream_handle) = OutputStream::try_default().map_err(|e| e.to_string())?;
    let sink = Sink::try_new(&stream_handle).map_err(|e| e.to_string())?;
    

    let audio_path = if cfg!(debug_assertions) {
        "assets/alarm.ogg"
    } else {
        "assets/alarm.ogg"
    };

    eprintln!("Attempting to load alarm from: {}", audio_path);
    
    let file = File::open(audio_path).map_err(|e| {
        eprintln!("Failed to open alarm file at '{}': {}", audio_path, e);
        format!("Failed to open alarm file: {}", e)
    })?;
    
    let source = Decoder::new(BufReader::new(file)).map_err(|e| {
        eprintln!("Failed to decode audio: {}", e);
        format!("Failed to decode audio: {}", e)
    })?;

    sink.set_volume(1.0);
    sink.append(source);
    sink.play();

    *sink_arc.lock().unwrap() = Some(sink);
    *stream_arc.lock().unwrap() = Some(SendOutputStream(stream));

    eprintln!("Alarm playback started successfully");
    Ok(())
}

#[tauri::command]
pub fn play_alarm(state: tauri::State<'_, AlarmState>) -> Result<(), String> {
    play_alarm_inner(&state.sink, &state._stream)
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