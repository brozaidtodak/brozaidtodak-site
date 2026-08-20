import { Link } from 'react-router-dom'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COPY, EMAIL, PRICES, SERVIS_LANGS, WHATSAPP, copyFor, langFor, rm } from '../lib/servis.js'
import { useHead } from '../lib/useHead.js'
import { jsonLdService, jsonLdFaq } from '../lib/seo.js'

gsap.registerPlugin(ScrollTrigger)

// three.js berat — muat hanya bila pengguna hampir sampai ke seksyen demo
const Servis3D = lazy(() => import('../components/Servis3D.jsx'))

// ============================================================
// SERVIS — halaman jualan servis bina sistem.
// Tema sama dgn Landing (Todak monokrom: void + putih + oren #ff4d00),
// tapi TANPA video/intro — halaman ni kena terus ke isi, bukan cinematic.
// Struktur: Masalah → Siapa saya → Bukti → Cara kerja → Pakej →
//           Contoh KILAT (screenshot kerja sebenar) → Retainer → FAQ → Hubungi
// Teks BM+EN dalam ../lib/servis.js; bahasa dikongsi dgn Landing ('bzt-lang').
// ============================================================

const LANG_LABEL = { ms: 'BM', en: 'EN' }

export default function Servis() {
  const rootRef = useRef(null)

  // ikut bahasa yang sama disimpan oleh Landing; zh/ta jatuh balik ke BM
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('bzt-lang')
      if (saved) return langFor(saved)
      const nav = (navigator.language || '').slice(0, 2).toLowerCase()
      if (COPY[nav]) return nav
    } catch { /* storage disekat */ }
    return 'ms'
  })
  useEffect(() => {
    try { localStorage.setItem('bzt-lang', lang) } catch { /* abai */ }
  }, [lang])

  const c = copyFor(lang)

  // Service + FAQPage dibina dari kandungan halaman yang SAMA dipaparkan,
  // jadi schema tak boleh lari dari apa yang pelawat baca.
  useHead('/servis', lang, [
    jsonLdService(c.pkg.items.map((p) => ({
      slug: p.id,
      name: `${p.name} · ${p.tagline}`,
      desc: p.for,
      price: PRICES[p.id],
      from: !!p.from,
    }))),
    jsonLdFaq(c.faq.items),
  ])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // reveal on scroll — dijalankan semula bila bahasa tukar (DOM ditulis semula)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set('.reveal', { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      ScrollTrigger.refresh()
    }, rootRef)
    return () => ctx.revert()
  }, [lang])

  const waHref = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(c.contact.waMsg)}`
    : null

  return (
    <div ref={rootRef} className="min-h-screen bg-void text-ink font-sans relative overflow-x-clip">
      {/* haba ambient halus di kepala halaman */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh] pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,77,0,0.10), transparent 65%), radial-gradient(circle at 50% 6%, rgba(255,255,255,0.05), transparent 45%)',
        }}
      />

      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-sans font-black lowercase tracking-tight leading-none text-xl md:text-2xl">
            <span className="text-ink">bro</span>
            <span className="text-accent-ink">zaid</span>
            <span className="text-ink">todak</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-0.5 p-0.5 rounded-full border border-ink/12 bg-card" role="group">
            {SERVIS_LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  lang === l ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-ink-2 hover:text-ink hover:border-line text-xs font-semibold transition"
          >
            {c.nav.home}
          </Link>
        </div>
      </header>

      {/* ======== MASALAH ======== */}
      <section className="relative px-6 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{c.hero.label}</SectionLabel>
          <h1 key={lang} className="font-display font-bold text-4xl md:text-6xl leading-[1.05] tracking-tight uppercase mt-5 reveal">
            {c.hero.l1}<br />
            {c.hero.l2}<br />
            <span className="text-accent-ink">{c.hero.l3}</span>
          </h1>
          <p className="text-ink-2 text-lg leading-relaxed mt-7 max-w-2xl reveal">{c.hero.sub}</p>
          <div className="flex flex-wrap gap-3 mt-9 reveal">
            <CTA href="#pakej" primary>{c.hero.cta1}</CTA>
            <CTA href="#contoh">{c.hero.cta2}</CTA>
          </div>
        </div>
      </section>

      {/* ======== SIAPA SAYA ======== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-ink/12 bg-card p-8 md:p-12 reveal">
            <p className="font-display font-bold text-2xl md:text-3xl leading-snug tracking-tight">
              {c.about.h1}<span className="text-accent-ink">{c.about.hAccent}</span>{c.about.h2}
            </p>
            <p className="text-ink-2 leading-relaxed mt-6">{c.about.p1}</p>
            <p className="text-ink-2 leading-relaxed mt-4">{c.about.p2}</p>
          </div>
        </div>
      </section>

      {/* ======== BUKTI ======== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.proof.label}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            {c.proof.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-5 mt-10">
            {c.proof.items.map((p) => (
              <div key={p.name}
                className="rounded-2xl border border-ink/12 bg-card p-7 flex flex-col reveal">
                <h3 className="font-sans font-extrabold text-xl tracking-tight">{p.name}</h3>
                <p className="font-mono text-[11px] tracking-wider text-accent-ink uppercase mt-1.5">{p.role}</p>
                <p className="text-ink-2 text-sm leading-relaxed mt-4 flex-1">{p.body}</p>
                <div className="flex flex-wrap gap-x-7 gap-y-3 mt-6 pt-5 border-t border-ink/12">
                  {p.stats.map((s) => (
                    <div key={s.l}>
                      <div className="font-display font-bold text-xl">{s.v}</div>
                      <div className="text-[11px] text-ink-3 uppercase tracking-wider mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CARA KERJA ======== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.steps.label}</SectionLabel>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {c.steps.items.map((s) => (
              <div key={s.no} className="reveal">
                <div className="font-mono text-accent-ink text-sm tracking-[0.2em]">{s.no}</div>
                <h3 className="font-sans font-extrabold text-lg mt-2">{s.title}</h3>
                <p className="text-ink-2 text-sm leading-relaxed mt-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== DEMO 3D ======== */}
      <section id="demo3d" className="relative px-6 py-16 md:py-24 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.demo3d.label}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            {c.demo3d.heading}
          </h2>
          <p className="text-ink-2 leading-relaxed mt-4 max-w-2xl reveal">{c.demo3d.sub}</p>
          <div className="mt-9 reveal">
            <Demo3DHolder t={c.demo3d} />
          </div>
          <p className="text-ink-3 text-xs mt-4 reveal">{c.demo3d.note}</p>
        </div>
      </section>

      {/* ======== PAKEJ ======== */}
      <section id="pakej" className="relative px-6 py-16 md:py-24 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.pkg.label}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            {c.pkg.heading}
          </h2>

          {/* diagnosis — pintu masuk */}
          <div className="rounded-2xl border border-accent-ink/40 bg-accent-ink/10 p-7 md:p-8 mt-10 reveal">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h3 className="font-sans font-extrabold text-xl">{c.pkg.diagnosis.title}</h3>
                <p className="text-ink-2 text-sm mt-1">{c.pkg.diagnosis.meta}</p>
              </div>
              <Price usd={PRICES.diagnosis} />
            </div>
            <ul className="mt-5 space-y-2">
              {c.pkg.diagnosis.points.map((p) => <Tick key={p}>{p}</Tick>)}
            </ul>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mt-6">
            {c.pkg.items.map((p) => (
              <PackageCard key={p.id} p={p} price={PRICES[p.id]} t={c.pkg} />
            ))}
          </div>

          <p className="text-ink-3 text-xs mt-6 reveal">{c.pkg.footnote}</p>
        </div>
      </section>

      {/* ======== CONTOH KILAT ======== */}
      <section id="contoh" className="relative px-6 py-16 md:py-24 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.example.label}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            {c.example.heading}
          </h2>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center mt-9">
            <div className="rounded-2xl border border-ink/12 bg-card p-6 reveal">
              <div className="font-mono text-[11px] tracking-[0.2em] text-ink-3 uppercase">{c.example.beforeLabel}</div>
              <p className="text-ink-2 text-sm leading-relaxed mt-3">{c.example.before}</p>
              <p className="font-display font-bold text-2xl mt-4">
                {c.example.beforeBig}{' '}
                <span className="text-ink-3 text-base font-sans font-normal">{c.example.beforeSmall}</span>
              </p>
            </div>
            <div className="text-accent-ink text-3xl text-center rotate-90 md:rotate-0 reveal" aria-hidden="true">→</div>
            <div className="rounded-2xl border border-accent-ink/35 bg-accent-ink/10 p-6 reveal">
              <div className="font-mono text-[11px] tracking-[0.2em] text-accent-ink uppercase">{c.example.afterLabel}</div>
              <p className="text-ink-2 text-sm leading-relaxed mt-3">{c.example.after}</p>
              <p className="font-display font-bold text-2xl mt-4">
                {c.example.afterBig}{' '}
                <span className="text-ink-3 text-base font-sans font-normal">{c.example.afterSmall}</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Shot src="/servis/katalog.jpg" n="1" title={c.example.shots[0].t} body={c.example.shots[0].b} />
            <Shot src="/servis/po.jpg" n="2" title={c.example.shots[1].t} body={c.example.shots[1].b} />
          </div>
          <p className="text-ink-3 text-xs mt-5 reveal">{c.example.note}</p>
        </div>
      </section>

      {/* ======== RETAINER ======== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>{c.retainer.label}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            {c.retainer.heading}
          </h2>
          <p className="text-ink-2 leading-relaxed mt-4 max-w-2xl reveal">{c.retainer.intro}</p>
          <div className="grid md:grid-cols-3 gap-5 mt-9">
            {c.retainer.plans.map((r, i) => (
              <div key={r.name} className="rounded-2xl border border-ink/12 bg-card p-6 reveal">
                <h3 className="font-sans font-extrabold text-lg">{r.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display font-bold text-3xl text-accent-ink">${PRICES.retainer[i]}</span>
                  <span className="text-ink-3 text-sm">{c.retainer.perMonth}</span>
                </div>
                <div className="text-ink-3 text-xs mt-0.5">≈ {rm(PRICES.retainer[i])} {c.retainer.approx}</div>
                <p className="text-ink-2 text-sm leading-relaxed mt-4">{r.points}</p>
              </div>
            ))}
          </div>
          <p className="text-ink-3 text-xs mt-6 reveal">{c.retainer.footnote}</p>
        </div>
      </section>

      {/* ======== FAQ ======== */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>{c.faq.label}</SectionLabel>
          <div className="mt-8 divide-y divide-white/10 border-y border-ink/12">
            {c.faq.items.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ======== HUBUNGI ======== */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden">
        <div
          className="absolute -inset-10 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 110%, rgba(255,77,0,0.14), transparent 70%)' }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight uppercase reveal">
            {c.contact.heading}
          </h2>
          <p className="text-ink-2 mt-5 reveal">{c.contact.body(PRICES.diagnosis)}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 reveal">
            {waHref && <CTA href={waHref} primary external>{c.contact.wa}</CTA>}
            <CTA href={`mailto:${EMAIL}`} primary={!waHref} external>{EMAIL}</CTA>
          </div>
        </div>
      </section>

      <footer className="relative px-6 py-10 border-t border-ink/12">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-ink-3 text-xs">
          <Link to="/" className="hover:text-ink transition">{c.footer.back}</Link>
          <span>{c.footer.note}</span>
        </div>
      </footer>
    </div>
  )
}

/* ---------- komponen kecil ---------- */

// muat komponen 3D hanya bila seksyen hampir masuk viewport (jimat bundle utama)
function Demo3DHolder({ t }) {
  const holderRef = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = holderRef.current
    if (!el || typeof IntersectionObserver === 'undefined') { setReady(true); return }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setReady(true); io.disconnect() }
      },
      { rootMargin: '500px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const skeleton = (
    <div className="rounded-2xl border border-ink/12 bg-card min-h-[380px] md:min-h-[460px] flex items-center justify-center">
      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink-3">3D</span>
    </div>
  )
  return (
    <div ref={holderRef}>
      {ready ? <Suspense fallback={skeleton}><Servis3D t={t} /></Suspense> : skeleton}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.28em] text-ink-3 uppercase reveal">
      — {children}
    </p>
  )
}

function Price({ usd, from, fromLabel }) {
  return (
    <div className="text-right">
      <div className="font-display font-bold text-3xl text-accent-ink whitespace-nowrap">
        {from && <span className="text-base text-ink-3 font-sans font-normal mr-1.5">{fromLabel}</span>}
        ${usd.toLocaleString('en-US')}
      </div>
      <div className="text-ink-3 text-xs mt-0.5">≈ {rm(usd)}</div>
    </div>
  )
}

function Tick({ children }) {
  return (
    <li className="flex gap-2.5 text-sm text-ink-2 leading-relaxed">
      <span className="text-accent-ink mt-0.5 shrink-0" aria-hidden="true">✓</span>
      <span>{children}</span>
    </li>
  )
}

function PackageCard({ p, price, t }) {
  return (
    <div className={`rounded-2xl border p-7 flex flex-col reveal transition ${
      p.best ? 'border-accent-ink/45 bg-accent-ink/10' : 'border-ink/12 bg-card'
    } hover:border-accent-ink/60`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-ink-3">{p.no}</span>
        {p.best && (
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent-ink border border-accent-ink/40 rounded-full px-2.5 py-1">
            {t.startHere}
          </span>
        )}
      </div>
      <h3 className="font-display font-bold text-2xl tracking-tight mt-3">{p.name}</h3>
      <p className="text-ink-2 text-sm mt-1">{p.tagline}</p>

      <div className="mt-5 pb-5 border-b border-ink/12">
        <Price usd={price} from={p.from} fromLabel={t.from} />
        <div className="text-ink-3 text-xs mt-1.5 text-right">{p.duration}</div>
      </div>

      <p className="text-ink-3 text-xs uppercase tracking-wider mt-5">{t.forWho}</p>
      <p className="text-ink-2 text-sm mt-1.5">{p.for}</p>

      <ul className="mt-5 space-y-2 flex-1">
        {p.gets.map((g) => <Tick key={g}>{g}</Tick>)}
      </ul>

      {p.excludes.length > 0 && (
        <div className="mt-5 pt-4 border-t border-ink/12">
          <p className="text-ink-3 text-[11px] uppercase tracking-wider">{t.excludes}</p>
          <ul className="mt-2 space-y-1">
            {p.excludes.map((e) => (
              <li key={e} className="text-ink-3 text-xs leading-relaxed">· {e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* p2 — pautan ke halaman terperinci + demo interaktif */}
      <Link
        to={`/servis/${p.id}`}
        className={`mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-sm font-semibold transition ${
          p.best ? 'bg-accent text-ink hover:bg-[#ff6a2b]'
                 : 'border border-line text-ink/85 hover:border-accent-ink hover:text-accent-ink'
        }`}
      >
        {t.detail} <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

function Shot({ src, n, title, body }) {
  return (
    <figure className="reveal">
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full rounded-xl border border-ink/12 shadow-[0_10px_30px_rgba(20,20,20,0.10)]"
      />
      <figcaption className="text-ink-2 text-sm mt-3 leading-relaxed">
        <span className="text-ink font-semibold">{n}. {title}</span> — {body}
      </figcaption>
    </figure>
  )
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="reveal">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left py-5 group"
      >
        <span className="font-sans font-semibold text-ink group-hover:text-accent-ink transition">{q}</span>
        <span className={`text-accent-ink text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-out)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-ink-2 text-sm leading-relaxed pb-5 -mt-1 max-w-prose">{a}</p>
        </div>
      </div>
    </div>
  )
}

function CTA({ href, children, primary, external }) {
  const cls = primary
    ? 'bg-accent text-ink hover:bg-[#ff6a2b]'
    : 'border border-line text-ink hover:text-ink hover:border-line'
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition ${cls}`}
    >
      {children}
    </a>
  )
}
