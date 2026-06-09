import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../appwrite';
import { renderContent } from './BlogPost';



const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'md.shadab.azam.ansari@gmail.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'shadab@admin2024';
const SESSION_KEY = 'portfolio_admin_auth';

function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}


export default function AdminBlog() {
  const [authed, setAuthed] = useState(isAuthed());

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}


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


function AdminDashboard({ onLogout }) {
  const navigate   = useNavigate();
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState('list'); 
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  
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
      {}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          <i className={`fa fa-${toast.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
          {' '}{toast.msg}
        </div>
      )}

      {}
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

      {}
      {loading ? (
        <div className="admin-loading"><i className="fa fa-spinner fa-spin" /> Loading posts…</div>
      ) : (
        <div className="admin-posts-table">
          <div className="admin-table-head">
            <span>Cover</span>
            <span>Title</span>
            <span>Category</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {posts.map((post) => (
            <div key={post.$id} className="admin-table-row">
              <div style={{ width: '42px', height: '28px', borderRadius: '4px', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={post.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&q=80'} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&q=80'; }}
                />
              </div>
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


const EMPTY_POST = { title: '', excerpt: '', content: '', category: 'DevOps', date: new Date().toISOString().split('T')[0], readTime: '5 min read', coverImage: '', author: 'Md Shadab Azam Ansari' };
const CATEGORIES = ['DevOps', 'AWS', 'Azure', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Linux', 'React', 'Node.js', 'Career'];

function PostEditor({ post, onSave, onCancel }) {
  const draftKey = `portfolio_blog_draft_${post?.$id || 'new'}`;
  const [form, setForm] = useState(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      return draft ? JSON.parse(draft) : (post ? { ...post } : { ...EMPTY_POST });
    } catch {
      return post ? { ...post } : { ...EMPTY_POST };
    }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [editorTab, setEditorTab] = useState('split');
  const [draftStatus, setDraftStatus] = useState('Draft ready');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    setDraftStatus('Saving draft...');
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(form));
      setDraftStatus('Draft saved');
    }, 500);
    return () => clearTimeout(timer);
  }, [draftKey, form]);

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

  const handleSave = useCallback(async () => {
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
      localStorage.removeItem(draftKey);
      onSave();
    } catch (e) {
      setError('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }, [draftKey, form, onSave, post]);

  const handleEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSave();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('  ');
    }
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [handleSave]);

  const handleEditorScroll = (e) => {
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
  };

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const lineCount = Math.max(form.content.split('\n').length, 1);
  const renderPreview = () => (
    <article className="blog-post-detail admin-ide-article">
      <div className="post-header">
        <h1>{form.title || 'Untitled Post'}</h1>
        <div className="post-meta">
          {form.date && <span><i className="fa fa-calendar" /> {form.date}</span>}
          {form.category && <span><i className="fa fa-tag" /> {form.category}</span>}
          {form.readTime && <span><i className="fa fa-clock-o" /> {form.readTime}</span>}
        </div>
      </div>
      {form.coverImage && <img src={form.coverImage} alt="Cover preview" className="post-cover-img" />}
      <div className="post-content">{renderContent(form.content)}</div>
    </article>
  );

  return (
    <div className="admin-dashboard admin-editor">
      <div className="admin-header">
        <h2 className="admin-title">
          <i className="fa fa-file-text-o" style={{ marginRight: '10px', color: '#FCCE04' }} />
          {post ? 'Edit Post' : 'New Post'}
        </h2>
        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {}
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
              className={`layout-toggle-btn${editorTab === 'split' ? ' active' : ''}`}
              onClick={() => setEditorTab('split')}
              style={{ width: 'auto', padding: '4px 12px', height: '28px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', borderRadius: '6px' }}
            >
              Split
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

      {editorTab !== 'preview' && (
        <div className="admin-form admin-post-fields">
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
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#777', display: 'flex', alignItems: 'center' }}>Quick Presets:</span>
              {[
                { name: 'AWS', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
                { name: 'DevOps', url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80' },
                { name: 'Kubernetes', url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80' },
                { name: 'Code IDE', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80' },
                { name: 'Serverless', url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80' },
              ].map(preset => (
                <button 
                  key={preset.name} 
                  type="button" 
                  onClick={() => set('coverImage', preset.url)}
                  className="admin-toolbar-btn"
                  style={{ padding: '3px 8px', fontSize: '10px' }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-form-row">
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-input admin-textarea" rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short description shown on blog cards…" />
          </div>
          <div className="admin-form-row">
            <label className="admin-label">Content (Markdown) *</label>
            <div className="admin-editor-toolbar">
              <button type="button" className="admin-toolbar-btn" onClick={() => insertTextAtCursor('## ')} title="Insert heading">
                <i className="fa fa-header" /> Heading
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={() => insertTextAtCursor('**', '**')} title="Bold selected text">
                <i className="fa fa-bold" /> Bold
              </button>
              <button type="button" className="admin-toolbar-btn" onClick={() => insertTextAtCursor('- ')} title="Insert list item">
                <i className="fa fa-list-ul" /> List
              </button>
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

            <div className={`admin-ide-workspace admin-ide-workspace--${editorTab}`}>
              <div className="admin-ide-editor">
                <div className="admin-ide-tabbar">
                  <span><i className="fa fa-file-text-o" /> post.md</span>
                  <span>{draftStatus}</span>
                </div>
                <div className="admin-ide-editor-body">
                  <div className="admin-ide-line-numbers" ref={lineNumbersRef}>
                    {Array.from({ length: lineCount }, (_, index) => <div key={index}>{index + 1}</div>)}
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="admin-ide-textarea"
                    value={form.content}
                    onChange={(e) => set('content', e.target.value)}
                    onKeyDown={handleEditorKeyDown}
                    onScroll={handleEditorScroll}
                    placeholder="Start writing Markdown..."
                    id="post-content-textarea"
                    spellCheck="true"
                  />
                </div>
                <div className="admin-ide-statusbar">
                  <span>Markdown</span>
                  <span>{lineCount} lines · {wordCount} words · {form.content.length} chars</span>
                  <span>⌘/Ctrl + S to save</span>
                </div>
              </div>
              {editorTab === 'split' && (
                <div className="admin-ide-preview">
                  <div className="admin-ide-preview-header"><i className="fa fa-eye" /> Live preview</div>
                  <div className="admin-ide-preview-scroll">{renderPreview()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {editorTab === 'preview' && <div className="admin-preview-container">{renderPreview()}</div>}
    </div>
  );
}
