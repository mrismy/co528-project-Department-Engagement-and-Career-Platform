import { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead } from '../api/notifications'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import type { NotificationResponse } from '../types'
import { formatDateTime, getApiError } from '../utils'

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationResponse[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setItems(await getNotifications())
    } catch (err) {
      setError(getApiError(err))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleRead(id: number) {
    try {
      await markNotificationRead(id)
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Notifications" subtitle="Review activity, system alerts, and event-driven updates." />
      <ErrorBanner message={error} />

      <div className="stack">
        {items.map((item) => (
          <div key={item.id} className="card">
            <div className="post-top">
              <div>
                <h3>{item.title}</h3>
                <p>{item.type}</p>
              </div>
              <div className="align-right">
                <div className={`pill ${item.readStatus ? 'pill-muted' : ''}`}>{item.readStatus ? 'Read' : 'Unread'}</div>
                <small>{formatDateTime(item.createdAt)}</small>
              </div>
            </div>
            <p className="body-copy">{item.message}</p>
            <div className="muted">Reference ID: {item.referenceId || '-'}</div>
            {!item.readStatus ? (
              <button className="secondary-btn top-gap" onClick={() => void handleRead(item.id)}>
                Mark as read
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
