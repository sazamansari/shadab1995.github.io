



import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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
      {}
      <canvas id="canvas" ref={canvasRef} />

      {}
      <a
        href="#"
        className={`js-colorlib-nav-toggle colorlib-nav-toggle${menuOpen ? ' active' : ''}`}
        id="mobile-nav-toggle"
        aria-label="Toggle navigation"
        onClick={(e) => { e.preventDefault(); toggleMenu(); }}
      >
        <i />
      </a>

      {}
      <Sidebar menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {}
      <div id="colorlib-main">
        {children}
        <Footer />
      </div>
    </div>
  );
}


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


const AboutPage          = () => <PageShell><About /></PageShell>;
const SkillsPage         = () => <PageShell><Skills /></PageShell>;
const ExperiencePage     = () => <PageShell><Experience /></PageShell>;
const CertificationsPage = () => <PageShell><Certifications /></PageShell>;
const ContactPage        = () => <PageShell><Contact /></PageShell>;
const BlogPage           = () => <PageShell><Blog /></PageShell>;
const BlogPostPage       = () => <PageShell><BlogPost /></PageShell>;
const PlaygroundPage     = () => <PageShell><CodePlayground /></PageShell>;
const AdminPage          = () => <AdminShell />;

function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      navigate(window.location.hash.slice(1), { replace: true });
    }
  }, [navigate]);

  return null;
}

import SEO from './components/SEO';

function SEOManager() {
  const location = useLocation();
  const path = location.pathname;
  const siteUrl = 'https://md-shadab-azam-ansari.vercel.app';
  
  const defaultSeo = {
    title: 'Md Shadab Azam Ansari | Cloud & DevOps Engineer',
    description: 'Portfolio of Md Shadab Azam Ansari, a Cloud & DevOps Engineer specializing in AWS, Kubernetes, Docker, Terraform, CI/CD, Node.js, and React.',
  };
  
  const pages = {
    '/': defaultSeo,
    '/skills': {
      title: 'Cloud, DevOps & Full Stack Skills | Md Shadab Azam Ansari',
      description: 'Explore hands-on expertise in AWS, Kubernetes, Docker, Terraform, Jenkins, GitHub Actions, React, Node.js, Express, and MongoDB.',
    },
    '/experience': {
      title: 'Cloud & DevOps Engineering Experience | Md Shadab Azam Ansari',
      description: 'Professional experience delivering cloud infrastructure, CI/CD automation, scalable APIs, Kubernetes deployments, and production reliability.',
    },
    '/certifications': {
      title: 'AWS, Azure & DevOps Certifications | Md Shadab Azam Ansari',
      description: 'View verified cloud and DevOps certifications including AWS Solutions Architect, AWS DevOps Professional, and Microsoft DevOps Engineer Expert.',
    },
    '/contact': {
      title: 'Contact Md Shadab Azam Ansari | Cloud & DevOps Engineer',
      description: 'Contact Md Shadab Azam Ansari for Cloud, DevOps, AWS, Kubernetes, CI/CD, full stack engineering, and technical collaboration opportunities.',
    },
    '/blog': {
      title: 'Cloud, DevOps, AWS & Kubernetes Blog | Md Shadab Azam Ansari',
      description: 'Practical engineering articles about AWS, Kubernetes, Docker, Terraform, CI/CD, cloud architecture, React, Node.js, and production DevOps.',
    },
    '/playground': {
      title: 'Online JavaScript, HTML & Python Code Playground',
      description: 'Run and preview JavaScript, HTML, CSS, and simulated Python examples in an interactive browser-based coding playground.',
    },
    '/admin': {
      title: 'Admin Panel',
      description: 'Private website administration page.',
    },
  };

  const seo = pages[path] || (path.startsWith('/blog/') ? null : defaultSeo);
  
  if (!seo) return null; // Blog posts handle their own SEO

  const fullUrl = `${siteUrl}${path === '/' ? '/' : path}`;

  return <SEO title={seo.title} description={seo.description} url={fullUrl} />;
}



export default function App() {
  return (
    <BrowserRouter>
      <LegacyHashRedirect />
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
        {}
        <Route path="*"               element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
