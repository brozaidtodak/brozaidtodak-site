import { useEffect, useMemo, useState } from 'react'
import { loadRoadmap, PROJECT_META, STATUS_META, summariseProject } from '../lib/roadmap.js'

const PROJECT_ORDER = ['broz', 'pos', '10cc', 'kk']

function StatusPill({ status }) {
  const s = STATUS_META[status] ?? STATUS_META.plan
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-full ${s.cls}`}
    >
      {s.label}
    </span>
  )
}

function ProjectTab({ slug, active, onClick, summary }) {
  const meta = PROJECT_META[slug]
  if (!meta) return null
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-xl border transition shrink-0 min-w-[180px] ${
        active
          ? 'border-gold/40 bg-gold/5'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.accent }} />
        <span className="font-display text-sm text-cream">{meta.label}</span>
      </div>
      <p className="text-[11px] text-cream/45 mb-2 truncate">{meta.subtitle}</p>
      <div className="flex items-center gap-3 text-[11px] font-mono text-cream/55">
        <span>{summary.done}/{summary.items}</span>
        <span className="text-cream/30">·</span>
        <span>{summary.percent}%</span>
      </div>
    </button>
  )
}

function Phase({ phase }) {
  const meta = phase.meta ?? {}
  return (
    <section>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
          {meta.num || phase.code}
        </span>
        <h3 className="font-display text-lg text-cream">{phase.title}</h3>
        <StatusPill status={phase.status} />
        {meta.eta && (
          <span className="font-mono text-[10px] text-cream/40">{meta.eta}</span>
        )}
      </div>
      {meta.goal && (
        <p className="text-cream/60 text-xs mb-1">{meta.goal}</p>
      )}
      {phase.description && (
        <p className="text-cream/50 text-sm mb-4 max-w-2xl">{phase.description}</p>
      )}
      {phase.items.length > 0 && (
        <ul className="border-l border-white/8 pl-5 space-y-3">
          {phase.items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0"><StatusPill status={item.status} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-cream/90 text-sm">{item.name}</p>
                {item.note && (
                  <p className="text-cream/40 text-xs mt-0.5">{item.note}</p>
                )}
              </div>
              {item.external_id && (
                <span className="font-mono text-[10px] text-cream/30 shrink-0">
                  {item.external_id}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Roadmap() {
  const [phases, setPhases] = useState([])
  const [active, setActive] = useState('broz')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancel = false
    loadRoadmap()
      .then((data) => {
        if (cancel) return
        setPhases(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancel) return
        setError(err)
        setStatus('error')
      })
    return () => {
      cancel = true
    }
  }, [])

  const byProject = useMemo(() => {
    const map = {}
    for (const p of phases) {
      if (!map[p.project]) map[p.project] = []
      map[p.project].push(p)
    }
    return map
  }, [phases])

  const summaries = useMemo(() => {
    const out = {}
    for (const slug of PROJECT_ORDER) {
      out[slug] = summariseProject(byProject[slug] ?? [])
    }
    return out
  }, [byProject])

  const activePhases = byProject[active] ?? []
  const meta = PROJECT_META[active]

  return (
    <div className="max-w-5xl">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold mb-2">
          command centre · roadmap
        </p>
        <h1 className="font-display text-3xl text-cream mb-2">
          Semua peta jalan, satu papan.
        </h1>
        <p className="text-cream/55 text-sm max-w-2xl">
          Roadmap dari setiap projek ditarik daripada Brain (single source). Tukar tab untuk
          tengok progress per projek. Update kat repo masing-masing → re-run seeder untuk sync.
        </p>
      </header>

      {status === 'loading' && (
        <p className="text-cream/50 text-sm">Loading roadmap…</p>
      )}

      {status === 'error' && (
        <div className="border border-red-400/30 bg-red-400/5 rounded-xl p-4 text-sm text-red-300">
          <p className="font-medium mb-1">Tak boleh tarik roadmap dari Brain.</p>
          <p className="text-red-300/70 text-xs font-mono break-all">
            {error?.message || String(error)}
          </p>
        </div>
      )}

      {status === 'ready' && (
        <>
          <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
            {PROJECT_ORDER.map((slug) => (
              <ProjectTab
                key={slug}
                slug={slug}
                active={active === slug}
                onClick={() => setActive(slug)}
                summary={summaries[slug]}
              />
            ))}
          </div>

          {meta && (
            <div className="mb-6 pb-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: meta.accent }} />
                <h2 className="font-display text-xl text-cream">{meta.label}</h2>
              </div>
              <p className="text-cream/45 text-xs mt-1">{meta.subtitle}</p>
            </div>
          )}

          {activePhases.length === 0 ? (
            <p className="text-cream/50 text-sm">Belum ada data roadmap untuk projek ini.</p>
          ) : (
            <div className="space-y-10">
              {activePhases.map((phase) => (
                <Phase key={phase.id} phase={phase} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
