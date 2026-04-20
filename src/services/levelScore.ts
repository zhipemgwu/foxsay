/**
 * 关卡评分引擎
 * ------------------------------------------
 * 公式：single_dim = AI_score(0-100) * 0.6 + hard_rule(0-100) * 0.4
 *       total = Σ(dim * weight)
 *       star = 1 if total>=60, 2 if >=75, 3 if >=88
 *
 * 数据源：
 *  - level-cards.json → dimensions[]/pass_score/perfect_score_threshold/fail_conditions
 *  - 本次对话历史
 *  - 本次好感度轨迹（AffinityState[]）
 * ------------------------------------------
 */

import type { AffinityState } from './affinity';
import { mainAffinity } from './affinity';
import { getScoringDims, getPassScore, getPerfectThreshold } from './levelCards';

export interface HardMetrics {
  userMsgCount: number;     // 用户发言条数
  avgUserMsgLen: number;    // 平均字数
  affinityStart: number;    // 开局主好感
  affinityEnd: number;      // 结束主好感
  affinityPeak: number;     // 全程峰值
  turnsUsed: number;        // 使用轮数
  maxTurns: number;         // 轮数上限
  minTurnsForGood: number;  // 触发 good ending 的最低轮数
  redflagHits: number;      // 命中 fail_conditions 的次数
}

export interface ScoringResult {
  total: number;            // 0-100
  star: 0 | 1 | 2 | 3;
  pass: boolean;
  ending: 'perfect' | 'good' | 'neutral' | 'bad';
  dims: { name: string; score: number; weight: number }[];
  // 调试字段
  aiSubjectiveAvg: number;
  hardObjectiveAvg: number;
}

export function computeHardScores(m: HardMetrics): Record<string, number> {
  // 针对"4 个标准维度"做粗粒度映射；如果 level 的 dims 名字不同，以名字匹配做软映射
  // 1. 自然度 / 情商 / 耐心 / 真诚 → 用好感净增长 + 对话平均长度
  const affGain = m.affinityEnd - m.affinityStart;        // -100..+100
  const naturalness = 50 + Math.max(-50, Math.min(50, affGain * 1.2));
  // 2. 分寸感 / 节奏控制 → 用轮次使用合理性
  const pace = (() => {
    if (m.turnsUsed < m.minTurnsForGood) return 40 + m.turnsUsed / m.minTurnsForGood * 30;
    const span = m.maxTurns - m.minTurnsForGood;
    const over = m.turnsUsed - m.minTurnsForGood;
    return span <= 0 ? 80 : 80 - Math.min(30, (over / span) * 30);
  })();
  // 3. 吸引力 / 魅力 → 用 peak 好感
  const charm = Math.max(0, Math.min(100, m.affinityPeak));
  // 4. 共情 / 耐心 / 共情力 → 用平均消息长度（>15 字加分）
  const empathy = 40 + Math.min(40, (m.avgUserMsgLen - 8) * 2);
  // 5. 其他（默认）→ 50 基础
  return {
    naturalness: Math.round(naturalness),
    pace: Math.round(pace),
    charm: Math.round(charm),
    empathy: Math.round(empathy),
  };
}

/** 把 level dim 的 name 软映射到 hard 分桶 */
function matchHardBucket(dimName: string, hard: Record<string, number>): number {
  const k = dimName.toLowerCase();
  if (/(自然|真诚|口语|流畅)/.test(dimName)) return hard.naturalness;
  if (/(情商|共情|理解|体贴|耐心|包容|倾听)/.test(dimName)) return hard.empathy;
  if (/(魅力|吸引|幽默|风趣|活跃|整活|话题|品味|才情)/.test(dimName)) return hard.charm;
  if (/(分寸|节奏|尊重|边界|收放|克制)/.test(dimName)) return hard.pace;
  return 60; // fallback
}

export interface ScoringInput {
  levelKid: string;
  aiDimScores: Record<string, number>; // AI 主观评分（维度名 → 0-100）
  metrics: HardMetrics;
}

export function scoreLevel(input: ScoringInput): ScoringResult {
  const { levelKid, aiDimScores, metrics } = input;
  const dims = getScoringDims(levelKid);
  const hardBuckets = computeHardScores(metrics);

  let total = 0;
  const out: ScoringResult['dims'] = [];
  let aiSum = 0, hardSum = 0;
  for (const d of dims) {
    const ai = clamp100(aiDimScores[d.name]);
    const hard = clamp100(matchHardBucket(d.name, hardBuckets));
    const single = ai * 0.6 + hard * 0.4;
    total += single * (d.weight || 0);
    out.push({ name: d.name, score: Math.round(single), weight: d.weight });
    aiSum += ai;
    hardSum += hard;
  }
  // 硬失败
  if (metrics.redflagHits >= 3) total = Math.min(total, 30);
  total = Math.round(total);

  const pass = total >= getPassScore(levelKid);
  const perfect = total >= getPerfectThreshold(levelKid);
  const ending = decideEnding(total, metrics);
  const star = perfect ? 3 : total >= 75 ? 2 : pass ? 1 : 0;

  return {
    total,
    star,
    pass,
    ending,
    dims: out,
    aiSubjectiveAvg: Math.round(aiSum / Math.max(1, dims.length)),
    hardObjectiveAvg: Math.round(hardSum / Math.max(1, dims.length)),
  };
}

function decideEnding(total: number, m: HardMetrics): ScoringResult['ending'] {
  if (m.redflagHits >= 3 || m.affinityEnd < 20) return 'bad';
  if (total >= 88 && m.affinityEnd >= 75 && m.turnsUsed >= m.minTurnsForGood) return 'perfect';
  if (total >= 70 && m.affinityEnd >= 55) return 'good';
  if (total < 50 || m.affinityEnd < 35) return 'bad';
  return 'neutral';
}

function clamp100(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 60;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** 从好感度序列抽出 metrics 需要的字段 */
export function buildAffinityMetrics(history: AffinityState[]): {
  affinityStart: number; affinityEnd: number; affinityPeak: number;
} {
  if (history.length === 0) return { affinityStart: 40, affinityEnd: 40, affinityPeak: 40 };
  const mains = history.map(mainAffinity);
  return {
    affinityStart: mains[0],
    affinityEnd: mains[mains.length - 1],
    affinityPeak: Math.max(...mains),
  };
}

/** 关卡 XP 奖励（按星级 + 是否给 XP） */
export function xpRewardForStar(star: 0 | 1 | 2 | 3, mode: 'story' | 'challenge'): number {
  if (mode === 'story') {
    return [0, 15, 30, 50][star];
  }
  return [0, 20, 40, 80][star];
}
