import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import * as jobsApi from '../api/jobs'
import type { JobResponse } from '../types'
import { useAuth } from '../contexts/AuthContext'

const JOB_TYPE_COLORS: Record<string, string> = {
  Internship: '#065f46',
  'Full-time': '#1d4ed8',
  'Part-time': '#7c3aed',
}

function JobTypeBadge({ type }: { type?: string }) {
  const label = type || 'Role'
  const color = JOB_TYPE_COLORS[label] || '#374151'
  return (
    <View style={{
      backgroundColor: color + '18', borderRadius: 8,
      paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
    }}>
      <Text style={{ color, fontWeight: '700', fontSize: 11 }}>{label.toUpperCase()}</Text>
    </View>
  )
}

function JobCard({ job, isStudent, onApply }: { job: JobResponse; isStudent: boolean; onApply: (id: number) => void }) {
  return (
    <Card>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
        {/* Company logo placeholder */}
        <View style={{
          width: 46, height: 46, borderRadius: 12,
          backgroundColor: '#e0e7ff',
          alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Text style={{ fontSize: 22 }}>🏢</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#101828' }}>{job.title}</Text>
          <Text style={{ color: '#1d4ed8', fontWeight: '600', fontSize: 14 }}>{job.company}</Text>
        </View>
        <JobTypeBadge type={job.type} />
      </View>

      {/* Meta row */}
      <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
        {job.location ? (
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Text>📍</Text>
            <Text style={{ color: '#667085', fontSize: 13 }}>{job.location}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
          <Text>📅</Text>
          <Text style={{ color: '#667085', fontSize: 13 }}>Deadline: {job.deadline}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
          <Text>👥</Text>
          <Text style={{ color: '#667085', fontSize: 13 }}>{job.applicationCount} applicants</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={{ color: '#344054', fontSize: 14, lineHeight: 21 }} numberOfLines={3}>{job.description}</Text>

      {/* Apply button — students only */}
      {isStudent && (
        <Button title="Apply Now →" onPress={() => onApply(job.id)} />
      )}
    </Card>
  )
}

export function JobsScreen() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)

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
      setError(e?.response?.data?.message || e?.message || 'Failed to load jobs')
    }
  }

  useEffect(() => { loadJobs() }, [])

  async function handleRefresh() {
    try { setRefreshing(true); await loadJobs() } finally { setRefreshing(false) }
  }

  async function handleCreate() {
    if (!title.trim() || !company.trim() || !description.trim() || !deadline.trim()) {
      setError('Title, company, description, and deadline are required')
      return
    }
    try {
      setError(null); setSuccess(null)
      await jobsApi.createJob({ title: title.trim(), company: company.trim(), description: description.trim(), location: location.trim(), type: jobType.trim(), deadline: deadline.trim() })
      setTitle(''); setCompany(''); setDescription(''); setLocation(''); setJobType('Internship')
      setSuccess('✅ Job posted successfully!'); setShowForm(false)
      await loadJobs()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create job')
    }
  }

  async function handleApply(jobId: number) {
    try {
      setError(null); setSuccess(null)
      await jobsApi.applyToJob(jobId, { resumeUrl: 'https://example.com/resume.pdf', coverLetter: 'Interested in this opportunity.' })
      setSuccess('✅ Application submitted!')
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to apply')
    }
  }

  const canPost = user?.role === 'ALUMNI' || user?.role === 'ADMIN'

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      {/* Page banner */}
      <View style={{
        backgroundColor: '#1d4ed8', borderRadius: 16, padding: 20, gap: 6,
        marginBottom: 4,
      }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>💼 Jobs & Internships</Text>
        <Text style={{ color: '#bfdbfe', fontSize: 14 }}>
          {canPost ? 'Post opportunities for students and alumni.' : 'Apply for jobs and internships posted by alumni.'}
        </Text>
      </View>

      <SuccessText message={success} />
      <ErrorText message={error} />

      {/* Toggle form */}
      {canPost && (
        <Button
          title={showForm ? '✕ Cancel' : '+ Post a Job / Internship'}
          variant={showForm ? 'secondary' : 'primary'}
          onPress={() => setShowForm(f => !f)}
        />
      )}

      {canPost && showForm && (
        <Card>
          <Heading>Post Opportunity</Heading>
          <Label>Job title</Label><Field value={title} onChangeText={setTitle} placeholder="e.g. Frontend Engineer" />
          <Label>Company</Label><Field value={company} onChangeText={setCompany} placeholder="e.g. Google" />
          <Label>Description</Label><Field value={description} onChangeText={setDescription} placeholder="Role details..." multiline />
          <Label>Location</Label><Field value={location} onChangeText={setLocation} placeholder="e.g. Remote • Colombo" />
          <Label>Type</Label><Field value={jobType} onChangeText={setJobType} placeholder="Internship / Full-time / Part-time" />
          <Label>Deadline (YYYY-MM-DD)</Label><Field value={deadline} onChangeText={setDeadline} placeholder="2026-12-31" />
          <Button title="Publish Job" onPress={handleCreate} />
        </Card>
      )}

      {jobs.length === 0 ? (
        <EmptyState title="No jobs posted yet" subtitle="Published jobs and internships will appear here." />
      ) : (
        jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            isStudent={user?.role === 'STUDENT'}
            onApply={handleApply}
          />
        ))
      )}
    </Screen>
  )
}
