import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getEpisode, getPodcast } from '../data/catalog'
import { audioService } from '../services/audio'
import { storage } from '../services/storage'
import type { Episode, PlayerSnapshot } from '../types/podcast'

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
    playEpisode: (episode: Episode, position?: number) => void
    togglePlayback: () => void
    seek: (position: number) => void
    skip: (seconds: number) => void
    setPlaybackRate: (rate: number) => void
    setVolume: (volume: number) => void
    addToQueue: (episodeId: string) => void
    removeFromQueue: (episodeId: string) => void
    markDownloaded: (episodeId: string) => void
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
    const initial = storage.getPlayer()
    const [episode, setEpisode] = useState<Episode | null>(() => getEpisode(initial.episodeId ?? undefined) ?? null)
    const [snapshot, setSnapshot] = useState(() => ({ ...audioService.getSnapshot(), playing: false, playbackRate: initial.playbackRate }))
    const [progress, setProgress] = useState(storage.getProgress)
    const [history, setHistory] = useState(storage.getHistory)
    const [queue, setQueue] = useState(storage.getQueue)
    const [downloads, setDownloads] = useState(storage.getDownloads)

    useEffect(() => {
        const unsubscribe = audioService.subscribe(() => setSnapshot(audioService.getSnapshot()))
        return () => {
            unsubscribe()
        }
    }, [])

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

    const playEpisode = (nextEpisode: Episode, position = progress[nextEpisode.id]?.position ?? 0) => {
        setEpisode(nextEpisode)
        audioService.load(nextEpisode, position)
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
    const markDownloaded = (episodeId: string) => {
        const nextDownloads = downloads.includes(episodeId) ? downloads.filter((id) => id !== episodeId) : [...downloads, episodeId]
        setDownloads(nextDownloads)
        storage.setDownloads(nextDownloads)
    }

    const value = useMemo<PlayerContextValue>(() => ({ episode, ...snapshot, progress, history, queue, downloads, playEpisode, togglePlayback, seek, skip, setPlaybackRate, setVolume, addToQueue, removeFromQueue, markDownloaded }), [episode, snapshot, progress, history, queue, downloads])
    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) throw new Error('usePlayer must be used within PlayerProvider')
    return context
}

export type { PlayerSnapshot }
