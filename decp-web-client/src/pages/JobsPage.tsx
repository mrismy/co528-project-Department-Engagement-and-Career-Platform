import { FormEvent, useEffect, useState } from 'react'
import { applyToJob, createJob, getJobs, getMyApplications } from '../api/jobs'
import ErrorBanner from '../components/ErrorBanner'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../store/AuthContext'
import type { JobApplicationResponse, JobResponse } from '../types'
import { formatDate, formatDateTime, getApiError } from '../utils'

export default function JobsPage() {
  const { auth } = useAuth()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [applications, setApplications] = useState<JobApplicationResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: '',
    deadline: '',
  })
  const [applyState, setApplyState] = useState<Record<number, { resumeUrl: string; coverLetter: string }>>({})

  const canCreate = auth?.role === 'ALUMNI' || auth?.role === 'ADMIN'

  async function load() {
    try {
      setJobs(await getJobs())
      setApplications(await getMyApplications())
    } catch (err) {
      setError(getApiError(err))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleCreateJob(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createJob(jobForm)
      setJobForm({ title: '', company: '', description: '', location: '', type: '', deadline: '' })
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleApply(jobId: number) {
    const payload = applyState[jobId]
    if (!payload?.resumeUrl) {
      setError('Resume URL is required.')
      return
    }
    try {
      await applyToJob(jobId, payload.resumeUrl, payload.coverLetter)
      setApplyState((s) => ({ ...s, [jobId]: { resumeUrl: '', coverLetter: '' } }))
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="Jobs & Internships" subtitle="Discover or publish opportunities through the alumni network." />
      <ErrorBanner message={error} />

      {canCreate ? (
        <form className="card form-grid" onSubmit={handleCreateJob}>
          <h3>Create job or internship</h3>
          <div className="two-col">
            <label>
              Title
              <input value={jobForm.title} onChange={(e) => setJobForm((s) => ({ ...s, title: e.target.value }))} required />
            </label>
            <label>
              Company
              <input value={jobForm.company} onChange={(e) => setJobForm((s) => ({ ...s, company: e.target.value }))} required />
            </label>
            <label>
              Location
              <input value={jobForm.location} onChange={(e) => setJobForm((s) => ({ ...s, location: e.target.value }))} />
            </label>
            <label>
              Type
              <input value={jobForm.type} onChange={(e) => setJobForm((s) => ({ ...s, type: e.target.value }))} placeholder="Internship / Full-time" />
            </label>
            <label>
              Deadline
              <input type="date" value={jobForm.deadline} onChange={(e) => setJobForm((s) => ({ ...s, deadline: e.target.value }))} required />
            </label>
          </div>
          <label>
            Description
            <textarea value={jobForm.description} onChange={(e) => setJobForm((s) => ({ ...s, description: e.target.value }))} required />
          </label>
          <button className="primary-btn">Create opportunity</button>
        </form>
      ) : null}

      <div className="stack">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <div className="post-top">
              <div>
                <h3>{job.title}</h3>
                <p>
                  {job.company} • {job.postedByName}
                </p>
              </div>
              <div className="align-right">
                <div className="pill">{job.type || 'Opportunity'}</div>
                <small>Deadline: {formatDate(job.deadline)}</small>
              </div>
            </div>
            <p className="body-copy">{job.description}</p>
            <div className="muted">Location: {job.location || 'Not specified'} • Applications: {job.applicationCount}</div>

            <div className="two-col top-gap">
              <label>
                Resume URL
                <input
                  value={applyState[job.id]?.resumeUrl || ''}
                  onChange={(e) => setApplyState((s) => ({ ...s, [job.id]: { ...s[job.id], resumeUrl: e.target.value, coverLetter: s[job.id]?.coverLetter || '' } }))}
                />
              </label>
              <label>
                Cover letter
                <input
                  value={applyState[job.id]?.coverLetter || ''}
                  onChange={(e) => setApplyState((s) => ({ ...s, [job.id]: { ...s[job.id], coverLetter: e.target.value, resumeUrl: s[job.id]?.resumeUrl || '' } }))}
                />
              </label>
            </div>

            <button className="secondary-btn top-gap" onClick={() => void handleApply(job.id)}>
              Apply
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>My applications</h3>
        <div className="stack compact">
          {applications.length === 0 ? <div className="muted">No applications yet.</div> : null}
          {applications.map((app) => (
            <div key={app.id} className="sub-card">
              <strong>{app.jobTitle}</strong>
              <p>Status: {app.status}</p>
              <small>Applied: {formatDateTime(app.appliedAt)}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
