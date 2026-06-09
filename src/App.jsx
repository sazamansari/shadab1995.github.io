// App.jsx – multi-page portfolio with React Router
// Each nav item is its own route; only one page renders at a time.
// HashRouter keeps GitHub Pages static hosting working without server rewrites.

import React, { useRef, useState, useEffect } from 'react';
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
import CodePlayground from './components/CodePlayground';
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
    <div id="colorlib-page" style={{ background: '#f2f3f7', minHeight: '100vh' }}>
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
const PlaygroundPage     = () => <PageShell><CodePlayground /></PageShell>;
const AdminPage          = () => <AdminShell />;

/* ─── SEO Manager to dynamically update document title & meta tags ─── */
function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    let title = "Md Shadab Azam Ansari | Software Engineer | Cloud & DevOps Engineer";
    let description = "Md Shadab Azam Ansari is a passionate software engineer with expertise in front-end applications and professional websites. Cloud & DevOps Engineer with AWS, Docker, Kubernetes expertise.";

    switch (path) {
      case '/':
        title = "Md Shadab Azam Ansari | Software Engineer | Cloud & DevOps Engineer";
        description = "Portfolio of Md Shadab Azam Ansari, a Cloud & DevOps Engineer specializing in AWS, Docker, Kubernetes, Terraform, Node.js, and React.";
        break;
      case '/skills':
        title = "Skills & Expertise | Md Shadab Azam Ansari";
        description = "Explore the technical skills of Md Shadab Azam Ansari, including Cloud/DevOps (AWS, Kubernetes, Docker, CI/CD) and Full Stack Development (React, Node.js, Express, MongoDB).";
        break;
      case '/experience':
        title = "Professional Experience | Md Shadab Azam Ansari";
        description = "Read about the career history, professional projects, and engineering achievements of Md Shadab Azam Ansari.";
        break;
      case '/certifications':
        title = "Certifications & Credentials | Md Shadab Azam Ansari";
        description = "View certifications earned by Md Shadab Azam Ansari, including AWS, Microsoft DevOps Engineer Expert, and other cloud credentials.";
        break;
      case '/contact':
        title = "Contact | Md Shadab Azam Ansari";
        description = "Get in touch with Md Shadab Azam Ansari for projects, collaboration, or job opportunities.";
        break;
      case '/blog':
        title = "Blog & Insights | Md Shadab Azam Ansari";
        description = "Technical blog and insights on DevOps, Cloud Computing, Full Stack Development, and software engineering practices.";
        break;
      case '/playground':
        title = "Interactive Code Playground & IDE | Md Shadab Azam Ansari";
        description = "A client-side interactive code playground and sandbox to run, test, and preview JavaScript, Python, and HTML/CSS/JS frontend projects live.";
        break;
      case '/admin':
        title = "Admin Panel | Md Shadab Azam Ansari";
        description = "Administrative panel for managing portfolio blog content.";
        break;
      default:
        if (path.startsWith('/blog/')) {
          title = "Blog Post | Md Shadab Azam Ansari";
          description = "Read this blog post by Md Shadab Azam Ansari.";
        }
        break;
    }

    const fullUrl = `https://md-shadab-azam-ansari.vercel.app/#${path === '/' ? '' : path}`;

    // Set page title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Set meta tags
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:image', 'https://md-shadab-azam-ansari.vercel.app/profile.jpeg');

    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', 'https://md-shadab-azam-ansari.vercel.app/profile.jpeg');

    // Set canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
  }, [location]);

  return null;
}

/* ─── App root with router ─────────────────────────────────────── */
export default function App() {
  return (
    <HashRouter>
      <SEOManager />
      <Routes>
        <Route path="/"                element={<AboutPage />} />
        <Route path="/skills"          element={<SkillsPage />} />
        <Route path="/experience"      element={<ExperiencePage />} />
        <Route path="/certifications"  element={<CertificationsPage />} />
        <Route path="/contact"         element={<ContactPage />} />
        <Route path="/blog"            element={<BlogPage />} />
        <Route path="/blog/:id"        element={<BlogPostPage />} />
        <Route path="/playground"      element={<PlaygroundPage />} />
        <Route path="/admin"           element={<AdminPage />} />
        {/* Fallback – redirect unknown paths to About */}
        <Route path="*"               element={<AboutPage />} />
      </Routes>
    </HashRouter>
  );
}
