import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import JobFilters from '../components/JobFilters'
import { useJobs } from '../context/JobsContext'
import JobCard from '../components/JobCard'
import Pagination from '../components/Pagination'
import { Spinner } from '../components/Spinner'

export default function Home() {
  const { jobs, total, query, loading, error, searchJobs, filterByLocation, filterByType, clearFilters } = useJobs()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle browser back/forward and URL state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = parseInt(searchParams.get('page') || '1')
    const q = searchParams.get('q') || ''
    const loc = searchParams.get('location') || ''
    const type = searchParams.get('type') || ''

    // Prevent unnecessary API calls
    const queryChanged = 
      page !== query.page ||
      q !== query.q ||
      loc !== query.location ||
      type !== query.type

    if (queryChanged) {
      if (!q && !loc && !type && page === 1) {
        clearFilters()
      } else {
        if (q) searchJobs(q)
        if (loc) filterByLocation(loc)
        if (type) filterByType(type)
        if (page > 1) {
          const searchParams = new URLSearchParams(location.search)
          searchParams.set('page', page.toString())
          navigate({ search: searchParams.toString() }, { replace: true })
        }
      }
    }
  }, [location.search, query, searchJobs, filterByLocation, filterByType, clearFilters, navigate])

  return (
    <div>
      <section className="bg-[var(--brand)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold">We don't just consult, we advise, we guide, we deliver.</h1>
          <p className="mt-2 text-white/90">Careers at Avero Advisors — public sector focused.</p>
          <div className="mt-6 bg-white p-4 rounded-2xl">
            <JobFilters />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Open Roles</h2>
          <Link to="/jobs" className="text-[var(--brand)] hover:underline">View all</Link>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading available positions...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
              <p>{error}</p>
              <button 
                onClick={() => loadJobs({ page: 1 })} 
                className="mt-2 text-sm bg-red-100 px-4 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center text-gray-600">
            <p>No open positions available at this time.</p>
            <button 
              onClick={() => loadJobs({ page: 1 })} 
              className="mt-4 text-sm text-[var(--brand)] hover:underline"
            >
              Refresh listings
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {jobs.slice(0, 6).map(job => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                />
              ))}
            </div>
            {total > query.limit && (
              <div className="mt-6">
                <Pagination 
                  page={query.page} 
                  limit={query.limit} 
                  total={total} 
                  onPage={page => {
                    const searchParams = new URLSearchParams(location.search)
                    searchParams.set('page', page.toString())
                    navigate({ search: searchParams.toString() }, { replace: true })
                  }}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
