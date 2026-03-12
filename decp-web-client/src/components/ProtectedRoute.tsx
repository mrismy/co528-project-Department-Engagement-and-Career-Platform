import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import type { Role } from '../types'

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: JSX.Element
  roles?: Role[]
}) {
  const { auth, loading } = useAuth()

  if (loading) return <div className="page-shell">Loading...</div>
  if (!auth) return <Navigate to="/login" replace />
  if (roles && !roles.includes(auth.role)) return <Navigate to="/" replace />
  return children
}
