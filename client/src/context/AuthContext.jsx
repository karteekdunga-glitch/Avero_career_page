import { createContext, useContext, useState, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { api } from '../api/axios'

function decodeJWT(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))

    // Add role for Avero admins
    if (decoded?.email?.toLowerCase().endsWith('@averoadvisors.com')) {
      decoded.role = 'admin'
    } else {
      decoded.role = 'user'
    }

    return decoded
  } catch {
    return null
  }
}

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = decodeJWT(token)

  const handleAuthSuccess = useCallback((tok) => {
    setToken(tok)
    localStorage.setItem('token', tok)
    setError(null)
  }, [])

  // Email/password login (kept as-is)
  async function login(email, password) {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      handleAuthSuccess(data.token)
      window.location.href = '/approval'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Google login → sends access_token to backend, backend returns JWT
  const loginWithGoogle = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (response) => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.post('/auth/google', {
          access_token: response.access_token,
        })

        const decoded = decodeJWT(data.token)
        if (!decoded?.email?.toLowerCase().endsWith('@averoadvisors.com')) {
          setError("This is for admin department, personal mails can't be taken.")
          return
        }

        handleAuthSuccess(data.token)
        window.location.href = '/approval'
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to login with Google')
        throw err
      } finally {
        setLoading(false)
      }
    },
    onError: (e) => {
      console.error('Google Login Error:', e)
      setError('Google login failed')
    },
  })

  function logout() {
    setToken('')
    localStorage.removeItem('token')
    setError(null)
    window.location.href = '/' // ✅ Always back to career homepage
  }

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      loginWithGoogle,
      logout,
      loading,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
