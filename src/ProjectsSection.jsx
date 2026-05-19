import { useEffect, useRef } from 'react';

// Embedded CSS for Cyberpunk / Tech aesthetics
const PROJECT_STYLES = `
  .projects-section {
    position: relative;
    padding: 6rem 2rem;
    background: #050505;
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(0, 243, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(215, 35, 35, 0.03) 0%, transparent 50%);
    overflow: hidden;
  }

  /* Animated Grid Background */
  .projects-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    pointer-events: none;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  }

  .project-card-wrapper {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .project-card-wrapper.power-on {
    opacity: 1;
    transform: translateY(0);
  }

  .cyber-card {
    position: relative;
    height: 420px;
    background: #0a0a0e;
    border: 1px solid rgba(0, 243, 255, 0.15);
    /* Cyberpunk geometric cut corners */
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%);
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: pointer;
  }

  .cyber-card:hover {
    border-color: #00f3ff;
    box-shadow: 0 10px 30px -10px rgba(0, 243, 255, 0.3);
    transform: translateY(-5px);
  }

  /* Cyber Scanline Effect on Hover */
  .cyber-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: #00f3ff;
    box-shadow: 0 0 10px #00f3ff;
    opacity: 0;
    z-index: 5;
    pointer-events: none;
  }

  .cyber-card:hover::after {
    animation: scanline 2.5s linear infinite;
    opacity: 0.8;
  }

  @keyframes scanline {
    0% { top: -10%; }
    100% { top: 110%; }
  }

  /* Image Styling & Transitions */
  .cyber-img-container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
  }

  .cyber-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
    filter: grayscale(80%) sepia(20%) hue-rotate(180deg) contrast(1.2);
    transition: all 0.5s ease;
  }

  .cyber-card:hover .cyber-img {
    opacity: 0.7;
    filter: grayscale(0%) contrast(1.1);
    transform: scale(1.05);
  }

  /* Gradient Overlay */
  .cyber-gradient {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, rgba(10,10,14,0.2) 0%, rgba(10,10,14,0.95) 70%, #0a0a0e 100%);
    z-index: 2;
    transition: all 0.4s ease;
  }

  .cyber-card:hover .cyber-gradient {
    background: linear-gradient(180deg, rgba(10,10,14,0.1) 0%, rgba(10,10,14,0.9) 60%, #0a0a0e 100%);
  }

  /* Content Reveal Logic */
  .cyber-content {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 2rem;
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
  }

  .cyber-tag {
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    color: #D72323;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    transform: translateY(110px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cyber-title {
    font-family: 'Orbitron', monospace;
    font-size: 1.4rem;
    font-weight: 700;
    color: #F5EDED;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0);
    transform: translateY(110px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cyber-desc {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.95rem;
    color: rgba(245, 237, 237, 0.7);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cyber-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Orbitron', monospace;
    font-size: 0.75rem;
    color: #00f3ff;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    width: fit-content;
  }

  .cyber-link:hover {
    color: #ffffff;
    text-shadow: 0 0 8px #00f3ff;
  }

  /* Hover Triggers */
  .cyber-card:hover .cyber-tag,
  .cyber-card:hover .cyber-title {
    transform: translateY(0);
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  }

  .cyber-card:hover .cyber-desc,
  .cyber-card:hover .cyber-link {
    opacity: 1;
    transform: translateY(0);
  }

  /* Staggered delay for smooth entrance */
  .cyber-card:hover .cyber-desc { transition-delay: 0.1s; }
  .cyber-card:hover .cyber-link { transition-delay: 0.2s; }
`;

const PROJECTS = [
  {
    id:    'dhanush',
    title: 'DHANUSH 1.0',
    tag:   'AI · ISR · Computer Vision',
    img:   '/projects/Dhanush.png',
    desc:  'A standalone, mission-ready desktop platform engineered for advanced Intelligence, Surveillance, and Reconnaissance (ISR) operations. Provides real-time intelligence through automated detection, classification, and persistent tracking of military aircraft.',
    link:  'https://github.com/KARAN-1309/DHANUSH_1.0',
  },
  {
    id:    'whichkatha',
    title: 'WHICH_KATHA',
    tag:   'AI · Recommendation Engine',
    img:   '/projects/WK.png',
    desc:  'An intelligent movie and TV show recommendation engine designed to solve decision paralysis. Uses a Smart Context Engine to understand specific queries like "Similar to Breaking Bad" or "Bollywood Spy Thriller from the 90s".',
    link:  'https://github.com/KARAN-1309/Which_Katha',
  },
  {
    id:    'rover',
    title: 'NRF24L01 RC ROVER',
    tag:   'Embedded · Arduino · Wireless',
    img:   '/projects/car.jpeg',
    desc:  'High-performance wireless RC car using Arduino Nano as transmitter and Arduino UNO as receiver, communicating via NRF24L01 transceiver. Controls dual BLDC motors and an MG996R servo motor with joystick-based remote control.',
    link:  null,
  },
  {
    id:    'container',
    title: 'IoT SMART CONTAINER',
    tag:   'IoT · ESP32 · Sensors',
    img:   '/projects/container.png',
    desc:  'An ESP32-powered intelligent monitoring system using ultrasonic sensors to measure fill levels and load sensors to detect weight in real-time. Wirelessly transmits data to cloud platforms for automated monitoring.',
    link:  null,
  },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.classList.add('power-on');
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="project-card-wrapper"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="cyber-card">
        
        {/* Image Background */}
        <div className="cyber-img-container">
          <img
            src={project.img}
            alt={project.title}
            className="cyber-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback if image breaks */}
          <div style={{
            display: 'none', width: '100%', height: '100%',
            background: 'repeating-linear-gradient(45deg, rgba(215, 35, 35, 0.05) 0px, rgba(215, 35, 35, 0.05) 2px, transparent 2px, transparent 8px), #0a0a0e',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Orbitron, monospace', fontSize: '0.85rem',
            color: '#D72323', letterSpacing: '0.15em',
            textTransform: 'uppercase', textAlign: 'center', padding: '1rem'
          }}>
            [ Visual Data Missing ]
          </div>
        </div>

        {/* Gradient Fade */}
        <div className="cyber-gradient" />

        {/* Animated Content Overlay */}
        <div className="cyber-content">
          <div className="cyber-tag">[ {project.tag} ]</div>
          <h3 className="cyber-title">{project.title}</h3>
          <p className="cyber-desc">{project.desc}</p>

          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="cyber-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              Access Source Code
            </a>
          ) : (
            <span className="cyber-link" style={{ color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
              Hardware Implementation
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <>
      <style>{PROJECT_STYLES}</style>
      
      <section id="projects" className="projects-section">
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
              [ SYS_LOG: 04 ] — Projects
            </span>
            <h2 style={{ 
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              color: '#F5EDED',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Field <span style={{ color: '#D72323', textShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}>Operations</span>
            </h2>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'rgba(245,237,237,0.5)',
              marginTop: '1rem',
              fontSize: '1rem',
              letterSpacing: '1px'
            }}>
              &gt; Hover over databanks to unlock mission brief _
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}