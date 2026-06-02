// About section – exact content from original index.html
import React from 'react';
import AnimateBox from './AnimateBox';

export default function About() {
  return (
    <section className="colorlib-about" data-section="about" id="about">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">

            {/* Bio */}
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h1>
                      Md Shadab Azam{' '}
                      <span style={{ color: '#FACD69' }}>Ansari</span>
                    </h1>
                    <h2>Software Engineer | Cloud Engineer | DevOps Engineer</h2>
                    <hr />
                    <p>
                      Cloud &amp; DevOps Engineer with expertise in designing, deploying, and
                      automating scalable solutions on AWS using Docker, Kubernetes, Terraform, and
                      CI/CD pipelines (Jenkins, GitHub Actions). Experienced in cloud-native
                      architectures, containerized deployments, and monitoring high-availability
                      applications.
                    </p>
                    <p>
                      Proficient in Node.js, React.js, Express, and MongoDB for building full-stack
                      solutions integrated with AWS services (EC2, S3, Lambda, API Gateway).
                      Delivered 15+ cloud-hosted projects, optimizing infrastructure cost,
                      performance, and reliability through automation and Infrastructure as Code.
                    </p>
                    <p>
                      Skilled in troubleshooting production issues, developing reusable APIs and
                      components, and implementing modern DevOps practices to streamline delivery
                      pipelines.
                    </p>
                    <p>
                      Ability to understand business requirements and translate them into technical
                      requirements. Familiarity with common tools such as Git, Bitbucket, JIRA.
                      Also, I play a role as a Tech Panel  at Pod Invest apart from my existing
                      role and responsibilities in the project. Getting an opportunity to interact
                      with many people and sharing thoughts out of the box. 
                    </p>
                  </div>
                </div>
              </div>
            </AnimateBox>

            {/* Service cards */}
            <div className="row">
              <div className="col-md-3">
                <AnimateBox effect="fadeInRight" delay={0}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <div className="services color-5">
                      <span className="icon2">
                        <i className="fa fa-code" />
                      </span>
                      <h3>
                        Full Stack
                        <br />
                        Development
                      </h3>
                    </div>
                  </a>
                </AnimateBox>
              </div>

              <div className="col-md-3">
                <AnimateBox effect="fadeInRight" delay={100}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <div className="services color-2">
                      <span className="icon2">
                        <i className="fa fa-cloud" />
                      </span>
                      <h3>
                        DevOps
                        <br />
                        Engineering
                      </h3>
                    </div>
                  </a>
                </AnimateBox>
              </div>

              <div className="col-md-3">
                <AnimateBox effect="fadeInRight" delay={200}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <div className="services color-3">
                      <span className="icon2">
                        <i className="fa fa-cubes" />
                      </span>
                      <h3>
                        Docker 
                        <br />
                         Kubernetes 
                      </h3>
                    </div>
                  </a>
                </AnimateBox>
              </div>

              <div className="col-md-3">
                <AnimateBox effect="fadeInRight" delay={300}>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <div className="services color-4">
                      <span className="icon2">
                        <i className="fa fa-rocket" />
                      </span>
                      <h3>
                        CI/CD (Jenkins)
                        <br />
                        Pipelines
                      </h3>
                    </div>
                  </a>
                </AnimateBox>
              </div>
            </div>

            {/* Hire banner */}
            <div className="row">
              <div className="col-md-12">
                <AnimateBox effect="fadeInLeft">
                  <div className="hire">
                    <h2>
                      You will be happy to know that I have completed over 20+ projects
                      successfully!
                    </h2>
                  </div>
                </AnimateBox>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
