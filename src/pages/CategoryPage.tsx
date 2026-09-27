import { useEffect, useState } from 'react'
import { getAllPodcasts, saveImportedCatalog } from '../data/catalog'
import { isKnownCategory, rankByCategory, type Category } from '../data/categories'
import { CategoryArt } from '../components/CategoryArt'
import { Icon } from '../components/Icon'
import { importPodcast, searchOnlinePodcasts, type OnlinePodcastResult } from '../services/onlinePodcasts'

const RESULT_LIMIT = 24

export function CategoryPage({ category, onNavigate }: { category: string; onNavigate: (path: string) => void }) {
    const [results, setResults] = useState<OnlinePodcastResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [importingId, setImportingId] = useState<string | null>(null)
    const [importedIds, setImportedIds] = useState(() => new Set(getAllPodcasts().filter((podcast) => podcast.id.startsWith('online-')).map((podcast) => podcast.id)))
    const known = isKnownCategory(category)

    useEffect(() => {
        if (!known) {
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        setError('')
        void searchOnlinePodcasts(category, RESULT_LIMIT).then((found) => {
            if (active) setResults(rankByCategory(found, category))
        }).catch(() => {
            if (active) setError('This category could not be loaded right now.')
        }).finally(() => {
            if (active) setLoading(false)
        })
        return () => { active = false }
    }, [category, known])

    const addPodcast = async (result: OnlinePodcastResult) => {
        setImportingId(result.id)
        try {
            const imported = await importPodcast(result)
            saveImportedCatalog(imported.podcast, imported.episodes)
            setImportedIds((current) => new Set(current).add(result.id))
            onNavigate(`/podcast/${result.id}`)
        } catch {
            setError('This podcast could not be added. Its RSS feed may block browser access.')
        } finally {
            setImportingId(null)
        }
    }

    const previewPodcast = (result: OnlinePodcastResult) => {
        sessionStorage.setItem('quietcasts:online-preview', JSON.stringify(result))
        onNavigate(`/preview/${result.id}`)
    }

    return (
        <div className="page category-page">
            <button className="back-link" onClick={() => onNavigate('/search')}>
                <Icon name="back" size={17} /> All categories
            </button>

            {!known ? (
                <div className="empty-state">
                    <h1>Category not found</h1>
                    <p>We don't have a category called &quot;{category}&quot;.</p>
                    <button className="secondary-button" onClick={() => onNavigate('/search')}>Back to search</button>
                </div>
            ) : (
                <>
                    <header className="category-header">
                        <CategoryArt category={category} className="category-header-art" />
                        <div className="category-header-copy">
                            <p className="eyebrow">Browse category</p>
                            <h1>{category}</h1>
                            <p className="intro-copy">Podcasts filed under {category} on Apple Podcasts.</p>
                        </div>
                    </header>

                    <section className="content-section">
                        <div className="section-heading">
                            <h2>Shows</h2>
                            {loading ? <span className="muted-count">Loading...</span> : <span className="muted-count">{results.length}</span>}
                        </div>

                        {error ? <p className="search-error" role="status">{error}</p> : null}

                        {loading ? (
                            <div className="category-results">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="skeleton-card" />)}
                            </div>
                        ) : results.length === 0 && !error ? (
                            <p className="quiet-message">No podcasts were found in this category.</p>
                        ) : (
                            <div className="category-results">
                                {results.map((result) => {
                                    const added = importedIds.has(result.id)
                                    return (
                                        <article className="result-card" key={result.id}>
                                            <button className="result-card-main" onClick={() => previewPodcast(result)}>
                                                <img src={result.artwork} alt="" />
                                                <strong>{result.title}</strong>
                                                <span>{result.author}</span>
                                                <small>{result.category}</small>
                                            </button>
                                            <button
                                                className="secondary-button"
                                                disabled={importingId === result.id || added}
                                                onClick={() => void addPodcast(result)}
                                            >
                                                {importingId === result.id ? 'Adding...' : added ? 'Added' : 'Add'}
                                            </button>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    )
}
