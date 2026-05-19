import { useState, useRef, useEffect } from 'react';

// Embedded CSS for Cyberpunk / Tech aesthetics
const CONTACT_STYLES = `
  .contact-section {
    position: relative;
    padding: 6rem 2rem;
    background: #050507;
    overflow: hidden;
  }

  /* Digital Grid Background */
  .contact-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(215, 35, 35, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(215, 35, 35, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    pointer-events: none;
    mask-image: radial-gradient(ellipse at bottom, black 10%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse at bottom, black 10%, transparent 80%);
  }

  /* Direct Mail Form Card */
  .cyber-mail-card {
    background: rgba(10, 10, 14, 0.85);
    border: 1px solid rgba(0, 243, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px));
    position: relative;
    padding: 2.5rem;
    transition: all 0.4s ease;
    opacity: 0;
    transform: translateY(30px);
  }

  .cyber-mail-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cyber-mail-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00f3ff, transparent);
  }

  /* Input Fields */
  .cyber-input {
    width: 100%;
    background: rgba(5, 5, 7, 0.8);
    border: 1px solid rgba(215, 35, 35, 0.3);
    color: #F5EDED;
    padding: 0.9rem 1.2rem;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
  }

  .cyber-input:focus {
    outline: none;
    border-color: #00f3ff;
    background: rgba(0, 243, 255, 0.05);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.1);
  }

  .cyber-input::placeholder {
    color: rgba(245, 237, 237, 0.3);
  }

  .cyber-label {
    display: block;
    font-family: 'Orbitron', monospace;
    font-size: 0.7rem;
    color: #00f3ff;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }

  /* Cyber Button */
  .cyber-btn {
    background: rgba(215, 35, 35, 0.15);
    border: 1px solid #D72323;
    color: #D72323;
    padding: 0.8rem 2.5rem;
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
  }

  .cyber-btn:hover {
    background: #D72323;
    color: #0a0a0e;
    box-shadow: 0 0 20px rgba(215, 35, 35, 0.6);
  }

  .cyber-btn:disabled {
    background: transparent;
    border-color: #555;
    color: #555;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Cybertronic Profile Animations */
  .cyber-profile-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    margin: 0 auto 1.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cyber-ring-outer {
    position: absolute;
    inset: -15px;
    border: 2px dashed #D72323;
    border-radius: 50%;
    animation: rotateOuter 12s linear infinite;
    opacity: 0.7;
  }

  .cyber-ring-inner {
    position: absolute;
    inset: -6px;
    border: 2px solid transparent;
    border-top: 2px solid #00f3ff;
    border-bottom: 2px solid #D72323;
    border-radius: 50%;
    animation: rotateInner 8s linear infinite reverse;
    box-shadow: 0 0 10px rgba(215, 35, 35, 0.4), inset 0 0 10px rgba(0, 243, 255, 0.4);
  }

  .cyber-profile-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    filter: grayscale(20%) contrast(1.1);
    border: 3px solid #0a0a0e;
    transition: all 0.4s ease;
  }

  .cyber-profile-wrapper:hover .cyber-profile-pic {
    filter: grayscale(0%) contrast(1.2);
    box-shadow: 0 0 25px rgba(215, 35, 35, 0.6);
  }

  .cyber-profile-wrapper:hover .cyber-ring-outer {
    border-color: #00f3ff;
    animation-duration: 6s;
  }

  /* Social Links */
  .cyber-social-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    background: rgba(10, 10, 14, 0.5);
    border: 1px solid rgba(0, 243, 255, 0.1);
    text-decoration: none;
    color: #F5EDED;
    transition: all 0.3s ease;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
  }

  .cyber-social-link:hover {
    background: rgba(0, 243, 255, 0.1);
    border-color: #00f3ff;
    transform: translateX(10px);
    box-shadow: -5px 0 15px rgba(0, 243, 255, 0.1);
  }

  .cyber-social-icon {
    color: #D72323;
    transition: all 0.3s ease;
  }
  
  .cyber-social-link:hover .cyber-social-icon {
    color: #00f3ff;
    filter: drop-shadow(0 0 5px #00f3ff);
  }

  @keyframes rotateOuter { 100% { transform: rotate(360deg); } }
  @keyframes rotateInner { 100% { transform: rotate(-360deg); } }
  @keyframes blinkRed { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

const SOCIALS = [
  {
    label: 'GitHub',
    handle: '@KARAN-1309',
    href: 'https://github.com/KARAN-1309',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'karan-jogi-4592b0285',
    href: 'https://www.linkedin.com/in/karan-jogi-4592b0285/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Gmail',
    handle: 'karanjogi2021@gmail.com',
    href: 'mailto:karanjogi2021@gmail.com',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    handle: '@itz._karan_613',
    href: 'https://www.instagram.com/itz._karan_613',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

const INIT = { name: '', email: '', subject: '', message: '' };

export default function ContactSection() {
  const [form,    setForm]    = useState(INIT);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          ref.current?.classList.add('visible');
        } 
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('[ ERR: Incomplete parameters. Name, Email, and Message required. ]');
      return;
    }
    setSending(true);
    setError('');
    
    // Constructing the mailto functionality
    const subject = encodeURIComponent(form.subject || `Portfolio Contact from ${form.name}`);
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    
    // Triggers the user's default mail client
    window.location.href = `mailto:karanjogi2021@gmail.com?subject=${subject}&body=${body}`;
    
    setTimeout(() => { 
      setSending(false); 
      setSent(true); 
      setForm(INIT); 
    }, 1200);
  };

  return (
    <>
      <style>{CONTACT_STYLES}</style>
      
      <section id="contact" className="contact-section">
        <div style={{ maxWidth: '1060px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{
               display: 'inline-block',
               fontFamily: 'Orbitron, monospace',
               color: '#D72323', 
               fontWeight: 'bold', 
               textTransform: 'uppercase', 
               letterSpacing: '3px', 
               fontSize: '0.8rem',
               marginBottom: '1rem',
               textShadow: '0 0 8px rgba(0, 243, 255, 0.4)'
            }}>
              [ SYS_LOG: 06 ] — Communications
            </span>
            <h2 style={{ 
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              color: '#F5EDED',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Establish <span style={{ color: '#D72323', textShadow: '0 0 15px rgba(215, 35, 35, 0.5)' }}>Uplink</span>
            </h2>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'rgba(245,237,237,0.5)',
              marginTop: '1rem',
              fontSize: '1.05rem',
              letterSpacing: '1px'
            }}>
              &gt; Have a project in mind? Let's build something extraordinary _
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}>

            {/* ── Direct Mail Form Card ── */}
            <div ref={ref} className="cyber-mail-card">
              
              {/* HUD Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '2rem',
                paddingBottom: '1.2rem',
                borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#D72323',
                  boxShadow: '0 0 10px #D72323',
                  animation: 'blinkRed 1.5s infinite',
                }} />
                <span style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  color: '#00f3ff',
                  textTransform: 'uppercase',
                }}>
                  Direct Mail Terminal
                </span>
              </div>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D72323" strokeWidth="2" strokeLinecap="square" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px #D72323)' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h3 style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '1.2rem',
                    color: '#D72323',
                    letterSpacing: '0.15em',
                    marginBottom: '0.8rem',
                  }}>
                    MAIL DISPATCHED
                  </h3>
                  <p style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    color: 'rgba(245,237,237,0.7)',
                    fontSize: '1.05rem',
                    marginBottom: '2.5rem'
                  }}>
                    Your email client has been opened.
                  </p>
                  <button onClick={() => setSent(false)} className="cyber-btn">
                    SEND ANOTHER MAIL
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label className="cyber-label">Your Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        className="cyber-input" placeholder="John Doe" autoComplete="name" />
                    </div>
                    <div>
                      <label className="cyber-label">Your Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        className="cyber-input" placeholder="john@example.com" autoComplete="email" />
                    </div>
                  </div>
                  <div>
                    <label className="cyber-label">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange}
                      className="cyber-input" placeholder="Project Inquiry..." />
                  </div>
                  <div>
                    <label className="cyber-label">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      className="cyber-input" placeholder="Tell me about your project..."
                      rows={5} style={{ resize: 'vertical', minHeight: '130px' }} />
                  </div>
                  {error && (
                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', color: '#D72323', margin: 0 }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" className="cyber-btn" disabled={sending}
                    style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    {sending ? 'PREPARING MAIL...' : 'SEND DIRECT MAIL →'}
                  </button>
                </form>
              )}
            </div>

            {/* ── Right Column: Profile + Socials ── */}
            <div>

              {/* Cybertronic Profile Picture */}
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div className="cyber-profile-wrapper">
                  {/* Animated Cybernetic Rings */}
                  <div className="cyber-ring-outer" />
                  <div className="cyber-ring-inner" />
                  
                  <img
                    src="/profile.png"
                    alt="Karan Jogi"
                    className="cyber-profile-pic"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback Initials */}
                  <div style={{
                    display: 'none', width: '100%', height: '100%',
                    background: '#0a0a0e', borderRadius: '50%',
                    border: '2px solid #D72323', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Orbitron, monospace', fontSize: '2.5rem',
                    fontWeight: 700, color: '#D72323', letterSpacing: '0.05em', zIndex: 2
                  }}>
                    KJ
                  </div>
                </div>

                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#F5EDED',
                  letterSpacing: '0.25em',
                  marginTop: '1rem',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}>
                  KARAN JOGI
                </div>
                <div style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: '0.95rem',
                  color: '#00f3ff',
                  letterSpacing: '0.15em',
                  marginTop: '0.3rem',
                  textTransform: 'uppercase'
                }}>
                  AI · IoT · Software Eng
                </div>
              </div>

              {/* Socials Header */}
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                color: '#D72323',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.2rem',
              }}>
                <span style={{ display: 'block', width: '20px', height: '1px', background: '#D72323' }}></span>
                Network Nodes
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="cyber-social-link"
                  >
                    <span className="cyber-social-icon">{s.icon}</span>
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontFamily: 'Orbitron, monospace',
                        fontSize: '0.7rem',
                        letterSpacing: '0.2em',
                        color: 'inherit',
                        textTransform: 'uppercase'
                      }}>
                        {s.label}
                      </span>
                      <span style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '0.9rem',
                        color: 'rgba(245,237,237,0.5)',
                      }}>
                        {s.handle}
                      </span>
                    </span>
                    <svg
                      style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.5 }}
                      width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="#00f3ff" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </a>
                ))}
              </div>

              {/* Server Status Monitor */}
              <div style={{ 
                marginTop: '2.5rem', 
                padding: '1.2rem',
                background: 'rgba(5, 5, 7, 0.8)',
                border: '1px solid rgba(0, 243, 255, 0.15)',
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
              }}>
                <div style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  color: '#00f3ff',
                  textTransform: 'uppercase',
                  marginBottom: '0.8rem',
                }}>
                  [ SYSTEM STATUS ]
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{
                    width: '10px', height: '10px',
                    background: '#00ff00',
                    boxShadow: '0 0 10px #00ff00',
                    animation: 'blinkRed 2s infinite',
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                  }} />
                  <span style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '1rem',
                    color: 'rgba(245,237,237,0.8)',
                    letterSpacing: '1px'
                  }}>
                    Ready for deployment & collaboration
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0, 243, 255, 0.1)',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: 'rgba(245,237,237,0.4)',
              textTransform: 'uppercase',
            }}>
              © 2026 Karan Jogi_ <br/>
              <span style={{ color: '#D72323' }}>Engineered with React + Vite</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}