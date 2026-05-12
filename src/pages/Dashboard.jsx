import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-forest/10 bg-cream/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-xl text-forest font-semibold">Bro Zaid Todak</a>
            <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">/ command centre</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hidden sm:inline">{email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-forest font-medium hover:underline underline-offset-4 decoration-gold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mb-2">Dashboard</p>
          <h1 className="font-display text-4xl text-forest">Welcome back, Zaid.</h1>
          <p className="text-muted mt-3 max-w-xl">
            This is your private command centre. Modules (Projects, 10 CAMP snapshot, Finance, Journey) akan masuk nanti dalam Phase 3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Projects', meta: 'Phase 3 — pending' },
            { name: '10 CAMP snapshot', meta: 'Phase 3 — pending' },
            { name: 'Finance', meta: 'Phase 3 — pending' },
            { name: 'Journey', meta: 'Phase 3 — pending' },
            { name: 'Goals & notes', meta: 'Phase 3 — pending' },
            { name: 'Phone repair log', meta: 'Optional' },
          ].map((m) => (
            <div key={m.name} className="bg-white rounded-2xl p-6 border border-forest/8 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">{m.meta}</p>
              <h2 className="font-display text-xl text-forest">{m.name}</h2>
              <p className="text-sm text-muted mt-3">Module akan diisi Phase 3.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
