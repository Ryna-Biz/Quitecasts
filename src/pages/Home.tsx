import { useEffect, useState } from 'react'
import { getAllEpisodes } from '../data/catalog'
import { storage } from '../services/storage'
import { fetchTopPodcasts, searchOnlinePodcasts } from '../services/onlinePodcasts'
import type { Podcast } from '../types/podcast'
import { EpisodeRow } from '../components/EpisodeRow'
import { PodcastRow } from '../components/PodcastRow'
import { useAuth } from '../context/AuthContext'

export function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
    const { user } = useAuth()
    const episodes = getAllEpisodes()
    const [topPodcasts, setTopPodcasts] = useState<Podcast[]>([])
    const [topLoading, setTopLoading] = useState(true)
    const [topError, setTopError] = useState(false)
    const [openingPodcastId, setOpeningPodcastId] = useState<string | null>(null)
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const subscribedEpisodes = episodes
        .filter((episode) => subscriptionIds.includes(episode.podcastId))
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    const firstName = user?.displayName?.split(' ')[0] || null

    useEffect(() => {
        const refresh = () => setSubscriptionIds(storage.getSubscriptions())
        window.addEventListener('storage', refresh)
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('quietcasts:subscriptions-changed', refresh)
        }
    }, [])

    const openTopPodcast = async (podcast: Podcast) => {
        setOpeningPodcastId(podcast.id)
        try {
            const [result] = await searchOnlinePodcasts(podcast.title)
            if (!result) throw new Error('Podcast not found')
            sessionStorage.setItem('quietcasts:online-preview', JSON.stringify(result))
            onNavigate(`/preview/${result.id}`)
        } catch {
            setTopError(true)
        } finally {
            setOpeningPodcastId(null)
        }
    }

    useEffect(() => {
        let active = true
        void fetchTopPodcasts().then((results) => {
            if (active) setTopPodcasts(results)
        }).catch(() => {
            if (active) setTopError(true)
        }).finally(() => {
            if (active) setTopLoading(false)
        })
        return () => { active = false }
    }, [])

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
                />
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
                <SectionHeading title="Top Podcasts Right Now" />
                {topLoading ? (
                    <div className="home-loading-grid">
                        {[1,2,3,4,5].map((i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : topError ? (
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
                {openingPodcastId && <p className="quiet-message" style={{ marginTop: '12px' }}>Opening podcast preview...</p>}
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

function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
    return (
        <div className="section-heading">
            <h2>{title}</h2>
            {action && <button className="text-button" onClick={onAction}>{action}</button>}
        </div>
    )
}
