import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { SavedProgress } from '../types/podcast'

export interface UserData {
    subscriptions: string[]
    progress: Record<string, SavedProgress>
    history: string[]
    queue: string[]
    downloads: string[]
    playbackRate: number
    lastSyncedAt: number
}

const COLLECTION = 'users'

export const firestoreService = {
    async saveUserData(userId: string, data: Partial<UserData>): Promise<void> {
        const userRef = doc(db, COLLECTION, userId)
        const updateData = {
            ...data,
            lastSyncedAt: serverTimestamp(),
        }
        await setDoc(userRef, updateData, { merge: true })
    },

    async getUserData(userId: string): Promise<UserData | null> {
        const userRef = doc(db, COLLECTION, userId)
        const docSnap = await getDoc(userRef)
        return docSnap.exists() ? (docSnap.data() as UserData) : null
    },

    async syncSubscriptions(userId: string, subscriptions: string[]): Promise<void> {
        await this.saveUserData(userId, { subscriptions })
    },

    async syncProgress(userId: string, progress: Record<string, SavedProgress>): Promise<void> {
        await this.saveUserData(userId, { progress })
    },

    async syncHistory(userId: string, history: string[]): Promise<void> {
        await this.saveUserData(userId, { history })
    },

    async syncQueue(userId: string, queue: string[]): Promise<void> {
        await this.saveUserData(userId, { queue })
    },

    async syncDownloads(userId: string, downloads: string[]): Promise<void> {
        await this.saveUserData(userId, { downloads })
    },

    async syncPlaybackRate(userId: string, playbackRate: number): Promise<void> {
        await this.saveUserData(userId, { playbackRate })
    },
}