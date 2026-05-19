import { useEffect, useRef, useState } from 'react';

// Embedded CSS for Cyberpunk Loading Aesthetics
const LOADING_STYLES = `
  .loading-container {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #050507;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* Digital Grid Background */
  .loading-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  }

  /* Animated Scanline */
  .loading-scanline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: rgba(0, 243, 255, 0.4);
    box-shadow: 0 0 20px rgba(0, 243, 255, 0.8);
    animation: scan-vertical 4s linear infinite;
    z-index: 5;
    pointer-events: none;
  }

  /* HUD Targeting Corners */
  .hud-load {
    position: absolute;
    width: 35px;
    height: 35px;
    border: 2px solid #D72323;
    z-index: 10;
    opacity: 0.6;
  }
  .hud-load-tl { top: 40px; left: 40px; border-right: none; border-bottom: none; }
  .hud-load-tr { top: 40px; right: 40px; border-left: none; border-bottom: none; }
  .hud-load-bl { bottom: 40px; left: 40px; border-right: none; border-top: none; }
  .hud-load-br { bottom: 40px; right: 40px; border-left: none; border-top: none; }

  /* Cybernetic Spinner Rings */
  .cyber-spinner {
    position: relative;
    width: 90px;
    height: 90px;
    margin-bottom: 2.5rem;
    z-index: 2;
  }

  .spinner-outer {
    position: absolute;
    inset: 0;
    border: 2px dashed #00f3ff;
    border-radius: 50%;
    animation: spin 6s linear infinite;
    opacity: 0.8;
  }

  .spinner-inner {
    position: absolute;
    inset: 12px;
    border: 3px solid transparent;
    border-top-color: #D72323;
    border-bottom-color: #D72323;
    border-radius: 50%;
    animation: spin 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
    box-shadow: 0 0 15px rgba(215, 35, 35, 0.4);
  }

  .spinner-core {
    position: absolute;
    inset: 32px;
    background: #00f3ff;
    border-radius: 50%;
    box-shadow: 0 0 20px #00f3ff;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { transform: scale(0.7); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } }
  @keyframes scan-vertical { 0% { top: -10%; } 100% { top: 110%; } }
  @keyframes glitch { 0%, 100% { transform: translate(0); } 20% { transform: translate(-2px, 1px); } 40% { transform: translate(2px, -1px); } 60% { transform: translate(-1px, -2px); } 80% { transform: translate(1px, 2px); } }
`;

export default function LoadingScreen({ assetsReady, onDone }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut]   = useState(false);
  const [timerReady, setTimerReady] = useState(false);
  const completeRef = useRef(false);

  useEffect(() => {
    // Progress bar fills over ~4.8s
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        const step = p < 60 ? 2.2 : p < 85 ? 1.1 : 0.55;
        return Math.min(p + step, 100);
      });
    }, 50);

    // Mark timer completion after the minimum loading duration.
    const readyTimer = setTimeout(() => setTimerReady(true), 5300);

    return () => {
      clearInterval(interval);
      clearTimeout(readyTimer);
    };
  }, []);

  useEffect(() => {
    if (!timerReady || !assetsReady || completeRef.current) return;
    completeRef.current = true;

    setFadeOut(true);
    const doneTimer = setTimeout(onDone, 500);
    return () => clearTimeout(doneTimer);
  }, [assetsReady, onDone, timerReady]);

  // Dynamic status text based on load progress
  let statusText = '[ INITIATING BOOT SEQUENCE ]';
  if (progress > 25) statusText = '[ DECRYPTING DATABANKS ]';
  if (progress > 55) statusText = '[ COMPILING UI ASSETS ]';
  if (progress > 85) statusText = '[ ESTABLISHING UPLINK ]';
  if (progress === 100 && assetsReady) statusText = '[ SYSTEM ONLINE ]';
  if (progress === 100 && !assetsReady) statusText = '[ AWAITING ASSET DECRYPTION ]';

  return (
    <>
      <style>{LOADING_STYLES}</style>
      
      <div 
        className="loading-container"
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease',
          pointerEvents: fadeOut ? 'none' : 'all',
        }}
      >
        <div className="loading-grid" />
        <div className="loading-scanline" />

        {/* HUD corners */}
        <div className="hud-load hud-load-tl" />
        <div className="hud-load hud-load-tr" />
        <div className="hud-load hud-load-bl" />
        <div className="hud-load hud-load-br" />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Cybernetic Spinner */}
          <div className="cyber-spinner">
            <div className="spinner-outer" />
            <div className="spinner-inner" />
            <div className="spinner-core" />
          </div>

          {/* Brand Identity */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '0.3em',
              color: '#F5EDED',
              textShadow: '0 0 20px rgba(0, 243, 255, 0.3)',
              position: 'relative'
            }}>
              KARAN<span style={{ color: '#D72323', textShadow: '0 0 15px #D72323' }}>_</span>JOGI
            </div>
          </div>

          {/* Progress Tracker */}
          <div style={{ width: '280px', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: '#00f3ff',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              <span>SYS_LOAD</span>
              <span>{Math.floor(progress)}%</span>
            </div>

            {/* Glowing Tech Progress Bar */}
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(0, 243, 255, 0.1)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              overflow: 'hidden',
              marginBottom: '0.8rem',
              position: 'relative',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: '#00f3ff',
                boxShadow: '0 0 15px #00f3ff, inset 0 0 5px #ffffff',
                transition: 'width 0.1s linear',
              }} />
            </div>

            {/* Dynamic Status Display */}
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: progress === 100 ? '#00f3ff' : '#D72323',
              textShadow: progress === 100 ? '0 0 10px #00f3ff' : 'none',
              animation: progress < 100 ? 'glitch 3s infinite' : 'none'
            }}>
              {statusText}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}