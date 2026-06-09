import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../appwrite';
import { renderContent } from './BlogPost';


// ─── Simple auth (stored in sessionStorage) ──────────────────────
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'md.shadab.azam.ansari@gmail.com';
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
  const [email, setEmail] = useState('');
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !pw.trim()) {
      setError('Email and password are required.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    if (email.trim() === ADMIN_EMAIL && pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      onLogin();
    } else {
      setError('Incorrect email or password. Try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="admin-login-page">
      <div className={`admin-login-card${shake ? ' shake' : ''}`}>
        <h1 className="admin-login-title">Admin Access</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrap">
            <i className="fa fa-envelope admin-input-icon" />
            <input
              id="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Email address"
              className="admin-input"
              autoFocus
              required
            />
          </div>
          <div className="admin-input-wrap">
            <i className="fa fa-key admin-input-icon" />
            <input
              id="admin-password-input"
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(''); }}
              placeholder="Password"
              className="admin-input"
              required
            />
          </div>
          {error && <p className="admin-error"><i className="fa fa-exclamation-circle" /> {error}</p>}
          <button type="submit" id="admin-login-btn" className="admin-btn-primary">
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
      await deleteBlogPost(id);
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
  const [editorTab, setEditorTab] = useState('write'); // 'write' | 'preview'

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const textareaRef = useRef(null);

  const insertTextAtCursor = (textBefore, textAfter = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const selection = value.substring(start, end);
    const replacement = textBefore + selection + textAfter;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    set('content', newValue);

    // Focus back and position cursor appropriately
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textBefore.length + selection.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const insertCodeBlock = (lang) => {
    insertTextAtCursor(`\n\`\`\`${lang}\n`, `\n\`\`\`\n`);
  };

  const wrapSelectionWithBackticks = () => {
    insertTextAtCursor('\`\`\`bash\n', '\n\`\`\`');
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setSaving(true);
    setError('');

    try {
      const data = { title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, date: form.date, readTime: form.readTime, coverImage: form.coverImage, author: form.author };
      if (post) {
        await updateBlogPost(post.$id, data);
      } else {
        await createBlogPost(data);
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
        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Tab selector toggles */}
          <div className="layout-toggles" style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.03)', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              className={`layout-toggle-btn${editorTab === 'write' ? ' active' : ''}`}
              onClick={() => setEditorTab('write')}
              style={{ width: 'auto', padding: '4px 12px', height: '28px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '6px' }}
            >
              Write
            </button>
            <button
              type="button"
              className={`layout-toggle-btn${editorTab === 'preview' ? ' active' : ''}`}
              onClick={() => setEditorTab('preview')}
              style={{ width: 'auto', padding: '4px 12px', height: '28px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '6px' }}
            >
              Preview
            </button>
          </div>

          <button id="admin-save-btn" className="admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><i className="fa fa-spinner fa-spin" /> Saving…</> : <><i className="fa fa-save" /> Save Post</>}
          </button>
          <button className="admin-btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: '1em' }}><i className="fa fa-exclamation-circle" /> {error}</p>}

      {editorTab === 'write' ? (
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
            
            {/* Format Toolbar */}
            <div className="admin-editor-toolbar">
              <button type="button" className="admin-toolbar-btn" onClick={() => insertCodeBlock('bash')} title="Insert Bash Code">
                <i className="fa fa-terminal" /> + Bash Code
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={() => insertCodeBlock('javascript')} title="Insert JS Code">
                <i className="fa fa-code" /> + JavaScript
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={() => insertCodeBlock('html')} title="Insert HTML Sandbox">
                <i className="fa fa-eye" /> + HTML Sandbox
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={() => insertCodeBlock('nginx')} title="Insert Nginx Code">
                <i className="fa fa-server" /> + Nginx Config
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={wrapSelectionWithBackticks} title="Wrap highlighted text in code block">
                <i className="fa fa-quote-left" /> Wrap Highlighted Text
              </button>
            </div>

            <textarea
              ref={textareaRef}
              className="admin-input admin-textarea admin-textarea--tall"
              rows={18}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              placeholder="Write your post in Markdown..."
              id="post-content-textarea"
            />
          </div>
        </div>
      ) : (
        <div className="admin-preview-container" style={{ background: '#ffffff', borderRadius: '16px', padding: '3em 2.5em', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', marginTop: '1.5em' }}>
          <article className="blog-post-detail" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="post-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5em', marginBottom: '2em' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '15px', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: '700' }}>{form.title || 'Untitled Post'}</h1>
              <div className="post-meta" style={{ display: 'flex', gap: '15px', color: '#777', fontSize: '13px', flexWrap: 'wrap' }}>
                {form.date && <span><i className="fa fa-calendar" style={{ marginRight: '5px' }} />{form.date}</span>}
                {form.category && <span><i className="fa fa-tag" style={{ marginRight: '5px' }} />{form.category}</span>}
                {form.readTime && <span><i className="fa fa-clock-o" style={{ marginRight: '5px' }} />{form.readTime}</span>}
                {form.author && <span><i className="fa fa-user" style={{ marginRight: '5px' }} />By {form.author}</span>}
              </div>
            </div>
            
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover Preview" style={{ width: '100%', borderRadius: '12px', marginBottom: '2.5em', objectFit: 'cover', maxHeight: '380px' }} />
            )}
            
            <div className="post-content">
              {renderContent(form.content)}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
