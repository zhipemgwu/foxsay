/**
 * @file AssistKeyboardPage.tsx
 * @desc FoxSay 撩研所 — AI 辅助键盘 (原生已实现，此页仅用于:
 *         1) 功能展示
 *         2) 会员开通 / 续费
 *         3) 一键唤起原生键盘 (设置引导)
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Sparkles, Check, Crown, Zap, BookOpen, Wand2, Star,
  Flame, MessageCircle, RefreshCw, Keyboard, ChevronRight, X,
} from 'lucide-react';
import { IconBubble, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';
import { KB_PLANS, KbPlanKey, hasKeyboardAccess } from '../lib/keyboardSub';

// ============ 功能亮点（键盘定位：聊天中 3 秒即用） ============
const FEATURES = [
  {
    k: 'reply', icon: <Zap size={18} color="#fff" />, bg: gradients.coral,
    title: '一键回复',
    desc: '粘贴对方消息，3 秒出 3 条候选，选中直接发送',
    tags: ['8 种风格', '6 大情境', '一点即发'],
    demo: '"你在干嘛" → 暧昧 / 俏皮 / 正经 三选一',
  },
  {
    k: 'tone', icon: <Wand2 size={18} color="#fff" />, bg: gradients.purple,
    title: '语气改写',
    desc: '写完一句不确定？一键切换 5 种语气重写',
    tags: ['暧昧', '撒娇', '冷淡', '幽默', '正式'],
    demo: '"别烦我" → "我现在有点累，等等聊好吗"',
  },
  {
    k: 'cool', icon: <Flame size={18} color="#fff" />, bg: gradients.rose,
    title: '情绪降温',
    desc: '吵架时长按触发，把脏话狠话改成不伤人的表达',
    tags: ['吵架救场', '止损', '保护关系'],
    demo: '"你有病吧" → "我现在很生气，我们先冷静下"',
  },
  {
    k: 'probe', icon: <MessageCircle size={18} color="#fff" />, bg: gradients.sky,
    title: '追问引导',
    desc: '对方"随便""都行"时，3 句让 TA 继续说下去',
    tags: ['破冷场', '引话题', '不尬聊'],
    demo: '"随便" → "那我猜你想吃辣的？猜对请客"',
  },
  {
    k: 'drawer', icon: <BookOpen size={18} color="#fff" />, bg: gradients.golden,
    title: '话术抽屉',
    desc: '开场 / 邀约 / 哄人 / 道歉 精校短句，滑动即插入',
    tags: ['272+ 条', '场景分类', '一键插入'],
    demo: '情境选中 → 候选条滑入输入框',
  },
  {
    k: 'persona', icon: <Sparkles size={18} color="#fff" />, bg: gradients.mint,
    title: '搭档语气',
    desc: '用 FoxSay 剧情里任意搭档的语气发送消息',
    tags: ['独家 IP', '联动剧情', '人设同步'],
    demo: '切换「余水」→ 回复自带温柔清冷感',
  },
];

// ============ 用户点评 ============
const REVIEWS = [
  {
    name: '柠檬不酸', avatar: '柠', avatarBg: '#FF8A80', rating: 5,
    tag: '情绪降温 救命',
    text: '跟对象吵架差点分手，降温功能把我要发出去的狠话改了，缓了下来，后来和好了。',
  },
  {
    name: '盐焗小丸子', avatar: '丸', avatarBg: '#F5B87C', rating: 5,
    tag: '一键回复',
    text: '原来聊天我总是「嗯」「哦」，现在粘一下对方的话就出三条，想发哪条发哪条，聊起来顺多了。',
  },
  {
    name: '芒芒柚', avatar: '芒', avatarBg: '#FFD93D', rating: 5,
    tag: '追问引导',
    text: '追问功能真的救场，以前对方说「随便」我就没词了，现在能接着聊下去，氛围不会冷。',
  },
  {
    name: '海苔味饼干', avatar: '海', avatarBg: '#9575CD', rating: 4,
    tag: '搭档语气',
    text: '用余水的语气给朋友发消息，她问我是不是换人设了哈哈。独家感很强。',
  },
];

// 键盘会员独立定价——与 FoxSay 主会员解耦
const PLANS = KB_PLANS.map(p => ({
  k: p.key as KbPlanKey,
  label: p.label,
  price: p.price,
  unit: p.unit,
  original: p.original ?? null,
  tag: p.tag ?? null,
  highlight: !!p.highlight,
}));

// ============ 预览条 ============
const MINI_DEMO_SCRIPTS = [
  { cat: '开场破冰', color: '#FF8A80', t: '嗨～听说你也喜欢爬山，上次那张云海就是你拍的吗？角度绝了。' },
  { cat: '暧昧升温', color: '#F48FB1', t: '别看我了，再看我会误会，然后我可能真的会当真。' },
  { cat: '认错道歉', color: '#A5D6A7', t: '我反复想过，确实是我不对。不找借口，改的方案我做好了。' },
  { cat: '潜台词',   color: '#B39DDB', t: '"随便" → 不是真随便，是希望你拿主意。' },
];

interface Props { onClose: () => void; }

export function AssistKeyboardPage({ onClose }: Props) {
  const user = useUser() as any;
  // 键盘使用权：单独购买键盘会员 或 已开通 FFPro+
  const isPro = hasKeyboardAccess(user);
  const isProplusUnlock = user?.isVip && user?.subTier === 'proplus' && !user?.kbVip;
  const [selectedPlan, setSelectedPlan] = useState<KbPlanKey>('kb_year');
  const [showGuide, setShowGuide] = useState(false);
  const [toast, setToast] = useState('');
  const plansRef = useRef<HTMLDivElement>(null);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 1600); };
  const currentPlan = PLANS.find(p => p.k === selectedPlan) || PLANS[2];
  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCTA = () => {
    if (!isPro) {
      // 键盘会员独立付费——mock 付款成功后写回 UserContext
      const plan = KB_PLANS.find(p => p.key === selectedPlan);
      if (!plan) return;
      const expireAt = plan.durationDays >= 36500
        ? null
        : Date.now() + plan.durationDays * 24 * 60 * 60 * 1000;
      user.updateUser?.({ kbVip: true, kbPlan: selectedPlan, kbExpireAt: expireAt });
      flash('键盘会员已激活');
      setTimeout(() => setShowGuide(true), 700);
      return;
    }
    setShowGuide(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: '#2b2535' }}
      initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* 顶栏 */}
      <div style={{
        paddingTop: 'env(safe-area-inset-top, 44px)',
        background: 'linear-gradient(180deg, rgba(255,138,128,0.14) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(245,239,232,0.08)',
      }}>
        <div className="relative flex items-center px-2 h-12">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
            className="flex items-center justify-center"
            style={{ width: 44, height: 44 }}>
            <ChevronLeft size={26} color="#f5efe8" />
          </motion.button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Sparkles size={14} color="#FFD93D" />
            <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700, letterSpacing: 0.4 }}>撩研所 · 键盘</span>
          </div>
          <div style={{ width: 44 }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Hero */}
        <div className="relative px-5 pt-6 pb-5 overflow-hidden">
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: -60, right: -60, width: 220, height: 220, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,217,61,0.22) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 14 }}
          >
            <div className="relative flex items-center justify-center"
              style={{
                width: 88, height: 88, borderRadius: 22,
                background: 'linear-gradient(135deg, #FF8A80 0%, #F5B87C 55%, #FFD93D 100%)',
                boxShadow: '0 12px 36px rgba(255,138,128,0.45)',
              }}>
              <Keyboard size={40} color="#fff" strokeWidth={2} />
              <motion.div
                className="absolute -right-2 -top-2 flex items-center justify-center"
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg,#FFD93D,#FF8A80)', boxShadow: '0 4px 12px rgba(255,217,61,0.5)',
                }}
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={16} color="#fff" />
              </motion.div>
            </div>
          </motion.div>
          <h1 style={{ color: '#f5efe8', fontSize: 22, fontWeight: 800, textAlign: 'center', letterSpacing: 0.5 }}>
            FoxSay AI 辅助键盘
          </h1>
          <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 1.55 }}>
            3 秒，写出你在想的那句话<br />
            微信 / 小红书 / 探探 聊天中即用
          </p>

          {/* 状态徽章 */}
          <div className="flex items-center justify-center mt-4">
            {isPro ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,217,61,0.22), rgba(155,126,222,0.18))',
                  border: '1px solid rgba(255,217,61,0.4)', borderRadius: 999,
                }}>
                <Crown size={12} color="#FFD93D" />
                <span style={{ color: '#FFD93D', fontSize: 12, fontWeight: 600 }}>PRO 已激活 · 可唤起键盘</span>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={scrollToPlans}
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ background: 'rgba(245,239,232,0.06)', border: '1px solid rgba(245,239,232,0.12)', borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF8A80' }} />
                <span style={{ color: 'rgba(245,239,232,0.85)', fontSize: 12 }}>需开通键盘会员 · 点此查看</span>
                <ChevronRight size={11} color="rgba(245,239,232,0.5)" />
              </motion.button>
            )}
          </div>
        </div>

        {/* 键盘效果预览 */}
        <div className="px-5 mb-5">
          <div className="relative" style={{
            background: 'linear-gradient(180deg, #3d3354 0%, #352f45 100%)',
            borderRadius: 16, padding: 14, border: '1px solid rgba(245,239,232,0.06)',
          }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Keyboard size={13} color="#FFD93D" />
              <span style={{ color: 'rgba(245,239,232,0.85)', fontSize: 12, fontWeight: 600 }}>键盘效果预览</span>
              <span style={{
                fontSize: 9, color: '#FFD93D', border: '1px solid rgba(255,217,61,0.35)', padding: '1px 5px', borderRadius: 5,
                marginLeft: 'auto',
              }}>DEMO</span>
            </div>
            <div className="space-y-2">
              {MINI_DEMO_SCRIPTS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-2.5 px-2.5 py-2"
                  style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}
                >
                  <span style={{
                    flexShrink: 0, fontSize: 9.5, fontWeight: 700, color: s.color,
                    border: `1px solid ${s.color}55`, padding: '2px 6px', borderRadius: 4,
                    background: `${s.color}14`,
                  }}>{s.cat}</span>
                  <span style={{ color: 'rgba(245,239,232,0.82)', fontSize: 12, lineHeight: 1.5, flex: 1 }}>{s.t}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 功能亮点 */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>键盘能做什么</span>
            <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>{FEATURES.length} 项功能</span>
          </div>
          <div className="space-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.k}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: '#453a60', borderRadius: 12, padding: 12, border: '1px solid rgba(245,239,232,0.06)' }}
              >
                <div className="flex items-start gap-3">
                  <IconBubble size={38} bg={f.bg}>{f.icon}</IconBubble>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>{f.title}</p>
                    <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>{f.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {f.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 10, color: 'rgba(245,184,124,0.95)',
                          background: 'rgba(245,184,124,0.08)', border: '1px solid rgba(245,184,124,0.2)',
                          padding: '1px 6px', borderRadius: 4,
                        }}>{t}</span>
                      ))}
                    </div>
                    <p style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11, marginTop: 6, fontStyle: 'italic' }}>
                      例：{f.demo}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 定价 */}
        {!isPro && (
          <div className="px-5 mb-5" ref={plansRef}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>选择方案</span>
              <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>随时取消 · 支持退款</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PLANS.map((p, i) => {
                const active = selectedPlan === p.k;
                return (
                  <motion.button key={p.k}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedPlan(p.k)}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="relative p-3 text-left overflow-hidden"
                    style={{
                      borderRadius: 12,
                      background: active
                        ? 'linear-gradient(135deg, rgba(255,138,128,0.22), rgba(155,126,222,0.2))'
                        : '#453a60',
                      border: '1px solid ' + (active ? 'rgba(255,138,128,0.7)' : 'rgba(245,239,232,0.08)'),
                      boxShadow: active ? '0 0 0 2px #FF8A80, 0 8px 20px rgba(255,138,128,0.25)' : 'none',
                      transition: 'box-shadow 0.18s ease',
                    }}
                  >
                    {p.tag && (
                      <span style={{
                        position: 'absolute', top: 0, right: 0,
                        fontSize: 9.5, fontWeight: 700, color: '#1a1520',
                        background: p.highlight
                          ? 'linear-gradient(135deg,#FFD93D,#FF8A80)'
                          : 'linear-gradient(135deg,#B39DDB,#9575CD)',
                        padding: '2px 8px',
                        borderRadius: '0 11px 0 8px',
                      }}>{p.tag}</span>
                    )}
                    <p style={{ color: active ? '#f5efe8' : 'rgba(245,239,232,0.75)', fontSize: 13, fontWeight: 600 }}>{p.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span style={{ color: '#FFD93D', fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>¥{p.price}</span>
                      <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>/ {p.unit}</span>
                    </div>
                    {p.original && (
                      <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, textDecoration: 'line-through', marginTop: 2 }}>
                        原价 ¥{p.original}
                      </p>
                    )}
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute bottom-2 right-2 flex items-center justify-center"
                        style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF8A80' }}>
                        <Check size={11} color="#fff" strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* 用户点评 */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>用户怎么说</span>
            <div className="flex items-center gap-1">
              {[0,1,2,3,4].map(i => <Star key={i} size={11} color="#FFD93D" fill="#FFD93D" />)}
              <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: 11, marginLeft: 4 }}>4.9 · 12,847 条</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{
                  background: '#453a60', borderRadius: 12, padding: 12,
                  border: '1px solid rgba(245,239,232,0.06)',
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 32, height: 32, borderRadius: '50%', background: r.avatarBg,
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>{r.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ color: '#f5efe8', fontSize: 12.5, fontWeight: 600 }}>{r.name}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, j) => (
                          <Star key={j} size={10} color="#FFD93D" fill="#FFD93D" />
                        ))}
                      </div>
                      <span style={{
                        fontSize: 9.5, color: '#F5B87C',
                        background: 'rgba(245,184,124,0.12)', border: '1px solid rgba(245,184,124,0.3)',
                        padding: '1px 6px', borderRadius: 4, marginLeft: 'auto',
                      }}>{r.tag}</span>
                    </div>
                    <p style={{ color: 'rgba(245,239,232,0.72)', fontSize: 12, lineHeight: 1.55 }}>{r.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ height: 140 }} />
      </div>

      {/* 底部固定 CTA */}
      <div style={{
        borderTop: '1px solid rgba(245,239,232,0.08)',
        background: 'rgba(43,37,53,0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        padding: '12px 16px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 10px)',
      }}>
        {!isPro && (
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12 }}>当前选择：</span>
            <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{currentPlan.label}</span>
            <span style={{ color: '#FFD93D', fontSize: 15, fontWeight: 800, marginLeft: 4 }}>¥{currentPlan.price}</span>
          </div>
        )}
        {isProplusUnlock && (
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Crown size={12} color="#FFD93D" />
            <span style={{ color: '#FFD93D', fontSize: 11.5, fontWeight: 600 }}>FFPro+ 会员已包含键盘所有功能</span>
          </div>
        )}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleCTA}
          className="w-full flex items-center justify-center gap-2"
          style={{
            height: 48,
            background: isPro
              ? 'linear-gradient(135deg,#A5D6A7 0%,#81C784 100%)'
              : 'linear-gradient(135deg,#FF8A80 0%,#F5B87C 50%,#FFD93D 100%)',
            borderRadius: 14,
            color: isPro ? '#1f3a22' : '#fff',
            fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
            boxShadow: isPro
              ? '0 8px 24px rgba(165,214,167,0.35)'
              : '0 8px 24px rgba(255,138,128,0.4)',
          }}
        >
          {isPro ? (
            <><Keyboard size={17} /> 唤起 FoxSay 键盘</>
          ) : (
            <><Crown size={16} /> 开通键盘会员 · 立即解锁</>
          )}
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 bottom-28 -translate-x-1/2 px-4 py-2 flex items-center gap-2"
            style={{ background: 'rgba(60,50,80,0.95)', borderRadius: 999, border: '1px solid rgba(245,239,232,0.12)', zIndex: 1002 }}>
            <Check size={14} color="#A5D6A7" />
            <span style={{ color: '#f5efe8', fontSize: 12 }}>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 引导弹窗 — Pro 已开通后点 CTA 打开 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            className="fixed inset-0 z-[1100] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full"
              style={{
                background: '#352f45', borderRadius: '20px 20px 0 0',
                padding: '20px 20px calc(env(safe-area-inset-bottom, 14px) + 16px)',
                maxWidth: 430,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>开启 FoxSay 键盘</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowGuide(false)}
                  aria-label="关闭"
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="rgba(245,239,232,0.5)" />
                </motion.button>
              </div>
              <ol style={{ color: 'rgba(245,239,232,0.78)', fontSize: 13, lineHeight: 1.8, paddingLeft: 18 }}>
                <li>打开「系统设置 → 键盘 → 键盘」</li>
                <li>添加「FoxSay 键盘」并勾选允许完全访问</li>
                <li>在任意聊天输入框切换到 FoxSay 键盘即可使用</li>
              </ol>
              <motion.button whileTap={{ scale: 0.98 }}
                onClick={() => { setShowGuide(false); flash('已复制设置路径'); }}
                className="w-full mt-4"
                style={{
                  height: 44,
                  background: 'linear-gradient(135deg,#FF8A80,#FFD93D)',
                  borderRadius: 12, color: '#1a1520', fontSize: 14, fontWeight: 700,
                }}>
                知道了
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
