import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { IconBubble, IcFire, IcHeart, IcTarget, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}<span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '14px', fontWeight: 400, paddingBottom: 2 }}>{suffix}</span></>;
}

export function StatsSection() {
  const user = useUser();
  const isNewUser = !user.xp && !user.achievements;

  const stats = [
    { value: isNewUser ? 0 : (user.streak ?? 0), label: '连续天数', suffix: '天', icon: <IcFire size={18} color="#fff" />, bg: gradients.coralSoft, glow: '#FF8A80' },
    { value: isNewUser ? 0 : (user.matchRate ?? 0), label: '综合分', suffix: '%', icon: <IcHeart size={18} color="#fff" />, bg: gradients.roseSoft, glow: '#F48FB1' },
    { value: isNewUser ? 0 : (user.achievements ?? 0), label: '已完成', suffix: '个', icon: <IcTarget size={18} color="#fff" />, bg: gradients.mintSoft, glow: '#4ECDC4' },
  ];

  const checkedDays = isNewUser ? 0 : (user.streak ?? 0) % 7;
  const streakDays = [
    { day: '一', active: checkedDays >= 1 },
    { day: '二', active: checkedDays >= 2 },
    { day: '三', active: checkedDays >= 3 },
    { day: '四', active: checkedDays >= 4 },
    { day: '五', active: checkedDays >= 5 },
    { day: '六', active: checkedDays >= 6 },
    { day: '日', active: checkedDays >= 7, today: true },
  ];

  return (
    <div className="px-5">
      <div className="overflow-hidden" style={{
        borderRadius: 16,
        border: '1px solid rgba(245,239,232,0.08)',
      }}>
        <div className="p-6" style={{ background: '#352f45', borderRadius: 16 }}>
          <div className="flex items-center gap-2 mb-5">
            <IconBubble size={28} bg={gradients.coral} glow><IcFire size={14} color="#fff" /></IconBubble>
            <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px' }}>我的成长</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
              >
                <IconBubble size={40} bg={stat.bg}>{stat.icon}</IconBubble>
                <span style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, lineHeight: 1.14, textShadow: `0 0 18px ${stat.glow}44` }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </span>
                <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px', textAlign: 'center' }}>{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Weekly streak */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(245,239,232,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>本周打卡</span>
              <span style={{ color: '#FF8A80', fontSize: '12px', fontWeight: 600 }}>{Math.min(checkedDays, 7)}/7 天</span>
            </div>
            <div className="flex items-center justify-between">
              {streakDays.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5">
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{d.day}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                    background: d.active ? 'rgba(255,138,128,0.28)' : d.today ? 'rgba(255,138,128,0.14)' : 'rgba(245,239,232,0.06)',
                    border: d.today && !d.active ? '1.5px dashed rgba(255,138,128,0.35)' : 'none',
                  }}>
                    {d.active ? (
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="#FF8A80" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : d.today ? (
                      <span style={{ color: '#FF8A80', fontSize: '10px', fontWeight: 600 }}>今</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}