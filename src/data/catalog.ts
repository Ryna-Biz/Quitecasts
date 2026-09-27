import { episodes } from './episodes'
import { podcasts } from './podcasts'
import { storage } from '../services/storage'
import type { Episode, Podcast } from '../types/podcast'

export const getAllPodcasts = (): Podcast[] => [...podcasts, ...storage.getImportedPodcasts()]
export const getAllEpisodes = (): Episode[] => [...episodes, ...storage.getImportedEpisodes()]
export const getPodcast = (id: string | undefined) => getAllPodcasts().find((podcast) => podcast.id === id)
export const getEpisode = (id: string | undefined) => getAllEpisodes().find((episode) => episode.id === id)
export const getEpisodesForPodcast = (podcastId: string) => getAllEpisodes().filter((episode) => episode.podcastId === podcastId)
export const getPodcastForEpisode = (podcastId: string) => getPodcast(podcastId)

export function saveImportedCatalog(podcast: Podcast, importedEpisodes: Episode[]) {
    const savedPodcasts = storage.getImportedPodcasts().filter((item) => item.id !== podcast.id)
    const savedEpisodes = storage.getImportedEpisodes().filter((episode) => episode.podcastId !== podcast.id)
    storage.setImportedPodcasts([...savedPodcasts, podcast])
    storage.setImportedEpisodes([...savedEpisodes, ...importedEpisodes])
}

const MAX_EPISODES_PER_PODCAST = 50

/**
 * Adds freshly fetched episodes to a stored show without dropping the ones already
 * saved, so listening progress, history and downloads stay attached to their episodes.
 */
export function mergeImportedEpisodes(podcastId: string, incoming: Episode[]) {
    const stored = storage.getImportedEpisodes()
    const byId = new Map(stored.filter((episode) => episode.podcastId === podcastId).map((episode) => [episode.id, episode]))
    const before = byId.size
    incoming.forEach((episode) => {
        if (!byId.has(episode.id)) byId.set(episode.id, episode)
    })
    const merged = Array.from(byId.values())
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, MAX_EPISODES_PER_PODCAST)
    storage.setImportedEpisodes([...stored.filter((episode) => episode.podcastId !== podcastId), ...merged])
    return { added: byId.size - before, total: merged.length }
}

/** Updates a stored show's metadata in place after a feed refresh. */
export function mergeImportedPodcast(podcast: Podcast) {
    const stored = storage.getImportedPodcasts()
    const existing = stored.find((item) => item.id === podcast.id)
    const merged: Podcast = { ...podcast, pageUrl: podcast.pageUrl ?? existing?.pageUrl }
    storage.setImportedPodcasts(existing ? stored.map((item) => (item.id === merged.id ? merged : item)) : [...stored, merged])
}
