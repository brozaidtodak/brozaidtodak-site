import { useEffect, useState } from 'react'

// Pintu belakang — panel shortcut tersembunyi.
// Buka: taip "zaid" pada mana-mana halaman (desktop), atau 5 tap pantas
// pada teks copyright footer (mobile — Landing dispatch event 'bzt:reveal').
// Tutup: Esc, klik luar, atau butang tutup.
const LINKS = [
  { n: 'Hub Sumber', d: 'Prompt · UI · Asset · Toolkit', href: 'https://prompt.brozaidtodak.com' },
  { n: 'Training', d: 'Buku TikTok 10 bab', href: 'https://training.brozaidtodak.com' },
  { n: 'Finance', d: 'Kewangan peribadi', href: '/finance/' },
  { n: 'Command Centre', d: 'Dashboard dalaman', href: '/login' },
]

export default function SecretPanel() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let buf = ''
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return }
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (!e.key || e.key.length !== 1) return
      buf = (buf + e.key.toLowerCase()).slice(-4)
      if (buf === 'zaid') { setOpen(true); buf = '' }
    }
    const onReveal = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('bzt:reveal', onReveal)
    console.log('%cpsst… taip "zaid" 🔥', 'color:#ff4d00;font-weight:bold;font-size:12px')
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('bzt:reveal', onReveal)
    }
  }, [])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-forest p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">Pintu belakang</div>
            <div className="text-white text-lg font-bold mt-1">Shortcut</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup"
            className="text-white/40 hover:text-white text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {LINKS.map((l) => (
            <a
              key={l.n}
              href={l.href}
              className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 hover:border-gold/60 hover:bg-white/5 transition"
            >
              <span>
                <span className="block text-white font-semibold text-sm group-hover:text-gold transition">{l.n}</span>
                <span className="block text-white/40 text-xs mt-0.5">{l.d}</span>
              </span>
              <span className="text-white/30 group-hover:text-gold transition">→</span>
            </a>
          ))}
        </div>
        <div className="text-white/25 text-[10px] mt-5 text-center">Esc untuk tutup</div>
      </div>
    </div>
  )
}
