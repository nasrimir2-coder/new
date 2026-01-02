import React, { useEffect, useRef } from 'react';

const BlockchainBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    let connections = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const nodeCount = Math.floor((canvas.width * canvas.height) / 25000);
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          type: Math.random() > 0.7 ? 'block' : 'node',
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawNode = (node) => {
      ctx.beginPath();
      
      if (node.type === 'block') {
        // Draw blockchain block (hexagon)
        const size = node.radius * 3;
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.pulse * 0.01);
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = Math.cos(angle) * size;
          const y = Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        const pulseOpacity = 0.3 + Math.sin(node.pulse) * 0.2;
        ctx.fillStyle = `rgba(218, 255, 1, ${pulseOpacity * 0.3})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(218, 255, 1, ${pulseOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
      } else {
        // Draw regular node
        const pulseOpacity = 0.3 + Math.sin(node.pulse) * 0.15;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 255, 1, ${pulseOpacity})`;
        ctx.fill();
      }
    };

    const drawConnections = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(218, 255, 1, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            // Draw data packet animation on some connections
            if (Math.random() > 0.998) {
              const packet = {
                startX: nodes[i].x,
                startY: nodes[i].y,
                endX: nodes[j].x,
                endY: nodes[j].y,
                progress: 0,
              };
              connections.push(packet);
            }
          }
        }
      }
    };

    const drawDataPackets = () => {
      connections = connections.filter(packet => {
        packet.progress += 0.02;
        
        if (packet.progress >= 1) return false;
        
        const x = packet.startX + (packet.endX - packet.startX) * packet.progress;
        const y = packet.startY + (packet.endY - packet.startY) * packet.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 255, 1, ${1 - packet.progress})`;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(218, 255, 1, ${(1 - packet.progress) * 0.3})`;
        ctx.fill();
        
        return true;
      });
    };

    const updateNodes = () => {
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawConnections();
      drawDataPackets();
      nodes.forEach(drawNode);
      updateNodes();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default BlockchainBackground;
