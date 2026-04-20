import { motion } from 'motion/react';
import { useState } from 'react';
import { IconBubble, IcFire, IcBolt, IcTarget, IcSparkle, IcChat, IcBook, IcHeart, IcCrown, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

const dailyTasks = [
  { id: 1, icon: <IcChat size={16} color="#fff" />, bg: gradients.coral, title: '完成一次AI对话练习', xp: 30, done: true },
  { id: 2, icon: <IcBook size={16} color="#fff" />, bg: gradients.purple, title: '阅读今日恋爱小贴士', xp: 10, done: true },
  { id: 3, icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '练习一个新场景', xp: 50, done: false },
  { id: 4, icon: <IcHeart size={16} color="#fff" />, bg: gradients.rose, title: '分享你的练习心得', xp: 20, done: false },
];

export function GreetingSection() {
  const user = useUser();
  const [tasks, setTasks] = useState(dailyTasks);
  const xp = user.xp;
  const maxXp = 500;
  const percent = Math.round((xp / maxXp) * 100);
  const completedTasks = tasks.filter(t => t.done).length;

  const hour = new Date().getHours();
  const greeting = hour < 6 ? '凌晨好' : hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好';

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="px-5 pt-8 pb-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px', marginBottom: 6 }}>{greeting}，{user.name}</p>
          <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0 }}>
            今天想练点什么？
          </h1>
        </motion.div>

        {/* Quick stats */}
        <motion.div className="flex items-center gap-5 mt-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <div className="flex items-center gap-2">
            <IconBubble size={28} bg={gradients.coral} glow><IcFire size={14} color="#fff" /></IconBubble>
            <div>
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{user.streak}天</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', display: 'block', marginTop: -1 }}>连续</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBubble size={28} bg={gradients.golden} glow><IcBolt size={14} color="#fff" /></IconBubble>
            <div>
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>340</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', display: 'block', marginTop: -1 }}>XP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBubble size={28} bg={gradients.mint}><IcTarget size={14} color="#fff" /></IconBubble>
            <div>
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{completedTasks}/{tasks.length}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', display: 'block', marginTop: -1 }}>日任务</span>
            </div>
          </div>
        </motion.div>

        {/* XP card with gradient border */}
        <motion.div className="mt-5 overflow-hidden" style={{
          borderRadius: 16,
          border: '1px solid rgba(245,239,232,0.08)',
        }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="p-5" style={{ background: '#352f45', borderRadius: 16 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconBubble size={24} bg={gradients.purple}><IcCrown size={12} color="#fff" /></IconBubble>
                <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>Lv.12 恋爱学徒</span>
                <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>→</span>
                <span style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 600 }}>恋爱达人</span>
              </div>
              <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: '12px' }}>{xp}/{maxXp}</span>
            </div>
            <div className="w-full overflow-hidden" style={{ height: 6, borderRadius: 3, background: 'rgba(245,239,232,0.12)' }}>
              <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #FF8A80, #FFB199)', borderRadius: 3 }}
                initial={{ width: '0%' }} animate={{ width: `${percent}%` }} transition={{ duration: 1, delay: 0.5 }} />
            </div>
            <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px', marginTop: 10 }}>
              再获得 <span style={{ color: '#f5efe8', fontWeight: 600 }}>160 XP</span> 即可晋级
            </p>
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div className="mt-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconBubble size={24} bg={gradients.golden}><IcSparkle size={12} color="#fff" /></IconBubble>
              <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>今日任务</span>
            </div>
            <span style={{ color: '#FF8A80', fontSize: '12px', fontWeight: 600 }}>+{tasks.filter(t => !t.done).reduce((s, t) => s + t.xp, 0)} XP 可得</span>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <motion.button
                key={task.id}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{
                  background: task.done ? 'rgba(255,138,128,0.12)' : '#453a60',
                  borderRadius: 12,
                  border: task.done ? '1px solid rgba(255,138,128,0.22)' : '1px solid rgba(245,239,232,0.08)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
              >
                <IconBubble size={32} bg={task.done ? 'rgba(255,138,128,0.22)' : task.bg}>
                  {task.done ? (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="#FF8A80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : task.icon}
                </IconBubble>
                <span className="flex-1" style={{
                  color: task.done ? 'rgba(245,239,232,0.5)' : '#f5efe8',
                  fontSize: '13px', fontWeight: 500,
                  textDecoration: task.done ? 'line-through' : 'none',
                }}>
                  {task.title}
                </span>
                <span style={{
                  color: task.done ? 'rgba(245,239,232,0.5)' : '#FFD93D',
                  fontSize: '11px', fontWeight: 600,
                  background: task.done ? 'transparent' : 'rgba(255,217,61,0.15)',
                  padding: '2px 8px', borderRadius: 6,
                }}>
                  +{task.xp}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
