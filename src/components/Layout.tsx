import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { MiniPlayer } from './MiniPlayer'
import { Icon } from './Icon'

export function Layout({ path, theme, onNavigate, onToggleTheme, children }: { path: string; theme: 'light' | 'dark'; onNavigate: (path: string) => void; onToggleTheme: () => void; children: ReactNode }) {
    return <div className="app-shell"><Navigation path={path} theme={theme} onNavigate={onNavigate} onToggleTheme={onToggleTheme} /><div className="app-column"><header className="mobile-header"><span className="brand-mark">q</span><span>quietcasts</span><button className="theme-toggle mobile-theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} /></button></header><main className="main-content">{children}</main><MiniPlayer onOpen={() => onNavigate('/player')} /></div></div>
}
