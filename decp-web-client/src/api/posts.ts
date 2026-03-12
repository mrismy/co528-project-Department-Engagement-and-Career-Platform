import { api } from './client'
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
