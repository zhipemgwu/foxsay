/**
 * 今日任务清单 — check-in 后显示今日任务
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle } from 'lucide-react';
import { IcSparkle } from './CuteIcons';

/* ── 今日任务（check-in 后可见） ── */
const defaultTasks = [
  { id: 1, title: '今日场景练习', desc: '完成一次约会模拟', xp: 50, expert: '汪俊豪', icon: '☕' },
  { id: 2, title: '主动发起一次对话', desc: '用学到的开场白和朋友聊天', xp: 20, expert: '余水', icon: '💬' },
  { id: 3, title: '写一段感悟日记', desc: '记录今日的情感收获', xp: 15, expert: '占方剑', icon: '📝' },
  { id: 4, title: '深度倾听练习', desc: '在对话中至少问3个开放式问题', xp: 30, expert: '汪俊豪', icon: '👂' },
  { id: 5, title: '回顾恋商周报', desc: '查看本周能力变化', xp: 10, expert: '', icon: '📊' },
];

export function TodayTaskList() {
  const [isCheckInDone, setIsCheckInDone] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    setIsCheckInDone(!!localStorage.getItem(`heatup_${today}`));

    const tasksSaved = localStorage.getItem(`tasks_${today}`);
    if (tasksSaved) { try { setCompletedTasks(JSON.parse(tasksSaved)); } catch {} }

    const onCheckIn = () => setIsCheckInDone(true);
    window.addEventListener('foxsay_checkin_done', onCheckIn);
    return () => window.removeEventListener('foxsay_checkin_done', onCheckIn);
  }, []);

  const toggleTask = useCallback((id: number) => {
    setCompletedTasks(prev => {
      const next = prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id];
      localStorage.setItem(`tasks_${new Date().toDateString()}`, JSON.stringify(next));
      return next;
    });
  }, []);

  const progress = defaultTasks.length ? Math.round((completedTasks.length / defaultTasks.length) * 100) : 0;

  return (
    <div className="px-5 pb-4">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 600 }}>今日任务</span>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <IcSparkle size={14} color="#4ECDC4" />
          </motion.div>
        </div>
        <span style={{ color: completedTasks.length === defaultTasks.length ? '#4ECDC4' : 'rgba(245,239,232,0.45)', fontSize: 12, fontWeight: 600 }}>
          {completedTasks.length}/{defaultTasks.length} 完成
        </span>
      </div>

      {/* 未 check-in 提示 */}
      {!isCheckInDone && (
        <motion.div className="p-4 text-center mb-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 14, border: '1px solid rgba(245,239,232,0.08)' }}>
          <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>☀️</span>
          <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13 }}>完成今日打卡后解锁任务</span>
        </motion.div>
      )}

      {/* 已 check-in：显示任务 */}
      {isCheckInDone && (
        <>
          {/* 进度条 */}
          <div className="mb-4" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.08)' }}>
            <motion.div className="h-full" style={{
              borderRadius: 2,
              background: progress === 100 ? 'linear-gradient(90deg, #4ECDC4, #56E39F)' : 'linear-gradient(90deg, #FF8A80, #B39DDB)',
            }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* 任务列表 */}
          <AnimatePresence mode="wait">
            <motion.div key="daily" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col gap-2">
                {defaultTasks.map((task, i) => {
                  const done = completedTasks.includes(task.id);
                  return (
                    <motion.div key={task.id} className="flex items-center gap-3 p-3"
                      style={{
                        background: done ? 'rgba(78,205,196,0.06)' : 'rgba(245,239,232,0.04)',
                        borderRadius: 12,
                        border: done ? '1px solid rgba(78,205,196,0.15)' : '1px solid rgba(245,239,232,0.06)',
                        cursor: 'pointer',
                      }}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => toggleTask(task.id)}>
                      {done ? (
                        <CheckCircle2 size={20} color="#4ECDC4" strokeWidth={2} />
                      ) : (
                        <Circle size={20} color="rgba(245,239,232,0.25)" strokeWidth={1.5} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 14 }}>{task.icon}</span>
                          <span style={{
                            color: done ? 'rgba(245,239,232,0.4)' : '#f5efe8',
                            fontSize: 13, fontWeight: 600,
                            textDecoration: done ? 'line-through' : 'none',
                          }}>{task.title}</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginTop: 1 }}>{task.desc}</p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span style={{ color: '#FFD93D', fontSize: 11, fontWeight: 700 }}>+{task.xp} XP</span>
                        {task.expert && <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9 }}>推荐：{task.expert}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 接近完成提示 */}
          {completedTasks.length > 0 && completedTasks.length < defaultTasks.length && defaultTasks.length - completedTasks.length <= 2 && (
            <motion.div className="mt-2 px-3 py-2 text-center" style={{ background: 'rgba(255,217,61,0.06)', borderRadius: 10, border: '1px solid rgba(255,217,61,0.1)' }}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11 }}>🔥 还差 {defaultTasks.length - completedTasks.length} 项就全部完成了，加油！</span>
            </motion.div>
          )}

          {completedTasks.length === defaultTasks.length && defaultTasks.length > 0 && (
            <motion.div className="mt-3 p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(78,205,196,0.1), rgba(86,227,159,0.08))', borderRadius: 14, border: '1px solid rgba(78,205,196,0.18)' }}
              initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}>
              <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>🎉</span>
              </motion.div>
              <span style={{ color: '#4ECDC4', fontSize: 14, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                今日任务全部完成！
              </span>
              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12 }}>
                累计获得 <span style={{ color: '#FFD93D', fontWeight: 700 }}>{defaultTasks.reduce((a, t) => a + t.xp, 0)} XP</span>
              </span>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
