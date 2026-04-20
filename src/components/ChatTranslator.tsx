/**
 * 聊天翻译机 — 粘贴对方消息 → AI 解读潜台词 + 3 种风格回复建议
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Clock, Trash2, ImagePlus, ChevronDown, Camera } from 'lucide-react';
import { IconBubble, IcChat, gradients } from './CuteIcons';
import { KeyboardPromoBanner } from './KeyboardPromoBanner';

const contexts = ['刚认识', '暧昧期', '恋爱中', '冷战中', '分手边缘'] as const;

/* ---------- mock 数据 ---------- */
const mockMeanings: Record<string, string[]> = {
  '刚认识': [
    'TA 对你有初步好感，正在试探你是否值得继续了解',
    'TA 在礼貌性回应，还没有投入太多情感',
    'TA 在观察你的社交能力和情商水平',
  ],
  '暧昧期': [
    'TA 在等你主动推进关系，但不想显得太急切',
    'TA 在用模糊的方式给你信号，想看你能不能读懂',
    'TA 对你有好感但还在犹豫要不要更进一步',
  ],
  '恋爱中': [
    'TA 可能在暗示某种需求没被满足，需要你的关注',
    'TA 希望得到更多情感回应，不只是信息层面的交流',
    'TA 在撒娇，想看你重不重视这段关系',
  ],
  '冷战中': [
    'TA 内心其实很在意，但自尊心让TA 不愿先低头',
    'TA 在等你给一个台阶下，一个真诚的道歉就够了',
    'TA 需要的不是解释，而是被理解和被在乎的感觉',
  ],
  '分手边缘': [
    'TA 可能已经做了心理准备，但还留着最后一丝希望',
    'TA 在测试你是否真的在乎这段关系',
    'TA 的话语里藏着失望，最需要的是行动而非承诺',
  ],
};

function genReplies(ctx: string, msg: string) {
  const short = msg.length < 10;
  const replies: { style: string; icon: string; text: string }[] = [];

  if (ctx === '冷战中' || ctx === '分手边缘') {
    replies.push(
      { style: '温柔型', icon: '🌸', text: '我知道你现在可能不想听我说话，但我真的认真想过了——是我的问题。你愿意给我一个机会当面聊聊吗？' },
      { style: '幽默型', icon: '😄', text: '我查了一下，冷战超过3天要被扣分的。我主动来扣分了，罚站也行🧍' },
      { style: '高情商型', icon: '💎', text: '我理解你需要空间，也尊重你的感受。但我想让你知道——不管怎样，我在。等你准备好了，我们好好谈。' },
    );
  } else if (ctx === '暧昧期') {
    replies.push(
      { style: '温柔型', icon: '🌸', text: short ? '收到～今天过得怎么样？有没有什么开心的事想分享？' : '认真看了你说的，我觉得你这个想法特别有意思。要不找个时间当面聊？打字总觉得说不清楚～' },
      { style: '幽默型', icon: '😄', text: short ? '你这句话我翻译了三遍，结论是——你在想我对吧？😏' : '看完你发的这段话，我的嘴角控制不住地上扬了。旁边的人以为我在看搞笑视频😂' },
      { style: '高情商型', icon: '💎', text: short ? '嗯嗯，我懂你的意思。不过我还挺好奇你这么说背后的想法的～能展开讲讲吗？' : '你说的这些让我对你的了解又多了一层。说实话，越聊越觉得你是个很有想法的人。' },
    );
  } else if (ctx === '恋爱中') {
    replies.push(
      { style: '温柔型', icon: '🌸', text: '宝贝我看到了。你说的每句话我都放在心上，等我忙完就来找你好不好？❤️' },
      { style: '幽默型', icon: '😄', text: '你这是在暗示什么呢？让我掐指一算…你是不是想让我请你吃好吃的？🤔' },
      { style: '高情商型', icon: '💎', text: '我注意到你最近好像有些心事。你不用急着说，但我想让你知道，什么时候想聊了我都在。' },
    );
  } else {
    replies.push(
      { style: '温柔型', icon: '🌸', text: '哈哈谢谢你的分享！我觉得你说得好有道理。诶对了，你平时喜欢做什么呀？' },
      { style: '幽默型', icon: '😄', text: '你这句话信息量好大，我得消化一下😂 不过我觉得我们的聊天越来越有意思了～' },
      { style: '高情商型', icon: '💎', text: '这个话题我之前也想过，不过我的角度可能跟你不太一样。有机会可以交流一下？' },
    );
  }
  return replies;
}

type HistoryItem = { id: number; msg: string; ctx: string; meaning: string; replies: { style: string; icon: string; text: string }[]; time: string };

const HISTORY_KEY = 'chat_translator_history';
function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(h: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)));
}

export function ChatTranslator({ delay = 0 }: { delay?: number }) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<'translate' | 'history'>('translate');
  const [input, setInput] = useState('');
  const [ctxIdx, setCtxIdx] = useState(1);
  const [result, setResult] = useState<null | { meaning: string; replies: { style: string; icon: string; text: string }[] }>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(-1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  const handleTranslate = () => {
    if (!images.length && !input.trim()) return;
    setLoading(true);
    setResult(null);
    // Mock: 截图模式用较长延迟模拟 OCR + AI 分析
    const delay = images.length > 0 ? 1500 : 1000;
    setTimeout(() => {
      const ctx = contexts[ctxIdx];
      const pool = mockMeanings[ctx];
      const meaning = pool[Math.floor(Math.random() * pool.length)];
      const mockInput = input.trim() || `[${images.length} 张聊天截图]`;
      const replies = genReplies(ctx, mockInput);
      setResult({ meaning, replies });
      setLoading(false);
      const item: HistoryItem = {
        id: Date.now(),
        msg: images.length > 0 ? `📸 ${images.length}张截图${input.trim() ? ' + 补充文字' : ''}` : input.slice(0, 100),
        ctx,
        meaning,
        replies,
        time: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [item, ...loadHistory()];
      saveHistory(updated);
      setHistory(updated);
    }, delay);
  };

  const copyText = (idx: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  const handleOpen = () => { setInput(''); setResult(null); setLoading(false); setCopied(-1); setTab('translate'); setHistory(loadHistory()); setImages([]); setShowTextInput(false); setShow(true); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_IMAGES - images.length;
    files.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => prev.length < MAX_IMAGES ? [...prev, reader.result as string] : prev);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

  const canTranslate = images.length > 0 || input.trim().length > 0;

  return (
    <>
      <motion.button
        className="flex items-center gap-3 p-4 text-left"
        style={{ background: '#453a60', borderRadius: 14 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        onClick={handleOpen}
      >
        <IconBubble size={42} bg={gradients.purple}><IcChat size={20} color="#fff" /></IconBubble>
        <div className="flex-1 min-w-0">
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>聊天翻译机</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>解读TA的潜台词</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {show && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShow(false)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0', maxHeight: '88vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: '88vh' }}>

                {/* 顶栏 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <IconBubble size={32} bg={gradients.purple}><IcChat size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>聊天翻译机</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>截图上传 → 秒懂TA的心</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShow(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* Tab 切换 */}
                <div className="flex gap-2 mb-4">
                  {[{ key: 'translate' as const, label: '翻译' }, { key: 'history' as const, label: `历史 ${history.length > 0 ? `(${history.length})` : ''}` }].map(t => (
                    <motion.button key={t.key} className="px-4 py-1.5"
                      style={{
                        borderRadius: 20,
                        background: tab === t.key ? 'rgba(155,126,222,0.25)' : 'rgba(245,239,232,0.06)',
                        border: tab === t.key ? '1px solid rgba(155,126,222,0.4)' : '1px solid rgba(245,239,232,0.06)',
                        color: tab === t.key ? '#c4b5fd' : 'rgba(245,239,232,0.5)',
                        fontSize: 13, fontWeight: 600,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTab(t.key)}>
                      {t.key === 'history' && <Clock size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />}
                      {t.label}
                    </motion.button>
                  ))}
                </div>

                {tab === 'translate' && (<>
                {/* 关系阶段选择 */}
                <div className="mb-4">
                  <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>你们目前的关系阶段：</span>
                  <div className="flex flex-wrap gap-2">
                    {contexts.map((c, ci) => (
                      <motion.button key={c} className="px-3 py-1.5"
                        style={{
                          borderRadius: 20,
                          background: ci === ctxIdx ? 'rgba(155,126,222,0.25)' : 'rgba(245,239,232,0.06)',
                          border: ci === ctxIdx ? '1px solid rgba(155,126,222,0.5)' : '1px solid rgba(245,239,232,0.08)',
                          color: ci === ctxIdx ? '#c4b5fd' : 'rgba(245,239,232,0.55)',
                          fontSize: 12, fontWeight: 600,
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCtxIdx(ci)}>
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 截图上传（主入口） */}
                <div className="mb-4">
                  <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>上传聊天截图：</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />

                  {images.length === 0 ? (
                    <motion.button className="w-full flex flex-col items-center justify-center gap-2 py-8"
                      style={{ background: '#352f45', borderRadius: 14, border: '2px dashed rgba(155,126,222,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileRef.current?.click()}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(155,126,222,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={24} color="#B39DDB" />
                      </div>
                      <span style={{ color: '#B39DDB', fontSize: 14, fontWeight: 600 }}>点击上传聊天截图</span>
                      <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>支持多张截图，最多 {MAX_IMAGES} 张</span>
                    </motion.button>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {images.map((src, i) => (
                        <div key={i} className="relative" style={{ width: 72, height: 96, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(245,239,232,0.1)' }}>
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <motion.button className="absolute flex items-center justify-center"
                            style={{ top: 2, right: 2, width: 20, height: 20, borderRadius: 10, background: 'rgba(0,0,0,0.6)' }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeImage(i)}>
                            <X size={12} color="#fff" />
                          </motion.button>
                        </div>
                      ))}
                      {images.length < MAX_IMAGES && (
                        <motion.button className="flex flex-col items-center justify-center gap-1"
                          style={{ width: 72, height: 96, borderRadius: 10, border: '2px dashed rgba(155,126,222,0.25)', background: 'rgba(155,126,222,0.05)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => fileRef.current?.click()}>
                          <ImagePlus size={18} color="rgba(155,126,222,0.6)" />
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>添加</span>
                        </motion.button>
                      )}
                    </div>
                  )}
                  {images.length > 0 && (
                    <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11, display: 'block', marginTop: 6 }}>{images.length}/{MAX_IMAGES} 张</span>
                  )}
                </div>

                {/* 文字输入（折叠辅助入口） */}
                <div className="mb-4">
                  <motion.button className="flex items-center gap-1.5 mb-2" onClick={() => setShowTextInput(p => !p)} whileTap={{ scale: 0.97 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(245,239,232,0.08)', minWidth: 40 }} />
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11, whiteSpace: 'nowrap' }}>或手动输入消息</span>
                    <motion.span animate={{ rotate: showTextInput ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={12} color="rgba(245,239,232,0.35)" />
                    </motion.span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(245,239,232,0.08)', minWidth: 40 }} />
                  </motion.button>
                  <AnimatePresence>
                    {showTextInput && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <textarea
                          className="w-full p-4 resize-none"
                          style={{
                            background: '#352f45', borderRadius: 14, color: '#f5efe8', fontSize: 14,
                            border: '1px solid rgba(245,239,232,0.1)', minHeight: 80, outline: 'none',
                          }}
                          placeholder="把对方的消息粘贴到这里…"
                          value={input}
                          onChange={e => setInput(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 翻译按钮 */}
                <motion.button className="w-full py-3.5 mb-5 flex items-center justify-center gap-2"
                  style={{
                    background: canTranslate ? gradients.purple : 'rgba(245,239,232,0.08)',
                    borderRadius: 14,
                    color: canTranslate ? '#fff' : 'rgba(245,239,232,0.3)',
                    fontSize: 15, fontWeight: 600,
                  }}
                  whileTap={canTranslate ? { scale: 0.98 } : {}}
                  onClick={handleTranslate}>
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>🔮</motion.span>
                  ) : '🔮 开始翻译'}
                </motion.button>

                {/* 结果 */}
                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      {/* 潜台词解读 */}
                      <div className="p-4 mb-4" style={{ background: 'rgba(155,126,222,0.1)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.2)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: 16 }}>💡</span>
                          <span style={{ color: '#c4b5fd', fontSize: 14, fontWeight: 700 }}>TA 的潜台词</span>
                        </div>
                        <p style={{ color: '#f5efe8', fontSize: 14, lineHeight: 1.7 }}>{result.meaning}</p>
                      </div>

                      {/* 回复建议 */}
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: 14 }}>📝</span>
                        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>推荐回复</span>
                        <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>点击复制</span>
                      </div>
                      {result.replies.map((r, ri) => (
                        <motion.button
                          key={ri}
                          className="w-full text-left p-4 mb-2.5"
                          style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(245,239,232,0.06)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => copyText(ri, r.text)}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ri * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: 14 }}>{r.icon}</span>
                              <span style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 600 }}>{r.style}</span>
                            </div>
                            {copied === ri ? (
                              <div className="flex items-center gap-1">
                                <Check size={12} color="#4ECDC4" />
                                <span style={{ color: '#4ECDC4', fontSize: 11 }}>已复制</span>
                              </div>
                            ) : (
                              <Copy size={14} color="rgba(245,239,232,0.3)" />
                            )}
                          </div>
                          <p style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.65 }}>{r.text}</p>
                        </motion.button>
                      ))}
                      <KeyboardPromoBanner hint="下次聊天时直接用 FoxSay 键盘 · 免复制一键发送" />
                    </motion.div>
                  )}
                </AnimatePresence>
                </>)}

                {tab === 'history' && (
                  <div className="flex flex-col gap-2">
                    {history.length === 0 ? (
                      <div className="text-center py-10">
                        <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📭</span>
                        <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 13 }}>暂无翻译记录</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12 }}>最近 {history.length} 条记录</span>
                          <motion.button className="flex items-center gap-1 px-2 py-1" style={{ borderRadius: 6, background: 'rgba(255,138,128,0.08)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { saveHistory([]); setHistory([]); }}>
                            <Trash2 size={11} color="rgba(255,138,128,0.6)" />
                            <span style={{ color: 'rgba(255,138,128,0.6)', fontSize: 11 }}>清空</span>
                          </motion.button>
                        </div>
                        {history.map(h => (
                          <motion.div key={h.id} className="p-3" style={{ background: '#352f45', borderRadius: 12, border: '1px solid rgba(245,239,232,0.06)' }}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5" style={{ background: 'rgba(155,126,222,0.15)', borderRadius: 6, color: '#B39DDB', fontSize: 10, fontWeight: 600 }}>{h.ctx}</span>
                              <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>{h.time}</span>
                            </div>
                            <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12, marginBottom: 4, lineHeight: 1.5 }}>「{h.msg}」</p>
                            <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>💡 {h.meaning}</p>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
