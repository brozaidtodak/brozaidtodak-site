import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Financial from './pages/Financial.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Portfolio from './pages/Portfolio.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
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
  )
}
