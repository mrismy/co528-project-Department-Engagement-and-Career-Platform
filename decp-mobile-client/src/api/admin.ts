import { api } from './client'
import type { AnalyticsOverviewResponse } from '../types'

export async function getAnalyticsOverview() {
  const { data } = await api.get<AnalyticsOverviewResponse>('/api/admin/analytics/overview')
  return data
}
