import { useEffect, useState } from 'react'
import { getAllPodcasts } from '../data/catalog'
import { storage } from '../services/storage'
import { PodcastRow } from '../components/PodcastRow'
import { Icon } from '../components/Icon'

export function Subscriptions({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
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
                    <div className="subs-toolbar">
                        <div className="subs-count-badge">
                            <span>{subscribed.length} show{subscribed.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="view-toggle">
                            <button 
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                                onClick={() => setViewMode('list')}
                                title="List view"
                            >
                                <Icon name="list" size={20} />
                            </button>
                            <button 
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                                onClick={() => setViewMode('grid')}
                                title="Grid view"
                            >
                                <Icon name="grid" size={20} />
                            </button>
                        </div>
                    </div>
                    <div className={`podcast-list ${viewMode === 'grid' ? 'grid-view' : ''}`}>
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
                .subs-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .subs-count-badge {
                    display: inline-flex;
                    align-items: center;
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
                .view-toggle {
                    display: flex;
                    background: var(--border-soft);
                    padding: 4px;
                    border-radius: 8px;
                    gap: 4px;
                }
                .view-btn {
                    background: transparent;
                    border: none;
                    padding: 6px;
                    cursor: pointer;
                    color: var(--muted);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .view-btn.active {
                    background: var(--bg-strong);
                    color: var(--text-strong);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .podcast-list.grid-view {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 16px;
                }
                .podcast-list.grid-view .podcast-row {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 12px;
                    background: var(--bg-strong);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                }
                .podcast-list.grid-view .podcast-row img {
                    width: 120px;
                    height: 120px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                }
            `}</style>
        </div>
    )
}
