import React, { useContext, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { JobsProvider } from './context/JobsContext'
import ErrorBoundary from './components/ErrorBoundary'
import { Spinner } from './components/Spinner'
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import ApplySuccess from './pages/ApplySuccess'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import Approval from './pages/Approval'   // Approval page

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function AdminRoute({ children }) {
  const { isAdmin } = useContext(AuthContext)
  return isAdmin ? children : <Navigate to="/login" replace />
}

function AveroOnlyRoute({ children }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  if (!user.email?.endsWith('@averoadvisors.com')) {
    return <Navigate to="/jobs" replace />
  }
  return children
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <JobsProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/apply/success" element={<ApplySuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Admin Dashboard */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />

                    {/* Approval Workflow (only Avero admins can access) */}
                    <Route
                      path="/approval"
                      element={
                        <AveroOnlyRoute>
                          <Approval />
                        </AveroOnlyRoute>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </JobsProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  )
}

export default App
