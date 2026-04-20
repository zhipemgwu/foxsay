import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Play, X, Send, Bot, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcRobot, IcSparkle, IcStar, gradients } from './CuteIcons';

const aiMessages = [
  { role: 'system', text: '场景：你在一家温馨的咖啡馆，注意到邻桌一位正在看书的人，你决定上前搭话...' },
  { role: 'ai', text: '嗨，你好！我注意到你在看《小王子》，这是我最喜欢的书之一。你也喜欢圣埃克苏佩里吗？' },
];

export function HeroCard() {
  const [showSim, setShowSim] = useState(false);
  const [liked, setLiked] = useState(false);
  const [messages, setMessages] = useState(aiMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userMsg = input;
    setInput('');
    setTimeout(() => {
      const responses = [
        '很棒的回答！你的开场自然且有话题延展性。试着在下一句加入一个关于对方的观察。',
        '不错！你展示了真诚的兴趣。AI建议：可以适当分享一个与书相关的个人小故事。',
        '你的表达很有温度！继续保持这种真诚的态度，对方会感受到你的善意。',
      ];
      setMessages(prev => [...prev, {
        role: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1200);
  };

  return (
    <>
      <div className="px-5 pb-8">
        <div className="flex items-center justify-between mb-5">
          <span style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, letterSpacing: '0.2px', lineHeight: 1.19 }}>
            今日精选体验
          </span>
          <button style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 400 }}>查看全部 ›</button>
        </div>

        <motion.div
          className="w-full overflow-hidden p-[1px]"
          style={{
            borderRadius: 13,
            background: 'linear-gradient(135deg, rgba(255,138,128,0.35), rgba(155,126,222,0.2), transparent)',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.985 }}
        >
          <div className="overflow-hidden" style={{ background: '#453a60', borderRadius: 12 }}>
            <div className="relative w-full" style={{ height: 220 }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1679152837040-6f6e13edcd0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMGNhZmUlMjBjb3p5JTIwbW9ybmluZ3xlbnwxfHx8fDE3NzYxNTIyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="今日恋爱体验"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(61,54,80,0.92) 100%)' }} />

              <motion.button
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(210,210,215,0.64)' }}
                whileTap={{ scale: 0.85 }}
                onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              >
                <Heart size={15} color="#FF8A80" strokeWidth={2} fill={liked ? '#FF8A80' : 'transparent'} />
              </motion.button>

              <div className="absolute top-4 left-4 px-2.5 py-1" style={{ background: 'rgba(0,0,0,0.56)', backdropFilter: 'blur(8px)', borderRadius: 980 }}>
                <span style={{ color: '#f5f5f7', fontSize: '12px', fontWeight: 600 }}>🔥 今日热门</span>
              </div>

              <div className="absolute bottom-4 left-5 flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: '#FF8A80' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSim(true)}
                >
                  <Play size={16} color="#2b2535" strokeWidth={2.5} fill="#2b2535" />
                </motion.div>
                <div>
                  <p style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '0px', lineHeight: 1.29 }}>AI 约会模拟</p>
                  <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '12px' }}>咖啡馆初见 · 12 分钟</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={12} color="#FFD93D" strokeWidth={0} fill="#FFD93D" />
                <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>4.92</span>
                <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '14px' }}>(128 次完成)</span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px', lineHeight: 1.43 }}>
                与 AI 进行沉浸式约会情景演练，锻炼开场白与话题延展能力
              </p>
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#f5efe8', fontSize: '17px', fontWeight: 600 }}>免费体验</span>
                  <span style={{ background: 'rgba(255,138,128,0.22)', color: '#FF8A80', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: 5 }}>限时</span>
                </div>
                <motion.button
                  className="px-4 py-2"
                  style={{ background: '#FF8A80', borderRadius: 8, color: '#2b2535', fontSize: '14px', fontWeight: 600 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSim(true)}
                >
                  开始练习
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Conversation Simulator */}
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
            {/* Header */}
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,138,128,0.22)' }}>
                    <Bot size={16} color="#FF8A80" />
                  </div>
                  <div>
                    <p style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>AI 约会教练</p>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>咖啡馆初见 场景</p>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSim(false)}>
                  <X size={22} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
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
                      style={{ background: msg.role === 'system' ? '#574d72' : 'rgba(255,138,128,0.22)' }}>
                      {msg.role === 'system' ? <span style={{ fontSize: '12px' }}>📍</span> : <Bot size={12} color="#FF8A80" />}
                    </div>
                  )}
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      background: msg.role === 'user' ? '#FF8A80' : msg.role === 'system' ? '#574d72' : '#453a60',
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
                      style={{ background: '#574d72' }}>
                      <User size={12} color="#f5efe8" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
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
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: input.trim() ? '#FF8A80' : '#574d72' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                >
                  <Send size={16} color={input.trim() ? '#2b2535' : 'rgba(245,239,232,0.38)'} />
                </motion.button>
              </div>
              <div className="flex gap-2 mt-2">
                {['你好，我注意到...', '这本书真不错', '可以聊聊吗？'].map(s => (
                  <button
                    key={s}
                    className="px-3 py-1.5 flex-shrink-0"
                    style={{ background: '#574d72', borderRadius: 980, color: 'rgba(245,239,232,0.65)', fontSize: '12px' }}
                    onClick={() => { setInput(s); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}