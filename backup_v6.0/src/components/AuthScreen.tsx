import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IcHeartSpark, IcSparkle, IcShield, gradients } from './CuteIcons';
import { Eye, EyeOff, ChevronLeft, Check } from 'lucide-react';

type AuthView = 'welcome' | 'login' | 'register' | 'verify' | 'profile';

export function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [view, setView] = useState<AuthView>('welcome');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const canLogin = phone.length >= 11 && password.length >= 6;
  const canRegister = phone.length >= 11 && password.length >= 6 && agreedTerms;
  const otpComplete = otp.every(d => d !== '');
  const canFinishProfile = nickname.trim().length > 0 && gender !== null && selectedGoals.length > 0;

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const goals = [
    { id: 'chat', label: '聊天技巧', emoji: '💬' },
    { id: 'date', label: '约会攻略', emoji: '☕' },
    { id: 'express', label: '表达情感', emoji: '💌' },
    { id: 'listen', label: '学会倾听', emoji: '👂' },
    { id: 'confess', label: '告白技巧', emoji: '💝' },
    { id: 'social', label: '社交破冰', emoji: '🤝' },
  ];

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  return (
    <div className="absolute inset-0 z-[50] flex flex-col" style={{ background: '#2b2535' }}>
      <div className="relative flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {/* ─── Welcome ─── */}
          {view === 'welcome' && (
            <motion.div key="welcome" className="flex-1 flex flex-col px-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}>

              {/* Decorative bg */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 70% 35% at 50% 30%, rgba(255,138,128,0.08) 0%, transparent 70%)',
              }} />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 50% 25% at 30% 60%, rgba(155,126,222,0.10) 0%, transparent 60%)',
              }} />

              <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                {/* Logo */}
                <motion.div
                  className="relative mb-6"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-24 h-24 rounded-[28px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #FF8A80, #FF6B6B, #EC407A)', boxShadow: '0 12px 40px rgba(255,138,128,0.3)' }}>
                    <IcHeartSpark size={48} color="#fff" />
                  </div>
                  <motion.div className="absolute -top-2 -right-4"
                    animate={{ y: [0, -4, 0], rotate: [0, 15, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}>
                    <IcSparkle size={16} color="rgba(255,217,61,0.7)" />
                  </motion.div>
                  <motion.div className="absolute -bottom-1 -left-3"
                    animate={{ y: [0, -3, 0], rotate: [0, -12, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: 0.8 }}>
                    <IcSparkle size={11} color="rgba(155,126,222,0.55)" />
                  </motion.div>
                </motion.div>

                <h1 style={{
                  fontSize: '30px', fontWeight: 700, letterSpacing: '0.2px',
                  background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  marginBottom: 8,
                }}>The Love Lab</h1>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '15px', textAlign: 'center', lineHeight: 1.5 }}>
                  你的恋爱成长伙伴
                </p>
              </div>

              {/* Bottom CTA */}
              <div className="pb-10 flex flex-col gap-3">
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)', fontSize: '16px', fontWeight: 600, color: '#fff' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('register')}
                >
                  <IcHeartSpark size={18} color="#fff" />
                  创建账号
                </motion.button>
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,138,128,0.08)', fontSize: '16px', fontWeight: 500, color: '#FF8A80' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('login')}
                >
                  已有账号，登录
                </motion.button>

                {/* Social login */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-px" style={{ background: 'rgba(245,239,232,0.12)' }} />
                  <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px' }}>其他登录方式</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(245,239,232,0.12)' }} />
                </div>
                <div className="flex items-center justify-center gap-5 mt-2">
                  {[
                    { label: '微信', color: '#07C160', path: 'M20.6 12.3c0-4.1-4-7.4-8.6-7.4-4.9 0-8.6 3.3-8.6 7.4 0 3.8 3.4 7 7.8 7.4l.8.4.8-.2.2-.8c3.9-.3 7.6-3.2 7.6-6.8zM8.4 11a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2zm5.2 0a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z' },
                    { label: 'Apple', color: '#f5efe8', path: 'M17.05 12.54c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.73-1.35-.14-2.65.8-3.34.8-.7 0-1.77-.78-2.91-.76-1.49.02-2.87.87-3.64 2.22-1.56 2.7-.4 6.7 1.12 8.9.74 1.07 1.62 2.28 2.78 2.24 1.12-.04 1.54-.72 2.89-.72 1.34 0 1.73.72 2.9.7 1.2-.02 1.96-1.09 2.69-2.17.85-1.24 1.2-2.44 1.22-2.5-.03-.01-2.34-.9-2.36-3.57zM14.83 5.88c.62-.75 1.03-1.79.92-2.83-.89.04-1.97.59-2.6 1.34-.57.66-1.07 1.71-.94 2.72 1 .08 2.01-.5 2.62-1.23z' },
                    { label: 'QQ', color: '#12B7F5', path: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.5 14.5c-.4.2-1 .3-1.5.3h-4c-.5 0-1.1-.1-1.5-.3-.7-.3-.5-1 0-1.3.3-.2.7-.6 1-1-.2-.5-.5-1.5-.5-2.7 0-2 1.1-3.5 2.5-3.5h1c1.4 0 2.5 1.5 2.5 3.5 0 1.2-.3 2.2-.5 2.7.3.4.7.8 1 1 .5.3.7 1 0 1.3z' },
                  ].map(s => (
                    <motion.button key={s.label} className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(245,239,232,0.10)', border: '1px solid rgba(245,239,232,0.10)' }}
                      whileTap={{ scale: 0.9 }}>
                      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                        <path d={s.path} fill={s.color} />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Login ─── */}
          {view === 'login' && (
            <motion.div key="login" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}>
              <AuthHeader title="欢迎回来" subtitle="登录你的 Love Lab 账号" onBack={() => setView('welcome')} />
              <div className="flex-1 px-8 pt-6">
                <InputField label="手机号" value={phone} onChange={setPhone} placeholder="请输入11位手机号" type="tel" maxLength={11} />
                <div className="relative mt-5">
                  <InputField label="密码" value={password} onChange={setPassword} placeholder="请输入密码" type={showPwd ? 'text' : 'password'} />
                  <button className="absolute right-4" style={{ top: 38, padding: 8 }} onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={18} color="rgba(245,239,232,0.55)" /> : <Eye size={18} color="rgba(245,239,232,0.55)" />}
                  </button>
                </div>
                <button className="mt-3 ml-auto block" style={{ color: '#FF8A80', fontSize: '13px' }}>忘记密码？</button>
              </div>
              <div className="px-8 pb-10">
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center"
                  style={{
                    background: canLogin ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)' : '#574d72',
                    color: canLogin ? '#fff' : 'rgba(245,239,232,0.38)', fontSize: '16px', fontWeight: 600,
                  }}
                  whileTap={canLogin ? { scale: 0.97 } : {}}
                  onClick={() => canLogin && onComplete()}
                >
                  登录
                </motion.button>
                <p className="text-center mt-4">
                  <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>还没有账号？</span>
                  <button style={{ color: '#FF8A80', fontSize: '13px', fontWeight: 500, marginLeft: 4 }} onClick={() => setView('register')}>注册</button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── Register ─── */}
          {view === 'register' && (
            <motion.div key="register" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}>
              <AuthHeader title="创建账号" subtitle="开启你的恋爱成长之旅" onBack={() => setView('welcome')} />
              <div className="flex-1 px-8 pt-6 overflow-y-auto">
                <InputField label="手机号" value={phone} onChange={setPhone} placeholder="请输入11位手机号" type="tel" maxLength={11} />
                <div className="relative mt-5">
                  <InputField label="设置密码" value={password} onChange={setPassword} placeholder="至少6位密码" type={showPwd ? 'text' : 'password'} />
                  <button className="absolute right-4" style={{ top: 38, padding: 8 }} onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={18} color="rgba(245,239,232,0.55)" /> : <Eye size={18} color="rgba(245,239,232,0.55)" />}
                  </button>
                </div>
                {/* Password strength */}
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full" style={{
                        background: password.length >= (i + 1) * 3
                          ? i === 2 ? '#4ECDC4' : i === 1 ? '#FFD93D' : '#FF8A80'
                          : 'rgba(245,239,232,0.12)',
                      }} />
                    ))}
                    <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>
                      {password.length < 3 ? '弱' : password.length < 6 ? '中' : password.length < 9 ? '强' : '很强'}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 mt-6">
                  <motion.button
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: agreedTerms ? gradients.coral : 'transparent',
                      border: agreedTerms ? 'none' : '1.5px solid rgba(245,239,232,0.3)',
                    }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setAgreedTerms(!agreedTerms)}
                  >
                    {agreedTerms && <Check size={12} color="#fff" strokeWidth={3} />}
                  </motion.button>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px', lineHeight: 1.5 }}>
                    我已阅读并同意 <span style={{ color: '#FF8A80' }}>用户协议</span> 和 <span style={{ color: '#FF8A80' }}>隐私政策</span>
                  </p>
                </div>
              </div>
              <div className="px-8 pb-10">
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center gap-2"
                  style={{
                    background: canRegister ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)' : '#574d72',
                    color: canRegister ? '#fff' : 'rgba(245,239,232,0.38)', fontSize: '16px', fontWeight: 600,
                  }}
                  whileTap={canRegister ? { scale: 0.97 } : {}}
                  onClick={() => canRegister && setView('verify')}
                >
                  获取验证码
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── OTP Verify ─── */}
          {view === 'verify' && (
            <motion.div key="verify" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}>
              <AuthHeader title="验证手机号" subtitle={`验证码已发送至 ${phone.slice(0, 3)}****${phone.slice(7)}`} onBack={() => setView('register')} />
              <div className="flex-1 px-8 pt-10">
                <div className="flex items-center justify-center gap-3">
                  {otp.map((d, i) => (
                    <motion.input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      className="w-12 h-14 text-center outline-none"
                      style={{
                        background: d ? 'rgba(255,138,128,0.08)' : '#453a60',
                        borderRadius: 12,
                        border: d ? '1.5px solid rgba(255,138,128,0.35)' : '1.5px solid rgba(245,239,232,0.10)',
                        color: '#f5efe8',
                        fontSize: '22px',
                        fontWeight: 600,
                        caretColor: '#FF8A80',
                      }}
                      type="tel"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center mt-5 gap-1">
                  <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>没有收到？</span>
                  <button style={{ color: '#FF8A80', fontSize: '13px', fontWeight: 500 }}>重新发送</button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-8 p-3 rounded-xl" style={{ background: 'rgba(78,205,196,0.06)' }}>
                  <IcShield size={16} color="#4ECDC4" />
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>你的信息受到端到端加密保护</span>
                </div>
              </div>
              <div className="px-8 pb-10">
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center"
                  style={{
                    background: otpComplete ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)' : '#574d72',
                    color: otpComplete ? '#fff' : 'rgba(245,239,232,0.38)', fontSize: '16px', fontWeight: 600,
                  }}
                  whileTap={otpComplete ? { scale: 0.97 } : {}}
                  onClick={() => otpComplete && setView('profile')}
                >
                  验证
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── Profile Setup ─── */}
          {view === 'profile' && (
            <motion.div key="profile" className="flex-1 flex flex-col"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}>
              <AuthHeader title="完善资料" subtitle="帮助我们为你定制学习计划" onBack={() => setView('verify')} />
              <div className="flex-1 px-8 pt-6 overflow-y-auto">
                {/* Avatar placeholder */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center relative"
                    style={{ background: '#453a60', border: '2px dashed rgba(255,138,128,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span style={{ fontSize: '28px' }}>📷</span>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: gradients.coral }}>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: 700 }}>+</span>
                    </div>
                  </motion.div>
                </div>

                <InputField label="昵称" value={nickname} onChange={setNickname} placeholder="给自己取个名字吧" maxLength={12} />

                {/* Gender */}
                <div className="mt-5">
                  <label style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: 500, marginBottom: 8, display: 'block' }}>性别</label>
                  <div className="flex gap-3">
                    {[
                      { key: 'male' as const, label: '男生', emoji: '👦' },
                      { key: 'female' as const, label: '女生', emoji: '👧' },
                    ].map(g => (
                      <motion.button key={g.key} className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl"
                        style={{
                          background: gender === g.key ? 'rgba(255,138,128,0.1)' : '#453a60',
                          border: gender === g.key ? '1.5px solid rgba(255,138,128,0.35)' : '1.5px solid rgba(245,239,232,0.10)',
                          color: gender === g.key ? '#FF8A80' : 'rgba(245,239,232,0.58)',
                          fontSize: '14px', fontWeight: 500,
                        }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setGender(g.key)}
                      >
                        <span style={{ fontSize: '20px' }}>{g.emoji}</span>
                        {g.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="mt-6">
                  <label style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                    你想提升什么？<span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', marginLeft: 4 }}>可多选</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {goals.map(g => {
                      const active = selectedGoals.includes(g.id);
                      return (
                        <motion.button key={g.id} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
                          style={{
                            background: active ? 'rgba(255,138,128,0.1)' : '#453a60',
                            border: active ? '1.5px solid rgba(255,138,128,0.3)' : '1.5px solid rgba(245,239,232,0.08)',
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleGoal(g.id)}
                        >
                          <span style={{ fontSize: '22px' }}>{g.emoji}</span>
                          <span style={{ color: active ? '#FF8A80' : 'rgba(245,239,232,0.58)', fontSize: '12px', fontWeight: active ? 600 : 400 }}>{g.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="px-8 pb-10 pt-4">
                <motion.button
                  className="w-full h-[52px] rounded-full flex items-center justify-center gap-2"
                  style={{
                    background: canFinishProfile ? 'linear-gradient(135deg, #FF8A80, #FF6B6B)' : '#574d72',
                    color: canFinishProfile ? '#fff' : 'rgba(245,239,232,0.38)', fontSize: '16px', fontWeight: 600,
                  }}
                  whileTap={canFinishProfile ? { scale: 0.97 } : {}}
                  onClick={() => canFinishProfile && onComplete()}
                >
                  <IcHeartSpark size={18} color={canFinishProfile ? '#fff' : 'rgba(245,239,232,0.38)'} />
                  开始探索
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Shared Components ─── */

function AuthHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="pt-14 px-8 pb-2">
      <motion.button className="flex items-center gap-1 mb-6" whileTap={{ scale: 0.9, x: -4 }} onClick={onBack}>
        <ChevronLeft size={20} color="rgba(245,239,232,0.58)" />
        <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '14px' }}>返回</span>
      </motion.button>
      <h2 style={{ color: '#f5efe8', fontSize: '26px', fontWeight: 700, letterSpacing: '0px', marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '14px' }}>{subtitle}</p>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', maxLength }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; maxLength?: number;
}) {
  return (
    <div>
      <label style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: 500, marginBottom: 8, display: 'block' }}>{label}</label>
      <input
        className="w-full h-[52px] px-4 outline-none"
        style={{
          background: '#453a60',
          borderRadius: 14,
          border: '1.5px solid rgba(245,239,232,0.10)',
          color: '#f5efe8',
          fontSize: '15px',
          caretColor: '#FF8A80',
        }}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  );
}