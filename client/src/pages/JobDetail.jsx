import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/axios'
import MultiStepForm from '../components/MultiStepForm'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({data}) => { setJob(data); setLoading(false) }).catch(()=>setLoading(false))
  }, [id])

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-10">Loading…</div>
  if (!job) return <div className="mx-auto max-w-4xl px-4 py-10">Job not found.</div>

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div className="card">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <div className="text-gray-600 mt-1">{job.location} • {job.type} {job.salaryRange ? '• ' + job.salaryRange : ''}</div>
        <p className="mt-4">{job.description || job.summary}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Requirements</h3>
          <ul className="list-disc pl-5">
            {(job.requirements || []).map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
        <div className="mt-6">
          <blockquote className="italic text-gray-700">
            “Our mission is to help public organizations deliver better outcomes with technology.”
          </blockquote>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Apply for this role</h2>
        <MultiStepForm job={job} />
      </div>
    </div>
  )
}
