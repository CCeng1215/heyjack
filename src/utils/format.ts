export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '--:--'
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function groupTracksByAlbum(tracks: import('../types').Track[]): Map<string, import('../types').Track[]> {
  const albumMap = new Map<string, import('../types').Track[]>()
  
  tracks.forEach((track) => {
    const key = `${track.artist}|||${track.album}`
    if (!albumMap.has(key)) {
      albumMap.set(key, [])
    }
    albumMap.get(key)!.push(track)
  })
  
  return albumMap
}
