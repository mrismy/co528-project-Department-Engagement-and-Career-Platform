import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../store/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import { getApiError } from '../utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('admin@decp.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(email, password)
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
        <h1>Sign in to DECP</h1>
        <p>Use your student, alumni, or admin account.</p>
        <ErrorBanner message={error} />

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        <button className="primary-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="auth-footer">
          No account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  )
}
