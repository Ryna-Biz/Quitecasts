import type { Episode } from '../types/podcast'
import { getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { Artwork } from './Artwork'
import { Icon } from './Icon'
import { PlayButton } from './PlayButton'

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
}

export function EpisodeRow({ episode, compact = false }: { episode: Episode; compact?: boolean }) {
    const { episode: current, playing, progress, playEpisode, addToQueue, downloads, markDownloaded } = usePlayer()
    const podcast = getPodcast(episode.podcastId)
    const isCurrent = current?.id === episode.id
    const saved = progress[episode.id]
    const percent = saved && episode.duration ? Math.round((saved.position / episode.duration) * 100) : 0

    return <article className={`episode-row${compact ? ' episode-row-compact' : ''}`}>
        {compact && podcast ? <Artwork src={podcast.artwork} alt="" size="small" /> : null}
        <div className="episode-copy">
            <p className="eyebrow">{podcast?.title}</p>
            <h3>{episode.title}</h3>
            {!compact ? <p className="episode-description">{episode.description}</p> : null}
            <p className="episode-meta">{new Date(episode.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {formatDuration(episode.duration)}</p>
            {percent > 0 ? <div className="episode-progress"><span style={{ width: `${percent}%` }} /></div> : null}
        </div>
        <div className="episode-actions">
            <PlayButton playing={isCurrent && playing} onClick={() => playEpisode(episode)} label={`${isCurrent && playing ? 'Pause' : 'Play'} ${episode.title}`} small />
            {!compact ? <button className="icon-button" onClick={() => addToQueue(episode.id)} aria-label={`Add ${episode.title} to queue`} title="Add to queue"><Icon name="queue" size={18} /></button> : null}
            {!compact ? <button className={`icon-button${downloads.includes(episode.id) ? ' is-active' : ''}`} onClick={() => markDownloaded(episode.id)} aria-label={`${downloads.includes(episode.id) ? 'Remove' : 'Mark'} ${episode.title} ${downloads.includes(episode.id) ? 'download' : 'as downloaded'}`} title="Download"><Icon name={downloads.includes(episode.id) ? 'check' : 'download'} size={18} /></button> : null}
        </div>
    </article>
}
