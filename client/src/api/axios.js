import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Simple retry wrapper (idempotent GET retry only)
api.retryCount = 2

// Request interceptor - minimal logging in development
api.interceptors.request.use(config => {
  if (import.meta.env.DEV) {
    // avoid leaking sensitive headers
    const { url, params } = config
    console.debug('[api] request', url, params)
  }
  return config
})

// Response interceptor - normalize errors
api.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config || {}
    const method = (config.method || '').toLowerCase()

    // Retry idempotent GET requests a couple times
    if (method === 'get' && config && !config.__isRetry && api.retryCount > 0) {
      config.__isRetry = true
      for (let i = 0; i < api.retryCount; i++) {
        try {
          const res = await api.request(config)
          return res
        } catch (e) {
          // continue retrying
        }
      }
    }

    // Normalize error shape
    const normalized = {
      message: error.message || 'API request failed',
      status: error.response?.status,
      data: error.response?.data
    }

    if (import.meta.env.DEV) console.error('[api] error', normalized)

    return Promise.reject(normalized)
  }
)
