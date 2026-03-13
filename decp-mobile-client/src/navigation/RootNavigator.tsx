import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
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

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={{
      width: 32, height: 32, borderRadius: 8,
      backgroundColor: focused ? '#1d4ed8' : 'transparent',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 18, color: focused ? '#fff' : '#667085' }}>{icon}</Text>
    </View>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1d4ed8',
        tabBarInactiveTintColor: '#667085',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e4e7ec',
          height: 82,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIconStyle: { marginBottom: 2 },
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⌂" focused={focused} /> }} />
      <Tab.Screen name="Jobs" component={JobsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="✦" focused={focused} /> }} />
      <Tab.Screen name="Events" component={EventsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⊕" focused={focused} /> }} />
      <Tab.Screen name="Research" component={ResearchScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⊞" focused={focused} /> }} />
      <Tab.Screen name="Messages" component={MessagesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="☰" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="♟" focused={focused} /> }} />
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
