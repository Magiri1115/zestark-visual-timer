use tauri_plugin_notification::NotificationExt;

#[tauri::command]
pub fn show_notification(app: tauri::AppHandle, title: String, body: String) {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .unwrap();
}
