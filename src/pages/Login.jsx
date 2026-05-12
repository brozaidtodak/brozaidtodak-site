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
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-2xl text-forest font-semibold">Bro Zaid Todak</a>
          <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mt-2">Command Centre</p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-forest/10 text-center">
            <h1 className="font-display text-2xl text-forest mb-3">Check your inbox</h1>
            <p className="text-sm text-muted leading-relaxed">
              We sent a magic link to <strong className="text-ink">{email}</strong>. Click the link to log in.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              className="mt-6 text-sm text-forest font-medium underline underline-offset-4 decoration-gold"
            >
              Use different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-forest/10">
            <h1 className="font-display text-2xl text-forest mb-2">Login</h1>
            <p className="text-sm text-muted mb-6">
              Masukkan email kau. Kami hantar magic link — click dari inbox terus masuk dashboard.
            </p>
            <label className="block">
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 rounded-full border border-forest/15 bg-cream text-ink focus:outline-none focus:border-forest"
                disabled={status === 'sending'}
              />
            </label>
            {error && (
              <p className="mt-3 text-sm text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 w-full bg-forest text-cream font-semibold py-3 rounded-full hover:bg-forest-deep transition disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending link…' : 'Send magic link'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-muted">
          <a href="/" className="underline underline-offset-4 decoration-forest/30 hover:text-forest">← Back to home</a>
        </p>
      </div>
    </div>
  )
}
