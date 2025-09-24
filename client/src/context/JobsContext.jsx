import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '../api/axios'

const JobsContext = createContext(null)

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState({ q: '', location: '', type: '', page: 1, limit: 9 })

  const loadJobs = useCallback(async (opts = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = { ...query, ...opts }
      const response = await api.get('/jobs', { params })
      const { data } = response
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server')
      }

      const items = data.items || []
      if (!Array.isArray(items)) {
        throw new Error('Invalid jobs data format')
      }

      setJobs(items)
      setTotal(data.total || 0)
      setQuery(prev => ({ ...prev, ...opts }))
    } catch (err) {
      console.error('Failed to load jobs:', err)
      setError(err.response?.data?.error || err.message || 'Failed to load jobs')
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])
  // Exposed methods for job filtering and pagination
  const searchJobs = useCallback((search) => {
    loadJobs({ q: search, page: 1 })
  }, [loadJobs])

  const filterByLocation = useCallback((location) => {
    loadJobs({ location, page: 1 })
  }, [loadJobs])

  const filterByType = useCallback((type) => {
    loadJobs({ type, page: 1 })
  }, [loadJobs])

  const changePage = useCallback((page) => {
    loadJobs({ page })
  }, [loadJobs])

  const clearFilters = useCallback(() => {
    loadJobs({ q: '', location: '', type: '', page: 1 })
  }, [loadJobs])

  // Initial load
  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    // State
    jobs,
    total,
    loading,
    error,
    query,
    // Actions
    searchJobs,
    filterByLocation,
    filterByType,
    changePage,
    clearFilters,
    // Raw actions (for advanced use)
    loadJobs,
    setQuery
  }), [
    jobs,
    total,
    loading,
    error,
    query,
    searchJobs,
    filterByLocation,
    filterByType,
    changePage,
    clearFilters,
    loadJobs,
  ])

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobs = () => {
  const context = useContext(JobsContext)
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider')
  }
  return context
}
