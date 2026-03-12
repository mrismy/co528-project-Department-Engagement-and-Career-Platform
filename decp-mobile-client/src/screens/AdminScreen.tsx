import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Heading, SubtleText } from '../components/UI'
import * as adminApi from '../api/admin'
import type { AnalyticsOverviewResponse } from '../types'

export function AdminScreen() {
  const [analytics, setAnalytics] = useState<AnalyticsOverviewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadAnalytics() {
    try {
      const data = await adminApi.getAnalyticsOverview()
      setAnalytics(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load analytics')
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadAnalytics()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Admin Analytics</Heading>
        <SubtleText>System-wide counts from the backend analytics endpoint.</SubtleText>
        <Button title="Refresh" onPress={handleRefresh} variant="secondary" />
        <ErrorText message={error} />
      </Card>
      {!analytics ? <EmptyState title="Analytics not available" subtitle="Pull to refresh or check backend admin access." /> : null}
      {analytics && Object.entries(analytics).map(([key, value]) => (
        <Card key={key}>
          <Text style={{ fontWeight: '700' }}>{key}</Text>
          <Text>{String(value)}</Text>
        </Card>
      ))}
    </Screen>
  )
}
