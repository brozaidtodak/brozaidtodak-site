import { Link } from 'react-router-dom'

const ROLES = [
  { label: 'Retailer · 10 CAMP', tone: 'text-gold' },
  { label: 'Builder', tone: 'text-emerald-300' },
  { label: 'Naturalist', tone: 'text-amber-200' },
]

const STATS = [
  { value: '5', label: 'Years in retail' },
  { value: '3', label: 'Tools building' },
  { value: '1', label: 'Brand · 10 CAMP' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0c1812] text-cream font-sans flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* subtle radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(214,179,106,0.10), transparent 55%), radial-gradient(circle at 80% 80%, rgba(45,82,64,0.30), transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-xl flex flex-col items-center text-center">
        {/* Avatar with gradient ring */}
        <div className="relative mb-7">
          <div
            className="w-32 h-32 rounded-full p-[3px]"
            style={{
              background:
                'conic-gradient(from 180deg, #d6b36a, #5fa874, #d6b36a, #2d5240, #d6b36a)',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0c1812] flex items-center justify-center">
              <span className="font-display text-4xl font-semibold text-gold">Z</span>
            </div>
          </div>
        </div>

        {/* Name */}
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-cream tracking-tight">
          Bro Zaid Todak
        </h1>
        <p className="text-sm text-cream/55 mt-2">Kuala Lumpur, Malaysia</p>

        {/* Role pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {ROLES.map((r) => (
            <span
              key={r.label}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/8 bg-white/[0.04] ${r.tone}`}
            >
              {r.label}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-cream/75 leading-relaxed text-[15px] mt-7 max-w-md">
          Run <span className="text-cream font-medium">10 CAMP</span> — outdoor gear retail di Malaysia. Sambil tu, build sendiri tools yang aku perlu untuk run business — POS, dashboards, finance trackers. Belajar by doing.
        </p>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-3 mt-8">
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
          <SocialIcon href="mailto:hello@brozaidtodak.com" label="Email">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </SocialIcon>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <a
            href="mailto:hello@brozaidtodak.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-cream text-sm font-medium hover:bg-white/[0.06] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            hello@brozaidtodak.com
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-md">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <div className="font-display text-2xl text-cream font-semibold">{s.value}</div>
              <div className="text-[11px] text-cream/45 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer: enter command centre */}
        <div className="mt-12">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 text-cream/65 hover:text-cream text-sm font-medium transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Enter Command Centre</span>
            <span className="text-gold transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/8 flex items-center justify-center text-cream/70 hover:text-cream hover:bg-white/[0.08] transition"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </a>
  )
}
