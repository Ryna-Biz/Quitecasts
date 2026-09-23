import { useEffect, useState } from 'react'
import { getAllEpisodes } from '../data/catalog'
import { storage } from '../services/storage'
import { fetchTopPodcasts, searchOnlinePodcasts } from '../services/onlinePodcasts'
import type { Podcast } from '../types/podcast'
import { EpisodeRow } from '../components/EpisodeRow'
import { PodcastRow } from '../components/PodcastRow'

export function Home({ onNavigate }: { onNavigate: (path: string) => void }) {
    const episodes = getAllEpisodes()
    const [topPodcasts, setTopPodcasts] = useState<Podcast[]>([])
    const [topLoading, setTopLoading] = useState(true)
    const [topError, setTopError] = useState(false)
    const [openingPodcastId, setOpeningPodcastId] = useState<string | null>(null)
    const [subscriptionIds, setSubscriptionIds] = useState(storage.getSubscriptions)
    const subscribedEpisodes = episodes.filter((episode) => subscriptionIds.includes(episode.podcastId)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    useEffect(() => {
        const refresh = () => setSubscriptionIds(storage.getSubscriptions())
        window.addEventListener('storage', refresh)
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('quietcasts:subscriptions-changed', refresh)
        }
    }, [])

    const openTopPodcast = async (podcast: Podcast) => {
        setOpeningPodcastId(podcast.id)
        try {
            const [result] = await searchOnlinePodcasts(podcast.title)
            if (!result) throw new Error('Podcast not found')
            sessionStorage.setItem('quietcasts:online-preview', JSON.stringify(result))
            onNavigate(`/preview/${result.id}`)
        } catch {
            setTopError(true)
        } finally {
            setOpeningPodcastId(null)
        }
    }

    useEffect(() => {
        let active = true
        void fetchTopPodcasts().then((results) => {
            if (active) setTopPodcasts(results)
        }).catch(() => {
            if (active) setTopError(true)
        }).finally(() => {
            if (active) setTopLoading(false)
        })
        return () => {
            active = false
        }
    }, [])

    return <div className="page home-page"><div className="page-intro"><p className="eyebrow">Good to have you back</p><h1>Listen with room to think.</h1><p className="intro-copy">A quiet place for the shows you care about.</p></div>
        <section className="content-section"><SectionHeading title="New episodes" />{subscribedEpisodes.length > 0 ? <div className="episode-list">{subscribedEpisodes.slice(0, 4).map((episode) => <EpisodeRow key={episode.id} episode={episode} />)}</div> : <p className="quiet-message">Subscribe to a podcast to see its new episodes here.</p>}</section>
        <section className="content-section"><SectionHeading title="Top podcasts" />{topLoading ? <p className="quiet-message">Loading the current chart...</p> : topError ? <p className="quiet-message">Top podcasts are unavailable right now.</p> : <div className="podcast-list">{topPodcasts.map((podcast) => <PodcastRow key={podcast.id} podcast={podcast} onOpen={() => void openTopPodcast(podcast)} />)}</div>}{openingPodcastId ? <p className="quiet-message">Opening podcast preview...</p> : null}</section>
    </div>
}

function SectionHeading({ title, action }: { title: string; action?: string }) { return <div className="section-heading"><h2>{title}</h2>{action ? <button className="text-button">{action}</button> : null}</div> }
