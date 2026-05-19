import { useEffect, useRef, useState } from 'react';

// Embedded CSS for Cyberpunk Credentials UI
const ACHIEVEMENT_STYLES = `
  .achievements-section {
    position: relative;
    padding: 6rem 2rem;
    background: #050507;
    overflow: hidden;
  }

  /* Digital Grid Background */
  .achievements-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 243, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 0;
    pointer-events: none;
    mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
  }

  .cert-wrapper {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cert-wrapper.power-on {
    opacity: 1;
    transform: translateY(0);
  }

  /* Tech Card Styling */
  .cyber-cert-card {
    position: relative;
    background: rgba(10, 10, 14, 0.7);
    border: 1px solid rgba(0, 243, 255, 0.1);
    /* Angled UI Cut */
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .cyber-cert-card:hover {
    background: rgba(15, 15, 20, 0.9);
    border-color: #00f3ff;
    box-shadow: 0 5px 20px rgba(0, 243, 255, 0.15);
    transform: translateY(-4px);
  }

  /* Image Container & Filters */
  .cert-img-container {
    position: relative;
    height: 180px;
    overflow: hidden;
    border-bottom: 1px solid rgba(0, 243, 255, 0.1);
  }

  .cert-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    filter: grayscale(80%) contrast(1.2);
    transition: all 0.5s ease;
  }

  .cyber-cert-card:hover .cert-img {
    opacity: 1;
    filter: grayscale(0%) contrast(1);
    transform: scale(1.05);
  }

  .cyber-cert-card:hover .cert-img-container {
    border-bottom-color: #00f3ff;
  }

  /* Targeting Reticle (Zoom Icon) */
  .zoom-reticle {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    width: 32px;
    height: 32px;
    background: rgba(10, 10, 14, 0.85);
    border: 1px solid #D72323;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0.7;
    /* High-tech corners */
    clip-path: polygon(25% 0, 75% 0, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0 75%, 0 25%);
  }

  .cyber-cert-card:hover .zoom-reticle {
    opacity: 1;
    background: #D72323;
    box-shadow: 0 0 10px #D72323;
    transform: rotate(90deg);
  }

  /* Modal Styles */
  .cyber-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(5, 5, 7, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.3s ease forwards;
  }

  .cyber-modal-content {
    position: relative;
    max-width: 900px;
    width: 100%;
    background: #0a0a0e;
    padding: 10px;
    border: 1px solid rgba(0, 243, 255, 0.3);
    box-shadow: 0 0 40px rgba(0, 243, 255, 0.15);
    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  /* Neon Corner Accents for Modal */
  .cyber-modal-content::before, .cyber-modal-content::after {
    content: ''; position: absolute; width: 30px; height: 30px; border: 2px solid #00f3ff; pointer-events: none;
  }
  .cyber-modal-content::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
  .cyber-modal-content::after { bottom: -2px; right: -2px; border-left: none; border-top: none; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`;

const CERTS = [
  { id:'c1', title:'NVIDIA — Prompt Engineering',       desc:'Certified in building LLM applications using prompt engineering techniques.',             img:'/certificates/certificate1.jpeg', org:'NVIDIA',           year:'2024' },
  { id:'c2', title:'HP LIFE — Data Science & Analytics', desc:'Completed foundational training in data science and analytics methodologies.',           img:'/certificates/certificate2.jpeg', org:'HP LIFE',          year:'2024' },
  { id:'c3', title:'Outskill — Generative AI Mastermind',desc:'Completed advanced Generative AI training program and applied projects.',               img:'/certificates/certificate3.jpeg', org:'Outskill',         year:'2024' },
  { id:'c4', title:'HP LIFE — AI for Beginners',         desc:'Gained foundational knowledge of artificial intelligence concepts and applications.',   img:'/certificates/certificate4.jpeg', org:'HP LIFE',          year:'2024' },
  { id:'c5', title:'India Space Lab Internship',          desc:'Completed internship training in space science and drone technologies.',                img:'/certificates/certificate5.jpg',  org:'India Space Lab',  year:'2024' },
  { id:'c6', title:'Codec Technologies — AI Internship', desc:'Successfully completed an Artificial Intelligence internship program.',                 img:'/certificates/certificate6.jpg',  org:'Codec Technologies',year:'2024' },
  { id:'c7', title:'AIIoT 2025 — Research Recognition',  desc:'Recognized as co-author of an AI and IoT research paper at AIIoT 2025.',              img:'/certificates/certificate7.jpg',  org:'AIIoT Conference', year:'2025' },
  { id:'c8', title:'Oracle AI Foundations Associate',    desc:'Certified in Oracle Cloud Infrastructure AI foundations and services.',                 img:'/certificates/certificate8.jpg',  org:'Oracle',           year:'2025' },
];

function CertCard({ cert, index, onOpen }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add('power-on');
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="cert-wrapper"
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="cyber-cert-card" onClick={() => onOpen(cert)} title="Click to decrypt">
        
        {/* Image Section */}
        <div className="cert-img-container">
          <img
            src={cert.img}
            alt={cert.title}
            className="cert-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
          {/* Missing Image Tech Fallback */}
          <div style={{
            display: 'none', width: '100%', height: '100%',
            background: '#0a0a0e', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, monospace', fontSize: '0.75rem',
            color: '#D72323', letterSpacing: '0.15em', textAlign: 'center'
          }}>
            [ ENCRYPTED FILE ]
          </div>

          {/* Cyber Reticle */}
          <div className="zoom-reticle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'inherit' }}>
              <path d="M15 3h6v6M9 21H3v-6M21 9V3h-6M3 15v6h6" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          {/* Timestamp Badge */}
          <div style={{
            position: 'absolute', bottom: '0.6rem', left: '0.6rem',
            background: 'rgba(10, 10, 14, 0.9)',
            borderLeft: '2px solid #00f3ff',
            padding: '0.2rem 0.6rem',
            fontFamily: 'Orbitron, monospace', fontSize: '0.6rem',
            letterSpacing: '0.15em', color: '#00f3ff',
          }}>
            TS: {cert.year}
          </div>
        </div>

        {/* Text Section */}
        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{
            fontFamily: 'Orbitron, monospace', fontSize: '0.65rem',
            letterSpacing: '0.2em', color: '#D72323',
            marginBottom: '0.5rem', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <span style={{ display: 'inline-block', width: '4px', height: '4px', background: '#D72323' }}></span>
            {cert.org}
          </div>
          
          <h4 style={{
            fontFamily: 'Orbitron, monospace', fontSize: '0.85rem',
            fontWeight: 700, color: '#F5EDED',
            lineHeight: 1.4, margin: '0 0 0.5rem 0',
          }}>
            {cert.title}
          </h4>
          
          <p style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem',
            color: 'rgba(245,237,237,0.6)', lineHeight: 1.5, margin: 0
          }}>
            {cert.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function Modal({ cert, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="cyber-modal-backdrop" onClick={onClose}>
      <div className="cyber-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '-15px', right: '-15px',
            background: '#0a0a0e', border: '1px solid #D72323',
            color: '#D72323', width: '36px', height: '36px',
            cursor: 'pointer', fontFamily: 'Orbitron, monospace', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', zIndex: 10,
            clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D72323'; e.currentTarget.style.color = '#0a0a0e'; e.currentTarget.style.boxShadow = '0 0 15px #D72323'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0e'; e.currentTarget.style.color = '#D72323'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          ✕
        </button>

        <img 
          src={cert.img} 
          alt={cert.title} 
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '80vh', objectFit: 'contain' }} 
        />
        
        <div style={{
          background: '#0a0a0e', padding: '1rem', textAlign: 'center',
          borderTop: '1px solid rgba(0, 243, 255, 0.2)',
          fontFamily: 'Orbitron, monospace', fontSize: '0.8rem',
          letterSpacing: '0.2em', color: '#00f3ff',
          textTransform: 'uppercase',
        }}>
          [ {cert.title} ]
        </div>
      </div>
    </div>
  );
}

export default function AchievementsSection() {
  const [openCert, setOpenCert] = useState(null);

  return (
    <>
      <style>{ACHIEVEMENT_STYLES}</style>
      
      <section id="achievements" className="achievements-section">
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
              [ SYS_LOG: 05 ] — Credentials
            </span>
            <h2 style={{ 
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              color: '#F5EDED',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Security <span style={{ color: '#D72323', textShadow: '0 0 15px rgba(215, 35, 35, 0.5)' }}>Clearances</span>
            </h2>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'rgba(245,237,237,0.5)',
              marginTop: '1rem',
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              &gt; Click on any datapad to decrypt credential view _
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {CERTS.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} onOpen={setOpenCert} />
            ))}
          </div>
        </div>

        {openCert && <Modal cert={openCert} onClose={() => setOpenCert(null)} />}
      </section>
    </>
  );
}