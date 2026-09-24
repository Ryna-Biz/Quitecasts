import React from 'react'

export function TransitionSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#05080D] to-[#05080D] flex flex-col items-center justify-center py-32 px-6">
      <div className="absolute inset-0 opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(143,185,216,0.1) 0%, transparent 50%)' }} />

      <svg
        viewBox="0 0 800 100"
        className="absolute w-full max-w-4xl h-auto top-1/3 opacity-10"
      >
        <path
          d="M 0 50 Q 100 30 200 50 T 400 50 T 600 50 T 800 50"
          fill="none"
          stroke="#8FB9D8"
          strokeWidth="2"
        />
      </svg>

      <div className="relative z-10 text-center max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#DDE8F2] mb-6">
          More than podcasts.
        </h2>
        <p className="text-xl text-[#8FB9D8] mb-12">
          A listening space, built around you.
        </p>
      </div>
    </section>
  )
}