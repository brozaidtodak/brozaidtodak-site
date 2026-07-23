import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

// ============================================================
// ROADMAP AWAM — peta jalan pembangunan brozaidtodak.com sendiri.
// Gate password RINGKAS client-side (zaidtodak99) — untuk kongsi,
// BUKAN keselamatan sebenar (kod nampak di pelayar). Roadmap dalaman
// penuh (semua projek, dari Brain) kekal di /dashboard/roadmap.
// Tema selaras Landing "Todak monokrom".
// ============================================================

const GATE_PASSWORD = 'zaidtodak99'
const UNLOCK_KEY = 'bzt-roadmap-unlock'

// s: 'done' | 'progress' | 'planned'
const ROADMAP = [
  {
    phase: 'Fasa 1 — Landing awam',
    eta: 'Siap · Mei–Jul 2026',
    items: [
      { t: 'Reka bentuk sinematik "Todak monokrom"', s: 'done' },
      { t: 'Latar video laut ribut + sparks background', s: 'done' },
      { t: 'Animasi GSAP — tajuk, scroll reveal, count-up, parallax', s: 'done' },
      { t: 'Jejak bara ikut kursor di hero', s: 'done' },
      { t: 'Seksyen portfolio — 6 projek', s: 'done' },
      { t: 'Garis masa perjalanan (2021 → 2026)', s: 'done' },
    ],
  },
  {
    phase: 'Fasa 2 — Command Centre (dashboard peribadi)',
    eta: 'Siap · Mei 2026',
    items: [
      { t: 'Log masuk selamat (Supabase)', s: 'done' },
      { t: 'Modul Projek + milestone', s: 'done' },
      { t: 'Modul Kewangan (multi-mata wang)', s: 'done' },
      { t: 'Modul Portfolio', s: 'done' },
      { t: 'Roadmap dalaman — semua projek dari Brain', s: 'done' },
    ],
  },
  {
    phase: 'Fasa 3 — Pelbagai bahasa',
    eta: 'Jul 2026',
    items: [
      { t: 'Tukar bahasa BM / English', s: 'done' },
      { t: 'Terjemahan Mandarin (中文)', s: 'planned', note: 'Struktur sedia — teks tunggu' },
      { t: 'Terjemahan Tamil (தமிழ்)', s: 'planned', note: 'Struktur sedia — teks tunggu' },
    ],
  },
  {
    phase: 'Fasa 4 — Dashboard data sebenar',
    eta: 'Akan datang',
    items: [
      { t: 'Modul snapshot bisnes 10 CAMP', s: 'planned' },
      { t: 'Penyambung API POS — angka jualan sebenar', s: 'planned' },
      { t: 'Modul matlamat & nota peribadi', s: 'planned' },
      { t: 'Log kerja baiki telefon', s: 'planned', note: 'Pilihan' },
    ],
  },
  {
    phase: 'Fasa 5 — Poles & lancar',
    eta: 'Akan datang',
    items: [
      { t: 'Audit responsif mobile penuh', s: 'planned' },
      { t: 'Analitik trafik (Plausible)', s: 'planned' },
      { t: 'SEO — sitemap, robots.txt, og-image', s: 'planned' },
      { t: 'Lighthouse 90+ (laju & kualiti)', s: 'planned' },
    ],
  },
]

const STATUS = {
  done:     { label: 'Siap',   dot: 'bg-white',           text: 'text-white/90', pill: 'border-white/25 text-white/80' },
  progress: { label: 'Sedang', dot: 'bg-accent',          text: 'text-white',    pill: 'border-accent/50 text-accent' },
  planned:  { label: 'Akan',   dot: 'bg-white/25',        text: 'text-white/55', pill: 'border-white/15 text-white/45' },
}

function phaseStatus(items) {
  if (items.every((i) => i.s === 'done')) return 'done'
  if (items.some((i) => i.s === 'done' || i.s === 'progress')) return 'progress'
  return 'planned'
}

export default function SiteRoadmap() {
  const [unlocked, setUnlocked] = useState(
    () => {
      try { return sessionStorage.getItem(UNLOCK_KEY) === '1' } catch { return false }
    }
  )

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />
  return <RoadmapView />
}

function Gate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = (e) => {
    e.preventDefault()
    if (value.trim() === GATE_PASSWORD) {
      try { sessionStorage.setItem(UNLOCK_KEY, '1') } catch { /* abai */ }
      onUnlock()
    } else {
      setError(true)
      setValue('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-void text-white font-sans flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className={`w-full max-w-sm rounded-2xl border border-white/12 bg-white/[0.03] p-8 text-center ${error ? 'gate-shake' : ''}`}
      >
        <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-accent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="font-display font-bold text-2xl tracking-tight">Roadmap</h1>
        <p className="text-white/55 text-sm mt-2 mb-6">
          Halaman ini dilindungi. Masukkan kata laluan untuk lihat peta jalan brozaidtodak.com.
        </p>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          placeholder="Kata laluan"
          aria-label="Kata laluan"
          className={`w-full px-4 py-3 rounded-full bg-white/[0.05] border text-center text-sm outline-none transition placeholder:text-white/30 ${
            error ? 'border-accent/70' : 'border-white/15 focus:border-white/40'
          }`}
        />
        {error && (
          <p className="text-accent text-xs mt-2">Kata laluan salah. Cuba lagi.</p>
        )}
        <button
          type="submit"
          className="mt-5 w-full px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-white/85 transition"
        >
          Buka
        </button>
        <Link to="/" className="block mt-5 text-xs text-white/40 hover:text-white/70 transition">
          ← Kembali ke laman utama
        </Link>
      </form>
    </div>
  )
}

function RoadmapView() {
  const { done, total, percent } = useMemo(() => {
    const all = ROADMAP.flatMap((p) => p.items)
    const d = all.filter((i) => i.s === 'done').length
    return { done: d, total: all.length, percent: Math.round((d / all.length) * 100) }
  }, [])

  return (
    <div className="min-h-screen bg-void text-white font-sans">
      {/* nav */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/8">
        <Link to="/" className="font-sans font-black lowercase tracking-tight leading-none text-lg">
          <span className="text-white">bro</span>
          <span className="text-accent">zaid</span>
          <span className="text-white">todak</span>
        </Link>
        <Link to="/" className="text-xs text-white/55 hover:text-white transition">
          ← Laman utama
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/55 uppercase">— Roadmap</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mt-3">
          Peta jalan brozaidtodak.com
        </h1>
        <p className="text-white/65 leading-relaxed mt-4 max-w-xl">
          Ke mana laman & Command Centre ini menuju — apa yang dah siap, sedang dibina, dan akan datang.
          Dikemas kini bila ada perkembangan.
        </p>

        {/* progress keseluruhan */}
        <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
          <div className="flex items-baseline justify-between mb-2.5">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/55">Kemajuan keseluruhan</span>
            <span className="font-display font-bold text-lg">
              {percent}<span className="text-white/40 text-sm">% · {done}/{total}</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* fasa-fasa */}
        <div className="mt-12 space-y-12">
          {ROADMAP.map((phase) => {
            const ps = STATUS[phaseStatus(phase.items)]
            return (
              <section key={phase.phase}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight">{phase.phase}</h2>
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 border rounded-full ${ps.pill}`}>
                    {ps.label}
                  </span>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider ml-auto">{phase.eta}</span>
                </div>
                <ul className="border-l border-white/10 pl-5 space-y-3.5">
                  {phase.items.map((item) => {
                    const s = STATUS[item.s]
                    return (
                      <li key={item.t} className="flex items-start gap-3">
                        <span className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${s.dot}`} aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[15px] leading-snug ${s.text}`}>{item.t}</p>
                          {item.note && (
                            <p className="text-white/40 text-xs mt-0.5">{item.note}</p>
                          )}
                        </div>
                        <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border rounded-full shrink-0 ${s.pill}`}>
                          {s.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>© 2026 Bro Zaid Todak</span>
          <Link to="/" className="hover:text-white/80 transition">← Laman utama</Link>
        </div>
      </main>
    </div>
  )
}
