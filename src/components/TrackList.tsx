import { motion } from 'framer-motion'
import { Play, Pause, Music, MoreHorizontal } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatTime } from '../utils/format'
import type { Track } from '../types'

interface TrackListProps {
  tracks: Track[]
  showAlbum?: boolean
}

export function TrackList({ tracks, showAlbum = true }: TrackListProps) {
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setQueue,
    setIsPlaying,
  } = useStore()

  const handleTrackClick = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setQueue(tracks, index)
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handleDoubleClick = (track: Track, index: number) => {
    setQueue(tracks, index)
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Music className="w-16 h-16 mb-4" style={{ color: 'var(--text-secondary)' }} />
        <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
          No tracks found
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Add music to your library to get started
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="grid gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider border-b sticky top-0 z-10"
        style={{
          gridTemplateColumns: showAlbum ? '40px 2fr 1fr 1fr 80px' : '40px 2fr 1fr 80px',
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>#</span>
        <span>Title</span>
        {showAlbum && <span>Album</span>}
        <span>Artist</span>
        <span className="text-right">Duration</span>
      </div>

      {/* Track rows */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id
          const isPlayingTrack = isCurrentTrack && isPlaying

          return (
            <motion.div
              key={track.id}
              className="group grid gap-4 px-4 py-2.5 items-center cursor-pointer transition-colors"
              style={{
                gridTemplateColumns: showAlbum ? '40px 2fr 1fr 1fr 80px' : '40px 2fr 1fr 80px',
                backgroundColor: isCurrentTrack ? 'var(--hover)' : 'transparent',
              }}
              onClick={() => handleTrackClick(track, index)}
              onDoubleClick={() => handleDoubleClick(track, index)}
              whileHover={{ backgroundColor: 'var(--hover)' }}
            >
              {/* Index / Play icon */}
              <div className="flex items-center justify-center">
                <span
                  className="group-hover:hidden text-sm tabular-nums"
                  style={{ color: isCurrentTrack ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {isPlayingTrack ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ♪
                    </motion.span>
                  ) : (
                    index + 1
                  )}
                </span>
                <button
                  className="hidden group-hover:flex w-6 h-6 items-center justify-center"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {isPlayingTrack ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Title */}
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: isCurrentTrack ? 'var(--accent)' : 'var(--text-primary)' }}
                >
                  {track.title}
                </p>
              </div>

              {/* Album */}
              {showAlbum && (
                <p
                  className="text-sm truncate"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {track.album}
                </p>
              )}

              {/* Artist */}
              <p
                className="text-sm truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {track.artist}
              </p>

              {/* Duration */}
              <div className="flex items-center justify-end gap-2">
                <span
                  className="text-sm tabular-nums"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {formatTime(track.duration)}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Show context menu
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
