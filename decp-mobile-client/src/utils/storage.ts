import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'decp_token'
const USER_KEY = 'decp_user'

export async function setStoredToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}

export async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY)
}

export async function removeStoredToken() {
  await AsyncStorage.removeItem(TOKEN_KEY)
}

export async function setStoredUser(value: string) {
  await AsyncStorage.setItem(USER_KEY, value)
}

export async function getStoredUser() {
  return AsyncStorage.getItem(USER_KEY)
}

export async function removeStoredUser() {
  await AsyncStorage.removeItem(USER_KEY)
}
