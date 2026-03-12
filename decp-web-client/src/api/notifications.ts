import { api } from './client'
import type { NotificationResponse } from '../types'

export async function getNotifications() {
  const { data } = await api.get<NotificationResponse[]>('/api/notifications')
  return data
}

export async function markNotificationRead(id: number) {
  const { data } = await api.put<NotificationResponse>(`/api/notifications/${id}/read`)
  return data
}
