import { useEffect, useState } from 'react'
import { isKnownCategory, rankByCategory } from '../data/categories'
import { CategoryArt } from '../components/CategoryArt'
import { Icon } from '../components/Icon'
import { SubscribeButton } from '../components/SubscribeButton'
import { searchOnlinePodcasts, type OnlinePodcastResult } from '../services/onlinePodcasts'

const RESULT_LIMIT = 24

export function CategoryPage({ category, onNavigate }: { category: string; onNavigate: (path: string) => void }) {
    const [results, setResults] = useState<OnlinePodcastResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
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
                                {results.map((result) => (
                                    <article className="result-card" key={result.id}>
                                        <button className="result-card-main" onClick={() => previewPodcast(result)}>
                                            <img src={result.artwork} alt="" />
                                            <strong>{result.title}</strong>
                                            <span>{result.author}</span>
                                            <small>{result.category}</small>
                                        </button>
                                        <SubscribeButton podcastId={result.id} result={result} compact onNavigate={onNavigate} />
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    )
}
