import { supabase } from './supabase.js'

export async function fetchTransactionsByProject(projectId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('project_id', projectId)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createTransaction(input) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTransaction(id, patch) {
  const { data, error } = await supabase
    .from('transactions')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

// Common currencies (manual FX rate input — no auto-fetch for now)
export const CURRENCIES = ['MYR', 'USD', 'SGD', 'EUR', 'GBP', 'AUD', 'IDR', 'THB']

export const SOURCE_TYPES = [
  { value: 'investor', label: 'Investor' },
  { value: 'self', label: 'Self injection' },
  { value: 'loan', label: 'Loan' },
  { value: 'grant', label: 'Grant' },
]

// Suggested subcategories per (project_slug, category)
// Falls back to generic if no project-specific suggestions
export function suggestSubcategories(projectSlug, category) {
  const KAMBING = {
    expense: ['Sewa tanah', 'Baka kambing', 'Makanan', 'Vet & vaksin', 'Buruh', 'Equipment', 'Transport', 'Insurance'],
    revenue: ['Jualan kambing hidup', 'Jualan kambing korban', 'Susu', 'Baja organik'],
  }
  const RETAIL = {
    expense: ['Inventory / stok', 'EasyStore subscription', 'Shopify fees', 'Shipping', 'Packaging', 'Marketing', 'Photography'],
    revenue: ['Online sale', 'In-store sale', 'Wholesale'],
  }
  const SOFTWARE = {
    expense: ['Hosting (Supabase)', 'Hosting (Netlify)', 'Domain renewal', 'Subscriptions', 'Tools'],
    revenue: ['Affiliate', 'Sponsorship', 'Service fee'],
  }
  const REPAIR = {
    expense: ['Parts', 'Tools', 'Workshop rental', 'Training'],
    revenue: ['Repair fee', 'Parts markup'],
  }
  const CAPITAL = ['Investor pump', 'Self injection', 'Loan tranche', 'Grant disbursement']

  if (category === 'capital') return CAPITAL

  const map = {
    'kambing-pak-teh': KAMBING,
    '10-camp-retail': RETAIL,
    '10-camp-pos': SOFTWARE,
    'brozaidtodak-com': SOFTWARE,
    'keluarga-kita': SOFTWARE,
    'repair-phone-todak-studios': REPAIR,
  }
  return map[projectSlug]?.[category] || []
}

export function summarize(transactions) {
  let capitalIn = 0, totalSpent = 0, revenue = 0
  for (const t of transactions) {
    const amt = Number(t.amount_myr || 0)
    if (t.category === 'capital') capitalIn += amt
    else if (t.category === 'expense') totalSpent += amt
    else if (t.category === 'revenue') revenue += amt
  }
  return {
    capitalIn,
    totalSpent,
    revenue,
    balance: capitalIn + revenue - totalSpent,
  }
}

export function formatRM(n) {
  if (n === null || n === undefined) return '—'
  return 'RM ' + Number(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
