import { FormEvent, useEffect, useState } from 'react'
import { addComment, createPost, getPosts, togglePostLike } from '../api/posts'
import type { MediaType, PostResponse } from '../types'
import PageHeader from '../components/PageHeader'
import ErrorBanner from '../components/ErrorBanner'
import { formatDateTime, getApiError } from '../utils'

export default function FeedPage() {
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    content: '',
    mediaUrl: '',
    mediaType: 'NONE' as MediaType,
    sharedPostId: '',
  })
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})

  async function load() {
    setLoading(true)
    try {
      setPosts(await getPosts())
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createPost({
        content: form.content || undefined,
        mediaUrl: form.mediaUrl || undefined,
        mediaType: form.mediaType,
        sharedPostId: form.sharedPostId ? Number(form.sharedPostId) : undefined,
      })
      setForm({ content: '', mediaUrl: '', mediaType: 'NONE', sharedPostId: '' })
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleLike(postId: number) {
    try {
      await togglePostLike(postId)
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleComment(postId: number) {
    const content = commentInputs[postId]?.trim()
    if (!content) return
    try {
      await addComment(postId, content)
      setCommentInputs((s) => ({ ...s, [postId]: '' }))
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Department Feed"
        subtitle="Share updates, research wins, internship news, and alumni engagement posts."
      />
      <ErrorBanner message={error} />

      <form className="card form-grid" onSubmit={handleCreate}>
        <h3>Create post</h3>
        <textarea
          placeholder="What would you like to share?"
          value={form.content}
          onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
        />
        <div className="three-col">
          <label>
            Media URL
            <input value={form.mediaUrl} onChange={(e) => setForm((s) => ({ ...s, mediaUrl: e.target.value }))} />
          </label>
          <label>
            Media type
            <select value={form.mediaType} onChange={(e) => setForm((s) => ({ ...s, mediaType: e.target.value as MediaType }))}>
              <option value="NONE">None</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>
          <label>
            Shared post ID
            <input value={form.sharedPostId} onChange={(e) => setForm((s) => ({ ...s, sharedPostId: e.target.value }))} />
          </label>
        </div>
        <button className="primary-btn">Publish</button>
      </form>

      {loading ? (
        <div className="card">Loading posts...</div>
      ) : (
        <div className="stack">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="post-top">
                <div>
                  <h3>{post.userName}</h3>
                  <p>{formatDateTime(post.createdAt)}</p>
                </div>
                {post.sharedPostId ? <span className="pill">Shared #{post.sharedPostId}</span> : null}
              </div>

              {post.content ? <p className="body-copy">{post.content}</p> : null}
              {post.mediaUrl ? (
                <a href={post.mediaUrl} target="_blank" rel="noreferrer" className="inline-link">
                  Open {post.mediaType.toLowerCase()}
                </a>
              ) : null}

              <div className="action-row">
                <button className="secondary-btn" onClick={() => void handleLike(post.id)}>
                  {post.likedByCurrentUser ? 'Unlike' : 'Like'} ({post.likeCount})
                </button>
                <span className="muted">Comments: {post.commentCount}</span>
              </div>

              <div className="comment-box">
                <input
                  placeholder="Write a comment"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs((s) => ({ ...s, [post.id]: e.target.value }))}
                />
                <button className="secondary-btn" onClick={() => void handleComment(post.id)}>
                  Comment
                </button>
              </div>

              <div className="stack compact">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="sub-card">
                    <strong>{comment.userName}</strong>
                    <p>{comment.content}</p>
                    <small>{formatDateTime(comment.createdAt)}</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
