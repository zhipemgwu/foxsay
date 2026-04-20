import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { IconBubble, IcChat, IcHeart, IcEye, IcChart, IcShield, IcLightbulb, IcTarget, IcBook, IcSparkle, gradients } from './CuteIcons';

const radarData = [
  { label: '开场白', value: 85, icon: <IcChat size={18} color="#fff" />, bg: gradients.coral, barColor: ['#FF8A80', '#FFB199'], trend: 'up' as const, change: 5, tips: '你的开场白越来越自然了，建议多尝试不同风格。' },
  { label: '共情力', value: 92, icon: <IcHeart size={18} color="#fff" />, bg: gradients.rose, barColor: ['#EC407A', '#F48FB1'], trend: 'up' as const, change: 8, tips: '共情力是你的强项！继续保持真诚的倾听态度。' },
  { label: '观察力', value: 78, icon: <IcEye size={18} color="#fff" />, bg: gradients.sky, barColor: ['#4FC3F7', '#81D4FA'], trend: 'flat' as const, change: 0, tips: '试着多注意对方的微表情和肢体语言。' },
  { label: '话题力', value: 88, icon: <IcChart size={18} color="#fff" />, bg: gradients.mint, barColor: ['#4ECDC4', '#80CBC4'], trend: 'up' as const, change: 3, tips: '话题延展不错，建议积累更多有趣的话题库。' },
  { label: '安全感', value: 70, icon: <IcShield size={18} color="#fff" />, bg: gradients.purple, barColor: ['#9B7EDE', '#B39DDB'], trend: 'down' as const, change: -2, tips: '安全感建设需要时间，保持一致性和可靠性。' },
];

const weeklyHistory = [
  { week: '第1周', score: 65 },
  { week: '第2周', score: 70 },
  { week: '第3周', score: 74 },
  { week: '第4周', score: 78 },
  { week: '第5周', score: 82 },
];

const aiSuggestions = [
  { icon: <IcShield size={20} color="#fff" />, bg: gradients.purpleSoft, title: '提升安全感表达', desc: '练习在对话中传递稳定和可靠的感觉', action: '去练习' },
  { icon: <IcEye size={20} color="#fff" />, bg: gradients.skySoft, title: '观察力专项训练', desc: '学习解读微表情和肢体语言', action: '去练习' },
  { icon: <IcBook size={20} color="#fff" />, bg: gradients.mintSoft, title: '话题库扩展', desc: '收集20个有趣的深度话题', action: '查看' },
];

export function DiagnosticPage() {
  const [selectedSkill, setSelectedSkill] = useState<typeof radarData[0] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const overallScore = 82;
  const prevScore = 78;

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'flat' }) => {
    if (trend === 'up') return <ArrowUp size={10} color="#4ECDC4" />;
    if (trend === 'down') return <ArrowDown size={10} color="#FF8A80" />;
    return <Minus size={10} color="rgba(245,239,232,0.55)" />;
  };

  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.1) 0%, rgba(155,126,222,0.10) 30%, transparent 100%)',
        }} />

        <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '14px', marginBottom: 4 }}>能力诊断</p>
        <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0, marginBottom: 24 }}>你的恋爱力</h1>

        {/* Overall score */}
        <motion.div className="p-[1px] mb-5" style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,138,128,0.18), rgba(155,126,222,0.12))' }}
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
          <div className="p-6 flex items-center justify-between" style={{ background: '#352f45', borderRadius: 15 }}>
            <div>
              <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: '14px', marginBottom: 4 }}>综合评分</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: 'rgba(78,205,196,0.15)', borderRadius: 6 }}>
                  <ArrowUp size={12} color="#4ECDC4" />
                  <span style={{ color: '#4ECDC4', fontSize: '13px', fontWeight: 600 }}>+{overallScore - prevScore}</span>
                </div>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '13px' }}>较上周</span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '14px', marginTop: 4 }}>
                超过 <span style={{ color: '#FF8A80', fontWeight: 600 }}>76%</span> 的用户
              </p>
              <motion.button className="px-3 py-1 flex items-center gap-1 mt-3"
                style={{ background: 'rgba(255,138,128,0.1)', borderRadius: 980, color: '#FF8A80', fontSize: '11px', fontWeight: 600 }}
                whileTap={{ scale: 0.95 }} onClick={() => setShowHistory(true)}>
                <IcChart size={10} color="#FF8A80" /> 查看趋势
              </motion.button>
            </div>
            {/* Arc Progress Ring */}
            <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(245,239,232,0.08)" strokeWidth="8" />
                <motion.circle cx="55" cy="55" r="46" fill="none"
                  stroke="url(#scoreArcGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  style={{ transformOrigin: '55px 55px', rotate: '-90deg' }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - overallScore / 100) }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="scoreArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF8A80" />
                    <stop offset="100%" stopColor="#FFB199" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ color: '#f5efe8', fontSize: '32px', fontWeight: 700, lineHeight: 1, textShadow: '0 0 20px rgba(255,138,128,0.3)' }}>{overallScore}</span>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', marginTop: 2 }}>/ 100</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Suggestions */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <IconBubble size={24} bg={gradients.golden}><IcLightbulb size={12} color="#fff" /></IconBubble>
            <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600 }}>AI 提升建议</span>
          </div>
          <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {aiSuggestions.map((s, i) => (
              <motion.button key={s.title} className="flex-shrink-0 p-4 text-left"
                style={{ background: '#453a60', borderRadius: 14, width: 200, scrollSnapAlign: 'start', border: '1px solid rgba(245,239,232,0.08)' }}
                initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}>
                <IconBubble size={40} bg={s.bg}>{s.icon}</IconBubble>
                <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600, marginBottom: 4, marginTop: 10 }}>{s.title}</p>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px', lineHeight: 1.4, marginBottom: 10 }}>{s.desc}</p>
                <span style={{ color: '#FF8A80', fontSize: '12px', fontWeight: 600 }}>{s.action} →</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600 }}>能力分项</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>点击查看详情</span>
        </div>

        <div className="flex flex-col gap-3">
          {radarData.map((skill, idx) => (
            <motion.button key={skill.label} className="w-full text-left"
              style={{
                borderRadius: 16,
                border: skill.trend === 'up' ? '1px solid rgba(78,205,196,0.15)'
                  : skill.trend === 'down' ? '1px solid rgba(255,138,128,0.15)' : '1px solid rgba(245,239,232,0.06)',
              }}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileTap={{ scale: 0.98 }} onClick={() => setSelectedSkill(skill)}>
              <div className="p-4" style={{ background: `linear-gradient(135deg, ${skill.barColor[0]}08, #453a60)`, borderRadius: 16 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <IconBubble size={38} bg={skill.bg} className="opacity-[0.85]">{skill.icon}</IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{skill.label}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendIcon trend={skill.trend} />
                        <span style={{ color: skill.trend === 'up' ? '#4ECDC4' : skill.trend === 'down' ? '#FF8A80' : 'rgba(245,239,232,0.38)', fontSize: '11px', fontWeight: 600 }}>
                          {skill.change > 0 ? `+${skill.change}` : skill.change === 0 ? '持平' : skill.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#FF8A80', fontSize: '17px', fontWeight: 600 }}>{skill.value}</span>
                    <ChevronRight size={14} color="rgba(245,239,232,0.55)" />
                  </div>
                </div>
                <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.10)' }}>
                  <motion.div className="h-full" style={{ background: `linear-gradient(90deg, ${skill.barColor[0]}, ${skill.barColor[1]})`, borderRadius: 2 }} initial={{ width: '0%' }} animate={{ width: `${skill.value}%` }} transition={{ duration: 0.8, delay: 0.2 + idx * 0.08 }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelectedSkill(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <IconBubble size={48} bg={selectedSkill.bg}>{selectedSkill.icon}</IconBubble>
                    <div>
                      <h2 style={{ color: '#f5efe8', fontSize: '19px', fontWeight: 600 }}>{selectedSkill.label}</h2>
                      <span style={{ color: '#FF8A80', fontSize: '28px', fontWeight: 700 }}>{selectedSkill.value}<span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '14px' }}>/100</span></span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedSkill(null)}>
                    <X size={22} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>
                <div className="p-4 mb-4" style={{ background: '#574d72', borderRadius: 12 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconBubble size={24} bg={gradients.golden}><IcLightbulb size={12} color="#fff" /></IconBubble>
                    <span style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600 }}>AI 教练建议</span>
                  </div>
                  <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: '13px', lineHeight: 1.5 }}>{selectedSkill.tips}</p>
                </div>
                <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                  style={{ background: gradients.coral, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }} onClick={() => setSelectedSkill(null)}>
                  <IcBook size={16} color="#fff" /> 开始专项练习
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowHistory(false)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <IconBubble size={28} bg={gradients.coral}><IcChart size={14} color="#fff" /></IconBubble>
                    <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>成长趋势</span>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowHistory(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>
                <div className="flex items-end justify-between gap-3" style={{ height: 140 }}>
                  {weeklyHistory.map((w, i) => (
                    <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                      <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '11px', fontWeight: 600 }}>{w.score}</span>
                      <motion.div className="w-full" style={{
                        background: i === weeklyHistory.length - 1 ? gradients.coral : '#574d72',
                        borderRadius: 8,
                      }} initial={{ height: 0 }} animate={{ height: `${(w.score / 100) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} />
                      <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '10px' }}>{w.week}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 flex items-center gap-3" style={{ background: '#574d72', borderRadius: 12 }}>
                  <IconBubble size={36} bg={gradients.mint}><IcChart size={16} color="#fff" /></IconBubble>
                  <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', lineHeight: 1.5 }}>
                    你的综合评分在过去5周内提升了 <span style={{ color: '#4ECDC4', fontWeight: 600 }}>17分</span>，继续加油！
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}