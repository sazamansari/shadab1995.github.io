// Education section – timeline layout
import React from 'react';
import AnimateBox from './AnimateBox';

const EDUCATION = [
  {
    id: 1,
    color: 'color-1',
    icon: 'fa-graduation-cap',
    logo: '/logos/galgotias.jpg',
    institution: 'Galgotias University',
    degree: 'BTech - Bachelor of Technology, Computer Science and engineering',
    period: 'Aug 2018 – May 2022',
    grade: 'Grade: 6.89 CGPA',
    points: [
      'Activities and societies: Coding',
      'This is a very interesting journey. I am enjoying it',
    ],
  },
  {
    id: 2,
    color: 'color-2',
    icon: 'fa-certificate',
    logo: '/logos/udacity.jpg',
    institution: 'Udacity',
    degree: 'Full Stack Web Developer Nanodegree Program Graduate',
    period: 'Jun 2021 – Oct 2021',
    grade: '',
    points: [
      'SQL and Data Modeling for the Web relational databases with the power of SQL, and leverage Python to incorporate database logic into your programs.',
      'API Development and Documentation, use APIs to control and manage web applications, including best practices for API testing and documentation.',
      'Identity Access Management Implement authentication and authorization in Flask and understand how to design against key security principles. You will also gain experience with role-based control design patterns, securing a REST API, and applying software system risk and compliance principles.',
      'Server Deployment and Containerization Develop an understanding of containerized environments, use Docker to share and store containers, and deploy a Docker container to a Kubernetes cluster using AWS.',
    ],
  },
  {
    id: 3,
    color: 'color-3',
    icon: 'fa-certificate',
    logo: '/logos/udacity.jpg',
    institution: 'Udacity',
    degree: 'React.js Developer NanoDegree Program Graduate',
    period: 'Feb 2021 – May 2021',
    grade: '',
    points: [
      'Certificate of graduation from a Udacity Nanodegree program',
      'Proof you completed a career related program focused on technical skills',
    ],
  },
];

export default function Education() {
  return (
    <section className="colorlib-experience" data-section="education" id="education">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h1>Education</h1>
                  </div>
                </div>
              </div>
            </AnimateBox>

            <div className="row">
              <div className="col-md-12">
                <div className="timeline-centered">
                  {EDUCATION.map((edu, idx) => (
                    <AnimateBox key={edu.id} effect={idx % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'} delay={idx * 100}>
                      <article className="timeline-entry">
                        <div className="timeline-entry-inner">
                          <div 
                            className={`timeline-icon ${edu.color}`}
                            style={edu.logo ? { background: '#fff', overflow: 'hidden', padding: '5px' } : {}}
                          >
                            {edu.logo ? (
                              <img src={edu.logo} alt={edu.institution} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                              <i className={`fa ${edu.icon}`} />
                            )}
                          </div>
                          <div className="timeline-label">
                            <h2>
                              {edu.institution}{' '}
                              <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>
                                {edu.period}
                              </span>
                            </h2>
                            <p style={{ fontWeight: 600, marginBottom: '0.5em', fontFamily: '"Quicksand", Arial, sans-serif', fontSize: '14px' }}>
                              {edu.degree}
                            </p>
                            {edu.grade && (
                              <p style={{ fontWeight: 600, marginBottom: '0.5em', fontFamily: '"Quicksand", Arial, sans-serif', fontSize: '14px' }}>
                                {edu.grade}
                              </p>
                            )}
                            <ul style={{ paddingLeft: '1.2em', marginBottom: 0 }}>
                              {edu.points.map((pt, i) => (
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
