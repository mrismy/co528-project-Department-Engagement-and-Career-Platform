import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../store/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import { getApiError } from '../utils'
import type { Role } from '../types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT' as Role,
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await register(form.fullName, form.email, form.password, form.role)
      setAuth(data)
      navigate('/')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h1>Create account</h1>
        <p>Register as a student, alumni, or admin.</p>
        <ErrorBanner message={error} />

        <label>
          Full name
          <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} required />
        </label>

        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
        </label>

        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
        </label>

        <label>
          Role
          <select value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as Role }))}>
            <option value="STUDENT">Student</option>
            <option value="ALUMNI">Alumni</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <button className="primary-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  )
}
