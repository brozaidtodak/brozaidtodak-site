import { Link } from 'react-router-dom'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { CATEGORIES, NODES, layoutTree } from '../lib/journeyTree.js'

// ============================================================
// POKOK KERJAYA — skill/tech tree interaktif (tema Todak hitam/oren).
// Layout auto dari layoutTree(); zoom (wheel/pinch) + pan (drag);
// klik node → panel cerita; filter kategori; GSAP draw-in.
// ============================================================

const NODE_W = 158
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export default function Journey() {
  const { nodes, edges, width, height } = useMemo(() => layoutTree(), [])
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [view, setView] = useState({ x: 0, y: 0, k: 0.85 })
  const [selected, setSelected] = useState(null)
  const [activeCats, setActiveCats] = useState(() => new Set())
  const dragRef = useRef(null)

  // fit-to-view pada mount + resize
  const fit = () => {
    const el = wrapRef.current
    if (!el) return
    const vw = el.clientWidth, vh = el.clientHeight
    const k = clamp(Math.min(vw / width, (vh - 40) / height) * 0.92, 0.3, 1.4)
    setView({ k, x: (vw - width * k) / 2, y: 24 })
  }
  useLayoutEffect(() => {
    fit()
    const on = () => fit()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height])

  // GSAP intro — cabang melukis + node timbul berperingkat
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tree-edge').forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(p, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out',
          delay: 0.15 + (parseFloat(p.dataset.depth) || 0) * 0.12 })
      })
      gsap.from('.tree-node', {
        opacity: 0, scale: 0.6, duration: 0.5, ease: 'back.out(1.6)',
        stagger: { each: 0.04, from: 'start' },
        delay: 0.2,
      })
    }, canvasRef)
    return () => ctx.revert()
  }, [])

  // ---- zoom to cursor ----
  const onWheel = (e) => {
    e.preventDefault()
    const rect = wrapRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
    setView((v) => {
      const k = clamp(v.k * factor, 0.3, 2.4)
      const wx = (mx - v.x) / v.k, wy = (my - v.y) / v.k
      return { k, x: mx - wx * k, y: my - wy * k }
    })
  }
  // ---- pan (drag latar sahaja) ----
  const onPointerDown = (e) => {
    if (e.target.closest('.tree-node')) return // biar klik node
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y, moved: false }
    wrapRef.current.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
    setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }))
  }
  const onPointerUp = (e) => {
    const d = dragRef.current
    dragRef.current = null
    if (d && !d.moved && !e.target.closest('.tree-node')) setSelected(null)
  }

  const toggleCat = (key) =>
    setActiveCats((s) => {
      const n = new Set(s)
      n.has(key) ? n.delete(key) : n.add(key)
      return n
    })
  const isDim = (cat) => activeCats.size > 0 && !activeCats.has(cat)

  const edgePath = (e) => {
    const midY = (e.y1 + e.y2) / 2
    return `M ${e.x1} ${e.y1} C ${e.x1} ${midY}, ${e.x2} ${midY}, ${e.x2} ${e.y2}`
  }
  const depthOf = (id) => nodes.find((n) => n.id === id)?.depth ?? 0

  return (
    <div className="min-h-screen bg-void text-white font-sans flex flex-col overflow-hidden">
      {/* top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/8 shrink-0">
        <div>
          <Link to="/" className="font-sans font-black lowercase tracking-tight text-lg">
            <span className="text-white">bro</span><span className="text-accent">zaid</span><span className="text-white">todak</span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.28em] text-white/50 uppercase mt-0.5">— Pokok Kerjaya</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fit} className="text-xs text-white/55 hover:text-white transition font-mono">↺ reset</button>
          <Link to="/" className="text-xs text-white/55 hover:text-white transition">← Laman utama</Link>
        </div>
      </header>

      {/* legend + hint */}
      <div className="relative z-20 flex flex-wrap items-center gap-2 px-6 md:px-10 py-3 border-b border-white/8 shrink-0">
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <button
            key={key}
            onClick={() => toggleCat(key)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition ${
              activeCats.size === 0 || activeCats.has(key)
                ? 'border-white/20 text-white/85' : 'border-white/8 text-white/35'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
        <span className="ml-auto hidden sm:block font-mono text-[10px] text-white/35 uppercase tracking-wider">
          scroll = zoom · seret = gerak · klik node = cerita
        </span>
      </div>

      {/* canvas */}
      <div
        ref={wrapRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative flex-1 min-h-0 cursor-grab active:cursor-grabbing touch-none select-none"
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,77,0,0.06), transparent 70%)' }} />

        <div
          ref={canvasRef}
          className="absolute top-0 left-0 origin-top-left"
          style={{ width, height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
        >
          {/* edges */}
          <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" width={width} height={height}>
            {edges.map((e) => {
              const child = nodes.find((n) => n.id === e.to)
              const c = CATEGORIES[child.cat].color
              return (
                <path
                  key={e.to}
                  className="tree-edge"
                  data-depth={depthOf(e.to)}
                  d={edgePath(e)}
                  fill="none"
                  stroke={c}
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ opacity: isDim(child.cat) ? 0.08 : 0.5 }}
                />
              )
            })}
          </svg>

          {/* nodes */}
          {nodes.map((n) => {
            const c = CATEGORIES[n.cat].color
            const dim = isDim(n.cat)
            const sel = selected?.id === n.id
            return (
              <button
                key={n.id}
                className="tree-node absolute text-left"
                onClick={() => setSelected(n)}
                style={{
                  left: n.x, top: n.y, width: NODE_W,
                  transform: 'translate(-50%, -50%)',
                  opacity: dim ? 0.18 : 1,
                  transition: 'opacity .3s',
                }}
              >
                <div
                  className="rounded-xl border bg-white/[0.03] backdrop-blur-sm px-3 py-2.5 hover:bg-white/[0.06] transition"
                  style={{
                    borderColor: sel ? c : 'rgba(255,255,255,0.14)',
                    boxShadow: sel ? `0 0 0 1px ${c}, 0 8px 30px -8px ${c}` : 'none',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />
                    {n.year && <span className="font-mono text-[9px] text-white/45 tracking-wider">{n.year}</span>}
                    {n.status && (
                      <span className="ml-auto font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-white/15 text-white/70">
                        {n.status}
                      </span>
                    )}
                  </div>
                  <div className="font-sans font-bold text-[13px] leading-tight text-white">{n.title}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* detail panel */}
      {selected && (
        <DetailPanel node={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function DetailPanel({ node, onClose }) {
  const c = CATEGORIES[node.cat]
  // p2 — kelas .is-open dipasang SATU frame selepas mount supaya transisi CSS
  // benar-benar berjalan (set kelas dalam render yang sama = tiada animasi).
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div className={`detail-panel${shown ? ' is-open' : ''}
                    fixed z-30 inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-96
                    bg-[#0a0a0b] border-t md:border-t-0 md:border-l border-white/12 p-6 md:p-8
                    shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-[-10px_0_40px_rgba(0,0,0,0.5)]`}>
      <button onClick={onClose} aria-label="Tutup"
        className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition flex items-center justify-center">✕</button>
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: c.color }}>{c.label}</span>
        {node.year && <span className="font-mono text-[10px] text-white/40">· {node.year}</span>}
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-1">{node.title}</h2>
      {node.status && (
        <span className="inline-block mb-4 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 text-white/70">
          {node.status}
        </span>
      )}
      <p className="text-white/70 leading-relaxed text-[15px] mt-3">{node.blurb}</p>
      {node.url && (
        <a href={node.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-white/85 transition">
          Lawati laman <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}
