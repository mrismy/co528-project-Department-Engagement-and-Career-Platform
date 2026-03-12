import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthResponse, Role } from '../types'
import * as authApi from '../api/auth'
import { getStoredToken, getStoredUser, removeStoredToken, removeStoredUser, setStoredToken, setStoredUser } from '../utils/storage'

type RegisterPayload = { fullName: string; email: string; password: string; role: Role }

type AuthContextValue = {
  user: AuthResponse | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bootstrap().finally(() => setLoading(false))
  }, [])

  async function bootstrap() {
    const token = await getStoredToken()
    const userJson = await getStoredUser()
    if (!token || !userJson) return
    try {
      const parsed = JSON.parse(userJson) as AuthResponse
      setUser(parsed)
      const fresh = await authApi.me().catch(() => parsed)
      setUser(fresh)
      await setStoredUser(JSON.stringify(fresh))
    } catch {
      await removeStoredToken()
      await removeStoredUser()
      setUser(null)
    }
  }

  async function login(email: string, password: string) {
    const auth = await authApi.login(email, password)
    setUser(auth)
    await setStoredToken(auth.token)
    await setStoredUser(JSON.stringify(auth))
  }

  async function register(payload: RegisterPayload) {
    const auth = await authApi.register(payload.fullName, payload.email, payload.password, payload.role)
    setUser(auth)
    await setStoredToken(auth.token)
    await setStoredUser(JSON.stringify(auth))
  }

  async function logout() {
    setUser(null)
    await removeStoredToken()
    await removeStoredUser()
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
