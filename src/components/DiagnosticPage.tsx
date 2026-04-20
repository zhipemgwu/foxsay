import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { IconBubble, IcChat, IcHeart, IcEye, IcChart, IcShield, IcLightbulb, IcTarget, IcBook, IcSparkle, IcRadar, gradients } from './CuteIcons';
import { KeyboardPromoBanner } from './KeyboardPromoBanner';
import { useUser } from '../context/UserContext';
import DeepSpeciesTest from './DeepSpeciesTest';
import { WeeklyReportFull } from './WeeklyReportFull';
import { VIPPage } from './VIPPage';

const radarMeta = [
  { key: 'opener',  label: '开场白', icon: <IcChat size={18} color="#fff" />, bg: gradients.coral, barColor: ['#FF8A80', '#FFB199'], tips: '你的开场白越来越自然了，建议多尝试不同风格。' },
  { key: 'empathy', label: '共情力', icon: <IcHeart size={18} color="#fff" />, bg: gradients.rose, barColor: ['#EC407A', '#F48FB1'], tips: '共情力是你的强项！继续保持真诚的倾听态度。' },
  { key: 'observe', label: '观察力', icon: <IcEye size={18} color="#fff" />, bg: gradients.sky, barColor: ['#4FC3F7', '#81D4FA'], tips: '试着多注意对方的微表情和肢体语言。' },
  { key: 'topic',   label: '话题力', icon: <IcChart size={18} color="#fff" />, bg: gradients.mint, barColor: ['#4ECDC4', '#80CBC4'], tips: '话题延展不错，建议积累更多有趣的话题库。' },
  { key: 'safety',  label: '安全感', icon: <IcShield size={18} color="#fff" />, bg: gradients.purple, barColor: ['#9B7EDE', '#B39DDB'], tips: '安全感建设需要时间，保持一致性和可靠性。' },
];

/** 根据用户 abilityScores 生成动态 radarData */
function buildRadarData(abilityScores: Record<string, number> | null) {
  const defaults: Record<string, number> = { opener: 25, empathy: 25, observe: 25, topic: 25, safety: 25 };
  const scores = abilityScores || defaults;
  return radarMeta.map(m => ({
    ...m,
    value: scores[m.key] ?? defaults[m.key],
    trend: 'flat' as const,
    change: 0,
  }));
}

const weeklyHistory = [
  { week: '第1周', score: 65 },
  { week: '第2周', score: 70 },
  { week: '第3周', score: 74 },
  { week: '第4周', score: 78 },
  { week: '第5周', score: 82 },
];

const aiSuggestions = [
  { icon: <IcShield size={20} color="#fff" />, bg: gradients.purpleSoft, title: '提升安全感表达', desc: '练习在对话中传递稳定和可靠的感觉', action: '去练习' },
  { icon: <IcEye size={20} color="#fff" />, bg: gradients.skySoft, title: '观察力专项训练', desc: '学习解读微表情和肢体语言', action: '去练习' },
  { icon: <IcBook size={20} color="#fff" />, bg: gradients.mintSoft, title: '话题库扩展', desc: '收集20个有趣的深度话题', action: '查看' },
];

/* ========================================
 *  恋爱物种鉴定 — 数据 & 组件
 * ======================================== */
const traitData = [
  { label: '嘴替指数', value: 72, color: '#FF8A80', icon: '💬', desc: '替所有人说完想说的话' },
  { label: '心软指数', value: 58, color: '#B39DDB', icon: '🫠', desc: '一秒被攻破的豆腐心' },
  { label: '抖包袱值', value: 45, color: '#FFD93D', icon: '😆', desc: '行走的快乐制造机' },
  { label: '树洞指数', value: 80, color: '#4ECDC4', icon: '🕳️', desc: '让人想说完所有秘密' },
  { label: '救场指数', value: 63, color: '#81D4FA', icon: '⚡', desc: '冷场克星·名场面制造' },
  { label: '整活指数', value: 35, color: '#F48FB1', icon: '🎪', desc: '突然浪漫不讲道理' },
];

const loveSpecies = [
  // 🔥 疯狂输出组
  { id: 'haiwanghu',  emoji: '🦊', name: '海王狐', camp: '疯狂输出组', campIcon: '🔥', desc: '鱼塘太大管不过来了', soulQuote: '你不是花心，你只是每条鱼都真心喜欢', avatar: '/species/haiwanghu.jpg', color: '#1B9CFC', bg: 'linear-gradient(135deg, #1B9CFC 0%, #25CCF7 100%)' },
  { id: 'tiantianhu', emoji: '🦊', name: '舔舔狐', camp: '疯狂输出组', campIcon: '🔥', desc: '你骂我我都说好的亲亲', soulQuote: '你以为的真诚，在对方眼里叫廉价', avatar: '/species/tiantianhu.jpg', color: '#FF9FF3', bg: 'linear-gradient(135deg, #FF9FF3 0%, #f368e0 100%)' },
  { id: 'laosihu',    emoji: '🦊', name: '老司狐', camp: '疯狂输出组', campIcon: '🔥', desc: '开车从不翻车，就是乘客换得勤', soulQuote: '技术越好越孤独，因为没人敢上你的车', avatar: '/species/laosihu.jpg', color: '#c23616', bg: 'linear-gradient(135deg, #c23616 0%, #e84118 100%)' },
  // 💀 已读不回组
  { id: 'zhuangsihu', emoji: '🦊', name: '装死狐', camp: '已读不回组', campIcon: '💀', desc: '恋爱？先让我死一会儿', soulQuote: '你不是不心动，你只是害怕心动之后的剧情', avatar: '/species/zhuangsihu.jpg', color: '#8c7ae6', bg: 'linear-gradient(135deg, #8c7ae6 0%, #9c88ff 100%)' },
  { id: 'songsonghu', emoji: '🦊', name: '怂怂狐', camp: '已读不回组', campIcon: '💀', desc: '有感觉就跑，没感觉又来', soulQuote: '逃避虽然可耻但有用——直到对方不等了', avatar: '/species/songsonghu.jpg', color: '#40407a', bg: 'linear-gradient(135deg, #40407a 0%, #706fd3 100%)' },
  { id: 'zhiwuhu',    emoji: '🦊', name: '植物狐', camp: '已读不回组', campIcon: '💀', desc: '所有恋爱信号对我无效', soulQuote: '不是收不到信号，是你把天线拔了', avatar: '/species/zhiwuhu.jpg', color: '#44bd32', bg: 'linear-gradient(135deg, #44bd32 0%, #4cd137 100%)' },
  // 🤡 自我感动组
  { id: 'xiaochouhu', emoji: '🦊', name: '小丑狐', camp: '自我感动组', campIcon: '🤡', desc: '以为是主角，其实送了个助攻', soulQuote: '你感动了自己，但对方只觉得有压力', avatar: '/species/xiaochouhu.jpg', color: '#0097e6', bg: 'linear-gradient(135deg, #0097e6 0%, #00a8ff 100%)' },
  { id: 'lianfeihu',  emoji: '🦊', name: '恋废狐', camp: '自我感动组', campIcon: '🤡', desc: '不谈恋爱会死，谈了更死', soulQuote: '你缺的不是恋爱，是跟自己好好相处', avatar: '/species/lianfeihu.jpg', color: '#718093', bg: 'linear-gradient(135deg, #718093 0%, #7f8fa6 100%)' },
  { id: 'guizuhu',    emoji: '🦊', name: '跪族狐', camp: '自我感动组', campIcon: '🤡', desc: '你说跪就跪，你说滚我问往哪滚', soulQuote: '越卑微越掉价，你值得被平等对待', avatar: '/species/guizuhu.jpg', color: '#192a56', bg: 'linear-gradient(135deg, #192a56 0%, #273c75 100%)' },
  // 😈 表面无害组
  { id: 'caonihu',    emoji: '🦊', name: '草泥狐', camp: '表面无害组', campIcon: '😈', desc: '嘴上全是随便，心里全是你', soulQuote: '你以为的高冷，其实是不敢先开口', avatar: '/species/caonihu.jpg', color: '#e1b12c', bg: 'linear-gradient(135deg, #e1b12c 0%, #fbc531 100%)' },
  { id: 'lvchahu',    emoji: '🦊', name: '绿茶狐', camp: '表面无害组', campIcon: '😈', desc: '人畜无害就是我的大招', soulQuote: '善良是真的，算计也是真的', avatar: '/species/lvchahu.jpg', color: '#B33771', bg: 'linear-gradient(135deg, #B33771 0%, #FD7272 100%)' },
  { id: 'xinjihu',    emoji: '🦊', name: '心机狐', camp: '表面无害组', campIcon: '😈', desc: '看似佛系聊天，每句都在下钩子', soulQuote: '你不是在聊天，你是在布局', avatar: '/species/xinjihu.jpg', color: '#EAB543', bg: 'linear-gradient(135deg, #EAB543 0%, #F8EFBA 100%)' },
];

const defaultUserSpecies = {
  speciesId: 'laosihu',
  matchRate: 98,
};

/** 最佳拍档映射：每个物种对应最匹配的另一个物种 */
const bestPartnerMap: Record<string, string> = {
  haiwanghu:  'zhiwuhu',    // 海王狐 ↔ 植物狐（极致热情配极致冷淡，互相拉扯）
  tiantianhu: 'caonihu',    // 舔舔狐 ↔ 草泥狐（讨好型配傲娇型，被需要感互补）
  laosihu:    'songsonghu', // 老司狐 ↔ 怂怂狐（老手带新手，安全感满满）
  zhuangsihu: 'lianfeihu',  // 装死狐 ↔ 恋废狐（都在逃避，一起摆烂反而真）
  songsonghu: 'laosihu',    // 怂怂狐 ↔ 老司狐
  zhiwuhu:    'haiwanghu',  // 植物狐 ↔ 海王狐
  xiaochouhu: 'xinjihu',    // 小丑狐 ↔ 心机狐（真诚到极致配策略到极致）
  lianfeihu:  'zhuangsihu', // 恋废狐 ↔ 装死狐
  guizuhu:    'lvchahu',    // 跪族狐 ↔ 绿茶狐（服从型配掌控型）
  caonihu:    'tiantianhu', // 草泥狐 ↔ 舔舔狐
  lvchahu:    'guizuhu',    // 绿茶狐 ↔ 跪族狐
  xinjihu:    'xiaochouhu', // 心机狐 ↔ 小丑狐
};

const campStyles: Record<string, { border: string; glow: string; label: string }> = {
  '疯狂输出组': { border: '1px solid rgba(255,107,107,0.3)', glow: 'rgba(255,107,107,0.08)', label: '🔥 疯狂输出组' },
  '已读不回组': { border: '1px solid rgba(149,117,205,0.3)', glow: 'rgba(149,117,205,0.08)', label: '💀 已读不回组' },
  '自我感动组': { border: '1px solid rgba(78,205,196,0.3)', glow: 'rgba(78,205,196,0.08)', label: '🤡 自我感动组' },
  '表面无害组': { border: '1px solid rgba(255,217,61,0.3)', glow: 'rgba(255,217,61,0.08)', label: '😈 表面无害组' },
};

/* ========================================
 *  组件：6维度雷达图
 * ======================================== */
function LoveRadarChart({ data, themeColor }: { data: typeof traitData; themeColor: string }) {
  const gid = useId();
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 4;
  const maxR = 100;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const val = ((i + 1) / levels) * 100;
    return data.map((_, j) => getPoint(j, val)).map(p => `${p.x},${p.y}`).join(' ');
  });

  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const axisEnds = data.map((_, i) => getPoint(i, 100));

  const labelPositions = data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const lr = maxR + 28;
    return { x: cx + lr * Math.cos(angle), y: cy + lr * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id={`${gid}-glow`}>
          <stop offset="0%" stopColor={themeColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0.02" />
        </radialGradient>
        <filter id={`${gid}-blur`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
      </defs>

      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(245,239,232,0.1)" strokeWidth={i === levels - 1 ? 1.2 : 0.6} />
      ))}

      {axisEnds.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(245,239,232,0.08)" strokeWidth={0.6} />
      ))}

      <motion.polygon
        points={dataPolygon}
        fill={`url(#${gid}-glow)`}
        stroke={themeColor}
        strokeWidth={2}
        strokeLinejoin="round"
        filter={`url(#${gid}-blur)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
      />
      <motion.polygon
        points={dataPolygon}
        fill={`url(#${gid}-glow)`}
        stroke={themeColor}
        strokeWidth={1.8}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r={3.5}
          fill="#fff"
          stroke={data[i].color}
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      ))}

      {labelPositions.map((pos, i) => (
        <g key={i}>
          <text x={pos.x} y={pos.y - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
            {data[i].value}
          </text>
          <text x={pos.x} y={pos.y + 7} textAnchor="middle" fill="rgba(245,239,232,0.8)" fontSize={9}>
            {data[i].icon} {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ========================================
 *  组件：匹配度圆环
 * ======================================== */
function MatchRing({ value, color }: { value: number; color: string }) {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  const gid = useId();

  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} viewBox="0 0 80 80">
        <defs>
          <linearGradient id={`${gid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <motion.circle
          cx={40} cy={40} r={r}
          fill="none"
          stroke={`url(#${gid}-ring)`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{value}%</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, marginTop: 2 }}>契合度</span>
      </div>
    </div>
  );
}

/* ========================================
 *  组件：恋爱物种鉴定卡
 * ======================================== */
function SpeciesCard({ onRetest, onDeepTest, onReDeep, onShare, userSpecies, hasDeepTest, subSpeciesId }: { onRetest: () => void; onDeepTest: () => void; onReDeep: () => void; onShare: () => void; userSpecies: { speciesId: string; matchRate: number }; hasDeepTest: boolean; subSpeciesId?: string | null }) {
  const species = loveSpecies.find(s => s.id === userSpecies.speciesId) || loveSpecies[0];
  const camp = campStyles[species.camp] || campStyles['表面无害组'];
  const maxTrait = traitData.reduce((a, b) => a.value > b.value ? a : b);
  const minTrait = traitData.reduce((a, b) => a.value < b.value ? a : b);
  const subSpecies = subSpeciesId ? loveSpecies.find(s => s.id === subSpeciesId) : null;

  return (
    <div>
      {/* 第一屏：沉浸式物种名片 */}
      <div style={{
        background: species.bg, borderRadius: 20, padding: '28px 20px 22px',
        position: 'relative', overflow: 'hidden', isolation: 'isolate',
        border: camp.border, boxShadow: `0 0 40px ${camp.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 140, opacity: 0.1, lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>{species.emoji}</div>
        <div style={{ position: 'absolute', bottom: -20, left: -20, fontSize: 80, opacity: 0.06, lineHeight: 1, pointerEvents: 'none', transform: 'rotate(-15deg)', zIndex: 0 }}>{species.emoji}</div>

        {/* 最佳拍档 — 右上角 */}
        {(() => {
          const partnerId = bestPartnerMap[species.id];
          const partner = partnerId ? loveSpecies.find(s => s.id === partnerId) : null;
          if (!partner) return null;
          return (
            <span style={{ position: 'absolute', top: 10, right: 16, zIndex: 2, color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 0.5 }}>
              💕 最佳拍档 <span style={{ color: '#fff', fontWeight: 700 }}>{partner.name}</span>
            </span>
          );
        })()}

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 14px 5px 10px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.12)', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 13 }}>{species.campIcon}</span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{species.camp}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.span
              style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
              initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >{species.emoji}</motion.span>
            <div>
              <motion.div style={{
                color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: 3, lineHeight: 1.1,
                textShadow: `0 0 20px ${species.color}80, 0 2px 8px rgba(0,0,0,0.3)`,
              }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                {species.name}
              </motion.div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4, letterSpacing: 1 }}>
                LOVE SPECIES · {species.id.toUpperCase()}
              </div>
            </div>
          </div>
          <MatchRing value={userSpecies.matchRate} color={species.color} />
        </div>

        <motion.div style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginTop: 18, lineHeight: 1.7, letterSpacing: 0.5, position: 'relative', zIndex: 1, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          「{species.desc}」
        </motion.div>

        <motion.div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 8, fontStyle: 'italic', lineHeight: 1.5, paddingLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.25)', position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          灵魂拷问：{species.soulQuote}
        </motion.div>

        {/* 隐藏副物种 */}
        {subSpecies && (
          <motion.div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 12, padding: '8px 14px', marginTop: 14,
            border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1,
          }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <span style={{ fontSize: 22, filter: 'blur(1.5px)', transition: 'filter 0.3s' }}>{subSpecies.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>隐藏副物种</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600 }}>{subSpecies.name}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>“{subSpecies.desc.slice(0, 12)}...”</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>🔬 深度测试解锁</span>
          </motion.div>
        )}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 16, textAlign: 'right', letterSpacing: 2, position: 'relative', zIndex: 1 }}>
          — FoxSay 恋爱物种鉴定 —
        </div>
      </div>

      {/* 第二屏：6维度雷达图 */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, letterSpacing: 4 }}>──</span>
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>恋爱属性图谱</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, letterSpacing: 4 }}>──</span>
        </div>
        <LoveRadarChart data={traitData} themeColor={species.color} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,239,232,0.06)', borderRadius: 12, padding: '6px 14px' }}>
            <span style={{ fontSize: 11 }}>🔥</span>
            <span style={{ color: maxTrait.color, fontSize: 11, fontWeight: 700 }}>MAX</span>
            <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 10 }}>{maxTrait.icon} {maxTrait.label} {maxTrait.value}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,239,232,0.06)', borderRadius: 12, padding: '6px 14px' }}>
            <span style={{ fontSize: 11 }}>💤</span>
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, fontWeight: 700 }}>MIN</span>
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 10 }}>{minTrait.icon} {minTrait.label} {minTrait.value}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginTop: 14 }}>
          {traitData.map(t => {
            const isMax = t === maxTrait;
            const isMin = t === minTrait;
            return (
              <div key={t.label} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                borderRadius: 10, background: isMax ? `${t.color}18` : 'rgba(245,239,232,0.04)',
                border: isMax ? `1px solid ${t.color}30` : '1px solid transparent',
              }}>
                <div style={{ fontSize: 16, opacity: isMin ? 0.4 : 1 }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: isMin ? 'rgba(245,239,232,0.5)' : 'rgba(245,239,232,0.85)', fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                    <span style={{ color: isMin ? 'rgba(245,239,232,0.4)' : t.color, fontSize: 12, fontWeight: 800 }}>{t.value}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: 'rgba(245,239,232,0.08)', marginTop: 4 }}>
                    <motion.div style={{ height: '100%', borderRadius: 2, background: isMin ? 'rgba(245,239,232,0.15)' : t.color, opacity: isMin ? 0.5 : 1 }}
                      initial={{ width: 0 }} animate={{ width: `${t.value}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部 CTA — 两按钮 */}
      <motion.div style={{ marginTop: 20, padding: '14px 0', borderTop: '1px solid rgba(245,239,232,0.08)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="flex gap-3">
          {hasDeepTest ? (
            <motion.button className="flex-1 flex items-center justify-center gap-2 py-3"
              style={{ background: species.bg, borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', boxShadow: `0 4px 20px ${species.color}30` }}
              whileTap={{ scale: 0.96 }} onClick={onReDeep}>
              <span style={{ fontSize: 14 }}>🔄</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>重新鉴定</span>
            </motion.button>
          ) : (
            <motion.button className="flex-1 flex items-center justify-center gap-2 py-3"
              style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 20px rgba(124,77,255,0.3)' }}
              whileTap={{ scale: 0.96 }} onClick={onDeepTest}>
              <span style={{ fontSize: 14 }}>🧬</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>深度物种鉴定</span>
            </motion.button>
          )}
        </div>
        <motion.button className="w-full flex items-center justify-center gap-2 py-3 mt-3"
          style={{ background: 'linear-gradient(135deg, #FF8A80, #B39DDB)', borderRadius: 14, border: 'none', boxShadow: '0 4px 20px rgba(255,138,128,0.3)' }}
          whileTap={{ scale: 0.96 }} onClick={onShare}>
          <span style={{ fontSize: 14 }}>📸</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>生成分享图</span>
        </motion.button>
        <div style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, marginTop: 6, textAlign: 'center' }}>
          长按保存图片分享到朋友圈，找到你的灵魂CP
        </div>
        <KeyboardPromoBanner hint={`用 FoxSay 键盘 · 用${species.name}的语气聊天`} />
      </motion.div>
    </div>
  );
}

/* ================================================================
 *  课程 Tab — Keep 风格课程商城 + 信息收集流 + 总结页  (v10 final)
 * ================================================================ */
const coursePlans = [
  { id: 'confident-date', title: '自信约会 21 天', desc: '从搭讪到深聊，系统掌握约会全流程，让你在每一次相处中都更从容', icon: '☕', dim: '开场白+话题力', tags: ['约会', '社交'], duration: '21天', lessons: 42, dailyMin: 15, difficulty: '入门', enrolled: 3280, rating: 4.8, reviews: 812, color: '#FF8A80', gradient: 'linear-gradient(135deg,#FF8A80,#FF6B6B)', vipOnly: false, badge: '热门',
    syllabus: [{ day: '第1-3天', title: '破冰基础', tasks: '3节理论 + 2个实战', focus: '自然开场' },{ day: '第4-10天', title: '话题延展', tasks: '5节理论 + 5个场景', focus: '持续深聊' },{ day: '第11-21天', title: '约会实战', tasks: '8节场景 + 3次复盘', focus: '全流程' }] },
  { id: 'empathy-master', title: '共情力大师班', desc: '学会真正理解对方的感受，从表面共情到深层连接的系统训练', icon: '❤️', dim: '共情力', tags: ['情感', '深度'], duration: '14天', lessons: 28, dailyMin: 10, difficulty: '进阶', enrolled: 2150, rating: 4.9, reviews: 634, color: '#EC407A', gradient: 'linear-gradient(135deg,#EC407A,#F06292)', vipOnly: false, badge: '好评最高',
    syllabus: [{ day: '第1-4天', title: '情绪识别', tasks: '4节理论 + 3个练习', focus: '读懂情绪' },{ day: '第5-10天', title: '回应技巧', tasks: '6节实战 + 3个场景', focus: '共情表达' },{ day: '第11-14天', title: '深度连接', tasks: '4节高阶 + 2次实战', focus: '心灵共鸣' }] },
  { id: 'observe-pro', title: '社交读心术', desc: '微表情识别+肢体语言解读全攻略，看穿对方没说出口的话', icon: '👁️', dim: '观察力', tags: ['洞察', '微表情'], duration: '14天', lessons: 30, dailyMin: 12, difficulty: '进阶', enrolled: 1860, rating: 4.7, reviews: 445, color: '#4FC3F7', gradient: 'linear-gradient(135deg,#4FC3F7,#29B6F6)', vipOnly: false, badge: '',
    syllabus: [{ day: '第1-5天', title: '基础观察', tasks: '5节理论 + 5个图片', focus: '表情入门' },{ day: '第6-10天', title: '肢体语言', tasks: '5节实战 + 5个视频', focus: '身体信号' },{ day: '第11-14天', title: '综合判断', tasks: '4节高阶 + 3次模拟', focus: '全方位读心' }] },
  { id: 'safety-build', title: '安全感建设营', desc: '用稳定和可靠打动对方的心，成为让人安心的存在', icon: '🛡️', dim: '安全感', tags: ['稳定', '信任'], duration: '28天', lessons: 56, dailyMin: 15, difficulty: '中级', enrolled: 2540, rating: 4.8, reviews: 578, color: '#9B7EDE', gradient: 'linear-gradient(135deg,#9B7EDE,#7E57C2)', vipOnly: true, badge: 'VIP精选',
    syllabus: [{ day: '第1-7天', title: '自我觉察', tasks: '7节理论 + 5个反思', focus: '认识自己' },{ day: '第8-21天', title: '行为建设', tasks: '14节实战 + 7个场景', focus: '可靠行动' },{ day: '第22-28天', title: '深度信任', tasks: '7节高阶 + 3次评估', focus: '建立安全' }] },
  { id: 'topic-king', title: '话题王速成', desc: '永远不冷场的聊天秘籍，从无话可说到滔滔不绝', icon: '💡', dim: '话题力', tags: ['聊天', '速成'], duration: '7天', lessons: 14, dailyMin: 10, difficulty: '入门', enrolled: 4120, rating: 4.6, reviews: 1203, color: '#4ECDC4', gradient: 'linear-gradient(135deg,#4ECDC4,#26C6DA)', vipOnly: false, badge: '最多人学',
    syllabus: [{ day: '第1-2天', title: '话题库搭建', tasks: '2节理论 + 4个练习', focus: '话题积累' },{ day: '第3-5天', title: '延展技巧', tasks: '3节实战 + 3个场景', focus: '深入展开' },{ day: '第6-7天', title: '氛围掌控', tasks: '2节高阶 + 2次实战', focus: '引导节奏' }] },
  { id: 'full-upgrade', title: '恋商全面提升', desc: '五维能力同步进阶，从恋爱小白到社交达人的蜕变之旅', icon: '🦊', dim: '全维度', tags: ['全能', '深度'], duration: '42天', lessons: 84, dailyMin: 20, difficulty: '高级', enrolled: 980, rating: 4.9, reviews: 267, color: '#B39DDB', gradient: 'linear-gradient(135deg,#B39DDB,#9575CD)', vipOnly: true, badge: 'VIP旗舰',
    syllabus: [{ day: '第1-14天', title: '基础打牢', tasks: '14节理论 + 10个练习', focus: '五维入门' },{ day: '第15-28天', title: '专项突破', tasks: '14节实战 + 14个场景', focus: '薄弱提升' },{ day: '第29-42天', title: '综合实战', tasks: '14节高阶 + 7次模拟', focus: '全面蜕变' }] },
];

const collectSteps: { key: string; category: string; title: string; subtitle: string; gradient: string; options: { label: string; icon: string; desc: string; recommended?: boolean }[]; multi?: boolean }[] = [
  { key: 'goal', category: '恋爱目标', title: '想要达成的目标', subtitle: '选择最符合你现阶段的需求', gradient: 'linear-gradient(135deg, rgba(255,138,128,0.06), rgba(236,64,122,0.04))', options: [
    { label: '脱单找到另一半', icon: '💕', desc: '从0到1，找到适合的伴侣' },
    { label: '提升约会成功率', icon: '☕', desc: '让每次约会都更有把握', recommended: true },
    { label: '改善现有感情', icon: '🔥', desc: '让两个人的关系更加甜蜜' },
    { label: '增强社交自信', icon: '✨', desc: '在任何社交场合都从容不迫' },
    { label: '学习恋爱心理学', icon: '🧠', desc: '系统了解两性沟通的底层逻辑' },
  ]},
  { key: 'dims', category: '改善维度', title: '想要提升的方向', subtitle: '可多选，我们会优先加强这些', gradient: 'linear-gradient(135deg, rgba(155,126,222,0.06), rgba(126,87,194,0.04))', multi: true, options: [
    { label: '开场白 · 搭讪破冰', icon: '💬', desc: '不再紧张，自然开启对话' },
    { label: '共情力 · 情感理解', icon: '❤️', desc: '真正读懂对方的心声', recommended: true },
    { label: '观察力 · 察言观色', icon: '👁️', desc: '捕捉对方没说出口的话' },
    { label: '话题力 · 持续深聊', icon: '💡', desc: '永远不冷场的秘密武器' },
    { label: '安全感 · 稳定可靠', icon: '🛡️', desc: '成为让人安心的存在' },
  ]},
  { key: 'concern', category: '额外关注', title: '遇到的主要问题', subtitle: '帮助我们更精准推荐适合你的课程', gradient: 'linear-gradient(135deg, rgba(78,205,196,0.06), rgba(38,198,218,0.04))', options: [
    { label: '社交恐惧/容易紧张', icon: '😰', desc: '面对异性就紧张到不行' },
    { label: '不会接话/经常冷场', icon: '🥶', desc: '对话总是很快就断了' },
    { label: '读不懂对方心思', icon: '❓', desc: '猜不到TA在想什么' },
    { label: '表达感情有障碍', icon: '🔒', desc: '心里有但说不出口' },
    { label: '缺乏恋爱经验', icon: '🌱', desc: '没谈过恋爱不知道怎么开始', recommended: true },
  ]},
  { key: 'time', category: '训练时长', title: '每天可以投入多久', subtitle: '科学安排，碎片时间也能提升', gradient: 'linear-gradient(135deg, rgba(255,217,61,0.05), rgba(255,193,7,0.03))', options: [
    { label: '5-10 分钟', icon: '⚡', desc: '通勤路上就能完成' },
    { label: '10-15 分钟', icon: '☕', desc: '一杯咖啡的时间', recommended: true },
    { label: '15-20 分钟', icon: '📖', desc: '适中的节奏，稳步提升' },
    { label: '20-30 分钟', icon: '🎯', desc: '认真学习，快速进步' },
    { label: '30 分钟以上', icon: '🚀', desc: '高强度训练，全力以赴' },
  ]},
];

/* 用户评价素材 */
const userTestimonials = [
  { name: '小明M.', avatar: '🧑', age: 25, badge: '训练 3 个月', result: '成功脱单', text: '之前和女生说话就紧张，学了开场白课程后，现在约会自然多了。课程设计很用心，循序渐进不会有压力。', plan: '自信约会 21 天' },
  { name: '阿杰J.', avatar: '👨', age: 28, badge: '训练 2 个月', result: '约会成功率↑60%', text: '共情力大师班真的改变了我，现在女生都说我很懂她们。每天只要10分钟，坚持下来变化很大。', plan: '共情力大师班' },
  { name: '晓峰F.', avatar: '🧔', age: 23, badge: '训练 1 个月', result: '社交恐惧大幅好转', text: '话题王速成太实用了，再也不怕冷场。7天就能看到效果，强烈推荐给跟我一样不会聊天的人。', plan: '话题王速成' },
];

function CourseTab({ isVip, onOpenVip }: { isVip: boolean; onOpenVip: () => void }) {
  const [collectStep, setCollectStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [selectedPlan, setSelectedPlan] = useState<typeof coursePlans[0] | null>(null);
  const [courseFilter, setCourseFilter] = useState<'all' | 'free' | 'vip'>('all');

  const handleSelect = (stepKey: string, option: string, multi?: boolean) => {
    setAnswers(prev => {
      const cur = prev[stepKey] || [];
      if (multi) return { ...prev, [stepKey]: cur.includes(option) ? cur.filter(o => o !== option) : [...cur, option] };
      return { ...prev, [stepKey]: [option] };
    });
  };

  const nextStep = () => { if (collectStep < collectSteps.length) setCollectStep(collectStep + 1); };
  const canNext = () => {
    if (collectStep < 0 || collectStep >= collectSteps.length) return true;
    return (answers[collectSteps[collectStep].key] || []).length > 0;
  };

  const filteredPlans = coursePlans.filter(p => {
    if (courseFilter === 'free') return !p.vipOnly;
    if (courseFilter === 'vip') return p.vipOnly;
    return true;
  });

  /* ───── 商城首页 ───── */
  if (collectStep === -1) {
    return (
      <div style={{ background: 'linear-gradient(180deg, rgba(74,61,107,0.15) 0%, rgba(42,36,64,0.08) 50%, transparent 100%)', borderRadius: 20, margin: '-4px -2px', padding: '4px 2px' }}>
        {/* Hero 横幅 — Keep 风格大卡片 */}
        <motion.div className="mb-5 overflow-hidden relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 20, background: 'linear-gradient(145deg, #4a3d6b 0%, #2d2545 50%, #1e1a30 100%)', minHeight: 200 }}>
          {/* 装饰性背景光效 */}
          <div style={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,126,222,0.3) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.18) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: 20, left: '50%', width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, transparent 70%)' }} />
          
          <div className="relative p-5">
            {/* 个性化标签 */}
            <motion.div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              style={{ background: 'rgba(155,126,222,0.2)', borderRadius: 20, border: '1px solid rgba(155,126,222,0.25)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: 11 }}>🦊</span>
              <span style={{ color: '#B39DDB', fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>专为你打造</span>
            </motion.div>
            
            <motion.h2 initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ color: '#f5efe8', fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6, lineHeight: 1.3 }}>
              个性定制训练计划
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
              1 分钟问卷评估 · AI 量身定制 · 12,890+ 人已使用
            </motion.p>

            {/* 预览日程卡片 */}
            <motion.div className="flex gap-2.5 mb-5 overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {[{ day: '第1天', title: '开场白基础', time: '15min', color: '#FF8A80', icon: '💬' }, { day: '第2天', title: '情绪识别入门', time: '12min', color: '#EC407A', icon: '❤️' }, { day: '第3天', title: '话题延展技巧', time: '15min', color: '#4FC3F7', icon: '💡' }].map((d, i) => (
                <motion.div key={i} className="flex-shrink-0 px-3.5 py-2.5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                  style={{ background: 'rgba(245,239,232,0.07)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.08)', minWidth: 105, backdropFilter: 'blur(4px)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span style={{ fontSize: 12 }}>{d.icon}</span>
                    <span style={{ color: d.color, fontSize: 10, fontWeight: 700 }}>{d.day}</span>
                  </div>
                  <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{d.title}</span>
                  <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>{d.time}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.button className="w-full py-3.5 flex items-center justify-center gap-2 relative overflow-hidden" whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ background: 'linear-gradient(135deg, #9B7EDE 0%, #7E57C2 100%)', borderRadius: 14, border: 'none', boxShadow: '0 6px 20px rgba(155,126,222,0.35)' }}
              onClick={() => setCollectStep(0)}>
              {/* 微光效果 */}
              <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)', animation: 'shimmer 3s infinite' }} />
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>开始定制</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>→</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 数据条 */}
        <motion.div className="flex items-center justify-around mb-5 py-3.5 px-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.1)' }}>
          {[{ val: '12,890+', label: '已加入训练', icon: '👥' }, { val: '4.8', label: '平均评分', icon: '⭐' }, { val: '87%', label: '完课率', icon: '📈' }].map((d, i) => (
            <div key={i} className="text-center flex items-center gap-2">
              <span style={{ fontSize: 13 }}>{d.icon}</span>
              <div>
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', lineHeight: 1.2 }}>{d.val}</span>
                <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>{d.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 课程筛选 + 标题 */}
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ color: '#B39DDB', fontSize: 15, fontWeight: 700 }}>精品课程</span>
          <div className="flex gap-1.5 ml-auto">
            {([['all', '全部'], ['free', '免费'], ['vip', 'VIP']] as const).map(([key, label]) => (
              <motion.button key={key} className="px-2.5 py-1" whileTap={{ scale: 0.95 }}
                style={{ fontSize: 10, fontWeight: 600, borderRadius: 8, background: courseFilter === key ? 'rgba(155,126,222,0.15)' : 'transparent', color: courseFilter === key ? '#B39DDB' : 'rgba(245,239,232,0.35)', border: courseFilter === key ? '1px solid rgba(155,126,222,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}
                onClick={() => setCourseFilter(key)}>{label}</motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredPlans.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.04 }}
              layout style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 16, border: '1px solid rgba(155,126,222,0.1)', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedPlan(plan)} whileTap={{ scale: 0.985 }}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: 'linear-gradient(145deg, rgba(155,126,222,0.25), rgba(74,61,107,0.4))', boxShadow: '0 4px 14px rgba(155,126,222,0.15)' }}>
                    <span style={{ fontSize: 26 }}>{plan.icon}</span>
                    {/* 右上角角标光晕 */}
                    <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#9B7EDE', boxShadow: '0 0 8px rgba(155,126,222,0.5)', opacity: 0.7 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>{plan.title}</span>
                      {plan.badge && (
                        <span className="px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, borderRadius: 6, background: plan.vipOnly ? 'linear-gradient(135deg, rgba(255,217,61,0.2), rgba(255,193,7,0.15))' : `${plan.color}15`, color: plan.vipOnly ? '#FFD93D' : plan.color, border: `1px solid ${plan.vipOnly ? 'rgba(255,217,61,0.2)' : plan.color + '25'}` }}>{plan.badge}</span>
                      )}
                    </div>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11.5, marginBottom: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{plan.desc}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {plan.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5" style={{ fontSize: 9, fontWeight: 600, borderRadius: 6, background: 'rgba(155,126,222,0.12)', color: '#B39DDB', border: '1px solid rgba(155,126,222,0.15)' }}>{tag}</span>
                      ))}
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>{plan.duration} · {plan.lessons}节</span>
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>⭐ {plan.rating}</span>
                      <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10 }}>{plan.enrolled.toLocaleString()}人</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="rgba(245,239,232,0.25)" className="flex-shrink-0 mt-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 用户评价 — 横向滑动 */}
        <div className="flex items-center gap-2 mt-6 mb-3">
          <span style={{ fontSize: 14 }}>💬</span>
          <span style={{ color: '#B39DDB', fontSize: 15, fontWeight: 700 }}>训练效果 · 真实评价</span>
          <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10, marginLeft: 'auto' }}>共 {userTestimonials.length} 条</span>
        </div>
        <div className="overflow-x-auto pb-2" style={{ margin: '0 -4px' }}>
          <div className="flex gap-3" style={{ minWidth: 'max-content', padding: '0 4px' }}>
            {userTestimonials.map((t, i) => (
              <motion.div key={i} className="flex-shrink-0 p-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 16, border: '1px solid rgba(155,126,222,0.1)', width: 260 }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.15)', border: '2px solid rgba(155,126,222,0.1)' }}>
                    <span style={{ fontSize: 20 }}>{t.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>{t.age}岁</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 600, borderRadius: 4, background: 'rgba(78,205,196,0.12)', color: '#4ECDC4' }}>{t.badge}</span>
                      <span className="px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 600, borderRadius: 4, background: 'rgba(155,126,222,0.12)', color: '#B39DDB' }}>{t.plan}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, lineHeight: 1.6, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{t.text}"</p>
                <div className="flex items-center gap-1">
                  <span className="px-2.5 py-1" style={{ fontSize: 10, fontWeight: 700, borderRadius: 8, background: 'rgba(78,205,196,0.08)', color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.12)' }}>{t.result}</span>
                  <div className="flex ml-auto">
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#FFD93D', fontSize: 10 }}>★</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 课程详情弹窗 */}
        <AnimatePresence>
          {selectedPlan && (
            <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }} onClick={() => setSelectedPlan(null)} />
              <motion.div className="relative mt-auto w-full" style={{ maxWidth: 430, margin: '0 auto', maxHeight: '88vh' }}
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
                <div style={{ background: '#2a2440', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
                  {/* 拖拽指示器 */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.15)' }} />
                  </div>
                  {/* 课程封面区 */}
                  <div className="relative" style={{ background: selectedPlan.gradient, padding: '20px 20px 20px' }}>
                    <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: -15, left: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    <motion.button className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center" whileTap={{ scale: 0.9 }}
                      style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedPlan(null)}>
                      <X size={16} color="#fff" />
                    </motion.button>
                    <div className="flex items-center gap-3">
                      <motion.span initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}
                        style={{ fontSize: 48, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))' }}>{selectedPlan.icon}</motion.span>
                      <div>
                        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: -0.3, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{selectedPlan.title}</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                          {selectedPlan.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5" style={{ fontSize: 10, fontWeight: 600, borderRadius: 6, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{tag}</span>
                          ))}
                          {selectedPlan.badge && <span className="px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, borderRadius: 6, background: 'rgba(255,255,255,0.25)', color: '#fff' }}>{selectedPlan.badge}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 滚动内容 */}
                  <div style={{ maxHeight: 'calc(88vh - 140px)', overflowY: 'auto', padding: '16px 20px 24px' }}>
                    <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{selectedPlan.desc}</p>

                    {/* 数据网格 */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {[{ v: selectedPlan.duration, l: '课程时长', icon: '📅' }, { v: `${selectedPlan.lessons}节`, l: '课程数量', icon: '📚' }, { v: `${selectedPlan.dailyMin}分`, l: '每日投入', icon: '⏱️' }, { v: `${selectedPlan.rating}`, l: `${selectedPlan.reviews}评`, icon: '⭐' }].map((d, i) => (
                        <motion.div key={i} className="py-3 text-center" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
                          style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.04)' }}>
                          <span style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>{d.icon}</span>
                          <span style={{ color: selectedPlan.color, fontSize: 16, fontWeight: 800, display: 'block' }}>{d.v}</span>
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>{d.l}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* 课程大纲 */}
                    <div className="mb-5">
                      <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 12 }}>📚 课程大纲</span>
                      {selectedPlan.syllabus.map((s, i) => (
                        <motion.div key={i} className="flex gap-3 mb-3" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
                          <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
                            <div className="w-3.5 h-3.5 rounded-full" style={{ background: selectedPlan.color, boxShadow: `0 0 8px ${selectedPlan.color}55` }} />
                            {i < selectedPlan.syllabus.length - 1 && <div className="flex-1 w-px my-1" style={{ background: `${selectedPlan.color}25` }} />}
                          </div>
                          <div className="pb-2 flex-1" style={{ background: 'rgba(245,239,232,0.02)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(245,239,232,0.03)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span style={{ color: selectedPlan.color, fontSize: 10, fontWeight: 700 }}>{s.day}</span>
                              <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{s.title}</span>
                            </div>
                            <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>{s.tasks}</span>
                            <span className="ml-2 px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 600, borderRadius: 4, background: `${selectedPlan.color}10`, color: selectedPlan.color }}>{s.focus}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 已加入人数 + 难度 */}
                    <div className="flex gap-2 mb-5">
                      <div className="flex-1 p-3 flex items-center gap-2" style={{ background: 'rgba(78,205,196,0.06)', borderRadius: 12, border: '1px solid rgba(78,205,196,0.1)' }}>
                        <span style={{ fontSize: 14 }}>👥</span>
                        <div>
                          <span style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 700, display: 'block' }}>{selectedPlan.enrolled.toLocaleString()}</span>
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>人已加入</span>
                        </div>
                      </div>
                      <div className="flex-1 p-3 flex items-center gap-2" style={{ background: 'rgba(255,217,61,0.04)', borderRadius: 12, border: '1px solid rgba(255,217,61,0.08)' }}>
                        <span style={{ fontSize: 14 }}>📊</span>
                        <div>
                          <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700, display: 'block' }}>{selectedPlan.difficulty}</span>
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>课程难度</span>
                        </div>
                      </div>
                    </div>

                    {/* 匹配用户评价 */}
                    {userTestimonials.filter(t => t.plan === selectedPlan.title).map((t, i) => (
                      <div key={i} className="mb-4 p-3.5" style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.05)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: 16 }}>{t.avatar}</span>
                          <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>{t.name}</span>
                          <span className="px-1.5 py-0.5 ml-auto" style={{ fontSize: 9, fontWeight: 700, borderRadius: 6, background: 'rgba(78,205,196,0.1)', color: '#4ECDC4' }}>{t.result}</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, lineHeight: 1.5, fontStyle: 'italic' }}>"{t.text}"</p>
                      </div>
                    ))}

                    {/* 操作按钮 */}
                    <motion.button className="w-full py-4 flex items-center justify-center gap-2 relative overflow-hidden"
                      style={{
                        background: selectedPlan.vipOnly && !isVip ? 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,193,7,0.1))' : selectedPlan.gradient,
                        borderRadius: 16, border: selectedPlan.vipOnly && !isVip ? '1px solid rgba(255,217,61,0.2)' : 'none',
                        boxShadow: selectedPlan.vipOnly && !isVip ? 'none' : `0 6px 20px ${selectedPlan.color}30`,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (selectedPlan.vipOnly && !isVip) { setSelectedPlan(null); onOpenVip(); }
                        else { setSelectedPlan(null); setCollectStep(0); }
                      }}>
                      {selectedPlan.vipOnly && !isVip ? (
                        <><span style={{ fontSize: 14 }}>👑</span><span style={{ color: '#FFD93D', fontSize: 15, fontWeight: 700 }}>开通 VIP 解锁课程</span></>
                      ) : (
                        <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>加入课程 · 开始训练</span>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ───── 信息收集流 — Keep 风格 ───── */
  if (collectStep >= 0 && collectStep < collectSteps.length) {
    const step = collectSteps[collectStep];
    const selected = answers[step.key] || [];
    return (
      <motion.div key={`collect-${collectStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', damping: 25 }}
        style={{ background: step.gradient, borderRadius: 20, margin: '-8px -4px', padding: '8px 4px' }}>
        {/* 顶部进度 */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-3">
            <motion.button className="w-8 h-8 rounded-full flex items-center justify-center" whileTap={{ scale: 0.9 }}
              style={{ background: 'rgba(245,239,232,0.06)', border: '1px solid rgba(245,239,232,0.06)' }} onClick={() => setCollectStep(collectStep - 1)}>
              <ChevronRight size={16} color="rgba(245,239,232,0.5)" style={{ transform: 'rotate(180deg)' }} />
            </motion.button>
            <div className="flex-1 flex gap-1.5">
              {collectSteps.map((_, i) => (
                <motion.div key={i} className="flex-1" style={{ height: 4, borderRadius: 2, background: i < collectStep ? '#9B7EDE' : i === collectStep ? '#B39DDB' : 'rgba(245,239,232,0.08)' }}
                  animate={{ background: i < collectStep ? '#9B7EDE' : i === collectStep ? '#B39DDB' : 'rgba(245,239,232,0.08)' }}
                  transition={{ duration: 0.4 }} />
              ))}
            </div>
            <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{collectStep + 1}/{collectSteps.length}</span>
          </div>
        </div>

        {/* 类别标签 */}
        <motion.div className="inline-flex items-center px-2.5 py-1 mb-3" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 8, border: '1px solid rgba(155,126,222,0.15)' }}>
          <span style={{ color: '#B39DDB', fontSize: 10, fontWeight: 600 }}>{step.category}</span>
        </motion.div>

        {/* 标题 */}
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          style={{ color: '#f5efe8', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6, lineHeight: 1.2 }}>{step.title}</motion.h2>
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ color: 'rgba(245,239,232,0.45)', fontSize: 13, marginBottom: 20 }}>{step.subtitle}{step.multi && <span style={{ color: '#B39DDB', fontWeight: 600 }}> (可多选)</span>}</motion.p>

        {/* 选项卡片 — Keep 大卡片风格 */}
        <div className="flex flex-col gap-2.5">
          {step.options.map((opt, i) => {
            const isSelected = selected.includes(opt.label);
            return (
              <motion.button key={opt.label} className="w-full text-left" whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.04 }}
                onClick={() => { handleSelect(step.key, opt.label, step.multi); if (!step.multi) setTimeout(nextStep, 350); }}>
                <motion.div className="flex items-center gap-3.5 p-4" animate={{
                  background: isSelected ? 'rgba(155,126,222,0.12)' : 'rgba(245,239,232,0.035)',
                  borderColor: isSelected ? 'rgba(155,126,222,0.35)' : 'rgba(245,239,232,0.06)',
                }} transition={{ duration: 0.2 }}
                  style={{ borderRadius: 16, border: '1.5px solid', overflow: 'hidden' }}>
                  <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    animate={{ background: isSelected ? 'rgba(155,126,222,0.2)' : 'rgba(245,239,232,0.06)', scale: isSelected ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}>
                    <span style={{ fontSize: 24 }}>{opt.icon}</span>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ color: isSelected ? '#f5efe8' : 'rgba(245,239,232,0.8)', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}>{opt.label}</span>
                      {opt.recommended && <span className="px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 700, borderRadius: 4, background: 'rgba(78,205,196,0.15)', color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.2)' }}>推荐</span>}
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, display: 'block', marginTop: 2 }}>{opt.desc}</span>
                  </div>
                  <motion.div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{
                      border: isSelected ? '0px solid transparent' : '2px solid rgba(245,239,232,0.12)',
                      background: isSelected ? '#9B7EDE' : 'transparent',
                      boxShadow: isSelected ? '0 0 8px rgba(155,126,222,0.4)' : 'none',
                    }} transition={{ duration: 0.2 }}>
                    {isSelected && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</motion.span>
                    )}
                  </motion.div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* 多选继续按钮 */}
        {step.multi && (
          <motion.button className="w-full py-4 mt-5 flex items-center justify-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{
              background: canNext() ? 'linear-gradient(135deg, #9B7EDE, #7E57C2)' : 'rgba(245,239,232,0.06)',
              borderRadius: 16, border: 'none', boxShadow: canNext() ? '0 6px 20px rgba(155,126,222,0.3)' : 'none',
              transition: 'all 0.3s',
            }}
            whileTap={canNext() ? { scale: 0.97 } : {}} onClick={() => { if (canNext()) nextStep(); }}>
            <span style={{ color: canNext() ? '#fff' : 'rgba(245,239,232,0.25)', fontSize: 15, fontWeight: 700, transition: 'color 0.2s' }}>
              继续 · {selected.length} 项已选
            </span>
          </motion.button>
        )}
      </motion.div>
    );
  }

  /* ───── 总结页 — Keep 风格方案展示 ───── */
  const recPlans = coursePlans.filter(p => !p.vipOnly || isVip).slice(0, 3);
  const totalDays = recPlans.reduce((s, p) => s + parseInt(p.duration), 0);
  const totalLessons = recPlans.reduce((s, p) => s + p.lessons, 0);
  const goalAns = (answers.goal || [])[0] || '提升恋商';
  const dimAns = answers.dims || ['共情力 · 情感理解'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* 方案头部 — 大标题渐变 */}
      <motion.div className="text-center mb-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(180deg, rgba(155,126,222,0.15) 0%, rgba(78,205,196,0.05) 50%, transparent 100%)', borderRadius: 20, padding: '28px 16px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* 装饰光效 */}
        <div style={{ position: 'absolute', top: -20, right: -10, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)' }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}>
          <span style={{ fontSize: 56, display: 'block', marginBottom: 8, filter: 'drop-shadow(0 6px 16px rgba(155,126,222,0.35))' }}>🦊</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'linear-gradient(135deg, #B39DDB, #f5efe8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>
          我的个性训练方案
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12 }}>
          根据你的评估结果量身定制 · 已优化 3 次
        </motion.p>
        {/* 已生成标记 */}
        <motion.div className="inline-flex items-center gap-1 px-2.5 py-1 mt-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          style={{ background: 'rgba(78,205,196,0.1)', borderRadius: 12, border: '1px solid rgba(78,205,196,0.12)' }}>
          <span style={{ fontSize: 10 }}>✨</span>
          <span style={{ color: '#4ECDC4', fontSize: 10, fontWeight: 600 }}>AI 方案已就绪</span>
        </motion.div>
      </motion.div>

      {/* 用户目标卡 */}
      <motion.div className="mb-4 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 16, border: '1px solid rgba(245,239,232,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 13 }}>🎯</span>
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700 }}>我的目标</span>
        </div>
        <span className="inline-block px-3 py-1.5 mb-2" style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 8, color: '#B39DDB', fontSize: 13, fontWeight: 600, border: '1px solid rgba(155,126,222,0.15)' }}>{goalAns}</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {dimAns.map(d => (
            <span key={d} className="px-2.5 py-1" style={{ background: 'rgba(78,205,196,0.08)', borderRadius: 6, color: '#4ECDC4', fontSize: 10, fontWeight: 600, border: '1px solid rgba(78,205,196,0.12)' }}>{d}</span>
          ))}
        </div>
      </motion.div>

      {/* 建议训练安排 — 3列数据 */}
      <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 10 }}>📊 建议训练安排</span>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: '📈', val: `L${recPlans.length > 1 ? '3' : '2'}`, sub: '难度', desc: '循序渐进\n稳步提升', color: '#FF8A80' },
            { icon: '📅', val: `${totalDays}`, sub: '天', desc: '根据目标制定\n专属训练方案', color: '#9B7EDE' },
            { icon: '📚', val: `${totalLessons}`, sub: '节', desc: '根据恋商水平\n匹配适合课程', color: '#4ECDC4' },
          ].map((d, i) => (
            <motion.div key={i} className="text-center p-3.5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 + i * 0.08 }}
              style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 14, border: '1px solid rgba(245,239,232,0.06)' }}>
              <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{d.icon}</span>
              <span style={{ color: d.color, fontSize: 26, fontWeight: 800, display: 'block', lineHeight: 1.1 }}>{d.val}</span>
              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, fontWeight: 600 }}>{d.sub}</span>
              <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9, display: 'block', marginTop: 4, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{d.desc}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI 推荐课程 */}
      <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 13 }}>🤖</span>
          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>AI 推荐课程</span>
          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, marginLeft: 'auto' }}>为你精选</span>
        </div>
        {recPlans.map((plan, i) => (
          <motion.div key={plan.id} className="flex items-center gap-3 p-3.5 mb-2" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.06 }}
            style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 14, border: '1px solid rgba(245,239,232,0.06)', cursor: 'pointer' }}
            onClick={() => setSelectedPlan(plan)} whileTap={{ scale: 0.98 }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: plan.gradient }}>
              <span style={{ fontSize: 22 }}>{plan.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>{plan.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>{plan.duration} · {plan.lessons}节</span>
                <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10 }}>⭐ {plan.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5" style={{ background: `${plan.color}12`, borderRadius: 8, border: `1px solid ${plan.color}20` }}>
              <span style={{ color: plan.color, fontSize: 11, fontWeight: 600 }}>查看</span>
              <ChevronRight size={12} color={plan.color} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 预估效果 — 双栏 */}
      <motion.div className="mb-4 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.08), rgba(155,126,222,0.06))', borderRadius: 16, border: '1px solid rgba(78,205,196,0.1)' }}>
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 12 }}>📈 预计训练效果</span>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3.5" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
            <span style={{ color: '#4ECDC4', fontSize: 30, fontWeight: 800, display: 'block', lineHeight: 1.1 }}>+18</span>
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, display: 'block', marginTop: 4 }}>综合恋商提升</span>
            <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9, display: 'block', marginTop: 2 }}>≈ 3 个月自然成长</span>
          </div>
          <div className="text-center p-3.5" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
            <span style={{ color: '#FFD93D', fontSize: 30, fontWeight: 800, display: 'block', lineHeight: 1.1 }}>2800+</span>
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, display: 'block', marginTop: 4 }}>预计获得 XP</span>
            <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9, display: 'block', marginTop: 2 }}>完成训练即可获得</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {dimAns.slice(0, 3).map((dim, i) => {
            const colors = ['#FF8A80', '#EC407A', '#4FC3F7', '#4ECDC4', '#9B7EDE'];
            return (
              <motion.div key={dim} className="text-center p-2.5" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.05 }}
                style={{ background: 'rgba(245,239,232,0.03)', borderRadius: 10 }}>
                <span style={{ color: colors[i % 5], fontSize: 18, fontWeight: 800, display: 'block' }}>+{5 + i * 2}</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', marginTop: 2 }}>{dim.split('·')[0].trim()}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 定制课程日历预览 */}
      <motion.div className="mb-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 10 }}>📅 训练日程预览</span>
        <div className="overflow-x-auto pb-2" style={{ margin: '0 -4px' }}>
          <div className="flex gap-2" style={{ minWidth: 'max-content', padding: '0 4px' }}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(); d.setDate(d.getDate() + i);
              const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
              const isToday = i === 0;
              const tasks = [
                { title: '开场白练习', min: 10, color: '#FF8A80', icon: '💬' },
                { title: '情绪识别', min: 8, color: '#EC407A', icon: '❤️' },
                { title: '话题训练', min: 12, color: '#4ECDC4', icon: '💡' },
                { title: '观察力提升', min: 10, color: '#4FC3F7', icon: '👁️' },
                { title: '安全感表达', min: 15, color: '#9B7EDE', icon: '🛡️' },
                { title: '共情力实战', min: 12, color: '#EC407A', icon: '❤️' },
                { title: '综合复盘', min: 20, color: '#B39DDB', icon: '🦊' },
              ];
              const task = tasks[i];
              return (
                <motion.div key={i} className="flex-shrink-0 text-center" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.03 }}
                  style={{ width: 82, background: isToday ? 'rgba(155,126,222,0.12)' : 'rgba(245,239,232,0.03)', borderRadius: 14, border: isToday ? '1.5px solid rgba(155,126,222,0.2)' : '1px solid rgba(245,239,232,0.05)', padding: '10px 6px 8px' }}>
                  <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, display: 'block' }}>{isToday ? '今日' : `周${dayNames[d.getDay()]}`}</span>
                  <span style={{ color: isToday ? '#B39DDB' : '#f5efe8', fontSize: 20, fontWeight: 800, display: 'block', margin: '2px 0' }}>{d.getDate()}</span>
                  <div className="mt-1.5">
                    <span style={{ fontSize: 12, display: 'block' }}>{task.icon}</span>
                    <span style={{ color: task.color, fontSize: 9, fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                    <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9 }}>{task.min}min</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 用户评价条 */}
      <motion.div className="mb-5 p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 16, border: '1px solid rgba(245,239,232,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {['🧑', '👨', '🧔'].map((a, i) => (
              <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.2)', border: '2px solid #2a2440', fontSize: 14 }}>{a}</div>
            ))}
          </div>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, fontWeight: 500 }}>12,890+ 人已完成相似训练</span>
        </div>
        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, lineHeight: 1.6, fontStyle: 'italic' }}>"坚持了 21 天，约会成功率提升了 60%，真的有用！"</p>
        <div className="flex mt-2">
          {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#FFD93D', fontSize: 11 }}>★</span>)}
          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, marginLeft: 6 }}>— 阿杰J. · 训练2个月</span>
        </div>
      </motion.div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <motion.button className="py-3.5 px-5 flex items-center justify-center" whileTap={{ scale: 0.97 }}
          style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 16, border: '1px solid rgba(245,239,232,0.08)' }}
          onClick={() => { setCollectStep(-1); setAnswers({}); }}>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 14, fontWeight: 600 }}>重选</span>
        </motion.button>
        <motion.button className="flex-1 py-4 flex items-center justify-center gap-2 relative overflow-hidden" whileTap={{ scale: 0.97 }}
          style={{ background: 'linear-gradient(135deg, #9B7EDE, #7E57C2)', borderRadius: 16, boxShadow: '0 6px 20px rgba(155,126,222,0.3)' }}
          onClick={() => setCollectStep(-1)}>
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', animation: 'shimmer 3s infinite' }} />
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>开始训练</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>→</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ================================================================
 *  训练 Tab — 每日训练执行（免费基础 + VIP定制）  (v10 final)
 * ================================================================ */
const freeTrainingTasks = [
  { id: 1, title: '每日开场白练习', desc: '随机场景练习一次自然开场', xp: 20, icon: '💬', dim: '开场白', color: '#FF8A80', est: '5分钟' },
  { id: 2, title: '情绪日记', desc: '记录今天一次与人交流的感受', xp: 15, icon: '📝', dim: '共情力', color: '#EC407A', est: '3分钟' },
  { id: 3, title: '观察笔记', desc: '记录今天注意到的3个社交细节', xp: 15, icon: '👁️', dim: '观察力', color: '#4FC3F7', est: '5分钟' },
  { id: 4, title: '话题收集', desc: '准备一个明天可以聊的有趣话题', xp: 10, icon: '💡', dim: '话题力', color: '#4ECDC4', est: '3分钟' },
  { id: 5, title: '安全感打卡', desc: '做一件让身边人感到安心的小事', xp: 15, icon: '🤝', dim: '安全感', color: '#9B7EDE', est: '5分钟' },
];

const vipTrainingTasks = [
  { id: 101, title: '安全感话术训练', desc: '练习10句传递可靠感的表达', xp: 45, icon: '🛡️', dim: '安全感', color: '#9B7EDE', difficulty: '中等', est: '15分钟' },
  { id: 102, title: '共情力深度训练', desc: '练习回应对方情绪的3种方式', xp: 45, icon: '❤️', dim: '共情力', color: '#EC407A', difficulty: '中等', est: '12分钟' },
  { id: 103, title: '微表情识别实战', desc: '通过AI练习解读6种微表情', xp: 40, icon: '👁️', dim: '观察力', color: '#4FC3F7', difficulty: '进阶', est: '15分钟' },
  { id: 104, title: '话题延展挑战', desc: '从1个话题自然延展到3个方向', xp: 40, icon: '🎯', dim: '话题力', color: '#4ECDC4', difficulty: '中等', est: '10分钟' },
  { id: 105, title: '创意开场白练习', desc: '学习5种不同场景的开场技巧', xp: 35, icon: '💬', dim: '开场白', color: '#FF8A80', difficulty: '简单', est: '8分钟' },
  { id: 106, title: '深度倾听挑战', desc: '不打断对方完整倾听5分钟', xp: 50, icon: '🎧', dim: '共情力', color: '#EC407A', difficulty: '进阶', est: '20分钟' },
];

/* 训练鼓励语 */
const trainingMotivation = (progress: number, streak: number): { emoji: string; text: string } => {
  if (progress === 100) return { emoji: '🏆', text: '今天的训练全部完成了！' };
  if (progress >= 70) return { emoji: '💪', text: '还差一点就全部完成！' };
  if (progress >= 40) return { emoji: '🔥', text: '状态不错，继续保持！' };
  if (streak >= 3) return { emoji: '⚡', text: `已连续${streak}天，别断了！` };
  return { emoji: '🌟', text: '新的一天，开始训练吧！' };
};

function TrainingTab({ isVip, radarData, onOpenVip }: { isVip: boolean; radarData: any[]; onOpenVip: () => void }) {
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    const today = new Date().toDateString();
    try { return JSON.parse(localStorage.getItem(`foxsay_train_${today}`) || '[]'); } catch { return []; }
  });

  const toggleComplete = (id: number) => {
    setCompletedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(`foxsay_train_${new Date().toDateString()}`, JSON.stringify(next));
      return next;
    });
  };

  const allTasks = isVip ? [...freeTrainingTasks, ...vipTrainingTasks] : freeTrainingTasks;
  const completedCount = completedIds.filter(id => allTasks.some(t => t.id === id)).length;
  const progress = allTasks.length ? Math.round((completedCount / allTasks.length) * 100) : 0;
  const totalXp = allTasks.filter(t => completedIds.includes(t.id)).reduce((s, t) => s + t.xp, 0);
  const maxXp = allTasks.reduce((s, t) => s + t.xp, 0);

  // 本周连续天数
  const streak = (() => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const data = localStorage.getItem(`foxsay_train_${d.toDateString()}`);
      if (data && JSON.parse(data).length > 0) count++; else break;
    }
    return count;
  })();

  const motivation = trainingMotivation(progress, streak);

  return (
    <div style={{ background: 'linear-gradient(180deg, rgba(74,61,107,0.15) 0%, rgba(42,36,64,0.08) 50%, transparent 100%)', borderRadius: 20, margin: '-4px -2px', padding: '4px 2px' }}>
      {/* 今日训练概览 — 高级卡片 */}
      <motion.div className="mb-5 overflow-hidden relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ borderRadius: 20, background: 'linear-gradient(145deg, #352f55 0%, #2a2440 100%)', border: '1px solid rgba(155,126,222,0.1)' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -15, left: -15, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,126,222,0.08) 0%, transparent 70%)' }} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>今日训练</span>
                {streak >= 1 && <span className="px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, borderRadius: 8, background: 'linear-gradient(135deg, rgba(255,138,128,0.15), rgba(255,107,107,0.1))', color: '#FF8A80', border: '1px solid rgba(255,138,128,0.15)' }}>🔥 连续{streak}天</span>}
              </div>
              <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>
                {completedCount}/{allTasks.length} 完成 · {totalXp}/{maxXp} XP
              </span>
            </div>
            {/* 环形进度 */}
            <div className="relative" style={{ width: 64, height: 64 }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(245,239,232,0.06)" strokeWidth="5" />
                <motion.circle cx="32" cy="32" r="26" fill="none" stroke={progress === 100 ? '#4ECDC4' : '#9B7EDE'} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 26} initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - progress / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ transformOrigin: '32px 32px', transform: 'rotate(-90deg)', filter: progress === 100 ? 'drop-shadow(0 0 6px rgba(78,205,196,0.5))' : 'drop-shadow(0 0 4px rgba(155,126,222,0.3))' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: progress === 100 ? '#4ECDC4' : '#f5efe8', fontSize: 16, fontWeight: 800 }}>{progress}%</span>
              </div>
            </div>
          </div>

          {/* 鼓励语 */}
          <motion.div className="flex items-center gap-1.5 mt-2 mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <span style={{ fontSize: 12 }}>{motivation.emoji}</span>
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, fontWeight: 500 }}>{motivation.text}</span>
          </motion.div>

          {/* 分维度进度条 */}
          <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.06)' }}>
            <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #9B7EDE, #4ECDC4)', borderRadius: 2 }}
              initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
          </div>
        </div>
      </motion.div>

      {/* 基础训练 */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 14 }}>📋</span>
        <span style={{ color: '#B39DDB', fontSize: 15, fontWeight: 700 }}>基础训练</span>
        <span className="px-2 py-0.5 ml-1" style={{ fontSize: 9, fontWeight: 600, borderRadius: 6, background: 'rgba(78,205,196,0.1)', color: '#4ECDC4' }}>每日刷新</span>
        <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10, marginLeft: 'auto' }}>
          {freeTrainingTasks.filter(t => completedIds.includes(t.id)).length}/{freeTrainingTasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        {freeTrainingTasks.map((task, i) => {
          const done = completedIds.includes(task.id);
          return (
            <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ background: done ? 'linear-gradient(145deg, rgba(78,205,196,0.08), #2a2440)' : 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 16, border: done ? '1px solid rgba(78,205,196,0.15)' : '1px solid rgba(155,126,222,0.1)', overflow: 'hidden' }}>
              <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={() => toggleComplete(task.id)}>
                {/* 完成按钮 */}
                <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: done ? 'rgba(78,205,196,0.15)' : 'rgba(155,126,222,0.15)', border: done ? '1.5px solid rgba(78,205,196,0.25)' : '1.5px solid rgba(155,126,222,0.2)' }}
                  whileTap={{ scale: 0.85 }} animate={{ scale: done ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}>
                  {done ? (
                    <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} style={{ color: '#4ECDC4', fontSize: 17, fontWeight: 800 }}>✓</motion.span>
                  ) : (
                    <span style={{ fontSize: 20 }}>{task.icon}</span>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <span style={{ color: done ? 'rgba(245,239,232,0.4)' : '#f5efe8', fontSize: 14, fontWeight: 600, textDecoration: done ? 'line-through' : 'none', display: 'block', transition: 'color 0.2s' }}>{task.title}</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>{task.desc}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
                  <span className="px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, borderRadius: 6, background: done ? 'rgba(78,205,196,0.1)' : 'rgba(155,126,222,0.12)', color: done ? '#4ECDC4' : '#B39DDB', border: done ? '1px solid rgba(78,205,196,0.15)' : '1px solid rgba(155,126,222,0.15)' }}>+{task.xp} XP</span>
                  <div className="flex items-center gap-1">
                    <span style={{ color: '#B39DDB', fontSize: 9, fontWeight: 600 }}>{task.dim}</span>
                    <span style={{ color: 'rgba(245,239,232,0.2)', fontSize: 9 }}>·</span>
                    <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9 }}>{task.est}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VIP 专项训练 */}
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 14 }}>👑</span>
        <span style={{ color: '#B39DDB', fontSize: 15, fontWeight: 700 }}>VIP 专项训练</span>
        {!isVip && <span className="px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, borderRadius: 6, background: 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,193,7,0.1))', color: '#FFD93D', border: '1px solid rgba(255,217,61,0.15)' }}>VIP</span>}
        {isVip && <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10, marginLeft: 'auto' }}>
          {vipTrainingTasks.filter(t => completedIds.includes(t.id)).length}/{vipTrainingTasks.length}
        </span>}
      </div>

      {!isVip ? (
        <motion.div className="overflow-hidden relative" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 20, background: 'linear-gradient(145deg, #352f55 0%, #2a2440 100%)', border: '1px solid rgba(155,126,222,0.12)' }}>
          <div style={{ position: 'absolute', top: -20, right: -15, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,217,61,0.08) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,126,222,0.06) 0%, transparent 70%)' }} />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,193,7,0.1))', border: '1px solid rgba(255,217,61,0.2)', boxShadow: '0 4px 12px rgba(255,217,61,0.1)' }}>
                <span style={{ fontSize: 24 }}>👑</span>
              </div>
              <div>
                <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700, display: 'block' }}>解锁专项训练</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>6 项高阶训练 · 效果提升 3 倍</span>
              </div>
            </div>

            {/* 预览锁定任务 */}
            <div className="flex flex-col gap-2 mb-4">
              {vipTrainingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-3.5 py-3" style={{ background: 'rgba(155,126,222,0.06)', borderRadius: 12, border: '1px solid rgba(155,126,222,0.08)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.12)' }}>
                    <span style={{ fontSize: 16, filter: 'grayscale(0.2) opacity(0.7)' }}>{task.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12, fontWeight: 600, display: 'block' }}>{task.title}</span>
                    <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10 }}>{task.difficulty} · {task.est}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ color: 'rgba(155,126,222,0.6)', fontSize: 10, fontWeight: 600 }}>+{task.xp}</span>
                    <span style={{ color: 'rgba(245,239,232,0.2)', fontSize: 12 }}>🔒</span>
                  </div>
                </div>
              ))}
              <div className="text-center py-1.5">
                <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 10 }}>还有 {vipTrainingTasks.length - 3} 项训练…</span>
              </div>
            </div>

            {/* 对比数据 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{ icon: '⚡', label: '效率', free: '1x', vip: '3x' }, { icon: '🎯', label: '精准度', free: '基础', vip: '定制' }, { icon: '📈', label: '预期效果', free: '+8', vip: '+22' }].map((d, i) => (
                <div key={i} className="text-center p-2.5" style={{ background: 'rgba(155,126,222,0.06)', borderRadius: 10, border: '1px solid rgba(155,126,222,0.08)' }}>
                  <span style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>{d.icon}</span>
                  <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9, display: 'block' }}>{d.label}</span>
                  <span style={{ color: '#FFD93D', fontSize: 14, fontWeight: 700, display: 'block' }}>{d.vip}</span>
                </div>
              ))}
            </div>

            {/* 限时提示 */}
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <span style={{ fontSize: 10 }}>⏰</span>
              <span style={{ color: 'rgba(255,138,128,0.7)', fontSize: 10, fontWeight: 600 }}>限时优惠中 · 首月立减 50%</span>
            </div>

            <motion.button className="w-full py-4 flex items-center justify-center gap-2 relative overflow-hidden" whileTap={{ scale: 0.97 }}
              style={{ background: 'linear-gradient(135deg, #FFD93D 0%, #FFC107 100%)', borderRadius: 16, boxShadow: '0 6px 20px rgba(255,217,61,0.2)' }}
              onClick={onOpenVip}>
              <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 2.5s infinite' }} />
              <span style={{ fontSize: 14 }}>👑</span>
              <span style={{ color: '#1a1520', fontSize: 15, fontWeight: 800 }}>开通 VIP · 解锁全部训练</span>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {vipTrainingTasks.map((task, i) => {
            const done = completedIds.includes(task.id);
            return (
              <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ background: done ? 'linear-gradient(145deg, rgba(78,205,196,0.08), #2a2440)' : 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 16, border: done ? '1px solid rgba(78,205,196,0.15)' : '1px solid rgba(155,126,222,0.12)', overflow: 'hidden' }}>
                <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={() => toggleComplete(task.id)}>
                  <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? 'rgba(78,205,196,0.15)' : 'rgba(155,126,222,0.15)', border: done ? '1.5px solid rgba(78,205,196,0.25)' : '1.5px solid rgba(155,126,222,0.2)' }}
                    whileTap={{ scale: 0.85 }} animate={{ scale: done ? [1, 1.1, 1] : 1 }} transition={{ duration: 0.3 }}>
                    {done ? (
                      <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} style={{ color: '#4ECDC4', fontSize: 17, fontWeight: 800 }}>✓</motion.span>
                    ) : (
                      <span style={{ fontSize: 20 }}>{task.icon}</span>
                    )}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: done ? 'rgba(245,239,232,0.4)' : '#f5efe8', fontSize: 14, fontWeight: 600, textDecoration: done ? 'line-through' : 'none', transition: 'color 0.2s' }}>{task.title}</span>
                      <span className="px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 600, borderRadius: 4, background: 'rgba(155,126,222,0.12)', color: '#B39DDB', border: '1px solid rgba(155,126,222,0.15)' }}>{task.difficulty}</span>
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>{task.desc}</span>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 gap-1.5">
                    <span className="px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, borderRadius: 6, background: done ? 'rgba(78,205,196,0.1)' : 'rgba(155,126,222,0.12)', color: done ? '#4ECDC4' : '#B39DDB', border: done ? '1px solid rgba(78,205,196,0.15)' : '1px solid rgba(155,126,222,0.15)' }}>+{task.xp} XP</span>
                    <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9 }}>{task.est}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 全部完成庆祝 */}
      {completedCount === allTasks.length && allTasks.length > 0 && (
        <motion.div className="mt-5 overflow-hidden relative text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ borderRadius: 20, background: 'linear-gradient(145deg, #352f55, #2a2440)', border: '1px solid rgba(78,205,196,0.15)', padding: '28px 16px' }}>
          {/* 装饰光效 */}
          <div style={{ position: 'absolute', top: -15, right: -10, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)' }} />
          <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            style={{ fontSize: 48, display: 'block', marginBottom: 10, filter: 'drop-shadow(0 4px 12px rgba(78,205,196,0.3))' }}>🎉</motion.span>
          <span style={{ color: '#4ECDC4', fontSize: 20, fontWeight: 800, display: 'block', marginBottom: 6 }}>今日训练全部完成！</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, display: 'block', marginBottom: 14 }}>
            获得 <span style={{ color: '#B39DDB', fontWeight: 800, fontSize: 15 }}>{totalXp} XP</span> · 明天继续加油
          </span>
          <div className="flex items-center justify-center gap-3">
            {streak >= 1 && (
              <span className="inline-flex items-center gap-1 px-3.5 py-2" style={{ background: 'rgba(255,138,128,0.1)', borderRadius: 12, color: '#FF8A80', fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,138,128,0.15)' }}>
                🔥 已连续训练 {streak} 天
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3.5 py-2" style={{ background: 'rgba(155,126,222,0.1)', borderRadius: 12, color: '#B39DDB', fontSize: 12, fontWeight: 600, border: '1px solid rgba(155,126,222,0.15)' }}>
              ⭐ 超越了 {Math.min(95, 60 + streak * 5)}% 的用户
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function DiagnosticPage() {
  const user = useUser();
  const { speciesId: userSpeciesId, matchRate: userMatchRate, updateUser } = user as any;
  const radarData = buildRadarData((user as any).abilityScores);
  const [selectedSkill, setSelectedSkill] = useState<(typeof radarData)[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDeepTest, setShowDeepTest] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<typeof loveSpecies[0] | null>(null);
  const [showVIPPage, setShowVIPPage] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [subTab, setSubTab] = useState(0); // 0=诊断 1=课程 2=训练
  const isVipActive = !!(user as any).isVip && ((user as any).isPro?.() ?? false);
  // 物种数据优先读取 UserContext（新用户鉴定结果），未鉴定时 fallback 到 laosihu
  const userSpecies = {
    speciesId: userSpeciesId || defaultUserSpecies.speciesId,
    matchRate: userMatchRate || defaultUserSpecies.matchRate,
  };
  const setUserSpecies = (v: { speciesId: string; matchRate: number }) => {
    const sp = loveSpecies.find(s => s.id === v.speciesId);
    updateUser({
      speciesId: v.speciesId,
      speciesName: sp?.name || '老司狐',
      speciesEmoji: sp?.emoji || '🦊',
      matchRate: v.matchRate,
    });
  };
  const abilityVals = (user as any).abilityScores ? Object.values((user as any).abilityScores).map((v: any) => Number(v) || 0) : [];
  const overallScore = abilityVals.length ? Math.round(abilityVals.reduce((a: number, b: number) => a + b, 0) / abilityVals.length) : 0;
  const prevScore = Math.max(0, overallScore - 4);

  const quizQuestions = [
    { q: '周末约会迟到了30分钟，你的第一反应是？', emoji: '⏰', options: ['假装不在意说没关系', '发消息问出了什么事', '有点生气但忍住了', '直接表达不满'] },
    { q: '暧昧期对方3天没回消息，你会？', emoji: '📱', options: ['疯狂查看TA的朋友圈', '找朋友分析各种可能', '告诉自己爱来不来', '发一条轻松的消息试探'] },
    { q: '你更容易被哪种聊天方式打动？', emoji: '💬', options: ['突然发来的关心消息', '有趣的表情包大战', '深夜的走心长文', '偶尔的语音和视频'] },
    { q: '恋爱中你最受不了的是？', emoji: '💔', options: ['对方太黏人/控制欲强', '对方太冷淡/已读不回', '对方和异性太亲近', '互相不理解/三观不合'] },
    { q: '遇到喜欢的人你通常会？', emoji: '🦊', options: ['主动出击/直接表白', '暗示+试探/等对方主动', '默默关注/享受暗恋', '变成话痨/疯狂找话题'] },
    { q: '你觉得恋爱中最重要的是？', emoji: '❤️', options: ['互相尊重+独立空间', '甜蜜日常+浪漫仪式感', '深度理解+灵魂共鸣', '安全感+坚定的承诺'] },
  ];

  const handleQuizAnswer = (oi: number) => {
    const next = [...quizAnswers, oi];
    setQuizAnswers(next);
    if (next.length >= quizQuestions.length) {
      // Simple mapping: sum answers mod species count
      const idx = next.reduce((a, b) => a + b, 0) % loveSpecies.length;
      setQuizResult(loveSpecies[idx]);
    } else {
      setQuizStep(prev => prev + 1);
    }
  };

  const confirmQuiz = () => {
    if (quizResult) {
      setUserSpecies({ speciesId: quizResult.id, matchRate: Math.floor(Math.random() * 15) + 85 });
    }
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setShowQuiz(false);
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setShowQuiz(false);
  };

  const generateShareImage = (us: typeof userSpecies) => {
    const species = loveSpecies.find(s => s.id === us.speciesId) || loveSpecies[0];
    const w = 750, h = 1334;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2b2535');
    grad.addColorStop(0.5, '#352f45');
    grad.addColorStop(1, '#2b2535');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = species.color;
    ctx.beginPath(); ctx.arc(600, 200, 300, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(150, 1100, 200, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Top brand
    ctx.fillStyle = 'rgba(245,239,232,0.4)';
    ctx.font = '600 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FoxSay · 恋爱物种鉴定', w / 2, 80);

    // Species emoji (large)
    ctx.font = '120px system-ui';
    ctx.fillText(species.emoji, w / 2, 280);

    // Species name
    ctx.fillStyle = '#fff';
    ctx.font = '900 56px system-ui, -apple-system, sans-serif';
    ctx.fillText(species.name, w / 2, 380);

    // Camp tag
    ctx.fillStyle = species.color;
    ctx.font = '700 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${species.campIcon} ${species.camp}`, w / 2, 430);

    // Match rate ring (simplified)
    const cx = w / 2, cy = 560, r = 60;
    ctx.strokeStyle = 'rgba(245,239,232,0.1)';
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = species.color;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * us.matchRate / 100)); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = '900 36px system-ui';
    ctx.fillText(`${us.matchRate}%`, cx, cy + 12);
    ctx.fillStyle = 'rgba(245,239,232,0.5)';
    ctx.font = '500 16px system-ui';
    ctx.fillText('匹配度', cx, cy + 38);

    // Description
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '500 26px system-ui, -apple-system, sans-serif';
    const desc = `「${species.desc}」`;
    // Word wrap
    const maxW = w - 120;
    let words = desc.split('');
    let line = '', ly = 720;
    for (const ch of words) {
      const testLine = line + ch;
      if (ctx.measureText(testLine).width > maxW) {
        ctx.fillText(line, w / 2, ly);
        line = ch; ly += 40;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, w / 2, ly);

    // Soul quote
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = 'italic 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(`灵魂拷问：${species.soulQuote}`, w / 2, ly + 70);

    // Trait bars
    const barStartY = ly + 140;
    traitData.forEach((t, i) => {
      const by = barStartY + i * 50;
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(245,239,232,0.7)';
      ctx.font = '500 20px system-ui';
      ctx.fillText(`${t.icon} ${t.label}`, 80, by);
      ctx.textAlign = 'right';
      ctx.fillStyle = t.color;
      ctx.font = '800 20px system-ui';
      ctx.fillText(`${t.value}`, w - 80, by);
      // Bar
      ctx.fillStyle = 'rgba(245,239,232,0.08)';
      const bx = 80, bw = w - 160, bh = 6, bby = by + 10;
      ctx.beginPath(); ctx.roundRect(bx, bby, bw, bh, 3); ctx.fill();
      ctx.fillStyle = t.color;
      ctx.beginPath(); ctx.roundRect(bx, bby, bw * t.value / 100, bh, 3); ctx.fill();
    });

    // QR code placeholder (draw a simple QR-like square)
    ctx.textAlign = 'center';
    const qrY = h - 200;
    ctx.strokeStyle = 'rgba(245,239,232,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 45, qrY, 90, 90);
    // Inner pattern
    ctx.fillStyle = 'rgba(245,239,232,0.25)';
    ctx.fillRect(w / 2 - 35, qrY + 10, 20, 20);
    ctx.fillRect(w / 2 + 15, qrY + 10, 20, 20);
    ctx.fillRect(w / 2 - 35, qrY + 60, 20, 20);
    ctx.fillRect(w / 2 - 10, qrY + 35, 20, 20);
    ctx.fillRect(w / 2 + 15, qrY + 60, 20, 20);

    ctx.fillStyle = 'rgba(245,239,232,0.5)';
    ctx.font = '500 18px system-ui';
    ctx.fillText('扫码下载 FoxSay', w / 2, qrY + 120);

    // Bottom watermark
    ctx.fillStyle = 'rgba(245,239,232,0.2)';
    ctx.font = '400 14px system-ui';
    ctx.fillText('FoxSay — 你的恋爱成长伙伴', w / 2, h - 40);

    setShareImageUrl(canvas.toDataURL('image/png'));
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <ArrowUp size={10} color="#4ECDC4" />;
    if (trend === 'down') return <ArrowDown size={10} color="#FF8A80" />;
    return <Minus size={10} color="rgba(245,239,232,0.55)" />;
  };

  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.1) 0%, rgba(155,126,222,0.10) 30%, transparent 100%)',
        }} />

        <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '14px', marginBottom: 4 }}>能力诊断</p>
        <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0, marginBottom: 16 }}>你的恋爱力</h1>

        {/* ═══ 子Tab切换 ═══ */}
        <div className="flex gap-1 mb-5 p-1" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
          {[
            { label: '诊断', icon: '📊' },
            { label: '课程', icon: '📚' },
            { label: '训练', icon: '🎯' },
          ].map((t, i) => (
            <motion.button key={t.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5"
              style={{
                borderRadius: 10,
                background: subTab === i ? 'rgba(155,126,222,0.2)' : 'transparent',
                border: subTab === i ? '1px solid rgba(155,126,222,0.3)' : '1px solid transparent',
              }}
              whileTap={{ scale: 0.97 }} onClick={() => setSubTab(i)}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{
                color: subTab === i ? '#B39DDB' : 'rgba(245,239,232,0.5)',
                fontSize: 13, fontWeight: 600,
              }}>{t.label}</span>
            </motion.button>
          ))}
        </div>

        {/* ═══ 诊断 Tab ═══ */}
        {subTab === 0 && (<>

        {/* 恋爱物种鉴定 */}
        <motion.div className="mb-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-3">
            <IcRadar size={14} color="#B39DDB" />
            <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>你的恋爱物种</span>
          </div>
          <div className="p-4" style={{ background: '#453a60', borderRadius: 20 }}>
            <SpeciesCard
              onRetest={() => setShowQuiz(true)}
              onDeepTest={() => setShowDeepTest(true)}
              onReDeep={() => setShowDeepTest(true)}
              onShare={() => generateShareImage(userSpecies)}
              userSpecies={userSpecies}
              hasDeepTest={!!(user as any).subSpecies}
              subSpeciesId={(user as any).subSpecies}
            />
          </div>
        </motion.div>

        {/* Overall score */}
        <motion.div className="p-[1px] mb-5" style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,138,128,0.18), rgba(155,126,222,0.12))' }}
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
          <div className="p-6 flex items-center justify-between" style={{ background: '#352f45', borderRadius: 15 }}>
            <div>
              <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: '14px', marginBottom: 4 }}>综合评分</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(78,205,196,0.15)', borderRadius: 6 }}>
                  <ArrowUp size={12} color="#4ECDC4" />
                  <span style={{ color: '#4ECDC4', fontSize: '13px', fontWeight: 600 }}>+{overallScore - prevScore}</span>
                </div>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '13px' }}>较上周</span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '14px', marginTop: 4 }}>
                超过 <span style={{ color: '#FF8A80', fontWeight: 600 }}>76%</span> 的用户
              </p>
              <motion.button className="px-3 py-1 flex items-center gap-1 mt-3"
                style={{ background: 'rgba(255,138,128,0.1)', borderRadius: 980, color: '#FF8A80', fontSize: '11px', fontWeight: 600 }}
                whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(true)}>
                <IcChart size={10} color="#FF8A80" /> 查看趋势
              </motion.button>
            </div>
            {/* Arc Progress Ring */}
            <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(245,239,232,0.08)" strokeWidth="8" />
                <motion.circle cx="55" cy="55" r="46" fill="none"
                  stroke="url(#scoreArcGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  style={{ transformOrigin: '55px 55px', rotate: '-90deg' }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - overallScore / 100) }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="scoreArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8A80" />
                    <stop offset="100%" stopColor="#FFB199" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ color: '#f5efe8', fontSize: '32px', fontWeight: 700, lineHeight: 1, textShadow: '0 0 20px rgba(255,138,128,0.3)' }}>{overallScore}</span>
                <span style={{ color: 'rgba(245,239,232,0.38)', fontSize: '12px' }}>/100</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Suggestions */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <IconBubble size={24} bg={gradients.golden}><IcLightbulb size={12} color="#fff" /></IconBubble>
            <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600 }}>AI 提升建议</span>
          </div>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {aiSuggestions.map((s, i) => (
              <motion.button key={s.title} className="flex-shrink-0 p-4 text-left"
                style={{ background: '#453a60', borderRadius: 14, width: 200, scrollSnapAlign: 'start', border: '1px solid rgba(245,239,232,0.08)' }}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.98 }}>
                <IconBubble size={40} bg={s.bg}>{s.icon}</IconBubble>
                <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600, marginBottom: 4, marginTop: 10 }}>{s.title}</p>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px', lineHeight: 1.4, marginBottom: 10 }}>{s.desc}</p>
                <span style={{ color: '#FF8A80', fontSize: '12px', fontWeight: 600 }}>{s.action} →</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600 }}>能力分项</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>点击查看详情</span>
        </div>

        <div className="flex flex-col gap-3">
          {radarData.map((skill, idx) => (
            <motion.button key={skill.label} className="w-full text-left"
              style={{
                borderRadius: 16,
                border: skill.trend === 'up' ? '1px solid rgba(78,205,196,0.15)'
                  : skill.trend === 'down' ? '1px solid rgba(255,138,128,0.15)' : '1px solid rgba(245,239,232,0.06)',
              }}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileTap={{ scale: 0.98 }} onClick={() => setSelectedSkill(skill)}>
              <div className="p-4" style={{ background: `linear-gradient(135deg, ${skill.barColor[0]}08, #453a60)`, borderRadius: 16 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <IconBubble size={38} bg={skill.bg} className="opacity-[0.85]">{skill.icon}</IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{skill.label}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendIcon trend={skill.trend} />
                        <span style={{ color: skill.trend === 'up' ? '#4ECDC4' : skill.trend === 'down' ? '#FF8A80' : 'rgba(245,239,232,0.38)', fontSize: '11px', fontWeight: 600 }}>
                          {skill.change > 0 ? `+${skill.change}` : skill.change === 0 ? '持平' : skill.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#FF8A80', fontSize: '17px', fontWeight: 600 }}>{skill.value}</span>
                    <ChevronRight size={14} color="rgba(245,239,232,0.55)" />
                  </div>
                </div>
                <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.10)' }}>
                  <motion.div className="h-full" style={{ background: `linear-gradient(90deg, ${skill.barColor[0]}, ${skill.barColor[1]})`, borderRadius: 2 }} initial={{ width: '0%' }} animate={{ width: `${skill.value}%` }} transition={{ duration: 0.8, delay: 0.2 + idx * 0.08 }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        </>)}

        {/* ═══ 课程 Tab ═══ */}
        {subTab === 1 && <CourseTab isVip={isVipActive} onOpenVip={() => setShowVIPPage(true)} />}

        {/* ═══ 训练 Tab ═══ */}
        {subTab === 2 && <TrainingTab isVip={isVipActive} radarData={radarData} onOpenVip={() => setShowVIPPage(true)} />}

      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedSkill(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <IconBubble size={48} bg={selectedSkill.bg}>{selectedSkill.icon}</IconBubble>
                    <div>
                      <h2 style={{ color: '#f5efe8', fontSize: '19px', fontWeight: 600 }}>{selectedSkill.label}</h2>
                      <span style={{ color: '#FF8A80', fontSize: '28px', fontWeight: 700 }}>{selectedSkill.value}<span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '14px' }}>/100</span></span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedSkill(null)}>
                    <X size={22} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>
                <div className="p-4 mb-4" style={{ background: '#453a60', borderRadius: 12 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconBubble size={24} bg={gradients.golden}><IcLightbulb size={12} color="#fff" /></IconBubble>
                    <span style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600 }}>AI 教练建议</span>
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: '13px', lineHeight: 1.5 }}>{selectedSkill.tips}</p>
                </div>
                <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                  style={{ background: gradients.coral, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                  whileTap={{ scale: 0.98 }} onClick={() => setSelectedSkill(null)}>
                  <IcBook size={16} color="#fff" /> 开始专项练习
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowHistory(false)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <IconBubble size={28} bg={gradients.coral}><IcChart size={14} color="#fff" /></IconBubble>
                    <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>成长趋势</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowHistory(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>
                <div className="flex items-end justify-between gap-3" style={{ height: 140 }}>
                  {weeklyHistory.map((w, i) => (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                      <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '11px', fontWeight: 600 }}>{w.score}</span>
                      <motion.div className="w-full" style={{
                        background: i === weeklyHistory.length - 1 ? gradients.coral : '#453a60',
                        borderRadius: 8,
                      }} initial={{ height: 0 }} animate={{ height: `${(w.score / 100) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} />
                      <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '10px' }}>{w.week}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 flex items-center gap-3" style={{ background: '#453a60', borderRadius: 12 }}>
                  <IconBubble size={36} bg={gradients.mint}><IcChart size={16} color="#fff" /></IconBubble>
                  <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', lineHeight: 1.5 }}>
                    你的综合评分在过去5周内提升了 <span style={{ color: '#4ECDC4', fontWeight: 600 }}>17分</span>，继续加油！
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 物种重新鉴定 Quiz 弹窗 ====== */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={resetQuiz} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#352f45', borderRadius: '20px 20px 0 0', maxHeight: '88vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: '88vh' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <IconBubble size={32} bg={gradients.rose}><IcHeart size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>恋爱物种鉴定</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>6道题揭示你的恋爱人格</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={resetQuiz}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* 进度条 */}
                {!quizResult && (
                  <div className="flex items-center gap-1.5 mb-5">
                    {quizQuestions.map((_, qi) => (
                      <div key={qi} className="flex-1" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.1)' }}>
                        <motion.div className="h-full" style={{
                          borderRadius: 2,
                          background: qi < quizStep ? gradients.coral : qi === quizStep ? 'rgba(255,138,128,0.5)' : 'transparent',
                        }} animate={{ width: qi <= quizStep ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {!quizResult ? (
                    <motion.div key={`qq-${quizStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <div className="text-center mb-5">
                        <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>{quizQuestions[quizStep].emoji}</span>
                        <h3 style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700, lineHeight: 1.5 }}>{quizQuestions[quizStep].q}</h3>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginTop: 4 }}>第 {quizStep + 1}/{quizQuestions.length} 题</p>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {quizQuestions[quizStep].options.map((opt, oi) => (
                          <motion.button key={oi} className="w-full text-left p-4"
                            style={{ background: '#453a60', borderRadius: 14, border: '1px solid rgba(245,239,232,0.08)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleQuizAnswer(oi)}>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 500 }}>{opt}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="quiz-result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                      {/* 鉴定结果 */}
                      <div className="text-center mb-3">
                        <span style={{ fontSize: 14, color: 'rgba(245,239,232,0.5)' }}>你的恋爱物种是</span>
                      </div>
                      <div style={{
                        background: quizResult.bg, borderRadius: 16, padding: '24px 20px', position: 'relative', overflow: 'hidden',
                        border: `1px solid ${quizResult.color}40`,
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.1, pointerEvents: 'none' }}>{quizResult.emoji}</div>
                        <div className="relative flex items-center gap-4 mb-4">
                          <motion.span style={{ fontSize: 56, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}>{quizResult.emoji}</motion.span>
                          <div>
                            <div style={{ color: '#fff', fontSize: 28, fontWeight: 900, textShadow: `0 0 20px ${quizResult.color}80` }}>{quizResult.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }}>{quizResult.campIcon} {quizResult.camp}</div>
                          </div>
                        </div>
                        <p className="relative" style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                          「{quizResult.desc}」
                        </p>
                        <p className="relative" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 8, fontStyle: 'italic', paddingLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.25)' }}>
                          灵魂拷问：{quizResult.soulQuote}
                        </p>
                      </div>

                      <div className="flex gap-3 mt-5">
                        <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
                          style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: '#f5efe8', fontSize: 14, fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={confirmQuiz}>
                          确定
                        </motion.button>
                        <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
                          style={{ background: gradients.coral, borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={() => { resetQuiz(); setShowQuiz(true); }}>
                          🔄 再测一次
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 非VIP点击恋商周报 → 打开VIPPage ====== */}
      {showVIPPage && <VIPPage onClose={() => setShowVIPPage(false)} />}

      {/* ====== 分享图弹窗 ====== */}
      <AnimatePresence>
        {shareImageUrl && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={() => setShareImageUrl(null)} />
            <motion.div className="relative w-[85%] max-w-[350px]"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}>
              <img src={shareImageUrl} alt="分享图" className="w-full rounded-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
              <div className="flex gap-3 mt-4 justify-center">
                <motion.button className="px-5 py-2.5 flex items-center gap-2"
                  style={{ background: 'rgba(245,239,232,0.12)', borderRadius: 12, color: '#f5efe8', fontSize: 13, fontWeight: 600 }}
                  whileTap={{ scale: 0.95 }} onClick={() => setShareImageUrl(null)}>
                  关闭
                </motion.button>
                <motion.button className="px-5 py-2.5 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #FF8A80, #B39DDB)', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600 }}
                  whileTap={{ scale: 0.95 }} onClick={() => {
                    const a = document.createElement('a');
                    a.href = shareImageUrl;
                    a.download = `FoxSay_恋爱物种_${Date.now()}.png`;
                    a.click();
                  }}>
                  📥 保存图片
                </motion.button>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, textAlign: 'center', marginTop: 10 }}>长按图片可直接分享到朋友圈</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== VIP 完整周报 ====== */}
      <AnimatePresence>
        {showFullReport && <WeeklyReportFull onClose={() => setShowFullReport(false)} radarData={radarData} subTier={(user as any).subTier} />}
      </AnimatePresence>

      {/* ====== 深度物种测试全屏 ====== */}
      <AnimatePresence>
        {showDeepTest && <DeepSpeciesTest onClose={() => setShowDeepTest(false)} />}
      </AnimatePresence>
    </>
  );
}