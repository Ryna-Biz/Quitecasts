import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export function LandingSignIn() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Email sign-in would be implemented here
  }

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#05080D] via-[#09111A] to-[#05080D] flex flex-col items-center justify-center py-24 px-6">
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 50% 70%, rgba(143,185,216,0.08) 0%, transparent 50%)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#DDE8F2] mb-4">
            Welcome to Quietcasts.
          </h2>
          <p className="text-[#8FB9D8]">
            Your listening space, uninterrupted.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[rgba(9,17,26,0.8)] border border-[rgba(143,185,216,0.15)] rounded-2xl p-8 backdrop-blur-sm">
          {/* Google Sign In */}
          <button
            onClick={() => void handleGoogleSignIn()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#DDE8F2] text-[#05080D] font-medium rounded-lg hover:bg-[#ffffff] transition-colors disabled:opacity-60 mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(143,185,216,0.15)]" />
            <span className="text-xs text-[#48677E] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[rgba(143,185,216,0.15)]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-[rgba(5,8,13,0.6)] border border-[rgba(143,185,216,0.2)] rounded-lg text-[#DDE8F2] placeholder-[#48677E] focus:border-[#8FB9D8] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-[rgba(5,8,13,0.6)] border border-[rgba(143,185,216,0.2)] rounded-lg text-[#DDE8F2] placeholder-[#48677E] focus:border-[#8FB9D8] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#8FB9D8] text-[#05080D] font-medium rounded-lg hover:bg-[#DDE8F2] transition-colors"
            >
              Sign in
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-6 text-sm text-[#48677E]">
            Don't have an account?{' '}
            <button className="text-[#8FB9D8] hover:text-[#DDE8F2] transition-colors">
              Create one
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs text-[#48677E]">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  )
}