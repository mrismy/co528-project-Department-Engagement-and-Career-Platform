import { api } from './client'

export interface RegisterPushTokenPayload {
  token: string
  platform: 'android' | 'ios'
}

export async function registerPushToken(payload: RegisterPushTokenPayload) {
  await api.post('/api/push/register', payload)
}

export async function unregisterPushToken(token: string) {
  await api.delete('/api/push/unregister', { data: { token } })
}
