/**
 * 导师私信 — 预约导师后的聊天界面 + 预约管理
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Send, X, Phone, ExternalLink } from 'lucide-react';
import { IconBubble, IcChat, IcStar, gradients } from './CuteIcons';
import { COACHES } from '../data/coaches';
import { sanitizeText } from '../lib/sanitize';

const coaches = COACHES;

/** 预约导师：原子写入 localStorage 并添加导师自动首条消息 */
export function bookCoach(coachId: number, coachName: string) {
  const safeName = sanitizeText(coachName, 50);
  try {
    // 原子读取所有相关数据
    const ids: number[] = JSON.parse(localStorage.getItem('foxsay_booked_coaches') || '[]');
    const chats = JSON.parse(localStorage.getItem('foxsay_coach_chats') || '{}');
    const unread: Record<number, number> = JSON.parse(localStorage.getItem('foxsay_coach_unread') || '{}');

    // 添加预约
    if (!ids.includes(coachId)) {
      ids.push(coachId);
    }
    // 生成预约时间（当前时间 + 10 分钟）
    const now = new Date();
    const startTime = new Date(now.getTime() + 10 * 60 * 1000);
    const timeStr = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
    const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 添加首条消息
    if (!chats[coachId] || chats[coachId].length === 0) {
      chats[coachId] = [
        { role: 'coach', text: `🎉 预约成功！您已成功预约，咨询将在 ${timeStr} 准时开始。\n\n我是${safeName}老师，在开始之前您可以先简单说说您目前遇到的困惑，这样我会更有针对性地帮助您 😊`, time: nowStr },
      ];
      unread[coachId] = (unread[coachId] || 0) + 1;
    }

    // 原子写入所有数据
    localStorage.setItem('foxsay_booked_coaches', JSON.stringify(ids));
    localStorage.setItem('foxsay_coach_chats', JSON.stringify(chats));
    localStorage.setItem('foxsay_coach_unread', JSON.stringify(unread));

    window.dispatchEvent(new Event('foxsay_coach_booked'));
    return timeStr;
  } catch (err) {
    console.error('[CoachChat] bookCoach failed:', err);
    window.dispatchEvent(new Event('foxsay_coach_booked'));
    return '';
  }
}

/** 获取已预约导师 ID 列表 */
function getBookedIds(): number[] {
  try { return JSON.parse(localStorage.getItem('foxsay_booked_coaches') || '[]'); } catch { return []; }
}

/** 获取聊天记录 */
function getStoredChats(): Record<number, { role: 'me' | 'coach'; text: string; time: string }[]> {
  try { return JSON.parse(localStorage.getItem('foxsay_coach_chats') || '{}'); } catch { return {}; }
}

/** 获取各导师未读消息数 */
export function getUnreadCounts(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem('foxsay_coach_unread') || '{}'); } catch { return {}; }
}

/** 获取总未读数 */
export function getTotalUnread(): number {
  const counts = getUnreadCounts();
  return Object.values(counts).reduce((sum: number, n) => sum + (n as number), 0);
}

/** 标记某导师消息已读 */
function markCoachRead(coachId: number) {
  const counts = getUnreadCounts();
  if (counts[coachId]) {
    delete counts[coachId];
    localStorage.setItem('foxsay_coach_unread', JSON.stringify(counts));
    window.dispatchEvent(new Event('foxsay_coach_unread_change'));
  }
}

export function CoachChatPage({ onClose }: { onClose: () => void }) {
  const [bookedIds, setBookedIds] = useState(getBookedIds);
  const bookedCoaches = coaches.filter(c => bookedIds.includes(c.id));
  const [activeCoach, setActiveCoach] = useState<typeof coaches[0] | null>(null);
  const [chats, setChats] = useState(getStoredChats);
  const [input, setInput] = useState('');
  const [unreadCounts, setUnreadCounts] = useState(getUnreadCounts);

  // 监听外部预约事件（从 PracticePage/CommunityPage 触发）
  useEffect(() => {
    const refresh = () => {
      setBookedIds(getBookedIds());
      setChats(getStoredChats());
      setUnreadCounts(getUnreadCounts());
    };
    window.addEventListener('foxsay_coach_booked', refresh);
    window.addEventListener('foxsay_coach_unread_change', refresh);
    return () => {
      window.removeEventListener('foxsay_coach_booked', refresh);
      window.removeEventListener('foxsay_coach_unread_change', refresh);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !activeCoach) return;
    const coachId = activeCoach.id;
    const safeInput = sanitizeText(input.trim(), 2000);
    const newMsg = { role: 'me' as const, text: safeInput, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setChats(prev => {
      const updated = { ...prev, [coachId]: [...(prev[coachId] || []), newMsg] };
      localStorage.setItem('foxsay_coach_chats', JSON.stringify(updated));
      return updated;
    });
    setInput('');

    // 模拟导师回复（实际应来自后端推送）
    setTimeout(() => {
      const replies = [
        '很好的思路！你可以试着再加入一些个人感受，让对话更有温度。',
        '这个方向是对的 👍 记住，真诚永远比技巧更重要。',
        '嗯，我理解你的困惑。我们来换个角度想这个问题...',
        '不错！你比上次进步很多了。继续保持这个状态。',
        '我建议你可以去练习页的「深度倾听」场景再练一次，有新的感悟随时找我聊。',
      ];
      const replyMsg = {
        role: 'coach' as const,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChats(prev => {
        const updated = { ...prev, [coachId]: [...(prev[coachId] || []), replyMsg] };
        localStorage.setItem('foxsay_coach_chats', JSON.stringify(updated));
        return updated;
      });
    }, 1500 + Math.random() * 2000);
  };

  return (
    <motion.div className="fixed inset-0 z-[1100] flex flex-col" style={{ background: '#2b2535' }}
      role="dialog" aria-modal="true" aria-label="教练聊天"
      initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

      {/* ===== 聊天界面 ===== */}
      {activeCoach ? (
        <>
          {/* 聊天顶栏 */}
          <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
            <div className="flex items-center justify-between px-5 h-12" style={{ borderBottom: '1px solid rgba(245,239,232,0.08)' }}>
              <div className="flex items-center gap-3">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveCoach(null)}>
                  <ChevronLeft size={22} color="rgba(245,239,232,0.6)" />
                </motion.button>
                <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: '2px solid rgba(155,126,222,0.4)' }}>
                  <img src={activeCoach.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{activeCoach.name}</span>
                  <span style={{ color: activeCoach.online ? '#4ECDC4' : 'rgba(245,239,232,0.3)', fontSize: 10, marginLeft: 6 }}>
                    {activeCoach.online ? '在线' : '离线'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 6 }}>
                <IcStar size={10} color="#FFD93D" />
                <span style={{ color: '#FFD93D', fontSize: 11, fontWeight: 700 }}>{activeCoach.rating}</span>
              </div>
            </div>
          </div>

          {/* 聊天消息列表 */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {(chats[activeCoach.id] || []).map((msg, i) => (
              <motion.div key={i} className={`flex ${msg.role === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {msg.role === 'coach' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0" style={{ border: '1.5px solid rgba(155,126,222,0.3)' }}>
                    <img src={activeCoach.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="max-w-[75vw] px-4 py-3" style={{
                    background: msg.role === 'me' ? gradients.coral : '#453a60',
                    borderRadius: msg.role === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: '#f5efe8', fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9, marginTop: 2, textAlign: msg.role === 'me' ? 'right' : 'left' }}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 输入框 */}
          <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
            style={{ background: '#352f45', borderTop: '1px solid rgba(245,239,232,0.08)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
            <div className="flex-1 flex items-center px-3 py-2" style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 20 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder="给导师发消息..."
                className="flex-1 bg-transparent outline-none"
                style={{ color: '#f5efe8', fontSize: 13 }}
                onKeyDown={e => e.key === 'Enter' && sendMessage()} />
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: input.trim() ? gradients.coral : 'rgba(245,239,232,0.06)' }}>
              <Send size={16} color={input.trim() ? '#fff' : 'rgba(245,239,232,0.3)'} />
            </motion.button>
          </div>
        </>
      ) : (
        /* ===== 导师列表（未选择导师时） ===== */
        <>
          <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
            <div className="flex items-center gap-3 px-5 h-12">
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                <ChevronLeft size={22} color="rgba(245,239,232,0.6)" />
              </motion.button>
              <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>导师私信</span>
              {bookedCoaches.length > 0 && (
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>{bookedCoaches.length}位导师</span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {bookedCoaches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span style={{ fontSize: 48, marginBottom: 12 }}>📭</span>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>暂无预约</span>
                <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 12 }}>去练习页预约导师后即可在这里私信交流</span>
              </div>
            ) : (
              bookedCoaches.map((coach, idx) => {
                const lastMsg = (chats[coach.id] || []).slice(-1)[0];
                return (
                  <motion.button key={coach.id} className="w-full flex items-center gap-3 px-5 py-4 text-left"
                    style={{ borderBottom: '1px solid rgba(245,239,232,0.06)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    whileTap={{ scale: 0.98 }} onClick={() => { markCoachRead(coach.id); setUnreadCounts(getUnreadCounts()); setActiveCoach(coach); }}>
                    {/* 导师头像 */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid rgba(155,126,222,0.4)' }}>
                        <img src={coach.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                        style={{ background: coach.online ? '#4ECDC4' : 'rgba(245,239,232,0.3)', borderColor: '#2b2535' }} />
                      {unreadCounts[coach.id] > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full flex items-center justify-center px-0.5"
                          style={{ background: '#FF4444', border: '2px solid #2b2535', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                          {unreadCounts[coach.id]}
                        </div>
                      )}
                    </div>
                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{coach.name}</span>
                          <span className="px-1.5 py-0.5" style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 4, color: '#B39DDB', fontSize: 9, fontWeight: 600 }}>认证导师</span>
                        </div>
                        <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>{lastMsg?.time || ''}</span>
                      </div>
                      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lastMsg ? (lastMsg.role === 'me' ? '我：' : '') + lastMsg.text : '预约成功，点击开始对话'}
                      </p>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
