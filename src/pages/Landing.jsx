import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ============================================================
// LANDING — "Hutan malam + bara api"
// Cinematic scroll layout (inspired by thevirtualwild.com) tapi
// kekal identiti hutan: hijau gelap + glow emas/oren campfire.
// Panel bersih, tiada corak garis hiasan.
// ============================================================

const ROLES = [
  { label: 'Retailer · 10 CAMP', tone: 'text-gold' },
  { label: 'Builder', tone: 'text-emerald-300' },
  { label: 'Naturalist', tone: 'text-amber-200' },
]

const STATS = [
  { value: '5', label: 'Tahun dalam industri peruncitan' },
  { value: '10+', label: 'Sistem & platform dibangunkan' },
  { value: '1', label: 'Jenama · 10 CAMP' },
]

const PROJECTS = [
  {
    name: '10 CAMP',
    tag: 'Perniagaan utama',
    desc: 'Peruncitan peralatan outdoor dan camping di Malaysia — beroperasi di Shopee, TikTok Shop dan kedai fizikal dengan inventori bersepadu dalam satu sistem.',
    url: 'https://10camp.com',
    status: 'LIVE',
  },
  {
    name: '10 CAMP POS',
    tag: 'Sistem runcit',
    desc: 'Sistem point-of-sale lengkap yang dibangunkan dari asas — jualan, inventori, pengurusan staf, program kesetiaan pelanggan dan pembantu AI.',
    status: 'LIVE',
  },
  {
    name: 'Command Centre',
    tag: 'Kewangan',
    desc: 'Back office kewangan bersepadu — lejar am, penyelarasan settlement marketplace, payroll dan pelaporan untung rugi.',
    status: 'LIVE',
  },
  {
    name: 'hr10',
    tag: 'Sumber manusia',
    desc: 'Portal HR untuk pengurusan tenaga kerja — penjadualan syif, rekod kakitangan dan laporan operasi harian secara automatik.',
    status: 'LIVE',
  },
  {
    name: 'Shedan Bunga',
    tag: 'Perniagaan keluarga',
    desc: 'Pembangunan identiti jenama dan laman web rasmi untuk jenama bunga manik buatan tangan.',
    url: 'https://shedanbunga.com',
    status: 'LIVE',
  },
  {
    name: 'Empayar Sabrina',
    tag: 'Perniagaan keluarga',
    desc: 'Sistem POS dan back office untuk perniagaan batik keluarga — dibangunkan dengan standard yang sama seperti operasi utama.',
    status: 'LIVE',
  },
]

const JOURNEY = [
  {
    year: '2021 – 2023',
    title: 'Peruncitan vape',
    desc: 'Permulaan dalam dunia peruncitan — pengurusan jualan, inventori dan aliran tunai. Perniagaan telah ditutup; pengalamannya kekal menjadi asas.',
  },
  {
    year: 'Berterusan',
    title: 'Pembaikan telefon',
    desc: 'Kemahiran teknikal yang dikekalkan sehingga kini — diagnosis, pembaikan dan pemasangan semula. Disiplin yang sama diterapkan dalam pembinaan sistem.',
  },
  {
    year: '2024',
    title: '10 CAMP diasaskan',
    desc: 'Peralihan kepada peralatan outdoor — bermula dengan platform sedia ada seperti Shopify dan EasyStore.',
  },
  {
    year: '2025',
    title: 'Pembangunan dalaman bermula',
    desc: 'Sistem sedia ada tidak lagi menampung keperluan operasi. Sistem POS pertama dibangunkan sendiri — diikuti modul demi modul.',
  },
  {
    year: '2026',
    title: 'Ekosistem lengkap',
    desc: 'POS, kewangan, HR, mesyuarat dan perancangan — keseluruhannya dibangunkan secara dalaman dan saling bersepadu.',
  },
]

export default function Landing() {
  const [introDone, setIntroDone] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('bzt-intro') === '1'
  )

  // mouse parallax — layer background gerak lawan arah mouse, depth ikut data-parallax
  useEffect(() => {
    if (!introDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const layers = [...document.querySelectorAll('[data-parallax]')].map((el) => [
      el,
      parseFloat(el.dataset.parallax),
    ])
    if (!layers.length) return

    let tx = 0, ty = 0, cx = 0, cy = 0
    let raf
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      for (const [el, depth] of layers) {
        el.style.transform = `translate3d(${(-cx * depth).toFixed(2)}px, ${(-cy * depth).toFixed(2)}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [introDone])

  useEffect(() => {
    if (!introDone) return
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [introDone])

  return (
    <div className="min-h-screen bg-night text-cream font-sans relative overflow-x-clip">
      {!introDone && (
        <Intro
          onDone={() => {
            sessionStorage.setItem('bzt-intro', '1')
            setIntroDone(true)
          }}
        />
      )}

      {/* top nav */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <a href="#top" className="flex items-center gap-3">
          <Monogram size={38} />
          <span className="font-display text-sm tracking-wide text-cream/85 hidden sm:block">
            Bro Zaid Todak
          </span>
        </a>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 text-cream/85 hover:text-cream hover:border-gold/40 text-xs font-medium transition"
        >
          <LockIcon />
          Command Centre
        </Link>
      </header>

      {/* gradient ambient penuh — dari hero sampai footer, takde potongan */}
      <div
        className="absolute -inset-10 pointer-events-none will-change-transform"
        aria-hidden="true"
        data-parallax="12"
        style={{
          background:
            'radial-gradient(circle at 50% 12%, rgba(214,179,106,0.07), transparent 45%), radial-gradient(circle at 12% 30%, rgba(45,82,64,0.24), transparent 40%), linear-gradient(180deg, rgba(45,82,64,0.10) 0%, rgba(255,140,66,0.045) 25%, rgba(214,179,106,0.035) 50%, rgba(255,140,66,0.06) 75%, rgba(255,140,66,0.13) 100%)',
        }}
      />
      {/* bara utama kat kaki hero — tak diclip, fade lembut ke bawah */}
      <div
        className="absolute -top-10 -inset-x-10 h-[190vh] pointer-events-none glow-pulse will-change-transform"
        aria-hidden="true"
        data-parallax="24"
        style={{
          background:
            'radial-gradient(ellipse 75% 28% at 50% 52%, rgba(255,140,66,0.15), transparent 65%)',
        }}
      />
      {/* glitter bara — fixed ikut viewport, naik dari bawah skrin di mana-mana section */}
      <div
        className="fixed inset-0 pointer-events-none will-change-transform z-0"
        aria-hidden="true"
        data-parallax="36"
      >
        {[
          { l: '8%',  b: '6%',  dur: '10s', delay: '0s',   drift: '22px' },
          { l: '16%', b: '30%', dur: '13s', delay: '4s',   drift: '-18px' },
          { l: '26%', b: '10%', dur: '9s',  delay: '2s',   drift: '30px' },
          { l: '34%', b: '45%', dur: '14s', delay: '7s',   drift: '14px' },
          { l: '42%', b: '8%',  dur: '8s',  delay: '0.5s', drift: '30px' },
          { l: '50%', b: '22%', dur: '11s', delay: '2.5s', drift: '-24px' },
          { l: '57%', b: '6%',  dur: '9s',  delay: '5s',   drift: '18px' },
          { l: '64%', b: '38%', dur: '13s', delay: '1.2s', drift: '-36px' },
          { l: '72%', b: '12%', dur: '10s', delay: '3.8s', drift: '26px' },
          { l: '80%', b: '28%', dur: '12s', delay: '6.4s', drift: '-14px' },
          { l: '88%', b: '8%',  dur: '11s', delay: '8s',   drift: '20px' },
          { l: '94%', b: '42%', dur: '14s', delay: '5.5s', drift: '-22px' },
        ].map((e, i) => (
          <span
            key={i}
            className="ember"
            style={{ left: e.l, bottom: e.b, '--dur': e.dur, '--delay': e.delay, '--drift': e.drift }}
          />
        ))}
      </div>

      {/* ======== HERO ======== */}
      <section id="top" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="relative text-center max-w-3xl mx-auto pt-20 pb-16 will-change-transform" data-parallax="-8">
          <p className="font-mono text-[11px] tracking-[0.28em] text-gold-bright uppercase mb-6 reveal">
            Kuala Lumpur, Malaysia
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight reveal">
            Membina perniagaan.
            <br />
            <span className="text-gold">Membina sistemnya sekali.</span>
          </h1>
          <p className="text-cream/85 text-base md:text-lg leading-relaxed mt-8 max-w-xl mx-auto reveal">
            Pengasas <span className="text-cream font-medium">10 CAMP</span> — peruncitan peralatan
            outdoor di Malaysia. Keseluruhan sistem operasinya — POS, kewangan, HR — dibangunkan
            secara dalaman, dari asas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 reveal">
            {ROLES.map((r) => (
              <span
                key={r.label}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/12 bg-white/[0.04] ${r.tone}`}
              >
                {r.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 reveal">
            <a
              href="#projek"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-night text-sm font-semibold hover:bg-gold-dark transition"
            >
              Lihat portfolio
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href="#hubungi"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-cream/85 text-sm font-medium hover:bg-white/[0.06] transition"
            >
              Hubungi saya
            </a>
          </div>
        </div>
      </section>

      {/* ======== BIG STATEMENT ======== */}
      <section className="relative px-6 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl leading-snug reveal">
            Daripada peruncitan vape kepada peralatan kembara — satu prinsip kekal:{' '}
            <span className="text-ember-bright">jika sistemnya tiada, bina sendiri.</span>
          </h2>
        </div>
      </section>

      {/* ======== SEKARANG ======== */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Fokus semasa</SectionLabel>
          <div className="grid md:grid-cols-5 gap-10 items-start mt-8">
            <div className="md:col-span-3 reveal">
              <h3 className="font-display text-2xl md:text-3xl leading-snug">
                Peruncit di siang hari, pembina sistem di malam hari.
              </h3>
              <p className="text-cream/85 leading-relaxed mt-5">
                10 CAMP beroperasi di Shopee, TikTok Shop dan kedai fizikal. Apabila perniagaan
                berkembang, sistem sedia ada tidak lagi mencukupi — maka setiap satunya dibangunkan
                secara dalaman: POS untuk operasi kedai, back office untuk kewangan, portal HR
                untuk pengurusan tenaga kerja.
              </p>
              <p className="text-cream/85 leading-relaxed mt-4">
                Bukan pengaturcara terlatih — peruncit yang membina sistem kerana perniagaan
                sendiri yang memerlukannya. Setiap modul lahir daripada masalah operasi yang
                sebenar.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-5 flex items-baseline gap-4 reveal"
                >
                  <span className="font-display text-4xl text-gold">{s.value}</span>
                  <span className="text-xs text-cream/70 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== TENGAH BINA ======== */}
      <section id="projek" className="relative px-6 py-20 md:py-28">
        {/* soft glow behind cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(214,179,106,0.05), transparent 60%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <SectionLabel>Portfolio</SectionLabel>
          <h3 className="font-display text-3xl md:text-4xl mt-4 reveal">
            Satu perniagaan, satu ekosistem.
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ======== PERJALANAN ======== */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Perjalanan</SectionLabel>
          <div className="mt-10 space-y-0">
            {JOURNEY.map((j, i) => (
              <div key={j.title} className="relative pl-8 pb-12 last:pb-0 reveal">
                {/* timeline spine */}
                {i < JOURNEY.length - 1 && (
                  <span className="absolute left-[5px] top-4 bottom-0 w-px bg-white/10" aria-hidden="true" />
                )}
                <span
                  className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full border-2 border-gold bg-night"
                  aria-hidden="true"
                />
                <p className="font-mono text-[11px] tracking-[0.2em] text-gold-bright uppercase">
                  {j.year}
                </p>
                <h4 className="font-display text-xl md:text-2xl mt-1.5">{j.title}</h4>
                <p className="text-cream/80 leading-relaxed text-base mt-2 max-w-xl">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== HUBUNGI / FOOTER CTA ======== */}
      <section id="hubungi" className="relative px-6 pt-24 pb-10 overflow-hidden">
        <div
          className="absolute -inset-10 pointer-events-none glow-pulse will-change-transform"
          aria-hidden="true"
          data-parallax="16"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 115%, rgba(255,140,66,0.14), transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-tight reveal">
            Mari berhubung.
          </h2>
          <p className="text-cream/80 mt-5 max-w-md mx-auto reveal">
            Untuk kerjasama, pertanyaan perniagaan atau perbincangan mengenai pembangunan
            sistem — hubungi saya melalui e-mel atau media sosial.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-9 reveal">
            <a
              href="mailto:zaid@todak.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-night text-sm font-semibold hover:bg-gold-dark transition"
            >
              zaid@todak.com
            </a>
            <div className="flex items-center gap-3">
              <SocialIcon href="https://instagram.com/brozaidtodak" label="Instagram">
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              </SocialIcon>
              <SocialIcon href="https://tiktok.com/@brozaidtodak" label="TikTok">
                <path d="M21 8.5a8 8 0 0 1-5-1.7v8.2a6 6 0 1 1-6-6h.5v3.5a2.5 2.5 0 1 0 2.5 2.5V2h3a5 5 0 0 0 5 5z" />
              </SocialIcon>
              <SocialIcon href="https://10camp.com" label="10 CAMP">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </SocialIcon>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
            <span>© 2026 Bro Zaid Todak</span>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 hover:text-cream/80 transition"
            >
              <LockIcon />
              <span>Enter Command Centre</span>
              <span className="text-gold transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ---- intro loader (sekali per sesi, ~1.3s) ----
function Intro({ onDone }) {
  const [count, setCount] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let raf
    const start = performance.now()
    const dur = 1100
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setCount(Math.round(p * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setFading(true)
        setTimeout(onDone, 450)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 bg-night flex flex-col items-center justify-center gap-6 ${
        fading ? 'intro-fade' : ''
      }`}
    >
      <Monogram size={64} />
      <p className="font-mono text-[11px] tracking-[0.3em] text-cream/65 uppercase">
        Memuatkan&nbsp;&nbsp;{count}%
      </p>
    </div>
  )
}

function Monogram({ size = 40 }) {
  return (
    <div
      className="rounded-full p-[2px] shrink-0"
      style={{
        width: size,
        height: size,
        background: 'conic-gradient(from 180deg, #d6b36a, #5fa874, #d6b36a, #2d5240, #d6b36a)',
      }}
    >
      <div className="w-full h-full rounded-full bg-night flex items-center justify-center">
        <span className="font-display text-gold font-semibold" style={{ fontSize: size * 0.42 }}>
          Z
        </span>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.28em] text-gold-bright uppercase reveal">
      — {children}
    </p>
  )
}

function ProjectCard({ project }) {
  const inner = (
    <div className="h-full rounded-2xl border border-white/12 bg-white/[0.03] p-6 flex flex-col gap-3 transition hover:border-gold/30 hover:bg-white/[0.05] reveal">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-cream/65 uppercase">
          {project.tag}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
          {project.status}
        </span>
      </div>
      <h4 className="font-display text-xl text-cream">{project.name}</h4>
      <p className="text-cream/75 text-[15px] leading-relaxed">{project.desc}</p>
      {project.url && (
        <span className="text-gold text-xs font-medium mt-auto pt-2">
          Lawati laman →
        </span>
      )}
    </div>
  )
  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    inner
  )
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/12 flex items-center justify-center text-cream/85 hover:text-cream hover:border-gold/40 transition"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </a>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
