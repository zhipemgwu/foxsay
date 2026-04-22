/**
 * 微练习题库 - 类型定义 + localStorage 存储
 * 
 * 零 token 纯数据题库：反 PUA / 破冰 / 暧昧理解 / 热恋 / 红旗识别 / 情绪接住 / 拒绝练习
 */

export type QuizCategory =
  | 'anti-pua'       // 反 PUA
  | 'icebreak'       // 破冰搭讪
  | 'ambiguous'      // 暧昧信号解读
  | 'love'           // 热恋沟通
  | 'redflag'        // 红旗识别
  | 'emotion-catch'  // 情绪接住
  | 'refuse';        // 拒绝 / 退出练习

export type QuizType = 'single' | 'multi' | 'order' | 'cloze' | 'judge';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explain: string;  // 无论对错都要解释，这是教育价值的核心
}

export interface Question {
  id: string;
  category: QuizCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: QuizType;
  scenario?: string;        // 场景描述（可选，复杂情境用）
  prompt: string;           // 对方说的话 / 题干
  // === single / multi / judge 专用 ===
  options?: QuizOption[];
  // === order 专用：数组本身就是正确顺序，UI 会乱序展示 ===
  orderItems?: string[];
  // === cloze 专用 ===
  clozeChoices?: string[];
  clozeCorrectIdx?: number;
  clozeExplains?: string[]; // 每个选项的解释
  // === 通用 ===
  overallExplain: string;   // 整体知识点讲解
  tags?: string[];
  relatedLevelKid?: string; // 关联关卡 KID，用于刷题 → 关卡导流
}

export const CATEGORY_META: Record<QuizCategory, { label: string; emoji: string; color: string; desc: string }> = {
  'anti-pua':      { label: '反 PUA',     emoji: '🛡️', color: '#FF6B6B', desc: '识破情感操控与边界侵犯' },
  'icebreak':      { label: '破冰搭讪',   emoji: '❄️', color: '#4ECDC4', desc: '开场白 / 接话 / 话题延展' },
  'ambiguous':     { label: '暧昧理解',   emoji: '💭', color: '#B8A4E8', desc: '读懂对方没说出口的话' },
  'love':          { label: '热恋沟通',   emoji: '💖', color: '#FF8A80', desc: '冲突化解 / 冷战破解 / 情绪接力' },
  'redflag':       { label: '红旗识别',   emoji: '🚩', color: '#FF9F43', desc: '这是爱还是控制？' },
  'emotion-catch': { label: '情绪接住',   emoji: '🤲', color: '#FFD93D', desc: '对方情绪来了，你怎么接' },
  'refuse':        { label: '拒绝练习',   emoji: '🙅', color: '#95E1D3', desc: '体面说不 / 退出关系' },
};

/* =========================================================
 *  localStorage 存储
 * ========================================================= */

const KEY_WRONG     = 'foxsay_quiz_wrong';         // 错题本: string[] (question ids)
const KEY_STATS     = 'foxsay_quiz_stats';         // { total, correct, byCategory: {cat: {total, correct}} }
const KEY_LAST_DATE = 'foxsay_quiz_last_date';     // 'YYYY-MM-DD'
const KEY_STREAK    = 'foxsay_quiz_streak';        // number
const KEY_DAILY_IDS = 'foxsay_quiz_daily_ids';     // { date, ids: string[], answered: string[] }

export interface QuizStats {
  total: number;
  correct: number;
  byCategory: Partial<Record<QuizCategory, { total: number; correct: number }>>;
}

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function getWrongBook(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_WRONG) || '[]');
  } catch { return []; }
}

export function addWrong(id: string) {
  try {
    const ids = getWrongBook();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(KEY_WRONG, JSON.stringify(ids));
    }
  } catch {}
}

export function removeWrong(id: string) {
  try {
    const ids = getWrongBook().filter(x => x !== id);
    localStorage.setItem(KEY_WRONG, JSON.stringify(ids));
  } catch {}
}

export function getStats(): QuizStats {
  try {
    const raw = localStorage.getItem(KEY_STATS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { total: 0, correct: 0, byCategory: {} };
}

export function recordAnswer(q: Question, isCorrect: boolean) {
  const s = getStats();
  s.total += 1;
  if (isCorrect) s.correct += 1;
  const catKey = q.category;
  if (!s.byCategory[catKey]) s.byCategory[catKey] = { total: 0, correct: 0 };
  s.byCategory[catKey]!.total += 1;
  if (isCorrect) s.byCategory[catKey]!.correct += 1;
  try { localStorage.setItem(KEY_STATS, JSON.stringify(s)); } catch {}

  // 错题本维护
  if (isCorrect) {
    removeWrong(q.id); // 答对就从错题本移除
  } else {
    addWrong(q.id);
  }
}

/** 记录每日打卡（每天任意答 1 题即打卡） */
export function touchStreak(): { streak: number; justChecked: boolean } {
  const today = todayStr();
  let last = '';
  let streak = 0;
  try {
    last = localStorage.getItem(KEY_LAST_DATE) || '';
    streak = parseInt(localStorage.getItem(KEY_STREAK) || '0', 10) || 0;
  } catch {}
  if (last === today) return { streak, justChecked: false };

  // 判断是否连续
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  streak = last === yesterday ? streak + 1 : 1;
  try {
    localStorage.setItem(KEY_LAST_DATE, today);
    localStorage.setItem(KEY_STREAK, String(streak));
  } catch {}
  return { streak, justChecked: true };
}

export function getStreak(): number {
  try {
    const last = localStorage.getItem(KEY_LAST_DATE) || '';
    const today = todayStr();
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const s = parseInt(localStorage.getItem(KEY_STREAK) || '0', 10) || 0;
    // 昨天或今天有打卡，连击继续；否则断了归零
    if (last === today || last === yesterday) return s;
    return 0;
  } catch { return 0; }
}

/** 每日推荐 3 题（按日期 hash 选择，同一天稳定） */
export function getDailyPicks(all: Question[], n = 3): { q: Question; answered: boolean }[] {
  const today = todayStr();
  let saved: { date: string; ids: string[]; answered: string[] } | null = null;
  try { saved = JSON.parse(localStorage.getItem(KEY_DAILY_IDS) || 'null'); } catch {}

  if (!saved || saved.date !== today) {
    // 用今天的日期做种子，稳定挑 N 道
    const seed = Array.from(today).reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) >>> 0;
    const idxs: number[] = [];
    const used = new Set<number>();
    let s = seed || 1;
    const maxIter = all.length * 50 + 100; // 防死循环保险
    let iter = 0;
    while (idxs.length < Math.min(n, all.length) && iter++ < maxIter) {
      // 使用 Math.imul 保证 32 位整数精度，避免浮点误差导致 LCG 卡死
      s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
      const i = s % all.length;
      if (!used.has(i)) { used.add(i); idxs.push(i); }
    }
    // 兜底：若随机没填满（极端情况），顺序补齐
    for (let i = 0; i < all.length && idxs.length < Math.min(n, all.length); i++) {
      if (!used.has(i)) { used.add(i); idxs.push(i); }
    }
    const ids = idxs.map(i => all[i].id);
    saved = { date: today, ids, answered: [] };
    try { localStorage.setItem(KEY_DAILY_IDS, JSON.stringify(saved)); } catch {}
  }

  return saved.ids
    .map(id => all.find(q => q.id === id))
    .filter((q): q is Question => !!q)
    .map(q => ({ q, answered: saved!.answered.includes(q.id) }));
}

export function markDailyAnswered(qid: string) {
  try {
    const raw = localStorage.getItem(KEY_DAILY_IDS);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved.answered.includes(qid)) {
      saved.answered.push(qid);
      localStorage.setItem(KEY_DAILY_IDS, JSON.stringify(saved));
    }
  } catch {}
}

/** 判断用户回答是否正确 */
export function checkAnswer(q: Question, userAnswer: any): boolean {
  switch (q.type) {
    case 'single':
    case 'judge': {
      const idx = userAnswer as number;
      return !!q.options?.[idx]?.isCorrect;
    }
    case 'multi': {
      const idxs = (userAnswer as number[]).slice().sort().join(',');
      const correct = (q.options || [])
        .map((o, i) => o.isCorrect ? i : -1)
        .filter(i => i >= 0)
        .sort()
        .join(',');
      return idxs === correct && idxs.length > 0;
    }
    case 'order': {
      const arr = userAnswer as string[];
      const truth = q.orderItems || [];
      return arr.length === truth.length && arr.every((v, i) => v === truth[i]);
    }
    case 'cloze': {
      return userAnswer === q.clozeCorrectIdx;
    }
    default: return false;
  }
}

/** 打乱数组（用于 order 题的展示初始态） */
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
