import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Search, X, Music, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TrackList } from './TrackList'
import type { Track } from '../types'

// Mock function for file dialog - in Tauri this would use the dialog API
async function openFolderDialog(): Promise<string | null> {
  // In Tauri, we'd use:
  // const { open } = await import('@tauri-apps/api/dialog')
  // return open({ directory: true, multiple: false }) as Promise<string | null>
  
  // For web demo, we'll use a prompt
  return prompt('Enter folder path:')
}

// Mock function for scanning - in Tauri this would call the Rust backend
async function scanFolder(path: string): Promise<Track[]> {
  // In Tauri, we'd use:
  // const { invoke } = await import('@tauri-apps/api/tauri')
  // return invoke('scan_music_folder', { path })
  
  // For demo, return mock data
  return generateMockTracks()
}

function generateMockTracks(): Track[] {
  const artists = ['The Midnight', 'ODESZA', 'Tycho', 'Bonobo', 'Four Tet']
  const albums = ['Days of Thunder', 'A Moment Apart', 'Dive', 'Migration', 'New Energy']
  
  return Array.from({ length: 20 }, (_, i) => {
    const artistIndex = i % artists.length
    return {
      id: `track-${i}`,
      path: `/music/track-${i}.mp3`,
      title: `Track ${i + 1} - ${['Sunset', 'Horizon', 'Dreams', 'Echoes', 'Waves'][i % 5]}`,
      artist: artists[artistIndex],
      album: albums[artistIndex],
      duration: 180 + Math.random() * 180,
      trackNumber: (i % 12) + 1,
      year: 2020 + (i % 4),
      genre: 'Electronic',
    }
  })
}

export function Library() {
  const { tracks, setTracks, searchQuery, setSearchQuery } = useStore()
  const [isScanning, setIsScanning] = useState(false)

  const handleAddFolder = async () => {
    const path = await openFolderDialog()
    if (!path) return

    setIsScanning(true)
    try {
      const newTracks = await scanFolder(path)
      setTracks([...tracks, ...newTracks])
    } catch (error) {
      console.error('Failed to scan folder:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleLoadDemo = async () => {
    setIsScanning(true)
    try {
      const demoTracks = generateMockTracks()
      setTracks(demoTracks)
    } finally {
      setIsScanning(false)
    }
  }

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return tracks

    const query = searchQuery.toLowerCase()
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query)
    )
  }, [tracks, searchQuery])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Library
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg w-64"
            style={{ backgroundColor: 'var(--hover)' }}
          >
            <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            )}
          </div>

          {/* Add Folder Button */}
          <motion.button
            onClick={handleAddFolder}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              opacity: isScanning ? 0.7 : 1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isScanning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FolderOpen className="w-4 h-4" />
            )}
            <span>{isScanning ? 'Scanning...' : 'Add Folder'}</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <Music className="w-10 h-10" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Your library is empty
            </h2>
            <p
              className="text-center mb-6 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Add a folder containing your music files to get started. We support MP3, FLAC, WAV, OGG, M4A, and AAC formats.
            </p>
            <div className="flex gap-3">
              <motion.button
                onClick={handleAddFolder}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Add Music Folder</span>
              </motion.button>
              <motion.button
                onClick={handleLoadDemo}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                whileHover={{ backgroundColor: 'var(--hover)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Load Demo Tracks</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <TrackList tracks={filteredTracks} />
        )}
      </div>

      {/* Status bar */}
      {tracks.length > 0 && (
        <div
          className="px-4 py-2 text-xs border-t"
          style={{
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  )
}
