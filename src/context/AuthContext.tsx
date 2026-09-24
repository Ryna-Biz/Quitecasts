import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'
import { firestoreService, type UserData } from '../services/firestore'
import { storage } from '../services/storage'

interface AuthContextValue {
    user: User | null
    loading: boolean
    error: string | null
    userData: UserData | null
    login: () => Promise<void>
    logout: () => Promise<void>
    updateUserData: (data: Partial<UserData>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                setUser(currentUser)
                if (currentUser) {
                    const data = await firestoreService.getUserData(currentUser.uid)
                    if (data) {
                        setUserData(data)
                        applyUserData(data)
                    }
                } else {
                    setUserData(null)
                }
                setError(null)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Authentication error'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const login = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await signInWithPopup(auth, googleProvider)
            const data = await firestoreService.getUserData(result.user.uid)
            if (data) {
                setUserData(data)
                applyUserData(data)
            } else {
                const localData = {
                    subscriptions: storage.getSubscriptions(),
                    progress: storage.getProgress(),
                    history: storage.getHistory(),
                    queue: storage.getQueue(),
                    downloads: storage.getDownloads(),
                    playbackRate: 1,
                    lastSyncedAt: Date.now(),
                }
                await firestoreService.saveUserData(result.user.uid, localData)
                setUserData(localData)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            setLoading(true)
            await signOut(auth)
            setUserData(null)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateUserData = async (data: Partial<UserData>) => {
        if (!user) throw new Error('User not authenticated')
        try {
            await firestoreService.saveUserData(user.uid, data)
            setUserData((prev) => (prev ? { ...prev, ...data } : null))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Update failed'
            setError(errorMessage)
            throw err
        }
    }

    const applyUserData = (data: UserData) => {
        storage.setSubscriptions(data.subscriptions ?? [])
        storage.setProgress(data.progress ?? {})
        storage.setHistory(data.history ?? [])
        storage.setQueue(data.queue ?? [])
        storage.setDownloads(data.downloads ?? [])
        // setSubscriptions already dispatches 'quietcasts:subscriptions-changed'
        // so PlayerContext picks up the restored subscriptions automatically
    }

    const value: AuthContextValue = {
        user,
        loading,
        error,
        userData,
        login,
        logout,
        updateUserData,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}