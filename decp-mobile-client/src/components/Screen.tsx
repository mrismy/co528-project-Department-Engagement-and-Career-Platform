import React from 'react'
import { KeyboardAvoidingView, Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export function Screen({ children, scroll = true, refreshing, onRefresh }: { children: React.ReactNode; scroll?: boolean; refreshing?: boolean; onRefresh?: () => void }) {
  const refreshControl = onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined

  const content = scroll ? (
    <ScrollView keyboardShouldPersistTaps="handled" refreshControl={refreshControl} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  )

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 16, gap: 12 },
})
