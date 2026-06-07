// Contact section – display-only contact info + resume download
import React from 'react';
import AnimateBox from './AnimateBox';

export default function Contact() {
  return (
    <section className="colorlib-contact" data-section="contact" id="contact">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h2>Get In Touch</h2>
                    <p>
                      I'm always open to discussing new projects, creative ideas, or opportunities to
                      be part of your vision. Feel free to reach out!
                    </p>
                  </div>
                </div>
              </div>
            </AnimateBox>

            <div className="row">
              {/* Contact info */}
              <div className="col-md-6">
                <AnimateBox effect="fadeInLeft" delay={0}>
                  <ul className="contact-info" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <ContactItem icon="fa-map-marker" label="Location">
                      Chandigarh, Punjab, India
                    </ContactItem>
                    <ContactItem icon="fa-envelope" label="Email">
                      <a href="mailto:md.shadab.azam.ansari@gmail.com">md.shadab.azam.ansari@gmail.com</a>
                    </ContactItem>
                    <ContactItem icon="fa-linkedin" label="LinkedIn">
                      <a
                        href="https://www.linkedin.com/in/sazamansari/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        linkedin.com/in/sazamansari
                      </a>
                    </ContactItem>
                    <ContactItem icon="fa-github" label="GitHub">
                      <a
                        href="https://github.com/sazamansari"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        github.com/sazamansari
                      </a>
                    </ContactItem>
                    <ContactItem icon="fa-instagram" label="Instagram">
                      <a
                        href="https://www.instagram.com/shadab.focused/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        instagram.com/shadab.focused
                      </a>
                    </ContactItem>

                  </ul>
                </AnimateBox>
              </div>

              {/* Resume download + photo */}
              <div className="col-md-6">
                <AnimateBox effect="fadeInRight" delay={100}>
                  <div style={{ textAlign: 'center', padding: '1em 0' }}>
                    <img
                      src="/Md_Shadab_azam_ansari.jpeg"
                      alt="Md Shadab Azam Ansari"
                      style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #FCCE04',
                        marginBottom: '1.5em',
                        display: 'block',
                        margin: '0 auto 1.5em',
                      }}
                    />
                    <a
                      href="/Md_Shadab_Engineer.pdf"
                      download="Md_Shadab_Engineer.pdf"
                      style={{
                        display: 'inline-block',
                        padding: '12px 28px',
                        backgroundColor: '#FCCE04',
                        color: '#000',
                        fontFamily: '"Quicksand", Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        textDecoration: 'none',
                        borderRadius: '2px',
                        transition: '0.3s',
                        border: '2px solid transparent',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.border = '2px solid #FCCE04';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#FCCE04';
                        e.currentTarget.style.border = '2px solid transparent';
                      }}
                    >
                      <i className="fa fa-download" style={{ marginRight: '8px' }} />
                      Download Resume
                    </a>
                  </div>
                </AnimateBox>
              </div>
            </div>

            {/* Footer credit */}
            <AnimateBox effect="fadeIn" delay={200}>
              <div
                style={{
                  marginTop: '4em',
                  paddingTop: '2em',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'rgba(0,0,0,0.4)',
                  fontFamily: '"Quicksand", Arial, sans-serif',
                }}
              >
                <p>
                  &copy; {new Date().getFullYear()} Md Shadab Azam Ansari. All rights reserved.
                </p>
              </div>
            </AnimateBox>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, children }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        marginBottom: '1.4em',
        fontFamily: '"Quicksand", Arial, sans-serif',
        fontSize: '15px',
      }}
    >
      <span
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#FCCE04',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <i className={`fa ${icon}`} style={{ fontSize: '16px', color: '#000' }} />
      </span>
      <div>
        <strong style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(0,0,0,0.4)', marginBottom: '2px' }}>
          {label}
        </strong>
        <span style={{ color: 'rgba(0,0,0,0.75)' }}>{children}</span>
      </div>
    </li>
  );
}
