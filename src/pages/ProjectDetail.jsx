import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import {
  updateProject, deleteProject,
  STATUS_OPTIONS, statusColor, statusLabel,
} from '../lib/projects.js'
import {
  fetchMilestonesByProject, createMilestone, toggleMilestone, deleteMilestone,
} from '../lib/milestones.js'

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  async function load() {
    setLoading(true); setError('')
    try {
      const { data: p, error: pErr } = await supabase
        .from('projects').select('*').eq('slug', slug).single()
      if (pErr) throw pErr
      setProject(p)
      setMilestones(await fetchMilestonesByProject(p.id))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [slug])
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ''))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function handleToggle(m) {
    const updated = await toggleMilestone(m)
    setMilestones((prev) => prev.map((x) => x.id === m.id ? updated : x))
  }

  async function handleAddMilestone(name) {
    const nextOrder = (milestones.at(-1)?.display_order ?? 0) + 1
    const created = await createMilestone(project.id, name, nextOrder)
    setMilestones((prev) => [...prev, created])
  }

  async function handleDeleteMilestone(id) {
    await deleteMilestone(id)
    setMilestones((prev) => prev.filter((m) => m.id !== id))
  }

  async function handleDeleteProject() {
    if (!confirm(`Delete "${project.name}"? Tak boleh undo — semua milestones pun akan kena delete.`)) return
    await deleteProject(project.id)
    navigate('/dashboard')
  }

  async function handleSaveProject(patch) {
    const updated = await updateProject(project.id, patch)
    setProject(updated)
    setEditing(false)
    if (updated.slug !== slug) navigate(`/dashboard/projects/${updated.slug}`, { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1812] text-cream flex items-center justify-center">
        <p className="text-cream/50 text-sm font-mono">loading project…</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0c1812] text-cream flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error || 'Project not found.'}</p>
        <Link to="/dashboard" className="text-gold text-sm hover:underline">← Back to dashboard</Link>
      </div>
    )
  }

  const doneCount = milestones.filter((m) => m.status === 'done').length

  return (
    <div className="min-h-screen bg-[#0c1812] text-cream">
      <header className="border-b border-white/8 bg-[#0c1812]/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-xl text-cream font-semibold">Bro Zaid Todak</Link>
            <span className="font-mono text-[11px] uppercase tracking-widest text-gold">/ command centre</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-cream/50 hidden sm:inline">{email}</span>
            <button onClick={handleLogout}
              className="text-sm text-cream/70 hover:text-cream font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/dashboard"
          className="inline-flex items-center gap-1.5 text-cream/55 hover:text-cream text-sm mb-8 transition">
          <span>←</span><span>Back to dashboard</span>
        </Link>

        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">Project</p>
            <h1 className="font-display text-4xl text-cream">{project.name}</h1>
          </div>
          <div className="flex gap-2 shrink-0 pt-3">
            <button onClick={() => setEditing(true)}
              className="text-sm text-cream/70 hover:text-cream px-3 py-1.5 rounded-md hover:bg-white/8 transition">
              Edit
            </button>
            <button onClick={handleDeleteProject}
              className="text-sm text-cream/50 hover:text-red-400 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition">
              Delete
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColor(project.status)}`}>
            {statusLabel(project.status)}
          </span>
          {project.current_phase && (
            <span className="font-mono text-xs text-cream/55">{project.current_phase}</span>
          )}
        </div>

        {project.description && (
          <p className="text-cream/75 leading-relaxed max-w-2xl mb-8">{project.description}</p>
        )}

        <div className="mb-10 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-cream/45 font-medium">Progress</span>
            <span className="font-mono text-sm text-cream/80">{project.progress_percent}%</span>
          </div>
          <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all"
              style={{ width: `${project.progress_percent}%` }} />
          </div>
        </div>

        <section className="border-t border-white/8 pt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-1">Milestones</p>
              <h2 className="font-display text-xl text-cream">
                {doneCount} of {milestones.length} done
              </h2>
            </div>
          </div>

          <ul className="space-y-2.5 max-w-2xl">
            {milestones.map((m) => (
              <MilestoneRow key={m.id} milestone={m}
                onToggle={() => handleToggle(m)}
                onDelete={() => handleDeleteMilestone(m.id)} />
            ))}
          </ul>

          <AddMilestoneInline onAdd={handleAddMilestone} />
        </section>

        {editing && (
          <ProjectEditModal
            project={project}
            onCancel={() => setEditing(false)}
            onSave={handleSaveProject}
          />
        )}
      </main>
    </div>
  )
}

function MilestoneRow({ milestone: m, onToggle, onDelete }) {
  const done = m.status === 'done'
  const inProgress = m.status === 'in_progress'
  return (
    <li className="flex items-center gap-3 group bg-white/[0.02] border border-white/6 rounded-lg px-3.5 py-2.5">
      <button onClick={onToggle}
        aria-label={done ? 'Mark pending' : 'Mark done'}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
        style={{
          borderColor: done || inProgress ? '#d6b36a' : 'rgba(245,241,232,0.25)',
          background: done ? '#d6b36a' : inProgress ? 'rgba(214,179,106,0.4)' : 'transparent',
        }}>
        {done && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0c1812" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <span className={`text-sm flex-1 ${done ? 'text-cream/40 line-through' : 'text-cream/85'}`}>
        {m.name}
      </span>
      {m.due_date && !done && (
        <span className="font-mono text-xs text-cream/40">{m.due_date}</span>
      )}
      {m.completed_at && (
        <span className="font-mono text-[10px] text-cream/30">
          {new Date(m.completed_at).toISOString().slice(0, 10)}
        </span>
      )}
      <button onClick={onDelete} aria-label="Delete milestone"
        className="opacity-0 group-hover:opacity-100 text-cream/30 hover:text-red-400 text-sm transition px-1">
        ✕
      </button>
    </li>
  )
}

function AddMilestoneInline({ onAdd }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    await onAdd(name.trim())
    setName(''); setAdding(false)
  }

  if (!adding) {
    return (
      <button onClick={() => setAdding(true)}
        className="mt-4 text-sm text-cream/55 hover:text-cream font-medium transition">
        + Add milestone
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-2xl">
      <input autoFocus type="text" value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Milestone name"
        className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold" />
      <button type="submit"
        className="text-sm font-semibold bg-gold text-forest-deep px-4 py-2.5 rounded-lg hover:bg-gold-dark transition">
        Add
      </button>
      <button type="button" onClick={() => { setAdding(false); setName('') }}
        className="text-sm text-cream/55 hover:text-cream px-3">
        Cancel
      </button>
    </form>
  )
}

function ProjectEditModal({ project, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: project.name,
    description: project.description || '',
    status: project.status,
    current_phase: project.current_phase || '',
    progress_percent: project.progress_percent,
  })
  const [saving, setSaving] = useState(false)

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true)
    try {
      await onSave({ ...form, progress_percent: Number(form.progress_percent) })
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
        className="bg-[#0f221a] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
        <h3 className="font-display text-xl text-cream mb-5">Edit project</h3>

        <div className="space-y-4">
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">Name</span>
            <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="cc-input" />
          </label>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">Description</span>
            <textarea rows="2" value={form.description} onChange={(e) => set('description', e.target.value)} className="cc-input resize-none" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">Status</span>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className="cc-input">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">Current phase</span>
              <input type="text" value={form.current_phase} onChange={(e) => set('current_phase', e.target.value)} className="cc-input" />
            </label>
          </div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-cream/50 font-medium block mb-1.5">Progress ({form.progress_percent}%)</span>
            <input type="range" min="0" max="100" step="5" value={form.progress_percent}
              onChange={(e) => set('progress_percent', e.target.value)} className="w-full accent-[#d6b36a]" />
          </label>
        </div>

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
