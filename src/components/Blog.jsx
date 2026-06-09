// Blog section – Restructured into a modern two-column feed with interactive widgets
// Fetches from Appwrite or falls back to mock data
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimateBox from './AnimateBox';
import { getBlogPosts } from '../appwrite';

const CATEGORIES = ['All', 'DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Full Stack', 'Career'];

export default function Blog() {
  const [posts, setPosts]           = useState([]);
  const [isMock, setIsMock]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'
  
  // Mini Playground states
  const [miniLang, setMiniLang] = useState('javascript');
  const [miniCode, setMiniCode] = useState('// JavaScript\nconst name = "Shadab";\nconsole.log(`Hello, welcome to ${name}\'s blog!`);');
  const [miniLogs, setMiniLogs] = useState([]);

  const postsPerPage = 6;

  useEffect(() => {
    getBlogPosts()
      .then(({ posts, isMock }) => {
        setPosts(posts);
        setIsMock(isMock);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter posts based on category and search keywords
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate dynamic counts for categories based on loaded articles
  const categoryCounts = {
    All: posts.length,
    ...CATEGORIES.reduce((acc, cat) => {
      if (cat !== 'All') {
        acc[cat] = posts.filter((p) => p.category === cat).length;
      }
      return acc;
    }, {})
  };

  // Autocomplete search suggestions (max 5)
  const suggestions = search.trim() !== ''
    ? posts.filter((post) => post.title.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  // Extract a Featured Article: Only show at page 1 when no filters/searches are active
  const isDefaultState = activeCategory === 'All' && search.trim() === '' && currentPage === 1;
  const featuredPost = isDefaultState && posts.length > 0 ? posts[0] : null;

  // Exclude featured post from normal grid to avoid duplication
  const normalPosts = filteredPosts.filter((post) => !featuredPost || post.$id !== featuredPost.$id);

  // Calculate pagination variables
  const totalPages = Math.ceil(normalPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = normalPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setShowSuggestions(true);
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Scroll to blog section when page changes
  useEffect(() => {
    if (!loading && currentPage > 1) {
      const element = document.getElementById('blog');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentPage, loading]);

  // Mini IDE execution scripts
  const runMiniCode = () => {
    setMiniLogs([{ type: 'system', text: 'Running...' }]);
    
    if (miniLang === 'javascript') {
      const originalLog = console.log;
      const originalError = console.error;
      const outputs = [];

      console.log = (...args) => {
        outputs.push({ type: 'log', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
      };
      console.error = (...args) => {
        outputs.push({ type: 'error', text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
      };

      try {
        const result = new Function(miniCode)();
        if (result !== undefined) {
          outputs.push({ type: 'system', text: `Returned: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}` });
        }
      } catch (err) {
        outputs.push({ type: 'error', text: `${err.name}: ${err.message}` });
      }

      console.log = originalLog;
      console.error = originalError;
      
      setMiniLogs(outputs.length > 0 ? outputs : [{ type: 'system', text: 'Script ran (no logs generated).' }]);
    } 
    else if (miniLang === 'python') {
      const outputs = [];
      const lines = miniCode.split('\n');
      let jsCode = '';

      for (let line of lines) {
        let trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        if (trimmed.startsWith('print(')) {
          let inside = trimmed.substring(6, trimmed.lastIndexOf(')'));
          jsCode += `console.log(${inside});\n`;
        } else if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed)) {
          const varName = trimmed.split('=')[0].trim();
          const valPart = trimmed.substring(trimmed.indexOf('=') + 1).trim();
          jsCode += `if (typeof ${varName} === 'undefined') { var ${varName} = ${valPart}; } else { ${varName} = ${valPart}; }\n`;
        } else {
          jsCode += trimmed + ';\n';
        }
      }

      const captured = [];
      const originalLog = console.log;
      console.log = (...args) => {
        captured.push({ type: 'log', text: args.join(' ') });
      };

      try {
        const runFn = new Function(jsCode);
        runFn();
      } catch (err) {
        outputs.push({ type: 'error', text: `RuntimeError: ${err.message}` });
      }

      console.log = originalLog;
      outputs.push(...captured);
      outputs.push({ type: 'system', text: 'Execution completed.' });
      setMiniLogs(outputs);
    }
    else if (miniLang === 'html') {
      setMiniLogs([{ type: 'system', text: 'HTML live preview runs inside the full Code Playground page.' }]);
    }
  };

  const handleMiniLangChange = (lang) => {
    setMiniLang(lang);
    if (lang === 'javascript') {
      setMiniCode('// JavaScript\nconst numbers = [1, 2, 3, 4];\nconst squared = numbers.map(n => n * n);\nconsole.log("Squared:", squared);');
    } else if (lang === 'python') {
      setMiniCode('# Python\nx = 15\ny = 25\nprint("Product of x and y is:", x * y)');
    } else if (lang === 'html') {
      setMiniCode('<!-- HTML -->\n<h3>Welcome to the Sandbox</h3>\n<p>Edit in full playground mode!</p>');
    }
  };

  return (
    <section className="colorlib-blog" data-section="blog" id="blog">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h2>Blog</h2>
                    <p>Insights on Cloud, DevOps, and Full Stack engineering — from production experience.</p>
                  </div>
                </div>
              </div>
            </AnimateBox>

            {/* RESTURED TWO-COLUMN GRID SYSTEM */}
            <div className="blog-layout-container">
              
              {/* Left Column: Content Feed */}
              <div className="blog-main-feed">
                {featuredPost && (
                  <AnimateBox effect="fadeIn" delay={100}>
                    <FeaturedBlogCard post={featuredPost} />
                  </AnimateBox>
                )}

                {/* Feed Controls (Stats + Grid/List Toggles) */}
                <div className="blog-feed-header">
                  <p className="blog-feed-stats">
                    Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in "${activeCategory}"` : ''}
                  </p>
                  <div className="layout-toggles">
                    <button 
                      className={`layout-toggle-btn${layoutMode === 'grid' ? ' active' : ''}`}
                      onClick={() => setLayoutMode('grid')}
                      title="Grid Card View"
                    >
                      <i className="fa fa-th-large" />
                    </button>
                    <button 
                      className={`layout-toggle-btn${layoutMode === 'list' ? ' active' : ''}`}
                      onClick={() => setLayoutMode('list')}
                      title="List Row View"
                    >
                      <i className="fa fa-list" />
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="blog-loading">
                    <i className="fa fa-spinner fa-spin" style={{ marginRight: '10px' }} />
                    Loading posts…
                  </div>
                )}

                {error && (
                  <div className="blog-loading" style={{ color: '#ec5453' }}>
                    <i className="fa fa-exclamation-circle" style={{ marginRight: '8px' }} />
                    Failed to load posts: {error}
                  </div>
                )}

                {!loading && !error && (
                  <>
                    <div className={layoutMode === 'grid' ? 'blog-grid' : 'blog-feed-list'}>
                      {currentPosts.map((post, idx) => (
                        <AnimateBox key={post.$id} effect="fadeIn" delay={(idx % postsPerPage) * 40}>
                          <BlogCard post={post} layoutMode={layoutMode} />
                        </AnimateBox>
                      ))}
                    </div>

                    {filteredPosts.length === 0 && (
                      <div className="blog-empty-search">
                        <i className="fa fa-search-minus" />
                        <p>No articles found matching "{search}" in category "{activeCategory}".</p>
                      </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="blog-pagination">
                        <button
                          className="pagination-btn pagination-prev"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <i className="fa fa-angle-left" style={{ marginRight: '5px' }} /> Prev
                        </button>

                        <div className="pagination-numbers">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              className={`pagination-number${currentPage === page ? ' active' : ''}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          className="pagination-btn pagination-next"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next <i className="fa fa-angle-right" style={{ marginLeft: '5px' }} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Column: Sidebar Widgets */}
              <div className="blog-sidebar-widgets">
                
                {/* Search Widget */}
                <div className="blog-sidebar-widget widget-search">
                  <h4 className="widget-title">
                    <i className="fa fa-search" /> Search Articles
                  </h4>
                  <div className="blog-search-box" style={{ maxWidth: '100%' }}>
                    <i className="fa fa-search search-icon" />
                    <input
                      id="blog-search-input"
                      type="text"
                      placeholder="Search articles..."
                      value={search}
                      onChange={handleSearchChange}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      autoComplete="off"
                    />
                    {search && (
                      <button className="search-clear-btn" onClick={() => { setSearch(''); setCurrentPage(1); }}>
                        <i className="fa fa-times" />
                      </button>
                    )}

                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="blog-search-suggestions" id="search-suggestions-dropdown">
                        {suggestions.map((sug) => (
                          <li
                            key={sug.$id}
                            className="blog-suggestion-item"
                            onClick={() => {
                              setSearch(sug.title);
                              setShowSuggestions(false);
                              setCurrentPage(1);
                            }}
                          >
                            <i className="fa fa-file-text-o" style={{ opacity: 0.5 }} />
                            <span>{sug.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Categories Cloud Widget */}
                <div className="blog-sidebar-widget widget-tags">
                  <h4 className="widget-title">
                    <i className="fa fa-tags" /> Categories
                  </h4>
                  <div className="widget-tags-cloud">
                    {CATEGORIES.map((cat) => {
                      const count = categoryCounts[cat] || 0;
                      // Generate lowercase class strings for custom coloring
                      const catClass = cat.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
                      return (
                        <button
                          key={cat}
                          className={`widget-tag-btn cat-${catClass}${activeCategory === cat ? ' active' : ''}`}
                          onClick={() => handleCategorySelect(cat)}
                        >
                          {cat} <span className="tag-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mini IDE Playground Widget */}
                <div className="blog-sidebar-widget widget-playground">
                  <h4 className="widget-title">
                    <i className="fa fa-code" /> Mini Coding Sandbox
                  </h4>
                  <div className="mini-playground-widget">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select 
                        className="playground-select" 
                        value={miniLang}
                        onChange={(e) => handleMiniLangChange(e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python (Sim)</option>
                      </select>
                      <Link to="/playground" style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                        Full IDE <i className="fa fa-external-link" />
                      </Link>
                    </div>

                    <textarea
                      className="mini-editor-textarea"
                      value={miniCode}
                      onChange={(e) => setMiniCode(e.target.value)}
                      spellCheck="false"
                      placeholder="Write code here..."
                    />

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="playground-btn playground-btn-run" 
                        onClick={runMiniCode}
                        style={{ padding: '6px 12px', fontSize: '11px', width: '100%', justifyContent: 'center' }}
                      >
                        <i className="fa fa-play" /> Run
                      </button>
                      <button 
                        className="playground-btn playground-btn-secondary" 
                        onClick={() => setMiniLogs([])}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        Clear
                      </button>
                    </div>

                    <div className="mini-terminal-console">
                      {miniLogs.length === 0 ? (
                        <div className="mini-console-empty">Terminal console output...</div>
                      ) : (
                        miniLogs.map((log, index) => (
                          <div key={index} className={`mini-console-line ${log.type}`}>
                            &gt; {log.text}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Newsletter Widget */}
                <div className="blog-sidebar-widget widget-newsletter">
                  <h4 className="widget-title">
                    <i className="fa fa-paper-plane" /> Newsletter
                  </h4>
                  <NewsletterCardCompact />
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterCardCompact() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const isSubscribed = localStorage.getItem('blog_subscribed');
    if (isSubscribed) {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    localStorage.setItem('blog_subscribed', 'true');
    setSubmitted(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '12px', lineHeight: '1.4' }}>
        Subscribe to get cloud, DevOps, and front-end engineering insights directly.
      </p>
      {submitted ? (
        <div className="newsletter-success" style={{ fontSize: '13px', margin: '0', justifyContent: 'flex-start' }}>
          <i className="fa fa-check-circle" /> Thank you for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            id="newsletter-email-input"
            type="email"
            placeholder="Email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              padding: '10px 14px', 
              borderRadius: '20px', 
              border: '1px solid rgba(0,0,0,0.12)', 
              fontSize: '13px',
              width: '100%',
              outline: 'none'
            }}
            required
          />
          <button 
            type="submit" 
            id="newsletter-subscribe-btn"
            className="playground-btn playground-btn-run"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 14px', borderRadius: '20px' }}
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

function FeaturedBlogCard({ post }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="blog-featured-card">
      {post.coverImage && (
        <div className="featured-img">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
          <span className="featured-badge">Featured Article</span>
        </div>
      )}
      <div className="featured-desc">
        <div className="meta">
          {dateStr && <span><i className="fa fa-calendar" style={{ marginRight: '4px' }} />{dateStr}</span>}
          {post.category && <span className="category-tag"><i className="fa fa-tag" style={{ marginRight: '4px' }} />{post.category}</span>}
          {post.readTime && <span><i className="fa fa-clock-o" style={{ marginRight: '4px' }} />{post.readTime}</span>}
        </div>
        <h2>
          <Link to={`/blog/${post.$id}`}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="featured-excerpt">{post.excerpt}</p>}
        <div className="featured-author">
          <i className="fa fa-user" style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <span>By {post.author}</span>
        </div>
        <Link to={`/blog/${post.$id}`} className="btn-read-more-featured">
          Read Featured Article <i className="fa fa-long-arrow-right" style={{ marginLeft: '6px' }} />
        </Link>
      </div>
    </div>
  );
}

function BlogCard({ post, layoutMode }) {
  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="blog-entry">
      {post.coverImage && (
        <div className="blog-img">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        </div>
      )}
      <div className="desc">
        <div className="meta">
          {dateStr && <span><i className="fa fa-calendar" style={{ marginRight: '4px' }} />{dateStr}</span>}
          {post.category && <span><i className="fa fa-tag" style={{ marginRight: '4px' }} />{post.category}</span>}
          {post.readTime && <span><i className="fa fa-clock-o" style={{ marginRight: '4px' }} />{post.readTime}</span>}
        </div>
        <h3>
          <Link to={`/blog/${post.$id}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <Link to={`/blog/${post.$id}`} className="btn-read-more">
          Read more <i className="fa fa-long-arrow-right" style={{ marginLeft: '4px' }} />
        </Link>
      </div>
    </div>
  );
}
