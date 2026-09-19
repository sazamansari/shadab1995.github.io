



import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Sidebar        from './components/Sidebar';
import Footer         from './components/Footer';
import About          from './components/About';

const Skills         = React.lazy(() => import('./components/Skills'));
const Experience     = React.lazy(() => import('./components/Experience'));
const Education      = React.lazy(() => import('./components/Education'));
const Projects       = React.lazy(() => import('./components/Projects'));
const Certifications = React.lazy(() => import('./components/Certifications'));
const Contact        = React.lazy(() => import('./components/Contact'));
const Blog           = React.lazy(() => import('./components/Blog'));
const BlogPost       = React.lazy(() => import('./components/BlogPost'));
const AdminBlog      = React.lazy(() => import('./components/AdminBlog'));
const CodePlayground = React.lazy(() => import('./components/CodePlayground'));

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
      <main id="colorlib-main">
        {children}
        <Footer />
      </main>
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
const EducationPage      = () => <PageShell><Education /></PageShell>;
const ProjectsPage       = () => <PageShell><Projects /></PageShell>;
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
    title: 'Md Shadab Azam Ansari | Software Engineer & Cloud DevOps Engineer',
    description: 'Md Shadab Azam Ansari is a Software Engineer and Cloud DevOps Engineer specializing in AWS, Azure, Terraform, Kubernetes, Node.js, and React.',
  };
  
  const pages = {
    '/': defaultSeo,
    '/skills': {
      title: 'Skills & Technologies | Md Shadab Azam Ansari',
      description: 'Expertise in AWS, Azure, Terraform, Kubernetes, Docker, Node.js, React, and CI/CD pipelines.',
    },
    '/experience': {
      title: 'Professional Experience | Md Shadab Azam Ansari',
      description: 'Professional experience as a Software Engineer and Cloud DevOps Engineer delivering scalable infrastructure and applications.',
    },
    '/education': {
      title: 'Education & Certifications | Md Shadab Azam Ansari',
      description: 'Educational background and verified certifications in AWS, Azure, and DevOps.',
    },
    '/projects': {
      title: 'Projects | Md Shadab Azam Ansari',
      description: 'Portfolio of hands-on Cloud, DevOps, and Software Engineering projects including NovaServe.',
    },
    '/certifications': {
      title: 'Cloud & DevOps Certifications | Md Shadab Azam Ansari',
      description: 'View verified cloud and DevOps certifications including AWS Solutions Architect and Microsoft DevOps Engineer Expert.',
    },
    '/contact': {
      title: 'Contact | Md Shadab Azam Ansari',
      description: 'Contact Md Shadab Azam Ansari for Cloud, DevOps, full stack engineering, and technical collaboration opportunities.',
    },
    '/blog': {
      title: 'Blog | Md Shadab Azam Ansari',
      description: 'Technical articles on AWS, DevOps, Terraform, Kubernetes, Docker, Node.js, and React.',
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
      <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
        <Routes>
          <Route path="/"                element={<AboutPage />} />
          <Route path="/skills"          element={<SkillsPage />} />
          <Route path="/experience"      element={<ExperiencePage />} />
          <Route path="/education"       element={<EducationPage />} />
          <Route path="/projects"        element={<ProjectsPage />} />
          <Route path="/certifications"  element={<CertificationsPage />} />
          <Route path="/contact"         element={<ContactPage />} />
          <Route path="/blog"            element={<BlogPage />} />
          <Route path="/blog/:id"        element={<BlogPostPage />} />
          <Route path="/playground"      element={<PlaygroundPage />} />
          <Route path="/admin"           element={<AdminPage />} />
          {}
          <Route path="*"               element={<AboutPage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
