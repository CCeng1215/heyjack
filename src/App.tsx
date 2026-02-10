import { useEffect, useCallback } from 'react'
import { useStore } from './store/useStore'
import { Sidebar } from './components/Sidebar'
import { Player } from './components/Player'
import { Library } from './components/Library'
import { Playlists } from './components/Playlists'
import { Settings } from './components/Settings'

function App() {
  const {
    theme,
    currentView,
    isPlaying,
    volume,
    setIsPlaying,
    setVolume,
    nextTrack,
    prevTrack,
    currentTrack,
  } = useStore()

  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${theme}`
  }, [theme])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (currentTrack) {
            setIsPlaying(!isPlaying)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          nextTrack()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevTrack()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 0.1))
          break
        case 'm':
        case 'M':
          setVolume(volume > 0 ? 0 : 0.8)
          break
      }
    },
    [isPlaying, volume, currentTrack, setIsPlaying, setVolume, nextTrack, prevTrack]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'library':
        return <Library />
      case 'playlists':
        return <Playlists />
      case 'settings':
        return <Settings />
      default:
        return <Library />
    }
  }

  return (
    <div
      className="h-screen flex flex-col transition-theme"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{renderView()}</main>
      </div>
      <Player />
    </div>
  )
}

export default App
