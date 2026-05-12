import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setStatus('error')
      setError(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1812] text-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-2xl text-cream font-semibold">Bro Zaid Todak</a>
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mt-2">Command Centre</p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
            <h1 className="font-display text-2xl text-cream mb-3">Check your inbox</h1>
            <p className="text-sm text-cream/65 leading-relaxed">
              We sent a magic link to <strong className="text-cream">{email}</strong>. Click the link to log in.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              className="mt-6 text-sm text-gold hover:text-gold-dark transition underline underline-offset-4 decoration-gold/40"
            >
              Use different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h1 className="font-display text-2xl text-cream mb-2">Login</h1>
            <p className="text-sm text-cream/65 mb-6">
              Masukkan email kau. Kami hantar magic link — click dari inbox terus masuk dashboard.
            </p>
            <label className="block">
              <span className="text-[11px] font-medium text-cream/50 uppercase tracking-wider">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 rounded-full bg-white/[0.04] border border-white/10 text-cream focus:outline-none focus:border-gold transition"
                disabled={status === 'sending'}
              />
            </label>
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 w-full bg-gold text-forest-deep font-semibold py-3 rounded-full hover:bg-gold-dark transition disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending link…' : 'Send magic link'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-cream/45">
          <a href="/" className="hover:text-cream transition">← Back to home</a>
        </p>
      </div>
    </div>
  )
}
