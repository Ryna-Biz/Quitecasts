import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { saveImportedCatalog } from '../data/catalog'
import { importPodcast, type OnlinePodcastResult } from '../services/onlinePodcasts'
import type { Episode, Podcast } from '../types/podcast'
import { Icon } from './Icon'

interface SubscribeButtonProps {
    podcastId: string
    /** For shows that are not in the library yet, so the feed can be pulled in on demand. */
    result?: OnlinePodcastResult
    /** Catalog data that is already loaded, reused instead of fetching the feed again. */
    podcast?: Podcast
    episodes?: Episode[]
    /** Renders the smaller variant used inside result cards. */
    compact?: boolean
    onNavigate: (path: string) => void
}

/**
 * The single subscribe action for the whole app. Subscribing pulls the show into the
 * library, records the subscription and lands you on your subscriptions page; clicking
 * again on a show you already follow unsubscribes in place.
 */
export function SubscribeButton({ podcastId, result, podcast, episodes, compact = false, onNavigate }: SubscribeButtonProps) {
    const { subscriptions, toggleSubscription } = usePlayer()
    const [pending, setPending] = useState(false)
    const subscribed = subscriptions.includes(podcastId)

    const onClick = async () => {
        if (subscribed) {
            await toggleSubscription(podcastId)
            return
        }
        setPending(true)
        try {
            let catalog: { podcast: Podcast; episodes: Episode[] } | null = podcast && episodes ? { podcast, episodes } : null
            if (result) {
                try {
                    catalog = await importPodcast(result)
                } catch {
                    // Plenty of publishers block browser RSS access. Keep the show so the
                    // subscription still works, it just arrives without episodes.
                    catalog = {
                        podcast: {
                            id: result.id,
                            title: result.title,
                            author: result.author,
                            description: 'Episodes are unavailable because this publisher blocks browser RSS access.',
                            artwork: result.artwork,
                            category: result.category,
                            feedUrl: result.feedUrl,
                        },
                        episodes: [],
                    }
                }
            }
            if (catalog) saveImportedCatalog(catalog.podcast, catalog.episodes)
            await toggleSubscription(podcastId)
            sessionStorage.removeItem('quietcasts:online-preview')
            onNavigate('/subscriptions')
        } finally {
            setPending(false)
        }
    }

    const label = pending ? 'Subscribing...' : subscribed ? 'Subscribed' : 'Subscribe'
    const className = subscribed || compact ? 'secondary-button' : 'primary-button'

    return (
        <button
            className={`${className}${subscribed ? ' subscribed' : ''}${compact ? ' compact' : ''}`}
            onClick={() => void onClick()}
            disabled={pending}
            aria-label={`${label} ${podcast?.title ?? ''}`.trim()}
        >
            {subscribed && !pending ? <Icon name="check" size={16} /> : null}
            {label}
        </button>
    )
}
