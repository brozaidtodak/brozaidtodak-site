import { useEffect, useState } from 'react'
import {
  fetchPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  CATEGORY_OPTIONS, PORTFOLIO_STATUS_OPTIONS,
  categoryLabel, portfolioStatusColor, portfolioStatusLabel,
} from '../lib/portfolio.js'

const GROUPS = [
  { key: 'business', title: 'Business', sub: 'Bisnes yang kau jalankan' },
  { key: 'system', title: 'Systems', sub: 'Tools yang kau bina untuk run business' },
  { key: 'website', title: 'Websites', sub: 'Site yang kau bina & ship' },
  { key: 'past', title: 'Past ventures', sub: 'Journey sebelum ni' },
]

export default function Portfolio() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | item object

  async function load() {
    setLoading(true); setError('')
    try {
      setItems(await fetchPortfolio())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSave(input) {
    try {
      if (editing === 'new') await createPortfolioItem(input)
      else await updatePortfolioItem(editing.id, input)
      setEditing(null)
      await load()
    } catch (e) { alert('Save failed: ' + e.message) }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.name}"? Tak boleh undo.`)) return
    try { await deletePortfolioItem(item.id); await load() }
    catch (e) { alert('Delete failed: ' + e.message) }
  }

  const liveCount = items.filter((i) => i.status === 'live').length

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Portfolio</p>
          <h1 className="font-display text-4xl text-cream">Apa yang kau dah bina.</h1>
          {!loading && (
            <p className="text-sm text-cream/50 mt-2">
              {items.length} items · {liveCount} live sekarang
            </p>
          )}
        </div>
        <button
          onClick={() => setEditing('new')}
          className="shrink-0 inline-flex items-center gap-1.5 bg-gold text-forest-deep font-semibold px-4 py-2 rounded-full text-sm hover:bg-gold-dark transition"
        >
          <span>+</span><span>Add item</span>
        </button>
      </div>

      {loading && <p className="text-cream/50 text-sm">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && GROUPS.map((g) => {
        const group = items.filter((i) => i.category === g.key)
        if (group.length === 0) return null
        return (
          <section key={g.key} className="mb-12">
            <div className="mb-4">
              <h2 className="font-display text-xl text-cream">{g.title}</h2>
              <p className="text-xs text-cream/45 mt-0.5">{g.sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {group.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditing(item)}
                  onDelete={() => handleDelete(item)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {editing && (
        <PortfolioFormModal
          initial={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </>
  )
}

function PortfolioCard({ item, onEdit, onDelete }) {
  return (
    <article className="group bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 h-full hover:border-gold/40 transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-cream leading-tight flex-1">{item.name}</h3>
        <div className="flex items-center gap-1 -mr-1 opacity-0 group-hover:opacity-100 transition">
          <IconButton onClick={onEdit} label="Edit item">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </IconButton>
          <IconButton onClick={onDelete} label="Delete item" danger>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${portfolioStatusColor(item.status)}`}>
          {portfolioStatusLabel(item.status)}
        </span>
        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-white/5 text-cream/55 border-white/12">
          {categoryLabel(item.category)}
        </span>
        {item.year && (
          <span className="font-mono text-[11px] text-cream/45">{item.year}</span>
        )}
      </div>

      {item.description && (
        <p className="text-sm text-cream/65 leading-relaxed">{item.description}</p>
      )}

      {item.highlight && (
        <p className="text-[13px] text-gold/90 leading-snug border-l-2 border-gold/40 pl-3">
          {item.highlight}
        </p>
      )}

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-2 inline-flex items-center gap-1.5 text-xs text-cream/55 hover:text-gold font-medium transition"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="truncate">{item.url.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
    </article>
  )
}

function IconButton({ onClick, label, danger, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-1.5 rounded-md transition ${danger
        ? 'text-cream/40 hover:text-red-400 hover:bg-red-500/10'
        : 'text-cream/40 hover:text-cream hover:bg-white/8'}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}

function PortfolioFormModal({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || 'system',
    description: initial?.description || '',
    url: initial?.url || '',
    year: initial?.year || '',
    status: initial?.status || 'live',
    highlight: initial?.highlight || '',
    display_order: initial?.display_order ?? 0,
  })
  const [saving, setSaving] = useState(false)

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      url: form.url || null,
      year: form.year || null,
      highlight: form.highlight || null,
      display_order: Number(form.display_order),
    }
    try { await onSave(payload) } finally { setSaving(false) }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-[#0f221a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-display text-xl text-cream mb-5">
          {initial ? 'Edit portfolio item' : 'Add portfolio item'}
        </h3>

        <div className="space-y-4">
          <Field label="Name" required>
            <input type="text" required value={form.name}
              onChange={(e) => set('name', e.target.value)} className="form-input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={form.category}
                onChange={(e) => set('category', e.target.value)} className="form-input">
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status}
                onChange={(e) => set('status', e.target.value)} className="form-input">
                {PORTFOLIO_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea rows="3" value={form.description}
              onChange={(e) => set('description', e.target.value)} className="form-input resize-none" />
          </Field>
          <Field label="Highlight (satu ayat pencapaian)">
            <input type="text" value={form.highlight}
              onChange={(e) => set('highlight', e.target.value)}
              placeholder="e.g. RM2.48M modal dijejaki" className="form-input" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Year">
              <input type="text" value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="2026" className="form-input" />
            </Field>
            <Field label="Order">
              <input type="number" value={form.display_order}
                onChange={(e) => set('display_order', e.target.value)} className="form-input" />
            </Field>
          </div>
          <Field label="URL (optional)">
            <input type="url" value={form.url}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://…" className="form-input" />
          </Field>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-full text-sm text-cream/70 hover:text-cream">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gold text-forest-deep hover:bg-gold-dark transition disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <style>{`
          .form-input {
            width: 100%;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 10px 14px;
            color: #f5f1e8;
            font-size: 14px;
            font-family: inherit;
          }
          .form-input:focus {
            outline: none;
            border-color: #d6b36a;
            background: rgba(255,255,255,0.06);
          }
          .form-input option { background: #0f221a; color: #f5f1e8; }
        `}</style>
      </form>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </span>
      {children}
    </label>
  )
}
