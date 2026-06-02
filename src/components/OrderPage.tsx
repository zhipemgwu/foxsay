import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Crown, Gem, MessageCircleHeart, ShieldCheck, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

const VIPPage = lazy(() => import('./VIPPage').then(m => ({ default: m.VIPPage })));

const tierLabel: Record<string, string> = { lite: 'FFLite', pro: 'FFPro', proplus: 'FFPro+' };

export function OrderPage() {
  const user = useUser() as any;
  const [showVIP, setShowVIP] = useState(false);
  const isVipActive = !!user?.isVip && (user?.isPro?.() ?? false);
  const currentTier = isVipActive ? tierLabel[user?.subTier as string] ?? '会员' : null;
  const expireStr = user?.subExpireAt ? new Date(user.subExpireAt).toISOString().slice(0, 10) : null;

  return (
    <div className="flex flex-col h-full" style={{ background: '#2b2535' }}>
      <div style={{ padding: '18px 20px 0', position: 'relative' }}>
        <div style={ambientStyle} />
        <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: 14, marginBottom: 4, position: 'relative' }}>会员中心</p>
        <h1 style={{ color: '#f5efe8', fontSize: 28, fontWeight: 850, letterSpacing: 0.2, lineHeight: 1.14, margin: 0, marginBottom: 16, position: 'relative' }}>FoxSay 会员</h1>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '0 20px 22px' }}>
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <div style={heroCardStyle}>
            <div style={{ position: 'absolute', right: -28, top: -34, width: 150, height: 150, borderRadius: 999, background: 'rgba(255,217,61,0.14)' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Crown size={17} color="#FFD93D" />
              <span style={{ color: '#FFD93D', fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>FOXSAY MEMBER</span>
            </div>
            <h2 style={{ position: 'relative', color: '#f5efe8', fontSize: 22, fontWeight: 900, lineHeight: 1.3, marginBottom: 8 }}>
              {isVipActive ? `当前会员 · ${currentTier}` : '开通 FoxSay 会员'}
            </h2>
            <p style={{ position: 'relative', color: 'rgba(245,239,232,0.68)', fontSize: 13, lineHeight: 1.6, marginBottom: 17 }}>
              {isVipActive
                ? `有效期至 ${expireStr ?? '未知'}，可在这里升级或续费会员权益。`
                : '解锁更多真实案例副本、角色记忆、回复建议、深度复盘和专属剧情。'}
            </p>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setShowVIP(true)} style={primaryButtonStyle}>
              <Crown size={16} />
              {isVipActive ? '管理会员 / 升级续费' : '查看套餐 · 立即开通'}
            </motion.button>
          </div>

          <div style={{ marginBottom: 14 }}>
            <span style={sectionLabelStyle}>核心权益</span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: <MessageCircleHeart size={17} />, title: 'AI 陪练', desc: '更多对话训练次数' },
                { icon: <ShieldCheck size={17} />, title: '深度复盘', desc: '通关后查看关键问题' },
                { icon: <Sparkles size={17} />, title: '角色剧情', desc: '解锁高级副本与记忆' },
                { icon: <Gem size={17} />, title: '建议额度', desc: '更多尼克大叔回复建议' },
              ].map(item => (
                <div key={item.title} style={benefitCardStyle}>
                  <div style={{ color: '#FFD93D', marginBottom: 7 }}>{item.icon}</div>
                  <div style={{ color: '#f5efe8', fontSize: 14, fontWeight: 850 }}>{item.title}</div>
                  <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11.5, marginTop: 4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={tierCardStyle}>
            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 850, display: 'block', marginBottom: 10 }}>会员档位</span>
            {[
              { k: 'FFLite', c: '#A78BFA', d: '基础权益，适合轻度训练' },
              { k: 'FFPro', c: '#F0AD4E', d: '主流推荐，完整训练体验' },
              { k: 'FFPro+', c: '#F08DA0', d: '全部权益，最高记忆与建议额度' },
            ].map(tier => (
              <div key={tier.k} style={tierRowStyle}>
                <span style={{ ...tierBadgeStyle, color: tier.c, background: `${tier.c}20` }}>{tier.k}</span>
                <span style={{ color: 'rgba(245,239,232,0.72)', fontSize: 12.5 }}>{tier.d}</span>
              </div>
            ))}
          </div>

          <div style={noteCardStyle}>
            <Check size={14} color="#07c160" />
            <span>训练营里的高级内容会跳转到这里，订购逻辑保持原来的会员流程。</span>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showVIP && (
          <Suspense fallback={null}>
            <VIPPage onClose={() => setShowVIP(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

const ambientStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 180,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,215,61,0.10) 0%, rgba(155,126,222,0.09) 32%, transparent 100%)',
};

const heroCardStyle: React.CSSProperties = {
  borderRadius: 20,
  background: 'linear-gradient(135deg, #4a3d6b 0%, #2d2545 48%, #1e1a30 100%)',
  border: '1px solid rgba(255,215,61,0.15)',
  padding: 20,
  marginBottom: 16,
  position: 'relative',
  overflow: 'hidden',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  border: 0,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #FFD93D, #FFB300)',
  color: '#1E1E2E',
  boxShadow: '0 6px 20px rgba(255,215,61,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  padding: '12px 0',
  fontSize: 15,
  fontWeight: 850,
  position: 'relative',
};

const sectionLabelStyle: React.CSSProperties = {
  color: '#f5efe8',
  fontSize: 14,
  fontWeight: 850,
  display: 'block',
  marginBottom: 10,
};

const benefitCardStyle: React.CSSProperties = {
  background: '#352f45',
  borderRadius: 12,
  border: '1px solid rgba(155,126,222,0.1)',
  padding: 13,
  minHeight: 94,
};

const tierCardStyle: React.CSSProperties = {
  background: '#352f45',
  borderRadius: 14,
  border: '1px solid rgba(155,126,222,0.1)',
  padding: 14,
  marginBottom: 12,
};

const tierRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0',
};

const tierBadgeStyle: React.CSSProperties = {
  minWidth: 72,
  borderRadius: 8,
  textAlign: 'center',
  padding: '4px 10px',
  fontSize: 13,
  fontWeight: 850,
};

const noteCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: '12px 13px',
  color: 'rgba(245,239,232,0.62)',
  fontSize: 12.5,
  lineHeight: 1.6,
  display: 'flex',
  gap: 8,
  alignItems: 'flex-start',
};
