import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_BRAIN_URL
const anonKey = import.meta.env.VITE_BRAIN_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    'Brain env vars missing. Add VITE_BRAIN_URL + VITE_BRAIN_ANON_KEY to .env.local (Netlify) — roadmap page will not load without them.'
  )
}

export const brain = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
