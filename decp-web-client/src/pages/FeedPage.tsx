import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { addComment, createPost, deletePost, getPosts, togglePostLike, uploadMedia } from '../api/posts'
import type { MediaType, PostResponse } from '../types'
import PageHeader from '../components/PageHeader'
import ErrorBanner from '../components/ErrorBanner'
import { formatDateTime, getApiError } from '../utils'
import { useAuth } from '../store/AuthContext'

export default function FeedPage() {
  const { auth } = useAuth()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ content: '', mediaUrl: '', mediaType: 'NONE' as MediaType })
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

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

  useEffect(() => { void load() }, [])

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadMedia(file)
      const mType: MediaType = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE'
      setForm(s => ({ ...s, mediaUrl: url, mediaType: mType }))
      setPreviewUrl(url)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createPost({
        content: form.content || undefined,
        mediaUrl: form.mediaUrl || undefined,
        mediaType: form.mediaType,
      })
      setForm({ content: '', mediaUrl: '', mediaType: 'NONE' })
      setPreviewUrl('')
      if (fileInputRef.current) fileInputRef.current.value = ''
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
      setCommentInputs(s => ({ ...s, [postId]: '' }))
      await load()
    } catch (err) {
      setError(getApiError(err))
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm('Delete this post?')) return
    try {
      await deletePost(postId)
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

      {/* Create post form */}
      <form className="card form-grid" onSubmit={handleCreate}>
        <h3>Create post</h3>
        <textarea
          placeholder="What would you like to share?"
          value={form.content}
          onChange={e => setForm(s => ({ ...s, content: e.target.value }))}
        />

        {/* File upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label className="secondary-btn" style={{ cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : '📎 Attach image/video'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {/* Or paste URL manually */}
          <input
            style={{ flex: 1, minWidth: 200 }}
            placeholder="…or paste a media URL"
            value={form.mediaUrl}
            onChange={e => {
              setForm(s => ({ ...s, mediaUrl: e.target.value, mediaType: e.target.value ? 'IMAGE' : 'NONE' }))
              setPreviewUrl(e.target.value)
            }}
          />

          {form.mediaUrl && (
            <select
              value={form.mediaType}
              onChange={e => setForm(s => ({ ...s, mediaType: e.target.value as MediaType }))}
            >
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Video</option>
              <option value="NONE">None</option>
            </select>
          )}
        </div>

        {/* Preview */}
        {previewUrl && form.mediaType === 'IMAGE' && (
          <img src={previewUrl} alt="preview" style={{ maxHeight: 200, borderRadius: 8, objectFit: 'cover' }} />
        )}
        {previewUrl && form.mediaType === 'VIDEO' && (
          <video src={previewUrl} controls style={{ maxHeight: 200, borderRadius: 8, width: '100%' }} />
        )}

        <button className="primary-btn">Publish</button>
      </form>

      {/* Post list */}
      {loading ? (
        <div className="card">Loading posts…</div>
      ) : (
        <div className="stack">
          {posts.map(post => (
            <div key={post.id} className="card">
              <div className="post-top">
                <div>
                  <h3>{post.userName}</h3>
                  <p>{formatDateTime(post.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {post.sharedPostId ? <span className="pill">Shared #{post.sharedPostId}</span> : null}
                  {/* Delete button: only for the author */}
                  {auth?.userId === post.userId && (
                    <button
                      className="secondary-btn"
                      style={{ color: '#b42318', borderColor: '#b42318' }}
                      onClick={() => void handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {post.content ? <p className="body-copy">{post.content}</p> : null}

              {/* Inline media display */}
              {post.mediaUrl && post.mediaType === 'IMAGE' && (
                <img
                  src={post.mediaUrl}
                  alt="post media"
                  style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, objectFit: 'cover', marginTop: 8 }}
                />
              )}
              {post.mediaUrl && post.mediaType === 'VIDEO' && (
                <video
                  src={post.mediaUrl}
                  controls
                  style={{ width: '100%', maxHeight: 400, borderRadius: 8, marginTop: 8 }}
                />
              )}
              {post.mediaUrl && post.mediaType === 'NONE' && (
                <a href={post.mediaUrl} target="_blank" rel="noreferrer" className="inline-link">
                  Open attachment
                </a>
              )}

              <div className="action-row">
                <button className="secondary-btn" onClick={() => void handleLike(post.id)}>
                  {post.likedByCurrentUser ? '❤️ Unlike' : '🤍 Like'} ({post.likeCount})
                </button>
                <span className="muted">💬 {post.commentCount} comments</span>
              </div>

              <div className="comment-box">
                <input
                  placeholder="Write a comment…"
                  value={commentInputs[post.id] || ''}
                  onChange={e => setCommentInputs(s => ({ ...s, [post.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') void handleComment(post.id) }}
                />
                <button className="secondary-btn" onClick={() => void handleComment(post.id)}>
                  Comment
                </button>
              </div>

              <div className="stack compact">
                {post.comments?.map(comment => (
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
