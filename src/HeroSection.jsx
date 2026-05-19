import { useEffect, useRef, useState, useCallback } from 'react';

// Embedded CSS for Cyberpunk / HUD aesthetics
const HERO_STYLES = `
  .hero-scroll-container {
    position: relative;
    background: #050507;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .hero-canvas {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 1;
    filter: contrast(1.1) brightness(0.8);
    /* Zoom/Scale removed to fill screen natively */
  }

  /* Overlay - Vignette removed, kept only a gentle bottom fade for blending */
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(5,5,7,0.2) 0%, rgba(5,5,7,0.1) 60%, #050507 100%);
    z-index: 2;
  }

  /* Tactical Grid */
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    z-index: 3;
    pointer-events: none;
  }

  /* Animated Scanline */
  .scan-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: rgba(0, 243, 255, 0.5);
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.8);
    z-index: 4;
    opacity: 0.6;
    animation: scan 8s linear infinite;
    pointer-events: none;
  }

  @keyframes scan {
    0% { transform: translateY(-10px); }
    100% { transform: translateY(100vh); }
  }

  /* HUD Targeting Corners - Adjusted to sit below navbar */
  .hud-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #D72323;
    z-index: 10;
    pointer-events: none;
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  .hud-corner-tl { top: 100px; left: 30px; border-right: none; border-bottom: none; }
  .hud-corner-tr { top: 100px; right: 30px; border-left: none; border-bottom: none; }
  .hud-corner-bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
  .hud-corner-br { bottom: 30px; right: 30px; border-left: none; border-top: none; }

  /* Frame Counter HUD (Kept Small) */
  .frame-hud {
    position: absolute;
    bottom: 35px;
    right: 50px;
    font-family: 'Orbitron', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: #00f3ff;
    z-index: 4;
    text-shadow: 0 0 8px rgba(0, 243, 255, 0.5);
    pointer-events: none;
  }

  /* Glass Quote Cards */
  .cyber-quote-card {
    background: rgba(10, 10, 14, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-left: 3px solid #00f3ff;
    padding: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
  }
  .cyber-quote-card::after {
    content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
    border: 1px solid rgba(0, 243, 255, 0.1); border-left: none; pointer-events: none;
  }

  /* Cyber Buttons */
  .cyber-btn-red, .cyber-btn-glass {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 2.2rem;
    font-family: 'Orbitron', monospace;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
  }

  .cyber-btn-red {
    background: rgba(215, 35, 35, 0.15);
    border: 1px solid #D72323;
    color: #D72323;
  }
  .cyber-btn-red:hover {
    background: #D72323;
    color: #0a0a0e;
    box-shadow: 0 0 20px rgba(215, 35, 35, 0.6);
  }

  .cyber-btn-glass {
    background: rgba(0, 243, 255, 0.05);
    border: 1px solid #00f3ff;
    color: #00f3ff;
    backdrop-filter: blur(5px);
  }
  .cyber-btn-glass:hover {
    background: #00f3ff;
    color: #0a0a0e;
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.6);
  }

  .typewriter-cursor {
    display: inline-block;
    width: 12px;
    height: 1.2em;
    background-color: #00f3ff;
    vertical-align: middle;
    margin-left: 8px;
    animation: blink 1s step-end infinite;
    box-shadow: 0 0 10px #00f3ff;
  }

  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ── constants ─────────────────────────────────── */
const TOTAL_FRAMES   = 250;
const SCROLL_PER_FRAME = 18;           
const SCROLL_HEIGHT  = TOTAL_FRAMES * SCROLL_PER_FRAME; 

// Frame range thresholds (0-indexed, 0 = first frame = file 0001.png)
const PHASE_1_END   = 140;   
const PHASE_2_START = 135;   
const PHASE_2_END   = 168;
const PHASE_3_START = 170;

/* ── typewriter hook ────────────────────────────── */
const ROLES = [
  'Learner',
  'Prompt Pirate',
  'Model Whisperer',
  'Circuit Wizard',
  'Pixel Pusher',
  'Dataset Alchemist',
];

function useTypewriter(active) {
  const [text,    setText]    = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const current = ROLES[roleIdx];

    const tick = () => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
          timerRef.current = setTimeout(tick, 80);
        } else {
          timerRef.current = setTimeout(() => setDeleting(true), 1600);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
          timerRef.current = setTimeout(tick, 45);
        } else {
          setDeleting(false);
          setRoleIdx(i => (i + 1) % ROLES.length);
        }
      }
    };

    timerRef.current = setTimeout(tick, 120);
    return () => clearTimeout(timerRef.current);
  }, [text, deleting, roleIdx, active]);

  return text;
}

/* ── glass card ─────────────────────────────────── */
function GlassQuote({ quote, author, delay = 0 }) {
  return (
    <div
      className="cyber-quote-card"
      style={{
        animation: `slideUp 0.6s ease ${delay}ms both`,
      }}
    >
      <p style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '1.2rem', 
        color: '#F5EDED',
        lineHeight: 1.6,
        fontStyle: 'italic',
        marginBottom: '0.8rem',
      }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '2px', background: '#D72323' }} />
        <span style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: '#D72323',
          textTransform: 'uppercase',
        }}>
          {author}
        </span>
      </div>
    </div>
  );
}

/* ── main component ─────────────────────────────── */
export default function HeroSection() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  const imagesRef    = useRef([]);
  const rafRef       = useRef(null);
  const lastFrameRef = useRef(-1);

  const [frameIndex, setFrameIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  const typeText = useTypewriter(frameIndex < PHASE_1_END);

  // ── draw single frame ─────────────────────────
  const drawImg = useCallback((index, imgOverride) => {
    const canvas = canvasRef.current;
    const img    = imgOverride || imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width  = W;
      canvas.height = H;
    }

    const ctx      = canvas.getContext('2d');
    const imgW     = img.naturalWidth;
    const imgH     = img.naturalHeight;
    const scale    = Math.max(W / imgW, H / imgH);
    const drawW    = imgW * scale;
    const drawH    = imgH * scale;
    const drawX    = (W - drawW) / 2;
    const drawY    = (H - drawH) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // ── preload frames ────────────────────────────
  useEffect(() => {
    const imgs = new Array(TOTAL_FRAMES);
    let loaded = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i + 1).padStart(4, '0');
      img.src = `/frames/${num}.png`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setCanvasReady(true);
        // Draw first frame as soon as it loads
        if (i === 0) drawImg(0, img);
      };
      imgs[i] = img;
    }
    imagesRef.current = imgs;
  }, [drawImg]);

  // ── scroll handler ────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect    = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = SCROLL_HEIGHT - window.innerHeight;
      const progress  = Math.min(scrolled / maxScroll, 1);
      const frame     = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

      setFrameIndex(frame);

      if (frame !== lastFrameRef.current) {
        lastFrameRef.current = frame;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawImg(frame));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawImg]);

  // Redraw on resize
  useEffect(() => {
    const onResize = () => drawImg(lastFrameRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawImg]);

  /* ── visibility flags ───────────────────────── */
  const p1 = frameIndex <= PHASE_1_END;
  const p2 = frameIndex >= PHASE_2_START && frameIndex <= PHASE_2_END;
  const p3 = frameIndex >= PHASE_3_START;

  const vis = (cond) => ({
    opacity:    cond ? 1 : 0,
    transform:  cond ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: cond ? 'auto' : 'none',
  });

  const loadPct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      <style>{HERO_STYLES}</style>
      
      <section
        id="about"
        ref={containerRef}
        className="hero-scroll-container"
        style={{ height: `${SCROLL_HEIGHT}px` }}
      >
        {/* ── Sticky viewport ── */}
        <div className="hero-sticky">

          {/* Canvas */}
          <canvas ref={canvasRef} className="hero-canvas" />

          {/* Cyberpunk Layers */}
          <div className="hero-overlay" />
          <div className="hero-grid" />
          <div className="scan-line" />

          {/* HUD corners */}
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-tr" />
          <div className="hud-corner hud-corner-bl" />
          <div className="hud-corner hud-corner-br" />

          {/* Frame counter (KEPT SMALL) */}
          <div className="frame-hud">
            SEQ {String(frameIndex + 1).padStart(3,'0')} / {TOTAL_FRAMES} &nbsp;·&nbsp; KARAN.JOGI // PORTFOLIO
          </div>

          {/* Preload progress bar (until all frames loaded) */}
          {!canvasReady && (
            <div style={{
              position: 'absolute',
              bottom: '5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 10,
            }}>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
                color: '#00f3ff',
                marginBottom: '0.8rem',
                textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
              }}>
                [ DECRYPTING ASSETS — {loadPct}% ]
              </div>
              <div style={{
                width: '250px',
                height: '3px',
                background: 'rgba(0, 243, 255, 0.1)',
                border: '1px solid rgba(0, 243, 255, 0.3)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${loadPct}%`,
                  background: '#00f3ff',
                  boxShadow: '0 0 15px #00f3ff',
                  transition: 'width 0.2s ease',
                }} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              PHASE 1  (frames 0 – 120)
              LEFT: Hello + typewriter
          ══════════════════════════════════════ */}
          <div
            style={{
              position: 'absolute',
              left: '8%',
              top: '25%', /* Shifted higher (25%) */
              transform: 'translateY(-50%)',
              maxWidth: '600px',
              zIndex: 10,
              ...vis(p1),
            }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: '#D72323',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              <div style={{ width: '8px', height: '8px', background: '#D72323', boxShadow: '0 0 8px #D72323' }} />
              System Boot — User Identified
            </span>

            <h2 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', 
              fontWeight: 400,
              color: '#00f3ff',
              letterSpacing: '0.15em',
              marginBottom: '0.5rem',
              textShadow: '0 0 15px rgba(0, 243, 255, 0.4)',
            }}>
              Hello, I'm
            </h2>

            <h1 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
              fontWeight: 900,
              color: '#F5EDED',
              letterSpacing: '0.02em',
              lineHeight: 1,
              marginBottom: '1.5rem',
              /* Shadow completely removed as requested */
            }}>
              KARAN JOGI
            </h1>

            {/* Typewriter */}
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
              fontWeight: 700,
              color: '#00f3ff',
              letterSpacing: '0.05em',
              minHeight: '3rem',
              textShadow: '0 0 20px rgba(0, 243, 255, 0.6)',
            }}>
              {"> "} {typeText}
              <span className="typewriter-cursor" />
            </div>
          </div>

          {/* ══════════════════════════════════════
              PHASE 2  (frames 120 – 165)
              RIGHT: Tagline + buttons
              LEFT:  Glass quote cards
          ══════════════════════════════════════ */}

          {/* Right — bio + buttons */}
          <div
            style={{
              position: 'absolute',
              right: '8%',
              top: '25%', /* Shifted higher (25%) */
              transform: 'translateY(-50%)',
              maxWidth: '500px', 
              textAlign: 'right',
              zIndex: 10,
              ...vis(p2),
            }}
          >
            <span style={{
              display: 'block',
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: '#00f3ff',
              textTransform: 'uppercase',
              marginBottom: '1.2rem',
              textShadow: '0 0 8px rgba(0, 243, 255, 0.4)'
            }}>
              // Mission Brief
            </span>

            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', 
              color: 'rgba(245,237,237,0.9)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
              Building <strong style={{ color: '#00f3ff' }}>AI-powered systems</strong>, smart embedded tech, and futuristic web experiences — turning wild ideas into reality with code, circuits, and late-night innovation.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <a href="mailto:karanjogi2021@gmail.com" className="cyber-btn-red">
                Establish Link
              </a>
              <a href="/Karan_Jogi- Resume.pdf" download className="cyber-btn-glass">
                Extract Data
              </a>
            </div>
          </div>

          {/* Left — quote cards */}
          <div
            style={{
              position: 'absolute',
              left: '5%',
              top: '25%', /* Shifted higher (25%) */
              transform: 'translateY(-50%)',
              maxWidth: '400px', 
              zIndex: 10,
              ...vis(p2),
            }}
          >
            <GlassQuote
              quote="The art challenges the technology, and the technology inspires the art."
              author="John Lasseter"
              delay={0}
            />
            <GlassQuote
              quote="Just because something doesn't do what you planned it to do doesn't mean it's useless."
              author="Thomas Edison"
              delay={150}
            />
            <GlassQuote
              quote="The real problem is not whether machines think but whether men do."
              author="B. F. Skinner"
              delay={300}
            />
          </div>

          {/* ══════════════════════════════════════
              PHASE 3  (frames 160 – 250)
              RIGHT: System profiling
          ══════════════════════════════════════ */}
          <div
            style={{
              position: 'absolute',
              right: '8%',
              top: '25%', /* Shifted higher (25%) */
              transform: 'translateY(-50%)',
              maxWidth: '550px', 
              zIndex: 10,
              ...vis(p3),
            }}
          >
            <span style={{
              display: 'block',
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              color: '#D72323',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}>
              // System Profiling
            </span>

            <h3 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
              fontWeight: 800,
              color: '#F5EDED',
              marginBottom: '1.5rem',
              letterSpacing: '0.08em',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
            }}>
              Multidisciplinary <span style={{ color: '#00f3ff', textShadow: '0 0 15px rgba(0, 243, 255, 0.5)' }}>Engineer</span>
            </h3>

            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.25rem)', 
              color: 'rgba(245,237,237,0.85)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              borderLeft: '3px solid #00f3ff',
              paddingLeft: '1.5rem',
              background: 'linear-gradient(90deg, rgba(0,243,255,0.05) 0%, transparent 100%)',
              paddingTop: '0.5rem', paddingBottom: '0.5rem'
            }}>
              I operate at the intersection of Artificial Intelligence, Hardware,
              and Web Technologies. My mission is to architect intelligent systems
              that solve real-world problems.
            </p>

            <p style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.25rem)', 
              color: 'rgba(245,237,237,0.75)',
              lineHeight: 1.7,
              borderLeft: '3px solid #D72323',
              paddingLeft: '1.5rem',
              background: 'linear-gradient(90deg, rgba(215,35,35,0.05) 0%, transparent 100%)',
              paddingTop: '0.5rem', paddingBottom: '0.5rem'
            }}>
              From training custom neural networks and building IoT infrastructures
              to designing premium web interfaces, I thrive in environments that
              require adaptive learning and relentless execution.
            </p>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              {[['AI', 'Machine Learning'], ['IoT', 'Hardware'], ['WEB', 'Interfaces']].map(([top, bot]) => (
                <div key={top} style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'Orbitron, monospace',
                    fontSize: '1.8rem', 
                    fontWeight: 800,
                    color: '#D72323',
                    textShadow: '0 0 15px rgba(215, 35, 35, 0.5)',
                    marginBottom: '0.2rem'
                  }}>{top}</div>
                  <div style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.9rem',
                    color: 'rgba(245,237,237,0.6)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                  }}>{bot}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator (only at top) */}
          {frameIndex < 5 && (
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              animation: 'slideUp 1s ease 1s both',
              zIndex: 10
            }}>
              <span style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.6rem',
                color: '#00f3ff',
                letterSpacing: '0.3em',
                textTransform: 'uppercase'
              }}>
                Initialize Scroll
              </span>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M3 9l5 5 5-5" stroke="#00f3ff" strokeWidth="2" strokeLinecap="square" style={{ filter: 'drop-shadow(0 0 5px #00f3ff)' }}/>
              </svg>
            </div>
          )}
        </div>
      </section>
    </>
  );
}