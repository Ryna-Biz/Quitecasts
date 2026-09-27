import { mergeImportedEpisodes, mergeImportedPodcast } from '../data/catalog'
import { fetchFeedEpisodes } from './onlinePodcasts'
import type { Episode, Podcast } from '../types/podcast'

export type FeedRefreshStatus = 'updated' | 'unchanged' | 'failed' | 'skipped'

export interface FeedRefreshResult {
    podcastId: string
    title: string
    status: FeedRefreshStatus
    newEpisodes: number
    message?: string
}

const CONCURRENCY = 4

interface Outcome {
    podcast: Podcast
    updated?: Podcast
    episodes?: Episode[]
    error?: string
}

/**
 * Re-reads the RSS feed of every supplied show and merges in any episodes that are new
 * since the last import. Shows without a feed URL are reported as skipped rather than failed.
 */
export async function refreshSubscriptions(
    podcasts: Podcast[],
    onProgress?: (completed: number, total: number) => void,
): Promise<FeedRefreshResult[]> {
    const feedable = podcasts.filter((podcast) => podcast.feedUrl)
    const skipped: FeedRefreshResult[] = podcasts
        .filter((podcast) => !podcast.feedUrl)
        .map((podcast) => ({
            podcastId: podcast.id,
            title: podcast.title,
            status: 'skipped',
            newEpisodes: 0,
            message: 'This show has no RSS feed.',
        }))

    if (feedable.length === 0) return skipped

    const outcomes: Outcome[] = new Array(feedable.length)
    let completed = 0
    let cursor = 0

    const worker = async () => {
        while (cursor < feedable.length) {
            const index = cursor
            cursor += 1
            const podcast = feedable[index]
            try {
                const { podcast: updated, episodes } = await fetchFeedEpisodes(podcast)
                outcomes[index] = { podcast, updated, episodes }
            } catch (error) {
                outcomes[index] = {
                    podcast,
                    error: error instanceof Error ? error.message : 'This feed could not be refreshed.',
                }
            } finally {
                completed += 1
                onProgress?.(completed, feedable.length)
            }
        }
    }

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, feedable.length) }, worker))

    // Merged only after every fetch settles: each merge is a read-modify-write of the same
    // storage key, so doing it from the workers would let concurrent feeds clobber each other.
    const results: FeedRefreshResult[] = []
    for (const outcome of outcomes) {
        if (!outcome) continue
        const { podcast, updated, episodes, error } = outcome
        if (error || !updated || !episodes) {
            results.push({ podcastId: podcast.id, title: podcast.title, status: 'failed', newEpisodes: 0, message: error })
            continue
        }
        const { added } = mergeImportedEpisodes(podcast.id, episodes)
        mergeImportedPodcast(updated)
        results.push({
            podcastId: podcast.id,
            title: podcast.title,
            status: added > 0 ? 'updated' : 'unchanged',
            newEpisodes: added,
        })
    }

    return [...results, ...skipped]
}
