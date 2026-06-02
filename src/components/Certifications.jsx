// Certifications page – badge gallery with all earned certifications
import React from 'react';
import AnimateBox from './AnimateBox';

const CERTS = [
  // ── AWS ─────────────────────────────────────────────────────────
  {
    id: 1,
    image: '/certs/aws-devops-pro.png',
    name: 'AWS Certified DevOps Engineer',
    level: 'Professional',
    issuer: 'Amazon Web Services',
    bgGradient: 'linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)',
    badgeColor: '#FF9900',
    year: '2025',
    issued: 'January 28, 2025',
    expires: 'January 28, 2028',
    credlyUrl: 'https://www.credly.com/badges/9da3ed44-9aa1-4c69-a313-4eae9d80e64a',
  },
  {
    id: 2,
    image: '/certs/aws-solutions-architect.png',
    name: 'AWS Certified Solutions Architect',
    level: 'Associate',
    issuer: 'Amazon Web Services',
    bgGradient: 'linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)',
    badgeColor: '#FF9900',
    year: '2023',
    credlyUrl: 'https://www.credly.com/badges/bfa91182-5c96-4975-818f-8f53683f5f0f',
  },
  // ── Microsoft Azure ──────────────────────────────────────────────
  {
    id: 3,
    image: '/certs/ms-certified-associate.png',
    name: 'Microsoft Certified: Azure Administrator Associate',
    level: 'Associate',
    issuer: 'Microsoft',
    bgGradient: 'linear-gradient(135deg, #001537 0%, #003087 100%)',
    badgeColor: '#0078D4',
    year: '2026',
    issued: 'April 27, 2026',
    expires: 'April 28, 2027',
    credentialId: '6E2F83B30C88CA50',
    certificationNumber: 'FDA6BN-C1D524',
    credlyUrl: 'https://learn.microsoft.com/en-us/users/mdshadabazamansari-4026/credentials/certification/azure-administrator?tab=credentials-tab',
  },
  // ── GitLab ───────────────────────────────────────────────────────
  {
    id: 4,
    image: '/certs/gitlab-git.png',
    name: 'GitLab Certified Git Associate',
    level: 'Associate',
    issuer: 'GitLab',
    bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 100%)',
    badgeColor: '#FC6D26',
    year: '2024',
    credlyUrl: 'https://www.credly.com/badges/af8e48b2-3403-4e33-9817-bf030705d599',
  },
  // ── GitHub ───────────────────────────────────────────────────────
  {
    id: 5,
    image: '/certs/github-foundations.png',
    name: 'GitHub Foundations',
    level: 'Certification Program',
    issuer: 'GitHub',
    bgGradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    badgeColor: '#3fb950',
    year: '2024',
    credlyUrl: 'https://www.credly.com/badges/eec44eb6-d1e1-4231-88ca-b9b5944e3f43',
  },
  // ── Aviatrix ─────────────────────────────────────────────────────
  {
    id: 6,
    image: '/certs/aviatrix-ace.png',
    name: 'Aviatrix Certified Engineer (ACE)',
    level: 'Associate',
    issuer: 'Aviatrix',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    badgeColor: '#E8622A',
    year: '2023',
    credlyUrl: null,
  },
];

const STATS = [
  { icon: 'fa-certificate', label: `${CERTS.length} Certifications`, color: '#FCCE04' },
  { icon: 'fa-cloud',       label: '3 Cloud Certs',   color: '#FF9900' },
  { icon: 'fa-code-fork',   label: 'Git & DevOps',    color: '#FC6D26' },
];

export default function Certifications() {
  return (
    <section className="colorlib-certifications" data-section="certifications" id="certifications">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">

            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h2>Certifications</h2>
                    <p>
                      Industry-recognised cloud and DevOps certifications across AWS, Azure,
                      GitLab, GitHub, and Aviatrix platforms.
                    </p>
                  </div>
                </div>
              </div>
            </AnimateBox>

            {/* Stats pills */}
            <AnimateBox effect="fadeIn" delay={50}>
              <div style={{ display: 'flex', gap: '1em', marginBottom: '2.5em', flexWrap: 'wrap' }}>
                {STATS.map((stat) => (
                  <div key={stat.label} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 18px', borderRadius: '20px',
                    background: 'rgba(0,0,0,0.05)',
                    fontFamily: '"Quicksand", Arial, sans-serif',
                    fontSize: '13px', fontWeight: 600, color: 'rgba(0,0,0,0.65)',
                  }}>
                    <i className={`fa ${stat.icon}`} style={{ color: stat.color, fontSize: '15px' }} />
                    {stat.label}
                  </div>
                ))}
              </div>
            </AnimateBox>

            {/* Badge grid */}
            <div className="certs-grid">
              {CERTS.map((cert, idx) => (
                <AnimateBox key={cert.id} effect="fadeInUp" delay={idx * 80}>
                  <CertCard cert={cert} />
                </AnimateBox>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert }) {
  const inner = (
    <div className="cert-card-inner">
      <div className="cert-badge-wrap">
        <img src={cert.image} alt={`${cert.name} badge`} className="cert-badge-img" loading="lazy" />
      </div>
      <div className="cert-info">
        <span className="cert-level-tag"
          style={{ background: cert.badgeColor + '22', color: cert.badgeColor, border: `1px solid ${cert.badgeColor}55` }}>
          {cert.level}
        </span>
        <h3 className="cert-name" style={{ fontSize: '15px', lineHeight: '1.3', marginBottom: '8px' }}>{cert.name}</h3>
        <p className="cert-issuer" style={{ margin: '0 0 4px 0' }}>
          <i className="fa fa-building-o" style={{ marginRight: '5px', opacity: 0.6 }} />
          {cert.issuer}
        </p>
        
        {cert.credentialId && (
          <p className="cert-issuer" style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.85 }}>
            <i className="fa fa-id-badge" style={{ marginRight: '5px', opacity: 0.6 }} />
            ID: {cert.credentialId}
          </p>
        )}
        
        {cert.certificationNumber && (
          <p className="cert-issuer" style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: 0.85 }}>
            <i className="fa fa-hashtag" style={{ marginRight: '5px', opacity: 0.6 }} />
            No: {cert.certificationNumber}
          </p>
        )}

        {cert.issued && cert.expires ? (
          <div className="cert-year" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
            <i className="fa fa-calendar-check-o" style={{ marginRight: '5px', opacity: 0.6 }} />
            {cert.issued} – {cert.expires}
          </div>
        ) : (
          <div className="cert-year" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
            <i className="fa fa-calendar-check-o" style={{ marginRight: '5px', opacity: 0.6 }} />
            {cert.year}
          </div>
        )}
        
        {cert.credlyUrl && (
          <div className="cert-verify" style={{ marginTop: '8px' }}>
            <i className="fa fa-external-link" style={{ marginRight: '5px' }} />
            Verify credential
          </div>
        )}
      </div>
    </div>
  );

  const cardStyle = { '--card-bg': cert.bgGradient, '--badge-color': cert.badgeColor };

  if (cert.credlyUrl) {
    return (
      <a href={cert.credlyUrl} target="_blank" rel="noopener noreferrer"
         className="cert-card" style={cardStyle} aria-label={`Verify ${cert.name}`}>
        {inner}
      </a>
    );
  }

  return <div className="cert-card" style={cardStyle}>{inner}</div>;
}
