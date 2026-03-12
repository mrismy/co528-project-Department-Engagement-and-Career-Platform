import { api } from './client'
import type { ResearchProjectResponse } from '../types'

export async function getResearchProjects() {
  const { data } = await api.get<ResearchProjectResponse[]>('/api/research-projects')
  return data
}

export async function createResearchProject(payload: {
  title: string
  description: string
  documentUrl?: string
  requiredSkills?: string
}) {
  const { data } = await api.post<ResearchProjectResponse>('/api/research-projects', payload)
  return data
}

export async function joinResearchProject(projectId: number) {
  const { data } = await api.post<ResearchProjectResponse>(`/api/research-projects/${projectId}/join`)
  return data
}
