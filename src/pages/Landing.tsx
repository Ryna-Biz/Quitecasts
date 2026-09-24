import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Landing() {
    const { login } = useAuth()
    const [loginError, setLoginError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Refs for scroll-driven disassembly
    const pinRef = useRef<HTMLDivElement>(null)
    const floatRef = useRef<HTMLDivElement>(null)

    // SVG part refs
    const headbandRef = useRef<SVGGElement>(null)
    const padRef = useRef<SVGGElement>(null)
    const leftStemRef = useRef<SVGGElement>(null)
    const rightStemRef = useRef<SVGGElement>(null)
    const leftHingeRef = useRef<SVGGElement>(null)
    const rightHingeRef = useRef<SVGGElement>(null)
    const leftCupRef = useRef<SVGGElement>(null)
    const rightCupRef = useRef<SVGGElement>(null)
    const leftCushionRef = useRef<SVGGElement>(null)
    const rightCushionRef = useRef<SVGGElement>(null)
    const leftDriverRef = useRef<SVGGElement>(null)
    const rightDriverRef = useRef<SVGGElement>(null)
    const leftMeshRef = useRef<SVGGElement>(null)
    const rightMeshRef = useRef<SVGGElement>(null)
    const pcbRef = useRef<SVGGElement>(null)
    const screwsRef = useRef<SVGGElement>(null)
    const labelsRef = useRef<SVGGElement>(null)
    const measureRef = useRef<SVGGElement>(null)

    // Hero idle float
    useEffect(() => {
        const el = floatRef.current
        if (!el) return
        let raf: number
        const start = performance.now()
        const tick = (now: number) => {
            const t = (now - start) / 1000
            el.style.transform = `translateY(${Math.sin(t * 0.65) * 12}px)`
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])

    // Scroll-driven disassembly
    useEffect(() => {
        const pin = pinRef.current
        if (!pin) return

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t
        const eio = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

        const setTransform = (el: SVGGElement | null, tx: number, ty: number, scale: number, opacity: number, p: number) => {
            if (!el) return
            const e = eio(Math.max(0, Math.min(1, p)))
            el.setAttribute('transform', `translate(${tx * e},${ty * e}) scale(${lerp(1, scale, e)})`)
            el.style.opacity = String(lerp(1, opacity, e))
        }

        const onScroll = () => {
            const pinTop = pin.offsetTop
            const pinH = pin.offsetHeight
            const winH = window.innerHeight
            const scrolled = window.scrollY - pinTop
            const total = pinH - winH
            const p = Math.max(0, Math.min(1, scrolled / total))

            // 7 phases evenly spaced
            const phase = (from: number, to: number) => Math.max(0, Math.min(1, (p - from) / (to - from)))

            const p1 = phase(0, 0.18)
            const p2 = phase(0.15, 0.33)
            const p3 = phase(0.30, 0.50)
            const p4 = phase(0.46, 0.64)
            const p5 = phase(0.60, 0.78)
            const p6 = phase(0.74, 0.90)
            const p7 = phase(0.86, 1.00)

            // Headband arcs up
            setTransform(headbandRef.current, 0, -200, 1, 0.08, p1)
            setTransform(padRef.current, 0, -200, 1, 0.08, p1)
            setTransform(measureRef.current, 0, -200, 1, 0, p1)

            // Stems separate with hinges
            setTransform(leftStemRef.current, -120, 60, 1, 0.12, p2)
            setTransform(rightStemRef.current, 120, 60, 1, 0.12, p2)
            setTransform(leftHingeRef.current, -140, 90, 1, 0.15, p2)
            setTransform(rightHingeRef.current, 140, 90, 1, 0.15, p2)

            // Ear cups fly wide
            setTransform(leftCupRef.current, -260, 110, 1, 0.1, p3)
            setTransform(rightCupRef.current, 260, 110, 1, 0.1, p3)

            // Cushions peel off
            setTransform(leftCushionRef.current, -310, 180, 1, 0.1, p4)
            setTransform(rightCushionRef.current, 310, 180, 1, 0.1, p4)

            // Drivers separate
            setTransform(leftDriverRef.current, -260, 240, 1, 0.12, p5)
            setTransform(rightDriverRef.current, 260, 240, 1, 0.12, p5)

            // Mesh grilles drop
            setTransform(leftMeshRef.current, -200, 300, 1, 0.1, p6)
            setTransform(rightMeshRef.current, 200, 300, 1, 0.1, p6)
            setTransform(screwsRef.current, 0, 260, 1, 0.2, p6)

            // PCB + labels appear
            setTransform(pcbRef.current, 0, 320, 1, 0.1, p7)
            if (labelsRef.current) labelsRef.current.style.opacity = String(p7 * 0.75)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleGoogle = async () => {
        setIsLoading(true)
        setLoginError('')
        try { await login() }
        catch { setLoginError('Sign in failed. Please try again.') }
        finally { setIsLoading(false) }
    }

    return (
        <div style={{ background: '#05080D', color: '#DDE8F2', fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; }

                /* NAV */
                .l-nav { position: fixed; inset-block-start: 0; inset-inline: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 28px 52px; }
                .l-nav::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#05080D 40%, transparent); pointer-events: none; }
                .l-nav-logo { font-size: 15px; font-weight: 400; letter-spacing: .12em; text-transform: uppercase; color: #DDE8F2; z-index: 1; }
                .l-nav-right { display: flex; align-items: center; gap: 36px; z-index: 1; }
                .l-nav-link { font-size: 12px; letter-spacing: .06em; color: #8FB9D8; background: none; border: none; cursor: pointer; padding: 0; transition: color .2s; font-family: inherit; }
                .l-nav-link:hover { color: #DDE8F2; }
                .l-nav-cta { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #DDE8F2; background: none; border: 1px solid rgba(221,232,242,.25); padding: 9px 22px; cursor: pointer; font-family: inherit; transition: border-color .25s, background .25s; }
                .l-nav-cta:hover { border-color: rgba(221,232,242,.6); background: rgba(221,232,242,.04); }

                /* HERO */
                .l-hero { position: relative; min-height: 100svh; display: grid; place-items: center; overflow: hidden; padding-top: 100px; }
                .l-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(143,185,216,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(143,185,216,.06) 1px, transparent 1px); background-size: 72px 72px; }
                .l-radial { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(143,185,216,.07) 0%, transparent 70%); }
                .l-hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 0; }
                .l-hero-h1 { font-size: clamp(64px, 11vw, 140px); font-weight: 300; letter-spacing: -.04em; line-height: .95; color: #DDE8F2; text-align: center; margin: 32px 0 0; }
                .l-hero-sub { font-size: clamp(15px, 1.6vw, 19px); font-weight: 300; color: #8FB9D8; letter-spacing: .02em; text-align: center; margin: 22px 0 0; }
                .l-hero-meta { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: #48677E; text-align: center; margin: 14px 0 0; }
                .l-scroll-cue { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .l-scroll-cue span { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: #48677E; }
                .l-scroll-track { width: 1px; height: 52px; background: linear-gradient(#48677E, transparent); animation: scTrack 2.4s ease-in-out infinite; }
                @keyframes scTrack { 0%,100%{opacity:0;transform:scaleY(.3);transform-origin:top} 40%,60%{opacity:1;transform:scaleY(1)} }

                /* PIN SECTION */
                .l-pin { position: relative; height: 700vh; }
                .l-pin-sticky { position: sticky; top: 0; height: 100vh; display: grid; place-items: center; overflow: hidden; }
                .l-pin-eyebrow { position: absolute; top: 36px; left: 52px; font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: #48677E; }
                .l-pin-progress { position: absolute; right: 40px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 8px; }
                .l-pip { width: 4px; height: 4px; border-radius: 50%; background: #48677E; transition: background .3s; }

                /* ABOUT */
                .l-about { max-width: 1120px; margin: 0 auto; padding: 180px 52px; display: grid; grid-template-columns: 1fr 1fr; gap: 120px; align-items: center; }
                .l-eyebrow { font-size: 9px; letter-spacing: .22em; text-transform: uppercase; color: #48677E; margin: 0 0 22px; }
                .l-heading { font-size: clamp(30px, 3.5vw, 52px); font-weight: 300; letter-spacing: -.025em; line-height: 1.12; color: #DDE8F2; margin: 0 0 28px; }
                .l-body { font-size: 14px; line-height: 1.85; color: #8FB9D8; font-weight: 300; margin: 0; }
                .l-stats { display: flex; flex-direction: column; gap: 0; }
                .l-stat { padding: 32px 0; border-bottom: 1px solid rgba(143,185,216,.1); }
                .l-stat:first-child { border-top: 1px solid rgba(143,185,216,.1); }
                .l-stat-n { font-size: clamp(44px, 5vw, 72px); font-weight: 300; letter-spacing: -.04em; color: #DDE8F2; line-height: 1; display: block; }
                .l-stat-l { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #48677E; display: block; margin-top: 8px; }

                /* FEATURES */
                .l-features { background: #09111A; padding: 180px 52px; }
                .l-features-inner { max-width: 1120px; margin: 0 auto; }
                .l-features-hd { margin-bottom: 90px; }
                .l-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(143,185,216,.08); border: 1px solid rgba(143,185,216,.08); }
                .l-feat { background: #09111A; padding: 52px 44px 56px; transition: background .3s; }
                .l-feat:hover { background: rgba(143,185,216,.03); }
                .l-feat-n { font-size: 9px; letter-spacing: .22em; color: #48677E; font-family: 'Courier New', monospace; margin: 0 0 44px; display: block; }
                .l-feat-icon { display: block; margin-bottom: 32px; opacity: .55; }
                .l-feat-title { font-size: 20px; font-weight: 300; letter-spacing: -.01em; color: #DDE8F2; margin: 0 0 14px; }
                .l-feat-body { font-size: 13px; line-height: 1.8; color: #8FB9D8; font-weight: 300; margin: 0; }

                /* MANIFESTO */
                .l-manifesto { padding: 220px 52px; text-align: center; position: relative; }
                .l-manifesto-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(143,185,216,.05) 0%, transparent 65%); pointer-events: none; }
                .l-manifesto-rule { width: 1px; height: 90px; background: linear-gradient(transparent, rgba(143,185,216,.35), transparent); margin: 0 auto 72px; }
                .l-manifesto-q { font-size: clamp(26px, 4.5vw, 62px); font-weight: 300; letter-spacing: -.025em; line-height: 1.18; color: #DDE8F2; max-width: 860px; margin: 0 auto; }
                .l-manifesto-sub { font-size: 14px; color: #8FB9D8; margin: 36px auto 0; max-width: 480px; font-weight: 300; line-height: 1.7; }
                .l-manifesto-rule2 { width: 1px; height: 90px; background: linear-gradient(rgba(143,185,216,.35), transparent); margin: 72px auto 0; }

                /* SIGN IN */
                .l-signin { min-height: 100svh; display: grid; place-items: center; padding: 80px 24px; position: relative; background: #05080D; }
                .l-signin-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 50% 60% at 50% 65%, rgba(143,185,216,.05) 0%, transparent 65%); pointer-events: none; }
                .l-card { position: relative; z-index: 1; width: 100%; max-width: 420px; padding: 60px 52px; border: 1px solid rgba(143,185,216,.14); background: rgba(9,17,26,.9); backdrop-filter: blur(24px); }
                .l-card-logo { font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #48677E; text-align: center; display: block; margin-bottom: 6px; }
                .l-card-h2 { font-size: 26px; font-weight: 300; letter-spacing: -.02em; color: #DDE8F2; text-align: center; margin: 0 0 6px; }
                .l-card-sub { font-size: 12px; color: #48677E; letter-spacing: .04em; text-align: center; margin: 0 0 40px; }
                .l-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 11px; padding: 13px 20px; background: #DDE8F2; color: #05080D; font-size: 13px; font-weight: 500; border: none; cursor: pointer; font-family: inherit; letter-spacing: .02em; transition: background .2s; }
                .l-google:hover:not(:disabled) { background: #fff; }
                .l-google:disabled { opacity: .6; cursor: not-allowed; }
                .l-divider { display: flex; align-items: center; gap: 14px; margin: 26px 0; }
                .l-divider-line { flex: 1; height: 1px; background: rgba(143,185,216,.1); }
                .l-divider-text { font-size: 10px; color: #48677E; letter-spacing: .12em; text-transform: uppercase; }
                .l-input { width: 100%; display: block; padding: 13px 16px; background: rgba(5,8,13,.8); border: 1px solid rgba(143,185,216,.14); color: #DDE8F2; font-size: 13px; margin-bottom: 10px; font-family: inherit; outline: none; transition: border-color .2s; }
                .l-input::placeholder { color: #48677E; }
                .l-input:focus { border-color: rgba(143,185,216,.4); }
                .l-submit { width: 100%; padding: 13px; background: transparent; border: 1px solid rgba(143,185,216,.25); color: #8FB9D8; font-size: 13px; cursor: pointer; font-family: inherit; letter-spacing: .06em; text-transform: uppercase; margin-top: 4px; transition: border-color .2s, color .2s, background .2s; }
                .l-submit:hover { border-color: rgba(143,185,216,.55); color: #DDE8F2; background: rgba(143,185,216,.04); }
                .l-card-foot { font-size: 11px; color: #48677E; text-align: center; margin-top: 30px; }
                .l-card-foot button { background: none; border: none; color: #8FB9D8; cursor: pointer; font-size: 11px; font-family: inherit; padding: 0; transition: color .2s; }
                .l-card-foot button:hover { color: #DDE8F2; }
                .l-error { font-size: 11px; color: #d97070; text-align: center; margin-bottom: 16px; }

                @media (max-width: 720px) {
                    .l-nav { padding: 20px 24px; }
                    .l-nav-link { display: none; }
                    .l-about { grid-template-columns: 1fr; gap: 72px; padding: 120px 24px; }
                    .l-features { padding: 120px 24px; }
                    .l-features-grid { grid-template-columns: 1fr; }
                    .l-manifesto { padding: 140px 24px; }
                    .l-card { padding: 44px 28px; }
                }
            `}</style>

            {/* ── NAV ─────────────────────────────── */}
            <nav className="l-nav">
                <span className="l-nav-logo">Quietcasts</span>
                <div className="l-nav-right">
                    <button className="l-nav-link" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About</button>
                    <button className="l-nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</button>
                    <button className="l-nav-cta" onClick={() => document.getElementById('signin')?.scrollIntoView({ behavior: 'smooth' })}>Sign in</button>
                </div>
            </nav>

            {/* ── HERO ────────────────────────────── */}
            <section className="l-hero">
                <div className="l-grid" />
                <div className="l-radial" />

                <div className="l-hero-inner">
                    {/* detailed SVG headphone */}
                    <div ref={floatRef} style={{ lineHeight: 0 }}>
                        <svg viewBox="0 0 640 370" width="600" height="346" style={{ filter: 'drop-shadow(0 0 100px rgba(143,185,216,.2))', maxWidth: '88vw', height: 'auto' }} aria-hidden>
                            <defs>
                                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#DDE8F2" stopOpacity=".95" />
                                    <stop offset="55%" stopColor="#8FB9D8" stopOpacity=".7" />
                                    <stop offset="100%" stopColor="#48677E" stopOpacity=".3" />
                                </linearGradient>
                                <radialGradient id="cg" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#8FB9D8" stopOpacity=".18" />
                                    <stop offset="100%" stopColor="#8FB9D8" stopOpacity="0" />
                                </radialGradient>
                                <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                            </defs>

                            {/* headband arc + inner shape */}
                            <path d="M125 175 Q320 52 515 175" stroke="url(#hg)" strokeWidth="13" fill="none" strokeLinecap="round" filter="url(#gf)" />
                            <path d="M125 175 Q320 52 515 175" stroke="#DDE8F2" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".18" strokeDasharray="6 16" />
                            <path d="M195 108 Q320 76 445 108" stroke="#8FB9D8" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".4" />
                            <path d="M220 95 Q320 68 420 95" stroke="#DDE8F2" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".15" />

                            {/* measurement annotation */}
                            <line x1="320" y1="52" x2="320" y2="28" stroke="#48677E" strokeWidth="1" />
                            <line x1="295" y1="28" x2="345" y2="28" stroke="#48677E" strokeWidth="1" />
                            <text x="352" y="32" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1">820mm</text>

                            {/* left slider stem */}
                            <path d="M125 175 L108 258" stroke="#DDE8F2" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".88" />
                            <path d="M125 175 L108 258" stroke="url(#hg)" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".45" />
                            <rect x="98" y="222" width="20" height="36" rx="3" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity=".4" />

                            {/* right slider stem */}
                            <path d="M515 175 L532 258" stroke="#DDE8F2" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".88" />
                            <path d="M515 175 L532 258" stroke="url(#hg)" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".45" />
                            <rect x="522" y="222" width="20" height="36" rx="3" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity=".4" />

                            {/* left hinge */}
                            <circle cx="108" cy="260" r="12" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity=".9" />
                            <circle cx="108" cy="260" r="5" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity=".6" />
                            <circle cx="108" cy="260" r="1.5" fill="#DDE8F2" opacity=".5" />

                            {/* right hinge */}
                            <circle cx="532" cy="260" r="12" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity=".9" />
                            <circle cx="532" cy="260" r="5" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity=".6" />
                            <circle cx="532" cy="260" r="1.5" fill="#DDE8F2" opacity=".5" />

                            {/* left cup glow bg */}
                            <ellipse cx="84" cy="290" rx="60" ry="68" fill="url(#cg)" />
                            {/* left cup outer */}
                            <ellipse cx="84" cy="290" rx="58" ry="68" fill="none" stroke="#DDE8F2" strokeWidth="4" opacity=".88" filter="url(#gf)" />
                            {/* left cup inner rim */}
                            <ellipse cx="84" cy="290" rx="50" ry="60" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".35" />
                            {/* left cushion dashed ring */}
                            <ellipse cx="84" cy="298" rx="44" ry="53" fill="none" stroke="#8FB9D8" strokeWidth="2" strokeDasharray="6 8" opacity=".3" />
                            {/* left driver rings */}
                            <circle cx="84" cy="290" r="36" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity=".75" />
                            <circle cx="84" cy="290" r="26" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".5" />
                            <circle cx="84" cy="290" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".4" />
                            <circle cx="84" cy="290" r="6" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity=".5" />
                            <circle cx="84" cy="290" r="2" fill="#DDE8F2" opacity=".35" />
                            {/* left mesh crosshairs */}
                            <line x1="48" y1="290" x2="120" y2="290" stroke="#8FB9D8" strokeWidth="0.7" opacity=".18" />
                            <line x1="84" y1="254" x2="84" y2="326" stroke="#8FB9D8" strokeWidth="0.7" opacity=".18" />
                            <line x1="58" y1="265" x2="110" y2="315" stroke="#8FB9D8" strokeWidth="0.5" opacity=".12" />
                            <line x1="110" y1="265" x2="58" y2="315" stroke="#8FB9D8" strokeWidth="0.5" opacity=".12" />

                            {/* right cup glow bg */}
                            <ellipse cx="556" cy="290" rx="60" ry="68" fill="url(#cg)" />
                            {/* right cup outer */}
                            <ellipse cx="556" cy="290" rx="58" ry="68" fill="none" stroke="#DDE8F2" strokeWidth="4" opacity=".88" filter="url(#gf)" />
                            {/* right cup inner rim */}
                            <ellipse cx="556" cy="290" rx="50" ry="60" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".35" />
                            {/* right cushion dashed ring */}
                            <ellipse cx="556" cy="298" rx="44" ry="53" fill="none" stroke="#8FB9D8" strokeWidth="2" strokeDasharray="6 8" opacity=".3" />
                            {/* right driver rings */}
                            <circle cx="556" cy="290" r="36" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity=".75" />
                            <circle cx="556" cy="290" r="26" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".5" />
                            <circle cx="556" cy="290" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".4" />
                            <circle cx="556" cy="290" r="6" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity=".5" />
                            <circle cx="556" cy="290" r="2" fill="#DDE8F2" opacity=".35" />
                            {/* right mesh crosshairs */}
                            <line x1="520" y1="290" x2="592" y2="290" stroke="#8FB9D8" strokeWidth="0.7" opacity=".18" />
                            <line x1="556" y1="254" x2="556" y2="326" stroke="#8FB9D8" strokeWidth="0.7" opacity=".18" />
                            <line x1="530" y1="265" x2="582" y2="315" stroke="#8FB9D8" strokeWidth="0.5" opacity=".12" />
                            <line x1="582" y1="265" x2="530" y2="315" stroke="#8FB9D8" strokeWidth="0.5" opacity=".12" />

                            {/* side annotation marks */}
                            <line x1="16" y1="222" x2="16" y2="358" stroke="#48677E" strokeWidth=".8" opacity=".5" />
                            <line x1="10" y1="222" x2="22" y2="222" stroke="#48677E" strokeWidth=".8" opacity=".5" />
                            <line x1="10" y1="358" x2="22" y2="358" stroke="#48677E" strokeWidth=".8" opacity=".5" />
                            <text x="5" y="298" fontSize="8" fill="#48677E" fontFamily="monospace" transform="rotate(-90 5 298)">H: 136mm</text>

                            <line x1="26" y1="358" x2="142" y2="358" stroke="#48677E" strokeWidth=".8" opacity=".35" />
                            <line x1="26" y1="352" x2="26" y2="364" stroke="#48677E" strokeWidth=".8" opacity=".35" />
                            <line x1="142" y1="352" x2="142" y2="364" stroke="#48677E" strokeWidth=".8" opacity=".35" />
                            <text x="60" y="370" fontSize="8" fill="#48677E" fontFamily="monospace" letterSpacing="1">W: 116mm</text>
                        </svg>
                    </div>

                    <h1 className="l-hero-h1">Quietcasts</h1>
                    <p className="l-hero-sub">A calmer place for curious minds.</p>
                    <p className="l-hero-meta">Podcasts for deeper thinking — wherever you are</p>
                </div>

                <div className="l-scroll-cue">
                    <span>Scroll to explore</span>
                    <div className="l-scroll-track" />
                </div>
            </section>

            {/* ── SCROLL-DRIVEN DISASSEMBLY ────────── */}
            <div ref={pinRef} className="l-pin">
                <div className="l-pin-sticky">
                    <div className="l-grid" style={{ opacity: .018 }} />
                    <div className="l-radial" style={{ opacity: .5 }} />
                    <span className="l-pin-eyebrow">01 — Anatomy of sound</span>

                    <svg viewBox="0 0 820 640" style={{ width: '88vw', maxWidth: 860, height: 'auto', filter: 'drop-shadow(0 0 120px rgba(143,185,216,.1))' }} aria-hidden>
                        <defs>
                            <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DDE8F2" stopOpacity=".92" />
                                <stop offset="55%" stopColor="#8FB9D8" stopOpacity=".62" />
                                <stop offset="100%" stopColor="#48677E" stopOpacity=".22" />
                            </linearGradient>
                            <radialGradient id="dcg" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#8FB9D8" stopOpacity=".2" />
                                <stop offset="100%" stopColor="#8FB9D8" stopOpacity="0" />
                            </radialGradient>
                            <filter id="dgf"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                        </defs>

                        {/* ── HEADBAND ── */}
                        <g ref={headbandRef}>
                            <path d="M148 195 Q410 72 672 195" stroke="url(#dg)" strokeWidth="14" fill="none" strokeLinecap="round" filter="url(#dgf)" />
                            <path d="M148 195 Q410 72 672 195" stroke="#DDE8F2" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".16" strokeDasharray="6 18" />
                            <g ref={padRef}>
                                <path d="M255 128 Q410 90 565 128" stroke="#8FB9D8" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".38" />
                                <path d="M280 115 Q410 82 540 115" stroke="#DDE8F2" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".16" />
                            </g>
                        </g>

                        {/* ── MEASURE ── */}
                        <g ref={measureRef}>
                            <line x1="410" y1="72" x2="410" y2="46" stroke="#48677E" strokeWidth=".9" />
                            <line x1="380" y1="46" x2="440" y2="46" stroke="#48677E" strokeWidth=".9" />
                            <text x="448" y="50" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">820mm</text>
                        </g>

                        {/* ── LEFT STEM + SLIDER ── */}
                        <g ref={leftStemRef}>
                            <path d="M148 195 L128 290" stroke="#DDE8F2" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".88" />
                            <path d="M148 195 L128 290" stroke="url(#dg)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".45" />
                            <rect x="116" y="252" width="24" height="40" rx="4" fill="none" stroke="#8FB9D8" strokeWidth="1.8" opacity=".4" />
                            <line x1="122" y1="268" x2="134" y2="268" stroke="#8FB9D8" strokeWidth="1" opacity=".3" />
                            <line x1="122" y1="276" x2="134" y2="276" stroke="#8FB9D8" strokeWidth="1" opacity=".3" />
                        </g>

                        {/* ── RIGHT STEM + SLIDER ── */}
                        <g ref={rightStemRef}>
                            <path d="M672 195 L692 290" stroke="#DDE8F2" strokeWidth="8" fill="none" strokeLinecap="round" opacity=".88" />
                            <path d="M672 195 L692 290" stroke="url(#dg)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".45" />
                            <rect x="680" y="252" width="24" height="40" rx="4" fill="none" stroke="#8FB9D8" strokeWidth="1.8" opacity=".4" />
                            <line x1="686" y1="268" x2="698" y2="268" stroke="#8FB9D8" strokeWidth="1" opacity=".3" />
                            <line x1="686" y1="276" x2="698" y2="276" stroke="#8FB9D8" strokeWidth="1" opacity=".3" />
                        </g>

                        {/* ── LEFT HINGE ── */}
                        <g ref={leftHingeRef}>
                            <circle cx="130" cy="292" r="14" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity=".9" />
                            <circle cx="130" cy="292" r="6" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".6" />
                            <circle cx="130" cy="292" r="1.8" fill="#DDE8F2" opacity=".5" />
                        </g>

                        {/* ── RIGHT HINGE ── */}
                        <g ref={rightHingeRef}>
                            <circle cx="690" cy="292" r="14" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity=".9" />
                            <circle cx="690" cy="292" r="6" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".6" />
                            <circle cx="690" cy="292" r="1.8" fill="#DDE8F2" opacity=".5" />
                        </g>

                        {/* ── LEFT EAR CUP ── */}
                        <g ref={leftCupRef}>
                            <ellipse cx="100" cy="330" rx="64" ry="80" fill="url(#dcg)" />
                            <ellipse cx="100" cy="330" rx="62" ry="80" fill="none" stroke="#DDE8F2" strokeWidth="4.5" opacity=".88" filter="url(#dgf)" />
                            <ellipse cx="100" cy="330" rx="54" ry="72" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".3" />
                        </g>

                        {/* ── RIGHT EAR CUP ── */}
                        <g ref={rightCupRef}>
                            <ellipse cx="720" cy="330" rx="64" ry="80" fill="url(#dcg)" />
                            <ellipse cx="720" cy="330" rx="62" ry="80" fill="none" stroke="#DDE8F2" strokeWidth="4.5" opacity=".88" filter="url(#dgf)" />
                            <ellipse cx="720" cy="330" rx="54" ry="72" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".3" />
                        </g>

                        {/* ── LEFT CUSHION ── */}
                        <g ref={leftCushionRef}>
                            <ellipse cx="100" cy="342" rx="56" ry="70" fill="none" stroke="#8FB9D8" strokeWidth="3" strokeDasharray="8 8" opacity=".52" />
                        </g>

                        {/* ── RIGHT CUSHION ── */}
                        <g ref={rightCushionRef}>
                            <ellipse cx="720" cy="342" rx="56" ry="70" fill="none" stroke="#8FB9D8" strokeWidth="3" strokeDasharray="8 8" opacity=".52" />
                        </g>

                        {/* ── LEFT DRIVER ── */}
                        <g ref={leftDriverRef}>
                            <circle cx="100" cy="330" r="44" fill="none" stroke="#DDE8F2" strokeWidth="2.8" opacity=".8" />
                            <circle cx="100" cy="330" r="32" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".55" />
                            <circle cx="100" cy="330" r="20" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".42" />
                            <circle cx="100" cy="330" r="10" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity=".4" />
                            <circle cx="100" cy="330" r="3" fill="#DDE8F2" opacity=".28" />
                        </g>

                        {/* ── RIGHT DRIVER ── */}
                        <g ref={rightDriverRef}>
                            <circle cx="720" cy="330" r="44" fill="none" stroke="#DDE8F2" strokeWidth="2.8" opacity=".8" />
                            <circle cx="720" cy="330" r="32" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity=".55" />
                            <circle cx="720" cy="330" r="20" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".42" />
                            <circle cx="720" cy="330" r="10" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity=".4" />
                            <circle cx="720" cy="330" r="3" fill="#DDE8F2" opacity=".28" />
                        </g>

                        {/* ── LEFT MESH ── */}
                        <g ref={leftMeshRef}>
                            <line x1="56" y1="330" x2="144" y2="330" stroke="#8FB9D8" strokeWidth=".9" opacity=".22" />
                            <line x1="100" y1="286" x2="100" y2="374" stroke="#8FB9D8" strokeWidth=".9" opacity=".22" />
                            <line x1="68" y1="298" x2="132" y2="362" stroke="#8FB9D8" strokeWidth=".6" opacity=".14" />
                            <line x1="132" y1="298" x2="68" y2="362" stroke="#8FB9D8" strokeWidth=".6" opacity=".14" />
                        </g>

                        {/* ── RIGHT MESH ── */}
                        <g ref={rightMeshRef}>
                            <line x1="676" y1="330" x2="764" y2="330" stroke="#8FB9D8" strokeWidth=".9" opacity=".22" />
                            <line x1="720" y1="286" x2="720" y2="374" stroke="#8FB9D8" strokeWidth=".9" opacity=".22" />
                            <line x1="688" y1="298" x2="752" y2="362" stroke="#8FB9D8" strokeWidth=".6" opacity=".14" />
                            <line x1="752" y1="298" x2="688" y2="362" stroke="#8FB9D8" strokeWidth=".6" opacity=".14" />
                        </g>

                        {/* ── SCREWS ── */}
                        <g ref={screwsRef} opacity="0">
                            <circle cx="340" cy="460" r="6" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <line x1="337" y1="460" x2="343" y2="460" stroke="#DDE8F2" strokeWidth="1" opacity=".5" />
                            <line x1="340" y1="457" x2="340" y2="463" stroke="#DDE8F2" strokeWidth="1" opacity=".5" />
                            <circle cx="480" cy="460" r="6" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <line x1="477" y1="460" x2="483" y2="460" stroke="#DDE8F2" strokeWidth="1" opacity=".5" />
                            <line x1="480" y1="457" x2="480" y2="463" stroke="#DDE8F2" strokeWidth="1" opacity=".5" />
                        </g>

                        {/* ── PCB ── */}
                        <g ref={pcbRef} opacity="0">
                            <rect x="340" y="490" width="140" height="86" rx="5" fill="none" stroke="#8FB9D8" strokeWidth="1.8" opacity=".5" />
                            <circle cx="360" cy="508" r="5" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <circle cx="382" cy="524" r="5" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <circle cx="440" cy="514" r="5" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <circle cx="462" cy="530" r="5" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity=".7" />
                            <line x1="360" y1="508" x2="382" y2="524" stroke="#8FB9D8" strokeWidth=".9" opacity=".4" />
                            <line x1="382" y1="524" x2="440" y2="514" stroke="#8FB9D8" strokeWidth=".9" opacity=".4" />
                            <line x1="440" y1="514" x2="462" y2="530" stroke="#8FB9D8" strokeWidth=".9" opacity=".4" />
                        </g>

                        {/* ── LABELS ── */}
                        <g ref={labelsRef} opacity="0">
                            <text x="420" y="60" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2" textAnchor="middle">HEADBAND</text>
                            <text x="60" y="278" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">HINGE</text>
                            <text x="18" y="322" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">EAR CUP</text>
                            <text x="18" y="420" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">DRIVER</text>
                            <text x="350" y="486" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">FASTENERS</text>
                            <text x="348" y="596" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">PCB / CIRCUIT</text>
                            <text x="18" y="480" fontSize="9.5" fill="#48677E" fontFamily="monospace" letterSpacing="2">MEMORY FOAM</text>
                        </g>
                    </svg>
                </div>
            </div>

            {/* ── ABOUT ────────────────────────────── */}
            <section style={{ background: '#05080D' }} id="about">
                <div className="l-about">
                    <div>
                        <p className="l-eyebrow">About Quietcasts</p>
                        <h2 className="l-heading">Built around how you actually listen.</h2>
                        <p className="l-body">Most apps optimise for discovery metrics. Quietcasts optimises for depth. A space where subscriptions persist, history is yours to keep, and the interface never interrupts the story.</p>
                    </div>
                    <div className="l-stats">
                        <div className="l-stat">
                            <span className="l-stat-n">∞</span>
                            <span className="l-stat-l">Podcasts supported</span>
                        </div>
                        <div className="l-stat">
                            <span className="l-stat-n">100%</span>
                            <span className="l-stat-l">Your data. Your library.</span>
                        </div>
                        <div className="l-stat">
                            <span className="l-stat-n">0</span>
                            <span className="l-stat-l">Algorithmic distractions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────── */}
            <section className="l-features" id="features">
                <div className="l-features-inner">
                    <div className="l-features-hd">
                        <p className="l-eyebrow">02 — Features</p>
                        <h2 className="l-heading" style={{ margin: 0 }}>Everything you need.<br />Nothing you don't.</h2>
                    </div>
                    <div className="l-features-grid">
                        <div className="l-feat">
                            <span className="l-feat-n">01</span>
                            <svg className="l-feat-icon" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                                <circle cx="22" cy="22" r="16" stroke="#8FB9D8" strokeWidth="1.4" />
                                <circle cx="22" cy="22" r="9" stroke="#DDE8F2" strokeWidth="1.4" />
                                <line x1="22" y1="6" x2="22" y2="13" stroke="#8FB9D8" strokeWidth="1.4" />
                                <line x1="22" y1="31" x2="22" y2="38" stroke="#8FB9D8" strokeWidth="1.4" />
                                <line x1="6" y1="22" x2="13" y2="22" stroke="#8FB9D8" strokeWidth="1.4" />
                                <line x1="31" y1="22" x2="38" y2="22" stroke="#8FB9D8" strokeWidth="1.4" />
                            </svg>
                            <h3 className="l-feat-title">Discover</h3>
                            <p className="l-feat-body">Find podcasts that match your thinking. Search the full Apple catalogue. No algorithmic manipulation, no dark patterns.</p>
                        </div>
                        <div className="l-feat">
                            <span className="l-feat-n">02</span>
                            <svg className="l-feat-icon" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                                <rect x="9" y="7" width="26" height="32" rx="2" stroke="#DDE8F2" strokeWidth="1.4" />
                                <line x1="15" y1="16" x2="29" y2="16" stroke="#8FB9D8" strokeWidth="1.4" />
                                <line x1="15" y1="22" x2="29" y2="22" stroke="#8FB9D8" strokeWidth="1.4" />
                                <line x1="15" y1="28" x2="22" y2="28" stroke="#8FB9D8" strokeWidth="1.4" />
                            </svg>
                            <h3 className="l-feat-title">Save</h3>
                            <p className="l-feat-body">Download episodes for offline listening. Subscriptions and progress sync automatically across all your devices.</p>
                        </div>
                        <div className="l-feat">
                            <span className="l-feat-n">03</span>
                            <svg className="l-feat-icon" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                                <circle cx="22" cy="22" r="13" stroke="#DDE8F2" strokeWidth="1.4" />
                                <polygon points="19.5,16 31,22 19.5,28" fill="#8FB9D8" opacity=".75" />
                            </svg>
                            <h3 className="l-feat-title">Listen</h3>
                            <p className="l-feat-body">Variable speed, sleep timer, seamless device handoff. The player stays out of your way so the story never does.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MANIFESTO ────────────────────────── */}
            <section style={{ background: '#05080D' }}>
                <div className="l-manifesto">
                    <div className="l-manifesto-glow" />
                    <div className="l-manifesto-rule" />
                    <blockquote className="l-manifesto-q">
                        "More than podcasts.<br />A listening space built around you."
                    </blockquote>
                    <p className="l-manifesto-sub">Quietcasts is a premium podcast experience engineered for depth, not distraction.</p>
                    <div className="l-manifesto-rule2" />
                </div>
            </section>

            {/* ── SIGN IN ──────────────────────────── */}
            <section style={{ background: '#09111A' }} id="signin">
                <div className="l-signin">
                    <div className="l-signin-glow" />
                    <div className="l-card">
                        <span className="l-card-logo">Quietcasts</span>
                        <h2 className="l-card-h2">Welcome back.</h2>
                        <p className="l-card-sub">Your listening space, uninterrupted.</p>

                        {loginError && <p className="l-error">{loginError}</p>}

                        <button className="l-google" onClick={() => void handleGoogle()} disabled={isLoading}>
                            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Signing in…' : 'Continue with Google'}
                        </button>

                        <div className="l-divider">
                            <div className="l-divider-line" /><span className="l-divider-text">or</span><div className="l-divider-line" />
                        </div>

                        <input className="l-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                        <input className="l-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="l-submit">Sign in</button>

                        <p className="l-card-foot">Don't have an account? <button>Create one</button></p>
                    </div>
                </div>
            </section>
        </div>
    )
}
