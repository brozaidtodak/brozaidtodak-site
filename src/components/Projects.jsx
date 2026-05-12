import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchProjects, createProject, updateProject, deleteProject,
  STATUS_OPTIONS, statusColor, statusLabel,
} from '../lib/projects.js'
import {
  fetchAllMilestones, createMilestone, toggleMilestone, deleteMilestone,
} from '../lib/milestones.js'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | project object

  async function load() {
    setLoading(true); setError('')
    try {
      const [p, m] = await Promise.all([fetchProjects(), fetchAllMilestones()])
      setProjects(p); setMilestones(m)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSaveProject(input) {
    try {
      if (editing === 'new') await createProject(input)
      else await updateProject(editing.id, input)
      setEditing(null)
      await load()
    } catch (e) { alert('Save failed: ' + e.message) }
  }

  async function handleDeleteProject(p) {
    if (!confirm(`Delete "${p.name}"? Tak boleh undo.`)) return
    try { await deleteProject(p.id); await load() }
    catch (e) { alert('Delete failed: ' + e.message) }
  }

  async function handleToggleMilestone(m) {
    try {
      const updated = await toggleMilestone(m)
      setMilestones((prev) => prev.map((x) => x.id === m.id ? updated : x))
    } catch (e) { alert('Toggle failed: ' + e.message) }
  }

  async function handleAddMilestone(projectId, name) {
    const projectMs = milestones.filter((m) => m.project_id === projectId)
    const nextOrder = (projectMs.at(-1)?.display_order ?? 0) + 1
    try {
      const created = await createMilestone(projectId, name, nextOrder)
      setMilestones((prev) => [...prev, created])
    } catch (e) { alert('Add failed: ' + e.message) }
  }

  async function handleDeleteMilestone(id) {
    try {
      await deleteMilestone(id)
      setMilestones((prev) => prev.filter((m) => m.id !== id))
    } catch (e) { alert('Delete failed: ' + e.message) }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-1.5">Projects</p>
          <h2 className="font-display text-2xl text-cream">Tools yang kau tengah bina</h2>
        </div>
        <button
          onClick={() => setEditing('new')}
          className="inline-flex items-center gap-1.5 bg-gold text-forest-deep font-semibold px-4 py-2 rounded-full text-sm hover:bg-gold-dark transition"
        >
          <span>+</span><span>Add project</span>
        </button>
      </div>

      {loading && <p className="text-cream/50 text-sm">Loading…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="text-cream/50 text-sm">No projects yet. Click "Add project" to start.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            milestones={milestones.filter((m) => m.project_id === p.id)}
            onEdit={() => setEditing(p)}
            onDelete={() => handleDeleteProject(p)}
            onToggleMilestone={handleToggleMilestone}
            onAddMilestone={(name) => handleAddMilestone(p.id, name)}
            onDeleteMilestone={handleDeleteMilestone}
          />
        ))}
      </div>

      {editing && (
        <ProjectFormModal
          initial={editing === 'new' ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={handleSaveProject}
        />
      )}
    </section>
  )
}

function ProjectCard({
  project: p, milestones,
  onEdit, onDelete,
  onToggleMilestone, onAddMilestone, onDeleteMilestone,
}) {
  const navigate = useNavigate()
  const doneCount = milestones.filter((m) => m.status === 'done').length

  function stop(fn) {
    return (e) => { e.stopPropagation(); fn(e) }
  }

  return (
    <article
      onClick={() => p.slug && navigate(`/dashboard/projects/${p.slug}`)}
      className="group bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 hover:border-gold/40 transition cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg text-cream group-hover:text-gold leading-tight flex-1 transition">{p.name}</h3>
        <div className="flex items-center gap-1 -mr-1">
          <IconButton onClick={stop(onEdit)} label="Edit project">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </IconButton>
          <IconButton onClick={stop(onDelete)} label="Delete project" danger>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${statusColor(p.status)}`}>
          {statusLabel(p.status)}
        </span>
        {p.current_phase && (
          <span className="font-mono text-[11px] text-cream/50">{p.current_phase}</span>
        )}
      </div>

      {p.description && (
        <p className="text-sm text-cream/65 leading-relaxed line-clamp-3">{p.description}</p>
      )}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wider text-cream/40 font-medium">Progress</span>
          <span className="font-mono text-xs text-cream/70">{p.progress_percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all"
            style={{ width: `${p.progress_percent}%` }}
          />
        </div>
      </div>

      <MilestoneList
        milestones={milestones}
        doneCount={doneCount}
        onToggle={onToggleMilestone}
        onAdd={onAddMilestone}
        onDelete={onDeleteMilestone}
      />
    </article>
  )
}

function MilestoneList({ milestones, doneCount, onToggle, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!newName.trim()) return
    await onAdd(newName.trim())
    setNewName('')
    setAdding(false)
  }

  return (
    <div className="pt-3 border-t border-white/8" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-cream/40 font-medium">
          Milestones
        </span>
        <span className="font-mono text-[11px] text-cream/45">
          {doneCount} / {milestones.length}
        </span>
      </div>

      <ul className="space-y-1.5">
        {milestones.map((m) => (
          <MilestoneRow
            key={m.id}
            milestone={m}
            onToggle={() => onToggle(m)}
            onDelete={() => onDelete(m.id)}
          />
        ))}
      </ul>

      {adding ? (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Milestone name"
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-md px-2.5 py-1 text-xs text-cream focus:outline-none focus:border-gold"
          />
          <button type="submit" className="text-xs text-gold font-medium px-2">Save</button>
          <button
            type="button"
            onClick={() => { setAdding(false); setNewName('') }}
            className="text-xs text-cream/40 hover:text-cream/70 px-1"
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-2 text-[11px] text-cream/45 hover:text-cream/80 font-medium transition"
        >
          + Add milestone
        </button>
      )}
    </div>
  )
}

function MilestoneRow({ milestone: m, onToggle, onDelete }) {
  const done = m.status === 'done'
  const inProgress = m.status === 'in_progress'

  return (
    <li className="flex items-center gap-2 group">
      <button
        onClick={onToggle}
        aria-label={done ? 'Mark pending' : 'Mark done'}
        className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition"
        style={{
          borderColor: done ? '#d6b36a' : inProgress ? '#d6b36a' : 'rgba(245,241,232,0.25)',
          background: done ? '#d6b36a' : inProgress ? 'rgba(214,179,106,0.4)' : 'transparent',
        }}
      >
        {done && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0c1812" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <span className={`text-[13px] flex-1 leading-snug ${done ? 'text-cream/40 line-through' : 'text-cream/80'}`}>
        {m.name}
      </span>
      {m.due_date && !done && (
        <span className="font-mono text-[10px] text-cream/40">{m.due_date}</span>
      )}
      <button
        onClick={onDelete}
        aria-label="Delete milestone"
        className="opacity-0 group-hover:opacity-100 text-cream/30 hover:text-red-400 text-xs transition"
      >
        ✕
      </button>
    </li>
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

function ProjectFormModal({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    status: initial?.status || 'planning',
    current_phase: initial?.current_phase || '',
    progress_percent: initial?.progress_percent ?? 0,
    next_milestone: initial?.next_milestone || '',
    next_milestone_due: initial?.next_milestone_due || '',
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
      progress_percent: Number(form.progress_percent),
      next_milestone_due: form.next_milestone_due || null,
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
          {initial ? 'Edit project' : 'Add project'}
        </h3>

        <div className="space-y-4">
          <Field label="Name" required>
            <input type="text" required value={form.name}
              onChange={(e) => set('name', e.target.value)} className="form-input" />
          </Field>
          <Field label="Description">
            <textarea rows="2" value={form.description}
              onChange={(e) => set('description', e.target.value)} className="form-input resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select value={form.status}
                onChange={(e) => set('status', e.target.value)} className="form-input">
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Current phase">
              <input type="text" value={form.current_phase}
                onChange={(e) => set('current_phase', e.target.value)}
                placeholder="e.g. Phase 2" className="form-input" />
            </Field>
          </div>
          <Field label={`Progress (${form.progress_percent}%)`}>
            <input type="range" min="0" max="100" step="5" value={form.progress_percent}
              onChange={(e) => set('progress_percent', e.target.value)}
              className="w-full accent-[#d6b36a]" />
          </Field>
          <Field label="Next milestone (one-liner)">
            <input type="text" value={form.next_milestone}
              onChange={(e) => set('next_milestone', e.target.value)} className="form-input" />
          </Field>
          <Field label="Milestone due (optional)">
            <input type="date" value={form.next_milestone_due}
              onChange={(e) => set('next_milestone_due', e.target.value)} className="form-input" />
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
