import { supabase } from './supabase.js'

export async function fetchPortfolio() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createPortfolioItem(input) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePortfolioItem(id, patch) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePortfolioItem(id) {
  const { error } = await supabase.from('portfolio_items').delete().eq('id', id)
  if (error) throw error
}

export const CATEGORY_OPTIONS = [
  { value: 'business', label: 'Business' },
  { value: 'system', label: 'System' },
  { value: 'website', label: 'Website' },
  { value: 'past', label: 'Past venture' },
]

export const PORTFOLIO_STATUS_OPTIONS = [
  { value: 'live', label: 'Live' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'past', label: 'Past' },
]

export function categoryLabel(category) {
  return CATEGORY_OPTIONS.find((o) => o.value === category)?.label || category
}

export function portfolioStatusColor(status) {
  switch (status) {
    case 'live':    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'shipped': return 'bg-gold/15 text-gold border-gold/30'
    case 'past':    return 'bg-white/5 text-cream/40 border-white/10'
    default:        return 'bg-white/5 text-cream/60 border-white/15'
  }
}

export function portfolioStatusLabel(status) {
  return PORTFOLIO_STATUS_OPTIONS.find((o) => o.value === status)?.label || status
}
