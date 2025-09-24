import { useJobs } from '../context/JobsContext'

import { useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import debounce from 'lodash/debounce'

export default function JobFilters() {
  const { query, searchJobs, filterByLocation, filterByType, clearFilters } = useJobs()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({
    q: query.q || '',
    location: query.location || '',
    type: query.type || ''
  })

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search) => {
      if (search) {
        const searchParams = new URLSearchParams(location.search)
        searchParams.set('q', search)
        searchParams.set('page', '1')
        navigate({ search: searchParams.toString() })
        searchJobs(search)
      }
    }, 300),
    [searchJobs, navigate, location.search]
  )

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))

    const searchParams = new URLSearchParams(location.search)
    if (value) {
      searchParams.set(name, value)
    } else {
      searchParams.delete(name)
    }
    searchParams.set('page', '1')
    navigate({ search: searchParams.toString() })

    if (name === 'q') {
      debouncedSearch(value)
    } else if (name === 'location') {
      filterByLocation(value)
    } else if (name === 'type') {
      filterByType(value)
    }
  }, [debouncedSearch, filterByLocation, filterByType, navigate, location.search])

  const handleClear = useCallback(() => {
    setValues({ q: '', location: '', type: '' })
    navigate({ search: '' })
    clearFilters()
  }, [clearFilters, navigate])

  return (
    <form onSubmit={e => e.preventDefault()} className="grid md:grid-cols-4 gap-3">
      <input
        name="q"
        type="search"
        placeholder="Search roles…"
        value={values.q}
        onChange={handleInputChange}
        className="border rounded-xl px-3 py-2 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-colors"
        aria-label="Search by keyword"
      />
      <input
        name="location"
        placeholder="Location (e.g., Knoxville, TN)"
        value={values.location}
        onChange={handleInputChange}
        className="border rounded-xl px-3 py-2 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-colors"
        aria-label="Filter by location"
      />
      <select
        name="type"
        value={values.type}
        onChange={handleInputChange}
        className="border rounded-xl px-3 py-2 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] transition-colors"
        aria-label="Filter by role type"
      >
        <option value="">All Types</option>
        <option value="full-time">Full Time</option>
        <option value="part-time">Part Time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>
      <button
        type="button"
        onClick={handleClear}
        className="btn btn-accent"
      >
        Clear Filters
      </button>
    </form>
  )
}
