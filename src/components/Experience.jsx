// Experience section – timeline layout
import React from 'react';
import AnimateBox from './AnimateBox';

const EXPERIENCES = [
  {
    id: 4,
    color: 'color-4',
    icon: 'fa-briefcase',
    company: 'Excellence Education | Hitbullseye (Client Engagement)',
    role: 'Senior Consultant',
    period: 'Jan 2025 – Present | Chandigarh',
    points: [
      'Designed and implemented CI/CD pipelines using GitHub Actions and Jenkins to streamline build, test, and deployment workflows.',
      'Architected and deployed cloud-native applications on AWS ECS/EKS with auto-scaling, high availability, and monitoring integrations.',
      'Automated infrastructure provisioning and environment management using Terraform and AWS CloudFormation across multi-stage setups.',
    ],
  },
  {
    id: 1,
    color: 'color-1',
    icon: 'fa-briefcase',
    company: 'POD INVEST',
    role: 'Software Engineer / Cloud & DevOps Engineer',
    period: 'Jan 2023 – Present',
    points: [
      'Designed and deployed scalable cloud-native architectures on AWS (EC2, S3, Lambda, API Gateway, RDS).',
      'Containerised microservices using Docker & Kubernetes, reducing deployment time by 60%.',
      'Built and maintained CI/CD pipelines with Jenkins and GitHub Actions for zero-downtime releases.',
      'Implemented Terraform-based Infrastructure as Code (IaC) for repeatable, auditable environments.',
      'Acted as Tech Panel 📈 — reviewing technical proposals and mentoring junior engineers.',
    ],
  },
  {
    id: 2,
    color: 'color-2',
    icon: 'fa-graduation-cap',
    company: 'THE 10X ACADEMY',
    role: 'Full Stack & Cloud Mentor',
    period: 'Jun 2022 – Dec 2022',
    points: [
      'Mentored 500+ students in Full Stack Development (React, Node.js, MongoDB) and AWS fundamentals.',
      'Delivered live coding sessions, weekly code reviews, and 1:1 career guidance.',
      'Designed project-based curriculum focused on real-world deployments.',
    ],
  },
  {
    id: 3,
    color: 'color-3',
    icon: 'fa-chalkboard-teacher',
    company: 'CODING SPOON',
    role: 'Full Stack Trainer',
    period: 'Jan 2022 – May 2022',
    points: [
      'Trained 300+ students in MERN stack development and modern DevOps practices.',
      'Created hands-on project assignments covering REST APIs, authentication, and cloud deployments.',
    ],
  },
];

export default function Experience() {
  return (
    <section className="colorlib-experience" data-section="experience" id="experience">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h2>Work Experience</h2>
                  </div>
                </div>
              </div>
            </AnimateBox>

            <div className="row">
              <div className="col-md-12">
                <div className="timeline-centered">
                  {EXPERIENCES.map((exp, idx) => (
                    <AnimateBox key={exp.id} effect={idx % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'} delay={idx * 100}>
                      <article className="timeline-entry">
                        <div className="timeline-entry-inner">
                          <div className={`timeline-icon ${exp.color}`}>
                            <i className={`fa ${exp.icon}`} />
                          </div>
                          <div className="timeline-label">
                            <h2>
                              {exp.company}{' '}
                              <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>
                                {exp.period}
                              </span>
                            </h2>
                            <p style={{ fontWeight: 600, marginBottom: '0.5em', fontFamily: '"Quicksand", Arial, sans-serif', fontSize: '14px' }}>
                              {exp.role}
                            </p>
                            <ul style={{ paddingLeft: '1.2em', marginBottom: 0 }}>
                              {exp.points.map((pt, i) => (
                                <li key={i} style={{ marginBottom: '0.4em', fontSize: '14px', color: 'rgba(0,0,0,0.75)' }}>
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    </AnimateBox>
                  ))}

                  {/* End dot */}
                  <article className="timeline-entry begin">
                    <div className="timeline-entry-inner">
                      <div className="timeline-icon color-none" />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
