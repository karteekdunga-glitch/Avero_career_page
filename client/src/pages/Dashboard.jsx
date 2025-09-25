import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/axios'

export default function Dashboard() {
  const { token } = useAuth()
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!token) return
    // Example admin interaction could go here
    setMsg('Logged in. Use API clients like Postman to call /api/admin/jobs with Authorization: Bearer <token>.')
  }, [token])

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {!token ? <div>Please log in to manage jobs.</div> : <div className="card">{msg}</div>}
    </div>
  )
}
