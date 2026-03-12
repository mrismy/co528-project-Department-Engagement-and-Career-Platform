import { api } from './client'
import type { ConversationResponse, MessageResponse } from '../types'

export async function getConversations() {
  const { data } = await api.get<ConversationResponse[]>('/api/conversations')
  return data
}

export async function createConversation(payload: { type?: string; title?: string; participantIds: number[] }) {
  const { data } = await api.post<ConversationResponse>('/api/conversations', payload)
  return data
}

export async function getConversationMessages(conversationId: number) {
  const { data } = await api.get<MessageResponse[]>(`/api/conversations/${conversationId}/messages`)
  return data
}

export async function sendConversationMessage(conversationId: number, content: string) {
  const { data } = await api.post<MessageResponse>(`/api/conversations/${conversationId}/messages`, { content })
  return data
}
