import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  deepTestQuestions,
  computeDeepResult,
  speciesNameMap,
  speciesEmojiMap,
  speciesDescriptionMap,
  type DeepQuestion,
  type DeepTestResult,
} from '../data/deepSpeciesTest';
import { useUser } from '../context/UserContext';

/* ────────── constants ────────── */

const STORAGE_KEY = 'foxsay:deep_test_progress';
const TOTAL = deepTestQuestions.length;

const MODULE_COLORS: Record<string, string> = {
  A: '#7C4DFF', B: '#FF4081', C: '#FF9100', D: '#00E676', E: '#00B0FF', F: '#FFD740',
};
const MODULE_LABELS: Record<string, string> = {
  A: '💬 聊天力', B: '✨ 吸引力', C: '🚀 主动力', D: '💛 共情力', E: '👑 掌控力', F: '🎬 综合情境',
};

/* ────────── helpers ────────── */

function saveProgress(answers: Map<string, any>, idx: number) {
  try {
    const obj: Record<string, any> = {};
    answers.forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: obj, idx }));
  } catch { /* ignore */ }
}

function loadProgress(): { answers: Map<string, any>; idx: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { answers, idx } = JSON.parse(raw);
    const map = new Map<string, any>();
    for (const [k, v] of Object.entries(answers)) map.set(k, v);
    return { answers: map, idx };
  } catch { return null; }
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
}

/* ────────── sub-components ────────── */

/** 进度条 */
function ProgressBar({ current, total, module }: { current: number; total: number; module: string }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ color: MODULE_COLORS[module] }}>{MODULE_LABELS[module]}</span>
        <span>{current + 1} / {total}</span>
      </div>
      <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full" style={{ background: MODULE_COLORS[module] }}
          initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}

/** 选项按钮 */
function OptionButton({ emoji, label, selected, onClick }: { emoji: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{
        background: selected ? 'rgba(124,77,255,0.15)' : 'rgba(255,255,255,0.04)',
        border: selected ? '1.5px solid rgba(124,77,255,0.6)' : '1px solid rgba(255,255,255,0.06)',
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <span className="flex-1" style={{ color: selected ? '#B39DDB' : 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: selected ? 600 : 400 }}>
        {label}
      </span>
    </motion.button>
  );
}

/** 滑杆 */
function SliderQuestion({ labels, value, onChange }: { labels: [string, string]; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <input type="range" min={0} max={100} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-purple-400"
        style={{ height: 6 }}
      />
      <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
        <span>{labels[0]}</span>
        <span style={{ color: '#B39DDB', fontWeight: 700, fontSize: 16 }}>{value}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}

/** 雷达图 (纯 SVG) */
function RadarChart({ data }: { data: { chat: number; charm: number; courage: number; empathy: number; control: number } }) {
  const labels = [
    { key: 'chat', label: '聊天' },
    { key: 'charm', label: '吸引' },
    { key: 'courage', label: '主动' },
    { key: 'empathy', label: '共情' },
    { key: 'control', label: '掌控' },
  ];
  const cx = 80, cy = 80, R = 60;
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2;

  const points = labels.map((l, i) => {
    const angle = startAngle + i * angleStep;
    const val = (data[l.key as keyof typeof data] || 50) / 100;
    return { x: cx + R * val * Math.cos(angle), y: cy + R * val * Math.sin(angle), label: l.label, val: data[l.key as keyof typeof data] };
  });
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');
  const bgLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg viewBox="0 0 160 160" style={{ width: 200, height: 200 }}>
      {bgLevels.map(lv => (
        <polygon key={lv}
          points={labels.map((_, i) => {
            const a = startAngle + i * angleStep;
            return `${cx + R * lv * Math.cos(a)},${cy + R * lv * Math.sin(a)}`;
          }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}
        />
      ))}
      {labels.map((_, i) => {
        const a = startAngle + i * angleStep;
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />;
      })}
      <polygon points={polygon} fill="rgba(124,77,255,0.2)" stroke="#7C4DFF" strokeWidth={1.5} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={2.5} fill="#7C4DFF" />
          <text x={cx + (R + 14) * Math.cos(startAngle + i * angleStep)}
            y={cy + (R + 14) * Math.sin(startAngle + i * angleStep)}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)" fontSize={9}>{p.label} {p.val}</text>
        </g>
      ))}
    </svg>
  );
}

/* ────────── main component ────────── */

export default function DeepSpeciesTest({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const hasSpecies = !!(user as any)?.speciesId;
  const [phase, setPhase] = useState<'intro' | 'test' | 'loading' | 'result'>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [result, setResult] = useState<DeepTestResult | null>(null);
  const [compositeStep, setCompositeStep] = useState(0);
  const [compositeAnswers, setCompositeAnswers] = useState<string[]>([]);
  const [sliderVal, setSliderVal] = useState(50);
  const [hasResume, setHasResume] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.idx > 0) setHasResume(true);
  }, []);

  const q = deepTestQuestions[idx];

  const handleSelect = useCallback((optionId: string) => {
    const next = new Map(answers);
    next.set(q.id, optionId);
    setAnswers(next);
    // 自动跳下一题（延迟动画）
    setTimeout(() => {
      if (idx < TOTAL - 1) {
        setIdx(idx + 1);
        setSliderVal(50);
        saveProgress(next, idx + 1);
      } else {
        saveProgress(next, TOTAL);
        finishTest(next);
      }
    }, 300);
  }, [answers, idx, q]);

  const handleSliderConfirm = useCallback(() => {
    const next = new Map(answers);
    next.set(q.id, sliderVal);
    setAnswers(next);
    if (idx < TOTAL - 1) {
      setIdx(idx + 1);
      setSliderVal(50);
      saveProgress(next, idx + 1);
    } else {
      saveProgress(next, TOTAL);
      finishTest(next);
    }
  }, [answers, idx, q, sliderVal]);

  const handleCompositeSelect = useCallback((optionId: string) => {
    const steps = q.steps || [];
    const newCA = [...compositeAnswers, optionId];
    setCompositeAnswers(newCA);
    if (compositeStep < steps.length - 1) {
      setTimeout(() => setCompositeStep(compositeStep + 1), 300);
    } else {
      // 综合题完成
      const next = new Map(answers);
      next.set(q.id, newCA);
      setAnswers(next);
      setTimeout(() => {
        if (idx < TOTAL - 1) {
          setIdx(idx + 1);
          setSliderVal(50);
          setCompositeStep(0);
          setCompositeAnswers([]);
          saveProgress(next, idx + 1);
        } else {
          saveProgress(next, TOTAL);
          finishTest(next);
        }
      }, 300);
    }
  }, [answers, idx, q, compositeStep, compositeAnswers]);

  const finishTest = (finalAnswers: Map<string, any>) => {
    setPhase('loading');
    setTimeout(() => {
      const res = computeDeepResult(finalAnswers);
      setResult(res);
      // 更新用户物种信息
      if (user && (user as any).updateUser) {
        (user as any).updateUser({
          speciesId: res.mainSpecies,
          speciesName: speciesNameMap[res.mainSpecies],
          speciesEmoji: speciesEmojiMap[res.mainSpecies],
          matchRate: res.matchRate,
          subSpecies: res.subSpecies,
          abilityScores: res.abilities,
        });
      }
      // 测试完成自动打卡（foxsay_checkin_{date} + user.checkIn）
      try {
        const today = new Date();
        const todayKey = `foxsay_checkin_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        if (localStorage.getItem(todayKey) !== '1') {
          localStorage.setItem(todayKey, '1');
          (user as any)?.checkIn?.();
          window.dispatchEvent(new Event('foxsay_checkin_done'));
        }
      } catch { /* */ }
      // 保存到 localStorage
      try {
        localStorage.setItem('foxsay:deep_test_result', JSON.stringify(res));
      } catch { /* */ }
      clearProgress();
      setPhase('result');
    }, 2000);
  };

  const startFresh = () => {
    clearProgress();
    setAnswers(new Map());
    setIdx(0);
    setSliderVal(50);
    setCompositeStep(0);
    setCompositeAnswers([]);
    setPhase('test');
  };

  const resumeTest = () => {
    const saved = loadProgress();
    if (saved) {
      setAnswers(saved.answers);
      setIdx(saved.idx);
    }
    setPhase('test');
  };

  const goBack = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setCompositeStep(0);
      setCompositeAnswers([]);
      setSliderVal(50);
    }
  };

  /* ── Intro ── */
  if (phase === 'intro') {
    return (
      <motion.div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#0D0D0D' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 64 }}>{hasSpecies ? '🔬' : '🧬'}</motion.div>
          <motion.h1 className="mt-4 text-xl font-bold" style={{ color: '#E0E0E0' }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            {hasSpecies ? '深度物种鉴定' : '发现你的恋爱物种'}
          </motion.h1>
          <motion.p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 280 }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            {hasSpecies
              ? <>比初始鉴定更精准的 31 道题目<br />解锁你的主物种 + 隐藏副物种</>
              : <>31 道精准题目 · 5 大维度全面扫描<br />找到你的恋爱人格属于哪种狐狸</>
            }
          </motion.p>
          <motion.p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
            基于依恋理论 × 五种爱语 × FoxSay 五维模型
          </motion.p>

          <motion.div className="mt-8 flex flex-col gap-3 w-full max-w-[260px]"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <motion.button
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)', fontSize: 15 }}
              whileTap={{ scale: 0.96 }}
              onClick={startFresh}
            >
              {hasSpecies ? '开始深度测试' : '开始物种鉴定'}
            </motion.button>
            {hasResume && (
              <motion.button
                className="w-full py-3 rounded-xl font-semibold"
                style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)', color: '#B39DDB', fontSize: 14 }}
                whileTap={{ scale: 0.96 }}
                onClick={resumeTest}
              >
                继续上次测试
              </motion.button>
            )}
          </motion.div>

          <div className="mt-6 flex gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span>⏱ 约5分钟</span>
            <span>📊 12物种精准匹配</span>
          </div>
        </div>

        {/* 关闭 */}
        <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }} onClick={onClose}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>×</span>
        </button>
      </motion.div>
    );
  }

  /* ── Loading ── */
  if (phase === 'loading') {
    return (
      <motion.div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ background: '#0D0D0D' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          style={{ fontSize: 48 }}>🧬</motion.div>
        <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          正在深度分析你的恋爱基因…
        </p>
        <div className="mt-4 w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div className="h-full rounded-full" style={{ background: '#7C4DFF' }}
            initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.8 }} />
        </div>
      </motion.div>
    );
  }

  /* ── Result ── */
  if (phase === 'result' && result) {
    const main = speciesDescriptionMap[result.mainSpecies];
    const sub = speciesDescriptionMap[result.subSpecies];
    return (
      <motion.div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ background: '#0D0D0D' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="min-h-screen flex flex-col items-center px-5 py-8 pb-20">
          {/* 标题 */}
          <motion.p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}
            initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>深度物种鉴定报告</motion.p>

          {/* 主物种卡片 */}
          <motion.div className="mt-4 w-full rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.12), rgba(179,136,255,0.06))', border: '1px solid rgba(124,77,255,0.15)' }}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}>
            <div style={{ fontSize: 48 }}>{speciesEmojiMap[result.mainSpecies]}</div>
            <h2 className="mt-2 text-lg font-bold" style={{ color: '#E0E0E0' }}>
              你是 <span style={{ color: '#B39DDB' }}>{main?.title}</span>
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{main?.desc}</p>
            <div className="mt-3 inline-block px-3 py-1 rounded-full" style={{ background: 'rgba(124,77,255,0.15)' }}>
              <span style={{ color: '#B39DDB', fontSize: 13, fontWeight: 600 }}>匹配度 {result.matchRate}%</span>
            </div>
          </motion.div>

          {/* 副物种 */}
          <motion.div className="mt-3 w-full rounded-xl p-4 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <span style={{ fontSize: 28 }}>{speciesEmojiMap[result.subSpecies]}</span>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>隐藏副物种</p>
              <p className="text-sm font-semibold" style={{ color: '#E0E0E0' }}>{sub?.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{sub?.desc}</p>
            </div>
          </motion.div>

          {/* 雷达图 */}
          <motion.div className="mt-6 flex flex-col items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>五维能力雷达</p>
            <RadarChart data={result.abilities} />
          </motion.div>

          {/* 优劣势 */}
          <motion.div className="mt-4 w-full grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div className="rounded-xl p-3" style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.1)' }}>
              <p className="text-xs font-semibold" style={{ color: '#69F0AE' }}>💪 优势</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{main?.strengths}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(255,64,129,0.06)', border: '1px solid rgba(255,64,129,0.1)' }}>
              <p className="text-xs font-semibold" style={{ color: '#FF80AB' }}>⚠ 短板</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{main?.weakness}</p>
            </div>
          </motion.div>

          {/* 操作按钮 */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-[280px]">
            <motion.button className="w-full py-3 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)', fontSize: 14 }}
              whileTap={{ scale: 0.96 }} onClick={onClose}>
              完成，返回个人页
            </motion.button>
            <motion.button className="w-full py-2.5 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
              whileTap={{ scale: 0.96 }} onClick={startFresh}>
              重新测试
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Test ── */
  const selectedAnswer = answers.get(q?.id);

  return (
    <motion.div ref={containerRef} className="fixed inset-0 z-[9999] flex flex-col" style={{ background: '#0D0D0D' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          onClick={idx > 0 ? goBack : onClose}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>{idx > 0 ? '←' : '×'}</span>
        </button>
        <div className="flex-1">
          <ProgressBar current={idx} total={TOTAL} module={q.module} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 pt-4 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div key={q.id + (q.type === 'composite' ? `-s${compositeStep}` : '')}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}>
            {/* Prompt */}
            <p className="text-base font-semibold mb-5" style={{ color: '#E0E0E0', lineHeight: 1.6 }}>
              {q.type === 'composite' ? (q.steps?.[compositeStep]?.prompt || q.prompt) : q.prompt}
            </p>
            {q.type === 'composite' && (
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                步骤 {compositeStep + 1} / {q.steps?.length || 4}
              </p>
            )}

            {/* Options */}
            {(q.type === 'choice' || q.type === 'binary') && (
              <div className="flex flex-col gap-2.5">
                {q.options?.map(opt => (
                  <OptionButton key={opt.id} emoji={opt.emoji} label={opt.label}
                    selected={selectedAnswer === opt.id}
                    onClick={() => handleSelect(opt.id)} />
                ))}
              </div>
            )}

            {q.type === 'slider' && (
              <div className="flex flex-col gap-6 mt-4">
                <SliderQuestion labels={q.sliderLabels || ['低', '高']} value={sliderVal} onChange={setSliderVal} />
                <motion.button className="w-full py-3 rounded-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)', fontSize: 14 }}
                  whileTap={{ scale: 0.96 }} onClick={handleSliderConfirm}>
                  确认 ({sliderVal})
                </motion.button>
              </div>
            )}

            {q.type === 'composite' && (
              <div className="flex flex-col gap-2.5">
                {q.steps?.[compositeStep]?.options.map(opt => (
                  <OptionButton key={opt.id} emoji={opt.emoji} label={opt.label}
                    selected={compositeAnswers[compositeStep] === opt.id}
                    onClick={() => handleCompositeSelect(opt.id)} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
