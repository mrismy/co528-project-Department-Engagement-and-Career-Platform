import { api } from './client'
import type { AnalyticsOverviewResponse } from '../types'

export async function getAnalyticsOverview() {
  const { data } = await api.get<AnalyticsOverviewResponse>('/api/admin/analytics/overview')
  return data
}

export async function deactivateUser(userId: number) {
  const { data } = await api.put<{ message: string }>(`/api/admin/users/${userId}/deactivate`)
  return data
}

export async function deletePostByAdmin(postId: number) {
  const { data } = await api.delete<{ message: string }>(`/api/admin/posts/${postId}`)
  return data
}
