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

export async function fetchTopPodcasts(limit = 4): Promise<Podcast[]> {
    const response = await fetch(`https://rss.applemarketingtools.com/api/v2/us/podcasts/top/${limit}/podcasts.json`).catch(() => null)
    if (response?.ok) {
        const data = await response.json() as TopPodcastsResponse
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
    const response = await fetch(result.feedUrl)
    if (!response.ok) throw new Error('This podcast feed could not be loaded.')
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml')
    if (xml.querySelector('parsererror')) throw new Error('This podcast feed is not valid RSS.')
    const channel = xml.querySelector('channel')
    if (!channel) throw new Error('This podcast feed has no channel.')
    const podcast: Podcast = {
        id: result.id,
        title: text(channel, 'title') || result.title,
        author: text(channel, 'itunes\\:author, author') || result.author,
        description: cleanText(text(channel, 'description')),
        artwork: channel.querySelector('itunes\\:image')?.getAttribute('href') || result.artwork,
        category: text(channel, 'itunes\\:category') || result.category,
        feedUrl: result.feedUrl,
    }
    const importedEpisodes = Array.from(channel.querySelectorAll('item')).map((item, index): Episode | null => {
        const enclosure = item.querySelector('enclosure')
        const audioUrl = enclosure?.getAttribute('url')
        const title = text(item, 'title')
        if (!audioUrl || !title) return null
        const rawDate = text(item, 'pubDate')
        return {
            id: `${result.id}-episode-${index}-${hash(title)}`,
            podcastId: result.id,
            title,
            description: cleanText(text(item, 'description') || text(item, 'content\\:encoded')),
            audioUrl,
            publishedAt: toDate(rawDate),
            duration: parseDuration(text(item, 'itunes\\:duration')),
        }
    }).filter((episode): episode is Episode => Boolean(episode)).slice(0, 50)
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