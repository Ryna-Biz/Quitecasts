import { getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { Artwork } from './Artwork'
import { Icon } from './Icon'
import { PlayButton } from './PlayButton'
import { ProgressBar } from './ProgressBar'

export function MiniPlayer({ onOpen }: { onOpen: () => void }) {
    const { episode, playing, currentTime, duration, togglePlayback, seek, skip } = usePlayer()
    if (!episode) return null
    const podcast = getPodcast(episode.podcastId)
    return <aside className="mini-player" aria-label="Current episode player">
        <button className="mini-player-info" onClick={onOpen}><Artwork src={podcast?.artwork ?? ''} alt="" size="small" /><span><strong>{episode.title}</strong><small>{podcast?.title}</small></span></button>
        <div className="mini-progress"><ProgressBar value={currentTime} max={duration || episode.duration} onChange={seek} label="Mini player progress" /></div>
        <div className="mini-controls"><button className="player-skip" onClick={() => skip(-15)} aria-label="Skip back 15 seconds">15</button><PlayButton playing={playing} onClick={togglePlayback} label={playing ? 'Pause' : 'Play'} /><button className="player-skip" onClick={() => skip(30)} aria-label="Skip forward 30 seconds">30</button></div>
    </aside>
}
