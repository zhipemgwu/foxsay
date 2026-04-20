/**
 * @file KeyboardPromoBanner.tsx
 * @desc 可挂在任意结果页/工具页底部的轻量键盘推广条，
 *       点击即弹出 AssistKeyboardPage。自带状态，独立使用。
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Sparkles, ChevronRight } from 'lucide-react';
import { AssistKeyboardPage } from './AssistKeyboardPage';

interface Props {
  /** 简短一句话，不传用默认 */
  hint?: string;
  /** 显示样式：full(卡片) / inline(细条) */
  variant?: 'full' | 'inline';
}

export function KeyboardPromoBanner({ hint, variant = 'full' }: Props) {
  const [open, setOpen] = useState(false);
  const defaultHint = '聊天时直接用 FoxSay 键盘 · 3 秒出 3 条回复';
  const text = hint || defaultHint;

  if (variant === 'inline') {
    return (
      <>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 mt-2"
          style={{
            background: 'rgba(255,217,61,0.06)',
            border: '1px solid rgba(255,217,61,0.25)',
            borderRadius: 10,
          }}
        >
          <Keyboard size={13} color="#FFD93D" />
          <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 12, flex: 1, textAlign: 'left' }}>
            {text}
          </span>
          <ChevronRight size={12} color="rgba(255,217,61,0.7)" />
        </motion.button>
        <AnimatePresence>{open && <AssistKeyboardPage onClose={() => setOpen(false)} />}</AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 p-3 mt-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255,138,128,0.14), rgba(255,217,61,0.1))',
          border: '1px solid rgba(255,217,61,0.28)',
          borderRadius: 14,
          boxShadow: '0 4px 14px rgba(255,138,128,0.12)',
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg,#FF8A80 0%,#F5B87C 55%,#FFD93D 100%)',
            boxShadow: '0 4px 10px rgba(255,138,128,0.35)',
          }}
        >
          <Keyboard size={18} color="#fff" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700 }}>FoxSay AI 键盘</span>
            <Sparkles size={10} color="#FFD93D" />
            <span
              style={{
                fontSize: 9.5, color: '#1a1520',
                background: 'linear-gradient(135deg,#FFD93D,#FF8A80)',
                padding: '1px 5px', borderRadius: 4, fontWeight: 700,
              }}
            >
              PRO
            </span>
          </div>
          <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 11.5, lineHeight: 1.4 }}>{text}</p>
        </div>
        <ChevronRight size={14} color="rgba(245,239,232,0.4)" />
      </motion.button>
      <AnimatePresence>{open && <AssistKeyboardPage onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
