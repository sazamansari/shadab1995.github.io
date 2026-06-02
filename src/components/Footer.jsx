import React from 'react';
import { Link } from 'react-router-dom';

const SPECIALTIES = [
  { icon: 'fa-code', title: 'Full Stack Development' },
  { icon: 'fa-cloud', title: 'DevOps Engineering' },
  { icon: 'fa-cubes', title: 'Docker & Kubernetes' },
  { icon: 'fa-rocket', title: 'CI/CD (Jenkins) Pipelines' },
];

export default function Footer() {
  return (
    <footer className="colorlib-footer" style={{ paddingTop: '3em', paddingBottom: '0' }}>
      <div className="footer-inner" style={{ borderRadius: '12px', margin: '0 15px 20px 15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Centered Name and Titles */}
          <h3 style={{ 
            fontFamily: '"Montserrat", Georgia, serif', 
            fontWeight: '700', 
            fontSize: '22px', 
            color: '#111', 
            margin: '0 0 4px 0' 
          }}>
            Md Shadab Azam Ansari
          </h3>
          <p style={{ 
            fontFamily: '"Quicksand", Arial, sans-serif', 
            fontWeight: '600', 
            fontSize: '14px', 
            color: 'rgba(0, 0, 0, 0.7)', 
            margin: '0 0 1.5em 0',
            letterSpacing: '0.5px'
          }}>
            Software Engineer | Cloud Engineer | DevOps Engineer
          </p>

          {/* DevOps Accent Specialties */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px 30px', 
            flexWrap: 'wrap', 
            margin: '1.5em 0' 
          }}>
            {SPECIALTIES.map((spec, index) => (
              <span key={index} style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                color: '#111', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px',
                fontFamily: '"Quicksand", Arial, sans-serif'
              }}>
                <i className={`fa ${spec.icon}`} style={{ fontSize: '15px' }} /> {spec.title}
              </span>
            ))}
          </div>

          <hr style={{ borderColor: 'rgba(0, 0, 0, 0.08)', margin: '1.5em 0' }} />

          {/* Centered Copyright */}
          <p style={{ 
            fontFamily: '"Quicksand", Arial, sans-serif', 
            fontSize: '13px', 
            fontWeight: '500', 
            color: 'rgba(0, 0, 0, 0.65)', 
            margin: '0' 
          }}>
            &copy; 2026 Md Shadab Azam Ansari. All rights reserved.
          </p>

          {/* Admin link */}
          <div style={{ marginTop: '12px' }}>
            <Link to="/admin" style={{ 
              fontSize: '11px', 
              color: 'rgba(0, 0, 0, 0.45)', 
              textDecoration: 'none', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: '600',
              fontFamily: '"Quicksand", Arial, sans-serif'
            }} id="footer-admin-portal">
              <i className="fa fa-lock" style={{ marginRight: '4px' }} /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
