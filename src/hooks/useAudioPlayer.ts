import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'

// For Tauri integration
declare global {
  interface Window {
    __TAURI__?: {
      invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>
    }
  }
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  const {
    currentTrack,
    isPlaying,
    volume,
    position,
    repeatMode,
    setIsPlaying,
    setPosition,
    setDuration,
    nextTrack,
  } = useStore()

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'metadata'
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // For web preview, we'll use a blob URL or file protocol
    // In Tauri, we'd use the asset protocol
    const src = currentTrack.path.startsWith('http')
      ? currentTrack.path
      : `file://${currentTrack.path}`

    audio.src = src
    audio.load()

    if (isPlaying) {
      audio.play().catch(console.error)
    }
  }, [currentTrack])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, setIsPlaying])

  // Handle volume
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = volume
    }
  }, [volume])

  // Position update loop
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updatePosition = () => {
      if (audio && !audio.paused) {
        setPosition(audio.currentTime)
        animationRef.current = requestAnimationFrame(updatePosition)
      }
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePosition)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, setPosition])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e)
      setIsPlaying(false)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [repeatMode, nextTrack, setDuration, setIsPlaying])

  // Seek function
  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setPosition(time)
    }
  }, [setPosition])

  return {
    audioRef,
    seek,
    currentTime: position,
  }
}
