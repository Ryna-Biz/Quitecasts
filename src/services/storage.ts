import type { PlayerSnapshot, Podcast, Episode, SavedProgress } from '../types/podcast'

const keys = {
    subscriptions: 'quietcasts:subscriptions',
    progress: 'quietcasts:progress',
    player: 'quietcasts:player',
    history: 'quietcasts:history',
    queue: 'quietcasts:queue',
    downloads: 'quietcasts:downloads',
    importedPodcasts: 'quietcasts:imported-podcasts',
    importedEpisodes: 'quietcasts:imported-episodes',
    viewMode: 'quietcasts:view-mode',
    subscriptionSort: 'quietcasts:subscription-sort',
} as const

export type ViewMode = 'list' | 'grid'
export type SubscriptionSort = 'recent' | 'lastPlayed' | 'title' | 'author' | 'category'

const subscriptionSorts: readonly SubscriptionSort[] = ['recent', 'lastPlayed', 'title', 'author', 'category']

function read<T>(key: string, fallback: T): T {
    try {
        const value = localStorage.getItem(key)
        return value ? (JSON.parse(value) as T) : fallback
    } catch {
        return fallback
    }
}

function write<T>(key: string, value: T) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // Storage can be unavailable in private browsing or restricted contexts.
    }
}

export const storage = {
    getSubscriptions: () => read<string[]>(keys.subscriptions, []),
    setSubscriptions: (value: string[]) => {
        write(keys.subscriptions, value)
        window.dispatchEvent(new Event('quietcasts:subscriptions-changed'))
    },
    getProgress: () => read<Record<string, SavedProgress>>(keys.progress, {}),
    setProgress: (value: Record<string, SavedProgress>) => write(keys.progress, value),
    getPlayer: () => read<PlayerSnapshot>(keys.player, { episodeId: null, position: 0, playbackRate: 1 }),
    setPlayer: (value: PlayerSnapshot) => write(keys.player, value),
    getHistory: () => read<string[]>(keys.history, []),
    setHistory: (value: string[]) => write(keys.history, value),
    getQueue: () => read<string[]>(keys.queue, []),
    setQueue: (value: string[]) => write(keys.queue, value),
    getDownloads: () => read<string[]>(keys.downloads, []),
    setDownloads: (value: string[]) => write(keys.downloads, value),
    getImportedPodcasts: () => read<Podcast[]>(keys.importedPodcasts, []),
    setImportedPodcasts: (value: Podcast[]) => write(keys.importedPodcasts, value),
    getImportedEpisodes: () => read<Episode[]>(keys.importedEpisodes, []),
    setImportedEpisodes: (value: Episode[]) => write(keys.importedEpisodes, value),
    getViewMode: (): ViewMode => (read<ViewMode>(keys.viewMode, 'list') === 'grid' ? 'grid' : 'list'),
    setViewMode: (value: ViewMode) => write(keys.viewMode, value),
    getSubscriptionSort: (): SubscriptionSort => {
        const saved = read<SubscriptionSort>(keys.subscriptionSort, 'recent')
        return subscriptionSorts.includes(saved) ? saved : 'recent'
    },
    setSubscriptionSort: (value: SubscriptionSort) => write(keys.subscriptionSort, value),
}
