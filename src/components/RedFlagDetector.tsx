/**
 * ⚡ 恋爱避雷针 — 红绿灯鉴渣系统
 *    替代原「朋友圈助手」，解决核心痛点：ta 到底在不在玩我？
 *    三种输入模式：行为勾选 / 描述行为 / 粘贴聊天
 *    输出：红绿灯判定 + 渣值 + 模式匹配 + 证据链 + 止损建议 + 分享卡
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, AlertTriangle, Copy, Check } from 'lucide-react';
import { IconBubble, IcShield, IcRadar, gradients } from './CuteIcons';

/* ============================================================
 *  常量 & 数据
 * ============================================================ */

/** 输入模式 */
const modes = ['行为勾选', '描述行为', '粘贴聊天'] as const;
type Mode = typeof modes[number];

/** 危险行为清单，按严重等级标注 */
interface FlagItem { label: string; emoji: string; severity: 'red' | 'yellow' | 'green' }
const flagChecklist: FlagItem[] = [
  // 🔴 红色警报 (严重)
  { label: '只在深夜联系我', emoji: '🌙', severity: 'red' },
  { label: '从不带我见朋友', emoji: '👥', severity: 'red' },
  { label: '忽冷忽热、态度反复无常', emoji: '🎭', severity: 'red' },
  { label: '总说"你想多了"否认我的感受', emoji: '🙄', severity: 'red' },
  { label: '暧昧期同时跟好几个人聊', emoji: '🃏', severity: 'red' },
  { label: '翻我手机但不让我碰 ta 的', emoji: '📱', severity: 'red' },
  { label: '动不动就冷暴力消失', emoji: '🧊', severity: 'red' },
  { label: '常常含沙射影贬低我', emoji: '💔', severity: 'red' },
  // 🟡 黄色警告 (需注意)
  { label: '已读不回但朋友圈秒更新', emoji: '👀', severity: 'yellow' },
  { label: '从不主动约我', emoji: '📵', severity: 'yellow' },
  { label: '聊天全靠我找话题', emoji: '💬', severity: 'yellow' },
  { label: '总说忙但刷手机不停', emoji: '⏰', severity: 'yellow' },
  { label: '从不在社交媒体提到我', emoji: '🔒', severity: 'yellow' },
  { label: '许诺很多但从不兑现', emoji: '🎈', severity: 'yellow' },
  { label: '只聊暧昧但不确定关系', emoji: '🫧', severity: 'yellow' },
  { label: '遇到矛盾总是回避不解决', emoji: '🏃', severity: 'yellow' },
  // 🟢 轻度信号 (可能是性格问题)
  { label: '回复速度忽快忽慢', emoji: '⚡', severity: 'green' },
  { label: '约会总是AA、没给过惊喜', emoji: '💰', severity: 'green' },
  { label: '很少表达情感和赞美', emoji: '😶', severity: 'green' },
  { label: '朋友圈设了三天可见', emoji: '🔐', severity: 'green' },
];

/** 操控模式库 */
interface Pattern {
  name: string;
  emoji: string;
  color: string;
  desc: string;
  keywords: string[];        // 关联的行为关键词
  flagLabels: string[];      // 对应勾选行为
  advice: string[];
  soulQuote: string;         // 灵魂拷问
}

const patterns: Pattern[] = [
  {
    name: 'PUA 精神控制',
    emoji: '🕷️',
    color: '#FF4444',
    desc: '通过打压你的自信来让你依附 ta，先捧后踩，让你觉得"离开 ta 就没人要了"',
    keywords: ['贬低', '否认', '打压', '你想多了', '没人要', '配不上'],
    flagLabels: ['常常含沙射影贬低我', '总说"你想多了"否认我的感受', '动不动就冷暴力消失'],
    advice: ['你的感受不是"想多了"，它们真实且重要', '记录每一次被否定的瞬间，给清醒的自己看', '离开不是失败，是止损', '跟信任的朋友聊聊，听听「外部视角」'],
    soulQuote: '真正爱你的人会让你越来越自信，而不是越来越自我怀疑',
  },
  {
    name: '面包屑式暧昧',
    emoji: '🍞',
    color: '#FF8A00',
    desc: '给你刚好够上瘾的关注，但永远不推进。让你有"快成了"的错觉，实际上你只是 ta 的备选',
    keywords: ['暧昧', '不确定', '若即若离', '刚好', '偶尔', '聊骚', '不发展'],
    flagLabels: ['只聊暧昧但不确定关系', '从不主动约我', '已读不回但朋友圈秒更新', '许诺很多但从不兑现'],
    advice: ['如果超过 2 个月还没明确关系，ta 的沉默就是答案', '试着 3 天不主动联系，看对方的反应', '你值得被「选定」，而不是被「吊着」', '把精力花在会为你腾出时间的人身上'],
    soulQuote: '真心喜欢一个人是藏不住的，需要你猜的答案其实已经很明显了',
  },
  {
    name: 'Love Bombing 轰炸示爱',
    emoji: '💣',
    color: '#FF5CAD',
    desc: '一上来就疯狂示好，不到一周就说爱你、要结婚，用过度热情让你放下防备，然后翻脸',
    keywords: ['太快', '才认识', '上来就', '表白', '秒回', '过度', '占有', '控制'],
    flagLabels: ['忽冷忽热、态度反复无常', '翻我手机但不让我碰 ta 的'],
    advice: ['正常感情是慢慢升温的，太快 = 红灯', '感受一下"热情"背后有没有「控制欲」', '试着放慢节奏，观察对方是否会急躁或翻脸', '健康的关系不需要用"轰炸"来建立'],
    soulQuote: '爱情不是突如其来的火山，真正的温暖是炉火——慢慢的、持续的',
  },
  {
    name: '回避型伪装者',
    emoji: '🦔',
    color: '#9B7EDE',
    desc: '需要你的时候温柔似水，一旦关系推进就后退。用"我需要空间"当挡箭牌，让你永远困在原地',
    keywords: ['空间', '冷淡', '回避', '不聊', '逃避', '消失', '不确定'],
    flagLabels: ['遇到矛盾总是回避不解决', '动不动就冷暴力消失', '忽冷忽热、态度反复无常'],
    advice: ['ta 的"需要空间"可能是真的怕亲密，但你不是 ta 的心理医生', '一段好的感情不需要你一直在猜', '如果每次靠近都被推开，你在恋爱还是在做引体向上？', '你有权利要求确定性'],
    soulQuote: '你去靠近一个人的时候，不应该像在拆炸弹——小心翼翼、害怕出错',
  },
  {
    name: '养鱼达人',
    emoji: '🎣',
    color: '#4ECDC4',
    desc: '手里同时养着好几条"鱼"，给每个人都勾勾搭搭，但谁都不认真。你以为的特别，ta 群发了',
    keywords: ['好几个', '暧昧', '同时', '聊天', '多人', '群发', '不专一', '社交广'],
    flagLabels: ['暧昧期同时跟好几个人聊', '只在深夜联系我', '从不在社交媒体提到我', '只聊暧昧但不确定关系'],
    advice: ['观察 ta 的朋友圈评论区：那些"你们好甜"可能不是只对你说', '如果约会后 ta 秒回了别人而已读了你，信号已经很明确', '你不是 ta 的备胎库存里最新入库的那个', '一对一才是感情，一对多那是海选'],
    soulQuote: '真正在乎你的人不会让你排队等候',
  },
  {
    name: '情绪寄生虫',
    emoji: '🧛',
    color: '#FF6B6B',
    desc: 'ta 只在需要情绪价值时出现，你是免费的树洞和充电宝。你难过时 ta 不在，ta 难过了你必须在',
    keywords: ['只找我', '倾诉', '树洞', '不关心', '索取', '消耗', '累'],
    flagLabels: ['只在深夜联系我', '聊天全靠我找话题', '从不主动约我', '许诺很多但从不兑现'],
    advice: ['下次 ta 来倾诉，问自己：你上次难过时，ta 在吗？', '你的情绪也需要有人接住，而不是永远做那个接别人的人', '你不欠任何人"随叫随到"', '学会说"我今天也挺累的"'],
    soulQuote: '好的关系是充电，不是耗电',
  },
];

/** 关系阶段（用于描述行为模式时的语境） */
const stageLabels = ['刚认识', '暧昧中', '确定关系', '在一起很久了', '已分手/冷战中'];

/* ============================================================
 *  分析引擎（本地 mock，可替换为 AI 接口）
 * ============================================================ */

interface DetectResult {
  score: number;             // 渣值 0-100
  light: 'red' | 'yellow' | 'green';
  mainPattern: Pattern;
  subPatterns: Pattern[];
  evidences: { text: string; severity: 'red' | 'yellow' | 'green' }[];
  stopLossAdvice: string[];
  soulQuote: string;
}

function analyzeFlags(checkedItems: FlagItem[]): DetectResult {
  const reds = checkedItems.filter(f => f.severity === 'red').length;
  const yellows = checkedItems.filter(f => f.severity === 'yellow').length;
  const greens = checkedItems.filter(f => f.severity === 'green').length;
  const rawScore = Math.min(100, reds * 14 + yellows * 7 + greens * 3);
  const score = Math.max(5, rawScore);

  // 匹配模式
  const scored = patterns.map(p => {
    let pts = 0;
    checkedItems.forEach(ci => { if (p.flagLabels.includes(ci.label)) pts += 3; });
    return { pattern: p, pts };
  }).filter(x => x.pts > 0).sort((a, b) => b.pts - a.pts);

  const mainPattern = scored[0]?.pattern ?? patterns[1]; // 默认面包屑
  const subPatterns = scored.slice(1, 3).map(s => s.pattern);

  // 证据链
  const evidences = checkedItems.map(ci => ({
    text: `${ci.emoji} ${ci.label}`,
    severity: ci.severity,
  }));

  const light: 'red' | 'yellow' | 'green' = score >= 60 ? 'red' : score >= 30 ? 'yellow' : 'green';

  return {
    score,
    light,
    mainPattern,
    subPatterns,
    evidences,
    stopLossAdvice: mainPattern.advice,
    soulQuote: mainPattern.soulQuote,
  };
}

function analyzeText(text: string): DetectResult {
  // 简单关键词匹配
  const matched: FlagItem[] = [];
  const lower = text.toLowerCase();
  flagChecklist.forEach(fi => {
    const parts = fi.label.replace(/ta/g, '').split(/[、，。！？\s]+/).filter(Boolean);
    if (parts.some(p => lower.includes(p))) matched.push(fi);
  });
  // 关键词补充
  const keywordFlags: { kw: string; item: FlagItem }[] = [
    { kw: '已读不回', item: flagChecklist[8] },
    { kw: '冷暴力', item: flagChecklist[6] },
    { kw: '消失', item: flagChecklist[6] },
    { kw: '深夜', item: flagChecklist[0] },
    { kw: '半夜', item: flagChecklist[0] },
    { kw: '贬低', item: flagChecklist[7] },
    { kw: '你想多了', item: flagChecklist[3] },
    { kw: '忽冷忽热', item: flagChecklist[2] },
    { kw: '暧昧', item: flagChecklist[14] },
    { kw: '不确定', item: flagChecklist[14] },
    { kw: '不回', item: flagChecklist[8] },
    { kw: '见朋友', item: flagChecklist[1] },
    { kw: '看手机', item: flagChecklist[5] },
    { kw: '前任', item: flagChecklist[2] },
    { kw: '吊着', item: flagChecklist[14] },
    { kw: '备胎', item: flagChecklist[4] },
    { kw: '海王', item: flagChecklist[4] },
    { kw: '回避', item: flagChecklist[15] },
    { kw: '逃避', item: flagChecklist[15] },
    { kw: '控制', item: flagChecklist[5] },
    { kw: '不主动', item: flagChecklist[9] },
    { kw: '说忙', item: flagChecklist[11] },
  ];
  keywordFlags.forEach(({ kw, item }) => {
    if (lower.includes(kw) && !matched.includes(item)) matched.push(item);
  });
  // 至少匹配 2 条，否则补充通用
  if (matched.length < 2) {
    matched.push(flagChecklist[10], flagChecklist[13]); // "聊天全靠我找话题", "许诺很多但从不兑现"
  }
  return analyzeFlags(matched);
}

/* ============================================================
 *  红绿灯视觉辅助
 * ============================================================ */
const lightConfig = {
  red:    { color: '#FF4444', bg: 'rgba(255,68,68,0.12)', border: 'rgba(255,68,68,0.3)', emoji: '🚨', label: '高危警报', desc: '多个严重红色信号，建议认真考虑止损' },
  yellow: { color: '#FFB800', bg: 'rgba(255,184,0,0.12)', border: 'rgba(255,184,0,0.3)', emoji: '⚠️', label: '黄灯警告', desc: '存在不健康的相处模式，需要保持警觉' },
  green:  { color: '#4ECDC4', bg: 'rgba(78,205,196,0.12)', border: 'rgba(78,205,196,0.3)', emoji: '✅', label: '基本正常', desc: '暂无明显危险信号，但仍需关注细节变化' },
};

/* ============================================================
 *  组件
 * ============================================================ */
export function RedFlagDetector({ delay = 0 }: { delay?: number }) {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<Mode>('行为勾选');

  /* 行为勾选 */
  const [checked, setChecked] = useState<Set<number>>(new Set());

  /* 描述行为 */
  const [descText, setDescText] = useState('');

  /* 粘贴聊天 */
  const [chatText, setChatText] = useState('');

  /* 通用 */
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setMode('行为勾选');
    setChecked(new Set());
    setDescText('');
    setChatText('');
    setAnalyzing(false);
    setResult(null);
    setCopied(false);
    setShow(true);
  };

  const toggleFlag = (idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleDetect = () => {
    setAnalyzing(true);
    setTimeout(() => {
      let r: DetectResult;
      if (mode === '行为勾选') {
        const items = Array.from(checked).map(i => flagChecklist[i]);
        r = analyzeFlags(items);
      } else {
        const text = mode === '描述行为' ? descText : chatText;
        r = analyzeText(text);
      }
      setResult(r);
      setAnalyzing(false);
    }, 1200);
  };

  const canDetect =
    (mode === '行为勾选' && checked.size >= 2) ||
    (mode === '描述行为' && descText.trim().length >= 10) ||
    (mode === '粘贴聊天' && chatText.trim().length >= 20);

  const handleCopyReport = () => {
    if (!result) return;
    const lc = lightConfig[result.light];
    const text = `⚡ 恋爱避雷报告\n${lc.emoji} ${lc.label} · 渣值 ${result.score}/100\n匹配模式：${result.mainPattern.emoji} ${result.mainPattern.name}\n\n证据链：\n${result.evidences.map(e => `  ${e.text}`).join('\n')}\n\n💡 止损建议：\n${result.stopLossAdvice.map((a, i) => `  ${i + 1}. ${a}`).join('\n')}\n\n"${result.soulQuote}"\n\n— FoxSay 恋爱避雷针`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ====== 入口按钮 ====== */}
      <motion.button
        className="flex items-center gap-3 p-4 text-left"
        style={{ background: '#453a60', borderRadius: 14 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        onClick={handleOpen}
      >
        <IconBubble size={42} bg={gradients.coral}><IcRadar size={20} color="#fff" /></IconBubble>
        <div className="flex-1 min-w-0">
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>恋爱避雷针</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>ta 是不是在玩你</span>
        </div>
      </motion.button>

      {/* ====== 面板 ====== */}
      <AnimatePresence>
        {show && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShow(false)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#352f45', borderRadius: '20px 20px 0 0', maxHeight: '90vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: '90vh' }}>

                {/* 顶栏 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconBubble size={32} bg={gradients.coral}><IcRadar size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>⚡ 恋爱避雷针</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>快速鉴别 ta 是不是在玩你</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShow(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* ====== 结果页面 ====== */}
                {result ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} ref={resultRef}>
                    {/* 红绿灯头部 */}
                    {(() => {
                      const lc = lightConfig[result.light];
                      return (
                        <div className="text-center mb-5 p-5 relative overflow-hidden" style={{ background: lc.bg, borderRadius: 20, border: `1px solid ${lc.border}` }}>
                          {/* 背景闪光 */}
                          <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${lc.color}11`, filter: 'blur(30px)' }} />
                          {/* 大灯 */}
                          <motion.div
                            style={{ fontSize: 64, filter: `drop-shadow(0 0 20px ${lc.color})`, marginBottom: 8 }}
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                            {result.light === 'red' ? '🔴' : result.light === 'yellow' ? '🟡' : '🟢'}
                          </motion.div>
                          {/* 渣值 */}
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <span style={{ color: lc.color, fontSize: 48, fontWeight: 900, textShadow: `0 0 24px ${lc.color}55`, lineHeight: 1 }}>{result.score}</span>
                            <div className="flex flex-col items-start">
                              <span style={{ color: lc.color, fontSize: 14, fontWeight: 700 }}>/100</span>
                              <span style={{ color: lc.color, fontSize: 11, opacity: 0.7 }}>渣值</span>
                            </div>
                          </div>
                          {/* 灯标签 */}
                          <span className="inline-block px-4 py-1.5 mb-2" style={{ background: `${lc.color}22`, borderRadius: 20, color: lc.color, fontSize: 14, fontWeight: 700, border: `1px solid ${lc.color}33` }}>
                            {lc.emoji} {lc.label}
                          </span>
                          <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, marginTop: 6 }}>{lc.desc}</p>
                        </div>
                      );
                    })()}

                    {/* 匹配模式 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: 15 }}>🔍</span>
                        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>匹配到的操控模式</span>
                      </div>
                      {/* 主模式 */}
                      <div className="p-4 mb-2" style={{ background: `${result.mainPattern.color}12`, borderRadius: 16, border: `1px solid ${result.mainPattern.color}33` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: 24 }}>{result.mainPattern.emoji}</span>
                          <div>
                            <span style={{ color: result.mainPattern.color, fontSize: 16, fontWeight: 800, display: 'block' }}>{result.mainPattern.name}</span>
                            <span className="inline-block px-2 py-0.5 mt-1" style={{ background: `${result.mainPattern.color}22`, borderRadius: 6, color: result.mainPattern.color, fontSize: 10, fontWeight: 600 }}>主要模式</span>
                          </div>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 13, lineHeight: 1.7 }}>{result.mainPattern.desc}</p>
                      </div>
                      {/* 副模式 */}
                      {result.subPatterns.length > 0 && (
                        <div className="flex gap-2">
                          {result.subPatterns.map((sp, i) => (
                            <div key={i} className="flex-1 p-3" style={{ background: '#453a60', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)' }}>
                              <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{sp.emoji}</span>
                              <span style={{ color: sp.color, fontSize: 12, fontWeight: 700 }}>{sp.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 证据链 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: 15 }}>📋</span>
                        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>关键证据链</span>
                        <span className="ml-auto" style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>{result.evidences.length} 条信号</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {result.evidences.map((ev, ei) => {
                          const sc = ev.severity === 'red' ? { color: '#FF4444', bg: 'rgba(255,68,68,0.08)', label: '🔴' }
                            : ev.severity === 'yellow' ? { color: '#FFB800', bg: 'rgba(255,184,0,0.08)', label: '🟡' }
                            : { color: '#4ECDC4', bg: 'rgba(78,205,196,0.08)', label: '🟢' };
                          return (
                            <motion.div key={ei} className="flex items-center gap-2.5 px-3 py-2.5"
                              style={{ background: sc.bg, borderRadius: 10 }}
                              initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ei * 0.04 }}>
                              <span style={{ fontSize: 10 }}>{sc.label}</span>
                              <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, flex: 1 }}>{ev.text}</span>
                              <span style={{ color: sc.color, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                                {ev.severity === 'red' ? '严重' : ev.severity === 'yellow' ? '注意' : '轻微'}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 止损建议 */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: 15 }}>💡</span>
                        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>止损建议</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {result.stopLossAdvice.map((adv, ai) => (
                          <div key={ai} className="flex items-start gap-3 p-3"
                            style={{ background: '#453a60', borderRadius: 12 }}>
                            <div className="flex items-center justify-center flex-shrink-0"
                              style={{ width: 22, height: 22, borderRadius: 7, background: 'rgba(110,231,183,0.15)' }}>
                              <span style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700 }}>{ai + 1}</span>
                            </div>
                            <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.65 }}>{adv}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 灵魂拷问 */}
                    <div className="mb-5 p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,138,128,0.08), rgba(155,126,222,0.08))', borderRadius: 16, border: '1px solid rgba(245,239,232,0.06)' }}>
                      <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>💭</span>
                      <p style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700, lineHeight: 1.7, fontStyle: 'italic' }}>
                        "{result.soulQuote}"
                      </p>
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11, display: 'block', marginTop: 8 }}>— FoxSay 恋爱避雷针</span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mb-3">
                      <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
                        style={{ background: gradients.coral, borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 700 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCopyReport}>
                        {copied ? <><Check size={15} /> 已复制报告</> : <><Copy size={15} /> 复制分享</>}
                      </motion.button>
                      <motion.button className="py-3.5 px-5 flex items-center justify-center gap-2"
                        style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setResult(null)}>
                        🔄 重测
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  /* ====== 输入页面 ====== */
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* 模式切换 */}
                    <div className="flex gap-1 mb-5 p-1" style={{ background: '#2b2535', borderRadius: 12 }}>
                      {modes.map(m => (
                        <button key={m} className="flex-1 py-2 text-center"
                          style={{
                            borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                            background: mode === m ? 'rgba(255,138,128,0.15)' : 'transparent',
                            color: mode === m ? '#FF8A80' : 'rgba(245,239,232,0.5)',
                          }}
                          onClick={() => { setMode(m); setResult(null); }}>
                          {m}
                        </button>
                      ))}
                    </div>

                    {/* ====== 行为勾选 ====== */}
                    {mode === '行为勾选' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ fontSize: 14 }}>📋</span>
                          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>ta 有以下行为吗？</span>
                          <span className="ml-auto" style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>已选 {checked.size} 项</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginBottom: 12 }}>请选择 2 项以上 ta 的行为（选得越多越准）</p>

                        {/* 红色区域 */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span style={{ fontSize: 10 }}>🔴</span>
                            <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 700 }}>高危信号</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {flagChecklist.filter(f => f.severity === 'red').map((fi) => {
                              const idx = flagChecklist.indexOf(fi);
                              const isChecked = checked.has(idx);
                              return (
                                <motion.button key={idx} className="flex items-center gap-2.5 px-3 py-2.5 text-left"
                                  style={{
                                    borderRadius: 10,
                                    background: isChecked ? 'rgba(255,68,68,0.12)' : 'rgba(245,239,232,0.03)',
                                    border: isChecked ? '1px solid rgba(255,68,68,0.3)' : '1px solid rgba(245,239,232,0.06)',
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => toggleFlag(idx)}>
                                  <div className="flex items-center justify-center flex-shrink-0"
                                    style={{
                                      width: 20, height: 20, borderRadius: 6,
                                      background: isChecked ? '#FF4444' : 'rgba(245,239,232,0.08)',
                                      transition: 'all 0.2s',
                                    }}>
                                    {isChecked && <Check size={12} color="#fff" />}
                                  </div>
                                  <span style={{ fontSize: 14 }}>{fi.emoji}</span>
                                  <span style={{ color: isChecked ? '#FF8A80' : 'rgba(245,239,232,0.7)', fontSize: 13, fontWeight: isChecked ? 600 : 400 }}>{fi.label}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 黄色区域 */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span style={{ fontSize: 10 }}>🟡</span>
                            <span style={{ color: '#FFB800', fontSize: 11, fontWeight: 700 }}>需注意</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {flagChecklist.filter(f => f.severity === 'yellow').map((fi) => {
                              const idx = flagChecklist.indexOf(fi);
                              const isChecked = checked.has(idx);
                              return (
                                <motion.button key={idx} className="flex items-center gap-2.5 px-3 py-2.5 text-left"
                                  style={{
                                    borderRadius: 10,
                                    background: isChecked ? 'rgba(255,184,0,0.1)' : 'rgba(245,239,232,0.03)',
                                    border: isChecked ? '1px solid rgba(255,184,0,0.25)' : '1px solid rgba(245,239,232,0.06)',
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => toggleFlag(idx)}>
                                  <div className="flex items-center justify-center flex-shrink-0"
                                    style={{
                                      width: 20, height: 20, borderRadius: 6,
                                      background: isChecked ? '#FFB800' : 'rgba(245,239,232,0.08)',
                                      transition: 'all 0.2s',
                                    }}>
                                    {isChecked && <Check size={12} color="#fff" />}
                                  </div>
                                  <span style={{ fontSize: 14 }}>{fi.emoji}</span>
                                  <span style={{ color: isChecked ? '#FFD93D' : 'rgba(245,239,232,0.7)', fontSize: 13, fontWeight: isChecked ? 600 : 400 }}>{fi.label}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 绿色区域 */}
                        <div className="mb-5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <span style={{ fontSize: 10 }}>🟢</span>
                            <span style={{ color: '#4ECDC4', fontSize: 11, fontWeight: 700 }}>轻度信号</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {flagChecklist.filter(f => f.severity === 'green').map((fi) => {
                              const idx = flagChecklist.indexOf(fi);
                              const isChecked = checked.has(idx);
                              return (
                                <motion.button key={idx} className="flex items-center gap-2.5 px-3 py-2.5 text-left"
                                  style={{
                                    borderRadius: 10,
                                    background: isChecked ? 'rgba(78,205,196,0.1)' : 'rgba(245,239,232,0.03)',
                                    border: isChecked ? '1px solid rgba(78,205,196,0.25)' : '1px solid rgba(245,239,232,0.06)',
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => toggleFlag(idx)}>
                                  <div className="flex items-center justify-center flex-shrink-0"
                                    style={{
                                      width: 20, height: 20, borderRadius: 6,
                                      background: isChecked ? '#4ECDC4' : 'rgba(245,239,232,0.08)',
                                      transition: 'all 0.2s',
                                    }}>
                                    {isChecked && <Check size={12} color="#fff" />}
                                  </div>
                                  <span style={{ fontSize: 14 }}>{fi.emoji}</span>
                                  <span style={{ color: isChecked ? '#6ee7b7' : 'rgba(245,239,232,0.7)', fontSize: 13, fontWeight: isChecked ? 600 : 400 }}>{fi.label}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ====== 描述行为 ====== */}
                    {mode === '描述行为' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ fontSize: 14 }}>✏️</span>
                          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>描述 ta 的行为</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginBottom: 12 }}>
                          用你的话描述 ta 让你不舒服的行为，越具体越准
                        </p>
                        <textarea
                          value={descText}
                          onChange={e => setDescText(e.target.value)}
                          placeholder={'例如：\n我们暧昧了三个月了，ta 从来不主动找我，但每次我找 ta 都秒回。已读不回的时候朋友圈倒是更新得很勤快。说过很多次要带我出去玩但一次都没实现过...'}
                          rows={7}
                          style={{
                            width: '100%', padding: 16, background: '#453a60', borderRadius: 14,
                            border: '1px solid rgba(245,239,232,0.08)', color: '#f5efe8', fontSize: 14,
                            lineHeight: 1.7, resize: 'none', outline: 'none',
                          }}
                        />
                        <div className="flex justify-end mt-2 mb-5">
                          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11 }}>{descText.length} 字｜至少 10 字</span>
                        </div>
                      </motion.div>
                    )}

                    {/* ====== 粘贴聊天 ====== */}
                    {mode === '粘贴聊天' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ fontSize: 14 }}>💬</span>
                          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>粘贴聊天记录</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginBottom: 12 }}>
                          粘贴你们的聊天内容，AI 会自动识别危险信号
                        </p>
                        <textarea
                          value={chatText}
                          onChange={e => setChatText(e.target.value)}
                          placeholder={'粘贴聊天记录到这里...\n\n支持微信、QQ 等聊天记录的文本格式'}
                          rows={9}
                          style={{
                            width: '100%', padding: 16, background: '#453a60', borderRadius: 14,
                            border: '1px solid rgba(245,239,232,0.08)', color: '#f5efe8', fontSize: 14,
                            lineHeight: 1.7, resize: 'none', outline: 'none',
                          }}
                        />
                        <div className="flex justify-end mt-2 mb-5">
                          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11 }}>{chatText.length} 字｜至少 20 字</span>
                        </div>
                      </motion.div>
                    )}

                    {/* 检测按钮 */}
                    <motion.button
                      className="w-full py-4 flex items-center justify-center gap-2 mb-3"
                      style={{
                        background: canDetect ? gradients.coral : 'rgba(245,239,232,0.06)',
                        borderRadius: 14, color: canDetect ? '#fff' : 'rgba(245,239,232,0.3)',
                        fontSize: 16, fontWeight: 700,
                        boxShadow: canDetect ? '0 4px 20px rgba(255,107,107,0.3)' : 'none',
                      }}
                      whileTap={canDetect ? { scale: 0.97 } : {}}
                      onClick={canDetect ? handleDetect : undefined}
                      disabled={!canDetect || analyzing}
                    >
                      {analyzing ? (
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                          🔍
                        </motion.span>
                      ) : (
                        <>⚡ 开始检测</>
                      )}
                    </motion.button>

                    {/* 免责声明 */}
                    <p style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10, textAlign: 'center', lineHeight: 1.6 }}>
                      仅供参考，请结合实际情况理性判断
                    </p>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
