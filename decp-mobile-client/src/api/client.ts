import axios, { AxiosError } from 'axios'
import { getStoredToken } from '../utils/storage'

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8080'

export const api = axios.create({
  baseURL,
  timeout: 15000,
})

// Attach JWT token to every request
api.interceptors.request.use(async config => {
  const token = await getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Surface network errors with actionable messages
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (!error.response) {
      // No response — server unreachable
      const networkMsg =
        `Cannot reach the server at ${baseURL}.\n\n` +
        `If you're on a physical device, update EXPO_PUBLIC_API_BASE_URL in .env ` +
        `to your machine's LAN IP (e.g. http://192.168.1.5:8080) then restart Expo.\n\n` +
        `Run "ipconfig" (Windows) or "ifconfig" (Mac/Linux) to find your IP.`
      error.message = networkMsg
    }
    return Promise.reject(error)
  }
)

