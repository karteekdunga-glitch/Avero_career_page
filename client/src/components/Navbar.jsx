import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/" className="font-bold text-lg text-[var(--brand)]">
        Avero Advisors Careers
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/jobs" className="hover:underline">Jobs</Link>
        {user ? (
          <>
            <Link to="/approval" className="hover:underline">Admin</Link>
            <button
              className="w-9 h-9 rounded-full bg-[var(--brand)] text-white flex items-center justify-center font-semibold"
              title={user.email}
            >
              {user.email.charAt(0).toUpperCase()}
            </button>
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn">Login</Link>
        )}
      </div>
    </nav>
  )
}
