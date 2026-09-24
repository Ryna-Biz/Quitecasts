import { useState } from 'react'
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
    const [liked, setLiked] = useState(false)

    if (!episode) {
        return (
            <div className="page empty-state">
                <p className="eyebrow">Player</p>
                <h1>Nothing playing.</h1>
                <p style={{ color: 'var(--muted)', marginBottom: '28px' }}>
                    Choose an episode to start listening. Your queue, history, and subscriptions are waiting.
                </p>
                <button className="primary-button" onClick={() => onNavigate('/')}>
                    Browse episodes
                </button>
            </div>
        )
    }

    const podcast = getPodcast(episode.podcastId)
    const progress = duration ? (currentTime / duration) * 100 : 0

    return (
        <div className="page full-player">
            <button className="back-link" onClick={() => onNavigate('/')}>
                <Icon name="back" size={17} /> Back to library
            </button>

            {/* Album Art */}
            <div className="full-player-art">
                <div className="player-art-wrap">
                    <Artwork src={podcast?.artwork ?? ''} alt={`${podcast?.title} artwork`} size="large" />
                    {playing && (
                        <div className="player-art-pulse" />
                    )}
                </div>
            </div>

            {/* Episode Info */}
            <div className="full-player-copy">
                <p className="eyebrow">{podcast?.title}</p>
                <h1>{episode.title}</h1>
                <p>{podcast?.author}</p>
            </div>

            {/* Progress Bar */}
            <div className="full-player-progress">
                <ProgressBar value={currentTime} max={duration || episode.duration} onChange={seek} />
                <div>
                    <span>{time(currentTime)}</span>
                    <span>{time(duration || episode.duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="full-player-controls">
                <button
                    className="round-control"
                    onClick={() => skip(-15)}
                    aria-label="Skip back 15 seconds"
                    title="Back 15s"
                >
                    <Icon name="back" size={23} />
                    <small>15</small>
                </button>

                <PlayButton
                    playing={playing}
                    onClick={togglePlayback}
                    label={playing ? 'Pause episode' : 'Play episode'}
                />

                <button
                    className="round-control"
                    onClick={() => skip(30)}
                    aria-label="Skip forward 30 seconds"
                    title="Forward 30s"
                >
                    <Icon name="forward" size={23} />
                    <small>30</small>
                </button>
            </div>

            {/* Extra Controls Row */}
            <div className="player-extra-row">
                <button
                    className={`player-like-btn${liked ? ' liked' : ''}`}
                    onClick={() => setLiked(!liked)}
                    aria-label={liked ? 'Unlike episode' : 'Like episode'}
                    title={liked ? 'Unlike' : 'Like'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                <div className="player-speed-pills">
                    {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                            key={rate}
                            className={`speed-pill${playbackRate === rate ? ' active' : ''}`}
                            onClick={() => setPlaybackRate(rate)}
                        >
                            {rate}×
                        </button>
                    ))}
                </div>

                <div className="player-volume-row">
                    <Icon name="volume" size={17} />
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        aria-label="Volume"
                        style={{ accentColor: 'var(--accent)', width: '90px' }}
                    />
                </div>
            </div>

            {/* Waveform Progress Visual */}
            <div className="player-waveform-bar">
                <div className="player-waveform-fill" style={{ width: `${progress}%` }} />
            </div>

            <style>{`
                .full-player-art { margin-bottom: 32px; }
                .player-art-wrap {
                    position: relative;
                    display: inline-block;
                }
                .player-art-pulse {
                    position: absolute;
                    inset: -12px;
                    border-radius: 28px;
                    border: 2px solid var(--accent);
                    opacity: 0.4;
                    animation: artPulse 2s ease-in-out infinite;
                }
                @keyframes artPulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.03); opacity: 0.15; }
                }
                .player-extra-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    border-top: 1px solid var(--border);
                    flex-wrap: wrap;
                    gap: 14px;
                }
                .player-like-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1.5px solid var(--border);
                    background: var(--surface);
                    color: var(--muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .player-like-btn:hover, .player-like-btn.liked {
                    color: #FF4D6D;
                    border-color: #FF4D6D;
                    background: #FFF0F3;
                }
                :root[data-theme='dark'] .player-like-btn.liked {
                    background: rgba(255,77,109,0.15);
                }
                .player-speed-pills {
                    display: flex;
                    gap: 6px;
                }
                .speed-pill {
                    padding: 6px 12px;
                    border-radius: 999px;
                    border: 1.5px solid var(--border);
                    background: var(--surface);
                    color: var(--muted);
                    font-size: 12px;
                    font-weight: 700;
                    transition: all 0.18s ease;
                }
                .speed-pill:hover { border-color: var(--accent); color: var(--accent); }
                .speed-pill.active {
                    background: var(--accent);
                    border-color: var(--accent);
                    color: white;
                    box-shadow: 0 4px 12px rgba(94, 44, 232, 0.35);
                }
                .player-volume-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--muted);
                }
                .player-waveform-bar {
                    margin-top: 28px;
                    height: 3px;
                    border-radius: 999px;
                    background: var(--border);
                    overflow: hidden;
                }
                .player-waveform-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent) 0%, #A78BFA 100%);
                    border-radius: 999px;
                    transition: width 0.3s ease;
                }
            `}</style>
        </div>
    )
}
