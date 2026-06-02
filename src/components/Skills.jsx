// Skills section – animated progress bars
import React, { useEffect, useRef } from 'react';
import AnimateBox from './AnimateBox';

const SKILLS_COL1 = [
  { label: 'AWS (EC2, S3, Lambda, API Gateway)', pct: 90, color: 'color-1' },
  { label: 'Docker & Containerisation',           pct: 88, color: 'color-2' },
  { label: 'Kubernetes & Orchestration',          pct: 75, color: 'color-3' },
  { label: 'Terraform / Infrastructure as Code',  pct: 80, color: 'color-4' },
  { label: 'CI/CD (Jenkins, GitHub Actions)',      pct: 87, color: 'color-5' },
  { label: 'Linux & Shell Scripting',             pct: 82, color: 'color-6' },
];

const SKILLS_COL2 = [
  { label: 'Node.js & Express',   pct: 88, color: 'color-1' },
  { label: 'React.js',            pct: 85, color: 'color-2' },
  { label: 'MongoDB',             pct: 80, color: 'color-3' },
  { label: 'JavaScript / ES6+',   pct: 90, color: 'color-4' },
  { label: 'REST API Design',     pct: 85, color: 'color-5' },
  { label: 'Git & Version Control', pct: 92, color: 'color-6' },
];

function SkillBar({ label, pct, color }) {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.style.width = pct + '%';
          observer.unobserve(bar);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(bar);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div className="progress-wrap">
      <h3>
        {label} <span className="text-muted" style={{ opacity: 0.5, fontSize: '13px' }}></span>
      </h3>
      <div className="progress">
        <div
          ref={barRef}
          className={`progress-bar ${color}`}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: '0%' }}
        >
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="colorlib-skills" data-section="skills" id="skills">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h2>My Skills</h2>
                  </div>
                </div>
              </div>
            </AnimateBox>

            <div className="row">
              <div className="col-md-6">
                <AnimateBox effect="fadeInLeft" delay={0}>
                  <h3 style={{ fontFamily: '"Quicksand", Arial, sans-serif', fontSize: '16px', fontWeight: 600, marginBottom: '1.5em', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Cloud &amp; DevOps
                  </h3>
                  {SKILLS_COL1.map((s) => (
                    <SkillBar key={s.label} {...s} />
                  ))}
                </AnimateBox>
              </div>

              <div className="col-md-6">
                <AnimateBox effect="fadeInRight" delay={100}>
                  <h3 style={{ fontFamily: '"Quicksand", Arial, sans-serif', fontSize: '16px', fontWeight: 600, marginBottom: '1.5em', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Full Stack Development
                  </h3>
                  {SKILLS_COL2.map((s) => (
                    <SkillBar key={s.label} {...s} />
                  ))}
                </AnimateBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
