import { getAllEpisodes, getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { EpisodeRow } from '../components/EpisodeRow'
import { Artwork } from '../components/Artwork'
import { Icon } from '../components/Icon'

function EmptySlot({ icon, message }: { icon: string; message: string }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '20px 16px', borderRadius: '12px',
            background: 'var(--surface-muted)', border: '1px dashed var(--border)',
            color: 'var(--muted)', fontSize: '14px',
        }}>
            <span style={{ fontSize: '22px' }}>{icon}</span>
            <span>{message}</span>
        </div>
    )
}

export function Activity() {
    const { history, downloads, queue, removeFromQueue, clearHistory } = usePlayer()
    const episodes = getAllEpisodes()
    const historyEpisodes = history
        .map((id) => episodes.find((ep) => ep.id === id))
        .filter((ep): ep is typeof episodes[number] => Boolean(ep))
    const queueEpisodes = queue
        .map((id) => episodes.find((ep) => ep.id === id))
        .filter((ep): ep is typeof episodes[number] => Boolean(ep))
    const downloadedEpisodes = downloads
        .map((id) => episodes.find((ep) => ep.id === id))
        .filter((ep): ep is typeof episodes[number] => Boolean(ep))

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear your listening history?')) {
            await clearHistory()
        }
    }

    return (
        <div className="page">
            <div className="page-heading">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="eyebrow">Your Listening</p>
                        <h1>Activity</h1>
                    </div>
                    {historyEpisodes.length > 0 && (
                        <button 
                            className="text-button" 
                            onClick={handleClearHistory}
                            style={{ fontSize: '13px', color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                        >
                            Clear History
                        </button>
                    )}
                </div>
            </div>


            {/* History */}
            <section className="content-section">
                <div className="section-heading">
                    <h2>History</h2>
                    {historyEpisodes.length > 0 && (
                        <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                            {historyEpisodes.length} episode{historyEpisodes.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                {historyEpisodes.length > 0 ? (
                    <div className="episode-list compact-list">
                        {historyEpisodes.map((ep) => (
                            <EpisodeRow key={ep.id} episode={ep} compact />
                        ))}
                    </div>
                ) : (
                    <EmptySlot icon="🕓" message="Nothing played yet — pick an episode to get started." />
                )}
            </section>

            {/* Queue */}
            <section className="content-section">
                <div className="section-heading">
                    <h2>Up Next</h2>
                    {queueEpisodes.length > 0 && (
                        <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                            {queueEpisodes.length} queued
                        </span>
                    )}
                </div>
                {queueEpisodes.length > 0 ? (
                    <div className="queue-list">
                        {queueEpisodes.map((ep) => (
                            <div className="queue-item" key={ep.id}>
                                <Artwork src={getPodcast(ep.podcastId)?.artwork ?? ''} alt="" size="small" />
                                <span>
                                    <strong>{ep.title}</strong>
                                    <small>{getPodcast(ep.podcastId)?.title}</small>
                                </span>
                                <button
                                    className="icon-button"
                                    onClick={() => removeFromQueue(ep.id)}
                                    aria-label={`Remove ${ep.title} from queue`}
                                    title="Remove from queue"
                                >
                                    <Icon name="close" size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptySlot icon="📋" message="Your queue is empty. Add episodes to listen next." />
                )}
            </section>

            {/* Downloads */}
            <section className="content-section">
                <div className="section-heading">
                    <h2>Downloads</h2>
                    {downloadedEpisodes.length > 0 && (
                        <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                            {downloadedEpisodes.length} saved
                        </span>
                    )}
                </div>
                {downloadedEpisodes.length > 0 ? (
                    <div className="episode-list compact-list">
                        {downloadedEpisodes.map((ep) => (
                            <EpisodeRow key={ep.id} episode={ep} compact />
                        ))}
                    </div>
                ) : (
                    <EmptySlot icon="⬇️" message="Downloaded episodes will appear here for offline listening." />
                )}
            </section>
        </div>
    )
}
