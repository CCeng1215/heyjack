use rodio::{Decoder, OutputStream, OutputStreamHandle, Sink, Source};
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::time::Duration;

pub struct AudioPlayer {
    _stream: Option<OutputStream>,
    _stream_handle: Option<OutputStreamHandle>,
    sink: Option<Sink>,
    current_duration: f64,
    current_path: Option<String>,
}

impl AudioPlayer {
    pub fn new() -> Self {
        let (stream, stream_handle) = OutputStream::try_default().ok().unzip();
        
        Self {
            _stream: stream,
            _stream_handle: stream_handle,
            sink: None,
            current_duration: 0.0,
            current_path: None,
        }
    }

    pub fn play(&mut self, path: &str) -> Result<(), Box<dyn std::error::Error>> {
        self.stop();

        let file_path = Path::new(path);
        if !file_path.exists() {
            return Err(format!("File not found: {}", path).into());
        }

        let file = File::open(file_path)?;
        let reader = BufReader::new(file);
        let source = Decoder::new(reader)?;
        
        // Get duration before consuming the source
        self.current_duration = source.total_duration()
            .map(|d| d.as_secs_f64())
            .unwrap_or(0.0);

        if let Some(ref handle) = self._stream_handle {
            let sink = Sink::try_new(handle)?;
            sink.append(source);
            self.sink = Some(sink);
            self.current_path = Some(path.to_string());
        }

        Ok(())
    }

    pub fn pause(&self) {
        if let Some(ref sink) = self.sink {
            sink.pause();
        }
    }

    pub fn resume(&self) {
        if let Some(ref sink) = self.sink {
            sink.play();
        }
    }

    pub fn stop(&mut self) {
        if let Some(sink) = self.sink.take() {
            sink.stop();
        }
        self.current_duration = 0.0;
        self.current_path = None;
    }

    pub fn set_volume(&self, volume: f32) {
        if let Some(ref sink) = self.sink {
            sink.set_volume(volume.clamp(0.0, 1.0));
        }
    }

    pub fn seek(&mut self, position: f64) -> Result<(), Box<dyn std::error::Error>> {
        if let Some(path) = self.current_path.clone() {
            let was_paused = self.sink.as_ref().map(|s| s.is_paused()).unwrap_or(false);
            let volume = self.sink.as_ref().map(|s| s.volume()).unwrap_or(1.0);
            
            self.stop();
            
            let file = File::open(&path)?;
            let reader = BufReader::new(file);
            let source = Decoder::new(reader)?;
            
            self.current_duration = source.total_duration()
                .map(|d| d.as_secs_f64())
                .unwrap_or(0.0);
            
            let skipped = source.skip_duration(Duration::from_secs_f64(position));
            
            if let Some(ref handle) = self._stream_handle {
                let sink = Sink::try_new(handle)?;
                sink.set_volume(volume);
                sink.append(skipped);
                if was_paused {
                    sink.pause();
                }
                self.sink = Some(sink);
                self.current_path = Some(path);
            }
        }
        Ok(())
    }

    pub fn get_position(&self) -> f64 {
        // Note: rodio doesn't provide easy position tracking
        // In a real app, you'd track this with a timer
        0.0
    }

    pub fn get_duration(&self) -> f64 {
        self.current_duration
    }

    pub fn is_playing(&self) -> bool {
        self.sink.as_ref().map(|s| !s.is_paused() && !s.empty()).unwrap_or(false)
    }
}

impl Default for AudioPlayer {
    fn default() -> Self {
        Self::new()
    }
}
