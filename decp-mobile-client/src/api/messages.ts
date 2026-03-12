import { api } from './client'
import type { ConversationResponse, MessageResponse } from '../types'

export async function getConversations() {
  const { data } = await api.get<ConversationResponse[]>('/api/conversations')
  return data
}

export async function createConversation(participantIds: number[], title?: string) {
  const { data } = await api.post<ConversationResponse>('/api/conversations', { participantIds, title })
  return data
}

export async function getMessages(conversationId: number) {
  const { data } = await api.get<MessageResponse[]>(`/api/conversations/${conversationId}/messages`)
  return data
}

export async function sendMessage(conversationId: number, content: string) {
  const { data } = await api.post<MessageResponse>(`/api/conversations/${conversationId}/messages`, { content })
  return data
}
