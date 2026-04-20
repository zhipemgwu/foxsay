import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { IconBubble, IcHeart, IcChart, IcChat, IcTarget, IcLightbulb, gradients } from './CuteIcons';

const insights = [
  { id: 1, icon: <IcHeart size={18} color="#fff" />, bg: gradients.rose, title: '好感度指数 +8', desc: 'AI 完成今日对话情绪分析' },
  { id: 2, icon: <IcChart size={18} color="#fff" />, bg: gradients.mint, title: '共情指数上升 12%', desc: '本周表现优秀，持续保持' },
  { id: 3, icon: <IcChat size={18} color="#fff" />, bg: gradients.purple, title: '发现 3 条优质回复模板', desc: 'AI 为你定制，点击查看' },
  { id: 4, icon: <IcTarget size={18} color="#fff" />, bg: gradients.coral, title: '新关卡「暖冬约会」解锁', desc: '难度 ❤️❤️❤️ · 立刻挑战' },
  { id: 5, icon: <IcLightbulb size={18} color="#fff" />, bg: gradients.golden, title: '本周聊天报告已生成', desc: '查看你的能力雷达图' },
];

export function DiagnosticStream() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = insights[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            <motion.div className="w-2 h-2 rounded-full" style={{ background: '#FF8A80' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <motion.div className="absolute w-3 h-3 rounded-full" style={{ background: 'rgba(255,138,128,0.35)' }} animate={{ scale: [0.5, 1.3], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </div>
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px' }}>AI 助手洞察</span>
        </div>
        <span className="px-2.5 py-1" style={{ background: 'rgba(255,138,128,0.18)', borderRadius: 6, color: '#FF8A80', fontSize: '12px', fontWeight: 600 }}>实时</span>
      </div>

      <div className="overflow-hidden p-[1px]" style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(255,138,128,0.3), rgba(155,126,222,0.18), transparent)',
      }}>
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
            {insights.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full cursor-pointer"
                style={{ height: 3, background: i === currentIndex ? '#FF8A80' : 'rgba(245,239,232,0.15)' }}
                animate={{ width: i === currentIndex ? 16 : 5 }}
                transition={{ duration: 0.25 }}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setCurrentIndex((prev) => (prev + 1) % insights.length)}>
              {currentIndex + 1}/{insights.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}