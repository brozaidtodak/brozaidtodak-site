import { useEffect, useState } from 'react'
import { fetchProjects } from '../lib/projects.js'
import {
  fetchTransactionsByProject, createTransaction, updateTransaction, deleteTransaction,
  CURRENCIES, SOURCE_TYPES, suggestSubcategories, summarize, formatRM,
} from '../lib/transactions.js'

export default function Financial() {
  const [projects, setProjects] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        setProjects(data)
        if (data.length) setActiveId(data[0].id)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const active = projects.find((p) => p.id === activeId)

  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Financial</p>
        <h1 className="font-display text-4xl text-cream">Money in. Money out.</h1>
        <p className="text-cream/55 mt-3 max-w-xl text-sm">
          Track capital, expenses, revenue per project — starting from the first ringgit out the door.
        </p>
      </div>

      {loading && <p className="text-cream/50 text-sm">Loading projects…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && projects.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-white/8">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  activeId === p.id
                    ? 'bg-gold/12 text-gold border-gold/30'
                    : 'text-cream/65 border-white/10 hover:text-cream hover:border-white/25'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {active && <ProjectFinancialView key={active.id} project={active} />}
        </>
      )}
    </>
  )
}

function ProjectFinancialView({ project }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'new', direction, category } | { mode: 'edit', transaction }

  async function load() {
    setLoading(true); setError('')
    try {
      setTransactions(await fetchTransactionsByProject(project.id))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [project.id])

  async function handleSave(input) {
    if (modal.mode === 'edit') {
      await updateTransaction(modal.transaction.id, input)
    } else {
      await createTransaction({ ...input, project_id: project.id })
    }
    setModal(null)
    await load()
  }

  async function handleDelete(t) {
    if (!confirm(`Delete this ${t.category} transaction (${formatRM(t.amount_myr)})?`)) return
    await deleteTransaction(t.id)
    await load()
  }

  function handleEdit(t) {
    setModal({ mode: 'edit', transaction: t })
  }

  const stats = summarize(transactions)
  const capital = transactions.filter((t) => t.category === 'capital')
  const expenses = transactions.filter((t) => t.category === 'expense')
  const revenue = transactions.filter((t) => t.category === 'revenue')

  return (
    <div className="space-y-10">
      {/* Snapshot */}
      <section>
        <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-3">Snapshot</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SnapshotCard label="Capital in" value={formatRM(stats.capitalIn)} hint="Investor + self + loan" />
          <SnapshotCard label="Total spent" value={formatRM(stats.totalSpent)} hint="All outflows" />
          <SnapshotCard label="Revenue" value={formatRM(stats.revenue)} hint="Sales / income" />
          <SnapshotCard label="Cash balance" value={formatRM(stats.balance)} hint="In + revenue − spent" highlight />
        </div>
      </section>

      {loading && <p className="text-cream/50 text-sm">Loading transactions…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Capital */}
      <TransactionSection
        title="Capital inflows"
        subtitle="Investor pumps + injections + loans"
        eyebrow="Capital"
        eyebrowColor="gold"
        addLabel="+ Pump"
        addStyle="primary"
        items={capital}
        onAdd={() => setModal({ mode: 'new', direction: 'in', category: 'capital' })}
        emptyText="No capital tracked yet. Pump it in once duit start masuk."
        renderItem={(t) => <CapitalRow t={t} onEdit={() => handleEdit(t)} onDelete={() => handleDelete(t)} />}
      />

      {/* Expenses */}
      <TransactionSection
        title="Expenses"
        subtitle="Outflows by category"
        eyebrow="Expenses"
        addLabel="+ Expense"
        addStyle="ghost"
        items={expenses}
        onAdd={() => setModal({ mode: 'new', direction: 'out', category: 'expense' })}
        emptyText="No expenses logged."
        renderItem={(t) => <ExpenseRow t={t} onEdit={() => handleEdit(t)} onDelete={() => handleDelete(t)} />}
      />

      {/* Revenue */}
      <TransactionSection
        title="Revenue"
        subtitle="Sales / income"
        eyebrow="Revenue"
        addLabel="+ Sale"
        addStyle="ghost"
        items={revenue}
        onAdd={() => setModal({ mode: 'new', direction: 'in', category: 'revenue' })}
        emptyText="No revenue yet."
        renderItem={(t) => <RevenueRow t={t} onEdit={() => handleEdit(t)} onDelete={() => handleDelete(t)} />}
      />

      {modal && (
        <TransactionModal
          projectSlug={project.slug}
          mode={modal.mode}
          initial={modal.mode === 'edit' ? modal.transaction : { direction: modal.direction, category: modal.category }}
          onCancel={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function SnapshotCard({ label, value, hint, highlight }) {
  return (
    <div className={`rounded-2xl p-4 border ${highlight ? 'bg-gold/8 border-gold/25' : 'bg-white/[0.03] border-white/8'}`}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-cream/45 mb-2">{label}</p>
      <p className={`font-display text-xl ${highlight ? 'text-gold' : 'text-cream'} truncate`}>{value}</p>
      <p className="text-[11px] text-cream/45 mt-2 leading-snug">{hint}</p>
    </div>
  )
}

function TransactionSection({ title, subtitle, eyebrow, eyebrowColor, addLabel, addStyle, items, onAdd, emptyText, renderItem }) {
  const eyebrowClass = eyebrowColor === 'gold' ? 'text-gold' : 'text-cream/55'
  const btnClass = addStyle === 'primary'
    ? 'bg-gold text-forest-deep hover:bg-gold-dark'
    : 'border border-white/15 text-cream/70 hover:text-cream hover:border-white/30'

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`font-mono text-[11px] uppercase tracking-widest mb-1 ${eyebrowClass}`}>{eyebrow}</p>
          <h2 className="font-display text-lg text-cream">{title}</h2>
          <p className="text-xs text-cream/45">{subtitle}</p>
        </div>
        <button onClick={onAdd}
          className={`text-sm font-semibold px-4 py-2 rounded-full transition ${btnClass}`}>
          {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-cream/40 text-sm italic">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((t) => (
            <li key={t.id}>{renderItem(t)}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RowShell({ children, onEdit, onDelete, isTemplate }) {
  return (
    <div
      onClick={onEdit}
      className={`group bg-white/[0.03] border ${isTemplate ? 'border-dashed border-gold/25' : 'border-white/8'} rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-white/[0.05] hover:border-white/20 cursor-pointer transition`}
    >
      {children}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 text-cream/30 hover:text-red-400 text-sm transition px-1"
        aria-label="Delete"
      >
        ✕
      </button>
    </div>
  )
}

function isTemplateNotes(notes) {
  return typeof notes === 'string' && notes.startsWith('TEMPLATE')
}

function CapitalRow({ t, onEdit, onDelete }) {
  return (
    <RowShell onEdit={onEdit} onDelete={onDelete} isTemplate={isTemplateNotes(t.notes)}>
      <span className="font-mono text-xs text-cream/55 w-24 shrink-0">{t.transaction_date}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-cream truncate">
          {t.counterparty || 'Unknown'} <span className="text-cream/50">— {t.subcategory || t.source_type}</span>
        </p>
        {t.notes && <p className="text-xs text-cream/45 truncate">{t.notes}</p>}
      </div>
      {t.equity_percent != null && (
        <span className="font-mono text-xs text-gold-dark shrink-0">{t.equity_percent}% equity</span>
      )}
      <div className="text-right shrink-0">
        <p className="font-mono text-sm text-cream">{formatRM(t.amount_myr)}</p>
        {t.currency !== 'MYR' && (
          <p className="font-mono text-[10px] text-cream/45">{t.amount_original} {t.currency} @ {t.exchange_rate}</p>
        )}
      </div>
    </RowShell>
  )
}

function ExpenseRow({ t, onEdit, onDelete }) {
  return (
    <RowShell onEdit={onEdit} onDelete={onDelete} isTemplate={isTemplateNotes(t.notes)}>
      <span className="font-mono text-xs text-cream/55 w-24 shrink-0">{t.transaction_date}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-cream truncate">{t.subcategory || 'Expense'}</p>
        {t.counterparty && <p className="text-xs text-cream/50 truncate">to {t.counterparty}</p>}
        {isTemplateNotes(t.notes) && (
          <p className="text-[10px] text-gold-dark/80 mt-0.5 font-mono">{t.notes}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono text-sm text-red-300">−{formatRM(t.amount_myr).replace('RM ', 'RM ')}</p>
        {t.currency !== 'MYR' && (
          <p className="font-mono text-[10px] text-cream/45">{t.amount_original} {t.currency}</p>
        )}
      </div>
    </RowShell>
  )
}

function RevenueRow({ t, onEdit, onDelete }) {
  return (
    <RowShell onEdit={onEdit} onDelete={onDelete} isTemplate={isTemplateNotes(t.notes)}>
      <span className="font-mono text-xs text-cream/55 w-24 shrink-0">{t.transaction_date}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-cream truncate">{t.subcategory || 'Sale'}</p>
        {t.counterparty && <p className="text-xs text-cream/50 truncate">from {t.counterparty}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono text-sm text-emerald-300">+{formatRM(t.amount_myr).replace('RM ', 'RM ')}</p>
        {t.currency !== 'MYR' && (
          <p className="font-mono text-[10px] text-cream/45">{t.amount_original} {t.currency}</p>
        )}
      </div>
    </RowShell>
  )
}

function TransactionModal({ projectSlug, mode, initial, onCancel, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const suggestions = suggestSubcategories(projectSlug, initial.category)

  const [form, setForm] = useState({
    transaction_date: initial.transaction_date || today,
    direction: initial.direction,
    category: initial.category,
    subcategory: initial.subcategory || '',
    amount_original: initial.amount_original ?? '',
    currency: initial.currency || 'MYR',
    exchange_rate: initial.exchange_rate ?? 1,
    counterparty: initial.counterparty || '',
    source_type: initial.source_type || (initial.category === 'capital' ? 'investor' : ''),
    equity_percent: initial.equity_percent ?? '',
    payment_method: initial.payment_method || '',
    notes: initial.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })) }

  function set_currency(c) {
    setForm((p) => ({ ...p, currency: c, exchange_rate: c === 'MYR' ? 1 : p.exchange_rate }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const payload = {
        ...form,
        amount_original: Number(form.amount_original),
        exchange_rate: Number(form.exchange_rate),
        equity_percent: form.equity_percent === '' ? null : Number(form.equity_percent),
        source_type: form.source_type || null,
      }
      await onSave(payload)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  const amountRM = Number(form.amount_original || 0) * Number(form.exchange_rate || 0)

  const titleBase = {
    capital: 'capital inflow',
    expense: 'expense',
    revenue: 'sale / revenue',
  }[form.category]
  const title = (mode === 'edit' ? 'Edit ' : 'Log ') + titleBase

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
        className="bg-[#0f221a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-display text-xl text-cream mb-1">{title}</h3>
        <p className="text-xs text-cream/45 mb-5 font-mono">{form.direction === 'in' ? '↘ inflow' : '↗ outflow'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Date">
            <input type="date" required value={form.transaction_date}
              onChange={(e) => set('transaction_date', e.target.value)} className="cc-input" />
          </Field>
          <Field label="Subcategory" hint={suggestions.length ? `e.g. ${suggestions.slice(0, 3).join(', ')}` : ''}>
            <input type="text" list="subcat-list" value={form.subcategory}
              onChange={(e) => set('subcategory', e.target.value)}
              placeholder="e.g. Investor pump" className="cc-input" />
            <datalist id="subcat-list">
              {suggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </Field>

          <Field label="Amount" required>
            <input type="number" step="0.01" min="0.01" required value={form.amount_original}
              onChange={(e) => set('amount_original', e.target.value)}
              placeholder="0.00" className="cc-input" />
          </Field>
          <Field label="Currency">
            <select value={form.currency} onChange={(e) => set_currency(e.target.value)} className="cc-input">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {form.currency !== 'MYR' && (
            <Field label={`Exchange rate (1 ${form.currency} = ? MYR)`} required>
              <input type="number" step="0.000001" min="0.000001" required value={form.exchange_rate}
                onChange={(e) => set('exchange_rate', e.target.value)}
                placeholder="4.75" className="cc-input" />
            </Field>
          )}

          {form.amount_original && (
            <div className={`${form.currency !== 'MYR' ? '' : 'md:col-span-2'} flex items-end`}>
              <div className="bg-gold/10 border border-gold/25 rounded-xl px-4 py-3 w-full">
                <p className="text-[10px] uppercase tracking-wider text-gold-dark mb-0.5">MYR equivalent</p>
                <p className="font-display text-lg text-gold">{formatRM(amountRM)}</p>
              </div>
            </div>
          )}

          <Field label="Counterparty" hint={form.category === 'capital' ? 'Investor / lender name' : form.direction === 'out' ? 'Who you paid' : 'Customer'}>
            <input type="text" value={form.counterparty}
              onChange={(e) => set('counterparty', e.target.value)}
              placeholder="name" className="cc-input" />
          </Field>

          {form.category === 'capital' && (
            <>
              <Field label="Source type">
                <select value={form.source_type} onChange={(e) => set('source_type', e.target.value)} className="cc-input">
                  {SOURCE_TYPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </Field>
              {form.source_type === 'investor' && (
                <Field label="Equity given (%)" hint="0 if loan / convertible">
                  <input type="number" step="0.01" min="0" max="100" value={form.equity_percent}
                    onChange={(e) => set('equity_percent', e.target.value)}
                    placeholder="0.00" className="cc-input" />
                </Field>
              )}
            </>
          )}

          <Field label="Payment method" hint="Cash, bank, FPX, card…">
            <input type="text" value={form.payment_method}
              onChange={(e) => set('payment_method', e.target.value)} className="cc-input" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Notes">
              <textarea rows="2" value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                className="cc-input resize-none" />
            </Field>
          </div>
        </div>

        {err && <p className="text-red-400 text-sm mt-4">{err}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-full text-sm text-cream/70 hover:text-cream">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gold text-forest-deep hover:bg-gold-dark transition disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <style>{`
          .cc-input {
            width: 100%; background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px; padding: 10px 14px;
            color: #f5f1e8; font-size: 14px; font-family: inherit;
          }
          .cc-input:focus { outline: none; border-color: #d6b36a; background: rgba(255,255,255,0.06); }
          .cc-input option { background: #0f221a; color: #f5f1e8; }
        `}</style>
      </form>
    </div>
  )
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </span>
      {children}
      {hint && <span className="text-[10px] text-cream/35 mt-1 block">{hint}</span>}
    </label>
  )
}
