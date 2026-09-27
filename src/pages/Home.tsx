import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getAllEpisodes, getAllPodcasts } from '../data/catalog'
import { fetchTopPodcasts, getCachedTopPodcasts, searchOnlinePodcasts } from '../services/onlinePodcasts'
import { refreshSubscriptions } from '../services/subscriptionRefresh'
import type { Podcast } from '../types/podcast'
import { EpisodeRow } from '../components/EpisodeRow'
import { PodcastRow } from '../components/PodcastRow'
import { Icon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'

export function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
    const { user } = useAuth()
    const { subscriptions } = usePlayer()
    const episodes = getAllEpisodes()
    const [topPodcasts, setTopPodcasts] = useState<Podcast[]>(() => getCachedTopPodcasts() ?? [])
    const [topLoading, setTopLoading] = useState(true)
    const [topError, setTopError] = useState(false)
    const [previewError, setPreviewError] = useState(false)
    const [openingPodcastId, setOpeningPodcastId] = useState<string | null>(null)
    const [refreshingEpisodes, setRefreshingEpisodes] = useState(false)
    const [episodeRefreshProgress, setEpisodeRefreshProgress] = useState<{ done: number; total: number } | null>(null)
    const [episodeRefreshSummary, setEpisodeRefreshSummary] = useState<string | null>(null)
    const subscribedPodcasts = useMemo(
        () => getAllPodcasts().filter((podcast) => subscriptions.includes(podcast.id)),
        [subscriptions],
    )
    const feedableCount = subscribedPodcasts.filter((podcast) => podcast.feedUrl).length
    const subscribedEpisodes = episodes
        .filter((episode) => subscriptions.includes(episode.podcastId))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    const firstName = user?.displayName?.split(' ')[0] || null

    useEffect(() => {
        const refresh = () => {
            // PlayerContext already handles this via its own event listener
        }
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => window.removeEventListener('quietcasts:subscriptions-changed', refresh)
    }, [])

    const openTopPodcast = async (podcast: Podcast) => {
        setOpeningPodcastId(podcast.id)
        setPreviewError(false)
        try {
            const [result] = await searchOnlinePodcasts(podcast.title)
            if (!result) throw new Error('Podcast not found')
            sessionStorage.setItem('quietcasts:online-preview', JSON.stringify(result))
            onNavigate(`/preview/${result.id}`)
        } catch {
            setPreviewError(true)
        } finally {
            setOpeningPodcastId(null)
        }
    }

    const loadTopPodcasts = useCallback(async (force = false) => {
        setTopLoading(true)
        setTopError(false)
        try {
            const results = await fetchTopPodcasts(undefined, { force })
            if (results.length === 0) {
                setTopError(true)
            } else {
                setTopPodcasts(results)
            }
        } catch {
            setTopError(true)
        } finally {
            setTopLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadTopPodcasts()
    }, [loadTopPodcasts])

    const refreshNewEpisodes = async () => {
        if (refreshingEpisodes) return
        setRefreshingEpisodes(true)
        setEpisodeRefreshSummary(null)
        try {
            const results = await refreshSubscriptions(subscribedPodcasts, (done, total) => setEpisodeRefreshProgress({ done, total }))
            const newEpisodes = results.reduce((sum, result) => sum + result.newEpisodes, 0)
            const failed = results.filter((result) => result.status === 'failed').length
            const skipped = results.filter((result) => result.status === 'skipped').length
            const summary = [newEpisodes > 0 ? `${newEpisodes} new episode${newEpisodes !== 1 ? 's' : ''}` : 'No new episodes']
            if (failed > 0) summary.push(`${failed} feed${failed !== 1 ? 's' : ''} failed`)
            if (skipped > 0) summary.push(`${skipped} show${skipped !== 1 ? 's' : ''} without an RSS feed`)
            setEpisodeRefreshSummary(summary.join(' · '))
        } catch {
            setEpisodeRefreshSummary('Episodes could not be refreshed.')
        } finally {
            setRefreshingEpisodes(false)
            setEpisodeRefreshProgress(null)
        }
    }

    const episodeRefreshTitle = feedableCount === 0
        ? 'Add a show from Search to refresh its episodes — the built-in library has no RSS feeds.'
        : refreshingEpisodes
            ? 'Refreshing…'
            : 'Check your shows for new episodes'

    return (
        <div className="page home-page">
            {/* Welcome Hero */}
            <div className="home-hero">
                <div className="home-hero-text">
                    <p className="eyebrow">🎧 Your Listening Space</p>
                    <h1>
                        {firstName ? `Welcome back, ${firstName}.` : 'Good to have you back.'}
                    </h1>
                    <p className="intro-copy">
                        A quiet place for the shows you care about — zero ads, pure sound.
                    </p>
                </div>
                <div className="home-hero-actions">
                    <button className="primary-button" onClick={() => onNavigate('/search')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        Discover Podcasts
                    </button>
                    <button className="secondary-button" onClick={() => onNavigate('/subscriptions')}>
                        My Subscriptions
                    </button>
                </div>
            </div>

            {/* New Episodes from subscriptions */}
            <section className="content-section">
                <SectionHeading
                    title="New Episodes"
                    action={subscribedEpisodes.length > 4 ? 'See all' : undefined}
                    onAction={() => onNavigate('/subscriptions')}
                >
                    {subscribedPodcasts.length > 0 && (
                        <button
                            className="icon-button"
                            onClick={() => void refreshNewEpisodes()}
                            disabled={refreshingEpisodes || feedableCount === 0}
                            aria-label="Refresh episodes"
                            title={episodeRefreshTitle}
                        >
                            <span className={refreshingEpisodes ? 'refresh-button-icon' : undefined}>
                                <Icon name="refresh" size={18} />
                            </span>
                        </button>
                    )}
                </SectionHeading>
                {episodeRefreshProgress && (
                    <p className="quiet-message" style={{ marginBottom: '12px' }}>
                        Checking feeds · {episodeRefreshProgress.done} of {episodeRefreshProgress.total}
                    </p>
                )}
                {!episodeRefreshProgress && episodeRefreshSummary && (
                    <p className="quiet-message" style={{ marginBottom: '12px' }}>{episodeRefreshSummary}</p>
                )}
                {subscribedEpisodes.length > 0 ? (
                    <div className="episode-list">
                        {subscribedEpisodes.slice(0, 4).map((episode) => (
                            <EpisodeRow key={episode.id} episode={episode} />
                        ))}
                    </div>
                ) : (
                    <div className="home-empty-card">
                        <div className="home-empty-icon">🎙️</div>
                        <p className="home-empty-title">Nothing here yet</p>
                        <p className="home-empty-sub">Subscribe to a podcast to see new episodes appear here.</p>
                        <button className="primary-button" style={{ marginTop: '16px' }} onClick={() => onNavigate('/search')}>
                            Find something to listen to
                        </button>
                    </div>
                )}
            </section>

            {/* Top Podcasts */}
            <section className="content-section">
                <SectionHeading title="Top Podcasts Right Now">
                    <button
                        className="icon-button"
                        onClick={() => void loadTopPodcasts(true)}
                        disabled={topLoading}
                        aria-label="Refresh top podcasts"
                        title={topLoading ? 'Refreshing…' : 'Refresh top podcasts'}
                    >
                        <span className={topLoading ? 'refresh-button-icon' : undefined}>
                            <Icon name="refresh" size={18} />
                        </span>
                    </button>
                </SectionHeading>
                {topLoading && topPodcasts.length === 0 ? (
                    <div className="home-loading-grid">
                        {[1,2,3,4,5].map((i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : topError && topPodcasts.length === 0 ? (
                    <p className="quiet-message">Top podcasts are unavailable right now.</p>
                ) : (
                    <div className="podcast-list">
                        {topPodcasts.map((podcast) => (
                            <PodcastRow
                                key={podcast.id}
                                podcast={podcast}
                                onOpen={() => void openTopPodcast(podcast)}
                            />
                        ))}
                    </div>
                )}
                {topError && topPodcasts.length > 0 && (
                    <p className="quiet-message" style={{ marginTop: '12px' }}>
                        Couldn't update the chart — showing the last results loaded.
                    </p>
                )}
                {openingPodcastId && <p className="quiet-message" style={{ marginTop: '12px' }}>Opening podcast preview...</p>}
                {previewError && <p className="quiet-message" style={{ marginTop: '12px' }}>That podcast could not be opened right now.</p>}
            </section>

            <style>{`
                .home-hero {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 32px;
                    padding: 40px 40px 44px;
                    border-radius: 24px;
                    background: linear-gradient(135deg, var(--accent-soft) 0%, color-mix(in srgb, var(--accent-soft) 40%, var(--surface)) 100%);
                    border: 1.5px solid var(--border);
                    box-shadow: var(--shadow-md);
                    flex-wrap: wrap;
                }
                .home-hero-text { flex: 1; min-width: 260px; }
                .home-hero-text h1 { margin-bottom: 12px; }
                .home-hero-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .home-empty-card {
                    padding: 48px 32px;
                    border: 1.5px dashed var(--border);
                    border-radius: 18px;
                    text-align: center;
                    background: var(--surface);
                }
                .home-empty-icon { font-size: 40px; margin-bottom: 12px; }
                .home-empty-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 700;
                    font-size: 18px;
                    color: var(--text-strong);
                    margin-bottom: 6px;
                }
                .home-empty-sub { color: var(--muted); font-size: 14px; margin-bottom: 0; }
                .home-loading-grid { display: flex; flex-direction: column; gap: 1px; border-top: 1px solid var(--border); }
                .skeleton-row {
                    height: 64px;
                    border-bottom: 1px solid var(--border);
                    background: linear-gradient(90deg, var(--surface) 25%, var(--surface-muted) 50%, var(--surface) 75%);
                    background-size: 400% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
            `}</style>
        </div>
    )
}

function SectionHeading({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children?: ReactNode }) {
    return (
        <div className="section-heading">
            <h2>{title}</h2>
            {(action || children) && (
                <div className="section-heading-actions">
                    {action && <button className="text-button" onClick={onAction}>{action}</button>}
                    {children}
                </div>
            )}
        </div>
    )
}
