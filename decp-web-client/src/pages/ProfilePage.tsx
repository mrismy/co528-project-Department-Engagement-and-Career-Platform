import { FormEvent, useEffect, useState } from 'react'
import { getMyProfile, updateMyProfile } from '../api/user'
import type { ProfileResponse } from '../types'
import PageHeader from '../components/PageHeader'
import ErrorBanner from '../components/ErrorBanner'
import { getApiError } from '../utils'

const emptyProfile: ProfileResponse = {
  userId: 0,
  fullName: '',
  email: '',
  role: 'STUDENT',
  profileImageUrl: '',
  bio: '',
  department: '',
  batch: '',
  graduationYear: undefined,
  currentCompany: '',
  jobTitle: '',
  skills: '',
  linkedinUrl: '',
  githubUrl: '',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse>(emptyProfile)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setProfile(await getMyProfile())
      } catch (err) {
        setError(getApiError(err))
      }
    }
    void load()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus(null)
    try {
      const updated = await updateMyProfile({
        ...profile,
        graduationYear: profile.graduationYear ? Number(profile.graduationYear) : undefined,
      })
      setProfile(updated)
      setStatus('Profile updated successfully.')
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader title="My Profile" subtitle="Maintain your department and career details for networking." />
      <ErrorBanner message={error} />
      {status ? <div className="success-banner">{status}</div> : null}

      <form className="card form-grid" onSubmit={onSubmit}>
        <div className="two-col">
          <label>
            Full name
            <input value={profile.fullName || ''} onChange={(e) => setProfile((s) => ({ ...s, fullName: e.target.value }))} />
          </label>
          <label>
            Email
            <input value={profile.email || ''} disabled />
          </label>
          <label>
            Role
            <input value={profile.role || ''} disabled />
          </label>
          <label>
            Department
            <input value={profile.department || ''} onChange={(e) => setProfile((s) => ({ ...s, department: e.target.value }))} />
          </label>
          <label>
            Batch
            <input value={profile.batch || ''} onChange={(e) => setProfile((s) => ({ ...s, batch: e.target.value }))} />
          </label>
          <label>
            Graduation year
            <input
              type="number"
              value={profile.graduationYear || ''}
              onChange={(e) => setProfile((s) => ({ ...s, graduationYear: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </label>
          <label>
            Current company
            <input value={profile.currentCompany || ''} onChange={(e) => setProfile((s) => ({ ...s, currentCompany: e.target.value }))} />
          </label>
          <label>
            Job title
            <input value={profile.jobTitle || ''} onChange={(e) => setProfile((s) => ({ ...s, jobTitle: e.target.value }))} />
          </label>
          <label>
            Profile image URL
            <input value={profile.profileImageUrl || ''} onChange={(e) => setProfile((s) => ({ ...s, profileImageUrl: e.target.value }))} />
          </label>
          <label>
            LinkedIn URL
            <input value={profile.linkedinUrl || ''} onChange={(e) => setProfile((s) => ({ ...s, linkedinUrl: e.target.value }))} />
          </label>
          <label>
            GitHub URL
            <input value={profile.githubUrl || ''} onChange={(e) => setProfile((s) => ({ ...s, githubUrl: e.target.value }))} />
          </label>
          <label>
            Skills
            <input value={profile.skills || ''} onChange={(e) => setProfile((s) => ({ ...s, skills: e.target.value }))} />
          </label>
        </div>

        <label>
          Bio
          <textarea value={profile.bio || ''} onChange={(e) => setProfile((s) => ({ ...s, bio: e.target.value }))} />
        </label>

        <button className="primary-btn">Save profile</button>
      </form>
    </div>
  )
}
