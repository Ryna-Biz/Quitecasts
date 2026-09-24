import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Icon, type IconName } from './Icon'

const items: { path: string; label: string; icon: IconName }[] = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
    { path: '/activity', label: 'Activity', icon: 'activity' },
]

export function Navigation({ path, theme, onNavigate, onToggleTheme }: { path: string; theme: 'light' | 'dark'; onNavigate: (path: string) => void; onToggleTheme: () => void }) {
    const { user, logout } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleLogout = async () => {
        await logout()
        setShowUserMenu(false)
    }

    return <nav className="navigation" aria-label="Primary navigation">
        <div className="brand" onClick={() => onNavigate('/')}>
            <div className="brand-logo-box">
                <img src="/logo.svg" alt="Quietcasts logo" />
            </div>
            <span>Quiet<span className="brand-name-accent">casts</span></span>
        </div>

        <div className="nav-links">
            {items.map((item) => (
                <button
                    className={path === item.path ? 'nav-link active' : 'nav-link'}
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                >
                    <Icon name={item.icon} size={19} />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>

        <div className="nav-end">
            <button
                className="theme-toggle"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
                <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>

            {user && (
                <div className="user-menu-wrapper">
                    <button
                        className="user-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        aria-label="User menu"
                        title={user.email || 'User'}
                    >
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />
                        ) : (
                            <div className="user-avatar-placeholder">{user.email?.[0]?.toUpperCase()}</div>
                        )}
                    </button>
                    {showUserMenu && (
                        <div className="user-menu">
                            <div className="user-info">
                                <strong>{user.displayName || user.email}</strong>
                                <small>{user.email}</small>
                            </div>
                            <button className="user-menu-item" onClick={handleLogout}>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </nav>
}
