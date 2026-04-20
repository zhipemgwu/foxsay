import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IcHeartSpark, IcSparkle, IcChat, IcTarget, IcStar, gradients } from './CuteIcons';

/* ---------- Hand-drawn SVG illustrations ---------- */
function IllustrationChat() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
      <circle cx="45" cy="75" r="16" fill="#FF8A80" opacity="0.85" />
      <rect x="37" y="91" width="16" height="24" rx="8" fill="#FF8A80" opacity="0.6" />
      <circle cx="95" cy="75" r="16" fill="#9B7EDE" opacity="0.85" />
      <rect x="87" y="91" width="16" height="24" rx="8" fill="#9B7EDE" opacity="0.6" />
      <rect x="20" y="35" width="40" height="26" rx="13" fill="rgba(255,138,128,0.3)" />
      <circle cx="34" cy="48" r="2" fill="#FF8A80" />
      <circle cx="42" cy="48" r="2" fill="#FF8A80" />
      <circle cx="50" cy="48" r="2" fill="#FF8A80" />
      <rect x="80" y="42" width="40" height="26" rx="13" fill="rgba(155,126,222,0.3)" />
      <circle cx="94" cy="55" r="2" fill="#9B7EDE" />
      <circle cx="102" cy="55" r="2" fill="#9B7EDE" />
      <circle cx="110" cy="55" r="2" fill="#9B7EDE" />
      <path d="M66 38c0-4 3-7 7-7s7 3 7 7c0 8-7 13-7 13s-7-5-7-13z" fill="#FF8A80" opacity="0.7" />
    </svg>
  );
}

function IllustrationAnalysis() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
      <rect x="42" y="22" width="56" height="96" rx="12" fill="rgba(155,126,222,0.2)" stroke="#9B7EDE" strokeWidth="2" />
      <rect x="50" y="34" width="40" height="6" rx="3" fill="rgba(155,126,222,0.35)" />
      <rect x="50" y="46" width="30" height="6" rx="3" fill="rgba(155,126,222,0.25)" />
      <path d="M50 70 Q58 58 66 70 Q74 82 82 70" stroke="#4ECDC4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M50 80 Q58 68 66 80 Q74 92 82 80" stroke="#FF8A80" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="108" cy="44" r="14" stroke="#FFD93D" strokeWidth="2.5" fill="rgba(255,217,61,0.15)" />
      <line x1="118" y1="54" x2="126" y2="62" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="60" r="3" fill="#4ECDC4" opacity="0.6" />
      <circle cx="115" cy="90" r="2" fill="#FF8A80" opacity="0.5" />
    </svg>
  );
}

function IllustrationGrowth() {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
      <rect x="20" y="100" width="28" height="16" rx="4" fill="rgba(78,205,196,0.25)" />
      <rect x="52" y="80" width="28" height="36" rx="4" fill="rgba(78,205,196,0.35)" />
      <rect x="84" y="56" width="28" height="60" rx="4" fill="rgba(78,205,196,0.5)" />
      <path d="M98 40l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill="#FFD93D" opacity="0.85" />
      <line x1="98" y1="47" x2="98" y2="56" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" />
      <rect x="24" y="86" width="20" height="10" rx="5" fill="rgba(255,138,128,0.35)" />
      <text x="34" y="94" textAnchor="middle" fill="#FF8A80" fontSize="7" fontWeight="700">+5</text>
      <rect x="56" y="66" width="20" height="10" rx="5" fill="rgba(155,126,222,0.35)" />
      <text x="66" y="74" textAnchor="middle" fill="#9B7EDE" fontSize="7" fontWeight="700">+10</text>
    </svg>
  );
}

const slides = [
  {
    gradient: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,138,128,0.35) 0%, rgba(236,64,122,0.15) 40%, transparent 70%)',
    deco: 'radial-gradient(ellipse 50% 40% at 70% 60%, rgba(155,126,222,0.18) 0%, transparent 60%)',
    icon: <IcHeartSpark size={28} color="#fff" />,
    iconBg: gradients.coral,
    heroIllustration: <IllustrationChat />,
    title: 'AI 恋爱陪练',
    subtitle: '沉浸式模拟真实约会场景\n让你在安全的环境中练习恋爱技巧',
    accent: '#FF8A80',
  },
  {
    gradient: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(155,126,222,0.35) 0%, rgba(129,212,250,0.15) 40%, transparent 70%)',
    deco: 'radial-gradient(ellipse 50% 40% at 30% 55%, rgba(255,138,128,0.1) 0%, transparent 60%)',
    icon: <IcChat size={28} color="#fff" />,
    iconBg: gradients.purple,
    heroIllustration: <IllustrationAnalysis />,
    title: '智能对话分析',
    subtitle: 'AI 实时分析你的表达方式\n精准提升共情力和表达技巧',
    accent: '#9B7EDE',
  },
  {
    gradient: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(78,205,196,0.35) 0%, rgba(128,203,196,0.15) 40%, transparent 70%)',
    deco: 'radial-gradient(ellipse 50% 40% at 65% 50%, rgba(255,217,61,0.15) 0%, transparent 60%)',
    icon: <IcTarget size={28} color="#fff" />,
    iconBg: gradients.mint,
    heroIllustration: <IllustrationGrowth />,
    title: '游戏化成长',
    subtitle: '解锁成就、升级段位\n每一步进步都看得见',
    accent: '#4ECDC4',
  },
];

export function OnboardingScreen({ onFinish }: { onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const next = useCallback(() => {
    if (isLast) {
      onFinish();
    } else {
      setCurrent(p => p + 1);
    }
  }, [isLast, onFinish]);

  return (
    <div className="absolute inset-0 z-[55] flex flex-col" style={{ background: '#2b2535' }}>
      <div className="relative flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>

        {/* Visual area — top 40% */}
        <div className="relative" style={{ height: '40%', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0" style={{ background: slide.gradient }} />
              <div className="absolute inset-0" style={{ background: slide.deco }} />
              {/* Centered hero illustration */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '15%' }}>
                <motion.div
                  style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {slide.heroIllustration}
                </motion.div>
              </div>
              {/* Bottom fade */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, #2b2535 85%)',
              }} />
            </motion.div>
          </AnimatePresence>

          {/* Skip button */}
          {!isLast && (
            <motion.button
              className="absolute top-12 right-5 px-4 py-1.5 z-10"
              style={{
                background: 'rgba(45,39,56,0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: 980,
                color: 'rgba(245,239,232,0.65)',
                fontSize: '13px',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onFinish}
            >
              跳过
            </motion.button>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col px-8 mt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Icon bubble */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: slide.iconBg }}>
                  {slide.icon}
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <IcSparkle key={i} size={10} color={i <= current ? slide.accent : 'rgba(245,239,232,0.15)'} />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h2 style={{
                color: '#f5efe8',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '0px',
                lineHeight: 1.15,
                marginBottom: 12,
              }}>
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p style={{
                color: 'rgba(245,239,232,0.58)',
                fontSize: '15px',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
              }}>
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bottom controls */}
          <div className="flex items-center justify-between pb-10 mt-auto">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    height: 4,
                    background: i === current ? slide.accent : 'rgba(245,239,232,0.15)',
                  }}
                  animate={{ width: i === current ? 24 : 6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className="flex items-center justify-center gap-2"
              style={{
                background: isLast
                  ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)'
                  : 'rgba(255,138,128,0.18)',
                height: 52,
                paddingLeft: isLast ? 32 : 20,
                paddingRight: isLast ? 32 : 20,
                borderRadius: 980,
                color: isLast ? '#fff' : '#FF8A80',
                fontSize: '15px',
                fontWeight: 600,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
            >
              {isLast ? (
                <>
                  开始恋爱之旅
                  <IcHeartSpark size={16} color="#fff" />
                </>
              ) : (
                <>
                  继续
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}