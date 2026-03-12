import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as eventsApi from '../api/events'
import type { EventResponse, RsvpStatus } from '../types'
import { formatDate } from '../utils/format'
import { useAuth } from '../contexts/AuthContext'

const choices: RsvpStatus[] = ['YES', 'NO', 'MAYBE']

export function EventsScreen() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

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
      setError(e?.response?.data?.message || 'Failed to load events')
    }
  }

  useEffect(() => { loadEvents() }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadEvents()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleCreate() {
    if (!title.trim() || !description.trim() || !eventDate.trim()) {
      setError('Title, description, and event date are required')
      return
    }
    try {
      setError(null)
      setSuccess(null)
      await eventsApi.createEvent({ title: title.trim(), description: description.trim(), venue: venue.trim(), eventDate: eventDate.trim(), eventType: eventType.trim() })
      setTitle('')
      setDescription('')
      setVenue('')
      setEventType('Department Event')
      setSuccess('Event created successfully')
      await loadEvents()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create event')
    }
  }

  async function handleRsvp(eventId: number, choice: RsvpStatus) {
    try {
      setError(null)
      await eventsApi.rsvpEvent(eventId, choice)
      setSuccess(`RSVP updated to ${choice}`)
      await loadEvents()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to RSVP')
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Events</Heading>
        <SubtleText>Track department events, meetups, and alumni sessions.</SubtleText>
        {user?.role === 'ADMIN' && (
          <>
            <Label>Event title</Label>
            <Field value={title} onChangeText={setTitle} placeholder="Event title" />
            <Label>Description</Label>
            <Field value={description} onChangeText={setDescription} placeholder="Description" multiline />
            <Label>Venue</Label>
            <Field value={venue} onChangeText={setVenue} placeholder="Venue" />
            <Label>Type</Label>
            <Field value={eventType} onChangeText={setEventType} placeholder="Event type" />
            <Label>Date & time</Label>
            <Field value={eventDate} onChangeText={setEventDate} placeholder="YYYY-MM-DDTHH:mm:ss" />
            <Button title="Create event" onPress={handleCreate} />
          </>
        )}
        <SuccessText message={success} />
        <ErrorText message={error} />
      </Card>
      {events.length === 0 ? <EmptyState title="No events yet" subtitle="Upcoming events will appear here once created." /> : null}
      {events.map(event => (
        <Card key={event.id}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{event.title}</Text>
          <SubtleText>{event.eventType || 'General event'}</SubtleText>
          <Text>{event.description}</Text>
          <Text>{event.venue || 'No venue'}</Text>
          <SubtleText>{formatDate(event.eventDate)}</SubtleText>
          <SubtleText>RSVP: Yes {event.yesCount} | No {event.noCount} | Maybe {event.maybeCount}</SubtleText>
          <SubtleText>Your choice: {event.currentUserRsvp || 'Not responded'}</SubtleText>
          <View style={{ gap: 8 }}>
            {choices.map(choice => (
              <Button key={choice} title={choice} variant={event.currentUserRsvp === choice ? 'primary' : 'secondary'} onPress={() => handleRsvp(event.id, choice)} />
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  )
}
