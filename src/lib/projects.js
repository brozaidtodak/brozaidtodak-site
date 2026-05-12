import { supabase } from './supabase.js'

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createProject(input) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProject(id, patch) {
  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'paused', label: 'Paused' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'archived', label: 'Archived' },
]

export function statusColor(status) {
  switch (status) {
    case 'in_progress': return 'bg-gold/15 text-gold border-gold/30'
    case 'shipped':     return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'paused':      return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    case 'archived':    return 'bg-white/5 text-cream/40 border-white/10'
    default:            return 'bg-white/5 text-cream/60 border-white/15'
  }
}

export function statusLabel(status) {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label || status
}
