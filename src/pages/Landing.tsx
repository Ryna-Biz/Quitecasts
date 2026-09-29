import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/categories'
import { CategoryArt } from '../components/CategoryArt'
import { Icon } from '../components/Icon'

/** Business details, kept in one place so the footer is easy to update. */
const BUSINESS = {
    name: 'RYNA',
    site: 'https://rynabiz.com',
    siteLabel: 'rynabiz.com',
} as const

/** Every claim below maps to something the app actually does. */
const FEATURES = [
    {
        icon: 'search' as const,
        title: 'Search the whole directory',
        body: 'Live search across Apple Podcasts, plus twelve categories to browse from when you would rather wander.',
    },
    {
        icon: 'subscriptions' as const,
        title: 'Follow what matters',
        body: 'Your subscriptions, listening progress, history, queue and downloads sync to your account.',
    },
    {
        icon: 'refresh' as const,
        title: 'Never fall behind',
        body: 'Refresh your shows to pull in newly published episodes. Existing progress stays attached to the episode it belongs to.',
    },
    {
        icon: 'play' as const,
        title: 'Listen your way',
        body: 'Set playback speed, queue up what is next, and download episodes to listen offline.',
    },
]

export function Landing({ onExploreGuest, onNavigate }: { onExploreGuest?: () => void; onNavigate?: (path: string) => void }) {
    const { login } = useAuth()
    const [authOpen, setAuthOpen] = useState(false)
    const [signingIn, setSigningIn] = useState(false)
    const [authError, setAuthError] = useState('')

    const openAuth = () => {
        setAuthError('')
        setAuthOpen(true)
    }

    const handleGoogle = async () => {
        setSigningIn(true)
        setAuthError('')
        try {
            await login()
        } catch {
            setAuthError('Sign in did not complete. Please try again.')
        } finally {
            setSigningIn(false)
        }
    }

    return (
        <div className="landing">
            <header className="landing-header">
                <div className="landing-shell">
                    <a className="landing-brand" href="/">
                        <span className="landing-brand-mark">
                            <img src="/logo.svg" alt="" />
                        </span>
                        {/* Wrapped so "Quiet" and "Casts" are one flex item; as siblings the
                            brand's gap would land between them. */}
                        <span>Quiet<span className="landing-brand-accent">Casts</span></span>
                    </a>
                    <nav className="landing-header-actions">
                        <button className="text-button" onClick={openAuth}>Sign in</button>
                        <button className="primary-button" onClick={openAuth}>Start listening</button>
                    </nav>
                </div>
            </header>

            <main>
                <section className="landing-hero">
                    <div className="landing-shell landing-hero-grid">
                        <div className="landing-hero-copy">
                            <p className="eyebrow">Podcast player</p>
                            <h1>Every show you follow, in one quiet place.</h1>
                            <p className="landing-hero-lede">
                                Search the full Apple Podcasts directory, follow the shows you care about,
                                and pick up exactly where you left off — on any device.
                            </p>
                            <div className="landing-hero-actions">
                                <button className="primary-button" onClick={openAuth}>Start listening</button>
                                {onExploreGuest ? (
                                    <button className="secondary-button" onClick={onExploreGuest}>Browse as guest</button>
                                ) : null}
                            </div>
                        </div>

                        {/* The real browse categories, not a stock photo. */}
                        <div className="landing-hero-preview">
                            <p className="landing-preview-label">Browse by category</p>
                            <div className="landing-preview-grid">
                                {CATEGORIES.map((category) => (
                                    <div className="landing-preview-item" key={category}>
                                        <CategoryArt category={category} className="landing-preview-art" />
                                        <span>{category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-section">
                    <div className="landing-shell">
                        <h2 className="landing-section-title">What you get</h2>
                        <div className="landing-features">
                            {FEATURES.map((feature) => (
                                <article className="landing-feature" key={feature.title}>
                                    <span className="landing-feature-icon">
                                        <Icon name={feature.icon} size={20} />
                                    </span>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="landing-cta">
                    <div className="landing-shell landing-cta-inner">
                        <h2>No ads. No algorithm. Just your shows.</h2>
                        <p>Your library stays on your devices and in your account — nothing is sold or pushed at you.</p>
                        <button className="primary-button" onClick={openAuth}>Start listening</button>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-shell landing-footer-main">
                    <div className="landing-footer-brand">
                        <span className="landing-brand landing-brand-sm">
                            <span className="landing-brand-mark">
                                <img src="/logo.svg" alt="" />
                            </span>
                            <span>Quiet<span className="landing-brand-accent">Casts</span><sup className="landing-brand-tm">&trade;</sup></span>
                        </span>
                        <p>A small player for the shows you actually want to hear.</p>
                    </div>

                    <div className="landing-footer-links">
                        <div>
                            <h2>Product</h2>
                            <ul>
                                {/* Every app route is behind auth, so these open the same
                                    sign-in prompt the call-to-action buttons use. */}
                                <li><button type="button" onClick={openAuth}>Browse shows</button></li>
                                <li><button type="button" onClick={openAuth}>Your subscriptions</button></li>
                                <li><button type="button" onClick={openAuth}>Listening history</button></li>
                            </ul>
                        </div>
                        <div>
                            <h2>Business</h2>
                            <ul>
                                <li>
                                    <a href={BUSINESS.site} target="_blank" rel="noopener noreferrer">
                                        {BUSINESS.siteLabel}
                                        <Icon name="chevron" size={14} />
                                    </a>
                                </li>
                                <li><span className="landing-footer-muted">By {BUSINESS.name}&trade;</span></li>
                                <li><button type="button" onClick={() => { setAuthOpen(false); onNavigate?.('/privacy') }}>Privacy Policy</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="landing-shell landing-footer-bottom">
                    <span>&copy; {new Date().getFullYear()} {BUSINESS.name}&trade;. All rights reserved.</span>
                    <span>QuietCasts&trade;</span>
                </div>
            </footer>

            {authOpen && (
                <div className="landing-modal-backdrop" onClick={() => setAuthOpen(false)}>
                    <div className="landing-modal" onClick={(event) => event.stopPropagation()}>
                        <button className="landing-modal-close" onClick={() => setAuthOpen(false)} aria-label="Close">
                            <Icon name="close" size={18} />
                        </button>
                        <h2>Sign in to QuietCasts</h2>
                        <p>Sync your subscriptions, progress, history and downloads across devices.</p>

                        {authError ? <p className="landing-modal-error" role="status">{authError}</p> : null}

                        <button className="landing-google-button" onClick={() => void handleGoogle()} disabled={signingIn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {signingIn ? 'Connecting...' : 'Continue with Google'}
                        </button>

                        {onExploreGuest ? (
                            <button
                                className="landing-guest-button"
                                onClick={() => {
                                    setAuthOpen(false)
                                    onExploreGuest()
                                }}
                            >
                                Browse as guest instead
                            </button>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}
