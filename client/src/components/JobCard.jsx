import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  return (
    <div className="card h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <div className="text-sm text-gray-600">{job.location} • {job.type}</div>
        {job.salaryRange && <div className="text-sm mt-1">{job.salaryRange}</div>}
      </div>
      <p className="text-sm text-gray-700 flex-1">{job.summary}</p>
      <div className="mt-4">
        <Link className="btn btn-primary no-underline" to={`/jobs/${job._id}`}>Apply Now</Link>
      </div>
    </div>
  )
}
