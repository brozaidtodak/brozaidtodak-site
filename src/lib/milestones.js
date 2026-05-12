import { supabase } from './supabase.js'

export async function fetchMilestonesByProject(projectId) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchAllMilestones() {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data
}

export async function createMilestone(projectId, name, displayOrder) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('milestones')
    .insert({
      project_id: projectId,
      user_id: user.id,
      name,
      display_order: displayOrder ?? 999,
      status: 'pending',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleMilestone(milestone) {
  const nextStatus = milestone.status === 'done' ? 'pending' : 'done'
  const patch = {
    status: nextStatus,
    completed_at: nextStatus === 'done' ? new Date().toISOString() : null,
  }
  const { data, error } = await supabase
    .from('milestones')
    .update(patch)
    .eq('id', milestone.id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteMilestone(id) {
  const { error } = await supabase.from('milestones').delete().eq('id', id)
  if (error) throw error
}
