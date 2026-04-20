import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconBubble, IcHeart, IcSparkle, IcAngryFace, IcChat, IcBook, IcTarget, IcFire, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

const moods: { emoji?: string; icon?: React.FC<{size:number}>; label: string; color: string; bg: string }[] = [
  { emoji: '😊', label: '开心', color: '#FFD93D', bg: 'rgba(255,217,61,0.18)' },
  { emoji: '🥰', label: '心动', color: '#FF8A80', bg: 'rgba(255,138,128,0.18)' },
  { emoji: '😌', label: '平静', color: '#81D4FA', bg: 'rgba(129,212,250,0.18)' },
  { icon: IcAngryFace, label: '焦虑', color: '#CE93D8', bg: 'rgba(206,147,216,0.18)' },
  { emoji: '😔', label: '低落', color: '#90A4AE', bg: 'rgba(144,164,174,0.18)' },
];

/** 5套心情适配任务 */
const moodTasks: Record<string, { icon: React.ReactNode; bg: string; title: string; xp: number }[]> = {
  '开心': [
    { icon: <IcChat size={16} color="#fff" />, bg: gradients.coral, title: '分享快乐：练习表达积极情绪', xp: 30 },
    { icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '趁热打铁：进行一次约会模拟', xp: 50 },
    { icon: <IcBook size={16} color="#fff" />, bg: gradients.golden, title: '阅读「好心情的传递技巧」', xp: 10 },
    { icon: <IcFire size={16} color="#fff" />, bg: gradients.rose, title: '挑战：用3句话描述今天的幸福', xp: 20 },
  ],
  '心动': [
    { icon: <IcChat size={16} color="#fff" />, bg: gradients.rose, title: '心动表达：练习暗示与试探', xp: 30 },
    { icon: <IcTarget size={16} color="#fff" />, bg: gradients.purple, title: '搭讪场景：咖啡馆邂逅模拟', xp: 50 },
    { icon: <IcBook size={16} color="#fff" />, bg: gradients.coral, title: '阅读「心动信号的识别」', xp: 10 },
    { icon: <IcFire size={16} color="#fff" />, bg: gradients.golden, title: '挑战：写一条让人心动的消息', xp: 20 },
  ],
  '平静': [
    { icon: <IcChat size={16} color="#fff" />, bg: gradients.sky, title: '深度倾听：练习共情式回应', xp: 30 },
    { icon: <IcTarget size={16} color="#fff" />, bg: gradients.mint, title: '沟通训练：温和表达需求', xp: 50 },
    { icon: <IcBook size={16} color="#fff" />, bg: gradients.purple, title: '阅读「高质量陪伴指南」', xp: 10 },
    { icon: <IcFire size={16} color="#fff" />, bg: gradients.teal, title: '挑战：描述你理想中的关系', xp: 20 },
  ],
  '焦虑': [
    { icon: <IcChat size={16} color="#fff" />, bg: gradients.purple, title: '安全感表达：练习说出不安', xp: 30 },
    { icon: <IcTarget size={16} color="#fff" />, bg: gradients.sky, title: '情绪管理：冷静沟通模拟', xp: 50 },
    { icon: <IcBook size={16} color="#fff" />, bg: gradients.mint, title: '阅读「化解焦虑的5个方法」', xp: 10 },
    { icon: <IcFire size={16} color="#fff" />, bg: gradients.rose, title: '挑战：给自己写一封安心信', xp: 20 },
  ],
  '低落': [
    { icon: <IcChat size={16} color="#fff" />, bg: gradients.sky, title: '自我关怀：练习温柔对话', xp: 30 },
    { icon: <IcTarget size={16} color="#fff" />, bg: gradients.purple, title: '疗愈场景：暖心陪伴模拟', xp: 50 },
    { icon: <IcBook size={16} color="#fff" />, bg: gradients.rose, title: '阅读「失落时如何被治愈」', xp: 10 },
    { icon: <IcFire size={16} color="#fff" />, bg: gradients.coral, title: '挑战：列出3件让你感恩的事', xp: 20 },
  ],
};

function MoodIcon({ mood, size }: { mood: typeof moods[0]; size: number }) {
  if (mood.emoji) return <span style={{ fontSize: size, lineHeight: 1, display: 'block' }}>{mood.emoji}</span>;
  if (mood.icon) { const Ic = mood.icon; return <Ic size={size} />; }
  return null;
}

export function MoodCard() {
  const user = useUser();
  const todayKey = `mood_${user.name}_${new Date().toDateString()}`;
  const savedMood = typeof window !== 'undefined' ? localStorage.getItem(todayKey) : null;
  const [selected, setSelected] = useState<number | null>(savedMood !== null ? Number(savedMood) : null);
  const [tasksDone, setTasksDone] = useState<Record<number, boolean>>({});

  const handleSelect = (i: number) => {
    setSelected(i);
    localStorage.setItem(todayKey, String(i));
  };

  const toggleTask = (idx: number) => setTasksDone(prev => ({ ...prev, [idx]: !prev[idx] }));

  const tasks = selected !== null ? moodTasks[moods[selected].label] || [] : [];
  const completedCount = Object.values(tasksDone).filter(Boolean).length;

  return (
    <div className="px-5 mb-2">
      <motion.div
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          border: selected !== null
            ? `1px solid ${moods[selected].color}33`
            : '1px solid rgba(245,239,232,0.08)',
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-5" style={{ background: '#352f45', borderRadius: 16 }}>
          <AnimatePresence mode="wait">
            {selected === null ? (
              <motion.div key="ask" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {/* 仪式感提示 */}
                <div className="flex items-center gap-2 mb-2">
                  <IconBubble size={28} bg={gradients.rose}>
                    <IcHeart size={14} color="#fff" />
                  </IconBubble>
                  <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>先记录今日心情</span>
                </div>
                <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12, marginBottom: 12, paddingLeft: 36 }}>
                  选择心情后解锁今日专属任务 ✨
                </p>
                <div className="flex items-center justify-between">
                  {moods.map((m, i) => (
                    <motion.button
                      key={m.label}
                      className="flex flex-col items-center gap-1.5 px-2 py-2"
                      style={{ borderRadius: 12 }}
                      whileHover={{ background: m.bg }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelect(i)}
                    >
                      <motion.div
                        style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <MoodIcon mood={m} size={28} />
                      </motion.div>
                      <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>{m.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                {/* 心情已选 + XP */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                      <MoodIcon mood={moods[selected]} size={32} />
                    </motion.div>
                    <div>
                      <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>今天感觉{moods[selected].label}</p>
                      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>
                        已解锁专属任务 · {completedCount}/{tasks.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IcSparkle size={12} color={moods[selected].color} />
                    <span style={{ color: moods[selected].color, fontSize: '12px', fontWeight: 600 }}>+5 XP</span>
                  </div>
                </div>

                {/* 心情适配任务 */}
                <div className="flex flex-col gap-2">
                  {tasks.map((task, idx) => (
                    <motion.button key={idx} className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                      style={{
                        background: tasksDone[idx] ? 'rgba(255,138,128,0.08)' : 'rgba(245,239,232,0.04)',
                        borderRadius: 10,
                        border: tasksDone[idx] ? '1px solid rgba(255,138,128,0.15)' : '1px solid rgba(245,239,232,0.06)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleTask(idx)}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}>
                      <IconBubble size={28} bg={tasksDone[idx] ? 'rgba(255,138,128,0.18)' : task.bg}>
                        {tasksDone[idx] ? (
                          <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L20 7" stroke="#FF8A80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : task.icon}
                      </IconBubble>
                      <span className="flex-1" style={{
                        color: tasksDone[idx] ? 'rgba(245,239,232,0.45)' : '#f5efe8',
                        fontSize: 12, fontWeight: 500,
                        textDecoration: tasksDone[idx] ? 'line-through' : 'none',
                      }}>{task.title}</span>
                      <span style={{
                        color: tasksDone[idx] ? 'rgba(245,239,232,0.35)' : '#FFD93D',
                        fontSize: 10, fontWeight: 600,
                        background: tasksDone[idx] ? 'transparent' : 'rgba(255,217,61,0.12)',
                        padding: '2px 6px', borderRadius: 4,
                      }}>+{task.xp}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
