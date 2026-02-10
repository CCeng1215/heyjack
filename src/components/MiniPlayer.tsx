import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Maximize2,
  X,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatTime } from '../utils/format'

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    setIsPlaying,
    nextTrack,
    prevTrack,
    setMiniMode,
  } = useStore()

  const handlePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying)
    }
  }

  const progress = duration > 0 ? (position / duration) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="w-80 h-28 rounded-2xl shadow-2xl overflow-hidden transition-theme"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Progress bar at top */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: 'var(--border)' }}
      >
        <motion.div
          className="h-full"
          style={{ 
            backgroundColor: 'var(--accent)',
            width: `${progress}%`,
          }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Window controls */}
      <div className="flex justify-end gap-1 px-2 pt-1">
        <motion.button
          onClick={() => setMiniMode(false)}
          className="p-1 rounded hover:bg-opacity-20"
          style={{ color: 'var(--text-secondary)' }}
          whileHover={{ scale: 1.1, backgroundColor: 'var(--hover)' }}
          whileTap={{ scale: 0.9 }}
          title="Expand"
        >
          <Maximize2 className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Main content */}
      <div className="px-4 pb-3 flex items-center gap-3">
        {/* Album art / icon */}
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: 'var(--hover)' }}
        >
          {currentTrack ? (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Music className="w-7 h-7" style={{ color: 'var(--accent)' }} />
            </motion.div>
          ) : (
            <Music className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />
          )}
        </motion.div>

        {/* Track info & controls */}
        <div className="flex-1 min-w-0">
          {/* Track info */}
          <div className="mb-2">
            <AnimatePresence mode="wait">
              {currentTrack ? (
                <motion.div
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
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
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  No track playing
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Previous */}
            <motion.button
              onClick={prevTrack}
              className="p-1.5 rounded-full"
              style={{ color: 'var(--text-primary)' }}
              whileHover={{ backgroundColor: 'var(--hover)' }}
              whileTap={{ scale: 0.9 }}
              disabled={!currentTrack}
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>

            {/* Play/Pause */}
            <motion.button
              onClick={handlePlayPause}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </motion.button>

            {/* Next */}
            <motion.button
              onClick={nextTrack}
              className="p-1.5 rounded-full"
              style={{ color: 'var(--text-primary)' }}
              whileHover={{ backgroundColor: 'var(--hover)' }}
              whileTap={{ scale: 0.9 }}
              disabled={!currentTrack}
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>

            {/* Time */}
            <span
              className="text-xs tabular-nums ml-auto"
              style={{ color: 'var(--text-secondary)' }}
            >
              {formatTime(position)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
