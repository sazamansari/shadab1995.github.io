// Blog section – card grid with pagination, search, category filtering, and highlighted featured article.
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
  const postsPerPage = 9;

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

  // Calculate pagination variables based on normal list
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
                    <p>Thoughts on Cloud, DevOps, and Full Stack engineering — from production experience.</p>
                  </div>
                </div>
              </div>
            </AnimateBox>


            {/* Featured Highlighted Post Article */}
            {featuredPost && (
              <AnimateBox effect="fadeIn" delay={100}>
                <FeaturedBlogCard post={featuredPost} />
              </AnimateBox>
            )}

            {/* Live Search and Category Filter controls */}
            <div className="blog-controls-wrap">
              <div className="blog-search-box">
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

                {/* Suggestions List Dropdown */}
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

              <div className="blog-categories-wrap">
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  return (
                    <button
                      key={cat}
                      className={`blog-category-btn${activeCategory === cat ? ' active' : ''}`}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat} <span className="cat-count">{count}</span>
                    </button>
                  );
                })}
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
                <div className="blog-grid">
                  {currentPosts.map((post, idx) => (
                    <AnimateBox key={post.$id} effect="fadeIn" delay={(idx % postsPerPage) * 40}>
                      <BlogCard post={post} />
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

                {/* Newsletter Subscription Card */}
                <AnimateBox effect="fadeIn" delay={150}>
                  <NewsletterCard />
                </AnimateBox>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterCard() {
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
    <div className="blog-newsletter-card">
      <div className="newsletter-content">
        <h3>Join the Tech Newsletter</h3>
        <p>Get high-quality insights on AWS, Docker, Kubernetes, and Full Stack development sent straight to your inbox.</p>
        {submitted ? (
          <div className="newsletter-success" id="newsletter-success-toast">
            <i className="fa fa-check-circle" /> Thank you! You've successfully subscribed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              id="newsletter-email-input"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" id="newsletter-subscribe-btn">Subscribe</button>
          </form>
        )}
      </div>
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

function BlogCard({ post }) {
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
