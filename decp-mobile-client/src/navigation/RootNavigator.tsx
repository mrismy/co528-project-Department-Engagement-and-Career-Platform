import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from '../contexts/AuthContext'
import type { AppTabsParamList, AuthStackParamList, RootStackParamList } from './types'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { FeedScreen } from '../screens/FeedScreen'
import { JobsScreen } from '../screens/JobsScreen'
import { EventsScreen } from '../screens/EventsScreen'
import { ResearchScreen } from '../screens/ResearchScreen'
import { MessagesScreen } from '../screens/MessagesScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { NotificationsScreen } from '../screens/NotificationsScreen'
import { AdminScreen } from '../screens/AdminScreen'

const AuthStack = createNativeStackNavigator<AuthStackParamList>()
const RootStack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<AppTabsParamList>()

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Research" component={ResearchScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!user) return <AuthNavigator />

  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />
      {user.role === 'ADMIN' ? <RootStack.Screen name="Admin" component={AdminScreen} /> : null}
    </RootStack.Navigator>
  )
}
