import { FormEvent, useEffect, useState } from 'react'
import { deactivateUser, deletePostByAdmin, getAnalyticsOverview, getTopPosts, TopPostEntry } from '../api/admin'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import type { AnalyticsOverviewResponse } from '../types'
import { getApiError } from '../utils'

const emptyStats: AnalyticsOverviewResponse = {
  totalUsers: 0,
  activeUsers: 0,
  totalPosts: 0,
  totalJobs: 0,
  totalApplications: 0,
  totalEvents: 0,
  totalRsvps: 0,
  totalResearchProjects: 0,
  totalConversations: 0,
  totalNotifications: 0,
}

export default function AdminPage() {
  const [stats, setStats] = useState<AnalyticsOverviewResponse>(emptyStats)
  const [topPosts, setTopPosts] = useState<TopPostEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [postId, setPostId] = useState('')

  async function load() {
    try {
      const [overview, posts] = await Promise.all([getAnalyticsOverview(), getTopPosts(5)])
      setStats(overview)
      setTopPosts(posts)
    } catch (err) {
      setError(getApiError(err))
    }
  }

  useEffect(() => { void load() }, [])

  async function onDeactivate(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    try {
      const data = await deactivateUser(Number(userId))
      setStatus(data.message)
      setUserId('')
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function onDeletePost(e: FormEvent) {
    e.preventDefault()
    setStatus(null)
    try {
      const data = await deletePostByAdmin(Number(postId))
      setStatus(data.message)
      setPostId('')
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Admin Dashboard" subtitle="Analytics overview and moderation controls." />
      <ErrorBanner message={error} />
      {status ? <div className="success-banner">{status}</div> : null}

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Active users" value={stats.activeUsers} />
        <StatCard label="Posts" value={stats.totalPosts} />
        <StatCard label="Jobs" value={stats.totalJobs} />
        <StatCard label="Applications" value={stats.totalApplications} />
        <StatCard label="Events" value={stats.totalEvents} />
        <StatCard label="RSVPs" value={stats.totalRsvps} />
        <StatCard label="Research projects" value={stats.totalResearchProjects} />
        <StatCard label="Conversations" value={stats.totalConversations} />
        <StatCard label="Notifications" value={stats.totalNotifications} />
      </div>

      {/* Top posts table */}
      {topPosts.length > 0 && (
        <div className="card">
          <h3>🔥 Top Posts by Likes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e4e7ec' }}>
                <th style={{ padding: '8px 12px', color: '#667085', fontWeight: 600 }}>Author</th>
                <th style={{ padding: '8px 12px', color: '#667085', fontWeight: 600 }}>Content</th>
                <th style={{ padding: '8px 12px', color: '#667085', fontWeight: 600 }}>❤️ Likes</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map(p => (
                <tr key={p.postId} style={{ borderBottom: '1px solid #f2f4f7' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.authorName}</td>
                  <td style={{ padding: '8px 12px', color: '#344054' }}>{p.content || '—'}</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1d4ed8' }}>{p.likeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Moderation controls */}
      <div className="two-pane">
        <form className="card form-grid" onSubmit={onDeactivate}>
          <h3>Deactivate user</h3>
          <label>
            User ID
            <input value={userId} onChange={e => setUserId(e.target.value)} required />
          </label>
          <button className="primary-btn">Deactivate</button>
        </form>

        <form className="card form-grid" onSubmit={onDeletePost}>
          <h3>Delete post</h3>
          <label>
            Post ID
            <input value={postId} onChange={e => setPostId(e.target.value)} required />
          </label>
          <button className="primary-btn danger-btn">Delete post</button>
        </form>
      </div>
    </div>
  )
}
