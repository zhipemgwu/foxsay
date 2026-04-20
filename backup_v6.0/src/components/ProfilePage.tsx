import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcTrophy, IcBook, IcCalendar, IcHeart, IcStar, IcCrown, IcFire, IcChart, IcShield, IcLightbulb, IcTarget, IcSparkle, IcChat, gradients } from './CuteIcons';
import { EmptyState } from './EmptyState';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Crown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { VIPPage } from './VIPPage';

const menuItems = [
  { icon: <IcTrophy size={16} color="#fff" />, bg: gradients.coral, label: '我的成就', badge: '12' },
  { icon: <IcBook size={16} color="#fff" />, bg: gradients.purple, label: '学习记录', badge: '' },
  { icon: <IcCalendar size={16} color="#fff" />, bg: gradients.coral, label: '打卡日历', badge: '23天' },
  { icon: <IcHeart size={16} color="#fff" />, bg: gradients.purple, label: '我的收藏', badge: '8' },
  { icon: <IcStar size={16} color="#fff" />, bg: gradients.coral, label: '等级特权', badge: 'Lv.12' },
];

const achievements = [
  { icon: <IcFire size={24} color="#fff" />, bg: gradients.coral, title: '连续打卡7天', desc: '恒心初现', unlocked: true, date: '2026-04-07' },
  { icon: <IcChat size={24} color="#fff" />, bg: gradients.sky, title: '完成10次AI对话', desc: '对话达人', unlocked: true, date: '2026-04-10' },
  { icon: <IcSparkle size={24} color="#fff" />, bg: gradients.golden, title: '获得100 XP', desc: '初露锋芒', unlocked: true, date: '2026-04-05' },
  { icon: <IcTrophy size={24} color="#fff" />, bg: gradients.purple, title: '连续打卡30天', desc: '恋爱学徒', unlocked: true, date: '2026-04-14' },
  { icon: <IcTarget size={24} color="#fff" />, bg: gradients.mint, title: '所有技能达到80+', desc: '全面发展', unlocked: false, date: '' },
  { icon: <IcCrown size={24} color="#fff" />, bg: gradients.rose, title: '综合评分95+', desc: '恋爱大师', unlocked: false, date: '' },
];

const learningRecords = [
  { date: '今天', items: [{ title: 'AI 约会模拟 · 咖啡馆初见', xp: 50, time: '12分钟' }, { title: '每日话题训练', xp: 10, time: '3分钟' }] },
  { date: '昨天', items: [{ title: '深度倾听练习', xp: 45, time: '8分钟' }, { title: '阅读恋爱小贴士', xp: 10, time: '2分钟' }] },
  { date: '4月12日', items: [{ title: '公园约会场景', xp: 50, time: '10分钟' }] },
];

const settingsGroups = [
  {
    title: '通用设置',
    items: [
      { icon: <IcLightbulb size={14} color="rgba(245,239,232,0.58)" />, label: '通知设置', value: '已开启', type: 'link' as const },
      { icon: <IcSparkle size={14} color="rgba(245,239,232,0.58)" />, label: '深色模式', value: '', type: 'toggle' as const },
      { icon: <IcChart size={14} color="rgba(245,239,232,0.58)" />, label: '语言', value: '简体中文', type: 'link' as const },
    ],
  },
  {
    title: '账户安全',
    items: [
      { icon: <IcShield size={14} color="rgba(245,239,232,0.58)" />, label: '隐私设置', value: '', type: 'link' as const },
      { icon: <IcChat size={14} color="rgba(245,239,232,0.58)" />, label: '帮助与反馈', value: '', type: 'link' as const },
      { icon: <IcBook size={14} color="rgba(245,239,232,0.58)" />, label: '关于我们', value: 'v3.0', type: 'link' as const },
    ],
  },
];

type ModalType = 'achievements' | 'learning' | 'settings' | 'calendar' | 'collections' | 'privileges' | null;

export function ProfilePage() {
  const user = useUser();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showVIP, setShowVIP] = useState(false);
  const [darkToggle, setDarkToggle] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
    return saved !== null ? saved === 'true' : true;
  });

  const calendarDays = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, active: i < 23, today: i === 13 }));

  const menuActions: Record<string, ModalType> = {
    '我的成就': 'achievements', '学习记录': 'learning', '打卡日历': 'calendar', '我的收藏': 'collections', '等级特权': 'privileges',
  };

  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(155,126,222,0.15) 0%, rgba(255,138,128,0.12) 30%, transparent 100%)',
        }} />

        <div className="flex items-center justify-between mb-8">
          <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0 }}>我的</h1>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveModal('settings')}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="rgba(245,239,232,0.65)" strokeWidth={1.8} />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="rgba(245,239,232,0.65)" strokeWidth={1.8} strokeLinecap="round" />
            </svg>
          </motion.button>
        </div>

        {/* Unified Profile + Level Card */}
        <motion.div className="mb-6 overflow-hidden"
          style={{ borderRadius: 16, border: '1px solid rgba(245,239,232,0.08)' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="p-5 relative overflow-hidden" style={{ background: '#352f45', borderRadius: 16 }}>
            <div className="absolute top-0 right-0 pointer-events-none" style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,126,222,0.12) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }} />
            {/* Top: avatar + name + VIP */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex-shrink-0 relative">
                <div className="absolute inset-[-3px] rounded-full avatar-glow-ring" style={{ background: 'linear-gradient(135deg, #B39DDB, #9B7EDE)', opacity: 0.5 }} />
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <ImageWithFallback src="/avatars/face5.webp" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: gradients.purple, border: '2px solid #352f45' }}>
                  <IcCrown size={9} color="#fff" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600, marginBottom: 2 }}>{user.name}</h2>
                  <span className="px-2 py-0.5" style={{ background: 'rgba(155,126,222,0.15)', borderRadius: 4, color: 'rgba(155,126,222,0.7)', fontSize: '10px', fontWeight: 600 }}>VIP</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}><span style={{ color: 'rgba(245,239,232,0.7)', fontWeight: 600 }}>340</span> XP</span>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}><span style={{ color: 'rgba(245,239,232,0.7)', fontWeight: 600 }}>23</span> 天</span>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}><span style={{ color: 'rgba(245,239,232,0.7)', fontWeight: 600 }}>12</span> 成就</span>
                </div>
              </div>
            </div>
            {/* Level progress */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(245,239,232,0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#B39DDB', fontSize: '14px', fontWeight: 700 }}>Lv.12 恋爱学徒</span>
                  <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                    <IcSparkle size={12} color="#FFD93D" />
                  </motion.div>
                </div>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>恋爱达人 →</span>
              </div>
              <div className="w-full overflow-hidden" style={{ height: 6, borderRadius: 3, background: 'rgba(245,239,232,0.12)' }}>
                <motion.div className="h-full"
                  style={{ background: 'linear-gradient(90deg, #9B7EDE, #B39DDB)', borderRadius: 3, width: '68%' }}
                  initial={{ width: 0 }} animate={{ width: '68%' }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '10px' }}>340 / 500 XP</span>
                <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '10px' }}>还需 160 XP</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VIP 会员横幅 */}
        <motion.button
          className="w-full mb-6 text-left"
          style={{ borderRadius: 14, border: '1px solid rgba(245,239,232,0.08)' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowVIP(true)}
        >
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#352f45', borderRadius: 14 }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(155,126,222,0.3), rgba(155,126,222,0.15))' }}>
                <Crown size={14} color="rgba(155,126,222,0.7)" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: '14px', fontWeight: 700 }}>Pro 会员</span>
                  <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: '11px' }}>2026.12.31 到期</span>
                </div>
                <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', marginTop: 2 }}>已解锁 12 项专属权益</p>
              </div>
            </div>
            <ChevronRight size={16} color="rgba(245,239,232,0.4)" />
          </div>
        </motion.button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { n: '12', l: '已完成', icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint },
            { n: '82', l: '综合分', icon: <IcChart size={16} color="#fff" />, bg: gradients.coral },
            { n: '23', l: '连续天', icon: <IcFire size={16} color="#fff" />, bg: gradients.golden },
          ].map((s, i) => (
            <motion.div key={s.l} style={{ borderRadius: 16, border: '1px solid rgba(245,239,232,0.06)' }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
              <div className="py-4 flex flex-col items-center" style={{ background: '#453a60', borderRadius: 16 }}>
                <IconBubble size={32} bg={s.bg}>{s.icon}</IconBubble>
                <span style={{ color: '#f5efe8', fontSize: '21px', fontWeight: 600, lineHeight: 1.19, marginTop: 6 }}>{s.n}</span>
                <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '11px', marginTop: 2 }}>{s.l}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Menu */}
        <div className="flex flex-col">
          {menuItems.map((item, idx) => (
            <div key={item.label}>
            {idx > 0 && <div style={{ height: 1, background: 'rgba(245,239,232,0.06)', marginLeft: 52, marginRight: 16 }} />}
            <motion.button className="w-full p-4 flex items-center gap-4 text-left"
              style={{ background: '#453a60', borderRadius: idx === 0 ? '14px 14px 0 0' : idx === menuItems.length - 1 ? '0 0 14px 14px' : 0 }}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + idx * 0.04 }}
              whileTap={{ scale: 0.98 }} onClick={() => setActiveModal(menuActions[item.label] || null)}>
              <IconBubble size={36} bg={item.bg}>{item.icon}</IconBubble>
              <span className="flex-1" style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
              {item.badge && <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', marginRight: 4 }}>{item.badge}</span>}
              <ChevronRight size={14} color="rgba(245,239,232,0.34)" strokeWidth={2} />
            </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setActiveModal(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0', maxHeight: '80vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>
                  {{ achievements: '我的成就', learning: '学习记录', settings: '设置', calendar: '打卡日历', collections: '我的收藏', privileges: '等级特权' }[activeModal]}
                </span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveModal(null)}>
                  <X size={20} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>

              <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(80vh - 56px)' }}>
                {activeModal === 'achievements' && (
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((a) => (
                      <div key={a.title} className="p-4 flex flex-col items-center text-center" style={{
                        background: a.unlocked ? '#574d72' : 'rgba(87,77,114,0.5)', borderRadius: 14,
                        opacity: a.unlocked ? 1 : 0.5,
                        border: a.unlocked ? '1px solid rgba(255,138,128,0.22)' : '1px solid transparent',
                      }}>
                        <IconBubble size={48} bg={a.unlocked ? a.bg : 'rgba(87,77,114,0.6)'}>{a.icon}</IconBubble>
                        <p style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600, marginBottom: 2, marginTop: 8 }}>{a.title}</p>
                        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{a.desc}</p>
                        {a.unlocked && a.date && <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '10px', marginTop: 4 }}>{a.date}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'learning' && (
                  <div className="flex flex-col gap-5">
                    {learningRecords.map((day) => (
                      <div key={day.date}>
                        <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '13px', fontWeight: 500, marginBottom: 8, display: 'block' }}>{day.date}</span>
                        <div className="flex flex-col gap-2">
                          {day.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3" style={{ background: '#574d72', borderRadius: 12 }}>
                              <div>
                                <p style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 500, marginBottom: 2 }}>{item.title}</p>
                                <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>{item.time}</span>
                              </div>
                              <span className="px-2 py-0.5" style={{ background: 'rgba(255,217,61,0.18)', borderRadius: 6, color: '#FFD93D', fontSize: '12px', fontWeight: 600 }}>+{item.xp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'calendar' && (
                  <div>
                    <div className="text-center mb-4">
                      <span style={{ color: '#f5efe8', fontSize: '16px', fontWeight: 600 }}>{`${new Date().getFullYear()}年${new Date().getMonth() + 1}月`}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                        <div key={d} className="text-center py-1">
                          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{d}</span>
                        </div>
                      ))}
                      {[0, 0, 0].map((_, i) => <div key={`e-${i}`} />)}
                      {calendarDays.map((d) => (
                        <div key={d.day} className="flex justify-center py-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                            background: d.active ? gradients.coral : d.today ? 'rgba(255,138,128,0.18)' : 'transparent',
                            border: d.today && !d.active ? '1.5px dashed rgba(255,138,128,0.4)' : 'none',
                          }}>
                            <span style={{ color: d.active ? '#fff' : d.today ? '#FF8A80' : 'rgba(245,239,232,0.58)', fontSize: '12px', fontWeight: d.active || d.today ? 600 : 400 }}>{d.day}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 p-4 flex items-center gap-3" style={{ background: '#574d72', borderRadius: 12 }}>
                      <IconBubble size={40} bg={gradients.coral}><IcFire size={18} color="#fff" /></IconBubble>
                      <div>
                        <p style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>连续打卡 23 天</p>
                        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px', marginTop: 2 }}>再坚持 7 天解锁「恋爱达人」成就</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'collections' && (
                  <div className="flex flex-col gap-3">
                    {[
                      { title: '咖啡馆搭讪技巧', type: '练习', time: '3天前' },
                      { title: '约会前的准备清单', type: '文章', time: '5天前' },
                      { title: '开场白大全', type: '话术', time: '1周前' },
                      { title: '如何读懂对方的暗示', type: '文章', time: '1周前' },
                      { title: '浪漫晚餐模拟', type: '练习', time: '2周前' },
                      { title: '共情式回应模板', type: '话术', time: '3周前' },
                    ].map((item, i) => (
                      <motion.button key={i} className="w-full flex items-center justify-between p-3 text-left" style={{ background: '#574d72', borderRadius: 12 }} whileTap={{ scale: 0.98 }}>
                        <div>
                          <p style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 500, marginBottom: 2 }}>{item.title}</p>
                          <div className="flex items-center gap-2">
                            <span style={{ background: 'rgba(255,138,128,0.18)', color: '#FF8A80', fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: 4 }}>{item.type}</span>
                            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>{item.time}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} color="rgba(245,239,232,0.55)" />
                      </motion.button>
                    ))}
                  </div>
                )}

                {activeModal === 'privileges' && (
                  <div>
                    <div className="text-center mb-5">
                      <IconBubble size={56} bg={gradients.purple} className="mx-auto mb-3"><IcCrown size={26} color="#fff" /></IconBubble>
                      <p style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>Lv.12 恋爱学徒</p>
                      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '13px', marginTop: 4 }}>340/500 XP · 距离下一级还需 160 XP</p>
                    </div>
                    {[
                      { level: 'Lv.1-5', title: '恋爱小白', perks: '基础练习场景', unlocked: true, bg: gradients.mint },
                      { level: 'Lv.6-10', title: '恋爱新手', perks: '进阶练习 + AI基础点评', unlocked: true, bg: gradients.sky },
                      { level: 'Lv.11-15', title: '恋爱学徒', perks: '全部练习 + AI深度点评', unlocked: true, bg: gradients.purple },
                      { level: 'Lv.16-20', title: '恋爱达人', perks: '专属场景 + 个性化建议', unlocked: false, bg: gradients.coral },
                      { level: 'Lv.21+', title: '恋爱大师', perks: '导师身份 + 社区特权', unlocked: false, bg: gradients.golden },
                    ].map((lv, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 mb-2" style={{
                        background: lv.unlocked ? '#574d72' : 'rgba(77,69,98,0.3)', borderRadius: 12, opacity: lv.unlocked ? 1 : 0.5,
                      }}>
                        <IconBubble size={32} bg={lv.unlocked ? lv.bg : 'rgba(155,126,222,0.25)'}>
                          <span style={{ color: '#fff', fontSize: '9px', fontWeight: 700 }}>{lv.level.split('-')[0]}</span>
                        </IconBubble>
                        <div className="flex-1">
                          <p style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600 }}>{lv.title}</p>
                          <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{lv.perks}</p>
                        </div>
                        {lv.unlocked && <span style={{ color: '#4ECDC4', fontSize: '11px', fontWeight: 600 }}>已解锁</span>}
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === 'settings' && (
                  <div>
                    {settingsGroups.map((group) => (
                      <div key={group.title} className="mb-5">
                        <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px', fontWeight: 500, marginBottom: 8, display: 'block' }}>{group.title}</span>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item) => (
                            <button key={item.label} className="w-full flex items-center gap-3 p-3 text-left" style={{ background: '#574d72', borderRadius: 12 }}>
                              {item.icon}
                              <span className="flex-1" style={{ color: '#f5efe8', fontSize: '14px' }}>{item.label}</span>
                              {item.type === 'toggle' ? (
                                <div className="w-11 h-6 rounded-full p-0.5 cursor-pointer"
                                  style={{ background: darkToggle ? gradients.coral : 'rgba(245,239,232,0.15)' }}
                                  onClick={() => { const next = !darkToggle; setDarkToggle(next); localStorage.setItem('darkMode', String(next)); }}>
                                  <motion.div className="w-5 h-5 rounded-full" style={{ background: '#fff' }}
                                    animate={{ x: darkToggle ? 20 : 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  {item.value && <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>{item.value}</span>}
                                  <ChevronRight size={14} color="rgba(245,239,232,0.55)" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="w-full flex items-center justify-center gap-2 p-3 mt-2" style={{ background: 'rgba(255,138,128,0.08)', borderRadius: 12 }}>
                      <span style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 500 }}>退出登录</span>
                    </button>
                  </div>
                )}
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