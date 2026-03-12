import { FormEvent, useEffect, useState } from 'react'
import { createEvent, getEvents, rsvpToEvent } from '../api/events'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../store/AuthContext'
import type { EventResponse, RsvpStatus } from '../types'
import { formatDateTime, getApiError } from '../utils'

export default function EventsPage() {
  const { auth } = useAuth()
  const [events, setEvents] = useState<EventResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    eventType: '',
    bannerUrl: '',
  })

  const canCreate = auth?.role === 'ALUMNI' || auth?.role === 'ADMIN'

  async function load() {
    try {
      setEvents(await getEvents())
    } catch (err) {
      setError(getApiError(err))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    try {
      const eventDate = form.eventDate ? new Date(form.eventDate).toISOString().slice(0, 19) : ''
      await createEvent({ ...form, eventDate })
      setForm({ title: '', description: '', venue: '', eventDate: '', eventType: '', bannerUrl: '' })
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleRsvp(eventId: number, status: RsvpStatus) {
    try {
      await rsvpToEvent(eventId, status)
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Events & Announcements" subtitle="Manage workshops, department events, and community participation." />
      <ErrorBanner message={error} />

      {canCreate ? (
        <form className="card form-grid" onSubmit={handleCreate}>
          <h3>Create event</h3>
          <div className="two-col">
            <label>
              Title
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
            </label>
            <label>
              Venue
              <input value={form.venue} onChange={(e) => setForm((s) => ({ ...s, venue: e.target.value }))} />
            </label>
            <label>
              Event type
              <input value={form.eventType} onChange={(e) => setForm((s) => ({ ...s, eventType: e.target.value }))} />
            </label>
            <label>
              Banner URL
              <input value={form.bannerUrl} onChange={(e) => setForm((s) => ({ ...s, bannerUrl: e.target.value }))} />
            </label>
            <label>
              Event date & time
              <input type="datetime-local" value={form.eventDate} onChange={(e) => setForm((s) => ({ ...s, eventDate: e.target.value }))} required />
            </label>
          </div>
          <label>
            Description
            <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} required />
          </label>
          <button className="primary-btn">Publish event</button>
        </form>
      ) : null}

      <div className="stack">
        {events.map((event) => (
          <div key={event.id} className="card">
            <div className="post-top">
              <div>
                <h3>{event.title}</h3>
                <p>{event.createdByName}</p>
              </div>
              <div className="align-right">
                <div className="pill">{event.eventType || 'Event'}</div>
                <small>{formatDateTime(event.eventDate)}</small>
              </div>
            </div>
            <p className="body-copy">{event.description}</p>
            <div className="muted">Venue: {event.venue || 'Not specified'}</div>
            {event.bannerUrl ? (
              <a href={event.bannerUrl} target="_blank" rel="noreferrer" className="inline-link">
                Open banner
              </a>
            ) : null}
            <div className="action-row wrap">
              <button className="secondary-btn" onClick={() => void handleRsvp(event.id, 'YES')}>
                Yes ({event.yesCount})
              </button>
              <button className="secondary-btn" onClick={() => void handleRsvp(event.id, 'MAYBE')}>
                Maybe ({event.maybeCount})
              </button>
              <button className="secondary-btn" onClick={() => void handleRsvp(event.id, 'NO')}>
                No ({event.noCount})
              </button>
              <span className="muted">My RSVP: {event.currentUserRsvp || 'None'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
