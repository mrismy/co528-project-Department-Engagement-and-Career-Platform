import { api } from './client'
import type { JobApplicationResponse, JobResponse } from '../types'

export async function getJobs() {
  const { data } = await api.get<JobResponse[]>('/api/jobs')
  return data
}

export async function createJob(payload: {
  title: string
  company: string
  description: string
  location?: string
  type?: string
  deadline: string
}) {
  const { data } = await api.post<JobResponse>('/api/jobs', payload)
  return data
}

export async function applyToJob(jobId: number, resumeUrl: string, coverLetter: string) {
  const { data } = await api.post<JobApplicationResponse>(`/api/jobs/${jobId}/apply`, { resumeUrl, coverLetter })
  return data
}

export async function getMyApplications() {
  const { data } = await api.get<JobApplicationResponse[]>('/api/jobs/my-applications')
  return data
}
