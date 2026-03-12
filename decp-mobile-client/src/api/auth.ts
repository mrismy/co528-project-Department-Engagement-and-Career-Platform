import { api } from './client'
import type { AuthResponse, Role } from '../types'

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password })
  return data
}

export async function register(fullName: string, email: string, password: string, role: Role) {
  const { data } = await api.post<AuthResponse>('/api/auth/register', { fullName, email, password, role })
  return data
}

export async function me() {
  const { data } = await api.get<AuthResponse>('/api/auth/me')
  return data
}
