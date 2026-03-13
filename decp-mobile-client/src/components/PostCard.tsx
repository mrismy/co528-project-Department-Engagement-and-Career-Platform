import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import type { PostResponse } from '../types'
import { formatDate } from '../utils/format'
import { Button, Card, Field } from './UI'
import { useAuth } from '../contexts/AuthContext'
import * as postsApi from '../api/posts'

/** Coloured circle with the first two initials of the user's name */
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Pick a colour deterministically from the name
  const colours = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2']
  const idx = name.charCodeAt(0) % colours.length
  const bg = colours[idx]

  return (
    <View style={{
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: bg,
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{initials}</Text>
    </View>
  )
}

export function PostCard({ post, onLike, onComment }: {
  post: PostResponse
  onLike: (id: number) => void
  onComment: (id: number, content: string) => void
}) {
  const { user } = useAuth()
  const [comment, setComment] = React.useState('')
  const [deleting, setDeleting] = React.useState(false)

  async function handleDelete() {
    setDeleting(true)
    try { await postsApi.deletePost(post.id) } finally { setDeleting(false) }
  }

  return (
    <Card>
      {/* Header row: avatar + name + date + delete */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar name={post.userName} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', color: '#101828', fontSize: 15 }}>{post.userName}</Text>
          <Text style={{ color: '#98a2b3', fontSize: 11 }}>{formatDate(post.createdAt)}</Text>
        </View>
        {user?.userId === post.userId && (
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => ({
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: pressed ? '#fee2e2' : '#fef2f2',
              alignItems: 'center', justifyContent: 'center',
            })}
          >
            <Text style={{ fontSize: 15 }}>🗑</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      {!!post.content && (
        <Text style={{ color: '#344054', lineHeight: 22, fontSize: 14 }}>{post.content}</Text>
      )}

      {/* Inline image */}
      {!!post.mediaUrl && post.mediaType === 'IMAGE' && (
        <Image
          source={{ uri: post.mediaUrl }}
          style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 4 }}
          resizeMode="cover"
        />
      )}
      {!!post.mediaUrl && post.mediaType !== 'IMAGE' && (
        <Text style={{ color: '#1d4ed8', fontSize: 13 }}>📎 {post.mediaUrl}</Text>
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#f2f4f7' }} />

      {/* Actions row */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Button
          title={post.likedByCurrentUser ? '❤️ Unlike' : '🤍 Like'}
          variant={post.likedByCurrentUser ? 'primary' : 'secondary'}
          onPress={() => onLike(post.id)}
        />
        <Text style={{ color: '#667085', fontSize: 13 }}>💬 {post.commentCount}</Text>
        <Text style={{ color: '#667085', fontSize: 13 }}>❤️ {post.likeCount}</Text>
      </View>

      {/* Comment box */}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Field
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment…"
          style={{ flex: 1 }}
        />
        <Button
          title="→"
          variant="primary"
          onPress={() => {
            if (comment.trim()) {
              onComment(post.id, comment.trim())
              setComment('')
            }
          }}
        />
      </View>

      {/* Comments list */}
      {(post.comments ?? []).map(item => (
        <View key={item.id} style={{
          flexDirection: 'row', gap: 8, alignItems: 'flex-start',
          borderTopWidth: 1, borderTopColor: '#f2f4f7', paddingTop: 8,
        }}>
          <Avatar name={item.userName} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600', color: '#101828', fontSize: 13 }}>{item.userName}</Text>
            <Text style={{ color: '#344054', fontSize: 13 }}>{item.content}</Text>
          </View>
        </View>
      ))}
    </Card>
  )
}
