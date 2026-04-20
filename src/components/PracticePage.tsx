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
 * ========================================
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Lock, X, Send, Users, Zap } from 'lucide-react';
import {
  IconBubble, IcChat, IcTarget, IcMask, IcWave, IcLetter, IcDove,
  IcGift, IcHeartSpark, IcRobot, IcPen, IcTrophy, IcStar, IcSparkle,
  IcHeart, IcFire, IcShield, IcRadar, IcCrown, gradients,
} from './CuteIcons';
import { useUser } from '../context/UserContext';
import { useProfileModal } from './ProfileModals';
import { ChatTranslator } from './ChatTranslator';
import { RedFlagDetector } from './RedFlagDetector';
import { DatePlanner } from './DatePlanner';
import { bookCoach } from './CoachChatPage';
import { ChapterImmersiveView } from './ChapterImmersiveView';
import { VIPPage } from './VIPPage';
import { KenBurnsImage } from './KenBurnsImage';
import { chatStream, type ChatMessage } from '../services/ai';
import { getAllRoleKids, roleCardToPartnerInfo, buildRolePersonaPrompt } from '../services/roleCards';
import {
  getLevelCard, getMaxTurns, getMinTurnsForGoodEnding, getOpening,
  buildLevelScenePrompt, getScoringDims, getEndings,
} from '../services/levelCards';
import {
  type AffinityState, type AffinityDelta,
  emptyAffinity, mainAffinity, applyDelta, initAffinity, persistOnEnd,
} from '../services/affinity';
import { parseChatMeta, stripMetaFragments, type ChatMeta } from '../services/chatMeta';
import { beginAttempt, peekAttempts, type VipTier } from '../services/attemptLimit';
import { scoreLevel, buildAffinityMetrics, xpRewardForStar, type HardMetrics } from '../services/levelScore';
import { ChatSummary, type SummaryHighlight } from './ChatSummary';

/* ---------- 故事系统 ---------- */

/** 剧情故事章节 */
const storyChapters = [
  {
    id: 1, name: '初遇', coverImage: '/chapters/cover/story-1.jpg',
    narrative: '推开那扇门的时候，你不知道命运已经开始倒计时。',
    readCount: '已读 4 节', vip: false,
    synopsis: '一座夏天尾巴的城市，一个没有特别计划的下午。你为了躲雨拐进一家不起眼的咖啡馆，却在推门的一瞬间停住了。临窗的那个人抬起头，笑了一下——你以为只是擦肩而过，但接下来的六个瞬间，会让你明白什么叫「命中注定」并不是诗，而是一条来不及躲的绳索。',
  },
  {
    id: 2, name: '破冰', coverImage: '/chapters/cover/story-2.jpg',
    narrative: '沉默不是没有话说，是还没找到那个让你想开口的人。',
    readCount: '已读 2 节', vip: false,
    synopsis: '从注视到对话，中间隔着的从来不止一条街。你要学会在不显得冒失的前提下接近，要学会在冷场三秒里抢回节奏，要学会什么时候该收、什么时候该进。你以为破冰是对方的事，直到你发现——最难凿开的那块冰，其实在你自己心里。',
  },
  {
    id: 3, name: '暧昧', coverImage: '/chapters/cover/story-3.jpg',
    narrative: '那些心跳加速的瞬间，你以为对方听不见吗？',
    readCount: '尚未翻开', vip: false,
    synopsis: '连续六天的见面，没有一句越界的话。对话停在拐弯，眼神停在一秒半，指尖停在快要碰到的距离。你们都在试探，又都在装作不经意。这一章没有告白、没有结论，只有六个让血压升高的瞬间——谁先醒，谁先输，谁先说出那句话。',
  },
  {
    id: 4, name: '热恋', coverImage: '/chapters/cover/story-4.jpg',
    narrative: '从那天起，所有歌里唱的都有了画面。',
    readCount: '尚未翻开', vip: false,
    synopsis: '关系确定的那一刻，世界重新上了色。但噩梦也从同一天开始——第一次见家长、第一次审美分歧、第一次意识到「在一起」不等于「无条件合拍」。这一章不再是追逐的游戏，而是两个独立的人，如何不把彼此磨成对方。',
  },
  {
    id: 5, name: '考验', coverImage: '/chapters/cover/story-5.jpg',
    narrative: '真正的爱情不是没有风暴，是风暴过后你还在。',
    readCount: '尚未翻开', vip: false,
    synopsis: '糖开始发苦。异地、误会、旧人、日常的磨损——每一项都能压垮一段关系。这一章没有标准答案，只能告诉你一件事：有些人值得你穿过风暴，有些人不值得。怎么分辨？得自己走这一趟。走完的人会明白：留下来不是因为没吵过，而是吵完之后还愿意回头。',
  },
];

/** 人物邂逅分组 */
const challengeGroups = [
  {
    id: 1, name: '温柔的人', coverImage: '/chapters/cover/challenge-1.jpg',
    narrative: '有些人笑起来的样子，就像春天突然来了。',
    readCount: '已读 3 节', vip: false,
    synopsis: '她不会把喜欢写在脸上，但会记住你随口说过的那家小店。与温柔的人相处，最大的陷阱是「误以为她没有脾气」。她的委屈都在沉默里，她的信号都在细节里。能不能读懂那些她自己都没说出口的在乎，才是这一组真正的题目。',
  },
  {
    id: 2, name: '疏离的人', coverImage: '/chapters/cover/challenge-2.jpg',
    narrative: '冰山下面藏着的，也许是最热烈的火焰。',
    readCount: '已读 1 节', vip: false,
    synopsis: '开场冷、回复慢、眼神带着防备。但在某些她以为你没在看的瞬间，你会捕捉到完全不同的表情。靠近不是战术问题，是耐心问题——你要先证明自己不会受伤，她才敢让你看到她的裂缝。欲速则不达，在这一组身上体现得最彻底。',
  },
  {
    id: 3, name: '闪耀的人', coverImage: '/chapters/cover/challenge-3.jpg',
    narrative: '人群中最闪亮的那个人，你敢走过去吗？',
    readCount: '尚未翻开', vip: false,
    synopsis: '她被围在光里，你在阴影里观察。那样的人有一百种选择，凭什么在一千张笑脸里记住你？这一组不教你「卸下光环的套路」，而是教你一件更难的事——在她依然闪耀的时候，稳稳地站在旁边，不仰望、不自卑、不被光灼伤。',
  },
  {
    id: 4, name: '脆弱的人', coverImage: '/chapters/cover/challenge-4.jpg',
    narrative: '有时候，陪伴比任何话语都更有力量。',
    readCount: '尚未翻开', vip: false,
    synopsis: '她可能刚结束一段糟糕的关系，可能在原生家庭里挣扎，可能正被职场掏空。你不是救世主，也不能把眼泪当作感动自己的证据。这一组真正的考验不是「怎么让她爱上你」，而是「怎么在不让她二次受伤的前提下，同时保护好你自己」。这很难，但值得学会。',
  },
  {
    id: 5, name: '危险的人', coverImage: '/chapters/cover/challenge-5.jpg',
    narrative: '看清真相需要勇气，但你值得被真诚对待。',
    readCount: '尚未翻开', vip: false,
    synopsis: '话术圆滑、情绪拉扯、PUA、"受害者叙事"的操控、若即若离的上头感……它们都穿着爱的外衣。这一组比起教你"怎么追到她"，更想教你"怎么清醒地识破她，然后转身就走"。有些关系不是没谈好，是从一开始就不该开始。这里的学费，最好提前交。',
  },
];

/** 故事工厂 */
const _ic = [IcWave, IcChat, IcTarget, IcSparkle, IcLetter, IcMask, IcHeartSpark, IcRobot, IcPen, IcDove, IcFire, IcTrophy, IcHeart, IcRadar, IcGift, IcStar, IcShield];
const _bg = [gradients.coral, gradients.purple, gradients.mint, gradients.golden, gradients.rose, gradients.sky, gradients.lilac, gradients.lemon, gradients.teal, gradients.indigo, gradients.orange];

/** 单章最大关卡数（用于判定最后两关 & 图片映射） */
const LEVELS_PER_CHAPTER = 6;

/** 角色卡图池（来自 public/chapters/roles/），按关卡 id 确定性分配 */
const _rolePool: string[] = (() => {
  // 37 张（36 张 jpg + 1 张 png），此处手工列出以便静态引用
  const arr: string[] = [];
  for (let i = 1; i <= 36; i++) arr.push(`/chapters/roles/role-${String(i).padStart(2, '0')}.jpg`);
  arr.push('/chapters/roles/role-37.png');
  return arr;
})();
/** 人物郂逅真人封面图池（来自 public/chapters/encounter/）——按章节+节序直接映射 30 张 */
const _encounterPool: string[] = (() => {
  const arr: string[] = [];
  for (let i = 1; i <= 30; i++) arr.push(`/chapters/encounter/encounter-${String(i).padStart(2, '0')}.png`);
  return arr;
})();
/** 稳定伪随机哈希（基于 id + 章节），让每次渲染图片固定不抖 */
function pickRoleImage(chapter: number, levelIdx: number, seed = 0): string {
  const h = (chapter * 1000003) ^ (levelIdx * 2654435761) ^ (seed * 7919);
  return _rolePool[Math.abs(h) % _rolePool.length];
}
/** 人物郂逅模式专用：按章节顺序直接映射真人封面 */
function pickEncounterImage(chapter: number, levelIdx: number): string {
  const idx = ((chapter - 1) * LEVELS_PER_CHAPTER + levelIdx) % _encounterPool.length;
  return _encounterPool[idx];
}

/** 搭档特性标签池 —— 确认后锁定到对话 prompt（方案 A：人设标签） */
const _traitPool: string[] = [
  '傲娇', '毒舌', '慢热', '温柔', '话痨', '闷骚', '机灵', '冷静',
  '撒娇', '强势', '笨拙', '贴心', '神秘', '直率', '腹黑', '天然呆',
  '成熟', '活泼', '害羞', '高冷', '暖心', '任性', '文艺', '幽默',
];
/** 搭档名字池（中性名 & 女性向为主，后续可扩充） */
const _partnerNames: string[] = [
  '林夏', '苏晚', '顾星河', '陈知夏', '江予安', '温时', '白野', '沈月',
  '周屿', '许愿', '谢迟', '方一一', '黎朝', '宋清辞', '楚辞', '路见欢',
  '姜禾', '秦桑', '温栀', '顾南衣', '柏舟', '容绾', '陆辞', '夏川',
  '叶知秋', '向晚', '程栖', '宁夏', '叶未央', '简清', '卫宁', '殷稚',
  '颜宁', '乔知予', '苏荔', '沈星见',
];
/** 个性签名池（每张图稳定命中一条） */
const _partnerSignatures: string[] = [
  '今天也要元气满满一整天～',
  '不想说话的时候，请让我安静一会儿',
  '最近在学烘焙，下次做饼干给你尝',
  '去过 7 个国家，最想回到那个雨天的里斯本',
  '我喜欢在人多的地方发呆，越热闹越孤单',
  '夜里写字的人，都有点小秘密',
  '你要是无聊，就来找我聊聊天气',
  '永远相信有趣比好看重要',
  '我其实挺会笑的，只是不太轻易笑',
  '最近在戒糖，但看到你还是会甜',
  '表情包收藏了 3200 张，能聊一年不重样',
  '喜欢古典乐和电子乐，别问为什么，矛盾才有趣',
  '有点社恐，但和对的人可以讲一整晚',
  '爱猫、爱书、爱海，不爱麻烦',
  '最擅长假装听不懂的挑逗',
  '只是看起来很乖而已',
  '喜欢冷静的人，但更喜欢能把我逗笑的人',
  '不讲情话，但会记得你所有小事',
  '我走路很快，希望你能跟上',
  '温柔是我的装备，不是我的本性',
  '做过最勇敢的事是换了短发',
  '话少是因为词穷，不是冷漠',
  '想做一个不用解释就被理解的人',
  '其实我也在等一个先开口的你',
  '希望今天的你，比昨天的我开心',
  '嘴上说不要，身体很诚实的那种',
  '我不是高冷，我只是在充电',
  '喜欢的东西很少，但都是最喜欢的',
  '如果你能认出我眼里的光，你就赢了',
  '别叫我宝贝，我会笑场',
];
/** 根据角色图路径稳定分配 3 个特性标签（同一张图永远同样标签） */
function getPartnerTraitsByImg(img: string): string[] {
  let h = 0;
  for (let i = 0; i < img.length; i++) h = ((h << 5) - h + img.charCodeAt(i)) | 0;
  const picks: string[] = [];
  const used = new Set<number>();
  for (let k = 0; picks.length < 3 && k < 12; k++) {
    const idx = Math.abs(h ^ (k * 2654435761)) % _traitPool.length;
    if (!used.has(idx)) {
      used.add(idx);
      picks.push(_traitPool[idx]);
    }
  }
  return picks;
}
/** 根据角色图取完整人设（姓名 / 年龄 / 签名 / 特性，稳定不变） */
function getPartnerInfoByImg(img: string): { img: string; name: string; age: number; signature: string; traits: string[] } {
  let h = 0;
  for (let i = 0; i < img.length; i++) h = ((h << 5) - h + img.charCodeAt(i)) | 0;
  const name = _partnerNames[Math.abs(h) % _partnerNames.length];
  const age = 19 + (Math.abs(h >> 3) % 14);          // 19 ~ 32
  const signature = _partnerSignatures[Math.abs(h >> 5) % _partnerSignatures.length];
  const traits = getPartnerTraitsByImg(img);
  return { img, name, age, signature, traits };
}

/** 每关候选搭档池（5 个完整人设，稳定分配）—— 绑定到真实角色卡 R001..R030 */
function getPartnerCandidates(levelId: number, _chapter: number, _idxInChapter: number): { kid: string; img: string; name: string; age: number; signature: string; traits: string[] }[] {
  const allKids = getAllRoleKids();            // ["R001", ..., "R030"]
  if (allKids.length === 0) return [];
  // 按 levelId 稳定挑 5 个不重复的 kid
  const picked: string[] = [];
  const used = new Set<string>();
  for (let k = 0; picked.length < 5 && k < allKids.length * 3; k++) {
    const h = Math.abs((levelId * 131) ^ (k * 2654435761));
    const kid = allKids[h % allKids.length];
    if (!used.has(kid)) {
      used.add(kid);
      picked.push(kid);
    }
  }
  const out: { kid: string; img: string; name: string; age: number; signature: string; traits: string[] }[] = [];
  for (const kid of picked) {
    const info = roleCardToPartnerInfo(kid);
    if (info) out.push(info);
  }
  return out;
}

/** 每大章节的独立进度（已通关的节数，单独计算不串联） */
const STORY_PROGRESS: Record<number, number> = { 1: 4, 2: 2, 3: 0, 4: 0, 5: 0 };
const CHALLENGE_PROGRESS: Record<number, number> = { 1: 3, 2: 1, 3: 0, 4: 0, 5: 0 };
const ZERO_PROGRESS: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

function buildLevels(raw: [string, string, number, boolean][], startId: number, progress: Record<number, number>) {
  // 统计每章级计数，用于定位"最后两关"
  const perChapterIndex: Record<number, number> = {};
  // 人物郂逅模式（startId = 101）用真人封面；剧情模式用角色卡
  const isEncounter = startId === 101;
  return raw.map(([title, desc, chapter], i) => {
    const Ic = _ic[i % _ic.length];
    const idxInChapter = (perChapterIndex[chapter] = (perChapterIndex[chapter] ?? -1) + 1);
    // 每章最后两关标为 VIP（即 idx 4, 5，0-based）
    const vip = idxInChapter >= LEVELS_PER_CHAPTER - 2;
    // 依据独立进度计算是否已完成（各章独立，不串联）
    const completed = idxInChapter < (progress[chapter] ?? 0);
    return {
      id: startId + i,
      title,
      desc,
      chapter,
      idxInChapter,
      completed,
      unlocked: completed,     // 兼容旧字段：已完成 = unlocked
      vip,
      image: isEncounter
        ? pickEncounterImage(chapter, idxInChapter)
        : pickRoleImage(chapter, idxInChapter, startId),
      isEncounter,
      icon: <Ic size={22} color="#fff" />,
      bg: _bg[i % _bg.length],
    };
  });
}

/** 剧情故事 × 30（5章 × 6节） */
const storyRaw: [string, string, number, boolean][] = [
  // 第1章：初遇
  ['那杯拿铁的温度', '推门进去的瞬间，你闻到了烘焙的香气，还有一个低头微笑的人', 1, true],
  ['第 14 层的三十秒', '电梯门合上，你们之间只剩一步的距离和无限的可能', 1, true],
  ['同一本书的两只手', '你伸手去拿那本旅行指南，却碰到了另一只温热的手', 1, true],
  ['角落里的目光', '吵闹的聚会里，你注意到角落安静坐着的那个人', 1, true],
  ['输入框里的勇气', '打了又删，删了又打，手指悬在发送键上方', 1, true],
  ['好巧，又是你', '这座城市这么大，为什么转角总能遇见同一个人', 1, true],
  // 第2章：破冰
  ['原来你也喜欢', '当你发现对方手机壳上印着你最爱的乐队', 2, true],
  ['笑声是最好的桥梁', '气氛突然冻住了，你需要一个恰到好处的玩笑', 2, true],
  ['从天气聊到了星星', '聊着聊着，你们不知不觉从浅水区游向了深海', 2, true],
  ['已读不回的艺术', '有些等待是策略，有些等待是尊重', 2, true],
  ['"嗯"字之后的拯救', '对话快要断气了，你还有三秒钟做出反应', 2, true],
  ['临走前的回眸', '告别的方式决定了下一次见面的概率', 2, true],
  // 第3章：暧昧
  ['只想和你走这段路', '"要不我送你？"看似随意的一句话，你排练了一整天', 3, true],
  ['眼神不会说谎', '你偷看对方的时候，发现对方也在偷看你', 3, true],
  ['措辞开始小心翼翼', '你开始在每句话里反复斟酌用词——朋友不会这样', 3, true],
  ['"这周六有空吗"', '表面在约饭，其实是在赌整个未来', 3, true],
  ['指尖的距离', '走路时手背不经意碰到一起，谁都没有躲开', 3, true],
  ['月光下的试探', '"你觉得我们算什么呢？"——这个问题你在心里问了一百遍', 3, true],
  // 第4章：热恋
  ['紧张到手心出汗', '提前了四十分钟到，在镜子前整理了第三次衣领', 4, true],
  ['藏在外套口袋里的', '有些心意不用说出口，放在触手可及的地方就好', 4, true],
  ['三点半的秘密', '凌晨的视频电话，你们聊到了谁都不知道的童年', 4, true],
  ['心跳盖过了背景音乐', '"我想说一件事，你听完再回答好不好"', 4, true],
  ['在他们面前的你', '这是第一次以"对象"的身份出现在另一个世界', 4, true],
  ['"以后就是我们了"', '不再是"我"和"你"，而是"我们"', 4, true],
  // 第5章：考验
  ['摔门之后的十分钟', '坐在门的两边，谁也不说话，但都没有走远', 5, true],
  ['2000 公里的晚安', '屏幕那头的呼吸声，是今天最温柔的声音', 5, true],
  ['那条消息通知', '你看见了不该看的内容，手指开始发抖', 5, true],
  ['第一次觉得陌生', '"我以为你会理解"——这句话两个人同时说了出来', 5, true],
  ['沙发两端的距离', '同一个屋檐下，什么时候开始不目光相接了', 5, true],
  ['平凡日子里的光', '没有烟火，没有惊喜，但你看着对方发呆的样子会笑', 5, true],
];
const storyLevels = buildLevels([...storyRaw], 1, STORY_PROGRESS);
const storyLevelsNew = buildLevels([...storyRaw], 1, ZERO_PROGRESS);

/** 人物邂逅 × 30（5组 × 6节） */
const challengeRaw: [string, string, number, boolean][] = [
  // 第1组：温柔的人
  ['图书馆的小纸条', '她把笔记递过来的时候，你看到上面画了一只小猫', 1, true],
  ['隔壁传来的歌声', '每天傍晚六点，窗户那边都会飘来同一首歌的旋律', 1, true],
  ['他多带了一把伞', '"早上看天气预报说下雨，就多拿了一把。"', 1, true],
  ['诗集里夹着的车票', '他翻开书的时候，一张去海边的车票飘了下来', 1, true],
  ['球场边的矿泉水', '他跑过来第一件事不是擦汗，是递给你一瓶水', 1, true],
  ['多加了一颗草莓', '"这杯是我请的，特调款。"她笑得像偷偷做了好事', 1, true],
  // 第2组：疏离的人
  ['她只跟猫说话', '你以为她不理任何人，直到你看到她蹲下来哄流浪猫', 2, true],
  ['会议室外的叹息', '门关上之后，你听到了和刚才完全不同的疲惫声音', 2, true],
  ['黑板上多出的公式', '你看不懂她写的证明过程，但你看得出她写字时很快乐', 2, true],
  ['垃圾桶里的第六稿', '她对自己的苛刻远超你的想象，但作品真的很美', 2, true],
  ['深夜亮着的那盏灯', '他不说话，但他的代码里藏着你能懂的浪漫注释', 2, true],
  ['"我才不是故意拍你"', '相机里有 47 张你没发现的偷拍，每一张都对焦清晰', 2, true],
  // 第3组：闪耀的人
  ['她记得所有人的名字', '在她和每个人碰杯之后，她端着酒走向了你', 3, true],
  ['笑声背后的眼神', '全场都在笑，只有你注意到他笑完后眼神一闪而过的空', 3, true],
  ['关掉滤镜之后', '镜头外的她素颜吃着泡面，跟屏幕里判若两人', 3, true],
  ['"你第一次来这里吧"', '他的热情让你分不清是职业习惯还是因为你特别', 3, true],
  ['第三杯酒的秘密', '"说吧，第三杯的时候大家都会讲真心话的。"', 3, true],
  ['名片背后的故事', '他递过来的名片比谁都多，但你那张他没要回去', 3, true],
  // 第4组：脆弱的人
  ['她收集了所有落花', '别人看到地上的花会踩过去，她会蹲下来小心翼翼捧起', 4, true],
  ['吼完之后递的纸巾', '他嗓门大得吓人，但他递纸巾的手是轻的', 4, true],
  ['那句没说完的话', '你不经意的一句话让空气突然安静了，她低头不看你', 4, true],
  ['凌晨两点的电话', '"我知道很晚了，但你现在能听我说几句吗?"', 4, true],
  ['还没摘下的手链', '她手腕上那条手链的风格，明显不是她自己会选的', 4, true],
  ['改了八遍的消息', '"去还是不去？"她把手机递给你看——聊天框里全是草稿', 4, true],
  // 第5组：危险的人
  ['"我就随便问问"', '每句话都无辜，但你总觉得她在下一盘很大的棋', 5, true],
  ['那个蓝色的已读标记', '你盯着屏幕看了四十分钟，对话框安静得让人窒息', 5, true],
  ['每条朋友圈都有新人', '你不确定自己是唯一，但你确定每次看到都会难受', 5, true],
  ['故意迟到的三十分钟', '"我就看看你会不会等我"——你不知道这是一场考试', 5, true],
  ['"你离开我什么都不是"', '当有人开始否定你的一切，你需要看清这不是爱', 5, true],
  ['完美到让人不安', '笑容太恰当，关心太及时，完美得不像一个真实的人', 5, true],
];
const challengeLevels = buildLevels([...challengeRaw], 101, CHALLENGE_PROGRESS);
const challengeLevelsNew = buildLevels([...challengeRaw], 101, ZERO_PROGRESS);

const coaches = [
  { id: 1, name: '汪俊豪', avatar: '/avatars/face1.jpg', specialty: '约会场景', rating: 4.9, sessions: 256, online: true, desc: '国家二级心理咨询师' },
  { id: 2, name: '余水', avatar: '/avatars/face2.png', specialty: '情感沟通', rating: 4.8, sessions: 189, online: true, desc: '恋爱导师 · 全关卡通关者' },
  { id: 3, name: '占方剑', avatar: '/avatars/face3.png', specialty: '聊天技巧', rating: 4.95, sessions: 312, online: false, desc: '两性沟通专家' },
  { id: 4, name: '窦国立', avatar: '/avatars/face4.png', specialty: '冲突化解', rating: 4.85, sessions: 145, online: true, desc: '情感博主 · 通关认证导师' },
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
  'sos': [
    { role: 'system', text: '🆘 恋爱急诊室 — 快速解决你正在面对的问题' },
    { role: 'ai', text: '别着急，告诉我你遇到了什么状况？\n\n1️⃣ 被已读不回了怎么办？\n2️⃣ 冷战/吵架后怎么破冰？\n3️⃣ 不知道怎么推进关系\n4️⃣ 其他问题（直接说就好）' },
  ],

};

const userProgress = {
  completedThisWeek: 3,
  weeklyGoal: 5,
  xpEarned: 150,
  xpRemaining: 200,
};

/* ========================================
 *  主组件
 * ======================================== */
export function PracticePage({ pendingAction, onActionConsumed }: {
  pendingAction?: { type: 'openLevel' | 'openChapter' | 'openSos'; mode?: 'story' | 'challenge'; chapterId?: number; levelIndex?: number } | null;
  onActionConsumed?: () => void;
}) {
  /* ---------- 状态管理 ---------- */
  const user = useUser();
  const { openProfile } = useProfileModal();
  const isNewUser = !user.xp && !user.achievements;

  // 进入练习场自动打卡
  useEffect(() => { user.checkIn?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [practiceMode, setPracticeMode] = useState<'story' | 'challenge'>(() =>
    pendingAction ? (pendingAction.mode === 'challenge' ? 'challenge' : 'story') : 'story'
  ); // 关卡模式
  const [immersive, setImmersive] = useState<{ mode: 'story' | 'challenge'; index: number } | null>(null); // 章节沉浸页
  const [showVIP, setShowVIP] = useState(false); // VIP 弹层
  const [activePractice, setActivePractice] = useState<typeof storyLevels[0] | null>(null); // 练习详情弹窗
  const [showChat, setShowChat] = useState(false);                // AI对话页
  const [chatTarget, setChatTarget] = useState<string>('');       // 当前对话场景ID
  const [chatTitle, setChatTitle] = useState('');                  // 当前对话标题
  const [chatPartner, setChatPartner] = useState<{ kid?: string; img: string; name: string; age: number; signature: string; traits: string[] } | null>(null); // 当前聊天搭档人设（可带 kid → 绑定真实角色卡）
  const [chatCoverImg, setChatCoverImg] = useState<string | null>(null);  // 关卡封面图（没选搭档时做AI头像兜底）
  const [attemptGate, setAttemptGate] = useState<{ reason: string } | null>(null); // 次数上限弹层
  const [messages, setMessages] = useState<{ role: string; text: string; innerOS?: string; mood?: string; delta?: number }[]>([]); // 对话消息列表（带 meta 装饰）
  const [chatInput, setChatInput] = useState('');                  // 输入框内容
  /* ---------- 关卡五件套运行时状态 ---------- */
  const [chatLevelKid, setChatLevelKid] = useState<string | null>(null);           // 当前关卡 kid（例：L003）。null = 自由/邂逅
  const [chatMode, setChatMode] = useState<'story' | 'challenge' | 'freestyle'>('freestyle');
  const [chatMaxTurns, setChatMaxTurns] = useState<number>(20);
  const [chatMinTurnsGood, setChatMinTurnsGood] = useState<number>(8);
  const [turnsUsed, setTurnsUsed] = useState<number>(0);
  const [affinity, setAffinity] = useState<AffinityState>(emptyAffinity());
  const [affinityHistory, setAffinityHistory] = useState<AffinityState[]>([]);
  const [highlights, setHighlights] = useState<SummaryHighlight[]>([]);
  const [regrets, setRegrets] = useState<SummaryHighlight[]>([]);
  const [redflagHits, setRedflagHits] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [attemptBadge, setAttemptBadge] = useState<{ used: number; max: number; willGrantXP: boolean } | null>(null);
  const [deltaPopup, setDeltaPopup] = useState<{ val: number; id: number } | null>(null);
  const [openingChoices, setOpeningChoices] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);    // 互动匹配弹窗
  const [matchingState, setMatchingState] = useState<'idle' | 'scene' | 'matching' | 'matched' | 'playing' | 'result'>('idle');
  const [matchRole, setMatchRole] = useState<{ name: string; desc: string; emoji: string; trait: string } | null>(null);
  const [matchScene, setMatchScene] = useState<{ title: string; desc: string; emoji: string; duration: string } | null>(null);
  const [matchTimer, setMatchTimer] = useState(600);
  const [matchMessages, setMatchMessages] = useState<{ role: 'me' | 'them' | 'system'; text: string }[]>([]);
  const [matchInput, setMatchInput] = useState('');
  const [matchScore, setMatchScore] = useState<{ total: number; rolePlay: number; skill: number; interaction: number; rank: number } | null>(null);
  const [showCoachDetail, setShowCoachDetail] = useState<typeof coaches[0] | null>(null);
  const [matchWeeklyUsed, setMatchWeeklyUsed] = useState(1);
  const [showRanking, setShowRanking] = useState(false);          // 排行榜弹窗
  const [bookingSuccess, setBookingSuccess] = useState<{ name: string; time: string } | null>(null); // 预约成功弹窗
  const [expandedChapter, setExpandedChapter] = useState<number | null>(() =>
    pendingAction && pendingAction.chapterId != null ? pendingAction.chapterId : null
  );   // 当前展开的大章节 id（null = 全部收起）
  const [levelImmersive, setLevelImmersive] = useState<{ chapterId: number; index: number } | null>(() =>
    pendingAction?.type === 'openLevel' && pendingAction.chapterId != null
      ? { chapterId: pendingAction.chapterId, index: pendingAction.levelIndex ?? 0 }
      : null
  ); // 小关卡沉浸页
  const cameFromHomeRef = useRef(!!pendingAction); // 是否从首页推荐进入
  // 已锁定的搭档（按小关卡 id 记录，进入该关直接使用）
  const [levelPartners, setLevelPartners] = useState<Record<number, { kid?: string; img: string; name: string; age: number; signature: string; traits: string[] }>>({});


  /* ---------- 关卡列表计算 ---------- */
  const _storyLevels = isNewUser ? storyLevelsNew : storyLevels;
  const _challengeLevels = isNewUser ? challengeLevelsNew : challengeLevels;
  const currentLevels = practiceMode === 'story' ? _storyLevels : _challengeLevels;
  const currentGroups = practiceMode === 'story' ? storyChapters : challengeGroups;

  /* ---------- 来自首页推荐的 pending action（初始化已在 useState 中完成） ---------- */

  // 挂载时消费 action + openChapter 类型需要滚动
  useEffect(() => {
    if (!pendingAction) return;
    onActionConsumed?.();
    if (pendingAction.type === 'openChapter') {
      setTimeout(() => {
        const el = document.querySelector(`[data-chapter-id="${pendingAction.chapterId}"]`);
        if (el && 'scrollIntoView' in el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } else if (pendingAction.type === 'openSos') {
      setTimeout(() => startChat('sos', '恋爱急诊室'), 60);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- 沉浸页章节数据 ---------- */
  const immersiveChapters = currentGroups.map(g => {
    const gl = currentLevels.filter(l => l.chapter === g.id);
    const completedCount = gl.filter(l => l.completed).length;
    const dynamicReadCount = completedCount > 0 ? `已读 ${completedCount} 节` : '尚未翻开';
    return {
      id: g.id,
      name: g.name,
      coverImage: g.coverImage,
      immersiveImage: `/chapters/cover/${practiceMode}-${g.id}.jpg`,
      narrative: g.narrative,
      synopsis: g.synopsis,
      readCount: dynamicReadCount,
      vip: g.vip,
      progress: { unlocked: completedCount, total: gl.length },
    };
  });

  /* ---------- 小关卡沉浸页章节数据（当前展开的大章节 → 6 关） ---------- */
  const levelImmersiveData = (() => {
    if (!levelImmersive) return null;
    const chapterLevels = currentLevels.filter(l => l.chapter === levelImmersive.chapterId);
    const groupMeta = currentGroups.find(g => g.id === levelImmersive.chapterId);
    const chapterLabel = practiceMode === 'story' ? `第 ${levelImmersive.chapterId} 章` : `第 ${levelImmersive.chapterId} 组`;
    const userIsPro = user.isVip || user.isPro();
    const chapters = chapterLevels.map((lv) => {
      const isLocked = lv.vip && !userIsPro;
      const partnerCandidates = isLocked ? undefined : getPartnerCandidates(lv.id, lv.chapter, lv.idxInChapter);
      const confirmedPartner = levelPartners[lv.id] ?? null;
      // 已锁定搭档则立绘使用它的图，否则使用默认 lv.image
      const immersiveImage = confirmedPartner?.img ?? lv.image;
      return {
        id: lv.id,
        name: lv.title,
        coverImage: immersiveImage,
        immersiveImage,
        narrative: lv.desc,
        synopsis: `${groupMeta?.name ?? ''} · 第 ${lv.idxInChapter + 1} 节\n\n${lv.desc}`,
        readCount: lv.completed ? '已完成' : (isLocked ? '会员专享' : '待挑战'),
        vip: isLocked,
        progress: { unlocked: lv.completed ? 1 : 0, total: 1 },
        unitLabel: `${chapterLabel} · 第 ${lv.idxInChapter + 1} 节`,
        partnerCandidates,
        confirmedPartner,
      };
    });
    return { chapters, initialIndex: levelImmersive.index };
  })();

  /**
   * @API 开始AI对话
   * 后端对接时：POST /api/practice/start { scenarioId }
   * 返回初始对话消息和场景配置
   *
   * 扩展：第四个参数 opts 指定关卡 kid 与模式，用于启用"五件套"
   */
  const startChat = (
    dialogueKey: string,
    title: string,
    partner?: { kid?: string; img: string; name: string; age: number; signature: string; traits: string[] } | null,
    opts?: { levelKid?: string | null; mode?: 'story' | 'challenge' | 'freestyle'; coverImage?: string | null }
  ) => {
    const mode = opts?.mode ?? (opts?.levelKid ? 'story' : 'freestyle');
    const levelKid = opts?.levelKid ?? null;

    // ---- 次数闸门 ----
    const tier: VipTier = user.subTier === 'proplus' ? 'proplus' : (user.subTier === 'pro' ? 'pro' : 'free');
    if (levelKid) {
      const res = beginAttempt(levelKid, tier);
      if (!res.allowed) {
        setAttemptGate({ reason: res.reason || '今日次数已用完，明天再来或升级会员获得更多次数。' });
        return;
      }
      setAttemptBadge({ used: res.triesUsed, max: peekAttempts(levelKid, tier).maxPerDay, willGrantXP: res.willGrantXP });
    } else {
      setAttemptBadge(null);
    }

    setChatTarget(dialogueKey);
    setChatTitle(title);
    setChatPartner(partner ?? null);
    setChatCoverImg(opts?.coverImage ?? null);
    setChatLevelKid(levelKid);
    setChatMode(mode);

    // ---- 初始化轮数与好感 ----
    const maxT = levelKid ? getMaxTurns(levelKid) : 20;
    const minT = levelKid ? getMinTurnsForGoodEnding(levelKid) : 8;
    setChatMaxTurns(maxT);
    setChatMinTurnsGood(minT);
    setTurnsUsed(0);
    const initAff = initAffinity(mode === 'challenge' ? 'challenge' : 'story', partner?.kid);
    setAffinity(initAff);
    setAffinityHistory([initAff]);
    setHighlights([]);
    setRegrets([]);
    setRedflagHits(0);
    setShowSummary(false);

    // ---- 开场白 ----
    let initialMessages: { role: string; text: string }[] = [];
    if (levelKid) {
      const opening = getOpening(levelKid);
      if (opening.message) {
        initialMessages = [{ role: 'ai', text: opening.message }];
      }
      setOpeningChoices(opening.choices || []);
    } else {
      setOpeningChoices([]);
    }
    if (initialMessages.length === 0) {
      initialMessages = aiDialogues[dialogueKey] || [
        { role: 'ai', text: '（你们终于坐下来了，对方看着你，等你先开口）' },
      ];
    }
    setMessages(initialMessages);

    setShowChat(true);
    setActivePractice(null);
  };

  /** 清理 AI 回复中的动作/表情旁白（圆括号或方括号内容）——让对话更像真人 */
  const stripRolePlayMarkers = (text: string): string => {
    return text
      .replace(/[（(][^（()）]*?(?:稍显|微笑|皱眉|点头|叹气|低头|抬头|思索|犹豫|停顿|沉默|略带|深呼吸|摇头|歪头|眯眼|看着|注视|摸|握|靠|侧|转身|眨眼|撇嘴|抿嘴|动作|表情|语气|神情|脸色|脸上|眼神)[^（()）]*?[)）]/g, '')
      .replace(/[\[【][^\[\]【】]*?(?:动作|旁白|内心|内心独白|stage)[^\[\]【】]*?[\]】]/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  /**
   * 发送消息 — 调用 DeepSeek 流式接口
   * 后端 /api/chat（vite 代理到 localhost:3001）
   */
  const abortRef = useRef<AbortController | null>(null);
  const sendMessage = (overrideText?: string) => {
    const override = typeof overrideText === 'string' ? overrideText : undefined;
    const text = (override ?? chatInput).trim();
    if (!text) return;
    if (showSummary) return; // 已结束

    const userMsg = text;
    const nextMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages([...nextMessages, { role: 'ai', text: '' }]);
    if (!override) setChatInput('');
    setOpeningChoices([]); // 用户一旦开口就撤掉预设选项
    setTurnsUsed(t => t + 1);

    // 构造 system prompt：场景（关卡卡） + 搭档人设 + 好感度实时指令 + JSON tail 规则
    const scenePrompt = chatLevelKid ? buildLevelScenePrompt(chatLevelKid) : '';
    const sceneSystem = messages.find(m => m.role === 'system')?.text || '';
    const sceneHint = sceneSystem.replace(/^📍\s*场景：/, '').replace(/^🆘\s*/, '');

    // 搭档人设段
    let partnerBlock = '';
    if (chatPartner) {
      if (chatPartner.kid) {
        partnerBlock = buildRolePersonaPrompt(chatPartner.kid);
      }
      if (!partnerBlock) {
        partnerBlock = [
          `你扮演的人物档案：`,
          `- 姓名：${chatPartner.name}`,
          `- 年龄：${chatPartner.age}`,
          `- 个性标签：${chatPartner.traits.join('、')}`,
          `- 个人签名：${chatPartner.signature}`,
        ].join('\n');
      }
    }

    // 轮数阶段提示
    const remaining = Math.max(0, chatMaxTurns - (turnsUsed + 1));
    const stage =
      turnsUsed < 2 ? 'opening（刚见面，试探性开场）'
      : remaining <= 2 ? 'closing（即将收尾，朝一个自然的结束靠拢）'
      : remaining <= Math.floor(chatMaxTurns / 3) ? 'climax（情绪高点，可以更有戏剧性）'
      : 'developing（正常推进，制造小冲突或小惊喜）';

    // 好感维度实时状态
    const affLine = `当前四维好感（0-100）：心动=${affinity.heart} / 信任=${affinity.trust} / 理解=${affinity.mind} / 暧昧=${affinity.spark}。主好感=${mainAffinity(affinity)}。`;

    // 评分维度（引导 AI 在 meta 中体现）
    const dims = chatLevelKid ? getScoringDims(chatLevelKid).map(d => d.name).join('、') : '自然度、情商、吸引力、分寸感';

    const systemPrompt = [
      `你正在和用户进行恋爱场景的角色扮演。场景：${chatTitle || '自由练习'}。`,
      scenePrompt,
      sceneHint ? `补充背景：${sceneHint}` : '',
      partnerBlock,
      affLine,
      `当前剧情阶段：${stage}。已进行 ${turnsUsed + 1}/${chatMaxTurns} 轮，还剩 ${remaining} 轮。`,
      [
        `【硬性规则 · 必须严格遵守】`,
        `1. 你是真人聊天，不是剧本演员。绝对不要输出任何动作、表情、神态、心理的旁白描写。`,
        `2. 严禁使用圆括号（）或方括号【】包裹的动作描述，例如"（微笑）""（低头思索）"一律不允许。`,
        `3. 严禁出现"评分""分""提示""建议""你可以..."这种上帝视角元信息。你不是导师、不是系统，只是场景中的那个人。`,
        `4. 直接用第一人称说话，像真实微信对话一样，口语化、短句为主。每次回复 1-3 句即可。`,
        `5. 表情可以用 emoji 或"哈哈""嗯"这种语气词，但不要写"(笑)"。`,
        `6. 根据用户刚才的那句话，基于你的性格和当前好感度，给出真实合理的反应。用户表现好则变暖；翻车则抽离/冷淡。`,
        `7. 如果用户已经严重踩雷（如冒犯/油腻/骚扰），请在 meta 中将对应维度 delta 给到较大负值并考虑 suggest_end=true。`,
      ].join('\n'),
      [
        `【输出格式 · 极其重要】`,
        `在你的正文回复之后，必须**追加一个 JSON meta 块**，格式为：`,
        `<meta>{"deltas":{"heart":<-10~+10整数>,"trust":<-10~+10整数>,"mind":<-10~+10整数>,"spark":<-10~+10整数>},"mood":"<当前情绪，如 开心/犹豫/尴尬/生气>","inner_os":"<对方此刻真实内心独白，一句话>","suggest_end":<true|false>}</meta>`,
        `评分维度参考：${dims}。`,
        `meta 必须是严格 JSON，不要换行在 JSON 内部，不要注释。正文和 meta 之间不要有其他标签。`,
      ].join('\n'),
    ].filter(Boolean).join('\n\n');

    // API messages
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...nextMessages
        .filter(m => m.role !== 'system' && m.text.trim())
        .map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        })),
    ];

    abortRef.current?.abort();
    abortRef.current = chatStream(
      apiMessages,
      (chunk) => {
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === 'ai') {
            const raw = last.text + chunk;
            // 流途中实时把 meta 片段从显示中过滤掉
            copy[copy.length - 1] = { ...last, text: stripMetaFragments(raw) };
            (copy[copy.length - 1] as any)._raw = raw; // 临时存完整文本
          }
          return copy;
        });
      },
      () => {
        // 流结束：解析 meta，更新 affinity，记录 highlight/regret，判断结束
        setMessages(prev => {
          const copy = [...prev];
          const last = copy[copy.length - 1] as any;
          if (last && last.role === 'ai') {
            const raw = last._raw || last.text;
            const { cleanText, meta } = parseChatMeta(raw);
            const finalText = stripRolePlayMarkers(cleanText);
            const d = meta.deltas;
            const newAff = applyDelta(affinity, d);
            const deltaMain = mainAffinity(newAff) - mainAffinity(affinity);
            copy[copy.length - 1] = {
              role: 'ai',
              text: finalText || '……',
              innerOS: meta.inner_os,
              mood: meta.mood,
              delta: deltaMain,
            };

            // 更新 affinity state（异步但用 functional 保证顺序）
            setAffinity(newAff);
            setAffinityHistory(h => [...h, newAff]);

            // 飞字动画
            if (deltaMain !== 0) {
              const id = Date.now();
              setDeltaPopup({ val: deltaMain, id });
              setTimeout(() => setDeltaPopup(p => (p && p.id === id ? null : p)), 1800);
            }

            // 回放记录
            const userTurn = nextMessages[nextMessages.length - 1]?.text || '';
            const snippet = (finalText || '').slice(0, 60);
            if (deltaMain >= 4) {
              setHighlights(h => [...h, { userText: userTurn, aiReply: snippet, deltaMain }].sort((a, b) => b.deltaMain - a.deltaMain).slice(0, 5));
            } else if (deltaMain <= -4) {
              setRegrets(r => [...r, { userText: userTurn, aiReply: snippet, deltaMain }].sort((a, b) => a.deltaMain - b.deltaMain).slice(0, 3));
              setRedflagHits(n => n + 1);
            }

            // 结束判定
            const hitMaxTurns = turnsUsed + 1 >= chatMaxTurns;
            const tooLow = mainAffinity(newAff) < 20 && turnsUsed + 1 >= 4;
            const aiSuggestEnd = !!meta.suggest_end && turnsUsed + 1 >= chatMinTurnsGood;
            if (hitMaxTurns || tooLow || aiSuggestEnd) {
              setTimeout(() => finalizeChat(newAff), 600);
            }
          }
          return copy;
        });
        abortRef.current = null;
      },
      (err) => {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'ai', text: `（AI 连接失败：${err.message}）` };
          return copy;
        });
        abortRef.current = null;
      }
    );
  };

  /** 结算本次对话 */
  const finalizeChat = (finalAffinity: AffinityState) => {
    // 累积好感（仅 challenge 模式）
    if (chatMode === 'challenge' && chatPartner?.kid) {
      persistOnEnd('challenge', chatPartner.kid, finalAffinity);
    }
    // 准备 metrics & 评分
    const userMsgs = messages.filter(m => m.role === 'user');
    const avgLen = userMsgs.length ? userMsgs.reduce((s, m) => s + m.text.length, 0) / userMsgs.length : 0;
    const affMetrics = buildAffinityMetrics(affinityHistory.length > 0 ? affinityHistory : [finalAffinity]);
    const hard: HardMetrics = {
      userMsgCount: userMsgs.length,
      avgUserMsgLen: avgLen,
      affinityStart: affMetrics.affinityStart,
      affinityEnd: mainAffinity(finalAffinity),
      affinityPeak: Math.max(affMetrics.affinityPeak, mainAffinity(finalAffinity)),
      turnsUsed: turnsUsed,
      maxTurns: chatMaxTurns,
      minTurnsForGoodEnding: chatMinTurnsGood,
      redflagHits,
    };
    // AI 主观分：按当前 4 维等比映射（近似值；真正实现应在 AI 回复中单独要求打分，此处用硬规则代替）
    const aiDimScores: Record<string, number> = {};
    if (chatLevelKid) {
      for (const d of getScoringDims(chatLevelKid)) {
        // 用主好感 + 该维度对应 4 维的加权近似
        aiDimScores[d.name] = Math.round(mainAffinity(finalAffinity) * 0.6 + 40 * 0.4);
      }
    }
    const scoring = chatLevelKid
      ? scoreLevel({ levelKid: chatLevelKid, aiDimScores, metrics: hard })
      : scoreLevel({ levelKid: 'L001', aiDimScores: {}, metrics: hard }); // fallback

    setShowSummary(true);

    // 保存 summary 到 ref 以供 UI 读取（已经用多个 state，直接组装渲染时读取即可）
    (window as any).__foxsayLastScoring = scoring;

    // 给 XP
    if (attemptBadge?.willGrantXP) {
      const xp = xpRewardForStar(scoring.star, chatMode === 'challenge' ? 'challenge' : 'story');
      if (xp > 0) user.updateUser?.({ xp: (user.xp || 0) + xp });
    }
  };

  /* ====== 互动匹配 — 角色扮演场景池 ====== */
  const matchScenes = [
    { title: '咖啡馆偶遇', desc: '周末下午，你在一家安静的咖啡馆看书，隔壁桌的人引起了你的注意...', emoji: '☕', duration: '10分钟' },
    { title: '朋友聚会', desc: '朋友的生日派对上，你被介绍认识了一个新朋友，气氛轻松愉快...', emoji: '🎉', duration: '10分钟' },
    { title: '书店相遇', desc: '在独立书店的推荐书架前，你和另一个人同时伸手去拿同一本书...', emoji: '📚', duration: '10分钟' },
    { title: '加班夜归', desc: '深夜便利店，你和一个同样加班到很晚的人排队等热饮...', emoji: '🌙', duration: '10分钟' },
    { title: '健身房搭讪', desc: '健身房的器械区，你注意到旁边的人似乎不太会用这个设备...', emoji: '💪', duration: '10分钟' },
  ];
  const matchRoles = [
    { name: '温柔学姐', desc: '性格温和，说话轻声细语，喜欢照顾别人', emoji: '🌸', trait: '温柔体贴、善于倾听、偶尔害羞' },
    { name: '高冷设计师', desc: '外表酷酷的，其实内心很有想法，不轻易表露情感', emoji: '🎨', trait: '话少但精准、有品味、慢热型' },
    { name: '活泼运动girl', desc: '阳光开朗，喜欢运动和户外，笑点很低', emoji: '⚡', trait: '主动热情、爱开玩笑、直来直去' },
    { name: '文艺摄影师', desc: '喜欢记录生活的美好，对世界充满好奇', emoji: '📷', trait: '感性浪漫、话题丰富、偶尔文青' },
    { name: '毒舌闺蜜', desc: '说话犀利但心地善良，喜欢"怼人式关心"', emoji: '😏', trait: '嘴硬心软、反应快、考验情商' },
    { name: '社恐程序员', desc: '不太擅长社交但很真诚，需要你主动引导', emoji: '💻', trait: '内向腼腆、回复简短、需要耐心' },
  ];

  const startMatchFlow = () => {
    // 随机分配场景
    const scene = matchScenes[Math.floor(Math.random() * matchScenes.length)];
    setMatchScene(scene);
    setMatchingState('scene');
  };

  const confirmSceneAndMatch = () => {
    setMatchingState('matching');
    // 模拟匹配 8-15 秒
    const delay = 8000 + Math.random() * 7000;
    setTimeout(() => {
      const role = matchRoles[Math.floor(Math.random() * matchRoles.length)];
      setMatchRole(role);
      setMatchingState('matched');
    }, delay);
  };

  const startMatchPlay = () => {
    setMatchingState('playing');
    setMatchTimer(600);
    setMatchMessages([
      { role: 'system', text: `📍 场景：${matchScene?.title}\n${matchScene?.desc}\n\n你的对手角色：${matchRole?.emoji} ${matchRole?.name}\n性格特征：${matchRole?.trait}\n\n⏱ 对话时间 10 分钟，开始吧！` },
    ]);
    // 模拟对方 3 秒后发第一句话
    setTimeout(() => {
      const openings = [
        '嗯...你好呀，第一次来这里吗？',
        '（看了你一眼，微微点头）...你也在等人吗？',
        '哈喽～你是一个人来的呀？',
        '（翻看手机，偶尔抬头看你）...',
        'Hi，你旁边这个位置有人坐吗？',
      ];
      setMatchMessages(prev => [...prev, { role: 'them', text: openings[Math.floor(Math.random() * openings.length)] }]);
    }, 3000);
    setMatchInput('');
  };

  const sendMatchMessage = () => {
    if (!matchInput.trim()) return;
    setMatchMessages(prev => [...prev, { role: 'me', text: matchInput.trim() }]);
    const input = matchInput.trim();
    setMatchInput('');
    // 模拟对方 2-5 秒随机延迟回复
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      const replies = [
        '哈哈，你说的挺有意思的～',
        '嗯嗯，然后呢？',
        '真的吗？我也这么觉得！',
        '（笑了一下）你还挺会聊天的嘛',
        'emmm...让我想想怎么回你',
        '哇，这个我也喜欢！太巧了吧',
        '你平时也会来这边吗？',
        '好啦好啦，别逗我了😂',
        '（认真地看着你）继续说，我在听',
        '原来是这样啊，我之前一直不知道',
      ];
      setMatchMessages(prev => [...prev, { role: 'them', text: replies[Math.floor(Math.random() * replies.length)] }]);
    }, delay);
  };

  const endMatchAndScore = () => {
    const scores = {
      total: 60 + Math.floor(Math.random() * 35),
      rolePlay: 50 + Math.floor(Math.random() * 45),
      skill: 50 + Math.floor(Math.random() * 45),
      interaction: 50 + Math.floor(Math.random() * 45),
      rank: Math.floor(Math.random() * 180) + 20,
    };
    setMatchScore(scores);
    setMatchingState('result');
    setMatchWeeklyUsed(prev => prev + 1);
  };

  /* ---------- 今日推荐场景（取第一个未完成且非 VIP 的场景） ---------- */
  /** @API 后端接口：GET /api/practice/recommendation */
  const todayRecommend = _storyLevels.find(l => !l.completed && !l.vip) ?? _storyLevels[0];

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
              <span style={{ color: '#FF8A80', fontSize: 12, fontWeight: 600 }}>{user.streak || 0}天连续</span>
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
            onClick={() => {
              // 与首页"今日推荐"一致：直接打开该关卡的沉浸式预览（而不是弹窗）
              cameFromHomeRef.current = true;
              setLevelImmersive({ chapterId: todayRecommend.chapter, index: todayRecommend.idxInChapter });
            }}
          >
            {/* 封面图区域 */}
            <div className="relative" style={{ height: 180 }}>
              {/* 真实人物图 + Ken Burns + 倾斜 + 呼吸光斑 */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <KenBurnsImage
                  src={todayRecommend.image}
                  alt="今日精选"
                  seed={todayRecommend.id * 11}
                  duration={12}
                  tilt
                  tiltStrength={4}
                  glow
                  glowColor="rgba(255,180,170,0.45)"
                  loading="eager"
                />
                {/* 色相覆盖 */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: todayRecommend.bg,
                  opacity: 0.35, mixBlendMode: 'soft-light', pointerEvents: 'none',
                }} />
                {/* 装饰性大 emoji 背景 */}
                <span style={{ fontSize: 100, opacity: 0.15, position: 'absolute', right: -10, top: -10, lineHeight: 1, pointerEvents: 'none' }}>💑</span>
                <span style={{ fontSize: 60, opacity: 0.08, position: 'absolute', left: 10, bottom: -5, transform: 'rotate(-12deg)', lineHeight: 1, pointerEvents: 'none' }}>☕</span>
              </div>

              {/* 中心播放按钮：呼吸脉冲 */}
              <motion.div
                className="flex items-center justify-center"
                style={{
                  position: 'absolute', left: '50%', top: '50%',
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                  x: '-50%', y: '-50%',
                  boxShadow: '0 0 0 0 rgba(255,255,255,0.3)',
                }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{
                  scale: [1, 1.08, 1], opacity: 1,
                  boxShadow: [
                    '0 0 0 0 rgba(255,255,255,0.35)',
                    '0 0 0 18px rgba(255,255,255,0)',
                    '0 0 0 0 rgba(255,255,255,0)',
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span style={{ fontSize: 32 }}>▶</span>
              </motion.div>

              {/* 左上标签 */}
              <div style={{
                position: 'absolute', top: 12, left: 12,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
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
                background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
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
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2 px-4 py-2"
                  style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 10, border: '1px solid rgba(245,239,232,0.1)' }}>
                  <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>开始练习</span>
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* ====== 3. 快速工具箱（2×2宫格） ====== */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* 恋爱急诊室 — 仍使用 AI 对话 */}
          <motion.button
            className="flex items-center gap-3 p-4 text-left"
            style={{ background: '#453a60', borderRadius: 14 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => startChat('sos', '恋爱急诊室')}
          >
            <IconBubble size={42} bg={gradients.rose}><IcShield size={20} color="#fff" /></IconBubble>
            <div className="flex-1 min-w-0">
              <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>恋爱急诊室</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>遇到问题马上问</span>
            </div>
          </motion.button>
          {/* 聊天翻译机 */}
          <ChatTranslator delay={0.14} />
          {/* 恋爱避雷针 */}
          <RedFlagDetector delay={0.18} />
          {/* 约会锦囊 */}
          <DatePlanner delay={0.22} />
        </div>

        {/* ====== 5. 关卡模式切换 + 章节标签 + 关卡列表 ====== */}

        {/* 排行榜入口 */}
        <motion.button
          className="w-full mb-4 p-[1px] overflow-hidden"
          style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,217,61,0.4), rgba(255,138,128,0.25), rgba(155,126,222,0.25))' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowRanking(true)}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
        >
          <div className="flex items-center gap-3 px-4 py-3.5"
            style={{ background: 'linear-gradient(135deg, #4a3f65, #453a60)', borderRadius: 15 }}>
            <IconBubble size={38} bg={gradients.golden} glow glowColor="#FFD93D">
              <IcTrophy size={16} color="#fff" />
            </IconBubble>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span style={{ color: '#FFD93D', fontSize: 14, fontWeight: 700 }}>恋爱排行榜</span>
                <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,138,128,0.2)', borderRadius: 4, color: '#FF8A80', fontSize: 9, fontWeight: 700 }}>HOT</span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginTop: 2 }}>看看你能排到第几名</p>
            </div>
            <div className="flex items-center -space-x-2 mr-2">
              {['🥇', '🥈', '🥉'].map((m, i) => (
                <div key={i} className="flex items-center justify-center" style={{ width: 24, height: 24, borderRadius: 12, background: '#3d3358', border: '2px solid #453a60', fontSize: 12 }}>{m}</div>
              ))}
            </div>
            <ChevronRight size={16} color="rgba(245,239,232,0.35)" />
          </div>
        </motion.button>

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
              onClick={() => { setPracticeMode(m); }}
            >
              {m === 'story' ? '📖 我的故事' : '💫 人物邂逅'}
              <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                {(m === 'story' ? _storyLevels : _challengeLevels).length}
              </span>
            </button>
          ))}
        </div>

        {/* 故事章节列表（点击展开小章节，右下入口进入沉浸式立绘页） */}
        <div className="flex flex-col gap-4">
        {currentGroups.map((g, gIdx) => {
          const groupLevels = currentLevels.filter(l => l.chapter === g.id);
          const completedCount = groupLevels.filter(l => l.completed).length;
          const isOpen = expandedChapter === g.id;
          return (
            <div key={g.id} data-chapter-id={g.id}>
              {/* 章节封面卡（点击展开/收起小章节） */}
              <button className="w-full overflow-hidden relative block"
                style={{
                  borderRadius: 18,
                  border: '1px solid rgba(245,239,232,0.08)',
                }}
                onClick={() => setExpandedChapter(isOpen ? null : g.id)}
              >
                {/* 封面图 */}
                <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                  <KenBurnsImage
                    src={g.coverImage}
                    alt={g.name}
                    seed={g.id * 7 + (practiceMode === 'story' ? 0 : 100)}
                    duration={14}
                    tilt
                    tiltStrength={3}
                    glow
                    glowColor={g.vip ? 'rgba(255,200,120,0.28)' : 'rgba(255,255,255,0.14)'}
                  />
                  {/* 渐变暗色叠层 */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(43,37,53,0.95) 0%, rgba(43,37,53,0.5) 50%, rgba(43,37,53,0.15) 100%)',
                    pointerEvents: 'none',
                  }} />

                  {/* 左上 VIP 锁角标（章节级，已废弃） */}
                  {g.vip && (
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'linear-gradient(135deg, rgba(255,193,96,0.95), rgba(255,155,70,0.95))',
                      borderRadius: 10, padding: '4px 10px',
                      border: '1px solid rgba(255,215,140,0.55)',
                      boxShadow: '0 4px 14px rgba(255,155,70,0.35)',
                    }}>
                      <Lock size={10} color="#2b1a0a" strokeWidth={2.6} />
                      <span style={{ color: '#2b1a0a', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>VIP</span>
                    </div>
                  )}

                  {/* 右上章节序号 */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
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
                      color: '#fff', fontSize: 19, fontWeight: 700, marginBottom: 4,
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
                            background: completedCount === groupLevels.length ? '#4ECDC4' : 'linear-gradient(90deg, #FF8A80, #FFB199)',
                            width: `${(completedCount / groupLevels.length) * 100}%`, transition: 'width 0.3s',
                          }} />
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                          {completedCount}/{groupLevels.length} 节
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* 剧情简介入口 */}
                        <span
                          role="button"
                          onClick={(e) => { e.stopPropagation(); setImmersive({ mode: practiceMode, index: gIdx }); }}
                          className="flex items-center gap-1 px-2 py-1"
                          style={{
                            background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                            borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                            color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: 600,
                          }}
                        >
                          剧情简介
                          <ChevronRight size={10} color="rgba(255,255,255,0.85)" strokeWidth={2.2} />
                        </span>
                        <motion.span animate={{ rotate: isOpen ? 90 : 0 }} style={{ display: 'inline-flex' }}>
                          <ChevronRight size={14} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* ---------- 小章节网格（点击章节展开） ---------- */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="sublevels"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      {groupLevels.map((lv, li) => {
                        const userIsPro = user.isVip || user.isPro();
                        const isLocked = lv.vip && !userIsPro;
                        const isCurrent = !lv.completed && !isLocked && li === completedCount;
                        const isEnc = lv.isEncounter;
                        return (
                          <motion.button
                            key={lv.id}
                            className="relative overflow-hidden text-left flex flex-col"
                            style={{
                              borderRadius: 14,
                              border: '1px solid rgba(245,239,232,0.08)',
                              background: '#3a3152',
                              minHeight: isEnc ? 290 : 260,
                            }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: li * 0.035 }}
                            onClick={() => {
                              if (isLocked) { setShowVIP(true); return; }
                              setLevelImmersive({ chapterId: g.id, index: li });
                            }}
                          >
                            {/* 关卡图：真人模式加高至 180，剧情模式 150 */}
                            <div style={{
                              position: 'relative',
                              height: isEnc ? 180 : 150,
                              overflow: 'hidden',
                            }}>
                              <KenBurnsImage
                                src={lv.image}
                                alt={lv.title}
                                seed={lv.id}
                                duration={13}
                                tilt={!isLocked}
                                tiltStrength={3}
                                glow={isCurrent}
                                glowColor="rgba(255,180,170,0.35)"
                                dimmed={isLocked}
                                imgStyle={isEnc ? { objectPosition: 'center 12%' } : undefined}
                              />
                              {/* 底部渐变过渡到卡片下半 */}
                              <div style={{
                                position: 'absolute', left: 0, right: 0, bottom: 0,
                                height: isEnc ? 50 : 40,
                                background: isEnc
                                  ? 'linear-gradient(to bottom, rgba(58,49,82,0) 0%, rgba(58,49,82,0.6) 55%, #3a3152 100%)'
                                  : 'linear-gradient(to bottom, rgba(58,49,82,0) 0%, #3a3152 100%)',
                                pointerEvents: 'none',
                              }} />

                              {/* VIP 锁覆盖（非VIP用户才锁定） */}
                              {isLocked && (
                                <>
                                  <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    pointerEvents: 'none',
                                  }}>
                                    <div style={{
                                      width: 44, height: 44, borderRadius: '50%',
                                      background: 'linear-gradient(135deg, #FFCF78, #FFA050)',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      boxShadow: '0 6px 18px rgba(255,160,80,0.45)',
                                    }}>
                                      <Lock size={18} color="#2b1a0a" strokeWidth={2.4} />
                                    </div>
                                  </div>
                                </>
                              )}
                              {/* VIP 标识（VIP关卡始终显示） */}
                              {lv.vip && (
                                <div style={{
                                  position: 'absolute', top: 8, left: 8,
                                  display: 'inline-flex', alignItems: 'center', gap: 3,
                                  background: 'linear-gradient(135deg, rgba(255,207,120,0.95), rgba(255,160,80,0.95))',
                                  borderRadius: 6, padding: '2px 7px',
                                  border: '1px solid rgba(255,220,150,0.7)',
                                }}>
                                  <span style={{ color: '#2b1a0a', fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>VIP</span>
                                </div>
                              )}

                              {/* 已完成 ✓ */}
                              {lv.completed && (
                                <div style={{
                                  position: 'absolute', top: 8, left: 8,
                                  width: 22, height: 22, borderRadius: '50%',
                                  background: '#4ECDC4',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(78,205,196,0.55)',
                                }}>
                                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, lineHeight: 1 }}>✓</span>
                                </div>
                              )}

                              {/* 当前推进关闪亮角标 */}
                              {isCurrent && (
                                <div style={{
                                  position: 'absolute', top: 8, right: 8,
                                  padding: '2px 7px', borderRadius: 6,
                                  background: 'linear-gradient(135deg, #FF8A80, #FFB199)',
                                  color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: 1,
                                  boxShadow: '0 2px 8px rgba(255,138,128,0.5)',
                                }}>
                                  NEXT
                                </div>
                              )}

                              {/* 关卡序号徽章 */}
                              <div style={{
                                position: 'absolute', bottom: 8, left: 10,
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '2px 8px', borderRadius: 6,
                                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                color: 'rgba(255,255,255,0.92)', fontSize: 10, fontWeight: 700, letterSpacing: 0.8,
                              }}>
                                <span style={{ opacity: 0.6 }}>第</span>
                                {lv.idxInChapter + 1}
                                <span style={{ opacity: 0.6 }}>节</span>
                              </div>
                            </div>

                            {/* 下半：标题 + 叙事钩子 + 状态 */}
                            <div className="flex-1 flex flex-col" style={{ padding: '8px 12px 12px' }}>
                              {/* 状态徽章 */}
                              <div style={{ marginBottom: 6 }}>
                                {isLocked ? (
                                  <span style={{
                                    display: 'inline-block', padding: '1px 7px', borderRadius: 5,
                                    background: 'linear-gradient(135deg, rgba(255,207,120,0.22), rgba(255,160,80,0.18))',
                                    border: '1px solid rgba(255,207,120,0.45)',
                                    color: '#FFCF78', fontSize: 9, fontWeight: 700, letterSpacing: 1,
                                  }}>◆ 会员专享</span>
                                ) : lv.completed ? (
                                  <span style={{
                                    display: 'inline-block', padding: '1px 7px', borderRadius: 5,
                                    background: 'rgba(78,205,196,0.16)',
                                    border: '1px solid rgba(78,205,196,0.4)',
                                    color: '#7EE0D6', fontSize: 9, fontWeight: 700, letterSpacing: 1,
                                  }}>✦ 已破关</span>
                                ) : isCurrent ? (
                                  <span style={{
                                    display: 'inline-block', padding: '1px 7px', borderRadius: 5,
                                    background: 'rgba(255,138,128,0.16)',
                                    border: '1px solid rgba(255,138,128,0.45)',
                                    color: '#FFB199', fontSize: 9, fontWeight: 700, letterSpacing: 1,
                                  }}>● 进行中</span>
                                ) : (
                                  <span style={{
                                    display: 'inline-block', padding: '1px 7px', borderRadius: 5,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 700, letterSpacing: 1,
                                  }}>○ 未开始</span>
                                )}
                              </div>

                              {/* 标题 */}
                              <p style={{
                                color: '#f5efe8', fontSize: 13.5, fontWeight: 700,
                                lineHeight: 1.3, margin: 0, marginBottom: 4,
                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {lv.title}
                              </p>

                              {/* 叙事钩子（desc） */}
                              <p style={{
                                color: 'rgba(245,239,232,0.55)', fontSize: 11, lineHeight: 1.55,
                                margin: 0, fontStyle: 'italic',
                                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {lv.desc}
                              </p>
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

        {/* ====== 6. 互动匹配 · 角色扮演 ====== */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IcMask size={14} color="#B39DDB" />
              <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>互动匹配</span>
              <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,138,128,0.15)', borderRadius: 4, color: '#FF8A80', fontSize: '9px', fontWeight: 700 }}>NEW</span>
            </div>
            <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: '11px' }}>本周 {matchWeeklyUsed}/5 次</span>
          </div>

          {/* 匹配介绍 Banner */}
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
                角色扮演对练 🎭
              </h3>
              <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', lineHeight: 1.6, marginBottom: 14 }}>
                随机匹配对手，扮演不同角色进行实战对话。10分钟限时挑战，AI实时评分，检验你的真实水平！
              </p>

              {/* 4步流程 */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {[
                  { label: '抽取场景', icon: <IcTarget size={12} color="#fff" /> },
                  { label: '分配角色', icon: <IcMask size={12} color="#fff" /> },
                  { label: '限时对话', icon: <IcChat size={12} color="#fff" /> },
                  { label: 'AI评分', icon: <IcStar size={12} color="#fff" /> },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(155,126,222,0.3)' }}>
                      {s.icon}
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.65)', fontSize: '11px' }}>{s.label}</span>
                    {i < 3 && <ChevronRight size={10} color="rgba(245,239,232,0.3)" />}
                  </div>
                ))}
              </div>

              {/* 奖励说明 */}
              <div className="flex items-center gap-3 mb-4 px-3 py-2" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 8 }}>
                <span style={{ fontSize: 14 }}>🏆</span>
                <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: '11px' }}>完成对练可获 <span style={{ color: '#FFD93D', fontWeight: 700 }}>30-80 XP</span>，每周5次免费机会</span>
              </div>

              {/* 匹配按钮 */}
              <motion.button
                className="w-full py-3 flex items-center justify-center gap-2"
                style={{
                  background: matchWeeklyUsed >= 5 ? 'rgba(245,239,232,0.08)' : gradients.purple,
                  borderRadius: 12, color: matchWeeklyUsed >= 5 ? 'rgba(245,239,232,0.35)' : '#fff', fontSize: '14px', fontWeight: 600,
                }}
                whileTap={matchWeeklyUsed < 5 ? { scale: 0.98 } : {}}
                onClick={() => { if (matchWeeklyUsed < 5) { setShowMatchModal(true); setMatchingState('idle'); } }}
              >
                <Zap size={15} color={matchWeeklyUsed >= 5 ? 'rgba(245,239,232,0.35)' : '#fff'} strokeWidth={2.5} />
                {matchWeeklyUsed >= 5 ? '本周次数已用完' : '立即开始匹配'}
              </motion.button>
            </div>
          </motion.div>

          {/* 推荐导师卡片列表 */}
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>认证导师 · 点击查看详情</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {coaches.map((c, i) => (
              <motion.div
                key={c.id}
                className="flex-shrink-0 cursor-pointer"
                style={{ width: 140 }}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                onClick={() => openProfile({ name: c.name, avatarIdx: i })}
              >
                <div className="p-3 flex flex-col items-center text-center" style={{ background: '#453a60', borderRadius: 14 }}>
                  <div className="relative mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid rgba(155,126,222,0.4)' }}>
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                    </div>
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
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const id = activePractice.id;
                    const levelKid = practiceMode === 'story' && id >= 1 && id <= 30 ? 'L' + String(id).padStart(3, '0') : null;
                    startChat(String(id), activePractice.title, levelPartners[id] ?? null, { levelKid, mode: practiceMode, coverImage: (activePractice as any).image || (activePractice as any).coverImage || null });
                  }}
                >
                  <IcSparkle size={16} color="#fff" /> 开始阅读故事
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== AI 对话全屏页（微信风 · 氛围感聊天） ====== */}
      <AnimatePresence>
        {showChat && (
          <motion.div className="fixed inset-0 z-[1000] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #ededed 0%, #e7e3dc 100%)',
            }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

            {/* 顶部导航（微信风，毛玻璃浅色） */}
            <div style={{
              paddingTop: 'env(safe-area-inset-top, 44px)',
              background: 'rgba(237,237,237,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
              <div className="relative flex items-center justify-center px-4 h-11">
                <motion.button className="absolute left-3 flex items-center" whileTap={{ scale: 0.9 }} onClick={() => setShowChat(false)}>
                  <ChevronLeft size={26} color="#1f1f1f" />
                </motion.button>
                <div className="text-center">
                  <p style={{ color: '#1f1f1f', fontSize: '16px', fontWeight: 600, lineHeight: 1.1 }}>{chatTitle || 'Ta'}</p>
                </div>
                {chatLevelKid && (
                  <motion.button
                    className="absolute right-3"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => finalizeChat(affinity)}
                    style={{ color: '#EC407A', fontSize: 13, fontWeight: 600 }}
                  >
                    结束
                  </motion.button>
                )}
              </div>
              {/* ---- 好感度 + 轮数条（仅关卡模式） ---- */}
              {chatLevelKid && (
                <div className="px-4 pb-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div style={{ color: '#FF6B9D', fontSize: 11, fontWeight: 600, minWidth: 26 }}>♥{mainAffinity(affinity)}</div>
                    <div className="relative flex-1" style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'visible' }}>
                      <motion.div
                        animate={{ width: `${mainAffinity(affinity)}%` }}
                        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(90deg,#FF8A80,#EC407A)', borderRadius: 3 }}
                      />
                      <AnimatePresence>
                        {deltaPopup && (
                          <motion.div
                            key={deltaPopup.id}
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -18 }}
                            exit={{ opacity: 0, y: -26 }}
                            style={{
                              position: 'absolute', right: 4, top: -12,
                              color: deltaPopup.val >= 0 ? '#EC407A' : '#607D8B',
                              fontSize: 12, fontWeight: 700, pointerEvents: 'none',
                            }}
                          >
                            {deltaPopup.val >= 0 ? '+' : ''}{deltaPopup.val}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div style={{ color: 'rgba(0,0,0,0.55)', fontSize: 11, minWidth: 40, textAlign: 'right' }}>
                      {turnsUsed}/{chatMaxTurns}
                    </div>
                  </div>
                  {attemptBadge && (
                    <div className="mt-1 text-right" style={{ color: attemptBadge.willGrantXP ? '#07c160' : 'rgba(0,0,0,0.4)', fontSize: 10 }}>
                      {attemptBadge.willGrantXP ? `第 ${attemptBadge.used} 次 · 本次计 XP` : `第 ${attemptBadge.used}/${attemptBadge.max} 次 · 练习模式`}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto px-3" style={{ paddingTop: 12, paddingBottom: 12 }}>
              {messages.map((msg, i) => {
                if (msg.role === 'system') {
                  return (
                    <motion.div key={i} className="flex justify-center my-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.55)',
                        fontSize: 11, padding: '4px 10px', borderRadius: 4, maxWidth: '80%',
                        textAlign: 'center', whiteSpace: 'pre-wrap', lineHeight: 1.5,
                      }}>
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                }
                const isUser = msg.role === 'user';
                const showInnerOS = !isUser && (msg as any).innerOS && user.subTier === 'proplus';
                const isEmptyAi = !isUser && !msg.text;
                const userAvatarSrc = (user as any).avatar || '/avatars/face5.webp';
                const aiAvatarSrc = chatPartner?.img || chatCoverImg || null;
                return (
                  <div key={i}>
                  <motion.div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    {!isUser && (
                      <div className="mr-2 flex-shrink-0" style={{
                        width: 36, height: 36, borderRadius: 4, overflow: 'hidden',
                        background: '#d6d3cd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {aiAvatarSrc ? (
                          <img src={aiAvatarSrc} alt={chatPartner?.name || 'AI'} className="w-full h-full" style={{ objectFit: 'cover' }} />
                        ) : (
                          <IconBubble size={36} bg={gradients.coral}><IcRobot size={18} color="#fff" /></IconBubble>
                        )}
                      </div>
                    )}
                    <div className="relative" style={{
                      maxWidth: '72%',
                      background: isUser ? '#95ec69' : '#ffffff',
                      color: '#1f1f1f',
                      padding: '9px 12px',
                      borderRadius: 6,
                      fontSize: 15,
                      lineHeight: 1.45,
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      minHeight: isEmptyAi ? 20 : undefined,
                    }}>
                      {/* 气泡小尖角 */}
                      <span aria-hidden style={{
                        position: 'absolute', top: 10,
                        ...(isUser
                          ? { right: -5, borderWidth: '5px 0 5px 6px', borderColor: 'transparent transparent transparent #95ec69' }
                          : { left: -5, borderWidth: '5px 6px 5px 0', borderColor: 'transparent #ffffff transparent transparent' }),
                        borderStyle: 'solid', width: 0, height: 0,
                      }} />
                      {isEmptyAi ? (
                        <span className="inline-flex items-center gap-1" aria-label="对方正在输入">
                          {[0, 1, 2].map(k => (
                            <motion.span key={k}
                              style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', display: 'inline-block' }}
                              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
                              transition={{ duration: 1.1, repeat: Infinity, delay: k * 0.18 }} />
                          ))}
                        </span>
                      ) : msg.text}
                    </div>
                    {isUser && (
                      <div className="ml-2 flex-shrink-0" style={{
                        width: 36, height: 36, borderRadius: 4, overflow: 'hidden',
                        background: '#d6d3cd', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <img src={userAvatarSrc} alt="我" className="w-full h-full" style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                  </motion.div>
                  {showInnerOS && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="flex justify-start mb-3"
                      style={{ paddingLeft: 46 }}
                    >
                      <div style={{
                        fontSize: 11, color: 'rgba(0,0,0,0.45)', fontStyle: 'italic',
                        background: 'rgba(155,126,222,0.08)', padding: '3px 8px', borderRadius: 4,
                        maxWidth: '70%', lineHeight: 1.4,
                      }}>
                        💭 {(msg as any).innerOS}
                      </div>
                    </motion.div>
                  )}
                  {!isUser && (msg as any).delta != null && (msg as any).delta !== 0 && !showInnerOS && <div className="mb-2" />}
                  </div>
                );
              })}
            </div>

            {/* 预设开场回复 Chip（前 2 轮且有预设时显示） */}
            {openingChoices.length > 0 && turnsUsed < 2 && (
              <div className="px-3 pb-2" style={{ background: 'transparent' }}>
                <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {openingChoices.map((c, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(c)}
                      style={{
                        flexShrink: 0, background: '#fff', border: '1px solid rgba(236,64,122,0.3)',
                        color: '#EC407A', fontSize: 12, padding: '6px 12px', borderRadius: 16,
                        maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* 输入框（微信风浅色工具栏） */}
            <div style={{
              background: '#f7f7f7',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              padding: '8px 10px',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 10px) + 8px)',
            }}>
              <div className="flex items-end gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder=""
                  className="flex-1 outline-none"
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 6,
                    height: 36,
                    padding: '0 10px',
                    color: '#1f1f1f',
                    fontSize: 15,
                  }}
                />
                <motion.button
                  className="flex items-center justify-center"
                  style={{
                    height: 36, padding: '0 14px',
                    background: chatInput.trim() ? '#07c160' : 'rgba(0,0,0,0.08)',
                    color: chatInput.trim() ? '#fff' : 'rgba(0,0,0,0.35)',
                    borderRadius: 6, fontSize: 14, fontWeight: 500,
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={sendMessage}
                >
                  发送
                </motion.button>
              </div>
            </div>

            {/* 关卡总结 */}
            {showSummary && (() => {
              const scoring = (window as any).__foxsayLastScoring;
              if (!scoring) return null;
              const ends = chatLevelKid ? getEndings(chatLevelKid) : null;
              const endingInfo = ends?.[scoring.ending as 'good' | 'neutral' | 'bad'] || { title: scoring.ending === 'perfect' ? '完美' : (scoring.ending === 'good' ? '圆满' : (scoring.ending === 'bad' ? '失落' : '平淡')), description: '' };
              const xp = attemptBadge?.willGrantXP ? xpRewardForStar(scoring.star, chatMode === 'challenge' ? 'challenge' : 'story') : 0;
              const startAff = affinityHistory[0] || emptyAffinity();
              return (
                <ChatSummary
                  open
                  levelTitle={chatTitle}
                  partnerName={chatPartner?.name}
                  partnerImg={chatPartner?.img}
                  affinityStart={startAff}
                  affinityEnd={affinity}
                  scoring={scoring}
                  xpGranted={xp}
                  abilityGained={scoring.star === 3 ? 1 : 0}
                  ending={{ title: endingInfo.title || '对话结束', description: endingInfo.description || '' }}
                  highlights={highlights}
                  regrets={regrets}
                  attemptInfo={attemptBadge ? { used: attemptBadge.used, max: attemptBadge.max, willGrantXPNext: false } : undefined}
                  onRetry={() => {
                    setShowSummary(false);
                    if (chatLevelKid) {
                      startChat(chatTarget, chatTitle, chatPartner, { levelKid: chatLevelKid, mode: chatMode, coverImage: chatCoverImg });
                    } else {
                      setShowChat(false);
                    }
                  }}
                  onNext={() => { setShowSummary(false); setShowChat(false); }}
                  onClose={() => { setShowSummary(false); setShowChat(false); }}
                />
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 互动匹配全流程弹窗 ====== */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

            {/* 非 playing 状态：居中弹窗 */}
            {matchingState !== 'playing' && (
              <div className="flex-1 flex items-center justify-center p-5">
                <motion.div className="w-full overflow-hidden" style={{ maxWidth: 380, background: '#453a60', borderRadius: 20 }}
                  initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                  <div className="p-6 text-center relative">
                    {/* 关闭按钮 */}
                    <motion.button className="absolute top-4 right-4" whileTap={{ scale: 0.9 }}
                      onClick={() => { setShowMatchModal(false); setMatchingState('idle'); }}>
                      <X size={20} color="rgba(245,239,232,0.5)" />
                    </motion.button>

                    {/* idle: 准备开始 */}
                    {matchingState === 'idle' && (
                      <>
                        <div className="flex justify-center mb-4">
                          <IconBubble size={64} bg={gradients.purple} glow><IcMask size={28} color="#fff" /></IconBubble>
                        </div>
                        <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, marginBottom: 8 }}>角色扮演对练</h3>
                        <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', lineHeight: 1.6, marginBottom: 6 }}>
                          系统将随机抽取场景和角色，你将与匹配到的对手进行 10 分钟限时对话
                        </p>
                        <div className="flex items-center justify-center gap-4 mb-5 py-3" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                          <div className="text-center"><span style={{ color: '#FFD93D', fontSize: 20 }}>🎲</span><p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, marginTop: 2 }}>随机场景</p></div>
                          <div className="text-center"><span style={{ color: '#B39DDB', fontSize: 20 }}>🎭</span><p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, marginTop: 2 }}>分配角色</p></div>
                          <div className="text-center"><span style={{ color: '#FF8A80', fontSize: 20 }}>⏱</span><p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, marginTop: 2 }}>10分钟</p></div>
                          <div className="text-center"><span style={{ color: '#4ECDC4', fontSize: 20 }}>📊</span><p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, marginTop: 2 }}>AI评分</p></div>
                        </div>
                        <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                          style={{ background: gradients.purple, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={startMatchFlow}>
                          <Zap size={16} color="#fff" strokeWidth={2.5} /> 抽取场景
                        </motion.button>
                      </>
                    )}

                    {/* scene: 展示抽到的场景 */}
                    {matchingState === 'scene' && matchScene && (
                      <>
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          className="flex justify-center mb-4">
                          <span style={{ fontSize: 56, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{matchScene.emoji}</span>
                        </motion.div>
                        <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 700, marginBottom: 6 }}>{matchScene.title}</h3>
                        <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: '13px', lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>
                          "{matchScene.desc}"
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-5">
                          <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>⏱ 对话限时</span>
                          <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 700 }}>{matchScene.duration}</span>
                        </div>
                        <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                          style={{ background: gradients.purple, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={confirmSceneAndMatch}>
                          <Users size={16} color="#fff" strokeWidth={2.5} /> 确认场景，开始匹配
                        </motion.button>
                      </>
                    )}

                    {/* matching: 匹配中 */}
                    {matchingState === 'matching' && (
                      <>
                        <div className="flex justify-center mb-4">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                            <IconBubble size={64} bg={gradients.purple} glow><IcRadar size={28} color="#fff" /></IconBubble>
                          </motion.div>
                        </div>
                        <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 600, marginBottom: 8 }}>正在匹配对手...</h3>
                        <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px', lineHeight: 1.6 }}>
                          正在为你寻找合适的对练伙伴
                        </p>
                        <div className="flex justify-center gap-1.5 mt-4">
                          {[0, 1, 2].map(i => (
                            <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: '#B39DDB' }}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                          ))}
                        </div>
                      </>
                    )}

                    {/* matched: 展示匹配到的角色 */}
                    {matchingState === 'matched' && matchRole && (
                      <>
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', damping: 15 }} className="flex justify-center mb-3">
                          <span style={{ fontSize: 52, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{matchRole.emoji}</span>
                        </motion.div>
                        <div className="px-1.5 py-0.5 inline-block mb-2" style={{ background: 'rgba(78,205,196,0.15)', borderRadius: 4 }}>
                          <span style={{ color: '#4ECDC4', fontSize: 10, fontWeight: 700 }}>匹配成功</span>
                        </div>
                        <h3 style={{ color: '#f5efe8', fontSize: '20px', fontWeight: 700, marginBottom: 4 }}>你的对手：{matchRole.name}</h3>
                        <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: '13px', marginBottom: 4 }}>{matchRole.desc}</p>
                        <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: '11px', marginBottom: 16 }}>性格：{matchRole.trait}</p>

                        <div className="p-3 mb-5" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                          <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10, marginBottom: 4 }}>📍 当前场景</p>
                          <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 12 }}>{matchScene?.emoji} {matchScene?.title}</p>
                        </div>

                        <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                          style={{ background: gradients.mint, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                          whileTap={{ scale: 0.98 }} onClick={startMatchPlay}>
                          <IcChat size={16} color="#fff" /> 开始对话
                        </motion.button>
                      </>
                    )}

                    {/* result: AI 评分结果 */}
                    {matchingState === 'result' && matchScore && (
                      <>
                        <div className="flex justify-center mb-3">
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
                            style={{ fontSize: 48, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                            {matchScore.total >= 85 ? '🏆' : matchScore.total >= 70 ? '⭐' : '💪'}
                          </motion.span>
                        </div>
                        <h3 style={{ color: '#f5efe8', fontSize: '18px', fontWeight: 700, marginBottom: 2 }}>对练结束</h3>
                        <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                          style={{ color: matchScore.total >= 85 ? '#4ECDC4' : matchScore.total >= 70 ? '#FFD93D' : '#FF8A80', fontSize: 36, fontWeight: 900, marginBottom: 12 }}>
                          {matchScore.total}分
                        </motion.p>

                        <div className="flex flex-col gap-2 mb-4 text-left">
                          {[
                            { label: '角色还原度', score: matchScore.rolePlay, color: '#B39DDB' },
                            { label: '沟通技巧', score: matchScore.skill, color: '#4ECDC4' },
                            { label: '互动质量', score: matchScore.interaction, color: '#FF8A80' },
                          ].map(item => (
                            <div key={item.label} className="flex items-center gap-3">
                              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, width: 72 }}>{item.label}</span>
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(245,239,232,0.06)' }}>
                                <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${item.score}%` }}
                                  transition={{ duration: 0.8, delay: 0.3 }} style={{ background: item.color }} />
                              </div>
                              <span style={{ color: item.color, fontSize: 12, fontWeight: 700, width: 28, textAlign: 'right' }}>{item.score}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-4 py-2" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 8 }}>
                          <span style={{ fontSize: 14 }}>✨</span>
                          <span style={{ color: '#FFD93D', fontSize: 13, fontWeight: 600 }}>+{Math.floor(matchScore.total * 0.6)} XP</span>
                          <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>· 同级排名 #{matchScore.rank}</span>
                        </div>

                        <div className="flex gap-3">
                          <motion.button className="flex-1 py-3 flex items-center justify-center gap-1.5"
                            style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 12, color: 'rgba(245,239,232,0.6)', fontSize: 13, fontWeight: 600 }}
                            whileTap={{ scale: 0.98 }} onClick={() => { setShowMatchModal(false); setMatchingState('idle'); }}>
                            返回
                          </motion.button>
                          {matchWeeklyUsed < 5 && (
                            <motion.button className="flex-1 py-3 flex items-center justify-center gap-1.5"
                              style={{ background: gradients.purple, borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 600 }}
                              whileTap={{ scale: 0.98 }} onClick={() => setMatchingState('idle')}>
                              再来一局
                            </motion.button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* playing: 全屏对话界面 */}
            {matchingState === 'playing' && (
              <>
                {/* 对话顶栏 */}
                <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
                  <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 24 }}>{matchRole?.emoji}</span>
                      <div>
                        <p style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{matchRole?.name}</p>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: '10px' }}>{matchScene?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1" style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 6 }}>
                        <span style={{ color: '#FF8A80', fontSize: 12, fontWeight: 700 }}>
                          ⏱ {Math.floor(matchTimer / 60)}:{String(matchTimer % 60).padStart(2, '0')}
                        </span>
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={endMatchAndScore}>
                        <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12 }}>结束</span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* 对话消息列表 */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {matchMessages.map((msg, i) => (
                    <motion.div key={i} className={`flex ${msg.role === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      {msg.role === 'them' && <span className="mr-2 mt-1 text-lg flex-shrink-0">{matchRole?.emoji}</span>}
                      <div className="max-w-[80%] px-4 py-3" style={{
                        background: msg.role === 'me' ? gradients.coral : msg.role === 'system' ? 'rgba(155,126,222,0.15)' : '#453a60',
                        borderRadius: msg.role === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        color: msg.role === 'system' ? 'rgba(245,239,232,0.65)' : '#f5efe8',
                        fontSize: msg.role === 'system' ? '12px' : '14px', lineHeight: 1.6,
                        fontStyle: msg.role === 'system' ? 'italic' : 'normal', whiteSpace: 'pre-wrap',
                      }}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 输入框 */}
                <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
                  <div className="flex items-center gap-3">
                    <input value={matchInput} onChange={e => setMatchInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMatchMessage()}
                      placeholder="输入你的回答..."
                      className="flex-1 h-11 px-4 bg-transparent outline-none"
                      style={{ background: '#453a60', borderRadius: 22, color: '#f5efe8', fontSize: '14px' }} />
                    <motion.button className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: matchInput.trim() ? gradients.coral : '#453a60' }}
                      whileTap={{ scale: 0.9 }} onClick={sendMatchMessage}>
                      <Send size={16} color={matchInput.trim() ? '#fff' : 'rgba(245,239,232,0.38)'} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 导师详情弹窗 ====== */}
      <AnimatePresence>
        {showCoachDetail && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCoachDetail(null)} />
            <motion.div className="relative w-[90%] overflow-hidden"
              style={{ maxWidth: 360, background: '#453a60', borderRadius: 20 }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="p-6">
                <motion.button className="absolute top-4 right-4" whileTap={{ scale: 0.9 }} onClick={() => setShowCoachDetail(null)}>
                  <X size={20} color="rgba(245,239,232,0.5)" />
                </motion.button>

                {/* 导师头像 */}
                <div className="flex flex-col items-center mb-5">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full overflow-hidden" style={{ border: '3px solid rgba(155,126,222,0.5)' }}>
                      <img src={showCoachDetail.avatar} alt={showCoachDetail.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ background: showCoachDetail.online ? '#4ECDC4' : '#666', borderColor: '#453a60' }}>
                      <span style={{ fontSize: 8 }}>{showCoachDetail.online ? '✓' : ''}</span>
                    </div>
                  </div>
                  <h3 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 700 }}>{showCoachDetail.name}</h3>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginTop: 2 }}>{showCoachDetail.desc}</p>
                </div>

                {/* 评分和数据 */}
                <div className="flex items-center justify-center gap-6 mb-5">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <IcStar size={13} color="#FFD93D" />
                      <span style={{ color: '#FFD93D', fontSize: 18, fontWeight: 800 }}>{showCoachDetail.rating}</span>
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>评分</span>
                  </div>
                  <div className="w-px h-8" style={{ background: 'rgba(245,239,232,0.08)' }} />
                  <div className="text-center">
                    <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>{showCoachDetail.sessions}</span>
                    <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>指导次数</p>
                  </div>
                  <div className="w-px h-8" style={{ background: 'rgba(245,239,232,0.08)' }} />
                  <div className="text-center">
                    <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>98%</span>
                    <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>好评率</p>
                  </div>
                </div>

                {/* 专长标签 */}
                <div className="mb-5">
                  <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 8 }}>专长领域</p>
                  <div className="flex flex-wrap gap-2">
                    {[showCoachDetail.specialty, '共情训练', '聊天技巧', '情绪管理'].map(tag => (
                      <span key={tag} className="px-2.5 py-1" style={{ background: 'rgba(155,126,222,0.12)', borderRadius: 6, color: '#B39DDB', fontSize: 11, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* 简介 */}
                <div className="mb-5 p-3" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                  <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 4 }}>导师简介</p>
                  <p style={{ color: 'rgba(245,239,232,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                    拥有多年情感咨询经验，擅长{showCoachDetail.specialty}方向的指导。已帮助{showCoachDetail.sessions}+位学员提升恋爱能力，好评率高达98%。一对一指导风格温和耐心，善于发现学员的潜力。
                  </p>
                </div>

                {/* 预约按钮 */}
                <div className="flex flex-col gap-2">
                  <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                    style={{ background: gradients.purple, borderRadius: 14, color: '#fff', fontSize: '15px', fontWeight: 600 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { const t = bookCoach(showCoachDetail.id, showCoachDetail.name); setShowCoachDetail(null); setBookingSuccess({ name: showCoachDetail.name, time: t }); }}>
                    <IcChat size={16} color="#fff" /> 预约1对1指导 · ¥299
                  </motion.button>
                  <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, textAlign: 'center' }}>预约成功后可在「我的 → 导师私信」中与导师交流</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 预约成功弹窗 ====== */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setBookingSuccess(null)} />
            <motion.div className="relative w-[85%] overflow-hidden" style={{ maxWidth: 320, background: '#453a60', borderRadius: 20 }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}>
              <div className="p-6 text-center">
                <motion.div className="flex justify-center mb-4"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 0.15 }}>
                  <span style={{ fontSize: 56, filter: 'drop-shadow(0 4px 16px rgba(78,205,196,0.3))' }}>🎉</span>
                </motion.div>
                <h3 style={{ color: '#f5efe8', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>预约成功！</h3>
                <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  已成功预约 <span style={{ color: '#B39DDB', fontWeight: 700 }}>{bookingSuccess.name}</span> 导师
                </p>
                <div className="mb-5 p-3" style={{ background: 'rgba(78,205,196,0.08)', borderRadius: 12, border: '1px solid rgba(78,205,196,0.15)' }}>
                  <p style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>⏰ 咨询将在 {bookingSuccess.time} 准时开始</p>
                  <p style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>导师已收到通知，请前往「我的 → 导师私信」沟通</p>
                </div>
                <motion.button className="w-full py-3 flex items-center justify-center gap-2"
                  style={{ background: gradients.purple, borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600 }}
                  whileTap={{ scale: 0.98 }} onClick={() => setBookingSuccess(null)}>
                  我知道了
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 排行榜弹窗 ====== */}
      <AnimatePresence>
        {showRanking && (
          <motion.div className="fixed inset-0 z-[55] flex flex-col" style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-14">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowRanking(false)}>
                  <X size={20} color="rgba(245,239,232,0.6)" />
                </motion.button>
                <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700 }}>🏆 恋爱排行榜</span>
                <span style={{ width: 20 }} />
              </div>
            </div>

            {/* 我的排名 Banner */}
            <div className="mx-5 mb-4 p-4" style={{ background: 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(155,126,222,0.12))', borderRadius: 16 }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: gradients.golden, fontSize: 22 }}>
                  {user.speciesEmoji || '🦊'}
                </div>
                <div className="flex-1">
                  <p style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700 }}>{user.name}</p>
                  <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>Lv.{user.level} · {user.xp} XP</p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#FFD93D', fontSize: 22, fontWeight: 900 }}>#12</p>
                  <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>本周排名</p>
                </div>
              </div>
            </div>

            {/* 排行列表 */}
            <div className="flex-1 overflow-y-auto px-5">
              {[
                { rank: 1, name: '心动猎手', emoji: '🦁', level: 28, xp: 12800, medal: '🥇' },
                { rank: 2, name: '温柔骑士', emoji: '🐺', level: 25, xp: 11200, medal: '🥈' },
                { rank: 3, name: '甜蜜达人', emoji: '🦊', level: 24, xp: 10500, medal: '🥉' },
                { rank: 4, name: '暧昧大师', emoji: '🐱', level: 22, xp: 9800, medal: '' },
                { rank: 5, name: '约会专家', emoji: '🐰', level: 21, xp: 9200, medal: '' },
                { rank: 6, name: '撩心高手', emoji: '🦄', level: 20, xp: 8600, medal: '' },
                { rank: 7, name: '共情之王', emoji: '🐻', level: 19, xp: 8100, medal: '' },
                { rank: 8, name: '破冰勇者', emoji: '🐼', level: 18, xp: 7500, medal: '' },
                { rank: 9, name: '恋爱学徒', emoji: '🐨', level: 17, xp: 6800, medal: '' },
                { rank: 10, name: '聊天新星', emoji: '🦋', level: 16, xp: 6200, medal: '' },
              ].map((item, i) => (
                <motion.div key={item.rank}
                  className="flex items-center gap-3 py-3.5 px-3 mb-2"
                  style={{
                    background: item.rank <= 3 ? 'rgba(255,217,61,0.06)' : 'rgba(245,239,232,0.03)',
                    borderRadius: 14, border: item.rank <= 3 ? '1px solid rgba(255,217,61,0.12)' : '1px solid transparent',
                  }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <div className="w-8 flex items-center justify-center">
                    {item.medal
                      ? <span style={{ fontSize: 20 }}>{item.medal}</span>
                      : <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 14, fontWeight: 700 }}>{item.rank}</span>
                    }
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: item.rank <= 3 ? gradients.golden : '#453a60', fontSize: 18 }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{item.name}</p>
                    <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>Lv.{item.level}</p>
                  </div>
                  <div className="text-right">
                    <span style={{ color: item.rank <= 3 ? '#FFD93D' : 'rgba(245,239,232,0.6)', fontSize: 14, fontWeight: 700 }}>
                      {item.xp.toLocaleString()}
                    </span>
                    <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 9 }}>XP</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 底部提示 */}
            <div className="px-5 py-4 text-center" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
              <p style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11 }}>每周一 00:00 刷新 · 完成练习获得 XP 提升排名</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== 章节沉浸式预览（左右滑动切章） ========== */}
      <ChapterImmersiveView
        open={immersive !== null}
        mode={immersive?.mode ?? practiceMode}
        chapters={immersiveChapters}
        initialIndex={immersive?.index ?? 0}
        onClose={() => setImmersive(null)}
        onStart={(chapterId) => {
          setImmersive(null);
          // 找到该章第一个未完成且非 VIP 的节，直接进入聊天
          const chapterLevels = currentLevels.filter(l => l.chapter === chapterId);
          const firstPlayable = chapterLevels.find(l => !l.completed && !l.vip) ?? chapterLevels.find(l => !l.vip);
          if (firstPlayable) {
            const kid = practiceMode === 'story' && firstPlayable.id >= 1 && firstPlayable.id <= 30 ? 'L' + String(firstPlayable.id).padStart(3, '0') : null;
            startChat(String(firstPlayable.id), firstPlayable.title, levelPartners[firstPlayable.id] ?? null, { levelKid: kid, mode: practiceMode, coverImage: firstPlayable.image || null });
          } else {
            // 全锁：滚动到该章节封面
            setTimeout(() => {
              const el = document.querySelector(`[data-chapter-id="${chapterId}"]`);
              if (el && 'scrollIntoView' in el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }
        }}
        onOpenVIP={() => setShowVIP(true)}
      />

      {/* ========== 小关卡沉浸式预览（同章 6 关左右滑动 + 搭档选择） ========== */}
      <ChapterImmersiveView
        open={levelImmersive !== null && levelImmersiveData !== null}
        mode={practiceMode}
        chapters={levelImmersiveData?.chapters ?? []}
        initialIndex={levelImmersiveData?.initialIndex ?? 0}
        headerLabel={practiceMode === 'story' ? '剧情关卡' : '人物邂逅'}
        ctaLabelOverride="开始这一关"
        enablePartnerPicker
        entranceEffect={cameFromHomeRef.current}
        onConfirmPartner={(chapterId, partner) => {
          setLevelPartners(prev => ({ ...prev, [chapterId]: partner }));
        }}
        onClose={() => {
          setLevelImmersive(null);
          // 从首页推荐进入 → 关闭后滚动到"我的故事"章节区
          if (cameFromHomeRef.current) {
            cameFromHomeRef.current = false;
            setTimeout(() => {
              const el = document.querySelector(`[data-chapter-id]`);
              if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }}
        onStart={(levelId) => {
          const lv = currentLevels.find(l => l.id === levelId);
          setLevelImmersive(null);
          if (lv) {
            const kid = practiceMode === 'story' && lv.id >= 1 && lv.id <= 30 ? 'L' + String(lv.id).padStart(3, '0') : null;
            startChat(String(lv.id), lv.title, levelPartners[lv.id] ?? null, { levelKid: kid, mode: practiceMode, coverImage: lv.image || null });
          }
        }}
        onOpenVIP={() => setShowVIP(true)}
      />

      {/* VIP 订阅弹层 */}
      <AnimatePresence>
        {showVIP && <VIPPage onClose={() => setShowVIP(false)} />}

        {/* 次数上限弹层 —— 替代 alert */}
        <AnimatePresence>
          {attemptGate && (
            <motion.div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} onClick={() => setAttemptGate(null)} />
              <motion.div className="relative w-full overflow-hidden"
                style={{ maxWidth: 340, background: '#352f45', borderRadius: 20, border: '1px solid rgba(255,217,61,0.18)', boxShadow: '0 18px 48px rgba(0,0,0,0.5)' }}
                initial={{ y: 20, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}>
                {/* 顶部金紫装饰 */}
                <div style={{ height: 90, background: 'linear-gradient(135deg, rgba(255,217,61,0.18), rgba(155,126,222,0.22))', position: 'relative' }}>
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 18, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#FFD93D,#FF8A80)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,138,128,0.35)' }}>
                    <IcSparkle size={24} color="#fff" />
                  </div>
                </div>
                <div className="px-5 pt-4 pb-5 text-center">
                  <h3 style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700, margin: 0 }}>今日次数已用完</h3>
                  <p style={{ color: 'rgba(245,239,232,0.72)', fontSize: 13, lineHeight: 1.6, margin: '10px 0 18px' }}>
                    {attemptGate.reason}
                  </p>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setAttemptGate(null)}
                      className="flex-1 py-3" style={{ background: 'rgba(245,239,232,0.08)', color: 'rgba(245,239,232,0.7)', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                      关闭
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => { setAttemptGate(null); setShowVIP(true); }}
                      className="flex-1 py-3 flex items-center justify-center gap-1" style={{ background: 'linear-gradient(135deg,#FFD93D 0%,#FF8A80 100%)', color: '#3b2e1a', borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: '0 6px 16px rgba(255,138,128,0.35)' }}>
                      <IcCrown size={13} color="#3b2e1a" />
                      升级会员
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

    </>
  );
}
