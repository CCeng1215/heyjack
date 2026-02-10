import { motion } from 'framer-motion'
import {
  Library,
  ListMusic,
  Settings,
  Plus,
  Music,
  Trash2,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import type { ViewType } from '../types'

const navItems: { id: ViewType; icon: typeof Library; label: string }[] = [
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'playlists', icon: ListMusic, label: 'Playlists' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { 
    currentView, 
    setCurrentView, 
    playlists, 
    createPlaylist,
    deletePlaylist 
  } = useStore()

  const handleCreatePlaylist = () => {
    const name = prompt('Enter playlist name:')
    if (name?.trim()) {
      createPlaylist(name.trim())
    }
  }

  const handleDeletePlaylist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this playlist?')) {
      deletePlaylist(id)
    }
  }

  return (
    <div className="w-56 h-full flex flex-col border-r transition-theme"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border)' 
      }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Music className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
          HeyJack
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'var(--hover)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              }}
              whileHover={{ backgroundColor: 'var(--hover)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </motion.button>
          )
        })}

        {/* Playlists Section */}
        <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-3 mb-2">
            <span 
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--text-secondary)' }}
            >
              Playlists
            </span>
            <motion.button
              onClick={handleCreatePlaylist}
              className="p-1 rounded"
              style={{ color: 'var(--text-secondary)' }}
              whileHover={{ color: 'var(--accent)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-0.5">
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                whileHover={{ backgroundColor: 'var(--hover)' }}
              >
                <div className="flex items-center gap-2 truncate">
                  <ListMusic className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{playlist.name}</span>
                </div>
                <motion.button
                  onClick={(e) => handleDeletePlaylist(playlist.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded"
                  whileHover={{ color: '#ef4444' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}

            {playlists.length === 0 && (
              <p 
                className="text-xs px-3 py-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                No playlists yet
              </p>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
