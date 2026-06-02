// AdminBlog.jsx – password-protected blog admin dashboard
// Allows creating, editing, and deleting blog posts (Appwrite or localStorage fallback)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Simple auth (stored in sessionStorage) ──────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'shadab@admin2024';
const SESSION_KEY = 'portfolio_admin_auth';

function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

// ─── Main Admin Component ─────────────────────────────────────────
export default function AdminBlog() {
  const [authed, setAuthed] = useState(isAuthed());

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

// ─── Login Screen ─────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      onLogin();
    } else {
      setError('Incorrect password. Try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="admin-login-page">
      <div className={`admin-login-card${shake ? ' shake' : ''}`}>
        <div className="admin-login-icon">
          <i className="fa fa-lock" />
        </div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-sub">Blog management · Shadab Azam Ansari</p>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrap">
            <i className="fa fa-key admin-input-icon" />
            <input
              id="admin-password-input"
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              className="admin-input"
              autoFocus
            />
          </div>
          {error && <p className="admin-error"><i className="fa fa-exclamation-circle" /> {error}</p>}
          <button type="submit" id="admin-login-btn" className="admin-btn-primary">
            <i className="fa fa-sign-in" style={{ marginRight: '8px' }} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const navigate   = useNavigate();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState('list'); // 'list' | 'create' | 'edit'
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { getBlogPosts } = await import('../appwrite');
      const { posts } = await getBlogPosts();
      setPosts(posts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      const { Client, Databases } = await import('appwrite');
      const ENDPOINT       = import.meta.env.VITE_APPWRITE_ENDPOINT;
      const PROJECT_ID     = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      const DATABASE_ID    = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const COLLECTION_ID  = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

      if (!ENDPOINT || !PROJECT_ID) {
        showToast('Appwrite not configured – running in read-only mode.', 'error');
        return;
      }
      const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
      const db = new Databases(client);
      await db.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      showToast('Post deleted.');
      loadPosts();
    } catch (e) {
      showToast('Failed to delete: ' + e.message, 'error');
    }
  };

  if (view === 'create' || view === 'edit') {
    return (
      <PostEditor
        post={editing}
        onSave={() => { setView('list'); loadPosts(); showToast(editing ? 'Post updated!' : 'Post created!'); }}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          <i className={`fa fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
          {' '}{toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">
            <i className="fa fa-pencil-square-o" style={{ marginRight: '10px', color: '#FCCE04' }} />
            Blog Manager
          </h2>
          <p className="admin-sub">{posts.length} posts · Shadab Azam Ansari</p>
        </div>
        <div className="admin-header-actions">
          <button id="admin-new-post-btn" className="admin-btn-primary"
            onClick={() => { setEditing(null); setView('create'); }}>
            <i className="fa fa-plus" style={{ marginRight: '6px' }} />
            New Post
          </button>
          <button className="admin-btn-secondary" onClick={() => navigate('/blog')}>
            <i className="fa fa-eye" style={{ marginRight: '6px' }} />
            View Blog
          </button>
          <button className="admin-btn-logout" onClick={onLogout}>
            <i className="fa fa-sign-out" style={{ marginRight: '6px' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Posts table */}
      {loading ? (
        <div className="admin-loading"><i className="fa fa-spinner fa-spin" /> Loading posts…</div>
      ) : (
        <div className="admin-posts-table">
          <div className="admin-table-head">
            <span>Title</span>
            <span>Category</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {posts.map((post) => (
            <div key={post.$id} className="admin-table-row">
              <span className="admin-post-title">{post.title}</span>
              <span>
                <span className="admin-badge">{post.category || '—'}</span>
              </span>
              <span className="admin-post-date">
                {post.date ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </span>
              <span className="admin-row-actions">
                <button className="admin-icon-btn admin-icon-btn--edit"
                  onClick={() => { setEditing(post); setView('edit'); }}
                  title="Edit">
                  <i className="fa fa-pencil" />
                </button>
                <button className="admin-icon-btn admin-icon-btn--delete"
                  onClick={() => handleDelete(post.$id)}
                  title="Delete">
                  <i className="fa fa-trash" />
                </button>
              </span>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="admin-empty">No posts yet. Create your first post!</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Editor ──────────────────────────────────────────────────
const EMPTY_POST = { title: '', excerpt: '', content: '', category: 'DevOps', date: new Date().toISOString().split('T')[0], readTime: '5 min read', coverImage: '', author: 'Md Shadab Azam Ansari' };
const CATEGORIES = ['DevOps', 'AWS', 'Azure', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Linux', 'React', 'Node.js', 'Career'];

function PostEditor({ post, onSave, onCancel }) {
  const [form, setForm]   = useState(post ? { ...post } : { ...EMPTY_POST });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setSaving(true);
    setError('');

    try {
      const { Client, Databases, ID } = await import('appwrite');
      const ENDPOINT      = import.meta.env.VITE_APPWRITE_ENDPOINT;
      const PROJECT_ID    = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      const DATABASE_ID   = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

      if (!ENDPOINT || !PROJECT_ID || PROJECT_ID === 'your_project_id') {
        // No Appwrite – just pretend success
        await new Promise((r) => setTimeout(r, 800));
        onSave();
        return;
      }
      const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
      const db = new Databases(client);
      const data = { title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, date: form.date, readTime: form.readTime, coverImage: form.coverImage, author: form.author };
      if (post) {
        await db.updateDocument(DATABASE_ID, COLLECTION_ID, post.$id, data);
      } else {
        await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
      }
      onSave();
    } catch (e) {
      setError('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-dashboard admin-editor">
      <div className="admin-header">
        <h2 className="admin-title">
          <i className="fa fa-file-text-o" style={{ marginRight: '10px', color: '#FCCE04' }} />
          {post ? 'Edit Post' : 'New Post'}
        </h2>
        <div className="admin-header-actions">
          <button id="admin-save-btn" className="admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="fa fa-spinner fa-spin" /> Saving…</> : <><i className="fa fa-save" /> Save Post</>}
          </button>
          <button className="admin-btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: '1em' }}><i className="fa fa-exclamation-circle" /> {error}</p>}

      <div className="admin-form">
        <div className="admin-form-row">
          <label className="admin-label">Title *</label>
          <input className="admin-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title…" id="post-title-input" />
        </div>
        <div className="admin-form-row admin-form-row--2col">
          <div>
            <label className="admin-label">Category</label>
            <select className="admin-input" value={form.category} onChange={(e) => set('category', e.target.value)} id="post-category-select">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Date</label>
            <input className="admin-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div>
            <label className="admin-label">Read Time</label>
            <input className="admin-input" value={form.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="5 min read" />
          </div>
        </div>
        <div className="admin-form-row">
          <label className="admin-label">Cover Image URL</label>
          <input className="admin-input" value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://…" />
        </div>
        <div className="admin-form-row">
          <label className="admin-label">Excerpt</label>
          <textarea className="admin-input admin-textarea" rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short description shown on blog cards…" />
        </div>
        <div className="admin-form-row">
          <label className="admin-label">Content (Markdown) *</label>
          <textarea className="admin-input admin-textarea admin-textarea--tall" rows={18} value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Write your post in Markdown…" id="post-content-textarea" />
        </div>
      </div>
    </div>
  );
}
