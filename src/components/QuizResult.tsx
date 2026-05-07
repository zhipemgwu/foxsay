/**
 * 答题结算页
 */
import { motion } from 'motion/react';
import { RotateCcw, Home } from 'lucide-react';
import type { Question } from '../services/quiz';
import type { MicroGrowthResult } from '../services/microGrowth';

interface Props {
  total: number;
  correct: number;
  wrong: Question[];
  combo: number;
  variant?: 'quiz' | 'themeBattle';
  growth?: MicroGrowthResult | null;
  onRetry: () => void;
  onExit: () => void;
}

export function QuizResult({ total, correct, wrong, combo, variant = 'quiz', growth, onRetry, onExit }: Props) {
  const isThemeBattle = variant === 'themeBattle';
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const tier = pct >= 90 ? 'perfect' : pct >= 70 ? 'good' : pct >= 50 ? 'ok' : 'bad';
  const quizTierData = {
    perfect: { emoji: '🏆', title: '手感绝了！', sub: '这波操作教科书级', color: '#FFD93D' },
    good:    { emoji: '✨', title: '稳中有进',   sub: '再刷两轮就能封神', color: '#4ECDC4' },
    ok:      { emoji: '🌱', title: '在路上',     sub: '错的那几道值得回看', color: '#B8A4E8' },
    bad:     { emoji: '💪', title: '没关系，这才是值得练的',
               sub: '每错一题就长一寸认知', color: '#FF8A80' },
  };
  const battleTierData = {
    perfect: { emoji: '🏆', title: '副本完美通关', sub: '你把这段局面稳稳接住了', color: '#FFD93D' },
    good:    { emoji: '✨', title: '副本成功通关', sub: '关键回合处理得很稳', color: '#4ECDC4' },
    ok:      { emoji: '🌙', title: '副本勉强通关', sub: '有几处风险选择值得回看', color: '#B8A4E8' },
    bad:     { emoji: '🧭', title: '副本暂未通关', sub: '先复盘这段局势，再重演一遍', color: '#FF8A80' },
  };
  const tierData = (isThemeBattle ? battleTierData : quizTierData)[tier];

  return (
    <motion.div
      className="fixed inset-0 z-[1100] flex flex-col overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #2a2238 0%, #1a1524 100%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-10">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.05 }}
          style={{ fontSize: 72, marginBottom: 10 }}
        >{tierData.emoji}</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ color: tierData.color, fontSize: 24, fontWeight: 800, marginBottom: 4 }}
        >{tierData.title}</motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13, marginBottom: 30 }}
        >{tierData.sub}</motion.div>

        {/* 成绩环 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ position: 'relative', width: 180, height: 180, marginBottom: 24 }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="90" cy="90" r="80" fill="none"
              stroke={tierData.color} strokeWidth="10" strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '90px 90px' }}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * 80}` }}
              animate={{ strokeDasharray: `${(pct / 100) * (2 * Math.PI * 80)} ${2 * Math.PI * 80}` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: '#f5efe8', fontSize: 44, fontWeight: 800, lineHeight: 1 }}>{pct}</div>
            <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, marginTop: 4 }}>{isThemeBattle ? '通关指数' : '正确率'}</div>
          </div>
        </motion.div>

        {/* 数据条 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex gap-3"
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Stat label={isThemeBattle ? '有效选择' : '答对'} val={`${correct}/${total}`} color="#4ECDC4" />
          <Stat label={isThemeBattle ? '连续稳住' : '最高连击'} val={`${combo}🔥`} color="#FF8A80" />
          <Stat label={isThemeBattle ? '风险选择' : '错题'} val={`${wrong.length}`} color="#FFB080" />
        </motion.div>

        {growth && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
            style={{
              marginTop: 16, width: '100%', maxWidth: 400,
              padding: '14px 16px', borderRadius: 14,
              background: growth.applied
                ? 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(255,213,160,0.08))'
                : 'rgba(255,255,255,0.04)',
              border: growth.applied ? '1px solid rgba(78,205,196,0.28)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ color: growth.applied ? '#4ECDC4' : 'rgba(245,239,232,0.7)', fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
              {growth.applied ? '五维成长已结算' : '本次未产生五维成长'}
            </div>
            <div style={{ color: '#f5efe8', fontSize: 13, lineHeight: 1.7, fontWeight: 700 }}>{growth.summary}</div>
            <div style={{ color: 'rgba(245,239,232,0.62)', fontSize: 12, lineHeight: 1.7, marginTop: 6 }}>{growth.detail}</div>
          </motion.div>
        )}

        {/* 错题列表预览 */}
        {wrong.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{
              marginTop: 24, width: '100%', maxWidth: 400,
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(255,107,107,0.06)',
              border: '1px solid rgba(255,107,107,0.2)',
            }}
          >
            <div style={{ color: '#FF8A80', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              {isThemeBattle ? '本次风险选择 · 建议重演副本' : '本次错题 · 已自动加入错题本'}
            </div>
            {wrong.slice(0, 3).map(q => (
              <div key={q.id} style={{
                color: 'rgba(245,239,232,0.75)', fontSize: 12, lineHeight: 1.6,
                padding: '6px 0', borderTop: '1px dashed rgba(255,255,255,0.08)',
              }}>• {(isThemeBattle && q.scenario ? q.scenario : q.prompt).length > 50 ? (isThemeBattle && q.scenario ? q.scenario : q.prompt).slice(0, 50) + '...' : (isThemeBattle && q.scenario ? q.scenario : q.prompt)}</div>
            ))}
            {wrong.length > 3 && (
              <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginTop: 6 }}>...还有 {wrong.length - 3} 道</div>
            )}
          </motion.div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* 底部按钮 */}
      <div style={{
        padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(26,21,36,0.9)', backdropFilter: 'blur(12px)',
      }}>
        <div className="flex gap-3" style={{ maxWidth: 400, margin: '0 auto' }}>
          <motion.button
            whileTap={{ scale: 0.97 }} onClick={onRetry}
            style={{
              flex: 1, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.08)',
              color: '#f5efe8', fontSize: 14, fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          ><RotateCcw size={16} /> {isThemeBattle ? '重演副本' : '再来一轮'}</motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }} onClick={onExit}
            style={{
              flex: 1, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#4ECDC4,#44A08D)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          ><Home size={16} /> 回首页</motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, val, color }: { label: string; val: string; color: string }) {
  return (
    <div style={{
      flex: 1, padding: '12px 10px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      textAlign: 'center',
    }}>
      <div style={{ color, fontSize: 20, fontWeight: 800 }}>{val}</div>
      <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  );
}
