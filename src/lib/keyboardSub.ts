/**
 * @file keyboardSub.ts
 * @desc 键盘会员独立计费 — 月卡 / 季卡 / 年卡 / 永久卡
 *       与 FoxSay 主会员（FFLite/FFPro/FFPro+）解耦。
 *       逻辑：FFPro+ 用户自动包含键盘所有功能，无需单独购买。
 */

export type KbPlanKey = 'kb_month' | 'kb_quarter' | 'kb_year' | 'kb_lifetime';

export interface KbPlan {
  key: KbPlanKey;
  label: string;
  price: number;
  unit: string;
  original?: number;
  tag?: string;
  highlight?: boolean;
  durationDays: number;
}

export const KB_PLANS: KbPlan[] = [
  { key: 'kb_month',    label: '月卡',  price: 12,  unit: '月',     durationDays: 30 },
  { key: 'kb_quarter',  label: '季卡',  price: 30,  unit: '季',     original: 36,  tag: '省 6',           durationDays: 90 },
  { key: 'kb_year',     label: '年卡',  price: 88,  unit: '年',     original: 144, tag: '最划算 · 省 56', durationDays: 365, highlight: true },
  { key: 'kb_lifetime', label: '永久卡', price: 198, unit: '一次付清', tag: '终身',                       durationDays: 36500 },
];

/**
 * 判断用户是否拥有键盘使用权：
 *  - 单独购买了键盘会员（kbVip 为 true 且未过期）
 *  - 或开通了 FFPro+（自动包含键盘）
 */
export function hasKeyboardAccess(user: any): boolean {
  if (!user) return false;
  // FFPro+ 自动解锁
  if (user.isVip && user.subTier === 'proplus') return true;
  // 单独购买
  if (user.kbVip) {
    const exp = user.kbExpireAt;
    if (!exp) return true; // 永久
    const expMs = typeof exp === 'string' ? new Date(exp).getTime() : exp;
    return Date.now() < expMs;
  }
  return false;
}

export function kbPlanLabel(key: KbPlanKey | null | undefined): string {
  if (!key) return '';
  return KB_PLANS.find(p => p.key === key)?.label || '';
}
