/*
 * ═══════════════════════════════════════════════════════════════
 *  订购 OrderPage
 *  — 聚合两类付费入口：
 *    1. FoxSay 主会员（FFLite / FFPro / FFPro+）→ 复用 VIPPage
 *    2. AI 辅助键盘会员                       → 复用 AssistKeyboardPage
 *  两个子Tab："会员订阅" / "键盘会员"，共享外层容器与 TabBar
 * ═══════════════════════════════════════════════════════════════ */
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Keyboard, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';

const VIPPage = lazy(() => import('./VIPPage').then(m => ({ default: m.VIPPage })));
const AssistKeyboardPage = lazy(() => import('./AssistKeyboardPage').then(m => ({ default: m.AssistKeyboardPage })));

const tierLabel: Record<string, string> = { lite: 'FFLite', pro: 'FFPro', proplus: 'FFPro+' };

export function OrderPage() {
  const user = useUser() as any;
  const [subTab, setSubTab] = useState<0 | 1>(0);
  const [showVIP, setShowVIP] = useState(false);
  const [showKB, setShowKB] = useState(false);

  const isVipActive = !!user?.isVip && (user?.isPro?.() ?? false);
  const currentTier = isVipActive ? tierLabel[user?.subTier as string] ?? 'VIP' : null;
  const hasKbVip = !!user?.kbVip || (isVipActive && user?.subTier === 'proplus');

  /* ── 外层页面滚动容器 ── */
  return (
    <div className="flex flex-col h-full" style={{ background: '#2b2535' }}>
      {/* ─── 顶栏 ─── */}
      <div style={{ padding: '16px 20px 0', position: 'relative' }}>
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 180,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,215,61,0.10) 0%, rgba(155,126,222,0.08) 30%, transparent 100%)',
        }} />
        <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: 14, marginBottom: 4, position: 'relative' }}>会员中心</p>
        <h1 style={{ color: '#f5efe8', fontSize: 28, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.14, margin: 0, marginBottom: 16, position: 'relative' }}>订购</h1>

        {/* ─── 子Tab ─── */}
        <div className="flex gap-1 mb-5 p-1" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
          {[
            { label: '会员订阅', icon: <Crown size={14} /> },
            { label: '键盘会员', icon: <Keyboard size={14} /> },
          ].map((t, i) => (
            <motion.button key={t.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5"
              style={{
                borderRadius: 10,
                background: subTab === i ? 'rgba(155,126,222,0.2)' : 'transparent',
                border: subTab === i ? '1px solid rgba(155,126,222,0.3)' : '1px solid transparent',
                color: subTab === i ? '#B39DDB' : 'rgba(245,239,232,0.5)',
              }}
              whileTap={{ scale: 0.97 }} onClick={() => setSubTab(i as 0 | 1)}>
              {t.icon}
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── 主内容区（滚动） ─── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '0 20px 20px' }}>
        {subTab === 0 && (
          <FFMemberCard
            isVipActive={isVipActive}
            currentTier={currentTier}
            expireAt={user?.subExpireAt}
            onOpen={() => setShowVIP(true)}
          />
        )}
        {subTab === 1 && (
          <KbMemberCard
            hasKbVip={hasKbVip}
            isProPlus={isVipActive && user?.subTier === 'proplus'}
            kbExpireAt={user?.kbExpireAt}
            onOpen={() => setShowKB(true)}
          />
        )}
      </div>

      {/* ─── 弹层：VIP 会员订阅页 ─── */}
      <AnimatePresence>
        {showVIP && (
          <Suspense fallback={null}>
            <VIPPage onClose={() => setShowVIP(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* ─── 弹层：键盘会员页 ─── */}
      <AnimatePresence>
        {showKB && (
          <Suspense fallback={null}>
            <AssistKeyboardPage onClose={() => setShowKB(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  FFMembership 卡片
 * ═══════════════════════════════════════════════════════════════ */
function FFMemberCard({ isVipActive, currentTier, expireAt, onOpen }: {
  isVipActive: boolean; currentTier: string | null; expireAt?: number; onOpen: () => void;
}) {
  const expireStr = expireAt ? new Date(expireAt).toISOString().slice(0, 10) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero 卡 */}
      <div className="p-5 mb-4 relative overflow-hidden" style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg, #4a3d6b 0%, #2d2545 50%, #1e1a30 100%)',
        border: '1px solid rgba(255,215,61,0.15)',
      }}>
        <div className="absolute top-0 right-0 pointer-events-none" style={{
          width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(255,215,61,0.18), transparent 70%)',
        }} />
        <div className="flex items-center gap-2 mb-3">
          <Crown size={16} color="#FFD93D" />
          <span style={{ color: '#FFD93D', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>FOXSAY MEMBER</span>
        </div>
        <h2 style={{ color: '#f5efe8', fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
          {isVipActive ? `当前会员 · ${currentTier}` : '开通 FoxSay 会员'}
        </h2>
        <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          {isVipActive
            ? `有效期至 ${expireStr ?? '—'}，点击下方管理续费或升级`
            : '解锁 AI 陪练、深度诊断、专属剧情、无限话术推荐等全部权益'}
        </p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 py-3 relative"
          style={{
            background: 'linear-gradient(135deg, #FFD93D, #FFB300)',
            borderRadius: 14,
            color: '#1E1E2E', fontSize: 15, fontWeight: 700,
            boxShadow: '0 6px 20px rgba(255,215,61,0.25)',
          }}>
          <Crown size={16} />
          {isVipActive ? '管理会员 / 升级续费' : '查看套餐 · 立即开通'}
        </motion.button>
      </div>

      {/* 权益速览 */}
      <div className="mb-3">
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 10 }}>核心权益</span>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { t: 'AI 陪练', d: '无限次对话训练' },
            { t: '深度诊断', d: '周报 + 雷达图' },
            { t: '剧情解锁', d: '全章节无门槛' },
            { t: '话术推荐', d: '每日百次额度' },
            { t: '专属徽章', d: '社区身份展示' },
            { t: '优先响应', d: '导师答疑免排队' },
          ].map(x => (
            <div key={x.t} className="p-3" style={{ background: '#352f45', borderRadius: 12, border: '1px solid rgba(155,126,222,0.1)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Check size={12} color="#FFD93D" />
                <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{x.t}</span>
              </div>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 档位说明 */}
      <div className="p-4" style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(155,126,222,0.1)' }}>
        <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 10 }}>三档可选</span>
        {[
          { k: 'FFLite', c: '#A78BFA', d: '入门尝鲜，基础权益' },
          { k: 'FFPro', c: '#F0AD4E', d: '主流推荐，完整训练' },
          { k: 'FFPro+', c: '#F08DA0', d: '全部权益 · 含键盘' },
        ].map(t => (
          <div key={t.k} className="flex items-center gap-3 py-2">
            <span style={{
              display: 'inline-block', minWidth: 70,
              color: t.c, fontSize: 13, fontWeight: 700,
              padding: '2px 10px',
              background: `${t.c}20`, borderRadius: 8, textAlign: 'center',
            }}>{t.k}</span>
            <span style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12 }}>{t.d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  键盘会员卡片
 * ═══════════════════════════════════════════════════════════════ */
function KbMemberCard({ hasKbVip, isProPlus, kbExpireAt, onOpen }: {
  hasKbVip: boolean; isProPlus: boolean; kbExpireAt?: number; onOpen: () => void;
}) {
  const expireStr = kbExpireAt ? new Date(kbExpireAt).toISOString().slice(0, 10) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Hero 卡 */}
      <div className="p-5 mb-4 relative overflow-hidden" style={{
        borderRadius: 20,
        background: 'linear-gradient(135deg, #1f3a4d 0%, #1a2a38 50%, #141f2a 100%)',
        border: '1px solid rgba(78,205,196,0.2)',
      }}>
        <div className="absolute top-0 right-0 pointer-events-none" style={{
          width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(78,205,196,0.18), transparent 70%)',
        }} />
        <div className="flex items-center gap-2 mb-3">
          <Keyboard size={16} color="#4ECDC4" />
          <span style={{ color: '#4ECDC4', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>AI 辅助键盘</span>
        </div>
        <h2 style={{ color: '#f5efe8', fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
          {isProPlus ? '键盘已随 FFPro+ 解锁' : hasKbVip ? '键盘会员生效中' : '开通 AI 辅助键盘'}
        </h2>
        <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          {isProPlus
            ? '您已订阅 FFPro+，键盘所有功能已自动开启'
            : hasKbVip
              ? `有效期至 ${expireStr ?? '—'}，系统键盘内继续使用全部功能`
              : '在任何 App 的聊天框内调用 AI 生成回复、追问、改语气、破冰'}
        </p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 py-3"
          style={{
            background: 'linear-gradient(135deg, #4ECDC4, #26A69A)',
            borderRadius: 14,
            color: '#fff', fontSize: 15, fontWeight: 700,
            boxShadow: '0 6px 20px rgba(78,205,196,0.25)',
          }}>
          <Keyboard size={16} />
          {hasKbVip ? '查看详情 / 管理' : '查看套餐 · 立即开通'}
        </motion.button>
      </div>

      {/* 功能速览 */}
      <div className="mb-3">
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 10 }}>键盘能做什么</span>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { t: '一键生成', d: '输入框直接出回复' },
            { t: '智能追问', d: '对方说"随便"也不冷场' },
            { t: '情绪改写', d: '把生硬文案变温柔' },
            { t: '场景模板', d: '破冰 / 道歉 / 暧昧' },
            { t: '搭档语气', d: '用角色卡人设发消息' },
            { t: '全 App 可用', d: '微信 / 小红书 / Soul' },
          ].map(x => (
            <div key={x.t} className="p-3" style={{ background: '#352f45', borderRadius: 12, border: '1px solid rgba(78,205,196,0.1)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Check size={12} color="#4ECDC4" />
                <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{x.t}</span>
              </div>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 购买说明 */}
      <div className="p-4" style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(78,205,196,0.1)' }}>
        <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>两种开通方式</span>
        <div className="flex items-start gap-2 py-2">
          <span style={{ fontSize: 14 }}>⌨️</span>
          <div>
            <span style={{ color: '#f5efe8', fontSize: 12.5, fontWeight: 600 }}>单独购买键盘会员</span>
            <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11.5, marginTop: 2, lineHeight: 1.5 }}>只想用键盘功能，不订阅主会员</p>
          </div>
        </div>
        <div className="flex items-start gap-2 py-2">
          <span style={{ fontSize: 14 }}>👑</span>
          <div>
            <span style={{ color: '#f5efe8', fontSize: 12.5, fontWeight: 600 }}>订阅 FFPro+</span>
            <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11.5, marginTop: 2, lineHeight: 1.5 }}>主会员最高档，自动包含键盘全部功能</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
