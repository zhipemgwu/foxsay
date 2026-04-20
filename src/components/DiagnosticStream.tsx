/**
 * 今日洞察 — 规则引擎版（A 方案）
 * 
 * 推送逻辑：基于真实用户数据动态生成洞察，而非静态硬编码。
 * 数据源：abilityScores / streak / heatup_history / 今日 check-in / 今日任务 / speciesName
 */
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { IconBubble, IcHeart, IcChart, IcTarget, IcLightbulb, IcSparkle, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

type Insight = {
  id: string;
  icon: JSX.Element;
  bg: string;
  title: string;
  desc: string;
  priority: number; // 数字越大越优先展示
};

const abilityLabel: Record<string, string> = {
  opener: '开场力', empathy: '共情力', observe: '观察力', topic: '话题力', safety: '安全感',
};

const abilityAdvice: Record<string, string> = {
  opener: '试试从对方当下的状态切入，比硬聊天气自然得多',
  empathy: '下次对话先复述对方感受再给建议，效果翻倍',
  observe: '练习捕捉对方的细节变化，比如头发、语气、表情',
  topic: '准备 3 个"深度问题"，比如「最近什么事让你挺有感触」',
  safety: '每天一次「稳定回应」：说到做到，不忽冷忽热',
};

/** 从 localStorage 读取 check-in 历史 */
function loadHeatupHistory(): Array<{ date: string; scores: [number, number, number] }> {
  try {
    const raw = localStorage.getItem('foxsay_heatup_history');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/** 生成今日洞察列表 —— 基于真实数据 */
function generateInsights(
  user: any,
  isCheckInDone: boolean,
  taskProgress: { done: number; total: number },
  history: Array<{ date: string; scores: [number, number, number] }>
): Insight[] {
  const out: Insight[] = [];
  const abilityScores = user.abilityScores as Record<string, number> | null;
  const streak = user.streak || 0;

  // —— 规则 1：未 check-in 提醒（优先级最高）
  if (!isCheckInDone) {
    out.push({
      id: 'checkin-remind',
      icon: <IcHeart size={18} color="#fff" />,
      bg: gradients.rose,
      title: '今日感情加热还没做',
      desc: '花 1 分钟 check-in，让我了解你今天的状态',
      priority: 100,
    });
  }

  // —— 规则 2：能力弱项建议
  if (abilityScores) {
    const entries = Object.entries(abilityScores);
    entries.sort((a, b) => a[1] - b[1]);
    const [weakKey, weakVal] = entries[0];
    const [strongKey, strongVal] = entries[entries.length - 1];

    if (weakVal < 40) {
      out.push({
        id: `weak-${weakKey}`,
        icon: <IcTarget size={18} color="#fff" />,
        bg: gradients.coral,
        title: `你的【${abilityLabel[weakKey]}】偏弱（${weakVal}分）`,
        desc: abilityAdvice[weakKey] || '今天找个场景专门练一下',
        priority: 80,
      });
    }

    if (strongVal >= 70) {
      out.push({
        id: `strong-${strongKey}`,
        icon: <IcChart size={18} color="#fff" />,
        bg: gradients.mint,
        title: `【${abilityLabel[strongKey]}】是你的强项（${strongVal}分）`,
        desc: '继续用这个优势切入对话，能让互动更自然',
        priority: 60,
      });
    }
  }

  // —— 规则 3：连续 check-in 节点
  if (streak >= 1) {
    if (streak === 2) {
      out.push({
        id: 'streak-2',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.golden,
        title: `已连续 ${streak} 天，再坚持 1 天解锁🔥`,
        desc: '明天 check-in 就能拿到「三日之火」徽章',
        priority: 75,
      });
    } else if (streak >= 3 && streak < 7) {
      out.push({
        id: 'streak-to-7',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.golden,
        title: `🔥 连续 ${streak} 天，距⭐一周之星还差 ${7 - streak} 天`,
        desc: '习惯正在养成，不要在第 7 天前断档',
        priority: 70,
      });
    } else if (streak >= 7 && streak < 14) {
      out.push({
        id: 'streak-to-14',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.golden,
        title: `⭐ 已连续 ${streak} 天，双周达人还差 ${14 - streak} 天`,
        desc: '你的坚持已经超过 80% 的用户',
        priority: 70,
      });
    } else if (streak >= 14 && streak < 30) {
      out.push({
        id: 'streak-to-30',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.golden,
        title: `💎 ${streak} 天！月度王者还差 ${30 - streak} 天`,
        desc: '这是真正的高手节奏',
        priority: 70,
      });
    }
  }

  // —— 规则 4：历史趋势对比（最近两次 check-in）
  if (history.length >= 2) {
    const latest = history[history.length - 1];
    const prev = history[history.length - 2];
    const dims = ['温度', '亲密', '成长'];
    let biggestUp = -1; let biggestUpVal = 0;
    let biggestDown = -1; let biggestDownVal = 0;
    for (let i = 0; i < 3; i++) {
      const diff = latest.scores[i] - prev.scores[i];
      if (diff > biggestUpVal) { biggestUpVal = diff; biggestUp = i; }
      if (diff < biggestDownVal) { biggestDownVal = diff; biggestDown = i; }
    }
    if (biggestUp >= 0 && biggestUpVal >= 5) {
      out.push({
        id: 'trend-up',
        icon: <IcChart size={18} color="#fff" />,
        bg: gradients.mint,
        title: `你的【${dims[biggestUp]}】上升了 ${biggestUpVal} 分`,
        desc: '最近做的事情是对的，保持这个节奏',
        priority: 65,
      });
    }
    if (biggestDown >= 0 && biggestDownVal <= -5) {
      out.push({
        id: 'trend-down',
        icon: <IcChart size={18} color="#fff" />,
        bg: gradients.coral,
        title: `【${dims[biggestDown]}】下降了 ${Math.abs(biggestDownVal)} 分`,
        desc: '看看最近是不是太忙忽略了关系维护',
        priority: 75,
      });
    }
  }

  // —— 规则 5：今日任务进度
  if (taskProgress.total > 0) {
    const remain = taskProgress.total - taskProgress.done;
    if (taskProgress.done === taskProgress.total) {
      out.push({
        id: 'tasks-done',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.mint,
        title: '今日任务全部完成',
        desc: '给自己一个赞，明天继续 ✨',
        priority: 50,
      });
    } else if (taskProgress.done > 0 && remain <= 2) {
      out.push({
        id: 'tasks-almost',
        icon: <IcTarget size={18} color="#fff" />,
        bg: gradients.golden,
        title: `还差 ${remain} 项任务就全部完成`,
        desc: '顺手收个尾，今天就完美收官',
        priority: 55,
      });
    }
  }

  // —— 规则 6：物种特征话术（如果有）
  if (user.speciesName) {
    out.push({
      id: 'species',
      icon: <IcLightbulb size={18} color="#fff" />,
      bg: gradients.purple,
      title: `${user.speciesEmoji || '🦊'}${user.speciesName}的你，有独特优势`,
      desc: '在个人中心查看你的物种养成路径',
      priority: 40,
    });
  }

  // —— 兜底：如果没有任何规则命中，用新手引导
  if (out.length === 0) {
    out.push(
      {
        id: 'fallback-1',
        icon: <IcSparkle size={18} color="#fff" />,
        bg: gradients.golden,
        title: '欢迎来到恋爱实验室',
        desc: '完成第一次 check-in，解锁你的专属洞察',
        priority: 10,
      },
      {
        id: 'fallback-2',
        icon: <IcHeart size={18} color="#fff" />,
        bg: gradients.rose,
        title: '每天 10 分钟，提升恋爱力',
        desc: '从一句"你好"开始，AI 教练会陪你一步步练习',
        priority: 10,
      },
      {
        id: 'fallback-3',
        icon: <IcTarget size={18} color="#fff" />,
        bg: gradients.mint,
        title: '先试试"初遇"章节',
        desc: '轻松场景适合新手，咖啡馆里的偶遇等你开启',
        priority: 10,
      }
    );
  }

  // 按 priority 降序，最多保留 5 条
  return out.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

export function DiagnosticStream() {
  const user = useUser() as any;
  const [tick, setTick] = useState(0); // 用于触发重新计算（check-in 完成/任务变化时）

  // 今日 check-in 状态
  const isCheckInDone = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(`heatup_${new Date().toDateString()}`);
  }, [tick]);

  // 今日任务进度
  const taskProgress = useMemo(() => {
    if (typeof window === 'undefined') return { done: 0, total: 5 };
    try {
      const raw = localStorage.getItem(`tasks_${new Date().toDateString()}`);
      const done = raw ? (JSON.parse(raw) as number[]).length : 0;
      return { done, total: 5 };
    } catch { return { done: 0, total: 5 }; }
  }, [tick]);

  // 历史趋势
  const history = useMemo(() => loadHeatupHistory(), [tick]);

  // 监听数据变化事件（check-in 完成、任务勾选）
  useEffect(() => {
    const bump = () => setTick(t => t + 1);
    window.addEventListener('foxsay_checkin_done', bump);
    window.addEventListener('storage', bump);
    const interval = setInterval(bump, 30000); // 每 30 秒兜底刷新一次
    return () => {
      window.removeEventListener('foxsay_checkin_done', bump);
      window.removeEventListener('storage', bump);
      clearInterval(interval);
    };
  }, []);

  const activeInsights = useMemo(
    () => generateInsights(user, isCheckInDone, taskProgress, history),
    [user, isCheckInDone, taskProgress, history]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = activeInsights[currentIndex % activeInsights.length];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeInsights.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, activeInsights.length]);

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-3 h-3">
            <motion.div className="w-2 h-2 rounded-full" style={{ background: '#FF8A80' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
            <motion.div className="absolute w-3 h-3 rounded-full" style={{ background: 'rgba(255,138,128,0.35)' }} animate={{ scale: [0.5, 1.3], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </div>
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px' }}>今日洞察</span>
        </div>
      </div>

      <div className="overflow-hidden p-[1px]" style={{
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(255,138,128,0.3), rgba(155,126,222,0.18), transparent)',
      }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div style={{ background: '#453a60', borderRadius: 15 }}>
          <div style={{ height: 84, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="absolute inset-0 flex items-center px-5 cursor-pointer"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <IconBubble size={44} bg={current.bg} glow>{current.icon}</IconBubble>
                <div className="flex-1 min-w-0 ml-4">
                  <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600, marginBottom: 2 }}>{current.title}</p>
                  <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '12px' }}>{current.desc}</p>
                </div>
                <ChevronRight size={16} color="rgba(245,239,232,0.55)" strokeWidth={2} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5 px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)' }}>
            {activeInsights.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full cursor-pointer"
                style={{ height: 3, background: i === currentIndex % activeInsights.length ? '#FF8A80' : 'rgba(245,239,232,0.15)' }}
                animate={{ width: i === currentIndex % activeInsights.length ? 16 : 5 }}
                transition={{ duration: 0.25 }}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', cursor: 'pointer' }}
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeInsights.length)}>
              {currentIndex % activeInsights.length + 1}/{activeInsights.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
