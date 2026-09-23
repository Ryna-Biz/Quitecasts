import { useEffect, useMemo, useState } from 'react'
import { getAllEpisodes, getAllPodcasts, saveImportedCatalog } from '../data/catalog'
import { EpisodeRow } from '../components/EpisodeRow'
import { PodcastRow } from '../components/PodcastRow'
import { Icon } from '../components/Icon'
import { importPodcast, searchOnlinePodcasts, type OnlinePodcastResult } from '../services/onlinePodcasts'

export function Search({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [query, setQuery] = useState('')
    const [onlineResults, setOnlineResults] = useState<OnlinePodcastResult[]>([])
    const [onlineLoading, setOnlineLoading] = useState(false)
    const [onlineError, setOnlineError] = useState('')
    const [importingId, setImportingId] = useState<string | null>(null)
    const [importedIds, setImportedIds] = useState(() => new Set(getAllPodcasts().filter((podcast) => podcast.id.startsWith('online-')).map((podcast) => podcast.id)))
    const [showAllOnline, setShowAllOnline] = useState(false)
    const [showAllPodcasts, setShowAllPodcasts] = useState(false)
    const [showAllEpisodes, setShowAllEpisodes] = useState(false)
    const normalized = query.trim().toLowerCase()
    const episodes = getAllEpisodes()
    const podcasts = getAllPodcasts()
    const matchedPodcasts = useMemo(() => normalized ? podcasts.filter((podcast) => `${podcast.title} ${podcast.author} ${podcast.category}`.toLowerCase().includes(normalized)) : [], [normalized, podcasts])
    const matchedEpisodes = useMemo(() => normalized ? episodes.filter((episode) => `${episode.title} ${episode.description}`.toLowerCase().includes(normalized)) : [], [normalized, episodes])
    const visibleOnlineResults = showAllOnline ? onlineResults : onlineResults.slice(0, 5)
    const visiblePodcasts = showAllPodcasts ? matchedPodcasts : matchedPodcasts.slice(0, 4)
    const visibleEpisodes = showAllEpisodes ? matchedEpisodes : matchedEpisodes.slice(0, 5)

    useEffect(() => {
        if (normalized.length < 2) {
            setOnlineResults([])
            setOnlineError('')
            return
        }
        let active = true
        const timer = window.setTimeout(() => {
            setOnlineLoading(true)
            setOnlineError('')
            void searchOnlinePodcasts(normalized).then((results) => {
                if (active) setOnlineResults(results)
            }).catch(() => {
                if (active) setOnlineError('Online search is unavailable right now.')
            }).finally(() => {
                if (active) setOnlineLoading(false)
            })
        }, 350)
        return () => {
            active = false
            window.clearTimeout(timer)
        }
    }, [normalized])

    useEffect(() => {
        setShowAllOnline(false)
        setShowAllPodcasts(false)
        setShowAllEpisodes(false)
    }, [normalized])

    const addPodcast = async (result: OnlinePodcastResult) => {
        setImportingId(result.id)
        setOnlineError('')
        try {
            const imported = await importPodcast(result)
            saveImportedCatalog(imported.podcast, imported.episodes)
            setImportedIds((current) => new Set(current).add(result.id))
            onNavigate(`/podcast/${result.id}`)
        } catch {
            setOnlineError('This podcast could not be added. Its RSS feed may block browser access.')
        } finally {
            setImportingId(null)
        }
    }

    const previewPodcast = (result: OnlinePodcastResult) => {
        sessionStorage.setItem('quietcasts:online-preview', JSON.stringify(result))
        onNavigate(`/preview/${result.id}`)
    }

    return <div className="page search-page"><div className="page-heading"><p className="eyebrow">Find something to hear</p><h1>Search</h1></div><label className="search-field"><Icon name="search" size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search podcasts and episodes" aria-label="Search podcasts and episodes" />{query ? <button onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={18} /></button> : null}</label>
        {!normalized ? <p className="quiet-message">Search your library or the wider podcast directory.</p> : <div className="search-results"><section className="content-section online-section"><div className="section-heading"><h2>Search online</h2>{onlineLoading ? <span className="muted-count">Searching...</span> : onlineResults.length > 5 ? <button className="text-button" onClick={() => setShowAllOnline(!showAllOnline)}>{showAllOnline ? 'Show less' : `See all ${onlineResults.length}`}</button> : null}</div>{onlineError ? <p className="search-error">{onlineError}</p> : null}{!onlineLoading && onlineResults.length === 0 && !onlineError ? <p className="quiet-message">No online matches yet.</p> : null}<div className="online-results">{visibleOnlineResults.map((result) => <article className="online-podcast" key={result.id}><button className="online-podcast-info" onClick={() => previewPodcast(result)}><img src={result.artwork} alt="" /><span><strong>{result.title}</strong><small>{result.author} · {result.category}</small><em>Preview podcast</em></span></button><button className="secondary-button" disabled={importingId === result.id || importedIds.has(result.id)} onClick={() => void addPodcast(result)}>{importingId === result.id ? 'Adding...' : importedIds.has(result.id) ? 'Added' : 'Add podcast'}</button></article>)}</div></section>{matchedPodcasts.length > 0 ? <section className="content-section"><div className="section-heading"><h2>In your library</h2>{matchedPodcasts.length > 4 ? <button className="text-button" onClick={() => setShowAllPodcasts(!showAllPodcasts)}>{showAllPodcasts ? 'Show less' : `See all ${matchedPodcasts.length}`}</button> : null}</div><div className="podcast-list">{visiblePodcasts.map((podcast) => <PodcastRow key={podcast.id} podcast={podcast} onOpen={() => onNavigate(`/podcast/${podcast.id}`)} />)}</div></section> : null}{matchedEpisodes.length > 0 ? <section className="content-section"><div className="section-heading"><h2>Episodes</h2>{matchedEpisodes.length > 5 ? <button className="text-button" onClick={() => setShowAllEpisodes(!showAllEpisodes)}>{showAllEpisodes ? 'Show less' : `See all ${matchedEpisodes.length}`}</button> : null}</div><div className="episode-list">{visibleEpisodes.map((episode) => <EpisodeRow key={episode.id} episode={episode} />)}</div></section> : null}</div>}
    </div>
}
