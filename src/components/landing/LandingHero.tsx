import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headphoneRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!headphoneRef.current) return

    gsap.to(headphoneRef.current, {
      y: 8,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#05080D] via-[#09111A] to-[#05080D] flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #8FB9D8 1px, transparent 1px),
            linear-gradient(0deg, #8FB9D8 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="absolute inset-0 opacity-[0.02]">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: '#8FB9D8',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${20 + Math.random() * 20}s infinite`,
            }}
          />
        ))}
      </div>

      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8">
        <div className="text-xl font-light tracking-wide text-[#DDE8F2]">Quietcasts</div>
        <div className="hidden md:flex gap-12 items-center">
          <a href="#about" className="text-sm text-[#8FB9D8] hover:text-[#DDE8F2] transition-colors">
            About
          </a>
          <a href="#features" className="text-sm text-[#8FB9D8] hover:text-[#DDE8F2] transition-colors">
            Features
          </a>
          <button className="px-6 py-2 text-sm border border-[#8FB9D8] text-[#8FB9D8] hover:border-[#DDE8F2] hover:text-[#DDE8F2] transition-colors">
            Sign in
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
        <svg
          ref={headphoneRef}
          viewBox="0 0 600 400"
          className="w-full max-w-md h-auto mb-8"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(143, 185, 216, 0.15))',
          }}
        >
          <defs>
            <linearGradient id="heroMetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDE8F2" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8FB9D8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#48677E" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <path
            d="M 150 120 Q 300 50 450 120"
            stroke="#DDE8F2"
            strokeWidth="8"
            fill="none"
            opacity="0.95"
            strokeLinecap="round"
          />
          <path
            d="M 150 120 Q 300 50 450 120"
            stroke="url(#heroMetalGradient)"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />

          <circle cx="180" cy="120" r="8" fill="none" stroke="#DDE8F2" strokeWidth="2" />
          <circle cx="420" cy="120" r="8" fill="none" stroke="#DDE8F2" strokeWidth="2" />

          <ellipse cx="140" cy="200" rx="35" ry="45" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.85" />
          <ellipse cx="140" cy="215" rx="32" ry="42" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity="0.6" />
          <circle cx="140" cy="200" r="28" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
          <circle cx="140" cy="200" r="20" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity="0.5" />

          <ellipse cx="460" cy="200" rx="35" ry="45" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.85" />
          <ellipse cx="460" cy="215" rx="32" ry="42" fill="none" stroke="#8FB9D8" strokeWidth="2" opacity="0.6" />
          <circle cx="460" cy="200" r="28" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
          <circle cx="460" cy="200" r="20" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity="0.5" />

          <line x1="300" y1="120" x2="300" y2="150" stroke="#8FB9D8" strokeWidth="1" opacity="0.3" />
          <text x="310" y="145" fontSize="10" fill="#8FB9D8" opacity="0.5">
            82mm
          </text>
        </svg>

        <h1 className="text-5xl md:text-6xl font-light tracking-tight text-[#DDE8F2] text-center mb-4">
          Quietcasts
        </h1>

        <p className="text-lg md:text-xl text-[#8FB9D8] text-center mb-3 max-w-2xl">
          A calmer place for curious minds.
        </p>

        <p className="text-sm md:text-base text-[#48677E] text-center max-w-2xl mb-16">
          Podcasts for deeper thinking, wherever you are.
        </p>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs text-[#8FB9D8] uppercase tracking-widest opacity-60">Scroll to explore</p>
          <div className="w-6 h-10 border border-[#8FB9D8] rounded-full flex items-center justify-center opacity-40">
            <div
              className="w-1 h-2 bg-[#8FB9D8] rounded-full"
              style={{
                animation: 'scroll-indicator 2s infinite',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-indicator {
          0%, 20% {
            opacity: 0;
            transform: translateY(-8px);
          }
          50% {
            opacity: 1;
          }
          80%, 100% {
            opacity: 0;
            transform: translateY(8px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </section>
  )
}