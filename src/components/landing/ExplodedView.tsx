import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ExplodedView() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const components = sectionRef.current.querySelectorAll('[data-component]')
    components.forEach((comp, index) => {
      gsap.from(comp, {
        scrollTrigger: {
          trigger: comp,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-gradient-to-b from-[#09111A] to-[#05080D] flex flex-col items-center justify-center py-20 px-6">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(143,185,216,0.1) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-6xl w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#DDE8F2] mb-4">Every piece has a purpose.</h2>
          <p className="text-lg text-[#8FB9D8] max-w-2xl mx-auto">Like every story you hear.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: 'HEADBAND', desc: 'Premium structural support' },
            { label: 'HINGES', desc: 'Precision articulation' },
            { label: 'EAR CUPS', desc: 'Acoustic chambers' },
            { label: 'DRIVERS', desc: 'High-fidelity speakers' },
            { label: 'MEMORY FOAM', desc: 'All-day comfort' },
            { label: 'PCB', desc: 'Smart connectivity' }
          ].map((item, i) => (
            <div key={i} data-component={item.label} className="p-6 border border-[rgba(143,185,216,0.15)] rounded-lg bg-[rgba(9,17,26,0.4)]">
              <div className="w-12 h-12 mb-4 border-2 border-[#8FB9D8] rounded opacity-60" />
              <h3 className="text-sm font-medium text-[#DDE8F2] mb-2 tracking-wide">{item.label}</h3>
              <p className="text-xs text-[#8FB9D8]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}