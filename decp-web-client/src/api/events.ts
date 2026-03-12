import { api } from './client'
import type { EventResponse, RsvpStatus } from '../types'

export async function getEvents() {
  const { data } = await api.get<EventResponse[]>('/api/events')
  return data
}

export async function createEvent(payload: {
  title: string
  description: string
  venue?: string
  eventDate: string
  eventType?: string
  bannerUrl?: string
}) {
  const { data } = await api.post<EventResponse>('/api/events', payload)
  return data
}

export async function rsvpToEvent(eventId: number, status: RsvpStatus) {
  const { data } = await api.post<EventResponse>(`/api/events/${eventId}/rsvp`, { status })
  return data
}
