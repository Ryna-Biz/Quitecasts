import { getAllEpisodes, getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { EpisodeRow } from '../components/EpisodeRow'
import { Artwork } from '../components/Artwork'
import { Icon } from '../components/Icon'

export function Activity() {
    const { history, downloads, queue, removeFromQueue } = usePlayer()
    const episodes = getAllEpisodes()
    const historyEpisodes = history.map((id) => episodes.find((episode) => episode.id === id)).filter((episode): episode is typeof episodes[number] => Boolean(episode))
    const queueEpisodes = queue.map((id) => episodes.find((episode) => episode.id === id)).filter((episode): episode is typeof episodes[number] => Boolean(episode))
    return <div className="page"><div className="page-heading"><p className="eyebrow">Your listening</p><h1>Activity</h1></div><section className="content-section"><div className="section-heading"><h2>History</h2></div>{historyEpisodes.length ? <div className="episode-list">{historyEpisodes.map((episode) => <EpisodeRow key={episode.id} episode={episode} compact />)}</div> : <p className="quiet-message">Nothing played yet.</p>}</section><section className="content-section"><div className="section-heading"><h2>Queue</h2></div>{queueEpisodes.length ? <div className="queue-list">{queueEpisodes.map((episode) => <div className="queue-item" key={episode.id}><Artwork src={getPodcast(episode.podcastId)?.artwork ?? ''} alt="" size="small" /><span><strong>{episode.title}</strong><small>{getPodcast(episode.podcastId)?.title}</small></span><button className="icon-button" onClick={() => removeFromQueue(episode.id)} aria-label={`Remove ${episode.title} from queue`}><Icon name="close" size={17} /></button></div>)}</div> : <p className="quiet-message">Your queue is empty.</p>}</section><section className="content-section"><div className="section-heading"><h2>Downloads</h2></div><p className="quiet-message">{downloads.length ? `${downloads.length} episode${downloads.length === 1 ? '' : 's'} marked for download.` : 'Episodes marked for download will appear here.'}</p><p className="fine-print">Audio downloads are not stored offline in this first version. They remain available as a local list while the app is online.</p></section></div>
}
