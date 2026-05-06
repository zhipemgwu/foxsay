import {
  ABILITY_KEYS,
  ABILITY_META,
  appendAbilityEvent,
  normalizeAbilityScores,
  type AbilityDelta,
  type AbilityKey,
  type AbilityScores,
} from './ability';
import type { Question, QuizCategory } from './quiz';

export type MicroSessionKind = 'practice' | 'mock' | 'advanced';

export interface QuizAttemptRecord {
  question: Question;
  correct: boolean;
}

export interface MicroGrowthResult {
  applied: boolean;
  eligible: boolean;
  title: string;
  summary: string;
  detail: string;
  xpDelta: AbilityDelta;
  scoreDelta: AbilityDelta;
  nextAbilityScores: AbilityScores;
  currentExp: Record<AbilityKey, number>;
}

interface SettleMicroGrowthInput {
  userId?: string | null;
  title: string;
  sessionKind: MicroSessionKind;
  attempts: QuizAttemptRecord[];
  completed: boolean;
  plannedTotal: number;
  abilityScores: unknown;
}

const MASTERED_KEY_PREFIX = 'foxsay:micro_growth:mastered:';
const EXP_KEY_PREFIX = 'foxsay:micro_growth:exp:';
const MOCK_WEEK_KEY_PREFIX = 'foxsay:micro_growth:mock_week:';
const ADVANCED_BEST_KEY_PREFIX = 'foxsay:micro_growth:advanced_best:';

const categoryPrimaryAbility: Record<QuizCategory, AbilityKey> = {
  'anti-pua': 'safety',
  icebreak: 'opener',
  ambiguous: 'observe',
  love: 'empathy',
  redflag: 'observe',
  'emotion-catch': 'empathy',
  refuse: 'safety',
  recover: 'empathy',
};

const categorySecondaryAbility: Record<QuizCategory, AbilityKey> = {
  'anti-pua': 'observe',
  icebreak: 'topic',
  ambiguous: 'topic',
  love: 'safety',
  redflag: 'safety',
  'emotion-catch': 'safety',
  refuse: 'empathy',
  recover: 'safety',
};

const weakestTiePriority: AbilityKey[] = ['safety', 'observe', 'empathy', 'opener', 'topic'];

function getUserStorageKey(prefix: string, userId?: string | null): string {
  return `${prefix}${userId || 'anonymous'}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function emptyAbilityDelta(): AbilityDelta {
  return {};
}

function emptyExpPool(): Record<AbilityKey, number> {
  return { opener: 0, empathy: 0, observe: 0, topic: 0, safety: 0 };
}

function addAbilityXp(target: AbilityDelta, key: AbilityKey, value: number): void {
  if (value <= 0) return;
  target[key] = (target[key] ?? 0) + value;
}

function hasXp(delta: AbilityDelta): boolean {
  return ABILITY_KEYS.some(key => (delta[key] ?? 0) > 0);
}

function abilityThreshold(score: number): number {
  if (score >= 80) return 25;
  if (score >= 50) return 15;
  return 10;
}

function getWeekId(now = new Date()): string {
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getMasteredQuestionSet(userId?: string | null): Set<string> {
  const ids = readJson<string[]>(getUserStorageKey(MASTERED_KEY_PREFIX, userId), []);
  return new Set(Array.isArray(ids) ? ids : []);
}

function saveMasteredQuestionSet(userId: string | null | undefined, ids: Set<string>): void {
  writeJson(getUserStorageKey(MASTERED_KEY_PREFIX, userId), Array.from(ids));
}

function loadExpPool(userId?: string | null): Record<AbilityKey, number> {
  const raw = readJson<Partial<Record<AbilityKey, number>>>(getUserStorageKey(EXP_KEY_PREFIX, userId), {});
  const pool = emptyExpPool();
  for (const key of ABILITY_KEYS) {
    const value = Number(raw[key] ?? 0);
    pool[key] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }
  return pool;
}

function saveExpPool(userId: string | null | undefined, pool: Record<AbilityKey, number>): void {
  writeJson(getUserStorageKey(EXP_KEY_PREFIX, userId), pool);
}

function getWeakestAbilities(scores: AbilityScores, count: number): AbilityKey[] {
  return [...ABILITY_KEYS]
    .sort((left, right) => (scores[left] - scores[right]) || (weakestTiePriority.indexOf(left) - weakestTiePriority.indexOf(right)))
    .slice(0, count);
}

function formatDelta(delta: AbilityDelta, suffix: string): string {
  const parts = ABILITY_KEYS
    .filter(key => (delta[key] ?? 0) > 0)
    .map(key => `${ABILITY_META[key].label}+${delta[key]}${suffix}`);
  return parts.length ? parts.join('、') : '暂无成长';
}

function applyExperience(input: {
  userId?: string | null;
  abilityScores: unknown;
  xpDelta: AbilityDelta;
}): { nextAbilityScores: AbilityScores; scoreDelta: AbilityDelta; currentExp: Record<AbilityKey, number> } {
  const baseScores = normalizeAbilityScores(input.abilityScores);
  const nextAbilityScores = { ...baseScores };
  const scoreDelta = emptyAbilityDelta();
  const currentExp = loadExpPool(input.userId);

  for (const key of ABILITY_KEYS) {
    currentExp[key] += Math.max(0, Math.floor(input.xpDelta[key] ?? 0));
    while (nextAbilityScores[key] < 100 && currentExp[key] >= abilityThreshold(nextAbilityScores[key])) {
      currentExp[key] -= abilityThreshold(nextAbilityScores[key]);
      nextAbilityScores[key] += 1;
      scoreDelta[key] = (scoreDelta[key] ?? 0) + 1;
    }
  }

  saveExpPool(input.userId, currentExp);
  return { nextAbilityScores, scoreDelta, currentExp };
}

function settlePractice(input: SettleMicroGrowthInput): { xpDelta: AbilityDelta; eligible: boolean; summary: string; detail: string } {
  const mastered = getMasteredQuestionSet(input.userId);
  const newlyMastered: Question[] = [];

  for (const attempt of input.attempts) {
    if (!attempt.correct || mastered.has(attempt.question.id)) continue;
    mastered.add(attempt.question.id);
    newlyMastered.push(attempt.question);
  }

  saveMasteredQuestionSet(input.userId, mastered);

  const xpDelta = emptyAbilityDelta();
  for (const question of newlyMastered) {
    addAbilityXp(xpDelta, categoryPrimaryAbility[question.category], 1);
  }

  return {
    xpDelta,
    eligible: newlyMastered.length > 0,
    summary: newlyMastered.length > 0
      ? `新增首次答对 ${newlyMastered.length} 题，成长已保存`
      : '本次没有新增首次答对题，旧题不重复加成长',
    detail: newlyMastered.length > 0
      ? `首次答对成长：${formatDelta(xpDelta, '经验')}`
      : '已经答对过的题会进入复习记录，但不会再次产生五维成长。',
  };
}

function settleMock(input: SettleMicroGrowthInput): { xpDelta: AbilityDelta; eligible: boolean; summary: string; detail: string } {
  if (!input.completed || input.attempts.length < 50) {
    return {
      xpDelta: emptyAbilityDelta(),
      eligible: false,
      summary: '全真模拟未完成 50 题，不结算能力成长',
      detail: '全真模拟按完整试卷结算，中途退出只保存答题记录。',
    };
  }

  const weekId = getWeekId();
  const weekKey = getUserStorageKey(MOCK_WEEK_KEY_PREFIX, input.userId);
  const claimedWeek = typeof window !== 'undefined' ? window.localStorage.getItem(weekKey) : null;
  if (claimedWeek === weekId) {
    return {
      xpDelta: emptyAbilityDelta(),
      eligible: false,
      summary: '本周全真模拟成长已领取，本次仅生成成绩报告',
      detail: '同一自然周内再次完成全真模拟，只记录成绩、评级和错题，不重复增加五维。',
    };
  }

  const xpDelta = emptyAbilityDelta();
  const byAbility = ABILITY_KEYS.reduce((acc, key) => {
    acc[key] = { total: 0, correct: 0 };
    return acc;
  }, {} as Record<AbilityKey, { total: number; correct: number }>);

  for (const attempt of input.attempts) {
    const ability = categoryPrimaryAbility[attempt.question.category];
    byAbility[ability].total += 1;
    if (attempt.correct) byAbility[ability].correct += 1;
  }

  for (const key of ABILITY_KEYS) {
    const stat = byAbility[key];
    if (stat.total <= 0) continue;
    const pct = Math.round((stat.correct / stat.total) * 100);
    if (pct >= 90) addAbilityXp(xpDelta, key, 3);
    else if (pct >= 75) addAbilityXp(xpDelta, key, 2);
    else if (pct >= 60) addAbilityXp(xpDelta, key, 1);
  }

  const correctCount = input.attempts.filter(attempt => attempt.correct).length;
  const overallPct = Math.round((correctCount / input.attempts.length) * 100);
  const scores = normalizeAbilityScores(input.abilityScores);
  if (overallPct >= 90) {
    for (const key of getWeakestAbilities(scores, 1)) addAbilityXp(xpDelta, key, 3);
  } else if (overallPct >= 75) {
    for (const key of getWeakestAbilities(scores, 2)) addAbilityXp(xpDelta, key, 1);
  } else if (overallPct >= 60) {
    for (const key of getWeakestAbilities(scores, 1)) addAbilityXp(xpDelta, key, 1);
  }

  if (typeof window !== 'undefined') window.localStorage.setItem(weekKey, weekId);

  return {
    xpDelta,
    eligible: true,
    summary: `本周首场全真模拟完成，正确率 ${overallPct}%`,
    detail: hasXp(xpDelta) ? `整卷成长：${formatDelta(xpDelta, '经验')}` : '正确率未达到成长区间，本次只记录成绩与错题。',
  };
}

function tierFromPct(pct: number): 0 | 1 | 2 | 3 {
  if (pct >= 90) return 3;
  if (pct >= 75) return 2;
  if (pct >= 60) return 1;
  return 0;
}

function tierName(tier: 0 | 1 | 2 | 3): string {
  return tier === 3 ? 'S' : tier === 2 ? 'A' : tier === 1 ? 'C' : '未通关';
}

function advancedReward(tier: 0 | 1 | 2 | 3): { primary: number; secondary: number } {
  if (tier === 3) return { primary: 10, secondary: 4 };
  if (tier === 2) return { primary: 6, secondary: 2 };
  if (tier === 1) return { primary: 3, secondary: 1 };
  return { primary: 0, secondary: 0 };
}

function dominantAdvancedAbilities(attempts: QuizAttemptRecord[]): { primary: AbilityKey; secondary: AbilityKey } {
  const primaryCounts = emptyExpPool();
  const secondaryCounts = emptyExpPool();
  for (const attempt of attempts) {
    primaryCounts[categoryPrimaryAbility[attempt.question.category]] += 1;
    secondaryCounts[categorySecondaryAbility[attempt.question.category]] += 1;
  }
  const primary = [...ABILITY_KEYS].sort((left, right) => primaryCounts[right] - primaryCounts[left])[0] || 'safety';
  const secondary = [...ABILITY_KEYS]
    .filter(key => key !== primary)
    .sort((left, right) => secondaryCounts[right] - secondaryCounts[left])[0] || 'observe';
  return { primary, secondary };
}

function settleAdvanced(input: SettleMicroGrowthInput): { xpDelta: AbilityDelta; eligible: boolean; summary: string; detail: string } {
  if (!input.completed) {
    return {
      xpDelta: emptyAbilityDelta(),
      eligible: false,
      summary: '主题实战未完成整套挑战，不结算能力成长',
      detail: '主题实战按高难副本通关结算，中途退出只保存答题记录。',
    };
  }

  const correctCount = input.attempts.filter(attempt => attempt.correct).length;
  const pct = input.attempts.length > 0 ? Math.round((correctCount / input.attempts.length) * 100) : 0;
  const currentTier = tierFromPct(pct);
  if (currentTier === 0) {
    return {
      xpDelta: emptyAbilityDelta(),
      eligible: false,
      summary: `主题实战正确率 ${pct}%，暂未通关`,
      detail: '低于 60% 不产生五维成长，错题已进入复盘。',
    };
  }

  const bestKey = getUserStorageKey(ADVANCED_BEST_KEY_PREFIX, input.userId);
  const previousBest = readJson<Record<string, number>>(bestKey, {});
  const challengeKey = input.title || 'theme-battle';
  const previousTier = Math.max(0, Math.min(3, Number(previousBest[challengeKey] ?? 0))) as 0 | 1 | 2 | 3;
  if (currentTier <= previousTier) {
    return {
      xpDelta: emptyAbilityDelta(),
      eligible: false,
      summary: `主题实战评级 ${tierName(currentTier)}，未超过历史最高 ${tierName(previousTier)}`,
      detail: '重复挑战只有超过历史最高评级时，才发放差额成长奖励。',
    };
  }

  previousBest[challengeKey] = currentTier;
  writeJson(bestKey, previousBest);

  const reward = advancedReward(currentTier);
  const previousReward = advancedReward(previousTier);
  const abilities = dominantAdvancedAbilities(input.attempts);
  const xpDelta = emptyAbilityDelta();
  addAbilityXp(xpDelta, abilities.primary, reward.primary - previousReward.primary);
  addAbilityXp(xpDelta, abilities.secondary, reward.secondary - previousReward.secondary);

  return {
    xpDelta,
    eligible: true,
    summary: `主题实战评级 ${tierName(currentTier)}，刷新历史最好成绩`,
    detail: `主能力 ${ABILITY_META[abilities.primary].label}、副能力 ${ABILITY_META[abilities.secondary].label} 获得差额成长：${formatDelta(xpDelta, '经验')}`,
  };
}

export function settleMicroPracticeGrowth(input: SettleMicroGrowthInput): MicroGrowthResult {
  const baseScores = normalizeAbilityScores(input.abilityScores);
  const settlement = input.sessionKind === 'mock'
    ? settleMock(input)
    : input.sessionKind === 'advanced'
      ? settleAdvanced(input)
      : settlePractice(input);

  if (!hasXp(settlement.xpDelta)) {
    return {
      applied: false,
      eligible: settlement.eligible,
      title: input.title,
      summary: settlement.summary,
      detail: settlement.detail,
      xpDelta: settlement.xpDelta,
      scoreDelta: emptyAbilityDelta(),
      nextAbilityScores: baseScores,
      currentExp: loadExpPool(input.userId),
    };
  }

  const applied = applyExperience({
    userId: input.userId,
    abilityScores: input.abilityScores,
    xpDelta: settlement.xpDelta,
  });

  appendAbilityEvent(input.userId, {
    id: `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId ?? null,
    source: 'quiz',
    sourceId: input.title,
    mode: 'freestyle',
    title: input.title,
    deltas: applied.scoreDelta,
    reason: hasXp(applied.scoreDelta)
      ? `${input.title}：${formatDelta(applied.scoreDelta, '分')}`
      : `${input.title}：${formatDelta(settlement.xpDelta, '经验')}`,
    createdAt: new Date().toISOString(),
    meta: {
      sessionKind: input.sessionKind,
      completed: input.completed,
      plannedTotal: input.plannedTotal,
      answered: input.attempts.length,
      correct: input.attempts.filter(attempt => attempt.correct).length,
      xpDelta: settlement.xpDelta,
      expPool: applied.currentExp,
    },
  });

  return {
    applied: true,
    eligible: settlement.eligible,
    title: input.title,
    summary: hasXp(applied.scoreDelta)
      ? `${settlement.summary}，${formatDelta(applied.scoreDelta, '分')}`
      : settlement.summary,
    detail: `${settlement.detail}${hasXp(applied.scoreDelta) ? `；能力提升：${formatDelta(applied.scoreDelta, '分')}` : '；未满升级阈值的经验已保留。'}`,
    xpDelta: settlement.xpDelta,
    scoreDelta: applied.scoreDelta,
    nextAbilityScores: applied.nextAbilityScores,
    currentExp: applied.currentExp,
  };
}