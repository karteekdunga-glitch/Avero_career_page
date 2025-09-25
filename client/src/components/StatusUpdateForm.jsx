import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function StatusUpdateForm({ application, onClose }) {
  const { token } = useAuth()
  const [status, setStatus] = useState(application.status || 'Pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/applications/${application.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update status')

      alert('✅ Status updated successfully!')
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Status</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-300 rounded">
            {error}
          </div>
        )}

        <p className="mb-3">
          <span className="font-semibold">{application.firstName} {application.lastName}</span><br />
          <span className="text-gray-600">{application.jobTitle}</span>
        </p>

        <label className="block text-sm font-medium mb-2">Select Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="Pending">Pending</option>
          <option value="Interview">Interview</option>
          <option value="HR">HR</option>
          <option value="Approve">Approve</option>
        </select>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-[var(--brand)] text-white rounded hover:bg-[var(--accent)] disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  )
}
