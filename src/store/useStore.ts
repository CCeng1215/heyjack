import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Track, Playlist, ThemeType, RepeatMode, ViewType } from '../types'

interface AppState {
  // Theme
  theme: ThemeType
  setTheme: (theme: ThemeType) => void

  // View
  currentView: ViewType
  setCurrentView: (view: ViewType) => void

  // Mini Mode
  miniMode: boolean
  setMiniMode: (mini: boolean) => void
  toggleMiniMode: () => void

  // Library
  tracks: Track[]
  setTracks: (tracks: Track[]) => void
  addTracks: (tracks: Track[]) => void

  // Playlists
  playlists: Playlist[]
  createPlaylist: (name: string) => void
  deletePlaylist: (id: string) => void
  addToPlaylist: (playlistId: string, tracks: Track[]) => void
  removeFromPlaylist: (playlistId: string, trackId: string) => void
  renamePlaylist: (id: string, name: string) => void

  // Player
  currentTrack: Track | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  volume: number
  position: number
  duration: number
  repeatMode: RepeatMode
  shuffle: boolean

  // Player actions
  setCurrentTrack: (track: Track | null) => void
  setQueue: (tracks: Track[], startIndex?: number) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setPosition: (position: number) => void
  setDuration: (duration: number) => void
  setRepeatMode: (mode: RepeatMode) => void
  toggleShuffle: () => void
  nextTrack: () => void
  prevTrack: () => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // View
      currentView: 'library',
      setCurrentView: (view) => set({ currentView: view }),

      // Mini Mode
      miniMode: false,
      setMiniMode: (mini) => set({ miniMode: mini }),
      toggleMiniMode: () => set((state) => ({ miniMode: !state.miniMode })),

      // Library
      tracks: [],
      setTracks: (tracks) => set({ tracks }),
      addTracks: (newTracks) =>
        set((state) => {
          const existingIds = new Set(state.tracks.map((t) => t.id))
          const uniqueTracks = newTracks.filter((t) => !existingIds.has(t.id))
          return { tracks: [...state.tracks, ...uniqueTracks] }
        }),

      // Playlists
      playlists: [],
      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: generateId(),
              name,
              tracks: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),
      deletePlaylist: (id) =>
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        })),
      addToPlaylist: (playlistId, tracks) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: [...p.tracks, ...tracks.filter((t) => !p.tracks.find((pt) => pt.id === t.id))],
                  updatedAt: Date.now(),
                }
              : p
          ),
        })),
      removeFromPlaylist: (playlistId, trackId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.filter((t) => t.id !== trackId),
                  updatedAt: Date.now(),
                }
              : p
          ),
        })),
      renamePlaylist: (id, name) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === id ? { ...p, name, updatedAt: Date.now() } : p
          ),
        })),

      // Player
      currentTrack: null,
      queue: [],
      queueIndex: 0,
      isPlaying: false,
      volume: 0.8,
      position: 0,
      duration: 0,
      repeatMode: 'off',
      shuffle: false,

      setCurrentTrack: (track) => set({ currentTrack: track, position: 0 }),
      setQueue: (tracks, startIndex = 0) =>
        set({ queue: tracks, queueIndex: startIndex }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),
      setPosition: (position) => set({ position }),
      setDuration: (duration) => set({ duration }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

      nextTrack: () => {
        const { queue, queueIndex, repeatMode, shuffle } = get()
        if (queue.length === 0) return

        let nextIndex: number

        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length)
        } else if (queueIndex < queue.length - 1) {
          nextIndex = queueIndex + 1
        } else if (repeatMode === 'all') {
          nextIndex = 0
        } else {
          return
        }

        set({
          queueIndex: nextIndex,
          currentTrack: queue[nextIndex],
          position: 0,
        })
      },

      prevTrack: () => {
        const { queue, queueIndex, position } = get()
        if (queue.length === 0) return

        // If more than 3 seconds in, restart current track
        if (position > 3) {
          set({ position: 0 })
          return
        }

        const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1
        set({
          queueIndex: prevIndex,
          currentTrack: queue[prevIndex],
          position: 0,
        })
      },

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'heyjack-storage',
      partialize: (state) => ({
        theme: state.theme,
        tracks: state.tracks,
        playlists: state.playlists,
        volume: state.volume,
      }),
    }
  )
)
