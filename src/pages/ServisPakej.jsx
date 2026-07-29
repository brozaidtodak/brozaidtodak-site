import { Link, Navigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COPY, EMAIL, PRICES, SERVIS_LANGS, WHATSAPP, copyFor, langFor, rm } from '../lib/servis.js'
import { PAGES, SLUGS, pageFor } from '../lib/servisPages.js'
import { DemoAsas, DemoKilat, DemoOperasi } from '../components/ServisDemo.jsx'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// SERVIS — halaman terperinci satu pakej (/servis/kilat|asas|operasi).
// Struktur: hero → tanda awak perlukan → apa awak dapat → DEMO INTERAKTIF
//           → garis masa → tak termasuk → FAQ → CTA
// Demo: bakal client taip nama kedai, terus nampak hasil (paparan sahaja,
// tiada data dihantar ke mana-mana).
// ============================================================

const LANG_LABEL = { ms: 'BM', en: 'EN' }
const FALLBACK = { ms: 'Kedai Anda', en: 'Your Shop' }

export default function ServisPakej() {
  const { slug } = useParams()
  const rootRef = useRef(null)

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
    document.documentElement.lang = lang
  }, [lang])

  const valid = SLUGS.includes(slug)
  const c = copyFor(lang)
  const p = valid ? pageFor(slug, lang) : null

  useEffect(() => { window.scrollTo(0, 0) }, [slug])
  useEffect(() => {
    if (p) document.title = `${p.name} — brozaidtodak`
  }, [p, lang])

  useEffect(() => {
    if (!p) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { gsap.set('.reveal', { opacity: 1, y: 0 }); return }
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
      ScrollTrigger.refresh()
    }, rootRef)
    return () => ctx.revert()
  }, [lang, slug, p])

  if (!valid) return <Navigate to="/servis" replace />

  const price = PRICES[slug]
  const from = slug === 'operasi'
  const duration = c.pkg.items.find((x) => x.id === slug)?.duration || ''
  const waHref = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        lang === 'en'
          ? `Hi, I'd like to ask about the ${p.name} package.`
          : `Hi, saya nak tanya pasal pakej ${p.name}.`)}`
    : null
  const others = SLUGS.filter((s) => s !== slug)

  return (
    <div ref={rootRef} className="min-h-screen bg-void text-white font-sans relative overflow-x-clip">
      <div className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,77,0,0.10), transparent 65%)' }} />

      {/* nav */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="font-sans font-black lowercase tracking-tight leading-none text-xl md:text-2xl">
          <span className="text-white">bro</span><span className="text-accent">zaid</span><span className="text-white">todak</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-0.5 p-0.5 rounded-full border border-white/12 bg-white/[0.03]" role="group">
            {SERVIS_LANGS.map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  lang === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <Link to="/servis"
            className="inline-flex items-center px-4 py-2 rounded-full border border-white/15 text-white/75 hover:text-white hover:border-white/40 text-xs font-semibold transition">
            {c.pkg.label}
          </Link>
        </div>
      </header>

      {/* ======== HERO ======== */}
      <section className="relative px-6 pt-28 md:pt-36 pb-14">
        <div className="max-w-4xl mx-auto">
          <Link to="/servis" className="font-mono text-[11px] tracking-[0.2em] text-white/45 hover:text-accent transition">
            ← {p.kicker}
          </Link>
          <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight mt-4 reveal">{p.name}</h1>
          <p className="text-xl md:text-2xl text-white/85 leading-snug mt-5 max-w-2xl reveal">{p.promise}</p>
          <p className="text-white/60 leading-relaxed mt-4 max-w-2xl reveal">{p.sub}</p>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mt-9 pt-7 border-t border-white/10 reveal">
            <div>
              <div className="font-display font-bold text-4xl text-accent">
                {from && <span className="text-lg text-white/50 font-sans font-normal mr-1.5">{c.pkg.from}</span>}
                ${price.toLocaleString('en-US')}
              </div>
              <div className="text-white/40 text-xs mt-1">≈ {rm(price)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/45">{lang === 'en' ? 'Timeline' : 'Tempoh'}</div>
              <div className="font-semibold mt-1">{duration}</div>
            </div>
            {waHref && <CTA href={waHref} primary external>{c.contact.wa}</CTA>}
          </div>
        </div>
      </section>

      {/* ======== TANDA ======== */}
      <section className="relative px-6 py-14 md:py-20">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{p.signsLabel}</SectionLabel>
          <div className="grid md:grid-cols-2 gap-3 mt-7">
            {p.signs.map((s) => (
              <div key={s} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 reveal">
                <span className="text-accent shrink-0" aria-hidden="true">›</span>
                <span className="text-white/75 text-sm leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== APA AWAK DAPAT ======== */}
      <section className="relative px-6 py-14 md:py-20">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{p.getsLabel}</SectionLabel>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {p.getsGroups.map((g) => (
              <div key={g.title} className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 reveal">
                <h3 className="font-sans font-extrabold text-lg">{g.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-white/75 leading-relaxed">
                      <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">✓</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== DEMO INTERAKTIF ======== */}
      <section id="cuba" className="relative px-6 py-16 md:py-24 scroll-mt-20">
        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,77,0,0.07), transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto">
          <SectionLabel>{p.demoLabel}</SectionLabel>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">{p.demoHeading}</h2>
          <p className="text-white/65 mt-3 max-w-2xl reveal">{p.demoSub}</p>
          <div className="mt-9">
            {slug === 'kilat' && <DemoKilat t={p} lang={lang} fallbackName={FALLBACK[lang]} />}
            {slug === 'asas' && <DemoAsas t={p} fallbackName={FALLBACK[lang]} />}
            {slug === 'operasi' && <DemoOperasi t={p} lang={lang} fallbackName={FALLBACK[lang]} />}
          </div>
        </div>
      </section>

      {/* ======== GARIS MASA ======== */}
      <section className="relative px-6 py-14 md:py-20">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{p.timelineLabel}</SectionLabel>
          <div className="mt-8 space-y-px">
            {p.timeline.map((s) => (
              <div key={s.d} className="grid md:grid-cols-[130px_1fr] gap-3 md:gap-6 py-5 border-t border-white/10 reveal">
                <div className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase pt-0.5">{s.d}</div>
                <div>
                  <h3 className="font-sans font-bold">{s.t}</h3>
                  <p className="text-white/65 text-sm leading-relaxed mt-1.5">{s.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== TAK TERMASUK ======== */}
      <section className="relative px-6 py-14 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-7 md:p-8 reveal">
            <h3 className="font-sans font-extrabold text-lg">{p.exLabel}</h3>
            <ul className="mt-4 space-y-2">
              {p.excludes.map((e) => (
                <li key={e} className="flex gap-2.5 text-sm text-white/60 leading-relaxed">
                  <span className="text-white/30 shrink-0" aria-hidden="true">·</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <p className="text-accent text-sm mt-5">{p.upsell}</p>
          </div>
        </div>
      </section>

      {/* ======== FAQ ======== */}
      <section className="relative px-6 py-14 md:py-20">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>{c.faq.label}</SectionLabel>
          <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
            {p.faq.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ======== PAKEJ LAIN ======== */}
      <section className="relative px-6 py-14">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
          {others.map((s) => {
            const o = PAGES[s][lang] || PAGES[s].ms
            return (
              <Link key={s} to={`/servis/${s}`}
                className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 hover:border-accent/45 transition group reveal">
                <div className="font-mono text-[11px] tracking-[0.2em] text-white/40">{o.kicker}</div>
                <div className="flex items-baseline justify-between gap-3 mt-2">
                  <h3 className="font-display font-bold text-2xl group-hover:text-accent transition">{o.name}</h3>
                  <span className="font-display font-bold text-accent whitespace-nowrap">
                    {s === 'operasi' && <span className="text-xs text-white/45 font-sans font-normal mr-1">{c.pkg.from}</span>}
                    ${PRICES[s].toLocaleString('en-US')}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{o.promise}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="relative px-6 pt-10 pb-24 overflow-hidden">
        <div className="absolute -inset-10 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 110%, rgba(255,77,0,0.14), transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-tight uppercase reveal">{c.contact.heading}</h2>
          <p className="text-white/70 mt-5 reveal">{c.contact.body(PRICES.diagnosis)}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 reveal">
            {waHref && <CTA href={waHref} primary external>{c.contact.wa}</CTA>}
            <CTA href={`mailto:${EMAIL}`} primary={!waHref} external>{EMAIL}</CTA>
          </div>
        </div>
      </section>

      <footer className="relative px-6 py-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-white/40 text-xs">
          <Link to="/servis" className="hover:text-white transition">← {c.pkg.label}</Link>
          <span>{c.footer.note}</span>
        </div>
      </footer>
    </div>
  )
}

/* ---------- komponen kecil ---------- */

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.28em] text-white/55 uppercase reveal">— {children}</p>
  )
}

function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="reveal">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left py-5 group">
        <span className="font-sans font-semibold group-hover:text-accent transition">{q}</span>
        <span className={`text-accent text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-out)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-white/70 text-sm leading-relaxed pb-5 -mt-1 max-w-prose">{a}</p>
        </div>
      </div>
    </div>
  )
}

function CTA({ href, children, primary, external }) {
  const cls = primary
    ? 'bg-accent text-black hover:bg-[#ff6a2b]'
    : 'border border-white/20 text-white/80 hover:text-white hover:border-white/45'
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition ${cls}`}>
      {children}
    </a>
  )
}
