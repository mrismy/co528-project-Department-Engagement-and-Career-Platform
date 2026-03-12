import { api } from './client'
import type { JobResponse } from '../types'

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

export async function applyToJob(jobId: number, payload: { resumeUrl: string; coverLetter?: string }) {
  const { data } = await api.post(`/api/jobs/${jobId}/apply`, payload)
  return data
}
