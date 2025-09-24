import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/') // redirect to careers home after logout
  }

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-11 h-11 overflow-hidden rounded">
            <img decoding="async" width="87" height="50" alt="Avero Advisors" src="https://averoadvisors.com/wp-content/uploads/2023/08/avero-logo-colorized.webp" data-orig-src="https://averoadvisors.com/wp-content/uploads/2023/08/avero-logo-colorized.webp" className="img-responsive wp-image-61 ls-is-cached lazyloaded" />
          </div>
          <span className="h-12 font-bold text-lg text-[var(--brand)]">
            Careers
          </span>
        </Link>
        <nav className="flex gap-6 items-center">
          <NavLink to="/jobs" className="text-gray-700 hover:text-gray-900">
            Jobs
          </NavLink>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Admin/Dashboard Links */}
              {user.role === 'admin' ? (
                <NavLink
                  to="/admin"
                  className="text-gray-700 hover:text-[var(--brand)]"
                >
                  Admin
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  className="text-gray-700 hover:text-[var(--brand)]"
                >
                  Dashboard
                </NavLink>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>

              {/* Profile Circle */}
              <div className="w-10 h-10 rounded-full bg-[var(--brand)] flex items-center justify-center text-white font-bold">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-[var(--brand)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--accent)] transition"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
