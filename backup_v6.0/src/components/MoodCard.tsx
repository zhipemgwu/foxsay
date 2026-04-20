import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconBubble, IcHeart, IcSparkle, IcAngryFace, gradients } from './CuteIcons';

const moods: { emoji?: string; icon?: React.FC<{size:number}>; label: string; color: string; bg: string }[] = [
  { emoji: '😊', label: '开心', color: '#FFD93D', bg: 'rgba(255,217,61,0.18)' },
  { emoji: '🥰', label: '心动', color: '#FF8A80', bg: 'rgba(255,138,128,0.18)' },
  { emoji: '😌', label: '平静', color: '#81D4FA', bg: 'rgba(129,212,250,0.18)' },
  { icon: IcAngryFace, label: '焦虑', color: '#CE93D8', bg: 'rgba(206,147,216,0.18)' },
  { emoji: '😔', label: '低落', color: '#90A4AE', bg: 'rgba(144,164,174,0.18)' },
];

function MoodIcon({ mood, size }: { mood: typeof moods[0]; size: number }) {
  if (mood.emoji) return <span style={{ fontSize: size, lineHeight: 1, display: 'block' }}>{mood.emoji}</span>;
  if (mood.icon) { const Ic = mood.icon; return <Ic size={size} />; }
  return null;
}

export function MoodCard() {
  const todayKey = `mood_${new Date().toDateString()}`;
  const savedMood = typeof window !== 'undefined' ? localStorage.getItem(todayKey) : null;
  const [selected, setSelected] = useState<number | null>(savedMood !== null ? Number(savedMood) : null);
  const [dismissed, setDismissed] = useState(false);

  const handleSelect = (i: number) => {
    setSelected(i);
    localStorage.setItem(todayKey, String(i));
  };

  if (dismissed) return null;

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
                <div className="flex items-center gap-2 mb-4">
                  <IconBubble size={28} bg={gradients.rose}>
                    <IcHeart size={14} color="#fff" />
                  </IconBubble>
                  <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>今天心情怎么样？</span>
                </div>
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
              <motion.div
                key="done"
                className="flex items-center justify-between"
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <MoodIcon mood={moods[selected]} size={32} />
                  </motion.div>
                  <div>
                    <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>
                      今天感觉{moods[selected].label}
                    </p>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>
                      已记录 · 坚持记录有助于了解自己
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IcSparkle size={12} color={moods[selected].color} />
                  <span style={{ color: moods[selected].color, fontSize: '12px', fontWeight: 600 }}>+5 XP</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
