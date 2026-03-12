import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as messagesApi from '../api/messages'
import type { ConversationResponse, MessageResponse } from '../types'
import { formatDate } from '../utils/format'

export function MessagesScreen() {
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [content, setContent] = useState('')
  const [participantIds, setParticipantIds] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadConversations() {
    try {
      const data = await messagesApi.getConversations()
      setConversations(data)
      if (!selectedConversation && data.length > 0) {
        await openConversation(data[0])
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load conversations')
    }
  }

  async function openConversation(conversation: ConversationResponse) {
    try {
      setSelectedConversation(conversation)
      const messageData = await messagesApi.getMessages(conversation.id)
      setMessages(messageData)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load messages')
    }
  }

  async function handleSend() {
    if (!selectedConversation || !content.trim()) return
    try {
      setError(null)
      await messagesApi.sendMessage(selectedConversation.id, content.trim())
      setContent('')
      await openConversation(selectedConversation)
      await loadConversations()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send message')
    }
  }

  async function handleCreateConversation() {
    const ids = participantIds.split(',').map(value => Number(value.trim())).filter(value => Number.isFinite(value) && value > 0)
    if (ids.length === 0) {
      setError('Enter at least one participant id, separated by commas')
      return
    }
    try {
      setError(null)
      setSuccess(null)
      const conversation = await messagesApi.createConversation(ids, title.trim() || undefined)
      setTitle('')
      setParticipantIds('')
      setSuccess('Conversation created')
      await loadConversations()
      await openConversation(conversation)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create conversation')
    }
  }

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadConversations()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { loadConversations() }, [])

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Messages</Heading>
        <SubtleText>Create a conversation using participant user ids, then open and send messages.</SubtleText>
        <Label>Conversation title</Label>
        <Field value={title} onChangeText={setTitle} placeholder="Optional title" />
        <Label>Participant ids</Label>
        <Field value={participantIds} onChangeText={setParticipantIds} placeholder="Example: 2,3" keyboardType="numbers-and-punctuation" />
        <Button title="Create conversation" onPress={handleCreateConversation} />
        <SuccessText message={success} />
        <ErrorText message={error} />
      </Card>
      {conversations.length === 0 ? <EmptyState title="No conversations yet" subtitle="Create one to start messaging." /> : null}
      {conversations.map(item => (
        <Card key={item.id}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{item.title || item.participantNames.join(', ')}</Text>
          <SubtleText>{item.lastMessagePreview || 'No messages yet'}</SubtleText>
          {!!item.updatedAt && <SubtleText>Updated: {formatDate(item.updatedAt)}</SubtleText>}
          <Button title="Open" onPress={() => openConversation(item)} variant={selectedConversation?.id === item.id ? 'primary' : 'secondary'} />
        </Card>
      ))}
      {selectedConversation && (
        <Card>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{selectedConversation.title || 'Conversation'}</Text>
          {messages.length === 0 ? <SubtleText>No messages yet.</SubtleText> : null}
          {messages.map(message => (
            <Text key={message.id}>{message.senderName}: {message.content}</Text>
          ))}
          <Field value={content} onChangeText={setContent} placeholder="Type message" />
          <Button title="Send" onPress={handleSend} />
        </Card>
      )}
    </Screen>
  )
}
