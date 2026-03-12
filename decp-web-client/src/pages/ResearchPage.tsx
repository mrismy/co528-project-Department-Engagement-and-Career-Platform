import { FormEvent, useEffect, useState } from 'react'
import { createResearchProject, getResearchProjects, joinResearchProject } from '../api/research'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import type { ResearchProjectResponse } from '../types'
import { formatDateTime, getApiError } from '../utils'

export default function ResearchPage() {
  const [projects, setProjects] = useState<ResearchProjectResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [joinRoles, setJoinRoles] = useState<Record<number, string>>({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    documentUrl: '',
    requiredSkills: '',
  })

  async function load() {
    try {
      setProjects(await getResearchProjects())
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
      await createResearchProject(form)
      setForm({ title: '', description: '', documentUrl: '', requiredSkills: '' })
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleJoin(projectId: number) {
    const role = joinRoles[projectId]?.trim() || 'Contributor'
    try {
      await joinResearchProject(projectId, role)
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Research Collaboration" subtitle="Create projects, publish requirements, and invite contributors." />
      <ErrorBanner message={error} />

      <form className="card form-grid" onSubmit={handleCreate}>
        <h3>Create research project</h3>
        <div className="two-col">
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
          </label>
          <label>
            Document URL
            <input value={form.documentUrl} onChange={(e) => setForm((s) => ({ ...s, documentUrl: e.target.value }))} />
          </label>
          <label>
            Required skills
            <input value={form.requiredSkills} onChange={(e) => setForm((s) => ({ ...s, requiredSkills: e.target.value }))} />
          </label>
        </div>
        <label>
          Description
          <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} required />
        </label>
        <button className="primary-btn">Create project</button>
      </form>

      <div className="stack">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="post-top">
              <div>
                <h3>{project.title}</h3>
                <p>{project.createdByName}</p>
              </div>
              <div className="align-right">
                <div className="pill">{project.memberCount} members</div>
                <small>{formatDateTime(project.createdAt)}</small>
              </div>
            </div>
            <p className="body-copy">{project.description}</p>
            <div className="muted">Required skills: {project.requiredSkills || 'Not specified'}</div>
            {project.documentUrl ? (
              <a href={project.documentUrl} target="_blank" rel="noreferrer" className="inline-link">
                Open document
              </a>
            ) : null}
            <div className="comment-box top-gap">
              <input
                placeholder="Role for joining"
                value={joinRoles[project.id] || ''}
                onChange={(e) => setJoinRoles((s) => ({ ...s, [project.id]: e.target.value }))}
              />
              <button className="secondary-btn" onClick={() => void handleJoin(project.id)} disabled={project.joinedByCurrentUser}>
                {project.joinedByCurrentUser ? 'Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
