/**
 * @file SubscriptionManageSheet.tsx
 * @desc 订阅管理浮层 — 查看当前会员状态、升级、关闭自动续费、联系客服。
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Calendar, CreditCard, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { PLANS, TERMS, channelLabel, PayChannel } from '../lib/subscription';
import { cancelAutoRenew } from '../lib/payService';
import { useUser } from '../context/UserContext';
import { useSub } from './SubscriptionSheet';

interface Props { open: boolean; onClose: () => void; onUpgrade?: () => void; }

export function SubscriptionManageSheet({ open, onClose, onUpgrade }: Props) {
  const user = useUser() as any;
  const sub = useSub();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState('');

  const isPro = user.isPro?.();
  const plan = PLANS.find(p => p.key === user.subPlan);
  const days = user.daysLeft?.() || 0;
  const expireDate = user.subExpireAt ? new Date(user.subExpireAt).toLocaleDateString('zh-CN') : '—';

  const handleCancelRenew = async () => {
    setCancelling(true);
    await cancelAutoRenew();
    user.updateUser({ subAutoRenew: false });
    setCancelling(false);
    setConfirmCancel(false);
    setToast('已关闭自动续费');
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1150] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={TERMS.MANAGE_ACTION}
        >
          <motion.div
            onClick={e => e.stopPropagation()}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full"
            style={{
              background: '#352f45', borderRadius: '20px 20px 0 0',
              padding: '18px 18px calc(env(safe-area-inset-bottom, 14px) + 14px)',
              maxWidth: 430,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown size={18} color="#FFD93D" />
                <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>{TERMS.MANAGE_ACTION}</span>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
                aria-label="关闭"
                style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} color="rgba(245,239,232,0.5)" />
              </motion.button>
            </div>

            {isPro ? (
              <>
                {/* 当前档位 */}
                <div className="px-4 py-4 mb-3"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,217,61,0.14), rgba(155,126,222,0.12))',
                    borderRadius: 14,
                    border: '1px solid rgba(255,217,61,0.28)',
                  }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>FoxSay 会员 · {plan?.label || '—'}</span>
                      <span style={{
                        fontSize: 10, color: '#1a1520', fontWeight: 700,
                        background: 'linear-gradient(135deg,#FFD93D,#FF8A80)',
                        padding: '1px 6px', borderRadius: 4,
                      }}>{user.subTier === 'proplus' ? 'PRO+' : user.subTier === 'pro' ? 'PRO' : 'Lite'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={11} color="rgba(245,239,232,0.55)" />
                    <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 12 }}>
                      到期日 {expireDate}（{days > 0 ? `剩余 ${days} 天` : '已到期'}）
                    </span>
                  </div>
                  {user.subChannel && (
                    <div className="flex items-center gap-2">
                      <CreditCard size={11} color="rgba(245,239,232,0.55)" />
                      <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 12 }}>
                        {channelLabel(user.subChannel as PayChannel)}支付
                      </span>
                    </div>
                  )}
                </div>

                {/* 操作列表 */}
                <div className="space-y-2">
                  <motion.button whileTap={{ scale: 0.98 }}
                    onClick={() => { onClose(); onUpgrade?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                    <Crown size={15} color="#FFD93D" />
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, flex: 1, textAlign: 'left' }}>升级 / 续费</span>
                    <ChevronRight size={14} color="rgba(245,239,232,0.4)" />
                  </motion.button>

                  {plan?.key !== 'lifetime' && user.subAutoRenew && (
                    <motion.button whileTap={{ scale: 0.98 }}
                      onClick={() => setConfirmCancel(true)}
                      className="w-full flex items-center gap-3 px-4 py-3"
                      style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                      <AlertCircle size={15} color="#FFB74D" />
                      <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, flex: 1, textAlign: 'left' }}>关闭自动续费</span>
                      <ChevronRight size={14} color="rgba(245,239,232,0.4)" />
                    </motion.button>
                  )}

                  {plan?.key !== 'lifetime' && !user.subAutoRenew && (
                    <div className="flex items-center gap-2 px-4 py-3"
                      style={{ background: 'rgba(255,183,77,0.08)', borderRadius: 10, border: '1px solid rgba(255,183,77,0.2)' }}>
                      <AlertCircle size={13} color="#FFB74D" />
                      <span style={{ color: 'rgba(255,183,77,0.9)', fontSize: 12 }}>自动续费已关闭，到期后需手动续费</span>
                    </div>
                  )}

                  <motion.button whileTap={{ scale: 0.98 }}
                    onClick={() => setToast('已为你打开客服通道（Mock）')}
                    className="w-full flex items-center gap-3 px-4 py-3"
                    style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                    <span style={{ fontSize: 15 }}>💬</span>
                    <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, flex: 1, textAlign: 'left' }}>联系专属客服</span>
                    <ChevronRight size={14} color="rgba(245,239,232,0.4)" />
                  </motion.button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-3"
                  style={{ borderTop: '1px solid rgba(245,239,232,0.06)' }}>
                  <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>《会员协议》</span>
                  <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>《退款政策》</span>
                  <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>《自动续费规则》</span>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-3"
                  style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'linear-gradient(135deg,#FF8A80 0%,#F5B87C 55%,#FFD93D 100%)',
                  }}>
                  <Crown size={26} color="#fff" />
                </div>
                <p style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>你还不是会员</p>
                <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginTop: 4, marginBottom: 16 }}>
                  开通后解锁回复建议 / 深度诊断 / 专属导师 / 高级副本等功能
                </p>
                <motion.button whileTap={{ scale: 0.98 }}
                  onClick={() => { onClose(); setTimeout(() => sub.open('manage_empty'), 200); }}
                  className="inline-flex items-center gap-1 px-5 py-2.5"
                  style={{
                    background: 'linear-gradient(135deg,#FF8A80,#FFD93D)',
                    borderRadius: 999, color: '#1a1520', fontSize: 13, fontWeight: 700,
                  }}>
                  {TERMS.SUBSCRIBE_ACTION}
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* 取消二次确认 */}
          <AnimatePresence>
            {confirmCancel && (
              <motion.div className="fixed inset-0 z-[1160] flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => !cancelling && setConfirmCancel(false)}>
                <motion.div
                  onClick={e => e.stopPropagation()}
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  className="mx-6 p-5"
                  style={{ background: '#453a60', borderRadius: 16, maxWidth: 320 }}>
                  <p style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>确定关闭自动续费？</p>
                  <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
                    到期后（{expireDate}）将自动失效，可随时重新开通。
                  </p>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setConfirmCancel(false)}
                      className="flex-1 py-2.5"
                      style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 10, color: '#f5efe8', fontSize: 13 }}>
                      再想想
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleCancelRenew} disabled={cancelling}
                      className="flex-1 py-2.5"
                      style={{ background: '#FFB74D', borderRadius: 10, color: '#1a1520', fontSize: 13, fontWeight: 700, opacity: cancelling ? 0.6 : 1 }}>
                      {cancelling ? '处理中…' : '确认关闭'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="fixed left-1/2 z-[1170]"
                style={{
                  bottom: 'calc(env(safe-area-inset-bottom, 12px) + 80px)',
                  transform: 'translateX(-50%)',
                  background: 'rgba(42,30,50,0.96)', color: '#f5efe8',
                  padding: '10px 16px', borderRadius: 10, fontSize: 13,
                  border: '1px solid rgba(255,217,61,0.3)',
                }}
              >
                <Check size={13} color="#FFD93D" style={{ display: 'inline', marginRight: 6 }} />{toast}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
