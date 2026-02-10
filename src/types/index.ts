export interface Track {
  id: string
  path: string
  title: string
  artist: string
  album: string
  duration: number
  trackNumber?: number
  year?: number
  genre?: string
}

export interface Playlist {
  id: string
  name: string
  tracks: Track[]
  createdAt: number
  updatedAt: number
}

export type ThemeType = 'light' | 'dark' | 'neon' | 'ocean' | 'sunset'

export type RepeatMode = 'off' | 'all' | 'one'

export type ViewType = 'library' | 'playlists' | 'settings'

export interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  position: number
  duration: number
  repeatMode: RepeatMode
  shuffle: boolean
}
