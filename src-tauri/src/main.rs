#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod audio;
mod library;

use audio::AudioPlayer;
use library::{scan_directory, Track};
use parking_lot::Mutex;
use std::sync::Arc;
use tauri::State;

pub struct AppState {
    player: Arc<Mutex<AudioPlayer>>,
}

#[tauri::command]
fn play_track(path: String, state: State<AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.play(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn pause(state: State<AppState>) {
    let player = state.player.lock();
    player.pause();
}

#[tauri::command]
fn resume(state: State<AppState>) {
    let player = state.player.lock();
    player.resume();
}

#[tauri::command]
fn stop(state: State<AppState>) {
    let mut player = state.player.lock();
    player.stop();
}

#[tauri::command]
fn set_volume(volume: f32, state: State<AppState>) {
    let player = state.player.lock();
    player.set_volume(volume);
}

#[tauri::command]
fn seek(position: f64, state: State<AppState>) -> Result<(), String> {
    let mut player = state.player.lock();
    player.seek(position).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_position(state: State<AppState>) -> f64 {
    let player = state.player.lock();
    player.get_position()
}

#[tauri::command]
fn get_duration(state: State<AppState>) -> f64 {
    let player = state.player.lock();
    player.get_duration()
}

#[tauri::command]
fn is_playing(state: State<AppState>) -> bool {
    let player = state.player.lock();
    player.is_playing()
}

#[tauri::command]
fn scan_music_folder(path: String) -> Result<Vec<Track>, String> {
    scan_directory(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_default_music_dir() -> Option<String> {
    dirs::audio_dir().map(|p| p.to_string_lossy().to_string())
}

fn main() {
    let app_state = AppState {
        player: Arc::new(Mutex::new(AudioPlayer::new())),
    };

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            play_track,
            pause,
            resume,
            stop,
            set_volume,
            seek,
            get_position,
            get_duration,
            is_playing,
            scan_music_folder,
            get_default_music_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
