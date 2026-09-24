import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BlueprintHeadphoneProps {
  containerRef?: React.RefObject<HTMLDivElement>
}

export function BlueprintHeadphone({ containerRef }: BlueprintHeadphoneProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const headbandRef = useRef<SVGGElement>(null)
  const leftEarRef = useRef<SVGGElement>(null)
  const rightEarRef = useRef<SVGGElement>(null)
  const leftDriverRef = useRef<SVGGElement>(null)
  const rightDriverRef = useRef<SVGGElement>(null)
  const leftCushionRef = useRef<SVGGElement>(null)
  const rightCushionRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef?.current,
        start: 'top top',
        end: 'bottom center',
        scrub: 1.2,
        markers: false,
      },
    })

    timeline
      .to(headbandRef.current, { y: -120, duration: 1 }, 0.2)
      .to(leftEarRef.current, { x: -180, y: 80, duration: 1 }, 0.2)
      .to(rightEarRef.current, { x: 180, y: 80, duration: 1 }, 0.2)
      .to(leftDriverRef.current, { x: -220, y: 140, duration: 1 }, 0.3)
      .to(rightDriverRef.current, { x: 220, y: 140, duration: 1 }, 0.3)
      .to(leftCushionRef.current, { x: -160, y: 200, duration: 1 }, 0.4)
      .to(rightCushionRef.current, { x: 160, y: 200, duration: 1 }, 0.4)

    return () => {
      timeline.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [containerRef])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 400"
      width="600"
      height="400"
      className="w-full h-auto max-w-2xl"
      style={{ filter: 'drop-shadow(0 0 60px rgba(143, 185, 216, 0.15))' }}
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#DDE8F2', stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: '#8FB9D8', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#48677E', stopOpacity: 0.4 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Headband */}
      <g ref={headbandRef}>
        <path
          d="M 150 100 Q 300 40 450 100"
          stroke="#DDE8F2"
          strokeWidth="8"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M 150 100 Q 300 40 450 100"
          stroke="url(#metalGradient)"
          strokeWidth="4"
          fill="none"
          opacity="0.5"
        />
        {/* Measurement lines */}
        <line x1="300" y1="100" x2="300" y2="130" stroke="#8FB9D8" strokeWidth="1" opacity="0.4" />
        <text x="310" y="125" fontSize="10" fill="#8FB9D8" opacity="0.6">
          82mm
        </text>
      </g>

      {/* Left Ear Cup Group */}
      <g ref={leftEarRef}>
        {/* Left Hinge */}
        <g>
          <circle cx="180" cy="120" r="8" fill="none" stroke="#DDE8F2" strokeWidth="2" />
          <line x1="170" y1="120" x2="190" y2="120" stroke="#DDE8F2" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Left Ear Cup */}
        <ellipse cx="140" cy="180" rx="35" ry="45" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.8" />

        {/* Left Cushion */}
        <g ref={leftCushionRef}>
          <ellipse
            cx="140"
            cy="200"
            rx="32"
            ry="42"
            fill="none"
            stroke="#8FB9D8"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>

        {/* Left Driver */}
        <g ref={leftDriverRef}>
          <circle cx="140" cy="180" r="28" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
          <circle cx="140" cy="180" r="20" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity="0.5" />
        </g>
      </g>

      {/* Right Ear Cup Group */}
      <g ref={rightEarRef}>
        {/* Right Hinge */}
        <g>
          <circle cx="420" cy="120" r="8" fill="none" stroke="#DDE8F2" strokeWidth="2" />
          <line x1="410" y1="120" x2="430" y2="120" stroke="#DDE8F2" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Right Ear Cup */}
        <ellipse cx="460" cy="180" rx="35" ry="45" fill="none" stroke="#DDE8F2" strokeWidth="3" opacity="0.8" />

        {/* Right Cushion */}
        <g ref={rightCushionRef}>
          <ellipse
            cx="460"
            cy="200"
            rx="32"
            ry="42"
            fill="none"
            stroke="#8FB9D8"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>

        {/* Right Driver */}
        <g ref={rightDriverRef}>
          <circle cx="460" cy="180" r="28" fill="none" stroke="#DDE8F2" strokeWidth="2" opacity="0.7" />
          <circle cx="460" cy="180" r="20" fill="none" stroke="#8FB9D8" strokeWidth="1" opacity="0.5" />
        </g>
      </g>

      {/* Technical annotations */}
      <g opacity="0.4">
        <line x1="80" y1="100" x2="120" y2="100" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="100" y1="95" x2="100" y2="105" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="80" y1="280" x2="120" y2="280" stroke="#8FB9D8" strokeWidth="0.5" />
        <line x1="100" y1="275" x2="100" y2="285" stroke="#8FB9D8" strokeWidth="0.5" />
        <text x="125" y="190" fontSize="8" fill="#8FB9D8" opacity="0.5">
          ACOUSTIC
        </text>
      </g>
    </svg>
  )
}