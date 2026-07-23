import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// ============================================================
// LANDING — tema "Todak monokrom"
// Inspirasi todak.com: hitam pekat, Inter bold putih, kelabu
// sekunder. DISIPLIN WARNA: satu aksen sahaja (Todak Orange) +
// neutral. Struktur cinematic + parallax + sparks dikekalkan.
// ============================================================

const ROLES = [
  { label: 'Retailer · 10 CAMP', tone: 'text-accent' },
  { label: 'Builder', tone: 'text-white' },
  { label: 'Naturalist', tone: 'text-white/70' },
]

const STATS = [
  { count: 5, suffix: '', label: 'Tahun dalam industri peruncitan' },
  { count: 10, suffix: '+', label: 'Sistem & platform dibangunkan' },
  { count: 1, suffix: '', label: 'Jenama · 10 CAMP' },
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
  const rootRef = useRef(null)

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

  // p1 — GSAP choreography ("padu"): hero SplitText, scroll reveals eased,
  // stats count-up, kad stagger, sea storm parallax. Hormat reduced-motion.
  useEffect(() => {
    if (!introDone) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.reveal', { opacity: 1, y: 0 })
        document.querySelectorAll('[data-count]').forEach((el) => {
          el.textContent = el.dataset.count + (el.dataset.suffix || '')
        })
        return
      }

      // HERO — tajuk pecah perkataan, naik dgn easing (SplitText)
      const title = document.querySelector('#hero-title')
      let split
      if (title) {
        split = new SplitText(title, { type: 'lines,words', linesClass: 'ovh' })
        gsap.from(split.words, {
          yPercent: 115, opacity: 0, duration: 1, ease: 'power4.out',
          stagger: 0.05, delay: 0.15,
        })
      }
      // elemen sokongan hero — fade + naik berperingkat
      // fromTo (bukan from) sebab CSS .hero-sub opacity:0 — end state mesti eksplisit
      gsap.fromTo('.hero-sub',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.12, delay: 0.55 }
      )

      // REVEAL scroll — eased slide+fade bila masuk viewport
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%' } }
        )
      })

      // STATS — nombor naik (count-up) bila scroll sampai
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count)
        const suffix = el.dataset.suffix || ''
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target, duration: 1.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix },
        })
      })

      // KAD PROJEK — masuk BARIS DEMI BARIS (axis:'y') supaya kad sebaris
      // naik serentak → irama grid kekal terjaga sepanjang animasi
      gsap.from('.card-pad', {
        y: 32, opacity: 0, duration: 0.7, ease: 'power3.out',
        stagger: { each: 0.12, grid: 'auto', axis: 'y', from: 'start' },
        scrollTrigger: { trigger: '#projek', start: 'top 78%' },
      })

      // SEA STORM — parallax perlahan bila scroll (kedalaman)
      gsap.to('.seastorm__media', {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [introDone])

  return (
    <div ref={rootRef} className="min-h-screen bg-void text-white font-sans relative overflow-x-clip">
      <SeaStorm />
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
          <Wordmark className="text-xl md:text-2xl" />
        </a>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/75 hover:text-white hover:border-white/40 text-xs font-semibold transition"
        >
          <LockIcon />
          Command Centre
        </Link>
      </header>

      {/* gradient ambient penuh — monokrom, sedikit haba accent kat kaki */}
      <div
        className="absolute -inset-10 pointer-events-none will-change-transform"
        aria-hidden="true"
        data-parallax="12"
        style={{
          background:
            'radial-gradient(circle at 50% 8%, rgba(255,255,255,0.05), transparent 45%), radial-gradient(circle at 12% 35%, rgba(255,255,255,0.03), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(255,255,255,0.025) 100%)',
        }}
      />
      {/* sinar utama kat kaki hero */}
      <div
        className="absolute -top-10 -inset-x-10 h-[190vh] pointer-events-none glow-pulse will-change-transform"
        aria-hidden="true"
        data-parallax="24"
        style={{
          background:
            'radial-gradient(ellipse 75% 28% at 50% 52%, rgba(255,255,255,0.06), transparent 65%)',
        }}
      />
      {/* sparks — fixed ikut viewport, naik dari bawah skrin di mana-mana section */}
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
        <div className="relative text-center max-w-4xl mx-auto pt-20 pb-16 will-change-transform" data-parallax="-8">
          <p className="hero-sub font-mono text-[11px] tracking-[0.28em] text-white/55 uppercase mb-6">
            Cyberjaya, Malaysia
          </p>
          <h1 id="hero-title" className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.98] tracking-tight uppercase">
            Membina
            <br />
            perniagaan.
            <br />
            <span className="text-accent">Membina sistemnya sekali.</span>
          </h1>
          <p className="hero-sub text-white/75 text-base md:text-lg leading-relaxed mt-9 max-w-xl mx-auto">
            Pengasas <span className="text-white font-semibold">10 CAMP</span> — peruncitan peralatan
            outdoor di Malaysia. Keseluruhan sistem operasinya — POS, kewangan, HR — dibangunkan
            secara dalaman, dari asas.
          </p>
          <div className="hero-sub flex flex-wrap items-center justify-center gap-2 mt-9">
            {ROLES.map((r) => (
              <span
                key={r.label}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/12 bg-white/[0.04] ${r.tone}`}
              >
                {r.label}
              </span>
            ))}
          </div>
          <div className="hero-sub flex flex-wrap items-center justify-center gap-4 mt-11">
            <a
              href="#projek"
              className="btn-pad btn-light inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-sm font-bold"
            >
              Lihat portfolio
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href="#hubungi"
              className="btn-pad inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white/90 text-sm font-semibold hover:bg-white/[0.07]"
            >
              Hubungi saya
            </a>
          </div>
        </div>
      </section>

      {/* ======== BIG STATEMENT ======== */}
      <section className="relative px-6 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-snug tracking-tight reveal">
            Daripada peruncitan vape kepada peralatan kembara — satu prinsip kekal:{' '}
            <span className="text-accent">jika sistemnya tiada, bina sendiri.</span>
          </h2>
        </div>
      </section>

      {/* ======== FOKUS SEMASA ======== */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Fokus semasa</SectionLabel>
          <div className="grid md:grid-cols-5 gap-10 items-start mt-8">
            <div className="md:col-span-3 reveal">
              <h3 className="font-sans font-extrabold text-2xl md:text-3xl leading-snug tracking-tight">
                Peruncit di siang hari, pembina sistem di malam hari.
              </h3>
              <p className="text-white/75 leading-relaxed mt-5">
                10 CAMP beroperasi di Shopee, TikTok Shop dan kedai fizikal. Apabila perniagaan
                berkembang, sistem sedia ada tidak lagi mencukupi — maka setiap satunya dibangunkan
                secara dalaman: POS untuk operasi kedai, back office untuk kewangan, portal HR
                untuk pengurusan tenaga kerja.
              </p>
              <p className="text-white/75 leading-relaxed mt-4">
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
                  <span
                    className="font-display font-bold text-4xl md:text-5xl text-white tabular-nums"
                    data-count={s.count}
                    data-suffix={s.suffix}
                  >
                    0{s.suffix}
                  </span>
                  <span className="text-xs text-white/60 uppercase tracking-wider font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== PORTFOLIO ======== */}
      <section id="projek" className="relative px-6 py-20 md:py-28">
        <div className="relative max-w-5xl mx-auto">
          <SectionLabel>Portfolio</SectionLabel>
          <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight mt-4 reveal">
            Satu perniagaan, satu ekosistem.
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-5 mt-10">
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
                {i < JOURNEY.length - 1 && (
                  <span className="absolute left-[5px] top-4 bottom-0 w-px bg-white/12" aria-hidden="true" />
                )}
                <span
                  className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full border-2 border-accent bg-void"
                  aria-hidden="true"
                />
                <p className="font-mono text-[11px] tracking-[0.2em] text-white/55 uppercase">
                  {j.year}
                </p>
                <h4 className="font-sans font-bold text-xl md:text-2xl mt-1.5">{j.title}</h4>
                <p className="text-white/70 leading-relaxed text-base mt-2 max-w-xl">{j.desc}</p>
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
              'radial-gradient(ellipse 75% 55% at 50% 115%, rgba(255,255,255,0.06), transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight uppercase reveal">
            Mari berhubung.
          </h2>
          <p className="text-white/70 mt-5 max-w-md mx-auto reveal">
            Untuk kerjasama, pertanyaan perniagaan atau perbincangan mengenai pembangunan
            sistem — hubungi saya melalui e-mel atau media sosial.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-9 reveal">
            <a
              href="mailto:zaid@todak.com"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-white/85 transition"
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

          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <span>© 2026 Bro Zaid Todak</span>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 hover:text-white/90 transition"
            >
              <LockIcon />
              <span>Enter Command Centre</span>
              <span className="text-accent transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ---- latar video Sea Storm (getlayers.ai) ----
// Autoplay gelung senyap di desktop; poster statik je bila reduced-motion
// atau autoplay disekat (jimat data + hormat pilihan pengguna).
function SeaStorm() {
  const [motionOK, setMotionOK] = useState(true)
  useEffect(() => {
    setMotionOK(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return (
    <div className="seastorm" aria-hidden="true">
      {motionOK ? (
        <video
          className="seastorm__media"
          src="/bg/sea-storm.mp4"
          poster="/bg/sea-storm.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img className="seastorm__media" src="/bg/sea-storm.webp" alt="" />
      )}
      <div className="seastorm__scrim" />
      <div className="seastorm__fade" />
    </div>
  )
}

// ---- intro montaj (sekali per sesi, ~2.8s) — GSAP timeline sinematik ----
function Intro({ onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const q = gsap.utils.selector(root)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      // hormat reduced-motion — terus tunjuk, fade cepat
      const t = setTimeout(onDone, 400)
      gsap.to(root, { opacity: 0, duration: 0.35, delay: 0.4 })
      return () => clearTimeout(t)
    }

    const tl = gsap.timeline({ onComplete: onDone })

    // 1) tiga perkataan naik dari mask, satu demi satu
    tl.from(q('.iw'), {
      yPercent: 120, duration: 0.8, ease: 'power4.out', stagger: 0.14,
    })
    // 2) kilauan oren menyapu merentas "zaid"
    tl.fromTo(q('.iw-sweep'),
      { xPercent: -120 },
      { xPercent: 120, duration: 0.55, ease: 'power2.inOut' }, '-=0.15')
    // 3) garis oren melukis di bawah wordmark
    tl.from(q('.iw-line'), {
      scaleX: 0, transformOrigin: 'left', duration: 0.55, ease: 'power3.out',
    }, '-=0.35')
    // 4) tagline mono muncul
    tl.from(q('.iw-tag'), {
      opacity: 0, y: 10, duration: 0.5, ease: 'power2.out',
    }, '-=0.25')
    // 5) tahan sekejap, zoom halus + fade keluar → dedah landing
    tl.to(q('.iw-mark'), {
      scale: 1.07, duration: 0.6, ease: 'power2.in',
    }, '+=0.45')
    tl.to(root, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '<0.12')

    return () => tl.kill()
  }, [onDone])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 bg-void flex flex-col items-center justify-center gap-5"
    >
      <div className="iw-mark relative flex flex-col items-center gap-4">
        <div className="relative">
          <span className="flex font-sans font-black lowercase tracking-tight leading-none text-5xl md:text-7xl">
            <span className="overflow-hidden inline-flex"><span className="iw inline-block text-white">bro</span></span>
            <span className="overflow-hidden inline-flex relative">
              <span className="iw inline-block text-accent">zaid</span>
              <span className="iw-sweep pointer-events-none absolute inset-y-0 -inset-x-2 bg-white/35 blur-md" />
            </span>
            <span className="overflow-hidden inline-flex"><span className="iw inline-block text-white">todak</span></span>
          </span>
          <span className="iw-line absolute left-0 -bottom-2.5 h-[4px] w-full bg-accent rounded-full" />
        </div>
        <span className="iw-tag font-mono text-[11px] tracking-[0.4em] text-white/45 uppercase">
          Cyberjaya · Builder
        </span>
      </div>
    </div>
  )
}

function Wordmark({ className = '' }) {
  return (
    <span className={`font-sans font-black lowercase tracking-tight leading-none ${className}`}>
      <span className="text-white">bro</span>
      <span className="text-accent">zaid</span>
      <span className="text-white">todak</span>
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[11px] tracking-[0.28em] text-white/55 uppercase reveal">
      — {children}
    </p>
  )
}

function ProjectCard({ project }) {
  const inner = (
    <div
      className="card-pad h-full rounded-2xl border border-white/12 bg-white/[0.03] p-6 flex flex-col gap-3 transition-colors hover:border-accent/40"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-medium text-accent">
          {project.tag}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.07] text-white/85 border border-white/15">
          {project.status}
        </span>
      </div>
      <h4 className="font-sans font-bold text-xl text-white">{project.name}</h4>
      <p className="text-white/70 text-[15px] leading-relaxed">{project.desc}</p>
      {project.url && (
        <span className="text-xs font-semibold mt-auto pt-2 text-accent">
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
      className="w-11 h-11 rounded-full bg-white/[0.05] border border-white/12 flex items-center justify-center text-white/75 hover:text-white hover:border-white/40 transition"
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
