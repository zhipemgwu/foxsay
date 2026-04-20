/**
 * 约会锦囊 — 智能约会策划 / 约会急救包 / 约会复盘诊断
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ChevronRight, ChevronLeft, RefreshCw, CheckCircle2, Circle, Camera, ImagePlus, Zap, Lightbulb } from 'lucide-react';
import { IconBubble, IcGift, gradients } from './CuteIcons';
import { KeyboardPromoBanner } from './KeyboardPromoBanner';

/* ============ 常量 & 类型 ============ */
const tabModes = ['📋 准备', '🆘 进行中', '📝 复盘'] as const;
type TabMode = typeof tabModes[number];

/* --- Step1 关系阶段 --- */
const relationStages = [
  { label: '刚认识', emoji: '👋', color: '#90CAF9' },
  { label: '暧昧中', emoji: '💜', color: '#B39DDB' },
  { label: '刚在一起', emoji: '💕', color: '#F48FB1' },
  { label: '热恋期', emoji: '🔥', color: '#FF8A80' },
  { label: '老夫老妻', emoji: '🏡', color: '#FFD93D' },
  { label: '想挽回', emoji: '🕊️', color: '#80CBC4' },
];

/* --- Step2 对方画像标签 --- */
const partnerTagGroups = [
  { group: '性格', tags: ['内向文静', '外向活泼', '慢热型', '话痨', '高冷', '温柔体贴', '霸道总裁'] },
  { group: '兴趣', tags: ['吃货', '文艺青年', '运动达人', '宅家派', '探险型', '追星族', '游戏玩家', '摄影控'] },
  { group: '敏感点', tags: ['怕尴尬冷场', '讨厌等位', '不喜欢太吵', '对仪式感在意', '不爱拍照', '社恐'] },
];

/* --- Step3 约会场景 --- */
const dateScenes = [
  { label: '☕ 咖啡简餐', key: '咖啡简餐' },
  { label: '🍽️ 正式晚餐', key: '正式晚餐' },
  { label: '🎬 电影娱乐', key: '电影娱乐' },
  { label: '🏞️ 户外散步', key: '户外散步' },
  { label: '🎮 室内玩乐', key: '室内玩乐' },
  { label: '🎨 手作体验', key: '手作体验' },
  { label: '🏃 运动出汗', key: '运动出汗' },
  { label: '🛍️ 逛街购物', key: '逛街购物' },
  { label: '🍳 一起做饭', key: '一起做饭' },
  { label: '🌃 夜景兜风', key: '夜景兜风' },
  { label: '🎂 纪念日/生日', key: '纪念日' },
  { label: '🕊️ 道歉修复', key: '道歉修复' },
];

/* --- Step4 预算 + 时段 --- */
const budgetRanges = ['0元创意', '300以内', '300-500', '500-1000', '1000+'] as const;
const timeSlots = ['上午', '下午', '晚上', '全天'] as const;

/* ============ 约会准备 Mock 生成 ============ */
function genPrepResult(stage: string, tags: string[], scene: string, budget: string, time: string) {
  const isLowBudget = budget === '0元创意' || budget === '300以内';
  const isEvening = time === '晚上' || time === '全天';
  const isShy = tags.includes('内向文静') || tags.includes('慢热型') || tags.includes('社恐');
  const isFoodie = tags.includes('吃货');
  const isOutdoor = tags.includes('运动达人') || tags.includes('探险型');
  const isArty = tags.includes('文艺青年') || tags.includes('摄影控');
  const isRecovery = stage === '想挽回' || scene === '道歉修复';
  const isNew = stage === '刚认识' || stage === '暧昧中';

  // 推荐场所
  const venuePool: string[] = [];
  if (scene === '咖啡简餐') venuePool.push('安静有格调的独立咖啡馆（避免连锁店，选有特色装修的小店）', '带露台的 brunch 餐厅（自然光好，适合轻松聊天）', '隐藏在街巷里的甜品工作室（小众感满分）');
  else if (scene === '正式晚餐') venuePool.push('人均 150-250 的创意融合餐厅（菜品可以成为话题）', '有夜景或露台的西餐厅（氛围感拉满）', '口碑好的私房菜（私密安静，适合深度聊天）');
  else if (scene === '电影娱乐') venuePool.push('选质量好的新上映电影（提前看评分）+ 映后散步消化', 'VIP 厅或私人影院（更有仪式感）', '电影结束后就近找一家氛围好的小酒馆');
  else if (scene === '户外散步') venuePool.push('城市里的滨江步道 / 湿地公园（开阔不拥挤）', '文创园区 / 老街巷（边走边逛有话聊）', '山顶公园 / 观景台（尤其适合黄昏和夜晚）');
  else if (scene === '室内玩乐') venuePool.push('密室逃脱（合作解谜自然拉近距离，选恐怖度适中的）', '双人剧本杀（情感本最佳，有角色互动）', 'Switch/PS5 游戏吧 或 VR 体验馆');
  else if (scene === '手作体验') venuePool.push('陶艺工坊（经典约会项目，有身体接触机会）', '花艺 / 调香体验（成品可以送对方）', '烘焙教室（一起做蛋糕，有趣又有成就感）');
  else if (scene === '运动出汗') venuePool.push('室内攀岩馆（互相加油鼓励，天然拉近距离）', '双人羽毛球 / 网球（竞技感+互动）', '骑行 / 徒步（对体力有要求，提前确认对方能接受）');
  else if (scene === '逛街购物') venuePool.push('有设计感的买手集合店（帮对方挑东西=互动天然发生）', '文创市集 / 跳蚤市场（各种小摊逛不停）', '买完东西找一家店坐下来喝东西聊天');
  else if (scene === '一起做饭') venuePool.push('提前买好食材在家做饭（亲密度极高，限关系较近的阶段）', '共享厨房体验（有人教，不怕翻车）', '火锅/烤肉自助（门槛低，氛围热闹）');
  else if (scene === '夜景兜风') venuePool.push('城市高处的观景平台（天台餐厅/山顶公园）', '江边/海边的步道（夜晚灯光+水面倒影=浪漫）', '自驾兜风到郊外看星星（限关系较近）');
  else if (scene === '纪念日') venuePool.push('重访你们第一次见面的地方（回忆杀满分）', '提前布置好的房间 + 蛋糕（惊喜仪式感）', '心心念念但一直没去的高分餐厅');
  else if (scene === '道歉修复') venuePool.push('对方常去的奶茶店 / 甜品店（买TA最爱的送过去）', '安静的公园长椅（适合认真面对面谈话）', '你们有共同回忆的地方（唤起美好记忆）');
  else venuePool.push('安静有格调的独立咖啡馆', '有氛围的特色餐厅', '适合散步的城市公园');

  const venues = venuePool;

  // 破冰话术
  const icebreakers: string[] = [];
  if (isNew) {
    icebreakers.push('"你平时下班后一般喜欢做什么呀？"（了解生活方式）');
    icebreakers.push('"最近有看什么好看的剧吗？"（轻松切入话题）');
    if (isFoodie) icebreakers.push('"你是甜党还是咸党？我猜你是…"（美食话题+互动猜测）');
    if (isArty) icebreakers.push('"你最喜欢的电影/书是什么？"（文艺人最爱的问题）');
    if (isShy) icebreakers.push('"今天有点冷/热呢，你要不要喝点什么？"（从关心开始，减轻压力）');
  } else {
    icebreakers.push('"最近怎么样？有什么开心的事想分享吗？"');
    icebreakers.push('"我前几天看到一个东西就想到你了…"（制造专属感）');
  }
  if (isRecovery) {
    icebreakers.length = 0;
    icebreakers.push('"谢谢你愿意来。我认真想过了，想跟你好好聊聊…"');
    icebreakers.push('不要解释，先道歉："是我的问题，我想了很久才约你"');
  }

  // 话题清单
  const topics: string[] = [];
  if (isNew) {
    topics.push('✓ 聊旅行经历和想去的地方（人人都有话说）');
    topics.push('✓ 聊各自的兴趣爱好和最近在忙的事');
    topics.push('✗ 避免：前任、收入、催婚、家庭矛盾');
  } else if (isRecovery) {
    topics.push('✓ 承认具体的错误，不笼统说"我错了"');
    topics.push('✓ 问"你希望我以后怎么做"而不是辩解');
    topics.push('✗ 避免："你也有问题"——道歉局只道歉');
  } else {
    topics.push('✓ 聊最近的小确幸和有趣的事');
    if (stage === '热恋期' || stage === '老夫老妻') topics.push('✓ 聊对未来的期待和共同规划');
    else topics.push('✓ 分享各自成长中的故事和转折点');
    topics.push('✓ 问"如果你明天中了一百万你会做什么？"（有趣又能看价值观）');
    topics.push('✗ 避免：负面情绪倾倒、八卦他人、抱怨工作');
  }
  if (isShy) topics.push('✓ 多用开放式问题引导TA说话，不要急着填满沉默');
  if (tags.includes('怕尴尬冷场')) topics.push('✓ 准备3个备用话题卡，冷场时自然切换');

  // 穿搭建议
  let outfit = '';
  if (isNew) outfit = '干净清爽 > 刻意打扮。男生：白T/衬衫 + 牛仔裤 + 小白鞋；女生：简约连衣裙或T恤 + 半裙。重点是干净、合身、有精气神。';
  else if (isRecovery) outfit = '穿TA说过喜欢你穿的那件衣服。整洁干净，态度诚恳比什么都重要。不要穿得太好看像来炫耀的。';
  else if (scene === '运动出汗') outfit = '运动装也要有搭配感。干净的运动鞋 + 有设计感的运动套装。带一条干净毛巾和水壶，运动后有替换的干净上衣加分。';
  else if (scene === '正式晚餐' || scene === '纪念日') outfit = '稍微正式但不夸张。男生：质感好的衬衫/毛衣 + 九分裤；女生：质感面料 + 高级配色。这是值得用心打扮的场合。';
  else outfit = '比平常精致一个度就好。注意细节：干净的指甲、温和的香水（淡一点）。穿自己最自信的一套胜过刻意买新。';
  if (tags.includes('对仪式感在意')) outfit += ' 💡 对方在意仪式感，建议多花心思在搭配细节上（配饰、发型）。';

  // 时间线规划
  const timeline: string[] = [];
  if (time === '上午') {
    timeline.push('10:00 提前到场，选好位置/确认预约');
    timeline.push('10:15 见面寒暄，用准备好的破冰话术开场');
    timeline.push('11:00 进入深度话题，适当展示真实的自己');
    timeline.push('12:00 自然收尾，午餐时间可以顺势延长或约下次');
  } else if (time === '下午') {
    timeline.push('14:00 见面，从轻松的活动/体验开始');
    timeline.push('15:30 找一家咖啡店坐下来深度聊天');
    timeline.push('17:00 如果氛围好，可以提议"要不一起吃晚饭"');
    timeline.push('17:30 视情况结束或自然延长至晚餐');
  } else if (time === '晚上') {
    timeline.push('18:00 提前到餐厅，确认预约和座位');
    timeline.push('18:30 见面用餐，从菜单和美食话题开始');
    timeline.push('20:00 吃完后建议散步消食（最容易产生化学反应的时段）');
    timeline.push('21:00 适时结束，送对方到车站/叫车');
  } else {
    timeline.push('10:00 上午轻松活动（逛展/咖啡/散步）');
    timeline.push('12:00 午餐（选氛围好的餐厅）');
    timeline.push('14:00 下午体验项目（手作/电影/室内活动）');
    timeline.push('18:00 晚餐+散步收尾');
  }

  // Plan B 应急方案
  const planB: string[] = [];
  planB.push('🌧️ 如果下雨：附近的商场/书店/室内体验馆是最好的备选');
  planB.push('😶 如果冷场：打开手机相册分享有趣的照片/视频，或者玩"你问我答"游戏');
  planB.push('⏰ 如果对方迟到：不要催促，发一条"不急慢慢来，我在xxx等你"');
  if (isNew) planB.push('😵 如果特别紧张：深呼吸3次，记住对方也紧张。真诚 > 完美');

  // 关键注意事项
  const tips: string[] = [];
  tips.push('提前10分钟到场（占座+调整心态）');
  tips.push('手机调静音放口袋里，100%注意力给对方');
  if (isNew) {
    tips.push('结束时自然提出"下次一起去xxx"留钩子');
    tips.push('第一印象记住：微笑 + 眼神接触 + 适当点头');
  }
  if (isRecovery) {
    tips.push('不催对方做决定，给足空间。接受"我还没准备好"');
    tips.push('真正的道歉 = 承认错误 + 具体改变计划 + 时间验证');
  } else {
    tips.push('关注对方的状态（杯子是否空了、温度是否合适）');
    tips.push('约会结束后当天发一条"今天很开心，到家了跟我说"的消息');
  }
  if (tags.includes('不爱拍照')) tips.push('不要一直拍照发朋友圈，TA可能会不自在');
  if (tags.includes('讨厌等位')) tips.push('一定要提前预约！等位是这类人的核心雷区');

  return { venues, icebreakers, topics, outfit, timeline, planB, tips };
}

/* ============ 约会复盘 Mock ============ */
const reviewFeelTags = [
  { label: '😍 很甜', key: 'sweet' },
  { label: '😊 不错', key: 'good' },
  { label: '😐 一般', key: 'okay' },
  { label: '😰 尴尬', key: 'awkward' },
  { label: '😢 糟糕', key: 'bad' },
];
const reviewMomentTags = [
  { label: '有身体接触', key: 'touch' },
  { label: '聊得很深', key: 'deep' },
  { label: '冷场了', key: 'coldspot' },
  { label: '有争执', key: 'argue' },
  { label: '成功推进', key: 'progress' },
  { label: '被拒绝了', key: 'rejected' },
  { label: '笑了很多', key: 'laughed' },
  { label: '对方主动', key: 'initiative' },
];

const reviewDimensions = [
  { name: '聊天自然度', emoji: '💬' },
  { name: '情感升温度', emoji: '💕' },
  { name: '自我满意度', emoji: '😎' },
];

function genReviewResult(feelTag: string, moments: string[], story: string, scores: number[]) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const isGood = feelTag === 'sweet' || feelTag === 'good';
  const isBad = feelTag === 'bad' || feelTag === 'awkward';

  // TA的信号解读
  const signals: string[] = [];
  if (moments.includes('touch')) signals.push('有身体接触是很积极的信号，说明TA对你的亲近感到舒适 ✅');
  if (moments.includes('deep')) signals.push('TA愿意跟你聊深层话题，说明对你有一定的信任和好感 ✅');
  if (moments.includes('initiative')) signals.push('对方主动推进互动——这是非常强的正面信号 ✅');
  if (moments.includes('laughed')) signals.push('笑声是最好的化学反应指标，你们之间氛围很好 ✅');
  if (moments.includes('coldspot')) signals.push('冷场可能只是紧张，不一定是没兴趣。关键看冷场后TA有没有试图挽回话题 ⚠️');
  if (moments.includes('argue')) signals.push('约会中出现争执需要注意——是观点碰撞（正常）还是情绪对立（警惕）？');
  if (moments.includes('rejected')) signals.push('被拒绝≠没希望。如果TA语气温和，可能只是时机不对。如果态度坚决，尊重对方的边界 ⚠️');
  if (moments.includes('progress')) signals.push('关系成功推进了一步，趁热打铁巩固这次进展 ✅');
  if (signals.length === 0) signals.push('从你的描述来看，TA目前处于观望阶段，保持适度联系频率即可');

  // 关键时刻回放
  const keyMoments: string[] = [];
  if (story.length > 20) {
    keyMoments.push(`你提到的细节很有价值——${isGood ? 'AI 分析认为这次互动整体呈正面趋势' : '虽然有一些波折，但每次约会都是学习的机会'}`);
    if (moments.includes('coldspot') || moments.includes('argue'))
      keyMoments.push('下次在类似时刻可以尝试转移话题或用幽默化解，比如："话说我们聊了这么久，要不要换个轻松的话题？"');
    if (moments.includes('progress'))
      keyMoments.push('关系推进的时刻说明你的节奏把握得不错，下次可以在此基础上更进一步');
  }

  // 做得好的
  const goods: string[] = [];
  if (isGood) goods.push('整体感觉很不错，说明你的状态和准备都在线');
  if (scores[0] >= 4) goods.push('聊天很自然——这是最难装的能力，你真的做到了');
  if (scores[1] >= 4) goods.push('情感在升温，你们之间的化学反应很好');
  if (scores[2] >= 4) goods.push('你对自己的表现很自信，保持这种状态');

  // 改进项
  const improves: string[] = [];
  if (isBad) improves.push('这次体验不太好——但重要的是你来复盘了，说明你在认真对待');
  if (scores[0] < 4) improves.push('聊天可以更自然——试试多用开放式问题，少填鸭式输出信息');
  if (scores[1] < 4) improves.push('情感升温不够——下次可以增加眼神接触、适度靠近、分享更私人的故事');
  if (scores[2] < 4) improves.push('对自己表现不太满意——别苛责自己，自然和真诚才是最大的加分项');

  // 下一步行动
  const nextSteps: string[] = [];
  if (avg >= 4) {
    nextSteps.push('🔥 这次约会很成功！24小时内发一条约会相关的消息保持热度');
    nextSteps.push('📅 3天内约下一次，趁热打铁');
    nextSteps.push('💬 可以分享今天的照片，配一句"今天很开心"');
  } else if (avg >= 3) {
    nextSteps.push('💪 整体不错，今晚发一条"到家了，今天很开心"的消息');
    nextSteps.push('📅 4-5天后再约下次，给双方思考空间');
    nextSteps.push('📖 去练功模块针对性训练聊天技巧');
  } else {
    nextSteps.push('🤔 这次有不少需要复盘的地方，但每次都是学习的机会');
    nextSteps.push('📱 发一条简单的感谢消息就好，不要过度讨好');
    nextSteps.push('📖 去练功场的关卡系统做几组针对性训练');
    nextSteps.push('⏰ 给自己一周时间提升，再考虑下次约会');
  }

  // 下次约会建议
  const nextDateTips: string[] = [];
  if (moments.includes('coldspot')) nextDateTips.push('下次选互动性更强的约会（如手作/密室），减少纯聊天的尴尬概率');
  if (moments.includes('argue')) nextDateTips.push('选轻松的场景（散步/看展），避免容易产生意见分歧的活动');
  if (moments.includes('touch') || moments.includes('progress')) nextDateTips.push('关系在升温，下次可以选更私密一点的场景（私人影院/做饭/夜景散步）');
  if (isBad) nextDateTips.push('先通过线上聊天重新建立舒适感，确认对方有意愿后再约线下');
  if (nextDateTips.length === 0) nextDateTips.push('根据今天的表现，建议下次尝试不同类型的约会来制造新鲜感');

  return { avg: Math.round(avg * 10) / 10, signals, keyMoments, goods, improves, nextSteps, nextDateTips };
}

/* ============ 约会急救包 Mock ============ */
const emergencyTopics = [
  { text: '"如果你明天突然有一百万，第一件事做什么？"', tag: '💰 价值观' },
  { text: '"你小时候最想成为什么样的人？"', tag: '🌟 童年' },
  { text: '"你这辈子做过最勇敢的事是什么？"', tag: '💪 故事' },
  { text: '"如果可以瞬移到任何地方，你现在想去哪？"', tag: '✈️ 旅行' },
  { text: '"你最近有发现什么好玩的事情吗？"', tag: '🎯 日常' },
  { text: '"来玩个游戏吧——你说一个词我来造句，反过来也行"', tag: '🎮 互动' },
  { text: '"你上一次笑到肚子疼是因为什么？"', tag: '😂 搞笑' },
  { text: '"你最喜欢自己身上的哪个特质？"', tag: '💎 深度' },
  { text: '"如果给你的人生拍一部电影，你觉得是什么类型？"', tag: '🎬 创意' },
  { text: '"你有没有什么奇怪的小习惯？我先说..."', tag: '🤫 秘密' },
  { text: '"二选一：回到过去改一件事 vs 去未来看一眼？"', tag: '⚡ 选择' },
  { text: '"你觉得我今天穿的怎么样？"（适当示弱，制造互动）', tag: '👗 互动' },
];

const defaultChecklist = [
  { id: 1, text: '确认了时间地点', done: false },
  { id: 2, text: '提前到了 5 分钟', done: false },
  { id: 3, text: '夸了TA今天的穿搭/发型', done: false },
  { id: 4, text: '手机调静音放口袋了', done: false },
  { id: 5, text: '认真倾听、多问开放式问题', done: false },
  { id: 6, text: '有适度的眼神接触', done: false },
  { id: 7, text: '主动买单或自然AA', done: false },
  { id: 8, text: '送TA到车站/帮叫车', done: false },
  { id: 9, text: '发了"到家了跟我说"的消息', done: false },
];

/* ================================================================
 *  主组件
 * ================================================================ */
export function DatePlanner({ delay = 0 }: { delay?: number }) {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<TabMode>('📋 准备');

  /* === 准备模块 state === */
  const [prepStep, setPrepStep] = useState(0); // 0-3选择步骤, 4=结果
  const [stageIdx, setStageIdx] = useState(-1);
  const [partnerTags, setPartnerTags] = useState<string[]>([]);
  const [sceneIdx, setSceneIdx] = useState(-1);
  const [budgetIdx, setBudgetIdx] = useState(-1);
  const [timeIdx, setTimeIdx] = useState(-1);
  const [prepResult, setPrepResult] = useState<ReturnType<typeof genPrepResult> | null>(null);

  /* === 复盘模块 state === */
  const [rvStep, setRvStep] = useState(0); // 0=标签, 1=文字, 2=评分, 3=结果
  const [rvFeel, setRvFeel] = useState('');
  const [rvMoments, setRvMoments] = useState<string[]>([]);
  const [rvStory, setRvStory] = useState('');
  const [rvImages, setRvImages] = useState<string[]>([]);
  const [rvScores, setRvScores] = useState<number[]>([0, 0, 0]);
  const [rvResult, setRvResult] = useState<ReturnType<typeof genReviewResult> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* === 急救包 state === */
  const [emergencyTopic, setEmergencyTopic] = useState<typeof emergencyTopics[0] | null>(null);
  const [checklist, setChecklist] = useState(defaultChecklist.map(c => ({ ...c })));
  const [flashNotes, setFlashNotes] = useState<{ text: string; time: string }[]>([]);
  const [flashInput, setFlashInput] = useState('');

  /* === 操作 === */
  const handleOpen = () => {
    setTab('📋 准备');
    setPrepStep(0); setStageIdx(-1); setPartnerTags([]); setSceneIdx(-1); setBudgetIdx(-1); setTimeIdx(-1); setPrepResult(null);
    setRvStep(0); setRvFeel(''); setRvMoments([]); setRvStory(''); setRvImages([]); setRvScores([0, 0, 0]); setRvResult(null);
    setEmergencyTopic(null); setChecklist(defaultChecklist.map(c => ({ ...c }))); setFlashNotes([]); setFlashInput('');
    setShow(true);
  };

  const togglePartnerTag = (tag: string) => setPartnerTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const toggleMoment = (key: string) => setRvMoments(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const handleGenPrep = () => {
    if (stageIdx < 0 || sceneIdx < 0 || budgetIdx < 0 || timeIdx < 0) return;
    const result = genPrepResult(
      relationStages[stageIdx].label, partnerTags, dateScenes[sceneIdx].key,
      budgetRanges[budgetIdx] as string, timeSlots[timeIdx] as string
    );
    setPrepResult(result);
    setPrepStep(4);
  };

  const handleReview = () => {
    if (rvScores.some(s => s === 0)) return;
    setRvResult(genReviewResult(rvFeel, rvMoments, rvStory, rvScores));
    setRvStep(3);
  };

  const randomTopic = () => {
    const pool = emergencyTopics.filter(t => t !== emergencyTopic);
    setEmergencyTopic(pool[Math.floor(Math.random() * pool.length)]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.slice(0, 3 - rvImages.length).forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setRvImages(prev => prev.length < 3 ? [...prev, reader.result as string] : prev);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const addFlashNote = () => {
    if (!flashInput.trim()) return;
    setFlashNotes(prev => [...prev, { text: flashInput.trim(), time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }]);
    setFlashInput('');
  };

  /* --- 准备模块的步骤控制 --- */
  const prepStepTitles = ['选择关系阶段', '描述对方画像', '选择约会场景', '预算与时段'];
  const canNextPrep = () => {
    if (prepStep === 0) return stageIdx >= 0;
    if (prepStep === 1) return true; // 标签可选可不选
    if (prepStep === 2) return sceneIdx >= 0;
    if (prepStep === 3) return budgetIdx >= 0 && timeIdx >= 0;
    return false;
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
        <IconBubble size={42} bg={gradients.golden}><IcGift size={20} color="#fff" /></IconBubble>
        <div className="flex-1 min-w-0">
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>约会锦囊</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>准备 · 急救 · 复盘 全流程</span>
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
                    <IconBubble size={32} bg={gradients.golden}><IcGift size={16} color="#fff" /></IconBubble>
                    <div>
                      <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>约会锦囊</span>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11, display: 'block' }}>从准备到复盘的全流程指南</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShow(false)}>
                    <X size={20} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* 三Tab切换 */}
                <div className="flex gap-1 mb-5 p-1" style={{ background: '#352f45', borderRadius: 12 }}>
                  {tabModes.map(m => (
                    <button key={m} className="flex-1 py-2 text-center"
                      style={{
                        borderRadius: 10, fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                        background: tab === m ? 'rgba(255,217,61,0.15)' : 'transparent',
                        color: tab === m ? '#FFD93D' : 'rgba(245,239,232,0.5)',
                      }}
                      onClick={() => setTab(m)}>
                      {m}
                    </button>
                  ))}
                </div>

{/* ==================== 📋 约会准备 ==================== */}
{tab === '📋 准备' && prepStep < 4 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {/* 步骤指示器 */}
    <div className="flex items-center gap-2 mb-4">
      {prepStepTitles.map((_, i) => (
        <div key={i} className="flex-1" style={{ height: 3, borderRadius: 2, background: i <= prepStep ? '#FFD93D' : 'rgba(245,239,232,0.1)' }} />
      ))}
    </div>
    <div className="flex items-center justify-between mb-4">
      <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 600 }}>Step {prepStep + 1}/4 · {prepStepTitles[prepStep]}</span>
      {prepStep > 0 && (
        <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.95 }}
          onClick={() => setPrepStep(p => p - 1)} style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12 }}>
          <ChevronLeft size={14} /> 上一步
        </motion.button>
      )}
    </div>

    {/* Step 0: 关系阶段 */}
    {prepStep === 0 && (
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {relationStages.map((s, i) => (
          <motion.button key={s.label} className="p-3 text-center"
            style={{ borderRadius: 14, background: i === stageIdx ? 'rgba(255,217,61,0.1)' : '#352f45', border: i === stageIdx ? `1px solid ${s.color}44` : '1px solid rgba(245,239,232,0.06)' }}
            whileTap={{ scale: 0.97 }} onClick={() => setStageIdx(i)}>
            <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{s.emoji}</span>
            <span style={{ color: i === stageIdx ? s.color : 'rgba(245,239,232,0.7)', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
          </motion.button>
        ))}
      </div>
    )}

    {/* Step 1: 对方画像标签 */}
    {prepStep === 1 && (
      <div className="mb-5">
        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 12 }}>多选标签帮助AI更精准推荐（可跳过）</p>
        {partnerTagGroups.map(g => (
          <div key={g.group} className="mb-4">
            <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>{g.group}</span>
            <div className="flex flex-wrap gap-2">
              {g.tags.map(tag => {
                const sel = partnerTags.includes(tag);
                return (
                  <motion.button key={tag} className="px-3 py-1.5"
                    style={{ borderRadius: 20, background: sel ? 'rgba(155,126,222,0.2)' : 'rgba(245,239,232,0.06)', border: sel ? '1px solid rgba(155,126,222,0.4)' : '1px solid rgba(245,239,232,0.08)', color: sel ? '#c4b5fd' : 'rgba(245,239,232,0.55)', fontSize: 12, fontWeight: 500 }}
                    whileTap={{ scale: 0.95 }} onClick={() => togglePartnerTag(tag)}>
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Step 2: 场景选择 */}
    {prepStep === 2 && (
      <div className="grid grid-cols-3 gap-2 mb-5">
        {dateScenes.map((sc, i) => (
          <motion.button key={sc.key} className="p-2.5 text-center"
            style={{ borderRadius: 12, background: i === sceneIdx ? 'rgba(255,217,61,0.1)' : '#352f45', border: i === sceneIdx ? '1px solid rgba(255,217,61,0.4)' : '1px solid rgba(245,239,232,0.06)' }}
            whileTap={{ scale: 0.97 }} onClick={() => setSceneIdx(i)}>
            <span style={{ color: i === sceneIdx ? '#FFD93D' : 'rgba(245,239,232,0.7)', fontSize: 12, fontWeight: 600 }}>{sc.label}</span>
          </motion.button>
        ))}
      </div>
    )}

    {/* Step 3: 预算+时段 */}
    {prepStep === 3 && (
      <div className="mb-5">
        <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>预算范围（元）：</span>
        <div className="flex flex-wrap gap-2 mb-5">
          {budgetRanges.map((b, bi) => (
            <motion.button key={b} className="px-3 py-2 text-center"
              style={{ borderRadius: 12, fontSize: 12, fontWeight: 600, background: bi === budgetIdx ? 'rgba(255,217,61,0.15)' : '#352f45', border: bi === budgetIdx ? '1px solid rgba(255,217,61,0.4)' : '1px solid rgba(245,239,232,0.06)', color: bi === budgetIdx ? '#FFD93D' : 'rgba(245,239,232,0.55)' }}
              whileTap={{ scale: 0.96 }} onClick={() => setBudgetIdx(bi)}>
              {b}
            </motion.button>
          ))}
        </div>
        <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>时间段：</span>
        <div className="flex gap-2">
          {timeSlots.map((t, ti) => (
            <motion.button key={t} className="flex-1 py-2.5 text-center"
              style={{ borderRadius: 12, fontSize: 12, fontWeight: 600, background: ti === timeIdx ? 'rgba(255,217,61,0.15)' : '#352f45', border: ti === timeIdx ? '1px solid rgba(255,217,61,0.4)' : '1px solid rgba(245,239,232,0.06)', color: ti === timeIdx ? '#FFD93D' : 'rgba(245,239,232,0.55)' }}
              whileTap={{ scale: 0.96 }} onClick={() => setTimeIdx(ti)}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
    )}

    {/* 下一步/生成按钮 */}
    <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
      style={{ background: canNextPrep() ? gradients.golden : 'rgba(245,239,232,0.08)', borderRadius: 14, color: canNextPrep() ? '#fff' : 'rgba(245,239,232,0.3)', fontSize: 15, fontWeight: 600 }}
      whileTap={canNextPrep() ? { scale: 0.98 } : {}}
      onClick={() => { if (!canNextPrep()) return; if (prepStep < 3) setPrepStep(p => p + 1); else handleGenPrep(); }}>
      {prepStep < 3 ? (<>下一步 <ChevronRight size={16} /></>) : '📋 生成约会锦囊'}
    </motion.button>
  </motion.div>
)}

{/* 准备结果 */}
{tab === '📋 准备' && prepStep === 4 && prepResult && (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-2 mb-4 p-3" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 12, border: '1px solid rgba(255,217,61,0.15)' }}>
      <span style={{ fontSize: 16 }}>{relationStages[stageIdx]?.emoji}</span>
      <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 600 }}>
        {relationStages[stageIdx]?.label} · {dateScenes[sceneIdx]?.label} · {budgetRanges[budgetIdx]} · {timeSlots[timeIdx]}
      </span>
    </div>
    {partnerTags.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-4">
        {partnerTags.map(t => (
          <span key={t} className="px-2 py-0.5" style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 8, color: '#c4b5fd', fontSize: 10, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    )}

    <Section emoji="📍" title="推荐场所">
      {prepResult.venues.map((v, i) => (
        <div key={i} className="flex items-start gap-2 p-3 mb-2" style={{ background: '#352f45', borderRadius: 12 }}>
          <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
          <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.6 }}>{v}</span>
        </div>
      ))}
    </Section>

    <Section emoji="🗣️" title="破冰话术">
      <div className="p-4" style={{ background: '#352f45', borderRadius: 14 }}>
        {prepResult.icebreakers.map((t, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <span style={{ color: '#c4b5fd', fontSize: 13 }}>💬</span>
            <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section emoji="💬" title="话题清单">
      <div className="p-4" style={{ background: '#352f45', borderRadius: 14 }}>
        {prepResult.topics.map((t, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <span style={{ color: t.startsWith('✗') ? '#FF8A80' : '#6ee7b7', fontSize: 13 }}>{t.startsWith('✗') ? '✗' : '✓'}</span>
            <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{t.replace(/^[✓✗]\s*/, '')}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section emoji="👔" title="穿搭建议">
      <div className="p-4" style={{ background: '#352f45', borderRadius: 14 }}>
        <p style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.7 }}>{prepResult.outfit}</p>
      </div>
    </Section>

    <Section emoji="🕐" title="时间线规划">
      {prepResult.timeline.map((t, i) => (
        <div key={i} className="flex items-start gap-3 p-3 mb-2" style={{ background: '#352f45', borderRadius: 12 }}>
          <div className="flex-shrink-0" style={{ width: 6, height: 6, borderRadius: 3, background: '#FFD93D', marginTop: 6 }} />
          <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.6 }}>{t}</span>
        </div>
      ))}
    </Section>

    <Section emoji="🔄" title="Plan B 应急方案">
      {prepResult.planB.map((t, i) => (
        <div key={i} className="flex items-start gap-2 p-3 mb-2" style={{ background: 'rgba(255,138,128,0.05)', borderRadius: 12, border: '1px solid rgba(255,138,128,0.08)' }}>
          <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{t}</span>
        </div>
      ))}
    </Section>

    <Section emoji="⚡" title="关键注意事项">
      {prepResult.tips.map((t, i) => (
        <div key={i} className="flex items-start gap-3 p-3 mb-2" style={{ background: '#352f45', borderRadius: 12 }}>
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(255,217,61,0.12)' }}>
            <span style={{ color: '#FFD93D', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
          </div>
          <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{t}</span>
        </div>
      ))}
    </Section>

    <motion.button className="w-full py-3.5 mt-2 flex items-center justify-center gap-2"
      style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { setPrepStep(0); setStageIdx(-1); setPartnerTags([]); setSceneIdx(-1); setBudgetIdx(-1); setTimeIdx(-1); setPrepResult(null); }}>
      ← 重新策划
    </motion.button>
  </motion.div>
)}

{/* ==================== 🆘 约会急救包 ==================== */}
{tab === '🆘 进行中' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

    {/* 冷场急救 */}
    <Section emoji="🆘" title="冷场急救">
      <motion.button className="w-full p-4 text-center mb-2"
        style={{ background: 'linear-gradient(135deg, #B39DDB33, #9575CD22)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.2)' }}
        whileTap={{ scale: 0.97 }} onClick={randomTopic}>
        {emergencyTopic ? (
          <div>
            <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10, display: 'block', marginBottom: 6 }}>{emergencyTopic.tag}</span>
            <p style={{ color: '#f5efe8', fontSize: 15, fontWeight: 600, lineHeight: 1.6 }}>{emergencyTopic.text}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Zap size={24} color="#B39DDB" />
            <span style={{ color: '#B39DDB', fontSize: 14, fontWeight: 600 }}>点击获取救场话题</span>
            <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>随机一个话题帮你打破沉默</span>
          </div>
        )}
      </motion.button>
      {emergencyTopic && (
        <motion.button className="w-full py-2.5 flex items-center justify-center gap-1.5"
          style={{ borderRadius: 10, background: 'rgba(245,239,232,0.06)', color: 'rgba(245,239,232,0.5)', fontSize: 12, fontWeight: 600 }}
          whileTap={{ scale: 0.97 }} onClick={randomTopic}>
          <RefreshCw size={12} /> 换一个
        </motion.button>
      )}
    </Section>

    {/* 约会检查清单 */}
    <Section emoji="✅" title="约会检查清单">
      <div className="p-3" style={{ background: '#352f45', borderRadius: 14 }}>
        {checklist.map((item, i) => (
          <motion.button key={item.id} className="w-full flex items-center gap-3 py-2.5 px-1 text-left"
            style={{ borderBottom: i < checklist.length - 1 ? '1px solid rgba(245,239,232,0.05)' : 'none' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setChecklist(prev => prev.map((c, ci) => ci === i ? { ...c, done: !c.done } : c))}>
            {item.done ? <CheckCircle2 size={18} color="#4ECDC4" /> : <Circle size={18} color="rgba(245,239,232,0.2)" />}
            <span style={{ color: item.done ? 'rgba(245,239,232,0.4)' : 'rgba(245,239,232,0.8)', fontSize: 13, textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.text}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="mt-2 text-right">
        <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>
          {checklist.filter(c => c.done).length}/{checklist.length} 完成
        </span>
      </div>
    </Section>

    {/* 闪光时刻记录 */}
    <Section emoji="📸" title="记录闪光时刻">
      <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 8 }}>记下约会中的亮点时刻，复盘时自动带入</p>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 px-3 py-2.5"
          style={{ background: '#352f45', borderRadius: 10, color: '#f5efe8', fontSize: 13, border: '1px solid rgba(245,239,232,0.1)', outline: 'none' }}
          placeholder="TA说了什么/做了什么让你心动的…"
          value={flashInput}
          onChange={e => setFlashInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addFlashNote(); }}
        />
        <motion.button className="px-3 flex-shrink-0"
          style={{ background: flashInput.trim() ? 'rgba(255,217,61,0.15)' : 'rgba(245,239,232,0.06)', borderRadius: 10, color: flashInput.trim() ? '#FFD93D' : 'rgba(245,239,232,0.3)', fontSize: 13, fontWeight: 600 }}
          whileTap={flashInput.trim() ? { scale: 0.95 } : {}} onClick={addFlashNote}>
          记录
        </motion.button>
      </div>
      {flashNotes.length > 0 && (
        <div className="flex flex-col gap-2">
          {flashNotes.map((n, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3" style={{ background: '#352f45', borderRadius: 10 }}>
              <Lightbulb size={14} color="#FFD93D" style={{ marginTop: 2, flexShrink: 0 }} />
              <div className="flex-1">
                <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13 }}>{n.text}</span>
                <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, display: 'block', marginTop: 2 }}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  </motion.div>
)}

{/* ==================== 📝 约会复盘 ==================== */}
{tab === '📝 复盘' && rvStep < 3 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    {/* 步骤指示器 */}
    <div className="flex items-center gap-2 mb-4">
      {['快速标签', '详细描述', '简要评分'].map((_, i) => (
        <div key={i} className="flex-1" style={{ height: 3, borderRadius: 2, background: i <= rvStep ? '#FF8A80' : 'rgba(245,239,232,0.1)' }} />
      ))}
    </div>
    <span style={{ color: '#FF8A80', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 12 }}>
      Step {rvStep + 1}/3 · {['快速标签', '说说发生了什么', '简要评分'][rvStep]}
    </span>

    {/* Step 0: 标签选择 */}
    {rvStep === 0 && (
      <div className="mb-5">
        <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>整体感觉：</span>
        <div className="flex flex-wrap gap-2 mb-5">
          {reviewFeelTags.map(ft => (
            <motion.button key={ft.key} className="px-4 py-2"
              style={{ borderRadius: 20, background: rvFeel === ft.key ? 'rgba(255,138,128,0.15)' : '#352f45', border: rvFeel === ft.key ? '1px solid rgba(255,138,128,0.4)' : '1px solid rgba(245,239,232,0.06)', color: rvFeel === ft.key ? '#FF8A80' : 'rgba(245,239,232,0.6)', fontSize: 13, fontWeight: 600 }}
              whileTap={{ scale: 0.95 }} onClick={() => setRvFeel(ft.key)}>
              {ft.label}
            </motion.button>
          ))}
        </div>
        <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block', marginBottom: 8 }}>关键时刻（多选）：</span>
        <div className="flex flex-wrap gap-2">
          {reviewMomentTags.map(mt => {
            const sel = rvMoments.includes(mt.key);
            return (
              <motion.button key={mt.key} className="px-3 py-1.5"
                style={{ borderRadius: 16, background: sel ? 'rgba(155,126,222,0.15)' : 'rgba(245,239,232,0.06)', border: sel ? '1px solid rgba(155,126,222,0.3)' : '1px solid rgba(245,239,232,0.06)', color: sel ? '#c4b5fd' : 'rgba(245,239,232,0.5)', fontSize: 12, fontWeight: 500 }}
                whileTap={{ scale: 0.95 }} onClick={() => toggleMoment(mt.key)}>
                {mt.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    )}

    {/* Step 1: 文字描述+截图 */}
    {rvStep === 1 && (
      <div className="mb-5">
        <textarea
          className="w-full p-4 resize-none mb-3"
          style={{ background: '#352f45', borderRadius: 14, color: '#f5efe8', fontSize: 14, border: '1px solid rgba(245,239,232,0.1)', minHeight: 120, outline: 'none' }}
          placeholder={"说说今天的约会吧——\n去了哪里、聊了什么、有没有什么特别的瞬间或者尴尬的时刻？你想怎么评价TA的反应？\n说得越详细，AI分析越准…"}
          value={rvStory}
          onChange={e => setRvStory(e.target.value)}
        />
        {/* 截图补充 */}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        <div className="flex items-center gap-2">
          {rvImages.map((src, i) => (
            <div key={i} className="relative" style={{ width: 52, height: 68, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(245,239,232,0.1)' }}>
              <img src={src} alt="" className="w-full h-full object-cover" />
              <motion.button className="absolute flex items-center justify-center"
                style={{ top: 1, right: 1, width: 16, height: 16, borderRadius: 8, background: 'rgba(0,0,0,0.6)' }}
                whileTap={{ scale: 0.85 }} onClick={() => setRvImages(prev => prev.filter((_, idx) => idx !== i))}>
                <X size={10} color="#fff" />
              </motion.button>
            </div>
          ))}
          {rvImages.length < 3 && (
            <motion.button className="flex items-center gap-1.5 px-3 py-2"
              style={{ borderRadius: 10, border: '1px dashed rgba(155,126,222,0.25)', color: 'rgba(245,239,232,0.4)', fontSize: 11 }}
              whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()}>
              <Camera size={14} /> 补充截图
            </motion.button>
          )}
        </div>
        {/* 闪光时刻带入 */}
        {flashNotes.length > 0 && (
          <div className="mt-3 p-3" style={{ background: 'rgba(255,217,61,0.05)', borderRadius: 10, border: '1px solid rgba(255,217,61,0.1)' }}>
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>📸 约会中记录的闪光时刻：</span>
            {flashNotes.map((n, i) => (
              <span key={i} style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12, display: 'block' }}>• {n.text} ({n.time})</span>
            ))}
          </div>
        )}
      </div>
    )}

    {/* Step 2: 简要评分 (3维) */}
    {rvStep === 2 && (
      <div className="mb-5">
        {reviewDimensions.map((dim, di) => (
          <div key={di} className="mb-4 p-4" style={{ background: '#352f45', borderRadius: 14 }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 16 }}>{dim.emoji}</span>
              <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{dim.name}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <motion.button key={s} whileTap={{ scale: 0.9 }}
                  onClick={() => setRvScores(prev => { const n = [...prev]; n[di] = s; return n; })}>
                  <Star size={28} fill={s <= rvScores[di] ? '#FFD93D' : 'transparent'} color={s <= rvScores[di] ? '#FFD93D' : 'rgba(245,239,232,0.2)'} strokeWidth={1.5} />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* 导航按钮 */}
    <div className="flex gap-2">
      {rvStep > 0 && (
        <motion.button className="py-3.5 px-5 flex items-center justify-center gap-1"
          style={{ borderRadius: 14, background: 'rgba(245,239,232,0.08)', color: 'rgba(245,239,232,0.6)', fontSize: 14, fontWeight: 600 }}
          whileTap={{ scale: 0.97 }} onClick={() => setRvStep(p => p - 1)}>
          <ChevronLeft size={16} /> 上一步
        </motion.button>
      )}
      <motion.button className="flex-1 py-3.5 flex items-center justify-center gap-2"
        style={{
          background: (rvStep === 0 && rvFeel) || rvStep === 1 || (rvStep === 2 && rvScores.every(s => s > 0)) ? 'linear-gradient(135deg, #FF8A80, #F48FB1)' : 'rgba(245,239,232,0.08)',
          borderRadius: 14,
          color: (rvStep === 0 && rvFeel) || rvStep === 1 || (rvStep === 2 && rvScores.every(s => s > 0)) ? '#fff' : 'rgba(245,239,232,0.3)',
          fontSize: 15, fontWeight: 600,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (rvStep === 0 && rvFeel) setRvStep(1);
          else if (rvStep === 1) setRvStep(2);
          else if (rvStep === 2) handleReview();
        }}>
        {rvStep < 2 ? (<>下一步 <ChevronRight size={16} /></>) : '🔍 AI 诊断分析'}
      </motion.button>
    </div>
  </motion.div>
)}

{/* 复盘结果 */}
{tab === '📝 复盘' && rvStep === 3 && rvResult && (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
    {/* 综合评分 */}
    <div className="text-center mb-5 p-5" style={{ background: '#352f45', borderRadius: 16 }}>
      <span style={{ fontSize: 48, display: 'block', marginBottom: 6 }}>
        {rvResult.avg >= 4 ? '🎉' : rvResult.avg >= 3 ? '👍' : '💪'}
      </span>
      <div className="flex items-center justify-center gap-1 mb-2">
        <span style={{ color: '#FFD93D', fontSize: 36, fontWeight: 800 }}>{rvResult.avg}</span>
        <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 16 }}>/5</span>
      </div>
      <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 13 }}>
        {rvResult.avg >= 4 ? '超棒的一次约会！' : rvResult.avg >= 3 ? '表现不错，还有提升空间' : '每一次约会都是成长的机会'}
      </span>
    </div>

    {/* TA的信号解读 */}
    <Section emoji="🔮" title="TA 的信号解读">
      <div className="p-4" style={{ background: 'rgba(155,126,222,0.08)', borderRadius: 14, border: '1px solid rgba(155,126,222,0.15)' }}>
        {rvResult.signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.7 }}>{s}</span>
          </div>
        ))}
      </div>
    </Section>

    {rvResult.goods.length > 0 && (
      <Section emoji="✅" title="做得好的">
        <div className="p-4" style={{ background: 'rgba(110,231,183,0.06)', borderRadius: 14, border: '1px solid rgba(110,231,183,0.12)' }}>
          {rvResult.goods.map((g, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <span style={{ color: '#6ee7b7', fontSize: 13 }}>✓</span>
              <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.6 }}>{g}</span>
            </div>
          ))}
        </div>
      </Section>
    )}

    {rvResult.improves.length > 0 && (
      <Section emoji="📌" title="可以更好的地方">
        <div className="p-4" style={{ background: 'rgba(255,138,128,0.06)', borderRadius: 14, border: '1px solid rgba(255,138,128,0.1)' }}>
          {rvResult.improves.map((im, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <span style={{ color: '#FF8A80', fontSize: 13 }}>→</span>
              <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{im}</span>
            </div>
          ))}
        </div>
      </Section>
    )}

    {rvResult.keyMoments.length > 0 && (
      <Section emoji="⏪" title="关键时刻回放">
        <div className="p-4" style={{ background: 'rgba(255,217,61,0.05)', borderRadius: 14, border: '1px solid rgba(255,217,61,0.1)' }}>
          {rvResult.keyMoments.map((km, i) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <span style={{ color: '#FFD93D', fontSize: 13 }}>★</span>
              <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{km}</span>
            </div>
          ))}
        </div>
      </Section>
    )}

    <Section emoji="🚀" title="接下来你应该">
      {rvResult.nextSteps.map((ns, i) => (
        <div key={i} className="flex items-start gap-3 p-3 mb-2" style={{ background: '#352f45', borderRadius: 12 }}>
          <span style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.6 }}>{ns}</span>
        </div>
      ))}
    </Section>

    <Section emoji="💡" title="下次约会建议">
      <div className="p-4" style={{ background: 'rgba(78,205,196,0.06)', borderRadius: 14, border: '1px solid rgba(78,205,196,0.1)' }}>
        {rvResult.nextDateTips.map((t, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
            <span style={{ color: '#4ECDC4', fontSize: 13 }}>→</span>
            <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.6 }}>{t}</span>
          </div>
        ))}
      </div>
    </Section>

    <motion.button className="w-full py-3.5 mt-2 flex items-center justify-center gap-2"
      style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 14, color: 'rgba(245,239,232,0.7)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { setRvStep(0); setRvFeel(''); setRvMoments([]); setRvStory(''); setRvImages([]); setRvScores([0, 0, 0]); setRvResult(null); }}>
      🔄 重新复盘
    </motion.button>
    <KeyboardPromoBanner hint="下次约会时用 FoxSay 键盘 · 破冷话术一键插入" />
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

/* ---------- 辅助子组件 ---------- */
function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
