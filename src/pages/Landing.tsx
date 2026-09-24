import React from 'react'
import { useAuth } from '../context/AuthContext'
import { LandingHero } from '../components/landing/LandingHero'
import { DisassemblySection } from '../components/landing/DisassemblySection'
import { ExplodedView } from '../components/landing/ExplodedView'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { TransitionSection } from '../components/landing/TransitionSection'
import { LandingSignIn } from '../components/landing/LandingSignIn'

export function Landing() {
  const { user } = useAuth()

  if (user) {
    window.location.href = '/'
    return null
  }

  return (
    <div className="bg-[#05080D] text-[#DDE8F2] overflow-hidden">
      <LandingHero />
      <DisassemblySection />
      <ExplodedView />
      <FeaturesSection />
      <TransitionSection />
      <LandingSignIn />
    </div>
  )
}