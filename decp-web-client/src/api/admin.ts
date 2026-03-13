import { api } from './client'
import type { AnalyticsOverviewResponse } from '../types'

export interface TopPostEntry {
  postId: number
  authorName: string
  content: string
  likeCount: number
  createdAt: string
}

export async function getAnalyticsOverview() {
  const { data } = await api.get<AnalyticsOverviewResponse>('/api/admin/analytics/overview')
  return data
}

export async function getTopPosts(limit = 5) {
  const { data } = await api.get<TopPostEntry[]>(`/api/admin/analytics/top-posts?limit=${limit}`)
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
