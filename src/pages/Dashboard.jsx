import Projects from '../components/Projects.jsx'

const PENDING_MODULES = [
  { name: '10 CAMP snapshot', meta: 'Phase 3 · high priority' },
  { name: 'Journey', meta: 'Phase 3 · medium' },
  { name: 'Goals & notes', meta: 'Phase 3 · low' },
  { name: 'Phone repair log', meta: 'Optional' },
]

export default function Dashboard() {
  return (
    <>
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Overview</p>
        <h1 className="font-display text-4xl text-cream">Welcome back, Zaid.</h1>
      </div>

      <Projects />

      <section className="mt-16">
        <div className="mb-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-1.5">Coming next</p>
          <h2 className="font-display text-lg text-cream/70">More modules pending build</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PENDING_MODULES.map((m) => (
            <div key={m.name} className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/35 mb-1">{m.meta}</p>
              <h3 className="font-display text-sm text-cream/55">{m.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
