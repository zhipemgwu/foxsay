import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { IconBubble, IcHeart, IcSparkle, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';
import { ABILITY_META, normalizeAbilityScores, type AbilityKey } from '../services/ability';

/* ═══════════════════════════════════════
 *  题库 — 每日轮换
 * ═══════════════════════════════════════ */
const questionPool = [
  // —— 感情状态维度 (dim=0 → 恋爱温度计)
  { dim: 0, q: '今天你的感情状态是？', emoji: '💕', options: ['甜蜜满满', '平淡如水', '小有波澜', '需要充电', '迷茫困惑'] },
  { dim: 0, q: '今天你对感情的信心如何？', emoji: '✨', options: ['超级有信心', '比较乐观', '一般般', '有点焦虑', '很没底'] },
  { dim: 0, q: '此刻你的恋爱幸福感？', emoji: '🌈', options: ['爆棚', '挺高的', '中等', '偏低', '很低'] },
  { dim: 0, q: '今天有想TA的瞬间吗？', emoji: '💭', options: ['一直在想', '好几次', '偶尔闪过', '没怎么想', '有点刻意回避'] },
  { dim: 0, q: '你觉得今天的情绪状态是？', emoji: '🎭', options: ['阳光满满', '心情不错', '平平淡淡', '有点低落', '很糟糕'] },
  // —— 亲密互动维度 (dim=1 → 亲密度报告)
  { dim: 1, q: '最近和TA互动频率怎样？', emoji: '📱', options: ['每天都聊', '隔天联系', '一周几次', '比较少', '单身修炼中'] },
  { dim: 1, q: '你们上次深入聊天是什么时候？', emoji: '🗣️', options: ['今天', '昨天', '这周内', '上周', '记不清了'] },
  { dim: 1, q: '最近一次让你心动的互动？', emoji: '💓', options: ['今天就有', '这两天', '这周', '很久没有了', '暂时没有对象'] },
  { dim: 1, q: '你们之间的默契度如何？', emoji: '🤝', options: ['心有灵犀', '挺有默契', '还行吧', '经常误解', '需要磨合'] },
  { dim: 1, q: '上次约会/见面质量如何？', emoji: '🌟', options: ['超级棒', '很愉快', '一般般', '有点尴尬', '还没约过'] },
  // —— 成长意愿维度 (dim=2 → 成长方向)
  { dim: 2, q: '你最想提升的能力是？', emoji: '🎯', options: ['表达心意', '化解矛盾', '制造浪漫', '读懂暗示', '建立安全感'] },
  { dim: 2, q: '今天有在恋爱方面学到什么吗？', emoji: '📚', options: ['学到很多', '有一点收获', '看了些文章', '没怎么学', '完全没有'] },
  { dim: 2, q: '你愿意为感情投入多少时间学习？', emoji: '⏰', options: ['每天30分钟+', '每天15分钟', '有空就学', '偶尔看看', '现在不想学'] },
  { dim: 2, q: '遇到感情问题你通常怎么做？', emoji: '🧠', options: ['主动分析解决', '找朋友聊', '看专业文章', '等它过去', '逃避不想'] },
  { dim: 2, q: '你对自己恋爱能力的评价？', emoji: '💪', options: ['很有自信', '还不错', '一般般', '比较弱', '很需要提升'] },
];

/** 根据日期 seed 从每个维度各抽题，总共 5 题 */
function getDailyQuestions(): typeof questionPool {
  const seed = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  const abs = Math.abs(hash);
  const dims = [0, 1, 2];
  const pools = dims.map(d => questionPool.filter(q => q.dim === d));
  const picked: typeof questionPool = [];
  // 每个维度至少抽 1 题
  dims.forEach((d, di) => {
    const pool = pools[d];
    picked.push(pool[(abs + di * 7) % pool.length]);
  });
  // 再补 2 题到总共 5 题
  for (let extra = 0; extra < 2; extra++) {
    const d = (abs + extra * 13) % 3;
    const pool = pools[d];
    const q = pool[(abs + extra * 11 + 3) % pool.length];
    if (!picked.includes(q)) picked.push(q);
    else { const alt = pool.find(p => !picked.includes(p)); if (alt) picked.push(alt); }
  }
  return picked.slice(0, 5);
}

/* ═══════════════════════════════════════
 *  结果维度 & 成就 & 专家推荐
 * ═══════════════════════════════════════ */
const resultDimensions = [
  {
    key: 'temperature', title: '恋爱温度计', icon: '🌡️', color: '#FF8A80',
    abilityKeys: ['opener', 'topic'] as AbilityKey[],
    descriptions: { high: '你的感情热度很高，保持主动和热情是你的优势', mid: '感情温度适中，试着增加一些甜蜜的小互动', low: '感情需要加温，建议每天至少一次主动关心' },
  },
  {
    key: 'intimacy', title: '亲密度报告', icon: '💗', color: '#F48FB1',
    abilityKeys: ['empathy', 'safety'] as AbilityKey[],
    descriptions: { high: '你们的亲密度很高，共情力和安全感建设都很棒', mid: '亲密关系还有成长空间，多练习深度倾听', low: '需要在情感连接上多下功夫，先从理解对方开始' },
  },
  {
    key: 'growth', title: '成长方向', icon: '🧭', color: '#B39DDB',
    abilityKeys: ['observe', 'topic', 'empathy'] as AbilityKey[],
    descriptions: { high: '你的成长意愿很强，保持这个学习节奏！', mid: '学习态度不错，试着更系统地提升', low: '建议制定一个小目标，每天花 10 分钟学习' },
  },
];

const streakMilestones = [
  { days: 3, badge: '🔥', title: '三日之火', desc: '连续3天check-in' },
  { days: 7, badge: '⭐', title: '一周之星', desc: '连续7天check-in' },
  { days: 14, badge: '💎', title: '双周达人', desc: '连续14天check-in' },
  { days: 30, badge: '👑', title: '月度王者', desc: '连续30天check-in' },
];

const expertRecommendations: Record<AbilityKey, Array<{ expert: string; title: string; icon: string }>> = {
  opener: [
    { expert: '汪俊豪', title: '开场白不尬聊的5个秘诀', icon: '💬' },
    { expert: '张小鱼', title: '搭讪艺术：3秒打开局面', icon: '🎤' },
  ],
  empathy: [
    { expert: '余水', title: '共情力训练：听懂TA没说的话', icon: '💗' },
    { expert: '李心然', title: '非暴力沟通实战指南', icon: '🤝' },
  ],
  observe: [
    { expert: '占方剑', title: '微表情解读：看穿TA的心思', icon: '👁️' },
    { expert: '汪俊豪', title: '约会中的肢体语言密码', icon: '🔍' },
  ],
  topic: [
    { expert: '张小鱼', title: '永不冷场的20个深度话题', icon: '💡' },
    { expert: '余水', title: '让对话越聊越亲密的技巧', icon: '✨' },
  ],
  safety: [
    { expert: '李心然', title: '建立安全感的日常微操作', icon: '🛡️' },
    { expert: '占方剑', title: '让对方主动找你的秘密', icon: '🔒' },
  ],
};

/* ═══════════════════════════════════════
 *  历史数据管理
 * ═══════════════════════════════════════ */
interface DayRecord { date: string; scores: [number, number, number]; }

function loadHistory(): DayRecord[] {
  try { const raw = localStorage.getItem('foxsay_heatup_history'); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

function saveHistory(record: DayRecord) {
  const history = loadHistory().filter(h => h.date !== record.date);
  history.push(record);
  localStorage.setItem('foxsay_heatup_history', JSON.stringify(history.slice(-30)));
}

/* ═══════════════════════════════════════
 *  主组件
 * ═══════════════════════════════════════ */
export function HeatUpCard() {
  const user = useUser() as any;
  const abilityScores = normalizeAbilityScores(user.abilityScores);
  const streak = user.streak || 0;

  const todayKey = `heatup_${new Date().toDateString()}`;
  const savedRaw = typeof window !== 'undefined' ? localStorage.getItem(todayKey) : null;
  const savedAnswers: number[] = savedRaw ? JSON.parse(savedRaw) : [];

  const dailyQuestions = useMemo(() => getDailyQuestions(), []);
  const totalQ = dailyQuestions.length;

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(savedAnswers.length >= totalQ ? totalQ : 0);
  const [answers, setAnswers] = useState<number[]>(savedAnswers);
  const [done, setDone] = useState(savedAnswers.length >= totalQ);
  const [expandedDim, setExpandedDim] = useState<number | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const history = useMemo(() => loadHistory(), [done]);

  /** 根据 abilityScores + check-in 答案计算三维分数 */
  const computeScores = (ans: number[]): [number, number, number] => {
    return resultDimensions.map((dim, di) => {
      const abilityAvg = dim.abilityKeys.reduce((sum, k) => sum + (abilityScores[k] || 25), 0) / dim.abilityKeys.length;
      const base = Math.round(40 + (abilityAvg / 100) * 45);
      const dimAns = ans.map((a, qi) => dailyQuestions[qi]?.dim === di ? a : -1).filter(a => a >= 0);
      const avgAns = dimAns.length > 0 ? dimAns.reduce((s, a) => s + a, 0) / dimAns.length : 2;
      const bonus = Math.round((2 - avgAns) * 5);
      return Math.min(99, Math.max(15, base + bonus));
    }) as [number, number, number];
  };

  const scores = useMemo(() => computeScores(answers), [answers, abilityScores]);

  const weakestAbilityKey = useMemo<AbilityKey>(() => {
    const entries = Object.entries(abilityScores) as [AbilityKey, number][];
    if (!entries.length) return 'opener';
    entries.sort((a, b) => a[1] - b[1]);
    return entries[0][0];
  }, [abilityScores]);

  const dynamicTips = useMemo(() => expertRecommendations[weakestAbilityKey] || expertRecommendations.opener, [weakestAbilityKey]);

  const last7Days = useMemo(() => {
    const days: { label: string; scores: [number, number, number] | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const record = history.find(h => h.date === dateStr);
      days.push({ label: i === 0 ? '今天' : i === 1 ? '昨天' : `${d.getMonth() + 1}/${d.getDate()}`, scores: record?.scores || null });
    }
    return days;
  }, [history]);

  const openModal = () => {
    if (done) setStep(totalQ); else { setStep(0); setAnswers([]); }
    setExpandedDim(null); setShowAchievements(false); setShowModal(true);
  };
  const handleRestart = () => { setStep(0); setAnswers([]); setDone(false); setExpandedDim(null); localStorage.removeItem(todayKey); };
  const handleFinish = () => {
    setDone(true);
    localStorage.setItem(todayKey, JSON.stringify(answers));
    saveHistory({ date: new Date().toISOString().slice(0, 10), scores });
    window.dispatchEvent(new Event('foxsay_checkin_done'));
    setShowModal(false);
  };

  const getScoreLabel = (s: number) => s >= 80 ? '优秀' : s >= 60 ? '良好' : s >= 40 ? '一般' : '需提升';
  const getScoreColor = (s: number) => s >= 80 ? '#4ECDC4' : s >= 60 ? '#B39DDB' : s >= 40 ? '#FFD93D' : '#FF8A80';
  const getScoreTrend = (di: number): { dir: 'up' | 'down' | 'flat'; val: number } => {
    const yesterday = last7Days[last7Days.length - 2];
    if (!yesterday?.scores || !done) return { dir: 'flat', val: 0 };
    const diff = scores[di] - yesterday.scores[di];
    return { dir: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat', val: Math.abs(diff) };
  };
  const unlockedMilestones = streakMilestones.filter(m => streak >= m.days);
  const abilityLabel = Object.fromEntries(Object.entries(ABILITY_META).map(([key, meta]) => [key, meta.label])) as Record<AbilityKey, string>;

  return (
    <div className="px-5 mb-2">
      <motion.div className="overflow-hidden"
        style={{ borderRadius: 16, border: done ? '1px solid rgba(255,138,128,0.2)' : '1px solid rgba(245,239,232,0.08)' }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <motion.button className="w-full p-5 text-left" style={{ background: '#352f45', borderRadius: 16 }}
          whileTap={{ scale: 0.98 }} onClick={openModal}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="todo" className="flex items-center gap-4" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
                <IconBubble size={44} bg={gradients.rose} glow><IcHeart size={20} color="#fff" /></IconBubble>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700 }}>感情加热</span>
                    <span className="px-2 py-0.5" style={{ background: 'rgba(255,138,128,0.15)', borderRadius: 6, color: '#FF8A80', fontSize: 10, fontWeight: 600 }}>每日</span>
                    {streak >= 3 && <span className="px-2 py-0.5" style={{ background: 'rgba(255,138,128,0.1)', borderRadius: 6, color: '#FF8A80', fontSize: 9, fontWeight: 600 }}>🔥{streak}天</span>}
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginTop: 2 }}>每日{totalQ}题check-in · 追踪恋爱温度变化</p>
                </div>
                <ChevronRight size={18} color="rgba(245,239,232,0.35)" />
              </motion.div>
            ) : (
              <motion.div key="done" className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <motion.span style={{ fontSize: 36, lineHeight: 1 }}
                  animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5 }}>🔥</motion.span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>今日check-in已完成</span>
                    <IcSparkle size={12} color="#FF8A80" />
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, marginTop: 2 }}>
                    +15 XP · 温度 {scores[0]} · 亲密 {scores[1]} · 成长 {scores[2]}
                  </p>
                </div>
                <ChevronRight size={16} color="rgba(245,239,232,0.3)" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* ═══ 弹窗 ═══ */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowModal(false)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0', maxHeight: '88vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: '88vh' }}>
                {/* 顶栏 */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <IconBubble size={32} bg={gradients.rose}><IcHeart size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>感情加热</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>每日check-in · 追踪你的恋爱温度</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* 连续打卡 + 成就 */}
                {streak >= 1 && (
                  <motion.div className="flex items-center gap-2 mb-4 p-3" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 12, border: '1px solid rgba(155,126,222,0.12)' }}>
                    <span style={{ fontSize: 18 }}>🔥</span>
                    <span style={{ color: '#FF8A80', fontSize: 13, fontWeight: 700 }}>连续{streak}天</span>
                    <div className="flex-1" />
                    {unlockedMilestones.length > 0 && (
                      <div className="flex items-center gap-1">
                        {unlockedMilestones.slice(-3).map(m => <span key={m.days} style={{ fontSize: 14 }}>{m.badge}</span>)}
                        <motion.button className="px-2 py-0.5 ml-1" whileTap={{ scale: 0.95 }}
                          style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 6, color: '#B39DDB', fontSize: 9, fontWeight: 600 }}
                          onClick={() => setShowAchievements(!showAchievements)}>
                          {showAchievements ? '收起' : '成就'}
                        </motion.button>
                      </div>
                    )}
                    {streakMilestones.find(m => m.days > streak) && (
                      <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>
                        距 {streakMilestones.find(m => m.days > streak)!.title} 还差 {streakMilestones.find(m => m.days > streak)!.days - streak} 天
                      </span>
                    )}
                  </motion.div>
                )}

                {/* 成就展开 */}
                <AnimatePresence>
                  {showAchievements && (
                    <motion.div className="mb-4" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="grid grid-cols-2 gap-2">
                        {streakMilestones.map(m => {
                          const unlocked = streak >= m.days;
                          return (
                            <div key={m.days} className="p-3 flex items-center gap-2.5"
                              style={{ background: unlocked ? 'linear-gradient(145deg, #352f55, #2a2440)' : 'rgba(245,239,232,0.03)', borderRadius: 12, border: unlocked ? '1px solid rgba(155,126,222,0.15)' : '1px solid rgba(245,239,232,0.05)', opacity: unlocked ? 1 : 0.5 }}>
                              <span style={{ fontSize: 22 }}>{m.badge}</span>
                              <div>
                                <span style={{ color: unlocked ? '#f5efe8' : 'rgba(245,239,232,0.4)', fontSize: 12, fontWeight: 700, display: 'block' }}>{m.title}</span>
                                <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>{m.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 数据背书 */}
                <div className="flex items-center gap-2 mb-5 p-3" style={{ background: 'rgba(255,138,128,0.08)', borderRadius: 12, border: '1px solid rgba(255,138,128,0.15)' }}>
                  <span style={{ fontSize: 18 }}>📊</span>
                  <span style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12 }}>
                    <span style={{ color: '#FF8A80', fontWeight: 700 }}>89%</span> 的用户在坚持3个月后感受到明显的关系提升
                  </span>
                </div>

                {/* 进度条 */}
                <div className="flex items-center gap-2 mb-5">
                  {dailyQuestions.map((_, qi) => (
                    <div key={qi} className="flex-1" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.1)' }}>
                      <motion.div className="h-full" style={{
                        borderRadius: 2,
                        background: qi < step ? gradients.coral : qi === step ? 'rgba(255,138,128,0.5)' : 'transparent',
                        width: qi <= step ? '100%' : '0%',
                      }} animate={{ width: qi <= step ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step < totalQ ? (
                    /* ═══ 答题页 ═══ */
                    <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <div className="text-center mb-5">
                        <motion.span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}
                          initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300 }}>
                          {dailyQuestions[step].emoji}
                        </motion.span>
                        <h3 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700 }}>{dailyQuestions[step].q}</h3>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginTop: 4 }}>
                          第 {step + 1}/{totalQ} 题
                          <span style={{ color: '#B39DDB', marginLeft: 8, fontSize: 10 }}>
                            {['🌡️ 温度', '💗 亲密', '🧭 成长'][dailyQuestions[step].dim]}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        {dailyQuestions[step].options.map((opt, oi) => (
                          <motion.button key={oi} className="w-full text-left p-4 flex items-center gap-3"
                            style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.1)' }}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              const next = [...answers, oi];
                              setAnswers(next);
                              setStep(prev => prev + 1);
                              if (next.length >= totalQ) {
                                setDone(true);
                                localStorage.setItem(todayKey, JSON.stringify(next));
                                const finalScores = computeScores(next);
                                saveHistory({ date: new Date().toISOString().slice(0, 10), scores: finalScores });
                                window.dispatchEvent(new Event('foxsay_checkin_done'));
                              }
                            }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `rgba(${oi === 0 ? '78,205,196' : oi === 1 ? '155,126,222' : oi === 2 ? '179,157,219' : oi === 3 ? '255,217,61' : '255,138,128'},0.12)` }}>
                              <span style={{ fontSize: 14 }}>{['😊', '🙂', '😐', '😕', '😔'][oi]}</span>
                            </div>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 500 }}>{opt}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    /* ═══ 结果页 — 深度升级 ═══ */
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                      <div className="text-center mb-5">
                        <motion.span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}
                          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }}>🔥</motion.span>
                        <h3 style={{ color: '#f5efe8', fontSize: 20, fontWeight: 700 }}>今日check-in完成！</h3>
                        <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, marginTop: 4 }}>+15 XP · 恋爱温度上升中</p>
                      </div>

                      {/* 三维分数卡 — 可点击展开 */}
                      <div className="grid grid-cols-3 gap-2.5 mb-5">
                        {resultDimensions.map((dim, di) => {
                          const score = scores[di];
                          const trend = getScoreTrend(di);
                          const isExp = expandedDim === di;
                          return (
                            <motion.button key={di} className="text-center p-3" whileTap={{ scale: 0.97 }}
                              style={{ background: isExp ? 'linear-gradient(145deg, rgba(155,126,222,0.15), #352f55)' : 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 14, border: isExp ? '1px solid rgba(155,126,222,0.25)' : '1px solid rgba(155,126,222,0.08)' }}
                              onClick={() => setExpandedDim(isExp ? null : di)}>
                              <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{dim.icon}</span>
                              <span style={{ color: dim.color, fontSize: 22, fontWeight: 800, display: 'block' }}>{score}</span>
                              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, display: 'block', marginTop: 2 }}>{dim.title}</span>
                              <div className="flex items-center justify-center gap-1 mt-1.5">
                                {trend.dir === 'up' && <TrendingUp size={10} color="#4ECDC4" />}
                                {trend.dir === 'down' && <TrendingDown size={10} color="#FF8A80" />}
                                {trend.dir === 'flat' && <Minus size={10} color="rgba(245,239,232,0.3)" />}
                                <span style={{ color: trend.dir === 'up' ? '#4ECDC4' : trend.dir === 'down' ? '#FF8A80' : 'rgba(245,239,232,0.3)', fontSize: 9, fontWeight: 600 }}>
                                  {trend.val > 0 ? `${trend.dir === 'up' ? '+' : '-'}${trend.val}` : '持平'}
                                </span>
                              </div>
                              <span style={{ color: getScoreColor(score), fontSize: 9, fontWeight: 600, display: 'block', marginTop: 2 }}>{getScoreLabel(score)}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* 展开：维度详情 */}
                      <AnimatePresence>
                        {expandedDim !== null && (
                          <motion.div className="mb-5 p-4" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.12)' }}>
                            <div className="flex items-center gap-2 mb-3">
                              <span style={{ fontSize: 18 }}>{resultDimensions[expandedDim].icon}</span>
                              <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>{resultDimensions[expandedDim].title} · 详细分析</span>
                            </div>
                            <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>
                              {scores[expandedDim] >= 80 ? resultDimensions[expandedDim].descriptions.high :
                               scores[expandedDim] >= 50 ? resultDimensions[expandedDim].descriptions.mid :
                               resultDimensions[expandedDim].descriptions.low}
                            </p>
                            <div className="flex gap-2">
                              {resultDimensions[expandedDim].abilityKeys.map(k => (
                                <div key={k} className="flex-1 p-2 text-center" style={{ background: 'rgba(155,126,222,0.08)', borderRadius: 8, border: '1px solid rgba(155,126,222,0.1)' }}>
                                  <span style={{ color: '#B39DDB', fontSize: 16, fontWeight: 800, display: 'block' }}>{abilityScores[k] || 25}</span>
                                  <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>{abilityLabel[k]}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 7 天趋势图 */}
                      <div className="mb-5 p-4" style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.08)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ fontSize: 14 }}>📈</span>
                          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700 }}>7 天温度趋势</span>
                        </div>
                        <div className="flex items-end gap-1.5" style={{ height: 80 }}>
                          {last7Days.map((day, i) => {
                            const avgScore = day.scores ? Math.round((day.scores[0] + day.scores[1] + day.scores[2]) / 3) : 0;
                            const h = day.scores ? Math.max(8, (avgScore / 100) * 72) : 4;
                            const isToday = i === last7Days.length - 1;
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
                                {day.scores && <span style={{ color: isToday ? '#FF8A80' : 'rgba(245,239,232,0.4)', fontSize: 8, fontWeight: 700, marginBottom: 2 }}>{avgScore}</span>}
                                <motion.div initial={{ height: 0 }} animate={{ height: h }} transition={{ duration: 0.4, delay: i * 0.05 }}
                                  style={{ width: '100%', borderRadius: 4, background: day.scores ? (isToday ? 'linear-gradient(180deg, #FF8A80, #9B7EDE)' : 'rgba(155,126,222,0.3)') : 'rgba(245,239,232,0.06)' }} />
                                <span style={{ color: isToday ? '#f5efe8' : 'rgba(245,239,232,0.3)', fontSize: 8, marginTop: 4, fontWeight: isToday ? 600 : 400 }}>{day.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI 今日建议 */}
                      <div className="mb-4 p-3.5" style={{ background: 'rgba(155,126,222,0.08)', borderRadius: 12, border: '1px solid rgba(155,126,222,0.12)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: 14 }}>💡</span>
                          <span style={{ color: '#B39DDB', fontSize: 13, fontWeight: 600 }}>AI 今日建议</span>
                          <span className="px-1.5 py-0.5 ml-auto" style={{ background: 'rgba(78,205,196,0.1)', borderRadius: 4, color: '#4ECDC4', fontSize: 8, fontWeight: 600 }}>基于能力诊断</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, lineHeight: 1.6 }}>
                          {(() => {
                            const advice: Record<AbilityKey, string> = {
                              opener: '你的开场力是当前最需要提升的维度。建议今天练习「破冰三步法」，从一个真诚的赞美开始',
                              empathy: '共情力是你的提升重点。试试在对话中多用「我理解你的感受」来回应对方',
                              observe: '观察力需要加强。今天尝试在和人聊天时注意对方的表情和语气变化',
                              topic: '话题力可以再提升。推荐准备 3 个有趣话题，让聊天永不冷场',
                              safety: '建立安全感是当前的关键。今天主动给 TA 一个确认：让 TA 知道你在乎',
                            };
                            return `${abilityLabel[weakestAbilityKey]}（${abilityScores[weakestAbilityKey] || 25}分）是你当前的薄弱点。${advice[weakestAbilityKey]}`;
                          })()}
                        </p>
                      </div>

                      {/* 动态专家推荐 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span style={{ fontSize: 14 }}>🎓</span>
                          <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>针对性提升推荐</span>
                          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, marginLeft: 'auto' }}>基于{abilityLabel[weakestAbilityKey]}薄弱点</span>
                        </div>
                        {dynamicTips.map((tip, ti) => (
                          <div key={ti} className="w-full flex items-center gap-3 p-3 mb-2"
                            style={{ background: 'linear-gradient(145deg, #352f55, #2a2440)', borderRadius: 12, border: '1px solid rgba(155,126,222,0.08)' }}>
                            <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(155,126,222,0.12)' }}>
                              <span style={{ fontSize: 16 }}>{tip.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>{tip.title}</span>
                              <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>{tip.expert} · 专家设计</span>
                            </div>
                            <ChevronRight size={14} color="rgba(245,239,232,0.3)" />
                          </div>
                        ))}
                      </div>

                      {/* 底部操作 */}
                      <div className="flex gap-2.5">
                        <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
                          style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
                          whileTap={{ scale: 0.98 }} onClick={handleRestart}>🔄 重新提交</motion.button>
                        <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
                          style={{ background: gradients.rose, borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={handleFinish}>完成</motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
