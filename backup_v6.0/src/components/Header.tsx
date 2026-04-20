import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Gift, TrendingUp, Heart, Crown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcHeart, IcTarget, IcChart, IcTrophy, gradients } from './CuteIcons';
import { VIPPage } from './VIPPage';

const notifications = [
  { id: 1, icon: <IcHeart size={16} color="#fff" />, bg: gradients.rose, title: '好感度 +8', desc: 'AI 分析你的聊天记录后，发现共情力提升明显', time: '刚刚', unread: true },
  { id: 2, icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '新场景解锁', desc: '「暖冬约会」已就绪，快来挑战', time: '30分钟前', unread: true },
  { id: 3, icon: <IcChart size={16} color="#fff" />, bg: gradients.purple, title: '周报已生成', desc: '你的恋爱能力雷达图有更新', time: '2小时前', unread: false },
  { id: 4, icon: <IcTrophy size={16} color="#fff" />, bg: gradients.golden, title: '成就达成', desc: '连续打卡7天 — "恒心初现"', time: '昨天', unread: false },
];

export function Header() {
  const [showNotif, setShowNotif] = useState(false);
  const [showVIP, setShowVIP] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <>
      <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
        <div className="flex items-center justify-between px-5 h-12">
          <div className="flex items-center gap-2">
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#FF8A80"
              />
            </svg>
            <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600, letterSpacing: '0px', lineHeight: 1.24 }}>
              Love Lab
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(155,126,222,0.25), rgba(255,138,128,0.15))',
                border: '1px solid rgba(155,126,222,0.3)',
              }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setShowVIP(true)}
              aria-label="订阅会员"
            >
              <Crown size={12} color="#FFD93D" strokeWidth={2.5} />
              <span style={{ color: '#FFD93D', fontSize: '11px', fontWeight: 600 }}>订阅</span>
            </motion.button>

            <motion.button
              className="relative flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotif(true)}
              aria-label="通知"
            >
              <Bell size={20} color="rgba(245,239,232,0.65)" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1.5 min-w-4 h-4 rounded-full flex items-center justify-center px-1"
                  style={{ background: '#FF8A80', fontSize: '10px', fontWeight: 700, color: '#2b2535' }}>
                  {unreadCount}
                </div>
              )}
            </motion.button>

            <motion.button className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" whileTap={{ scale: 0.9 }} aria-label="个人头像">
              <ImageWithFallback
                src="/avatars/face5.webp"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowNotif(false)} />
            <motion.div
              className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0', maxHeight: '70vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>通知</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotif(false)} aria-label="关闭通知">
                  <X size={20} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 56px)' }}>
                {notifs.map((n) => (
                  <motion.button
                    key={n.id}
                    className="w-full text-left flex items-start gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid rgba(245,239,232,0.08)', background: n.unread ? 'rgba(255,138,128,0.08)' : 'transparent' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ background: n.bg, borderRadius: 10 }}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{n.title}</span>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#FF8A80' }} />}
                      </div>
                      <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', lineHeight: 1.4 }}>{n.desc}</p>
                      <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', marginTop: 4, display: 'block' }}>{n.time}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVIP && <VIPPage onClose={() => setShowVIP(false)} />}
      </AnimatePresence>
    </>
  );
}