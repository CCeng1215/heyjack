use lofty::{Accessor, AudioFile, Probe};
use serde::{Deserialize, Serialize};
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub path: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration: f64,
    pub track_number: Option<u32>,
    pub year: Option<u32>,
    pub genre: Option<String>,
}

const SUPPORTED_EXTENSIONS: [&str; 6] = ["mp3", "flac", "wav", "ogg", "m4a", "aac"];

pub fn scan_directory(dir_path: &str) -> Result<Vec<Track>, Box<dyn std::error::Error>> {
    let mut tracks = Vec::new();

    for entry in WalkDir::new(dir_path)
        .follow_links(true)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let path = entry.path();
        if path.is_file() {
            if let Some(ext) = path.extension() {
                let ext_lower = ext.to_string_lossy().to_lowercase();
                if SUPPORTED_EXTENSIONS.contains(&ext_lower.as_str()) {
                    if let Some(track) = parse_track(path) {
                        tracks.push(track);
                    }
                }
            }
        }
    }

    // Sort by artist, then album, then track number
    tracks.sort_by(|a, b| {
        a.artist
            .cmp(&b.artist)
            .then(a.album.cmp(&b.album))
            .then(a.track_number.cmp(&b.track_number))
    });

    Ok(tracks)
}

fn parse_track(path: &Path) -> Option<Track> {
    let path_str = path.to_string_lossy().to_string();
    let file_name = path.file_stem()?.to_string_lossy().to_string();

    // Generate a unique ID based on path
    let id = format!("{:x}", md5_hash(&path_str));

    // Try to read metadata
    let tagged_file = Probe::open(path).ok()?.read().ok()?;
    
    let duration = tagged_file.properties().duration().as_secs_f64();
    
    let (title, artist, album, track_number, year, genre) = if let Some(tag) = tagged_file.primary_tag() {
        (
            tag.title().map(|s| s.to_string()).unwrap_or_else(|| file_name.clone()),
            tag.artist().map(|s| s.to_string()).unwrap_or_else(|| "Unknown Artist".to_string()),
            tag.album().map(|s| s.to_string()).unwrap_or_else(|| "Unknown Album".to_string()),
            tag.track(),
            tag.year(),
            tag.genre().map(|s| s.to_string()),
        )
    } else {
        (
            file_name,
            "Unknown Artist".to_string(),
            "Unknown Album".to_string(),
            None,
            None,
            None,
        )
    };

    Some(Track {
        id,
        path: path_str,
        title,
        artist,
        album,
        duration,
        track_number,
        year,
        genre,
    })
}

fn md5_hash(input: &str) -> u64 {
    let mut hash: u64 = 5381;
    for byte in input.bytes() {
        hash = hash.wrapping_mul(33).wrapping_add(byte as u64);
    }
    hash
}
