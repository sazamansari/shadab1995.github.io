// Experience section – timeline layout
import React from 'react';
import AnimateBox from './AnimateBox';

const EXPERIENCES = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    color: 'color-2',
    icon: 'fa-briefcase',
    company: '株式会社キャリアサバイバル | Career Survival',
    role: 'Senior Software Engineer',
    period: 'Dec 2023 – Jan 2024 | Aichi, Japan (Remote)',
    points: [
      'Collaborated on software development and design for frontend application frameworks.',
      'Utilized engineering practices to support the engineering lifecycle.',
      'Delivered highly performant code and verified quality with standard testing tools.',
    ],
  },
  {
    id: 4,
    color: 'color-3',
    icon: 'fa-graduation-cap',
    company: 'THE 10X ACADEMY',
    role: 'Mentor (Freelance)',
    period: 'Dec 2022 – Nov 2023 | Remote',
    points: [
      'Mentored students, guided their coding paths, and prepared them for Front End Development.',
      'Answered front-end related queries and provided supportive resources to learners.',
      'Helped students grasp Full Stack (React + Node) concepts through real-world applications and examples.',
      'Provided assistance and project reviews via Zoom and Slack.',
    ],
  },
  {
    id: 5,
    color: 'color-4',
    icon: 'fa-briefcase',
    company: 'GirlScript Summer of Code',
    role: 'Project Administrator',
    period: 'May 2023 – Aug 2023 | Remote',
    points: [
      'Served as Project Administrator during GSSoC 2023, managing tasks and open-source contributions.',
      'Coordinated pull request reviews, mentored contributors, and managed repository releases.',
    ],
  },
  {
    id: 6,
    color: 'color-5',
    icon: 'fa-briefcase',
    company: 'Social Winter of Code',
    role: 'Project Administrator',
    period: 'Dec 2022 – Apr 2023 | Remote',
    points: [
      'Managed "Awesome User-Auth-Microservice", selected as one of the participating organizations.',
      'Facilitated project development with over 20 active contributors and created beginner-friendly issues.',
      'Led a team of 4 mentors to review participant contributions.',
      'Managed npm module projects within the organization, exceeding 950+ total downloads.',
    ],
  },
  {
    id: 7,
    color: 'color-1',
    icon: 'fa-graduation-cap',
    company: 'Dropout Academy',
    role: 'Mentor',
    period: 'Jan 2023 – Mar 2023 | Remote',
    points: [
      'Guided students, leading the coding path and preparing them for Front End Development.',
      'Responded to learner inquiries about Front End, and provided helpful resources.',
      'Shared concrete examples from personal experience to help them grasp Full Stack (React + Node) uses.',
      'Offered support for student projects via Google Meet and group chat.',
    ],
  },
  {
    id: 8,
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
    id: 9,
    color: 'color-3',
    icon: 'fa-graduation-cap',
    company: 'AirCampus',
    role: 'Mentor',
    period: 'Nov 2022 | Remote',
    points: [
      'Guided students through structured MERN lesson plans and DSA concepts.',
      'Hosted interactive calls to check weekly progress and resolve technical issues.',
    ],
  },
  {
    id: 10,
    color: 'color-4',
    icon: 'fa-code',
    company: 'Hacktoberfest',
    role: 'Open Source Contributor \'22',
    period: 'Oct 2022 | Remote',
    points: [
      'Redesigned and implemented Java code for DSA GitHub repositories.',
      'Contributed documentation improvements to react.org, merging official updates to make React easier to learn.',
    ],
  },
  {
    id: 11,
    color: 'color-5',
    icon: 'fa-chalkboard-teacher',
    company: 'CODING SPOON',
    role: 'Full Stack Trainer',
    period: 'Jan 2022 – May 2022',
    points: [
      'Trained 300+ students in MERN stack development and modern DevOps practices.',
      'Created hands-on project assignments covering REST APIs, authentication, and cloud deployments.',
    ],
  },
  {
    id: 12,
    color: 'color-1',
    icon: 'fa-pencil-square-o',
    company: 'Scaler',
    role: 'Technical Content Writer',
    period: 'Mar 2022 – Aug 2022 | Remote',
    points: [
      'Wrote extensive technical articles on Python, JavaScript, and Data Structures for students.',
      'Paired written content with helpful illustrations to improve readability and comprehension.',
    ],
  },
  {
    id: 13,
    color: 'color-2',
    icon: 'fa-certificate',
    company: 'Postman',
    role: 'Postman Student Expert (Apprenticeship)',
    period: 'Nov 2021 | Remote',
    points: [
      'Build and successfully send requests in Postman using a variety of methods including GET, POST, PUT, and DELETE.',
      'Include query and path parameters, authorization, and body data in requests.',
      'Declare and reference variables at different scopes in Postman including environment and collection.',
      'Edit documentation for a collection, write a basic test assertion script, run a collection, and script request execution order.',
    ],
  },
  {
    id: 14,
    color: 'color-3',
    icon: 'fa-code',
    company: 'Zara Inforise',
    role: 'Web Developer',
    period: 'May 2021 – Feb 2022 | Indore, India',
    points: [
      'Built React.js, Redux, Node.js, Express.js, and MongoDB admin dashboards.',
      'Improved performance by introducing database design optimizations.',
      'Designed and developed custom REST APIs to scale for thousands of deliveries, and configured automated CI/CD pipelines to production.',
    ],
  },
  {
    id: 15,
    color: 'color-4',
    icon: 'fa-code',
    company: 'Zara Inforise',
    role: 'Web Developer (Internship)',
    period: 'Jan 2021 – May 2021 | Indore, India',
    points: [
      'Developed admin dashboards using React.js, Redux-Saga, Node.js, Express.js, and MongoDB.',
      'Designed and implemented database improvements and integration APIs.',
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
                    <h1>Cloud &amp; DevOps Engineering Experience</h1>
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
