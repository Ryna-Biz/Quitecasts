import React from 'react'

export function FeaturesSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#05080D] via-[#09111A] to-[#05080D] py-32 px-6">
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, rgba(143,185,216,0.08) 0%, transparent 50%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#DDE8F2] mb-6">Built for deeper listening.</h2>
          <p className="text-lg text-[#8FB9D8]">Components that work together. Features that matter.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: 'Discover', desc: 'Find new voices and perspectives. Curated recommendations that understand your taste.' },
            { title: 'Save', desc: 'Keep stories worth returning to. Your library follows you everywhere.' },
            { title: 'Listen', desc: 'Take it anywhere. Offline support and seamless device switching.' }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="mb-6 w-16 h-16 border border-[#8FB9D8] rounded opacity-40" />
              <h3 className="text-xl font-light text-[#DDE8F2] mb-3">{item.title}</h3>
              <p className="text-sm text-[#8FB9D8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}