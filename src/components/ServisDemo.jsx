import { useMemo, useState } from 'react'
import { DEMO_DASH, DEMO_ITEMS } from '../lib/servisPages.js'

// ============================================================
// Demo interaktif untuk halaman pakej. Bakal client taip nama kedai,
// terus nampak rupa hasil. SEMUA di sisi pelayar — tiada data dihantar
// atau disimpan (dijanjikan pada teks "paparan contoh sahaja").
// ============================================================

const money = (n) => 'RM' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function NameField({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-ink-3 mb-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 48))}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-card border border-line text-ink
                   placeholder:text-ink-3 outline-none focus:border-accent-ink focus:bg-card transition"
      />
    </label>
  )
}

/* ============ KILAT — katalog → purchase order ============ */
export function DemoKilat({ t, lang, fallbackName }) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState({})
  const shop = name.trim() || fallbackName

  const picked = useMemo(
    () => DEMO_ITEMS.map((it, i) => ({ it, q: qty[i] || 0 })).filter((x) => x.q > 0),
    [qty],
  )
  const total = picked.reduce((s, x) => s + x.q * x.it.price, 0)
  const units = picked.reduce((s, x) => s + x.q, 0)
  const bump = (i, d) => setQty((q) => ({ ...q, [i]: Math.max(0, Math.min(999, (q[i] || 0) + d)) }))

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* kawalan */}
      <div className="rounded-2xl border border-ink/12 bg-card p-6">
        <NameField label={t.demoField} placeholder={t.demoPlaceholder} value={name} onChange={setName} />
        <p className="text-[11px] uppercase tracking-wider text-ink-3 mt-6 mb-3">{t.demoPick}</p>
        <div className="space-y-2">
          {DEMO_ITEMS.map((it, i) => (
            <div key={it.sku}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                qty[i] ? 'border-accent-ink/40 bg-accent-ink/10' : 'border-ink/12 bg-card'
              }`}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{it.name[lang] || it.name.ms}</div>
                <div className="font-mono text-[11px] text-ink-3">{it.sku} · {money(it.price)}</div>
              </div>
              <div className="flex items-center rounded-lg border border-line overflow-hidden shrink-0">
                <button onClick={() => bump(i, -1)} aria-label="-"
                  className="w-9 h-9 text-lg hover:bg-card transition">−</button>
                <span className="w-9 text-center text-sm font-bold tabular-nums">{qty[i] || 0}</span>
                <button onClick={() => bump(i, 1)} aria-label="+"
                  className="w-9 h-9 text-lg hover:bg-accent hover:text-ink transition">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* hasil — dokumen putih supaya nampak macam kertas sebenar */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">{t.demoResult}</p>
        <div className="rounded-2xl bg-ink text-paper p-6 md:p-7 shadow-[0_10px_30px_rgba(20,20,20,0.10)] min-h-[320px]">
          {picked.length === 0 ? (
            <p className="text-paper/40 text-sm py-16 text-center">{t.demoEmpty}</p>
          ) : (
            <>
              <div className="flex justify-between items-start gap-4 border-b-2 border-black pb-3">
                <div>
                  <h4 className="font-display font-bold text-lg tracking-[0.14em] uppercase">Purchase Order</h4>
                  <p className="text-[11px] text-paper/60 mt-0.5">{shop}</p>
                </div>
                <div className="text-right text-[10px] leading-relaxed text-paper/70">
                  <div><b>PO-2026-014</b></div>
                  <div>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
              <table className="w-full text-[11px] mt-3">
                <thead>
                  <tr className="border-b border-black/25">
                    <th className="text-left py-1.5 font-semibold uppercase tracking-wider text-[9px]">SKU</th>
                    <th className="text-left py-1.5 font-semibold uppercase tracking-wider text-[9px]">Item</th>
                    <th className="text-center py-1.5 font-semibold uppercase tracking-wider text-[9px]">Qty</th>
                    <th className="text-right py-1.5 font-semibold uppercase tracking-wider text-[9px]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {picked.map(({ it, q }) => (
                    <tr key={it.sku} className="border-b border-black/10">
                      <td className="py-1.5 font-mono text-[10px]">{it.sku}</td>
                      <td className="py-1.5">{it.name[lang] || it.name.ms}</td>
                      <td className="py-1.5 text-center">{q}</td>
                      <td className="py-1.5 text-right tabular-nums">{money(q * it.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-baseline border-t-2 border-black mt-3 pt-2.5">
                <span className="text-[10px] uppercase tracking-wider text-paper/60">{units} unit</span>
                <span className="font-display font-bold text-xl tabular-nums">{money(total)}</span>
              </div>
              <div className="flex gap-8 mt-8 text-[9px] text-paper/55">
                <div className="flex-1 border-t border-black/50 pt-1">Approved</div>
                <div className="flex-1 border-t border-black/50 pt-1">Received</div>
              </div>
            </>
          )}
        </div>
        <p className="text-ink-3 text-xs mt-3">{t.demoNote}</p>
      </div>
    </div>
  )
}

/* ============ ASAS — muka depan + sistem dalaman ============ */
export function DemoAsas({ t, fallbackName }) {
  const [name, setName] = useState('')
  const [type, setType] = useState(t.demoTypes[0].id)
  const shop = name.trim() || fallbackName
  const kind = t.demoTypes.find((x) => x.id === type) || t.demoTypes[0]
  const initials = shop.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  return (
    <div>
      <div className="rounded-2xl border border-ink/12 bg-card p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-5">
          <NameField label={t.demoField} placeholder={t.demoPlaceholder} value={name} onChange={setName} />
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-ink-3 mb-2">{t.demoType}</span>
            <div className="flex flex-wrap gap-2">
              {t.demoTypes.map((x) => (
                <button key={x.id} onClick={() => setType(x.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                    type === x.id ? 'bg-accent text-ink border-accent-ink' : 'border-line text-ink-2 hover:border-line'
                  }`}>
                  {x.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* muka depan */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">{t.demoSite}</p>
          <div className="rounded-2xl overflow-hidden border border-ink/12 bg-[var(--color-panel)] shadow-[0_10px_30px_rgba(20,20,20,0.10)]">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-card border-b border-ink/12">
              <span className="w-2.5 h-2.5 rounded-full bg-card" />
              <span className="w-2.5 h-2.5 rounded-full bg-card" />
              <span className="w-2.5 h-2.5 rounded-full bg-card" />
              <span className="ml-3 text-[10px] text-ink-3 font-mono truncate">
                {shop.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com
              </span>
            </div>
            <div className="px-6 py-9 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,77,0,0.14), transparent 65%)' }} />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent text-ink font-black text-sm mb-4">
                  {initials || '—'}
                </div>
                <h4 className="font-display font-bold text-2xl leading-tight">{shop}</h4>
                <p className="text-ink-3 text-sm mt-2">{kind.tag}</p>
                <span className="inline-block mt-5 px-5 py-2.5 rounded-full bg-accent text-ink text-xs font-bold">
                  {kind.cta}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-card">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-[var(--color-panel)] p-3.5">
                  <div className="h-1.5 w-8 rounded bg-accent-ink/60 mb-2" />
                  <div className="h-1.5 rounded bg-card mb-1.5" />
                  <div className="h-1.5 w-2/3 rounded bg-card" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* sistem dalaman */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-3 mb-3">{t.demoAdmin}</p>
          <div className="rounded-2xl border border-ink/12 bg-card p-5 shadow-[0_10px_30px_rgba(20,20,20,0.10)]">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-ink/12">
              <span className="text-sm font-bold truncate">{shop}</span>
              <span className="font-mono text-[10px] text-ink-3 shrink-0">admin</span>
            </div>
            <div className="space-y-2 mt-3">
              {[
                { n: 'Nurul A.', s: 'baru', c: 'text-accent-ink border-accent-ink/40' },
                { n: 'Hafiz M.', s: 'proses', c: 'text-ink-2 border-line' },
                { n: 'Siti R.', s: 'siap', c: 'text-emerald-400/80 border-emerald-400/30' },
                { n: 'Danial K.', s: 'siap', c: 'text-emerald-400/80 border-emerald-400/30' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-card px-3 py-2.5">
                  <span className="font-mono text-[10px] text-ink-3 w-10 shrink-0">#{1204 + i}</span>
                  <span className="text-sm flex-1 truncate">{r.n}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${r.c}`}>{r.s}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-ink-3 text-xs mt-3">{t.demoNote}</p>
        </div>
      </div>
    </div>
  )
}

/* ============ OPERASI — papan pemuka ============ */
export function DemoOperasi({ t, lang, fallbackName }) {
  const [name, setName] = useState('')
  const shop = name.trim() || fallbackName
  const max = Math.max(...DEMO_DASH.bars)
  const s = t.demoStats

  return (
    <div>
      <div className="rounded-2xl border border-ink/12 bg-card p-6 mb-6 max-w-md">
        <NameField label={t.demoField} placeholder={t.demoPlaceholder} value={name} onChange={setName} />
      </div>

      <div className="rounded-2xl border border-ink/12 bg-[var(--color-panel)] p-6 md:p-7 shadow-[0_10px_30px_rgba(20,20,20,0.10)]">
        <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-ink/12">
          <div>
            <p className="text-ink-3 text-xs">{t.demoGreet},</p>
            <h4 className="font-display font-bold text-2xl leading-tight mt-0.5">{shop}</h4>
          </div>
          <span className="font-mono text-[10px] text-ink-3">
            {new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'ms-MY', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {[
            { l: s.sales, ...DEMO_DASH.stats[0] },
            { l: s.orders, ...DEMO_DASH.stats[1] },
            { l: s.low, ...DEMO_DASH.stats[2] },
            { l: s.profit, ...DEMO_DASH.stats[3] },
          ].map((x, i) => (
            <div key={i} className={`rounded-xl border p-4 ${
              i === 2 ? 'border-accent-ink/40 bg-accent-ink/10' : 'border-ink/12 bg-card'
            }`}>
              <div className="text-[10px] uppercase tracking-wider text-ink-3">{x.l}</div>
              <div className="font-display font-bold text-2xl mt-1.5 tabular-nums">{x.v}</div>
              {x.d && <div className="text-[11px] text-emerald-400/80 mt-0.5">{x.d}</div>}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <div className="rounded-xl border border-ink/12 bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-ink-3 mb-4">{t.demoChart}</div>
            <div className="flex items-end gap-2 h-28">
              {DEMO_DASH.bars.map((b, i) => (
                <div key={i} className="flex-1 h-full rounded-t origin-bottom transition-transform duration-500 ease-[var(--ease-out)]"
                  style={{
                    transform: `scaleY(${(b || 0) / max})`,
                    background: i === DEMO_DASH.bars.length - 1 ? '#ff4d00' : 'rgba(255,255,255,0.16)',
                  }} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-ink/12 bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-ink-3 mb-3">{t.demoLow}</div>
            <div className="space-y-2.5">
              {DEMO_DASH.lowStock.map((it) => (
                <div key={it.sku} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate">{it.name[lang] || it.name.ms}</div>
                    <div className="font-mono text-[10px] text-ink-3">{it.sku}</div>
                  </div>
                  <span className="text-[11px] text-accent-ink shrink-0">{it.left} {t.demoLeft}</span>
                  <span className="text-[11px] text-ink-3 shrink-0 hidden sm:inline">· {t.demoNeed} {it.need}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-ink-3 text-xs mt-3">{t.demoNote}</p>
    </div>
  )
}
