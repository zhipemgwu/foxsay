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
  // —— 资料题 1：性别（便利店初遇）——
  {
    id: 'p1_gender',
    npc: '啊抱歉抱歉，刚伞没收好 😅\n我叫林夕～',
    options: [
      { id: 'p1_m', emoji: '👦', label: '没事，我叫……（一个男生）', scores: {}, meta: { kind: 'gender', value: 'male' }, reply: '你好呀～' },
      { id: 'p1_f', emoji: '👧', label: '没事，我……（一个女生）', scores: {}, meta: { kind: 'gender', value: 'female' }, reply: '幸会幸会～' },
      { id: 'p1_n', emoji: '🙈', label: '没事没事（笑了笑）', scores: {}, meta: { kind: 'gender', value: null }, reply: '哈哈，神秘路人登场' },
    ],
  },
  // —— 资料题 2：年龄段（指关东煮）——
  {
    id: 'p2_age',
    npc: '这么晚了还在外面，也没吃饭吗？',
    options: [
      { id: 'p2_a', emoji: '📚', label: '刚下晚自习/下课', scores: {}, meta: { kind: 'age', value: '18-22' }, reply: '学生时代呀，懂～' },
      { id: 'p2_b', emoji: '💻', label: '刚加完班出来透透气', scores: {}, meta: { kind: 'age', value: '23-27' }, reply: '打工人辛苦了' },
      { id: 'p2_c', emoji: '🌙', label: '心里烦，出来走走', scores: {}, meta: { kind: 'age', value: '28-32' }, reply: '懂的，有时候就是想一个人' },
    ],
  },
  // —— 资料题 3：想先突破的方向（聊开一点点）——
  {
    id: 'p3_goal',
    npc: '（一边挑饭团）最近是不是也有点不顺啊？',
    options: [
      { id: 'p3_chat', emoji: '💬', label: '是想聊的人不怎么回我', scores: {}, tags: ['聊天技巧'], meta: { kind: 'goal', value: 'chat' }, reply: '这种最难受了' },
      { id: 'p3_date', emoji: '☕', label: '约出来不知道聊啥', scores: {}, tags: ['约会攻略'], meta: { kind: 'goal', value: 'date' }, reply: '气氛感确实要练' },
      { id: 'p3_express', emoji: '💭', label: '心里话说不出口', scores: {}, tags: ['表达情感'], meta: { kind: 'goal', value: 'express' }, reply: '能说出来就是真心了' },
    ],
  },
  // —— 个性题 1：心动瞬间 ——
  {
    id: 'q1_heart',
    npc: '（笑）那……你上次有点心动，是什么时候？',
    options: [
      { id: 'q1_a', emoji: '💘', label: '看到一个人就愣住那种', scores: { lianfeihu: 2, tiantianhu: 2, xiaochouhu: 1 }, tags: ['表达情感', '告白技巧'], reply: '纯爱啊' },
      { id: 'q1_b', emoji: '🌙', label: '一聊就聊到凌晨三四点', scores: { caonihu: 3, xinjihu: 2, lvchahu: 1 }, tags: ['聊天技巧'], reply: '这种最容易上头' },
      { id: 'q1_c', emoji: '🤷', label: '好像很久没有了', scores: { zhiwuhu: 3, songsonghu: 2, zhuangsihu: 2 }, tags: ['社交破冰', '魅力提升'], reply: '嗯，我最近也这样' },
    ],
  },
  // —— 个性题 2：怕冷场 ——
  {
    id: 'q2_chat',
    npc: '那跟喜欢的人聊天的时候，你最怕的是什么？',
    options: [
      { id: 'q2_a', emoji: '😶', label: '一冷场脑子就空白', scores: { songsonghu: 2, xiaochouhu: 2, zhiwuhu: 2 }, tags: ['聊天技巧', '社交破冰'], reply: '这也太懂了' },
      { id: 'q2_b', emoji: '😬', label: '怕一句话就说错了', scores: { tiantianhu: 3, xiaochouhu: 2 }, tags: ['表达情感'], reply: '太在意对方其实是好事' },
      { id: 'q2_c', emoji: '😌', label: '还好，我能带气氛', scores: { laosihu: 3, haiwanghu: 2, xinjihu: 1 }, tags: ['魅力提升', '约会攻略'], reply: '哇，社交达人' },
    ],
  },
  // —— 个性题 3：感情风格 ——
  {
    id: 'q3_style',
    npc: '（把热可可分了你一口）喜欢一个人的时候，\n你一般是啥样的？',
    options: [
      { id: 'q3_a', emoji: '🔥', label: '喜欢就冲，不绕弯子', scores: { laosihu: 2, haiwanghu: 2, lianfeihu: 1 }, tags: ['告白技巧'], reply: '勇的' },
      { id: 'q3_b', emoji: '🍵', label: '先看看，等对方先说', scores: { lvchahu: 2, caonihu: 2, xinjihu: 3 }, tags: ['约会攻略'], reply: '稳～' },
      { id: 'q3_c', emoji: '🫠', label: '想，但又怕麻烦，算了', scores: { zhuangsihu: 3, zhiwuhu: 2, songsonghu: 1 }, tags: ['社交破冰', '魅力提升'], reply: '哈哈，太真实了' },
    ],
  },
  // —— 个性题 4：被忽冷忽热 ——
  {
    id: 'q4_when_hurt',
    npc: '最后一个问题——\n如果对方忽冷忽热，你会怎么办？',
    options: [
      { id: 'q4_a', emoji: '🥺', label: '一直发消息问到有回应', scores: { tiantianhu: 3, xiaochouhu: 2, lianfeihu: 1 }, tags: ['表达情感'], reply: '真诚一定要配方法' },
      { id: 'q4_b', emoji: '🧊', label: '不理了，他爱咋咋', scores: { zhuangsihu: 2, songsonghu: 2, laosihu: 1 }, tags: ['约会攻略'], reply: '硬气一点也挺好' },
      { id: 'q4_c', emoji: '🎭', label: '表面装没事，暗中盯梢', scores: { caonihu: 3, lvchahu: 2, xinjihu: 2 }, tags: ['聊天技巧', '魅力提升'], reply: '哈哈哈内心戏很多吧' },
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
