import { useEffect, useState } from 'react'
import { PlayerProvider } from './context/PlayerContext'
import { Layout } from './components/Layout'
import { Activity } from './pages/Activity'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { PlayerPage } from './pages/PlayerPage'
import { PodcastPage } from './pages/PodcastPage'
import { Search } from './pages/Search'
import { Subscriptions } from './pages/Subscriptions'
import { OnlinePodcastPage } from './pages/OnlinePodcastPage'

function currentPath() {
    return window.location.pathname || '/'
}

function initialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('quietcasts:theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
    const [path, setPath] = useState(currentPath)
    const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)

    useEffect(() => {
        const handlePopState = () => setPath(currentPath())
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('quietcasts:theme', theme)
    }, [theme])

    const navigate = (nextPath: string) => {
        if (nextPath === path) return
        window.history.pushState({}, '', nextPath)
        setPath(nextPath)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const segments = path.split('/').filter(Boolean)
    let page = <NotFound onNavigate={navigate} />
    if (path === '/') page = <Home onNavigate={navigate} />
    else if (path === '/search') page = <Search onNavigate={navigate} />
    else if (path === '/subscriptions') page = <Subscriptions onNavigate={navigate} />
    else if (path === '/activity') page = <Activity />
    else if (path === '/player') page = <PlayerPage onNavigate={navigate} />
    else if (segments[0] === 'preview' && segments[1]) page = <OnlinePodcastPage onNavigate={navigate} />
    else if (segments[0] === 'podcast' && segments[1]) page = <PodcastPage id={segments[1]} onNavigate={navigate} />

    return <PlayerProvider><Layout path={path} theme={theme} onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onNavigate={navigate}>{page}</Layout></PlayerProvider>
}
