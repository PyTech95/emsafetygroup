import { useEffect, useRef } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for high-tech HSE data mesh in Navy & Gold
    const nodeCount = Math.min(Math.floor(width / 34), 48);
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isGold: boolean;
      alpha: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        isGold: i % 4 === 0, // Every 4th node is golden accent
        alpha: Math.random() * 0.45 + 0.2,
      });
    }

    let laserY = 0;
    const laserSpeed = 1.1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle geometric grid intersections (Navy)
      const gridSize = 88;
      ctx.fillStyle = 'rgba(11, 37, 69, 0.05)';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // Draw subtle connecting telemetry lines between nodes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 145) {
            const alpha = (1 - dist / 145) * 0.18;
            if (nodes[i].isGold || nodes[j].isGold) {
              ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(11, 37, 69, ${alpha})`;
            }
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (n.isGold) {
          ctx.fillStyle = `rgba(251, 191, 36, ${n.alpha * 1.3})`;
        } else {
          ctx.fillStyle = `rgba(11, 37, 69, ${n.alpha * 0.8})`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Laser sweep line (subtle scanline effect in soft gold)
      laserY += laserSpeed;
      if (laserY > height) laserY = 0;

      const grad = ctx.createLinearGradient(0, laserY - 30, 0, laserY + 30);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0)');
      grad.addColorStop(0.5, 'rgba(251, 191, 36, 0.05)');
      grad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, laserY - 30, width, 60);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background canvas for neural particle lines */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Ambient glowing radial light orbs in strictly Deep Navy & Soft Gold */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-900/5 via-blue-950/10 to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-gradient-to-bl from-[#1e6fd9]/8 via-[#9ec7f0]/5 to-transparent rounded-full blur-[130px]" />
      <div className="absolute -bottom-20 left-1/3 w-[700px] h-[500px] bg-gradient-to-t from-blue-900/6 via-slate-100/40 to-transparent rounded-full blur-[150px]" />
    </div>
  );
}
