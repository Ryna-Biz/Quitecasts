import { useEffect, useState } from 'react'
import { saveImportedCatalog } from '../data/catalog'
import { storage } from '../services/storage'
import { importPodcast, type OnlinePodcastResult } from '../services/onlinePodcasts'
import type { Episode, Podcast } from '../types/podcast'
import { Artwork } from '../components/Artwork'
import { Icon } from '../components/Icon'
import { PlayButton } from '../components/PlayButton'
import { usePlayer } from '../context/PlayerContext'

function formatDuration(seconds: number) {
    if (!seconds) return 'Duration unavailable'
    return `${Math.floor(seconds / 60)} min`
}

export function OnlinePodcastPage({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [result] = useState<OnlinePodcastResult | null>(() => readPreview())
    const [podcast, setPodcast] = useState<Podcast | null>(null)
    const [episodes, setEpisodes] = useState<Episode[]>([])
    const [loading, setLoading] = useState(Boolean(result))
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(() => new Set())
    const { episode: currentEpisode, playing, playEpisode, toggleSubscription } = usePlayer()

    useEffect(() => {
        if (!result) return
        let active = true
        void importPodcast(result).then((imported) => {
            if (!active) return
            setPodcast(imported.podcast)
            setEpisodes(imported.episodes)
        }).catch(() => {
            if (!active) return
            setPodcast({ id: result.id, title: result.title, author: result.author, description: 'Podcast details are available. The publisher did not allow this browser to read its episode feed.', artwork: result.artwork, category: result.category, feedUrl: result.feedUrl })
            setEpisodes([])
            setError('Episodes could not be loaded because this publisher blocks browser RSS access.')
        }).finally(() => {
            if (active) setLoading(false)
        })
        return () => {
            active = false
        }
    }, [result])

    const subscribe = () => {
        if (!podcast) return
        setSaving(true)
        saveImportedCatalog(podcast, episodes)
        void toggleSubscription(podcast.id)
        sessionStorage.removeItem('quietcasts:online-preview')
        onNavigate(`/podcast/${podcast.id}`)
    }

    const playPreviewEpisode = (episode: Episode) => {
        if (!podcast) return
        saveImportedCatalog(podcast, episodes)
        playEpisode(episode)
    }

    if (!result) return <div className="page empty-state"><h1>Preview expired.</h1><p>Search for the podcast again to preview it.</p><button className="primary-button" onClick={() => onNavigate('/search')}>Back to search</button></div>
    if (loading) return <div className="page empty-state"><p className="eyebrow">Podcast preview</p><h1>Loading podcast...</h1><p className="quiet-message">Fetching the latest episodes from its RSS feed.</p></div>
    if (!podcast) return <div className="page empty-state"><button className="back-link" onClick={() => onNavigate('/search')}><Icon name="back" size={17} /> Back to search</button><h1>Preview unavailable.</h1><p>{error || 'This podcast could not be loaded.'}</p></div>

    return <div className="page podcast-page preview-page"><button className="back-link" onClick={() => onNavigate('/search')}><Icon name="back" size={17} /> Back to search</button><header className="podcast-header"><Artwork src={podcast.artwork} alt={`${podcast.title} artwork`} size="large" /><div className="podcast-header-copy"><p className="eyebrow">Podcast preview · {podcast.category}</p><h1>{podcast.title}</h1><p className="podcast-author">{podcast.author}</p><p className="podcast-description expanded">{podcast.description || 'No description provided by the publisher.'}</p>{error ? <p className="preview-warning" role="status">{error}</p> : null}<div className="podcast-actions"><button className="primary-button" disabled={saving} onClick={subscribe}>{saving ? 'Subscribing...' : 'Subscribe and add'}</button></div></div></header><section className="content-section"><div className="section-heading"><h2>Latest episodes</h2><span className="muted-count">{episodes.length}</span></div>{episodes.length === 0 ? <p className="quiet-message">No episodes are available to preview from this publisher.</p> : <div className="preview-episode-list">{episodes.slice(0, 12).map((episode) => { const expanded = expandedEpisodes.has(episode.id); const isCurrent = currentEpisode?.id === episode.id; return <article className="preview-episode" key={episode.id}><div><h3>{episode.title}</h3><p className={expanded ? 'preview-episode-description expanded' : 'preview-episode-description'}>{episode.description || 'No episode description.'}</p>{episode.description ? <button className="preview-description-toggle" onClick={() => setExpandedEpisodes((current) => { const next = new Set(current); if (next.has(episode.id)) next.delete(episode.id); else next.add(episode.id); return next })}>{expanded ? 'Hide description' : 'Read more'}</button> : null}</div><div className="preview-episode-actions"><span>{new Date(episode.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {formatDuration(episode.duration)}</span><PlayButton playing={isCurrent && playing} onClick={() => playPreviewEpisode(episode)} label={`${isCurrent && playing ? 'Pause' : 'Play'} ${episode.title}`} small /></div></article> })}</div>}</section></div>
}

function readPreview(): OnlinePodcastResult | null {
    try {
        const value = sessionStorage.getItem('quietcasts:online-preview')
        return value ? JSON.parse(value) as OnlinePodcastResult : null
    } catch {
        return null
    }
}
