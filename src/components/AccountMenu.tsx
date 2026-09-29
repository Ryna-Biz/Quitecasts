import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * The account button and its menu. Rendered in the sidebar on desktop and in the
 * mobile header, so signing out is reachable at every screen size.
 */
export function AccountMenu({ variant = 'sidebar' }: { variant?: 'sidebar' | 'header' }) {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const close = (event: PointerEvent) => {
            if (!(event.target as HTMLElement | null)?.closest('.user-menu-wrapper')) setOpen(false)
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        window.addEventListener('pointerdown', close)
        window.addEventListener('keydown', onKey)
        return () => {
            window.removeEventListener('pointerdown', close)
            window.removeEventListener('keydown', onKey)
        }
    }, [open])

    if (!user) return null

    const handleLogout = async () => {
        setOpen(false)
        await logout()
    }

    return (
        <div className={`user-menu-wrapper ${variant === 'header' ? 'account-menu-header' : ''}`}>
            <button
                className="user-button"
                onClick={() => setOpen(!open)}
                aria-label="Account menu"
                aria-expanded={open}
                title={user.email || 'Account'}
            >
                {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />
                ) : (
                    <div className="user-avatar-placeholder">{user.email?.[0]?.toUpperCase()}</div>
                )}
            </button>
            {open && (
                <div className="user-menu" role="menu">
                    <div className="user-info">
                        <strong>{user.displayName || user.email}</strong>
                        <small>{user.email}</small>
                    </div>
                    <button className="user-menu-item" role="menuitem" onClick={() => void handleLogout()}>
                        Sign out
                    </button>
                </div>
            )}
        </div>
    )
}
