/**
 * 好感度（Affinity）服务
 * ------------------------------------------
 * 规则：
 *  - 剧情关卡（mode='story'）：每关每次会话都重置；好感度只在本次会话内有效
 *  - 人物邂逅（mode='challenge'）：按 partner kid（R001..R030）跨会话累积
 * 存储：localStorage
 *  - 累积 key：foxsay_affinity_by_kid  → { [kid]: { heart, trust, mind, spark, updated_at } }
 *  - 当前会话状态用组件内 state 维护，不入 storage
 * ------------------------------------------
 */

export interface AffinityState {
  heart: number;  // 心动
  trust: number;  // 信任
  mind: number;   // 理解
  spark: number;  // 暧昧
}

export interface AffinityDelta {
  heart?: number;
  trust?: number;
  mind?: number;
  spark?: number;
}

const LS_KEY = 'foxsay_affinity_by_kid';

export function emptyAffinity(): AffinityState {
  return { heart: 40, trust: 40, mind: 40, spark: 40 };
}

/** 主好感（UI 进度条用）： (心动+暧昧)/2 * 0.6 + (信任+理解)/2 * 0.4 */
export function mainAffinity(a: AffinityState): number {
  const romantic = (a.heart + a.spark) / 2;
  const rational = (a.trust + a.mind) / 2;
  return Math.round(romantic * 0.6 + rational * 0.4);
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

export function applyDelta(base: AffinityState, delta: AffinityDelta): AffinityState {
  return {
    heart: clamp(base.heart + (delta.heart ?? 0)),
    trust: clamp(base.trust + (delta.trust ?? 0)),
    mind:  clamp(base.mind  + (delta.mind  ?? 0)),
    spark: clamp(base.spark + (delta.spark ?? 0)),
  };
}

/** 读累积好感（按 partner kid） */
export function loadAffinityByKid(kid: string): AffinityState {
  if (!kid) return emptyAffinity();
  try {
    const raw = localStorage.getItem(LS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const rec = map[kid];
    if (rec && typeof rec === 'object') {
      return {
        heart: clamp(rec.heart ?? 40),
        trust: clamp(rec.trust ?? 40),
        mind:  clamp(rec.mind  ?? 40),
        spark: clamp(rec.spark ?? 40),
      };
    }
  } catch {}
  return emptyAffinity();
}

/** 写累积好感（按 partner kid） */
export function saveAffinityByKid(kid: string, state: AffinityState): void {
  if (!kid) return;
  try {
    const raw = localStorage.getItem(LS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[kid] = { ...state, updated_at: new Date().toISOString() };
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {}
}

/**
 * 初始化一局对话的好感度起点：
 *  - story 模式：每关重置（不读 partner kid）
 *  - challenge（人物邂逅）模式：按 partner kid 累积
 */
export function initAffinity(
  mode: 'story' | 'challenge',
  partnerKid?: string | null,
): AffinityState {
  if (mode === 'challenge' && partnerKid) {
    return loadAffinityByKid(partnerKid);
  }
  return emptyAffinity();
}

/**
 * 一局结束后按结局保存（仅 challenge 模式）
 */
export function persistOnEnd(
  mode: 'story' | 'challenge',
  partnerKid: string | null | undefined,
  finalState: AffinityState,
): void {
  if (mode === 'challenge' && partnerKid) {
    saveAffinityByKid(partnerKid, finalState);
  }
}
