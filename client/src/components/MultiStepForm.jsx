import { useState } from 'react'
import { api } from '../api/axios'

export default function MultiStepForm({ job }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // keep step 1 values in state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)

    // append step 1 values explicitly
    fd.append('firstName', formData.firstName)
    fd.append('lastName', formData.lastName)
    fd.append('email', formData.email)
    fd.append('phone', formData.phone)

    // add job details
    fd.append('jobId', job._id)
    fd.append('jobTitle', job.title)

    try {
      await api.post('/applications', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      window.location.href = '/apply/success'
    } catch (err) {
      setError(err?.response?.data?.error || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              name="firstName"
              required
              className="border rounded-xl px-3 py-2 w-full"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              name="lastName"
              required
              className="border rounded-xl px-3 py-2 w-full"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              className="border rounded-xl px-3 py-2 w-full"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Phone</label>
            <input
              name="phone"
              className="border rounded-xl px-3 py-2 w-full"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Experience (summary)</label>
            <textarea
              name="experience"
              rows="4"
              className="border rounded-xl px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Resume (PDF, max 5MB)</label>
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              required
              className="block"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cover Letter</label>
            <textarea
              name="coverLetter"
              rows="6"
              className="border rounded-xl px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="btn">
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
            >
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
