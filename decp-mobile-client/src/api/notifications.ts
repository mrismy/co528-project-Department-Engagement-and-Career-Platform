import { api } from './client'
import type { NotificationResponse } from '../types'

export async function getNotifications() {
  const { data } = await api.get<NotificationResponse[]>('/api/notifications')
  return data
}

export async function markNotificationRead(notificationId: number) {
  const { data } = await api.put<NotificationResponse>(`/api/notifications/${notificationId}/read`)
  return data
}
