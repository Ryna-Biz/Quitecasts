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

interface ChartEntry {
    'im:name'?: { label?: string }
    'im:artist'?: { label?: string }
    'im:image'?: { label?: string }[]
    summary?: { label?: string }
    id?: { label?: string }
    // Present as a single object on this feed, but tolerate an array too.
    link?: { attributes?: { href?: string } } | { attributes?: { href?: string } }[]
}

interface ChartResponse {
    feed?: {
        entry?: ChartEntry[] | ChartEntry
    }
}

interface LookupResponse {
    resultCount?: number
    results?: ItunesResult[]
}

const TOP_PODCASTS_LIMIT = 4
const CHART_TIMEOUT_MS = 8000
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
    const charted = await loadChartPodcasts(limit)
    if (charted.length > 0) return charted

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

/**
 * Reads the real Apple top-podcasts chart. Apple's newer marketing-tools API sends no
 * CORS headers, so it is only reachable through a third-party proxy, and public proxies
 * get throttled or blocked. This legacy generator is served from itunes.apple.com, the
 * same origin the app already uses for search, so it is directly fetchable and fast.
 */
async function loadChartPodcasts(limit: number): Promise<Podcast[]> {
    let entries: ChartEntry[]
    try {
        const response = await fetchWithTimeout(`https://itunes.apple.com/us/rss/toppodcasts/limit=${limit}/json`, CHART_TIMEOUT_MS)
        if (!response.ok) throw new Error(`chart responded ${response.status}`)
        const data = await response.json() as ChartResponse
        // A single-entry chart comes back as a bare object rather than a one-item array.
        const entry = data.feed?.entry
        entries = (Array.isArray(entry) ? entry : entry ? [entry] : []) as ChartEntry[]
    } catch (e) {
        console.error('Failed to fetch the top podcasts chart:', e)
        return []
    }

    // The chart only carries 55x55 artwork and no feed URL or genre, so a single batched
    // lookup fills in the 600x600 cover, the RSS feed and the category. Subscribing from
    // a chart row re-searches by title and picks up its own feed, but keeping this entry
    // complete means the row data is never silently missing fields.
    const chartIds = entries
        .map((entry) => /id(\d+)/.exec(entry.id?.label ?? '')?.[1])
        .filter((id): id is string => Boolean(id))
    const enriched = new Map<string, ItunesResult>()
    if (chartIds.length > 0) {
        try {
            const lookup = await fetchWithTimeout(`https://itunes.apple.com/lookup?id=${chartIds.join(',')}&entity=podcast`, CHART_TIMEOUT_MS)
            if (lookup.ok) {
                const data = await lookup.json() as LookupResponse
                for (const result of data.results ?? []) {
                    if (result.collectionId) enriched.set(String(result.collectionId), result)
                }
            }
        } catch (e) {
            console.error('Failed to enrich top podcasts:', e)
        }
    }

    return entries.map((entry, index) => {
        const collectionId = /id(\d+)/.exec(entry.id?.label ?? '')?.[1] ?? ''
        const detail = enriched.get(collectionId)
        const link = Array.isArray(entry.link) ? entry.link[0] : entry.link
        return {
            id: `top-${collectionId || index}`,
            title: detail?.collectionName ?? entry['im:name']?.label ?? entry['im:artist']?.label ?? 'Podcast',
            author: detail?.artistName ?? entry['im:artist']?.label ?? 'Podcast publisher',
            description: detail?.collectionName
                ? `Ranked among the top podcasts on Apple Podcasts. ${entry.summary?.label ?? ''}`.trim()
                : 'Ranked among the top podcasts on Apple Podcasts.',
            artwork: detail?.artworkUrl600 ?? entry['im:image']?.[0]?.label ?? '',
            category: detail?.primaryGenreName ?? 'Podcast',
            feedUrl: detail?.feedUrl,
            pageUrl: detail?.collectionViewUrl ?? link?.attributes?.href,
        }
    }).filter((podcast) => podcast.title !== 'Podcast' || podcast.artwork !== '')
}

export async function searchOnlinePodcasts(query: string, limit = 12): Promise<OnlinePodcastResult[]> {
    const url = new URL('https://itunes.apple.com/search')
    url.searchParams.set('term', query)
    url.searchParams.set('media', 'podcast')
    url.searchParams.set('entity', 'podcast')
    url.searchParams.set('limit', String(limit))
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