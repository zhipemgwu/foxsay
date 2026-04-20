import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { speciesAbilityHint } from '../data/onboardingChat';

const speciesMap: Record<string, { name: string; emoji: string; camp: string; desc: string; soulQuote: string; color: string; bg: string; avatar: string }> = {
  laosihu:    { name: '老司狐', emoji: '🦊', camp: '🔥 疯狂输出组', desc: '开车从不翻车，就是乘客换得勤', soulQuote: '技术越好越孤独，因为没人敢上你的车',     avatar: '/species/laosihu.jpg',    color: '#c23616', bg: 'linear-gradient(135deg, #c23616 0%, #e84118 100%)' },
  haiwanghu:  { name: '海王狐', emoji: '🦊', camp: '🔥 疯狂输出组', desc: '鱼塘太大管不过来了',           soulQuote: '你不是花心，你只是每条鱼都真心喜欢',     avatar: '/species/haiwanghu.jpg',  color: '#1B9CFC', bg: 'linear-gradient(135deg, #1B9CFC 0%, #25CCF7 100%)' },
  tiantianhu: { name: '舔舔狐', emoji: '🦊', camp: '🔥 疯狂输出组', desc: '你骂我我都说好的亲亲',         soulQuote: '你以为的真诚，在对方眼里叫廉价',         avatar: '/species/tiantianhu.jpg', color: '#FF9FF3', bg: 'linear-gradient(135deg, #FF9FF3 0%, #f368e0 100%)' },
  zhuangsihu: { name: '装死狐', emoji: '🦊', camp: '💀 已读不回组', desc: '恋爱？先让我死一会儿',         soulQuote: '你不是不心动，你只是害怕心动之后的剧情', avatar: '/species/zhuangsihu.jpg', color: '#8c7ae6', bg: 'linear-gradient(135deg, #8c7ae6 0%, #9c88ff 100%)' },
  songsonghu: { name: '怂怂狐', emoji: '🦊', camp: '💀 已读不回组', desc: '有感觉就跑，没感觉又来',       soulQuote: '逃避虽然可耻但有用——直到对方不等了',     avatar: '/species/songsonghu.jpg', color: '#40407a', bg: 'linear-gradient(135deg, #40407a 0%, #706fd3 100%)' },
  zhiwuhu:    { name: '植物狐', emoji: '🦊', camp: '💀 已读不回组', desc: '所有恋爱信号对我无效',         soulQuote: '不是收不到信号，是你把天线拔了',         avatar: '/species/zhiwuhu.jpg',    color: '#44bd32', bg: 'linear-gradient(135deg, #44bd32 0%, #4cd137 100%)' },
  xiaochouhu: { name: '小丑狐', emoji: '🦊', camp: '🤡 自我感动组', desc: '以为是主角，其实送了个助攻',   soulQuote: '你感动了自己，但对方只觉得有压力',       avatar: '/species/xiaochouhu.jpg', color: '#0097e6', bg: 'linear-gradient(135deg, #0097e6 0%, #00a8ff 100%)' },
  lianfeihu:  { name: '恋废狐', emoji: '🦊', camp: '🤡 自我感动组', desc: '不谈恋爱会死，谈了更死',       soulQuote: '你缺的不是恋爱，是跟自己好好相处',       avatar: '/species/lianfeihu.jpg',  color: '#718093', bg: 'linear-gradient(135deg, #718093 0%, #7f8fa6 100%)' },
  caonihu:    { name: '草泥狐', emoji: '🦊', camp: '😈 表面无害组', desc: '嘴上全是随便，心里全是你',     soulQuote: '你以为的高冷，其实是不敢先开口',         avatar: '/species/caonihu.jpg',    color: '#e1b12c', bg: 'linear-gradient(135deg, #e1b12c 0%, #fbc531 100%)' },
  lvchahu:    { name: '绿茶狐', emoji: '🦊', camp: '😈 表面无害组', desc: '人畜无害就是我的大招',         soulQuote: '善良是真的，算计也是真的',               avatar: '/species/lvchahu.jpg',    color: '#B33771', bg: 'linear-gradient(135deg, #B33771 0%, #FD7272 100%)' },
  xinjihu:    { name: '心机狐', emoji: '🦊', camp: '😈 表面无害组', desc: '看似佛系聊天，每句都在下钩子', soulQuote: '你不是在聊天，你是在布局',               avatar: '/species/xinjihu.jpg',    color: '#EAB543', bg: 'linear-gradient(135deg, #EAB543 0%, #F8EFBA 100%)' },
};

const abilityLabels: { key: keyof typeof speciesAbilityHint['laosihu']; label: string }[] = [
  { key: 'opener',   label: '开场白' },
  { key: 'empathy',  label: '共情力' },
  { key: 'observe',  label: '观察力' },
  { key: 'topic',    label: '话题力' },
  { key: 'safety',   label: '安全感' },
];

export function SpeciesReveal({
  speciesId,
  matchRate,
  tagsTopN,
  locked = false,
  onEnter,
  onRegister,
  onSkip,
}: {
  speciesId: string;
  matchRate: number;
  tagsTopN: string[];
  locked?: boolean;
  onEnter: () => void;
  onRegister?: () => void;
  onSkip?: () => void;
}) {
  const sp = speciesMap[speciesId] || speciesMap.laosihu;
  const ab = speciesAbilityHint[speciesId] || speciesAbilityHint.laosihu;
  const [phase, setPhase] = useState<'sealing' | 'revealed'>('sealing');

  useEffect(() => {
    const t = setTimeout(() => setPhase('revealed'), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-[70] flex flex-col" style={{ background: '#1f1a28' }}>
      <div className="relative flex flex-col h-full w-full overflow-hidden" style={{ maxWidth: 430, margin: '0 auto' }}>
        {/* 背景光晕 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'revealed' ? 0.5 : 0.15 }}
          transition={{ duration: 1.2 }}
          style={{ background: `radial-gradient(circle at 50% 30%, ${sp.color}66 0%, transparent 60%)` }}
        />

        {/* 揭晓密封动画 */}
        {phase === 'sealing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: 120, height: 120, margin: '0 auto 20px', borderRadius: '50%', border: '2px dashed rgba(255,138,128,0.5)' }}
              />
              <div style={{ color: '#f5efe8', fontSize: 16, fontWeight: 500, opacity: 0.8 }}>
                正在锁定你的恋爱物种…
              </div>
            </motion.div>
          </div>
        )}

        {phase === 'revealed' && (
          <motion.div
            className="relative flex-1 flex flex-col px-6 pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 顶部小标签 */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-3"
            >
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, letterSpacing: '4px' }}>
                你 的 恋 爱 物 种 鉴 定 完 成
              </span>
            </motion.div>

            {/* 物种主卡 — 渐变光球 + 大狐脸 emoji（避免 species jpg 水印遮挡） */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 18 }}
              className="relative mx-auto mb-4 flex items-center justify-center"
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: sp.bg,
                boxShadow: `0 12px 48px ${sp.color}66, 0 0 0 8px rgba(245,239,232,0.04), inset 0 2px 0 rgba(255,255,255,0.18)`,
              }}
            >
              {/* 内层暗色圈做对比 */}
              <div className="absolute inset-3 rounded-full flex items-center justify-center" style={{
                background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 55%), ${sp.bg}`,
                border: '3px solid rgba(31,26,40,0.85)',
              }}>
                <motion.span
                  initial={{ rotate: -10, scale: 0.6 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                  style={{ fontSize: 92, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}
                >
                  🦊
                </motion.span>
              </div>
              {/* 匹配度徽章 */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full"
                style={{ background: '#fff', boxShadow: `0 4px 16px ${sp.color}66` }}
              >
                <span style={{ color: sp.color, fontSize: 13, fontWeight: 800 }}>匹配度 {matchRate}%</span>
              </motion.div>
            </motion.div>

            {/* 物种名 + 阵营 + soul quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-4"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-2" style={{ background: 'rgba(245,239,232,0.06)', border: '1px solid rgba(245,239,232,0.08)' }}>
                <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 11 }}>{sp.camp}</span>
              </div>
              <h1 style={{ color: '#f5efe8', fontSize: 30, fontWeight: 800, letterSpacing: '1px', marginBottom: 6 }}>
                {sp.name}
              </h1>
              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 13, marginBottom: 12 }}>{sp.desc}</p>
              <div className="mx-auto px-4 py-2.5 rounded-xl" style={{ background: 'rgba(245,239,232,0.04)', border: '1px solid rgba(245,239,232,0.06)', maxWidth: 320 }}>
                <p style={{ color: 'rgba(245,239,232,0.75)', fontSize: 12.5, lineHeight: 1.55, fontStyle: 'italic' }}>
                  "{sp.soulQuote}"
                </p>
              </div>
            </motion.div>

            {/* 5维能力条 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="px-1 py-3 rounded-2xl mb-3 relative overflow-hidden"
              style={{ background: 'rgba(245,239,232,0.03)' }}
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>初始能力评估</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>系统已为你定制成长路线</span>
              </div>
              <div className="space-y-1.5 px-3">
                {abilityLabels.map((a, i) => (
                  <div key={a.key} className="flex items-center gap-3">
                    <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, width: 30 }}>{a.label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,239,232,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ab[a.key]}%` }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
                        style={{ height: '100%', background: sp.bg }}
                      />
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, width: 26, textAlign: 'right' }}>{ab[a.key]}</span>
                  </div>
                ))}
              </div>
              {locked && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(31,26,40,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                  <div className="text-center">
                    <span style={{ fontSize: 28 }}>🔒</span>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginTop: 4 }}>注册后解锁能力详情</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 推荐计划 */}
            {tagsTopN.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4 relative overflow-hidden rounded-xl"
              >
                <div className="text-center" style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginBottom: 8 }}>
                  AI 已为你定制以下成长方向：
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {tagsTopN.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full" style={{ background: `${sp.color}20`, border: `1px solid ${sp.color}55`, color: sp.color, fontSize: 11.5, fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
                {locked && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(31,26,40,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>🔒 注册后查看</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="mt-auto pb-8"
            >
              {locked ? (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onRegister}
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      height: 56,
                      borderRadius: 22,
                      background: 'linear-gradient(135deg, #FF8A80 0%, #EC407A 100%)',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      boxShadow: '0 8px 28px rgba(236,64,122,0.4)',
                    }}
                  >
                    注册解锁完整报告 🔓
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onSkip}
                    className="w-full flex items-center justify-center gap-1.5 mt-3"
                    style={{ height: 44, color: 'rgba(245,239,232,0.4)', fontSize: 13, fontWeight: 500 }}
                  >
                    先看看再说 →
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onEnter}
                    className="w-full flex items-center justify-center gap-2"
                    style={{
                      height: 56,
                      borderRadius: 22,
                      background: sp.bg,
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      boxShadow: `0 8px 28px ${sp.color}66`,
                    }}
                  >
                    进入小鹿世界 →
                  </motion.button>
                  <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11, textAlign: 'center', marginTop: 10 }}>
                    可在「我的」页点击「🔬 深度测试」获取更精准的物种报告
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
