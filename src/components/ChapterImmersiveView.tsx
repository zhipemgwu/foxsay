/**
 * ========================================
 *  章节沉浸页 — ChapterImmersiveView
 * ========================================
 *  全屏 overlay，左右滑动切换章节，下滑关闭。
 *  从 PracticePage 的章节封面点击进入。
 *  CTA "开始这一章" 关闭 overlay 并在列表中展开对应章节。
 * ========================================
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { X, ChevronDown, Lock, Crown, Shuffle, Sparkles, Check } from 'lucide-react';
import { KenBurnsImage } from './KenBurnsImage';
import { useSub } from './SubscriptionSheet';

export interface PartnerInfo {
  img: string;
  name: string;
  age: number;
  signature: string;     // 个性签名 / 一句话介绍
  traits: string[];      // 3 个特性标签
}

export interface ImmersiveChapter {
  id: number;
  name: string;
  coverImage: string;       // 列表缩略封面（横版）
  immersiveImage: string;   // 全屏立绘（竖版）
  narrative: string;
  synopsis?: string;        // 剧情简介（不透露结局）
  readCount: string;
  vip?: boolean;            // 会员专享章节
  progress: { unlocked: number; total: number };
  unitLabel?: string;       // 可选：自定义单位标签（如“第 1 关”），默认使用 “第 N 章/组”
  partnerCandidates?: PartnerInfo[];       // 可选：该关候选搭档（启用 picker 才用）
  confirmedPartner?: PartnerInfo | null;   // 可选：已锁定的搭档
}

interface Props {
  open: boolean;
  mode: 'story' | 'challenge';
  chapters: ImmersiveChapter[];
  initialIndex: number;
  onClose: () => void;
  onStart: (chapterId: number) => void;
  onOpenVIP?: () => void;
  headerLabel?: string;     // 可选：顶栏中间文案（默认 "剧情关卡 / 人物邂逅"）
  ctaLabelOverride?: string; // 可选：覆盖 CTA 文案（如 “开始这一关”）
  enablePartnerPicker?: boolean;                                      // 启用右上角“切换搭档”按钮
  onConfirmPartner?: (chapterId: number, partner: PartnerInfo) => void;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

/** 用图片 URL 算一个稳定 seed —— 保证同一张图在 picking / idle 两种 phase 下
 *  传给 KenBurnsImage 的 seed 完全一致，避免 Framer Motion 因 prop 变化
 *  重启 Ken Burns 循环造成的"卡一下"。 */
function imgSeed(url: string): number {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function ChapterImmersiveView({ open, mode, chapters, initialIndex, onClose, onStart, onOpenVIP, headerLabel, ctaLabelOverride, enablePartnerPicker, onConfirmPartner }: Props) {
  const sub = useSub();
  const [[index, direction], setPage] = useState<[number, number]>([initialIndex, 0]);
  const [showVipTip, setShowVipTip] = useState(false);
  // 搭档选择状态机：idle（浏览/已锁定）→ picking（左右滑选角色）→ idle（已锁定）
  const [pickerPhase, setPickerPhase] = useState<'idle' | 'picking'>('idle');
  const [pickerIndex, setPickerIndex] = useState(0);
  const [pickerDir, setPickerDir] = useState(0);
  // 确认时的仪式感动画标记 / 白光闪屏
  const [justConfirmed, setJustConfirmed] = useState(false);
  const [confirmFlash, setConfirmFlash] = useState(false);

  // 每次打开时重置为 initialIndex（避免上次滑动的 index 残留到下次打开）
  useEffect(() => {
    if (open) {
      setPage([initialIndex, 0]);
      setShowVipTip(false);
      setPickerPhase('idle');
      setJustConfirmed(false);
      setConfirmFlash(false);
    }
  }, [open, mode, initialIndex]);

  // 切换关卡时，退出 picker 模式 & 重置特效
  useEffect(() => {
    setPickerPhase('idle');
    setPickerIndex(0);
    setJustConfirmed(false);
    setConfirmFlash(false);
  }, [index]);

  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= chapters.length) return;
    setPage([next, delta]);
  };

  const goPicker = (delta: number) => {
    const candidates = chapters[index]?.partnerCandidates;
    if (!candidates?.length) return;
    const n = candidates.length;
    setPickerIndex(i => (i + delta + n) % n);
    setPickerDir(delta);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    // picking 模式：仅左右滑切候选角色，禁用下滑关闭 / 关卡切换
    if (pickerPhase === 'picking') {
      const swipe = Math.abs(offset.x) * Math.max(1, Math.abs(velocity.x) / 500);
      if (offset.x < -60 && swipe > 40) goPicker(1);
      else if (offset.x > 60 && swipe > 40) goPicker(-1);
      return;
    }
    // idle 模式：下滑关闭 + 左右滑切章节（用于小关卡页内切换同章 6 关）
    if (offset.y > 120 && Math.abs(offset.y) > Math.abs(offset.x)) {
      onClose();
      return;
    }
    const swipe = Math.abs(offset.x) * Math.max(1, Math.abs(velocity.x) / 500);
    if (offset.x < -60 && swipe > 40) go(1);
    else if (offset.x > 60 && swipe > 40) go(-1);
  };

  if (!open) return null;
  const chapter = chapters[index];
  if (!chapter) return null;

  const progressPct = chapter.progress.total > 0 ? (chapter.progress.unlocked / chapter.progress.total) * 100 : 0;
  const isVip = !!chapter.vip;
  const isDone = chapter.progress.unlocked === chapter.progress.total && chapter.progress.total > 0;
  const notStarted = chapter.progress.unlocked === 0;
  const inProgress = !isDone && !notStarted;

  // 状态优先级：VIP > 已破关 > 进行中 > 未开始
  type Status = 'vip' | 'done' | 'progress' | 'new';
  const status: Status = isVip ? 'vip' : isDone ? 'done' : inProgress ? 'progress' : 'new';

  const statusConfig: Record<Status, {
    badge: string; badgeColor: string; badgeBg: string; badgeBorder: string; badgeShadow: string;
    ctaText: string; ctaGradient: string; ctaShadow: string; accent: string;
  }> = {
    vip: {
      badge: '◆ 会员专享',
      badgeColor: '#2b1a0a',
      badgeBg: 'linear-gradient(135deg, rgba(255,207,120,0.95), rgba(255,160,80,0.95))',
      badgeBorder: '1px solid rgba(255,220,150,0.7)',
      badgeShadow: '0 0 20px rgba(255,160,80,0.5)',
      ctaText: '◆ 会员专享 · 立即开通',
      ctaGradient: 'linear-gradient(135deg, #FFCF78 0%, #FFA050 100%)',
      ctaShadow: '0 10px 30px rgba(255,160,80,0.45)',
      accent: 'rgba(255,180,90,0.6)',
    },
    done: {
      badge: '✦ 已破关',
      badgeColor: '#BFF3EE',
      badgeBg: 'linear-gradient(135deg, rgba(78,205,196,0.35), rgba(126,224,214,0.22))',
      badgeBorder: '1px solid rgba(126,224,214,0.55)',
      badgeShadow: '0 0 18px rgba(78,205,196,0.35)',
      ctaText: '✦ 已破关 · 重温这一章',
      ctaGradient: 'linear-gradient(135deg, #4ECDC4 0%, #7EE0D6 100%)',
      ctaShadow: '0 10px 30px rgba(78,205,196,0.38)',
      accent: 'rgba(126,224,214,0.6)',
    },
    progress: {
      badge: '● 进行中',
      badgeColor: '#FFD4CC',
      badgeBg: 'rgba(255,138,128,0.18)',
      badgeBorder: '1px solid rgba(255,138,128,0.5)',
      badgeShadow: 'none',
      ctaText: '继续这一章',
      ctaGradient: 'linear-gradient(135deg, #FF8A80 0%, #FFB199 100%)',
      ctaShadow: '0 10px 30px rgba(255,138,128,0.38)',
      accent: 'rgba(255,138,128,0.55)',
    },
    new: {
      badge: '○ 未开始',
      badgeColor: 'rgba(255,255,255,0.75)',
      badgeBg: 'rgba(255,255,255,0.08)',
      badgeBorder: '1px solid rgba(255,255,255,0.22)',
      badgeShadow: 'none',
      ctaText: '开始这一章',
      ctaGradient: 'linear-gradient(135deg, #FF8A80 0%, #FFB199 100%)',
      ctaShadow: '0 10px 30px rgba(255,138,128,0.38)',
      accent: 'rgba(255,138,128,0.55)',
    },
  };
  const S = statusConfig[status];

  // 本关的候选搭档 / 已锁定搭档
  const candidates = chapter.partnerCandidates ?? [];
  const confirmed = chapter.confirmedPartner ?? null;
  const activeCandidate = candidates[pickerIndex % Math.max(candidates.length, 1)] ?? null;

  // 当前用于显示的立绘图：picking 时为候选池当前项；已锁定时为 confirmedPartner；否则为章节原图
  const displayImg = (() => {
    if (pickerPhase === 'picking' && activeCandidate) return activeCandidate.img;
    if (enablePartnerPicker && confirmed) return confirmed.img;
    return chapter.immersiveImage;
  })();
  // 立绘区 key —— picking / idle 共用同一张图时保持 key 一致，避免重新挂载造成"切换"感
  // 规则：key = 关卡 id + 当前图 url。picking 滑到不同候选 → key 变 → 横向滑入；
  // 确认后 idle 的图与刚才选中的图一致 → key 不变 → 原地保留，无缝过渡给特效。
  const displayKey = `img-${chapter.id}-${displayImg}`;

  const handleCta = () => {
    // VIP 章节任何阶段都先拦截
    if (isVip) { setShowVipTip(true); return; }
    if (pickerPhase === 'picking') {
      if (!activeCandidate) return;
      // 白光抵达峰值的瞬间才做状态切换 —— 用户看到的只是"光中浮现"，不会察觉硬切。
      // 白光总时长 1.1s，在 200ms（峰值刚过）切换 state，再让光环/粒子/标签接力演出。
      setConfirmFlash(true);
      window.setTimeout(() => {
        onConfirmPartner?.(chapter.id, activeCandidate);
        setPickerPhase('idle');
        setJustConfirmed(true);
        // 不立刻关闭 confirmFlash —— 让它按动画 timeline 自然淡出到 0
        window.setTimeout(() => setConfirmFlash(false), 900);
        window.setTimeout(() => setJustConfirmed(false), 2600);
      }, 200);
      return;
    }
    onStart(chapter.id);
  };

  // CTA 文案：picking → 就是她了；已锁定 → 开始这一关；其他走原 statusConfig
  const ctaText = (() => {
    if (isVip) return S.ctaText;
    if (pickerPhase === 'picking') return '就是她了';
    if (enablePartnerPicker && confirmed) return ctaLabelOverride ?? '开始这一关';
    return ctaLabelOverride ?? S.ctaText;
  })();

  const ctaGradient = pickerPhase === 'picking'
    ? 'linear-gradient(135deg, #A78BFA 0%, #F0ABFC 100%)'
    : S.ctaGradient;
  const ctaShadow = pickerPhase === 'picking'
    ? '0 10px 30px rgba(167,139,250,0.45)'
    : S.ctaShadow;

  return (
    <AnimatePresence>
      <motion.div
        key="immersive-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#14101c',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* ===== 顶部栏 ===== */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(20,16,28,0.6), transparent)',
        }}>
          <button
            onClick={() => {
              if (pickerPhase === 'picking') { setPickerPhase('idle'); return; }
              onClose();
            }}
            aria-label={pickerPhase === 'picking' ? '取消选择' : '关闭'}
            style={{
              height: 36, minWidth: 36, padding: pickerPhase === 'picking' ? '0 14px' : 0, borderRadius: 18,
              background: 'rgba(0,0,0,0.38)',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              gap: 4,
            }}
          >
            {pickerPhase === 'picking'
              ? <>取消</>
              : <X size={18} color="#fff" strokeWidth={2} />}
          </button>
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: pickerPhase === 'picking' ? 'rgba(167,139,250,0.28)' : 'rgba(0,0,0,0.38)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: pickerPhase === 'picking' ? '1px solid rgba(240,171,252,0.55)' : '1px solid rgba(255,255,255,0.12)',
            color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {pickerPhase === 'picking' ? (
              <>
                <Shuffle size={12} />
                选择搭档 · {(pickerIndex % (candidates.length || 1)) + 1} / {candidates.length}
              </>
            ) : (
              <>{headerLabel ?? (mode === 'story' ? '剧情关卡' : '人物邂逅')} · {index + 1} / {chapters.length}</>
            )}
          </div>
          {/* 右上角：切换搭档按钮（仅 idle + 启用 picker 时显示） */}
          {pickerPhase === 'idle' && enablePartnerPicker && !isVip && candidates.length > 1 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setPickerPhase('picking');
                setPickerDir(0);
                // 若已锁定，从它开始浏览；否则从 0 开始
                const startIdx = confirmed ? Math.max(0, candidates.findIndex(c => c.img === confirmed.img)) : 0;
                setPickerIndex(startIdx);
              }}
              aria-label="切换搭档"
              style={{
                height: 36, padding: '0 12px', borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(167,139,250,0.85), rgba(240,171,252,0.85))',
                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 1,
                boxShadow: '0 6px 18px rgba(167,139,250,0.4)',
              }}
            >
              <Shuffle size={14} strokeWidth={2.4} />
              <span>切换搭档</span>
            </motion.button>
          ) : (
            <div style={{ width: 36 }} />
          )}
        </div>

        {/* ===== 卡片滑动区 ===== */}
        <AnimatePresence initial={false} custom={pickerPhase === 'picking' ? pickerDir : direction} mode="popLayout">
          <motion.div
            key={displayKey}
            custom={pickerPhase === 'picking' ? pickerDir : direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 320, damping: 34 }, opacity: { duration: 0.22 } }}
            drag
            dragElastic={0.22}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              cursor: 'grab',
            }}
          >
            {/* 背景立绘 */}
            <div style={{ position: 'absolute', inset: 0 }}>
              <KenBurnsImage
                src={displayImg}
                alt={chapter.name}
                /* seed 跟着图片 URL 稳定 —— picking→idle 切到同图时不会重置 Ken Burns 循环 */
                seed={imgSeed(displayImg)}
                duration={16}
                tilt
                tiltStrength={2.5}
                glow
                /* glowColor 也跟图稳定：VIP 永远金色，其余永远粉色，不随 phase 变 */
                glowColor={isVip ? 'rgba(255,207,120,0.28)' : 'rgba(255,190,180,0.22)'}
                loading="eager"
              />
              {/* 顶部/底部暗色渐变 */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(20,16,28,0.55) 0%, rgba(20,16,28,0) 28%, rgba(20,16,28,0) 45%, rgba(20,16,28,0.72) 78%, rgba(20,16,28,0.96) 100%)',
                pointerEvents: 'none',
              }} />
              {/* 刚确认的仪式感：多层光环 + 粒子四散 + 金色描边 */}
              {justConfirmed && (
                <>
                  {/* 第 1 层：主光晕（大半径、亮白金） */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: [0, 1, 0.9, 0], scale: [0.2, 1.6, 2.4, 3.2] }}
                    transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1], times: [0, 0.18, 0.55, 1] }}
                    style={{
                      position: 'absolute', top: '48%', left: '50%',
                      width: 520, height: 520, marginLeft: -260, marginTop: -260,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,220,150,0.75) 22%, rgba(240,171,252,0.45) 48%, rgba(167,139,250,0.12) 72%, transparent 88%)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* 第 2 层：冲击波环（描边） */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.1, 2.6] }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.05 }}
                    style={{
                      position: 'absolute', top: '48%', left: '50%',
                      width: 360, height: 360, marginLeft: -180, marginTop: -180,
                      borderRadius: '50%',
                      border: '3px solid rgba(255,230,180,0.9)',
                      boxShadow: '0 0 60px rgba(255,220,150,0.6), inset 0 0 40px rgba(255,220,150,0.3)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* 第 3 层：延迟冲击波环（粉紫色） */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: [0, 0.85, 0], scale: [0.1, 3.2] }}
                    transition={{ duration: 1.6, ease: 'easeOut', delay: 0.28 }}
                    style={{
                      position: 'absolute', top: '48%', left: '50%',
                      width: 360, height: 360, marginLeft: -180, marginTop: -180,
                      borderRadius: '50%',
                      border: '2px solid rgba(240,171,252,0.9)',
                      boxShadow: '0 0 50px rgba(240,171,252,0.55)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* 星光粒子（6 颗从中心向四周炸开） */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2;
                    const dist = 180 + (i % 3) * 40;
                    const dx = Math.cos(angle) * dist;
                    const dy = Math.sin(angle) * dist;
                    return (
                      <motion.div
                        key={`spark-${i}`}
                        aria-hidden
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          x: [0, dx * 0.4, dx],
                          y: [0, dy * 0.4, dy],
                          scale: [0, 1, 0.6, 0],
                        }}
                        transition={{ duration: 1.3, ease: 'easeOut', delay: 0.08 + (i % 3) * 0.04, times: [0, 0.25, 0.7, 1] }}
                        style={{
                          position: 'absolute', top: '48%', left: '50%',
                          width: 8, height: 8, marginLeft: -4, marginTop: -4,
                          borderRadius: '50%',
                          background: i % 2 === 0
                            ? 'radial-gradient(circle, #fff 0%, rgba(255,220,150,0.9) 50%, transparent 100%)'
                            : 'radial-gradient(circle, #fff 0%, rgba(240,171,252,0.9) 50%, transparent 100%)',
                          boxShadow: i % 2 === 0
                            ? '0 0 12px rgba(255,220,150,0.9)'
                            : '0 0 12px rgba(240,171,252,0.9)',
                          pointerEvents: 'none',
                        }}
                      />
                    );
                  })}
                  {/* 立绘金色描边光（用 box-shadow inset 代替 140px，性能更友好） */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0.4, 0] }}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', inset: 0,
                      boxShadow: 'inset 0 0 80px rgba(255,220,150,0.55), inset 0 0 30px rgba(240,171,252,0.35)',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              )}
              {/* VIP 章节：整图暗化 + 金色流光边 + 右上皇冠角标 */}
              {isVip && (
                <>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(20,16,28,0.28)',
                    pointerEvents: 'none',
                  }} />
                  {/* 金色流光光带（缓动扫过） */}
                  <motion.div
                    aria-hidden
                    animate={{ x: ['-30%', '130%'] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                    style={{
                      position: 'absolute', top: 0, bottom: 0, width: '35%',
                      background: 'linear-gradient(110deg, transparent 0%, rgba(255,220,150,0.18) 45%, rgba(255,255,255,0.22) 50%, rgba(255,220,150,0.18) 55%, transparent 100%)',
                      pointerEvents: 'none', mixBlendMode: 'screen',
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.06, 1], opacity: 1,
                      boxShadow: [
                        '0 8px 24px rgba(255,160,80,0.5), 0 0 0 3px rgba(255,220,150,0.35)',
                        '0 10px 32px rgba(255,160,80,0.7), 0 0 0 6px rgba(255,220,150,0.22)',
                        '0 8px 24px rgba(255,160,80,0.5), 0 0 0 3px rgba(255,220,150,0.35)',
                      ],
                    }}
                    transition={{
                      scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                      boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                      opacity: { delay: 0.18, type: 'spring', stiffness: 260, damping: 18 } as any,
                    }}
                    style={{
                      position: 'absolute', top: 72, right: 20,
                      width: 46, height: 46, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFCF78, #FFA050)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Crown size={22} color="#2b1a0a" strokeWidth={2.4} />
                  </motion.div>
                </>
              )}
            </div>

            {/* 文案与 CTA（底部） */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              padding: '0 28px 34px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {/* 章节标签 + 状态徽章 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{
                  padding: '4px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                }}>
                  {chapter.unitLabel ?? (mode === 'story' ? `第 ${chapter.id} 章` : `第 ${chapter.id} 组`)}
                </div>
                <motion.div
                  key={`${chapter.id}-${status}`}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 18 }}
                  style={{
                    padding: '4px 12px', borderRadius: 8,
                    background: S.badgeBg,
                    border: S.badgeBorder,
                    color: S.badgeColor,
                    fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                    boxShadow: S.badgeShadow,
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  {S.badge}
                </motion.div>
              </div>

              {/* 标题 */}
              <h1 style={{
                color: '#fff', fontSize: 34, fontWeight: 800,
                letterSpacing: 2, margin: 0, lineHeight: 1.15,
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}>
                {chapter.name}
              </h1>

              {/* 叙事文案（斜体钩子） */}
              <p style={{
                color: 'rgba(255,255,255,0.82)', fontSize: 14.5, lineHeight: 1.75,
                fontStyle: 'italic', margin: 0,
                textShadow: '0 1px 6px rgba(0,0,0,0.55)',
                letterSpacing: 0.3,
              }}>
                “{chapter.narrative}”
              </p>

              {/* ========== picking 模式：候选搭档信息卡 ========== */}
              <AnimatePresence mode="wait">
                {pickerPhase === 'picking' && activeCandidate && (
                  <motion.div
                    key={`cand-${chapter.id}-${activeCandidate.img}`}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      padding: '14px 14px 12px',
                      background: 'linear-gradient(135deg, rgba(167,139,250,0.22), rgba(240,171,252,0.14))',
                      border: '1px solid rgba(240,171,252,0.4)',
                      borderRadius: 14,
                      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                      display: 'flex', flexDirection: 'column', gap: 8,
                    }}
                  >
                    {/* 姓名 + 年龄 */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: 1.2,
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}>
                        {activeCandidate.name}
                      </span>
                      <span style={{
                        color: 'rgba(240,171,252,0.9)', fontSize: 12, fontWeight: 600, letterSpacing: 0.8,
                      }}>
                        {activeCandidate.age} 岁
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
                      }}>
                        候选 · {(pickerIndex % Math.max(candidates.length, 1)) + 1} / {candidates.length}
                      </span>
                    </div>
                    {/* 特性标签 */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {activeCandidate.traits.map((t) => (
                        <span
                          key={t}
                          style={{
                            padding: '3px 10px', borderRadius: 999,
                            background: 'rgba(255,255,255,0.14)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            color: '#fff', fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {/* 个性签名 */}
                    <p style={{
                      margin: 0, color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 1.65,
                      fontStyle: 'italic', letterSpacing: 0.3,
                      textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                    }}>
                      「{activeCandidate.signature}」
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 特性标签（已锁定搭档且非 picking 时显示） */}
              <AnimatePresence>
                {pickerPhase === 'idle' && enablePartnerPicker && confirmed && confirmed.traits.length > 0 && (
                  <motion.div
                    key={`traits-${chapter.id}-${confirmed.img}`}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ delay: justConfirmed ? 0.35 : 0, duration: 0.42, ease: 'easeOut' }}
                    style={{
                      padding: '10px 12px',
                      background: 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(240,171,252,0.12))',
                      border: '1px solid rgba(240,171,252,0.35)',
                      borderRadius: 12,
                      display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: '#F0ABFC', fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                    }}>
                      <Sparkles size={12} />
                      今日搭档 · {confirmed.name} · {confirmed.age}
                    </div>
                    {confirmed.traits.map((t, i) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, y: 6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: (justConfirmed ? 0.45 : 0) + i * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                        style={{
                          padding: '3px 10px', borderRadius: 999,
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.22)',
                          color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
                        }}
                      >
                        {t}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 剧情简介（不透露全部） */}
              {chapter.synopsis && (
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderLeft: `2px solid ${S.accent}`,
                  borderRadius: 10,
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  maxHeight: 180, overflowY: 'auto',
                }}>
                  <div style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700,
                    letterSpacing: 2, marginBottom: 6,
                  }}>
                    · 剧情简介 ·
                  </div>
                  <p style={{
                    color: 'rgba(255,255,255,0.82)', fontSize: 12.5, lineHeight: 1.85,
                    margin: 0, letterSpacing: 0.3,
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}>
                    {chapter.synopsis}
                  </p>
                </div>
              )}

              {/* 进度条 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
                  <motion.div
                    style={{
                      height: '100%', borderRadius: 2,
                      background: isVip
                        ? 'linear-gradient(90deg, #FFCF78, #FFA050)'
                        : isDone ? '#4ECDC4' : 'linear-gradient(90deg, #FF8A80, #FFB199)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: isVip ? '0%' : `${progressPct}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 0.3 }}>
                  {isVip ? '会员解锁' : chapter.readCount}
                </span>
              </div>

              {/* 章节小圆点指示器（chapters.length > 1 时才显示；picking 时改为候选池指示器） */}
              {pickerPhase === 'picking' && candidates.length > 1 ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                  {candidates.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPickerDir(i > pickerIndex ? 1 : -1);
                        setPickerIndex(i);
                      }}
                      aria-label={`选择候选 ${i + 1}`}
                      style={{
                        width: i === pickerIndex ? 20 : 6, height: 6, borderRadius: 3,
                        background: i === pickerIndex ? '#F0ABFC' : 'rgba(255,255,255,0.3)',
                        border: 'none', padding: 0, cursor: 'pointer',
                        transition: 'width 0.25s, background 0.25s',
                      }}
                    />
                  ))}
                </div>
              ) : chapters.length > 1 ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                  {chapters.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setPage([i, i > index ? 1 : -1])}
                      aria-label={`切到第 ${i + 1} 章`}
                      style={{
                        width: i === index ? 20 : 6, height: 6, borderRadius: 3,
                        background: i === index ? '#fff' : 'rgba(255,255,255,0.3)',
                        border: 'none', padding: 0, cursor: 'pointer',
                        transition: 'width 0.25s',
                      }}
                    />
                  ))}
                </div>
              ) : null}

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCta}
                style={{
                  marginTop: 10,
                  height: 54, borderRadius: 16,
                  background: ctaGradient,
                  color: '#2b2535', fontSize: 16, fontWeight: 800, letterSpacing: 3,
                  border: 'none', cursor: 'pointer',
                  boxShadow: ctaShadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {pickerPhase === 'picking' && <Check size={18} strokeWidth={2.6} />}
                {ctaText}
              </motion.button>
            </div>

            {/* 下滑关闭提示 / picking 左右滑提示 */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: [0, 0.55, 0.55, 0], y: [0, 4, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }}
              style={{
                position: 'absolute', top: 68, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 4, pointerEvents: 'none',
                color: pickerPhase === 'picking' ? 'rgba(240,171,252,0.75)' : 'rgba(255,255,255,0.55)',
                fontSize: 10, letterSpacing: 1,
              }}
            >
              {pickerPhase === 'picking' ? (
                <>← 左右滑动选择今日搭档 →</>
              ) : (
                <><ChevronDown size={12} /><span>下滑关闭</span></>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ===== 确认时的白光闪屏（与后续光环/粒子无缝衔接） ===== */}
        <AnimatePresence>
          {confirmFlash && (
            <motion.div
              key="confirm-flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.55, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.14, 0.5, 1] }}
              style={{
                position: 'absolute', inset: 0, zIndex: 8,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at 50% 48%, rgba(255,255,255,1) 0%, rgba(255,230,180,0.9) 18%, rgba(240,171,252,0.65) 40%, rgba(167,139,250,0.28) 62%, rgba(20,16,28,0.15) 85%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* VIP 锁定提示弹窗 */}
        <AnimatePresence>
          {showVipTip && (
            <motion.div
              key="vip-tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowVipTip(false)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(8,5,14,0.72)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 40px', zIndex: 10,
              }}
            >
              <motion.div
                initial={{ scale: 0.86, y: 14, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%', maxWidth: 320,
                  background: 'linear-gradient(160deg, #2b1a0a 0%, #3a2512 55%, #2b1a0a 100%)',
                  border: '1px solid rgba(255,207,120,0.35)',
                  borderRadius: 20, padding: '24px 22px 20px',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,207,120,0.12)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFCF78, #FFA050)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 10px 24px rgba(255,160,80,0.45)',
                }}>
                  <Lock size={24} color="#2b1a0a" strokeWidth={2.4} />
                </div>
                <h3 style={{
                  margin: 0, color: '#FFDFA8', fontSize: 17, fontWeight: 800,
                  letterSpacing: 1.5, textAlign: 'center',
                }}>
                  此章节为会员专享
                </h3>
                <p style={{
                  margin: 0, color: 'rgba(255,220,180,0.72)', fontSize: 12.5,
                  lineHeight: 1.7, textAlign: 'center', letterSpacing: 0.3,
                }}>
                  「{chapter.name}」是会员专属剧情，<br/>
                  开通会员即可解锁全部剧情与高级关卡。
                </p>
                <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 4 }}>
                  <button
                    onClick={() => setShowVipTip(false)}
                    style={{
                      flex: 1, height: 42, borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,207,120,0.22)',
                      color: 'rgba(255,220,180,0.85)',
                      fontSize: 13, fontWeight: 700, letterSpacing: 1, cursor: 'pointer',
                    }}
                  >
                    我知道了
                  </button>
                  <button
                    onClick={() => {
                      setShowVipTip(false);
                      sub.open('chapter_vip');
                    }}
                    aria-label="开通会员解锁剧情"
                    style={{
                      flex: 1.2, height: 42, borderRadius: 12,
                      background: 'linear-gradient(135deg, #FFCF78, #FFA050)',
                      border: 'none',
                      color: '#2b1a0a',
                      fontSize: 13, fontWeight: 800, letterSpacing: 1, cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(255,160,80,0.45)',
                    }}
                  >
                    ◆ 开通会员
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default ChapterImmersiveView;
