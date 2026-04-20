/**
 * 失败重来次数限制
 * ------------------------------------------
 * 规则：
 *  - 免费用户：每关每天 5 次；第 1 次才给 XP，2-5 次仅练习不奖励
 *  - Pro：每关每天 10 次，前 2 次给 XP
 *  - Pro+：每关每天 20 次，前 3 次给 XP（+ 记忆点）
 * 存储：localStorage
 *   key: foxsay_attempts_{levelKid}_{YYYY-MM-DD}
 *   value: { tries: number, xp_granted: number }
 * ------------------------------------------
 */

export type VipTier = 'free' | 'pro' | 'proplus';

export interface AttemptPolicy {
  maxPerDay: number;
  xpGrantedTimes: number; // 前 N 次给 XP
}

export function getAttemptPolicy(tier: VipTier): AttemptPolicy {
  switch (tier) {
    case 'proplus': return { maxPerDay: 20, xpGrantedTimes: 3 };
    case 'pro':     return { maxPerDay: 10, xpGrantedTimes: 2 };
    case 'free':
    default:        return { maxPerDay: 5, xpGrantedTimes: 1 };
  }
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function storageKey(levelKid: string): string {
  return `foxsay_attempts_${levelKid}_${todayKey()}`;
}

export interface AttemptState {
  tries: number;
  xp_granted: number;
}

export function readAttempts(levelKid: string): AttemptState {
  try {
    const raw = localStorage.getItem(storageKey(levelKid));
    if (raw) {
      const o = JSON.parse(raw);
      return { tries: Number(o?.tries) || 0, xp_granted: Number(o?.xp_granted) || 0 };
    }
  } catch {}
  return { tries: 0, xp_granted: 0 };
}

export function writeAttempts(levelKid: string, state: AttemptState): void {
  try {
    localStorage.setItem(storageKey(levelKid), JSON.stringify(state));
  } catch {}
}

/**
 * 本次开始一关前调用：是否允许开始 + 本次是否有 XP 奖励
 */
export function beginAttempt(levelKid: string, tier: VipTier): {
  allowed: boolean;
  triesUsed: number;    // 本次计数之后的总尝试数（1-based）
  triesLeft: number;    // 剩余次数（含本次）
  willGrantXP: boolean; // 本次是否给 XP
  reason?: string;      // 被拒原因
} {
  const policy = getAttemptPolicy(tier);
  const cur = readAttempts(levelKid);
  if (cur.tries >= policy.maxPerDay) {
    return {
      allowed: false,
      triesUsed: cur.tries,
      triesLeft: 0,
      willGrantXP: false,
      reason: `今日次数已用完（${policy.maxPerDay} 次）。明天再来或升级会员获得更多次数。`,
    };
  }
  const nextTries = cur.tries + 1;
  const willGrantXP = cur.xp_granted < policy.xpGrantedTimes;
  const next: AttemptState = {
    tries: nextTries,
    xp_granted: willGrantXP ? cur.xp_granted + 1 : cur.xp_granted,
  };
  writeAttempts(levelKid, next);
  return {
    allowed: true,
    triesUsed: nextTries,
    triesLeft: policy.maxPerDay - nextTries,
    willGrantXP,
  };
}

/** 查询展示用（不计数）*/
export function peekAttempts(levelKid: string, tier: VipTier): {
  triesUsed: number;
  triesLeft: number;
  xpGrantedTimes: number;
  maxPerDay: number;
} {
  const policy = getAttemptPolicy(tier);
  const cur = readAttempts(levelKid);
  return {
    triesUsed: cur.tries,
    triesLeft: Math.max(0, policy.maxPerDay - cur.tries),
    xpGrantedTimes: policy.xpGrantedTimes,
    maxPerDay: policy.maxPerDay,
  };
}
