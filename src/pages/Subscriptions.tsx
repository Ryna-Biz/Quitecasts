import { useEffect, useMemo, useState } from 'react'
import { getAllEpisodes, getAllPodcasts } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { storage, type SubscriptionSort, type ViewMode } from '../services/storage'
import { PodcastRow } from '../components/PodcastRow'
import { PodcastCard } from '../components/PodcastCard'
import { Icon } from '../components/Icon'

const sortOptions: { value: SubscriptionSort; label: string }[] = [
    { value: 'recent', label: 'Recently added' },
    { value: 'lastPlayed', label: 'Recently played' },
    { value: 'title', label: 'Title A–Z' },
    { value: 'author', label: 'Author A–Z' },
    { value: 'category', label: 'Category' },
]

const collator = new Intl.Collator(undefined, { sensitivity: 'base' })

export function Subscriptions({ onNavigate }: { onNavigate: (path: string) => void }) {
    const { history, progress } = usePlayer()
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const [viewMode, setViewMode] = useState<ViewMode>(storage.getViewMode)
    const [sortBy, setSortBy] = useState<SubscriptionSort>(storage.getSubscriptionSort)
    const [sortOpen, setSortOpen] = useState(false)

    useEffect(() => {
        const refresh = () => setSubscriptionIds(storage.getSubscriptions())
        window.addEventListener('storage', refresh)
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('quietcasts:subscriptions-changed', refresh)
        }
    }, [])

    useEffect(() => {
        storage.setViewMode(viewMode)
    }, [viewMode])

    useEffect(() => {
        storage.setSubscriptionSort(sortBy)
    }, [sortBy])

    useEffect(() => {
        if (!sortOpen) return
        const close = (event: PointerEvent) => {
            if (!(event.target as HTMLElement | null)?.closest('.sort-menu-wrapper')) setSortOpen(false)
        }
        window.addEventListener('pointerdown', close)
        return () => window.removeEventListener('pointerdown', close)
    }, [sortOpen])

    // Most recent playback timestamp per podcast, derived from listening history.
    const lastPlayedAt = useMemo(() => {
        const episodes = getAllEpisodes()
        const stamps = new Map<string, number>()
        history.forEach((episodeId, index) => {
            const episode = episodes.find((item) => item.id === episodeId)
            if (!episode) return
            const stamp = progress[episodeId]?.updatedAt ?? history.length - index
            const current = stamps.get(episode.podcastId)
            if (current === undefined || stamp > current) stamps.set(episode.podcastId, stamp)
        })
        return stamps
    }, [history, progress])

    const sorted = useMemo(() => {
        const list = getAllPodcasts().filter((podcast) => subscriptionIds.includes(podcast.id))
        switch (sortBy) {
            case 'title':
                return list.sort((a, b) => collator.compare(a.title, b.title))
            case 'author':
                return list.sort((a, b) => collator.compare(a.author, b.author) || collator.compare(a.title, b.title))
            case 'category':
                return list.sort((a, b) => collator.compare(a.category, b.category) || collator.compare(a.title, b.title))
            case 'lastPlayed':
                return list.sort((a, b) => (lastPlayedAt.get(b.id) ?? 0) - (lastPlayedAt.get(a.id) ?? 0) || collator.compare(a.title, b.title))
            default:
                // Subscriptions are appended in order, so the tail of the list is the newest.
                return list.sort((a, b) => subscriptionIds.indexOf(b.id) - subscriptionIds.indexOf(a.id))
        }
    }, [subscriptionIds, sortBy, lastPlayedAt])

    const activeSortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? sortOptions[0].label

    return (
        <div className="page">
            <div className="page-heading">
                <p className="eyebrow">Your Library</p>
                <h1>Subscriptions</h1>
                <p className="intro-copy">Shows you've chosen to keep close.</p>
            </div>

            {sorted.length === 0 ? (
                <div className="subs-empty">
                    <div className="subs-empty-icon">📻</div>
                    <h2>Nothing subscribed yet</h2>
                    <p>Find shows you love and subscribe to keep them in your library.</p>
                    <button className="primary-button" onClick={() => onNavigate('/search')}>
                        Search podcasts
                    </button>
                </div>
            ) : (
                <>
                    <div className="subs-toolbar">
                        <div className="subs-count-badge">
                            <span>{sorted.length} show{sorted.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="subs-controls">
                            <div className="sort-menu-wrapper">
                                <button
                                    className="sort-trigger"
                                    onClick={() => setSortOpen((open) => !open)}
                                    aria-haspopup="listbox"
                                    aria-expanded={sortOpen}
                                    title="Change sort order"
                                >
                                    <Icon name="sort" size={17} />
                                    <span>{activeSortLabel}</span>
                                    <Icon name="chevron" size={14} />
                                </button>
                                {sortOpen && (
                                    <div className="sort-menu" role="listbox" aria-label="Sort subscriptions by">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                role="option"
                                                aria-selected={option.value === sortBy}
                                                className={`sort-menu-item ${option.value === sortBy ? 'active' : ''}`}
                                                onClick={() => {
                                                    setSortBy(option.value)
                                                    setSortOpen(false)
                                                }}
                                            >
                                                <span>{option.label}</span>
                                                {option.value === sortBy && <Icon name="check" size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="view-toggle" role="group" aria-label="View mode">
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                    aria-pressed={viewMode === 'list'}
                                    aria-label="List view"
                                    title="List view"
                                >
                                    <Icon name="list" size={20} />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    aria-pressed={viewMode === 'grid'}
                                    aria-label="Grid view"
                                    title="Grid view"
                                >
                                    <Icon name="grid" size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="podcast-grid">
                            {sorted.map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} onOpen={() => onNavigate(`/podcast/${podcast.id}`)} />
                            ))}
                        </div>
                    ) : (
                        <div className="podcast-list">
                            {sorted.map((podcast) => (
                                <PodcastRow key={podcast.id} podcast={podcast} onOpen={() => onNavigate(`/podcast/${podcast.id}`)} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
