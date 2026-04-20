/**
 * @file payService.ts
 * @desc 支付服务抽象层 — 当前为 Mock 实现，待原生桥接后替换。
 *       所有付费入口调用 payService.createOrder 即可，无需关心渠道细节。
 */
import { PLANS, PayChannel, PlanKey } from './subscription';

export interface Order {
  orderId: string;
  plan: PlanKey;
  channel: PayChannel;
  amount: number;
  createdAt: number;
}

export interface PayResult {
  success: boolean;
  orderId: string;
  plan: PlanKey;
  channel: PayChannel;
  /** 会员到期时间（unix ms） */
  expireAt: number;
  /** 是否自动续费 */
  autoRenew: boolean;
  message?: string;
}

function uid() {
  return 'ORD' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

/** 创建并支付一笔订单（Mock）。
 *  真实环境下此函数应改为 fetch('/api/pay/create')
 *  @API POST /api/pay/create { plan, channel }
 *  @API POST /api/pay/confirm { orderId }
 */
export function createOrder(plan: PlanKey, channel: PayChannel): Promise<PayResult> {
  const p = PLANS.find(x => x.key === plan);
  if (!p) return Promise.reject(new Error('invalid plan'));

  const orderId = uid();
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId,
        plan,
        channel,
        expireAt: Date.now() + p.durationDays * 24 * 60 * 60 * 1000,
        autoRenew: plan !== 'lifetime',
        message: 'mock 支付成功',
      });
    }, 1100);
  });
}

/** 取消自动续费（Mock） */
export function cancelAutoRenew(): Promise<{ success: true }> {
  return new Promise(r => setTimeout(() => r({ success: true }), 600));
}
