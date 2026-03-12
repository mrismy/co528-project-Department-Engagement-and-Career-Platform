import axios from 'axios'
import { getStoredToken } from '../utils/storage'

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8080'

export const api = axios.create({
  baseURL,
  timeout: 15000,
})

api.interceptors.request.use(async config => {
  const token = await getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
