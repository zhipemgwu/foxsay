/**
 * 朋友圈助手 — 文案生成 / 人设诊断 / 发圈策略
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, ChevronRight } from 'lucide-react';
import { IconBubble, IcPen, gradients } from './CuteIcons';

/* ---------- 常量 ---------- */
const tabs = ['文案生成', '人设诊断', '发圈策略'] as const;
type Tab = typeof tabs[number];

const scenes = [
  { label: '旅行', emoji: '✈️' },
  { label: '美食', emoji: '🍜' },
  { label: '日常', emoji: '☀️' },
  { label: '心情', emoji: '🌙' },
  { label: '健身', emoji: '💪' },
  { label: '音乐', emoji: '🎵' },
];
const styles = [
  { label: '文艺', emoji: '🌿' },
  { label: '搞笑', emoji: '😂' },
  { label: '高级', emoji: '✨' },
  { label: '清新', emoji: '🌸' },
];

/* ---------- mock 文案库 ---------- */
const captionPool: Record<string, Record<string, string[]>> = {
  '旅行': {
    '文艺': ['脚步丈量不了的远方，心里的风景替你记住了。', '在陌生的城市走着走着，突然觉得自己像首还没写完的诗。', '翻山越岭来见你，说的不是远方，是此刻。'],
    '搞笑': ['朋友圈周更游记，欢迎取关。', '钱包：你还来？ 我：闭嘴，这是精神食粮。', '去旅行了才知道，床还是家里的香。'],
    '高级': ['有些目的地，去之前是攻略，去之后是故事。', '在地图上多一个坐标，在记忆里多一种光线。', '走过的路都是简历，看过的风景都是底气。'],
    '清新': ['蓝天很蓝，日子很慢，风很轻地吹过耳旁。', '今日份的好天气和好心情，都收下了。', '走在路上的时候，什么烦恼都被风吹散了。'],
  },
  '美食': {
    '文艺': ['有些味道是时间煮出来的，有些想念也是。', '食物是不会说谎的温柔——它只负责让你幸福。', '深夜的灯光和热气腾腾的碗，是成年人最朴素的浪漫。'],
    '搞笑': ['减肥从明天开始，今天先让嘴巴过过年。', '卡路里：你好。我：再见。（一口吞掉）', '食物面前，我永远丧失理智。'],
    '高级': ['一道菜的精致，在于做的人是否认真对待了每一个步骤。', '美食不需要滤镜，它自带让人微笑的能力。', '吃得讲究不是作，是对生活的尊重。'],
    '清新': ['今天被一杯奶茶治愈了。', '阳光正好，甜品正甜。', '小小的满足感，来自一口刚出炉的面包。'],
  },
  '日常': {
    '文艺': ['日子是细碎的光，每一天都值得被收集。', '平凡到发光的日常，也需要有人见证。', '在重复的节奏里找到不重复的心情。'],
    '搞笑': ['没什么惊天动地的事，就是想冒个泡证明我还活着。', '今日份营业结束，明日份懒癌上线。', '你问我今天干了什么？活着就够累了好吧。'],
    '高级': ['高质量的日常，是把每件小事做到让自己满意。', '不需要仪式感来提醒自己生活的质感。', '把平淡过成限量版。'],
    '清新': ['今天的风好温柔，像有人在轻轻说"辛苦了"。', '出门遛了个弯，遛回来了一份好心情。', '阳台上的花又开了一朵，跟你分享。'],
  },
  '心情': {
    '文艺': ['情绪是透明的水，你往里滴什么颜色，它就变什么色。', '也没有多难过，就是月亮太圆了，想找人说说话。', '有时候不说话不是沉默，是安静地消化自己。'],
    '搞笑': ['心情如天气，多云转矫情。', '今日情绪指数：起床60分，午饭后80分，现在——别问了。', 'EMO了五分钟，然后饿了，于是决定先吃饭再EMO。'],
    '高级': ['情绪自由比财务自由更奢侈。', '能跟自己和解的人，不会跟全世界较劲。', '低谷期不可怕，可怕的是你以为那就是终点。'],
    '清新': ['今天的心情被一杯热茶暖回来了。', '有些日子不太好过，但它终归会过去的。', '给自己一个拥抱，你已经做得很好了。'],
  },
  '健身': {
    '文艺': ['每一滴汗水都是跟昨天的自己告别。', '在跑步的时候想通了一些事，速度是思考的催化剂。', '身体在蜕变，心也在变得更结实。'],
    '搞笑': ['练了一小时，拍照半小时，修图一小时。', '你问我为什么健身？因为奶茶不能白喝啊。', '今天的运动量：从沙发到冰箱，往返6次。'],
    '高级': ['自律的代价很贵，但回报更贵。', '没有捷径，只有日复一日。', '掌控身体的人，更能掌控人生。'],
    '清新': ['出了一身汗，感觉整个人都轻了。', '跑步的时候，连空气都变甜了。', '今日份运动打卡，对自己说一声加油。'],
  },
  '音乐': {
    '文艺': ['最懂你的不是某个人，是某首歌里的某一句。', '循环播放不是因为好听，是因为它正好在说你不敢说的话。', '音乐是隐形的日记本。'],
    '搞笑': ['有些歌听一万遍还能哭，我怀疑我是歌曲的舔狗。', '单曲循环一整天，同事以为我失恋了。其实只是旋律上头。', '唱K得分52，但气势是满分。'],
    '高级': ['品味不在于听什么，在于听的时候你在想什么。', '好的音乐会替你完成那些未竟的表达。', '耳机里有自己的平行世界。'],
    '清新': ['今天被一首歌治愈了，分享给你。', '下雨天 + 咖啡 + 这首歌 = 一切都刚刚好。', '有些旋律自带微笑功能。'],
  },
};

/* ---------- 人设诊断问题 ---------- */
const diagQuestions = [
  { q: '你的头像是？', options: ['自拍/高清照', '风景/宠物', '卡通/二次元', '品牌/纯色', '很久没换了'] },
  { q: '朋友圈更新频率？', options: ['每天都发', '一周2-3次', '一月几条', '几乎不发', '设了三天可见'] },
  { q: '最近一条朋友圈是？', options: ['生活记录', '转发文章', '广告/工作', '发了又删了', '想不起来'] },
  { q: '你的签名是？', options: ['走心的一句话', '空白', 'emoji组合', '默认签名', '表达态度'] },
];

const diagResults = [
  { score: 92, level: 'S 级人设', color: '#FFD93D', summary: '你的朋友圈经营非常出色！内容有质感，更新频率适中，头像得体。', tips: ['保持节奏感，继续展示多面向', '适当增加互动性内容', '偶尔设置悬念，激发好奇心'] },
  { score: 75, level: 'A 级人设', color: '#4ECDC4', summary: '整体不错但有明显提升空间。你的内容真实但缺少规划感。', tips: ['换一个更有辨识度的头像', '内容类型要多样化（工作+生活+兴趣）', '减少转发，增加原创表达'] },
  { score: 58, level: 'B 级人设', color: '#FF8A80', summary: '朋友圈对你来说更像存储而非展示。需要重新思考它的社交价值。', tips: ['先从换头像和签名开始', '每周至少发1条有质量的原创', '三天可见会让对方觉得你有防备心'] },
  { score: 40, level: 'C 级人设', color: '#9B7EDE', summary: '你的朋友圈几乎是空白的，对方看不到任何了解你的入口。', tips: ['紧急补几条优质内容（旅行、美食、爱好）', '头像换成清晰的正面照', '签名写一句轻松有趣的话', '关掉三天可见'] },
];

/* ---------- 发圈策略 ---------- */
const strategyTargets = [
  { label: '想吸引暗恋对象', emoji: '💕' },
  { label: '想让前任后悔', emoji: '💪' },
  { label: '想扩大社交圈', emoji: '🌐' },
  { label: '想展示高质量生活', emoji: '✨' },
];

const strategyResults: Record<string, { weekPlan: string[]; goldenRules: string[]; avoid: string[] }> = {
  '想吸引暗恋对象': {
    weekPlan: [
      '周一：工作状态照 + 一句"开工"语气的文案（展示靠谱面）',
      '周三：美食/探店 + 轻快文案（展示生活品质）',
      '周五：朋友聚会/运动 + 圈名@好友（展示社交活力）',
      '周日：一段走心文字或读书/电影感悟（展示深度面）',
    ],
    goldenRules: ['不要每天发，2-3天一条制造稀缺感', '照片只放最好的1-3张，宁缺毋滥', '文案要有独特视角，不要复制模板', '偶尔在TA的朋友圈留下走心评论'],
    avoid: ['连续发自拍', '深夜emo文案', '显而易见的凡尔赛', '刷屏式转发'],
  },
  '想让前任后悔': {
    weekPlan: [
      '第1周：改头像换签名（焕然一新的信号）',
      '第2周：健身/学习打卡（积极向上的蜕变）',
      '第3周：社交活动照（证明你依然精彩）',
      '第4周：一段独立感悟（展示成长和释然）',
    ],
    goldenRules: ['最好的报复是过得好，而不是展示过得好', '不要任何关于他/她的暗示', '展示独立和成长永远比展示新欢有效', '保持节奏，不要突然狂发'],
    avoid: ['伤感文案', '跟异性的合照（显得刻意）', '任何指桑骂槐的内容', '删除以前的合照（保持大气）'],
  },
  '想扩大社交圈': {
    weekPlan: [
      '周一/二：行业观点或学习笔记（专业人设）',
      '周三/四：兴趣爱好相关内容（人格魅力）',
      '周五/六：聚会/活动现场（社交活跃度）',
      '周日：生活感悟或好物分享（亲和力）',
    ],
    goldenRules: ['多发互动性内容（提问、投票、求推荐）', '积极评论别人的朋友圈', '分享有价值的信息，成为"有用的人"', '保持公开可见，不要三天可见'],
    avoid: ['只发自己不互动别人', '内容同质化严重', '负能量输出', '广告轰炸'],
  },
  '想展示高质量生活': {
    weekPlan: [
      '周一：简约风晨间生活（早起/健身/阅读）',
      '周三：美食&空间审美（品味）',
      '周五：社交or旅行（经历丰富度）',
      '周日：一段有深度的文字（思想层次）',
    ],
    goldenRules: ['质感在于细节，不在于价格标签', '照片构图和光线比滤镜重要', '文案言简意赅，不过度解释', '真实比完美更有吸引力'],
    avoid: ['晒牌logo特写', '频率过高', '每条都精修到失真', '没有真情实感的鸡汤'],
  },
};

/* ========================================
 *  组件
 * ======================================== */
export function MomentsAssistant({ delay = 0 }: { delay?: number }) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<Tab>('文案生成');

  /* 文案生成 */
  const [sceneIdx, setSceneIdx] = useState(0);
  const [styleIdx, setStyleIdx] = useState(0);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const [capLoading, setCapLoading] = useState(false);
  const [capCopied, setCapCopied] = useState(-1);

  /* 人设诊断 */
  const [diagStep, setDiagStep] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<number[]>([]);
  const [diagResult, setDiagResult] = useState<typeof diagResults[0] | null>(null);

  /* 发圈策略 */
  const [stratTarget, setStratTarget] = useState(-1);
  const [stratResult, setStratResult] = useState<typeof strategyResults[string] | null>(null);

  const handleGenCaption = () => {
    const s = scenes[sceneIdx].label;
    const st = styles[styleIdx].label;
    const pool = captionPool[s]?.[st] ?? captionPool['日常']['文艺'];
    setCapLoading(true); setCaptions(null);
    setTimeout(() => { setCaptions([...pool]); setCapLoading(false); }, 900);
  };

  const handleDiagAnswer = (oi: number) => {
    const next = [...diagAnswers, oi];
    setDiagAnswers(next);
    if (next.length >= diagQuestions.length) {
      const avg = next.reduce((a, b) => a + b, 0) / next.length;
      const idx = avg < 1 ? 0 : avg < 2 ? 1 : avg < 3.5 ? 2 : 3;
      setDiagResult(diagResults[idx]);
    } else {
      setDiagStep(s => s + 1);
    }
  };

  const handleStrategy = (idx: number) => {
    setStratTarget(idx);
    setStratResult(strategyResults[strategyTargets[idx].label]);
  };

  const handleOpen = () => {
    setTab('文案生成'); setCaptions(null); setCapLoading(false); setCapCopied(-1);
    setDiagStep(0); setDiagAnswers([]); setDiagResult(null);
    setStratTarget(-1); setStratResult(null);
    setShow(true);
  };

  const copyCaption = (idx: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCapCopied(idx);
    setTimeout(() => setCapCopied(-1), 1500);
  };

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
        <IconBubble size={42} bg={gradients.mint}><IcPen size={20} color="#fff" /></IconBubble>
        <div className="flex-1 min-w-0">
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>朋友圈助手</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>打造吸引人设</span>
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
                    <IconBubble size={32} bg={gradients.mint}><IcPen size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>朋友圈助手</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>打造让TA忍不住关注的人设</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShow(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* Tab 切换 */}
                <div className="flex gap-1 mb-5 p-1" style={{ background: '#352f45', borderRadius: 12 }}>
                  {tabs.map(t => (
                    <button key={t} className="flex-1 py-2 text-center"
                      style={{
                        borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                        background: tab === t ? 'rgba(110,231,183,0.15)' : 'transparent',
                        color: tab === t ? '#6ee7b7' : 'rgba(245,239,232,0.5)',
                      }}
                      onClick={() => setTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* ====== 文案生成 ====== */}
                {tab === '文案生成' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>选择场景：</span>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scenes.map((s, si) => (
                        <motion.button key={s.label} className="px-3 py-1.5"
                          style={{
                            borderRadius: 20,
                            background: si === sceneIdx ? 'rgba(110,231,183,0.2)' : 'rgba(245,239,232,0.06)',
                            border: si === sceneIdx ? '1px solid rgba(110,231,183,0.4)' : '1px solid rgba(245,239,232,0.08)',
                            color: si === sceneIdx ? '#6ee7b7' : 'rgba(245,239,232,0.55)',
                            fontSize: 12, fontWeight: 600,
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSceneIdx(si)}>
                          {s.emoji} {s.label}
                        </motion.button>
                      ))}
                    </div>

                    <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>选择风格：</span>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {styles.map((s, si) => (
                        <motion.button key={s.label} className="px-3 py-1.5"
                          style={{
                            borderRadius: 20,
                            background: si === styleIdx ? 'rgba(110,231,183,0.2)' : 'rgba(245,239,232,0.06)',
                            border: si === styleIdx ? '1px solid rgba(110,231,183,0.4)' : '1px solid rgba(245,239,232,0.08)',
                            color: si === styleIdx ? '#6ee7b7' : 'rgba(245,239,232,0.55)',
                            fontSize: 12, fontWeight: 600,
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setStyleIdx(si)}>
                          {s.emoji} {s.label}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button className="w-full py-3.5 mb-5 flex items-center justify-center gap-2"
                      style={{ background: gradients.mint, borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 600 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenCaption}>
                      {capLoading ? <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>✨</motion.span> : '✨ 生成文案'}
                    </motion.button>

                    <AnimatePresence>
                      {captions && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: 14 }}>📝</span>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>为你生成了 {captions.length} 条文案</span>
                          </div>
                          {captions.map((c, ci) => (
                            <motion.button key={ci} className="w-full text-left p-4 mb-2.5"
                              style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(245,239,232,0.06)' }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => copyCaption(ci, c)}
                              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.08 }}>
                              <p style={{ color: 'rgba(245,239,232,0.85)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{c}</p>
                              <div className="flex items-center justify-end gap-1">
                                {capCopied === ci ? (
                                  <><Check size={12} color="#4ECDC4" /><span style={{ color: '#4ECDC4', fontSize: 11 }}>已复制</span></>
                                ) : (
                                  <><Copy size={12} color="rgba(245,239,232,0.3)" /><span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>点击复制</span></>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ====== 人设诊断 ====== */}
                {tab === '人设诊断' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {!diagResult ? (
                      <AnimatePresence mode="wait">
                        <motion.div key={diagStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          {/* 进度条 */}
                          <div className="flex items-center gap-2 mb-5">
                            {diagQuestions.map((_, qi) => (
                              <div key={qi} className="flex-1" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.1)' }}>
                                <motion.div className="h-full" style={{
                                  borderRadius: 2,
                                  background: qi < diagStep ? gradients.mint : qi === diagStep ? 'rgba(110,231,183,0.5)' : 'transparent',
                                  width: qi <= diagStep ? '100%' : '0%',
                                }} animate={{ width: qi <= diagStep ? '100%' : '0%' }} />
                              </div>
                            ))}
                          </div>

                          <div className="text-center mb-5">
                            <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>📱</span>
                            <h3 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700 }}>{diagQuestions[diagStep].q}</h3>
                            <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12, marginTop: 4 }}>第 {diagStep + 1}/{diagQuestions.length} 题</p>
                          </div>
                          <div className="flex flex-col gap-2.5">
                            {diagQuestions[diagStep].options.map((opt, oi) => (
                              <motion.button key={oi} className="w-full text-left p-4"
                                style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(245,239,232,0.08)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleDiagAnswer(oi)}>
                                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 500 }}>{opt}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        {/* 结果 */}
                        <div className="text-center mb-5 p-5" style={{ background: '#352f45', borderRadius: 16 }}>
                          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>📊</span>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span style={{ color: diagResult.color, fontSize: 36, fontWeight: 800 }}>{diagResult.score}</span>
                            <span style={{ color: diagResult.color, fontSize: 16, fontWeight: 700 }}>分</span>
                          </div>
                          <span className="inline-block px-3 py-1 mb-3" style={{ background: `${diagResult.color}22`, borderRadius: 8, color: diagResult.color, fontSize: 13, fontWeight: 700 }}>
                            {diagResult.level}
                          </span>
                          <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 13, lineHeight: 1.65 }}>{diagResult.summary}</p>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: 14 }}>💡</span>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>优化建议</span>
                          </div>
                          {diagResult.tips.map((tip, ti) => (
                            <div key={ti} className="flex items-start gap-3 p-3 mb-2"
                              style={{ background: '#352f45', borderRadius: 12 }}>
                              <span style={{ color: '#6ee7b7', fontSize: 14, fontWeight: 700, marginTop: 1 }}>{ti + 1}</span>
                              <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{tip}</span>
                            </div>
                          ))}
                        </div>

                        <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                          style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setDiagStep(0); setDiagAnswers([]); setDiagResult(null); }}>
                          🔄 重新诊断
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ====== 发圈策略 ====== */}
                {tab === '发圈策略' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {!stratResult ? (
                      <>
                        <div className="text-center mb-5">
                          <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>🎯</span>
                          <h3 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700 }}>你的目标是什么？</h3>
                          <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12, marginTop: 4 }}>选择目标，获取专属发圈策略</p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          {strategyTargets.map((t, ti) => (
                            <motion.button key={ti} className="w-full text-left p-4 flex items-center gap-3"
                              style={{ background: '#352f45', borderRadius: 14, border: '1px solid rgba(245,239,232,0.08)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleStrategy(ti)}>
                              <span style={{ fontSize: 24 }}>{t.emoji}</span>
                              <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{t.label}</span>
                              <ChevronRight size={14} color="rgba(245,239,232,0.3)" className="ml-auto" />
                            </motion.button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-4 p-3" style={{ background: 'rgba(110,231,183,0.08)', borderRadius: 12, border: '1px solid rgba(110,231,183,0.15)' }}>
                          <span style={{ fontSize: 16 }}>{strategyTargets[stratTarget].emoji}</span>
                          <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 600 }}>{strategyTargets[stratTarget].label}</span>
                        </div>

                        {/* 每周计划 */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: 14 }}>📅</span>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>每周发圈节奏</span>
                          </div>
                          {stratResult.weekPlan.map((p, pi) => (
                            <div key={pi} className="flex items-start gap-3 p-3 mb-2"
                              style={{ background: '#352f45', borderRadius: 12 }}>
                              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(110,231,183,0.15)' }}>
                                <span style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 700 }}>{pi + 1}</span>
                              </div>
                              <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{p}</span>
                            </div>
                          ))}
                        </div>

                        {/* 黄金法则 */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: 14 }}>⭐</span>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>黄金法则</span>
                          </div>
                          <div className="p-4" style={{ background: '#352f45', borderRadius: 14 }}>
                            {stratResult.goldenRules.map((r, ri) => (
                              <div key={ri} className="flex items-start gap-2 mb-2 last:mb-0">
                                <span style={{ color: '#6ee7b7', fontSize: 13 }}>✓</span>
                                <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 避坑指南 */}
                        <div className="mb-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span style={{ fontSize: 14 }}>🚫</span>
                            <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>避坑指南</span>
                          </div>
                          <div className="p-4" style={{ background: 'rgba(255,138,128,0.06)', borderRadius: 14, border: '1px solid rgba(255,138,128,0.12)' }}>
                            {stratResult.avoid.map((a, ai) => (
                              <div key={ai} className="flex items-start gap-2 mb-2 last:mb-0">
                                <span style={{ color: '#FF8A80', fontSize: 13 }}>✗</span>
                                <span style={{ color: 'rgba(245,239,232,0.7)', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                          style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setStratTarget(-1); setStratResult(null); }}>
                          ← 选择其他目标
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
