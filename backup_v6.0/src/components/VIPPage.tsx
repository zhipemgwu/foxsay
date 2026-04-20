import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Minus, Crown } from 'lucide-react';
import { IcChat, IcChart, IcHeart, IcSparkle } from './CuteIcons';

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
    label: '体验版',
    colLabel: 'Lite',
    icon: '🌱',
    primary: '#7B61C1',
    gradient: 'linear-gradient(135deg, #A78BFA, #7B61C1)',
    pageBg: 'linear-gradient(180deg, #EBE3FA 0%, #F4F1FA 26%, #FAFAFA 62%)',
    colTint: 'rgba(123,97,193,0.07)',
    colBorder: '#C4B0E8',
  },
  {
    key: 'pro',
    label: '进阶版',
    colLabel: 'Pro',
    icon: '🔥',
    primary: '#D4851A',
    gradient: 'linear-gradient(135deg, #F0AD4E, #D4851A)',
    pageBg: 'linear-gradient(180deg, #FEF0DC 0%, #FFF8F0 26%, #FAFAFA 62%)',
    colTint: 'rgba(212,133,26,0.07)',
    colBorder: '#F0C06A',
  },
  {
    key: 'proplus',
    label: '大师版',
    colLabel: 'Pro+',
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
    ],
  },
];

/* ─── 定价 ─── */
const pricing = {
  lite: [
    { months: 12, price: 68, original: 96, discount: 29, daily: 0.19 },
    { months: 6, price: 38, original: 48, discount: 21, daily: 0.21 },
    { months: 3, price: 22, original: 24, discount: 8, daily: 0.24 },
  ],
  pro: [
    { months: 12, price: 128, original: 192, discount: 33, daily: 0.35 },
    { months: 6, price: 78, original: 96, discount: 19, daily: 0.43 },
    { months: 3, price: 45, original: 48, discount: 6, daily: 0.50 },
  ],
  proplus: [
    { months: 12, price: 198, original: 288, discount: 31, daily: 0.54 },
    { months: 6, price: 118, original: 144, discount: 18, daily: 0.66 },
    { months: 3, price: 68, original: 72, discount: 6, daily: 0.76 },
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
  const [activeTier, setActiveTier] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const tier = tiers[activeTier];
  const plans = pricing[tier.key as keyof typeof pricing];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col"
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
          <h1 style={{ color: '#1E1E2E', fontSize: 18, fontWeight: 700 }}>会员方案</h1>
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
                whileTap={{ scale: 0.97 }}
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
          <div className="flex gap-2.5 mb-4">
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
                    padding: '16px 6px 12px',
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPlan(pi)}
                >
                  {/* 折扣标签 */}
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
                  <div style={{ color: '#9B9BAA', fontSize: 12, marginBottom: 4 }}>
                    {p.months}个月
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
                        fontSize: 26,
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
                    }}
                  >
                    ¥{p.original}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* 订阅按钮 */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3.5"
            style={{
              borderRadius: 14,
              background: tier.gradient,
              boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Crown size={16} color="#fff" strokeWidth={2.5} />
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>立即订阅</span>
            <span
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 12,
                fontWeight: 500,
                marginLeft: 4,
              }}
            >
              ¥{plans[selectedPlan].daily}/天
            </span>
          </motion.button>

          {/* 协议 */}
          <p className="text-center mt-3" style={{ color: '#B8B8C4', fontSize: 10 }}>
            使用条款 | 隐私政策 | 会员条款（含自动续费协议）
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
