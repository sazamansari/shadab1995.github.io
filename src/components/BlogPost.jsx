// BlogPost – single post detail view, reached via /blog/:id
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogPost, getBlogPosts } from '../appwrite';

export default function BlogPost() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const [post, setPost]       = useState(null);
  const [isMock, setIsMock]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

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

  // Dynamically update SEO metadata for individual blog posts
  useEffect(() => {
    if (!post) return;

    const title = `${post.title} | Md Shadab Azam Ansari Blog`;
    const rawContent = post.content || '';
    const cleanDesc = rawContent
      .replace(/##\s+/g, '')
      .replace(/###\s+/g, '')
      .replace(/\*\*|`/g, '')
      .replace(/-\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const description = cleanDesc.length > 160 ? cleanDesc.slice(0, 157) + '...' : cleanDesc;

    document.title = title;

    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const fullUrl = `https://md-shadab-azam-ansari.vercel.app/#/blog/${post.$id || id}`;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullUrl);
    if (post.coverImage) {
      setMetaTag('property', 'og:image', post.coverImage);
      setMetaTag('name', 'twitter:image', post.coverImage);
    }

    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', fullUrl);
    }
  }, [post, id]);

  // Reading scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Construct Table of Contents from markdown headers
  useEffect(() => {
    if (!post || !post.content) return;
    const lines = post.content.split('\n');
    const extractedHeadings = [];
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace(/^## /, '');
        const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        extractedHeadings.push({ type: 'h2', title, id: headingId });
      } else if (trimmed.startsWith('### ')) {
        const title = trimmed.replace(/^### /, '');
        const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        extractedHeadings.push({ type: 'h3', title, id: headingId });
      }
    });
    setToc(extractedHeadings);
  }, [post]);

  // Load related posts
  useEffect(() => {
    if (!post) return;
    getBlogPosts()
      .then(({ posts }) => {
        const related = posts
          .filter((p) => p.category === post.category && p.$id !== post.$id)
          .slice(0, 3);
        setRelatedPosts(related);
      })
      .catch((err) => console.error('Failed to load related posts:', err));
  }, [post]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Check out this post: "${post.title}" by Md Shadab Azam Ansari`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const dateStr = post?.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="blog-post-wrapper" style={{ minHeight: '100vh', paddingTop: '3em' }}>
      {/* Scroll Progress Bar at the Top */}
      <div className="reading-progress-bar-container">
        <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

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

              {/* Share utilities widget */}
              <div className="blog-share-widget">
                <span className="share-title">Share Article:</span>
                <button className="share-btn twitter" onClick={shareTwitter} id="btn-share-twitter">
                  <i className="fa fa-twitter" /> Twitter/X
                </button>
                <button className="share-btn linkedin" onClick={shareLinkedIn} id="btn-share-linkedin">
                  <i className="fa fa-linkedin" /> LinkedIn
                </button>
                <button className="share-btn copy-link" onClick={copyToClipboard} id="btn-share-copy">
                  <i className="fa fa-link" /> Copy Link
                </button>
                {showToast && <span className="share-toast" id="copy-success-toast">Link copied!</span>}
              </div>
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="post-cover-img"
              />
            )}

            {/* Table of Contents card */}
            {toc.length > 0 && (
              <div className="blog-toc-card" id="blog-toc-card">
                <h4>Table of Contents</h4>
                <ul className="blog-toc-list">
                  {toc.map((heading, idx) => (
                    <li key={idx} className={`blog-toc-item indent-${heading.type}`}>
                      <a href={`#${heading.id}`} onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(heading.id);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        {heading.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="post-content">
              {renderContent(post.content)}
            </div>

            {/* Related Articles grid */}
            {relatedPosts.length > 0 && (
              <div className="related-articles-section" id="related-articles-section">
                <h3>Related Articles</h3>
                <div className="related-grid">
                  {relatedPosts.map((related) => (
                    <div key={related.$id} className="related-card">
                      {related.coverImage && (
                        <div className="related-img-wrap">
                          <img src={related.coverImage} alt={related.title} />
                        </div>
                      )}
                      <div className="related-content">
                        <span className="related-category">{related.category}</span>
                        <h4>
                          <Link to={`/blog/${related.$id}`}>{related.title}</Link>
                        </h4>
                        <Link to={`/blog/${related.$id}`} className="related-read-more">
                          Read Post <i className="fa fa-long-arrow-right" style={{ marginLeft: '4px' }} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

/**
 * Renders plain-text blog content with basic markdown-like formatting.
 * Handles: ## headings, ``` code blocks, **bold**, bullet lists, paragraphs.
 * Automatically detects and elevates shell commands and server configurations to interactive code blocks.
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
      return <InteractiveCodeBlock key={i} code={code} lang={lang} />;
    }

    // H2 heading
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^## /, '');
      const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 key={i} id={headingId}>{title}</h2>;
    }

    // H3 heading
    if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^### /, '');
      const headingId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 key={i} id={headingId}>{title}</h3>;
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

    // Smart Nginx Configuration Block Detection
    const isNginxConfig = trimmed.includes('server {') || trimmed.includes('location /') || (trimmed.includes('listen ') && trimmed.includes(';')) || (trimmed.includes('server_name ') && trimmed.includes(';'));
    if (isNginxConfig) {
      return <InteractiveCodeBlock key={i} code={trimmed} lang="nginx" />;
    }

    // Smart JSON Block Detection
    if (trimmed.startsWith('{') && trimmed.endsWith('}') && (trimmed.includes('":') || trimmed.includes("':"))) {
      return <InteractiveCodeBlock key={i} code={trimmed} lang="json" />;
    }

    // Smart Bash Command Detection
    const lines = block.split('\n');
    const hasAnyCode = lines.some(line => {
      const COMMAND_WORDS = [
        'sudo', 'npm', 'docker', 'kubectl', 'pm2', 'tofu', 'helm', 
        'zip', 'unzip', 'scp', 'ssh', 'cd', 'ls', 'cat', 'git', 
        'echo', 'curl', 'wget', 'chmod', 'chown', 'mkdir', 'rm', 
        'mv', 'cp', 'tar', 'pwd', 'make', 'grep', 'vi'
      ];
      const trimmedLine = line.trim();
      if (!trimmedLine) return false;
      if (line.toLowerCase().includes('sudo ')) return true;
      const firstWord = trimmedLine.split(/\s+/)[0].toLowerCase();
      return COMMAND_WORDS.includes(firstWord);
    });

    if (hasAnyCode) {
      return (
        <div key={i} style={{ margin: '1.2em 0' }}>
          {lines.map((line, lineIdx) => {
            const parsed = parseLineWithCode(line);
            if (parsed.isCode) {
              return (
                <React.Fragment key={lineIdx}>
                  {parsed.prefix && <p style={{ margin: '0.5em 0' }}>{inlineFormat(parsed.prefix)}</p>}
                  <InteractiveCodeBlock code={parsed.code} lang="bash" />
                  {parsed.suffix && <p style={{ margin: '0.5em 0' }}>{inlineFormat(parsed.suffix)}</p>}
                </React.Fragment>
              );
            } else {
              return line.trim() ? <p key={lineIdx} style={{ margin: '0.5em 0' }}>{inlineFormat(line)}</p> : null;
            }
          })}
        </div>
      );
    }

    // Default paragraph
    return <p key={i}>{inlineFormat(trimmed)}</p>;
  });
}

/** Helper function to parse plain text lines looking for shell command code blocks */
function parseLineWithCode(line) {
  const COMMAND_WORDS = [
    'sudo', 'npm', 'docker', 'kubectl', 'pm2', 'tofu', 'helm', 
    'zip', 'unzip', 'scp', 'ssh', 'cd', 'ls', 'cat', 'git', 
    'echo', 'curl', 'wget', 'chmod', 'chown', 'mkdir', 'rm', 
    'mv', 'cp', 'tar', 'pwd', 'make', 'grep', 'vi'
  ];

  const trimmedLine = line.trim();
  let codeStartIdx = -1;
  let matchingWord = '';

  if (line.toLowerCase().includes('sudo ')) {
    codeStartIdx = line.toLowerCase().indexOf('sudo ');
    matchingWord = 'sudo';
  } else {
    const firstWord = trimmedLine.split(/\s+/)[0].toLowerCase();
    if (COMMAND_WORDS.includes(firstWord)) {
      codeStartIdx = line.indexOf(trimmedLine.split(/\s+/)[0]);
      matchingWord = firstWord;
    }
  }

  if (codeStartIdx !== -1) {
    const prefixText = line.substring(0, codeStartIdx).trim();
    const rest = line.substring(codeStartIdx);
    
    // Separation keywords for next text step description
    const separatorRegex = /\b(Step \d+|[1-9]\d*\.\s+|Add the following|Ensure proper|Create the required|Create a production|Install Nginx|Start the nginx)\b/i;
    const match = rest.substring(matchingWord.length).match(separatorRegex);
    
    if (match) {
      const matchIdx = matchingWord.length + match.index;
      const codePart = rest.substring(0, matchIdx).trim();
      const suffixText = rest.substring(matchIdx).trim();
      return {
        isCode: true,
        prefix: prefixText,
        code: codePart,
        suffix: suffixText
      };
    } else {
      return {
        isCode: true,
        prefix: prefixText,
        code: rest.trim(),
        suffix: ''
      };
    }
  }

  return { isCode: false, text: line };
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

/** InteractiveCodeBlock component for rich code displays, copy features, and playground linking */
function InteractiveCodeBlock({ code, lang }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    navigate('/playground', { state: { code, language: lang } });
  };

  const cleanLang = lang ? lang.toLowerCase().trim() : 'code';
  const displayLang = lang ? lang.trim() : 'CODE';

  return (
    <div className="interactive-code-container">
      <div className="interactive-code-header">
        <span className={`interactive-code-lang ${cleanLang}`}>{displayLang}</span>
        <div className="interactive-code-actions">
          <button className="interactive-code-btn" onClick={handleCopy} title="Copy code">
            {copied ? (
              <>
                <i className="fa fa-check" style={{ color: 'var(--teal)' }} /> Copied!
              </>
            ) : (
              <>
                <i className="fa fa-copy" /> Copy
              </>
            )}
          </button>
          {['javascript', 'js', 'html', 'css', 'python', 'py'].includes(cleanLang) && (
            <button className="interactive-code-btn btn-run" onClick={handleRun} title="Run in Sandbox">
              <i className="fa fa-play" /> Run
            </button>
          )}
        </div>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

