/**
 * 今日场景 — 每天轮换不同约会/社交场景推荐，合并原 HeroCard + FeatureGrid
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Play, X, Send, Bot, User, Clock, Users, ChevronRight, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcSparkle, gradients } from './CuteIcons';

const allScenes = [
  {
    id: 1, title: '咖啡馆初遇', sub: '约 12 分钟', rating: '4.92', tag: '🔥 今日热门',
    desc: '与 AI 进行沉浸式约会情景演练，锻炼开场白与话题延展能力',
    skills: ['开场白', '话题延展', '氛围感'],
    participants: 1280,
    image: 'https://images.unsplash.com/photo-1679152837040-6f6e13edcd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMGNhZmUlMjBjb3p5JTIwbW9ybmluZ3xlbnwxfHx8fDE3NzYxNTIyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    opening: '场景：你在一家温馨的咖啡馆，注意到邻桌一位正在看书的人，你决定上前搭话...',
    firstMsg: '嗨，你好！我注意到你在看《小王子》，这是我最喜欢的书之一。你也喜欢圣埃克苏佩里吗？',
  },
  {
    id: 2, title: '浪漫晚餐约会', sub: '约 8 分钟', rating: '4.88', tag: '✨ 新上线',
    desc: '学会在高级餐厅约会时的礼仪和对话技巧，从点菜到告别全流程演练',
    skills: ['餐桌礼仪', '话题引导', '氛围感'],
    participants: 1680,
    image: 'https://images.unsplash.com/photo-1773188243397-29591fa09047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGlubmVyJTIwZGF0ZSUyMGNhbmRsZWxpZ2h0JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzYxNTIyNjh8MA&ixlib=rb-4.1.0&q=80&w=600',
    opening: '场景：你在一家精致的西餐厅等待约会对象，TA 刚刚到达...',
    firstMsg: '你来了！这里的环境不错吧？我特意提前订了靠窗的位置，听说落日的时候特别美。',
  },
  {
    id: 3, title: '公园午后漫步', sub: '约 10 分钟', rating: '4.95', tag: '💫 热门',
    desc: '自然户外环境中的对话练习，学习如何在轻松氛围里展开深度话题',
    skills: ['自然开场', '深入话题', '肢体语言'],
    participants: 2340,
    image: 'https://images.unsplash.com/photo-1764153466617-08a9a40a7c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB3YWxraW5nJTIwYXV0dW1uJTIwcGFyayUyMHJvbWFudGljfGVufDF8fHx8MTc3NjE1MjI3MHww&ixlib=rb-4.1.0&q=80&w=600',
    opening: '场景：周末午后，你们约在一个安静的公园散步，阳光温暖舒适...',
    firstMsg: '今天天气真好！你看那边的银杏树都变金黄了，我上次来的时候还是绿色的呢。',
  },
  {
    id: 4, title: '书店偶遇', sub: '约 9 分钟', rating: '4.90', tag: '📚 文艺',
    desc: '在书店的安静氛围中练习优雅搭话，学习用兴趣爱好建立深度连接',
    skills: ['兴趣共鸣', '文化话题', '自然推进'],
    participants: 890,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    opening: '场景：你在一家独立书店的文学区浏览，发现旁边的人也在看同一个书架...',
    firstMsg: '不好意思，我注意到你也在看村上春树的区域。你有什么推荐吗？我正在犹豫选哪一本。',
  },
  {
    id: 5, title: '健身房邂逅', sub: '约 8 分钟', rating: '4.85', tag: '💪 活力',
    desc: '在运动场景中练习自然搭话，用共同兴趣打开话题',
    skills: ['自然开场', '运动话题', '邀约技巧'],
    participants: 1120,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    opening: '场景：你在健身房完成训练后，在休息区遇到一个友善的人...',
    firstMsg: '嗨！刚注意到你也在练核心，你的动作好标准。有什么训练秘诀可以分享吗？',
  },
  {
    id: 6, title: '展览馆约会', sub: '约 11 分钟', rating: '4.93', tag: '🎨 艺术',
    desc: '在艺术展览中学习用审美和感受力建立深度情感连接',
    skills: ['审美表达', '感受分享', '深度连接'],
    participants: 760,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    opening: '场景：你们一起去看一个当代艺术展，走到一幅有意思的画作前...',
    firstMsg: '这幅画好有意思，我觉得它在表达一种…孤独中的自由？你看到了什么？',
  },
  {
    id: 7, title: '深夜便利店', sub: '约 7 分钟', rating: '4.87', tag: '🌙 治愈',
    desc: '深夜场景中练习温暖且有边界感的对话，学习在不经意间传递关心',
    skills: ['边界感', '温暖表达', '共情力'],
    participants: 1540,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    opening: '场景：深夜11点的便利店，你在挑选夜宵时遇到了一个看起来有些疲惫的人...',
    firstMsg: '这么晚还在加班吗？推荐试试这家店新出的关东煮，热乎乎的特别治愈。',
  },
];

const aiResponses = [
  '很棒的回答！你的开场自然且有话题延展性。试着在下一句加入一个关于对方的观察。',
  '不错！你展示了真诚的兴趣。AI建议：可以适当分享一个与话题相关的个人小故事。',
  '你的表达很有温度！继续保持这种真诚的态度，对方会感受到你的善意。',
  '很好的回应！你注意到了对方的情绪变化。下一步可以尝试提一个开放式问题。',
  '这个回答展示了你的幽默感，AI建议：适当加入一些认真的部分，让对话有层次感。',
];

export function TodayScene() {
  const [showSim, setShowSim] = useState(false);
  const [liked, setLiked] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  // 基于日期选择今日场景（每天轮换）
  const todayScene = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return allScenes[dayOfYear % allScenes.length];
  }, []);

  // 明日预告
  const tomorrowScene = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return allScenes[(dayOfYear + 1) % allScenes.length];
  }, []);

  const startSim = () => {
    setMessages([
      { role: 'system', text: todayScene.opening },
      { role: 'ai', text: todayScene.firstMsg },
    ]);
    setInput('');
    setShowSim(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)]
      }]);
    }, 1200);
  };

  return (
    <>
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px', lineHeight: 1.19 }}>今日场景</span>
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <IcSparkle size={14} color="#FFD93D" />
            </motion.div>
          </div>
          <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: '12px' }}>每日更新</span>
        </div>

        {/* 主推荐卡片 */}
        <motion.div
          className="w-full overflow-hidden p-[1px]"
          style={{
            borderRadius: 13,
            background: 'linear-gradient(135deg, rgba(255,138,128,0.35), rgba(155,126,222,0.2), transparent)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-hidden" style={{ background: '#453a60', borderRadius: 12 }}>
            <div className="relative w-full" style={{ height: 200 }}>
              <ImageWithFallback
                src={todayScene.image}
                alt={todayScene.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(61,54,80,0.92) 100%)' }} />

              <motion.button
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(210,210,215,0.64)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              >
                <Heart size={15} color="#FF8A80" strokeWidth={2} fill={liked ? '#FF8A80' : 'transparent'} />
              </motion.button>

              <div className="absolute top-4 left-4 px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.56)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 980 }}>
                <span style={{ color: '#f5f5f7', fontSize: '12px', fontWeight: 600 }}>{todayScene.tag}</span>
              </div>

              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: '#FF8A80' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={startSim}
                    >
                      <Play size={16} color="#2b2535" strokeWidth={2.5} fill="#2b2535" />
                    </motion.div>
                    <div>
                      <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '0px', lineHeight: 1.29 }}>{todayScene.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '12px' }}>{todayScene.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} color="#FFD93D" strokeWidth={0} fill="#FFD93D" />
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{todayScene.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px', lineHeight: 1.43, marginBottom: 12 }}>
                {todayScene.desc}
              </p>
              <div className="flex items-center gap-2 mb-4">
                {todayScene.skills.map(s => (
                  <span key={s} className="px-2.5 py-1" style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 6, color: '#FF8A80', fontSize: '11px', fontWeight: 600 }}>{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users size={12} color="rgba(245,239,232,0.45)" />
                    <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>{todayScene.participants}人参与</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} color="rgba(245,239,232,0.45)" />
                    <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>{todayScene.sub}</span>
                  </div>
                </div>
                <motion.button
                  className="px-4 py-2 flex items-center gap-1"
                  style={{ background: '#FF8A80', borderRadius: 8, color: '#2b2535', fontSize: '14px', fontWeight: 600 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startSim}
                >
                  开始练习
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 明日预告 */}
        <motion.div
          className="mt-3 p-3 flex items-center gap-3"
          style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback src={tomorrowScene.image} alt={tomorrowScene.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10, fontWeight: 600 }}>明日预告</span>
            <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12, fontWeight: 600 }}>{tomorrowScene.title}</p>
          </div>
          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11 }}>{tomorrowScene.tag}</span>
        </motion.div>
      </div>

      {/* AI 对话模拟器 */}
      <AnimatePresence>
        {showSim && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,138,128,0.22)' }}>
                    <Bot size={16} color="#FF8A80" />
                  </div>
                  <div>
                    <p style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>AI 约会教练</p>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{todayScene.title}</p>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSim(false)}>
                  <X size={22} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1"
                      style={{ background: msg.role === 'system' ? '#453a60' : 'rgba(255,138,128,0.22)' }}>
                      {msg.role === 'system' ? <span style={{ fontSize: '12px' }}>📍</span> : <Bot size={12} color="#FF8A80" />}
                    </div>
                  )}
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      background: msg.role === 'user' ? '#FF8A80' : '#453a60',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      color: msg.role === 'user' ? '#2b2535' : msg.role === 'system' ? 'rgba(245,239,232,0.75)' : '#f5efe8',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      fontStyle: msg.role === 'system' ? 'italic' : 'normal',
                    }}
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-2 mt-1"
                      style={{ background: '#453a60' }}>
                      <User size={12} color="#f5efe8" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
              {/* 快捷回复 */}
              <div className="flex gap-2 mb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {['你好，很高兴认识你！', '这个地方真不错', '你经常来这里吗？'].map(q => (
                  <button key={q} className="flex-shrink-0 px-3 py-1.5"
                    style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 20, color: '#FF8A80', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}
                    onClick={() => { setInput(q); }}>
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="输入你的回答..."
                  className="flex-1 h-11 px-4 bg-transparent outline-none"
                  style={{ background: '#453a60', borderRadius: 22, color: '#f5efe8', fontSize: '14px' }}
                />
                <motion.button
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: input.trim() ? '#FF8A80' : 'rgba(245,239,232,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                >
                  <Send size={16} color={input.trim() ? '#2b2535' : 'rgba(245,239,232,0.35)'} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
