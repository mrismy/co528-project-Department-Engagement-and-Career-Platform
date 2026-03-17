import React, { useCallback, useEffect, useState } from 'react'
import { Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Screen } from '../components/Screen'
import { Button, Card, EmptyState, ErrorText, Field, Heading, SubtleText } from '../components/UI'
import { PostCard } from '../components/PostCard'
import * as postsApi from '../api/posts'
import type { PostResponse } from '../types'

export function FeedScreen() {
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadPosts = useCallback(async () => {
    try {
      setError(null)
      const data = await postsApi.getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load posts')
    }
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])
  useFocusEffect(useCallback(() => { loadPosts() }, [loadPosts]))

  async function handleRefresh() {
    try {
      setRefreshing(true)
      await loadPosts()
    } finally {
      setRefreshing(false)
    }
  }

  async function handleCreate() {
    if (!content.trim()) {
      setError('Post content cannot be empty')
      return
    }
    try {
      setLoading(true)
      await postsApi.createPost({ content: content.trim() })
      setContent('')
      await loadPosts()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const postList = Array.isArray(posts) ? posts : []

  return (
    <Screen refreshing={refreshing} onRefresh={handleRefresh}>
      <Card>
        <Heading>Feed</Heading>
        <SubtleText>Share updates, opportunities, or department news.</SubtleText>
        <Field value={content} onChangeText={setContent} placeholder="Share something with the department..." multiline />
        <Button title="Create post" onPress={handleCreate} loading={loading} />
        <ErrorText message={error} />
      </Card>
      {postList.length === 0 ? <EmptyState title="No posts yet" subtitle="Create the first update for the department community." /> : null}
      {postList.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={async id => { await postsApi.togglePostLike(id); await loadPosts() }}
          onComment={async (id, comment) => { await postsApi.addComment(id, comment); await loadPosts() }}
        />
      ))}
    </Screen>
  )
}
