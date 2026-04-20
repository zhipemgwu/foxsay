import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Gift, TrendingUp, Heart, Crown, Keyboard } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcHeart, IcTarget, IcChart, IcTrophy, IcChat, gradients } from './CuteIcons';
import { VIPPage } from './VIPPage';
import { SocialPage } from './SocialPage';
import { AssistKeyboardPage } from './AssistKeyboardPage';
import { useSub } from './SubscriptionSheet';
import { useUser } from '../context/UserContext';
import { SubscriptionManageSheet } from './SubscriptionManageSheet';
import { COACH_NAME_MAP } from '../data/coaches';
import { sanitizeText } from '../lib/sanitize';

const newUserNotifications = [
  { id: 1, icon: <Gift size={16} color="#fff" />, bg: gradients.coral, title: '🎉 欢迎加入 FoxSay', desc: '完成入门鉴定，解锁你的恋爱物种', time: '刚刚', unread: true },
  { id: 2, icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '新手任务', desc: '完成第一次 AI 陪练，获得 50 XP 奖励', time: '刚刚', unread: true },
  { id: 3, icon: <IcChart size={16} color="#fff" />, bg: gradients.purple, title: '恋爱能力鉴定', desc: '你的初始雷达图已生成，去看看吧', time: '1分钟前', unread: true },
];

const baseNotifications = [
  { id: 1, icon: <IcHeart size={16} color="#fff" />, bg: gradients.rose, title: '好感度 +8', desc: 'AI 分析你的聊天记录后，发现共情力提升明显', time: '刚刚', unread: true },
  { id: 2, icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '新场景解锁', desc: '「暖冬约会」已就绪，快来挑战', time: '30分钟前', unread: true },
  { id: 3, icon: <IcChart size={16} color="#fff" />, bg: gradients.purple, title: '周报已生成', desc: '你的恋爱能力雷达图有更新', time: '2小时前', unread: false },
  { id: 4, icon: <IcTrophy size={16} color="#fff" />, bg: gradients.golden, title: '成就达成', desc: '连续打卡7天 — "恒心初现"', time: '昨天', unread: false },
];

/** 从 localStorage 读取预约通知 */
function getBookingNotifs() {
  try {
  const ids: number[] = JSON.parse(localStorage.getItem('foxsay_booked_coaches') || '[]');
  const chats = JSON.parse(localStorage.getItem('foxsay_coach_chats') || '{}');
  return ids.map((id, i) => {
    const firstMsg = chats[id]?.[0];
    const timeMatch = typeof firstMsg?.text === 'string' ? firstMsg.text.match(/(\d{2}:\d{2})/) : null;
    const startTime = timeMatch ? timeMatch[1] : '';
    const coachName = sanitizeText(COACH_NAME_MAP[id] || '导师', 20);
    return {
      id: 100 + id,
      icon: <IcChat size={16} color="#fff" />,
      bg: gradients.mint,
      title: `导师预约成功`,
      desc: `${coachName}老师已确认${startTime ? `，咨询 ${startTime} 开始` : ''}。前往「我的 → 导师私信」开始聊天`,
      time: sanitizeText(firstMsg?.time || '刚刚', 20),
      unread: true,
    };
  });
  } catch { return []; }
}

export function Header() {
  const [showNotif, setShowNotif] = useState(false);
  const [showVIP, setShowVIP] = useState(false);
  const [showKb, setShowKb] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showSubManage, setShowSubManage] = useState(false);
  const user = useUser();
  const sub = useSub();
  const isNewUser = !user.xp && !user.achievements;

  const [notifs, setNotifs] = useState(() => {
    const readIds: number[] = (() => { try { return JSON.parse(localStorage.getItem('foxsay_notif_read') || '[]'); } catch { return []; } })();
    const readSet = new Set(readIds);
    return [...getBookingNotifs(), ...(isNewUser ? newUserNotifications : baseNotifications)].map(n => ({
      ...n, unread: readSet.has(n.id) ? false : n.unread,
    }));
  });
  const unreadCount = notifs.filter(n => n.unread).length;

  const markRead = (id: number) => {
    setNotifs(prev => {
      const next = prev.map(x => x.id === id ? { ...x, unread: false } : x);
      localStorage.setItem('foxsay_notif_read', JSON.stringify(next.filter(x => !x.unread).map(x => x.id)));
      return next;
    });
  };
  const markAllRead = () => {
    setNotifs(prev => {
      const next = prev.map(x => ({ ...x, unread: false }));
      localStorage.setItem('foxsay_notif_read', JSON.stringify(next.map(x => x.id)));
      return next;
    });
  };

  useEffect(() => {
    const refresh = () => {
      setNotifs(prev => {
        const readIds: number[] = (() => { try { return JSON.parse(localStorage.getItem('foxsay_notif_read') || '[]'); } catch { return []; } })();
        const readSet = new Set([...readIds, ...prev.filter(n => !n.unread).map(n => n.id)]);
        const base = isNewUser ? newUserNotifications : baseNotifications;
        return [...getBookingNotifs(), ...base].map(n => ({
          ...n, unread: readSet.has(n.id) ? false : n.unread,
        }));
      });
    };
    window.addEventListener('foxsay_coach_booked', refresh);
    return () => window.removeEventListener('foxsay_coach_booked', refresh);
  }, [isNewUser]);

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
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,217,61,0.22), rgba(255,138,128,0.15))',
                border: '1px solid rgba(255,217,61,0.3)',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowKb(true)}
              aria-label="AI 键盘"
            >
              <Keyboard size={11} color="#FFD93D" strokeWidth={2.5} />
              <span style={{ color: '#FFD93D', fontSize: '10.5px', fontWeight: 600 }}>键盘</span>
            </motion.button>

            <motion.button
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(155,126,222,0.25), rgba(255,138,128,0.15))',
                border: '1px solid rgba(155,126,222,0.3)',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => user.isPro?.() ? setShowSubManage(true) : setShowVIP(true)}
              aria-label={user.isPro?.() ? '管理会员' : '开通会员'}
            >
              <Crown size={12} color="#FFD93D" strokeWidth={2.5} />
              <span style={{ color: '#FFD93D', fontSize: '11px', fontWeight: 600 }}>{user.isPro?.() ? ((user as any).subTier === 'proplus' ? 'PRO+' : (user as any).subTier === 'pro' ? 'PRO' : '会员') : '开通'}</span>
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

            <motion.button className="relative flex items-center" whileTap={{ scale: 0.9 }} aria-label="个人头像" onClick={() => setShowSocial(true)}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src="/avatars/face5.webp"
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
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
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={markAllRead}
                      className="px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,239,232,0.08)', fontSize: 11, color: 'rgba(245,239,232,0.5)', fontWeight: 600 }}>
                      全部已读
                    </motion.button>
                  )}
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotif(false)} aria-label="关闭通知">
                    <X size={20} color="rgba(245,239,232,0.58)" />
                  </motion.button>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 56px)' }}>
                {notifs.map((n) => (
                  <motion.button
                    key={n.id}
                    className="w-full text-left flex items-start gap-3 px-5 py-4"
                    style={{ borderBottom: '1px solid rgba(245,239,232,0.08)', background: n.unread ? 'rgba(255,138,128,0.08)' : 'transparent' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => markRead(n.id)}
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

      <SubscriptionManageSheet open={showSubManage} onClose={() => setShowSubManage(false)} onUpgrade={() => setShowVIP(true)} />

      <AnimatePresence>
        {showKb && <AssistKeyboardPage onClose={() => setShowKb(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSocial && <SocialPage onClose={() => setShowSocial(false)} />}
      </AnimatePresence>
    </>
  );
}