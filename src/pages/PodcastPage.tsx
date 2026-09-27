import { useState } from 'react'
import { getEpisodesForPodcast, getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { Artwork } from '../components/Artwork'
import { EpisodeRow } from '../components/EpisodeRow'
import { Icon } from '../components/Icon'
import { SubscribeButton } from '../components/SubscribeButton'

export function PodcastPage({ id, onNavigate }: { id: string; onNavigate: (path: string) => void }) {
    const podcast = getPodcast(id)
    const episodes = getEpisodesForPodcast(id)
    const { playEpisode } = usePlayer()
    const [expanded, setExpanded] = useState(false)
    if (!podcast) return <div className="page empty-state"><h1>Podcast not found.</h1><button className="primary-button" onClick={() => onNavigate('/')}>Back home</button></div>
    return <div className="page podcast-page"><button className="back-link" onClick={() => onNavigate('/')}><Icon name="back" size={17} /> Back</button><header className="podcast-header"><Artwork src={podcast.artwork} alt={`${podcast.title} artwork`} size="large" /><div className="podcast-header-copy"><p className="eyebrow">{podcast.category}</p><h1>{podcast.title}</h1><p className="podcast-author">{podcast.author}</p><p className={`podcast-description${expanded ? ' expanded' : ''}`}>{podcast.description}</p><button className="text-button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Read more'}</button><div className="podcast-actions"><SubscribeButton podcastId={podcast.id} podcast={podcast} episodes={episodes} onNavigate={onNavigate} /><button className="secondary-button" onClick={() => episodes[0] && playEpisode(episodes[0])}>Play latest</button></div></div></header><section className="content-section"><div className="section-heading"><h2>Episodes</h2><span className="muted-count">{episodes.length}</span></div><div className="episode-list">{episodes.map((episode) => <EpisodeRow key={episode.id} episode={episode} />)}</div></section></div>
}
