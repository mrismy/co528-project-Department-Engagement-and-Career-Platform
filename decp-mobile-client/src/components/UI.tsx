import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>
}

export function Heading({ children }: { children: React.ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>
}

export function SubtleText({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtle}>{children}</Text>
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>
}

export function Field(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholderTextColor="#7b8794" style={[styles.input, props.multiline && styles.multiline]} {...props} />
}

export function Button({ title, onPress, disabled, loading, variant = 'primary' }: { title: string; onPress: () => void; disabled?: boolean; loading?: boolean; variant?: 'primary' | 'secondary' }) {
  return (
    <Pressable style={[styles.button, variant === 'secondary' && styles.buttonSecondary, disabled && styles.buttonDisabled]} disabled={disabled || loading} onPress={onPress}>
      {loading ? <ActivityIndicator color={variant === 'secondary' ? '#1d4ed8' : '#fff'} /> : <Text style={[styles.buttonText, variant === 'secondary' && styles.buttonTextSecondary]}>{title}</Text>}
    </Pressable>
  )
}

export function ErrorText({ message }: { message?: string | null }) {
  if (!message) return null
  return <Text style={styles.error}>{message}</Text>
}

export function SuccessText({ message }: { message?: string | null }) {
  if (!message) return null
  return <Text style={styles.success}>{message}</Text>
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.subtle}>{subtitle}</Text>}
    </View>
  )
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heading: { fontSize: 22, fontWeight: '700', color: '#101828' },
  subtle: { color: '#667085' },
  label: { fontSize: 14, fontWeight: '600', color: '#344054' },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: '#101828',
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: '#c7d7fe',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: '#1d4ed8' },
  error: { color: '#b42318' },
  success: { color: '#027a48' },
  emptyWrap: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#101828' },
})
