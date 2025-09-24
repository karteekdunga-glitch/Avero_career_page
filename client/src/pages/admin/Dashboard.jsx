import React, { useEffect, useState } from 'react'
import ApplicationsTable from '../../components/ApplicationsTable'
import StatusUpdateForm from '../../components/StatusUpdateForm'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, isAdmin, token } = useAuth()
  const [applications, setApplications] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    setLoading(true)
    fetch('/api/admin/applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setApplications(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch applications:', err)
        setLoading(false)
      })
  }, [isAdmin, token])

  if (!isAdmin) return <Navigate to="/login" replace />

  const handleSyncSheets = async () => {
    setSyncing(true)
    try {
      await fetch('/api/admin/sync-sheets', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('✅ Synced to Google Sheets!')
    } catch (err) {
      console.error('Sync failed:', err)
      alert('❌ Failed to sync')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleSyncSheets}
        disabled={syncing}
      >
        {syncing ? 'Syncing…' : 'Sync to Google Sheets'}
      </button>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--brand)]"></span>
        </div>
      ) : (
        <ApplicationsTable applications={applications} onSelect={setSelectedApp} />
      )}
      {selectedApp && (
        <StatusUpdateForm application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  )
}

export default Dashboard
