import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcTrophy, IcBook, IcCalendar, IcHeart, IcStar, IcCrown, IcFire, IcChart, IcShield, IcLightbulb, IcTarget, IcSparkle, IcChat, IcPen, gradients } from './CuteIcons';
import { EmptyState } from './EmptyState';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Crown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SubscriptionManageSheet } from './SubscriptionManageSheet';
import { useSub } from './SubscriptionSheet';
import { SocialPage } from './SocialPage';
import { badgePool } from './SocialPage';
import { EquippedBadges } from './EquippedBadges';
import DeepSpeciesTest from './DeepSpeciesTest';
import { ChatTranslator } from './ChatTranslator';
import { RedFlagDetector } from './RedFlagDetector';
import { DatePlanner } from './DatePlanner';

const menuItems = [
  { icon: <IcTrophy size={16} color="#fff" />, bg: gradients.coral, label: '我的成就' },
  { icon: <IcBook size={16} color="#fff" />, bg: gradients.purple, label: '学习记录' },
  { icon: <IcShield size={16} color="#fff" />, bg: gradients.golden, label: '公众号' },
];

const achievementDefs = [
  { key: 'streak7',  icon: <IcFire size={24} color="#fff" />,    bg: gradients.coral,  title: '连续打卡1周',     desc: '恒心初现', need: (u: any, s: number) => s >= 7 },
  { key: 'chat10',   icon: <IcChat size={24} color="#fff" />,    bg: gradients.sky,    title: '完成10次AI对话',  desc: '对话达人', need: (u: any) => (u.achievements || 0) >= 10 },
  { key: 'xp100',    icon: <IcSparkle size={24} color="#fff" />, bg: gradients.golden, title: '获得100 XP',       desc: '初露锋芒', need: (u: any) => (u.xp || 0) >= 100 },
  { key: 'streak30', icon: <IcTrophy size={24} color="#fff" />,  bg: gradients.purple, title: '连续打卓30天',    desc: '恋爱学徒', need: (u: any, s: number) => s >= 30 },
  { key: 'skill80',  icon: <IcTarget size={24} color="#fff" />,  bg: gradients.mint,   title: '所有技能达到80+',   desc: '全面发展', need: (u: any) => {
    const a = u.abilityScores;
    return !!a && Object.values(a).every((v: any) => Number(v) >= 80);
  } },
  { key: 'rate95',   icon: <IcCrown size={24} color="#fff" />,   bg: gradients.rose,   title: '综合评分96+',      desc: '恋爱大师', need: (u: any) => (u.matchRate || 0) >= 96 },
];


const learningRecords = [
  { date: '今天', items: [{ title: 'AI 约会模拟 · 咖啡馆初见', xp: 50, time: '12分钟', icon: '☕', type: 'practice' }, { title: '每日话题训练', xp: 10, time: '3分钟', icon: '💬', type: 'daily' }] },
  { date: '昨天', items: [{ title: '深度倾听练习', xp: 45, time: '8分钟', icon: '👂', type: 'practice' }, { title: '阅读恋爱小贴士', xp: 10, time: '2分钟', icon: '📖', type: 'read' }] },
  { date: '4月12日', items: [{ title: '公园约会场景', xp: 50, time: '10分钟', icon: '🌳', type: 'practice' }] },
  { date: '4月11日', items: [{ title: '解锁成就：初心者', xp: 0, time: '', icon: '🏆', type: 'achievement' }, { title: '完成物种鉴定', xp: 30, time: '5分钟', icon: '🦊', type: 'milestone' }] },
  { date: '4月10日', items: [{ title: '首次登录FoxSay', xp: 100, time: '', icon: '🎉', type: 'milestone' }] },
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

type ModalType = 'achievements' | 'learning' | 'settings' | 'privileges' | 'publicAccount' | null;

export function ProfilePage({ onLogout, onPracticeAction }: { onLogout?: () => void; onPracticeAction?: (action: any) => void }) {
  const user = useUser();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const sub = useSub();
  const [showSocial, setShowSocial] = useState(false);
  const [showDeepTest, setShowDeepTest] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [bookedCount, setBookedCount] = useState(0);
  const [darkToggle, setDarkToggle] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
    return saved !== null ? saved === 'true' : true;
  });

  // 动态读取未读消息数量
  useEffect(() => {
    const refresh = () => {
      try {
        const ids: number[] = JSON.parse(localStorage.getItem('foxsay_booked_coaches') || '[]');
        setBookedCount(ids.length);
      } catch { setBookedCount(0); }
    };
    refresh();
    window.addEventListener('foxsay_coach_booked', refresh);
    window.addEventListener('foxsay_coach_unread_change', refresh);
    return () => {
      window.removeEventListener('foxsay_coach_booked', refresh);
      window.removeEventListener('foxsay_coach_unread_change', refresh);
    };
  }, []);

  // 打卡日历 —— 使用 UTC 日期避免时区问题 + localStorage 记录今日是否打卡
  const now = new Date();
  const todayDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthStartWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`;
  const checkInKey = `foxsay_checkin_${todayDateStr}`;
  const [checkedIn, setCheckedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(checkInKey) === '1';
  });
  const [justChecked, setJustChecked] = useState(false);
  // 真实连续打卡 — 从 localStorage 本月记录统计
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const isToday = day === todayDay;
    const isPast = day < todayDay;
    const dayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayKey = `foxsay_checkin_${dayStr}`;
    const past = isPast && typeof window !== 'undefined' && localStorage.getItem(dayKey) === '1';
    return { day, active: past || (isToday && checkedIn), today: isToday };
  });
  const streakDays = calendarDays.filter(d => d.active).length;

  // 新用户判断 + 动态 badge
  const isNewUser = !user.xp && !user.achievements;
  const hasSpecies = !!user.speciesId;
  const unlockedAchievements = achievementDefs.filter(a => a.need(user, streakDays)).length;
  const menuBadges: Record<string, string> = {
    '我的成就': unlockedAchievements > 0 ? String(unlockedAchievements) : '',
  };
  const activeLearningRecords = isNewUser ? [] : learningRecords;
  const activeCollections = isNewUser ? [] : [
    { title: '咖啡馆搭讪技巧', type: '练习', time: '3天前' },
    { title: '约会前的准备清单', type: '文章', time: '5天前' },
    { title: '开场白大全', type: '话术', time: '1周前' },
    { title: '如何读懂对方的暗示', type: '文章', time: '1周前' },
    { title: '浪漫晚餐模拟', type: '练习', time: '2周前' },
    { title: '共情式回应模板', type: '话术', time: '3周前' },
  ];
  const checkTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(checkTimerRef.current), []);
  const handleCheckIn = () => {
    if (checkedIn) return;
    localStorage.setItem(checkInKey, '1');
    setCheckedIn(true);
    setJustChecked(true);
    clearTimeout(checkTimerRef.current);
    checkTimerRef.current = window.setTimeout(() => setJustChecked(false), 1800);
  };

  const frameColorMap: Record<string, string> = { default: 'rgba(155,126,222,0.4)', flame: '#FF8A80', ocean: '#4ECDC4', golden: '#FFD93D', rainbow: '#E040FB', sakura: '#F48FB1' };
  const frameColor = frameColorMap[user.avatarFrame] || frameColorMap.default;

  const menuActions: Record<string, ModalType> = {
    '我的成就': 'achievements', '学习记录': 'learning',
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

        {/* VIP 边框包裹的个人信息卡 */}
        <motion.div className="mb-6 overflow-hidden relative"
          style={{ borderRadius: 18, padding: user.isVip ? 2 : 0, background: user.isVip ? 'linear-gradient(135deg, rgba(155,126,222,0.5), rgba(255,217,61,0.3), rgba(155,126,222,0.3), rgba(255,217,61,0.4))' : 'transparent' }}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          {/* VIP 流光动画 */}
          {user.isVip && (
            <motion.div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 18, background: 'linear-gradient(90deg, transparent 0%, rgba(255,217,61,0.2) 25%, rgba(155,126,222,0.25) 50%, rgba(255,217,61,0.2) 75%, transparent 100%)', backgroundSize: '200% 100%' }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
          )}
          <div className="p-5 relative overflow-hidden" style={{ background: '#352f45', borderRadius: user.isVip ? 16 : 18 }}>
            <div className="absolute top-0 right-0 pointer-events-none" style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,126,222,0.12) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
            }} />
            {/* VIP 角标 */}
            {user.isVip && (
              <div className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1" style={{ background: 'linear-gradient(135deg, rgba(155,126,222,0.3), rgba(255,217,61,0.15))', borderRadius: '0 16px 0 12px' }}>
                <IcCrown size={10} color="#FFD93D" />
                <span style={{ color: '#FFD93D', fontSize: 9, fontWeight: 700 }}>{(user as any).subTier === 'proplus' ? 'PRO+' : (user as any).subTier === 'pro' ? 'PRO' : 'Lite'}</span>
              </div>
            )}
            {/* 头像 + 信息区 */}
            <div className="flex items-center gap-4 mb-3">
              {/* 头像 — 点击前往社交主页 */}
              <motion.button className="flex-shrink-0 relative" style={{ width: 64, height: 64 }} whileTap={{ scale: 0.95 }} onClick={() => setShowSocial(true)}>
                <div className="absolute avatar-glow-ring" style={{ top: 0, left: 0, width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${frameColor}, ${frameColor}88)`, opacity: 0.4, transition: 'background 0.4s ease' }} />
                <div className="absolute rounded-full overflow-hidden" style={{ top: 5, left: 5, width: 54, height: 54, border: `2px solid ${frameColor}`, boxShadow: `0 0 12px ${frameColor}40`, transition: 'all 0.4s ease' }}>
                  <ImageWithFallback src="/avatars/face5.webp" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <img src="/avatar-frame.png" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 64, height: 64, pointerEvents: 'none' }} />
                {/* 性别小徽章 — 柔和 */}
                {user.gender && (
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      bottom: 1, right: 1,
                      width: 16, height: 16, borderRadius: '50%',
                      background: user.gender === 'male'
                        ? 'rgba(100,181,246,0.85)'
                        : 'rgba(244,143,177,0.85)',
                      border: '1.5px solid #2b2535',
                      fontSize: 9,
                      color: '#fff',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                    aria-label={user.gender === 'male' ? '男生' : '女生'}
                  >
                    {user.gender === 'male' ? '♂' : '♀'}
                  </div>
                )}
              </motion.button>
              <div className="flex-1 min-w-0">
                {/* 第一行：名字 + 修改图标 */}
                <div className="flex items-center gap-2">
                  {editingName ? (
                    <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); user.updateUser({ name: nameInput.trim() || user.name }); setEditingName(false); }}>
                      <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)}
                        className="bg-transparent outline-none" style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700, width: 100, borderBottom: '1.5px solid rgba(155,126,222,0.5)', padding: '0 0 2px' }}
                        onBlur={() => { user.updateUser({ name: nameInput.trim() || user.name }); setEditingName(false); }} />
                      <motion.button type="submit" whileTap={{ scale: 0.9 }} className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.2)' }}>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#B39DDB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </motion.button>
                    </form>
                  ) : (
                    <>
                      <h2 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700, margin: 0 }}>{user.name}</h2>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setNameInput(user.name); setEditingName(true); }}
                        className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,239,232,0.06)' }}>
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                          <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" stroke="rgba(245,239,232,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.button>
                    </>
                  )}
                </div>
                {/* 第二行：关注 / 被关注 */}
                <div className="flex items-center gap-3 mt-1.5">
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12 }}><span style={{ color: 'rgba(245,239,232,0.8)', fontWeight: 700 }}>{user.following ?? 0}</span> 关注</span>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12 }}><span style={{ color: 'rgba(245,239,232,0.8)', fontWeight: 700 }}>{user.followers ?? 0}</span> 被关注</span>
                </div>
              </div>
            </div>
            {/* 第三行：立体勋章（SOUL 风格）+ Lv / 物种 扁平标签 */}
            <div className="flex flex-col gap-2">
              <EquippedBadges
                ids={Array.isArray((user as any).equippedBadges) ? (user as any).equippedBadges : []}
                size="sm"
                onClick={() => setShowSocial(true)}
              />
              <div className="flex items-center gap-2 flex-wrap">
                <motion.button className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(155,126,222,0.1)', borderRadius: 6, border: '1px solid rgba(155,126,222,0.15)' }}
                  whileTap={{ scale: 0.95 }} onClick={() => setActiveModal('privileges')}>
                  <IcSparkle size={9} color="#B39DDB" />
                  <span style={{ color: '#B39DDB', fontSize: 10, fontWeight: 600 }}>Lv.{user.level} {user.title}</span>
                </motion.button>
                {hasSpecies ? (
                  <>
                    <span className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(255,138,128,0.1)', borderRadius: 6, border: '1px solid rgba(255,138,128,0.12)' }}>
                      <span style={{ fontSize: 10 }}>{user.speciesEmoji}</span>
                      <span style={{ color: '#FF8A80', fontSize: 10, fontWeight: 600 }}>{user.speciesName}</span>
                    </span>
                  </>
                ) : (
                  <motion.button className="flex items-center gap-1 px-2.5 py-1" style={{ background: 'linear-gradient(135deg, rgba(255,138,128,0.15), rgba(124,77,255,0.15))', borderRadius: 8, border: '1px solid rgba(255,138,128,0.2)' }}
                    whileTap={{ scale: 0.95 }} onClick={() => setShowDeepTest(true)}>
                    <span style={{ fontSize: 11 }}>🧬</span>
                    <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 600 }}>测一测你的恋爱物种</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* XP 晋级卡片 */}
        {(() => {
          const xp = user.xp || 0;
          const maxXp = 500;
          const percent = Math.min(100, Math.round((xp / maxXp) * 100));
          const remain = Math.max(0, maxXp - xp);
          const lv = user.level || 1;
          const rankOf = (l: number) => {
            if (l >= 21) return { rank: '恋爱大师', next: null as string | null };
            if (l >= 16) return { rank: '恋爱达人', next: '恋爱大师' };
            if (l >= 11) return { rank: '恋爱学徒', next: '恋爱达人' };
            if (l >= 6)  return { rank: '恋爱新手', next: '恋爱学徒' };
            return                { rank: '恋爱新生', next: '恋爱新手' };
          };
          const { rank, next } = rankOf(lv);
          return (
            <motion.div className="mb-4 overflow-hidden" style={{ borderRadius: 16, border: '1px solid rgba(245,239,232,0.08)' }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="p-5" style={{ background: '#352f45', borderRadius: 16 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconBubble size={24} bg={gradients.purple}><IcCrown size={12} color="#fff" /></IconBubble>
                    <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>Lv.{lv} {rank}</span>
                    {next && (
                      <>
                        <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>→</span>
                        <span style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 600 }}>{next}</span>
                      </>
                    )}
                  </div>
                  <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: '12px' }}>{xp}/{maxXp}</span>
                </div>
                <div className="w-full overflow-hidden" style={{ height: 6, borderRadius: 3, background: 'rgba(245,239,232,0.12)' }}>
                  <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #FF8A80, #FFB199)', borderRadius: 3 }}
                    initial={{ width: '0%' }} animate={{ width: `${percent}%` }} transition={{ duration: 1, delay: 0.3 }} />
                </div>
                <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', marginTop: 10 }}>
                  {next
                    ? <>再获得 <span style={{ color: '#f5efe8', fontWeight: 600 }}>{remain} XP</span> 即可晋级</>
                    : <>已达顶级段位 🎉</>}
                </p>
              </div>
            </motion.div>
          );
        })()}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {(() => {
            const abilityVals = user.abilityScores ? Object.values(user.abilityScores).map((v: any) => Number(v) || 0) : [];
            const overallScore = abilityVals.length ? Math.round(abilityVals.reduce((a, b) => a + b, 0) / abilityVals.length) : 0;
            return [
              { n: user.achievements || 0, l: '已完成', icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint },
              { n: overallScore,            l: '综合分', icon: <IcChart size={16} color="#fff" />, bg: gradients.coral },
              { n: streakDays,              l: '连续天', icon: <IcFire size={16} color="#fff" />, bg: gradients.golden },
            ];
          })().map((s, i) => (
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
              whileTap={{ scale: 0.98 }} onClick={() => {
                if (item.label === '公众号') { setActiveModal('publicAccount'); return; }
                setActiveModal(menuActions[item.label] || null);
              }}>
              <IconBubble size={36} bg={item.bg}>{item.icon}</IconBubble>
              <span className="flex-1" style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{item.label}</span>
              {menuBadges[item.label] && <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', marginRight: 4 }}>{menuBadges[item.label]}</span>}
              <ChevronRight size={14} color="rgba(245,239,232,0.34)" strokeWidth={2} />
            </motion.button>
            </div>
          ))}
        </div>

        {/* 妙妙工具 */}
        <div className="mt-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="flex items-center gap-3 p-4 text-left"
              style={{ background: '#453a60', borderRadius: 14, minWidth: 0 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => onPracticeAction?.({ type: 'openSos' })}
            >
              <IconBubble size={42} bg={gradients.rose}><IcShield size={20} color="#fff" /></IconBubble>
              <div className="flex-1 min-w-0">
                <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>恋爱急诊室</span>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>遇到问题马上问</span>
              </div>
            </motion.button>
            <ChatTranslator delay={0.06} />
            <RedFlagDetector delay={0.1} />
            <DatePlanner delay={0.14} />
          </div>
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
                  {{ achievements: '我的成就', learning: '学习记录', settings: '设置', privileges: '等级特权', publicAccount: '公众号' }[activeModal]}
                </span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveModal(null)}>
                  <X size={20} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>

              <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(80vh - 56px)' }}>
                {activeModal === 'achievements' && (() => {
                  const achievements = achievementDefs.map(a => ({
                    ...a,
                    unlocked: a.need(user, streakDays),
                  }));
                  const unlockedCount = achievements.filter(a => a.unlocked).length;
                  return (
                  <div>
                    <div className="flex items-center justify-between p-3 mb-4" style={{ background: 'rgba(255,138,128,0.08)', borderRadius: 12, border: '1px solid rgba(255,138,128,0.16)' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 18 }}>🏆</span>
                        <span style={{ color: '#FF8A80', fontSize: 13, fontWeight: 700 }}>已解锁 {unlockedCount} / {achievements.length}</span>
                      </div>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>{unlockedCount === achievements.length ? '全部完成 🎉' : `还差 ${achievements.length - unlockedCount} 个`}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                    {achievements.map((a) => (
                      <div key={a.title} className="p-4 flex flex-col items-center text-center" style={{
                        background: a.unlocked ? '#453a60' : 'rgba(87,77,114,0.5)', borderRadius: 14,
                        opacity: a.unlocked ? 1 : 0.5,
                        border: a.unlocked ? '1px solid rgba(255,138,128,0.22)' : '1px solid transparent',
                      }}>
                        <IconBubble size={48} bg={a.unlocked ? a.bg : 'rgba(87,77,114,0.6)'}>{a.icon}</IconBubble>
                        <p style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600, marginBottom: 2, marginTop: 8 }}>{a.title}</p>
                        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{a.desc}</p>
                        {a.unlocked
                          ? <span style={{ color: '#4ECDC4', fontSize: '10px', marginTop: 4, fontWeight: 600 }}>✓ 已解锁</span>
                          : <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: '10px', marginTop: 4 }}>未解锁</span>}
                      </div>
                    ))}
                    </div>
                  </div>
                  );
                })()}

                {activeModal === 'learning' && (
                  <div className="flex flex-col gap-1">
                    {/* 累计经验统计 */}
                    <div className="flex items-center justify-between p-3 mb-4" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 12, border: '1px solid rgba(255,217,61,0.12)' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>累计获得 {user.xp || 0} XP</span>
                      </div>
                      <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>共 {activeLearningRecords.reduce((a, d) => a + d.items.length, 0)} 条记录</span>
                    </div>
                    {activeLearningRecords.length === 0 ? (
                      <div className="py-10 text-center" style={{ color: 'rgba(245,239,232,0.4)', fontSize: 13 }}>还没有学习记录，开始你的第一次练习吧！</div>
                    ) : (
                    activeLearningRecords.map((day, di) => (
                      <div key={day.date} className="relative">
                        {/* 日期标签 */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: di === 0 ? '#FF8A80' : 'rgba(245,239,232,0.25)' }} />
                          <span style={{ color: di === 0 ? '#FF8A80' : 'rgba(245,239,232,0.5)', fontSize: 13, fontWeight: 600 }}>{day.date}</span>
                          {di === 0 && <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 4, color: '#FF8A80', fontSize: 9, fontWeight: 600 }}>TODAY</span>}
                        </div>
                        {/* 时间线 items */}
                        <div className="ml-1 pl-4 flex flex-col gap-2 mb-4" style={{ borderLeft: `2px solid ${di === 0 ? 'rgba(255,138,128,0.25)' : 'rgba(245,239,232,0.08)'}` }}>
                          {day.items.map((item, i) => {
                            const isMilestone = item.type === 'milestone' || item.type === 'achievement';
                            return (
                              <motion.div key={i} className="flex items-center gap-3 p-3" style={{
                                background: isMilestone ? 'rgba(155,126,222,0.1)' : '#453a60',
                                borderRadius: 12,
                                border: isMilestone ? '1px solid rgba(155,126,222,0.2)' : '1px solid transparent',
                              }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: di * 0.1 + i * 0.05 }}>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{
                                  background: isMilestone ? 'rgba(155,126,222,0.2)' : 'rgba(255,138,128,0.12)',
                                }}>
                                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p style={{ color: '#f5efe8', fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{item.title}</p>
                                  {item.time && <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>{item.time}</span>}
                                </div>
                                {item.xp > 0 && (
                                  <span className="px-2 py-0.5 flex-shrink-0" style={{ background: 'rgba(255,217,61,0.18)', borderRadius: 6, color: '#FFD93D', fontSize: 12, fontWeight: 600 }}>+{item.xp}</span>
                                )}
                                {item.type === 'achievement' && (
                                  <span className="px-2 py-0.5 flex-shrink-0" style={{ background: 'rgba(155,126,222,0.15)', borderRadius: 6, color: '#B39DDB', fontSize: 11, fontWeight: 600 }}>🎖️</span>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                    )}
                  </div>
                )}

                {activeModal === 'publicAccount' && (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="mb-4" style={{
                      width: 200, height: 200, borderRadius: 16,
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    }}>
                      {/* 占位二维码 */}
                      <div style={{
                        width: 160, height: 160,
                        background: 'repeating-conic-gradient(#111 0% 25%, #fff 0% 50%) 50% / 20px 20px',
                        borderRadius: 8,
                      }} />
                    </div>
                    <p style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>扫码关注「老司狐 FoxSay」</p>
                    <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, lineHeight: 1.6, maxWidth: 280 }}>
                      关注公众号获取独家恋爱技巧、导师直播预告、新功能抢先体验。
                    </p>
                    <motion.button
                      className="mt-5 px-6 py-2.5"
                      style={{ background: gradients.golden, borderRadius: 10, color: '#2b2535', fontSize: 13, fontWeight: 700 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { navigator.clipboard?.writeText('老司狐FoxSay'); }}
                    >
                      复制公众号名称
                    </motion.button>
                  </div>
                )}

                {activeModal === 'privileges' && (
                  <div>
                    <div className="text-center mb-5">
                      <IconBubble size={56} bg={gradients.purple} className="mx-auto mb-3"><IcCrown size={26} color="#fff" /></IconBubble>
                      <p style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>Lv.{user.level} {user.title}</p>
                      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '13px', marginTop: 4 }}>{user.xp}/500 XP · 距离下一级还需 {Math.max(0, 500 - (user.xp || 0))} XP</p>
                    </div>

                    {/* 恋爱段位可视化 */}
                    <div className="mb-5 p-4" style={{ background: '#453a60', borderRadius: 16 }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span style={{ fontSize: 14 }}>🏆</span>
                        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>恋爱段位</span>
                      </div>
                      {(() => {
                        const lv = user.level || 1;
                        const ladder = [
                          { rank: '恋爱大师', level: 'Lv.21+', min: 21, emoji: '👑', color: '#FFD93D', bg: gradients.golden, perks: '导师身份 · 社区特权 · 专属定制' },
                          { rank: '恋爱达人', level: 'Lv.16-20', min: 16, emoji: '💎', color: '#B39DDB', bg: gradients.purple, perks: '专属场景 · 个性化建议' },
                          { rank: '恋爱学徒', level: 'Lv.11-15', min: 11, emoji: '🔥', color: '#FF8A80', bg: gradients.coral, perks: '全部练习 · AI深度点评' },
                          { rank: '恋爱新手', level: 'Lv.6-10', min: 6, emoji: '🌱', color: '#4ECDC4', bg: gradients.mint, perks: '进阶练习 · AI基础点评' },
                          { rank: '恋爱新生', level: 'Lv.1-5', min: 1, emoji: '🐣', color: '#81D4FA', bg: gradients.sky, perks: '基础练习场景' },
                        ];
                        // 找当前段位索引（数组从高到低）
                        const currentIdx = ladder.findIndex(r => lv >= r.min);
                        return ladder.map((r, i) => {
                          const unlocked = i >= currentIdx;
                          const current = i === currentIdx;
                          return (
                        <div key={i} className="relative flex items-center gap-3 mb-1">
                          {/* 进度指示线 */}
                          {i < 4 && (
                            <div className="absolute" style={{
                              left: 19, top: 40, width: 2, height: 28,
                              background: unlocked && i < currentIdx ? 'rgba(245,239,232,0.15)' : unlocked ? `${r.color}40` : 'rgba(245,239,232,0.08)',
                            }} />
                          )}
                          <div className="flex-shrink-0 flex items-center justify-center" style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: current ? r.bg : unlocked ? `${r.color}18` : 'rgba(245,239,232,0.06)',
                            border: current ? `2px solid ${r.color}60` : '2px solid transparent',
                            fontSize: current ? 20 : 16,
                            opacity: unlocked ? 1 : 0.45,
                            boxShadow: current ? `0 0 16px ${r.color}30` : 'none',
                            zIndex: 2,
                          }}>
                            {r.emoji}
                          </div>
                          <div className="flex-1 py-2.5">
                            <div className="flex items-center gap-2">
                              <span style={{ color: current ? r.color : unlocked ? '#f5efe8' : 'rgba(245,239,232,0.45)', fontSize: 13, fontWeight: current ? 700 : 600 }}>
                                {r.rank}
                              </span>
                              <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10, fontWeight: 600 }}>{r.level}</span>
                              {current && (
                                <span className="px-1.5 py-0.5" style={{ background: `${r.color}20`, borderRadius: 4, color: r.color, fontSize: 9, fontWeight: 700 }}>当前</span>
                              )}
                            </div>
                            <span style={{ color: unlocked ? 'rgba(245,239,232,0.45)' : 'rgba(245,239,232,0.25)', fontSize: 10, marginTop: 1, display: 'block' }}>
                              {r.perks}
                            </span>
                          </div>
                          {unlocked && !current && (
                            <span style={{ color: '#4ECDC4', fontSize: 10, fontWeight: 600 }}>✓</span>
                          )}
                          {!unlocked && (
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="11" width="18" height="11" rx="2" stroke="rgba(245,239,232,0.25)" strokeWidth="1.5" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="rgba(245,239,232,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                          );
                        });
                      })()}
                    </div>

                    {/* 当前进度详情 */}
                    {(() => {
                      const lv = user.level || 1;
                      const xp = user.xp || 0;
                      const nextRank = lv >= 21 ? null : lv >= 16 ? '恋爱大师' : lv >= 11 ? '恋爱达人' : lv >= 6 ? '恋爱学徒' : '恋爱新手';
                      const pct = Math.min(100, Math.round((xp / 500) * 100));
                      const remain = Math.max(0, 500 - xp);
                      return (
                    <div className="p-3 flex items-center gap-3" style={{ background: 'rgba(255,138,128,0.08)', borderRadius: 12, border: '1px solid rgba(255,138,128,0.12)' }}>
                      <span style={{ fontSize: 22 }}>🔥</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>
                            {nextRank ? `距离「${nextRank}」` : '已达顶级段位'}
                          </span>
                          <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 700 }}>{nextRank ? `${pct}%` : '🎉'}</span>
                        </div>
                        <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.1)' }}>
                          <motion.div className="h-full" style={{ background: gradients.coral, borderRadius: 2 }}
                            initial={{ width: 0 }} animate={{ width: `${nextRank ? pct : 100}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                        </div>
                        <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, marginTop: 2, display: 'block' }}>
                          {nextRank ? `还需 ${remain} XP 即可晋级` : '恭喜你！已解锁全部段位'}
                        </span>
                      </div>
                    </div>
                      );
                    })()}
                  </div>
                )}

                {activeModal === 'settings' && (
                  <div>
                    {settingsGroups.map((group) => (
                      <div key={group.title} className="mb-5">
                        <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px', fontWeight: 500, marginBottom: 8, display: 'block' }}>{group.title}</span>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item) => (
                            <button key={item.label} className="w-full flex items-center gap-3 p-3 text-left" style={{ background: '#453a60', borderRadius: 12 }}>
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
                    <button className="w-full flex items-center justify-center gap-2 p-3 mt-2" style={{ background: 'rgba(255,138,128,0.08)', borderRadius: 12 }}
                      onClick={() => onLogout?.()}>
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
        {showSocial && <SocialPage onClose={() => setShowSocial(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showDeepTest && <DeepSpeciesTest onClose={() => setShowDeepTest(false)} />}
      </AnimatePresence>
    </>
  );
}