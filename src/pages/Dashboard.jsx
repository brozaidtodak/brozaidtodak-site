import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Projects from '../components/Projects.jsx'

const PENDING_MODULES = [
  { name: '10 CAMP snapshot', meta: 'Phase 3 · high priority' },
  { name: 'Finance', meta: 'Phase 3 · medium' },
  { name: 'Journey', meta: 'Phase 3 · medium' },
  { name: 'Goals & notes', meta: 'Phase 3 · low' },
  { name: 'Phone repair log', meta: 'Optional' },
]

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
    <div className="min-h-screen bg-[#0c1812] text-cream">
      <header className="border-b border-white/8 bg-[#0c1812]/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-xl text-cream font-semibold">Bro Zaid Todak</a>
            <span className="font-mono text-[11px] uppercase tracking-widest text-gold">/ command centre</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-cream/50 hidden sm:inline">{email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-cream/70 hover:text-cream font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Dashboard</p>
          <h1 className="font-display text-4xl text-cream">Welcome back, Zaid.</h1>
        </div>

        <Projects />

        <section className="mt-16">
          <div className="mb-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-1.5">Coming next</p>
            <h2 className="font-display text-lg text-cream/70">More modules pending build</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {PENDING_MODULES.map((m) => (
              <div key={m.name} className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-cream/35 mb-1">{m.meta}</p>
                <h3 className="font-display text-sm text-cream/55">{m.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
