import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('decp_auth')
  if (raw) {
    try {
      const auth = JSON.parse(raw) as { token?: string }
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
      }
    } catch {
      // ignore bad storage data
    }
  }
  return config
})
