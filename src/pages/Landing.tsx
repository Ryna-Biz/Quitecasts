import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Landing() {
    const { login } = useAuth()
    const [loginError, setLoginError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const heroRef = useRef<HTMLDivElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const headbandRef = useRef<SVGGElement>(null)
    const leftHingeRef = useRef<SVGGElement>(null)
    const rightHingeRef = useRef<SVGGElement>(null)
    const leftCupRef = useRef<SVGGElement>(null)
    const rightCupRef = useRef<SVGGElement>(null)
    const leftDriverRef = useRef<SVGGElement>(null)
    const rightDriverRef = useRef<SVGGElement>(null)
    const leftCushionRef = useRef<SVGGElement>(null)
    const rightCushionRef = useRef<SVGGElement>(null)
    const pcbRef = useRef<SVGGElement>(null)
    const label1Ref = useRef<SVGGElement>(null)
    const label2Ref = useRef<SVGGElement>(null)
    const label3Ref = useRef<SVGGElement>(null)
    const label4Ref = useRef<SVGGElement>(null)
    const label5Ref = useRef<SVGGElement>(null)

    useEffect(() => {
        // Idle float animation for hero headphone
        const hero = heroRef.current
        if (!hero) return
        let frame: number
        let start: number | null = null
        const animate = (ts: number) => {
            if (!start) start = ts
            const t = (ts - start) / 1000
            hero.style.transform = `translateY(${Math.sin(t * 0.7) * 10}px)`
            frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [])

    useEffect(() => {
        const pin = pinRef.current
        if (!pin) return

        const parts = {
            headband: headbandRef.current,
            leftHinge: leftHingeRef.current,
            rightHinge: rightHingeRef.current,
            leftCup: leftCupRef.current,
            rightCup: rightCupRef.current,
            leftDriver: leftDriverRef.current,
            rightDriver: rightDriverRef.current,
            leftCushion: leftCushionRef.current,
            rightCushion: rightCushionRef.current,
            pcb: pcbRef.current,
            label1: label1Ref.current,
            label2: label2Ref.current,
            label3: label3Ref.current,
            label4: label4Ref.current,
            label5: label5Ref.current,
        }

        const onScroll = () => {
            const pinRect = pin.getBoundingClientRect()
            const pinTop = pin.offsetTop
            const scrolled = window.scrollY - pinTop
            const totalHeight = pin.offsetHeight - window.innerHeight
            const p = Math.max(0, Math.min(1, scrolled / totalHeight))

            const ease = (v: number) => v < 0.5 ? 2 * v * v : -1 + (4 - 2 * v) * v

            const p1 = Math.max(0, Math.min(1, p * 5))           // 0–20%
            const p2 = Math.max(0, Math.min(1, (p - 0.2) * 5))   // 20–40%
            const p3 = Math.max(0, Math.min(1, (p - 0.4) * 5))   // 40–60%
            const p4 = Math.max(0, Math.min(1, (p - 0.6) * 5))   // 60–80%
            const p5 = Math.max(0, Math.min(1, (p - 0.8) * 5))   // 80–100%

            const apply = (el: SVGGElement | null, tx: number, ty: number, op: number, progress: number) => {
                if (!el) return
                const ep = ease(progress)
                el.setAttribute('transform', `translate(${tx * ep}, ${ty * ep})`)
                el.style.opacity = String(Math.max(0.08, op + (1 - op) * (1 - ep)))
            }

            // Phase 1: headband separates upward
            apply(parts.headband, 0, -160, 0.15, p1)
            // Phase 2: hinges split
            apply(parts.leftHinge, -170, 60, 0.2, p2)
            apply(parts.rightHinge, 170, 60, 0.2, p2)
            // Phase 3: ear cups fly apart
            apply(parts.leftCup, -230, 110, 0.15, p3)
            apply(parts.rightCup, 230, 110, 0.15, p3)
            // Phase 4: cushions + drivers separate
            apply(parts.leftCushion, -270, 190, 0.12, p4)
            apply(parts.rightCushion, 270, 190, 0.12, p4)
            apply(parts.leftDriver, -190, 240, 0.18, p4)
            apply(parts.rightDriver, 190, 240, 0.18, p4)
            // Phase 5: PCB + labels appear
            apply(parts.pcb, 0, 300, 0.1, p5)

            if (parts.label1) parts.label1.style.opacity = String(p5 * 0.7)
            if (parts.label2) parts.label2.style.opacity = String(p5 * 0.7)
            if (parts.label3) parts.label3.style.opacity = String(p5 * 0.7)
            if (parts.label4) parts.label4.style.opacity = String(p5 * 0.7)
            if (parts.label5) parts.label5.style.opacity = String(p5 * 0.7)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

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

    return (
        <div style={{ background: '#05080D', color: '#DDE8F2', fontFamily: "'Inter', 'Manrope', system-ui, sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .qc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 24px 48px; display: flex; align-items: center; justify-content: space-between; background: linear-gradient(to bottom, rgba(5,8,13,0.9) 0%, transparent 100%); backdrop-filter: blur(0px); }
                .qc-nav-logo { font-size: 18px; font-weight: 400; letter-spacing: 0.08em; color: #DDE8F2; }
                .qc-nav-links { display: flex; gap: 40px; align-items: center; }
                .qc-nav-link { font-size: 13px; color: #8FB9D8; text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; cursor: pointer; background: none; border: none; }
                .qc-nav-link:hover { color: #DDE8F2; }
                .qc-nav-signin { font-size: 13px; color: #DDE8F2; letter-spacing: 0.06em; padding: 8px 20px; border: 1px solid rgba(143,185,216,0.35); background: transparent; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
                .qc-nav-signin:hover { border-color: rgba(143,185,216,0.7); background: rgba(143,185,216,0.05); }

                .qc-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
                .qc-grid { position: absolute; inset: 0; opacity: 0.035; background-image: linear-gradient(rgba(143,185,216,1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,185,216,1) 1px, transparent 1px); background-size: 60px 60px; }
                .qc-hero-title { font-size: clamp(56px, 9vw, 120px); font-weight: 300; letter-spacing: -0.03em; line-height: 1; text-align: center; color: #DDE8F2; margin: 0; }
                .qc-hero-sub { font-size: clamp(16px, 2vw, 20px); font-weight: 300; color: #8FB9D8; text-align: center; margin: 20px 0 0; letter-spacing: 0.02em; }
                .qc-hero-desc { font-size: 13px; color: #48677E; text-align: center; margin: 12px 0 0; letter-spacing: 0.05em; text-transform: uppercase; }
                .qc-scroll-hint { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.5; }
                .qc-scroll-hint span { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8FB9D8; }
                .qc-scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, #8FB9D8, transparent); animation: scrollPulse 2s ease-in-out infinite; }
                @keyframes scrollPulse { 0%,100% { opacity: 0; transform: scaleY(0.5); transform-origin: top; } 50% { opacity: 1; transform: scaleY(1); } }

                .qc-pin { position: relative; height: 600vh; }
                .qc-pin-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
                .qc-pin-label { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #48677E; white-space: nowrap; }

                .qc-about { padding: 160px 48px; max-width: 1100px; margin: 0 auto; }
                .qc-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
                .qc-about-eyebrow { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #48677E; margin: 0 0 20px; }
                .qc-about-heading { font-size: clamp(32px, 4vw, 52px); font-weight: 300; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 24px; color: #DDE8F2; }
                .qc-about-body { font-size: 15px; line-height: 1.8; color: #8FB9D8; margin: 0; font-weight: 300; }
                .qc-about-stats { display: flex; flex-direction: column; gap: 40px; }
                .qc-stat-num { font-size: clamp(48px, 6vw, 80px); font-weight: 300; letter-spacing: -0.04em; color: #DDE8F2; line-height: 1; display: block; }
                .qc-stat-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #48677E; margin-top: 6px; display: block; }
                .qc-stat-divider { width: 40px; height: 1px; background: rgba(143,185,216,0.2); }

                .qc-features { padding: 160px 48px; max-width: 1100px; margin: 0 auto; }
                .qc-features-header { text-align: center; margin-bottom: 100px; }
                .qc-features-eyebrow { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #48677E; margin: 0 0 16px; }
                .qc-features-heading { font-size: clamp(32px, 4vw, 52px); font-weight: 300; letter-spacing: -0.02em; color: #DDE8F2; margin: 0; }
                .qc-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
                .qc-feature-card { padding: 48px 40px; border: 1px solid rgba(143,185,216,0.1); background: rgba(9,17,26,0.4); transition: border-color 0.3s, background 0.3s; }
                .qc-feature-card:hover { border-color: rgba(143,185,216,0.25); background: rgba(9,17,26,0.7); }
                .qc-feature-num { font-size: 10px; letter-spacing: 0.2em; color: #48677E; margin: 0 0 40px; font-family: monospace; }
                .qc-feature-title { font-size: 22px; font-weight: 300; color: #DDE8F2; margin: 0 0 16px; letter-spacing: -0.01em; }
                .qc-feature-body { font-size: 14px; line-height: 1.75; color: #8FB9D8; margin: 0; font-weight: 300; }
                .qc-feature-icon { width: 48px; height: 48px; margin-bottom: 36px; opacity: 0.6; }

                .qc-manifesto { padding: 200px 48px; text-align: center; position: relative; overflow: hidden; }
                .qc-manifesto-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(143,185,216,0.04) 0%, transparent 70%); }
                .qc-manifesto-line { width: 1px; height: 80px; background: linear-gradient(to bottom, transparent, rgba(143,185,216,0.3), transparent); margin: 0 auto 60px; }
                .qc-manifesto-text { font-size: clamp(28px, 5vw, 64px); font-weight: 300; letter-spacing: -0.02em; line-height: 1.2; color: #DDE8F2; max-width: 900px; margin: 0 auto; }
                .qc-manifesto-sub { font-size: 15px; color: #8FB9D8; margin: 32px auto 0; max-width: 500px; font-weight: 300; line-height: 1.6; }

                .qc-signin { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; position: relative; }
                .qc-signin-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 60%, rgba(143,185,216,0.05) 0%, transparent 70%); }
                .qc-signin-card { position: relative; z-index: 1; width: 100%; max-width: 400px; padding: 56px 48px; border: 1px solid rgba(143,185,216,0.15); background: rgba(9,17,26,0.8); backdrop-filter: blur(20px); }
                .qc-signin-logo { font-size: 15px; font-weight: 400; letter-spacing: 0.1em; color: #48677E; text-align: center; margin: 0 0 8px; text-transform: uppercase; }
                .qc-signin-heading { font-size: 26px; font-weight: 300; letter-spacing: -0.01em; color: #DDE8F2; text-align: center; margin: 0 0 6px; }
                .qc-signin-sub { font-size: 13px; color: #48677E; text-align: center; margin: 0 0 40px; }
                .qc-google-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; background: #DDE8F2; color: #05080D; font-size: 14px; font-weight: 500; border: none; cursor: pointer; letter-spacing: 0.01em; transition: background 0.2s, transform 0.15s; font-family: inherit; }
                .qc-google-btn:hover:not(:disabled) { background: #fff; }
                .qc-google-btn:active:not(:disabled) { transform: scale(0.99); }
                .qc-google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                .qc-divider { display: flex; align-items: center; gap: 16px; margin: 28px 0; }
                .qc-divider-line { flex: 1; height: 1px; background: rgba(143,185,216,0.12); }
                .qc-divider-text { font-size: 11px; color: #48677E; letter-spacing: 0.1em; }
                .qc-input { width: 100%; padding: 14px 16px; background: rgba(5,8,13,0.7); border: 1px solid rgba(143,185,216,0.15); color: #DDE8F2; font-size: 14px; margin-bottom: 12px; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
                .qc-input::placeholder { color: #48677E; }
                .qc-input:focus { border-color: rgba(143,185,216,0.4); }
                .qc-submit-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid rgba(143,185,216,0.3); color: #8FB9D8; font-size: 14px; cursor: pointer; font-family: inherit; letter-spacing: 0.04em; transition: border-color 0.2s, color 0.2s, background 0.2s; margin-top: 4px; }
                .qc-submit-btn:hover { border-color: rgba(143,185,216,0.7); color: #DDE8F2; background: rgba(143,185,216,0.05); }
                .qc-signin-footer { font-size: 12px; color: #48677E; text-align: center; margin-top: 28px; }
                .qc-signin-footer button { background: none; border: none; color: #8FB9D8; cursor: pointer; font-size: 12px; font-family: inherit; }
                .qc-signin-footer button:hover { color: #DDE8F2; }
                .qc-error { font-size: 12px; color: #e07070; text-align: center; margin-bottom: 16px; }

                @media (max-width: 700px) {
                    .qc-nav { padding: 20px 24px; }
                    .qc-nav-links { display: none; }
                    .qc-about-grid { grid-template-columns: 1fr; gap: 60px; }
                    .qc-features-grid { grid-template-columns: 1fr; }
                    .qc-about, .qc-features, .qc-manifesto { padding: 100px 24px; }
                    .qc-signin-card { padding: 40px 28px; }
                }
            `}</style>

            {/* NAV */}
            <nav className="qc-nav">
                <div className="qc-nav-logo">Quietcasts</div>
                <div className="qc-nav-links">
                    <a href="#about" className="qc-nav-link">About</a>
                    <a href="#features" className="qc-nav-link">Features</a>
                    <button className="qc-nav-signin" onClick={() => document.getElementById('signin')?.scrollIntoView({ behavior: 'smooth' })}>
                        Sign in
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="qc-hero">
                <div className="qc-grid" />

                {/* Animated headphone SVG */}
                <div ref={heroRef} style={{ marginBottom: 48, position: 'relative', zIndex: 1 }}>
                    <svg viewBox="0 0 560 340" width="520" height="315" style={{ filter: 'drop-shadow(0 0 80px rgba(143,185,216,0.18))', maxWidth: '90vw', height: 'auto' }}>
                        <defs>
                            <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DDE8F2" stopOpacity="0.95" />
                                <stop offset="60%" stopColor="#8FB9D8" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#48677E" stopOpacity="0.3" />
                            </linearGradient>
                            <radialGradient id="cupGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#8FB9D8" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#8FB9D8" stopOpacity="0" />
                            </radialGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {/* headband arc */}
                        <path d="M120 155 Q280 48 440 155" stroke="url(#hg1)" strokeWidth="10" fill="none" strokeLinecap="round" filter="url(#glow)" />
                        <path d="M120 155 Q280 48 440 155" stroke="#DDE8F2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.3" strokeDasharray="4 12" />

                        {/* headband top cushion bar */}
                        <path d="M220 88 Q280 70 340 88" stroke="#8FB9D8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.45" />

                        {/* measurement lines */}
                        <line x1="280" y1="48" x2="280" y2="28" stroke="#48677E" strokeWidth="1" opacity="0.6" />
                        <line x1="260" y1="28" x2="300" y2="28" stroke="#48677E" strokeWidth="1" opacity="0.6" />
                        <text x="286" y="23" fontSize="9" fill="#48677E" fontFamily="monospace">820mm</text>

                        {/* left stem */}
                        <path d="M120 155 L108 230" stroke="#DDE8F2" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
                        <path d="M120 155 L108 230" stroke="url(#hg1)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
                        {/* right stem */}
                        <path d="M440 155 L452 230" stroke="#DDE8F2" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
                        <path d="M440 155 L452 230" stroke="url(#hg1)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />

                        {/* left hinge */}
                        <circle cx="110" cy="232" r="9" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.9" />
                        <circle cx="110" cy="232" r="3.5" fill="#DDE8F2" opacity="0.4" />
                        {/* right hinge */}
                        <circle cx="450" cy="232" r="9" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.9" />
                        <circle cx="450" cy="232" r="3.5" fill="#DDE8F2" opacity="0.4" />

                        {/* left ear cup glow fill */}
                        <ellipse cx="90" cy="252" rx="50" ry="62" fill="url(#cupGlow)" />
                        {/* left ear cup outer shell */}
                        <ellipse cx="90" cy="252" rx="46" ry="60" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.88" filter="url(#glow)" />
                        {/* left ear cup inner lip */}
                        <ellipse cx="90" cy="252" rx="40" ry="54" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.4" />
                        {/* left cushion ring */}
                        <ellipse cx="90" cy="262" rx="36" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
                        {/* left driver circles */}
                        <circle cx="90" cy="252" r="30" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
                        <circle cx="90" cy="252" r="21" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
                        <circle cx="90" cy="252" r="12" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
                        <circle cx="90" cy="252" r="4" fill="#DDE8F2" opacity="0.25" />
                        {/* left mesh lines */}
                        <line x1="64" y1="252" x2="116" y2="252" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.2" />
                        <line x1="90" y1="226" x2="90" y2="278" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.2" />

                        {/* right ear cup glow fill */}
                        <ellipse cx="470" cy="252" rx="50" ry="62" fill="url(#cupGlow)" />
                        {/* right ear cup outer shell */}
                        <ellipse cx="470" cy="252" rx="46" ry="60" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.88" filter="url(#glow)" />
                        {/* right ear cup inner lip */}
                        <ellipse cx="470" cy="252" rx="40" ry="54" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.4" />
                        {/* right cushion ring */}
                        <ellipse cx="470" cy="262" rx="36" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" />
                        {/* right driver circles */}
                        <circle cx="470" cy="252" r="30" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
                        <circle cx="470" cy="252" r="21" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
                        <circle cx="470" cy="252" r="12" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
                        <circle cx="470" cy="252" r="4" fill="#DDE8F2" opacity="0.25" />
                        {/* right mesh lines */}
                        <line x1="444" y1="252" x2="496" y2="252" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.2" />
                        <line x1="470" y1="226" x2="470" y2="278" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.2" />

                        {/* corner annotation marks */}
                        <line x1="36" y1="192" x2="36" y2="320" stroke="#48677E" strokeWidth="0.8" opacity="0.5" />
                        <line x1="30" y1="192" x2="42" y2="192" stroke="#48677E" strokeWidth="0.8" opacity="0.5" />
                        <line x1="30" y1="320" x2="42" y2="320" stroke="#48677E" strokeWidth="0.8" opacity="0.5" />
                        <text x="16" y="263" fontSize="8" fill="#48677E" fontFamily="monospace" transform="rotate(-90,16,263)">H: 90mm</text>
                    </svg>
                </div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
                    <h1 className="qc-hero-title">Quietcasts</h1>
                    <p className="qc-hero-sub">A calmer place for curious minds.</p>
                    <p className="qc-hero-desc">Podcasts for deeper thinking — wherever you are</p>
                </div>

                <div className="qc-scroll-hint">
                    <span>Scroll to explore</span>
                    <div className="qc-scroll-line" />
                </div>
            </section>

            {/* SCROLL-DRIVEN DISASSEMBLY */}
            <div ref={pinRef} className="qc-pin">
                <div className="qc-pin-sticky">
                    <div className="qc-grid" style={{ opacity: 0.02 }} />
                    <div className="qc-pin-label">01 — ANATOMY</div>

                    <svg viewBox="0 0 680 540" style={{ width: '90vw', maxWidth: 720, height: 'auto', filter: 'drop-shadow(0 0 100px rgba(143,185,216,0.1))' }}>
                        <defs>
                            <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DDE8F2" stopOpacity="0.9" />
                                <stop offset="60%" stopColor="#8FB9D8" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#48677E" stopOpacity="0.25" />
                            </linearGradient>
                            <radialGradient id="driverGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#8FB9D8" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#8FB9D8" stopOpacity="0" />
                            </radialGradient>
                            <filter id="glow2">
                                <feGaussianBlur stdDeviation="2" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {/* ─── HEADBAND ─── */}
                        <g ref={headbandRef}>
                            <path d="M140 155 Q340 60 540 155" stroke="url(#dg1)" strokeWidth="11" fill="none" strokeLinecap="round" filter="url(#glow2)" />
                            <path d="M140 155 Q340 60 540 155" stroke="#DDE8F2" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25" strokeDasharray="5 14" />
                            <path d="M240 98 Q340 72 440 98" stroke="#8FB9D8" strokeWidth="5.5" fill="none" strokeLinecap="round" opacity="0.4" />
                        </g>

                        {/* ─── LEFT HINGE ─── */}
                        <g ref={leftHingeRef}>
                            <path d="M140 155 L126 230" stroke="#DDE8F2" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
                            <circle cx="128" cy="232" r="11" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.9" />
                            <circle cx="128" cy="232" r="4" fill="#DDE8F2" opacity="0.35" />
                        </g>

                        {/* ─── RIGHT HINGE ─── */}
                        <g ref={rightHingeRef}>
                            <path d="M540 155 L554 230" stroke="#DDE8F2" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
                            <circle cx="552" cy="232" r="11" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.9" />
                            <circle cx="552" cy="232" r="4" fill="#DDE8F2" opacity="0.35" />
                        </g>

                        {/* ─── LEFT EAR CUP ─── */}
                        <g ref={leftCupRef}>
                            <ellipse cx="108" cy="256" rx="54" ry="68" fill="url(#driverGlow)" />
                            <ellipse cx="108" cy="256" rx="52" ry="68" fill="none" stroke="#DDE8F2" strokeWidth="4" opacity="0.88" filter="url(#glow2)" />
                            <ellipse cx="108" cy="256" rx="46" ry="62" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.35" />
                        </g>

                        {/* ─── RIGHT EAR CUP ─── */}
                        <g ref={rightCupRef}>
                            <ellipse cx="572" cy="256" rx="54" ry="68" fill="url(#driverGlow)" />
                            <ellipse cx="572" cy="256" rx="52" ry="68" fill="none" stroke="#DDE8F2" strokeWidth="4" opacity="0.88" filter="url(#glow2)" />
                            <ellipse cx="572" cy="256" rx="46" ry="62" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.35" />
                        </g>

                        {/* ─── LEFT DRIVER ─── */}
                        <g ref={leftDriverRef}>
                            <circle cx="108" cy="256" r="38" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
                            <circle cx="108" cy="256" r="27" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity="0.55" />
                            <circle cx="108" cy="256" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity="0.45" />
                            <circle cx="108" cy="256" r="6" fill="#DDE8F2" opacity="0.22" />
                            <line x1="75" y1="256" x2="141" y2="256" stroke="#8FB9D8" strokeWidth="0.7" opacity="0.2" />
                            <line x1="108" y1="223" x2="108" y2="289" stroke="#8FB9D8" strokeWidth="0.7" opacity="0.2" />
                        </g>

                        {/* ─── RIGHT DRIVER ─── */}
                        <g ref={rightDriverRef}>
                            <circle cx="572" cy="256" r="38" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
                            <circle cx="572" cy="256" r="27" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity="0.55" />
                            <circle cx="572" cy="256" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity="0.45" />
                            <circle cx="572" cy="256" r="6" fill="#DDE8F2" opacity="0.22" />
                            <line x1="539" y1="256" x2="605" y2="256" stroke="#8FB9D8" strokeWidth="0.7" opacity="0.2" />
                            <line x1="572" y1="223" x2="572" y2="289" stroke="#8FB9D8" strokeWidth="0.7" opacity="0.2" />
                        </g>

                        {/* ─── LEFT CUSHION ─── */}
                        <g ref={leftCushionRef}>
                            <ellipse cx="108" cy="270" rx="48" ry="60" fill="none" stroke="#8FB9D8" strokeWidth="3" strokeDasharray="7 7" opacity="0.55" />
                        </g>

                        {/* ─── RIGHT CUSHION ─── */}
                        <g ref={rightCushionRef}>
                            <ellipse cx="572" cy="270" rx="48" ry="60" fill="none" stroke="#8FB9D8" strokeWidth="3" strokeDasharray="7 7" opacity="0.55" />
                        </g>

                        {/* ─── PCB ─── */}
                        <g ref={pcbRef} opacity="0">
                            <rect x="290" y="400" width="100" height="64" rx="4" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
                            <circle cx="305" cy="416" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity="0.7" />
                            <circle cx="320" cy="428" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity="0.7" />
                            <circle cx="360" cy="420" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1.5" opacity="0.7" />
                            <line x1="305" y1="416" x2="320" y2="428" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.4" />
                            <line x1="320" y1="428" x2="360" y2="420" stroke="#8FB9D8" strokeWidth="0.8" opacity="0.4" />
                        </g>

                        {/* ─── LABELS ─── */}
                        <g ref={label1Ref} opacity="0">
                            <line x1="340" y1="60" x2="340" y2="40" stroke="#48677E" strokeWidth="0.8" />
                            <text x="346" y="36" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">HEADBAND</text>
                        </g>
                        <g ref={label2Ref} opacity="0">
                            <line x1="30" y1="155" x2="10" y2="155" stroke="#48677E" strokeWidth="0.8" />
                            <text x="0" y="143" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">HINGE</text>
                        </g>
                        <g ref={label3Ref} opacity="0">
                            <line x1="40" y1="200" x2="20" y2="200" stroke="#48677E" strokeWidth="0.8" />
                            <text x="0" y="188" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">EAR CUP</text>
                        </g>
                        <g ref={label4Ref} opacity="0">
                            <line x1="44" y1="256" x2="24" y2="256" stroke="#48677E" strokeWidth="0.8" />
                            <text x="0" y="244" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">DRIVER</text>
                        </g>
                        <g ref={label5Ref} opacity="0">
                            <line x1="340" y1="400" x2="340" y2="390" stroke="#48677E" strokeWidth="0.8" />
                            <text x="300" y="386" fontSize="9" fill="#48677E" fontFamily="monospace" letterSpacing="1.5">PCB / CIRCUIT</text>
                        </g>
                    </svg>
                </div>
            </div>

            {/* ABOUT */}
            <section id="about" style={{ background: '#05080D' }}>
                <div className="qc-about">
                    <div className="qc-about-grid">
                        <div>
                            <p className="qc-about-eyebrow">About Quietcasts</p>
                            <h2 className="qc-about-heading">Built around how you actually listen.</h2>
                            <p className="qc-about-body">Most podcast apps optimise for discovery metrics. Quietcasts optimises for depth. We built a space where subscriptions persist across devices, listening history is yours to keep, and the interface never gets in the way of the story.</p>
                        </div>
                        <div className="qc-about-stats">
                            <div>
                                <span className="qc-stat-num">∞</span>
                                <span className="qc-stat-label">Podcasts supported</span>
                            </div>
                            <div className="qc-stat-divider" />
                            <div>
                                <span className="qc-stat-num">100%</span>
                                <span className="qc-stat-label">Your data. Your library.</span>
                            </div>
                            <div className="qc-stat-divider" />
                            <div>
                                <span className="qc-stat-num">0</span>
                                <span className="qc-stat-label">Algorithmic distractions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={{ background: '#09111A' }}>
                <div className="qc-features">
                    <div className="qc-features-header">
                        <p className="qc-features-eyebrow">02 — Features</p>
                        <h2 className="qc-features-heading">Everything you need.<br />Nothing you don't.</h2>
                    </div>
                    <div className="qc-features-grid">
                        <div className="qc-feature-card">
                            <p className="qc-feature-num">01</p>
                            <svg className="qc-feature-icon" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="18" stroke="#8FB9D8" strokeWidth="1.5" />
                                <circle cx="24" cy="24" r="10" stroke="#DDE8F2" strokeWidth="1.5" />
                                <line x1="24" y1="6" x2="24" y2="14" stroke="#8FB9D8" strokeWidth="1.5" />
                                <line x1="24" y1="34" x2="24" y2="42" stroke="#8FB9D8" strokeWidth="1.5" />
                                <line x1="6" y1="24" x2="14" y2="24" stroke="#8FB9D8" strokeWidth="1.5" />
                                <line x1="34" y1="24" x2="42" y2="24" stroke="#8FB9D8" strokeWidth="1.5" />
                            </svg>
                            <h3 className="qc-feature-title">Discover</h3>
                            <p className="qc-feature-body">Find podcasts that actually match your thinking. Search the entire Apple Podcasts catalogue. No algorithmic manipulation.</p>
                        </div>
                        <div className="qc-feature-card">
                            <p className="qc-feature-num">02</p>
                            <svg className="qc-feature-icon" viewBox="0 0 48 48" fill="none">
                                <rect x="10" y="8" width="28" height="36" rx="2" stroke="#DDE8F2" strokeWidth="1.5" />
                                <line x1="16" y1="18" x2="32" y2="18" stroke="#8FB9D8" strokeWidth="1.5" />
                                <line x1="16" y1="25" x2="32" y2="25" stroke="#8FB9D8" strokeWidth="1.5" />
                                <line x1="16" y1="32" x2="24" y2="32" stroke="#8FB9D8" strokeWidth="1.5" />
                            </svg>
                            <h3 className="qc-feature-title">Save</h3>
                            <p className="qc-feature-body">Keep stories worth returning to. Download episodes offline. Your subscriptions and history sync across every device.</p>
                        </div>
                        <div className="qc-feature-card">
                            <p className="qc-feature-num">03</p>
                            <svg className="qc-feature-icon" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="14" stroke="#DDE8F2" strokeWidth="1.5" />
                                <polygon points="21,18 33,24 21,30" fill="#8FB9D8" opacity="0.7" />
                            </svg>
                            <h3 className="qc-feature-title">Listen</h3>
                            <p className="qc-feature-body">Variable playback speed. Sleep timer. Continue exactly where you left off. The player gets out of your way.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MANIFESTO */}
            <section style={{ background: '#05080D' }}>
                <div className="qc-manifesto">
                    <div className="qc-manifesto-bg" />
                    <div className="qc-manifesto-line" />
                    <p className="qc-manifesto-text">
                        "More than podcasts.<br />A listening space built around you."
                    </p>
                    <p className="qc-manifesto-sub">
                        Quietcasts is a premium podcast experience engineered for depth, not distraction.
                    </p>
                </div>
            </section>

            {/* SIGN IN */}
            <section id="signin" style={{ background: '#09111A' }}>
                <div className="qc-signin">
                    <div className="qc-signin-bg" />
                    <div className="qc-signin-card">
                        <p className="qc-signin-logo">Quietcasts</p>
                        <h2 className="qc-signin-heading">Welcome back.</h2>
                        <p className="qc-signin-sub">Your listening space, uninterrupted.</p>

                        {loginError && <p className="qc-error">{loginError}</p>}

                        <button
                            className="qc-google-btn"
                            onClick={() => void handleGoogle()}
                            disabled={isLoading}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {isLoading ? 'Signing in…' : 'Continue with Google'}
                        </button>

                        <div className="qc-divider">
                            <div className="qc-divider-line" />
                            <span className="qc-divider-text">or</span>
                            <div className="qc-divider-line" />
                        </div>

                        <input className="qc-input" type="email" placeholder="Email address" />
                        <input className="qc-input" type="password" placeholder="Password" />
                        <button className="qc-submit-btn">Sign in</button>

                        <p className="qc-signin-footer">
                            Don't have an account?{' '}
                            <button>Create one</button>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
