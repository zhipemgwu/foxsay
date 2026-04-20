import { motion } from 'motion/react';
import { badgePool } from './SocialPage';

/**
 * SOUL 风格已佩戴徽章胶囊（透明极简版）
 * —— 细长小胶囊：左侧真实徽章 PNG（小）+ 右侧小号徽章名
 * 无背景填色，仅 1px 主色细描边 + 极弱阴影
 */
export function EquippedBadges({
  ids,
  size = 'md',
  onClick,
  className = '',
}: {
  ids: string[];
  size?: 'sm' | 'md';
  onClick?: (id: string) => void;
  className?: string;
}) {
  if (!Array.isArray(ids) || ids.length === 0) return null;
  const imgSize = size === 'sm' ? 14 : 16;
  const fontSize = size === 'sm' ? 9 : 10;
  const height = size === 'sm' ? 18 : 20;

  return (
    <div className={`flex items-center flex-wrap gap-1.5 ${className}`}>
      {ids.map((bid, i) => {
        const b = badgePool.find(x => x.id === bid);
        if (!b) return null;
        const src = (b as any).img as string | undefined;
        return (
          <motion.button
            key={bid}
            onClick={() => onClick?.(bid)}
            className="flex items-center gap-1"
            style={{
              height,
              paddingLeft: 6,
              paddingRight: 8,
              background: 'transparent',
              border: `1px solid ${b.color}55`,
              borderRadius: 999,
              boxShadow: `0 0 0 0.5px ${b.color}15`,
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 22 }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ y: -1 }}
          >
            {src ? (
              <img
                src={src}
                alt=""
                style={{
                  width: imgSize,
                  height: imgSize,
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 2px ${b.color}66)`,
                  flexShrink: 0,
                }}
              />
            ) : (
              <span style={{ fontSize: imgSize - 2, lineHeight: 1 }}>{b.icon}</span>
            )}
            <span
              style={{
                color: b.color,
                fontSize,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: 0.2,
              }}
            >
              {b.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
