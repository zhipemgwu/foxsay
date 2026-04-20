import { motion } from 'motion/react';
import { IconBubble, IcHeart, IcChat, IcBook, IcTarget, IcSparkle, gradients } from './CuteIcons';

interface EmptyStateProps {
  type?: 'posts' | 'practice' | 'achievements' | 'collections' | 'learning' | 'default';
  title?: string;
  subtitle?: string;
}

const config: Record<string, { icon: React.ReactNode; bg: string; title: string; subtitle: string }> = {
  posts: { icon: <IcChat size={32} color="rgba(255,138,128,0.4)" />, bg: 'rgba(255,138,128,0.08)', title: '这里还没有内容', subtitle: '成为第一个分享的人吧' },
  practice: { icon: <IcTarget size={32} color="rgba(78,205,196,0.4)" />, bg: 'rgba(78,205,196,0.08)', title: '暂无可用练习', subtitle: '新的练习场景即将推出' },
  achievements: { icon: <IcHeart size={32} color="rgba(244,143,177,0.4)" />, bg: 'rgba(244,143,177,0.08)', title: '还没有成就', subtitle: '完成练习来解锁你的第一个成就' },
  collections: { icon: <IcBook size={32} color="rgba(155,126,222,0.4)" />, bg: 'rgba(155,126,222,0.08)', title: '收藏夹是空的', subtitle: '浏览社区内容并收藏喜欢的' },
  learning: { icon: <IcBook size={32} color="rgba(255,217,61,0.4)" />, bg: 'rgba(255,217,61,0.08)', title: '暂无学习记录', subtitle: '开始第一次练习吧' },
  default: { icon: <IcHeart size={32} color="rgba(255,138,128,0.4)" />, bg: 'rgba(255,138,128,0.08)', title: '这里空空如也', subtitle: '内容即将到来' },
};

export function EmptyState({ type = 'default', title, subtitle }: EmptyStateProps) {
  const c = config[type] || config.default;
  return (
    <motion.div className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="relative mb-5">
        <IconBubble size={72} bg={c.bg} glow glowColor="rgba(255,138,128,0.35)">
          {c.icon}
        </IconBubble>
        {/* floating sparkles */}
        <motion.div className="absolute -top-1 -right-1"
          animate={{ y: [0, -5, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <IcSparkle size={14} color="rgba(255,217,61,0.5)" />
        </motion.div>
        <motion.div className="absolute -bottom-1 -left-2"
          animate={{ y: [0, -3, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}>
          <IcSparkle size={10} color="rgba(155,126,222,0.4)" />
        </motion.div>
        <motion.div className="absolute top-1/2 -right-4"
          animate={{ y: [0, -4, 0], x: [0, 2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1, ease: 'easeInOut' }}>
          <IcSparkle size={8} color="rgba(78,205,196,0.35)" />
        </motion.div>
      </div>
      <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '15px', fontWeight: 500, marginBottom: 4 }}>
        {title || c.title}
      </p>
      <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>
        {subtitle || c.subtitle}
      </p>
    </motion.div>
  );
}
