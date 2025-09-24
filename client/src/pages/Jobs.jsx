import JobFilters from '../components/JobFilters'
import { useJobs } from '../context/JobsContext'
import JobCard from '../components/JobCard'
import Pagination from '../components/Pagination'

export default function Jobs() {
  const { jobs, total, query, loadJobs, loading } = useJobs()
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <div className="mb-6"><JobFilters /></div>
      {loading ? <div>Loading…</div> : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.map(j => <JobCard key={j._id} job={j} />)}
          </div>
          <div className="mt-6">
            <Pagination page={query.page} limit={query.limit} total={total} onPage={(p)=>loadJobs({ page: p })} />
          </div>
        </>
      )}
    </div>
  )
}
