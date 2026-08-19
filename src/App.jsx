import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import SecretPanel from './components/SecretPanel.jsx'

// ============================================================
// p3 — PEMISAHAN KOD IKUT ROUTE.
//
// Dulu semua halaman masuk satu bundle. Orang yang buka laman utama
// sahaja tetap muat turun halaman servis, pokok kerjaya, demo 3D dan
// seluruh Command Centre termasuk klien Supabase. Semua itu kod yang
// dia takkan sentuh.
//
// Landing SENGAJA kekal eager (bukan lazy). Ia route paling kerap dibuka
// dan ia pegang splash; kalau ia lazy, pelayar kena tunggu satu lagi
// pusingan rangkaian sebelum apa-apa boleh muncul. Yang lain semua lazy.
//
// Supabase hanya diimport oleh /login dan pokok /dashboard, jadi bila
// dua-dua itu lazy, klien Supabase pun keluar dari muatan awal dengan
// sendirinya.
// ============================================================
const Servis = lazy(() => import('./pages/Servis.jsx'))
const ServisPakej = lazy(() => import('./pages/ServisPakej.jsx'))
const Journey = lazy(() => import('./pages/Journey.jsx'))
const SiteRoadmap = lazy(() => import('./pages/SiteRoadmap.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.jsx'))
const DashboardLayout = lazy(() => import('./components/DashboardLayout.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Financial = lazy(() => import('./pages/Financial.jsx'))
const Roadmap = lazy(() => import('./pages/Roadmap.jsx'))
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'))

// Latar void penuh, sama warna dengan setiap halaman laman ni, supaya
// peralihan tak pernah berkelip putih. Teks mono kecil muncul lambat
// (0.4s) — sambungan biasa takkan nampak dia langsung, sambungan teruk
// dapat tanda bahawa sesuatu memang sedang berjalan.
function RouteFallback() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center" role="status" aria-live="polite">
      <span className="route-fallback__label font-mono text-[11px] tracking-[0.4em] text-white/35 uppercase">
        Memuat
      </span>
    </div>
  )
}

export default function App() {
  return (
    <>
      <SecretPanel />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/servis" element={<Servis />} />
          <Route path="/servis/:slug" element={<ServisPakej />} />
          <Route path="/roadmap" element={<SiteRoadmap />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="financial" element={<Financial />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
