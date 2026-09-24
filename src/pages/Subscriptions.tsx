import { useEffect, useState } from 'react'
import { getAllPodcasts } from '../data/catalog'
import { storage } from '../services/storage'
import { PodcastRow } from '../components/PodcastRow'

export function Subscriptions({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const podcasts = getAllPodcasts()

    useEffect(() => {
        const refresh = () => setSubscriptionIds(storage.getSubscriptions())
        window.addEventListener('storage', refresh)
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('quietcasts:subscriptions-changed', refresh)
        }
    }, [])

    const subscribed = podcasts.filter((podcast) => subscriptionIds.includes(podcast.id))

    return (
        <div className="page">
            <div className="page-heading">
                <p className="eyebrow">Your Library</p>
                <h1>Subscriptions</h1>
                <p className="intro-copy">Shows you've chosen to keep close.</p>
            </div>

            {subscribed.length === 0 ? (
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
                    <div className="subs-count-badge">
                        <span>{subscribed.length} show{subscribed.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="podcast-list">
                        {subscribed.map((podcast) => (
                            <PodcastRow
                                key={podcast.id}
                                podcast={podcast}
                                onOpen={() => onNavigate(`/podcast/${podcast.id}`)}
                            />
                        ))}
                    </div>
                </>
            )}

            <style>{`
                .subs-empty {
                    padding: 60px 0;
                    text-align: center;
                    max-width: 460px;
                    margin: 0 auto;
                }
                .subs-empty-icon { font-size: 52px; margin-bottom: 20px; }
                .subs-empty h2 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-strong);
                    margin-bottom: 10px;
                }
                .subs-empty p {
                    color: var(--muted);
                    font-size: 15px;
                    margin-bottom: 28px;
                }
                .subs-count-badge {
                    display: inline-flex;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 5px 14px;
                    border-radius: 999px;
                    background: var(--accent-soft);
                    border: 1px solid var(--border);
                }
                .subs-count-badge span {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--accent);
                }
            `}</style>
        </div>
    )
}
