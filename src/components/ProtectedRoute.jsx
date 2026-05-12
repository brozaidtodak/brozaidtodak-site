import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking') // checking | authed | unauthed

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setStatus(data.session ? 'authed' : 'unauthed')
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setStatus(session ? 'authed' : 'unauthed')
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1812]">
        <p className="text-cream/50 text-sm font-mono">checking session…</p>
      </div>
    )
  }

  if (status === 'unauthed') return <Navigate to="/login" replace />

  return children
}
