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
    const savedEpisodes = storage.getImportedEpisodes().filter((item) => item.podcastId !== podcast.id)
    storage.setImportedPodcasts([...savedPodcasts, podcast])
    storage.setImportedEpisodes([...savedEpisodes, ...importedEpisodes])
}
