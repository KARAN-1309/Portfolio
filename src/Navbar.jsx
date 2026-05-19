import { useState, useEffect } from 'react';

// Embedded CSS for Cyberpunk aesthetics (clip-paths and glowing hovers)
const CYBER_STYLES = `
  .cyber-nav-link {
    position: relative;
    display: inline-block;
    color: #a3a3a3;
    text-decoration: none;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 0.6rem 1.2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    /* Futuristic angled cut edges */
    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
    border: 1px solid transparent;
    background: transparent;
  }

  .cyber-nav-link:hover {
    color: #090909;
    background: #00f3ff; /* Neon Cyan */
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.8);
    text-shadow: none;
  }

  /* Active state changes to Neon Red/Magenta */
  .cyber-nav-link.active {
    color: #ff003c;
    border-bottom: 2px solid #ff003c;
    text-shadow: 0 0 10px rgba(255, 0, 60, 0.6);
  }

  .cyber-nav-link.active:hover {
    color: #090909;
    background: #ff003c;
    box-shadow: 0 0 15px rgba(255, 0, 60, 0.8);
    border-bottom-color: transparent;
  }

  .cyber-logo {
    transition: all 0.3s ease;
  }
  .cyber-logo:hover {
    color: #00f3ff !important;
    text-shadow: 2px 0px #ff003c, -2px 0px #fcee0a; /* RGB Glitch effect */
  }
`;

const LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Education',    href: '#education' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact',      href: '#contact' },
];

export default function Navbar() {
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  /* Scroll / active-section detection */
  useEffect(() => {
    const onScroll = () => {
      // Find which section is currently in view
      const sections = LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
      let current = '';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) current = '#' + section.id;
      }
      setActiveHref(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsMenuHovered(false);
    setIsNavHovered(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{CYBER_STYLES}</style>
      
      <nav 
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isNavHovered ? '1rem 2.5rem' : '1.5rem 3rem',
          // Transparent unless hovered
          background: isNavHovered ? 'rgba(10, 10, 14, 0.85)' : 'transparent',
          backdropFilter: isNavHovered ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isNavHovered ? 'blur(12px)' : 'none',
          borderBottom: isNavHovered ? '1px solid rgba(0, 243, 255, 0.2)' : '1px solid transparent',
          boxShadow: isNavHovered ? '0 4px 30px rgba(0, 243, 255, 0.05)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Cyberpunk Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cyber-logo"
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '2px',
            padding: 0,
            fontFamily: "'Courier New', Courier, monospace"
          }}
          aria-label="Home"
        >
          KJ<span style={{ color: '#ff003c' }}>_</span>
        </button>

        {/* Interactive Menu Area */}
        <div 
          onMouseEnter={() => setIsMenuHovered(true)}
          onMouseLeave={() => setIsMenuHovered(false)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '45px',
            minWidth: '50px',
            cursor: 'pointer'
          }}
        >
          
          {/* Neon Dashed Hamburger */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              position: 'absolute',
              right: 0,
              opacity: isMenuHovered ? 0 : 1,
              transform: isMenuHovered ? 'scale(0.5) translateX(20px)' : 'scale(1) translateX(0)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: 'none'
            }}
          >
            <span style={{ width: '28px', borderBottom: '2px dashed #00f3ff', filter: 'drop-shadow(0 0 2px #00f3ff)' }} />
            <span style={{ width: '28px', borderBottom: '2px dashed #ff003c', filter: 'drop-shadow(0 0 2px #ff003c)' }} />
            <span style={{ width: '28px', borderBottom: '2px dashed #00f3ff', filter: 'drop-shadow(0 0 2px #00f3ff)' }} />
          </div>

          {/* Cyberpunk Desktop Links Container */}
          <ul 
            style={{
              display: 'flex',
              gap: '1rem',
              margin: 0,
              padding: '0',
              listStyle: 'none',
              opacity: isMenuHovered ? 1 : 0,
              transform: isMenuHovered ? 'translateX(0)' : 'translateX(30px)',
              pointerEvents: isMenuHovered ? 'auto' : 'none',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {LINKS.map(({ label, href }) => {
              const isActive = activeHref === href;
              
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`cyber-nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

        </div>
      </nav>
    </>
  );
}