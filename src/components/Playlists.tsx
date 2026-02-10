import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListMusic, Plus, Play, MoreHorizontal, Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { TrackList } from './TrackList'
import type { Playlist } from '../types'

export function Playlists() {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    setCurrentTrack,
    setQueue,
    setIsPlaying,
  } = useStore()

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:')
    if (name?.trim()) {
      createPlaylist(name.trim())
    }
  }

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 0)
      setCurrentTrack(playlist.tracks[0])
      setIsPlaying(true)
    }
  }

  const handleStartEdit = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(playlist.id)
    setEditName(playlist.name)
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renamePlaylist(id, editName.trim())
    }
    setEditingId(null)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this playlist?')) {
      deletePlaylist(id)
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null)
      }
    }
  }

  // Playlist detail view
  if (selectedPlaylist) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="flex items-center gap-2 mb-4 text-sm transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Playlists</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedPlaylist.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {selectedPlaylist.tracks.length} tracks
              </p>
            </div>

            {selectedPlaylist.tracks.length > 0 && (
              <motion.button
                onClick={() => handlePlayPlaylist(selectedPlaylist)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                <span>Play All</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-auto">
          {selectedPlaylist.tracks.length > 0 ? (
            <TrackList tracks={selectedPlaylist.tracks} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <ListMusic
                className="w-16 h-16 mb-4"
                style={{ color: 'var(--text-secondary)' }}
              />
              <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                This playlist is empty
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Add tracks from your library
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Playlists grid view
  return (
    <div className="h-full overflow-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Playlists
        </h1>

        <motion.button
          onClick={handleCreatePlaylist}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </motion.button>
      </div>

      {/* Playlists Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative p-4 rounded-xl cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
                onClick={() => setSelectedPlaylist(playlist)}
                whileHover={{ backgroundColor: 'var(--hover)' }}
              >
                {/* Playlist cover */}
                <div
                  className="aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: 'var(--hover)' }}
                >
                  <ListMusic
                    className="w-12 h-12"
                    style={{ color: 'var(--accent)', opacity: 0.5 }}
                  />

                  {/* Play button overlay */}
                  <motion.button
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayPlaylist(playlist)
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </motion.button>
                </div>

                {/* Playlist info */}
                {editingId === playlist.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveEdit(playlist.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(playlist.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent outline-none text-sm font-medium px-1 -mx-1 rounded"
                    style={{
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--hover)',
                    }}
                    autoFocus
                  />
                ) : (
                  <p
                    className="font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {playlist.name}
                  </p>
                )}

                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {playlist.tracks.length} tracks
                </p>

                {/* Actions menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <motion.button
                      onClick={(e) => handleStartEdit(playlist, e)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      whileHover={{ backgroundColor: 'var(--hover)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    </motion.button>
                    <motion.button
                      onClick={(e) => handleDelete(playlist.id, e)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      whileHover={{ backgroundColor: 'var(--hover)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--hover)' }}
          >
            <ListMusic className="w-10 h-10" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            No playlists yet
          </h2>
          <p
            className="text-center mb-6 max-w-md"
            style={{ color: 'var(--text-secondary)' }}
          >
            Create playlists to organize your music
          </p>
          <motion.button
            onClick={handleCreatePlaylist}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Playlist</span>
          </motion.button>
        </div>
      )}
    </div>
  )
}
