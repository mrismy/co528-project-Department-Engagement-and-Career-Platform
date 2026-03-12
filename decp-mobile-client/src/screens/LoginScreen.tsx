import React, { useState } from 'react'
import { Pressable, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Screen } from '../components/Screen'
import { Button, Card, ErrorText, Field, Heading, Label, SubtleText } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import type { AuthStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@decp.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await login(email.trim(), password)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Card>
        <Heading>DECP Mobile</Heading>
        <SubtleText>Login to the department engagement platform.</SubtleText>
        <Label>Email</Label>
        <Field value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
        <Label>Password</Label>
        <Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <ErrorText message={error} />
        <Button title="Login" onPress={handleLogin} loading={loading} />
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#1d4ed8', fontWeight: '600' }}>No account? Register</Text>
        </Pressable>
      </Card>
    </Screen>
  )
}
