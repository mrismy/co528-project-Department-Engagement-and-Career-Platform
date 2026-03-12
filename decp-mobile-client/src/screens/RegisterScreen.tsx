import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Screen } from '../components/Screen'
import { Button, Card, ErrorText, Field, Heading, Label, SubtleText } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import type { AuthStackParamList } from '../navigation/types'
import type { Role } from '../types'

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

const roles: Role[] = ['STUDENT', 'ALUMNI']

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('STUDENT')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Full name, email, and password are required')
      return
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await register({ fullName: fullName.trim(), email: email.trim(), password, role })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Card>
        <Heading>Create account</Heading>
        <SubtleText>Students and alumni can register here. Admins can be seeded from the backend.</SubtleText>
        <Label>Full name</Label>
        <Field value={fullName} onChangeText={setFullName} placeholder="Full name" />
        <Label>Email</Label>
        <Field value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
        <Label>Password</Label>
        <Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Label>Select role</Label>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {roles.map(item => (
            <Pressable key={item} onPress={() => setRole(item)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: role === item ? '#1d4ed8' : '#e4e7ec' }}>
              <Text style={{ color: role === item ? '#fff' : '#101828' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <ErrorText message={error} />
        <Button title="Register" onPress={handleRegister} loading={loading} />
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: '#1d4ed8', fontWeight: '600' }}>Back to login</Text>
        </Pressable>
      </Card>
    </Screen>
  )
}
