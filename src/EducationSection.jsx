import { useEffect, useRef } from 'react';

// Embedded CSS for the Circuit Board aesthetics
const CIRCUIT_STYLES = `
  .circuit-section {
    position: relative;
    padding: 6rem 2rem;
    background: rgba(10, 10, 14, 0.4);
    overflow: hidden;
  }

  /* Grid Background Overlay */
  .circuit-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
  }

  .circuit-timeline {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 0;
    z-index: 1;
  }

  /* Central Glowing Wire (The Bus) */
  .circuit-timeline::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(180deg, 
      transparent 0%, 
      #D72323 15%, 
      #00f3ff 50%, 
      #D72323 85%, 
      transparent 100%
    );
    transform: translateX(-50%);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), 0 0 5px rgba(215, 35, 35, 0.6);
  }

  .circuit-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4rem;
    width: 100%;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .circuit-item.power-on {
    opacity: 1;
    transform: translateY(0);
  }

  /* Alternating left/right layout */
  .circuit-item:nth-child(even) {
    flex-direction: row-reverse;
  }

  /* Solder Pad (Timeline Node) */
  .circuit-node {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 16px;
    background: #090909;
    border: 3px solid #00f3ff;
    border-radius: 50%;
    z-index: 3;
    box-shadow: 0 0 10px #00f3ff, inset 0 0 4px #00f3ff;
    transition: all 0.3s ease;
  }

  .circuit-item:hover .circuit-node {
    background: #00f3ff;
    border-color: #D72323;
    box-shadow: 0 0 20px #D72323, inset 0 0 10px #D72323;
  }

  /* Data Traces (Connecting lines) */
  .circuit-trace {
    position: absolute;
    top: 50%;
    width: 0; /* Animates in */
    height: 2px;
    background: #00f3ff;
    z-index: 2;
    box-shadow: 0 0 8px #00f3ff;
    transition: width 0.8s ease-out 0.3s;
  }
  
  .circuit-item:nth-child(odd) .circuit-trace {
    right: 50%;
  }
  .circuit-item:nth-child(even) .circuit-trace {
    left: 50%;
  }

  .circuit-item.power-on .circuit-trace {
    width: 8%;
  }

  .circuit-card-wrapper {
    width: 42%;
    position: relative;
  }

  /* The Actual Card */
  .circuit-card {
    background: rgba(10, 10, 14, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(215, 35, 35, 0.3);
    /* Cyberpunk cut corners */
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    padding: 1px; /* Creates inner gradient border effect */
    position: relative;
    transition: all 0.3s ease;
  }

  .circuit-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(45deg, transparent 40%, rgba(0, 243, 255, 0.1) 100%);
    z-index: -1;
  }

  .circuit-item:hover .circuit-card {
    border-color: #00f3ff;
    box-shadow: 0 10px 30px -10px rgba(0, 243, 255, 0.3);
    transform: translateY(-5px);
  }

  .circuit-card-inner {
    background: #0f0f13;
    clip-path: polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px));
    height: 100%;
  }

  /* Mobile Responsive Fixes */
  @media (max-width: 768px) {
    .circuit-timeline::after {
      left: 20px;
    }
    .circuit-item, .circuit-item:nth-child(even) {
      flex-direction: column;
      align-items: flex-start;
      padding-left: 50px;
    }
    .circuit-node {
      left: 20px;
    }
    .circuit-card-wrapper {
      width: 100%;
    }
    .circuit-trace, .circuit-item:nth-child(odd) .circuit-trace, .circuit-item:nth-child(even) .circuit-trace {
      left: 20px;
      top: 20px;
    }
    .circuit-item.power-on .circuit-trace {
      width: 30px;
    }
  }
`;

const TIMELINE = [
  {
    period: '2008 – 2021',
    title:  'Secondary Education',
    school: 'Sacred Heart School, Adra',
    img:    '/education/shs.jpg',
    detail: 'Built a strong academic foundation across sciences, mathematics, and languages. Developed early curiosity for technology and electronics.',
  },
  {
    period: '2021 – 2023',
    title:  'Higher Secondary Education',
    school: 'Delhi Public School, Durgapur',
    img:    '/education/dps.jpg',
    detail: 'Specialized in Physics, Chemistry, Mathematics & Computer Science. Completed board exams with distinction and developed programming fundamentals.',
  },
  {
    period: '2023 – Present',
    title:  'B.Tech — Computer Science & Eng.',
    school: 'Brainware University, Barasat',
    img:    '/education/bwu.jpg',
    detail: 'Pursuing a degree at the intersection of AI, IoT, and software engineering. Active in research, internships, and hands-on embedded systems projects.',
  },
];

function TimelineItem({ item, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          ref.current?.classList.add('power-on');
          // Optional: Stop observing once animated
          // observer.unobserve(ref.current);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="circuit-item" style={{ transitionDelay: `${index * 0.15}s` }}>
      
      {/* Circuit Trace & Solder Node */}
      <div className="circuit-trace" />
      <div className="circuit-node" />

      {/* Content Card */}
      <div className="circuit-card-wrapper">
        <div className="circuit-card">
          <div className="circuit-card-inner">
            
            <div style={{ position: 'relative', overflow: 'hidden', height: '140px' }}>
              <img
                src={item.img}
                alt={item.school}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, mixBlendMode: 'luminosity' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Tech Fallback if image fails */}
              <div style={{
                display: 'none', width: '100%', height: '100%',
                background: 'repeating-linear-gradient(45deg, rgba(0, 243, 255, 0.05) 0px, rgba(0, 243, 255, 0.05) 2px, transparent 2px, transparent 8px), #0a0a0e',
                alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Orbitron, monospace', fontSize: '0.85rem',
                color: '#00f3ff', letterSpacing: '0.15em',
                textTransform: 'uppercase', textAlign: 'center', padding: '1rem'
              }}>
                [ Data Record: {item.school.split(',')[0]} ]
              </div>

              {/* Glowing Period Badge */}
              <div style={{
                position: 'absolute', top: '0.8rem',
                ...(isLeft ? { right: '0.8rem' } : { left: '0.8rem' }),
                background: 'rgba(10,10,14,0.9)',
                border: '1px solid #00f3ff',
                boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)',
                padding: '0.3rem 0.8rem',
                fontFamily: 'Orbitron, monospace', fontSize: '0.65rem',
                letterSpacing: '0.15em', color: '#00f3ff',
                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
              }}>
                {item.period}
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{
                fontFamily: 'Orbitron, monospace', fontSize: '0.65rem',
                letterSpacing: '0.25em', color: '#D72323',
                textTransform: 'uppercase', marginBottom: '0.5rem',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#D72323', borderRadius: '50%' }}></span>
                {item.title}
              </div>
              
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                fontWeight: 600, color: '#F5EDED',
                marginBottom: '0.8rem', lineHeight: 1.3,
              }}>
                {item.school}
              </h3>
              
              <p style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '0.95rem', color: 'rgba(245,237,237,0.7)',
                lineHeight: 1.7, margin: 0
              }}>
                {item.detail}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EducationSection() {
  return (
    <>
      <style>{CIRCUIT_STYLES}</style>
      
      <section id="education" className="circuit-section">
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{
             display: 'inline-block',
             fontFamily: 'Orbitron, monospace',
             color: '#D72323', 
             fontWeight: 'bold', 
             textTransform: 'uppercase', 
             letterSpacing: '3px', 
             fontSize: '0.8rem',
             marginBottom: '1rem',
             textShadow: '0 0 8px rgba(215, 35, 35, 0.4)'
          }}>
            [ SYS_LOG: 02 ] — Education
          </span>
          <h2 style={{ 
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            color: '#F5EDED',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Academic <span style={{ color: '#D72323', textShadow: '0 0 15px rgba(215, 35, 35, 0.5)' }}>Journey</span>
          </h2>
        </div>

        <div className="circuit-timeline">
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}