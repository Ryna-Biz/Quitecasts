import { useState, useEffect } from 'react'
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
    const { episode: current, playing, progress, playEpisode, addToQueue, downloads, downloadProgress, startDownload, cancelDownload, markDownloaded } = usePlayer()
    const [localDownloaded, setLocalDownloaded] = useState(false)
    const podcast = getPodcast(episode.podcastId)
    const isCurrent = current?.id === episode.id
    const saved = progress[episode.id]
    const percent = saved && episode.duration ? Math.round((saved.position / episode.duration) * 100) : 0
    const isDownloading = downloadProgress?.episodeId === episode.id && downloadProgress.status === 'downloading'
    const downloadError = downloadProgress?.episodeId === episode.id && downloadProgress.status === 'failed'
    const isDownloaded = localDownloaded || downloads.includes(episode.id)

    useEffect(() => {
        setLocalDownloaded(downloads.includes(episode.id))
    }, [downloads, episode.id])

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
            <PlayButton playing={isCurrent && playing} onClick={() => void playEpisode(episode)} label={`${isCurrent && playing ? 'Pause' : 'Play'} ${episode.title}`} small />
            {!compact ? <button className="icon-button" onClick={() => addToQueue(episode.id)} aria-label={`Add ${episode.title} to queue`} title="Add to queue"><Icon name="queue" size={18} /></button> : null}
            {!compact ? (
                <button
                    className={`icon-button${isDownloaded ? ' is-active' : ''}${isDownloading ? ' is-loading' : ''}${downloadError ? ' is-error' : ''}`}
                    onClick={() => {
                        if (isDownloading) {
                            cancelDownload(episode.id)
                        } else if (isDownloaded) {
                            void markDownloaded(episode.id)
                        } else {
                            void startDownload(episode)
                        }
                    }}
                    aria-label={isDownloading ? `Downloading ${episode.title}` : `${isDownloaded ? 'Remove' : 'Download'} ${episode.title}`}
                    title={isDownloading ? 'Downloading...' : `${isDownloaded ? 'Remove' : 'Download'} ${episode.title}`}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px' }}>
                            <svg style={{ animation: 'spin 1s linear infinite', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36" />
                            </svg>
                        </div>
                    ) : (
                        <Icon name={isDownloaded ? 'check' : 'download'} size={18} />
                    )}
                </button>
            ) : null}
        </div>
    </article>
}
