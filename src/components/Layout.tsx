import type { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { MiniPlayer } from './MiniPlayer'
import { Icon } from './Icon'

export function Layout({ path, theme, onNavigate, onToggleTheme, children }: { path: string; theme: 'light' | 'dark'; onNavigate: (path: string) => void; onToggleTheme: () => void; children: ReactNode }) {
    return (
        <div className="app-shell">
            <Navigation path={path} theme={theme} onNavigate={onNavigate} onToggleTheme={onToggleTheme} />
            <div className="app-column">
                <header className="mobile-header">
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="/logo.svg" alt="Quietcasts" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                    </div>
                    Quiet<span style={{ color: 'var(--accent)' }}>casts</span>
                    <button
                        className="theme-toggle mobile-theme-toggle"
                        onClick={onToggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
                    </button>
                </header>
                <main className="main-content">
                    {children}
                </main>
                <MiniPlayer onOpen={() => onNavigate('/player')} />
            </div>
        </div>
    )
}
