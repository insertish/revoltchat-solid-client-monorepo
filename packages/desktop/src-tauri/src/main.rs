#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
  menu::{Menu, MenuItem, MenuEvent},
  tray::{TrayIconBuilder, TrayIconEvent, MouseButton},
  Manager
};

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .on_window_event(|window, event| match event {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        window.hide().unwrap();
        api.prevent_close();
      }
      _ => {}
    })
    .setup(| app | {
      let title = MenuItem::with_id(app, "title", "Revolt", false, None::<&str>)?;
      let open = MenuItem::with_id(app, "open", "Open Revolt", true, None::<&str>)?;
      let hide = MenuItem::with_id(app, "hide", "Hide Revolt", true, None::<&str>)?;
      let quit = MenuItem::with_id(app, "quit", "Quit Revolt", true, None::<&str>)?;

      let menu = Menu::with_items(app, &[
        &title,
        &open,
        &hide,
        &quit
      ])?;

      let tray = TrayIconBuilder::new()
          .icon(app.default_window_icon().unwrap().clone())
          .menu(&menu)
          .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
              button: MouseButton::Left,
              ..
            } => {
              let app = tray.app_handle();
              let window = app.get_webview_window("main").unwrap();

              if window.set_focus().is_err() {
                println!("[on_system_tray_event][:LeftClick] error when trying to set main window focus.");
              }
            },
            _ => {}
          })
          .on_menu_event(|app, event| match event.id.as_ref() {
            "open" => {
              let window = app.get_webview_window("main").unwrap();
              window.show().unwrap();
              window.set_focus().unwrap();
            }
            "hide" => {
              let window = app.get_webview_window("main").unwrap();
              window.hide().unwrap();
            }
            "quit" => {
              std::process::exit(0);
            }
            _ => {}
          })
          .build(app)?;

      if cfg!(any(windows, target_os = "macos")) {
        let window = app.get_webview_window("main").unwrap();
        window.set_shadow(true)?;
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
