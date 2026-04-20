import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { IconBubble, IcHeart, IcChart, IcChat, IcTarget, IcLightbulb, IcSparkle, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

const insights = [
  { id: 1, icon: <IcHeart size={18} color="#fff" />, bg: gradients.rose, title: '你上次约会模拟表现出色', desc: '开场白自然度提升了15%，继续保持真诚的风格' },
  { id: 2, icon: <IcChart size={18} color="#fff" />, bg: gradients.mint, title: '共情能力是你的强项', desc: '但"主动话题引导"还需加强，试试今日场景练习' },
  { id: 3, icon: <IcChat size={18} color="#fff" />, bg: gradients.purple, title: '"已读不回"可能不是冷淡', desc: '分析显示对方回复间隔规律，TA可能只是在忙' },
  { id: 4, icon: <IcTarget size={18} color="#fff" />, bg: gradients.coral, title: '你的恋爱温度计偏低', desc: '建议今天尝试一次主动关心，哪怕只是一句「吃了吗」' },
  { id: 5, icon: <IcLightbulb size={18} color="#fff" />, bg: gradients.golden, title: '老司狐的你适合"幽默破冰"', desc: '根据你的物种特征，推荐用轻松话题打开局面' },
];

const newUserInsights = [
  { id: 1, icon: <IcSparkle size={18} color="#fff" />, bg: gradients.golden, title: '欢迎来到恋爱实验室', desc: '完成第一次 AI 陪练，解锁你的专属恋爱雷达图' },
  { id: 2, icon: <IcHeart size={18} color="#fff" />, bg: gradients.rose, title: '每天 10 分钟，提升恋爱力', desc: '从一句「你好」开始，AI 教练会陪你一步步练习' },
  { id: 3, icon: <IcTarget size={18} color="#fff" />, bg: gradients.mint, title: '小建议：先试试"初遇"章节', desc: '轻松场景适合新手，咖啡馆里的偶遇等你开启' },
];

export function DiagnosticStream() {
  const user = useUser();
  const isNewUser = !user.xp && !user.achievements;
  const activeInsights = isNewUser ? newUserInsights : insights;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = activeInsights[currentIndex % activeInsights.length];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeInsights.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            <motion.div className="w-2 h-2 rounded-full" style={{ background: '#FF8A80' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <motion.div className="absolute w-3 h-3 rounded-full" style={{ background: 'rgba(255,138,128,0.35)' }} animate={{ scale: [0.5, 1.3], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </div>
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px' }}>今日洞察</span>
        </div>
      </div>

      <div className="overflow-hidden p-[1px]" style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(255,138,128,0.3), rgba(155,126,222,0.18), transparent)',
      }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div style={{ background: '#453a60', borderRadius: 15 }}>
          <div style={{ height: 84, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="absolute inset-0 flex items-center px-5 cursor-pointer"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <IconBubble size={44} bg={current.bg} glow>{current.icon}</IconBubble>
                <div className="flex-1 min-w-0 ml-4">
                  <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600, marginBottom: 2 }}>{current.title}</p>
                  <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px' }}>{current.desc}</p>
                </div>
                <ChevronRight size={16} color="rgba(245,239,232,0.55)" strokeWidth={2} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5 px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)' }}>
            {activeInsights.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full cursor-pointer"
                style={{ height: 3, background: i === currentIndex % activeInsights.length ? '#FF8A80' : 'rgba(245,239,232,0.15)' }}
                animate={{ width: i === currentIndex % activeInsights.length ? 16 : 5 }}
                transition={{ duration: 0.25 }}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeInsights.length)}>
              {currentIndex % activeInsights.length + 1}/{activeInsights.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}