import { brain } from './brain.js'

export async function loadRoadmap() {
  const [phasesRes, itemsRes] = await Promise.all([
    brain
      .from('roadmap_phase')
      .select('id, project, code, title, description, status, meta, display_order, updated_at')
      .order('project', { ascending: true })
      .order('display_order', { ascending: true }),
    brain
      .from('roadmap_item')
      .select('id, phase_id, external_id, name, note, status, display_order')
      .order('display_order', { ascending: true }),
  ])
  if (phasesRes.error) throw phasesRes.error
  if (itemsRes.error) throw itemsRes.error
  const itemsByPhase = new Map()
  for (const it of itemsRes.data ?? []) {
    if (!itemsByPhase.has(it.phase_id)) itemsByPhase.set(it.phase_id, [])
    itemsByPhase.get(it.phase_id).push(it)
  }
  return (phasesRes.data ?? []).map((p) => ({ ...p, items: itemsByPhase.get(p.id) ?? [] }))
}

export const PROJECT_META = {
  pos: { label: '10 CAMP POS', subtitle: 'Staff-facing POS · pos.10camp.com', accent: '#d6b36a' },
  '10cc': { label: '10cc Command Centre', subtitle: 'Owner back-office · 10cc.10camp.com', accent: '#7fb88a' },
  kk: { label: 'Keluarga Kita', subtitle: 'Family tree app', accent: '#e08a5b' },
  broz: { label: 'brozaidtodak.com', subtitle: 'This Command Centre', accent: '#9fb5d8' },
}

export const STATUS_META = {
  done: { label: 'done', cls: 'text-cream/85 bg-cream/10 border-cream/20' },
  doing: { label: 'doing', cls: 'text-gold bg-gold/10 border-gold/40' },
  next: { label: 'next', cls: 'text-cream/80 bg-cream/5 border-cream/15' },
  plan: { label: 'plan', cls: 'text-cream/55 bg-white/[0.03] border-white/10' },
  later: { label: 'later', cls: 'text-cream/40 bg-white/[0.02] border-white/10' },
}

export function summariseProject(phases) {
  const totals = { phases: phases.length, items: 0, done: 0, doing: 0 }
  for (const p of phases) {
    totals.items += p.items.length
    for (const it of p.items) {
      if (it.status === 'done') totals.done++
      else if (it.status === 'doing') totals.doing++
    }
  }
  totals.percent = totals.items ? Math.round((totals.done / totals.items) * 100) : 0
  return totals
}
