import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as eventsApi from '../api/events'
import type { EventResponse, RsvpStatus } from '../types'
import { formatDate } from '../utils/format'
import { useAuth } from '../contexts/AuthContext'

const EVENT_TYPE_EMOJI: Record<string, string> = {
  'Department Event': '🎓',
  Workshop: '🛠️',
  'Alumni Session': '🤝',
  Seminar: '📢',
  Hackathon: '💻',
}

function getEventEmoji(type?: string) {
  if (!type) return '📅'
  return EVENT_TYPE_EMOJI[type] ?? '📅'
}

function RsvpButton({ label, emoji, active, onPress }: { label: RsvpStatus; emoji: string; active: boolean; onPress: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <Button
        title={`${emoji} ${label}`}
        variant={active ? 'primary' : 'secondary'}
        onPress={onPress}
      />
    </View>
  )
}

function EventCard({ event, onRsvp }: { event: EventResponse; onRsvp: (id: number, choice: RsvpStatus) => void }) {
  const emoji = getEventEmoji(event.eventType)

  return (
    <Card>
      {/* Top: emoji icon + title */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{
          width: 50, height: 50, borderRadius: 14,
          backgroundColor: '#f0fdf4',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Text style={{ fontSize: 26 }}>{emoji}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#101828' }}>{event.title}</Text>
          <Text style={{ color: '#059669', fontWeight: '600', fontSize: 12 }}>{event.eventType || 'General Event'}</Text>
        </View>
      </View>

      {/* Meta */}
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 14 }}>🗓</Text>
          <Text style={{ color: '#344054', fontSize: 13, fontWeight: '600' }}>{formatDate(event.eventDate)}</Text>
        </View>
        {event.venue ? (
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Text style={{ fontSize: 14 }}>📍</Text>
            <Text style={{ color: '#667085', fontSize: 13 }}>{event.venue}</Text>
          </View>
        ) : null}
      </View>

      {/* Description */}
      <Text style={{ color: '#344054', fontSize: 14, lineHeight: 21 }} numberOfLines={3}>{event.description}</Text>

      {/* RSVP counts */}
      <View style={{ flexDirection: 'row', gap: 12, backgroundColor: '#f9fafb', borderRadius: 10, padding: 10 }}>
        <Text style={{ color: '#16a34a', fontWeight: '700' }}>✅ {event.yesCount} Going</Text>
        <Text style={{ color: '#d97706', fontWeight: '700' }}>❓ {event.maybeCount} Maybe</Text>
        <Text style={{ color: '#dc2626', fontWeight: '700' }}>❌ {event.noCount} No</Text>
      </View>

      {/* RSVP buttons */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <RsvpButton label="YES" emoji="✅" active={event.currentUserRsvp === 'YES'} onPress={() => onRsvp(event.id, 'YES')} />
        <RsvpButton label="MAYBE" emoji="❓" active={event.currentUserRsvp === 'MAYBE'} onPress={() => onRsvp(event.id, 'MAYBE')} />
        <RsvpButton label="NO" emoji="❌" active={event.currentUserRsvp === 'NO'} onPress={() => onRsvp(event.id, 'NO')} />
      </View>
    </Card>
  )
}

export function EventsScreen() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [venue, setVenue] = useState('')
  const [eventDate, setEventDate] = useState('2026-12-31T10:00:00')
  const [eventType, setEventType] = useState('Department Event')

  async function loadEvents() {
    try {
      const data = await eventsApi.getEvents()
      setEvents(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load events')
    }
  }

  useEffect(() => { loadEvents() }, [])

  async function handleRefresh() {
    try { setRefreshing(true); await loadEvents() } finally { setRefreshing(false) }
  }

  async function handleCreate() {
    if (!title.trim() || !description.trim() || !eventDate.trim()) {
      setError('Title, description, and event date are required')
      return
    }
    try {
      setError(null); setSuccess(null)
      await eventsApi.createEvent({ title: title.trim(), description: description.trim(), venue: venue.trim(), eventDate: eventDate.trim(), eventType: eventType.trim() })
      setTitle(''); setDescription(''); setVenue(''); setEventType('Department Event')
      setSuccess('✅ Event created!'); setShowForm(false)
      await loadEvents()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create event')
    }
  }

  async function handleRsvp(eventId: number, choice: RsvpStatus) {
    try {
      setError(null)
      await eventsApi.rsvpEvent(eventId, choice)
      setSuccess(`RSVP updated to ${choice}`)
      await loadEvents()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to RSVP')
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      {/* Hero banner */}
      <View style={{
        backgroundColor: '#059669', borderRadius: 16, padding: 20, gap: 6,
        marginBottom: 4,
      }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>📅 Events</Text>
        <Text style={{ color: '#d1fae5', fontSize: 14 }}>
          Department events, workshops & alumni meet-ups. RSVP and stay updated.
        </Text>
      </View>

      <SuccessText message={success} />
      <ErrorText message={error} />

      {user?.role === 'ADMIN' && (
        <Button
          title={showForm ? '✕ Cancel' : '+ Create Event'}
          variant={showForm ? 'secondary' : 'primary'}
          onPress={() => setShowForm(f => !f)}
        />
      )}

      {user?.role === 'ADMIN' && showForm && (
        <Card>
          <Heading>Create Event</Heading>
          <Label>Event title</Label><Field value={title} onChangeText={setTitle} placeholder="e.g. Alumni Tech Talk 2026" />
          <Label>Description</Label><Field value={description} onChangeText={setDescription} placeholder="What is this event about?" multiline />
          <Label>Venue</Label><Field value={venue} onChangeText={setVenue} placeholder="e.g. Lecture Hall A" />
          <Label>Type</Label><Field value={eventType} onChangeText={setEventType} placeholder="Department Event / Workshop / …" />
          <Label>Date & time</Label><Field value={eventDate} onChangeText={setEventDate} placeholder="YYYY-MM-DDTHH:mm:ss" />
          <Button title="Create Event" onPress={handleCreate} />
        </Card>
      )}

      {events.length === 0 ? (
        <EmptyState title="No events yet" subtitle="Upcoming events will appear here once created." />
      ) : (
        events.map(event => (
          <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
        ))
      )}
    </Screen>
  )
}
