import { FormEvent, useEffect, useState } from 'react'
import { createConversation, getConversationMessages, getConversations, sendConversationMessage } from '../api/messages'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import type { ConversationResponse, MessageResponse } from '../types'
import { formatDateTime, getApiError } from '../utils'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [conversationForm, setConversationForm] = useState({
    type: 'DIRECT',
    title: '',
    participantIds: '',
  })
  const [messageText, setMessageText] = useState('')

  async function loadConversations() {
    try {
      const data = await getConversations()
      setConversations(data)
      if (!selected && data.length > 0) {
        setSelected(data[0].id)
      }
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function loadMessages(conversationId: number) {
    try {
      setMessages(await getConversationMessages(conversationId))
    } catch (err) {
      setError(getApiError(err))
    }
  }

  useEffect(() => {
    void loadConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selected) {
      void loadMessages(selected)
    }
  }, [selected])

  async function handleCreateConversation(e: FormEvent) {
    e.preventDefault()
    try {
      const participantIds = conversationForm.participantIds
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0)

      await createConversation({
        type: conversationForm.type,
        title: conversationForm.title || undefined,
        participantIds,
      })
      setConversationForm({ type: 'DIRECT', title: '', participantIds: '' })
      await loadConversations()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleSendMessage() {
    if (!selected || !messageText.trim()) return
    try {
      await sendConversationMessage(selected, messageText)
      setMessageText('')
      await loadMessages(selected)
      await loadConversations()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Messaging" subtitle="Direct messaging and group chat for department collaboration." />
      <ErrorBanner message={error} />

      <form className="card form-grid" onSubmit={handleCreateConversation}>
        <h3>Create conversation</h3>
        <div className="three-col">
          <label>
            Type
            <select value={conversationForm.type} onChange={(e) => setConversationForm((s) => ({ ...s, type: e.target.value }))}>
              <option value="DIRECT">Direct</option>
              <option value="GROUP">Group</option>
            </select>
          </label>
          <label>
            Title
            <input value={conversationForm.title} onChange={(e) => setConversationForm((s) => ({ ...s, title: e.target.value }))} />
          </label>
          <label>
            Participant IDs
            <input
              placeholder="2,3,5"
              value={conversationForm.participantIds}
              onChange={(e) => setConversationForm((s) => ({ ...s, participantIds: e.target.value }))}
              required
            />
          </label>
        </div>
        <button className="primary-btn">Create conversation</button>
      </form>

      <div className="message-layout">
        <div className="card">
          <h3>Conversations</h3>
          <div className="stack compact">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`conversation-item ${selected === conversation.id ? 'selected' : ''}`}
                onClick={() => setSelected(conversation.id)}
              >
                <strong>{conversation.title || conversation.participantNames.join(', ')}</strong>
                <span>{conversation.lastMessagePreview || 'No messages yet'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Messages</h3>
          <div className="stack compact">
            {messages.map((message) => (
              <div key={message.id} className="sub-card">
                <strong>{message.senderName}</strong>
                <p>{message.content}</p>
                <small>{formatDateTime(message.createdAt)}</small>
              </div>
            ))}
          </div>

          <div className="comment-box top-gap">
            <input
              placeholder="Type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button className="secondary-btn" onClick={() => void handleSendMessage()} disabled={!selected}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
