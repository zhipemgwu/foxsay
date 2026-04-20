import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IcShield, gradients } from './CuteIcons';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { OnboardingChat } from './OnboardingChat';
import { SpeciesReveal } from './SpeciesReveal';
import { speciesAbilityHint } from '../data/onboardingChat';

const speciesNameMap: Record<string, string> = {
  laosihu: '老司狐', haiwanghu: '海王狐', tiantianhu: '舔舔狐', zhuangsihu: '装死狐',
  songsonghu: '怂怂狐', zhiwuhu: '植物狐', xiaochouhu: '小丑狐', lianfeihu: '恋废狐',
  caonihu: '草泥狐', lvchahu: '绿茶狐', xinjihu: '心机狐', beiweihu: '卑微狐',
};

/* ═══════════════════════════════════════════════════════════
   步骤进度 — 连续渐变条（不显示 N/M 数字）
   ═══════════════════════════════════════════════════════════ */
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="px-6 pt-14 pb-1">
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #FF8A80, #FFD93D, #9B7EDE)', boxShadow: '0 0 8px rgba(255,138,128,0.4)' }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   档案构建卡 — 随选择实时更新的 mini 标签行
   ═══════════════════════════════════════════════════════════ */
function ProfileBuildCard({ gender, age, goals }: { gender: string | null; age: string | null; goals: string[] }) {
  const genderEmoji = gender === 'male' ? '🤴' : gender === 'female' ? '👸' : null;
  const ageOpt = ageOptions.find(a => a.id === age);
  const items: { emoji: string; label: string }[] = [];
  if (genderEmoji) items.push({ emoji: genderEmoji, label: gender === 'male' ? '男生' : '女生' });
  if (ageOpt) items.push({ emoji: ageOpt.emoji, label: ageOpt.label });
  if (goals.length > 0) items.push({ emoji: '🎯', label: `×${goals.length}` });
  if (items.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1.5 px-6 pt-2 pb-1">
      <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>档案</span>
      {items.map((item, i) => (
        <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: i * 0.06 }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,138,128,0.1)', border: '1px solid rgba(255,138,128,0.2)' }}>
          <span style={{ fontSize: 12 }}>{item.emoji}</span>
          <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 600 }}>{item.label}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   主按钮 — 订阅式风格，与欢迎页按钮统一
   ═══════════════════════════════════════════════════════════ */
function PrimaryButton({ children, icon, enabled, onClick }: {
  children: React.ReactNode; icon?: React.ReactNode; enabled: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      className="w-full flex items-center relative overflow-hidden"
      style={{
        background: '#352f42',
        borderRadius: 24,
        height: 62,
        paddingLeft: 20,
        paddingRight: 20,
        opacity: enabled ? 1 : 0.5,
        cursor: enabled ? 'pointer' : 'not-allowed',
        transition: 'all 200ms ease-out',
      }}
      whileTap={enabled ? { scale: 0.97 } : {}}
      onClick={() => enabled && onClick()}
      aria-disabled={!enabled}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: gradients.coral }}>
        {icon || <ChevronRight size={20} color="#fff" />}
      </div>
      <span className="flex-1 text-center" style={{ color: '#f5efe8', fontSize: 16, fontWeight: 500 }}>
        {children}
      </span>
      <ChevronRight size={20} color="rgba(245,239,232,0.3)" className="flex-shrink-0" />
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   步骤大标题 — 居中 + 大 emoji + 渐变文字
   ═══════════════════════════════════════════════════════════ */
function StepTitle({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <motion.span
        style={{ fontSize: 56, filter: 'drop-shadow(0 4px 16px rgba(255,138,128,0.3))' }}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
      >
        {emoji}
      </motion.span>
      <motion.h2
        style={{
          fontSize: 28, fontWeight: 900, letterSpacing: '-0.3px', marginTop: 12,
          background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {title}
      </motion.h2>
      <motion.p
        style={{ color: 'rgba(245,239,232,0.5)', fontSize: 14, marginTop: 6, lineHeight: 1.5 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   数据定义
   ═══════════════════════════════════════════════════════════ */
type AuthView = 'welcome' | 'gender' | 'age' | 'goals' | 'phone' | 'verify' | 'chat' | 'reveal';

const genderOptions = [
  {
    key: 'male' as const,
    emoji: '🤴',
    label: '帅气男生',
    gradient: 'linear-gradient(135deg, #7C83ED, #9B7EDE)',
    glow: 'rgba(124,131,237,0.4)',
    bg: 'rgba(124,131,237,0.08)',
    activeBorder: 'rgba(124,131,237,0.6)',
  },
  {
    key: 'female' as const,
    emoji: '👸',
    label: '可爱女生',
    gradient: 'linear-gradient(135deg, #FF8A80, #EC407A)',
    glow: 'rgba(255,138,128,0.4)',
    bg: 'rgba(255,138,128,0.08)',
    activeBorder: 'rgba(236,64,122,0.6)',
  },
];

const ageOptions = [
  { id: '18-22', emoji: '🌱', label: '18-22', tag: '青春萌芽', color: '#4ECDC4', glow: 'rgba(78,205,196,0.3)' },
  { id: '23-27', emoji: '☀️', label: '23-27', tag: '热恋黄金期', color: '#FFD93D', glow: 'rgba(255,217,61,0.3)' },
  { id: '28-32', emoji: '🔥', label: '28-32', tag: '成熟魅力', color: '#FF8A80', glow: 'rgba(255,138,128,0.3)' },
  { id: '33-40', emoji: '🍷', label: '33-40', tag: '从容自信', color: '#9B7EDE', glow: 'rgba(155,126,222,0.3)' },
  { id: '40+',   emoji: '💎', label: '40+',   tag: '品味人生', color: '#7C83ED', glow: 'rgba(124,131,237,0.3)' },
];

const goalOptions = [
  { id: 'chat',    emoji: '💬', label: '聊天技巧', desc: '聊天不冷场' },
  { id: 'date',    emoji: '☕', label: '约会攻略', desc: '每次都完美' },
  { id: 'express', emoji: '💌', label: '表达情感', desc: '说出心里话' },
  { id: 'confess', emoji: '💝', label: '告白技巧', desc: '勇敢说爱你' },
  { id: 'social',  emoji: '🤝', label: '社交破冰', desc: '从此不尬聊' },
  { id: 'charm',   emoji: '✨', label: '魅力提升', desc: '自信发光体' },
];

/* ═══════════════════════════════════════════════════════════
   AuthScreen 主组件
   ═══════════════════════════════════════════════════════════ */
export function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const { updateUser, resetUserForNewAccount } = useUser();
  const [view, setView] = useState<AuthView>('welcome');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [rawPhone, setRawPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [revealData, setRevealData] = useState<{ speciesId: string; matchRate: number; tagsTopN: string[] } | null>(null);
  const [registered, setRegistered] = useState(false);

  /* 手机号 344 格式化 */
  const formatPhone = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}`;
  };
  const handlePhoneChange = (val: string) => setRawPhone(val.replace(/\D/g, '').slice(0, 11));
  const displayPhone = formatPhone(rawPhone);
  const maskedPhone = rawPhone.length >= 11 ? `${rawPhone.slice(0, 3)}****${rawPhone.slice(7)}` : rawPhone;
  const isValidPhone = /^1[3-9]\d{9}$/.test(rawPhone);
  const canSendOtp = isValidPhone && agreedTerms;
  const otpComplete = otp.every(d => d !== '');

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);
  const startCountdown = useCallback(() => setCountdown(60), []);

  useEffect(() => {
    if (view === 'verify') {
      const t = setTimeout(() => otpRefs.current[0]?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [view]);

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 0) return;
    e.preventDefault();
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = paste[i] || '';
    setOtp(next);
    otpRefs.current[Math.min(paste.length, 5)]?.focus();
  };
  const toggleGoal = (id: string) => setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  return (
    <div className="absolute inset-0 z-[50] flex flex-col" style={{ background: '#1a1626' }}>
      <div className="relative flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════ Welcome（玻璃拟态版） ═══════════════════════════ */}
          {view === 'welcome' && (
            <motion.div key="welcome" className="flex-1 flex flex-col relative overflow-hidden"
              style={{ background: '#1a1626' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}>

              {/* 背景动态光斑 */}
              <motion.div className="absolute pointer-events-none"
                style={{ top: -120, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,128,0.55) 0%, transparent 70%)', filter: 'blur(12px)' }}
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute pointer-events-none"
                style={{ top: 40, right: -100, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,126,222,0.55) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute pointer-events-none"
                style={{ bottom: 80, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.4) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, 25, 0], y: [0, -15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />

              {/* 噪点纹理 */}
              <div className="absolute inset-0 pointer-events-none" style={{
                opacity: 0.05,
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")',
              }} />

              {/* 内容容器 */}
              <div className="relative flex-1 flex flex-col px-6">
                {/* 品牌 */}
                <div className="flex flex-col items-center" style={{ marginTop: '14vh' }}>
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                    className="relative"
                    style={{
                      width: 104, height: 104, borderRadius: 32,
                      padding: 3,
                      background: 'linear-gradient(135deg, #FF8A80 0%, #FFD93D 50%, #9B7EDE 100%)',
                      boxShadow: '0 18px 44px rgba(255,138,128,0.45), 0 0 0 1px rgba(255,255,255,0.1)',
                    }}>
                    {/* inner halo ring */}
                    <div style={{
                      width: '100%', height: '100%', borderRadius: 29,
                      overflow: 'hidden',
                      background: '#fff',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src="/logo2.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* 外光晕 */}
                    <div className="absolute pointer-events-none" style={{
                      inset: -8, borderRadius: 36,
                      background: 'radial-gradient(circle, rgba(255,138,128,0.4) 0%, transparent 70%)',
                      filter: 'blur(10px)', zIndex: -1,
                    }} />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="text-center"
                    style={{ marginTop: 28, fontSize: 30, fontWeight: 700, color: '#f5efe8', lineHeight: 1.35, letterSpacing: '1px' }}>
                    练了再恋
                    <br />
                    <span style={{ background: 'linear-gradient(90deg,#FF8A80,#FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      有备而来
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="text-center"
                    style={{ marginTop: 14, color: 'rgba(245,239,232,0.55)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 300 }}>
                    AI 教练 · 物种鉴定 · 真实场景模拟
                    <br />
                    你的恋爱成长伙伴在这里 ✨
                  </motion.p>
                </div>

                {/* 按钮区 */}
                <motion.div className="mt-auto pb-2 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  {/* 主按钮 — 开始鉴定 */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setView('gender')}
                    className="w-full flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      height: 58, borderRadius: 20,
                      background: 'linear-gradient(135deg, #FF8A80 0%, #EC407A 100%)',
                      boxShadow: '0 12px 32px rgba(236,64,122,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                      color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '1px',
                    }}>
                    <span>开始恋爱物种鉴定 🦊</span>
                    <ChevronRight size={20} color="#fff" />
                  </motion.button>

                  {/* 已有账号登录 */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setView('phone')}
                    className="w-full flex items-center justify-center gap-1.5"
                    style={{ height: 44, color: 'rgba(245,239,232,0.45)', fontSize: 13, fontWeight: 500 }}>
                    已有账号？直接登录
                    <ChevronRight size={14} color="rgba(245,239,232,0.45)" />
                  </motion.button>

                  <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11, textAlign: 'center', lineHeight: 1.6, marginBottom: 6 }}>
                    继续即代表同意 <span style={{ color: 'rgba(255,138,128,0.85)' }}>《用户协议》</span> 与 <span style={{ color: 'rgba(255,138,128,0.85)' }}>《隐私政策》</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════ Step 1: 性别 ═══════════════════════════ */}
          {view === 'gender' && (
            <motion.div key="gender" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}>
              <StepProgress current={0} total={3} />
              <ProfileBuildCard gender={gender} age={age} goals={selectedGoals} />
              <div className="px-6 mb-1 flex items-center justify-between">
                <div />
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { updateUser({ gender, age, goals: selectedGoals }); onComplete(); }}>
                  <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 13 }}>跳过鉴定</span>
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col px-6">
                <StepTitle emoji="💫" title="你是？" subtitle="选择你的身份，开启专属恋爱之旅" />

                {/* 两列大卡片 */}
                <div className="flex gap-4 flex-1" style={{ maxHeight: 280 }}>
                  {genderOptions.map((g, idx) => {
                    const active = gender === g.key;
                    return (
                      <motion.button
                        key={g.key}
                        className="flex-1 flex flex-col items-center justify-center gap-3 rounded-3xl relative overflow-hidden"
                        style={{
                          background: active ? g.bg : '#352f42',
                          border: `2px solid ${active ? g.activeBorder : 'rgba(245,239,232,0.05)'}`,
                          boxShadow: active ? `0 8px 32px ${g.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : 'inset 0 1px 0 rgba(255,255,255,0.02)',
                          transition: 'all 0.3s ease',
                        }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setGender(g.key)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.08 }}
                      >
                        {/* 选中光晕 */}
                        {active && (
                          <motion.div className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ background: `radial-gradient(circle at 50% 40%, ${g.glow} 0%, transparent 70%)` }} />
                        )}

                        <motion.span
                          style={{ fontSize: 56, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
                          animate={active ? { scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] } : { scale: 1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {g.emoji}
                        </motion.span>
                        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.5px', color: active ? '#f5efe8' : 'rgba(245,239,232,0.45)' }}>
                          {g.label}
                        </span>

                        {active && (
                          <motion.div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: g.gradient }}
                            initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            <Check size={14} color="#fff" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <PrimaryButton enabled={!!gender} onClick={() => setView('age')}>继续</PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════ Step 2: 年龄 ═══════════════════════════ */}
          {view === 'age' && (
            <motion.div key="age" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}>
              <StepProgress current={1} total={3} />
              <ProfileBuildCard gender={gender} age={age} goals={selectedGoals} />
              <div className="px-6 mb-1">
                <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9, x: -4 }} onClick={() => setView('gender')}>
                  <ChevronLeft size={20} color="rgba(245,239,232,0.45)" />
                  <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 14 }}>返回</span>
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col px-6">
                <StepTitle emoji="🎂" title="你的年龄？" subtitle="帮你匹配同频的恋爱课程" />

                <div className="grid grid-cols-3 gap-3">
                  {ageOptions.map((a, idx) => {
                    const active = age === a.id;
                    return (
                      <motion.button
                        key={a.id}
                        className="flex flex-col items-center gap-2 py-5 rounded-2xl relative overflow-hidden"
                        style={{
                          background: active ? `${a.color}14` : '#352f42',
                          border: `1.5px solid ${active ? a.color : 'rgba(245,239,232,0.05)'}`,
                          boxShadow: active ? `0 4px 20px ${a.glow}` : 'none',
                          transition: 'all 0.25s ease',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAge(a.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.span
                          style={{ fontSize: 34, filter: active ? `drop-shadow(0 2px 8px ${a.glow})` : 'none' }}
                          animate={active ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {a.emoji}
                        </motion.span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: active ? a.color : 'rgba(245,239,232,0.55)' }}>
                          {a.label}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 500, color: active ? 'rgba(245,239,232,0.65)' : 'rgba(245,239,232,0.3)' }}>
                          {a.tag}
                        </span>

                        {active && (
                          <motion.div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: a.color }}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            <Check size={10} color="#fff" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <PrimaryButton enabled={!!age} onClick={() => setView('goals')}>继续</PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════ Step 3: 目标 ═══════════════════════════ */}
          {view === 'goals' && (
            <motion.div key="goals" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}>
              <StepProgress current={2} total={3} />
              <ProfileBuildCard gender={gender} age={age} goals={selectedGoals} />
              <div className="px-6 mb-1">
                <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9, x: -4 }} onClick={() => setView('age')}>
                  <ChevronLeft size={20} color="rgba(245,239,232,0.45)" />
                  <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 14 }}>返回</span>
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col px-6">
                <StepTitle emoji="🎯" title="你想提升什么？" subtitle="选择你最想突破的方向，可多选" />

                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((g, idx) => {
                    const active = selectedGoals.includes(g.id);
                    return (
                      <motion.button
                        key={g.id}
                        className="flex flex-col items-center gap-2 py-5 rounded-2xl relative overflow-hidden"
                        style={{
                          background: active ? 'rgba(255,138,128,0.1)' : '#352f42',
                          border: `1.5px solid ${active ? 'rgba(255,138,128,0.45)' : 'rgba(245,239,232,0.05)'}`,
                          boxShadow: active ? '0 4px 20px rgba(255,138,128,0.2)' : 'none',
                          transition: 'all 0.25s ease',
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleGoal(g.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <motion.span
                          style={{ fontSize: 36, filter: active ? 'drop-shadow(0 2px 8px rgba(255,138,128,0.3))' : 'none' }}
                          animate={active ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {g.emoji}
                        </motion.span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: active ? '#FF8A80' : 'rgba(245,239,232,0.55)' }}>
                          {g.label}
                        </span>
                        <span style={{ fontSize: 11, color: active ? 'rgba(245,239,232,0.55)' : 'rgba(245,239,232,0.28)' }}>
                          {g.desc}
                        </span>

                        {active && (
                          <motion.div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: gradients.coral }}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}>
                            <Check size={10} color="#fff" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <PrimaryButton enabled={selectedGoals.length > 0} onClick={() => {
                    updateUser({ gender, age, goals: selectedGoals });
                    setView('chat');
                  }}>
                    开始 AI 鉴定
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════ Phone 手机号（玻璃拟态版） ═══════════════════════════ */}
          {view === 'phone' && (
            <motion.div key="phone" className="flex-1 flex flex-col relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}>

              {/* 背景光斑 */}
              <motion.div className="absolute pointer-events-none"
                style={{ top: -100, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,128,0.5) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, -20, 0], y: [0, 25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute pointer-events-none"
                style={{ bottom: -80, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,126,222,0.4) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />

              <div className="relative pt-14 px-6 pb-2">
                <motion.button className="flex items-center justify-center"
                  whileTap={{ scale: 0.92 }} onClick={() => setView(revealData ? 'reveal' : 'welcome')}
                  style={{
                    width: 38, height: 38, borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                  <ChevronLeft size={20} color="rgba(245,239,232,0.7)" />
                </motion.button>
              </div>

              <div className="relative flex-1 flex flex-col px-6">
                {/* 标题区 */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 mb-7">
                  <div className="inline-flex items-center justify-center mb-3" style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}>
                    <span style={{ fontSize: 26 }}>📱</span>
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5efe8', letterSpacing: '0.5px' }}>{revealData ? '注册解锁完整报告' : '验证手机号'}</h2>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, marginTop: 6 }}>未注册的手机号将自动创建账号</p>
                </motion.div>

                {/* 玻璃输入卡 */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{
                    padding: 18, borderRadius: 22,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}>
                  <label style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 8 }}>
                    手机号
                  </label>
                  <div className="flex items-center gap-3">
                    <span style={{ color: 'rgba(245,239,232,0.7)', fontSize: 18, fontWeight: 600 }}>+86</span>
                    <div style={{ width: 1, height: 22, background: 'rgba(245,239,232,0.12)' }} />
                    <input
                      id="phone"
                      className="flex-1 outline-none bg-transparent"
                      style={{ color: '#f5efe8', fontSize: 19, fontWeight: 600, letterSpacing: '1.5px', caretColor: '#FF8A80' }}
                      type="tel"
                      value={displayPhone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="请输入 11 位手机号"
                      maxLength={13}
                      onKeyDown={e => { if (e.key === 'Enter' && canSendOtp) { startCountdown(); setView('verify'); } }}
                    />
                  </div>
                </motion.div>

                {/* 协议同意 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="flex items-start gap-2.5 mt-5 px-1">
                  <motion.button
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 18, height: 18, borderRadius: 6,
                      background: agreedTerms ? 'linear-gradient(135deg,#FF8A80,#EC407A)' : 'rgba(255,255,255,0.05)',
                      border: agreedTerms ? 'none' : '1.5px solid rgba(245,239,232,0.25)',
                      marginTop: 2,
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAgreedTerms(!agreedTerms)}>
                    {agreedTerms && <Check size={11} color="#fff" strokeWidth={3} />}
                  </motion.button>
                  <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, lineHeight: 1.55 }}>
                    我已阅读并同意 <span style={{ color: '#FF8A80' }}>《用户协议》</span> 和 <span style={{ color: '#FF8A80' }}>《隐私政策》</span>
                  </p>
                </motion.div>

                <div className="mt-auto mb-8">
                  <PrimaryButton enabled={canSendOtp} onClick={() => { startCountdown(); setView('verify'); }}>
                    发送验证码
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════ AI 鉴定对话 ═══════════════════════════ */}
          {view === 'chat' && (
            <motion.div key="chat" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <OnboardingChat
                onFinish={(result) => {
                  const ab = speciesAbilityHint[result.speciesId] || speciesAbilityHint.laosihu;
                  // 鉴定完成 = 最终提交 “新账号数据包”，在重置后写入鉴定结果 + 之前采集的选项
                  resetUserForNewAccount({
                    gender,
                    age,
                    goals: selectedGoals,
                    speciesId: result.speciesId,
                    speciesName: speciesNameMap[result.speciesId] || '老司狐',
                    speciesEmoji: '🦊',
                    matchRate: result.matchRate,
                    recommendedTags: result.tagsTopN,
                    abilityScores: ab,
                    onboardedAt: Date.now(),
                  });
                  setRevealData(result);
                  setView('reveal');
                }}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════ 鉴定揭晓 ═══════════════════════════ */}
          {view === 'reveal' && revealData && (
            <motion.div key="reveal" className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}>
              <SpeciesReveal
                speciesId={revealData.speciesId}
                matchRate={revealData.matchRate}
                tagsTopN={revealData.tagsTopN}
                locked={!registered}
                onEnter={onComplete}
                onRegister={() => setView('phone')}
                onSkip={onComplete}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════ OTP 验证（玻璃拟态版） ═══════════════════════════ */}
          {view === 'verify' && (
            <motion.div key="verify" className="flex-1 flex flex-col relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}>

              {/* 背景光斑 */}
              <motion.div className="absolute pointer-events-none"
                style={{ top: -80, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.4) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, 25, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute pointer-events-none"
                style={{ bottom: 100, right: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,128,0.45) 0%, transparent 70%)', filter: 'blur(10px)' }}
                animate={{ x: [0, -20, 0], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />

              <div className="relative pt-14 px-6 pb-2">
                <motion.button className="flex items-center justify-center"
                  whileTap={{ scale: 0.92 }} onClick={() => setView('phone')}
                  style={{
                    width: 38, height: 38, borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                  <ChevronLeft size={20} color="rgba(245,239,232,0.7)" />
                </motion.button>
              </div>

              <div className="relative flex-1 flex flex-col px-6">
                {/* 标题 */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 mb-7">
                  <div className="inline-flex items-center justify-center mb-3" style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}>
                    <span style={{ fontSize: 26 }}>🔐</span>
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5efe8', letterSpacing: '0.5px' }}>输入验证码</h2>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, marginTop: 6 }}>已发送至 <span style={{ color: 'rgba(245,239,232,0.85)' }}>{maskedPhone}</span></p>
                </motion.div>

                {/* 玻璃 OTP 卡片 */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{
                    padding: '22px 14px', borderRadius: 22,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}>
                  <div className="flex items-center justify-center gap-2.5">
                    {otp.map((d, i) => (
                      <motion.input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        className="text-center outline-none"
                        style={{
                          width: 44, height: 54,
                          background: d ? 'rgba(255,138,128,0.12)' : 'rgba(255,255,255,0.04)',
                          borderRadius: 14,
                          border: d ? '1.5px solid rgba(255,138,128,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
                          boxShadow: d ? '0 0 16px rgba(255,138,128,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                          color: '#f5efe8',
                          fontSize: 22,
                          fontWeight: 700,
                          caretColor: '#FF8A80',
                          transition: 'all 200ms ease-out',
                        }}
                        type="tel"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        aria-label={`验证码第${i + 1}位`}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center mt-5 gap-1">
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12.5 }}>没有收到？</span>
                    {countdown > 0 ? (
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 12.5 }}>{countdown}s 后重新发送</span>
                    ) : (
                      <button style={{ color: '#FF8A80', fontSize: 12.5, fontWeight: 600 }} onClick={startCountdown}>重新发送</button>
                    )}
                  </div>
                </motion.div>

                {/* 加密提示药丸 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="self-center flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(78,205,196,0.08)',
                    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(78,205,196,0.18)',
                  }}>
                  <IcShield size={14} color="#4ECDC4" />
                  <span style={{ color: 'rgba(78,205,196,0.9)', fontSize: 11.5, fontWeight: 500 }}>端到端加密保护</span>
                </motion.div>

                <div className="mt-auto mb-8">
                  <PrimaryButton icon={<Check size={20} color="#fff" strokeWidth={3} />} enabled={otpComplete} onClick={() => {
                    if (revealData) {
                      // 从鉴定揭晓页来的 → 注册后解锁完整报告
                      updateUser({ phone: rawPhone });
                      setRegistered(true);
                      setView('reveal');
                    } else {
                      // 老用户直接登录 → 进入主应用
                      updateUser({ phone: rawPhone });
                      onComplete();
                    }
                  }}>
                    确认验证
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FocusInput — 居中输入框
   ═══════════════════════════════════════════════════════════ */
function FocusInput({ id, label, value, onChange, placeholder, type = 'text', maxLength, onSubmit }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; maxLength?: number; onSubmit?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, fontWeight: 500, marginBottom: 8, display: 'block', textAlign: 'center' }}>
        {label}
      </label>
      <input
        id={id}
        className="w-full h-[54px] px-4 outline-none text-center"
        style={{
          background: focused ? 'rgba(255,138,128,0.06)' : '#352f42',
          borderRadius: 16,
          border: focused ? '1.5px solid rgba(255,138,128,0.4)' : '1.5px solid rgba(245,239,232,0.06)',
          boxShadow: focused ? '0 0 0 4px rgba(255,138,128,0.1)' : 'none',
          color: '#f5efe8',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '2px',
          caretColor: '#FF8A80',
          transition: 'all 200ms ease-out',
        }}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => { if (e.key === 'Enter' && onSubmit) onSubmit(); }}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-required
      />
    </div>
  );
}