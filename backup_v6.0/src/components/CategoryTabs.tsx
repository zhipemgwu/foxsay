import { motion } from 'motion/react';
import { useState } from 'react';

const categories = [
  { label: '全部', emoji: '✨' },
  { label: '话题训练', emoji: '💬' },
  { label: 'AI 陪练', emoji: '🤖' },
  { label: '约会准备', emoji: '💝' },
  { label: '社交雷达', emoji: '📡' },
  { label: '情感秘籍', emoji: '📖' },
];

export function CategoryTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="pb-3">
      <div className="flex gap-2 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {categories.map((cat, idx) => {
          const isActive = active === idx;
          return (
            <motion.button
              key={cat.label}
              onClick={() => setActive(idx)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 relative"
              style={{
                background: 'transparent',
                borderRadius: 980,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="categoryTabBg"
                  className="absolute inset-0"
                  style={{ background: '#FF8A80', borderRadius: 980 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative" style={{ fontSize: '12px' }}>{cat.emoji}</span>
              <span
                className="relative"
                style={{
                  color: isActive ? '#2b2535' : 'rgba(245,239,232,0.65)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0px',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
