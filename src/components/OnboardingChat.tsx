import { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onboardingScript, computeSpecies, type ChatOption } from '../data/onboardingChat';

/* ====== Web Audio 微音效 ====== */
const audioCtxRef: { ctx: AudioContext | null } = { ctx: null };
function getAudioCtx() {
  if (!audioCtxRef.ctx) audioCtxRef.ctx = new AudioContext();
  return audioCtxRef.ctx;
}
/** 轻叮声 — 选中选项 */
function playDing() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
    if (navigator.vibrate) navigator.vibrate(12);
  } catch {}
}
/** 软咚声 — NPC气泡出现 */
function playPop() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

/* ====== 浮动粒子背景 ====== */
function FloatingParticles() {
  // 无障碍：prefers-reduced-motion 时不渲染粒子
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  if (reduced) return null;
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    dur: 7 + Math.random() * 6,
    delay: Math.random() * 4,
    color: ['#FF6B6B', '#9B7EDE', '#FFD93D'][i % 3],
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: [0, -40, -80], x: [0, (Math.random() - 0.5) * 20] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/** NPC 头像 — 微信风格静态方圆图 */
function FoxAvatar({ size = 28 }: { size?: number; glow?: boolean }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 8,
        overflow: 'hidden', flexShrink: 0,
        background: '#2a2540',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      <img
        src="/avatars/face5.webp"
        alt="林夕"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

/* ====== 题号步进指示器 ====== */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <motion.div
            key={i}
            animate={{
              width: active ? 20 : 6,
              background: done ? '#FF8A80' : active ? 'linear-gradient(90deg,#FF8A80,#FFD93D)' : 'rgba(255,255,255,0.15)',
              boxShadow: active ? '0 0 8px rgba(255,138,128,0.5)' : 'none',
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 6, borderRadius: 3 }}
          />
        );
      })}
    </div>
  );
}

/* ====== NPC 情绪反应标签 ====== */
const turnMoods = ['🌧 雨刚停…', '☕ 关东煮冒着热气', '🌃 夜越来越长', '💭 有点意思'];

interface Bubble {
  id: string;
  side: 'npc' | 'me';
  text: string;
  emoji?: string;
  isReply?: boolean; // NPC即时短反馈
}

/**
 * Onboarding 对话首关 —— 老司狐 NPC 4 轮固定对话
 * 4 轮后调用 onFinish(result) 进入"鉴定揭晓"
 */
export function OnboardingChat({
  onFinish,
  onQuickLogin,
}: {
  onFinish: (result: { speciesId: string; matchRate: number; tagsTopN: string[]; answers: ChatOption[] }) => void;
  onQuickLogin?: () => void;
}) {
  const [turn, setTurn] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [picked, setPicked] = useState<ChatOption[]>([]);
  const [npcTyping, setNpcTyping] = useState(true);
  const [choosing, setChoosing] = useState(false);   // 选中→NPC回复之间的锁
  const [chosenId, setChosenId] = useState<string | null>(null); // 刚选中的选项 id
  const [dismissing, setDismissing] = useState(false); // 未选项fadeOut
  const [analyzing, setAnalyzing] = useState(false); // 最终分析阶段
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const npcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingNpcRef = useRef<{ text: string; isReply: boolean } | null>(null);

  // 初始化首句 NPC 话术（防护 StrictMode 重复执行）
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    pushNpc(onboardingScript[0].npc);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [bubbles, npcTyping]);

  function pushNpc(text: string, isReply = false) {
    setNpcTyping(true);
    pendingNpcRef.current = { text, isReply };
    const delay = 500 + text.length * 12 + Math.random() * 300;
    npcTimerRef.current = setTimeout(() => {
      commitNpc(text, isReply);
    }, delay);
  }

  /** 立即显示NPC消息（跳过等待） */
  function commitNpc(text: string, isReply: boolean) {
    if (npcTimerRef.current) { clearTimeout(npcTimerRef.current); npcTimerRef.current = null; }
    pendingNpcRef.current = null;
    setBubbles(prev => [...prev, { id: 'n_' + Date.now(), side: 'npc', text, isReply }]);
    setNpcTyping(false);
    playPop();
  }

  /** 点击打字气泡跳过等待 */
  function skipTyping() {
    if (!npcTyping || !pendingNpcRef.current) return;
    commitNpc(pendingNpcRef.current.text, pendingNpcRef.current.isReply);
  }

  function pick(opt: ChatOption) {
    if (npcTyping || choosing) return;          // 防连点
    setChoosing(true);
    setChosenId(opt.id);
    setDismissing(true); // 触发未选项fadeOut
    playDing();

    // 延迟 450ms 让用户看到选中态+其他fadeOut，再推消息
    setTimeout(() => {
      setDismissing(false);
      setBubbles(prev => [...prev, { id: 'm_' + Date.now(), side: 'me', text: opt.label, emoji: opt.emoji }]);
      const nextPicked = [...picked, opt];
      setPicked(nextPicked);
      setChosenId(null);

      const replyDelay = opt.reply ? 500 : 0;
      // NPC 即时短反馈（选完后的快速回应）
      if (opt.reply) {
        setTimeout(() => {
          setBubbles(prev => [...prev, { id: 'r_' + Date.now(), side: 'npc', text: opt.reply!, isReply: true }]);
        }, replyDelay);
      }

      const next = turn + 1;
      if (next < onboardingScript.length) {
        setTurn(next);
        setTimeout(() => {
          pushNpc(onboardingScript[next].npc);
          setChoosing(false);
        }, replyDelay + 600);
      } else {
        // 戏剧化收尾 — 掐指一算
        setAnalyzing(true);
        setTimeout(() => pushNpc('数据齐了，让我把脉一下你到底是哪种"狐"……🔮'), replyDelay + 500);
        setTimeout(() => {
          const result = computeSpecies(nextPicked);
          onFinish({ ...result, answers: nextPicked });
        }, replyDelay + 2800);
      }
    }, 350);
  }

  const currentTurn = onboardingScript[turn];
  const showOptions = !npcTyping && !choosing && picked.length === turn && turn < onboardingScript.length;
  const showChosen = choosing && chosenId !== null;  // 选中态：只显示被点击的选项
  const showDismiss = dismissing; // 未选项正在fadeOut

  return (
    <div className="absolute inset-0 z-[60] flex flex-col" style={{ background: '#15112a' }}>
      {/* ====== 沉浸式动态背景 ====== */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(194,54,22,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(155,126,222,0.10) 0%, transparent 50%)',
      }} />
      <FloatingParticles />
      {/* 顶部大光晕 */}
      <motion.div className="absolute pointer-events-none" style={{
        top: -160, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 60%)',
        filter: 'blur(60px)',
      }} animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative flex flex-col h-full w-full" style={{ maxWidth: 430, margin: '0 auto', zIndex: 1 }}>
        {/* ====== 顶栏 — 沉浸感顶栏 ====== */}
        <div className="px-5 pt-12 pb-3" style={{
          background: 'linear-gradient(180deg, rgba(17,14,26,0.95) 0%, rgba(17,14,26,0.6) 80%, transparent 100%)',
        }}>
          <div className="flex items-center gap-3 mb-3">
            <FoxAvatar size={44} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>林夕</span>
                <span style={{ fontSize: 10, color: 'rgba(255,138,128,0.9)', background: 'rgba(255,138,128,0.12)', padding: '2px 8px', borderRadius: 10, fontWeight: 600, border: '1px solid rgba(255,138,128,0.2)' }}>刚刚遇见</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ECDC4', boxShadow: '0 0 6px rgba(78,205,196,0.6)' }} />
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10.5 }}>便利店 · 关东煮柜前</span>
              </div>
            </div>
            {/* 题号指示 */}
            <div className="text-right">
              <StepIndicator current={picked.length} total={onboardingScript.length} />
              <AnimatePresence mode="wait">
                <motion.div key={Math.min(turn, turnMoods.length - 1)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ color: 'rgba(245,239,232,0.45)', fontSize: 9.5, marginTop: 4 }}>
                  {turnMoods[Math.min(turn, turnMoods.length - 1)]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {/* 右上角 直接登录 小胶囊 */}
          {onQuickLogin && (
            <motion.button
              onClick={onQuickLogin}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute"
              style={{
                top: 14, right: 16,
                padding: '5px 11px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 999,
                color: 'rgba(245,239,232,0.72)',
                fontSize: 11.5,
                fontWeight: 500,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >直接登录</motion.button>
          )}
        </div>

        {/* ====== 对话区 ====== */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence initial={false}>
            {bubbles.map(b => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex ${b.side === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {b.side === 'npc' && (
                  <div style={{ marginRight: 8, alignSelf: 'flex-end' }}>
                    <FoxAvatar size={28} />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: b.isReply ? '8px 14px' : '10px 14px',
                  borderRadius: b.side === 'me' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                  background: b.side === 'me'
                    ? '#95EC69'
                    : b.isReply
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: b.side === 'me' ? '#1a1a1a' : b.isReply ? 'rgba(245,239,232,0.5)' : '#f5efe8',
                  fontSize: b.isReply ? 13 : 15,
                  fontWeight: 400,
                  fontStyle: b.isReply ? 'italic' : 'normal',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                  boxShadow: 'none',
                }}>
                  {b.emoji && <span style={{ marginRight: 6 }}>{b.emoji}</span>}
                  {b.text}
                </div>
              </motion.div>
            ))}
            {/* ====== 打字动画（可点击跳过） ====== */}
            {npcTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start cursor-pointer"
                onClick={skipTyping}
              >
                <div style={{ marginRight: 8, alignSelf: 'flex-end' }}>
                  <FoxAvatar size={28} />
                </div>
                <div className="flex items-center gap-1.5" style={{
                  padding: '11px 14px', borderRadius: '4px 14px 14px 14px',
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                }}>
                  {[0, 1, 2].map(i => (
                    <motion.span key={i}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF8A80' }}
                      animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ====== 选项区 — 沉浸式玻璃卡片 ====== */}
        <div className="px-4 pb-6 pt-3" style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(17,14,26,0.8) 25%, rgba(17,14,26,0.98) 100%)',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          // 预留选项栏高度，避免选中后整块消失导致对话区跳动
          minHeight: 268,
        }}>
          <AnimatePresence mode="wait">
            {(showOptions || showChosen || showDismiss) && (
              <motion.div
                key={showChosen ? currentTurn.id + '_chosen' : currentTurn.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2.5"
              >
                {currentTurn.options
                  .map((opt, idx) => {
                    const isChosen = chosenId === opt.id;
                    const isDismissed = showDismiss && !isChosen;
                    // 选中后隐藏未选项（fadeOut完成后）
                    if (showChosen && !showDismiss && !isChosen) return null;
                    return (
                  <motion.button
                    key={opt.id}
                    onClick={() => pick(opt)}
                    whileTap={!isChosen && !isDismissed ? { scale: 0.97 } : {}}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{
                      opacity: isDismissed ? 0 : 1,
                      x: isDismissed ? -16 : 0,
                      scale: isChosen && showChosen ? 1.03 : isDismissed ? 0.95 : 1,
                      height: isDismissed ? 0 : 'auto',
                      marginBottom: isDismissed ? 0 : undefined,
                      padding: isDismissed ? '0 16px' : undefined,
                    }}
                    transition={isDismissed
                      ? { duration: 0.25, ease: 'easeIn' }
                      : { delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                    className="w-full flex items-center gap-3 px-4 py-3.5"
                    style={{
                      background: isChosen ? 'rgba(149,236,105,0.12)' : 'rgba(255,255,255,0.04)',
                      border: isChosen
                        ? '1px solid rgba(149,236,105,0.35)'
                        : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      color: '#f5efe8',
                      textAlign: 'left' as const,
                      boxShadow: 'none',
                      pointerEvents: (choosing ? 'none' : 'auto') as any,
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 28, height: 28,
                        fontSize: 20,
                      }}
                    >
                      {opt.emoji}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 400, flex: 1, letterSpacing: 0.2, lineHeight: 1.4 }}>{opt.label}</span>
                    {isChosen
                      ? <span style={{ color: '#95EC69', fontSize: 16, fontWeight: 600 }}>✓</span>
                      : <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 14 }}>›</span>}
                  </motion.button>
                    );
                  })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ====== 掐指一算 · 分析中覆层 ====== */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            key="analyzing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(155,126,222,0.25) 0%, rgba(21,17,42,0.97) 70%)' }}
          >
            {/* 脉动光圈 */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                width: 120, height: 120, borderRadius: '50%',
                border: '2px solid rgba(155,126,222,0.4)',
                position: 'absolute',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.05, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
              style={{
                width: 160, height: 160, borderRadius: '50%',
                border: '1.5px solid rgba(255,138,128,0.3)',
                position: 'absolute',
              }}
            />
            {/* 🔮 */}
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ fontSize: 52, marginBottom: 16, filter: 'drop-shadow(0 0 20px rgba(155,126,222,0.5))' }}
            >🔮</motion.span>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ color: 'rgba(245,239,232,0.85)', fontSize: 15, fontWeight: 500, letterSpacing: 1 }}
            >林夕在心里默默判断中…</motion.p>
            {/* 跑马灯进度条 */}
            <motion.div
              style={{ width: 120, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', marginTop: 16, overflow: 'hidden' }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(155,126,222,0.7), transparent)' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
