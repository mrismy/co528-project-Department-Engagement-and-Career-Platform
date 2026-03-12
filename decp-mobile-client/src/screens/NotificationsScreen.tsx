import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Heading, SubtleText } from '../components/UI'
import * as notificationsApi from '../api/notifications'
import type { NotificationResponse } from '../types'
import { formatDate } from '../utils/format'

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadNotifications() {
    try {
      const data = await notificationsApi.getNotifications()
      setNotifications(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load notifications')
    }
  }

  useEffect(() => { loadNotifications() }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadNotifications()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Notifications</Heading>
        <SubtleText>All activity updates related to your account appear here.</SubtleText>
        <ErrorText message={error} />
      </Card>
      {notifications.length === 0 ? <EmptyState title="No notifications yet" subtitle="New likes, comments, jobs, and messages will appear here." /> : null}
      {notifications.map(item => (
        <Card key={item.id}>
          <Text style={{ fontWeight: '700' }}>{item.title}</Text>
          <Text>{item.message}</Text>
          <SubtleText>{formatDate(item.createdAt)}</SubtleText>
          {!item.readStatus ? <Button title="Mark as read" onPress={async () => { await notificationsApi.markNotificationRead(item.id); await loadNotifications() }} /> : <Text style={{ color: '#027a48', fontWeight: '600' }}>Read</Text>}
        </Card>
      ))}
    </Screen>
  )
}
