import { useEffect, useRef } from 'react';
import { 
  Database, 
  BarChart3, 
  Code2, 
  Zap, 
  Bot, 
  Cpu, 
  Box 
} from 'lucide-react';

// Unified Cyberpunk Theme Colors
const CYBER_RED = '#D72323';

const RED_THEME = {
  primary: CYBER_RED,
  secondary: '#9b1b1b', 
  accent: '#ff4d4d',    
};

// Embedded CSS for Cyberpunk / Tech aesthetics
const SKILL_STYLES = `
  .skills-section {
    position: relative;
    padding: 6rem 2rem;
    background: #050507;
    overflow: hidden;
  }

  /* Digital Data Grid Background */
  .skills-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 243, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.02) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
    mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  }

  .skill-card-wrapper {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .skill-card-wrapper.power-on {
    opacity: 1;
    transform: translateY(0);
  }

  /* Cybernetic Skill Module */
  .cyber-skill-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: rgba(10, 10, 14, 0.65);
    border: 1px solid rgba(215, 35, 35, 0.2);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    /* High-tech angled corners */
    clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
    transition: all 0.3s ease;
    cursor: crosshair;
  }

  .cyber-skill-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(135deg, rgba(215, 35, 35, 0.05) 0%, transparent 100%);
    z-index: -1;
    transition: all 0.3s ease;
  }

  /* Hover States */
  .cyber-skill-card:hover {
    background: rgba(15, 15, 20, 0.9);
    border-color: #00f3ff;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px -5px rgba(0, 243, 255, 0.15);
  }

  .cyber-skill-card:hover::before {
    background: linear-gradient(135deg, rgba(0, 243, 255, 0.1) 0%, transparent 100%);
  }

  /* Animated Neon Node */
  .cyber-node {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 6px;
    height: 6px;
    background: #D72323;
    border-radius: 50%;
    box-shadow: 0 0 8px #D72323;
    transition: all 0.3s ease;
  }

  .cyber-skill-card:hover .cyber-node {
    background: #00f3ff;
    box-shadow: 0 0 12px #00f3ff;
  }

  /* Icon & Text Transitions */
  .skill-icon-container {
    margin-bottom: 1.2rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 2px rgba(215, 35, 35, 0.5));
  }

  .cyber-skill-card:hover .skill-icon-container {
    transform: scale(1.15);
    filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.6));
  }

  .skill-name-text {
    font-family: 'Orbitron', monospace;
    font-weight: 600; 
    color: #F5EDED; 
    font-size: 0.75rem;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .cyber-skill-card:hover .skill-name-text {
    color: #00f3ff;
    text-shadow: 0 0 8px rgba(0, 243, 255, 0.4);
  }
`;

const PythonIcon = () => (
  <svg viewBox="0 0 128 128" width="44" height="44">
    <linearGradient id="py-grad1" x1="70.252" y1="1237.476" x2="170.659" y2="1345.886" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.563 0 0 -.568 -29.215 752.561)">
      <stop offset="0" stopColor={RED_THEME.accent}/>
      <stop offset="1" stopColor={RED_THEME.secondary}/>
    </linearGradient>
    <linearGradient id="py-grad2" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.563 0 0 -.568 -29.215 752.561)">
      <stop offset="0" stopColor={RED_THEME.primary}/>
      <stop offset="1" stopColor={RED_THEME.accent}/>
    </linearGradient>
    <path d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" fill="url(#py-grad1)"/>
    <path d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" fill="url(#py-grad2)"/>
  </svg>
);

const GitIcon = () => (
  <svg viewBox="0 0 128 128" width="44" height="44">
    <path fill={RED_THEME.secondary} d="M124.742 58.378L69.625 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.685 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.61 9.61 0 01-3.167-2.11c-2.862-2.861-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00.004-11.501z"/>
  </svg>
);

const HTMLIcon = () => (
  <svg viewBox="0 0 128 128" width="44" height="44">
    <path fill={RED_THEME.secondary} d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/>
    <path fill={RED_THEME.primary} d="M64 116.8l36.378-10.086 8.559-95.878H64z"/>
    <path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"/>
    <path fill="#ffffff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"/>
  </svg>
);

const SKILLS = [
  { name: 'Python',           icon: <PythonIcon /> },
  { name: 'SQL',              icon: <Database size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'Power BI',         icon: <BarChart3 size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'VS Code',          icon: <Code2 size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'Arduino IDE',      icon: <Zap size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'Roboflow',         icon: <Bot size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'Arduino UNO',      icon: <Cpu size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'Blender',          icon: <Box size={38} color={RED_THEME.primary} strokeWidth={1.5} /> },
  { name: 'HTML / CSS / JS',  icon: <HTMLIcon /> },
  { name: 'Git & GitHub',     icon: <GitIcon /> },
];

function SkillCard({ skill, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentRef.classList.add('power-on');
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="skill-card-wrapper"
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <div className="cyber-skill-card" title={`Initialize ${skill.name} module`}>
        {/* Dynamic Glowing Status Node */}
        <div className="cyber-node" />

        {/* Icon Container */}
        <div className="skill-icon-container">
          {skill.icon}
        </div>

        {/* Formatted Tech Name */}
        <span className="skill-name-text">
          <span style={{ opacity: 0.4, marginRight: '4px' }}>[</span>
          {skill.name}
          <span style={{ opacity: 0.4, marginLeft: '4px' }}>]</span>
        </span>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <>
      <style>{SKILL_STYLES}</style>

      <section id="skills" className="skills-section">
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Cyberpunk Header */}
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <span style={{
               display: 'inline-block',
               fontFamily: 'Orbitron, monospace',
               color: CYBER_RED, 
               fontWeight: 'bold', 
               textTransform: 'uppercase', 
               letterSpacing: '3px', 
               fontSize: '0.8rem',
               marginBottom: '1rem',
               textShadow: `0 0 8px rgba(215, 35, 35, 0.4)`
            }}>
              [ SYS_LOG: 03 ] — Arsenal
            </span>
            <h2 style={{ 
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              color: '#F5EDED',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Skills & <span style={{ color: CYBER_RED, textShadow: `0 0 15px rgba(215, 35, 35, 0.5)` }}>Tools</span>
            </h2>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'rgba(245,237,237,0.5)',
              marginTop: '1rem',
              fontSize: '1.05rem',
              letterSpacing: '1px'
            }}>
              &gt; Databanks loaded. Analyzing operational competencies _
            </p>
          </div>

          {/* Dense Tech Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1.25rem',
          }}>
            {SKILLS.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} />
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
}