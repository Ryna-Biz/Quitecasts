import { useEffect, useState } from 'react'
import { getAllPodcasts, saveImportedCatalog } from '../data/catalog'
import { CATEGORIES } from '../data/categories'
import { CategoryArt } from '../components/CategoryArt'
import { Icon } from '../components/Icon'
import { importPodcast, searchOnlinePodcasts, type OnlinePodcastResult } from '../services/onlinePodcasts'

export function Search({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [query, setQuery] = useState('')
    const [onlineResults, setOnlineResults] = useState<OnlinePodcastResult[]>([])
    const [onlineLoading, setOnlineLoading] = useState(false)
    const [onlineError, setOnlineError] = useState('')
    const [importingId, setImportingId] = useState<string | null>(null)
    const [importedIds, setImportedIds] = useState(() => new Set(getAllPodcasts().filter((podcast) => podcast.id.startsWith('online-')).map((podcast) => podcast.id)))
    const normalized = query.trim().toLowerCase()

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

    return (
        <div className="page search-page">
            <div className="page-heading">
                <p className="eyebrow">Find something to hear</p>
                <h1>Search</h1>
            </div>
            <label className="search-field">
                <Icon name="search" size={20} />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search podcasts and episodes" aria-label="Search podcasts and episodes" />
                {query ? <button onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={18} /></button> : null}
            </label>

            <div className="search-categories">
                <p className="quiet-message">Explore by category</p>
                <div className="category-grid">
                    {CATEGORIES.map((category) => (
                        <button key={category} className="category-card" onClick={() => onNavigate(`/category/${encodeURIComponent(category)}`)}>
                            <CategoryArt category={category} className="category-card-art" />
                            <span className="category-card-label">{category}</span>
                        </button>
                    ))}
                </div>
            </div>

            {normalized.length > 0 && (
                <section className="content-section online-section">
                    <div className="section-heading">
                        <h2>Search online</h2>
                        {onlineLoading && <span className="muted-count">Searching...</span>}
                    </div>
                    {onlineError ? <p className="search-error" role="status">{onlineError}</p> : null}
                    {!onlineLoading && !onlineError && onlineResults.length === 0 ? <p className="quiet-message">No online matches yet.</p> : null}
                    {onlineResults.length > 0 && (
                        <div className="online-results">
                            {onlineResults.map((result) => (
                                <article className="online-podcast" key={result.id}>
                                    <button className="online-podcast-info" onClick={() => previewPodcast(result)}>
                                        <img src={result.artwork} alt="" />
                                        <span>
                                            <strong>{result.title}</strong>
                                            <small>{result.author} · {result.category}</small>
                                            <em>Preview podcast</em>
                                        </span>
                                    </button>
                                    <button className="secondary-button" disabled={importingId === result.id || importedIds.has(result.id)} onClick={() => void addPodcast(result)}>
                                        {importingId === result.id ? 'Adding...' : importedIds.has(result.id) ? 'Added' : 'Add podcast'}
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}
