import { motion } from 'motion/react';
import { IconBubble, IcFire, IcBolt, IcTarget, IcCrown, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

function rankOf(level: number) {
  if (level >= 21) return { rank: '恋爱大师', next: null as string | null };
  if (level >= 16) return { rank: '恋爱达人', next: '恋爱大师' };
  if (level >= 11) return { rank: '恋爱学徒', next: '恋爱达人' };
  if (level >= 6)  return { rank: '恋爱新手', next: '恋爱学徒' };
  return                  { rank: '恋爱新生', next: '恋爱新手' };
}

export function GreetingSection() {
  const user = useUser();
  const xp = user.xp;
  const maxXp = 500;
  const percent = Math.round((xp / maxXp) * 100);
  const remain = Math.max(0, maxXp - xp);
  const { rank, next } = rankOf(user.level || 1);

  const hour = new Date().getHours();
  const greeting = hour < 6 ? '夜深了' : hour < 9 ? '早上好' : hour < 12 ? '上午好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : hour < 22 ? '晚上好' : '夜深了';

  // 根据用户状态动态生成激励文案
  const motivationalLine = (() => {
    if (!user.xp && !user.streak) return '开始你的恋爱成长之旅吧 ✨';
    if (user.streak >= 7) return `连续 ${user.streak} 天，你太棒了！🔥`;
    if (user.streak >= 3) return '保持节奏，你在进步 💪';
    if (hour < 6 || hour >= 22) return '深夜也在修炼，真有毅力 🌙';
    if (hour < 12) return '今天想练点什么？';
    if (remain <= 100) return `还差 ${remain} XP 就升级了！冲一把 🚀`;
    return '今天想练点什么？';
  })();

  return (
    <div className="relative overflow-hidden">
      <div className="px-5 pt-8 pb-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px', marginBottom: 6 }}>{greeting}，{user.name}</p>
          <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0 }}>
            {motivationalLine}
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
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{user.xp}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', display: 'block', marginTop: -1 }}>XP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBubble size={28} bg={gradients.mint}><IcTarget size={14} color="#fff" /></IconBubble>
            <div>
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>Lv.{user.level}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px', display: 'block', marginTop: -1 }}>等级</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
