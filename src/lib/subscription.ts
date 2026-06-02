/**
 * @file subscription.ts
 * @desc 会员档位与权益的唯一真相源。所有入口从这里读。
 *       对外统一术语：会员 / 会员 PRO / 会员档位
 *       Lite = 月卡 / Pro = 季卡+年卡 / Pro+ = 永久
 */

export type PlanKey = 'monthly' | 'quarter' | 'year' | 'lifetime';

export interface Plan {
  key: PlanKey;
  label: string;
  price: number;
  unit: string;
  /** 原价，用于划掉显示 */
  original?: number;
  /** 优惠标签 */
  tag?: string;
  /** 高亮为推荐 */
  highlight?: boolean;
  /** 人类友好周期描述 */
  durationDays: number;
}

export const PLANS: Plan[] = [
  { key: 'monthly',  label: '月卡',  price: 28,  unit: '月',     durationDays: 30 },
  { key: 'quarter',  label: '季卡',  price: 68,  unit: '季',     original: 84,  tag: '省 16',        durationDays: 90 },
  { key: 'year',     label: '年卡',  price: 198, unit: '年',     original: 336, tag: '最划算 · 省 138', durationDays: 365, highlight: true },
  { key: 'lifetime', label: '永久',  price: 498, unit: '一次付清', tag: '终身', durationDays: 36500 },
];

export const TERMS = {
  /** 全站对外统一叫法 */
  MEMBERSHIP: '会员',
  PRO_BADGE: 'PRO',
  SUBSCRIBE_ACTION: '开通会员',
  MANAGE_ACTION: '订阅管理',
} as const;

/** 权益矩阵 — 各个功能是否需要会员 */
export const FEATURES = {
  REPLY_SUGGESTION: { pro: true, label: '尼克大叔回复建议' },
  DIAGNOSTIC_DEEP: { pro: true, label: '关系深度诊断' },
  COACH_CHAT: { pro: true, label: '专属导师一对一' },
  COMMUNITY_PAID_POSTS: { pro: true, label: '精品付费专栏' },
} as const;

export type FeatureKey = keyof typeof FEATURES;

/** 支持的支付渠道 */
export const PAY_CHANNELS = ['wechat', 'alipay'] as const;
export type PayChannel = typeof PAY_CHANNELS[number];

export function channelLabel(c: PayChannel) {
  return c === 'wechat' ? '微信支付' : '支付宝';
}
