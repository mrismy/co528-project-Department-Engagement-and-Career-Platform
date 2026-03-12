import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as researchApi from '../api/research'
import type { ResearchProjectResponse } from '../types'
import { useAuth } from '../contexts/AuthContext'

export function ResearchScreen() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<ResearchProjectResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')

  async function loadProjects() {
    try {
      const data = await researchApi.getResearchProjects()
      setProjects(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load projects')
    }
  }

  useEffect(() => { loadProjects() }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadProjects()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleCreate() {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }
    try {
      setError(null)
      setSuccess(null)
      await researchApi.createResearchProject({ title: title.trim(), description: description.trim(), documentUrl: documentUrl.trim(), requiredSkills: requiredSkills.trim() })
      setTitle('')
      setDescription('')
      setRequiredSkills('')
      setDocumentUrl('')
      setSuccess('Research project created')
      await loadProjects()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create research project')
    }
  }

  async function handleJoin(projectId: number) {
    try {
      setError(null)
      setSuccess(null)
      await researchApi.joinResearchProject(projectId)
      setSuccess('Joined research project successfully')
      await loadProjects()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to join project')
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Research Collaboration</Heading>
        <SubtleText>Alumni and admins can publish opportunities. Others can join open projects.</SubtleText>
        {(user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
          <>
            <Label>Project title</Label>
            <Field value={title} onChangeText={setTitle} placeholder="Project title" />
            <Label>Description</Label>
            <Field value={description} onChangeText={setDescription} placeholder="Description" multiline />
            <Label>Required skills</Label>
            <Field value={requiredSkills} onChangeText={setRequiredSkills} placeholder="Required skills" />
            <Label>Document URL</Label>
            <Field value={documentUrl} onChangeText={setDocumentUrl} placeholder="Optional document URL" autoCapitalize="none" />
            <Button title="Create project" onPress={handleCreate} />
          </>
        )}
        <SuccessText message={success} />
        <ErrorText message={error} />
      </Card>
      {projects.length === 0 ? <EmptyState title="No research opportunities yet" subtitle="Published collaboration calls will appear here." /> : null}
      {projects.map(project => (
        <Card key={project.id}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{project.title}</Text>
          <SubtleText>By {project.createdByName}</SubtleText>
          <Text>{project.description}</Text>
          <SubtleText>Skills: {project.requiredSkills || '-'}</SubtleText>
          <SubtleText>Members: {project.memberCount}</SubtleText>
          {!!project.documentUrl && <SubtleText>Document: {project.documentUrl}</SubtleText>}
          {!project.joinedByCurrentUser ? <Button title="Join" onPress={() => handleJoin(project.id)} /> : <Text style={{ color: '#027a48', fontWeight: '600' }}>Already joined</Text>}
        </Card>
      ))}
    </Screen>
  )
}
