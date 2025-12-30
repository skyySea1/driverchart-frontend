import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptors for error handling or auth tokens later
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message
    let message = error.response?.data?.message || error.message || 'API Error'

    // Format Zod validation errors
    if (typeof message === 'string' && message.includes('body/')) {
      message = message
        .replace(/body\//g, '')
        .replace(/\//g, ' ')
        .replace(/Invalid ISO date/g, 'is invalid')
        .replace(/Required/g, 'is required')
        .split(',')
        .map((s) => s.trim())
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('. ')
    }

    console.error('API Request Failed:', message)
    return Promise.reject(new Error(message))
  }
)

export { apiClient }
