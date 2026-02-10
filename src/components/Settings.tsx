import { motion } from 'framer-motion'
import { Check, Palette, Info, Github, Heart } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { ThemeType } from '../types'

interface ThemeOption {
  id: ThemeType
  name: string
  colors: {
    bg: string
    accent: string
    text: string
  }
}

const themes: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    colors: { bg: '#fafafa', accent: '#3b82f6', text: '#1a1a1a' },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: { bg: '#0f0f0f', accent: '#60a5fa', text: '#f5f5f5' },
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: { bg: '#0a0a0f', accent: '#00ffaa', text: '#e0e0ff' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: { bg: '#0c1929', accent: '#29b6f6', text: '#e3f2fd' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: { bg: '#1a1215', accent: '#ff6b35', text: '#fef3e2' },
  },
]

export function Settings() {
  const { theme, setTheme, tracks, playlists } = useStore()

  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>

      {/* Theme Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Appearance
          </h2>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Choose your preferred theme for the player interface.
        </p>

        <div className="grid grid-cols-5 gap-4">
          {themes.map((t) => {
            const isSelected = theme === t.id

            return (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="relative flex flex-col items-center p-4 rounded-xl border-2 transition-all"
                style={{
                  backgroundColor: t.colors.bg,
                  borderColor: isSelected ? t.colors.accent : 'transparent',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Color preview */}
                <div className="flex gap-1 mb-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: t.colors.bg, border: '1px solid rgba(128,128,128,0.3)' }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: t.colors.accent }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: t.colors.text }}
                  />
                </div>

                {/* Theme name */}
                <span
                  className="text-sm font-medium"
                  style={{ color: t.colors.text }}
                >
                  {t.name}
                </span>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: t.colors.accent }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Library Statistics
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {tracks.length}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Tracks
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {playlists.length}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Playlists
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {new Set(tracks.map((t) => t.artist)).size}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Artists
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            About HeyJack
          </h2>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            HeyJack is a minimalist music player designed for simplicity and elegance.
            Built with modern technologies for a smooth, native experience on macOS and Windows.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Version 1.0.0
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { key: 'Space', action: 'Play / Pause' },
              { key: '←', action: 'Previous track' },
              { key: '→', action: 'Next track' },
              { key: '↑', action: 'Volume up' },
              { key: '↓', action: 'Volume down' },
              { key: 'M', action: 'Mute / Unmute' },
              { key: 'Ctrl+M', action: 'Toggle Mini Player' },
              { key: 'Esc', action: 'Exit Mini Player' },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center gap-2">
                <kbd
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--hover)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {shortcut.key}
                </kbd>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {shortcut.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
