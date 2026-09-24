import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Landing() {
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleGoogle = async () => {
        setIsLoading(true)
        setLoginError('')
        try { await login() }
        catch { setLoginError('Sign in failed. Please try again.') }
        finally { setIsLoading(false) }
    }

    return (
        <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', background: '#060A10', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", overflow: 'hidden', position: 'relative' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                /* NOISE OVERLAY */
                .noise {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    opacity: .028;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 200px 200px;
                    pointer-events: none;
                }

                /* AMBIENT ORBS */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    pointer-events: none;
                }
                .orb-1 { width: 600px; height: 600px; background: rgba(56, 100, 160, .13); top: -200px; right: -100px; }
                .orb-2 { width: 500px; height: 500px; background: rgba(30, 60, 110, .1); bottom: -150px; left: -100px; }
                .orb-3 { width: 300px; height: 300px; background: rgba(80, 140, 200, .06); top: 40%; left: 30%; }

                /* GRID */
                .grid-bg {
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(100,160,210,.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(100,160,210,.04) 1px, transparent 1px);
                    background-size: 80px 80px;
                    pointer-events: none;
                }

                /* LAYOUT */
                .shell {
                    position: relative;
                    z-index: 1;
                    width: 100vw;
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-rows: auto 1fr auto;
                }

                /* NAV */
                .nav {
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 36px 56px;
                    border-bottom: 1px solid rgba(100,160,210,.08);
                }
                .nav-logo {
                    font-size: 13px;
                    font-weight: 400;
                    letter-spacing: .18em;
                    text-transform: uppercase;
                    color: #C8DCF0;
                }
                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .nav-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    border-radius: 100px;
                    border: 1px solid rgba(100,160,210,.15);
                    background: rgba(100,160,210,.04);
                }
                .nav-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #4FAAFF;
                    box-shadow: 0 0 8px rgba(79,170,255,.6);
                    animation: pulse 2.5s ease-in-out infinite;
                }
                @keyframes pulse { 0%,100%{opacity:.4;transform:scale(.85)} 50%{opacity:1;transform:scale(1)} }
                .nav-pill-text {
                    font-size: 11px;
                    color: #7AABCC;
                    letter-spacing: .06em;
                }

                /* LEFT PANEL */
                .left {
                    padding: 80px 56px 80px 56px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-right: 1px solid rgba(100,160,210,.07);
                    position: relative;
                }

                .eyebrow {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 28px;
                }
                .eyebrow-line {
                    width: 28px;
                    height: 1px;
                    background: rgba(100,160,210,.5);
                }
                .eyebrow-text {
                    font-size: 10px;
                    letter-spacing: .22em;
                    text-transform: uppercase;
                    color: #4A7A9B;
                }

                .headline {
                    font-size: clamp(52px, 6.5vw, 96px);
                    font-weight: 300;
                    letter-spacing: -.04em;
                    line-height: .96;
                    color: #E8F2FC;
                    margin-bottom: 32px;
                }
                .headline em {
                    font-style: normal;
                    color: #7AABCC;
                }

                .subline {
                    font-size: 15px;
                    font-weight: 300;
                    color: #5A86A8;
                    line-height: 1.7;
                    max-width: 440px;
                    margin-bottom: 64px;
                    letter-spacing: .01em;
                }

                /* FEATURE LIST */
                .feat-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    margin-bottom: 64px;
                    max-width: 420px;
                }
                .feat-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 18px 0;
                    border-bottom: 1px solid rgba(100,160,210,.07);
                }
                .feat-item:first-child { border-top: 1px solid rgba(100,160,210,.07); }
                .feat-icon-wrap {
                    width: 36px;
                    height: 36px;
                    border: 1px solid rgba(100,160,210,.2);
                    border-radius: 8px;
                    display: grid;
                    place-items: center;
                    flex-shrink: 0;
                    background: rgba(100,160,210,.04);
                }
                .feat-copy {}
                .feat-title {
                    font-size: 13px;
                    font-weight: 400;
                    color: #C8DCF0;
                    letter-spacing: .01em;
                    display: block;
                    margin-bottom: 2px;
                }
                .feat-desc {
                    font-size: 11px;
                    color: #4A7A9B;
                    letter-spacing: .02em;
                    display: block;
                }

                /* STATS ROW */
                .stats {
                    display: flex;
                    gap: 40px;
                }
                .stat-num {
                    font-size: 28px;
                    font-weight: 300;
                    letter-spacing: -.03em;
                    color: #C8DCF0;
                    display: block;
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .stat-label {
                    font-size: 10px;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    color: #3A6A8A;
                    display: block;
                }
                .stat-divider {
                    width: 1px;
                    background: rgba(100,160,210,.1);
                    align-self: stretch;
                }

                /* RIGHT PANEL */
                .right {
                    padding: 80px 56px 80px 72px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                }

                /* WAVEFORM */
                .waveform {
                    margin-bottom: 52px;
                    opacity: .55;
                }

                /* SIGN IN CARD */
                .card {
                    background: rgba(8,14,22,.7);
                    border: 1px solid rgba(100,160,210,.13);
                    border-radius: 4px;
                    padding: 48px 44px;
                    backdrop-filter: blur(32px);
                    box-shadow: 0 32px 80px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04);
                    position: relative;
                    overflow: hidden;
                }
                .card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(100,160,210,.3), transparent);
                }

                .card-heading {
                    font-size: 22px;
                    font-weight: 300;
                    letter-spacing: -.02em;
                    color: #E8F2FC;
                    margin-bottom: 6px;
                }
                .card-sub {
                    font-size: 12px;
                    color: #3A6A8A;
                    letter-spacing: .04em;
                    margin-bottom: 36px;
                }

                .google-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 13px;
                    background: #E8F2FC;
                    color: #060A10;
                    border: none;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    font-family: inherit;
                    letter-spacing: .02em;
                    border-radius: 2px;
                    transition: background .2s, transform .12s;
                }
                .google-btn:hover:not(:disabled) { background: #fff; }
                .google-btn:active:not(:disabled) { transform: scale(.99); }
                .google-btn:disabled { opacity: .55; cursor: not-allowed; }

                .divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 22px 0;
                }
                .divider-line { flex: 1; height: 1px; background: rgba(100,160,210,.1); }
                .divider-text { font-size: 10px; color: #3A6A8A; letter-spacing: .14em; text-transform: uppercase; }

                .inp {
                    width: 100%;
                    display: block;
                    padding: 12px 14px;
                    background: rgba(4,8,14,.8);
                    border: 1px solid rgba(100,160,210,.13);
                    border-radius: 2px;
                    color: #C8DCF0;
                    font-size: 13px;
                    margin-bottom: 10px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color .2s;
                }
                .inp::placeholder { color: #2A5A7A; }
                .inp:focus { border-color: rgba(100,160,210,.38); }

                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid rgba(100,160,210,.22);
                    border-radius: 2px;
                    color: #7AABCC;
                    font-size: 13px;
                    cursor: pointer;
                    font-family: inherit;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    margin-top: 2px;
                    transition: border-color .2s, color .2s, background .2s;
                }
                .submit-btn:hover { border-color: rgba(100,160,210,.5); color: #C8DCF0; background: rgba(100,160,210,.04); }

                .card-foot {
                    font-size: 11px;
                    color: #2A5A7A;
                    text-align: center;
                    margin-top: 24px;
                }
                .card-foot button {
                    background: none; border: none; color: #5A86A8; cursor: pointer;
                    font-size: 11px; font-family: inherit; padding: 0; transition: color .2s;
                }
                .card-foot button:hover { color: #C8DCF0; }

                .error-msg { font-size: 11px; color: #cc6666; text-align: center; margin-bottom: 14px; }

                /* BOTTOM STRIP */
                .bottom-strip {
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 56px;
                    border-top: 1px solid rgba(100,160,210,.07);
                }
                .bottom-left {
                    font-size: 10px;
                    letter-spacing: .14em;
                    text-transform: uppercase;
                    color: #2A4A6A;
                }
                .bottom-right {
                    display: flex;
                    gap: 28px;
                }
                .bottom-link {
                    font-size: 10px;
                    letter-spacing: .1em;
                    color: #2A4A6A;
                    text-decoration: none;
                    cursor: pointer;
                    transition: color .2s;
                }
                .bottom-link:hover { color: #5A86A8; }

                /* VERTICAL LABEL */
                .vert-label {
                    position: absolute;
                    right: -24px;
                    top: 50%;
                    transform: translateY(-50%) rotate(90deg);
                    font-size: 9px;
                    letter-spacing: .24em;
                    text-transform: uppercase;
                    color: rgba(100,160,210,.2);
                    white-space: nowrap;
                }

                @media (max-width: 900px) {
                    .shell { grid-template-columns: 1fr; }
                    .left { border-right: none; border-bottom: 1px solid rgba(100,160,210,.07); padding: 60px 28px 52px; }
                    .right { padding: 52px 28px 60px; }
                    .nav { padding: 24px 28px; }
                    .bottom-strip { padding: 18px 28px; flex-direction: column; gap: 12px; text-align: center; }
                    .stats { gap: 24px; }
                    .headline { font-size: clamp(44px, 11vw, 64px); }
                }
            `}</style>

            {/* BG LAYERS */}
            <div className="noise" />
            <div className="grid-bg" />
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="shell">

                {/* ── NAV ── */}
                <nav className="nav">
                    <span className="nav-logo">Quietcasts</span>
                    <div className="nav-right">
                        <div className="nav-pill">
                            <div className="nav-dot" />
                            <span className="nav-pill-text">Now available</span>
                        </div>
                    </div>
                </nav>

                {/* ── LEFT ── */}
                <div className="left">
                    <div className="vert-label">Quietcasts — v1.0</div>

                    <div className="eyebrow">
                        <div className="eyebrow-line" />
                        <span className="eyebrow-text">Premium podcast experience</span>
                    </div>

                    <h1 className="headline">
                        Quiet.<br />
                        <em>Precise.</em><br />
                        Deep.
                    </h1>

                    <p className="subline">
                        A podcast platform built for listeners who think. No algorithmic noise, no dark patterns — just your subscriptions, your history, your stories.
                    </p>

                    <div className="feat-list">
                        <div className="feat-item">
                            <div className="feat-icon-wrap">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="5.5" stroke="#7AABCC" strokeWidth="1.2" />
                                    <circle cx="8" cy="8" r="2.5" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="8" y1="2" x2="8" y2="4.5" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="8" y1="11.5" x2="8" y2="14" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="2" y1="8" x2="4.5" y2="8" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="11.5" y1="8" x2="14" y2="8" stroke="#7AABCC" strokeWidth="1.2" />
                                </svg>
                            </div>
                            <div className="feat-copy">
                                <span className="feat-title">Discover</span>
                                <span className="feat-desc">Search the full Apple Podcasts catalogue</span>
                            </div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-icon-wrap">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 2h10v12H3z" stroke="#7AABCC" strokeWidth="1.2" strokeLinejoin="round" />
                                    <line x1="5.5" y1="5.5" x2="10.5" y2="5.5" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="#7AABCC" strokeWidth="1.2" />
                                    <line x1="5.5" y1="10.5" x2="8.5" y2="10.5" stroke="#7AABCC" strokeWidth="1.2" />
                                </svg>
                            </div>
                            <div className="feat-copy">
                                <span className="feat-title">Save & sync</span>
                                <span className="feat-desc">Offline downloads, cross-device progress</span>
                            </div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-icon-wrap">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="5.5" stroke="#7AABCC" strokeWidth="1.2" />
                                    <polygon points="7,5.5 12,8 7,10.5" fill="#7AABCC" opacity=".8" />
                                </svg>
                            </div>
                            <div className="feat-copy">
                                <span className="feat-title">Listen anywhere</span>
                                <span className="feat-desc">Variable speed, queue, sleep timer</span>
                            </div>
                        </div>
                    </div>

                    <div className="stats">
                        <div>
                            <span className="stat-num">∞</span>
                            <span className="stat-label">Podcasts</span>
                        </div>
                        <div className="stat-divider" />
                        <div>
                            <span className="stat-num">100%</span>
                            <span className="stat-label">Your data</span>
                        </div>
                        <div className="stat-divider" />
                        <div>
                            <span className="stat-num">0</span>
                            <span className="stat-label">Ads</span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT ── */}
                <div className="right">
                    {/* Waveform decoration */}
                    <div className="waveform">
                        <svg viewBox="0 0 460 56" width="460" height="56" style={{ maxWidth: '100%' }} aria-hidden>
                            <defs>
                                <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#7AABCC" stopOpacity="0" />
                                    <stop offset="20%" stopColor="#7AABCC" stopOpacity=".7" />
                                    <stop offset="80%" stopColor="#7AABCC" stopOpacity=".7" />
                                    <stop offset="100%" stopColor="#7AABCC" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* waveform bars */}
                            {[4,8,14,20,10,28,18,36,22,42,28,38,20,32,18,26,34,20,28,16,38,24,44,30,42,26,36,20,28,14,22,10,18,8,12,6,16,10,20,14,26,18,22,14,18,10,14,8,10,6,8,4,6,3,8,5,10,7].map((h, i) => (
                                <rect
                                    key={i}
                                    x={i * 8 + 2}
                                    y={(56 - h) / 2}
                                    width="4"
                                    height={h}
                                    rx="2"
                                    fill="url(#wg)"
                                    opacity={0.5 + Math.abs(Math.sin(i * 0.4)) * 0.5}
                                />
                            ))}
                        </svg>
                    </div>

                    {/* Sign-in card */}
                    <div className="card">
                        <h2 className="card-heading">Welcome to Quietcasts.</h2>
                        <p className="card-sub">Your listening space, uninterrupted.</p>

                        {loginError && <p className="error-msg">{loginError}</p>}

                        <button className="google-btn" onClick={() => void handleGoogle()} disabled={isLoading}>
                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Signing in…' : 'Continue with Google'}
                        </button>

                        <div className="divider">
                            <div className="divider-line" />
                            <span className="divider-text">or</span>
                            <div className="divider-line" />
                        </div>

                        <input className="inp" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                        <input className="inp" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="submit-btn">Sign in</button>

                        <p className="card-foot">
                            Don't have an account?{' '}
                            <button>Create one</button>
                        </p>
                    </div>
                </div>

                {/* ── BOTTOM STRIP ── */}
                <footer className="bottom-strip">
                    <span className="bottom-left">© 2026 Quietcasts</span>
                    <div className="bottom-right">
                        <span className="bottom-link">Privacy</span>
                        <span className="bottom-link">Terms</span>
                        <span className="bottom-link">Support</span>
                    </div>
                </footer>

            </div>
        </div>
    )
}
