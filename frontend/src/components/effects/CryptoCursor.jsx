import React, { useEffect, useState, useCallback } from 'react';

const CryptoCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const cryptoSymbols = ['₿', '◆', '⟠', '◈', '⚛', '△', '◎', '⬡', '⬢'];
  
  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Add particle trail
    if (Math.random() > 0.7) {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        symbol: cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)],
        opacity: 1,
        scale: Math.random() * 0.5 + 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
      };
      setParticles(prev => [...prev.slice(-15), newParticle]);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.03,
            scale: p.scale * 0.98,
          }))
          .filter(p => p.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute w-10 h-10 border-2 border-[rgb(218,255,1)] rounded-full animate-pulse"
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Inner dot */}
        <div
          className="absolute w-2 h-2 bg-[rgb(218,255,1)] rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgb(218,255,1), 0 0 20px rgb(218,255,1)',
          }}
        />
        {/* Blockchain hexagon */}
        <div
          className="absolute text-[rgb(218,255,1)] text-xs font-bold"
          style={{
            transform: 'translate(8px, -20px)',
            textShadow: '0 0 5px rgb(218,255,1)',
          }}
        >
          ⬡
        </div>
      </div>

      {/* Particle trail */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[9998] text-[rgb(218,255,1)] font-bold hidden md:block"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `translate(-50%, -50%) scale(${particle.scale})`,
            opacity: particle.opacity,
            textShadow: '0 0 5px rgb(218,255,1)',
            fontSize: '14px',
          }}
        >
          {particle.symbol}
        </div>
      ))}

      {/* Hide default cursor on desktop */}
      <style>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
          a, button, [role="button"], input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CryptoCursor;
