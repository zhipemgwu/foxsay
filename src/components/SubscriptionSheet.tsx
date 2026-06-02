/**
 * @file SubscriptionSheet.tsx
 * @desc 全局唯一的会员开通浮层 — 任何地方调用 useSub().open(source) 即可弹出。
 *       打通 payService → 支付成功 → 自动写回 UserContext。
 */
import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Crown, X, RefreshCw, Sparkles } from 'lucide-react';
import { PLANS, TERMS, PAY_CHANNELS, channelLabel, PlanKey, PayChannel } from '../lib/subscription';
import { createOrder } from '../lib/payService';
import { useUser } from '../context/UserContext';

interface Ctx {
  /** 打开开通浮层；source 仅用于埋点 */
  open: (source?: string, defaultPlan?: PlanKey) => void;
  close: () => void;
  isOpen: boolean;
}

const SubContext = createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });

export function useSub() { return useContext(SubContext); }

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<string>('unknown');
  const [plan, setPlan] = useState<PlanKey>('year');
  const [channel, setChannel] = useState<PayChannel>('wechat');
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState('');
  const user = useUser();
  const toastRef = useRef<number | undefined>(undefined);

  const flash = (m: string) => {
    setToast(m);
    clearTimeout(toastRef.current);
    toastRef.current = window.setTimeout(() => setToast(''), 1800);
  };

  const open = useCallback((src = 'unknown', defaultPlan: PlanKey = 'year') => {
    setSource(src);
    setPlan(defaultPlan);
    setChannel('wechat');
    setIsOpen(true);
    // 埋点
    try { console.info('[sub] open', { source: src, userId: user.userId }); } catch {}
  }, [user.userId]);

  const close = useCallback(() => { if (!paying) setIsOpen(false); }, [paying]);

  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    const MAX_RETRIES = 2;
    let lastError: unknown;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
          flash(`重试中 (${attempt}/${MAX_RETRIES})...`);
        }
        const r = await createOrder(plan, channel);
        if (r.success) {
          (user as any).updateUser({
            isVip: true,
            subPlan: r.plan,
            subExpireAt: r.expireAt,
            subChannel: r.channel,
            subAutoRenew: r.autoRenew,
          });
          flash('支付成功 · 会员已激活');
          setTimeout(() => setIsOpen(false), 900);
          setPaying(false);
          return;
        } else {
          lastError = r.message || '支付失败';
        }
      } catch (err) {
        lastError = err;
        console.error(`[SubscriptionSheet] pay attempt ${attempt + 1} failed:`, err);
      }
    }
    flash(typeof lastError === 'string' ? lastError : '支付失败，请稍后重试');
    setPaying(false);
  };

  const current = PLANS.find(p => p.key === plan) || PLANS[2];

  return (
    <SubContext.Provider value={{ open, close, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1200] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={TERMS.SUBSCRIBE_ACTION}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full"
              style={{
                background: '#352f45', borderRadius: '20px 20px 0 0',
                padding: '18px 18px calc(env(safe-area-inset-bottom, 14px) + 14px)',
                maxWidth: 430, maxHeight: '85vh', overflowY: 'auto',
              }}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown size={18} color="#FFD93D" />
                  <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>开通 FoxSay {TERMS.MEMBERSHIP}</span>
                  <span style={{
                    fontSize: 10, color: '#1a1520', fontWeight: 700,
                    background: 'linear-gradient(135deg,#FFD93D,#FF8A80)',
                    padding: '1px 6px', borderRadius: 4,
                  }}>{TERMS.PRO_BADGE}</span>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={close}
                  aria-label="关闭"
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} color="rgba(245,239,232,0.5)" />
                </motion.button>
              </div>

              {/* 权益简述 */}
              <div className="flex items-center gap-2 px-3 py-2.5 mb-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,138,128,0.14), rgba(255,217,61,0.1))',
                  border: '1px solid rgba(255,217,61,0.22)',
                  borderRadius: 10,
                }}>
                <Sparkles size={12} color="#FFD93D" />
                <span style={{ color: 'rgba(245,239,232,0.82)', fontSize: 12, lineHeight: 1.5 }}>
                  解锁回复建议 · 约会复盘 · 关系诊断 · 专属导师 · 高级副本
                </span>
              </div>

              {/* 方案 */}
              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, marginBottom: 8 }}>选择方案</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PLANS.map(p => {
                  const active = plan === p.key;
                  return (
                    <motion.button key={p.key}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPlan(p.key)}
                      className="relative p-2.5 text-left overflow-hidden"
                      aria-pressed={active}
                      style={{
                        borderRadius: 10,
                        background: active
                          ? 'linear-gradient(135deg, rgba(255,138,128,0.22), rgba(155,126,222,0.2))'
                          : 'rgba(245,239,232,0.04)',
                        border: '1px solid ' + (active ? 'rgba(255,138,128,0.65)' : 'rgba(245,239,232,0.08)'),
                        boxShadow: active ? '0 0 0 2px #FF8A80' : 'none',
                        transition: 'box-shadow 0.18s ease',
                      }}>
                      {p.tag && (
                        <span style={{
                          position: 'absolute', top: 0, right: 0,
                          fontSize: 9, fontWeight: 700, color: '#1a1520',
                          background: p.highlight
                            ? 'linear-gradient(135deg,#FFD93D,#FF8A80)'
                            : 'linear-gradient(135deg,#B39DDB,#9575CD)',
                          padding: '2px 6px', borderRadius: '0 10px 0 6px',
                        }}>{p.tag}</span>
                      )}
                      <p style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>{p.label}</p>
                      <div className="flex items-baseline gap-0.5 mt-0.5">
                        <span style={{ color: '#FFD93D', fontSize: 18, fontWeight: 800 }}>¥{p.price}</span>
                        <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10 }}>/{p.unit}</span>
                      </div>
                      {p.original && (
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, textDecoration: 'line-through' }}>
                          ¥{p.original}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* 渠道 */}
              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, marginBottom: 8 }}>支付方式</p>
              <div className="space-y-2 mb-3">
                {PAY_CHANNELS.map(c => {
                  const active = channel === c;
                  return (
                    <motion.button key={c}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChannel(c)}
                      aria-pressed={active}
                      className="w-full flex items-center gap-3 px-3 py-2.5"
                      style={{
                        background: 'rgba(245,239,232,0.04)', borderRadius: 10,
                        border: '1px solid ' + (active ? (c === 'wechat' ? 'rgba(7,193,96,0.5)' : 'rgba(22,119,255,0.5)') : 'transparent'),
                      }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: c === 'wechat' ? '#07c160' : '#1677ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, color: '#fff', fontWeight: 700,
                      }}>{c === 'wechat' ? '微' : '支'}</span>
                      <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 500, flex: 1, textAlign: 'left' }}>{channelLabel(c)}</span>
                      {active && (
                        <div className="flex items-center justify-center"
                          style={{ width: 18, height: 18, borderRadius: '50%', background: c === 'wechat' ? '#07c160' : '#1677ff' }}>
                          <Check size={11} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10.5, lineHeight: 1.55, marginBottom: 10 }}>
                点击「确认支付」即视为同意《会员服务协议》《自动续费规则》
                {plan !== 'lifetime' ? '，可在「我的 → 订阅管理」中随时关闭' : '，永久版无自动续费'}。
              </p>

              <motion.button whileTap={{ scale: 0.98 }}
                onClick={handlePay} disabled={paying}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  height: 46,
                  background: paying
                    ? 'rgba(255,138,128,0.4)'
                    : 'linear-gradient(135deg,#FF8A80 0%,#F5B87C 50%,#FFD93D 100%)',
                  borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 6px 18px rgba(255,138,128,0.4)',
                  opacity: paying ? 0.85 : 1,
                }}>
                {paying ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <RefreshCw size={15} />
                  </motion.span>支付中…</>
                ) : (
                  <>确认支付 ¥{current.price}</>
                )}
              </motion.button>

              <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, textAlign: 'center', marginTop: 8 }}>
                来源：{source}
              </p>
            </motion.div>

            {/* toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="fixed left-1/2 z-[1202]"
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
    </SubContext.Provider>
  );
}
