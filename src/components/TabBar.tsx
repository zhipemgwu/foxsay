import { motion, AnimatePresence } from 'motion/react';

const tabs = [
  { label: '首页', icon: TabHome },
  { label: '恋商', icon: TabAI },
  { label: '心动', icon: TabHeart, isPrimary: true },
  { label: '社区', icon: TabChat },
  { label: '我的', icon: TabUser },
];

interface TabBarProps {
  active: number;
  onTabChange: (idx: number) => void;
}

export function TabBar({ active, onTabChange }: TabBarProps) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        background: 'rgba(55,45,75,0.65)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 999,
      }}
    >
      <div className="flex items-end justify-around px-1" style={{ height: 58 }}>
        {tabs.map((tab, idx) => {
          const { icon: Icon, label, isPrimary } = tab;
          const isActive = active === idx;
          const activeColor = isPrimary ? '#FF8A80' : '#f5efe8';
          const inactiveColor = 'rgba(245,239,232,0.4)';

          return (
            <motion.button
              key={label}
              onClick={() => onTabChange(idx)}
              className="flex flex-col items-center relative"
              style={{ minWidth: 56, paddingBottom: 6, cursor: 'pointer' }}
              whileTap={{ scale: 0.92 }}
              aria-label={label}
            >
              {/* 选中态药丸背景 */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 2, left: 0, right: 0,
                    width: 48, height: 32,
                    margin: '0 auto',
                    borderRadius: 16,
                    background: isPrimary
                      ? 'rgba(255,138,128,0.15)'
                      : 'rgba(255,255,255,0.08)',
                    border: isPrimary
                      ? '1px solid rgba(255,138,128,0.2)'
                      : '1px solid rgba(255,255,255,0.06)',
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}

              {/* 图标 */}
              <div style={{ position: 'relative', zIndex: 1, paddingTop: 6 }}>
                <Icon size={23} color={isActive ? activeColor : inactiveColor} active={isActive} />
              </div>

              {/* 文字 */}
              <span style={{
                color: isActive ? activeColor : inactiveColor,
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                marginTop: 2,
                position: 'relative', zIndex: 1,
                letterSpacing: 0.3,
              }}>{label}</span>

              {/* 选中态底部发光圆点 */}
              {isActive && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 0, left: '50%', marginLeft: -2,
                    width: 4, height: 4,
                    borderRadius: '50%',
                    background: isPrimary ? '#FF8A80' : '#9B7EDE',
                    boxShadow: isPrimary
                      ? '0 0 8px rgba(255,138,128,0.6)'
                      : '0 0 8px rgba(155,126,222,0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab Bar Icons ── */

function TabHome({ size, color, active }: { size: number; color: string; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z"
        fill={active ? color : 'transparent'} opacity={active ? 0.2 : 0} />
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1v-9.5z"
        stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-7h6v7" stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabHeart({ size, color, active }: { size: number; color: string; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={active ? color : 'transparent'}
        stroke={color}
        strokeWidth={active ? 0 : 1.6}
        strokeLinecap="round" strokeLinejoin="round"
        opacity={active ? 1 : 1}
      />
    </svg>
  );
}

function TabAI({ size, color, active }: { size: number; color: string; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Brain/sparkle analytical icon */}
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2z"
        fill={active ? color : 'transparent'} opacity={active ? 0.2 : 0}
        stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinejoin="round" />
      <path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14z"
        fill={active ? color : 'transparent'}
        stroke={color} strokeWidth={active ? 1.6 : 1.2} strokeLinejoin="round" />
      <path d="M6 16l.6 1.4L8 18l-1.4.6L6 20l-.6-1.4L4 18l1.4-.6L6 16z"
        fill={active ? color : 'transparent'}
        stroke={color} strokeWidth={active ? 1.4 : 1} strokeLinejoin="round" />
    </svg>
  );
}

function TabChat({ size, color, active }: { size: number; color: string; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 12c0 4.418-3.582 7-8 7a9.863 9.863 0 01-3.2-.53L4 20l1.338-3.346C4.493 15.373 4 13.74 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
        fill={active ? color : 'transparent'} opacity={active ? 0.2 : 0} />
      <path d="M20 12c0 4.418-3.582 7-8 7a9.863 9.863 0 01-3.2-.53L4 20l1.338-3.346C4.493 15.373 4 13.74 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
        stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="15" cy="12" r="1" fill={color} />
    </svg>
  );
}

function TabUser({ size, color, active }: { size: number; color: string; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
        fill={active ? color : 'transparent'} opacity={active ? 0.2 : 0}
        stroke={color} strokeWidth={active ? 2 : 1.6} />
      <path d="M20 21c0-3.314-3.582-6-8-6s-8 2.686-8 6"
        stroke={color} strokeWidth={active ? 2 : 1.6} strokeLinecap="round" />
    </svg>
  );
}