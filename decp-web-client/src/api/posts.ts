import { api, API_BASE_URL } from './client'
import type { MediaType, PostResponse, CommentResponse } from '../types'

export async function getPosts() {
  const { data } = await api.get<PostResponse[]>('/api/posts')
  return data
}

export async function createPost(payload: { content?: string; mediaUrl?: string; mediaType?: MediaType; sharedPostId?: number }) {
  const { data } = await api.post<PostResponse>('/api/posts', payload)
  return data
}

export async function togglePostLike(postId: number) {
  const { data } = await api.post<PostResponse>(`/api/posts/${postId}/like`)
  return data
}

export async function addComment(postId: number, content: string) {
  const { data } = await api.post<CommentResponse>(`/api/posts/${postId}/comments`, { content })
  return data
}

export async function deletePost(postId: number) {
  await api.delete(`/api/posts/${postId}`)
}

export async function uploadMedia(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<{ url: string }>('/api/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  // Prefix with backend base URL so client can display the image
  return data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`
}
