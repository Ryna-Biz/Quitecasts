import type { Episode, Podcast } from '../types/podcast'

export interface OnlinePodcastResult {
    id: string
    title: string
    author: string
    artwork: string
    feedUrl: string
    pageUrl?: string
    category: string
}

interface ItunesResult {
    collectionId?: number
    collectionName?: string
    artistName?: string
    artworkUrl600?: string
    artworkUrl100?: string
    feedUrl?: string
    collectionViewUrl?: string
    primaryGenreName?: string
}

interface ItunesResponse {
    results?: ItunesResult[]
}

interface TopPodcastResult {
    id?: string
    name?: string
    artistName?: string
    artworkUrl100?: string
    url?: string
    genres?: { name?: string }[]
}

interface TopPodcastsResponse {
    feed?: {
        results?: TopPodcastResult[]
    }
}

const TOP_PODCASTS_LIMIT = 4
const PROXY_TIMEOUT_MS = 8000
const FEED_TIMEOUT_MS = 25000
// Feeds can be enormous (a 20MB, 3000-item file is not unusual) but only the newest
// handful is ever kept, so parsing every item would cost seconds for nothing.
const MAX_FEED_ITEMS = 200
const TOP_PODCASTS_TTL_MS = 10 * 60 * 1000

const topPodcastsCacheKey = (limit: number) => `quietcasts:top-podcasts:${limit}`

/** Returns cached chart data while it is still fresh, so repeat visits render instantly. */
export function getCachedTopPodcasts(limit = TOP_PODCASTS_LIMIT): Podcast[] | null {
    try {
        const raw = sessionStorage.getItem(topPodcastsCacheKey(limit))
        if (!raw) return null
        const parsed = JSON.parse(raw) as { at: number; results: Podcast[] }
        if (!Array.isArray(parsed.results) || Date.now() - parsed.at > TOP_PODCASTS_TTL_MS) {
            sessionStorage.removeItem(topPodcastsCacheKey(limit))
            return null
        }
        return parsed.results
    } catch {
        return null
    }
}

function writeTopPodcastsCache(limit: number, results: Podcast[]) {
    try {
        sessionStorage.setItem(topPodcastsCacheKey(limit), JSON.stringify({ at: Date.now(), results }))
    } catch {
        // Session storage can be unavailable in private browsing or restricted contexts.
    }
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(url, { signal: controller.signal })
    } finally {
        window.clearTimeout(timer)
    }
}

export async function fetchTopPodcasts(limit = TOP_PODCASTS_LIMIT, options: { force?: boolean } = {}): Promise<Podcast[]> {
    if (!options.force) {
        const cached = getCachedTopPodcasts(limit)
        if (cached) return cached
    }

    const results = await loadTopPodcasts(limit)
    if (results.length > 0) writeTopPodcastsCache(limit, results)
    return results
}

async function loadTopPodcasts(limit: number): Promise<Podcast[]> {
    try {
        const source = `https://rss.applemarketingtools.com/api/v2/us/podcasts/top/${limit}/podcasts.json`
        const response = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(source)}`, PROXY_TIMEOUT_MS)
        if (response?.ok) {
            const wrapper = await response.json()
            const data = JSON.parse(wrapper.contents) as TopPodcastsResponse
            const chartResults = (data.feed?.results ?? []).filter((result): result is TopPodcastResult & { id: string; name: string; artworkUrl100: string } => Boolean(result.id && result.name && result.artworkUrl100)).map((result) => ({
                id: `top-${result.id}`,
                title: result.name,
                author: result.artistName ?? 'Podcast publisher',
                description: 'Currently ranked among the top podcasts on Apple Podcasts.',
                artwork: result.artworkUrl100,
                category: result.genres?.[0]?.name ?? 'Podcast',
                pageUrl: result.url,
            }))
            if (chartResults.length > 0) return chartResults
        }
    } catch (e) {
        console.error('Failed to fetch top podcasts:', e)
    }

    const popularSearches = ['The Daily', 'Crime Junkie', 'Huberman Lab', 'SmartLess']
    const fallbackResults = (await Promise.all(popularSearches.map((query) => searchOnlinePodcasts(query).catch(() => [])))).flat()
    const unique = fallbackResults.filter((podcast, index, all) => all.findIndex((item) => item.id === podcast.id) === index)
    return unique.slice(0, limit).map((podcast) => ({
        id: podcast.id,
        title: podcast.title,
        author: podcast.author,
        description: 'A popular podcast available in the Apple Podcasts directory.',
        artwork: podcast.artwork,
        category: podcast.category,
        feedUrl: podcast.feedUrl,
        pageUrl: podcast.pageUrl,
    }))
}

export async function searchOnlinePodcasts(query: string): Promise<OnlinePodcastResult[]> {
    const url = new URL('https://itunes.apple.com/search')
    url.searchParams.set('term', query)
    url.searchParams.set('media', 'podcast')
    url.searchParams.set('entity', 'podcast')
    url.searchParams.set('limit', '12')
    const response = await fetch(url)
    if (!response.ok) throw new Error('Online podcast search is unavailable.')
    const data = await response.json() as ItunesResponse
    return (data.results ?? []).filter((result): result is ItunesResult & { collectionId: number; collectionName: string; feedUrl: string } => Boolean(result.collectionId && result.collectionName && result.feedUrl)).map((result) => ({
        id: `online-${result.collectionId}`,
        title: result.collectionName,
        author: result.artistName ?? 'Unknown host',
        artwork: result.artworkUrl600 ?? result.artworkUrl100 ?? '',
        feedUrl: result.feedUrl,
        pageUrl: result.collectionViewUrl,
        category: result.primaryGenreName ?? 'Podcast',
    }))
}

export async function importPodcast(result: OnlinePodcastResult): Promise<{ podcast: Podcast; episodes: Episode[] }> {
    return parseFeed(result.id, result.feedUrl, result, await fetchFeedText(result.feedUrl))
}

/** Re-reads an already-imported show's feed so newly published episodes can be merged in. */
export async function fetchFeedEpisodes(podcast: Podcast): Promise<{ podcast: Podcast; episodes: Episode[] }> {
    if (!podcast.feedUrl) throw new Error('This show has no RSS feed.')
    return parseFeed(podcast.id, podcast.feedUrl, podcast, await fetchFeedText(podcast.feedUrl))
}

async function fetchFeedText(feedUrl: string) {
    const response = await fetchWithTimeout(feedUrl, FEED_TIMEOUT_MS)
    if (!response.ok) throw new Error('This podcast feed could not be loaded.')
    return response.text()
}

function parseFeed(podcastId: string, feedUrl: string, fallback: Partial<Podcast>, xmlText: string): { podcast: Podcast; episodes: Episode[] } {
    const xml = new DOMParser().parseFromString(xmlText, 'application/xml')
    if (xml.querySelector('parsererror')) throw new Error('This podcast feed is not valid RSS.')
    const channel = xml.querySelector('channel')
    if (!channel) throw new Error('This podcast feed has no channel.')
    const podcast: Podcast = {
        id: podcastId,
        title: text(channel, 'title') || fallback.title || '',
        author: text(channel, 'itunes\\:author, author') || fallback.author || '',
        description: cleanText(text(channel, 'description')) || fallback.description || '',
        artwork: channel.querySelector('itunes\\:image')?.getAttribute('href') || fallback.artwork || '',
        category: text(channel, 'itunes\\:category') || fallback.category || 'Podcast',
        feedUrl,
    }
    const importedEpisodes = Array.from(channel.querySelectorAll('item')).slice(0, MAX_FEED_ITEMS).map((item): Episode | null => {
        const enclosure = item.querySelector('enclosure')
        const audioUrl = enclosure?.getAttribute('url')
        const title = text(item, 'title')
        if (!audioUrl || !title) return null
        const publishedAt = toDate(text(item, 'pubDate'))
        // Feeds are newest-first, so the item index is not a stable identity. Prefer the
        // publisher's guid, then the media URL, so saved progress survives a refresh.
        const identity = text(item, 'guid') || audioUrl || `${title}|${publishedAt}`
        return {
            id: `${podcastId}-${hash(identity)}`,
            podcastId,
            title,
            description: cleanText(text(item, 'description') || text(item, 'content\\:encoded')),
            audioUrl,
            publishedAt,
            duration: parseDuration(text(item, 'itunes\\:duration')),
        }
    }).filter((episode): episode is Episode => Boolean(episode))
    return { podcast, episodes: importedEpisodes }
}

function text(parent: ParentNode, selector: string) {
    return parent.querySelector(selector)?.textContent?.trim() ?? ''
}

function cleanText(value: string) {
    const doc = new DOMParser().parseFromString(value, 'text/html')
    return (doc.body.textContent ?? value).replace(/\s+/g, ' ').trim()
}

function parseDuration(value: string) {
    const parts = value.split(':').map(Number)
    if (parts.some(Number.isNaN)) return 0
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    return parts[0] || 0
}

function toDate(value: string) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function hash(value: string) {
    return Array.from(value).reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7).toString(36)
}