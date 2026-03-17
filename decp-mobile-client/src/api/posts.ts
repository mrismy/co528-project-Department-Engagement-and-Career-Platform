import { api } from './client'
import type { CommentResponse, MediaType, PostResponse } from '../types'

export async function getPosts() {
  const { data } = await api.get('/api/posts')

  if (Array.isArray(data)) return data as PostResponse[]
  if (Array.isArray((data as any)?.data)) return (data as any).data as PostResponse[]
  if (Array.isArray((data as any)?.content)) return (data as any).content as PostResponse[]

  return []
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
