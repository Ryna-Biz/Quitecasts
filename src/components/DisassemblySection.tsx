import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function DisassemblySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const headbandRef = useRef<SVGGElement>(null)
  const leftHingeRef = useRef<SVGGElement>(null)
  const rightHingeRef = useRef<SVGGElement>(null)
  const leftEarCupRef = useRef<SVGGElement>(null)
  const rightEarCupRef = useRef<SVGGElement>(null)
  const leftDriverRef = useRef<SVGGElement>(null)
  const rightDriverRef = useRef<SVGGElement>(null)
  const leftCushionRef = useRef<SVGGElement>(null)
  const rightCushionRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !svgRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom center',
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
      },
    })

    tl.to(headbandRef.current, { y: -160 }, 0)
      .to(leftHingeRef.current, { x: -140, y: 80 }, 0.1)
      .to(rightHingeRef.current, { x: 140, y: 80 }, 0.1)
      .to(leftEarCupRef.current, { x: -200, y: 120 }, 0.2)
      .to(rightEarCupRef.current, { x: 200, y: 120 }, 0.2)
      .to(leftCushionRef.current, { x: -240, y: 180 }, 0.3)
      .to(rightCushionRef.current, { x: 240, y: 180 }, 0.3)
      .to(leftDriverRef.current, { x: -180, y: 220, opacity: 0.8 }, 0.4)
      .to(rightDriverRef.current, { x: 180, y: 220, opacity: 0.8 }, 0.4)

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [sectionRef])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#05080D] to-[#09111A] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(143,185,216,0.1) 0%, transparent 50%)' }} />

      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full max-w-4xl h-auto"
        style={{
          filter: 'drop-shadow(0 0 80px rgba(143, 185, 216, 0.12))',
        }}
      >
        <defs>
          <linearGradient id="disassemblyMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DDE8F2" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8FB9D8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#48677E" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Headband */}
        <g ref={headbandRef}>
          <path
            d="M 200 150 Q 400 60 600 150"
            stroke="#DDE8F2"
            strokeWidth="10"
            fill="none"
            opacity="0.95"
            strokeLinecap="round"
          />
          <path
            d="M 200 150 Q 400 60 600 150"
            stroke="url(#disassemblyMetalGrad)"
            strokeWidth="5"
            fill="none"
            opacity="0.4"
          />
        </g>

        {/* Left Hinge */}
        <g ref={leftHingeRef}>
          <circle cx="240" cy="150" r="10" fill="none" stroke="#DDE8F2" strokeWidth="2.5" />
          <path d="M 235 150 L 245 150" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
          <text x="235" y="180" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            HINGE
          </text>
        </g>

        {/* Right Hinge */}
        <g ref={rightHingeRef}>
          <circle cx="560" cy="150" r="10" fill="none" stroke="#DDE8F2" strokeWidth="2.5" />
          <path d="M 555 150 L 565 150" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
          <text x="540" y="180" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            HINGE
          </text>
        </g>

        {/* Left Ear Cup */}
        <g ref={leftEarCupRef}>
          <ellipse cx="240" cy="280" rx="42" ry="55" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.9" />
          <ellipse cx="240" cy="280" rx="38" ry="51" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.3" />
          <text x="200" y="360" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            EAR CUP
          </text>
        </g>

        {/* Right Ear Cup */}
        <g ref={rightEarCupRef}>
          <ellipse cx="560" cy="280" rx="42" ry="55" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.9" />
          <ellipse cx="560" cy="280" rx="38" ry="51" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.3" />
          <text x="535" y="360" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            EAR CUP
          </text>
        </g>

        {/* Left Cushion */}
        <g ref={leftCushionRef}>
          <ellipse cx="240" cy="310" rx="38" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2.5" opacity="0.65" />
          <path d="M 210 310 Q 240 340 270 310" stroke="#8FB9D8" strokeWidth="1" opacity="0.4" />
          <text x="190" y="420" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            MEMORY FOAM
          </text>
        </g>

        {/* Right Cushion */}
        <g ref={rightCushionRef}>
          <ellipse cx="560" cy="310" rx="38" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2.5" opacity="0.65" />
          <path d="M 530 310 Q 560 340 590 310" stroke="#8FB9D8" strokeWidth="1" opacity="0.4" />
          <text x="510" y="420" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            MEMORY FOAM
          </text>
        </g>

        {/* Left Driver */}
        <g ref={leftDriverRef}>
          <circle cx="240" cy="280" r="32" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
          <circle cx="240" cy="280" r="24" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
          <circle cx="240" cy="280" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
          <text x="190" y="540" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            DRIVER
          </text>
        </g>

        {/* Right Driver */}
        <g ref={rightDriverRef}>
          <circle cx="560" cy="280" r="32" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
          <circle cx="560" cy="280" r="24" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
          <circle cx="560" cy="280" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
          <text x="520" y="540" fontSize="11" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
            DRIVER
          </text>
        </g>
      </svg>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-[#8FB9D8] opacity-60">Scroll to disassemble</p>
      </div>
    </section>
  )
}