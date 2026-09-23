import { getPodcast } from '../data/catalog'
import { usePlayer } from '../context/PlayerContext'
import { Artwork } from '../components/Artwork'
import { Icon } from '../components/Icon'
import { PlayButton } from '../components/PlayButton'
import { ProgressBar } from '../components/ProgressBar'

function time(seconds: number) {
    if (!seconds || !Number.isFinite(seconds)) return '0:00'
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

export function PlayerPage({ onNavigate }: { onNavigate: (path: string) => void }) {
    const { episode, playing, currentTime, duration, playbackRate, volume, togglePlayback, seek, skip, setPlaybackRate, setVolume } = usePlayer()
    if (!episode) return <div className="page empty-state"><p className="eyebrow">Player</p><h1>Nothing is playing.</h1><p>Choose an episode to begin listening.</p><button className="primary-button" onClick={() => onNavigate('/')}>Browse episodes</button></div>
    const podcast = getPodcast(episode.podcastId)
    return <div className="page full-player"><button className="back-link" onClick={() => onNavigate('/')}><Icon name="back" size={17} /> Back</button><div className="full-player-art"><Artwork src={podcast?.artwork ?? ''} alt={`${podcast?.title} artwork`} size="large" /></div><div className="full-player-copy"><p className="eyebrow">{podcast?.title}</p><h1>{episode.title}</h1><p>{podcast?.author}</p></div><div className="full-player-progress"><ProgressBar value={currentTime} max={duration || episode.duration} onChange={seek} /><div><span>{time(currentTime)}</span><span>{time(duration || episode.duration)}</span></div></div><div className="full-player-controls"><button className="round-control" onClick={() => skip(-15)} aria-label="Skip back 15 seconds"><Icon name="back" size={23} /><small>15</small></button><PlayButton playing={playing} onClick={togglePlayback} label={playing ? 'Pause episode' : 'Play episode'} /><button className="round-control" onClick={() => skip(30)} aria-label="Skip forward 30 seconds"><Icon name="forward" size={23} /><small>30</small></button></div><div className="player-options"><label><Icon name="volume" size={18} /><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Volume" /></label><label>Speed <select value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}><option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select></label></div></div>
}
