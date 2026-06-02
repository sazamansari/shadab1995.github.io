// BlogPost – single post detail view, reached via /blog/:id
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPost } from '../appwrite';

export default function BlogPost() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const [post, setPost]       = useState(null);
  const [isMock, setIsMock]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBlogPost(id)
      .then(({ post, isMock }) => {
        if (!post) { setError('Post not found.'); return; }
        setPost(post);
        setIsMock(isMock);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Scroll to top on load
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const dateStr = post?.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="blog-post-wrapper" style={{ minHeight: '100vh', paddingTop: '3em' }}>
      <div className="colorlib-narrow-content">
        <button className="btn-back" onClick={() => navigate('/#blog')} id="blog-back-btn">
          <i className="fa fa-arrow-left" /> Back to Blog
        </button>

        {loading && (
          <div className="blog-loading">
            <i className="fa fa-spinner fa-spin" style={{ marginRight: '10px' }} />
            Loading…
          </div>
        )}

        {error && (
          <div className="blog-loading" style={{ color: '#ec5453' }}>
            <i className="fa fa-exclamation-circle" style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        {!loading && !error && post && (
          <article className="blog-post-detail">
            <div className="post-header">
              <h1>{post.title}</h1>
              <div className="post-meta">
                {dateStr && (
                  <span>
                    <i className="fa fa-calendar" style={{ marginRight: '5px' }} />
                    {dateStr}
                  </span>
                )}
                {post.author && (
                  <span>
                    <i className="fa fa-user" style={{ marginRight: '5px' }} />
                    {post.author}
                  </span>
                )}
                {post.category && (
                  <span>
                    <i className="fa fa-tag" style={{ marginRight: '5px' }} />
                    {post.category}
                  </span>
                )}
                {post.readTime && (
                  <span>
                    <i className="fa fa-clock-o" style={{ marginRight: '5px' }} />
                    {post.readTime}
                  </span>
                )}
              </div>
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="post-cover-img"
              />
            )}

            <div className="post-content">
              {renderContent(post.content)}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

/**
 * Renders plain-text blog content with basic markdown-like formatting.
 * Handles: ## headings, ``` code blocks, **bold**, bullet lists, paragraphs.
 */
function renderContent(content) {
  if (!content) return null;

  const blocks = content.split('\n\n');
  return blocks.map((block, i) => {
    const trimmed = block.trim();

    // Code block
    if (trimmed.startsWith('```')) {
      const lines = trimmed.split('\n');
      const lang  = lines[0].replace('```', '').trim();
      const code  = lines.slice(1, lines[lines.length - 1] === '```' ? lines.length - 1 : lines.length).join('\n');
      return (
        <pre
          key={i}
          style={{
            background: '#f4f4f4',
            borderLeft: '4px solid #2c98f0',
            padding: '1em 1.2em',
            borderRadius: '4px',
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: '1.5em 0',
          }}
        >
          <code>{code}</code>
        </pre>
      );
    }

    // H2 heading
    if (trimmed.startsWith('## ')) {
      return <h2 key={i}>{trimmed.replace(/^## /, '')}</h2>;
    }

    // H3 heading
    if (trimmed.startsWith('### ')) {
      return <h3 key={i}>{trimmed.replace(/^### /, '')}</h3>;
    }

    // Bullet list
    if (trimmed.split('\n').every((l) => l.trimStart().startsWith('- '))) {
      return (
        <ul key={i} style={{ paddingLeft: '1.5em' }}>
          {trimmed.split('\n').map((line, j) => (
            <li key={j} style={{ marginBottom: '0.4em' }}>
              {inlineFormat(line.replace(/^[-\s]+/, ''))}
            </li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (trimmed.split('\n').every((l) => /^\d+\./.test(l.trimStart()))) {
      return (
        <ol key={i} style={{ paddingLeft: '1.5em' }}>
          {trimmed.split('\n').map((line, j) => (
            <li key={j} style={{ marginBottom: '0.4em' }}>
              {inlineFormat(line.replace(/^\d+\.\s*/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    // Default paragraph
    return <p key={i}>{inlineFormat(trimmed)}</p>;
  });
}

/** Handles **bold** and `inline code` inside a text string */
function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{ background: '#f0f0f0', padding: '1px 5px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '13px' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
