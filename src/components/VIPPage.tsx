import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Minus, Crown } from 'lucide-react';
import { IcChat, IcChart, IcHeart, IcSparkle } from './CuteIcons';
import { useUser } from '../context/UserContext';

/*
 * ─── 高级会员色系 ───
 * 参考 MiraiMind 等头部产品的 VIP 页面设计
 * 原则：浅色底 + 白卡 + 档位色只做点缀 → 干净通透高级
 *
 * Lite  鸢尾紫 — 内敛、沉稳
 * Pro   琥珀橘 — 温暖、进取
 * Pro+  玫瑰粉 — 浪漫、尊享
 */
const tiers = [
  {
    key: 'lite',
    label: 'FFLite',
    colLabel: 'FFLite',
    icon: '🌱',
    primary: '#7B61C1',
    gradient: 'linear-gradient(135deg, #A78BFA, #7B61C1)',
    pageBg: 'linear-gradient(180deg, #EBE3FA 0%, #F4F1FA 26%, #FAFAFA 62%)',
    colTint: 'rgba(123,97,193,0.07)',
    colBorder: '#C4B0E8',
  },
  {
    key: 'pro',
    label: 'FFPro',
    colLabel: 'FFPro',
    icon: '🔥',
    primary: '#D4851A',
    gradient: 'linear-gradient(135deg, #F0AD4E, #D4851A)',
    pageBg: 'linear-gradient(180deg, #FEF0DC 0%, #FFF8F0 26%, #FAFAFA 62%)',
    colTint: 'rgba(212,133,26,0.07)',
    colBorder: '#F0C06A',
  },
  {
    key: 'proplus',
    label: 'FFPro+',
    colLabel: 'FFPro+',
    icon: '👑',
    primary: '#C84D7A',
    gradient: 'linear-gradient(135deg, #F08DA0, #C84D7A)',
    pageBg: 'linear-gradient(180deg, #FCE5EF 0%, #FFF3F7 26%, #FAFAFA 62%)',
    colTint: 'rgba(200,77,122,0.07)',
    colBorder: '#F0A0BB',
  },
];

/* ─── 权益模块数据 ─── */
const benefitModules = [
  {
    title: 'AI 陪练',
    icon: <IcChat size={14} color="#fff" />,
    items: [
      { label: '每日对话次数', lite: '10次', pro: '50次', proplus: '无限' },
      { label: '解锁训练场景', lite: '3个', pro: '10个', proplus: '全部' },
      { label: '微练习全量题库（已并入会员）', lite: true, pro: true, proplus: true },
      { label: '微练习模拟考按分类定制', lite: false, pro: true, proplus: true },
      { label: 'AI 对话记忆', lite: '短期', pro: '长期', proplus: '永久' },
      { label: '语音对话模式', lite: false, pro: false, proplus: true },
    ],
  },
  {
    title: '诊断分析',
    icon: <IcChart size={14} color="#fff" />,
    items: [
      { label: '每周能力报告', lite: '基础', pro: '详细', proplus: '深度' },
      { label: '恋爱雷达图', lite: false, pro: true, proplus: true },
      { label: '对话回放分析', lite: false, pro: false, proplus: true },
      { label: '个性化AI建议', lite: false, pro: true, proplus: true },
    ],
  },
  {
    title: '社区特权',
    icon: <IcHeart size={14} color="#fff" />,
    items: [
      { label: '专属头像框', lite: false, pro: true, proplus: true },
      { label: '会员身份徽章', lite: true, pro: true, proplus: true },
      { label: '导师优先回复', lite: false, pro: true, proplus: true },
      { label: '内容优先推荐', lite: false, pro: false, proplus: true },
    ],
  },
  {
    title: '专属体验',
    icon: <IcSparkle size={14} color="#fff" />,
    items: [
      { label: '无广告体验', lite: true, pro: true, proplus: true },
      { label: '自定义AI人设', lite: false, pro: true, proplus: true },
      { label: '快速响应免排队', lite: false, pro: true, proplus: true },
      { label: '话术推荐次数', lite: '10次/日', pro: '50次/日', proplus: '100次/日' },
      { label: 'AI 辅助键盘', lite: false, pro: false, proplus: true },
    ],
  },
];

/* ─── 定价：月卡 / 3月 / 6月 / 12月 ─── */
const pricing = {
  lite: [
    { months: 12, price: 68, original: 96, discount: 29, daily: 0.19 },
    { months: 6, price: 38, original: 48, discount: 21, daily: 0.21 },
    { months: 3, price: 22, original: 24, discount: 8, daily: 0.24 },
    { months: 1, price: 9, original: 9, discount: 0, daily: 0.30 },
  ],
  pro: [
    { months: 12, price: 128, original: 192, discount: 33, daily: 0.35 },
    { months: 6, price: 78, original: 96, discount: 19, daily: 0.43 },
    { months: 3, price: 45, original: 48, discount: 6, daily: 0.50 },
    { months: 1, price: 18, original: 18, discount: 0, daily: 0.60 },
  ],
  proplus: [
    { months: 12, price: 198, original: 288, discount: 31, daily: 0.54 },
    { months: 6, price: 118, original: 144, discount: 18, daily: 0.66 },
    { months: 3, price: 68, original: 72, discount: 6, daily: 0.76 },
    { months: 1, price: 28, original: 28, discount: 0, daily: 0.93 },
  ],
};

/* ─── 权益单元格（浅色底专用） ─── */
function BenefitCell({
  value,
  isActive,
  tier,
}: {
  value: boolean | string;
  isActive: boolean;
  tier: typeof tiers[0];
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check size={15} color={isActive ? tier.primary : '#CCCCD8'} strokeWidth={2.5} />
    ) : (
      <Minus size={13} color="#E2E2EA" strokeWidth={2} />
    );
  }
  return (
    <span
      style={{
        color: isActive ? tier.primary : '#9B9BAA',
        fontSize: 12,
        fontWeight: isActive ? 700 : 400,
      }}
    >
      {value}
    </span>
  );
}

/* ─── VIPPage ─── */
export function VIPPage({ onClose }: { onClose: () => void }) {
  const user = useUser() as any;
  const currentTierIdx = user.isPro?.() ? tiers.findIndex(t => t.key === user.subTier) : -1;
  const [activeTier, setActiveTier] = useState(() => {
    // 已订阅用户默认选中当前等级，方便看到更高级选项
    if (currentTierIdx >= 0) return currentTierIdx;
    return 1; // 默认 Pro
  });
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [paying, setPaying] = useState(false);
  const tier = tiers[activeTier];
  const plans = pricing[tier.key as keyof typeof pricing];

  const handleSubscribe = () => {
    if (paying) return;
    setPaying(true);
    const months = plans[selectedPlan].months;
    const expireAt = Date.now() + months * 30 * 24 * 60 * 60 * 1000;
    setTimeout(() => {
      user.updateUser?.({
        isVip: true,
        subTier: tier.key,                 // 'lite' | 'pro' | 'proplus'
        subPlan: months === 1 ? 'monthly' : months === 3 ? 'quarter' : months === 6 ? 'half' : 'year',
        subExpireAt: expireAt,
        subAutoRenew: true,
      });
      setPaying(false);
      onClose();
    }, 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog" aria-modal="true" aria-label="VIP会员"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />

      {/* 面板 */}
      <motion.div
        className="relative mt-8 mx-auto w-full overflow-hidden flex flex-col"
        style={{
          maxWidth: 430,
          borderRadius: '24px 24px 0 0',
          maxHeight: 'calc(100vh - 32px)',
          flex: 1,
          background: '#FAFAFA',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* 档位氛围渐变（浅色系） */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{ background: tier.pageBg }}
        />

        {/* ─── 顶栏 ─── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 relative z-10">
          <h1 style={{ color: '#1E1E2E', fontSize: 18, fontWeight: 700 }}>{currentTierIdx >= 0 ? '会员升级 / 续费' : '会员方案'}</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.05)' }}
          >
            <X size={18} color="#999" />
          </motion.button>
        </div>

        {/* ─── Tab 栏（白底，选中态为渐变药丸） ─── */}
        <div className="px-5 pb-4 relative z-10">
          <div
            className="flex p-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.88)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {tiers.map((t, i) => (
              <motion.button
                key={t.key}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full"
                style={{
                  background: activeTier === i ? t.gradient : 'transparent',
                  boxShadow: activeTier === i ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTier(i);
                  setSelectedPlan(0);
                }}
              >
                {activeTier === i && <span style={{ fontSize: 14 }}>{t.icon}</span>}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: activeTier === i ? 700 : 500,
                    color: activeTier === i ? '#fff' : '#9B9BAA',
                  }}
                >
                  {t.label}
                </span>
                {currentTierIdx === i && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 5px',
                    borderRadius: 4, marginLeft: 2,
                    background: activeTier === i ? 'rgba(255,255,255,0.3)' : 'rgba(155,155,170,0.15)',
                    color: activeTier === i ? '#fff' : '#9B9BAA',
                  }}>当前</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ─── 可滚动内容区 ─── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 relative z-10"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {benefitModules.map((mod, mi) => (
            <motion.div
              key={mod.title}
              className="mb-3 relative"
              style={{
                borderRadius: 14,
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                overflow: 'visible',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.05 }}
            >
              {/* 选中列高亮竖条（一整块绝对定位，无缝隙） */}
              {tiers.map((t, ti) => {
                if (activeTier !== ti) return null;
                return (
                  <div
                    key={t.key}
                    className="absolute pointer-events-none"
                    style={{
                      top: 0,
                      bottom: 0,
                      right: 16 + (2 - ti) * 54,
                      width: 54,
                      background: tier.colTint,
                      borderRadius: 10,
                      border: `1.5px solid ${tier.colBorder}`,
                      zIndex: 1,
                    }}
                  />
                );
              })}

              {/* 模块标题行 */}
              <div className="flex items-center px-4 pt-3.5 pb-2.5 relative z-[2]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: tier.gradient }}
                  >
                    {mod.icon}
                  </div>
                  <span style={{ color: '#1E1E2E', fontSize: 14, fontWeight: 700 }}>{mod.title}</span>
                </div>

                {/* 列头 */}
                <div className="flex items-center">
                  {tiers.map((t, ti) => (
                    <div
                      key={t.key}
                      className="flex items-center justify-center"
                      style={{ width: 54, padding: '4px 0' }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: activeTier === ti ? 800 : 500,
                          color: activeTier === ti ? tier.primary : '#B8B8C4',
                        }}
                      >
                        {t.colLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 权益行 */}
              {mod.items.map((item, ii) => (
                <div
                  key={item.label}
                  className="flex items-center relative z-[2]"
                  style={{ padding: '0 16px' }}
                >
                  <span className="flex-1 min-w-0" style={{
                    color: '#5A5A6E',
                    fontSize: 13,
                    padding: '10px 0',
                    borderTop: ii > 0 ? '1px solid #F2F2F6' : 'none',
                  }}>
                    {item.label}
                  </span>
                  <div className="flex items-center">
                    {(['lite', 'pro', 'proplus'] as const).map((k, ti) => (
                      <div
                        key={k}
                        className="flex items-center justify-center"
                        style={{ width: 54, padding: '10px 0' }}
                      >
                        <BenefitCell value={item[k]} isActive={activeTier === ti} tier={tier} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
          <div style={{ height: 4 }} />
        </div>

        {/* ─── 底部定价区 ─── */}
        <div
          className="relative z-10 px-5 pt-3 pb-5"
          style={{ borderTop: '1px solid #F0F0F4', background: 'rgba(250,250,250,0.96)' }}
        >
          {/* 价格卡片 */}
          <div className="flex gap-2 mb-4">
            {plans.map((p, pi) => {
              const sel = selectedPlan === pi;
              return (
                <motion.button
                  key={p.months}
                  className="flex-1 relative overflow-hidden text-center"
                  style={{
                    borderRadius: 14,
                    border: sel ? `2px solid ${tier.primary}` : '2px solid #EBEBF0',
                    background: sel ? tier.colTint : '#fff',
                    padding: '14px 4px 10px',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(pi)}
                >
                  {/* 折扣标签 */}
                  {p.discount > 0 && (
                  <div
                    className="absolute top-0 left-0 px-2 py-0.5"
                    style={{
                      background: sel ? tier.gradient : '#EBEBF0',
                      borderRadius: '13px 0 8px 0',
                      fontSize: 10,
                      fontWeight: 700,
                      color: sel ? '#fff' : '#9B9BAA',
                    }}
                  >
                    优惠{p.discount}%
                  </div>
                  )}
                  <div style={{ color: '#9B9BAA', fontSize: 12, marginBottom: 4 }}>
                    {p.months === 1 ? '月卡' : `${p.months}个月`}
                  </div>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span
                      style={{
                        color: sel ? tier.primary : '#9B9BAA',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      ¥
                    </span>
                    <span
                      style={{
                        color: sel ? tier.primary : '#3A3A4A',
                        fontSize: 22,
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {p.price}
                    </span>
                  </div>
                  <div
                    style={{
                      color: '#C4C4D0',
                      fontSize: 11,
                      textDecoration: 'line-through',
                      marginTop: 2,
                      visibility: p.original > p.price ? 'visible' : 'hidden',
                    }}
                  >
                    ¥{p.original}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 社会证明 */}
          <div className="mb-5 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {['😊', '🥰', '😎'].map((e, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: 14, background: ['#FFE0B2', '#F8BBD0', '#B3E5FC'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: '2px solid #FAFAFA', position: 'relative', zIndex: 3 - i }}>{e}</div>
                ))}
              </div>
              <span style={{ color: '#3A3A4A', fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: tier.primary, fontWeight: 800 }}>12万+</span> 用户正在练习
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { name: '小鹿', avatar: '🦌', text: '坚持3个月，终于学会了表达情绪！开场白从2分变成8分', days: 96 },
                { name: '星河少年', avatar: '⭐', text: '以前超怂不敢搭话，现在朋友都说我变自信了', days: 45 },
                { name: '暖阳', avatar: '☀️', text: 'AI教练真的很有用，每次练完都有新收获', days: 120 },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3" style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: ['rgba(255,138,128,0.12)', 'rgba(155,126,222,0.12)', 'rgba(255,217,61,0.12)'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{t.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#3A3A4A', fontSize: 12, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ color: '#B8B8C4', fontSize: 10 }}>坚持{t.days}天</span>
                    </div>
                    <p style={{ color: '#6B6B7B', fontSize: 11, lineHeight: 1.5, marginTop: 2 }}>"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 订阅按钮 */}
          {(() => {
            const isCurrentTier = currentTierIdx === activeTier;
            const isDowngrade = currentTierIdx > activeTier;
            const btnLabel = paying ? '支付中…' : isCurrentTier ? '续费当前方案' : isDowngrade ? '无法降级' : currentTierIdx >= 0 ? '升级到 ' + tier.label : '立即订阅';
            return (
              <motion.button
                className="w-full flex items-center justify-center gap-2 py-3.5"
                style={{
                  borderRadius: 14,
                  background: isDowngrade ? '#D0D0D8' : tier.gradient,
                  boxShadow: isDowngrade ? 'none' : '0 8px 24px rgba(0,0,0,0.12)',
                  opacity: paying ? 0.7 : 1,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={isDowngrade ? undefined : handleSubscribe}
                disabled={paying || isDowngrade}
              >
                <Crown size={16} color="#fff" strokeWidth={2.5} />
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{btnLabel}</span>
                {!isDowngrade && (
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>
                    ¥{plans[selectedPlan].daily}/天
                  </span>
                )}
              </motion.button>
            );
          })()}

          {/* 协议 */}
          <p className="text-center mt-3" style={{ color: '#B8B8C4', fontSize: 10 }}>
            使用条款 | 隐私政策 | 会员条款（含自动续费协议）
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
