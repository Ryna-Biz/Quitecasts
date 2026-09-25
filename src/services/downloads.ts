import type { Episode } from '../types/podcast'

interface DownloadedEpisode {
    id: string
    audioBlob: Blob
    audioUrl: string
    downloadedAt: number
}

const DB_NAME = 'quietcasts-downloads'
const STORE_NAME = 'episodes'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }
    })
}

export const downloadService = {
    async isDownloaded(episodeId: string): Promise<boolean> {
        try {
            const db = await openDB()
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly')
                const store = tx.objectStore(STORE_NAME)
                const request = store.get(episodeId)
                request.onsuccess = () => resolve(!!request.result)
                request.onerror = () => resolve(false)
            })
        } catch {
            return false
        }
    },

    async getDownloadedUrl(episodeId: string): Promise<string | null> {
        try {
            const db = await openDB()
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly')
                const store = tx.objectStore(STORE_NAME)
                const request = store.get(episodeId)
                request.onsuccess = () => {
                    const result = request.result as DownloadedEpisode | undefined
                    if (!result) {
                        resolve(null)
                        return
                    }
                    // Blob URLs are temporary and cleared on page reload.
                    // We must recreate the URL from the stored Blob.
                    const audioUrl = URL.createObjectURL(result.audioBlob)
                    resolve(audioUrl)
                }
                request.onerror = () => resolve(null)
            })
        } catch {
            return null
        }
    },

    async downloadEpisode(
        episode: Episode,
        onProgress?: (progress: number) => void
    ): Promise<string> {
        const response = await fetch(episode.audioUrl, {
            mode: 'cors',
        })
        if (!response.ok) {
            throw new Error(`Failed to download: ${response.status}`)
        }

        const contentLength = response.headers.get('content-length')
        const total = contentLength ? parseInt(contentLength, 10) : 0

        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error('Response body is not readable')
        }

        const chunks: Uint8Array[] = []
        let loaded = 0

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                chunks.push(value)
                loaded += value.length

                if (total && onProgress) {
                    onProgress(loaded / total)
                }
            }
        } finally {
            reader.releaseLock()
        }

        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' })
        
        // Trigger actual browser download
        const downloadUrl = URL.createObjectURL(audioBlob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${episode.title.replace(/[^a-z0-9]/gi, '_')}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)

        const audioUrl = URL.createObjectURL(audioBlob)

        const db = await openDB()
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite')
            const store = tx.objectStore(STORE_NAME)
            const request = store.put({
                id: episode.id,
                audioBlob,
                audioUrl,
                downloadedAt: Date.now(),
            } as DownloadedEpisode)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })

        return audioUrl
    },

    async deleteDownload(episodeId: string): Promise<void> {
        try {
            const db = await openDB()
            const tx = db.transaction(STORE_NAME, 'readwrite')
            const store = tx.objectStore(STORE_NAME)
            const getRequest = store.get(episodeId)

            getRequest.onsuccess = () => {
                const result = getRequest.result as DownloadedEpisode | undefined
                if (result?.audioUrl) {
                    URL.revokeObjectURL(result.audioUrl)
                }
                store.delete(episodeId)
            }
        } catch {
            // Ignore deletion errors
        }
    },

    async getAllDownloaded(): Promise<string[]> {
        try {
            const db = await openDB()
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly')
                const store = tx.objectStore(STORE_NAME)
                const request = store.getAllKeys()
                request.onsuccess = () => resolve(request.result as string[])
                request.onerror = () => resolve([])
            })
        } catch {
            return []
        }
    },
}