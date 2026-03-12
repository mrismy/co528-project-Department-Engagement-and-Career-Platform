import React, { useState } from 'react'
import { Text, View } from 'react-native'
import type { PostResponse } from '../types'
import { formatDate } from '../utils/format'
import { Button, Card, Field } from './UI'

export function PostCard({ post, onLike, onComment }: { post: PostResponse; onLike: (id: number) => void; onComment: (id: number, content: string) => void }) {
  const [comment, setComment] = useState('')

  return (
    <Card>
      <Text style={{ fontWeight: '700', color: '#101828' }}>{post.userName}</Text>
      <Text style={{ color: '#667085' }}>{formatDate(post.createdAt)}</Text>
      {!!post.content && <Text style={{ color: '#101828' }}>{post.content}</Text>}
      {!!post.mediaUrl && <Text style={{ color: '#1d4ed8' }}>Media: {post.mediaUrl}</Text>}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Text>Likes: {post.likeCount}</Text>
        <Text>Comments: {post.commentCount}</Text>
      </View>
      <Button title={post.likedByCurrentUser ? 'Unlike' : 'Like'} onPress={() => onLike(post.id)} />
      <Field value={comment} onChangeText={setComment} placeholder="Add comment" />
      <Button title="Comment" onPress={() => { if (comment.trim()) { onComment(post.id, comment.trim()); setComment('') } }} />
      {post.comments.map(item => (
        <View key={item.id} style={{ borderTopWidth: 1, borderTopColor: '#eaecf0', paddingTop: 8 }}>
          <Text style={{ fontWeight: '600' }}>{item.userName}</Text>
          <Text>{item.content}</Text>
        </View>
      ))}
    </Card>
  )
}
