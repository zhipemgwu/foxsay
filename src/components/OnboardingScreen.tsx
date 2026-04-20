import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IcHeartSpark, IcSparkle, IcTarget, IcStar, gradients } from './CuteIcons';

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
    subtitle: '沉浸式模拟真实约会场景\nAI 实时分析，精准提升共情力与表达',
    accent: '#FF8A80',
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
    <div className="absolute inset-0 z-[55] flex flex-col" style={{ background: '#1a1626' }}>
      <div className="relative flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>

        {/* 全屏动效光斑（随 slide 切换） */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bgA-${current}`}
            className="absolute pointer-events-none"
            style={{
              top: -100, left: -100, width: 340, height: 340, borderRadius: '50%',
              background: `radial-gradient(circle, ${slide.accent}88 0%, transparent 70%)`,
              filter: 'blur(18px)',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.9, x: [0, 30, 0], y: [0, 20, 0] }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.5 }, x: { duration: 12, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 14, repeat: Infinity, ease: 'easeInOut' } }}
          />
          <motion.div
            key={`bgB-${current}`}
            className="absolute pointer-events-none"
            style={{
              top: 80, right: -120, width: 300, height: 300, borderRadius: '50%',
              background: `radial-gradient(circle, ${slide.accent}55 0%, transparent 70%)`,
              filter: 'blur(14px)',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.8, x: [0, -20, 0], y: [0, 25, 0] }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.5 }, x: { duration: 14, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 16, repeat: Infinity, ease: 'easeInOut' } }}
          />
        </AnimatePresence>

        {/* 噪点纹理 */}
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.05,
          backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")',
        }} />

        {/* ── 视觉区：玻璃卡片承载插画 ── */}
        <div className="relative" style={{ height: '46%', paddingTop: 70, paddingLeft: 28, paddingRight: 28 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="relative w-full flex items-center justify-center"
                style={{
                  height: '90%',
                  borderRadius: 28,
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: `0 18px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.18)`,
                  overflow: 'hidden',
                }}>
                {/* 卡内发光 */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${slide.accent}33 0%, transparent 65%)`,
                }} />
                {/* 高光 */}
                <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                }} />
                {/* hero */}
                <motion.div
                  style={{ transform: 'scale(1.3)', filter: `drop-shadow(0 10px 28px ${slide.accent}55)` }}
                  animate={{ y: [0, -10, 0], scale: [1.3, 1.35, 1.3] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {slide.heroIllustration}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Skip button — 玻璃 pill */}
          {!isLast && (
            <motion.button
              className="absolute top-12 right-5 z-10"
              style={{
                padding: '7px 14px',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 980,
                color: 'rgba(245,239,232,0.75)',
                fontSize: 12.5,
                fontWeight: 500,
                letterSpacing: '1px',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onFinish}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') onFinish(); }}
              tabIndex={0}
            >
              跳过
            </motion.button>
          )}
        </div>

        {/* ── 内容区 ── */}
        <div className="relative flex-1 flex flex-col px-8 mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* 玻璃图标 + sparkle — 居中 */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 50, height: 50, borderRadius: 16,
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 6px 20px ${slide.accent}33`,
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: slide.iconBg }}>
                    {slide.icon}
                  </div>
                </div>
                <div className="flex gap-1">
                  {slides.map((_, i) => (
                    <IcSparkle key={i} size={10} color={i <= current ? slide.accent : 'rgba(245,239,232,0.15)'} />
                  ))}
                </div>
              </div>

              {/* Title — 渐变色 居中 */}
              <h2 className="text-center" style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: '1px',
                lineHeight: 1.2,
                marginBottom: 14,
                background: `linear-gradient(135deg, #f5efe8 0%, ${slide.accent} 130%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {slide.title}
              </h2>

              {/* Subtitle — 居中 */}
              <p className="text-center mx-auto" style={{
                color: 'rgba(245,239,232,0.6)',
                fontSize: 14.5,
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
                maxWidth: 280,
              }}>
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* 底部控件 */}
          <div className="flex items-center justify-between pb-10 mt-auto">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    height: 5,
                    background: i === current ? `linear-gradient(90deg, ${slide.accent}, ${slide.accent}88)` : 'rgba(245,239,232,0.12)',
                    boxShadow: i === current ? `0 0 10px ${slide.accent}aa` : 'none',
                  }}
                  animate={{ width: i === current ? 28 : 6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              ))}
            </div>

            <motion.button
              className="flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: isLast
                  ? `linear-gradient(135deg, ${slide.accent}, #EC407A)`
                  : 'rgba(255,255,255,0.06)',
                backdropFilter: isLast ? 'none' : 'blur(16px)',
                WebkitBackdropFilter: isLast ? 'none' : 'blur(16px)',
                border: isLast ? 'none' : '1px solid rgba(255,255,255,0.12)',
                height: 50,
                paddingLeft: isLast ? 26 : 22,
                paddingRight: isLast ? 26 : 22,
                borderRadius: 980,
                color: isLast ? '#fff' : '#f5efe8',
                fontSize: 14.5,
                fontWeight: 700,
                letterSpacing: '0.5px',
                boxShadow: isLast ? `0 10px 28px ${slide.accent}88, inset 0 1px 0 rgba(255,255,255,0.25)` : 'inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
            >
              {isLast ? (
                <>
                  开启恋爱之旅
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