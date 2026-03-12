import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthResponse } from '../types'
import { me as fetchMe } from '../api/auth'

type AuthContextType = {
  auth: AuthResponse | null
  loading: boolean
  setAuth: (auth: AuthResponse | null) => void
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'decp_auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuthState] = useState<AuthResponse | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthResponse
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const setAuth = (value: AuthResponse | null) => {
    setAuthState(value)
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const logout = () => setAuth(null)

  const refreshMe = async () => {
    if (!auth?.token) return
    const current = await fetchMe()
    setAuth({ ...current, token: auth.token })
  }

  useEffect(() => {
    const init = async () => {
      if (!auth?.token) {
        setLoading(false)
        return
      }
      try {
        const current = await fetchMe()
        setAuth({ ...current, token: auth.token })
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    void init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({ auth, loading, setAuth, logout, refreshMe }), [auth, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
