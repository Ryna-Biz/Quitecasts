import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface EpisodePreview {
    id: string
    title: string
    showName: string
    category: string
    duration: string
    audioUrl: string
    image: string
}

const FEATURED_PODCASTS: EpisodePreview[] = [
    {
        id: 'ep-1',
        title: 'Market Research vs Design Intuition',
        showName: 'Signal Path',
        category: 'Technology & Design',
        duration: '28:40',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
        image: '/creator-man.jpg',
    },
    {
        id: 'ep-2',
        title: 'Calm Focus in High-Pressure Situations',
        showName: 'Mindful Horizons',
        category: 'Mindset & Health',
        duration: '34:15',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
        image: '/creator-headphones.jpg',
    },
    {
        id: 'ep-3',
        title: 'Unlocking Creative Flow Every Morning',
        showName: 'The Studio Journal',
        category: 'Creative Thinking',
        duration: '22:50',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
        image: '/creator-woman.jpg',
    },
]

const PLAYER_HIGHLIGHT_TRACKS = [
    {
        id: 'track-1',
        title: 'Deep Work & Acoustic Clarity',
        author: 'Dr. Arthur Vance',
        duration: '14:20 min',
        iconBg: '#7A3EF8',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
    },
    {
        id: 'track-2',
        title: 'The Architecture of Thought',
        author: 'Elena Ray & Team',
        duration: '19:45 min',
        iconBg: '#00C8FF',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
    },
]

const RECENT_EPISODES = [
    {
        id: 'rec-1',
        title: 'The Science of Quiet: Why Solitude Powers Big Ideas',
        show: 'Acoustic Minds',
        duration: '21:10',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
    },
    {
        id: 'rec-2',
        title: 'Building Products You Barely Notice: The Disappearing UI',
        show: 'Minimal Tech',
        duration: '27:40',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=480&q=80',
        audioUrl: 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3',
    },
]

interface LandingProps {
    onExploreGuest?: () => void
}

export function Landing({ onExploreGuest }: LandingProps) {
    const { login } = useAuth()
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Real Audio Preview Engine
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const audio = new Audio()
        audio.addEventListener('ended', () => {
            setIsPlaying(false)
            setCurrentPlayingId(null)
        })
        audioRef.current = audio
        return () => {
            audio.pause()
            audioRef.current = null
        }
    }, [])

    const togglePlay = (id: string, url: string) => {
        if (!audioRef.current) return
        if (currentPlayingId === id && isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.src = url
            audioRef.current.play().then(() => {
                setCurrentPlayingId(id)
                setIsPlaying(true)
            }).catch(() => {
                setCurrentPlayingId(id)
                setIsPlaying(true)
            })
        }
    }

    const handleGoogle = async () => {
        setIsLoading(true)
        setLoginError('')
        try {
            await login()
        } catch {
            setLoginError('Sign in failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const openAuth = (mode: 'signin' | 'signup' = 'signup') => {
        setAuthMode(mode)
        setLoginError('')
        setIsAuthModalOpen(true)
    }

    return (
        <div className="qc-page">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                *, *::before, *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :root {
                    --qc-purple: #5E2CE8;
                    --qc-purple-hover: #4e20d1;
                    --qc-purple-light: #F1ECFE;
                    --qc-amber: #FFB800;
                    --qc-amber-hover: #f0ac00;
                    --qc-dark: #1D133D;
                    --qc-text-dark: #221844;
                    --qc-text-muted: #736B92;
                    --qc-border: #E8E2F6;
                    --qc-bg-page: #FBF9FE;
                    --qc-white: #FFFFFF;
                }

                html, body {
                    background: var(--qc-bg-page);
                    color: var(--qc-text-dark);
                    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                }

                .qc-page {
                    min-height: 100vh;
                    background: var(--qc-bg-page);
                    position: relative;
                }

                /* CONTAINER */
                .qc-container {
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 0 32px;
                }

                /* ── NAVBAR ── */
                .qc-header {
                    position: relative;
                    z-index: 50;
                    background: transparent;
                }
                .qc-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 90px;
                }
                .qc-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    cursor: pointer;
                }
                .qc-logo-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(94, 44, 232, 0.32);
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .qc-logo-icon-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .qc-logo-brand {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: 24px;
                    letter-spacing: -0.02em;
                    color: var(--qc-text-dark);
                }
                .qc-logo-brand span {
                    color: var(--qc-purple);
                }

                .qc-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 36px;
                    list-style: none;
                }
                .qc-nav-link {
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--qc-text-muted);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    cursor: pointer;
                }
                .qc-nav-link:hover, .qc-nav-link.active {
                    color: var(--qc-text-dark);
                    font-weight: 600;
                }

                .qc-nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .qc-btn-signin {
                    background: none;
                    border: none;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--qc-text-dark);
                    cursor: pointer;
                    padding: 8px 16px;
                    border-radius: 999px;
                    transition: color 0.2s ease;
                }
                .qc-btn-signin:hover {
                    color: var(--qc-purple);
                }
                .qc-btn-pill-purple {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--qc-purple);
                    color: #FFFFFF;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 12px 30px;
                    border-radius: 999px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                    box-shadow: 0 6px 18px rgba(94, 44, 232, 0.32);
                    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .qc-btn-pill-purple:hover {
                    background: var(--qc-purple-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 24px rgba(94, 44, 232, 0.42);
                }

                /* ── HERO SECTION ── */
                .qc-hero {
                    position: relative;
                    padding: 24px 0 80px;
                }
                .qc-hero-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 40px;
                    align-items: center;
                }

                .qc-hero-left {
                    max-width: 580px;
                }
                .qc-hero-pill-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--qc-purple-light);
                    color: var(--qc-purple);
                    font-size: 12px;
                    font-weight: 700;
                    padding: 6px 16px;
                    border-radius: 999px;
                    margin-bottom: 20px;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }
                .qc-hero-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 900;
                    font-size: clamp(48px, 6vw, 76px);
                    line-height: 1.02;
                    letter-spacing: -0.03em;
                    color: var(--qc-text-dark);
                    margin-bottom: 24px;
                    text-transform: uppercase;
                }
                .qc-hero-title .highlight {
                    display: block;
                    color: var(--qc-purple);
                }
                .qc-hero-desc {
                    font-size: 17px;
                    line-height: 1.65;
                    color: var(--qc-text-muted);
                    margin-bottom: 36px;
                    max-width: 490px;
                }

                .qc-hero-cta-row {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-bottom: 56px;
                    flex-wrap: wrap;
                }
                .qc-btn-amber {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background: var(--qc-amber);
                    color: #17112E;
                    font-family: inherit;
                    font-size: 16px;
                    font-weight: 700;
                    padding: 16px 36px;
                    border-radius: 999px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 10px 24px rgba(255, 184, 0, 0.4);
                    transition: all 0.25s ease;
                }
                .qc-btn-amber:hover {
                    background: var(--qc-amber-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 14px 28px rgba(255, 184, 0, 0.5);
                }
                .qc-btn-outline {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background: var(--qc-white);
                    color: var(--qc-text-dark);
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 14px 28px;
                    border-radius: 999px;
                    border: 1.5px solid var(--qc-border);
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                    transition: all 0.2s ease;
                }
                .qc-btn-outline:hover {
                    border-color: var(--qc-purple);
                    color: var(--qc-purple);
                    transform: translateY(-2px);
                }

                /* Listener feature badges */
                .qc-platforms {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                    flex-wrap: wrap;
                }
                .qc-platform-pill {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .qc-plat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                .qc-plat-icon.purple { background: #8E24AA; color: #fff; }
                .qc-plat-icon.green { background: #1DB954; color: #fff; }
                .qc-plat-icon.blue { background: #3B82F6; color: #fff; }
                .qc-plat-text {
                    display: flex;
                    flex-direction: column;
                }
                .qc-plat-label {
                    font-size: 11px;
                    color: #9C95B5;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                }
                .qc-plat-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                }

                /* ── HERO RIGHT GRAPHIC ── */
                .qc-hero-right {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .qc-hero-card {
                    position: relative;
                    width: 100%;
                    max-width: 460px;
                    height: 520px;
                    background: linear-gradient(160deg, #6230E8 0%, #4B1AC9 100%);
                    border-radius: 0 0 160px 0;
                    box-shadow: 0 32px 64px rgba(75, 26, 201, 0.28);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* Yellow inner sun portal */
                .qc-hero-sun {
                    position: absolute;
                    width: 340px;
                    height: 340px;
                    background: linear-gradient(135deg, #FFD15C 0%, #FFB800 100%);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 16px 40px rgba(255, 184, 0, 0.3);
                }
                /* Girl listening with headphones */
                .qc-hero-girl-frame {
                    position: absolute;
                    bottom: 0;
                    width: 380px;
                    height: 480px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    pointer-events: none;
                }
                .qc-hero-girl-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center top;
                    border-radius: 120px 120px 0 0;
                    mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, black 88%, transparent 100%);
                }

                /* Floating Player Widget */
                .qc-floating-player {
                    position: absolute;
                    bottom: -24px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 410px;
                    background: rgba(255, 255, 255, 0.96);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    padding: 14px 20px;
                    box-shadow: 0 16px 36px rgba(29, 19, 61, 0.16);
                    border: 1px solid rgba(232, 226, 246, 0.9);
                    z-index: 20;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .qc-fp-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .qc-fp-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .qc-fp-indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #10B981;
                    box-shadow: 0 0 10px #10B981;
                }
                .qc-fp-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                }
                .qc-fp-sub {
                    font-size: 11px;
                    color: var(--qc-text-muted);
                }
                .qc-fp-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: var(--qc-purple);
                    color: #fff;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(94, 44, 232, 0.35);
                    transition: transform 0.2s ease;
                }
                .qc-fp-btn:hover {
                    transform: scale(1.08);
                }
                /* Waveform equalizer */
                .qc-fp-wave {
                    display: flex;
                    align-items: flex-end;
                    gap: 4px;
                    height: 24px;
                }
                .qc-fp-wave-bar {
                    flex: 1;
                    background: linear-gradient(to top, var(--qc-purple), #A78BFA);
                    border-radius: 999px;
                    animation: wavePulse 1.2s ease-in-out infinite alternate;
                }
                @keyframes wavePulse {
                    0% { height: 4px; opacity: 0.3; }
                    100% { height: 22px; opacity: 1; }
                }

                .qc-floating-badge {
                    position: absolute;
                    top: 24px;
                    left: -20px;
                    background: #FFFFFF;
                    padding: 10px 18px;
                    border-radius: 999px;
                    box-shadow: 0 12px 28px rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                    border: 1px solid var(--qc-border);
                    z-index: 12;
                    animation: floatY 4s ease-in-out infinite alternate;
                }
                @keyframes floatY {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-8px); }
                }

                /* ── SECTION 2: TRENDING SHOWS IN THE PLAYER ── */
                .qc-section {
                    padding: 80px 0;
                }
                .qc-section-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: clamp(28px, 3.5vw, 42px);
                    color: var(--qc-text-dark);
                    margin-bottom: 36px;
                    letter-spacing: -0.02em;
                }

                .qc-creators-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }
                .qc-creator-card {
                    background: var(--qc-white);
                    border: 1.5px solid var(--qc-border);
                    border-radius: 20px;
                    padding: 22px;
                    display: flex;
                    gap: 18px;
                    align-items: center;
                    box-shadow: 0 6px 20px rgba(31, 21, 59, 0.04);
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .qc-creator-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(94, 44, 232, 0.35);
                    box-shadow: 0 16px 36px rgba(94, 44, 232, 0.12);
                }
                .qc-creator-thumb {
                    width: 90px;
                    height: 90px;
                    border-radius: 14px;
                    object-fit: cover;
                    flex-shrink: 0;
                }
                .qc-creator-info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-width: 0;
                }
                .qc-creator-tag {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--qc-purple);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    margin-bottom: 4px;
                }
                .qc-creator-card-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                    line-height: 1.35;
                    margin-bottom: 6px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .qc-creator-card-desc {
                    font-size: 12px;
                    line-height: 1.45;
                    color: var(--qc-text-muted);
                    margin-bottom: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .qc-btn-listen {
                    align-self: flex-start;
                    background: var(--qc-purple-light);
                    color: var(--qc-purple);
                    border: none;
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 7px 16px;
                    border-radius: 999px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                }
                .qc-btn-listen:hover {
                    background: var(--qc-purple);
                    color: #FFFFFF;
                }
                .qc-btn-listen.playing {
                    background: var(--qc-purple);
                    color: #FFFFFF;
                }

                /* ── SECTION 3: CRAFTED FOR LISTENERS ── */
                .qc-showcase {
                    padding: 90px 0;
                    background: linear-gradient(180deg, transparent 0%, rgba(240, 235, 254, 0.45) 100%);
                    border-radius: 36px;
                    margin: 40px 0;
                }
                .qc-showcase-grid {
                    display: grid;
                    grid-template-columns: 0.95fr 1.05fr;
                    gap: 64px;
                    align-items: center;
                }
                .qc-portrait-wrap {
                    position: relative;
                    display: flex;
                    justify-content: center;
                }
                .qc-portrait-circle {
                    width: 380px;
                    height: 380px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 8px solid #FFFFFF;
                    box-shadow: 0 24px 56px rgba(31, 21, 59, 0.12);
                    position: relative;
                }
                .qc-portrait-circle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .qc-portrait-badge {
                    position: absolute;
                    bottom: 24px;
                    right: 20px;
                    background: #FFFFFF;
                    padding: 12px 20px;
                    border-radius: 18px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border: 1px solid var(--qc-border);
                }
                .qc-portrait-stars {
                    color: #FFB800;
                    font-size: 14px;
                }
                .qc-portrait-badge-text {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                }

                .qc-showcase-content {
                    max-width: 560px;
                }
                .qc-showcase-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: clamp(32px, 4vw, 46px);
                    line-height: 1.15;
                    color: var(--qc-text-dark);
                    margin-bottom: 20px;
                    letter-spacing: -0.02em;
                }
                .qc-showcase-desc {
                    font-size: 16px;
                    line-height: 1.7;
                    color: var(--qc-text-muted);
                    margin-bottom: 36px;
                }

                /* Stats Row */
                .qc-stats-row {
                    display: flex;
                    align-items: center;
                    gap: 52px;
                    margin-bottom: 40px;
                    padding-bottom: 32px;
                    border-bottom: 1.5px solid var(--qc-border);
                }
                .qc-stat-val {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: 38px;
                    color: var(--qc-text-dark);
                    line-height: 1;
                    margin-bottom: 6px;
                }
                .qc-stat-lbl {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--qc-text-muted);
                }

                /* Mini track bars */
                .qc-mini-tracks {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .qc-mini-track {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: var(--qc-white);
                    padding: 14px 22px;
                    border-radius: 16px;
                    border: 1px solid var(--qc-border);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.03);
                    transition: all 0.2s ease;
                }
                .qc-mini-track:hover {
                    border-color: var(--qc-purple);
                    transform: translateX(4px);
                }
                .qc-mini-track-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .qc-mini-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    flex-shrink: 0;
                }
                .qc-mini-meta {
                    display: flex;
                    flex-direction: column;
                }
                .qc-mini-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                }
                .qc-mini-author {
                    font-size: 12px;
                    color: var(--qc-text-muted);
                }
                .qc-mini-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .qc-mini-time {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--qc-text-muted);
                }
                .qc-mini-play-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: var(--qc-purple-light);
                    color: var(--qc-purple);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .qc-mini-play-btn:hover {
                    background: var(--qc-purple);
                    color: #fff;
                }

                /* ── SECTION 4: RECENT EPISODES & PLAYER SANCTUM BANNER ── */
                .qc-recent-grid {
                    display: grid;
                    grid-template-columns: 1.15fr 0.85fr;
                    gap: 36px;
                    align-items: stretch;
                }
                .qc-recent-left {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }
                .qc-recent-subgrid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .qc-recent-card {
                    background: var(--qc-white);
                    border: 1.5px solid var(--qc-border);
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.03);
                    transition: all 0.25s ease;
                    display: flex;
                    flex-direction: column;
                }
                .qc-recent-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(94, 44, 232, 0.35);
                }
                .qc-recent-card-img {
                    width: 100%;
                    height: 140px;
                    object-fit: cover;
                }
                .qc-recent-card-body {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    justify-content: space-between;
                }
                .qc-recent-card-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                    margin-bottom: 12px;
                    line-height: 1.35;
                }
                .qc-recent-listen-link {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--qc-purple);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    cursor: pointer;
                }
                .qc-recent-listen-link:hover {
                    text-decoration: underline;
                }

                /* Player Feature Highlight Banner */
                .qc-player-banner {
                    background: linear-gradient(135deg, #FFDE94 0%, #FFC152 100%);
                    border-radius: 24px;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 16px 36px rgba(255, 193, 82, 0.25);
                }
                .qc-comm-badge {
                    display: inline-block;
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(8px);
                    padding: 6px 14px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #7A4A00;
                    margin-bottom: 16px;
                }
                .qc-comm-title {
                    font-family: 'Outfit', sans-serif;
                    font-weight: 800;
                    font-size: 26px;
                    line-height: 1.2;
                    color: #382400;
                    margin-bottom: 16px;
                    max-width: 280px;
                }
                .qc-comm-img-frame {
                    width: 100%;
                    height: 220px;
                    border-radius: 18px;
                    overflow: hidden;
                    margin-top: 16px;
                    border: 4px solid rgba(255, 255, 255, 0.6);
                }
                .qc-comm-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* ── SECTION 5: TESTIMONIALS (WHAT LISTENERS SAY) ── */
                .qc-testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 28px;
                }
                .qc-quote-card {
                    background: var(--qc-white);
                    border: 1.5px solid var(--qc-border);
                    border-radius: 20px;
                    padding: 32px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.03);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.2s ease;
                }
                .qc-quote-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(94, 44, 232, 0.35);
                }
                .qc-quote-body {
                    font-size: 15px;
                    line-height: 1.65;
                    color: var(--qc-text-dark);
                    margin-bottom: 24px;
                    font-style: italic;
                }
                .qc-quote-author {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .qc-author-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .qc-author-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    object-fit: cover;
                    background: var(--qc-purple-light);
                }
                .qc-author-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                }
                .qc-author-role {
                    font-size: 12px;
                    color: var(--qc-text-muted);
                }
                .qc-quote-stars {
                    color: #FFB800;
                    font-size: 14px;
                }

                /* ── FOOTER ── */
                .qc-footer {
                    background: var(--qc-white);
                    border-top: 1.5px solid var(--qc-border);
                    padding: 80px 0 40px;
                    margin-top: 80px;
                }
                .qc-footer-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr 1fr 1fr;
                    gap: 48px;
                    margin-bottom: 60px;
                }
                .qc-footer-brand-desc {
                    font-size: 14px;
                    line-height: 1.65;
                    color: var(--qc-text-muted);
                    margin: 16px 0 24px;
                    max-width: 300px;
                }
                .qc-footer-col-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--qc-text-dark);
                    margin-bottom: 20px;
                }
                .qc-footer-links {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .qc-footer-link {
                    font-size: 14px;
                    color: var(--qc-text-muted);
                    text-decoration: none;
                    transition: color 0.2s ease;
                    cursor: pointer;
                }
                .qc-footer-link:hover {
                    color: var(--qc-purple);
                }

                .qc-footer-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 32px;
                    border-top: 1px solid var(--qc-border);
                    font-size: 13px;
                    color: var(--qc-text-muted);
                }

                /* ── AUTH MODAL ── */
                .qc-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 100;
                    background: rgba(18, 11, 38, 0.6);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .qc-modal-card {
                    background: #FFFFFF;
                    width: 100%;
                    max-width: 440px;
                    border-radius: 28px;
                    padding: 40px;
                    box-shadow: 0 32px 72px rgba(28, 14, 66, 0.28);
                    border: 1px solid var(--qc-border);
                    position: relative;
                    animation: scaleUp 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                @keyframes scaleUp {
                    from { transform: scale(0.94); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .qc-modal-close {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: #F4F1FA;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    font-size: 18px;
                    color: var(--qc-text-dark);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .qc-modal-close:hover {
                    background: #E8E2F6;
                }
                .qc-modal-header {
                    text-align: center;
                    margin-bottom: 28px;
                }
                .qc-modal-logo-icon {
                    width: 62px;
                    height: 62px;
                    margin: 0 auto 16px;
                    border-radius: 17px;
                    box-shadow: 0 10px 28px rgba(94, 44, 232, 0.35);
                    overflow: hidden;
                }
                .qc-modal-logo-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .qc-modal-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 26px;
                    font-weight: 800;
                    color: var(--qc-text-dark);
                    margin-bottom: 8px;
                }
                .qc-modal-subtitle {
                    font-size: 14px;
                    color: var(--qc-text-muted);
                }

                .qc-google-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 14px;
                    background: #FFFFFF;
                    border: 1.5px solid var(--qc-border);
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--qc-text-dark);
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    transition: all 0.2s ease;
                }
                .qc-google-btn:hover:not(:disabled) {
                    background: #FAF8FE;
                    border-color: var(--qc-purple);
                    transform: translateY(-1px);
                }
                .qc-google-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .qc-guest-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: #FAF8FE;
                    border: 1.5px dashed var(--qc-border);
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--qc-purple);
                    cursor: pointer;
                    margin-top: 10px;
                    transition: all 0.2s ease;
                }
                .qc-guest-btn:hover {
                    background: var(--qc-purple-light);
                    border-color: var(--qc-purple);
                }

                .qc-auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin: 22px 0;
                }
                .qc-auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background: var(--qc-border);
                }
                .qc-auth-divider-text {
                    font-size: 12px;
                    font-weight: 600;
                    color: #9C95B5;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .qc-input-group {
                    margin-bottom: 14px;
                }
                .qc-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--qc-text-dark);
                    margin-bottom: 6px;
                }
                .qc-input {
                    width: 100%;
                    padding: 13px 16px;
                    background: #FAF8FE;
                    border: 1.5px solid var(--qc-border);
                    border-radius: 12px;
                    font-size: 14px;
                    font-family: inherit;
                    color: var(--qc-text-dark);
                    outline: none;
                    transition: border-color 0.2s ease;
                }
                .qc-input:focus {
                    border-color: var(--qc-purple);
                    background: #FFFFFF;
                }

                .qc-modal-submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: var(--qc-purple);
                    color: #FFFFFF;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 700;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 20px rgba(94, 44, 232, 0.3);
                    margin-top: 10px;
                    transition: all 0.2s ease;
                }
                .qc-modal-submit-btn:hover {
                    background: var(--qc-purple-hover);
                    transform: translateY(-1px);
                }

                .qc-modal-footer {
                    margin-top: 22px;
                    text-align: center;
                    font-size: 13px;
                    color: var(--qc-text-muted);
                }
                .qc-modal-switch-btn {
                    background: none;
                    border: none;
                    font-family: inherit;
                    font-weight: 700;
                    color: var(--qc-purple);
                    cursor: pointer;
                    margin-left: 4px;
                }
                .qc-modal-switch-btn:hover {
                    text-decoration: underline;
                }

                .qc-error-alert {
                    padding: 10px 14px;
                    background: #FEECEB;
                    border: 1px solid #FDC3C0;
                    border-radius: 8px;
                    color: #D32F2F;
                    font-size: 13px;
                    text-align: center;
                    margin-bottom: 16px;
                }

                /* ── RESPONSIVE RULES ── */
                @media (max-width: 1024px) {
                    .qc-hero-grid {
                        grid-template-columns: 1fr;
                        gap: 60px;
                    }
                    .qc-hero-left {
                        max-width: 100%;
                        text-align: center;
                    }
                    .qc-hero-desc {
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .qc-hero-cta-row {
                        justify-content: center;
                    }
                    .qc-platforms {
                        justify-content: center;
                    }
                    .qc-creators-grid {
                        grid-template-columns: 1fr;
                    }
                    .qc-showcase-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                        text-align: center;
                    }
                    .qc-stats-row {
                        justify-content: center;
                    }
                    .qc-recent-grid {
                        grid-template-columns: 1fr;
                    }
                    .qc-footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 36px;
                    }
                }

                @media (max-width: 768px) {
                    .qc-nav-links {
                        display: none;
                    }
                    .qc-hero-title {
                        font-size: 40px;
                    }
                    .qc-hero-card {
                        height: 420px;
                    }
                    .qc-hero-sun {
                        width: 260px;
                        height: 260px;
                    }
                    .qc-hero-girl-frame {
                        width: 300px;
                        height: 380px;
                    }
                    .qc-recent-subgrid {
                        grid-template-columns: 1fr;
                    }
                    .qc-testimonials-grid {
                        grid-template-columns: 1fr;
                    }
                    .qc-portrait-circle {
                        width: 280px;
                        height: 280px;
                    }
                    .qc-stats-row {
                        gap: 24px;
                    }
                    .qc-stat-val {
                        font-size: 28px;
                    }
                }
            `}</style>

            {/* ── HEADER NAVBAR ── */}
            <header className="qc-header">
                <div className="qc-container">
                    <nav className="qc-nav">
                        <div className="qc-logo" onClick={() => onExploreGuest?.()}>
                            <div className="qc-logo-icon-box">
                                <img src="/logo.svg" alt="Quietcasts Logo" />
                            </div>
                            <span className="qc-logo-brand">Quiet<span>casts</span></span>
                        </div>

                        <ul className="qc-nav-links">
                            <li><a href="#player-hero" className="qc-nav-link active">Home</a></li>
                            <li><a href="#trending-shows" className="qc-nav-link">Trending Shows</a></li>
                            <li><a href="#player-features" className="qc-nav-link">Player Features</a></li>
                            <li><a href="#recent-streams" className="qc-nav-link">Recent Episodes</a></li>
                            <li><a href="#listener-reviews" className="qc-nav-link">Reviews</a></li>
                        </ul>

                        <div className="qc-nav-actions">
                            <button className="qc-btn-signin" onClick={() => openAuth('signin')}>
                                Sign In
                            </button>
                            {onExploreGuest ? (
                                <button className="qc-btn-pill-purple" onClick={onExploreGuest}>
                                    Open Player
                                </button>
                            ) : (
                                <button className="qc-btn-pill-purple" onClick={() => openAuth('signup')}>
                                    Start Listening
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* ── HERO SECTION ── */}
            <section id="player-hero" className="qc-hero">
                <div className="qc-container">
                    <div className="qc-hero-grid">

                        {/* Left column */}
                        <div className="qc-hero-left">
                            <div className="qc-hero-pill-badge">
                                <span>🎧 High-Fidelity Podcast Player</span>
                            </div>

                            <h1 className="qc-hero-title">
                                NEW ERA
                                <span className="highlight">PODCAST PLAYER</span>
                            </h1>

                            <p className="qc-hero-desc">
                                Stream millions of podcasts with crystal-clear audio fidelity. No algorithmic noise, no banner ads, no distractions — just pure sound, seamless offline sync, and a player built for thoughtful listeners.
                            </p>

                            <div className="qc-hero-cta-row">
                                <button
                                    className="qc-btn-amber"
                                    onClick={() => {
                                        if (onExploreGuest) onExploreGuest()
                                        else openAuth('signup')
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Start Listening
                                </button>
                                <button className="qc-btn-outline" onClick={() => handleGoogle()}>
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Sign In with Google
                                </button>
                            </div>

                            {/* Player capability badges */}
                            <div className="qc-platforms">
                                <div className="qc-platform-pill">
                                    <div className="qc-plat-icon purple">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 3a9 9 0 0 0-9 9v4.5A2.5 2.5 0 0 0 5.5 19H7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5v-2a7 7 0 1 1 14 0v2h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5-2.5V12a9 9 0 0 0-9-9z"/>
                                        </svg>
                                    </div>
                                    <div className="qc-plat-text">
                                        <span className="qc-plat-label">Full Directory</span>
                                        <span className="qc-plat-name">Apple Podcasts</span>
                                    </div>
                                </div>

                                <div className="qc-platform-pill">
                                    <div className="qc-plat-icon green">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.792-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.72 1.115.295.18.388.563.208.855zm1.225-2.724c-.226.367-.707.482-1.074.256-2.69-1.653-6.79-2.133-9.972-1.168-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 3.636-1.103 8.163-.568 11.242 1.326.367.226.482.707.256 1.084zm.106-2.835C14.692 8.95 9.37 8.775 6.297 9.71c-.494.15-1.02-.132-1.17-.626-.15-.494.132-1.02.626-1.17 3.532-1.072 9.404-.866 13.115 1.338.445.264.59.838.326 1.282-.264.444-.838.59-1.282.327z"/>
                                        </svg>
                                    </div>
                                    <div className="qc-plat-text">
                                        <span className="qc-plat-label">Offline Ready</span>
                                        <span className="qc-plat-name">Direct Downloads</span>
                                    </div>
                                </div>

                                <div className="qc-platform-pill">
                                    <div className="qc-plat-icon blue">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </div>
                                    <div className="qc-plat-text">
                                        <span className="qc-plat-label">Cloud Sync</span>
                                        <span className="qc-plat-name">All Your Devices</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column (signature girl listening excitedly + player overlay) */}
                        <div className="qc-hero-right">
                            <div className="qc-floating-badge">
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                                <span>Zero Ads • 100% Focused Audio</span>
                            </div>

                            <div className="qc-hero-card">
                                <div className="qc-hero-sun" />
                                <div className="qc-hero-girl-frame">
                                    <img
                                        src="/hero-girl.jpg"
                                        alt="Joyful Podcaster with yellow headphones"
                                        className="qc-hero-girl-img"
                                    />
                                </div>

                                {/* Floating interactive player widget */}
                                <div className="qc-floating-player">
                                    <div className="qc-fp-top">
                                        <div className="qc-fp-meta">
                                            <div className="qc-fp-indicator" />
                                            <div>
                                                <div className="qc-fp-title">The Long View • Jonas Reed</div>
                                                <div className="qc-fp-sub">Ep. 12: Maps that changed the world</div>
                                            </div>
                                        </div>
                                        <button
                                            className="qc-fp-btn"
                                            onClick={() => togglePlay('hero-player', 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3')}
                                            title={isPlaying && currentPlayingId === 'hero-player' ? 'Pause' : 'Play Preview'}
                                        >
                                            {isPlaying && currentPlayingId === 'hero-player' ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <rect x="6" y="4" width="4" height="16" />
                                                    <rect x="14" y="4" width="4" height="16" />
                                                </svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Equalizer animation */}
                                    <div className="qc-fp-wave">
                                        {[10, 22, 14, 28, 18, 24, 12, 26, 20, 30, 16, 22, 28, 14, 24, 12, 20, 16, 26, 14].map((h, i) => (
                                            <div
                                                key={i}
                                                className="qc-fp-wave-bar"
                                                style={{
                                                    height: `${isPlaying && currentPlayingId === 'hero-player' ? h : 4}px`,
                                                    animationPlayState: isPlaying && currentPlayingId === 'hero-player' ? 'running' : 'paused',
                                                    animationDelay: `${(i % 6) * 0.12}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── SECTION 2: TRENDING SHOWS & EPISODES ── */}
            <section id="trending-shows" className="qc-section">
                <div className="qc-container">
                    <h2 className="qc-section-title">Trending Shows in the Player</h2>

                    <div className="qc-creators-grid">
                        {FEATURED_PODCASTS.map((ep) => {
                            const active = currentPlayingId === ep.id && isPlaying
                            return (
                                <div key={ep.id} className="qc-creator-card">
                                    <img src={ep.image} alt={ep.title} className="qc-creator-thumb" />
                                    <div className="qc-creator-info">
                                        <span className="qc-creator-tag">{ep.category}</span>
                                        <h3 className="qc-creator-card-title">{ep.title}</h3>
                                        <p className="qc-creator-card-desc">
                                            {ep.showName} • {ep.duration} min
                                        </p>
                                        <button
                                            className={`qc-btn-listen ${active ? 'playing' : ''}`}
                                            onClick={() => togglePlay(ep.id, ep.audioUrl)}
                                        >
                                            {active ? (
                                                <>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <rect x="6" y="4" width="4" height="16" />
                                                        <rect x="14" y="4" width="4" height="16" />
                                                    </svg>
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                        <polygon points="5 3 19 12 5 21 5 3" />
                                                    </svg>
                                                    Play Episode
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: CRAFTED FOR LISTENERS ── */}
            <section id="player-features" className="qc-showcase">
                <div className="qc-container">
                    <div className="qc-showcase-grid">

                        {/* Left Portrait */}
                        <div className="qc-portrait-wrap">
                            <div className="qc-portrait-circle">
                                <img src="/host-portrait.jpg" alt="Immersed Listener" />
                            </div>
                            <div className="qc-portrait-badge">
                                <span className="qc-portrait-stars">★★★★★</span>
                                <span className="qc-portrait-badge-text">Audiophile Grade Player</span>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="qc-showcase-content">
                            <h2 className="qc-showcase-title">
                                Engineered For The Way<br />
                                You Actually Listen
                            </h2>
                            <p className="qc-showcase-desc">
                                Traditional podcast apps bombard you with sponsors, bloated recommendation feeds, and sluggish playback. Quietcasts strips away the clutter so you can focus entirely on the voice in your ears.
                            </p>

                            {/* Stats */}
                            <div className="qc-stats-row">
                                <div className="qc-stat-item">
                                    <div className="qc-stat-val">4M+</div>
                                    <div className="qc-stat-lbl">Episodes Indexed</div>
                                </div>
                                <div className="qc-stat-item">
                                    <div className="qc-stat-val">0</div>
                                    <div className="qc-stat-lbl">Ad Tracking</div>
                                </div>
                                <div className="qc-stat-item">
                                    <div className="qc-stat-val">100%</div>
                                    <div className="qc-stat-lbl">Private & Focused</div>
                                </div>
                            </div>

                            {/* Mini Player Tracks */}
                            <div className="qc-mini-tracks">
                                {PLAYER_HIGHLIGHT_TRACKS.map((track) => {
                                    const active = currentPlayingId === track.id && isPlaying
                                    return (
                                        <div key={track.id} className="qc-mini-track">
                                            <div className="qc-mini-track-left">
                                                <div className="qc-mini-icon" style={{ background: track.iconBg }}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                                    </svg>
                                                </div>
                                                <div className="qc-mini-meta">
                                                    <span className="qc-mini-title">{track.title}</span>
                                                    <span className="qc-mini-author">{track.author}</span>
                                                </div>
                                            </div>
                                            <div className="qc-mini-right">
                                                <span className="qc-mini-time">{track.duration}</span>
                                                <button
                                                    className="qc-mini-play-btn"
                                                    onClick={() => togglePlay(track.id, track.audioUrl)}
                                                    title={active ? 'Pause' : 'Play'}
                                                >
                                                    {active ? (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                            <rect x="6" y="4" width="4" height="16" />
                                                            <rect x="14" y="4" width="4" height="16" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                            <polygon points="5 3 19 12 5 21 5 3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── SECTION 4: RECENT PODCAST EPISODES & FEATURE BANNER ── */}
            <section id="recent-streams" className="qc-section">
                <div className="qc-container">
                    <h2 className="qc-section-title">Stream Recent Episodes</h2>

                    <div className="qc-recent-grid">

                        {/* Recent cards */}
                        <div className="qc-recent-left">
                            <div className="qc-recent-subgrid">
                                {RECENT_EPISODES.map((ep) => (
                                    <div key={ep.id} className="qc-recent-card">
                                        <img src={ep.image} alt={ep.title} className="qc-recent-card-img" />
                                        <div className="qc-recent-card-body">
                                            <h4 className="qc-recent-card-title">{ep.title}</h4>
                                            <span
                                                className="qc-recent-listen-link"
                                                onClick={() => togglePlay(ep.id, ep.audioUrl)}
                                            >
                                                {currentPlayingId === ep.id && isPlaying ? 'Pause Episode ⏸' : 'Play Now →'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Additional track list item */}
                            <div className="qc-mini-track" style={{ padding: '18px 24px' }}>
                                <div className="qc-mini-track-left">
                                    <div className="qc-mini-icon" style={{ background: '#FF4D6D' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                    </div>
                                    <div className="qc-mini-meta">
                                        <span className="qc-mini-title">The Art of Mindful Conversation</span>
                                        <span className="qc-mini-author">Studio Lantern • Episode #42</span>
                                    </div>
                                </div>
                                <div className="qc-mini-right">
                                    <span className="qc-mini-time">24:10 min</span>
                                    <button
                                        className="qc-btn-listen"
                                        onClick={() => togglePlay('mindful', 'https://storage.googleapis.com/coverr-main/mp3/Mt_Baker.mp3')}
                                    >
                                        {currentPlayingId === 'mindful' && isPlaying ? 'Pause' : 'Play Now'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Player Experience Showcase Banner */}
                        <div className="qc-player-banner">
                            <div>
                                <span className="qc-comm-badge">Focused Listening</span>
                                <h3 className="qc-comm-title">A quiet player built for thoughtful ears</h3>
                            </div>
                            <div className="qc-comm-img-frame">
                                <img src="/creator-green.jpg" alt="Listener with headphones" className="qc-comm-img" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── SECTION 5: TESTIMONIALS (WHAT LISTENERS SAY) ── */}
            <section id="listener-reviews" className="qc-section">
                <div className="qc-container">
                    <h2 className="qc-section-title">What Listeners Say</h2>

                    <div className="qc-testimonials-grid">
                        <div className="qc-quote-card">
                            <p className="qc-quote-body">
                                “Quietcasts is the only podcast player that doesn't feel like a noisy social media feed. The audio quality is immaculate, and the interface never gets between me and the episode.”
                            </p>
                            <div className="qc-quote-author">
                                <div className="qc-author-info">
                                    <img src="/creator-man.jpg" alt="Devon Lane" className="qc-author-avatar" />
                                    <div>
                                        <div className="qc-author-name">Devon Lane</div>
                                        <div className="qc-author-role">Software Architect & Daily Commuter</div>
                                    </div>
                                </div>
                                <span className="qc-quote-stars">★★★★★</span>
                            </div>
                        </div>

                        <div className="qc-quote-card">
                            <p className="qc-quote-body">
                                “Finding a player that respects privacy and provides clean variable speed control without distortion was impossible until Quietcasts. Simply the cleanest audio player on the web.”
                            </p>
                            <div className="qc-quote-author">
                                <div className="qc-author-info">
                                    <img src="/creator-woman.jpg" alt="Kristen Watson" className="qc-author-avatar" />
                                    <div>
                                        <div className="qc-author-name">Kristen Watson</div>
                                        <div className="qc-author-role">Audio Engineer & Researcher</div>
                                    </div>
                                </div>
                                <span className="qc-quote-stars">★★★★★</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="qc-footer">
                <div className="qc-container">
                    <div className="qc-footer-grid">
                        <div>
                            <div className="qc-logo" onClick={() => onExploreGuest?.()}>
                                <div className="qc-logo-icon-box">
                                    <img src="/logo.svg" alt="Quietcasts" />
                                </div>
                                <span className="qc-logo-brand">Quiet<span>casts</span></span>
                            </div>
                            <p className="qc-footer-brand-desc">
                                A high fidelity, distraction-free podcast player built for thoughtful listeners who value sound clarity and solitude.
                            </p>
                        </div>

                        <div>
                            <h4 className="qc-footer-col-title">Player Features</h4>
                            <ul className="qc-footer-links">
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Web Player</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Smart Queue</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Offline Listening</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Sleep Timer</span></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="qc-footer-col-title">Catalog</h4>
                            <ul className="qc-footer-links">
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Technology & Code</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Design & Architecture</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Science & Deep Dives</span></li>
                                <li><span className="qc-footer-link" onClick={() => onExploreGuest?.()}>Philosophy & Society</span></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="qc-footer-col-title">Connect</h4>
                            <ul className="qc-footer-links">
                                <li><span className="qc-footer-link">Twitter / X</span></li>
                                <li><span className="qc-footer-link">GitHub</span></li>
                                <li><span className="qc-footer-link">Discord Community</span></li>
                                <li><span className="qc-footer-link">Report an Issue</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="qc-footer-bottom">
                        <span>© 2026 Quietcasts. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <span className="qc-footer-link">Privacy Policy</span>
                            <span className="qc-footer-link">Terms of Service</span>
                            <span className="qc-footer-link">Support</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── AUTH MODAL ── */}
            {isAuthModalOpen && (
                <div className="qc-modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
                    <div className="qc-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="qc-modal-close" onClick={() => setIsAuthModalOpen(false)}>✕</button>

                        <div className="qc-modal-header">
                            <div className="qc-modal-logo-icon">
                                <img src="/logo.svg" alt="Quietcasts Logo" />
                            </div>
                            <h3 className="qc-modal-title">
                                {authMode === 'signup' ? 'Listen on Quietcasts' : 'Welcome Back'}
                            </h3>
                            <p className="qc-modal-subtitle">
                                {authMode === 'signup'
                                    ? 'Sync your subscriptions, progress, and queue across devices.'
                                    : 'Sign in to access your saved shows and history.'}
                            </p>
                        </div>

                        {loginError && <div className="qc-error-alert">{loginError}</div>}

                        <button className="qc-google-btn" onClick={handleGoogle} disabled={isLoading}>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Connecting...' : 'Continue with Google'}
                        </button>

                        {onExploreGuest && (
                            <button
                                className="qc-guest-btn"
                                onClick={() => {
                                    setIsAuthModalOpen(false)
                                    onExploreGuest()
                                }}
                            >
                                Continue as Guest (Test Player) →
                            </button>
                        )}

                        <div className="qc-auth-divider">
                            <div className="qc-auth-divider-line" />
                            <span className="qc-auth-divider-text">or with email</span>
                            <div className="qc-auth-divider-line" />
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleGoogle(); }}>
                            <div className="qc-input-group">
                                <label className="qc-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="qc-input"
                                    placeholder="alex@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="qc-input-group">
                                <label className="qc-label">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="qc-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="qc-modal-submit-btn">
                                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                            </button>
                        </form>

                        <div className="qc-modal-footer">
                            {authMode === 'signup' ? (
                                <>
                                    Already have an account?
                                    <button className="qc-modal-switch-btn" onClick={() => setAuthMode('signin')}>
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <>
                                    Don't have an account?
                                    <button className="qc-modal-switch-btn" onClick={() => setAuthMode('signup')}>
                                        Create one
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
