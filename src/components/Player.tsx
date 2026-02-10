import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Music,
  Minimize2,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import { formatTime } from '../utils/format'
import type { RepeatMode } from '../types'

export function Player() {
  const {
    currentTrack,
    isPlaying,
    volume,
    position,
    duration,
    repeatMode,
    shuffle,
    setIsPlaying,
    setVolume,
    setRepeatMode,
    toggleShuffle,
    nextTrack,
    prevTrack,
    setMiniMode,
  } = useStore()

  const { seek } = useAudioPlayer()

  const handlePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    seek(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8)
  }

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return Repeat1
    return Repeat
  }

  const RepeatIcon = getRepeatIcon()

  return (
    <div
      className="h-24 border-t flex items-center px-4 gap-4 transition-theme"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Track Info */}
      <div className="flex items-center gap-3 w-64 min-w-0">
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: 'var(--hover)' }}
        >
          {currentTrack ? (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Music className="w-6 h-6" style={{ color: 'var(--accent)' }} />
            </motion.div>
          ) : (
            <Music className="w-6 h-6" style={{ color: 'var(--text-secondary)' }} />
          )}
        </div>
        
        {currentTrack ? (
          <div className="min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentTrack.title}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentTrack.artist}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No track playing
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Shuffle */}
          <motion.button
            onClick={toggleShuffle}
            className="btn-icon"
            style={{ color: shuffle ? 'var(--accent)' : 'var(--text-secondary)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Shuffle className="w-4 h-4" />
          </motion.button>

          {/* Previous */}
          <motion.button
            onClick={prevTrack}
            className="btn-icon"
            style={{ color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.9 }}
            disabled={!currentTrack}
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.button>

          {/* Next */}
          <motion.button
            onClick={nextTrack}
            className="btn-icon"
            style={{ color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.9 }}
            disabled={!currentTrack}
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>

          {/* Repeat */}
          <motion.button
            onClick={cycleRepeatMode}
            className="btn-icon"
            style={{ color: repeatMode !== 'off' ? 'var(--accent)' : 'var(--text-secondary)' }}
            whileTap={{ scale: 0.9 }}
          >
            <RepeatIcon className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span
            className="text-xs tabular-nums w-10 text-right"
            style={{ color: 'var(--text-secondary)' }}
          >
            {formatTime(position)}
          </span>
          
          <div className="flex-1 relative group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={position}
              onChange={handleSeek}
              className="w-full h-1 cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--accent) ${
                  (position / (duration || 1)) * 100
                }%, var(--border) ${(position / (duration || 1)) * 100}%)`,
              }}
            />
          </div>

          <span
            className="text-xs tabular-nums w-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume & Mini Mode */}
      <div className="flex items-center gap-2 w-44">
        <motion.button
          onClick={toggleMute}
          className="btn-icon"
          style={{ color: 'var(--text-secondary)' }}
          whileTap={{ scale: 0.9 }}
        >
          {volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </motion.button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) ${
              volume * 100
            }%, var(--border) ${volume * 100}%)`,
          }}
        />

        {/* Mini Mode Button */}
        <motion.button
          onClick={() => setMiniMode(true)}
          className="btn-icon ml-1"
          style={{ color: 'var(--text-secondary)' }}
          whileHover={{ color: 'var(--accent)' }}
          whileTap={{ scale: 0.9 }}
          title="Mini Player (Ctrl+M)"
        >
          <Minimize2 className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
