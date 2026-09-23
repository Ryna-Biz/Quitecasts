import type { Episode } from '../types/podcast'

type AudioListener = () => void

class AudioService {
    private readonly element = new Audio()
    private readonly listeners = new Set<AudioListener>()
    private source = ''

    constructor() {
        this.element.preload = 'metadata'
            ;['timeupdate', 'loadedmetadata', 'durationchange', 'play', 'pause', 'ended', 'ratechange', 'volumechange'].forEach((event) => {
                this.element.addEventListener(event, () => this.notify())
            })
    }

    subscribe(listener: AudioListener) {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private notify() {
        this.listeners.forEach((listener) => listener())
    }

    load(episode: Episode, position = 0) {
        if (this.source !== episode.audioUrl) {
            this.source = episode.audioUrl
            this.element.src = episode.audioUrl
            this.element.load()
        }
        if (position > 0 && Math.abs(this.element.currentTime - position) > 2) {
            this.element.currentTime = position
        }
    }

    play() {
        return this.element.play()
    }

    pause() {
        this.element.pause()
    }

    seek(position: number) {
        if (Number.isFinite(this.element.duration)) {
            this.element.currentTime = Math.max(0, Math.min(position, this.element.duration))
        } else {
            this.element.currentTime = Math.max(0, position)
        }
    }

    skip(seconds: number) {
        this.seek(this.element.currentTime + seconds)
    }

    setVolume(value: number) {
        this.element.volume = Math.max(0, Math.min(1, value))
    }

    setPlaybackRate(value: number) {
        this.element.playbackRate = value
    }

    getSnapshot() {
        return {
            playing: !this.element.paused,
            currentTime: this.element.currentTime || 0,
            duration: Number.isFinite(this.element.duration) ? this.element.duration : 0,
            playbackRate: this.element.playbackRate,
            volume: this.element.volume,
        }
    }

    getElement() {
        return this.element
    }
}

export const audioService = new AudioService()
