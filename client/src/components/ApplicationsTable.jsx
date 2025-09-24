import React from 'react'

export default function ApplicationsTable({ applications, onSelect }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No applications yet
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {app.firstName} {app.lastName}
                </td>
                <td className="border px-4 py-2">{app.email}</td>
                <td className="border px-4 py-2">{app.jobTitle}</td>
                <td className="border px-4 py-2">{app.status || 'Pending'}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => onSelect(app)}
                    className="px-3 py-1 bg-[var(--brand)] text-white rounded hover:bg-[var(--accent)]"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
