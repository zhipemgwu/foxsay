/**
 * 答题主界面
 * ---------------------------------------------
 * 支持 5 种题型：single / multi / order / cloze / judge
 * 答题 → 提交 → 每选项解析 + 整体解析 → 下一题
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Check, X as IconX, ArrowRight } from 'lucide-react';
import {
  type Question,
  CATEGORY_META,
  checkAnswer,
  recordAnswer,
  markDailyAnswered,
  touchStreak,
  shuffle,
} from '../services/quiz';

interface Props {
  questions: Question[];
  title: string;             // 顶部标题（"每日推荐" / "反 PUA · Lv2" / "错题本"）
  onExit: () => void;
  onFinish: (result: { total: number; correct: number; wrong: Question[]; combo: number }) => void;
}

export function QuizSession({ questions, title, onExit, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongList, setWrongList] = useState<Question[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const q = questions[idx];

  // 切题时重置
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idx]);

  // 空题库兜底
  useEffect(() => {
    if (!q) onExit();
  }, [q]);

  if (!q) return null;

  const cat = CATEGORY_META[q.category];

  const handleSubmit = () => {
    if (userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)) return;
    const correct = checkAnswer(q, userAnswer);
    if (correct) {
      setCorrectCount(c => c + 1);
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(m => Math.max(m, nc));
        return nc;
      });
    } else {
      setWrongList(w => [...w, q]);
      setCombo(0);
    }
    recordAnswer(q, correct);
    markDailyAnswered(q.id);
    touchStreak();
    setSubmitted(true);
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      onFinish({
        total: questions.length,
        correct: correctCount + (checkAnswer(q, userAnswer) ? 0 : 0), // 已经在 handleSubmit 加过
        wrong: wrongList,
        combo: maxCombo,
      });
    } else {
      setIdx(i => i + 1);
      setUserAnswer(null);
      setSubmitted(false);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col"
      style={{ background: 'linear-gradient(180deg, #2a2238 0%, #1a1524 100%)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* 顶部 */}
      <div style={{
        paddingTop: 'env(safe-area-inset-top, 44px)',
        background: 'rgba(42,34,56,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div className="flex items-center px-4 h-11 relative">
          <motion.button whileTap={{ scale: 0.9 }} onClick={onExit} className="absolute left-3">
            <ChevronLeft size={26} color="#f5efe8" />
          </motion.button>
          <div className="flex-1 text-center">
            <p style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{title}</p>
            <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>{idx + 1} / {questions.length}</p>
          </div>
          {combo >= 2 && (
            <div className="absolute right-3 flex items-center gap-1" style={{
              padding: '4px 10px', borderRadius: 12,
              background: 'linear-gradient(135deg,#FF8A80,#EC407A)',
              color: '#fff', fontSize: 11, fontWeight: 700,
            }}>
              🔥 {combo} 连击
            </div>
          )}
        </div>
        {/* 进度条 */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            animate={{ width: `${((idx + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            style={{ height: '100%', background: 'linear-gradient(90deg,#FF8A80,#EC407A)' }}
          />
        </div>
      </div>

      {/* 题目区 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* 分类 badge */}
        <div className="flex items-center gap-2 mb-4">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 12,
            background: `${cat.color}22`,
            border: `1px solid ${cat.color}44`,
            color: cat.color, fontSize: 11, fontWeight: 600,
          }}>
            <span>{cat.emoji}</span>{cat.label}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4, 5].map(d => (
              <span key={d} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: d <= q.difficulty ? cat.color : 'rgba(255,255,255,0.1)'
              }} />
            ))}
          </div>
        </div>

        {q.scenario && (
          <div style={{
            padding: '12px 14px', borderRadius: 12, marginBottom: 14,
            background: 'rgba(155,126,222,0.1)',
            border: '1px solid rgba(155,126,222,0.2)',
            color: 'rgba(245,239,232,0.85)', fontSize: 13, lineHeight: 1.7,
          }}>
            <div style={{ color: '#B8A4E8', fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>场景</div>
            {q.scenario}
          </div>
        )}

        <div style={{
          padding: '14px 16px', borderRadius: 14, marginBottom: 18,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#f5efe8', fontSize: 15, fontWeight: 500, lineHeight: 1.7,
        }}>
          {q.prompt}
        </div>

        {/* 答题区 */}
        {(q.type === 'single' || q.type === 'judge') && (
          <SingleChoice q={q} userAnswer={userAnswer} submitted={submitted} onChange={setUserAnswer} />
        )}
        {q.type === 'multi' && (
          <MultiChoice q={q} userAnswer={userAnswer || []} submitted={submitted} onChange={setUserAnswer} />
        )}
        {q.type === 'order' && (
          <OrderQuiz q={q} userAnswer={userAnswer} submitted={submitted} onChange={setUserAnswer} />
        )}
        {q.type === 'cloze' && (
          <ClozeQuiz q={q} userAnswer={userAnswer} submitted={submitted} onChange={setUserAnswer} />
        )}

        {/* 整体解析 */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                marginTop: 18, padding: '14px 16px', borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(255,217,61,0.08), rgba(255,138,128,0.06))',
                border: '1px solid rgba(255,217,61,0.25)',
              }}
            >
              <div style={{ color: '#FFD93D', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                💡 知识点解析
              </div>
              <div style={{ color: '#f5efe8', fontSize: 13, lineHeight: 1.9 }}>{q.overallExplain}</div>
              {q.tags && q.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {q.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 8,
                      background: 'rgba(255,217,61,0.12)', color: '#FFD93D', fontWeight: 600,
                    }}>#{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: 120 }} />
      </div>

      {/* 底部按钮 */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 18px calc(14px + env(safe-area-inset-bottom, 0px))',
        background: 'linear-gradient(180deg, rgba(26,21,36,0) 0%, #1a1524 40%)',
      }}>
        {!submitted ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)}
            style={{
              width: '100%', height: 50, borderRadius: 14,
              background: userAnswer === null || (Array.isArray(userAnswer) && userAnswer.length === 0)
                ? 'rgba(255,255,255,0.1)'
                : 'linear-gradient(135deg,#FF8A80,#EC407A)',
              color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: 2,
              border: 'none', cursor: 'pointer',
              boxShadow: userAnswer !== null ? '0 8px 20px rgba(255,138,128,0.35)' : 'none',
            }}
          >
            提交答案
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: '100%', height: 50, borderRadius: 14,
              background: 'linear-gradient(135deg,#4ECDC4,#44A08D)',
              color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: 2,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(78,205,196,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {idx + 1 >= questions.length ? '查看结果' : '下一题'} <ArrowRight size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

/* ========== 各题型组件 ========== */

function SingleChoice({ q, userAnswer, submitted, onChange }: {
  q: Question; userAnswer: number | null; submitted: boolean; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      {(q.options || []).map((opt, i) => {
        const selected = userAnswer === i;
        const showResult = submitted;
        const isRight = opt.isCorrect;
        return (
          <motion.button
            key={i}
            whileTap={!submitted ? { scale: 0.98 } : undefined}
            onClick={() => !submitted && onChange(i)}
            disabled={submitted}
            style={{
              width: '100%', textAlign: 'left',
              padding: '14px 16px', borderRadius: 14,
              background: showResult
                ? (isRight ? 'rgba(78,205,196,0.12)' : (selected ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.04)'))
                : (selected ? 'rgba(255,138,128,0.15)' : 'rgba(255,255,255,0.04)'),
              border: showResult
                ? (isRight ? '1.5px solid #4ECDC4' : (selected ? '1.5px solid #FF6B6B' : '1px solid rgba(255,255,255,0.08)'))
                : (selected ? '1.5px solid #FF8A80' : '1px solid rgba(255,255,255,0.08)'),
              color: '#f5efe8', cursor: submitted ? 'default' : 'pointer',
            }}
          >
            <div className="flex items-start gap-3">
              <div style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                background: showResult
                  ? (isRight ? '#4ECDC4' : (selected ? '#FF6B6B' : 'rgba(255,255,255,0.1)'))
                  : (selected ? '#FF8A80' : 'rgba(255,255,255,0.1)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: '#fff', fontWeight: 700,
              }}>
                {showResult
                  ? (isRight ? <Check size={14} /> : (selected ? <IconX size={14} /> : String.fromCharCode(65 + i)))
                  : String.fromCharCode(65 + i)}
              </div>
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6 }}>{opt.text}</div>
            </div>
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    marginTop: 10, paddingTop: 10, paddingLeft: 34,
                    borderTop: '1px dashed rgba(255,255,255,0.12)',
                    color: isRight ? '#4ECDC4' : (selected ? '#FFB080' : 'rgba(245,239,232,0.6)'),
                    fontSize: 12, lineHeight: 1.7,
                  }}
                >
                  {opt.explain}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

function MultiChoice({ q, userAnswer, submitted, onChange }: {
  q: Question; userAnswer: number[]; submitted: boolean; onChange: (v: number[]) => void;
}) {
  return (
    <>
      <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginBottom: 10 }}>多选题 · 可选多个</div>
      <div className="space-y-3">
        {(q.options || []).map((opt, i) => {
          const selected = userAnswer.includes(i);
          const showResult = submitted;
          const isRight = opt.isCorrect;
          return (
            <motion.button
              key={i}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              onClick={() => {
                if (submitted) return;
                onChange(selected ? userAnswer.filter(x => x !== i) : [...userAnswer, i]);
              }}
              disabled={submitted}
              style={{
                width: '100%', textAlign: 'left',
                padding: '14px 16px', borderRadius: 14,
                background: showResult
                  ? (isRight ? 'rgba(78,205,196,0.12)' : (selected ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.04)'))
                  : (selected ? 'rgba(255,138,128,0.15)' : 'rgba(255,255,255,0.04)'),
                border: showResult
                  ? (isRight ? '1.5px solid #4ECDC4' : (selected ? '1.5px solid #FF6B6B' : '1px solid rgba(255,255,255,0.08)'))
                  : (selected ? '1.5px solid #FF8A80' : '1px solid rgba(255,255,255,0.08)'),
                color: '#f5efe8', cursor: submitted ? 'default' : 'pointer',
              }}
            >
              <div className="flex items-start gap-3">
                <div style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                  background: showResult
                    ? (isRight ? '#4ECDC4' : (selected ? '#FF6B6B' : 'rgba(255,255,255,0.1)'))
                    : (selected ? '#FF8A80' : 'rgba(255,255,255,0.1)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(selected || (showResult && isRight)) && <Check size={14} color="#fff" />}
                </div>
                <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6 }}>{opt.text}</div>
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      marginTop: 10, paddingTop: 10, paddingLeft: 34,
                      borderTop: '1px dashed rgba(255,255,255,0.12)',
                      color: isRight ? '#4ECDC4' : 'rgba(245,239,232,0.6)',
                      fontSize: 12, lineHeight: 1.7,
                    }}
                  >
                    {opt.explain}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function OrderQuiz({ q, userAnswer, submitted, onChange }: {
  q: Question; userAnswer: string[] | null; submitted: boolean; onChange: (v: string[]) => void;
}) {
  // 初次渲染打乱
  const initial = useMemo(() => shuffle(q.orderItems || []), [q.id]);
  const [pool, setPool] = useState<string[]>(initial);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    setPool(shuffle(q.orderItems || []));
    setPicked([]);
  }, [q.id]);

  useEffect(() => {
    if (picked.length === (q.orderItems?.length || 0)) onChange(picked);
    else onChange([]);
  }, [picked]);

  const truth = q.orderItems || [];
  const isItemCorrect = (item: string, posIdx: number) => submitted && truth[posIdx] === item;

  return (
    <>
      <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginBottom: 10 }}>排序题 · 按顺序点击</div>
      {/* 已选区 */}
      <div style={{
        minHeight: 60, padding: 10, borderRadius: 14, marginBottom: 12,
        background: 'rgba(78,205,196,0.06)',
        border: '1.5px dashed rgba(78,205,196,0.35)',
      }}>
        {picked.length === 0 && (
          <div style={{ color: 'rgba(245,239,232,0.35)', fontSize: 12, textAlign: 'center', padding: '10px 0' }}>
            从下方选项依序点击，排出正确顺序
          </div>
        )}
        <div className="space-y-2">
          {picked.map((item, i) => (
            <motion.div
              key={i}
              layout
              style={{
                padding: '10px 12px', borderRadius: 10,
                background: submitted
                  ? (isItemCorrect(item, i) ? 'rgba(78,205,196,0.18)' : 'rgba(255,107,107,0.15)')
                  : 'rgba(255,255,255,0.06)',
                border: submitted
                  ? (isItemCorrect(item, i) ? '1px solid #4ECDC4' : '1px solid #FF6B6B')
                  : '1px solid rgba(255,255,255,0.1)',
                color: '#f5efe8', fontSize: 13, lineHeight: 1.6,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{
                flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                background: submitted && isItemCorrect(item, i) ? '#4ECDC4' : '#FF8A80',
                color: '#fff', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{item}</span>
              {!submitted && (
                <button onClick={() => {
                  setPicked(p => p.filter(x => x !== item));
                  setPool(p => [...p, item]);
                }} style={{ color: 'rgba(245,239,232,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <IconX size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {/* 待选区 */}
      <div className="space-y-2">
        {pool.map(item => (
          <motion.button
            key={item}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (submitted) return;
              setPicked(p => [...p, item]);
              setPool(p => p.filter(x => x !== item));
            }}
            disabled={submitted}
            style={{
              width: '100%', textAlign: 'left',
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f5efe8', fontSize: 13, lineHeight: 1.6,
              cursor: submitted ? 'default' : 'pointer',
            }}
          >
            {item}
          </motion.button>
        ))}
      </div>
      {submitted && (
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 12,
          background: 'rgba(78,205,196,0.08)', border: '1px solid rgba(78,205,196,0.2)',
          fontSize: 12, color: '#4ECDC4', lineHeight: 1.8,
        }}>
          正确顺序：
          <ol style={{ marginTop: 6, paddingLeft: 18, color: 'rgba(245,239,232,0.85)' }}>
            {truth.map((t, i) => <li key={i} style={{ marginBottom: 3 }}>{t}</li>)}
          </ol>
        </div>
      )}
    </>
  );
}

function ClozeQuiz({ q, userAnswer, submitted, onChange }: {
  q: Question; userAnswer: number | null; submitted: boolean; onChange: (v: number) => void;
}) {
  const choices = q.clozeChoices || [];
  const correctIdx = q.clozeCorrectIdx ?? 0;
  const explains = q.clozeExplains || [];
  return (
    <>
      <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginBottom: 10 }}>完形填空 · 选一个最合适的回复</div>
      <div className="space-y-3">
        {choices.map((c, i) => {
          const selected = userAnswer === i;
          const isRight = i === correctIdx;
          const showResult = submitted;
          return (
            <motion.button
              key={i}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              onClick={() => !submitted && onChange(i)}
              disabled={submitted}
              style={{
                width: '100%', textAlign: 'left',
                padding: '14px 16px', borderRadius: 14,
                background: showResult
                  ? (isRight ? 'rgba(78,205,196,0.12)' : (selected ? 'rgba(255,107,107,0.12)' : 'rgba(255,255,255,0.04)'))
                  : (selected ? 'rgba(255,138,128,0.15)' : 'rgba(255,255,255,0.04)'),
                border: showResult
                  ? (isRight ? '1.5px solid #4ECDC4' : (selected ? '1.5px solid #FF6B6B' : '1px solid rgba(255,255,255,0.08)'))
                  : (selected ? '1.5px solid #FF8A80' : '1px solid rgba(255,255,255,0.08)'),
                color: '#f5efe8', cursor: submitted ? 'default' : 'pointer',
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>「{c}」</div>
              <AnimatePresence>
                {submitted && explains[i] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      marginTop: 10, paddingTop: 10,
                      borderTop: '1px dashed rgba(255,255,255,0.12)',
                      color: isRight ? '#4ECDC4' : (selected ? '#FFB080' : 'rgba(245,239,232,0.6)'),
                      fontSize: 12, lineHeight: 1.7,
                    }}
                  >
                    {explains[i]}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
