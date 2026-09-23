import { useEffect, useState } from 'react'
import { getAllPodcasts } from '../data/catalog'
import { storage } from '../services/storage'
import { PodcastRow } from '../components/PodcastRow'

export function Subscriptions({ onNavigate }: { onNavigate: (path: string) => void }) {
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const podcasts = getAllPodcasts()
    useEffect(() => {
        const refresh = () => setSubscriptionIds(storage.getSubscriptions())
        window.addEventListener('storage', refresh)
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('quietcasts:subscriptions-changed', refresh)
        }
    }, [])
    const subscribed = podcasts.filter((podcast) => subscriptionIds.includes(podcast.id))
    return <div className="page"><div className="page-heading"><p className="eyebrow">Your library</p><h1>Subscriptions</h1><p className="intro-copy">Shows you’ve chosen to keep close.</p></div>{subscribed.length === 0 ? <div className="empty-state"><h2>Nothing here yet.</h2><p>Subscribe to a podcast and it will appear here.</p><button className="primary-button" onClick={() => onNavigate('/')}>Explore podcasts</button></div> : <div className="podcast-list">{subscribed.map((podcast) => <PodcastRow key={podcast.id} podcast={podcast} onOpen={() => onNavigate(`/podcast/${podcast.id}`)} />)}</div>}</div>
}
