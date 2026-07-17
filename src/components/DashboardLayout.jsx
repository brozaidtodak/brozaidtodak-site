import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Overview',
    end: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    to: '/dashboard/financial',
    label: 'Financial',
    icon: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
  },
  {
    to: '/dashboard/portfolio',
    label: 'Portfolio',
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  {
    to: '/dashboard/roadmap',
    label: 'Roadmap',
    icon: (
      <>
        <polyline points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </>
    ),
  },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0c1812] text-cream">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 shrink-0 min-h-screen border-r border-white/8 bg-[#0a1610] flex-col">
          <div className="px-5 py-5 border-b border-white/8">
            <Link to="/" className="font-display text-lg text-cream font-semibold leading-tight block">
              Bro Zaid Todak
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold mt-1">
              Command Centre
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/25'
                      : 'text-cream/65 hover:text-cream hover:bg-white/[0.04] border border-transparent'
                  }`
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-white/8 flex flex-col gap-1">
            <div className="px-3 py-2 text-[11px] text-cream/40 font-mono truncate" title={email}>
              {email}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-cream/60 hover:text-cream hover:bg-white/[0.04] transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <header className="md:hidden border-b border-white/8 px-5 py-3 flex items-center justify-between bg-[#0a1610] sticky top-0 z-10">
            <Link to="/" className="font-display text-lg text-cream font-semibold">
              Bro Zaid Todak
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-cream/60 hover:text-cream"
            >
              Logout
            </button>
          </header>

          {/* Mobile horizontal nav */}
          <nav className="md:hidden flex gap-2 px-5 py-3 border-b border-white/8 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    isActive
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'text-cream/60 border border-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <main className="px-6 md:px-10 py-8 md:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
