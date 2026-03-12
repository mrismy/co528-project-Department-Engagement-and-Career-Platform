import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Screen } from '../components/Screen'
import { Button, Card, ErrorText, Field, Heading, Label, SubtleText, SuccessText } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import * as userApi from '../api/user'
import type { ProfileResponse } from '../types'
import type { RootStackParamList } from '../navigation/types'

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function loadProfile() {
    try {
      const data = await userApi.getMyProfile()
      setProfile(data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profile')
    }
  }

  useEffect(() => { loadProfile() }, [])

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadProfile()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleSave() {
    if (!profile) return
    try {
      setError(null)
      setSuccess(null)
      const data = await userApi.updateProfile(profile)
      setProfile(data)
      setSuccess('Profile updated successfully')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Profile</Heading>
        <Text style={{ fontWeight: '700' }}>{user?.fullName}</Text>
        <SubtleText>{user?.email}</SubtleText>
        <SubtleText>{user?.role}</SubtleText>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} variant="secondary" />
          {user?.role === 'ADMIN' ? <Button title="Admin" onPress={() => navigation.navigate('Admin')} variant="secondary" /> : null}
        </View>
      </Card>
      {profile && (
        <Card>
          <Label>Bio</Label>
          <Field value={profile.bio || ''} onChangeText={value => setProfile({ ...profile, bio: value })} placeholder="Bio" multiline />
          <Label>Department</Label>
          <Field value={profile.department || ''} onChangeText={value => setProfile({ ...profile, department: value })} placeholder="Department" />
          <Label>Batch</Label>
          <Field value={profile.batch || ''} onChangeText={value => setProfile({ ...profile, batch: value })} placeholder="Batch" />
          <Label>Graduation year</Label>
          <Field value={profile.graduationYear ? String(profile.graduationYear) : ''} onChangeText={value => setProfile({ ...profile, graduationYear: value ? Number(value) : undefined })} placeholder="Graduation year" keyboardType="numeric" />
          <Label>Skills</Label>
          <Field value={profile.skills || ''} onChangeText={value => setProfile({ ...profile, skills: value })} placeholder="Skills" />
          <Label>Current company</Label>
          <Field value={profile.currentCompany || ''} onChangeText={value => setProfile({ ...profile, currentCompany: value })} placeholder="Current company" />
          <Label>Job title</Label>
          <Field value={profile.jobTitle || ''} onChangeText={value => setProfile({ ...profile, jobTitle: value })} placeholder="Job title" />
          <Label>LinkedIn URL</Label>
          <Field value={profile.linkedinUrl || ''} onChangeText={value => setProfile({ ...profile, linkedinUrl: value })} placeholder="LinkedIn URL" autoCapitalize="none" />
          <Label>GitHub URL</Label>
          <Field value={profile.githubUrl || ''} onChangeText={value => setProfile({ ...profile, githubUrl: value })} placeholder="GitHub URL" autoCapitalize="none" />
          <SuccessText message={success} />
          <ErrorText message={error} />
          <Button title="Save profile" onPress={handleSave} />
          <Button title="Logout" onPress={logout} variant="secondary" />
        </Card>
      )}
    </Screen>
  )
}
