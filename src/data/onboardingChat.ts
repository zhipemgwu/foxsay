/**
 * Onboarding 对话首关 —— "老司狐"NPC 4 轮固定话术
 * 每轮 3 个回答选项，每个选项给不同物种加权打分。
 * 最终把累计分数最高的物种判定为该用户的"恋爱物种"。
 *
 * 物种 id 与 DiagnosticPage.tsx 中 loveSpecies 保持一致。
 */

export type ChatOption = {
  id: string;
  label: string;
  emoji: string;
  /** 物种 → 分数加权（0~3） */
  scores: Record<string, number>;
  /** 派生标签（用于推荐计划） */
  tags?: string[];
  /** NPC 即时短反馈（选完后显示） */
  reply?: string;
  /** 资料采集元信息（性别/年龄/目标）—— 用于把传统表单融入对话 */
  meta?:
    | { kind: 'gender'; value: 'male' | 'female' | null }
    | { kind: 'age'; value: string }
    | { kind: 'goal'; value: string };
};

export type ChatTurn = {
  id: string;
  /** 老司狐说的话（左侧气泡） */
  npc: string;
  /** 用户三选一 */
  options: ChatOption[];
};

export const onboardingScript: ChatTurn[] = [
  // —— 资料题 1：性别（聊天化引导）——
  {
    id: 'p1_gender',
    npc: '来啦～我是老司狐🦊\n先认识一下，你是？',
    options: [
      { id: 'p1_m', emoji: '🤴', label: '帅气男生', scores: {}, meta: { kind: 'gender', value: 'male' }, reply: '收到，帅哥！👋' },
      { id: 'p1_f', emoji: '👸', label: '可爱女生', scores: {}, meta: { kind: 'gender', value: 'female' }, reply: '可可爱爱，登记好～' },
      { id: 'p1_n', emoji: '🙈', label: '暂时不想说', scores: {}, meta: { kind: 'gender', value: null }, reply: '没关系，先聊聊别的～' },
    ],
  },
  // —— 资料题 2：年龄段 ——
  {
    id: 'p2_age',
    npc: '嘿嘿～再告诉我一个，你现在大概在哪个阶段？',
    options: [
      { id: 'p2_a', emoji: '🌱', label: '学生时代 (18-22)', scores: {}, meta: { kind: 'age', value: '18-22' }, reply: '青春正好～' },
      { id: 'p2_b', emoji: '☀️', label: '职场新人 (23-27)', scores: {}, meta: { kind: 'age', value: '23-27' }, reply: '热恋黄金期，记下了' },
      { id: 'p2_c', emoji: '🔥', label: '成熟阶段 (28+)', scores: {}, meta: { kind: 'age', value: '28-32' }, reply: '成熟稳重系 ✨' },
    ],
  },
  // —— 资料题 3：想先突破的方向 ——
  {
    id: 'p3_goal',
    npc: '最后一个基础题～来这里，你最想先突破哪个？',
    options: [
      { id: 'p3_chat', emoji: '💬', label: '聊天不冷场', scores: {}, tags: ['聊天技巧'], meta: { kind: 'goal', value: 'chat' }, reply: '聊天达人培养计划启动～' },
      { id: 'p3_date', emoji: '☕', label: '约会更完美', scores: {}, tags: ['约会攻略'], meta: { kind: 'goal', value: 'date' }, reply: '约会攻略安排上 💫' },
      { id: 'p3_express', emoji: '💌', label: '表达心意', scores: {}, tags: ['表达情感'], meta: { kind: 'goal', value: 'express' }, reply: '情感表达是加分项哦～' },
    ],
  },
  {
    id: 'q1_heart',
    npc: '好，基础信息搞定，开始正经的～\n最近一次让你心动的瞬间，是哪种？',
    options: [
      { id: 'q1_a', emoji: '💘', label: '一见钟情，眼神对上就破防', scores: { lianfeihu: 2, tiantianhu: 2, xiaochouhu: 1 }, tags: ['表达情感', '告白技巧'], reply: '哟，纯爱战士一枚～ 💕' },
      { id: 'q1_b', emoji: '🌙', label: '深夜聊天聊到凌晨那种', scores: { caonihu: 3, xinjihu: 2, lvchahu: 1 }, tags: ['聊天技巧'], reply: '懂懂懂，氛围感拿捏了～' },
      { id: 'q1_c', emoji: '🤷', label: '想不起来，最近没什么心动', scores: { zhiwuhu: 3, songsonghu: 2, zhuangsihu: 2 }, tags: ['社交破冰', '魅力提升'], reply: '佛系人设先记下～' },
    ],
  },
  {
    id: 'q2_chat',
    npc: '懂～那跟喜欢的人聊天时，你最怕什么瞬间？',
    options: [
      { id: 'q2_a', emoji: '😶', label: '冷场，不知道说什么', scores: { songsonghu: 2, xiaochouhu: 2, zhiwuhu: 2 }, tags: ['聊天技巧', '社交破冰'], reply: '社恐的痛我太懂了' },
      { id: 'q2_b', emoji: '😬', label: '说错话被讨厌', scores: { tiantianhu: 3, xiaochouhu: 2 }, tags: ['表达情感'], reply: '完美主义者被我嗅到了～' },
      { id: 'q2_c', emoji: '😎', label: '不怕，我会带节奏', scores: { laosihu: 3, haiwanghu: 2, xinjihu: 1 }, tags: ['魅力提升', '约会攻略'], reply: '好家伙，是老手啊 😎' },
    ],
  },
  {
    id: 'q3_style',
    npc: '关键问题来了——你在感情里更像哪种状态？',
    options: [
      { id: 'q3_a', emoji: '🔥', label: '主动出击，喜欢就直接说', scores: { laosihu: 2, haiwanghu: 2, lianfeihu: 1 }, tags: ['告白技巧'], reply: '勇者！加分 💯' },
      { id: 'q3_b', emoji: '🍵', label: '不动声色，等对方先开口', scores: { lvchahu: 2, caonihu: 2, xinjihu: 3 }, tags: ['约会攻略'], reply: '深藏不露型的～' },
      { id: 'q3_c', emoji: '🛏', label: '想恋爱，又怕麻烦，干脆躺平', scores: { zhuangsihu: 3, zhiwuhu: 2, songsonghu: 1 }, tags: ['社交破冰', '魅力提升'], reply: '哈哈，诚实给你加分！' },
    ],
  },
  {
    id: 'q4_when_hurt',
    npc: '最后一题——被忽冷忽热时，你的反应是？',
    options: [
      { id: 'q4_a', emoji: '🥺', label: '反复发消息求一个解释', scores: { tiantianhu: 3, xiaochouhu: 2, lianfeihu: 1 }, tags: ['表达情感'], reply: '真诚但容易上头哦～' },
      { id: 'q4_b', emoji: '🧊', label: '直接冷处理，不主动找了', scores: { zhuangsihu: 2, songsonghu: 2, laosihu: 1 }, tags: ['约会攻略'], reply: '硬核选手，记住了 💪' },
      { id: 'q4_c', emoji: '🎭', label: '装作不在意，但暗中观察', scores: { caonihu: 3, lvchahu: 2, xinjihu: 2 }, tags: ['聊天技巧', '魅力提升'], reply: '表面淡定内心戏很多吧～' },
    ],
  },
];

/**
 * 根据答题序列计算最匹配的物种 id 和匹配度（85-99%）
 */
export function computeSpecies(answers: ChatOption[]): { speciesId: string; matchRate: number; tagsTopN: string[] } {
  const totals: Record<string, number> = {};
  const tagCount: Record<string, number> = {};
  for (const a of answers) {
    for (const [sp, score] of Object.entries(a.scores || {})) {
      totals[sp] = (totals[sp] || 0) + score;
    }
    for (const t of a.tags || []) tagCount[t] = (tagCount[t] || 0) + 1;
  }
  let topSp = 'laosihu';
  let topScore = -1;
  for (const [sp, sc] of Object.entries(totals)) {
    if (sc > topScore) { topScore = sc; topSp = sp; }
  }
  // 匹配度 = 85 + (topScore / 12) * 14，最高 99
  const matchRate = Math.min(99, 85 + Math.round((topScore / 12) * 14));
  const tagsTopN = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);
  return { speciesId: topSp, matchRate, tagsTopN };
}

/**
 * 从聊天答题序列中提取用户资料（性别/年龄段/目标）
 * 资料题的 option 带 `meta` 字段，此函数只抽取它们。
 */
export function extractProfile(answers: ChatOption[]): {
  gender: 'male' | 'female' | null;
  age: string | null;
  goals: string[];
} {
  let gender: 'male' | 'female' | null = null;
  let age: string | null = null;
  const goals: string[] = [];
  for (const a of answers) {
    if (!a.meta) continue;
    if (a.meta.kind === 'gender') gender = a.meta.value;
    else if (a.meta.kind === 'age') age = a.meta.value;
    else if (a.meta.kind === 'goal' && !goals.includes(a.meta.value)) goals.push(a.meta.value);
  }
  return { gender, age, goals };
}

/** 物种 → 推荐 5 维倾向（用于首页雷达初值）
 *  旧版维度 chat/charm/courage/empathy/control
 *  新版维度 opener/empathy/observe/topic/safety — 与 DiagnosticPage 一致
 *  初始测评最高每维度 50 分，系统未来最高可提升到 100 满值
 */
export const speciesAbilityHint: Record<string, { opener: number; empathy: number; observe: number; topic: number; safety: number }> = {
  laosihu:    { opener: 45, empathy: 28, observe: 38, topic: 42, safety: 35 },
  haiwanghu:  { opener: 42, empathy: 25, observe: 30, topic: 46, safety: 22 },
  tiantianhu: { opener: 25, empathy: 48, observe: 32, topic: 28, safety: 18 },
  zhuangsihu: { opener: 18, empathy: 30, observe: 38, topic: 22, safety: 40 },
  songsonghu: { opener: 20, empathy: 35, observe: 30, topic: 25, safety: 32 },
  zhiwuhu:    { opener: 15, empathy: 25, observe: 28, topic: 18, safety: 35 },
  xiaochouhu: { opener: 38, empathy: 42, observe: 28, topic: 35, safety: 20 },
  lianfeihu:  { opener: 32, empathy: 40, observe: 25, topic: 30, safety: 22 },
  caonihu:    { opener: 35, empathy: 35, observe: 40, topic: 38, safety: 30 },
  lvchahu:    { opener: 38, empathy: 32, observe: 42, topic: 35, safety: 28 },
  xinjihu:    { opener: 40, empathy: 30, observe: 45, topic: 38, safety: 35 },
  beiweihu:   { opener: 22, empathy: 38, observe: 28, topic: 25, safety: 25 },
};
