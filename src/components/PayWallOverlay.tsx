/**
 * @file PayWallOverlay.tsx
 * @desc 统一功能墙组件 — 在任何 PRO 功能上盖一层蒙版，未开通会员则遮挡并提供升级 CTA。
 *       用法: <PayWallOverlay feature="KEYBOARD"><YourContent/></PayWallOverlay>
 */
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Crown, Lock, ChevronRight } from 'lucide-react';
import { FEATURES, FeatureKey, TERMS } from '../lib/subscription';
import { useUser } from '../context/UserContext';
import { useSub } from './SubscriptionSheet';

interface Props {
  feature: FeatureKey;
  children: ReactNode;
  /** 来源埋点 */
  source?: string;
  /** 描述文案覆盖 */
  hint?: string;
}

export function PayWallOverlay({ feature, children, source, hint }: Props) {
  const user = useUser() as any;
  const sub = useSub();
  const def = FEATURES[feature];
  const locked = def.pro && !user.isPro?.();

  if (!locked) return <>{children}</>;

  return (
    <div className="relative" style={{ overflow: 'hidden', borderRadius: 14 }}>
      <div style={{ filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => sub.open(source || feature)}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(180deg, rgba(43,37,53,0.55) 0%, rgba(43,37,53,0.88) 60%)',
          borderRadius: 14,
        }}
        aria-label={`开通${TERMS.MEMBERSHIP}解锁${def.label}`}
      >
        <div className="flex items-center justify-center"
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,#FF8A80 0%,#F5B87C 55%,#FFD93D 100%)',
            boxShadow: '0 4px 14px rgba(255,138,128,0.4)',
          }}>
          <Lock size={20} color="#fff" />
        </div>
        <div className="flex items-center gap-1.5">
          <Crown size={12} color="#FFD93D" />
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700 }}>
            {hint || `${def.label} · 会员专享`}
          </span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5"
          style={{
            background: 'linear-gradient(135deg,#FF8A80,#FFD93D)',
            borderRadius: 999,
          }}>
          <span style={{ color: '#1a1520', fontSize: 12, fontWeight: 700 }}>{TERMS.SUBSCRIBE_ACTION}</span>
          <ChevronRight size={12} color="#1a1520" />
        </div>
      </motion.button>
    </div>
  );
}
