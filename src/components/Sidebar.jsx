// Sidebar navigation – uses React Router NavLink for multi-page routing
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/',               label: 'About',           exact: true },
  { path: '/skills',         label: 'Skills' },
  { path: '/experience',     label: 'Work Experience' },
  { path: '/education',      label: 'Education' },
  { path: '/projects',       label: 'Projects' },
  { path: '/certifications', label: 'Certifications' },
  { path: '/contact',        label: 'Contact' },
  { path: '/blog',           label: 'Blog' },
  { path: '/playground',     label: 'Code Playground' },
];

export default function Sidebar({ menuOpen, toggleMenu }) {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
    if (menuOpen) toggleMenu();
  };

  return (
    <aside id="colorlib-aside" role="complementary" className="js-fullheight">
      <div className="text-center">
        <div
          className="author-img"
          style={{ backgroundImage: 'url(/profile.jpeg)' }}
          aria-label="Profile photo of Md Shadab Azam Ansari"
        />
        <div id="colorlib-logo">
          <a href="/" onClick={handleLogoClick}>
            Md Shadab Azam Ansari
          </a>
        </div>
      </div>

      <nav id="colorlib-main-menu" role="navigation" className="navbar">
        <div id="navbar">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => { if (menuOpen) toggleMenu(); }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="colorlib-footer">
        <ul>
          <li>
            <a href="https://twitter.com/tipu___" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/sazamansari/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa fa-linkedin" />
            </a>
          </li>
          <li>
            <a href="https://github.com/sazamansari" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fa fa-github" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/shadab.focused/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fa fa-instagram" />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
