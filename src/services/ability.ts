import { getLevelCard, getScoringDims } from './levelCards';
import type { AffinityState } from './affinity';
import { mainAffinity } from './affinity';
import type { ScoringResult } from './levelScore';

export const ABILITY_KEYS = ['opener', 'empathy', 'observe', 'topic', 'safety'] as const;
export type AbilityKey = typeof ABILITY_KEYS[number];
export type AbilityScores = Record<AbilityKey, number>;
export type AbilityDelta = Partial<Record<AbilityKey, number>>;

export const DEFAULT_ABILITY_SCORES: AbilityScores = {
  opener: 25,
  empathy: 25,
  observe: 25,
  topic: 25,
  safety: 25,
};

export const ABILITY_META: Record<AbilityKey, { label: string; shortLabel: string; color: string; description: string }> = {
  opener: { label: '开场白', shortLabel: '开场', color: '#FF8A80', description: '自然开口、破冰和第一句话的能力' },
  empathy: { label: '共情力', shortLabel: '共情', color: '#F06292', description: '接住情绪、倾听、让对方感到被理解' },
  observe: { label: '观察力', shortLabel: '观察', color: '#4FC3F7', description: '读懂暗示、细节和关系信号' },
  topic: { label: '话题力', shortLabel: '话题', color: '#4DB6AC', description: '延展话题、制造互动和表达吸引力' },
  safety: { label: '安全感', shortLabel: '安全', color: '#B39DDB', description: '边界、稳定回应、信任和分寸感' },
};

export interface AbilityEvent {
  id: string;
  userId?: string | null;
  source: 'onboarding' | 'deepTest' | 'storyLevel' | 'challengeLevel' | 'quiz' | 'partnerChat' | 'manual';
  sourceId: string;
  mode?: 'story' | 'challenge' | 'freestyle';
  levelKid?: string | null;
  partnerKid?: string | null;
  title?: string;
  deltas: AbilityDelta;
  reason: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

const EVENT_KEY_PREFIX = 'foxsay:ability_events:';

const DIMENSION_RULES: Array<{ key: AbilityKey; pattern: RegExp }> = [
  { key: 'opener', pattern: /开场|破冰|第一句|开口|主动|自然|真诚|口语|流畅|补救|寒暄/ },
  { key: 'empathy', pattern: /共情|情商|理解|体贴|耐心|包容|倾听|情绪|安慰|照顾|接住|感受/ },
  { key: 'observe', pattern: /观察|暗示|细节|信号|读懂|识别|判断|察觉|看见|敏感|线索/ },
  { key: 'topic', pattern: /话题|吸引|魅力|幽默|风趣|聊天|延展|回应|互动|表达|整活|才情|氛围/ },
  { key: 'safety', pattern: /安全|信任|分寸|节奏|尊重|边界|克制|稳定|承诺|透明|负责|一致|公开/ },
];

export function clampAbilityScore(value: unknown): number {
  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) return 25;
  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

export function normalizeAbilityScores(input: unknown): AbilityScores {
  const raw = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  return {
    opener: clampAbilityScore(raw.opener ?? raw.opening ?? raw.chat ?? DEFAULT_ABILITY_SCORES.opener),
    empathy: clampAbilityScore(raw.empathy ?? DEFAULT_ABILITY_SCORES.empathy),
    observe: clampAbilityScore(raw.observe ?? raw.observation ?? DEFAULT_ABILITY_SCORES.observe),
    topic: clampAbilityScore(raw.topic ?? raw.chat ?? raw.charm ?? DEFAULT_ABILITY_SCORES.topic),
    safety: clampAbilityScore(raw.safety ?? raw.security ?? raw.control ?? DEFAULT_ABILITY_SCORES.safety),
  };
}

export function applyAbilityDelta(baseScores: unknown, delta: AbilityDelta): AbilityScores {
  const base = normalizeAbilityScores(baseScores);
  return ABILITY_KEYS.reduce((nextScores, key) => {
    nextScores[key] = clampAbilityScore(base[key] + (delta[key] ?? 0));
    return nextScores;
  }, { ...base } as AbilityScores);
}

export function getAbilityEventStorageKey(userId?: string | null): string {
  return `${EVENT_KEY_PREFIX}${userId || 'anonymous'}`;
}

export function loadAbilityEvents(userId?: string | null): AbilityEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(getAbilityEventStorageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function appendAbilityEvent(userId: string | null | undefined, event: AbilityEvent): AbilityEvent[] {
  if (typeof window === 'undefined') return [event];
  const events = [...loadAbilityEvents(userId), event].slice(-240);
  try {
    window.localStorage.setItem(getAbilityEventStorageKey(userId), JSON.stringify(events));
  } catch {}
  return events;
}

function matchAbilityKey(text: string): AbilityKey | null {
  const normalizedText = text || '';
  const matched = DIMENSION_RULES.find(rule => rule.pattern.test(normalizedText));
  return matched?.key ?? null;
}

function normalizeWeights(weights: Partial<Record<AbilityKey, number>>): Record<AbilityKey, number> {
  const total = ABILITY_KEYS.reduce((sum, key) => sum + Math.max(0, weights[key] ?? 0), 0);
  if (total <= 0) {
    return { opener: 0.2, empathy: 0.25, observe: 0.2, topic: 0.2, safety: 0.15 };
  }
  return ABILITY_KEYS.reduce((nextWeights, key) => {
    nextWeights[key] = Math.max(0, weights[key] ?? 0) / total;
    return nextWeights;
  }, {} as Record<AbilityKey, number>);
}

export function getLevelAbilityWeights(levelKid: string | null | undefined): Record<AbilityKey, number> {
  if (!levelKid) return normalizeWeights({});
  const weights: Partial<Record<AbilityKey, number>> = {};
  const scoringDims = getScoringDims(levelKid);
  for (const scoringDim of scoringDims) {
    const abilityKey = matchAbilityKey(`${scoringDim.name} ${scoringDim.description || ''}`);
    if (abilityKey) weights[abilityKey] = (weights[abilityKey] ?? 0) + (scoringDim.weight || 0.2);
  }

  const card = getLevelCard(levelKid);
  const trainingTags = Array.isArray(card?.training_focus) ? card.training_focus : [];
  for (const tag of trainingTags) {
    const abilityKey = matchAbilityKey(String(tag));
    if (abilityKey) weights[abilityKey] = (weights[abilityKey] ?? 0) + 0.16;
  }

  return normalizeWeights(weights);
}

function addDelta(target: AbilityDelta, key: AbilityKey, value: number): void {
  target[key] = (target[key] ?? 0) + value;
}

function getAffinityDelta(start: AffinityState, end: AffinityState): AbilityDelta {
  const delta: AbilityDelta = {};
  const heartDelta = end.heart - start.heart;
  const trustDelta = end.trust - start.trust;
  const mindDelta = end.mind - start.mind;
  const sparkDelta = end.spark - start.spark;
  if (heartDelta >= 6) addDelta(delta, 'opener', 1);
  if (heartDelta >= 8) addDelta(delta, 'topic', 1);
  if (trustDelta >= 6) addDelta(delta, 'safety', 1);
  if (trustDelta >= 9) addDelta(delta, 'empathy', 1);
  if (mindDelta >= 6) addDelta(delta, 'observe', 1);
  if (mindDelta >= 9) addDelta(delta, 'empathy', 1);
  if (sparkDelta >= 6) addDelta(delta, 'topic', 1);
  if (sparkDelta >= 9) addDelta(delta, 'opener', 1);
  return delta;
}

function roundDelta(delta: AbilityDelta): AbilityDelta {
  const rounded: AbilityDelta = {};
  for (const key of ABILITY_KEYS) {
    const value = delta[key] ?? 0;
    if (Math.abs(value) >= 0.5) rounded[key] = Math.max(-3, Math.min(8, Math.round(value)));
  }
  return rounded;
}

export function buildAbilityEventFromLevel(input: {
  userId?: string | null;
  levelKid?: string | null;
  mode: 'story' | 'challenge' | 'freestyle';
  partnerKid?: string | null;
  title?: string;
  scoring: ScoringResult;
  affinityStart: AffinityState;
  affinityEnd: AffinityState;
  xpGranted?: number;
}): AbilityEvent {
  const weights = getLevelAbilityWeights(input.levelKid || 'L001');
  const passMultiplier = input.scoring.pass ? 1 : 0.25;
  const xpMultiplier = (input.xpGranted ?? 0) > 0 ? 1 : 0.35;
  const starBudget = [0, 3, 5, 7][input.scoring.star] || 0;
  const scoreBonus = Math.max(0, Math.round((input.scoring.total - 60) / 18));
  const mainDelta = mainAffinity(input.affinityEnd) - mainAffinity(input.affinityStart);
  const affinityBonus = Math.max(0, Math.min(3, Math.floor(mainDelta / 10)));
  const budget = Math.max(input.scoring.pass ? 2 : 0, Math.round((starBudget + scoreBonus + affinityBonus) * passMultiplier * xpMultiplier));
  const weightedDelta: AbilityDelta = {};

  if (budget > 0) {
    for (const key of ABILITY_KEYS) {
      const value = budget * weights[key];
      if (value > 0) weightedDelta[key] = value;
    }
    const primaryKey = ABILITY_KEYS.reduce((bestKey, key) => weights[key] > weights[bestKey] ? key : bestKey, 'opener' as AbilityKey);
    weightedDelta[primaryKey] = Math.max(1, weightedDelta[primaryKey] ?? 0);
  }

  const affinityDelta = getAffinityDelta(input.affinityStart, input.affinityEnd);
  for (const key of ABILITY_KEYS) addDelta(weightedDelta, key, affinityDelta[key] ?? 0);

  const deltas = roundDelta(weightedDelta);
  const source = input.mode === 'challenge' ? 'challengeLevel' : input.mode === 'story' ? 'storyLevel' : 'partnerChat';
  const changedLabels = ABILITY_KEYS
    .filter(key => (deltas[key] ?? 0) !== 0)
    .map(key => `${ABILITY_META[key].label}+${deltas[key]}`)
    .join('、');

  return {
    id: `ability_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: input.userId ?? null,
    source,
    sourceId: input.levelKid || input.title || source,
    mode: input.mode,
    levelKid: input.levelKid ?? null,
    partnerKid: input.partnerKid ?? null,
    title: input.title,
    deltas,
    reason: changedLabels ? `完成「${input.title || input.levelKid || '练习'}」：${changedLabels}` : `完成「${input.title || input.levelKid || '练习'}」，本次未产生能力成长`,
    createdAt: new Date().toISOString(),
    meta: {
      total: input.scoring.total,
      star: input.scoring.star,
      ending: input.scoring.ending,
      affinityStart: mainAffinity(input.affinityStart),
      affinityEnd: mainAffinity(input.affinityEnd),
      weights,
      xpGranted: input.xpGranted ?? 0,
    },
  };
}

export function hasAbilityDelta(event: AbilityEvent | null | undefined): boolean {
  if (!event) return false;
  return ABILITY_KEYS.some(key => (event.deltas[key] ?? 0) !== 0);
}

export function buildStyleRadar(scoresInput: unknown): Record<'mouthpiece' | 'softHeart' | 'complaint' | 'confusion' | 'rescue' | 'playful', number> {
  const scores = normalizeAbilityScores(scoresInput);
  return {
    mouthpiece: clampAbilityScore(scores.topic * 0.55 + scores.opener * 0.45),
    softHeart: clampAbilityScore(scores.empathy * 0.85 + scores.safety * 0.15),
    complaint: clampAbilityScore(100 - (scores.safety * 0.45 + scores.empathy * 0.35 + scores.observe * 0.2)),
    confusion: clampAbilityScore(100 - (scores.observe * 0.72 + scores.safety * 0.28)),
    rescue: clampAbilityScore(scores.safety * 0.52 + scores.empathy * 0.32 + scores.observe * 0.16),
    playful: clampAbilityScore(scores.topic * 0.62 + scores.opener * 0.28 + scores.observe * 0.1),
  };
}
