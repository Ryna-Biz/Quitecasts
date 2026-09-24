import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeadphoneAnimationProps {
  scrollSection: React.RefObject<HTMLDivElement>
}

export function HeadphoneAnimation({ scrollSection }: HeadphoneAnimationProps) {
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
  const pcbRef = useRef<SVGGElement>(null)
  const screwsRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!scrollSection.current || !svgRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSection.current,
        start: 'top top',
        end: 'bottom center',
        scrub: 1.2,
        pin: true,
        pinSpacing: false,
      },
    })

    // Phase 1: Headband separates upward
    tl.to(headbandRef.current, { y: -140, duration: 0.3 }, 0)

    // Phase 2: Hinges separate
    tl.to(leftHingeRef.current, { x: -120, y: 60, duration: 0.3 }, 0.1)
    tl.to(rightHingeRef.current, { x: 120, y: 60, duration: 0.3 }, 0.1)

    // Phase 3: Ear cups move outward
    tl.to(leftEarCupRef.current, { x: -180, y: 100, duration: 0.3 }, 0.2)
    tl.to(rightEarCupRef.current, { x: 180, y: 100, duration: 0.3 }, 0.2)

    // Phase 4: Cushions separate
    tl.to(leftCushionRef.current, { x: -220, y: 160, duration: 0.3 }, 0.3)
    tl.to(rightCushionRef.current, { x: 220, y: 160, duration: 0.3 }, 0.3)

    // Phase 5: Drivers separate
    tl.to(leftDriverRef.current, { x: -160, y: 200, opacity: 0.7, duration: 0.3 }, 0.4)
    tl.to(rightDriverRef.current, { x: 160, y: 200, opacity: 0.7, duration: 0.3 }, 0.4)

    // Phase 6: PCB and screws
    tl.to(pcbRef.current, { y: 280, opacity: 0.6, duration: 0.3 }, 0.5)
    tl.to(screwsRef.current, { y: 240, opacity: 0.8, duration: 0.3 }, 0.5)

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [scrollSection])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 600"
      className="w-full max-w-4xl h-auto mx-auto"
      style={{
        filter: 'drop-shadow(0 0 80px rgba(143, 185, 216, 0.12))',
      }}
    >
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DDE8F2" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#8FB9D8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#48677E" stopOpacity="0.3" />
        </linearGradient>
        <filter id="blueprintGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
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
          stroke="url(#metalGrad)"
          strokeWidth="5"
          fill="none"
          opacity="0.4"
        />
        <line x1="400" y1="150" x2="400" y2="190" stroke="#8FB9D8" strokeWidth="1" opacity="0.3" />
        <text x="410" y="185" fontSize="12" fill="#8FB9D8" opacity="0.5" fontFamily="monospace">
          ~82mm
        </text>
      </g>

      {/* Left Hinge */}
      <g ref={leftHingeRef}>
        <circle cx="240" cy="150" r="10" fill="none" stroke="#DDE8F2" strokeWidth="2.5" />
        <path d="M 235 150 L 245 150" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Right Hinge */}
      <g ref={rightHingeRef}>
        <circle cx="560" cy="150" r="10" fill="none" stroke="#DDE8F2" strokeWidth="2.5" />
        <path d="M 555 150 L 565 150" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Left Ear Cup */}
      <g ref={leftEarCupRef}>
        <ellipse cx="240" cy="280" rx="42" ry="55" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.9" />
        <ellipse cx="240" cy="280" rx="38" ry="51" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.3" />
      </g>

      {/* Right Ear Cup */}
      <g ref={rightEarCupRef}>
        <ellipse cx="560" cy="280" rx="42" ry="55" fill="none" stroke="#DDE8F2" strokeWidth="3.5" opacity="0.9" />
        <ellipse cx="560" cy="280" rx="38" ry="51" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.3" />
      </g>

      {/* Left Cushion */}
      <g ref={leftCushionRef}>
        <ellipse cx="240" cy="310" rx="38" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2.5" opacity="0.65" />
        <path d="M 210 310 Q 240 340 270 310" stroke="#8FB9D8" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Right Cushion */}
      <g ref={rightCushionRef}>
        <ellipse cx="560" cy="310" rx="38" ry="48" fill="none" stroke="#8FB9D8" strokeWidth="2.5" opacity="0.65" />
        <path d="M 530 310 Q 560 340 590 310" stroke="#8FB9D8" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Left Driver */}
      <g ref={leftDriverRef}>
        <circle cx="240" cy="280" r="32" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
        <circle cx="240" cy="280" r="24" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
        <circle cx="240" cy="280" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Right Driver */}
      <g ref={rightDriverRef}>
        <circle cx="560" cy="280" r="32" fill="none" stroke="#DDE8F2" strokeWidth="2.5" opacity="0.8" />
        <circle cx="560" cy="280" r="24" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
        <circle cx="560" cy="280" r="16" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.4" />
      </g>

      {/* PCB Circuit */}
      <g ref={pcbRef}>
        <rect x="320" y="420" width="160" height="100" fill="none" stroke="#8FB9D8" strokeWidth="1.5" opacity="0.5" />
        <circle cx="340" cy="440" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.6" />
        <circle cx="360" cy="450" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.6" />
        <circle cx="380" cy="445" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.6" />
        <circle cx="440" cy="455" r="4" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.6" />
        <text x="350" y="510" fontSize="10" fill="#8FB9D8" opacity="0.4" fontFamily="monospace">
          PCB / CIRCUIT
        </text>
      </g>

      {/* Screws */}
      <g ref={screwsRef}>
        <circle cx="280" cy="380" r="3" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.7" />
        <circle cx="320" cy="380" r="3" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.7" />
        <circle cx="480" cy="380" r="3" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.7" />
        <circle cx="520" cy="380" r="3" fill="none" stroke="#DDE8F2" strokeWidth="1" opacity="0.7" />
        <text x="350" y="400" fontSize="9" fill="#8FB9D8" opacity="0.4" fontFamily="monospace">
          FASTENERS
        </text>
      </g>

      {/* Technical annotations */}
      <g opacity="0.25">
        <line x1="140" y1="140" x2="180" y2="140" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="160" y1="135" x2="160" y2="145" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="620" y1="140" x2="660" y2="140" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="640" y1="135" x2="640" y2="145" stroke="#8FB9D8" strokeWidth="0.5" />
      </g>
    </svg>
  )
}