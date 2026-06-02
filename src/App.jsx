// App.jsx – multi-page portfolio with React Router
// Each nav item is its own route; only one page renders at a time.
// HashRouter keeps GitHub Pages static hosting working without server rewrites.

import React, { useRef, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';

import Sidebar        from './components/Sidebar';
import About          from './components/About';
import Skills         from './components/Skills';
import Experience     from './components/Experience';
import Certifications from './components/Certifications';
import Contact        from './components/Contact';
import Blog           from './components/Blog';
import BlogPost       from './components/BlogPost';
import AdminBlog      from './components/AdminBlog';
import Footer         from './components/Footer';

import { useCanvasAnimation } from './useCanvasAnimation';

/* ─── Shared page shell (sidebar + canvas + one content page) ───── */
function PageShell({ children }) {
  const canvasRef          = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useCanvasAnimation(canvasRef);

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.classList.toggle('offcanvas', !prev);
      return !prev;
    });
  };

  return (
    <div id="colorlib-page">
      {/* Floating 0/1 canvas background */}
      <canvas id="canvas" ref={canvasRef} />

      {/* Mobile hamburger */}
      <a
        href="#"
        className={`js-colorlib-nav-toggle colorlib-nav-toggle${menuOpen ? ' active' : ''}`}
        id="mobile-nav-toggle"
        aria-label="Toggle navigation"
        onClick={(e) => { e.preventDefault(); toggleMenu(); }}
      >
        <i />
      </a>

      {/* Sidebar navigation */}
      <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Main content – only the current page */}
      <div id="colorlib-main">
        {children}
        <Footer />
      </div>
    </div>
  );
}

/* ─── Admin page (no sidebar canvas) ───────────────────────────── */
function AdminShell() {
  return (
    <div id="colorlib-page" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2em 1.5em' }}>
        <AdminBlog />
        <Footer />
      </div>
    </div>
  );
}

/* ─── Individual page wrappers ──────────────────────────────────── */
const AboutPage          = () => <PageShell><About /></PageShell>;
const SkillsPage         = () => <PageShell><Skills /></PageShell>;
const ExperiencePage     = () => <PageShell><Experience /></PageShell>;
const CertificationsPage = () => <PageShell><Certifications /></PageShell>;
const ContactPage        = () => <PageShell><Contact /></PageShell>;
const BlogPage           = () => <PageShell><Blog /></PageShell>;
const BlogPostPage       = () => <PageShell><BlogPost /></PageShell>;
const AdminPage          = () => <AdminShell />;

/* ─── App root with router ─────────────────────────────────────── */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"                element={<AboutPage />} />
        <Route path="/skills"          element={<SkillsPage />} />
        <Route path="/experience"      element={<ExperiencePage />} />
        <Route path="/certifications"  element={<CertificationsPage />} />
        <Route path="/contact"         element={<ContactPage />} />
        <Route path="/blog"            element={<BlogPage />} />
        <Route path="/blog/:id"        element={<BlogPostPage />} />
        <Route path="/admin"           element={<AdminPage />} />
        {/* Fallback – redirect unknown paths to About */}
        <Route path="*"               element={<AboutPage />} />
      </Routes>
    </HashRouter>
  );
}
