import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as jobsApi from '../api/jobs'
import type { JobResponse } from '../types'
import { useAuth } from '../contexts/AuthContext'

export function JobsScreen() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('Internship')
  const [deadline, setDeadline] = useState('2026-12-31')

  async function loadJobs() {
    try {
      const data = await jobsApi.getJobs()
      setJobs(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load jobs')
    }
  }

  useEffect(() => { loadJobs() }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadJobs()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleCreate() {
    if (!title.trim() || !company.trim() || !description.trim() || !deadline.trim()) {
      setError('Title, company, description, and deadline are required')
      return
    }
    try {
      setError(null)
      setSuccess(null)
      await jobsApi.createJob({ title: title.trim(), company: company.trim(), description: description.trim(), location: location.trim(), type: jobType.trim(), deadline: deadline.trim() })
      setTitle('')
      setCompany('')
      setDescription('')
      setLocation('')
      setJobType('Internship')
      setSuccess('Job created successfully')
      await loadJobs()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create job')
    }
  }

  async function handleApply(jobId: number) {
    try {
      setError(null)
      setSuccess(null)
      await jobsApi.applyToJob(jobId, { resumeUrl: 'https://example.com/resume.pdf', coverLetter: 'Interested in this opportunity.' })
      setSuccess('Application submitted')
      await loadJobs()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to apply')
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Jobs & Internships</Heading>
        <SubtleText>Students can apply. Alumni and admins can publish opportunities.</SubtleText>
        {(user?.role === 'ALUMNI' || user?.role === 'ADMIN') && (
          <>
            <Label>Job title</Label>
            <Field value={title} onChangeText={setTitle} placeholder="Job title" />
            <Label>Company</Label>
            <Field value={company} onChangeText={setCompany} placeholder="Company" />
            <Label>Description</Label>
            <Field value={description} onChangeText={setDescription} placeholder="Description" multiline />
            <Label>Location</Label>
            <Field value={location} onChangeText={setLocation} placeholder="Location" />
            <Label>Type</Label>
            <Field value={jobType} onChangeText={setJobType} placeholder="Internship / Full-time / Part-time" />
            <Label>Deadline</Label>
            <Field value={deadline} onChangeText={setDeadline} placeholder="Deadline YYYY-MM-DD" />
            <Button title="Create job" onPress={handleCreate} />
          </>
        )}
        <SuccessText message={success} />
        <ErrorText message={error} />
      </Card>
      {jobs.length === 0 ? <EmptyState title="No jobs posted yet" subtitle="Published jobs and internships will appear here." /> : null}
      {jobs.map(job => (
        <Card key={job.id}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{job.title}</Text>
          <Text>{job.company}</Text>
          <SubtleText>{job.location || 'Location not specified'} • {job.type || 'Type not specified'}</SubtleText>
          <Text>{job.description}</Text>
          <SubtleText>Deadline: {job.deadline}</SubtleText>
          <SubtleText>Applications: {job.applicationCount}</SubtleText>
          {user?.role === 'STUDENT' ? <Button title="Apply" onPress={() => handleApply(job.id)} /> : null}
        </Card>
      ))}
    </Screen>
  )
}
