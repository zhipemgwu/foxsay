import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { IcHeartSpark, IcSparkle } from './CuteIcons';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => onFinish(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onFinish]);

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center"
      style={{ background: '#2b2535' }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Radial glow bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(255,138,128,0.18) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 40% 30% at 50% 50%, rgba(155,126,222,0.08) 0%, transparent 60%)',
      }} />

      {/* Logo */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Heart icon */}
        <motion.div
          className="relative"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-[88px] h-[88px] rounded-[26px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF8A80, #FF6B6B, #EC407A)' }}>
            <IcHeartSpark size={44} color="#fff" />
          </div>
          {/* sparkles */}
          <motion.div className="absolute -top-2 -right-3"
            animate={{ y: [0, -5, 0], rotate: [0, 20, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}>
            <IcSparkle size={18} color="rgba(255,217,61,0.7)" />
          </motion.div>
          <motion.div className="absolute -bottom-2 -left-3"
            animate={{ y: [0, -4, 0], rotate: [0, -15, 0], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}>
            <IcSparkle size={12} color="rgba(155,126,222,0.6)" />
          </motion.div>
          <motion.div className="absolute top-1/2 -right-5"
            animate={{ y: [0, -3, 0], x: [0, 3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}>
            <IcSparkle size={10} color="rgba(78,205,196,0.5)" />
          </motion.div>
        </motion.div>

        {/* App name */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 style={{
            fontSize: '32px', fontWeight: 700, letterSpacing: '0px',
            background: 'linear-gradient(135deg, #FF8A80, #FF6B6B, #EC407A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            The Love Lab
          </h1>
          <motion.p
            style={{ color: 'rgba(245,239,232,0.55)', fontSize: '14px', marginTop: 6, letterSpacing: '2px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            你的恋爱成长伙伴
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom shimmer line */}
      <motion.div
        className="absolute bottom-24 w-24 h-[2px] rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,138,128,0.4), transparent)' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
