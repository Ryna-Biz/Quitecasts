import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getEpisode, getPodcast } from '../data/catalog'
import { audioService } from '../services/audio'
import { downloadService } from '../services/downloads'
import { storage } from '../services/storage'
import { firestoreService } from '../services/firestore'
import { useAuth } from './AuthContext'
import type { Episode, PlayerSnapshot } from '../types/podcast'

interface DownloadProgress {
    episodeId: string
    progress: number
    status: 'downloading' | 'completed' | 'failed'
    error?: string
}

interface PlayerContextValue {
    episode: Episode | null
    playing: boolean
    currentTime: number
    duration: number
    playbackRate: number
    volume: number
    progress: Record<string, ReturnType<typeof storage.getProgress>[string]>
    history: string[]
    queue: string[]
    downloads: string[]
    subscriptions: string[]
    downloadProgress: DownloadProgress | null
    playEpisode: (episode: Episode, position?: number) => void
    togglePlayback: () => void
    seek: (position: number) => void
    skip: (seconds: number) => void
    setPlaybackRate: (rate: number) => void
    setVolume: (volume: number) => void
    addToQueue: (episodeId: string) => void
    removeFromQueue: (episodeId: string) => void
    markDownloaded: (episodeId: string) => void
    startDownload: (episode: Episode) => Promise<void>
    cancelDownload: (episodeId: string) => void
    isDownloaded: (episodeId: string) => Promise<boolean>
    toggleSubscription: (podcastId: string) => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const initial = storage.getPlayer()
    const [episode, setEpisode] = useState<Episode | null>(() => getEpisode(initial.episodeId ?? undefined) ?? null)
    const [snapshot, setSnapshot] = useState(() => ({ ...audioService.getSnapshot(), playing: false, playbackRate: initial.playbackRate }))
    const [progress, setProgress] = useState(storage.getProgress)
    const [history, setHistory] = useState(storage.getHistory)
    const [queue, setQueue] = useState(storage.getQueue)
    const [subscriptions, setSubscriptions] = useState(storage.getSubscriptions)
    const [downloads, setDownloads] = useState<string[]>([])
    const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)
    const [abortControllers, setAbortControllers] = useState<Map<string, AbortController>>(new Map())

    useEffect(() => {
        const unsubscribe = audioService.subscribe(() => setSnapshot(audioService.getSnapshot()))
        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        downloadService.getAllDownloaded().then(setDownloads).catch(() => setDownloads([]))
    }, [])

    // Reload subscriptions from storage whenever the event fires (e.g. after Firestore restore)
    useEffect(() => {
        const refresh = () => setSubscriptions(storage.getSubscriptions())
        window.addEventListener('quietcasts:subscriptions-changed', refresh)
        return () => window.removeEventListener('quietcasts:subscriptions-changed', refresh)
    }, [])

    useEffect(() => {
        if (!user) return
        const syncInterval = window.setInterval(async () => {
            try {
                await Promise.all([
                    firestoreService.syncProgress(user.uid, progress),
                    firestoreService.syncHistory(user.uid, history),
                    firestoreService.syncQueue(user.uid, queue),
                    firestoreService.syncDownloads(user.uid, downloads),
                    firestoreService.syncPlaybackRate(user.uid, snapshot.playbackRate),
                ])
            } catch (error) {
                console.error('Failed to sync user data:', error)
            }
        }, 30000)
        return () => window.clearInterval(syncInterval)
    }, [user, subscriptions, progress, history, queue, downloads, snapshot.playbackRate])

    useEffect(() => {
        if (!episode) return
        audioService.load(episode, initial.position)
        audioService.setPlaybackRate(initial.playbackRate)
        setSnapshot(audioService.getSnapshot())
    }, [episode])

    useEffect(() => {
        const savePosition = () => {
            if (!episode) return
            const currentTime = audioService.getSnapshot().currentTime
            const nextProgress = {
                ...progress,
                [episode.id]: { episodeId: episode.id, position: currentTime, completed: false, updatedAt: Date.now() },
            }
            setProgress(nextProgress)
            storage.setProgress(nextProgress)
            storage.setPlayer({ episodeId: episode.id, position: currentTime, playbackRate: snapshot.playbackRate })
        }
        const interval = window.setInterval(savePosition, 5000)
        return () => window.clearInterval(interval)
    }, [episode, progress, snapshot.playbackRate])

    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
            if (event.code === 'Space') {
                event.preventDefault()
                togglePlayback()
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault()
                skip(-15)
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                skip(30)
            }
        }
        window.addEventListener('keydown', handleKeyboard)
        return () => window.removeEventListener('keydown', handleKeyboard)
    })

    useEffect(() => {
        if (!('mediaSession' in navigator) || !episode) return
        const podcast = getPodcast(episode.podcastId)
        navigator.mediaSession.metadata = new MediaMetadata({ title: episode.title, artist: podcast?.author, album: podcast?.title, artwork: podcast ? [{ src: podcast.artwork }] : [] })
        navigator.mediaSession.setActionHandler('play', () => void audioService.play())
        navigator.mediaSession.setActionHandler('pause', () => audioService.pause())
        navigator.mediaSession.setActionHandler('seekbackward', () => skip(-15))
        navigator.mediaSession.setActionHandler('seekforward', () => skip(30))
    }, [episode])

    const playEpisode = async (nextEpisode: Episode, position = progress[nextEpisode.id]?.position ?? 0) => {
        const downloadedUrl = await downloadService.getDownloadedUrl(nextEpisode.id)
        const episodeToPlay = downloadedUrl ? { ...nextEpisode, audioUrl: downloadedUrl } : nextEpisode
        setEpisode(episodeToPlay)
        audioService.load(episodeToPlay, position)
        audioService.setPlaybackRate(snapshot.playbackRate)
        void audioService.play().catch(() => undefined)
        const nextHistory = [nextEpisode.id, ...history.filter((id) => id !== nextEpisode.id)].slice(0, 20)
        setHistory(nextHistory)
        storage.setHistory(nextHistory)
        storage.setPlayer({ episodeId: nextEpisode.id, position, playbackRate: snapshot.playbackRate })
    }

    const togglePlayback = () => {
        if (!episode) return
        if (snapshot.playing) audioService.pause()
        else void audioService.play().catch(() => undefined)
    }

    const seek = (position: number) => audioService.seek(position)
    const skip = (seconds: number) => audioService.skip(seconds)
    const setPlaybackRate = (rate: number) => {
        audioService.setPlaybackRate(rate)
        if (episode) storage.setPlayer({ episodeId: episode.id, position: snapshot.currentTime, playbackRate: rate })
    }
    const setVolume = (volume: number) => audioService.setVolume(volume)
    const addToQueue = (episodeId: string) => {
        const nextQueue = queue.includes(episodeId) ? queue : [...queue, episodeId]
        setQueue(nextQueue)
        storage.setQueue(nextQueue)
    }
    const removeFromQueue = (episodeId: string) => {
        const nextQueue = queue.filter((id) => id !== episodeId)
        setQueue(nextQueue)
        storage.setQueue(nextQueue)
    }
    const markDownloaded = async (episodeId: string) => {
        const isCurrentlyDownloaded = downloads.includes(episodeId)
        if (isCurrentlyDownloaded) {
            await downloadService.deleteDownload(episodeId)
        }
        const nextDownloads = isCurrentlyDownloaded ? downloads.filter((id) => id !== episodeId) : [...downloads, episodeId]
        setDownloads(nextDownloads)
        storage.setDownloads(nextDownloads)
    }

    const startDownload = async (episode: Episode) => {
        const controller = new AbortController()
        setAbortControllers(prev => new Map(prev).set(episode.id, controller))

        setDownloadProgress({ episodeId: episode.id, progress: 0, status: 'downloading' })

        try {
            await downloadService.downloadEpisode(episode, (p) => {
                setDownloadProgress({ episodeId: episode.id, progress: p, status: 'downloading' })
            })
            setDownloadProgress({ episodeId: episode.id, progress: 1, status: 'completed' })
            const nextDownloads = [...downloads, episode.id]
            setDownloads(nextDownloads)
            storage.setDownloads(nextDownloads)
            setTimeout(() => setDownloadProgress(null), 1500)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Download failed'
            setDownloadProgress({ episodeId: episode.id, progress: 0, status: 'failed', error: errorMessage })
            setTimeout(() => setDownloadProgress(null), 3000)
        } finally {
            setAbortControllers(prev => {
                const next = new Map(prev)
                next.delete(episode.id)
                return next
            })
        }
    }

    const cancelDownload = (episodeId: string) => {
        const controller = abortControllers.get(episodeId)
        if (controller) {
            controller.abort()
            setAbortControllers(prev => {
                const next = new Map(prev)
                next.delete(episodeId)
                return next
            })
        }
        setDownloadProgress(null)
    }

    const isDownloaded = async (episodeId: string) => {
        return downloadService.isDownloaded(episodeId)
    }

    const toggleSubscription = async (podcastId: string) => {
        const next = subscriptions.includes(podcastId)
            ? subscriptions.filter((id) => id !== podcastId)
            : [...subscriptions, podcastId]
        setSubscriptions(next)
        storage.setSubscriptions(next)
        if (user) {
            try {
                await firestoreService.syncSubscriptions(user.uid, next)
            } catch {
                // silent — localStorage already updated
            }
        }
    }

    const value = useMemo<PlayerContextValue>(() => ({
        episode,
        ...snapshot,
        progress,
        history,
        queue,
        subscriptions,
        downloads,
        downloadProgress,
        playEpisode,
        togglePlayback,
        seek,
        skip,
        setPlaybackRate,
        setVolume,
        addToQueue,
        removeFromQueue,
        markDownloaded,
        startDownload,
        cancelDownload,
        isDownloaded,
        toggleSubscription,
    }), [episode, snapshot, progress, history, queue, downloads, downloadProgress])
    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) throw new Error('usePlayer must be used within PlayerProvider')
    return context
}

export type { PlayerSnapshot }
