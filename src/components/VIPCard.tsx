import { motion } from 'motion/react';
import { ChevronRight, Crown } from 'lucide-react';

import { IconBubble, IcCrown, gradients } from './CuteIcons';
import { useEffect, useRef, useState } from 'react';

const perks = ['无限 AI 陪练', '专属人设定制', '每周深度报告', '10+ 训练场景'];

function SparkleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    interface Particle { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; fadeDir: number; color: string; }

    const colors = ['rgba(155,126,222,', 'rgba(169,155,216,', 'rgba(255,255,255,'];
    const particles: Particle[] = [];
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * rect.width, y: Math.random() * rect.height,
        size: Math.random() * 2 + 0.5, speedY: -(Math.random() * 0.3 + 0.08),
        speedX: (Math.random() - 0.5) * 0.2, opacity: Math.random() * 0.5 + 0.15,
        fadeDir: Math.random() > 0.5 ? 1 : -1, color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      particles.forEach((p) => {
        p.y += p.speedY; p.x += p.speedX; p.opacity += p.fadeDir * 0.006;
        if (p.opacity >= 0.7) p.fadeDir = -1;
        if (p.opacity <= 0.08) { p.fadeDir = 1; p.y = r.height + 4; p.x = Math.random() * r.width; }
        if (p.y < -4) { p.y = r.height + 4; p.x = Math.random() * r.width; }
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `${p.color}${(p.opacity * 0.3).toFixed(2)})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grad; ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

export function VIPCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="px-5" ref={containerRef}>
      <motion.button
        className="w-full text-left overflow-hidden relative p-[1px]"
        style={{
          borderRadius: 13,
          background: 'linear-gradient(135deg, rgba(155,126,222,0.55), rgba(255,138,128,0.2), rgba(155,126,222,0.35))',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="overflow-hidden" style={{ borderRadius: 12 }}>
          {/* Gradient visual area instead of image */}
          <div className="relative w-full" style={{ height: 120, background: 'linear-gradient(135deg, #453a60 0%, #453a60 40%, #2b2535 100%)' }}>

            <div className="absolute inset-0 flex flex-col justify-between p-5" style={{ zIndex: 3 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: '#9B7EDE', borderRadius: 980 }}>
                  <Crown size={12} color="#fff" strokeWidth={2.5} />
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>PREMIUM</span>
                </div>
              </div>

              <div>
                <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 700, marginBottom: 4 }}>解锁全部训练场景</h3>
                <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px' }}>让AI成为你的专属恋爱教练</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#453a60' }}>
            <div className="flex flex-wrap gap-x-5 gap-y-2 flex-1">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full" style={{ background: '#9B7EDE' }} />
                  <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: '13px' }}>{perk}</span>
                </div>
              ))}
            </div>
            <motion.div
              className="flex items-center justify-center"
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(155,126,222,0.2)' }}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronRight size={16} color="#9B7EDE" strokeWidth={2} />
            </motion.div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}