/**
 * ========================================
 *  练习页 — PracticePage
 * ========================================
 *  布局结构（自上而下）：
 *    1. 页面标题 + 副标题
 *    2. 今日推荐练习（大横幅卡片）
 *    3. 快速练习入口（2×2宫格，点击可直接进入对话）
 *    4. 学习进度条（单行 Banner）
 *    5. 关卡系统（模式切换 + 章节标签 + 剧情30关 / 人物挑战30关）
 *    6. 真人实战专区（体验官匹配 Banner + 3步流程 + 体验官卡片）
 *    7. 恋爱物种鉴定（沉浸式人格名片 + 匹配圆环 + 6维度雷达图 + 扎心金句）
 * ========================================
 */

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Lock, X, Send, Users, Zap } from 'lucide-react';
import {
  IconBubble, IcChat, IcTarget, IcMask, IcWave, IcLetter, IcDove,
  IcGift, IcHeartSpark, IcRobot, IcPen, IcTrophy, IcStar, IcSparkle,
  IcHeart, IcFire, IcShield, IcRadar, gradients,
} from './CuteIcons';

/* ---------- 故事系统 ---------- */

/** 剧情故事章节 */
const storyChapters = [
  { id: 1, name: '初遇', coverImage: '/chapters/story-1.jpg', narrative: '推开那扇门的时候，你不知道命运已经开始倒计时。', readCount: '已读 4 节' },
  { id: 2, name: '破冰', coverImage: '/chapters/story-2.jpg', narrative: '沉默不是没有话说，是还没找到那个让你想开口的人。', readCount: '已读 2 节' },
  { id: 3, name: '暧昧', coverImage: '/chapters/story-3.jpg', narrative: '那些心跳加速的瞬间，你以为对方听不见吗？', readCount: '尚未翻开' },
  { id: 4, name: '热恋', coverImage: '/chapters/story-4.jpg', narrative: '从那天起，所有歌里唱的都有了画面。', readCount: '尚未翻开' },
  { id: 5, name: '考验', coverImage: '/chapters/story-5.jpg', narrative: '真正的爱情不是没有风暴，是风暴过后你还在。', readCount: '尚未翻开' },
];

/** 人物邂逅分组 */
const challengeGroups = [
  { id: 1, name: '温柔的人', coverImage: '/chapters/challenge-1.jpg', narrative: '有些人笑起来的样子，就像春天突然来了。', readCount: '已读 3 节' },
  { id: 2, name: '疏离的人', coverImage: '/chapters/challenge-2.jpg', narrative: '冰山下面藏着的，也许是最热烈的火焰。', readCount: '已读 1 节' },
  { id: 3, name: '闪耀的人', coverImage: '/chapters/challenge-3.jpg', narrative: '人群中最闪亮的那个人，你敢走过去吗？', readCount: '尚未翻开' },
  { id: 4, name: '脆弱的人', coverImage: '/chapters/challenge-4.jpg', narrative: '有时候，陪伴比任何话语都更有力量。', readCount: '尚未翻开' },
  { id: 5, name: '危险的人', coverImage: '/chapters/challenge-5.jpg', narrative: '看清真相需要勇气，但你值得被真诚对待。', readCount: '尚未翻开' },
];

/** 故事工厂 */
const _ic = [IcWave, IcChat, IcTarget, IcSparkle, IcLetter, IcMask, IcHeartSpark, IcRobot, IcPen, IcDove, IcFire, IcTrophy, IcHeart, IcRadar, IcGift, IcStar, IcShield];
const _bg = [gradients.coral, gradients.purple, gradients.mint, gradients.golden, gradients.rose, gradients.sky, gradients.lilac, gradients.lemon, gradients.teal, gradients.indigo, gradients.orange];

function buildLevels(raw: [string, string, number, boolean][], startId: number) {
  return raw.map(([title, desc, chapter, unlocked], i) => {
    const Ic = _ic[i % _ic.length];
    return {
      id: startId + i,
      title,
      desc,
      chapter,
      unlocked,
      icon: <Ic size={22} color="#fff" />,
      bg: _bg[i % _bg.length],
    };
  });
}

/** 剧情故事 × 30（5章 × 6节） */
const storyLevels = buildLevels([
  // 第1章：初遇
  ['那杯拿铁的温度', '推门进去的瞬间，你闻到了烘焙的香气，还有一个低头微笑的人', 1, true],
  ['第 14 层的三十秒', '电梯门合上，你们之间只剩一步的距离和无限的可能', 1, true],
  ['同一本书的两只手', '你伸手去拿那本旅行指南，却碰到了另一只温热的手', 1, true],
  ['角落里的目光', '吵闹的聚会里，你注意到角落安静坐着的那个人', 1, true],
  ['输入框里的勇气', '打了又删，删了又打，手指悬在发送键上方', 1, false],
  ['好巧，又是你', '这座城市这么大，为什么转角总能遇见同一个人', 1, false],
  // 第2章：破冰
  ['原来你也喜欢', '当你发现对方手机壳上印着你最爱的乐队', 2, true],
  ['笑声是最好的桥梁', '气氛突然冻住了，你需要一个恰到好处的玩笑', 2, true],
  ['从天气聊到了星星', '聊着聊着，你们不知不觉从浅水区游向了深海', 2, false],
  ['已读不回的艺术', '有些等待是策略，有些等待是尊重', 2, false],
  ['"嗯"字之后的拯救', '对话快要断气了，你还有三秒钟做出反应', 2, false],
  ['临走前的回眸', '告别的方式决定了下一次见面的概率', 2, false],
  // 第3章：暧昧
  ['只想和你走这段路', '"要不我送你？"看似随意的一句话，你排练了一整天', 3, false],
  ['眼神不会说谎', '你偷看对方的时候，发现对方也在偷看你', 3, false],
  ['措辞开始小心翼翼', '你开始在每句话里反复斟酌用词——朋友不会这样', 3, false],
  ['"这周六有空吗"', '表面在约饭，其实是在赌整个未来', 3, false],
  ['指尖的距离', '走路时手背不经意碰到一起，谁都没有躲开', 3, false],
  ['月光下的试探', '"你觉得我们算什么呢？"——这个问题你在心里问了一百遍', 3, false],
  // 第4章：热恋
  ['紧张到手心出汗', '提前了四十分钟到，在镜子前整理了第三次衣领', 4, false],
  ['藏在外套口袋里的', '有些心意不用说出口，放在触手可及的地方就好', 4, false],
  ['三点半的秘密', '凌晨的视频电话，你们聊到了谁都不知道的童年', 4, false],
  ['心跳盖过了背景音乐', '"我想说一件事，你听完再回答好不好"', 4, false],
  ['在他们面前的你', '这是第一次以"对象"的身份出现在另一个世界', 4, false],
  ['"以后就是我们了"', '不再是"我"和"你"，而是"我们"', 4, false],
  // 第5章：考验
  ['摔门之后的十分钟', '坐在门的两边，谁也不说话，但都没有走远', 5, false],
  ['2000 公里的晚安', '屏幕那头的呼吸声，是今天最温柔的声音', 5, false],
  ['那条消息通知', '你看见了不该看的内容，手指开始发抖', 5, false],
  ['第一次觉得陌生', '"我以为你会理解"——这句话两个人同时说了出来', 5, false],
  ['沙发两端的距离', '同一个屋檐下，什么时候开始不目光相接了', 5, false],
  ['平凡日子里的光', '没有烟火，没有惊喜，但你看着对方发呆的样子会笑', 5, false],
], 1);

/** 人物邂逅 × 30（5组 × 6节） */
const challengeLevels = buildLevels([
  // 第1组：温柔的人
  ['图书馆的小纸条', '她把笔记递过来的时候，你看到上面画了一只小猫', 1, true],
  ['隔壁传来的歌声', '每天傍晚六点，窗户那边都会飘来同一首歌的旋律', 1, true],
  ['他多带了一把伞', '"早上看天气预报说下雨，就多拿了一把。"', 1, true],
  ['诗集里夹着的车票', '他翻开书的时候，一张去海边的车票飘了下来', 1, false],
  ['球场边的矿泉水', '他跑过来第一件事不是擦汗，是递给你一瓶水', 1, false],
  ['多加了一颗草莓', '"这杯是我请的，特调款。"她笑得像偷偷做了好事', 1, false],
  // 第2组：疏离的人
  ['她只跟猫说话', '你以为她不理任何人，直到你看到她蹲下来哄流浪猫', 2, true],
  ['会议室外的叹息', '门关上之后，你听到了和刚才完全不同的疲惫声音', 2, false],
  ['黑板上多出的公式', '你看不懂她写的证明过程，但你看得出她写字时很快乐', 2, false],
  ['垃圾桶里的第六稿', '她对自己的苛刻远超你的想象，但作品真的很美', 2, false],
  ['深夜亮着的那盏灯', '他不说话，但他的代码里藏着你能懂的浪漫注释', 2, false],
  ['"我才不是故意拍你"', '相机里有 47 张你没发现的偷拍，每一张都对焦清晰', 2, false],
  // 第3组：闪耀的人
  ['她记得所有人的名字', '在她和每个人碰杯之后，她端着酒走向了你', 3, false],
  ['笑声背后的眼神', '全场都在笑，只有你注意到他笑完后眼神一闪而过的空', 3, false],
  ['关掉滤镜之后', '镜头外的她素颜吃着泡面，跟屏幕里判若两人', 3, false],
  ['"你第一次来这里吧"', '他的热情让你分不清是职业习惯还是因为你特别', 3, false],
  ['第三杯酒的秘密', '"说吧，第三杯的时候大家都会讲真心话的。"', 3, false],
  ['名片背后的故事', '他递过来的名片比谁都多，但你那张他没要回去', 3, false],
  // 第4组：脆弱的人
  ['她收集了所有落花', '别人看到地上的花会踩过去，她会蹲下来小心翼翼捧起', 4, false],
  ['吼完之后递的纸巾', '他嗓门大得吓人，但他递纸巾的手是轻的', 4, false],
  ['那句没说完的话', '你不经意的一句话让空气突然安静了，她低头不看你', 4, false],
  ['凌晨两点的电话', '"我知道很晚了，但你现在能听我说几句吗?"', 4, false],
  ['还没摘下的手链', '她手腕上那条手链的风格，明显不是她自己会选的', 4, false],
  ['改了八遍的消息', '"去还是不去？"她把手机递给你看——聊天框里全是草稿', 4, false],
  // 第5组：危险的人
  ['"我就随便问问"', '每句话都无辜，但你总觉得她在下一盘很大的棋', 5, false],
  ['那个蓝色的已读标记', '你盯着屏幕看了四十分钟，对话框安静得让人窒息', 5, false],
  ['每条朋友圈都有新人', '你不确定自己是唯一，但你确定每次看到都会难受', 5, false],
  ['故意迟到的三十分钟', '"我就看看你会不会等我"——你不知道这是一场考试', 5, false],
  ['"你离开我什么都不是"', '当有人开始否定你的一切，你需要看清这不是爱', 5, false],
  ['完美到让人不安', '笑容太恰当，关心太及时，完美得不像一个真实的人', 5, false],
], 101);

const quickPractices = [
  { id: 'daily', icon: <IcChat size={20} color="#fff" />, bg: gradients.coral, title: '每日一聊', desc: '3分钟快速对话', dialogueKey: 'daily' },
  { id: 'challenge', icon: <IcTarget size={20} color="#fff" />, bg: gradients.purple, title: '情景挑战', desc: '随机场景练习', dialogueKey: 'challenge' },
  { id: 'lines', icon: <IcPen size={20} color="#fff" />, bg: gradients.mint, title: '话术训练', desc: '经典开场白', dialogueKey: 'lines' },
  { id: 'roleplay', icon: <IcMask size={20} color="#fff" />, bg: gradients.golden, title: '角色扮演', desc: '切换不同身份', dialogueKey: 'roleplay' },
];

const aiDialogues: Record<string, { role: string; text: string }[]> = {
  /* 场景预设对话 */
  '1': [
    { role: 'system', text: '📍 场景：你在书店的咖啡角，注意到一位正在翻阅旅行书籍的人...' },
    { role: 'ai', text: '（对方似乎在认真看一本关于日本旅行的书，偶尔微笑）你决定上前搭话，试试吧！' },
  ],
  '2': [
    { role: 'system', text: '📍 场景：朋友向你倾诉最近工作上的烦恼，练习深度倾听...' },
    { role: 'ai', text: '唉，最近工作压力真的好大，每天加班到很晚，感觉完全没有自己的时间了...' },
  ],
  '3': [
    { role: 'system', text: '📍 场景：你和一位聊得不错的异性已经线上聊了两周，想发出约会邀请...' },
    { role: 'ai', text: '哈哈对啊，我也超喜欢那家餐厅的！他们家的甜点特别好吃～' },
  ],
  '4': [
    { role: 'system', text: '📍 场景：和对方聊天突然冷场了，对方只回了一个"嗯"...' },
    { role: 'ai', text: '嗯...' },
  ],
  '5': [
    { role: 'system', text: '📍 场景：对方发了一张自拍，你需要用幽默的方式回应...' },
    { role: 'ai', text: '（发来一张在办公室的疲惫自拍）今天加班到现在...好累啊。' },
  ],
  '6': [
    { role: 'system', text: '📍 场景：你们已经单独出去玩过两次了，气氛很好，想把关系更进一步...' },
    { role: 'ai', text: '上次去那个展真的好好玩，下次还有什么好玩的可以一起去～' },
  ],
  /* 快速练习模式预设对话 */
  'daily': [
    { role: 'system', text: '🔥 每日一聊 — 今日话题：如何回应对方分享的日常' },
    { role: 'ai', text: '我今天中午去公司楼下新开的那家拉面馆了，味道还不错！你喜欢吃拉面吗？' },
  ],
  'challenge': [
    { role: 'system', text: '⚡ 情景挑战 — 限时5回合，尽量获得高评分' },
    { role: 'ai', text: '（你在朋友聚会上遇到了一位有趣的陌生人，对方正好坐在你旁边）嗨，今天是第一次来这种聚会吗？' },
  ],
  'lines': [
    { role: 'system', text: '✏️ 话术训练 — 练习3种不同风格的开场白' },
    { role: 'ai', text: '请分别用「真诚型」「幽默型」「好奇型」三种风格，对以下场景写开场白：你在书店遇到一位正在看你最喜欢的书的人。' },
  ],
  'roleplay': [
    { role: 'system', text: '🎭 角色扮演 — 你将扮演一位温柔幽默的男生' },
    { role: 'ai', text: '（设定：你在咖啡店等朋友，隔壁桌的女生不小心把咖啡洒了）啊！天呐...我的裙子...' },
  ],
};

const coaches = [
  { id: 1, name: '汪俊豪', avatar: '/avatars/face1.jpg', specialty: '约会场景', rating: 4.9, sessions: 256, online: true, desc: '国家二级心理咨询师' },
  { id: 2, name: '余水', avatar: '/avatars/face2.png', specialty: '情感沟通', rating: 4.8, sessions: 189, online: true, desc: '恋爱导师 · 全关卡通关者' },
  { id: 3, name: '占方剑', avatar: '/avatars/face3.png', specialty: '聊天技巧', rating: 4.95, sessions: 312, online: false, desc: '两性沟通专家' },
  { id: 4, name: '窦国立', avatar: '/avatars/face4.png', specialty: '冲突化解', rating: 4.85, sessions: 145, online: true, desc: '情感博主 · 通关认证导师' },
];

const traitData = [
  { label: '嘴替指数', value: 72, color: '#FF8A80', icon: '💬', desc: '替所有人说完想说的话' },
  { label: '心软指数', value: 58, color: '#B39DDB', icon: '🫠', desc: '一秒被攻破的豆腐心' },
  { label: '抖包袱值', value: 45, color: '#FFD93D', icon: '😆', desc: '行走的快乐制造机' },
  { label: '树洞指数', value: 80, color: '#4ECDC4', icon: '🕳️', desc: '让人想说完所有秘密' },
  { label: '救场指数', value: 63, color: '#81D4FA', icon: '⚡', desc: '冷场克星·名场面制造' },
  { label: '整活指数', value: 35, color: '#F48FB1', icon: '🎪', desc: '突然浪漫不讲道理' },
];

const loveSpecies = [
  // 🔥 疯狂输出组
  { id: 'haiwanghu',  emoji: '🦊', name: '海王狐', camp: '疯狂输出组', campIcon: '🔥', desc: '鱼塘太大管不过来了', soulQuote: '你不是花心，你只是每条鱼都真心喜欢', avatar: '/species/haiwanghu.jpg', color: '#1B9CFC', bg: 'linear-gradient(135deg, #1B9CFC 0%, #25CCF7 100%)' },
  { id: 'tiantianhu', emoji: '🦊', name: '舔舔狐', camp: '疯狂输出组', campIcon: '🔥', desc: '你骂我我都说好的亲亲', soulQuote: '你以为的真诚，在对方眼里叫廉价', avatar: '/species/tiantianhu.jpg', color: '#FF9FF3', bg: 'linear-gradient(135deg, #FF9FF3 0%, #f368e0 100%)' },
  { id: 'laosihu',    emoji: '🦊', name: '老司狐', camp: '疯狂输出组', campIcon: '🔥', desc: '开车从不翻车，就是乘客换得勤', soulQuote: '技术越好越孤独，因为没人敢上你的车', avatar: '/species/laosihu.jpg', color: '#c23616', bg: 'linear-gradient(135deg, #c23616 0%, #e84118 100%)' },
  // 💀 已读不回组
  { id: 'zhuangsihu', emoji: '🦊', name: '装死狐', camp: '已读不回组', campIcon: '💀', desc: '恋爱？先让我死一会儿', soulQuote: '你不是不心动，你只是害怕心动之后的剧情', avatar: '/species/zhuangsihu.jpg', color: '#8c7ae6', bg: 'linear-gradient(135deg, #8c7ae6 0%, #9c88ff 100%)' },
  { id: 'songsonghu', emoji: '🦊', name: '怂怂狐', camp: '已读不回组', campIcon: '💀', desc: '有感觉就跑，没感觉又来', soulQuote: '逃避虽然可耻但有用——直到对方不等了', avatar: '/species/songsonghu.jpg', color: '#40407a', bg: 'linear-gradient(135deg, #40407a 0%, #706fd3 100%)' },
  { id: 'zhiwuhu',    emoji: '🦊', name: '植物狐', camp: '已读不回组', campIcon: '💀', desc: '所有恋爱信号对我无效', soulQuote: '不是收不到信号，是你把天线拔了', avatar: '/species/zhiwuhu.jpg', color: '#44bd32', bg: 'linear-gradient(135deg, #44bd32 0%, #4cd137 100%)' },
  // 🤡 自我感动组
  { id: 'xiaochouhu', emoji: '🦊', name: '小丑狐', camp: '自我感动组', campIcon: '🤡', desc: '以为是主角，其实送了个助攻', soulQuote: '你感动了自己，但对方只觉得有压力', avatar: '/species/xiaochouhu.jpg', color: '#0097e6', bg: 'linear-gradient(135deg, #0097e6 0%, #00a8ff 100%)' },
  { id: 'lianfeihu',  emoji: '🦊', name: '恋废狐', camp: '自我感动组', campIcon: '🤡', desc: '不谈恋爱会死，谈了更死', soulQuote: '你缺的不是恋爱，是跟自己好好相处', avatar: '/species/lianfeihu.jpg', color: '#718093', bg: 'linear-gradient(135deg, #718093 0%, #7f8fa6 100%)' },
  { id: 'guizuhu',    emoji: '🦊', name: '跪族狐', camp: '自我感动组', campIcon: '🤡', desc: '你说跪就跪，你说滚我问往哪滚', soulQuote: '越卑微越掉价，你值得被平等对待', avatar: '/species/guizuhu.jpg', color: '#192a56', bg: 'linear-gradient(135deg, #192a56 0%, #273c75 100%)' },
  // 😈 表面无害组
  { id: 'caonihu',    emoji: '🦊', name: '草泥狐', camp: '表面无害组', campIcon: '😈', desc: '嘴上全是随便，心里全是你', soulQuote: '你以为的高冷，其实是不敢先开口', avatar: '/species/caonihu.jpg', color: '#e1b12c', bg: 'linear-gradient(135deg, #e1b12c 0%, #fbc531 100%)' },
  { id: 'lvchahu',    emoji: '🦊', name: '绿茶狐', camp: '表面无害组', campIcon: '😈', desc: '人畜无害就是我的大招', soulQuote: '善良是真的，算计也是真的', avatar: '/species/lvchahu.jpg', color: '#B33771', bg: 'linear-gradient(135deg, #B33771 0%, #FD7272 100%)' },
  { id: 'xinjihu',    emoji: '🦊', name: '心机狐', camp: '表面无害组', campIcon: '😈', desc: '看似佛系聊天，每句都在下钩子', soulQuote: '你不是在聊天，你是在布局', avatar: '/species/xinjihu.jpg', color: '#EAB543', bg: 'linear-gradient(135deg, #EAB543 0%, #F8EFBA 100%)' },
];

const userSpecies = {
  speciesId: 'laosihu',
  matchRate: 98,
};

const userProgress = {
  completedThisWeek: 3,
  weeklyGoal: 5,
  xpEarned: 150,
  xpRemaining: 200,
  streak: 7,
};

/* ========================================
 *  组件：6维度雷达图（SVG）
 * ======================================== */
function LoveRadarChart({ data, themeColor }: { data: typeof traitData; themeColor: string }) {
  const gid = useId();
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const levels = 4;
  const maxR = 100;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const val = ((i + 1) / levels) * 100;
    return data.map((_, j) => getPoint(j, val)).map(p => `${p.x},${p.y}`).join(' ');
  });

  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const axisEnds = data.map((_, i) => getPoint(i, 100));

  const labelPositions = data.map((_, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const lr = maxR + 28;
    return { x: cx + lr * Math.cos(angle), y: cy + lr * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id={`${gid}-glow`}>
          <stop offset="0%" stopColor={themeColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={themeColor} stopOpacity="0.02" />
        </radialGradient>
        <filter id={`${gid}-blur`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
      </defs>

      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(245,239,232,0.1)" strokeWidth={i === levels - 1 ? 1.2 : 0.6} />
      ))}

      {axisEnds.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(245,239,232,0.08)" strokeWidth={0.6} />
      ))}

      <motion.polygon
        points={dataPolygon}
        fill={`url(#${gid}-glow)`}
        stroke={themeColor}
        strokeWidth={2}
        strokeLinejoin="round"
        filter={`url(#${gid}-blur)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
      />
      <motion.polygon
        points={dataPolygon}
        fill={`url(#${gid}-glow)`}
        stroke={themeColor}
        strokeWidth={1.8}
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r={3.5}
          fill="#fff"
          stroke={data[i].color}
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      ))}

      {labelPositions.map((pos, i) => (
        <g key={i}>
          <text x={pos.x} y={pos.y - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>
            {data[i].value}
          </text>
          <text x={pos.x} y={pos.y + 7} textAnchor="middle" fill="rgba(245,239,232,0.8)" fontSize={9}>
            {data[i].icon} {data[i].label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ========================================
 *  组件：匹配度圆环
 * ======================================== */
function MatchRing({ value, color }: { value: number; color: string }) {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  const gid = useId();

  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width={80} height={80} viewBox="0 0 80 80">
        <defs>
          <linearGradient id={`${gid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <motion.circle
          cx={40} cy={40} r={r}
          fill="none"
          stroke={`url(#${gid}-ring)`}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{value}%</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, marginTop: 2 }}>契合度</span>
      </div>
    </div>
  );
}

/* ========================================
 *  组件：恋爱物种鉴定卡（完整重构版）
 * ======================================== */
const campStyles: Record<string, { border: string; glow: string; label: string }> = {
  '疯狂输出组': { border: '1px solid rgba(255,107,107,0.3)', glow: 'rgba(255,107,107,0.08)', label: '🔥 疯狂输出组' },
  '已读不回组': { border: '1px solid rgba(149,117,205,0.3)', glow: 'rgba(149,117,205,0.08)', label: '💀 已读不回组' },
  '自我感动组': { border: '1px solid rgba(78,205,196,0.3)', glow: 'rgba(78,205,196,0.08)', label: '🤡 自我感动组' },
  '表面无害组': { border: '1px solid rgba(255,217,61,0.3)', glow: 'rgba(255,217,61,0.08)', label: '😈 表面无害组' },
};

function SpeciesCard() {
  const species = loveSpecies.find(s => s.id === userSpecies.speciesId) || loveSpecies[0];
  const camp = campStyles[species.camp] || campStyles['表面无害组'];

  const maxTrait = traitData.reduce((a, b) => a.value > b.value ? a : b);
  const minTrait = traitData.reduce((a, b) => a.value < b.value ? a : b);

  return (
    <div>
      {/* ====== 第一屏：沉浸式物种名片 ====== */}
      <div style={{
        background: species.bg,
        borderRadius: 20,
        padding: '28px 20px 22px',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        border: camp.border,
        boxShadow: `0 0 40px ${camp.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}>
        {/* 暗色叠层保证白字可读 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)', zIndex: 0, pointerEvents: 'none' }} />
        {/* 大背景 emoji 装饰 */}
        <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 140, opacity: 0.1, lineHeight: 1, pointerEvents: 'none', zIndex: 0 }}>{species.emoji}</div>
        <div style={{ position: 'absolute', bottom: -20, left: -20, fontSize: 80, opacity: 0.06, lineHeight: 1, pointerEvents: 'none', transform: 'rotate(-15deg)', zIndex: 0 }}>{species.emoji}</div>

        {/* 阵营横幅 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '5px 14px 5px 10px', marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.12)', position: 'relative', zIndex: 1,
        }}>
          <span style={{ fontSize: 13 }}>{species.campIcon}</span>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{species.camp}</span>
        </div>

        {/* 核心区域：emoji + 名字 + 匹配圆环 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <motion.span
              style={{ fontSize: 64, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              {species.emoji}
            </motion.span>
            <div>
              <motion.div
                style={{
                  color: '#fff', fontSize: 32, fontWeight: 900, letterSpacing: 3, lineHeight: 1.1,
                  textShadow: `0 0 20px ${species.color}80, 0 2px 8px rgba(0,0,0,0.3)`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {species.name}
              </motion.div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4, letterSpacing: 1 }}>
                LOVE SPECIES · {species.id.toUpperCase()}
              </div>
            </div>
          </div>
          <MatchRing value={userSpecies.matchRate} color={species.color} />
        </div>

        {/* 人设金句 */}
        <motion.div
          style={{
            color: '#fff', fontSize: 16, fontWeight: 600,
            marginTop: 18, lineHeight: 1.7, letterSpacing: 0.5,
            position: 'relative', zIndex: 1, textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          「{species.desc}」
        </motion.div>

        {/* 扎心灵魂拷问 */}
        <motion.div
          style={{
            color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 8,
            fontStyle: 'italic', lineHeight: 1.5, paddingLeft: 12,
            borderLeft: '2px solid rgba(255,255,255,0.25)',
            position: 'relative', zIndex: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          灵魂拷问：{species.soulQuote}
        </motion.div>

        {/* 品牌水印 */}
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginTop: 16, textAlign: 'right', letterSpacing: 2, position: 'relative', zIndex: 1 }}>
          — FoxSay 恋爱物种鉴定 —
        </div>
      </div>

      {/* ====== 第二屏：6维度雷达图 ====== */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, letterSpacing: 4 }}>──</span>
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>恋爱属性图谱</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, letterSpacing: 4 }}>──</span>
        </div>

        <LoveRadarChart data={traitData} themeColor={species.color} />

        {/* MAX / MIN 高亮标签 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,239,232,0.06)', borderRadius: 12, padding: '6px 14px',
          }}>
            <span style={{ fontSize: 11 }}>🔥</span>
            <span style={{ color: maxTrait.color, fontSize: 11, fontWeight: 700 }}>MAX</span>
            <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: 10 }}>{maxTrait.icon} {maxTrait.label} {maxTrait.value}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,239,232,0.06)', borderRadius: 12, padding: '6px 14px',
          }}>
            <span style={{ fontSize: 11 }}>💤</span>
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, fontWeight: 700 }}>MIN</span>
            <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 10 }}>{minTrait.icon} {minTrait.label} {minTrait.value}</span>
          </div>
        </div>

        {/* 6维度明细（精简版） */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginTop: 14 }}>
          {traitData.map(t => {
            const isMax = t === maxTrait;
            const isMin = t === minTrait;
            return (
              <div key={t.label} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                borderRadius: 10, background: isMax ? `${t.color}18` : 'rgba(245,239,232,0.04)',
                border: isMax ? `1px solid ${t.color}40` : '1px solid rgba(245,239,232,0.04)',
              }}>
                <span style={{ fontSize: 15 }}>{t.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: isMin ? 'rgba(245,239,232,0.5)' : 'rgba(245,239,232,0.85)', fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                    <span style={{ color: isMin ? 'rgba(245,239,232,0.4)' : t.color, fontSize: 12, fontWeight: 800 }}>{t.value}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: 'rgba(245,239,232,0.08)', marginTop: 4 }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: 2, background: isMin ? 'rgba(245,239,232,0.15)' : t.color, opacity: isMin ? 0.5 : 1 }}
                      initial={{ width: 0 }}
                      animate={{ width: `${t.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====== 底部 CTA ====== */}
      <motion.div
        style={{
          marginTop: 20, textAlign: 'center', padding: '14px 0',
          borderTop: '1px solid rgba(245,239,232,0.08)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: species.bg, borderRadius: 24, padding: '10px 24px',
          cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: `0 4px 20px ${species.color}30`,
        }}>
          <span style={{ fontSize: 16 }}>🔮</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>看看你的恋爱CP是谁</span>
        </div>
        <div style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, marginTop: 8 }}>
          📸 截图分享到朋友圈，找到你的灵魂CP
        </div>
      </motion.div>
    </div>
  );
}

/* ========================================
 *  主组件
 * ======================================== */
export function PracticePage() {
  /* ---------- 状态管理 ---------- */
  const [practiceMode, setPracticeMode] = useState<'story' | 'challenge'>('story'); // 关卡模式
  const [expandedChapter, setExpandedChapter] = useState(1);      // 当前展开的章节（0=全部收起）
  const [activePractice, setActivePractice] = useState<typeof storyLevels[0] | null>(null); // 练习详情弹窗
  const [showChat, setShowChat] = useState(false);                // AI对话页
  const [chatTarget, setChatTarget] = useState<string>('');       // 当前对话场景ID
  const [chatTitle, setChatTitle] = useState('');                  // 当前对话标题
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]); // 对话消息列表
  const [chatInput, setChatInput] = useState('');                  // 输入框内容
  const [showMatchModal, setShowMatchModal] = useState(false);    // 真人匹配弹窗
  const [matchingState, setMatchingState] = useState<'idle' | 'matching' | 'matched'>('idle'); // 匹配状态

  /* ---------- 关卡列表计算 ---------- */
  const currentLevels = practiceMode === 'story' ? storyLevels : challengeLevels;
  const currentGroups = practiceMode === 'story' ? storyChapters : challengeGroups;

  /**
   * @API 开始AI对话
   * 后端对接时：POST /api/practice/start { scenarioId }
   * 返回初始对话消息和场景配置
   */
  const startChat = (dialogueKey: string, title: string) => {
    setChatTarget(dialogueKey);
    setChatTitle(title);
    setMessages(aiDialogues[dialogueKey] || [
      { role: 'system', text: '准备开始练习...' },
      { role: 'ai', text: '你好！让我们开始这次练习吧。请自然地开始对话～' },
    ]);
    setShowChat(true);
    setActivePractice(null);
  };

  /**
   * @API 发送消息并获取AI回复
   * 后端对接时：POST /api/practice/chat { scenarioId, message, history }
   * 返回：{ reply: string, score?: number, feedback?: string, tips?: string[] }
   * 当前为前端 Mock 延迟回复
   */
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    // 模拟AI回复（后端对接时替换为接口调用）
    setTimeout(() => {
      const scoreFeedbacks = [
        { score: 85, text: '👏 表达不错！你的语气很自然，让人感觉很舒服。建议下一步可以问一个开放式问题。\n\n📊 本轮评分：85分' },
        { score: 78, text: '💡 你展示了真诚的兴趣！试着加入一些个人经历的分享，增加亲密感。\n\n📊 本轮评分：78分' },
        { score: 92, text: '✨ 很好的回应！你的共情能力很强，继续保持这种倾听的姿态。\n\n📊 本轮评分：92分' },
        { score: 70, text: '🔍 回应稍微简短了一些。试试展开你的想法，给对方更多可以接话的点。\n\n📊 本轮评分：70分' },
        { score: 88, text: '🎯 精准的话题转换！你很自然的引导了对话方向，这是高级技巧。\n\n📊 本轮评分：88分' },
      ];
      const fb = scoreFeedbacks[Math.floor(Math.random() * scoreFeedbacks.length)];
      setMessages(prev => [...prev, { role: 'ai', text: fb.text }]);
    }, 800);
  };

  /**
   * @API 真人匹配
   * 后端对接时：POST /api/real/match { preferredCoachId?, topic? }
   * 返回：{ matchedCoach, sessionId, estimatedWait }
   * 当前为前端 Mock
   */
  const startMatching = () => {
    setMatchingState('matching');
    // 模拟匹配过程（后端对接时替换为长连接或轮询）
    setTimeout(() => setMatchingState('matched'), 2500);
  };

  /* ---------- 今日推荐场景（取第一个已解锁的最高评分场景） ---------- */
  /** @API 后端接口：GET /api/practice/recommendation */
  const todayRecommend = storyLevels.filter(l => l.unlocked)[0];

  /* ========================================
   *  渲染
   * ======================================== */
  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">

        {/* ====== 背景渐变装饰 ====== */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.18) 0%, transparent 100%)',
        }} />

        {/* ====== 1. 页面标题 ====== */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: 14, marginBottom: 4 }}>训练中心</p>
              <h1 style={{ color: '#f5efe8', fontSize: 28, fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.14, margin: 0 }}>
                恋爱练习场
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 20, border: '1px solid rgba(255,138,128,0.2)' }}>
              <IcFire size={12} color="#FF8A80" />
              <span style={{ color: '#FF8A80', fontSize: 12, fontWeight: 600 }}>{userProgress.streak}天连续</span>
            </div>
          </div>
        </motion.div>

        {/* ====== 2. 今日精选体验（沉浸式封面卡） ====== */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
        >
          {/* 顶部标题行 */}
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: '#FF8A80', fontSize: 16, fontWeight: 700 }}>今日精选体验</span>
            <button className="flex items-center gap-1" onClick={() => {}}>
              <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12 }}>查看全部</span>
              <ChevronRight size={12} color="rgba(245,239,232,0.35)" strokeWidth={2} />
            </button>
          </div>

          {/* 封面卡片 */}
          <motion.button
            className="w-full text-left overflow-hidden"
            style={{ borderRadius: 20, background: '#453a60' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActivePractice(todayRecommend)}
          >
            {/* 封面图区域 */}
            <div className="relative" style={{ height: 180 }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: todayRecommend.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* 装饰性大 emoji 背景 */}
                <span style={{ fontSize: 100, opacity: 0.15, position: 'absolute', right: -10, top: -10, lineHeight: 1 }}>💑</span>
                <span style={{ fontSize: 60, opacity: 0.08, position: 'absolute', left: 10, bottom: -5, transform: 'rotate(-12deg)', lineHeight: 1 }}>☕</span>
                {/* 中心大图标 */}
                <motion.div
                  className="flex items-center justify-center"
                  style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <span style={{ fontSize: 32 }}>▶</span>
                </motion.div>
              </div>

              {/* 左上标签 */}
              <div style={{
                position: 'absolute', top: 12, left: 12,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)',
                borderRadius: 8, padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span style={{ fontSize: 11 }}>🔥</span>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>今日热门</span>
              </div>

              {/* 右上收藏 */}
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <IcHeart size={14} color="rgba(255,255,255,0.7)" />
              </div>

              {/* 底部渐变蒙版 + 标题 */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                padding: '30px 16px 12px',
              }}>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 2, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                  AI 约会模拟
                </h3>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  {todayRecommend.title}
                </span>
              </div>
            </div>

            {/* 卡片底部信息区 */}
            <div className="p-4">
              {/* 评分行 */}
              <div className="flex items-center gap-2 mb-2">
                <IcStar size={12} color="#FFD93D" />
                <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>推荐</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>沉浸式恋爱故事</span>
              </div>
              {/* 描述 */}
              <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
                与 AI 进行沉浸式约会情景演练，锻炼开场白与话题延展能力
              </p>
              {/* 底部操作行 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ color: '#4ECDC4', fontSize: 14, fontWeight: 700 }}>免费体验</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#fff',
                    background: 'linear-gradient(135deg, #FF8A80, #FF6B6B)',
                    padding: '2px 8px', borderRadius: 6,
                  }}>限时</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2"
                  style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 10, border: '1px solid rgba(245,239,232,0.1)' }}>
                  <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>开始练习</span>
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ====== 3. 快速练习（2×2宫格） ====== */}
        {/* 点击后直接进入对应模式的AI对话 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {quickPractices.map((qp, i) => (
            <motion.button
              key={qp.id}
              className="flex items-center gap-3 p-4 text-left"
              style={{ background: '#453a60', borderRadius: 14 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => startChat(qp.dialogueKey, qp.title)}
            >
              <IconBubble size={42} bg={qp.bg}>{qp.icon}</IconBubble>
              <div className="flex-1 min-w-0">
                <span style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600, display: 'block' }}>{qp.title}</span>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{qp.desc}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ====== 4. 学习进度条（单行 Banner） ====== */}
        {/* @API 用户进度数据从后端获取 */}
        <motion.div
          className="flex items-center gap-3 mb-5 p-3 px-4"
          style={{ background: '#453a60', borderRadius: 12 }}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <IconBubble size={28} bg={gradients.golden}><IcTrophy size={13} color="#fff" /></IconBubble>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ color: '#f5efe8', fontSize: '12px', fontWeight: 600 }}>
                本周 {userProgress.completedThisWeek}/{userProgress.weeklyGoal} · {userProgress.xpEarned}XP
              </span>
              <div className="flex items-center gap-1">
                <IcFire size={11} color="#FF8A80" />
                <span style={{ color: '#FF8A80', fontSize: '11px', fontWeight: 600 }}>{userProgress.streak}天连续</span>
              </div>
            </div>
            <div className="w-full overflow-hidden" style={{ height: 4, borderRadius: 2, background: 'rgba(245,239,232,0.1)' }}>
              <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #FF8A80, #FFB199)', borderRadius: 2 }}
                initial={{ width: '0%' }} animate={{ width: `${(userProgress.completedThisWeek / userProgress.weeklyGoal) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 }} />
            </div>
          </div>
        </motion.div>

        {/* ====== 5. 关卡模式切换 + 章节标签 + 关卡列表 ====== */}

        {/* 模式切换：剧情关卡 / 人物挑战 */}
        <div className="flex gap-0 mb-3 p-1" style={{ background: '#3d3358', borderRadius: 12 }}>
          {(['story', 'challenge'] as const).map(m => (
            <button key={m} className="flex-1 py-2.5 text-center"
              style={{
                background: practiceMode === m ? '#FF8A80' : 'transparent',
                borderRadius: 10,
                color: practiceMode === m ? '#2b2535' : 'rgba(245,239,232,0.55)',
                fontSize: 13, fontWeight: practiceMode === m ? 700 : 400,
                transition: 'all 0.2s',
              }}
              onClick={() => { setPracticeMode(m); setExpandedChapter(1); }}
            >
              {m === 'story' ? '📖 我的故事' : '💫 人物邂逅'}
              <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                {(m === 'story' ? storyLevels : challengeLevels).length}
              </span>
            </button>
          ))}
        </div>

        {/* 故事章节列表（沉浸式手风琴） */}
        <div className="flex flex-col gap-4">
        {currentGroups.map(g => {
          const groupLevels = currentLevels.filter(l => l.chapter === g.id);
          const unlockedCount = groupLevels.filter(l => l.unlocked).length;
          const isOpen = expandedChapter === g.id;
          return (
            <div key={g.id}>
              {/* 章节封面卡（全宽图片 + 暗色叠层 + 叙事文案） */}
              <button className="w-full overflow-hidden relative"
                style={{
                  borderRadius: isOpen ? '18px 18px 0 0' : 18,
                  transition: 'border-radius 0.2s',
                  border: '1px solid rgba(245,239,232,0.08)',
                  borderBottom: isOpen ? 'none' : undefined,
                }}
                onClick={() => setExpandedChapter(isOpen ? 0 : g.id)}
              >
                {/* 封面图 */}
                <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                  <img
                    src={g.coverImage}
                    alt={g.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* 渐变暗色叠层 */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(43,37,53,0.95) 0%, rgba(43,37,53,0.5) 50%, rgba(43,37,53,0.15) 100%)',
                  }} />

                  {/* 右上章节序号 */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                    borderRadius: 10, padding: '4px 12px',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    <span style={{ color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>
                      {practiceMode === 'story' ? `第${g.id}章` : `第${g.id}组`}
                    </span>
                  </div>

                  {/* 底部文字区 */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 14px' }}>
                    <h3 style={{
                      color: '#fff', fontSize: 19, fontWeight: 800, marginBottom: 4,
                      textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                      letterSpacing: 0.5,
                    }}>
                      {g.name}
                    </h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.5,
                      textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      fontStyle: 'italic',
                    }}>
                      "{g.narrative}"
                    </p>
                    {/* 进度 + 展开指示 */}
                    <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
                      <div className="flex items-center gap-2.5">
                        <div style={{ width: 80, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            background: unlockedCount === groupLevels.length ? '#4ECDC4' : 'linear-gradient(90deg, #FF8A80, #FFB199)',
                            width: `${(unlockedCount / groupLevels.length) * 100}%`, transition: 'width 0.3s',
                          }} />
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{g.readCount}</span>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,0.5)" strokeWidth={2}
                        style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </div>
              </button>

              {/* 故事节列表（展开时显示） */}
              <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  style={{
                    overflow: 'hidden',
                    borderRadius: '0 0 18px 18px',
                    border: '1px solid rgba(255,255,255,0.12)', borderTop: 'none',
                    position: 'relative',
                  }}
                >
                  {/* 模糊封面图作为列表背景 */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: `url(${g.coverImage})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'blur(40px) brightness(0.6) saturate(1.6)',
                    transform: 'scale(1.2)',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'rgba(43,37,53,0.35)' }} />

                  <div className="relative" style={{ paddingLeft: 32, paddingTop: 10, paddingBottom: 10, zIndex: 1 }}>
                    {/* 时间线连接线（垂直） */}
                    <div style={{
                      position: 'absolute', left: 14, top: 0, bottom: 0, width: 2,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(155,126,222,0.2), rgba(255,255,255,0.05))',
                      borderRadius: 1,
                    }} />

                    {groupLevels.map((p, idx) => {
                      const isCurrentLevel = p.unlocked === false && (idx === 0 || groupLevels[idx - 1]?.unlocked);
                      const isLast = idx === groupLevels.length - 1;
                      const nodeColor = p.unlocked ? '#4ECDC4' : isCurrentLevel ? '#FF8A80' : 'rgba(255,255,255,0.15)';
                      return (
                      <motion.button key={p.id} className="w-full text-left relative"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        whileTap={p.unlocked ? { scale: 0.98 } : undefined}
                        onClick={() => p.unlocked && setActivePractice(p)}
                        style={{ cursor: p.unlocked ? 'pointer' : 'default', marginBottom: isLast ? 0 : 6 }}
                      >
                        {/* 时间线圆形节点 */}
                        <div style={{
                          position: 'absolute', left: -32 + 8, top: '50%', transform: 'translateY(-50%)',
                          width: p.unlocked || isCurrentLevel ? 14 : 10,
                          height: p.unlocked || isCurrentLevel ? 14 : 10,
                          borderRadius: '50%',
                          background: nodeColor,
                          border: `2px solid ${p.unlocked ? 'rgba(78,205,196,0.5)' : isCurrentLevel ? 'rgba(255,138,128,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: p.unlocked ? '0 0 10px rgba(78,205,196,0.4)' : isCurrentLevel ? '0 0 12px rgba(255,138,128,0.45)' : 'none',
                          zIndex: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {p.unlocked && (
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
                          )}
                        </div>

                        {/* 水晶毛玻璃卡片 */}
                        <div style={{
                          borderRadius: 16,
                          background: p.unlocked
                            ? 'rgba(255,255,255,0.18)'
                            : isCurrentLevel
                              ? 'rgba(255,255,255,0.14)'
                              : 'rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(24px) saturate(1.8)',
                          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                          border: p.unlocked
                            ? '1px solid rgba(255,255,255,0.35)'
                            : isCurrentLevel
                              ? '1px solid rgba(255,255,255,0.28)'
                              : '1px solid rgba(255,255,255,0.1)',
                          overflow: 'hidden',
                          position: 'relative',
                          boxShadow: p.unlocked
                            ? '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.05)'
                            : isCurrentLevel
                              ? '0 8px 32px rgba(255,138,128,0.12), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.04)'
                              : '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
                        }}>
                          {/* 右上角角标 */}
                          {p.unlocked && (
                            <div style={{
                              position: 'absolute', top: 0, right: 0, zIndex: 3,
                              background: 'linear-gradient(135deg, #4ECDC4, #44b8b0)',
                              color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                              padding: '3px 10px 3px 12px',
                              borderRadius: '0 16px 0 12px',
                              boxShadow: '0 2px 8px rgba(78,205,196,0.35)',
                              textTransform: 'uppercase',
                            }}>✓ 已读</div>
                          )}
                          {isCurrentLevel && (
                            <motion.div style={{
                              position: 'absolute', top: 0, right: 0, zIndex: 3,
                              background: 'linear-gradient(135deg, #FF8A80, #e57373)',
                              color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                              padding: '3px 10px 3px 12px',
                              borderRadius: '0 16px 0 12px',
                            }}
                              animate={{
                                boxShadow: [
                                  '0 2px 8px rgba(255,138,128,0.2)',
                                  '0 2px 16px rgba(255,138,128,0.5)',
                                  '0 2px 8px rgba(255,138,128,0.2)',
                                ],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >NEW</motion.div>
                          )}

                          <div style={{
                            filter: (!p.unlocked && !isCurrentLevel) ? 'blur(2.5px)' : 'none',
                            opacity: (!p.unlocked && !isCurrentLevel) ? 0.3 : 1,
                            padding: '14px 16px 12px',
                          }}>
                            {/* 序号 */}
                            <div style={{
                              color: p.unlocked ? 'rgba(78,205,196,0.4)' : isCurrentLevel ? 'rgba(255,138,128,0.35)' : 'rgba(255,255,255,0.12)',
                              fontSize: 28, fontWeight: 900, fontFamily: 'Georgia, "Times New Roman", serif',
                              lineHeight: 1, marginBottom: 2, letterSpacing: -1,
                            }}>
                              {String(idx + 1).padStart(2, '0')}
                            </div>
                            {/* 标题 */}
                            <div style={{
                              color: '#fff', fontSize: 16, fontWeight: 800,
                              letterSpacing: 0.5, lineHeight: 1.3,
                              textShadow: '0 1px 4px rgba(0,0,0,0.35)',
                              marginBottom: 5,
                            }}>
                              {p.title}
                            </div>
                            {/* 叙事描述 */}
                            <p style={{
                              color: 'rgba(255,255,255,0.6)', fontSize: 12.5, lineHeight: 1.6,
                              letterSpacing: 0.2,
                              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              「{p.desc}」
                            </p>
                          </div>

                          {/* 锁定蒙版 */}
                          {!p.unlocked && !isCurrentLevel && (
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'rgba(43,37,53,0.35)',
                              backdropFilter: 'blur(3px)',
                              borderRadius: 16,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Lock size={13} color="rgba(255,255,255,0.12)" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                      </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>

        <div style={{ height: 20 }} />

        {/* ====== 6. 真人实战专区 ====== */}
        {/* @API 真人匹配功能，对接后端 WebSocket 实时匹配 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} color="#FF8A80" strokeWidth={2.5} />
            <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>真人实战</span>
          </div>

          {/* 真人实战介绍 Banner */}
          <motion.div
            className="p-[1px] mb-4 overflow-hidden"
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(155,126,222,0.5), rgba(255,138,128,0.3), rgba(78,205,196,0.25))',
            }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="p-5" style={{ background: 'linear-gradient(135deg, #3d3358 0%, #453a60 100%)', borderRadius: 15 }}>
              <h3 style={{ color: '#f5efe8', fontSize: '16px', fontWeight: 600, marginBottom: 6 }}>
                和真人练习，提升更快 🚀
              </h3>
              <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', lineHeight: 1.6, marginBottom: 14 }}>
                AI练完基础后，和真实体验官对话实战。获得真人视角的反馈，快速提升社交能力。
              </p>

              {/* 3步流程说明 */}
              <div className="flex items-center gap-2 mb-4">
                {[
                  { step: '1', label: '选择场景', icon: <IcTarget size={12} color="#fff" /> },
                  { step: '2', label: '匹配体验官', icon: <Users size={12} color="#fff" strokeWidth={2.5} /> },
                  { step: '3', label: '实时对话', icon: <IcChat size={12} color="#fff" /> },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.3)' }}>
                      {s.icon}
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: '11px' }}>{s.label}</span>
                    {i < 2 && <ChevronRight size={10} color="rgba(245,239,232,0.3)" />}
                  </div>
                ))}
              </div>

              {/* 匹配按钮 */}
              <motion.button
                className="w-full py-3 flex items-center justify-center gap-2"
                style={{ background: gradients.purple, borderRadius: 12, color: '#fff', fontSize: '14px', fontWeight: 600 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setShowMatchModal(true); setMatchingState('idle'); }}
              >
                <Zap size={15} color="#fff" strokeWidth={2.5} /> 立即匹配体验官
              </motion.button>
            </div>
          </motion.div>

          {/* 体验官卡片列表（横向滚动） */}
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {coaches.map((c, i) => (
              <motion.div
                key={c.id}
                className="flex-shrink-0"
                style={{ width: 140 }}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <div className="p-3 flex flex-col items-center text-center" style={{ background: '#453a60', borderRadius: 14 }}>
                  {/* 体验官头像 + 在线状态 */}
                  <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid rgba(155,126,222,0.4)' }}>
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    {/* 在线状态指示 */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                      style={{ background: c.online ? '#4ECDC4' : 'rgba(245,239,232,0.3)', borderColor: '#453a60' }} />
                  </div>
                  <span style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600, marginBottom: 2 }}>{c.name}</span>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '10px', marginBottom: 4 }}>{c.specialty}</span>
                  <div className="flex items-center gap-1">
                    <IcStar size={9} color="#FFD93D" />
                    <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: '11px', fontWeight: 600 }}>{c.rating}</span>
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: '10px' }}>·{c.sessions}次</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ====== 7. 恋爱物种鉴定 ====== */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <IcRadar size={14} color="#B39DDB" />
            <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>你的恋爱物种</span>
          </div>
          <div className="p-4" style={{ background: '#453a60', borderRadius: 20 }}>
            <SpeciesCard />
          </div>
        </motion.div>

      </div>

      {/* ====== 练习详情弹窗（底部弹出） ====== */}
      <AnimatePresence>
        {activePractice && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setActivePractice(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="px-5 py-5">
                {/* 练习信息头部 */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <IconBubble size={52} bg={activePractice.bg}>{activePractice.icon}</IconBubble>
                    <div>
                      <h2 style={{ color: '#f5efe8', fontSize: '19px', fontWeight: 600, marginBottom: 4 }}>{activePractice.title}</h2>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: '12px', fontStyle: 'italic' }}>互动恋爱故事</span>
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActivePractice(null)}>
                    <X size={22} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                </div>

                {/* 练习描述 */}
                <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: 16 }}>{activePractice.desc}</p>

                {/* 开始练习按钮 */}
                <motion.button
                  className="w-full py-3.5 flex items-center justify-center gap-2"
                  style={{ background: gradients.coral, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startChat(String(activePractice.id), activePractice.title)}
                >
                  <IcSparkle size={16} color="#fff" /> 开始阅读故事
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== AI 对话全屏页 ====== */}
      <AnimatePresence>
        {showChat && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

            {/* 对话页顶部导航 */}
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <div className="flex items-center gap-3">
                  <IconBubble size={32} bg={gradients.coral}><IcRobot size={16} color="#fff" /></IconBubble>
                  <div>
                    <p style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>AI 陪练教练</p>
                    <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '11px' }}>{chatTitle || '练习中'}</p>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowChat(false)}>
                  <X size={22} color="rgba(245,239,232,0.58)" />
                </motion.button>
              </div>
            </div>

            {/* 对话消息列表 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {messages.map((msg, i) => (
                <motion.div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  {msg.role !== 'user' && (
                    <IconBubble size={28} bg={msg.role === 'system' ? gradients.indigo : gradients.coral} className="mr-2 mt-1 flex-shrink-0">
                      {msg.role === 'system' ? <IcTarget size={12} color="#fff" /> : <IcRobot size={12} color="#fff" />}
                    </IconBubble>
                  )}
                  <div className="max-w-[80%] px-4 py-3" style={{
                    background: msg.role === 'user' ? gradients.coral : msg.role === 'system' ? '#574d72' : '#453a60',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    color: msg.role === 'user' ? '#fff' : msg.role === 'system' ? 'rgba(245,239,232,0.75)' : '#f5efe8',
                    fontSize: '14px', lineHeight: 1.6,
                    fontStyle: msg.role === 'system' ? 'italic' : 'normal',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
              <div className="flex items-center gap-3">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="输入你的回答..."
                  className="flex-1 h-11 px-4 bg-transparent outline-none"
                  style={{ background: '#453a60', borderRadius: 22, color: '#f5efe8', fontSize: '14px' }}
                />
                <motion.button
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: chatInput.trim() ? gradients.coral : '#574d72' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                >
                  <Send size={16} color={chatInput.trim() ? '#fff' : 'rgba(245,239,232,0.38)'} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 真人匹配弹窗 ====== */}
      {/* @API 匹配逻辑对接后端 WebSocket：POST /api/real/match */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowMatchModal(false)} />
            <motion.div className="relative w-[90%] overflow-hidden"
              style={{ maxWidth: 360, background: '#453a60', borderRadius: 20 }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="p-6 text-center">
                {/* 匹配状态：空闲 */}
                {matchingState === 'idle' && (
                  <>
                    <div className="flex justify-center mb-4">
                      <IconBubble size={64} bg={gradients.purple} glow><Users size={28} color="#fff" strokeWidth={2} /></IconBubble>
                    </div>
                    <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, marginBottom: 8 }}>寻找体验官</h3>
                    <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', lineHeight: 1.6, marginBottom: 20 }}>
                      系统将为你匹配一位在线体验官，进行真人对话练习
                    </p>
                    <motion.button
                      className="w-full py-3.5 flex items-center justify-center gap-2"
                      style={{ background: gradients.purple, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={startMatching}
                    >
                      <Zap size={16} color="#fff" strokeWidth={2.5} /> 开始匹配
                    </motion.button>
                  </>
                )}

                {/* 匹配状态：匹配中 */}
                {matchingState === 'matching' && (
                  <>
                    <div className="flex justify-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      >
                        <IconBubble size={64} bg={gradients.purple} glow><IcRadar size={28} color="#fff" /></IconBubble>
                      </motion.div>
                    </div>
                    <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, marginBottom: 8 }}>正在匹配中...</h3>
                    <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', lineHeight: 1.6 }}>
                      正在为你寻找最合适的体验官
                    </p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full"
                          style={{ background: '#B39DDB' }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </>
                )}

                {/* 匹配状态：已匹配 */}
                {matchingState === 'matched' && (() => {
                  const onlineCoaches = coaches.filter(c => c.online);
                  const matched = onlineCoaches[0];
                  return (
                    <>
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '3px solid #4ECDC4' }}>
                          <img src={matched.avatar} alt={matched.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, marginBottom: 4 }}>匹配成功！</h3>
                      <p style={{ color: '#4ECDC4', fontSize: '14px', fontWeight: 600, marginBottom: 4 }}>{matched.name}</p>
                      <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px', marginBottom: 4 }}>{matched.desc}</p>
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <IcStar size={11} color="#FFD93D" />
                        <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: '12px' }}>{matched.rating} · {matched.sessions}次辅导</span>
                      </div>
                      {/* @API 进入真人对话房间：POST /api/real/join { sessionId } */}
                      <motion.button
                        className="w-full py-3.5 flex items-center justify-center gap-2"
                        style={{ background: gradients.mint, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowMatchModal(false)}
                      >
                        <IcChat size={16} color="#fff" /> 进入对话
                      </motion.button>
                    </>
                  );
                })()}

                {/* 关闭按钮 */}
                <motion.button
                  className="absolute top-4 right-4"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMatchModal(false)}
                >
                  <X size={20} color="rgba(245,239,232,0.5)" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}