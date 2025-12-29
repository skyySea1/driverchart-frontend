import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // TODO: Load from env var in production
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptors for error handling or auth tokens later
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message
    const message = error.response?.data?.message || error.message || 'API Error'
    console.error('API Request Failed:', message)
    return Promise.reject(new Error(message))
  }
)

export { apiClient }
