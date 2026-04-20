/**
 * VIP 恋商周报总览 — FFLite 及以上会员可查看
 * 3大模块：总览仪表盘 · 维度对比分析 · 场景洞察
 */
import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUp, ArrowDown, Crown } from 'lucide-react';
import { IconBubble, IcChat, IcHeart, IcEye, IcChart, IcShield, gradients } from './CuteIcons';

/* ================================================================
 *  常量 & 维度定义
 * ================================================================ */
const DIM = [
  { key: 'opener', label: '开场白', icon: <IcChat size={16} color="#fff" />, bg: gradients.coral, color: '#FF8A80', emoji: '💬' },
  { key: 'empathy', label: '共情力', icon: <IcHeart size={16} color="#fff" />, bg: gradients.rose, color: '#EC407A', emoji: '❤️' },
  { key: 'observe', label: '观察力', icon: <IcEye size={16} color="#fff" />, bg: gradients.sky, color: '#4FC3F7', emoji: '👁️' },
  { key: 'topic', label: '话题力', icon: <IcChart size={16} color="#fff" />, bg: gradients.mint, color: '#4ECDC4', emoji: '💡' },
  { key: 'safety', label: '安全感', icon: <IcShield size={16} color="#fff" />, bg: gradients.purple, color: '#9B7EDE', emoji: '🛡️' },
];
const dimMap: Record<string, string> = { opener: '开场白', empathy: '共情力', observe: '观察力', topic: '话题力', safety: '安全感' };

/* 历史周数据（模拟4周趋势） */
const weekHistory = [
  { opener: 72, empathy: 76, observe: 70, topic: 78, safety: 65 },
  { opener: 76, empathy: 80, observe: 74, topic: 82, safety: 68 },
  { opener: 80, empathy: 84, observe: 78, topic: 85, safety: 72 },
  // 第4周 = 当前周，由 props 传入
];

/* 场景表现数据 */
const scenePerformance = [
  { scene: '咖啡馆初遇', icon: '☕', score: 88, bestDim: 'opener', comment: '开场表现出色，自然不做作', grade: 'A' },
  { scene: '浪漫晚餐约会', icon: '🍷', score: 82, bestDim: 'topic', comment: '话题切换流畅，气氛控制好', grade: 'A-' },
  { scene: '公园午后漫步', icon: '🌿', score: 75, bestDim: 'empathy', comment: '共情到位，但安全感表达不足', grade: 'B+' },
  { scene: '书店偶遇', icon: '📚', score: 70, bestDim: 'observe', comment: '观察力发挥不稳定，建议多练', grade: 'B' },
  { scene: '健身房邂逅', icon: '💪', score: 65, bestDim: 'safety', comment: '场景较陌生，需要更多练习', grade: 'B-' },
];

/* 恋爱人格标签 */
const personalityTags = [
  { tag: '温暖治愈系', color: '#FF8A80', desc: '你的对话风格偏暖系，擅长让人放松' },
  { tag: '话题掌控者', color: '#4ECDC4', desc: '你能自然地引导对话方向' },
  { tag: '细节观察家', color: '#4FC3F7', desc: '你善于注意和回应对方的小细节' },
];

/* 社区排名数据 */
const communityRank = { percentile: 82, totalUsers: 12580, rank: 2264, tierLabel: '恋商达人' };

/* ================================================================
 *  数据生成函数
 * ================================================================ */
function generateComparison(current: Record<string, number>) {
  return Object.entries(current).map(([key, val]) => {
    const last = weekHistory[2]?.[key as keyof typeof weekHistory[0]] || val;
    return { key, label: dimMap[key], current: val, last, change: val - last };
  });
}

/* ================================================================
 *  小型雷达图（用于总览仪表盘）
 * ================================================================ */
function MiniRadar({ scores }: { scores: Record<string, number> }) {
  const gid = useId();
  const pad = 22;
  const inner = 180, size = inner + pad * 2, cx = size / 2, cy = size / 2, maxR = 68;
  const keys = Object.keys(scores);
  const getP = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    const r = (v / 100) * maxR;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const grid = [25, 50, 75, 100].map(v => keys.map((_, i) => getP(i, v)).map(p => `${p.x},${p.y}`).join(' '));
  const dataPts = keys.map((k, i) => getP(i, scores[k]));
  const dataPoly = dataPts.map(p => `${p.x},${p.y}`).join(' ');
  const labelPos = keys.map((_, i) => {
    const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    return { x: cx + (maxR + 20) * Math.cos(a), y: cy + (maxR + 20) * Math.sin(a) };
  });
  return (
    <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto', maxWidth: size }}>
      <defs>
        <radialGradient id={`${gid}-rg`}><stop offset="0%" stopColor="#9B7EDE" stopOpacity="0.4" /><stop offset="100%" stopColor="#9B7EDE" stopOpacity="0.05" /></radialGradient>
      </defs>
      {grid.map((pts, i) => <polygon key={i} points={pts} fill="none" stroke="rgba(245,239,232,0.08)" strokeWidth={0.6} />)}
      {keys.map((_, i) => <line key={i} x1={cx} y1={cy} x2={getP(i, 100).x} y2={getP(i, 100).y} stroke="rgba(245,239,232,0.06)" strokeWidth={0.5} />)}
      <polygon points={dataPoly} fill={`url(#${gid}-rg)`} stroke="#9B7EDE" strokeWidth={1.5} />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#B39DDB" />)}
      {labelPos.map((p, i) => (
        <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: 'rgba(245,239,232,0.6)', fontSize: 9, fontWeight: 600 }}>{dimMap[keys[i]]}</text>
      ))}
    </svg>
  );
}

/* ================================================================
 *  主组件
 * ================================================================ */
const tierLabels: Record<string, string> = { lite: 'FF Lite', pro: 'FF Pro', proplus: 'FF Pro+' };

interface Props {
  onClose: () => void;
  radarData: Array<{ label: string; value: number; trend: string; change: number }>;
  subTier?: string | null;
}

export function WeeklyReportFull({ onClose, radarData, subTier }: Props) {
  const [activeSection, setActiveSection] = useState(0);

  const scores: Record<string, number> = {
    opener: radarData[0]?.value || 85,
    empathy: radarData[1]?.value || 92,
    observe: radarData[2]?.value || 78,
    topic: radarData[3]?.value || 88,
    safety: radarData[4]?.value || 70,
  };
  const avg = Math.round(Object.values(scores).reduce((s, v) => s + v, 0) / 5);
  const prevAvg = Math.round(Object.values(weekHistory[2]).reduce((s, v) => s + v, 0) / 5);

  const comparison = generateComparison(scores);

  const sections = [
    { label: '总览', icon: '📊' },
    { label: '对比', icon: '📈' },
    { label: '洞察', icon: '🔮' },
  ];

  return (
    <motion.div className="fixed inset-0 z-[120] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <motion.div className="relative mt-6 mx-auto w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 430, borderRadius: '20px 20px 0 0', maxHeight: 'calc(100vh - 24px)', flex: 1, background: '#2b2535' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}>

        {/* ── Header ── */}
        <div className="px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9B7EDE, #7B61C1)' }}>
                <Crown size={16} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>恋商深度周报</span>
                  <span className="px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: 'rgba(155,126,222,0.2)', color: '#B39DDB', borderRadius: 4 }}>{tierLabels[subTier || ''] || 'VIP'}</span>
                </div>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>周报总览 · 数据对比 · 场景洞察</span>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,239,232,0.08)' }}>
              <X size={18} color="rgba(245,239,232,0.5)" />
            </motion.button>
          </div>

          {/* Section tabs — 居中 */}
          <div className="flex justify-center gap-1 p-1" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
            {sections.map((s, i) => (
              <motion.button key={i} className="flex-1 flex items-center justify-center gap-1 py-2"
                style={{
                  borderRadius: 8,
                  background: activeSection === i ? 'rgba(155,126,222,0.2)' : 'transparent',
                  border: activeSection === i ? '1px solid rgba(155,126,222,0.3)' : '1px solid transparent',
                }}
                whileTap={{ scale: 0.97 }} onClick={() => setActiveSection(i)}>
                <span style={{ fontSize: 12 }}>{s.icon}</span>
                <span style={{ color: activeSection === i ? '#B39DDB' : 'rgba(245,239,232,0.45)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence mode="wait">

            {/* ═══════════ Tab 0: 总览仪表盘 ═══════════ */}
            {activeSection === 0 && (
              <motion.div key="overview" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                {/* 核心分数卡 */}
                <div className="mb-4 p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(155,126,222,0.15), rgba(78,205,196,0.08))', borderRadius: 16, border: '1px solid rgba(155,126,222,0.15)' }}>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>综合恋商指数</span>
                  <motion.span style={{ color: '#f5efe8', fontSize: 42, fontWeight: 800, display: 'block', lineHeight: 1 }}
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                    {avg}
                  </motion.span>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {avg >= prevAvg ? <ArrowUp size={12} color="#4ECDC4" /> : <ArrowDown size={12} color="#FF8A80" />}
                    <span style={{ color: avg >= prevAvg ? '#4ECDC4' : '#FF8A80', fontSize: 12, fontWeight: 600 }}>
                      较上周{avg >= prevAvg ? '+' : ''}{avg - prevAvg}分
                    </span>
                  </div>
                </div>

                {/* 练习数据概览 */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: '💪', value: '12', label: '练习次数', color: '#FF8A80' },
                    { icon: '🔥', value: '7天', label: '连续打卡', color: '#FFD93D' },
                    { icon: '⭐', value: '+180', label: '获得XP', color: '#4ECDC4' },
                    { icon: '⏱', value: '3.2h', label: '练习时长', color: '#B39DDB' },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2.5" style={{ background: '#453a60', borderRadius: 10 }}>
                      <span style={{ fontSize: 18, display: 'block', marginBottom: 2 }}>{s.icon}</span>
                      <span style={{ color: s.color, fontSize: 15, fontWeight: 800, display: 'block' }}>{s.value}</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 9 }}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* 雷达图 */}
                <div className="mb-4 p-3" style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 14, border: '1px solid rgba(245,239,232,0.06)' }}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span style={{ fontSize: 12 }}>🎯</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>能力雷达图</span>
                  </div>
                  <MiniRadar scores={scores} />
                  {/* 5维度数值 */}
                  <div className="grid grid-cols-5 gap-2 mt-3 px-1">
                    {DIM.map(d => (
                      <div key={d.key} className="text-center">
                        <span style={{ color: d.color, fontSize: 15, fontWeight: 700, display: 'block' }}>{scores[d.key]}</span>
                        <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10, display: 'block', marginTop: 2, whiteSpace: 'nowrap' }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 社区排名 */}
                <div className="mb-4 p-3.5 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(255,217,61,0.08), rgba(255,138,128,0.06))', borderRadius: 12, border: '1px solid rgba(255,217,61,0.12)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FFD93D, #FF8A80)' }}>
                    <span style={{ fontSize: 20 }}>🏆</span>
                  </div>
                  <div className="flex-1">
                    <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700, display: 'block' }}>超越 {communityRank.percentile}% 的用户</span>
                    <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>全站 {communityRank.totalUsers.toLocaleString()} 用户中排名第 {communityRank.rank.toLocaleString()}</span>
                  </div>
                  <span className="px-2 py-1" style={{ background: 'rgba(255,217,61,0.15)', borderRadius: 6, color: '#FFD93D', fontSize: 10, fontWeight: 700 }}>{communityRank.tierLabel}</span>
                </div>

                {/* 人格标签 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span style={{ fontSize: 12 }}>🧬</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>你的恋爱人格标签</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {personalityTags.map((t, i) => (
                      <motion.div key={i} className="px-3 py-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        style={{ background: `${t.color}12`, border: `1px solid ${t.color}25`, borderRadius: 10 }}>
                        <span style={{ color: t.color, fontSize: 12, fontWeight: 600, display: 'block' }}>{t.tag}</span>
                        <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10 }}>{t.desc}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 4周趋势折线（简化的文字版） */}
                <div className="p-3.5" style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 12 }}>📈</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>4周成长曲线</span>
                  </div>
                  <div className="flex items-end justify-between gap-2" style={{ height: 80 }}>
                    {[...weekHistory, scores].map((w, wi) => {
                      const wAvg = Math.round(Object.values(w).reduce((s, v) => s + v, 0) / 5);
                      const h = Math.max(10, (wAvg / 100) * 70);
                      const isCurrent = wi === 3;
                      return (
                        <div key={wi} className="flex-1 flex flex-col items-center gap-1">
                          <span style={{ color: isCurrent ? '#B39DDB' : 'rgba(245,239,232,0.5)', fontSize: 10, fontWeight: isCurrent ? 700 : 400 }}>{wAvg}</span>
                          <motion.div style={{
                            width: '100%', maxWidth: 40, borderRadius: 6,
                            background: isCurrent ? 'linear-gradient(180deg, #9B7EDE, #7B61C1)' : 'rgba(245,239,232,0.08)',
                          }} initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 0.5, delay: wi * 0.1 }} />
                          <span style={{ color: isCurrent ? '#B39DDB' : 'rgba(245,239,232,0.35)', fontSize: 9 }}>
                            {isCurrent ? '本周' : `第${wi + 1}周`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════ Tab 1: 维度对比分析 ═══════════ */}
            {activeSection === 1 && (
              <motion.div key="compare" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                {/* 本周 vs 上周 总分 */}
                <div className="mb-4 p-3.5 flex items-center justify-around" style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)' }}>
                  <div className="text-center">
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, display: 'block' }}>上周均分</span>
                    <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 22, fontWeight: 700 }}>{prevAvg}</span>
                  </div>
                  <div className="text-center px-4">
                    <span style={{ color: avg >= prevAvg ? '#4ECDC4' : '#FF8A80', fontSize: 20, fontWeight: 800 }}>
                      {avg >= prevAvg ? '↑' : '↓'} {Math.abs(avg - prevAvg)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, display: 'block' }}>本周均分</span>
                    <span style={{ color: '#B39DDB', fontSize: 22, fontWeight: 700 }}>{avg}</span>
                  </div>
                </div>

                {/* 逐维度对比 */}
                {comparison.map((item, i) => {
                  const pct = Math.max(0, Math.min(100, item.current));
                  const lastPct = Math.max(0, Math.min(100, item.last));
                  const dim = DIM.find(d => d.key === item.key);
                  return (
                    <motion.div key={item.key} className="mb-3 p-3.5" style={{
                      background: 'rgba(245,239,232,0.04)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)',
                    }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          {dim && <IconBubble size={24} bg={dim.bg}>{dim.icon}</IconBubble>}
                          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>{item.last}</span>
                          <span style={{ color: 'rgba(245,239,232,0.25)' }}>→</span>
                          <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>{item.current}</span>
                          <span className="px-1.5 py-0.5" style={{
                            fontSize: 10, fontWeight: 600, borderRadius: 4,
                            background: item.change > 0 ? 'rgba(78,205,196,0.15)' : item.change < 0 ? 'rgba(255,138,128,0.15)' : 'rgba(245,239,232,0.08)',
                            color: item.change > 0 ? '#4ECDC4' : item.change < 0 ? '#FF8A80' : 'rgba(245,239,232,0.4)',
                          }}>{item.change > 0 ? `+${item.change}` : item.change === 0 ? '持平' : item.change}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9, width: 28 }}>本周</span>
                          <div className="flex-1" style={{ height: 6, borderRadius: 3, background: 'rgba(245,239,232,0.06)' }}>
                            <motion.div style={{ height: '100%', borderRadius: 3, background: dim?.color || '#9B7EDE' }}
                              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9, width: 28 }}>上周</span>
                          <div className="flex-1" style={{ height: 6, borderRadius: 3, background: 'rgba(245,239,232,0.06)' }}>
                            <motion.div style={{ height: '100%', borderRadius: 3, background: 'rgba(245,239,232,0.15)' }}
                              initial={{ width: 0 }} animate={{ width: `${lastPct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* 各维度百分位排名 */}
                <div className="mt-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 12 }}>👥</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>与全站用户对比</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {DIM.map((d, i) => {
                      const pct = Math.min(99, Math.round(scores[d.key] * 0.95 + 5));
                      return (
                        <motion.div key={d.key} className="text-center p-2.5 flex flex-col items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                          style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 10, border: '1px solid rgba(245,239,232,0.04)' }}>
                          <span style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>{d.emoji}</span>
                          <span style={{ color: d.color, fontSize: 12, fontWeight: 700, display: 'block', whiteSpace: 'nowrap' }}>Top</span>
                          <span style={{ color: d.color, fontSize: 14, fontWeight: 800, display: 'block', lineHeight: 1.2 }}>{100 - pct}%</span>
                          <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10, marginTop: 4, display: 'block', whiteSpace: 'nowrap' }}>{d.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 整体趋势总结 */}
                <div className="p-4" style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.08), rgba(155,126,222,0.08))', borderRadius: 14, border: '1px solid rgba(78,205,196,0.12)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 14 }}>📊</span>
                    <span style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600 }}>整体趋势</span>
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12, lineHeight: 1.6 }}>
                    {(() => {
                      const tc = comparison.reduce((s, c) => s + c.change, 0);
                      const ups = comparison.filter(c => c.change > 0).length;
                      if (tc > 5) return `本周全面进步！${ups} 个维度上升，综合恋商 ${avg} 分（+${tc}点）。你的努力正在快速转化为实力，继续保持！`;
                      if (tc > 0) return `本周稳步成长，${ups} 个维度上升，综合恋商 ${avg} 分（+${tc}点）。持续练习，量变终会带来质变。`;
                      if (tc === 0) return `本周综合恋商 ${avg} 分与上周持平。尝试加大练习强度，挑战更高难度场景。`;
                      return `本周综合恋商 ${avg} 分（${tc}点波动），属于正常调整期。保持心态，下周回归上升通道。`;
                    })()}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ═══════════ Tab 2: 场景洞察 & 下周规划 ═══════════ */}
            {activeSection === 2 && (
              <motion.div key="insight" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                {/* 场景表现排名 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 13 }}>🎬</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>场景表现排名</span>
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10, marginLeft: 'auto' }}>本周练习场景</span>
                  </div>
                  {scenePerformance.map((sp, i) => (
                    <motion.div key={i} className="flex items-center gap-3 p-3 mb-2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10, border: '1px solid rgba(245,239,232,0.06)' }}>
                      <span style={{ fontSize: 22 }}>{sp.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>{sp.scene}</span>
                          <span className="px-1.5 py-0.5" style={{
                            fontSize: 9, fontWeight: 700, borderRadius: 4,
                            background: sp.score >= 85 ? 'rgba(78,205,196,0.15)' : sp.score >= 75 ? 'rgba(255,217,61,0.15)' : 'rgba(255,138,128,0.12)',
                            color: sp.score >= 85 ? '#4ECDC4' : sp.score >= 75 ? '#FFD93D' : '#FF8A80',
                          }}>{sp.grade}</span>
                        </div>
                        <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10 }}>{sp.comment}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700, display: 'block' }}>{sp.score}</span>
                        <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9 }}>优势：{dimMap[sp.bestDim]}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI 推荐下周场景 */}
                <div className="mb-4 p-4" style={{ background: 'linear-gradient(135deg, rgba(155,126,222,0.1), rgba(255,138,128,0.06))', borderRadius: 14, border: '1px solid rgba(155,126,222,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 14 }}>🤖</span>
                    <span style={{ color: '#B39DDB', fontSize: 13, fontWeight: 700 }}>AI 推荐下周重点场景</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { icon: '💪', name: '健身房邂逅', reason: '安全感提升场' },
                      { icon: '📚', name: '书店偶遇', reason: '观察力训练场' },
                    ].map((s, i) => (
                      <div key={i} className="flex-1 p-3 text-center" style={{ background: 'rgba(245,239,232,0.05)', borderRadius: 10 }}>
                        <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{s.icon}</span>
                        <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600, display: 'block' }}>{s.name}</span>
                        <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10 }}>{s.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 恋爱心理洞察 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 13 }}>🧠</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>恋爱心理洞察</span>
                  </div>
                  {[
                    { title: '沟通偏好', icon: '💬', desc: '你倾向于用温暖的方式开启对话，但在深层情感表达时稍显犹豫。建议逐步练习"脆弱表达"，展示真实的自己。', color: '#FF8A80' },
                    { title: '社交节奏', icon: '⏰', desc: '你的对话节奏偏中等，适合大多数社交场合。可以尝试在熟悉的人面前放慢节奏，在陌生人面前稍微加快。', color: '#4ECDC4' },
                    { title: '情感投入', icon: '❤️', desc: '你在对话中的情感投入度适中，给人温暖但不压迫的感觉。这是一个很好的平衡点，继续保持。', color: '#B39DDB' },
                  ].map((insight, i) => (
                    <motion.div key={i} className="mb-2.5 p-3.5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ background: `${insight.color}08`, borderRadius: 12, border: `1px solid ${insight.color}18` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ fontSize: 14 }}>{insight.icon}</span>
                        <span style={{ color: insight.color, fontSize: 12, fontWeight: 700 }}>{insight.title}</span>
                      </div>
                      <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: 11, lineHeight: 1.7 }}>{insight.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* 下周目标 */}
                <div className="p-4" style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.08), rgba(255,217,61,0.06))', borderRadius: 14, border: '1px solid rgba(78,205,196,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span style={{ fontSize: 14 }}>🏁</span>
                    <span style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 700 }}>下周目标</span>
                  </div>
                  {[
                    { goal: `综合恋商突破 ${avg + 3} 分`, tag: '核心', tagColor: '#B39DDB' },
                    { goal: `${dimMap[Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0]]}提升至 ${Object.entries(scores).sort((a, b) => a[1] - b[1])[0][1] + 8} 分`, tag: '重点', tagColor: '#FF8A80' },
                    { goal: '完成 15 次场景练习', tag: '练习', tagColor: '#4ECDC4' },
                    { goal: '连续打卡 7 天', tag: '习惯', tagColor: '#FFD93D' },
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `1.5px solid ${g.tagColor}40` }}>
                        <span style={{ color: g.tagColor, fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                      </div>
                      <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 12, flex: 1 }}>{g.goal}</span>
                      <span className="px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 600, borderRadius: 4, background: `${g.tagColor}18`, color: g.tagColor }}>{g.tag}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
