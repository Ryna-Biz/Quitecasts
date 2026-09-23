export interface Podcast {
    id: string
    title: string
    author: string
    description: string
    artwork: string
    category: string
    feedUrl?: string
    pageUrl?: string
}

export interface Episode {
    id: string
    podcastId: string
    title: string
    description: string
    audioUrl: string
    publishedAt: string
    duration: number
}

export interface SavedProgress {
    episodeId: string
    position: number
    completed: boolean
    updatedAt: number
}

export interface PlayerSnapshot {
    episodeId: string | null
    position: number
    playbackRate: number
}
