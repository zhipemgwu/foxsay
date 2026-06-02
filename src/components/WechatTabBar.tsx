import { motion } from 'motion/react';
import { Aperture, MessageCircle, UserRound, UsersRound } from 'lucide-react';

const tabs = [
  { label: '聊天', icon: MessageCircle },
  { label: '通讯录', icon: UsersRound },
  { label: '朋友圈', icon: Aperture },
  { label: '我的', icon: UserRound },
];

interface WechatTabBarProps {
  active: number;
  onTabChange: (idx: number) => void;
}

export function WechatTabBar({ active, onTabChange }: WechatTabBarProps) {
  return (
    <nav
      style={{
        flexShrink: 0,
        background: '#f7f7f7',
        borderTop: '1px solid #d9d9d9',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50,
      }}
    >
      <div style={{ height: 58, display: 'grid', gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = active === idx;
          return (
            <motion.button
              key={tab.label}
              type="button"
              onClick={() => onTabChange(idx)}
              whileTap={{ scale: 0.94 }}
              aria-label={tab.label}
              style={{
                border: 0,
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                color: isActive ? '#07c160' : '#6f6f6f',
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              <Icon size={24} strokeWidth={isActive ? 2.4 : 1.9} />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
