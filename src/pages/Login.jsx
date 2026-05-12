import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setStatus('error')
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1812] text-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-2xl text-cream font-semibold">Bro Zaid Todak</a>
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mt-2">Command Centre</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl text-cream mb-2">Login</h1>
          <p className="text-sm text-cream/65 mb-6">
            Masuk dengan email + password. Save dalam password manager — autofill terus.
          </p>

          <label className="block mb-4">
            <span className="text-[11px] font-medium text-cream/50 uppercase tracking-wider">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full px-4 py-3 rounded-full bg-white/[0.04] border border-white/10 text-cream focus:outline-none focus:border-gold transition"
              disabled={status === 'sending'}
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium text-cream/50 uppercase tracking-wider">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 w-full px-4 py-3 rounded-full bg-white/[0.04] border border-white/10 text-cream focus:outline-none focus:border-gold transition"
              disabled={status === 'sending'}
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-6 w-full bg-gold text-forest-deep font-semibold py-3 rounded-full hover:bg-gold-dark transition disabled:opacity-50"
          >
            {status === 'sending' ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-cream/45">
          <a href="/" className="hover:text-cream transition">← Back to home</a>
        </p>
      </div>
    </div>
  )
}
