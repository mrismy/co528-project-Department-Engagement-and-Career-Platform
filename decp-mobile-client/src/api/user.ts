import { api } from './client'
import type { ProfileResponse } from '../types'

export async function getMyProfile() {
  const { data } = await api.get<ProfileResponse>('/api/users/me')
  return data
}

export async function updateProfile(payload: Partial<ProfileResponse>) {
  const { data } = await api.put<ProfileResponse>('/api/users/profile', payload)
  return data
}
