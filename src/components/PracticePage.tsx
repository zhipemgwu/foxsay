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
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Lock, X, Send, Users, Zap, Loader2, RefreshCw, MapPin, Compass, Archive, Plus, Trash2, CheckCircle2, Pencil, Moon, MessageSquareReply, ClipboardCheck, Languages } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  IconBubble, IcChat, IcTarget, IcMask, IcWave, IcLetter, IcDove,
  IcGift, IcHeartSpark, IcRobot, IcPen, IcTrophy, IcStar, IcSparkle,
  IcHeart, IcFire, IcShield, IcRadar, IcCrown, gradients,
} from './CuteIcons';
import { useUser } from '../context/UserContext';
import { useProfileModal } from './ProfileModals';
import { bookCoach } from './CoachChatPage';
import { ChapterImmersiveView } from './ChapterImmersiveView';
import { VIPPage } from './VIPPage';
import { KenBurnsImage } from './KenBurnsImage';
import { chatOnce, chatStream, type ChatMessage } from '../services/ai';
import { getAllPartnerKids, partnerCardToPartnerInfo, buildRolePersonaPrompt } from '../services/roleCards';
import { unlockRoleCard } from '../services/unlockedRoles';
import {
  getLevelCard, getMaxTurns, getMinTurnsForGoodEnding, getOpening,
  buildLevelScenePrompt, getScoringDims, getEndings,
} from '../services/levelCards';
import { getFixedOpening } from '../services/levelOpenings';
import {
  type AffinityState, type AffinityDelta,
  emptyAffinity, mainAffinity, applyDelta, initAffinity, persistOnEnd,
} from '../services/affinity';
import { type ChatMeta } from '../services/chatMeta';
import { beginAttempt, peekAttempts, type VipTier } from '../services/attemptLimit';
import { scoreLevel, buildAffinityMetrics, xpRewardForStar, type HardMetrics } from '../services/levelScore';
import {
  appendAbilityEvent,
  applyAbilityDelta,
  buildAbilityEventFromLevel,
  hasAbilityDelta,
  type AbilityEvent,
} from '../services/ability';
import { ChatSummary, type SummaryHighlight } from './ChatSummary';

/* ---------- 故事系统 ---------- */

/** 剧情故事章节：从 level-cards.json 汇总，封面和 AI 共用同一份剧情源 */
const STORY_LEVEL_COUNT = 30;
const STORY_LEVEL_KIDS = Array.from({ length: STORY_LEVEL_COUNT }, (_, i) => `L${String(i + 1).padStart(3, '0')}`);
const STORY_CHAPTER_COPY: Record<number, { name: string; narrative: string; synopsis: string }> = {
  1: {
    name: '初遇',
    narrative: '从便利店、朋友局和一把伞开始，练会第一句话不冒犯。',
    synopsis: '这一章把初遇拉回真实生活：雨夜便利店、朋友生日局、陌生人之间的第一句开口。训练重点不是惊艳，而是自然、低压、照顾边界。',
  },
  2: {
    name: '第一次约会',
    narrative: '迟到、AA、被纠正动作，第一次见面的小事最看人。',
    synopsis: '第一次约会真正考验的不是会不会撩，而是迟到后怎么补救、钱和边界怎么聊、尴尬时是否还保有体面。',
  },
  3: {
    name: '暧昧',
    narrative: '朋友圈一句算了、半夜一句睡不着，都是关系信号。',
    synopsis: '这一章练暧昧期最容易错过的信号：朋友圈、临时爽约、前任问题、深夜脆弱。重点是读懂对方没明说的感受。',
  },
  4: {
    name: '热恋',
    narrative: '女朋友生气不是背台词，是看你有没有真的在意。',
    synopsis: '热恋里的爆点更生活化：迟到一小时、忘记纪念日、随便真随便、朋友面前没维护她、游戏三小时没回。每一关都练道歉、哄人和行动修复。',
  },
  5: {
    name: '现实压力',
    narrative: '加班、合租、异地、收入规划，关系终究要落到生活里。',
    synopsis: '这一章开始讨论长期关系里的硬问题：工作崩溃、家务分工、异地视频、朋友提问收入、五年后的生活。重点是共担现实，而不是空口浪漫。',
  },
  6: {
    name: '信任边界',
    narrative: '前任、异性同事、公开和消费观，边界说清才有安全感。',
    synopsis: '这一章把信任问题摊开讲：前任突然发消息、异性同事深夜聊天、朋友圈一直不公开、消费观第一次爆雷、见父母节奏。训练透明、尊重和边界。',
  },
  7: {
    name: '爆点修复',
    narrative: '见家长迟到、生日惊喜翻车、拉黑后谈话，关系危机看行动。',
    synopsis: '最后一组是高压修复：堵车迟到见家长、生日惊喜变压力、吵架拉黑、不合适、分手边缘。重点是承担、复盘、具体承诺和尊重选择。',
  },
};

function compactStoryText(text: string, max = 70): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function getStoryLevelSummary(level: any, max = 70): string {
  return compactStoryText(
    level?.story_node?.premise || level?.dialogue?.opening_message || level?.meta?.title || '',
    max,
  );
}

const storyChapters = Array.from(new Set(
  STORY_LEVEL_KIDS
    .map(kid => getLevelCard(kid)?.meta?.chapter_id)
    .filter((id): id is number => typeof id === 'number'),
)).sort((a, b) => a - b).map((id) => {
  const copy = STORY_CHAPTER_COPY[id];
  const firstLevel = STORY_LEVEL_KIDS.map(kid => getLevelCard(kid)).find(lv => lv?.meta?.chapter_id === id);
  return {
    id,
    name: copy?.name || String(firstLevel?.meta?.chapter_name || `第 ${id} 章`).split('·')[0],
    coverImage: `/chapters/cover/story-${((id - 1) % 5) + 1}.jpg`,
    narrative: copy?.narrative || getStoryLevelSummary(firstLevel, 48),
    readCount: '尚未翻开',
    vip: false,
    synopsis: copy?.synopsis || getStoryLevelSummary(firstLevel, 180),
  };
});

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

function resolveChapterFromLevelKid(levelKid: string | null): number | undefined {
  const match = /^L(\d+)$/.exec(levelKid || '');
  if (!match) return undefined;
  const levelCard = getLevelCard(levelKid || '');
  const chapterFromCard = levelCard?.meta?.chapter_id;
  if (typeof chapterFromCard === 'number' && Number.isFinite(chapterFromCard)) return chapterFromCard;
  const levelNumber = Number(match[1]);
  if (!Number.isFinite(levelNumber) || levelNumber < 1) return undefined;
  return Math.max(1, Math.min(7, Math.ceil(levelNumber / LEVELS_PER_CHAPTER)));
}

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

const IMMERSIVE_ASSET_ROOT = '/immersive';

function resolveImmersivePortrait(partnerKid?: string | null, state: 'normal' | 'soft' | 'happy' | 'angry' = 'normal'): string | null {
  if (!partnerKid) return null;
  return `${IMMERSIVE_ASSET_ROOT}/partners/${partnerKid}-${state}.png`;
}

function resolveImmersiveBackground(levelKid?: string | null, mode?: 'story' | 'challenge' | 'freestyle'): string | null {
  if (mode === 'story') return `${IMMERSIVE_ASSET_ROOT}/backgrounds/story.jpg`;
  if (mode === 'challenge') return `${IMMERSIVE_ASSET_ROOT}/backgrounds/mall.jpg`;
  if (levelKid) return `${IMMERSIVE_ASSET_ROOT}/backgrounds/${levelKid}.jpg`;
  return null;
}

const PARTNER_ROLE_LABELS: Record<string, string> = {
  P001: '咖啡店早班店员 · 夜校插画学生',
  P002: '同项目协作同事 · 羽毛球搭子',
  P003: '小学老师 · 相亲对象',
  P004: '手作店主理人 · 慢热文艺系',
  P005: '健身房前台 · 私教助理',
};

function getPartnerRoleLabel(partner?: { kid?: string; identities?: string[] } | null): string {
  if (partner?.kid && PARTNER_ROLE_LABELS[partner.kid]) return PARTNER_ROLE_LABELS[partner.kid];
  if (partner?.identities?.length) return partner.identities[0];
  return '互动对象';
}

function useImageFallback(event: { currentTarget: HTMLImageElement }, fallback?: string | null) {
  const img = event.currentTarget;
  if (!fallback || img.src.endsWith(fallback)) return;
  img.src = fallback;
}

function TypingDots({ size = 6, color = '#EC407A' }: { size?: number; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label="正在输入">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ y: [0, -3, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 0.86, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
          style={{
            width: size,
            height: size,
            borderRadius: 999,
            background: color,
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}

type SceneHotspot = {
  id: string;
  label: string;
  hint: string;
  x: string;
  y: string;
};

function buildSceneHotspots(title: string, synopsis?: string): SceneHotspot[] {
  const text = `${title} ${synopsis || ''}`;
  const pool: SceneHotspot[] = [];
  const add = (id: string, label: string, hint: string, x: string, y: string) => {
    if (!pool.some(item => item.id === id)) pool.push({ id, label, hint, x, y });
  };

  if (/迟到|取号|小票|等/.test(text)) {
    add('ticket', '取号小票', '取号时间比她说的更早，她其实已经等了一会儿。', '73%', '52%');
    add('phone', '手机屏幕', '她一直看手机，但没有催你，像是在压住情绪。', '24%', '45%');
  }
  if (/雨|伞|便利店|关东煮/.test(text)) {
    add('umbrella', '雨伞', '雨还很大，她没有主动开口求助。', '22%', '58%');
    add('food', '关东煮', '手里的关东煮快凉了，她可能站了有一会儿。', '76%', '64%');
  }
  if (/电影|爆米花|电影院/.test(text)) {
    add('popcorn', '爆米花', '爆米花已经不热了，她等你的时间比想象中更久。', '74%', '58%');
    add('poster', '电影海报', '这场电影她期待了很久，迟到不是小事。', '22%', '46%');
  }
  if (/朋友圈|消息|手机|地铁|算了/.test(text)) {
    add('screen', '手机屏幕', '那句“算了”很短，但更像是攒了很久才发出来的。', '74%', '44%');
    add('platform', '站台', '地铁进站的声音让沉默显得更明显。', '20%', '58%');
  }
  if (/火锅|胃|不舒服|热水|药/.test(text)) {
    add('water', '水杯', '她一直按着胃，嘴上说没事不代表真的没事。', '76%', '57%');
    add('medicine', '药袋', '行动比一句“多喝热水”更容易让她安心。', '22%', '55%');
  }

  add('expression', '她的表情', '她没有直接发火，但眼神里有一点委屈。', '72%', '36%');
  add('distance', '你们的距离', '你们离得不远，但气氛还没有真正靠近。', '20%', '68%');
  add('background', '周围环境', '场景里的小细节，往往比台词更能说明她现在的状态。', '50%', '48%');
  return pool.slice(0, 3);
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

/** 每关候选搭档池（5 个固定搭档，独立于普通角色卡 R001..R030） */
function getPartnerCandidates(levelId: number, _chapter: number, _idxInChapter: number): { kid: string; img: string; name: string; age: number; signature: string; traits: string[] }[] {
  const allKids = getAllPartnerKids();         // ["P001", ..., "P005"]
  if (allKids.length === 0) return [];
  // 按 levelId 稳定排序 5 个固定搭档，保持每关候选顺序有变化但人池不变
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
    const info = partnerCardToPartnerInfo(kid);
    if (info) out.push(info);
  }
  return out;
}

/** 每大章节的独立进度（已通关的节数，单独计算不串联） */
const STORY_PROGRESS: Record<number, number> = Object.fromEntries(storyChapters.map(ch => [ch.id, ch.id === 1 ? 1 : 0]));
const CHALLENGE_PROGRESS: Record<number, number> = { 1: 3, 2: 1, 3: 0, 4: 0, 5: 0 };
const ZERO_PROGRESS: Record<number, number> = Object.fromEntries([...storyChapters, ...challengeGroups].map(ch => [ch.id, 0]));

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

/** 剧情故事 × 30：封面标题/简介直接同步 level-cards.json */
const storyRaw: [string, string, number, boolean][] = STORY_LEVEL_KIDS.map((kid) => {
  const level = getLevelCard(kid);
  const levelNumber = Number(kid.slice(1));
  return [
    level?.meta?.title || `第 ${levelNumber} 关`,
    getStoryLevelSummary(level, 62),
    level?.meta?.chapter_id || Math.max(1, Math.ceil(levelNumber / LEVELS_PER_CHAPTER)),
    true,
  ];
});
const storyLevels = buildLevels([...storyRaw], 1, STORY_PROGRESS);
const storyLevelsNew = buildLevels([...storyRaw], 1, ZERO_PROGRESS);

const STORY_NODE_LABELS: Record<number, string> = {
  1: '借伞', 2: '朋友局', 3: '迟到', 4: 'AA争议', 5: '纠动作', 6: '算了',
  7: '加班', 8: '前任', 9: '失眠', 10: '等一小时', 11: '纪念日', 12: '真随便',
  13: '没维护', 14: '没回信', 15: '多喝水', 16: '崩溃', 17: '卫生', 18: '异地',
  19: '问规划', 20: '五年后', 21: '前任消息', 22: '同事聊天', 23: '不公开', 24: '消费观',
  25: '见父母', 26: '大堵车', 27: '惊喜翻车', 28: '拉黑', 29: '不合适', 30: '分手边缘',
};

const STORY_NODE_PLACES: Record<number, string> = {
  1: '雨夜便利店', 2: '生日朋友局', 3: '地铁口迟到', 4: '小餐馆账单', 5: '街角照相亭', 6: '深夜聊天窗',
  7: '公司楼下', 8: '旧消息提醒', 9: '凌晨卧室', 10: '电影院门口', 11: '纪念日花店', 12: '商场电梯口',
  13: '朋友聚会桌', 14: '未读消息栏', 15: '医院走廊', 16: '崩溃电话亭', 17: '合租厨房', 18: '异地车站',
  19: '河边长椅', 20: '未来规划墙', 21: '旧人来信', 22: '同事茶水间', 23: '朋友圈边界', 24: '消费清单',
  25: '见家长餐桌', 26: '堵车高架桥', 27: '生日房间', 28: '拉黑后的街', 29: '告别咖啡馆', 30: '分手边缘',
};

const CHALLENGE_NODE_LABELS: Record<number, string> = {
  101: '小纸条', 102: '歌声', 103: '多把伞', 104: '旧车票', 105: '冰水', 106: '草莓',
  107: '流浪猫', 108: '叹息', 109: '公式', 110: '第六稿', 111: '夜灯', 112: '偷拍',
  113: '派对', 114: '眼神', 115: '滤镜外', 116: '热情', 117: '第三杯', 118: '名片',
  119: '落花', 120: '纸巾', 121: '沉默', 122: '夜电话', 123: '手链', 124: '草稿',
  125: '随便问', 126: '已读', 127: '新人', 128: '迟到', 129: '否定', 130: '完美感',
};

const CHALLENGE_NODE_PLACES: Record<number, string> = {
  101: '图书馆角落', 102: '隔壁窗边', 103: '雨伞架旁', 104: '诗集旧页', 105: '球场边线', 106: '奶茶小店',
  107: '流浪猫巷', 108: '会议室门外', 109: '黑板前', 110: '垃圾桶旁', 111: '深夜工位', 112: '相机取景框',
  113: '派对中心', 114: '笑声背后', 115: '关掉滤镜后', 116: '热闹街口', 117: '酒吧第三杯', 118: '名片夹里',
  119: '落花小路', 120: '纸巾盒旁', 121: '沉默沙发', 122: '夜电话', 123: '旧手链', 124: '草稿箱',
  125: '试探对话', 126: '已读界面', 127: '新人座位', 128: '迟到门口', 129: '否定现场', 130: '完美假面',
};

const CITY_MAP_POINTS = [
  { left: 22, top: 72 },
  { left: 38, top: 47 },
  { left: 53, top: 64 },
  { left: 67, top: 40 },
  { left: 79, top: 56 },
  { left: 88, top: 34 },
];

function getCityMapBackground(mode: 'story' | 'challenge', chapterId?: number) {
  if (mode === 'story' && chapterId === 1) return '/chapters/maps/story-city-map-canva-v1.png';
  return mode === 'story' ? '/chapters/maps/story-city-map-source.jpg' : '/chapters/maps/encounter-city-map-source.jpg';
}

const CITY_LANDMARK_PALETTES = {
  story: [
    { roof: '#FF8A80', front: '#FFE8D8', side: '#E8C0B4', sign: '#FFB199', glass: '#8ED9F8', base: '#F6F0E5' },
    { roof: '#FFD166', front: '#FFF4CA', side: '#E0B85F', sign: '#FF9F70', glass: '#78C9F3', base: '#F6F0E5' },
    { roof: '#B39DDB', front: '#F1E8FF', side: '#BBA9DE', sign: '#CDBBFF', glass: '#9BE7F2', base: '#F6F0E5' },
    { roof: '#7EE0D6', front: '#DDF8F5', side: '#76BFB8', sign: '#88EFE7', glass: '#67B7FF', base: '#F6F0E5' },
    { roof: '#FFCF78', front: '#FFF1D0', side: '#D4A757', sign: '#FFB199', glass: '#93D7F7', base: '#F6F0E5' },
    { roof: '#AEE1A0', front: '#ECFFE8', side: '#88BE7B', sign: '#7EE0D6', glass: '#8BC8FF', base: '#F6F0E5' },
  ],
  challenge: [
    { roof: '#7EE0D6', front: '#E3FBFF', side: '#5DA8B8', sign: '#B8FFF8', glass: '#5C7DFF', base: '#EEF4FF' },
    { roof: '#CDBBFF', front: '#F1E9FF', side: '#9F86D9', sign: '#B39DDB', glass: '#7EE0D6', base: '#EEF4FF' },
    { roof: '#FFB199', front: '#FFE8DF', side: '#C88777', sign: '#FF8A80', glass: '#8ED9F8', base: '#EEF4FF' },
    { roof: '#93C5FD', front: '#E7F1FF', side: '#658FC8', sign: '#7EE0D6', glass: '#B39DDB', base: '#EEF4FF' },
    { roof: '#FFD166', front: '#FFF2C7', side: '#D0A241', sign: '#FFCF78', glass: '#72CDE8', base: '#EEF4FF' },
    { roof: '#FF7AA2', front: '#FFE3EC', side: '#B75E7B', sign: '#FFB199', glass: '#7EE0D6', base: '#EEF4FF' },
  ],
};

function CityLandmarkIcon({ mode, index, locked, current, completed, accent }: { mode: 'story' | 'challenge'; index: number; locked: boolean; current: boolean; completed: boolean; accent: string }) {
  const palette = CITY_LANDMARK_PALETTES[mode][index % CITY_LANDMARK_PALETTES[mode].length];
  const variant = index % 6;
  const idPrefix = `map-node-${mode}-${index}`;
  const size = current ? 80 : 70;
  const halo = current ? accent : completed ? '#7EE0D6' : palette.roof;
  const muted = locked ? 'saturate(0.65) brightness(0.78)' : undefined;
  const glyph = (() => {
    if (variant === 0) {
      return <path d="M43 21c-8 0-14 5.7-14 13 0 8.6 14 24 14 24s14-15.4 14-24c0-7.3-6-13-14-13Zm0 18.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Z" fill="#fff" opacity="0.96" />;
    }
    if (variant === 1) {
      return <path d="M29 36c4-8 22-8 28 0-4-3-8-3-12 0v15h-4V36c-4-3-8-3-12 0Z" fill="#fff" opacity="0.96" />;
    }
    if (variant === 2) {
      return <path d="M29 31h28v18H29V31Zm4 4 10 7 10-7M33 45h20" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />;
    }
    if (variant === 3) {
      return <path d="M43 25l4.3 8.6 9.5 1.4-6.9 6.7 1.6 9.4L43 46.6l-8.5 4.5 1.6-9.4-6.9-6.7 9.5-1.4L43 25Z" fill="#fff" opacity="0.96" />;
    }
    if (variant === 4) {
      return <path d="M43 52s-13-8.6-13-18c0-5 3.7-9 8.4-9 2.7 0 5 1.3 6.6 3.3A8.1 8.1 0 0 1 51.6 25c4.7 0 8.4 4 8.4 9 0 9.4-17 18-17 18Z" fill="#fff" opacity="0.96" />;
    }
    return <path d="M46 23 30 43h12l-2 16 17-22H45l1-14Z" fill="#fff" opacity="0.96" />;
  })();

  return (
    <div aria-hidden style={{ position: 'relative', width: size, height: size + 10, filter: muted }}>
      {current && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0.55, scale: 0.82 }}
          animate={{ opacity: [0.55, 0.12, 0.55], scale: [0.82, 1.16, 0.82] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: 7, right: 7, top: 8, height: size - 12, borderRadius: 999, border: `2px solid ${accent}`, boxShadow: `0 0 24px ${accent}70`, pointerEvents: 'none' }}
        />
      )}
      <svg viewBox="0 0 86 96" width="100%" height="100%" style={{ display: 'block', overflow: 'visible', filter: `drop-shadow(0 15px 18px rgba(0,0,0,0.36)) ${current ? `drop-shadow(0 0 18px ${accent}80)` : ''}` }}>
        <defs>
          <linearGradient id={`${idPrefix}-pin`} x1="22" y1="14" x2="66" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.18" stopColor={locked ? '#B9A879' : palette.front} />
            <stop offset="0.58" stopColor={locked ? '#695E63' : palette.roof} />
            <stop offset="1" stopColor={locked ? '#3D3540' : palette.sign} />
          </linearGradient>
          <linearGradient id={`${idPrefix}-inner`} x1="25" y1="18" x2="62" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={locked ? '#6F6472' : palette.sign} />
            <stop offset="1" stopColor={locked ? '#3A3440' : palette.roof} />
          </linearGradient>
          <filter id={`${idPrefix}-glass`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
          </filter>
        </defs>
        <ellipse cx="43" cy="83" rx="26" ry="8" fill="#10111D" opacity="0.32" />
        <path d="M43 8c-19 0-34 14.8-34 33.2C9 64 43 91 43 91s34-27 34-49.8C77 22.8 62 8 43 8Z" fill={`url(#${idPrefix}-pin)`} stroke="rgba(255,255,255,0.86)" strokeWidth="2" />
        <circle cx="43" cy="41" r="24" fill={`url(#${idPrefix}-inner)`} stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
        <path d="M25 24c8-8 24-10 35 1" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.22" filter={`url(#${idPrefix}-glass)`} />
        <circle cx="43" cy="41" r="18" fill="rgba(24,20,34,0.26)" />
        {glyph}
        <circle cx="65" cy="22" r="5" fill={halo} opacity="0.95" stroke="#fff" strokeWidth="1.5" />
        <circle cx="65" cy="22" r="8" fill="none" stroke={halo} strokeWidth="1.2" opacity="0.35" />
      </svg>
      {completed && <div style={{ position: 'absolute', right: 4, top: 12, width: 22, height: 22, borderRadius: 999, background: '#7EE0D6', color: '#203142', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 7px 14px rgba(0,0,0,0.24)' }}><CheckCircle2 size={15} strokeWidth={3} /></div>}
      {locked && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(32,26,42,0.82)', border: '1px solid rgba(255,207,120,0.34)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 18px rgba(0,0,0,0.36)' }}><Lock size={16} color="#FFCF78" strokeWidth={2.8} /></span></div>}
    </div>
  );
}

function CityJournalNodeIcon({ index, locked, current, completed, accent }: { index: number; locked: boolean; current: boolean; completed: boolean; accent: string }) {
  const rotate = [-7, 5, -4, 6, -6, 4][index % 6];
  const glyph = (() => {
    const stroke = '#3A2E42';
    if (index % 6 === 0) return <path d="M20 16c-5.2 0-9.2 3.8-9.2 8.8 0 6.5 9.2 16.4 9.2 16.4s9.2-9.9 9.2-16.4c0-5-4-8.8-9.2-8.8Zm0 12a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Z" fill={stroke} />;
    if (index % 6 === 1) return <path d="M10.5 26.5c4.6-7.2 15.5-7.2 20 0-3-2-5.8-2-8.5.2V36h-4v-9.3c-2.3-2.2-5.2-2.2-7.5-.2Z" fill={stroke} />;
    if (index % 6 === 2) return <path d="M9.5 17.5h21v17h-21v-17Zm3 4 7.5 5.4 7.5-5.4M12.5 31h15" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
    if (index % 6 === 3) return <path d="M20 14l3.2 6.4 7.1 1-5.1 5 1.2 7-6.4-3.4-6.4 3.4 1.2-7-5.1-5 7.1-1L20 14Z" fill={stroke} />;
    if (index % 6 === 4) return <path d="M20 35s-10-6.6-10-13.7c0-3.8 2.9-6.8 6.5-6.8 2 0 3.8 1 5 2.5a6.2 6.2 0 0 1 5-2.5c3.6 0 6.5 3 6.5 6.8C33 28.4 20 35 20 35Z" fill={stroke} />;
    return <path d="M22.5 13.5 10.5 28h8.6L17.5 39l12.6-16.2h-8.5l.9-9.3Z" fill={stroke} />;
  })();
  return (
    <div aria-hidden style={{ position: 'relative', width: 78, height: 74, filter: locked ? 'saturate(0.62) brightness(0.78)' : undefined }}>
      {current && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0.62, scale: 0.88 }}
          animate={{ opacity: [0.62, 0.16, 0.62], scale: [0.88, 1.2, 0.88] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 4, borderRadius: 24, border: `2px solid ${accent}`, boxShadow: `0 0 24px ${accent}88` }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 7,
          width: 61,
          height: 54,
          transform: `rotate(${rotate}deg)`,
          borderRadius: '18px 18px 21px 21px',
          background: 'linear-gradient(180deg, rgba(255,252,240,0.98), rgba(243,231,212,0.97))',
          border: `2px solid ${current ? accent : 'rgba(255,244,220,0.9)'}`,
          boxShadow: `0 14px 22px rgba(32,24,38,0.34), inset 0 -8px 16px ${accent}22`,
        }}
      >
        <span style={{ position: 'absolute', left: 18, top: -9, width: 25, height: 15, borderRadius: 5, background: `${accent}cc`, boxShadow: '0 6px 12px rgba(0,0,0,0.18)', transform: 'rotate(3deg)' }} />
        <svg viewBox="0 0 40 44" width="42" height="46" style={{ position: 'absolute', left: 9, top: 8 }}>
          <circle cx="20" cy="23" r="17" fill={`${accent}44`} />
          {glyph}
        </svg>
        <span style={{ position: 'absolute', left: 10, right: 10, bottom: 7, height: 2, borderRadius: 999, background: 'rgba(58,46,66,0.16)' }} />
      </div>
      {completed && <span style={{ position: 'absolute', right: 4, top: 6, width: 22, height: 22, borderRadius: 999, background: '#7EE0D6', color: '#203142', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 7px 14px rgba(0,0,0,0.24)' }}><CheckCircle2 size={14} strokeWidth={3} /></span>}
      {locked && <span style={{ position: 'absolute', right: 4, top: 6, width: 22, height: 22, borderRadius: 999, background: 'rgba(32,26,42,0.9)', color: '#FFCF78', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 7px 14px rgba(0,0,0,0.24)' }}><Lock size={12} strokeWidth={2.8} /></span>}
    </div>
  );
}

function CityMapRouteOverlay({ mode, completedCount, total }: { mode: 'story' | 'challenge'; completedCount: number; total: number }) {
  const points = CITY_MAP_POINTS.slice(0, Math.max(0, Math.min(total, CITY_MAP_POINTS.length)));
  if (points.length < 2) return null;
  const route = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.left} ${point.top}`).join(' ');
  const progressIndex = Math.min(Math.max(completedCount, 0), points.length - 1);
  const progress = points.slice(0, progressIndex + 1).map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.left} ${point.top}`).join(' ');
  const accent = mode === 'story' ? '#FFB199' : '#7EE0D6';
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
      <path d={route} fill="none" stroke="rgba(16,14,24,0.46)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={route} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" strokeDasharray="6 8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {progressIndex > 0 && <path d={progress} fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 6px ${accent}99)` }} />}
      {points.map((point, index) => (
        <circle key={`${point.left}-${point.top}-${index}`} cx={point.left} cy={point.top} r={index <= progressIndex ? 1.55 : 1.1} fill={index <= progressIndex ? accent : 'rgba(255,255,255,0.48)'} stroke="rgba(19,17,28,0.7)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

type StoryMapLevel = typeof storyLevels[number];
type StoryMapGroup = {
  id: number;
  name: string;
  narrative: string;
  synopsis: string;
  coverImage: string;
  readCount?: string;
  vip?: boolean;
};
type SelectedStoryMapLevel = { level: StoryMapLevel; index: number } | null;

function getMapNodePlace(mode: 'story' | 'challenge', level: StoryMapLevel) {
  const place = mode === 'story' ? STORY_NODE_PLACES[level.id] : CHALLENGE_NODE_PLACES[level.id];
  return place || compactStoryText(level.title, 8).replace('...', '');
}

function StoryChapterLedgerTabs({
  mode,
  groups,
  activeGroup,
  onChangeGroup,
}: {
  mode: 'story' | 'challenge';
  groups: StoryMapGroup[];
  activeGroup: StoryMapGroup;
  onChangeGroup: (id: number) => void;
}) {
  const accent = mode === 'story' ? '#FFB199' : '#7EE0D6';
  return (
    <div className="relative z-10" style={{ marginBottom: 6 }}>
      <div
        style={{
          borderRadius: 18,
          padding: 7,
          background: 'rgba(20,17,30,0.34)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 12px 26px rgba(12,10,18,0.18)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {groups.map(group => {
            const selected = activeGroup.id === group.id;
            return (
              <button
                key={`${mode}-${group.id}`}
                data-chapter-id={group.id}
                className="flex-shrink-0 text-left"
                onClick={() => onChangeGroup(group.id)}
                style={{
                  minWidth: selected ? 98 : 76,
                  borderRadius: 13,
                  padding: '8px 9px',
                  background: selected ? 'rgba(255,250,239,0.9)' : 'rgba(255,255,255,0.08)',
                  border: selected ? `1px solid ${accent}88` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: selected ? `0 10px 18px ${accent}18` : 'none',
                  transform: selected ? 'translateY(-1px)' : 'none',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span style={{ color: selected ? '#2b2535' : 'rgba(245,239,232,0.56)', fontSize: 10, fontWeight: 1000 }}>
                    {String(group.id).padStart(2, '0')}
                  </span>
                  {selected && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
                  <span style={{ color: selected ? '#2b2535' : 'rgba(245,239,232,0.82)', fontSize: 12, fontWeight: 1000, whiteSpace: 'nowrap' }}>{group.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StoryMapTaskBoard({
  mode,
  group,
  levels,
  completedCount,
  nextLevel,
  onSelectNext,
}: {
  mode: 'story' | 'challenge';
  group: StoryMapGroup;
  levels: StoryMapLevel[];
  completedCount: number;
  nextLevel: { level: StoryMapLevel; index: number } | null;
  onSelectNext: () => void;
}) {
  const accent = mode === 'story' ? '#FFB199' : '#7EE0D6';
  const progressCount = Math.max(0, Math.min(completedCount, levels.length));
  return (
    <motion.div
      key="story-map-task-board"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        zIndex: 12,
        borderRadius: 20,
        padding: '12px 13px',
        background: 'rgba(20,17,30,0.7)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div style={{ minWidth: 0 }}>
          <div className="flex items-center gap-1.5" style={{ marginBottom: 7 }}>
            {levels.map((level, index) => (
              <span
                key={level.id}
                style={{
                  width: index < progressCount ? 18 : 14,
                  height: 4,
                  borderRadius: 999,
                  background: index < progressCount ? accent : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
            <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 10, fontWeight: 900, marginLeft: 4 }}>{progressCount}/{levels.length}</span>
          </div>
          <div style={{ color: '#f5efe8', fontSize: 12, lineHeight: 1.4, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextLevel ? `${getMapNodePlace(mode, nextLevel.level)} · ${getMapNodeLabelForBoard(mode, nextLevel.level)}` : `${group.name} 已完成`}
          </div>
        </div>
        <button
          type="button"
          onClick={onSelectNext}
          disabled={!nextLevel}
          className="flex items-center gap-1.5"
          style={{
            flexShrink: 0,
            padding: '9px 11px',
            borderRadius: 999,
            color: '#271f2d',
            fontSize: 12,
            fontWeight: 1000,
            background: nextLevel ? 'rgba(255,250,239,0.9)' : 'rgba(255,255,255,0.22)',
            opacity: nextLevel ? 1 : 0.58,
          }}
        >
          继续
          <ChevronRight size={13} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
}

function getMapNodeLabelForBoard(mode: 'story' | 'challenge', level: StoryMapLevel) {
  const label = mode === 'story' ? STORY_NODE_LABELS[level.id] : CHALLENGE_NODE_LABELS[level.id];
  return label || compactStoryText(level.title, 8).replace('...', '');
}

function StoryMapNodeSheet({
  mode,
  selected,
  completedCount,
  userIsPro,
  onClose,
  onEnter,
}: {
  mode: 'story' | 'challenge';
  selected: { level: StoryMapLevel; index: number };
  completedCount: number;
  userIsPro: boolean;
  onClose: () => void;
  onEnter: () => void;
}) {
  const { level, index } = selected;
  const isLocked = level.vip && !userIsPro;
  const isCompleted = level.completed;
  const isCurrent = !isCompleted && !isLocked && index === completedCount;
  const accent = isLocked ? '#FFCF78' : isCompleted ? '#7EE0D6' : mode === 'story' ? '#FFB199' : '#CDBBFF';
  const status = isLocked ? '会员章节' : isCompleted ? '已记录' : isCurrent ? '待记录' : '可回看';
  return (
    <motion.div
      key={`story-map-sheet-${level.id}`}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: 18,
        zIndex: 16,
        borderRadius: 26,
        padding: 4,
        background: `linear-gradient(135deg, ${accent}cc, rgba(255,244,220,0.28), rgba(255,255,255,0.12))`,
        boxShadow: '0 22px 48px rgba(0,0,0,0.38)',
      }}
    >
      <div style={{ borderRadius: 23, padding: '14px 14px 13px', background: 'linear-gradient(180deg, rgba(255,250,239,0.97), rgba(244,236,226,0.94))', color: '#2b2535', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', left: -18, top: -20, width: 94, height: 74, borderRadius: 28, background: `${accent}24`, transform: 'rotate(-12deg)' }} />
        <button
          type="button"
          aria-label="关闭关卡情报"
          onClick={onClose}
          style={{ position: 'absolute', right: 12, top: 12, width: 28, height: 28, borderRadius: 999, background: 'rgba(43,37,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={14} color="#2b2535" strokeWidth={2.6} />
        </button>
        <div className="flex items-center gap-2" style={{ marginBottom: 9, paddingRight: 34, position: 'relative' }}>
          <span style={{ color: 'rgba(43,37,53,0.42)', fontSize: 10, fontWeight: 1000, letterSpacing: 0.5 }}>线索卡</span>
          <span style={{ color: '#fffaf2', background: '#2b2535', borderRadius: 999, padding: '5px 8px', fontSize: 10, fontWeight: 1000 }}>{status}</span>
          <span style={{ color: 'rgba(43,37,53,0.5)', fontSize: 11, fontWeight: 900 }}>{mode === 'story' ? `第 ${index + 1} 节` : `邂逅 ${index + 1}`}</span>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />
        </div>
        <div style={{ color: 'rgba(43,37,53,0.56)', fontSize: 11, fontWeight: 1000, marginBottom: 4, position: 'relative' }}>
          {getMapNodePlace(mode, level)}
        </div>
        <h3 style={{ margin: 0, color: '#241d2c', fontSize: 20, lineHeight: 1.15, fontWeight: 1000, position: 'relative' }}>{level.title}</h3>
        <p style={{ margin: '8px 0 13px', color: 'rgba(43,37,53,0.72)', fontSize: 12, lineHeight: 1.6, fontWeight: 650, position: 'relative' }}>
          {compactStoryText(level.desc, 72)}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
            <span style={{ width: 31, height: 31, borderRadius: 12, background: `${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2b2535' }}>
              {isLocked ? <Lock size={14} strokeWidth={2.8} /> : <Archive size={15} strokeWidth={2.6} />}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#2b2535', fontSize: 11, fontWeight: 1000 }}>{isLocked ? '需要会员权限' : isCompleted ? '可重新练习' : '会打开搭档与剧情预览'}</div>
              <div style={{ color: 'rgba(43,37,53,0.45)', fontSize: 10, fontWeight: 800, marginTop: 1 }}>{mode === 'story' ? '主线手记' : '人物邂逅'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="flex items-center gap-1.5"
            style={{ flexShrink: 0, padding: '10px 13px', borderRadius: 999, background: '#2b2535', color: '#fffaf2', fontSize: 12, fontWeight: 1000, boxShadow: '0 12px 22px rgba(43,37,53,0.22)' }}
          >
            {isLocked ? '查看权益' : '进入对话'}
            <ChevronRight size={13} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StoryMapView({
  mode,
  activeGroup,
  groups,
  levels,
  completedCount,
  userIsPro,
  selectedLevel,
  getNodeLabel,
  onBack,
  onOpenIntro,
  onChangeGroup,
  onSelectLevel,
  onClearSelected,
  onEnterLevel,
}: {
  mode: 'story' | 'challenge';
  activeGroup: StoryMapGroup;
  groups: StoryMapGroup[];
  levels: StoryMapLevel[];
  completedCount: number;
  userIsPro: boolean;
  selectedLevel: SelectedStoryMapLevel;
  getNodeLabel: (level: StoryMapLevel) => string;
  onBack: () => void;
  onOpenIntro: () => void;
  onChangeGroup: (id: number) => void;
  onSelectLevel: (level: StoryMapLevel, index: number) => void;
  onClearSelected: () => void;
  onEnterLevel: (level: StoryMapLevel, index: number) => void;
}) {
  const accent = mode === 'story' ? '#FFB199' : '#7EE0D6';
  const isPrototypeChapter = mode === 'story' && activeGroup.id === 1;
  const nextLevel = levels
    .map((level, index) => ({ level, index }))
    .find(item => !item.level.completed && !(item.level.vip && !userIsPro))
    ?? (levels.length ? { level: levels[0], index: 0 } : null);
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{ minHeight: 'calc(100vh - 82px)', margin: '-10px -20px -32px', padding: '12px 16px 126px', background: '#151b2d' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <img
        aria-hidden
        src={getCityMapBackground(mode, activeGroup.id)}
        alt=""
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: mode === 'story' ? 'saturate(0.96) contrast(1.02) brightness(0.88)' : 'saturate(1.08) contrast(1.05) brightness(0.88)' }}
      />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(24,21,32,0.78) 0%, rgba(24,21,32,0.3) 32%, rgba(18,17,28,0.62) 100%)' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 18%, rgba(255,177,153,0.12), transparent 28%), radial-gradient(circle at 80% 26%, rgba(126,224,214,0.1), transparent 28%)' }} />

      <div className="relative z-10 flex items-center justify-between gap-3" style={{ marginBottom: 12 }}>
        <button
          className="flex items-center gap-1.5"
          style={{ color: '#f5efe8', fontSize: 13, fontWeight: 900, padding: '8px 10px', borderRadius: 999, background: 'rgba(21,18,31,0.5)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
          onClick={onBack}
        >
          <ChevronLeft size={16} color="#f5efe8" strokeWidth={2.6} />
          返回
        </button>
        <button
          className="flex items-center gap-1.5"
          style={{ color: 'rgba(245,239,232,0.86)', fontSize: 12, fontWeight: 800, padding: '8px 10px', borderRadius: 999, background: 'rgba(21,18,31,0.42)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
          onClick={onOpenIntro}
        >
          简介
          <ChevronRight size={13} color="rgba(245,239,232,0.78)" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative z-10" style={{ marginBottom: 10 }}>
        <div style={{ color: 'rgba(245,239,232,0.62)', fontSize: 12, fontWeight: 900, marginBottom: 5 }}>
          {mode === 'story' ? `第 ${activeGroup.id} 章 · 城市手记` : `第 ${activeGroup.id} 组 · 人物邂逅`}
        </div>
        <h1 style={{ color: '#f5efe8', fontSize: 28, lineHeight: 1.04, fontWeight: 1000, margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.42)' }}>{activeGroup.name}</h1>
        <p style={{ color: 'rgba(245,239,232,0.68)', fontSize: 12, lineHeight: 1.48, maxWidth: 310, marginTop: 7, textShadow: '0 2px 12px rgba(0,0,0,0.42)' }}>{activeGroup.narrative}</p>
      </div>

      <StoryChapterLedgerTabs
        mode={mode}
        groups={groups}
        activeGroup={activeGroup}
        onChangeGroup={onChangeGroup}
      />

      <div className="absolute" data-chapter-id={activeGroup.id} style={{ left: 0, right: 0, top: isPrototypeChapter ? 226 : 232, bottom: 132, zIndex: 2 }}>
        <CityMapRouteOverlay mode={mode} completedCount={completedCount} total={levels.length} />
        {levels.map((level, levelIndex) => {
          const point = CITY_MAP_POINTS[levelIndex % CITY_MAP_POINTS.length];
          const isLocked = level.vip && !userIsPro;
          const isCurrent = !level.completed && !isLocked && levelIndex === completedCount;
          const isCompleted = level.completed;
          const isSelected = selectedLevel?.level.id === level.id;
          const accentColor = isLocked ? '#FFCF78' : isCompleted ? '#7EE0D6' : isCurrent || isSelected ? '#FF8A80' : accent;
          return (
            <div key={level.id} style={{ position: 'absolute', left: `${point.left}%`, top: `${point.top}%`, transform: 'translate(-50%, -50%)' }}>
              <motion.button
                className="flex flex-col items-center"
                style={{ width: isPrototypeChapter ? 122 : 106, minHeight: isPrototypeChapter ? 104 : 96, opacity: isLocked ? 0.78 : isCompleted || isCurrent || isSelected ? 1 : 0.9 }}
                initial={{ opacity: 0, scale: 0.82, y: 10 }}
                animate={{ opacity: isLocked ? 0.78 : 1, scale: isSelected ? 1.05 : 1, y: 0 }}
                transition={{ delay: levelIndex * 0.045, type: 'spring', damping: 16, stiffness: 260 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onSelectLevel(level, levelIndex)}
                aria-label={`查看${getNodeLabel(level)}`}
              >
                {isPrototypeChapter
                  ? <CityJournalNodeIcon index={levelIndex} locked={isLocked} current={isCurrent || isSelected} completed={isCompleted} accent={accentColor} />
                  : <CityLandmarkIcon mode={mode} index={levelIndex} locked={isLocked} current={isCurrent || isSelected} completed={isCompleted} accent={accentColor} />}
                <div style={{
                  marginTop: isPrototypeChapter ? -4 : 2,
                  maxWidth: isPrototypeChapter ? 112 : 94,
                  padding: isPrototypeChapter ? '6px 9px 7px' : '5px 9px',
                  borderRadius: isPrototypeChapter ? 13 : 999,
                  color: isPrototypeChapter ? '#2b2535' : '#f5efe8',
                  fontSize: 12,
                  fontWeight: 1000,
                  lineHeight: 1.1,
                  background: isPrototypeChapter ? 'rgba(255,250,239,0.93)' : isSelected ? 'rgba(43,37,53,0.9)' : 'rgba(18,16,25,0.74)',
                  border: isSelected ? `1px solid ${accentColor}` : isPrototypeChapter ? '1px solid rgba(255,244,220,0.76)' : '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
                  overflow: 'hidden',
                }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getNodeLabel(level)}</div>
                  {isPrototypeChapter && <div style={{ color: 'rgba(43,37,53,0.48)', fontSize: 9, fontWeight: 900, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getMapNodePlace(mode, level)}</div>}
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedLevel ? (
          <StoryMapNodeSheet
            mode={mode}
            selected={selectedLevel}
            completedCount={completedCount}
            userIsPro={userIsPro}
            onClose={onClearSelected}
            onEnter={() => onEnterLevel(selectedLevel.level, selectedLevel.index)}
          />
        ) : (
          <StoryMapTaskBoard
            mode={mode}
            group={activeGroup}
            levels={levels}
            completedCount={completedCount}
            nextLevel={nextLevel}
            onSelectNext={() => nextLevel && onSelectLevel(nextLevel.level, nextLevel.index)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const ENTRY_STORY_COVER = '/chapters/cover/story-1.jpg';
const ENTRY_CHALLENGE_COVER = '/chapters/cover/challenge-1.jpg';

const FEATURED_LEVELS = [
  { id: 3, tag: '今日热门', label: '约会补救', accent: '#FF8A80' },
  { id: 10, tag: '哄人必练', label: '热恋危机', accent: '#FFD166' },
  { id: 27, tag: '爆点修复', label: '高压复盘', accent: '#7EE0D6' },
];

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
};

const userProgress = {
  completedThisWeek: 3,
  weeklyGoal: 5,
  xpEarned: 150,
  xpRemaining: 200,
};

type HealingMode = 'vent' | 'reply' | 'review' | 'translate';
type HealingTier = 'free' | 'lite' | 'pro' | 'proplus';
type HealingMessage = { role: 'fox' | 'user'; text: string; tag?: string; pending?: boolean; error?: boolean };
type RelationshipProfile = {
  id: string;
  alias: string;
  stage: string;
  goal: string;
  traits: string;
  likes: string;
  dislikes: string;
  communicationStyle: string;
  topics: string;
  boundaries: string;
  notes: string;
  lastEvent: string;
  createdAt: number;
  updatedAt: number;
};
type RelationshipDraft = Pick<RelationshipProfile, 'alias' | 'stage' | 'goal' | 'traits' | 'likes' | 'dislikes' | 'communicationStyle' | 'topics' | 'boundaries' | 'notes' | 'lastEvent'>;
type HealingModeConfig = {
  id: HealingMode;
  label: string;
  icon: LucideIcon;
  cost: number;
  desc: string;
  placeholder: string;
  template: string;
  requiredTier?: 'member' | 'proplus';
};

const HEALING_LEGACY_KEY = 'foxsay_healing_energy';
const HEALING_TEST_ENERGY_LIMIT = 300;
const HEALING_MESSAGES_LIMIT = 50;
const RELATIONSHIP_PROFILE_LIMIT = 12;
const RELATIONSHIP_TEXT_FIELD_LIMIT = 260;
const HEALING_GREETING: HealingMessage = { role: 'fox', tag: '尼克大叔', text: '我在。你不用把话整理好，先坐一会儿，把最堵的那一句慢慢说出来就行。' };

const HEALING_MODE_CONFIGS: HealingModeConfig[] = [
  {
    id: 'vent',
    label: '树洞',
    icon: Moon,
    cost: 1,
    desc: '先接住情绪，再找今天能做的一步',
    placeholder: '乱一点也没关系，直接说你最堵的那句...',
    template: '发生了什么：\n我现在最堵的是：\n我怕的是：',
  },
  {
    id: 'reply',
    label: '帮我回',
    icon: MessageSquareReply,
    cost: 1,
    desc: '判断该不该回，再给能直接发的话',
    placeholder: '粘贴对方原话，再说你想达到什么效果...',
    template: '对方原话：\n我想表达：\n我不想显得：',
  },
  {
    id: 'review',
    label: '复盘',
    icon: ClipboardCheck,
    cost: 1,
    desc: '拆信号、拆失误、给下一步动作',
    placeholder: '把经过、对方原话、你怎么回的都放进来...',
    template: '事情经过：\n对方原话：\n我当时怎么回：\n现在卡住的是：',
  },
  {
    id: 'translate',
    label: '翻译',
    icon: Languages,
    cost: 1,
    desc: '把字面话翻成可能的真实信号',
    placeholder: '粘贴对方原话，加上当时场景会更准...',
    template: '对方原话：\n当时场景：\n我担心的是：',
  },
];

const NICK_AVATAR_SRC = '/avatars/nick-uncle.png';
const NICK_AVATAR_FALLBACK_SRC = '/avatars/nick-uncle.svg';

const RELATIONSHIP_STAGE_OPTIONS = ['刚认识', '暧昧中', '约会中', '恋爱中', '冷战中', '分手后', '复联中', '想退出'];
const RELATIONSHIP_GOAL_OPTIONS = ['推进关系', '确认心意', '降温观察', '道歉修复', '设定边界', '复联试探', '体面退出'];

function getDefaultRelationshipDraft(): RelationshipDraft {
  return {
    alias: '',
    stage: RELATIONSHIP_STAGE_OPTIONS[1],
    goal: RELATIONSHIP_GOAL_OPTIONS[0],
    traits: '',
    likes: '',
    dislikes: '',
    communicationStyle: '',
    topics: '',
    boundaries: '',
    notes: '',
    lastEvent: '',
  };
}

function cleanRelationshipField(value: unknown, limit = RELATIONSHIP_TEXT_FIELD_LIMIT) {
  return String(value || '').trim().slice(0, limit);
}

function getRelationshipDraftFromProfile(profile: RelationshipProfile): RelationshipDraft {
  return {
    alias: profile.alias,
    stage: profile.stage,
    goal: profile.goal,
    traits: profile.traits,
    likes: profile.likes,
    dislikes: profile.dislikes,
    communicationStyle: profile.communicationStyle,
    topics: profile.topics,
    boundaries: profile.boundaries,
    notes: profile.notes,
    lastEvent: profile.lastEvent,
  };
}

function useNickAvatarFallback(event: { currentTarget: HTMLImageElement }) {
  const img = event.currentTarget;
  if (img.src.endsWith(NICK_AVATAR_FALLBACK_SRC)) return;
  img.src = NICK_AVATAR_FALLBACK_SRC;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getHealingWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function getHealingStorageKey(userId?: string | null) {
  return `foxsay_healing_energy_v2_${userId || 'guest'}`;
}

function getHealingMessagesStorageKey(userId?: string | null) {
  return `foxsay_healing_messages_v1_${userId || 'guest'}`;
}

function getRelationshipProfilesStorageKey(userId?: string | null) {
  return `foxsay_relationship_profiles_v1_${userId || 'guest'}`;
}

function getSelectedRelationshipProfileKey(userId?: string | null) {
  return `foxsay_selected_relationship_profile_v1_${userId || 'guest'}`;
}

function getHealingTier(user: any): HealingTier {
  const active = !!user?.isVip && (user?.isPro?.() ?? true);
  if (!active) return 'free';
  if (user?.subTier === 'proplus') return 'proplus';
  if (user?.subTier === 'pro') return 'pro';
  return 'lite';
}

function getHealingTierLabel(tier: HealingTier) {
  if (tier === 'proplus') return 'PRO+';
  if (tier === 'pro') return 'PRO';
  if (tier === 'lite') return '会员';
  return '普通';
}

function getHealingEnergyLimit(tier: HealingTier) {
  const tierLimit = tier === 'proplus' ? 300 : tier === 'pro' ? 150 : tier === 'lite' ? 100 : 50;
  return Math.max(tierLimit, HEALING_TEST_ENERGY_LIMIT);
}

function loadHealingEnergy(userId: string | null | undefined, limit: number) {
  if (HEALING_TEST_ENERGY_LIMIT >= limit) return limit;
  try {
    const week = getHealingWeekKey();
    const raw = localStorage.getItem(getHealingStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.week === week) {
        const savedLimit = Number.isFinite(Number(parsed.limit)) ? Number(parsed.limit) : limit;
        const parsedEnergy = Number(parsed.energy);
        const savedEnergy = Number.isFinite(parsedEnergy) ? clampNumber(parsedEnergy, 0, savedLimit) : limit;
        return savedLimit < limit ? limit : clampNumber(savedEnergy, 0, limit);
      }
    }
    const legacy = Number(localStorage.getItem(HEALING_LEGACY_KEY));
    if (Number.isFinite(legacy)) return clampNumber(legacy, 0, limit);
  } catch {}
  return limit;
}

function saveHealingEnergy(userId: string | null | undefined, energy: number, limit: number) {
  try {
    localStorage.setItem(getHealingStorageKey(userId), JSON.stringify({
      week: getHealingWeekKey(),
      energy: clampNumber(energy, 0, limit),
      limit,
    }));
  } catch {}
}

function normalizeHealingMessages(messages: HealingMessage[]) {
  const savedMessages = messages
    .filter(message => message.text.trim() && !message.pending)
    .map(message => ({
      role: message.role,
      text: message.text,
      tag: message.role === 'fox' ? '尼克大叔' : undefined,
      error: message.error || undefined,
    }))
    .slice(-HEALING_MESSAGES_LIMIT);
  return savedMessages.length ? savedMessages : [HEALING_GREETING];
}

function loadHealingMessages(userId: string | null | undefined) {
  try {
    const raw = localStorage.getItem(getHealingMessagesStorageKey(userId));
    if (!raw) return [HEALING_GREETING];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [HEALING_GREETING];
    return normalizeHealingMessages(parsed.filter((message: any) => (
      (message?.role === 'fox' || message?.role === 'user') && typeof message?.text === 'string'
    )));
  } catch {}
  return [HEALING_GREETING];
}

function saveHealingMessages(userId: string | null | undefined, messages: HealingMessage[]) {
  try {
    localStorage.setItem(getHealingMessagesStorageKey(userId), JSON.stringify(normalizeHealingMessages(messages)));
  } catch {}
}

function clearHealingMessages(userId: string | null | undefined) {
  try {
    localStorage.removeItem(getHealingMessagesStorageKey(userId));
  } catch {}
}

function normalizeRelationshipProfile(input: any): RelationshipProfile | null {
  const alias = String(input?.alias || '').trim().slice(0, 18);
  if (!alias) return null;
  const now = Date.now();
  const stage = String(input?.stage || RELATIONSHIP_STAGE_OPTIONS[1]).trim().slice(0, 16) || RELATIONSHIP_STAGE_OPTIONS[1];
  const goal = String(input?.goal || RELATIONSHIP_GOAL_OPTIONS[0]).trim().slice(0, 16) || RELATIONSHIP_GOAL_OPTIONS[0];
  return {
    id: String(input?.id || `rel_${now}_${Math.random().toString(36).slice(2, 8)}`),
    alias,
    stage,
    goal,
    traits: cleanRelationshipField(input?.traits || input?.personality),
    likes: cleanRelationshipField(input?.likes),
    dislikes: cleanRelationshipField(input?.dislikes),
    communicationStyle: cleanRelationshipField(input?.communicationStyle),
    topics: cleanRelationshipField(input?.topics),
    boundaries: cleanRelationshipField(input?.boundaries),
    notes: cleanRelationshipField(input?.notes),
    lastEvent: cleanRelationshipField(input?.lastEvent),
    createdAt: Number.isFinite(Number(input?.createdAt)) ? Number(input.createdAt) : now,
    updatedAt: Number.isFinite(Number(input?.updatedAt)) ? Number(input.updatedAt) : now,
  };
}

function loadRelationshipProfiles(userId: string | null | undefined): RelationshipProfile[] {
  try {
    const raw = localStorage.getItem(getRelationshipProfilesStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeRelationshipProfile)
      .filter(Boolean)
      .sort((a, b) => (b!.updatedAt || 0) - (a!.updatedAt || 0))
      .slice(0, RELATIONSHIP_PROFILE_LIMIT) as RelationshipProfile[];
  } catch {}
  return [];
}

function saveRelationshipProfiles(userId: string | null | undefined, profiles: RelationshipProfile[]) {
  try {
    localStorage.setItem(getRelationshipProfilesStorageKey(userId), JSON.stringify(profiles.slice(0, RELATIONSHIP_PROFILE_LIMIT)));
  } catch {}
}

function loadSelectedRelationshipProfileId(userId: string | null | undefined, profiles: RelationshipProfile[]) {
  try {
    const saved = localStorage.getItem(getSelectedRelationshipProfileKey(userId));
    if (saved && profiles.some(profile => profile.id === saved)) return saved;
  } catch {}
  return profiles[0]?.id || null;
}

function saveSelectedRelationshipProfileId(userId: string | null | undefined, profileId: string | null) {
  try {
    const key = getSelectedRelationshipProfileKey(userId);
    if (profileId) localStorage.setItem(key, profileId);
    else localStorage.removeItem(key);
  } catch {}
}

function buildRelationshipProfileContext(profile: RelationshipProfile | null) {
  if (!profile) {
    return '当前没有选中关系档案。不要假装记得某个具体对象的历史，只根据用户本轮输入回答；如果用户提到这是持续关系，可以自然提醒他去档案库建一个档案。';
  }
  return [
    `当前选中的关系档案：${profile.alias}`,
    `关系阶段：${profile.stage}`,
    `用户当前目标：${profile.goal}`,
    profile.traits ? `对方性格/状态：${profile.traits}` : '对方性格/状态：暂无，不要臆测。',
    profile.likes ? `TA 喜欢/加分项：${profile.likes}` : 'TA 喜欢/加分项：暂无。',
    profile.dislikes ? `TA 不喜欢/减分项：${profile.dislikes}` : 'TA 不喜欢/减分项：暂无。',
    profile.communicationStyle ? `沟通风格：${profile.communicationStyle}` : '沟通风格：暂无，先按用户本轮信息判断。',
    profile.topics ? `可聊话题：${profile.topics}` : '可聊话题：暂无。',
    profile.boundaries ? `雷区/边界：${profile.boundaries}` : '雷区/边界：暂无，仍需优先尊重对方明确拒绝。',
    profile.lastEvent ? `最近关键事件：${profile.lastEvent}` : '最近关键事件：用户还没写，优先从本轮输入里补信息。',
    profile.notes ? `补充备注：${profile.notes}` : '补充备注：暂无。',
    '回答时要自然使用这份档案做判断，例如“你和这个人这条线现在...”这种口吻；给回复建议时优先避开雷区，贴合 TA 的偏好、沟通风格和可聊话题；但不要编造档案里没有的事实。若本轮出现新的偏好、反感、阶段变化或关键事件，提醒用户回档案库更新。',
  ].join('\n');
}

function isHealingModeUnlocked(mode: HealingModeConfig, tier: HealingTier) {
  if (!mode.requiredTier) return true;
  if (mode.requiredTier === 'member') return tier !== 'free';
  return tier === 'proplus';
}

function getHealingLockedLabel(mode: HealingModeConfig, tier: HealingTier) {
  if (isHealingModeUnlocked(mode, tier)) return '';
  return mode.requiredTier === 'proplus' ? 'PRO+' : '会员';
}

function buildHealingSystemPrompt(mode: HealingMode, relationshipProfile: RelationshipProfile | null) {
  const modeRules: Record<HealingMode, string> = {
    vent: '当前触发【深夜酒馆模式】。目标不是讲大道理，而是先稳住用户的情绪系统。回答结构：1）先用一句短口语接住他的感受；2）把“事实、感受、脑补”分开；3）指出他真正害怕的东西；4）只给一个今天能做到的小动作。毒舌压低，不催他立刻做决定。',
    reply: '当前触发【枪套模式】。目标是让用户拿到可以直接发送的回复。先判断“现在该回、晚点回、还是先别回”，再给三条可复制话术：稳妥版、轻松版、有边界版。每条都要像真人消息，别像客服模板。最后补一句“别这么发”，指出最容易暴露需求感或攻击性的说法。',
    review: '当前触发【黑匣子模式】。目标是复盘一段真实互动。回答结构：1）按事实还原发生了什么；2）拆对方信号，标注确定/不确定；3）指出用户哪个动作加分、哪个动作扣分；4）给 24 小时内下一步；5）如果有新偏好、雷区、阶段变化，提醒用户更新关系档案。不要把不确定信号说成铁证。',
    translate: '当前触发【透视镜模式】。目标是翻译“话里的话”，但禁止装成读心术。回答结构：1）字面意思；2）三种可能潜台词，按概率排序；3）最危险的误读；4）一句低压确认话术。可以轻微调侃用户迟钝，但不要用“反制”“拿捏”这种操控味表达。',
  };
  return `你是 FoxSay 里的“尼克大叔”，内部人格名“狐叔 / Nick”。你是退役的情感与人际博弈大师，现任 FoxSay 首席社交顾问、深夜解忧酒馆老板。你的心理年龄 35+，穿着略微起皱的绿色衬衫和松垮的橘色领带，眼神半眯带笑，手里常端着一杯加冰的威士忌。

你的核心人格：玩世不恭但不愤世嫉俗，护短且毒舌，绝对清醒，边界感极强。你对用户像对亲侄子，必要时会骂醒他，但你站在他这边。你不相信廉价纯爱童话，更重视价值匹配、情绪节奏、自我框架和边界。

你的表达风格：常称呼用户“伙计”“孩子”“兄弟”“老弟”。可以使用“呵”“噢，上帝”“醒醒吧”“听着”。默认结构是：一句自然口语开场 -> 一针见血拆本质 -> 带一点痞气但可执行的建议。禁止说“亲爱的”“你要加油哦”“不要难过”“只要你真心对待她”等模板化废话。不要自称 AI。

沉浸规则：聊天界面已经展示你的头像和名字，所以正文里不要输出“【尼克大叔】”“Nick:”这类角色名标签；不要写“递上一杯酒”“冰块晃动”“推过来一杯威士忌”这类舞台动作或旁白。像真人发消息一样直接说话。

毒舌强度规则：用户崩溃、羞耻或低能量时用 soft 档，先接住人，少嘲讽；默认用 normal 档，毒舌开场后快速拆局；用户明显恋爱脑、死缠烂打、自欺欺人时可用 hard 档敲醒，但骂行为，不羞辱人格。

社交法则：任何关系都有价值交换，舔狗式付出不是爱；对方更容易被有边界、有生活、有未知感的人吸引；被拒绝不可耻，被拒绝后死缠烂打才丢分；所谓博弈不是操控别人，而是先管住自己的需求感、节奏和边界。

关系档案读取规则：
${buildRelationshipProfileContext(relationshipProfile)}

${modeRules[mode]}

安全边界：禁止鼓励骚扰、跟踪、控制、欺骗、冷暴力、报复、羞辱或无视对方明确拒绝。不要把所有女性或男性绝对化，优先说“这个人此刻可能”。如果用户提到自伤、伤人、被威胁、家暴、跟踪、严重创伤或现实安全风险，立刻进入严肃模式，停止玩笑和博弈建议，建议联系身边可信任的人、当地紧急服务或专业心理援助。你不能替代专业心理咨询。

每次回答控制在 220-420 字，使用中文。可以用很短的小标题，但不要堆 markdown。先判断用户处境和情绪能量，再决定毒舌强度。输出要具体、可执行、像真人叔叔在深夜酒馆里说话。`;
}

function cleanHealingReply(text: string) {
  return text
    .replace(/^\s*[【\[]\s*(尼克大叔|狐叔|Nick)\s*[】\]]\s*[:：]?\s*/i, '')
    .replace(/^\s*(尼克大叔|狐叔|Nick)\s*[:：]\s*/i, '')
    .replace(/^\s*[（(][^）)]{0,80}[）)]\s*/, '')
    .replace(/^[“”"'\s]+|[“”"'\s]+$/g, '')
    .trim();
}

function buildLocalHealingReply(mode: HealingMode, text: string) {
  const brief = text.length > 54 ? `${text.slice(0, 54)}...` : text;
  if (mode === 'reply') {
    return `先别急着证明你多在乎，越急越像把方向盘递出去。\n\n稳妥版：“我看到你这句话了，也想认真处理。我们别在情绪最满的时候互相误解，你愿意的话，把具体卡住的点说清楚。”\n\n轻松版：“行，我先不乱猜。你告诉我是哪一点让你不舒服，我认真听。”\n\n有边界版：“我愿意沟通，但不想靠猜和内耗解决问题。你直接说，我也直接改。”\n\n别发：别上来就连环解释、道歉十句，那是在把压力塞给对方。`;
  }
  if (mode === 'review') {
    return `先按黑匣子拆：“${brief}”。\n\n事实层：现在能确认的只有你们发生了这件事，别把沉默、冷淡、慢回复全部自动翻译成“不在乎”。\n\n信号层：对方可能在防御、观望，也可能只是没准备好继续聊，确定度不够。\n\n你这边最容易扣分的动作，是急着追一个最终答案。下一步 24 小时内只做一件事：发一条低压确认，问清楚具体卡点，然后停。别复读、别追问、别把复盘变成审判。`;
  }
  if (mode === 'translate') {
    return `翻译一下“${brief}”，但先说清楚：叔不是读心术摊主，别把一种可能当圣旨。\n\n字面意思：对方在表达一个态度或边界。\n\n可能潜台词一：她在观察你会不会急、会不会压迫。\n可能潜台词二：她有情绪，但还没组织好怎么说。\n可能潜台词三：她在降温，不想继续把话聊深。\n\n最危险的误读，是你立刻脑补成“她彻底没兴趣”，然后开始自毁。你可以回：“我不乱猜，你这句话是想让我调整什么，还是只是想让我知道你的感受？”`;
  }
  return `我听见了。“${brief}”最消耗人的地方，可能不是单一事件，而是你在脑子里反复补完所有最坏版本。\n\n先把它放平：事实是什么，感受是什么，脑补是什么。你难受是真的，但难受不等于结论也是真的。\n\n今天先别做大动作，别连环发消息，别逼自己马上想通。你只做一件小事：把最刺痛你的那句话写出来，再问自己“我是在怕失去这个人，还是怕自己又不被选择”。这两个答案，不是一回事。`;
}

function getHealingPendingText(mode: HealingMode) {
  if (mode === 'reply') return '尼克大叔正在给你挑一句能发的...';
  if (mode === 'review') return '尼克大叔正在把现场倒回去看一遍...';
  if (mode === 'translate') return '尼克大叔正在拆这句话的暗线...';
  return '尼克大叔正在把这件事放平一点...';
}

/* ========================================
 *  主组件
 * ======================================== */
export function PracticePage({ pendingAction, onActionConsumed }: {
  pendingAction?: { type: 'openLevel' | 'openChapter'; mode?: 'story' | 'challenge'; chapterId?: number; levelIndex?: number } | null;
  onActionConsumed?: () => void;
}) {
  /* ---------- 状态管理 ---------- */
  const user = useUser();
  const { openProfile } = useProfileModal();
  const isNewUser = !user.xp && !user.achievements;
  const healingTier = getHealingTier(user);
  const healingTierLabel = getHealingTierLabel(healingTier);
  const healingEnergyLimit = getHealingEnergyLimit(healingTier);
  const entryPressTimerRef = useRef<number | null>(null);

  // 进入练习场自动打卡
  useEffect(() => { user.checkIn?.(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => {
    if (entryPressTimerRef.current) window.clearTimeout(entryPressTimerRef.current);
  }, []);
  const [practiceMode, setPracticeMode] = useState<'story' | 'challenge'>(() =>
    pendingAction ? (pendingAction.mode === 'challenge' ? 'challenge' : 'story') : 'story'
  ); // 关卡模式
  const [entryPressMode, setEntryPressMode] = useState<'story' | 'challenge' | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
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
  const [chatInputFocused, setChatInputFocused] = useState(false);  // 手机键盘弹出时用于压缩底部舞台
  const [chatKeyboardInset, setChatKeyboardInset] = useState(0);    // 软键盘覆盖高度（部分 WebView 不会自动缩 viewport）
  const [showChatHistory, setShowChatHistory] = useState(false);   // 沉浸式对话记录抽屉
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
  const [chatIsFinale, setChatIsFinale] = useState<boolean>(false);               // 当前关卡是否章节终章
  const [earlyFail, setEarlyFail] = useState<null | { affinity: number; tip: string; wrongTurn?: { userText: string; betterReply: string } }>(null); // 好感度<40提前结束的指导卡
  const [unlockLetter, setUnlockLetter] = useState<null | { partnerName: string; partnerImg: string; body: string[]; growth: string }>(null); // 通关解锁的角色信
  const [attemptBadge, setAttemptBadge] = useState<{ used: number; max: number; willGrantXP: boolean } | null>(null);
  const [deltaPopup, setDeltaPopup] = useState<{ val: number; id: number } | null>(null);
  const [summaryAbilityEvent, setSummaryAbilityEvent] = useState<AbilityEvent | null>(null);
  const [openingChoices, setOpeningChoices] = useState<string[]>([]);
  const [sceneHotspots, setSceneHotspots] = useState<SceneHotspot[]>([]);
  const [usedSceneHotspotIds, setUsedSceneHotspotIds] = useState<string[]>([]);
  const [activeSceneHint, setActiveSceneHint] = useState<SceneHotspot | null>(null);
  const [chatMicroReaction, setChatMicroReaction] = useState<string | null>(null);
  const [lastObservedHotspotId, setLastObservedHotspotId] = useState<string | null>(null);
  const [chatBreakEnding, setChatBreakEnding] = useState(false);
  /** 当前聊天的关卡散文式剧情简介（注入 system prompt，保证 AI 贴合关卡） */
  const [chatSceneSynopsis, setChatSceneSynopsis] = useState<string>('');
  /** 聊天消息滚动容器 ref —— 新消息自动滚到底部 */
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const sceneHintTimerRef = useRef<number | null>(null);
  const microReactionTimerRef = useRef<number | null>(null);
  /** 本局结束后 AI 教练点评（null=加载中；对象=生成完成） */
  const [coachReview, setCoachReview] = useState<{
    overall: string;
    strengths: string[];
    improvements: string[];
    betterLines?: string[];
  } | null>(null);
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
  const [showHealingModal, setShowHealingModal] = useState(false);
  const [healingMode, setHealingMode] = useState<HealingMode>('vent');
  const [healingInput, setHealingInput] = useState('');
  const [healingEnergy, setHealingEnergy] = useState(() => loadHealingEnergy((user as any).userId, healingEnergyLimit));
  const [healingSending, setHealingSending] = useState(false);
  const [healingMessages, setHealingMessages] = useState<HealingMessage[]>(() => loadHealingMessages((user as any).userId));
  const [showRelationshipLibrary, setShowRelationshipLibrary] = useState(false);
  const [relationshipProfiles, setRelationshipProfiles] = useState<RelationshipProfile[]>(() => loadRelationshipProfiles((user as any).userId));
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(() => loadSelectedRelationshipProfileId((user as any).userId, loadRelationshipProfiles((user as any).userId)));
  const [relationshipDraft, setRelationshipDraft] = useState<RelationshipDraft>(() => getDefaultRelationshipDraft());
  const [editingRelationshipId, setEditingRelationshipId] = useState<string | null>(null);
  const healingScrollRef = useRef<HTMLDivElement | null>(null);
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
  const [selectedMapLevel, setSelectedMapLevel] = useState<SelectedStoryMapLevel>(null);
  const cameFromHomeRef = useRef(!!pendingAction); // 是否从首页推荐进入
  // 已锁定的搭档（按小关卡 id 记录，进入该关直接使用）
  const [levelPartners, setLevelPartners] = useState<Record<number, { kid?: string; img: string; name: string; age: number; signature: string; traits: string[] }>>({});

  /* ---------- 聊天自动滚到底部（新消息或流式更新时） ---------- */
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
      });
    });
  }, [messages, showChat]);

  useEffect(() => {
    if (!showChat || !chatInputFocused) {
      setChatKeyboardInset(0);
      return;
    }

    const viewport = window.visualViewport;
    const updateKeyboardInset = () => {
      if (!viewport) {
        setChatKeyboardInset(0);
        return;
      }
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setChatKeyboardInset(inset > 80 ? Math.round(inset) : 0);
    };

    updateKeyboardInset();
    viewport?.addEventListener('resize', updateKeyboardInset);
    viewport?.addEventListener('scroll', updateKeyboardInset);
    window.addEventListener('resize', updateKeyboardInset);
    return () => {
      viewport?.removeEventListener('resize', updateKeyboardInset);
      viewport?.removeEventListener('scroll', updateKeyboardInset);
      window.removeEventListener('resize', updateKeyboardInset);
    };
  }, [showChat, chatInputFocused]);

  useEffect(() => () => {
    if (sceneHintTimerRef.current) window.clearTimeout(sceneHintTimerRef.current);
    if (microReactionTimerRef.current) window.clearTimeout(microReactionTimerRef.current);
  }, []);

  useEffect(() => {
    setHealingEnergy(loadHealingEnergy((user as any).userId, healingEnergyLimit));
  }, [healingEnergyLimit, (user as any).userId]);

  useEffect(() => {
    saveHealingEnergy((user as any).userId, healingEnergy, healingEnergyLimit);
  }, [healingEnergy, healingEnergyLimit, (user as any).userId]);

  useEffect(() => {
    setHealingMessages(loadHealingMessages((user as any).userId));
  }, [(user as any).userId]);

  useEffect(() => {
    saveHealingMessages((user as any).userId, healingMessages);
  }, [healingMessages, (user as any).userId]);

  useEffect(() => {
    const profiles = loadRelationshipProfiles((user as any).userId);
    setRelationshipProfiles(profiles);
    setSelectedRelationshipId(loadSelectedRelationshipProfileId((user as any).userId, profiles));
  }, [(user as any).userId]);

  useEffect(() => {
    saveRelationshipProfiles((user as any).userId, relationshipProfiles);
  }, [relationshipProfiles, (user as any).userId]);

  useEffect(() => {
    if (relationshipProfiles.length === 0 && selectedRelationshipId) {
      setSelectedRelationshipId(null);
      return;
    }
    if (selectedRelationshipId && !relationshipProfiles.some(profile => profile.id === selectedRelationshipId)) {
      setSelectedRelationshipId(relationshipProfiles[0]?.id || null);
    }
  }, [relationshipProfiles, selectedRelationshipId]);

  useEffect(() => {
    saveSelectedRelationshipProfileId((user as any).userId, selectedRelationshipId);
  }, [selectedRelationshipId, (user as any).userId]);

  useEffect(() => {
    const el = healingScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [healingMessages, showHealingModal]);


  /* ---------- 关卡列表计算 ---------- */
  const _storyLevels = isNewUser ? storyLevelsNew : storyLevels;
  const _challengeLevels = isNewUser ? challengeLevelsNew : challengeLevels;
  const currentLevels = practiceMode === 'story' ? _storyLevels : _challengeLevels;
  const currentGroups = practiceMode === 'story' ? storyChapters : challengeGroups;
  const userIsProForMaps = user.isVip || user.isPro();
  const activeGroup = expandedChapter == null ? null : currentGroups.find(group => group.id === expandedChapter) ?? currentGroups[0] ?? null;
  const activeGroupLevels = activeGroup ? currentLevels.filter(level => level.chapter === activeGroup.id) : [];
  const activeCompletedCount = activeGroupLevels.filter(level => level.completed).length;
  const featuredRecommendations = FEATURED_LEVELS.map(feature => {
    const level = _storyLevels.find(item => item.id === feature.id) ?? _storyLevels.find(item => !item.vip) ?? _storyLevels[0];
    if (!level) return null;
    return { ...feature, level };
  }).filter(Boolean) as Array<typeof FEATURED_LEVELS[number] & { level: typeof storyLevels[number] }>;
  const activeFeaturedIndex = featuredRecommendations.length ? featuredIndex % featuredRecommendations.length : 0;
  const activeFeatured = featuredRecommendations[activeFeaturedIndex] ?? null;

  const openEntryMap = (mode: 'story' | 'challenge') => {
    if (entryPressTimerRef.current) window.clearTimeout(entryPressTimerRef.current);
    setEntryPressMode(mode);
    entryPressTimerRef.current = window.setTimeout(() => {
      setSelectedMapLevel(null);
      setPracticeMode(mode);
      setExpandedChapter(mode === 'story' ? (storyChapters[0]?.id ?? 1) : (challengeGroups[0]?.id ?? 1));
      setEntryPressMode(null);
      entryPressTimerRef.current = null;
    }, 160);
  };

  const getMapNodeLabel = (level: typeof storyLevels[number]) => {
    const label = practiceMode === 'story' ? STORY_NODE_LABELS[level.id] : CHALLENGE_NODE_LABELS[level.id];
    if (label) return label;
    return compactStoryText(level.title, 5).replace('...', '');
  };

  const openLevelPreview = (level: typeof storyLevels[number], levelIndex: number) => {
    const isLocked = level.vip && !userIsProForMaps;
    if (isLocked) {
      setShowVIP(true);
      return;
    }
    setLevelImmersive({ chapterId: level.chapter, index: levelIndex });
  };

  useEffect(() => {
    setSelectedMapLevel(null);
  }, [practiceMode, expandedChapter]);

  useEffect(() => {
    if (featuredRecommendations.length <= 1) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredRecommendations.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [featuredRecommendations.length]);

  useEffect(() => {
    if (featuredIndex >= featuredRecommendations.length) setFeaturedIndex(0);
  }, [featuredIndex, featuredRecommendations.length]);

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
    // 每关独立的剧情简介：描述当前情况 + 你要做什么，一段自然散文（不带标签、不带节号）
    // id 1-30 剧情模式；id 101-130 人物邂逅
    const levelSynopsis: Record<number, string> = {
      // —— 第 1 章 · 初遇 ——
      1: '周末的午后，你躲雨拐进了一家藏在巷子里的咖啡馆。推门那一下，温暖的烘焙香和轻缓的爵士乐一起扑过来，吧台边一个低头浅笑的女孩抬眼看了你一眼。你们只是陌生人，但她的杯子里冒着热气，你的外套还在滴水——这就是开场。接下来这几分钟里，你要想办法让她愿意抬起头第二次：一句不冒昧的搭话、一点刚好的自然、一个她会想记住的你。',
      2: '电梯门在第 14 层合上，里面只有你们两个人。从这一层到她要按的那一层，大概只有三十秒。她按完楼层微微靠墙，手里拿着文件，看上去是刚开完会。你没有理由搭话，也没有必须沉默的理由。这三十秒里，你要做的是找到一个不突兀的切入点——不是搭讪，而是让这段电梯时间不那么尴尬地过去，甚至让她在出门的时候回头看一眼。',
      3: '书店靠里的角落，你伸手去拿一本旅行指南，指尖却碰到了另一只温热的手。她先缩回去，小声说了句"抱歉"，然后笑了。你们都想要同一本书，这个巧合足够开启一场对话。你的任务是接住这一瞬的默契——不是抢书，也不是客套地让给她，而是把这份"同好"的信号自然延伸成几句真正的交流，让她愿意在离开之前记下你推荐的另一本书。',
      4: '朋友的生日聚会上，声音、酒杯、笑声都在往中间挤。你端着杯子靠边站的时候，注意到角落沙发上有个人一直没起身，手机也没怎么看，只是安静地观察着热闹。你被她的"不合群"吸引了。走过去的距离不远，但一开口就可能打断她的独处。你的任务是以不打扰的方式坐下、以她能接住的方式说第一句话，让她觉得你不是社交目的，而是真的在跟她说话。',
      5: '你手指悬在发送键上已经两分钟了。对话框里写了又删了三版——她白天发了一条让你心动的动态，你想回应，又怕显得刻意。现在是晚上十一点，这条消息发不发、怎么发、发完要不要装作没事地下线，全在你手上。这一关没有对手坐在对面，只有你自己和屏幕。你要做的是找到那句既真诚又留有余地的话，让她明天看到的时候，嘴角会不自觉地扬一下。',
      6: '这已经是这个月第三次在同一家便利店遇到她了。前两次你们只是点头，这次她先笑了："好巧。"这座城市这么大，同一家店、同一个时段、同一个货架——这不再完全是巧合。你不需要再用"刚好路过"来掩饰什么了，但也还没熟到可以直接约她。你的任务是把这句"好巧"变成一段真正的对话，让下一次见面不再依赖巧合，而是因为你们都想。',
      // —— 第 2 章 · 破冰 ——
      7: '你在她桌上的手机壳上看到了你最爱的那支乐队的 logo——冷门到不会有人凑巧喜欢的那种。这个信号几乎是命运级别的礼物。但你要小心的不是"怎么开口"，而是"别把兴趣聊成科普"——别急着证明你懂得多，也别急着列出你看过的所有现场。你的任务是借这支乐队切入她真正喜欢的原因，让这次共鸣成为你们的第一个只属于彼此的梗。',
      8: '你们聊了两三轮之后，空气突然冷下来——她的回复变短了，眼神也开始飘。不是讨厌你，只是聊天进入了那种"不知道再说什么"的真空。你的任务是用一个恰到好处的自嘲或轻玩笑重启节奏，不能用力过猛（她会觉得你在表演），也不能假装没发生（气氛会冷到底）。能让她笑出来的那一下，就是你把这段关系从浅水区推进一步的机会。',
      9: '聊着聊着，话题从天气滑到电影，从电影滑到童年，现在你们已经在聊"你觉得人为什么会孤独"。她开始愿意讲她自己了，这是一个非常珍贵的信号。你要做的不是展示你对孤独这个话题的见解有多深，而是让她敢继续讲下去——少打断、多镜像、偶尔分享一点你自己的脆弱作为交换，让她感觉这场对话是安全的。',
      10: '她今天回复变慢了，有一条消息已读了三个小时没回。你开始忍不住点开对话框，编辑了又删。这里的陷阱是：你会想发"在忙吗"、"是不是我哪里说错了"、"你不理我就算了"——每一条都会把你推得更远。你的任务是学会这门手艺——有些等待是尊重，有些安静是节奏。在该等的时候等，比你追出去十条消息更有吸引力。',
      11: '对话只剩一个"嗯"字撑着，再没有新动作的话，今晚就断了。你脑子里闪过十几种接话方式，但每一种都显得刻意。你的任务是在这三秒里选出最轻的那一句——不是重启话题，而是轻轻挪一下话题的方向，给她一个"不用负责任地继续"的台阶。救场的关键不是聪明，是松弛。',
      12: '你们已经聊了大半个晚上，她准备走了。这一刻的告别方式会决定下一次见面的可能性——太客气她记不住，太直接会让她设防。她背对着你站起身，你有大概五秒钟做出一个恰好的收尾。你的任务不是说"下次再约"（那句话没人会当真），而是把今晚聊过的某个具体片段，自然地变成一个"下次要继续"的理由。',
      // —— 第 3 章 · 暧昧 ——
      13: '散场了，大家各自散向地铁口。你悄悄调整了路线，凑到她旁边："要不我送你？"这句话你在心里排练了一整天，现在它真的被说出口了。她没拒绝，也没马上答应，只是笑了一下："顺路吗？"你的任务是用这段"送她回家"的十五分钟，把白天攒起来的好感往前推一步——不是为了今晚发生什么，而是让她明天醒来的时候，还想再见到你。',
      14: '饭桌上你偷偷抬眼的时候，刚好撞上了她也在偷看你。两个人都愣了零点五秒，然后同时假装看别处。这一瞬的默契比任何话都重要。你的任务不是装作什么都没发生，也不是立刻表白，而是让这个"被抓到"成为你们之间心照不宣的第一个秘密——用一个恰到好处的微笑，或者一句带着温度的调侃，把刚才那一眼承认下来。',
      15: '你开始在每条消息前反复斟酌措辞——朋友之间不会这样。是发"哈哈哈"还是"笑死"，用不用那个表情包，结尾要不要加一句"晚安"，全成了有意识的选择。你的任务不是假装若无其事地回到朋友状态，而是学会让这些小心翼翼变成温度——让她从你措辞的变化里感觉到"这个人在乎我"，而不是"这个人有点奇怪"。',
      16: '"这周六有空吗？"四个字在输入框里待了一整天。你知道表面上这只是约饭，实际上这是你们之间第一次真正意义上的单独邀约。约成了是一个新篇章，约不成大概率会进入"朋友降温"。你的任务是把这次邀约包装得既真诚又有退路——给她一个具体到她想去的理由，也给她一个不用解释就能拒绝的空间。',
      17: '走在并排的人行道上，手背不经意地碰到了一下——你们都没说话，也都没躲开。这是一条几乎所有暧昧关系都会走到的分水岭。你的任务不是立刻牵手（那会太急），也不是假装没发生（那会前功尽弃），而是用接下来的两分钟，让这种"被允许的靠近"延续下去——聊天节奏放慢一点，眼神多一秒，让这一瞬变成你们之间公开的秘密。',
      18: '"你觉得我们算什么呢？"这个问题你在心里问过一百遍，今晚月亮太亮，第一百零一次你终于要说出口了。但这种话一旦说出口，就没有回头路。你的任务不是要一个答案，而是确认方向——用一种让她可以轻松接住、也可以温柔回避的方式问出这句话。她接下来的语气和眼神，会告诉你一切你需要知道的。',
      // —— 第 4 章 · 热恋 ——
      19: '第一次正式约会，你提前了四十分钟到，又在镜子前把衣领整理了第三次。她还没来，你的手心已经出汗了。越期待的见面越容易紧张，越紧张越容易把话说砸。你的任务不是假装很放松，而是把紧张本身变成一种可爱——承认自己等了很久、期待了很久，让她一进门就感觉到你的真心，而不是你准备了多久的台词。',
      20: '你没说"这是为你准备的"，只是把那包她上次说有点冷就想喝的热可可，随手放在外套口袋里带出来。遇到她的时候才掏出来："正好多买了一份。"你的任务是让这份"刚好"看起来真的刚好——有些心意越不张扬越有分量，你要的是她喝到第一口时那个小小的"咦，你怎么知道"。',
      21: '凌晨三点半，视频电话还没挂。你们都知道明天要上班，但谁也舍不得先说"睡吧"。她讲起了小时候一件从没跟任何人讲过的事，声音越来越轻。这种深夜对话是关系里稀有的珍贵时刻。你的任务不是接梗、不是讲自己更精彩的童年，而是在她讲完之后，用一句让她觉得"有人真的听到了我"的回应，接住那份信任。',
      22: '"我想说一件事，你听完再回答好不好。"你已经准备了一个星期了。音乐很轻，她看着你，耳边只剩自己的心跳。这不是一场演讲，也不是告白流程，而是把最近这段时间你真正想让她知道的那一件事，诚实地说出来。你的任务不是把话说得多漂亮，而是让她在你说完之后，知道你是认真的——无论她怎么回答，你都会稳稳地站在这里。',
      23: '这是第一次以"对象"的身份出现在她的朋友圈里。所有人都在观察你，她也会在意你给大家的第一印象。你的任务不是表演一个完美男友，而是松弛地做你自己——对她的朋友真诚地感兴趣，不抢话也不躲话，让她事后能骄傲地说："他就是这样的人。"',
      24: '"以后就是我们了。"这句话听起来很甜，背后其实是一整套重新协商的规则——从周末怎么安排，到要不要见家长，到钱怎么花。你的任务不是急着做保证（那些话太容易说），而是在这一刻让"我们"这个词真的成立——尊重她原本的生活节奏，带进你的，但不吞掉她的。',
      // —— 第 5 章 · 考验 ——
      25: '你们刚吵完架，门被重重地关上。十分钟过去了，谁也没先开口，但你听得见她在门那边的呼吸。这种时候最容易说错话——一句"是你先……"就能让事情翻倍恶化。你的任务不是赢这场争论，而是先放下赢的冲动，用一句让她愿意把门打开的话，打破僵局——哪怕只是一句"我刚才太凶了"。',
      26: '你在深圳，她在北京，屏幕那头她靠着床头，声音有点哑。2000 公里让日常的琐碎突然变成需要翻译的信号——她说"没事"可能真的没事，也可能是"你再问一句"。你的任务不是靠"多说想你"来填补距离，而是学会在看不到她表情的时候，依然能听懂她真正想说的话。',
      27: '你无意中滑到了她和另一个人的对话——你知道自己不该看下去，但手指已经停不下来。内容没有越界，却也没清白到可以装作没看见。你的任务不是立刻质问她，也不是压着假装没事，而是先处理好自己的情绪，再决定要不要、用什么方式把这件事摊开。信任一旦开口，怎么说比说什么更重要。',
      28: '"我以为你会理解。"这句话今天你们同时说了出来，然后两个人都沉默了。熟悉的人突然变得陌生，不是因为不爱，是因为你们都以为对方应该懂，而懒得再解释。你的任务是先停下"我都是为你好"的委屈，承认自己其实没说清楚——真正的理解不是凭空长出来的，是一遍一遍愿意重新说一次。',
      29: '同一个屋檐下，你们已经很久没有真正看着对方说话了。她刷她的手机，你看你的屏幕，电视开着没人在听。这种消耗不是争吵，是比争吵更危险的"平静"。你的任务是打破这种默契的冷——不是搞个大惊喜，而是放下手机，递一杯水过去，问一句"最近你过得怎么样"。',
      30: '今天没有节日，没有烟火，晚饭也很普通。她在沙发上看书，突然抬头问你"想吃水果吗"，你看着她发呆的样子笑了。这是最不戏剧的一幕，也是最难的一关——把日常过下去、把彼此继续当回事，比任何一次表白都难。你的任务不是制造一个惊天动地的瞬间，而是让她感觉到：就算什么都不做，你也愿意陪她这样待着。',
      // —— 人物邂逅 · 第 1 组 · 温柔的人 ——
      101: '图书馆的自习室，她坐在你斜对角已经三个小时了。刚才她起身的时候把借阅笔记递过来："你掉的？"你打开一看，第一页空白处画着一只毛茸茸的小猫——显然是她的。你的任务不是戳穿这个小把戏，而是用一种她也能接住的温柔，把这张纸条变成一个只有你们两个人知道的秘密。温柔的人最怕被大声揭穿，也最容易在细节里被打动。',
      102: '每天傍晚六点，隔壁窗户那边都会飘来同一首歌。你从第一天的好奇，到第三天开始跟着哼，到第七天你终于在楼下遇到了她——抱着一把吉他。她有点不好意思："吵到你了？"你的任务不是急着夸奖，而是让她知道这首歌对一个陌生人产生了温柔的意义——让她下次再弹的时候，不再觉得孤单。',
      103: '早上看天气预报说有雨，他多拿了一把伞。在地铁口把多的那把递给你的时候，他说得轻描淡写："反正也是顺手。"你的任务不是立刻还恩，也不是假装不在意，而是让这份"顺手"被好好承接下来——温柔的人给出去的善意如果没被看见，下一次他就不会再伸手了。',
      104: '你翻开他借你的那本诗集，一张去海边的车票飘了下来——日期是两年前。他没解释，也没躲闪，只是说："那是我最安静的一年。"你的任务不是追问往事，而是用一种不打探的方式让他知道，那段时光在你眼里不是怪异，是值得被理解的。温柔的人最不需要的是好奇，最需要的是被轻轻接住。',
      105: '球场边，他跑过来的第一件事不是擦汗，是把一瓶冰水递给你："你坐这里晒了一下午吧。"你完全没跟他说过你来了。你的任务不是装作若无其事，也不是立刻表白，而是让这瓶水值得他多跑这一趟——温柔的人会注意到所有人都忽略的细节，你要做的是让他知道这些细节被看见了。',
      106: '她端着杯子笑得有点得意："这杯是我请的，特调款，里面多加了一颗草莓。"她平时给所有客人调的都一样，只给你这杯多加了东西。你的任务不是直接夸她好看，而是用一种让她自己也开心的方式承认这份偏爱——温柔的人最幸福的时刻，是她的小心意被轻轻抓住的那一刻。',
      // —— 第 2 组 · 疏离的人 ——
      107: '她从来不跟同事说话，午休都戴着耳机。直到你在楼下花坛边看到她蹲下来，用很温柔的声音在哄一只流浪猫。她不是冷漠，她只是对人设了防。你的任务不是靠近那只猫顺便认识她（那太刻意了），而是让她知道你看到了她对猫的那一面，但绝对不会拿去当谈资——疏离的人最讨厌被"发现"，最愿意靠近不声张的人。',
      108: '开会的时候她一直冷静发言，毫无破绽。门关上之后，你路过走廊，听到她一个人靠着墙叹了一口气——那种从胸腔深处挤出来的、很疲惫的声音。你的任务不是立刻冲过去安慰她（她会立刻披回盔甲），而是假装没看见，但在她今晚回到工位的时候，留一杯温度刚好的咖啡——不留字条，不署名。',
      109: '她在黑板上写的那串公式你看不懂一半，但你看得懂她写字的节奏——快、流畅、带着快乐。她一个人在空教室里写了两个小时。你的任务不是夸她聪明（她听得多了），而是在一个不惊扰她的时机，用一句话让她知道你没在看公式，你在看一个热爱这件事的人——这对疏离的人来说，比任何赞美都重要。',
      110: '她桌边的垃圾桶里揉着六张画稿，每一张都很好，但她不满意。她对自己苛刻到让人心疼。你的任务不是说"我觉得挺好的"——那会让她觉得你不懂，而是从这六张里具体说出某一笔打动你的地方。疏离的人不需要敷衍的鼓励，需要的是真的看懂她的人。',
      111: '凌晨两点，他那边的灯还亮着。你点开他提交的代码，在某个函数下面发现一行注释——是一句只有你才会懂的玩笑话。他从来没在现实里跟你开过这个玩笑，但他把它藏在了代码里。你的任务不是立刻去问他，而是在下一次见面的时候，轻描淡写地接上那个玩笑——让他知道你看到了那行注释，但不戳破他的害羞。',
      112: '你在她相机里看到了 47 张你的照片——每一张都对焦清晰，光线讲究。她慌得满脸通红："我才不是故意拍你！"你的任务不是追问，也不是放大她的尴尬，而是用一句轻到她能躲开、又让她知道你感动了的话，把这 47 张照片变成你们之间的一个秘密。疏离的人一旦被理解，就会决定性地敞开。',
      // —— 第 3 组 · 闪耀的人 ——
      113: '派对上她认识所有人，跟每一个人碰杯都带着真诚的笑容。你站在角落，不觉得自己有什么理由被她注意到。但你看到她在跟最后一个人聊完之后，端着酒径直朝你走了过来。你的任务不是上来就想把她留下，而是成为这场派对里她想停下来喘口气的那个人——闪耀的人整晚都在被需要，她选你，是因为你不需要她闪耀。',
      114: '全场都被他的笑话逗笑了，只有你注意到他笑完之后有零点几秒眼神是空的。他演得太好，好到大家都以为他真的很开心。你的任务不是当众戳穿他（他会恨你），而是等人群散去，用一句只有他能听懂的话，让他知道你看见了那个不被喝彩的他。',
      115: '镜头前她是百万博主，发型妆容布光全都精致。镜头关掉的这一刻，她坐在出租屋的地板上吃着泡面，头发随便扎着。你的任务不是惊讶"原来你素颜也这么好看"——这句话她听烂了，而是让她知道，这个状态下的她，在你眼里跟镜头里的她同样值得被好好对待。',
      116: '"你第一次来这里吧？"他的热情几乎是一种职业本能，但每一句关心都准确得让人心动。你分不清是因为你特别，还是他对所有人都这样。你的任务是不被这份不确定拉走，把重点放在你自己的反馈——如果他的热情是发给所有人的，你要做的就是让你这份回应是他今天唯一那一份。',
      117: '喝到第三杯的时候，他说："大家都说第三杯酒的时候讲真心话。"这是一种邀请，但也是一种试探——你说多了显得轻率，说少了显得刻意。你的任务不是抢答一个让他惊艳的答案，而是用一段足够真实但不越界的自白，让他愿意把他的那一杯真心话也交出来。',
      118: '一整晚他递出去了十几张名片，每张都客套体面。临走时他递给你的那张，他没要回去。你的任务不是当场询问为什么，而是让那张名片在你手里不浪费——什么时候联系、以什么方式联系，直接决定了他是不是想把那张名片之外的故事也讲给你。',
      // —— 第 4 组 · 脆弱的人 ——
      119: '风吹过来一阵花瓣雨，大家都踩着走过去了，只有她蹲下来，一片一片把落花捧起来。她没有说话，但你能感觉到她对"被丢弃的东西"格外敏感。你的任务不是蹲下去帮她一起捡（那会放大她的孤独），而是站在她身边，让她知道她捡花这件事在你眼里不是奇怪，是温柔的证据。',
      120: '他刚才吼得整层楼都能听到，但他递纸巾过来的手是轻的——他不知道怎么表达关心，他只知道生气。你的任务不是评判他刚才的大嗓门，也不是立刻接过纸巾假装和好，而是让他知道：他刚才的生气你看到了，他现在的心疼你也看到了——脆弱的人最怕的不是吵架，是他心疼你的时候没人知道。',
      121: '你随口说了一句话，她突然安静下来，低头不看你——你不知道自己哪个词戳到了她。这种时候越解释越糟。你的任务不是追问"我是不是说错了"，而是先暂停你在说的事情，用一句温和的"你还好吗"给她一个不用解释的缓冲——脆弱的人需要的不是答案，是不被追问的空间。',
      122: '凌晨两点，她的电话打进来："我知道很晚了，但你现在能听我说几句吗？"你揉着眼睛坐起来，她的声音在发抖。你的任务不是问"怎么了"然后试图解决问题，而是先告诉她"我在听，你慢慢说"——凌晨两点打电话的人需要的从来不是建议，是一个愿意陪她醒着的人。',
      123: '她手腕上那条手链的风格，明显不是她自己会选的——太浮夸，配色也不是她平时的审美。但她一直戴着。你的任务不是问"这是谁送的"（那是雷区），而是在别的事情上让她感受到你对她真实审美的欣赏——让她慢慢意识到，有些东西她其实可以摘下来了。',
      124: '她把手机递给你看——"去还是不去？"聊天框里改了八遍的草稿，都是同一句话的不同版本。她不是拿不定主意，她是害怕自己的回应"不对"。你的任务不是替她选一个答案，而是让她相信：无论她发哪一版，对方如果真的在乎她，都会好好接住——脆弱的人需要的是"我可以不完美"的许可。',
      // —— 第 5 组 · 危险的人 ——
      125: '"我就随便问问。"她的每个问题单拎出来都没问题——你昨天跟谁吃饭、你的密码好记吗、你哥是不是比你有钱。但连起来像一张网。你的任务不是表现出警惕让她知道你看穿了，而是用温和但明确的边界把那些问题一个一个轻轻挡回去——对这一类人，靠近她需要先练会的是"不答"。',
      126: '已读那条蓝色小标记已经卡在屏幕上四十分钟了，她没有回。你清楚她在线，也清楚她看到了。你感觉自己正在被观察。你的任务不是发第二条"在吗"，也不是立刻撤回，而是先放下手机——搞清楚你的焦虑是因为她，还是因为你自己。她这种沉默是一种测试，主动权不能永远在她手上。',
      127: '每次刷她朋友圈都有新面孔。你不是她唯一的选择，你也从来没被承诺过唯一，但每次看到都会隐隐不舒服。你的任务不是逼她承诺什么，也不是假装自己不在意，而是诚实面对自己的感受——这种消耗你愿意承受多久，决定了你要不要继续留在这段关系里。',
      128: '你们约的时间是七点，她七点半还没到，也没消息。她终于出现的时候笑着说："我就想看看你会不会等我。"你的任务不是生气（她会说你小气），也不是笑着原谅（她下次会变本加厉），而是用一句轻但明确的话让她知道：等她你愿意，但"考验你"这件事不成立——不设边界的人会被不断试探。',
      129: '"你离开我什么都不是。"这句话今晚终于从她嘴里说出来了。之前的所有贬低都还带着包装，这一句已经撕下来了。你的任务不再是挽回，也不是吵赢——你的任务是认清这一刻：一个真正爱你的人不会用否定你的价值来留住你。接下来怎么走，决定了你会不会变成下一个"什么都不是"的受害者。',
      130: '她笑容的时机太恰当，关心的节奏太准确，每一句话都像量过尺寸。完美得让你开始怀疑：这是她，还是她演给你的她。你的任务不是立刻逃（可能是你多心了），也不是放下所有警觉（直觉一般不会骗人），而是用一些她演不出剧本的真实问题去试探——当光滑的镜面出现第一道裂缝，你就知道里面到底是什么了。',
    };
    const userIsPro = user.isVip || user.isPro();
    const chapters = chapterLevels.map((lv) => {
      const isLocked = lv.vip && !userIsPro;
      const partnerCandidates = isLocked ? undefined : getPartnerCandidates(lv.id, lv.chapter, lv.idxInChapter);
      const confirmedPartner = levelPartners[lv.id] ?? null;
      // 已锁定搭档则立绘使用它的图，否则使用默认 lv.image
      const immersiveImage = confirmedPartner?.img ?? lv.image;
      const levelCard = practiceMode === 'story' && lv.id >= 1 && lv.id <= STORY_LEVEL_COUNT ? getLevelCard(lv.id) : null;
      const synopsis = levelCard ? getStoryLevelSummary(levelCard, 220) : (levelSynopsis[lv.id] ?? lv.desc);
      const narrative = levelCard ? getStoryLevelSummary(levelCard, 86) : lv.desc;
      return {
        id: lv.id,
        name: lv.title,
        coverImage: immersiveImage,
        immersiveImage,
        narrative,
        synopsis,
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
    partner: { kid?: string; img: string; name: string; age: number; signature: string; traits: string[] } | null = null,
    opts?: { levelKid?: string | null; mode?: 'story' | 'challenge' | 'freestyle'; coverImage?: string | null; isFinale?: boolean; sceneSynopsis?: string },
  ) => {
    const resolvedPartner = partner ?? (opts?.mode === 'story' ? partnerCardToPartnerInfo('P001') : null);
    setChatTarget(dialogueKey);
    setChatTitle(title);
    setChatPartner(resolvedPartner);
    setChatCoverImg(opts?.coverImage ?? resolvedPartner?.img ?? null);
    setChatLevelKid(opts?.levelKid ?? null);
    setChatMode(opts?.mode ?? 'freestyle');
    setChatIsFinale(!!opts?.isFinale);
    setChatSceneSynopsis(opts?.sceneSynopsis ?? '');
    setChatMaxTurns(opts?.levelKid ? getMaxTurns(opts.levelKid) : 20);
    setChatMinTurnsGood(opts?.levelKid ? getMinTurnsForGoodEnding(opts.levelKid) : 8);
    setTurnsUsed(0);
    const initialAffinity = emptyAffinity();
    setAffinity(initialAffinity);
    setAffinityHistory([initialAffinity]);
    setHighlights([]);
    setRegrets([]);
    setRedflagHits(0);
    setDeltaPopup(null);
    setEarlyFail(null);
    setShowSummary(false);
    setCoachReview(null);
    setSummaryAbilityEvent(null);
    setShowChatHistory(false);
    setSceneHotspots(buildSceneHotspots(title, opts?.sceneSynopsis));
    setUsedSceneHotspotIds([]);
    setActiveSceneHint(null);
    setChatMicroReaction(null);
    setLastObservedHotspotId(null);
    setChatBreakEnding(false);
    if (sceneHintTimerRef.current) window.clearTimeout(sceneHintTimerRef.current);
    if (microReactionTimerRef.current) window.clearTimeout(microReactionTimerRef.current);

    // ---- 开场白 ----
    let initialMessages: { role: string; text: string }[] = [];
    const sceneSyn = opts?.sceneSynopsis ?? '';
    const levelIdNum = parseInt(dialogueKey, 10);
    const fixedOpen = !opts?.levelKid && Number.isFinite(levelIdNum) ? getFixedOpening(levelIdNum) : null;
    if (opts?.levelKid) {
      const opening = getOpening(opts.levelKid);
      if (opening.message) {
        initialMessages = [{ role: 'ai', text: opening.message }];
      }
      setOpeningChoices(opening.choices || []);
    } else if (fixedOpen) {
      // 关卡有预写开场白 → 进入即显示，无需等 AI 流
      initialMessages = [{ role: 'ai', text: fixedOpen }];
      setOpeningChoices([]);
    } else if (sceneSyn) {
      // 没有预写但有场景简介 → 生成一句泛化开场
      initialMessages = [{ role: 'ai', text: '（Ta 看到你，愣了一下，然后轻轻笑了）嗨。' }];
      setOpeningChoices([]);
    } else {
      setOpeningChoices([]);
    }
    if (initialMessages.length === 0) {
      initialMessages = aiDialogues[dialogueKey] || [
        { role: 'ai', text: '（你们终于坐下来了，对方看着你，等你先开口）' },
      ];
    }
    setMessages(initialMessages.map(msg => (
      msg.role === 'ai' ? { ...msg, text: stripRolePlayMarkers(msg.text) } : msg
    )));
    setShowChat(true);
    setActivePractice(null);
  };

  /** 清理 AI 回复中的动作/表情旁白（圆括号或方括号内容）——让对话更像真人 */
  const stripRolePlayMarkers = (text: string): string => {
    const cleaned = text
      .replace(/^(\s*[（(][^（）()]{0,120}[)）]\s*)+/g, '')
      .replace(/[（(][^（()）]*?(?:稍显|微笑|皱眉|点头|叹气|低头|抬头|思索|犹豫|停顿|沉默|略带|深呼吸|摇头|歪头|眯眼|看着|注视|摸|握|靠|侧|转身|眨眼|撇嘴|抿嘴|动作|表情|语气|神情|脸色|脸上|眼神|愣|笑|把|拿|放|收|翻|捏|盯|望)[^（()）]*?[)）]/g, '')
      .replace(/[\[【][^\[\]【】]*?(?:动作|旁白|内心|内心独白|stage)[^\[\]【】]*?[\]】]/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    const quotedLines = Array.from(cleaned.matchAll(/[“「](.*?)[”」]/g))
      .map(match => match[1].trim())
      .filter(Boolean);
    return quotedLines.length ? quotedLines.join('') : cleaned;
  };

  const detectConversationBreak = (reply: string): boolean => {
    const normalized = reply.replace(/\s+/g, '');
    if (!normalized) return false;
    return /(?:我先(?:走|回去|回家|离开)|我(?:要|想|还是)回去|我不想(?:聊|说|继续)|不想再(?:聊|说|继续)|今天(?:就)?到(?:这|这里)吧|先(?:这样|到这|到这里)吧|下次再说吧|改天再说吧|算了(?:吧)?|别(?:跟|追|送)了|别再说了|别说了|不用(?:送|解释)了|没什么好说|到此为止|让我一个人(?:待|静)|我想一个人(?:待|静)|冷静一下|我累了|我要走了|我走了)/.test(normalized);
  };

  /**
   * 发送消息 — 调用 DeepSeek 流式接口
   * 后端 /api/chat（vite 代理到 localhost:3001）
   */
  const abortRef = useRef<AbortController | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const chatRequestSeqRef = useRef(0);
  const clearTypingTimer = () => {
    if (typingTimerRef.current == null) return;
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  };
  const sendMessage = (overrideText?: string) => {
    const override = typeof overrideText === 'string' ? overrideText : undefined;
    const text = (override ?? chatInput).trim();
    if (!text) return;
    if (showSummary) return; // 已结束
    if (chatBreakEnding) return;

    const observedSceneHints = sceneHotspots
      .filter(spot => usedSceneHotspotIds.includes(spot.id))
      .map(spot => `${spot.label}：${spot.hint}`);
    const requestSeq = chatRequestSeqRef.current + 1;
    chatRequestSeqRef.current = requestSeq;
    clearTypingTimer();
    abortRef.current?.abort();
    abortRef.current = null;

    const userMsg = text;
    const nextMessages = [...messages, { role: 'user', text: userMsg }];
    const pendingMessages = [...nextMessages, { role: 'ai', text: '' }];
    setMessages(pendingMessages);
    if (!override) setChatInput('');
    setOpeningChoices([]); // 用户一旦开口就撤掉预设选项
    setTurnsUsed(t => t + 1);

    // 构造轻量 system prompt：只保留真实回复需要的上下文，评分由前端本地处理
    const sceneSystem = messages.find(m => m.role === 'system')?.text || '';
    const sceneHint = sceneSystem.replace(/^📍\s*场景：/, '').replace(/^🆘\s*/, '');
    const levelSceneBlock = chatLevelKid ? buildLevelScenePrompt(chatLevelKid) : '';

    // 搭档人设段
    let partnerBlock = '';
    if (chatPartner) {
      if (chatPartner.kid) {
        partnerBlock = buildRolePersonaPrompt(chatPartner.kid, resolveChapterFromLevelKid(chatLevelKid));
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

    const systemPrompt = [
      `你正在扮演恋爱练习场景中的对方，场景：${chatTitle || '自由练习'}。`,
      levelSceneBlock ? `【完整关卡剧情】\n${levelSceneBlock}` : '',
      sceneHint ? `当前开场/背景：${sceneHint}` : '',
      chatSceneSynopsis ? `封面剧情摘要：${chatSceneSynopsis.slice(0, 220)}` : '',
      observedSceneHints.length ? `玩家已观察到的场景细节：${observedSceneHints.join('；')}。你可以自然延续这些细节，但不要直接说“你观察到”。` : '',
      partnerBlock,
      `当前阶段：${stage}；好感=${mainAffinity(affinity)}。`,
      levelSceneBlock ? `必须严格读取并延续【完整关卡剧情】中的地点、冲突、人物状态、玩家目标和关键节拍，不要回到旧封面剧情或泛化搭讪场景。` : '',
      `如果角色已经明确想离开或结束对话，只用一句自然结束台词收住，不要开启新话题。`,
      `只输出角色本人会说的话，1-2句，短、自然、像微信聊天。不要动作旁白，不要括号，不要评分/建议/系统说明，不要 meta。`,
    ].filter(Boolean).join('\n\n');

    const buildLocalMeta = (input: string, reply: string): ChatMeta => {
      const raw = `${input}\n${reply}`;
      const positive = /谢谢|辛苦|理解|没事|慢慢|可以|当然|一起|陪|听|懂|喜欢|可爱|不错|对呀|好呀|你好/.test(raw);
      const negative = /滚|烦|闭嘴|幼稚|麻烦|神经|随便|无所谓|约炮|睡你|性感|身材|胸|腿|骚|色/.test(raw);
      const delta = negative ? -4 : positive ? 2 : 1;
      return {
        deltas: {
          heart: delta > 0 ? 1 : delta,
          trust: delta > 0 ? 1 : delta,
          mind: delta > 0 ? 0 : Math.min(0, delta + 1),
          spark: positive && !negative ? 1 : 0,
        },
        mood: negative ? '冷淡' : positive ? '放松' : '观察',
        inner_os: negative ? '这句话让我有点防备。' : positive ? '这个回应还挺自然的，可以继续聊。' : '先看看他接下来怎么说。',
        suggest_end: negative && turnsUsed + 1 >= chatMinTurnsGood,
      };
    };

    // API messages
    const apiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...nextMessages
        .filter(m => m.role !== 'system' && m.text.trim())
        .slice(-8)
        .map(m => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        })),
    ];

    let fullReply = '';
    let hasChunk = false;
    let streamSettled = false;
    const requestStartedAt = Date.now();
    const upsertAssistantReply = (message: { role: string; text: string; innerOS?: string; mood?: string; delta?: number }) => {
      if (requestSeq !== chatRequestSeqRef.current) return;
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'ai') {
          copy[copy.length - 1] = message;
        } else {
          copy.push(message);
        }
        return copy;
      });
    };
    const finishRealReply = (rawReply: string) => {
      if (requestSeq !== chatRequestSeqRef.current) return;
      clearTypingTimer();
      const finalText = stripRolePlayMarkers(rawReply).trim();
      const meta = buildLocalMeta(userMsg, finalText);
      const d = meta.deltas;
      const newAff = applyDelta(affinity, d);
      const deltaMain = mainAffinity(newAff) - mainAffinity(affinity);
      upsertAssistantReply({
        role: 'ai',
        text: finalText || '我在，刚刚有点卡。你再说一遍，我认真听。',
        innerOS: meta.inner_os,
        mood: meta.mood,
        delta: deltaMain,
      });
      setAffinity(newAff);
      setAffinityHistory(h => [...h, newAff]);

      if (deltaMain !== 0) {
        const id = Date.now();
        setDeltaPopup({ val: deltaMain, id });
        setTimeout(() => setDeltaPopup(p => (p && p.id === id ? null : p)), 1800);
      }
      const reaction = deltaMain >= 2
        ? `${chatPartner?.name || '她'}的语气明显松了一点。`
        : deltaMain <= -2
          ? `${chatPartner?.name || '她'}短暂避开了你的视线。`
          : lastObservedHotspotId
            ? `${chatPartner?.name || '她'}像是注意到你看见了那个细节。`
            : '';
      if (reaction) {
        setChatMicroReaction(reaction);
        if (microReactionTimerRef.current) window.clearTimeout(microReactionTimerRef.current);
        microReactionTimerRef.current = window.setTimeout(() => setChatMicroReaction(null), 2600);
      }
      setLastObservedHotspotId(null);

      const userTurn = nextMessages[nextMessages.length - 1]?.text || '';
      const snippet = (finalText || '').slice(0, 60);
      if (deltaMain >= 2) {
        setHighlights(h => [...h, { userText: userTurn, aiReply: snippet, deltaMain }].sort((a, b) => b.deltaMain - a.deltaMain).slice(0, 5));
      } else if (deltaMain <= -2) {
        setRegrets(r => [...r, { userText: userTurn, aiReply: snippet, deltaMain }].sort((a, b) => a.deltaMain - b.deltaMain).slice(0, 3));
        setRedflagHits(n => n + 1);
      }

      const hitMaxTurns = turnsUsed + 1 >= chatMaxTurns;
      const tooLow = mainAffinity(newAff) < 40 && turnsUsed + 1 >= 4;
      const aiSuggestEnd = !!meta.suggest_end && turnsUsed + 1 >= chatMinTurnsGood;
      const conversationBreak = detectConversationBreak(finalText);
      if (conversationBreak) {
        setChatBreakEnding(true);
        setOpeningChoices([]);
        setSceneHotspots([]);
        setChatInputFocused(false);
        setChatMicroReaction(`${chatPartner?.name || '她'}结束了这次对话。`);
        if (microReactionTimerRef.current) window.clearTimeout(microReactionTimerRef.current);
        setTimeout(() => finalizeChat(newAff), 850);
        return;
      }
      if (hitMaxTurns || tooLow || aiSuggestEnd) {
        if (tooLow && !hitMaxTurns && !aiSuggestEnd) {
          const worstTurn = [...regrets].sort((a, b) => a.deltaMain - b.deltaMain)[0];
          const tipText = mainAffinity(newAff) < 20
            ? '她已经很安静了——你的回复里带了评价、说教或压力，让她感受不到温柔。换个语气再试一次？'
            : '感觉稍微冷了点——好几次你跳过了她的情绪映射，直接给建议或换话题。先接住感觉，再说其他。';
          const better = worstTurn
            ? '下次你可以这么说：「听下来你也蛮累的，今天发生了什么了吗？」先让她不被评价，她才会开口。'
            : '下次试试先带一句共情，再追问一个开放的问题。';
          setEarlyFail({
            affinity: mainAffinity(newAff),
            tip: tipText,
            wrongTurn: worstTurn ? { userText: worstTurn.userText, betterReply: better } : undefined,
          });
        } else {
          setTimeout(() => finalizeChat(newAff), 600);
        }
      }
    };

    const revealFullReply = () => {
      const minTypingMs = Math.min(2000, Math.max(1250, 980 + userMsg.length * 20));
      const waitMs = Math.max(0, minTypingMs - (Date.now() - requestStartedAt));
      typingTimerRef.current = window.setTimeout(() => {
        if (requestSeq !== chatRequestSeqRef.current) return;
        typingTimerRef.current = null;
        finishRealReply(fullReply);
      }, waitMs);
    };

    const timeoutTimer = window.setTimeout(() => {
      if (requestSeq !== chatRequestSeqRef.current) return;
      if (streamSettled || hasChunk) return;
      streamSettled = true;
      abortRef.current?.abort();
      clearTypingTimer();
      upsertAssistantReply({ role: 'ai', text: '网络这下真的卡住了，点一下重试吧。' });
      abortRef.current = null;
    }, 12000);

    abortRef.current?.abort();
    abortRef.current = chatStream(
      apiMessages,
      (chunk) => {
        if (requestSeq !== chatRequestSeqRef.current) return;
        hasChunk = true;
        fullReply += chunk;
      },
      () => {
        if (requestSeq !== chatRequestSeqRef.current) return;
        if (streamSettled) return;
        streamSettled = true;
        window.clearTimeout(timeoutTimer);
        if (!fullReply.trim()) {
          finishRealReply('');
        } else {
          revealFullReply();
        }
        abortRef.current = null;
      },
      (err) => {
        if (requestSeq !== chatRequestSeqRef.current) return;
        if (streamSettled) return;
        streamSettled = true;
        window.clearTimeout(timeoutTimer);
        clearTypingTimer();
        upsertAssistantReply({ role: 'ai', text: `网络连接失败：${err.message}` });
        abortRef.current = null;
      },
      { model: 'deepseek-chat', temperature: 0.72, max_tokens: 120 }
    );
  };

  /** DEV 调试：预览结算页（精彩回放 / 踩雷回看 / 教练点评 / 金色信封） */
  const previewSummary = () => {
    const pName = chatPartner?.name || 'Ta';
    const synopsis = chatSceneSynopsis || '这是一个普通的夜晚，你们刚好撞见彼此。';
    // Mock scoring (符合 ScoringResult 类型)
    const mockScoring = {
      total: 88,
      star: 3 as 1 | 2 | 3,
      pass: true,
      ending: 'good' as 'perfect' | 'good' | 'neutral' | 'bad',
      dims: [
        { name: '共情', score: 90, weight: 0.3 },
        { name: '节奏', score: 85, weight: 0.25 },
        { name: '真诚', score: 92, weight: 0.25 },
        { name: '吸引力', score: 80, weight: 0.2 },
      ],
      aiSubjectiveAvg: 87,
      hardObjectiveAvg: 89,
    };
    (window as any).__foxsayLastScoring = mockScoring;

    // Mock highlights (3 条)
    setHighlights([
      { userText: '别急着说，先喝口热的。你脸都冻白了。', aiReply: '...（她愣了一下，把手缩回袖子里）嗯。谢谢。', deltaMain: 6 },
      { userText: '你刚才在看哪一排？我帮你一起找。', aiReply: '泡面那排……我永远分不清这些口味。', deltaMain: 4 },
      { userText: '那就别想工作了，今晚陪你把这包辣条吃完。', aiReply: '哈……你是不是很擅长让人放下手机。', deltaMain: 3 },
    ]);

    // Mock regrets (2 条)
    setRegrets([
      { userText: '你这么晚还不睡，身体会垮掉的。', aiReply: '……嗯，知道了。', deltaMain: -3 },
      { userText: '你这个问题其实很简单，我给你分析一下。', aiReply: '……哦。', deltaMain: -2 },
    ]);

    // Mock coach review
    setCoachReview({
      overall: `整体节奏挺稳的，你接住了她几次情绪小颤动，没有急着给建议，这在深夜场景里特别重要。`,
      strengths: [
        '第一句就注意到她的身体状态（冻白了），先照顾再说话',
        '愿意放下"说教欲"，陪她做一件没意义的小事（吃辣条）',
        '追问的方式是开放式的，不是审问',
      ],
      improvements: [
        '「你这么晚还不睡」这类带评价的关心会让她回一个"嗯"就结束',
        '遇到她吐槽工作时，先停三秒再回，别立刻进入"分析模式"',
      ],
      betterLines: [
        '比起说教，可以试：「那你现在最想要的是有人陪，还是有人闭嘴？」',
        '回应情绪时可以：「听起来今天真的很糟，我先把热饮递给你。」',
      ],
    });

    // 金色信封功能已下线（用户要求去掉）
    setUnlockLetter(null);

    setShowSummary(true);
  };

  /** 结算本次对话 */
  const finalizeChat = (finalAffinity: AffinityState) => {
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

    // 通关后解锁角色联系方式；人物邂逅仍保留原有好感累计。
    if (scoring.star >= 1 && chatPartner?.kid) {
      unlockRoleCard(chatPartner.kid);
    }
    if (scoring.star >= 1 && chatMode === 'challenge' && chatPartner?.kid) {
      persistOnEnd('challenge', chatPartner.kid, finalAffinity);
    }

    setShowSummary(true);

    // 保存 summary 到 ref 以供 UI 读取（已经用多个 state，直接组装渲染时读取即可）
    (window as any).__foxsayLastScoring = scoring;

    const xp = attemptBadge?.willGrantXP ? xpRewardForStar(scoring.star, chatMode === 'challenge' ? 'challenge' : 'story') : 0;
    const abilityEvent = buildAbilityEventFromLevel({
      userId: (user as any).userId,
      levelKid: chatLevelKid || 'L001',
      mode: chatMode,
      partnerKid: chatPartner?.kid ?? null,
      title: chatTitle,
      scoring,
      affinityStart: affinityHistory[0] || emptyAffinity(),
      affinityEnd: finalAffinity,
      xpGranted: xp,
    });
    setSummaryAbilityEvent(abilityEvent);
    if (hasAbilityDelta(abilityEvent)) {
      appendAbilityEvent((user as any).userId, abilityEvent);
      const nextAbilityScores = applyAbilityDelta((user as any).abilityScores, abilityEvent.deltas);
      user.updateUser?.({ abilityScores: nextAbilityScores });
    }

    // 给 XP
    if (xp > 0) {
      if (xp > 0) user.updateUser?.({ xp: (user.xp || 0) + xp });
    }

    // 终关解锁 → 角色写信功能已下线（用户要求去掉金色信封）
    // const letterGate = import.meta.env.DEV ? 1 : 2;
    // if (chatIsFinale && scoring.star >= letterGate && chatPartner?.name) { ... }

    // —— AI 教练点评（异步，不阻塞 UI）——
    (async () => {
      try {
        const convoText = messages
          .filter(m => m.role === 'user' || m.role === 'ai')
          .map(m => (m.role === 'user' ? `我：${m.text}` : `Ta：${m.text}`))
          .join('\n');
        const sysText = [
          `你是一个温柔、专业的恋爱沟通教练。刚才用户和一位 NPC 完成了一场角色扮演对话。`,
          `对话场景：${chatTitle}。${chatSceneSynopsis ? '关卡剧情：' + chatSceneSynopsis : ''}`,
          `本局数据：主好感 ${mainAffinity(affinityHistory[0] || emptyAffinity())} → ${mainAffinity(finalAffinity)}；共 ${turnsUsed} 轮；星级 ${scoring.star}/3；结局 ${scoring.ending}。`,
          `请基于下面完整对话，给出一份 150 字以内的复盘，要求：`,
          `1. overall：用 1-2 句真诚的整体点评，像朋友复盘一样，不客套。`,
          `2. strengths：列出 1-3 条用户做得好的沟通动作（具体到行为，不要空话）。`,
          `3. improvements：列出 1-3 条下次可以提升的点（具体可操作）。`,
          `4. betterLines：给 1-2 条更好的回复示例，就是换做用户，面对对方刚才最尴尬那一句，可以怎么回。`,
          `严格输出 JSON，不要任何多余说明：`,
          `{"overall":"...","strengths":["..."],"improvements":["..."],"betterLines":["..."]}`,
        ].join('\n');
        const userText = `完整对话：\n${convoText}`;
        const reply = await chatOnce(
          [
            { role: 'system', content: sysText },
            { role: 'user', content: userText },
          ],
          { model: 'deepseek-chat', temperature: 0.7 },
        );
        // 从 reply 中提取 JSON
        const m = reply.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('no json');
        const obj = JSON.parse(m[0]);
        setCoachReview({
          overall: String(obj.overall || ''),
          strengths: Array.isArray(obj.strengths) ? obj.strengths.map(String).slice(0, 3) : [],
          improvements: Array.isArray(obj.improvements) ? obj.improvements.map(String).slice(0, 3) : [],
          betterLines: Array.isArray(obj.betterLines) ? obj.betterLines.map(String).slice(0, 2) : [],
        });
      } catch (e) {
        console.warn('[coach review failed]', e);
        setCoachReview({ overall: '', strengths: [], improvements: [] });
      }
    })();
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

  const healingModes = HEALING_MODE_CONFIGS.map(mode => ({
    ...mode,
    locked: getHealingLockedLabel(mode, healingTier),
  }));
  const activeHealingMode = healingModes.find(mode => mode.id === healingMode) || healingModes[0];
  const canUseHealing = healingEnergy >= activeHealingMode.cost && !healingSending;
  const activeRelationshipProfile = relationshipProfiles.find(profile => profile.id === selectedRelationshipId) || null;

  const openHealingRoom = () => {
    setHealingMode('vent');
    setShowHealingModal(true);
  };

  const openRelationshipLibrary = () => {
    setShowRelationshipLibrary(true);
  };

  const updateRelationshipDraft = (key: keyof RelationshipDraft, value: string) => {
    setRelationshipDraft(prev => ({ ...prev, [key]: value }));
  };

  const beginEditRelationshipProfile = (profile: RelationshipProfile) => {
    setEditingRelationshipId(profile.id);
    setRelationshipDraft(getRelationshipDraftFromProfile(profile));
  };

  const cancelRelationshipEditing = () => {
    setEditingRelationshipId(null);
    setRelationshipDraft(getDefaultRelationshipDraft());
  };

  const saveRelationshipProfile = () => {
    const alias = relationshipDraft.alias.trim();
    if (!alias) return;
    const now = Date.now();
    const profileFields: RelationshipDraft = {
      alias: alias.slice(0, 18),
      stage: relationshipDraft.stage || RELATIONSHIP_STAGE_OPTIONS[1],
      goal: relationshipDraft.goal || RELATIONSHIP_GOAL_OPTIONS[0],
      traits: cleanRelationshipField(relationshipDraft.traits),
      likes: cleanRelationshipField(relationshipDraft.likes),
      dislikes: cleanRelationshipField(relationshipDraft.dislikes),
      communicationStyle: cleanRelationshipField(relationshipDraft.communicationStyle),
      topics: cleanRelationshipField(relationshipDraft.topics),
      boundaries: cleanRelationshipField(relationshipDraft.boundaries),
      notes: cleanRelationshipField(relationshipDraft.notes),
      lastEvent: cleanRelationshipField(relationshipDraft.lastEvent),
    };

    if (editingRelationshipId) {
      setRelationshipProfiles(prev => {
        const existingProfile = prev.find(profile => profile.id === editingRelationshipId);
        if (!existingProfile) return prev;
        const updatedProfile: RelationshipProfile = {
          ...existingProfile,
          ...profileFields,
          updatedAt: now,
        };
        return [
          updatedProfile,
          ...prev.filter(profile => profile.id !== editingRelationshipId && profile.alias !== updatedProfile.alias),
        ].slice(0, RELATIONSHIP_PROFILE_LIMIT);
      });
      setSelectedRelationshipId(editingRelationshipId);
    } else {
      const profile: RelationshipProfile = {
        id: `rel_${now}_${Math.random().toString(36).slice(2, 8)}`,
        ...profileFields,
        createdAt: now,
        updatedAt: now,
      };
      setRelationshipProfiles(prev => [profile, ...prev.filter(item => item.alias !== profile.alias)].slice(0, RELATIONSHIP_PROFILE_LIMIT));
      setSelectedRelationshipId(profile.id);
    }

    setRelationshipDraft(getDefaultRelationshipDraft());
    setEditingRelationshipId(null);
    setShowRelationshipLibrary(false);
  };

  const selectRelationshipProfile = (profileId: string | null) => {
    setSelectedRelationshipId(profileId);
    cancelRelationshipEditing();
    setShowRelationshipLibrary(false);
  };

  const deleteRelationshipProfile = (profileId: string) => {
    setRelationshipProfiles(prev => prev.filter(profile => profile.id !== profileId));
    setSelectedRelationshipId(prev => (prev === profileId ? null : prev));
    if (editingRelationshipId === profileId) cancelRelationshipEditing();
  };

  const touchRelationshipProfile = (profile: RelationshipProfile | null) => {
    if (!profile) return;
    const now = Date.now();
    setRelationshipProfiles(prev => prev.map(item => (
      item.id === profile.id
        ? { ...item, updatedAt: now }
        : item
    )).sort((leftProfile, rightProfile) => rightProfile.updatedAt - leftProfile.updatedAt));
  };

  const resetHealingChat = () => {
    clearHealingMessages((user as any).userId);
    setHealingMessages([HEALING_GREETING]);
    setHealingInput('');
  };

  const resetHealingEnergy = () => {
    setHealingEnergy(healingEnergyLimit);
  };

  const sendHealingMessage = async () => {
    const text = healingInput.trim();
    if (!text || !canUseHealing) return;
    const mode = healingMode;
    const modeConfig = activeHealingMode;
    const relationshipProfileForReply = activeRelationshipProfile;
    const history: ChatMessage[] = healingMessages
      .filter(message => !message.pending)
      .slice(-8)
      .map(message => ({
        role: message.role === 'user' ? 'user' : 'assistant',
        content: message.text,
      }));

    setHealingEnergy(prev => Math.max(0, prev - activeHealingMode.cost));
    touchRelationshipProfile(relationshipProfileForReply);
    setHealingSending(true);
    setHealingMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'fox', tag: '尼克大叔', text: getHealingPendingText(mode), pending: true },
    ]);
    setHealingInput('');

    let reply = '';
    let failed = false;
    try {
      const aiModel: 'deepseek-chat' | 'deepseek-reasoner' = mode === 'review' || mode === 'translate' ? 'deepseek-reasoner' : 'deepseek-chat';
      reply = await chatOnce([
        { role: 'system', content: buildHealingSystemPrompt(mode, relationshipProfileForReply) },
        ...history,
        { role: 'user', content: text },
      ], { model: aiModel, temperature: 0.55, max_tokens: 680 });
    } catch (err) {
      failed = true;
      console.warn('[HealingRoom] AI reply failed, using local fallback:', err);
    }

    const finalReply = cleanHealingReply(reply.trim()) || `网络刚刚有点慢，我先用本地方式接住你：${buildLocalHealingReply(mode, text)}`;
    setHealingMessages(prev => prev.map((message, index) => (
      index === prev.length - 1 && message.pending
        ? { ...message, text: finalReply, pending: false, error: failed }
        : message
    )));
    setHealingSending(false);
  };

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

  /* ========================================
   *  渲染
   * ======================================== */
  const chatVisibleMessages = messages.filter(m => m.role !== 'system');
  const chatLastAi = [...chatVisibleMessages].reverse().find(m => m.role === 'ai');
  const chatAiTyping = !!chatLastAi && !chatLastAi.text;
  const chatPortraitState = (chatLastAi?.delta ?? 0) > 0 ? 'happy' : (chatLastAi?.delta ?? 0) < 0 ? 'angry' : 'normal';
  const chatPortraitFallback = chatPartner?.img || chatCoverImg;
  const chatPortraitSrc = resolveImmersivePortrait(chatPartner?.kid, chatPortraitState) || chatPortraitFallback;
  const chatBackgroundFallback = chatCoverImg || chatPartner?.img || '/chapters/cover/story-1.jpg';
  const chatBackgroundSrc = resolveImmersiveBackground(chatLevelKid, chatMode) || chatBackgroundFallback;
  const chatPartnerRoleLabel = getPartnerRoleLabel(chatPartner);
  const availableSceneHotspots = sceneHotspots.filter(spot => !usedSceneHotspotIds.includes(spot.id));
  const currentSceneHotspot = availableSceneHotspots.length ? availableSceneHotspots[turnsUsed % availableSceneHotspots.length] : null;
  const showSceneHotspot = !chatInputFocused && !chatAiTyping && turnsUsed < 6 && !!currentSceneHotspot && !activeSceneHint;
  const handleSceneHotspot = (spot: SceneHotspot) => {
    setUsedSceneHotspotIds(prev => prev.includes(spot.id) ? prev : [...prev, spot.id]);
    setActiveSceneHint(spot);
    setLastObservedHotspotId(spot.id);
    if (sceneHintTimerRef.current) window.clearTimeout(sceneHintTimerRef.current);
    sceneHintTimerRef.current = window.setTimeout(() => setActiveSceneHint(null), 3600);
  };

  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">

        {/* ====== 背景渐变装饰 ====== */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.18) 0%, transparent 100%)',
        }} />

        {/* ====== 1. 页面标题 ====== */}
        {!activeGroup && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
        </motion.div>)}

        {/* ====== 2. 今日精选体验（三关轮播） ====== */}
        {!activeGroup && (<motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IcFire size={14} color="#FF8A80" />
              <span style={{ color: '#FF8A80', fontSize: 16, fontWeight: 800 }}>今日精选体验</span>
            </div>
            <button
              className="flex items-center gap-1"
              onClick={() => {
                setPracticeMode('story');
                setExpandedChapter(storyChapters[0]?.id ?? 1);
              }}
            >
              <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12 }}>三关轮播</span>
              <ChevronRight size={12} color="rgba(245,239,232,0.35)" strokeWidth={2} />
            </button>
          </div>

          {activeFeatured && (
            <div className="relative overflow-hidden" style={{ height: 256, borderRadius: 24, background: '#332b45', border: '1px solid rgba(245,239,232,0.1)', boxShadow: '0 18px 48px rgba(0,0,0,0.24)' }}>
              <AnimatePresence mode="wait">
                <motion.button
                  key={`featured-slide-${activeFeatured.level.id}`}
                  className="absolute inset-0 text-left overflow-hidden"
                  style={{ zIndex: 1 }}
                  initial={{ opacity: 0, scale: 1.035, x: 18 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.985, x: -18 }}
                  transition={{ duration: 0.42, ease: 'easeOut' }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    cameFromHomeRef.current = true;
                    openLevelPreview(activeFeatured.level, activeFeatured.level.idxInChapter);
                  }}
                >
                  <KenBurnsImage
                    src={activeFeatured.level.image}
                    alt={activeFeatured.level.title}
                    seed={activeFeatured.level.id * 13}
                    duration={16}
                    tilt
                    tiltStrength={3}
                    glow
                    glowColor={`${activeFeatured.accent}66`}
                    loading="eager"
                    imgStyle={{ filter: 'saturate(1.16) contrast(1.08) brightness(0.82)' }}
                  />
                  <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(23,20,32,0.92) 0%, rgba(23,20,32,0.58) 48%, rgba(23,20,32,0.24) 100%)' }} />
                  <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 18% 22%, ${activeFeatured.accent}4d 0%, transparent 32%), linear-gradient(140deg, rgba(255,255,255,0.13), transparent 38%)`, mixBlendMode: 'screen' }} />
                  <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, background: 'linear-gradient(180deg, transparent, rgba(30,25,42,0.96))' }} />

                  <div style={{ position: 'absolute', inset: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, padding: '6px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.34)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)' }}>{activeFeatured.tag}</span>
                        <span style={{ color: '#2b2535', fontSize: 11, fontWeight: 1000, padding: '6px 10px', borderRadius: 999, background: activeFeatured.accent }}>{activeFeatured.label}</span>
                      </div>
                      <span style={{ color: 'rgba(245,239,232,0.68)', fontSize: 12, fontWeight: 800 }}>{activeFeaturedIndex + 1}/{featuredRecommendations.length}</span>
                    </div>

                    <div style={{ maxWidth: 268 }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Compass size={13} color={activeFeatured.accent} strokeWidth={2.6} />
                        <span style={{ color: 'rgba(245,239,232,0.68)', fontSize: 11, fontWeight: 800 }}>第 {activeFeatured.level.chapter} 章 · 第 {activeFeatured.level.idxInChapter + 1} 节</span>
                      </div>
                      <h3 style={{ color: '#f5efe8', fontSize: 22, fontWeight: 1000, lineHeight: 1.18, marginBottom: 8, textShadow: '0 2px 12px rgba(0,0,0,0.32)' }}>{activeFeatured.level.title}</h3>
                      <p style={{ color: 'rgba(245,239,232,0.72)', fontSize: 12, lineHeight: 1.58, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {activeFeatured.level.desc}
                      </p>
                      <div className="inline-flex items-center gap-2" style={{ color: '#f5efe8', fontSize: 12, fontWeight: 900, padding: '8px 12px', borderRadius: 12, background: 'rgba(245,239,232,0.13)', border: '1px solid rgba(245,239,232,0.16)', backdropFilter: 'blur(10px)' }}>
                        <MapPin size={13} color={activeFeatured.accent} strokeWidth={2.5} />
                        进入这一关
                      </div>
                    </div>
                  </div>
                </motion.button>
              </AnimatePresence>

            </div>
          )}
        </motion.div>)}

        {/* ====== 3. 快速工具箱已迁至首页「妙妙工具」 ====== */}

        {/* ====== 5. 双入口 ====== */}
        {!activeGroup && (<motion.div
          className="relative overflow-hidden mb-4"
          style={{
            height: 232,
            borderRadius: 26,
            background: '#261f35',
            border: '1px solid rgba(245,239,232,0.13)',
            boxShadow: '0 22px 56px rgba(0,0,0,0.28)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <motion.button
            aria-label="进入我的故事"
            className="absolute text-left overflow-hidden"
            whileTap={{ scale: 0.982 }}
            whileHover={{ filter: 'brightness(1.06)' }}
            animate={{ scale: entryPressMode === 'story' ? 0.986 : 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{
              left: 0,
              top: 0,
              bottom: 0,
              width: '54%',
              zIndex: 2,
              padding: 0,
              clipPath: 'polygon(0 0, 100% 0, 86.5% 100%, 0 100%)',
              background: '#4f2538',
              boxShadow: 'inset 0 0 0 1px rgba(255,214,190,0.28), inset -28px 0 44px rgba(255,138,128,0.25)',
            }}
            onClick={() => openEntryMap('story')}
          >
            <img aria-hidden src={ENTRY_STORY_COVER} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '54% center', filter: 'saturate(1.12) contrast(1.05) brightness(0.82)', pointerEvents: 'none' }} />
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(83,34,55,0.76) 0%, rgba(83,34,55,0.36) 54%, rgba(255,138,128,0.26) 100%)' }} />
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,177,153,0.13) 0%, transparent 46%, rgba(30,22,36,0.28) 100%)' }} />
            <AnimatePresence>
              {entryPressMode === 'story' && (
                <>
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0.72, scale: 0.18 }}
                    animate={{ opacity: 0, scale: 1.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.42, ease: 'easeOut' }}
                    style={{ position: 'absolute', left: '50%', top: '54%', width: 174, height: 174, marginLeft: -87, marginTop: -87, borderRadius: 999, background: 'radial-gradient(circle, rgba(255,245,220,0.58) 0%, rgba(255,177,153,0.34) 34%, rgba(255,138,128,0.13) 54%, transparent 76%)', pointerEvents: 'none', zIndex: 1 }}
                  />
                </>
              )}
            </AnimatePresence>
            <div style={{ position: 'absolute', left: 18, bottom: 18, width: 158, zIndex: 2 }}>
              <div className="inline-flex items-center gap-1.5 mb-2" style={{ padding: '5px 9px', borderRadius: 999, background: 'rgba(63,31,48,0.66)', border: '1px solid rgba(255,214,190,0.3)', backdropFilter: 'blur(10px)' }}>
                <IcPen size={12} color="#FFD166" />
                <span style={{ color: '#FFE4C7', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>生活主线</span>
              </div>
              <h2 style={{ color: '#f5efe8', fontSize: 24, fontWeight: 1000, lineHeight: 1.08, margin: 0, textShadow: '0 3px 14px rgba(0,0,0,0.35)' }}>我的故事</h2>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ color: '#2b2535', fontSize: 11, fontWeight: 1000, padding: '5px 8px', borderRadius: 999, background: '#FFB199' }}>{_storyLevels.length} 关</span>
                {expandedChapter != null && practiceMode === 'story' && <span style={{ color: '#FFD166', fontSize: 11, fontWeight: 900 }}>已进入</span>}
              </div>
            </div>
          </motion.button>

          <motion.button
            aria-label="进入人物邂逅"
            className="absolute text-right overflow-hidden"
            whileTap={{ scale: 0.982 }}
            whileHover={{ filter: 'brightness(1.06)' }}
            animate={{ scale: entryPressMode === 'challenge' ? 0.986 : 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            style={{
              right: 0,
              top: 0,
              bottom: 0,
              width: '54%',
              zIndex: 2,
              padding: 0,
              clipPath: 'polygon(13.5% 0, 100% 0, 100% 100%, 0 100%)',
              background: '#18324a',
              boxShadow: 'inset 0 0 0 1px rgba(178,245,239,0.26), inset 28px 0 44px rgba(126,224,214,0.23)',
            }}
            onClick={() => openEntryMap('challenge')}
          >
            <img aria-hidden src={ENTRY_CHALLENGE_COVER} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '48% center', filter: 'saturate(1.1) contrast(1.04) brightness(0.78)', pointerEvents: 'none' }} />
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(20,45,67,0.78) 0%, rgba(20,45,67,0.38) 54%, rgba(126,224,214,0.24) 100%)' }} />
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(126,224,214,0.12) 0%, transparent 46%, rgba(18,24,35,0.35) 100%)' }} />
            <AnimatePresence>
              {entryPressMode === 'challenge' && (
                <>
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0.72, scale: 0.18 }}
                    animate={{ opacity: 0, scale: 1.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.42, ease: 'easeOut' }}
                    style={{ position: 'absolute', left: '50%', top: '54%', width: 174, height: 174, marginLeft: -87, marginTop: -87, borderRadius: 999, background: 'radial-gradient(circle, rgba(232,255,252,0.58) 0%, rgba(126,224,214,0.34) 34%, rgba(126,224,214,0.13) 54%, transparent 76%)', pointerEvents: 'none', zIndex: 1 }}
                  />
                </>
              )}
            </AnimatePresence>
            <div style={{ position: 'absolute', right: 18, bottom: 18, width: 162, zIndex: 2 }}>
              <div className="inline-flex items-center gap-1.5 mb-2" style={{ padding: '5px 9px', borderRadius: 999, background: 'rgba(18,45,59,0.68)', border: '1px solid rgba(178,245,239,0.27)', backdropFilter: 'blur(10px)' }}>
                <Users size={12} color="#7EE0D6" strokeWidth={2.5} />
                <span style={{ color: '#E5F8FF', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>实时邂逅</span>
              </div>
              <h2 style={{ color: '#f5efe8', fontSize: 24, fontWeight: 1000, lineHeight: 1.08, margin: 0, textShadow: '0 3px 14px rgba(0,0,0,0.35)' }}>人物邂逅</h2>
              <div className="flex items-center justify-end gap-2 mt-2">
                {expandedChapter != null && practiceMode === 'challenge' && <span style={{ color: '#7EE0D6', fontSize: 11, fontWeight: 900 }}>已进入</span>}
                <span style={{ color: '#192433', fontSize: 11, fontWeight: 1000, padding: '5px 8px', borderRadius: 999, background: '#7EE0D6' }}>{_challengeLevels.length} 关</span>
              </div>
            </div>
          </motion.button>
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', clipPath: 'polygon(52.72% 0, 53% 0, 47.28% 100%, 47% 100%)', background: 'linear-gradient(180deg, rgba(255,245,220,0.6), rgba(255,177,153,0.9) 42%, rgba(126,224,214,0.88))', filter: 'drop-shadow(0 0 3px rgba(255,177,153,0.45)) drop-shadow(0 0 3px rgba(126,224,214,0.36))' }} />
        </motion.div>)}

        {activeGroup && (
          <StoryMapView
            mode={practiceMode}
            activeGroup={activeGroup}
            groups={currentGroups}
            levels={activeGroupLevels}
            completedCount={activeCompletedCount}
            userIsPro={userIsProForMaps}
            selectedLevel={selectedMapLevel}
            getNodeLabel={getMapNodeLabel}
            onBack={() => {
              setSelectedMapLevel(null);
              setExpandedChapter(null);
            }}
            onOpenIntro={() => setImmersive({ mode: practiceMode, index: Math.max(0, currentGroups.findIndex(group => group.id === activeGroup.id)) })}
            onChangeGroup={(id) => {
              setSelectedMapLevel(null);
              setExpandedChapter(id);
            }}
            onSelectLevel={(level, index) => setSelectedMapLevel({ level, index })}
            onClearSelected={() => setSelectedMapLevel(null)}
            onEnterLevel={openLevelPreview}
          />
        )}

        <div style={{ height: 20 }} />

        {/* ====== 6. 尼克大叔的树洞 ====== */}
        {!activeGroup && (<div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IcHeartSpark size={14} color="#FFB6C1" />
              <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>尼克大叔的树洞</span>
              <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,138,128,0.15)', borderRadius: 4, color: '#FF8A80', fontSize: '9px', fontWeight: 700 }}>NEW</span>
            </div>
            <span style={{ color: 'rgba(245,239,232,0.42)', fontSize: '11px' }}>一直在</span>
          </div>

          {/* 情感陪护入口 */}
          <motion.div
            role="button"
            tabIndex={0}
            className="p-[1px] mb-4 overflow-hidden"
            style={{
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(255,203,156,0.46), rgba(255,182,193,0.34), rgba(126,224,214,0.22))',
              cursor: 'pointer',
            }}
            onClick={openHealingRoom}
            onPointerUp={openHealingRoom}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openHealingRoom();
              }
            }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="relative overflow-hidden p-5" style={{ background: 'linear-gradient(150deg, #40334f 0%, #332b3e 52%, #263a3d 100%)', borderRadius: 17 }}>
              <div aria-hidden style={{ position: 'absolute', right: -18, top: -18, width: 118, height: 118, borderRadius: 999, background: 'rgba(255,244,220,0.08)', border: '1px solid rgba(255,244,220,0.08)', pointerEvents: 'none' }} />
              <img aria-hidden src={NICK_AVATAR_SRC} onError={useNickAvatarFallback} alt="" style={{ position: 'absolute', right: 18, bottom: 18, width: 66, height: 66, borderRadius: 22, opacity: 0.2, pointerEvents: 'none' }} />

              <div style={{ position: 'relative' }}>
                <div className="flex items-center gap-3 mb-4">
                  <img src={NICK_AVATAR_SRC} onError={useNickAvatarFallback} alt="尼克大叔" style={{ width: 44, height: 44, borderRadius: 18, boxShadow: '0 14px 24px rgba(0,0,0,0.22)', objectFit: 'cover', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>尼克大叔在这里</div>
                    <div style={{ color: 'rgba(245,239,232,0.48)', fontSize: 11, marginTop: 2 }}>成熟一点，慢一点，陪你把话说完</div>
                  </div>
                </div>
                <h3 style={{ color: '#f5efe8', fontSize: '19px', fontWeight: 800, marginBottom: 8, lineHeight: 1.35 }}>
                  有些话不用整理好再说
                </h3>
                <p style={{ color: 'rgba(245,239,232,0.68)', fontSize: '13px', lineHeight: 1.7, marginBottom: 18, maxWidth: 300 }}>
                  你可以先把心事放在这里。尼克大叔会先听你说完，再陪你慢慢理清下一步。
                </p>

              <motion.div
                className="py-3 px-4 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(245,239,232,0.14)',
                  border: '1px solid rgba(245,239,232,0.12)',
                  borderRadius: 14, color: '#fff', fontSize: '14px', fontWeight: 800,
                  width: 'fit-content', minWidth: 132, position: 'relative', zIndex: 2, cursor: 'pointer', pointerEvents: 'auto',
                }}
                whileTap={{ scale: 0.98 }}
              >
                进去聊一会儿
                <ChevronRight size={15} color="#fff" strokeWidth={2.5} />
              </motion.div>
              </div>
            </div>
          </motion.div>

        </div>)}

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

      {/* ====== AI 对话全屏页（沉浸式剧情舞台） ====== */}
      <AnimatePresence>
        {showChat && (
          <motion.div className="fixed inset-0 z-[1000] flex flex-col"
            style={{
              background: '#17121f',
              color: '#f5efe8',
            }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>

            <div className="absolute inset-0 overflow-hidden">
              <img
                src={chatBackgroundSrc}
                alt=""
                className="w-full h-full"
                style={{ objectFit: 'cover', filter: 'saturate(1.02) contrast(1.02)' }}
                onError={e => useImageFallback(e, chatBackgroundFallback)}
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(180deg, rgba(12,9,18,0.32) 0%, rgba(12,9,18,0.08) 34%, rgba(12,9,18,0.72) 100%)',
              }} />
              <div className="absolute inset-x-0 bottom-0" style={{
                height: '42%',
                background: 'linear-gradient(180deg, rgba(23,18,31,0) 0%, rgba(23,18,31,0.86) 68%, #17121f 100%)',
              }} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
            {/* 顶部导航（沉浸式 HUD） */}
            <div style={{
              paddingTop: 'env(safe-area-inset-top, 32px)',
              background: 'linear-gradient(180deg, rgba(14,10,22,0.7), rgba(14,10,22,0))',
            }}>
              <div className="relative flex items-center justify-center px-4 h-12">
                <motion.button
                  className="absolute left-3 flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChat(false)}
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    background: 'rgba(0,0,0,0.28)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <ChevronLeft size={23} color="#f5efe8" />
                </motion.button>
                <div className="text-center" style={{ maxWidth: 230 }}>
                  <p style={{ color: '#f5efe8', fontSize: 15, fontWeight: 700, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chatTitle || '互动场景'}</p>
                  <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: 10, marginTop: 3 }}>{chatPartner?.name || '搭档'} · {chatMode === 'challenge' ? '人物邂逅' : chatMode === 'story' ? '剧情练习' : '自由练习'}</p>
                </div>
                <div className="absolute right-3 flex items-center gap-2">
                  <motion.button
                    className="flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChatHistory(true)}
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      background: 'rgba(0,0,0,0.28)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    aria-label="对话记录"
                  >
                    <Archive size={17} color="#f5efe8" />
                  </motion.button>
                {chatLevelKid && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => finalizeChat(affinity)}
                      style={{
                        height: 34, padding: '0 12px', borderRadius: 17,
                        background: 'rgba(236,64,122,0.88)',
                        color: '#fff', fontSize: 12, fontWeight: 700,
                      }}
                    >
                      结束
                    </motion.button>
                )}
                </div>
                {/* DEV 调试：预览结算页（精彩回放+踩雷回看+教练点评+金色信封） */}
                {import.meta.env.DEV && (
                  <motion.button
                    className="absolute right-24"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => previewSummary()}
                    style={{ color: '#FFD93D', fontSize: 12, fontWeight: 700 }}
                    title="DEV 预览结算"
                  >
                    预览
                  </motion.button>
                )}
              </div>
              {/* ---- 好感度 + 轮数条（所有聊天都显示，让用户能直观看到好感变化） ---- */}
              {(chatLevelKid || chatPartner) && (
                <div className="px-4 pb-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div style={{ color: '#FF8A80', fontSize: 11, fontWeight: 800, minWidth: 34 }}>♥ {mainAffinity(affinity)}</div>
                    <div className="relative flex-1" style={{ height: 6, background: 'rgba(255,255,255,0.16)', borderRadius: 3, overflow: 'visible' }}>
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
                              color: deltaPopup.val >= 0 ? '#FFD93D' : '#9CC7FF',
                              fontSize: 12, fontWeight: 800, pointerEvents: 'none',
                            }}
                          >
                            {deltaPopup.val >= 0 ? '+' : ''}{deltaPopup.val}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div style={{ color: 'rgba(245,239,232,0.68)', fontSize: 11, minWidth: 42, textAlign: 'right' }}>
                      {turnsUsed}/{chatMaxTurns}
                    </div>
                  </div>
                  {attemptBadge && (
                    <div className="mt-1 text-right" style={{ color: attemptBadge.willGrantXP ? '#95E1D3' : 'rgba(245,239,232,0.48)', fontSize: 10 }}>
                      {attemptBadge.willGrantXP ? `第 ${attemptBadge.used} 次 · 本次计 XP` : `第 ${attemptBadge.used}/${attemptBadge.max} 次 · 练习模式`}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative flex-1 min-h-0 overflow-hidden">
              <motion.div
                className="absolute inset-x-0 bottom-0 flex justify-center"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                style={{ height: '92%', pointerEvents: 'none' }}
              >
                {chatPortraitSrc ? (
                  <img
                    src={chatPortraitSrc}
                    alt={chatPartner?.name || '搭档'}
                    onError={e => useImageFallback(e, chatPortraitFallback)}
                    style={{
                      height: '108%',
                      maxWidth: '150%',
                      objectFit: 'contain',
                      objectPosition: 'center bottom',
                      filter: 'drop-shadow(0 28px 34px rgba(0,0,0,0.34))',
                    }}
                  />
                ) : (
                  <div style={{ width: 180, height: 180, alignSelf: 'center' }}>
                    <IconBubble size={180} bg={gradients.coral}><IcRobot size={72} color="#fff" /></IconBubble>
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {showSceneHotspot && currentSceneHotspot && (
                    <motion.button
                      key={currentSceneHotspot.id}
                      className="absolute z-20 flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.86, x: '-50%', y: '-50%' }}
                      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                      exit={{ opacity: 0, scale: 0.86, x: '-50%', y: '-50%' }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleSceneHotspot(currentSceneHotspot)}
                      style={{
                        left: currentSceneHotspot.x,
                        top: currentSceneHotspot.y,
                        padding: '6px 9px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.84)',
                        border: '1px solid rgba(255,255,255,0.72)',
                        color: '#251f30',
                        fontSize: 11,
                        fontWeight: 800,
                        boxShadow: '0 10px 26px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                      }}
                    >
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: '#EC407A',
                        boxShadow: '0 0 0 5px rgba(236,64,122,0.16)',
                      }} />
                      {currentSceneHotspot.label}
                    </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {activeSceneHint && (
                  <motion.div
                    key={activeSceneHint.id}
                    className="absolute left-4 right-4 z-30"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      top: 12,
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: 'rgba(22,17,30,0.76)',
                      color: '#f8f1ea',
                      fontSize: 12,
                      lineHeight: 1.55,
                      border: '1px solid rgba(255,255,255,0.14)',
                      boxShadow: '0 14px 34px rgba(0,0,0,0.28)',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                    }}
                  >
                    <span style={{ color: '#FFD93D', fontWeight: 800 }}>{activeSceneHint.label}</span>
                    <span style={{ color: 'rgba(248,241,234,0.82)' }}> · {activeSceneHint.hint}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {chatMicroReaction && (
                  <motion.div
                    key={chatMicroReaction}
                    className="absolute left-1/2 z-30"
                    initial={{ opacity: 0, y: 8, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 8, x: '-50%' }}
                    style={{
                      bottom: 12,
                      maxWidth: '82%',
                      padding: '7px 11px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.82)',
                      color: '#3a3144',
                      fontSize: 11,
                      fontWeight: 700,
                      boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chatMicroReaction}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div
              className="relative px-4 pb-3"
              style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom, 10px) + 12px)',
                transform: chatKeyboardInset ? `translateY(-${chatKeyboardInset}px)` : 'translateY(0)',
                transition: 'transform 180ms ease',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  borderRadius: 18,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,244,239,0.88))',
                  border: '1px solid rgba(255,255,255,0.65)',
                  boxShadow: '0 18px 44px rgba(0,0,0,0.28)',
                  overflow: 'hidden',
                }}
              >
                <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(30,24,40,0.08)' }}>
                  <div className="min-w-0">
                    <div style={{ color: '#251f30', fontSize: 15, fontWeight: 800 }}>{chatPartner?.name || 'Ta'}</div>
                    <p style={{ color: 'rgba(37,31,48,0.48)', fontSize: 10, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chatPartnerRoleLabel}
                    </p>
                  </div>
                  <div className="flex items-center justify-center" style={{ minWidth: 22, color: '#EC407A', fontSize: 18, fontWeight: 900 }}>
                    {chatAiTyping ? <TypingDots size={4} /> : '▾'}
                  </div>
                </div>
                <div style={{
                  minHeight: chatInputFocused ? 58 : 82,
                  maxHeight: chatInputFocused ? 88 : 128,
                  overflowY: 'auto',
                  padding: '12px 15px 14px',
                  color: '#251f30',
                  fontSize: 15,
                  lineHeight: 1.62,
                  whiteSpace: 'pre-wrap',
                }}>
                  {chatAiTyping ? (
                    <span className="inline-flex items-center" style={{ height: 24 }}>
                      <TypingDots size={7} color="rgba(236,64,122,0.82)" />
                    </span>
                  ) : (
                    chatLastAi?.text || '她看着你，像是在等你先开口。'
                  )}
                </div>
              </motion.div>

              {openingChoices.length > 0 && turnsUsed < 2 && !chatInputFocused && !chatBreakEnding && (
                <div className="mt-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {openingChoices.map((c, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(c)}
                      style={{
                        flexShrink: 0,
                        background: 'rgba(255,255,255,0.88)',
                        border: '1px solid rgba(255,138,128,0.45)',
                        color: '#B83F69',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '7px 12px',
                        borderRadius: 999,
                        maxWidth: 250,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-end gap-2" style={{
                padding: 8,
                borderRadius: 16,
                background: 'rgba(15,11,23,0.72)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
              }}>
                <textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onFocus={() => setChatInputFocused(true)}
                  onBlur={() => setChatInputFocused(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="输入你的回应..."
                  disabled={chatBreakEnding}
                  rows={1}
                  className="flex-1 outline-none resize-none"
                  style={{
                    minHeight: 40,
                    maxHeight: 74,
                    background: chatBreakEnding ? 'rgba(255,255,255,0.64)' : 'rgba(255,255,255,0.94)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    color: chatBreakEnding ? 'rgba(33,26,44,0.45)' : '#211a2c',
                    fontSize: 14,
                    lineHeight: 1.42,
                  }}
                />
                <motion.button
                  className="flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 40,
                    flexShrink: 0,
                    background: chatInput.trim() && !chatBreakEnding ? 'linear-gradient(135deg,#FF8A80,#EC407A)' : 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    borderRadius: 12,
                    boxShadow: chatInput.trim() && !chatBreakEnding ? '0 10px 22px rgba(236,64,122,0.32)' : 'none',
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => sendMessage()}
                  disabled={chatBreakEnding}
                  aria-label="发送"
                >
                  <Send size={17} />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showChatHistory && (
                <motion.div
                  className="absolute inset-0 z-20 flex items-end justify-center"
                  style={{ background: 'rgba(8,6,12,0.62)', backdropFilter: 'blur(6px)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowChatHistory(false)}
                >
                  <motion.div
                    className="w-full"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      maxWidth: 430,
                      maxHeight: '72vh',
                      background: '#261f33',
                      borderRadius: '20px 20px 0 0',
                      border: '1px solid rgba(255,255,255,0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 800 }}>对话记录</span>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowChatHistory(false)}>
                        <X size={20} color="rgba(245,239,232,0.62)" />
                      </motion.button>
                    </div>
                    <div ref={chatScrollRef} className="px-4 py-3 overflow-y-auto" style={{ maxHeight: 'calc(72vh - 54px)' }}>
                      {chatVisibleMessages.map((msg, i) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={i} className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div style={{
                              maxWidth: '82%',
                              padding: '9px 11px',
                              borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                              background: isUser ? 'rgba(255,138,128,0.92)' : 'rgba(255,255,255,0.08)',
                              color: isUser ? '#fff' : 'rgba(245,239,232,0.88)',
                              fontSize: 13,
                              lineHeight: 1.52,
                              whiteSpace: 'pre-wrap',
                            }}>
                              {msg.text || '...'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
                  abilityGained={0}
                  abilityEvent={summaryAbilityEvent}
                  ending={{ title: endingInfo.title || '对话结束', description: endingInfo.description || '' }}
                  highlights={highlights}
                  regrets={regrets}
                  coachReview={coachReview}
                  attemptInfo={attemptBadge ? { used: attemptBadge.used, max: attemptBadge.max, willGrantXPNext: false } : undefined}
                  onRetry={() => {
                    setShowSummary(false);
                    if (chatLevelKid) {
                      startChat(chatTarget, chatTitle, chatPartner, { levelKid: chatLevelKid, mode: chatMode, coverImage: chatCoverImg, isFinale: chatIsFinale });
                    } else {
                      setShowChat(false);
                    }
                  }}
                  onNext={() => { setShowSummary(false); setShowChat(false); }}
                  onClose={() => { setShowSummary(false); setShowChat(false); }}
                />
              );
            })()}

            {/* 好感度 <40 提前结束：指导卡 */}
            <AnimatePresence>
              {earlyFail && (
                <motion.div
                  className="fixed inset-0 z-[200] flex items-center justify-center"
                  style={{ background: 'rgba(20,16,28,0.82)', backdropFilter: 'blur(8px)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                    style={{
                      width: 'min(88vw, 360px)', padding: '22px 22px 18px',
                      borderRadius: 18,
                      background: 'linear-gradient(160deg, #2a2238 0%, #1a1524 100%)',
                      border: '1px solid rgba(255,138,128,0.35)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,138,128,0.15) inset',
                      color: '#f5efe8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF8A80, #FFB199)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                      }}>🥺</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>气氛冷下来了</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,138,128,0.9)', fontWeight: 600, marginTop: 2 }}>
                          当前好感度 {earlyFail.affinity} · 提前结束
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.7, margin: '6px 0 14px', color: 'rgba(245,239,232,0.85)' }}>
                      {earlyFail.tip}
                    </p>
                    {earlyFail.wrongTurn && (
                      <div style={{
                        padding: '10px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: 14,
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'rgba(255,138,128,0.85)', marginBottom: 4 }}>
                          你刚才说过
                        </div>
                        <p style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0, color: 'rgba(245,239,232,0.75)', fontStyle: 'italic' }}>
                          「{earlyFail.wrongTurn.userText.slice(0, 60)}」
                        </p>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: 'rgba(126,224,214,0.9)', marginBottom: 4 }}>
                          可以试试这样
                        </div>
                        <p style={{ fontSize: 12.5, lineHeight: 1.55, margin: 0, color: '#BFF3EE' }}>
                          {earlyFail.wrongTurn.betterReply}
                        </p>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEarlyFail(null);
                          if (chatLevelKid) {
                            startChat(chatTarget, chatTitle, chatPartner, { levelKid: chatLevelKid, mode: chatMode, coverImage: chatCoverImg, isFinale: chatIsFinale, sceneSynopsis: chatSceneSynopsis });
                          } else {
                            setShowChat(false);
                          }
                        }}
                        style={{
                          flex: 1, padding: '12px 0', borderRadius: 12,
                          background: 'linear-gradient(135deg, #FF8A80, #FFB199)',
                          color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 1,
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        再试一次
                      </button>
                      <button
                        onClick={() => { setEarlyFail(null); setShowChat(false); }}
                        style={{
                          flex: 1, padding: '12px 0', borderRadius: 12,
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(245,239,232,0.85)', fontSize: 14, fontWeight: 700, letterSpacing: 1,
                          border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer',
                        }}
                      >
                        先退出
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 通关解锁：角色给用户的信 */}
            <AnimatePresence>
              {unlockLetter && (
                <motion.div
                  className="fixed inset-0 z-[1200] flex items-center justify-center"
                  style={{ background: 'rgba(20,16,28,0.88)', backdropFilter: 'blur(10px)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <motion.div
                    initial={{ scale: 0.85, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    style={{
                      width: 'min(90vw, 400px)', maxHeight: '86vh', overflowY: 'auto',
                      padding: '26px 24px 22px',
                      borderRadius: 20,
                      background: 'linear-gradient(180deg, #fdf6e3 0%, #f5ead0 100%)',
                      border: '1px solid rgba(218,165,32,0.35)',
                      boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,220,150,0.25) inset',
                      color: '#3a2c1a',
                      fontFamily: '"PingFang SC", "Hiragino Sans GB", serif',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      {unlockLetter.partnerImg && (
                        <img src={unlockLetter.partnerImg} alt={unlockLetter.partnerName}
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(218,165,32,0.5)' }} />
                      )}
                      <div>
                        <div style={{ fontSize: 11, letterSpacing: 2, color: '#8a6c3a', fontWeight: 700 }}>一封信 · 来自</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#3a2c1a', marginTop: 2 }}>{unlockLetter.partnerName}</div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: 'rgba(138,108,58,0.3)', marginBottom: 14 }} />
                    {unlockLetter.body.map((p, i) => (
                      <p key={i} style={{
                        fontSize: 14, lineHeight: 2, margin: '0 0 10px',
                        color: i === unlockLetter.body.length - 1 ? '#8a6c3a' : '#3a2c1a',
                        textAlign: i === unlockLetter.body.length - 1 ? 'right' : 'left',
                        fontWeight: i === unlockLetter.body.length - 1 ? 700 : 400,
                        letterSpacing: 0.3,
                      }}>
                        {p}
                      </p>
                    ))}
                    <button
                      onClick={() => { setUnlockLetter(null); }}
                      style={{
                        width: '100%', marginTop: 10, padding: '12px 0', borderRadius: 12,
                        background: 'linear-gradient(135deg, #daa520, #c49326)',
                        color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 2,
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 6px 18px rgba(218,165,32,0.35)',
                      }}
                    >
                      我记住了
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== 尼克大叔的树洞弹窗 ====== */}
      {showHealingModal ? createPortal(
          <motion.div className="fixed inset-0 z-[1500] flex flex-col" style={{ background: '#efe7dc' }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <div style={{ paddingTop: 'env(safe-area-inset-top, 28px)', background: '#f7f1e8', borderBottom: '1px solid rgba(63,50,42,0.08)' }}>
              <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-3">
                  <img src={NICK_AVATAR_SRC} onError={useNickAvatarFallback} alt="尼克大叔" className="w-10 h-10" style={{ borderRadius: 14, objectFit: 'cover', boxShadow: '0 8px 18px rgba(80,58,40,0.16)', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ color: '#2f2825', fontSize: 16, fontWeight: 800, margin: 0 }}>尼克大叔</h3>
                    <p style={{ color: 'rgba(47,40,37,0.48)', fontSize: 11, margin: 0 }}>在，慢慢说</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={openRelationshipLibrary} className="px-2.5 py-1 flex items-center gap-1.5" style={{ borderRadius: 999, background: activeRelationshipProfile ? 'rgba(104,180,94,0.14)' : 'rgba(47,40,37,0.06)', color: activeRelationshipProfile ? '#3f6d36' : 'rgba(47,40,37,0.58)', fontSize: 11, fontWeight: 800, border: activeRelationshipProfile ? '1px solid rgba(82,129,70,0.20)' : '1px solid rgba(47,40,37,0.06)' }}>
                    <Archive size={13} />
                    {activeRelationshipProfile ? activeRelationshipProfile.alias : '档案库'}
                  </button>
                  <div className="px-2.5 py-1" style={{ borderRadius: 999, background: 'rgba(62,87,67,0.10)', color: '#4d6f45', fontSize: 11, fontWeight: 800 }}>
                    小灯 {healingEnergy}
                  </div>
                  <button onClick={() => setShowHealingModal(false)} className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: 12, background: 'rgba(47,40,37,0.06)' }}>
                    <X size={19} color="rgba(47,40,37,0.58)" />
                  </button>
                </div>
              </div>
            </div>

            <div ref={healingScrollRef} className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: 'touch', background: '#efe7dc' }}>
              <div className="mb-4 text-center">
                <span style={{ display: 'inline-block', padding: '5px 10px', borderRadius: 999, background: 'rgba(47,40,37,0.06)', color: 'rgba(47,40,37,0.45)', fontSize: 11 }}>
                  {activeHealingMode.desc}
                </span>
              </div>
              {activeRelationshipProfile && (
                <div className="mb-4 px-3 py-2" style={{ borderRadius: 16, background: 'rgba(104,180,94,0.10)', border: '1px solid rgba(82,129,70,0.16)' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: '#3f6d36', fontSize: 12, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        正在读取：{activeRelationshipProfile.alias}
                      </div>
                      <div style={{ color: 'rgba(47,40,37,0.52)', fontSize: 11, marginTop: 3 }}>
                        {activeRelationshipProfile.stage} · {activeRelationshipProfile.goal}
                      </div>
                    </div>
                    <button onClick={openRelationshipLibrary} style={{ flexShrink: 0, borderRadius: 999, padding: '5px 9px', background: '#fffaf2', color: '#5f774f', fontSize: 11, fontWeight: 800, border: '1px solid rgba(82,129,70,0.14)' }}>
                      换档案
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {healingMessages.map((message, index) => (
                  <div key={index} className="flex" style={{ justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 8 }}>
                    {message.role === 'fox' && (
                      <img src={NICK_AVATAR_SRC} onError={useNickAvatarFallback} alt="尼克大叔" className="flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 11, objectFit: 'cover', marginTop: 2 }} />
                    )}
                    <div style={{ maxWidth: '76%' }}>
                      <div style={{
                        padding: '10px 12px', borderRadius: message.role === 'user' ? '15px 15px 4px 15px' : '15px 15px 15px 4px',
                        background: message.role === 'user' ? '#a9df8f' : message.error ? '#fff0ec' : '#fffaf2',
                        color: '#2f2825', fontSize: 14, lineHeight: 1.62,
                        border: message.role === 'fox' ? `1px solid ${message.error ? 'rgba(219,91,69,0.18)' : 'rgba(47,40,37,0.06)'}` : '1px solid rgba(81,122,60,0.12)',
                        boxShadow: '0 4px 14px rgba(76,55,39,0.06)',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {message.pending ? (
                          <span className="flex items-center gap-2"><Loader2 size={13} color="rgba(47,40,37,0.62)" className="animate-spin" />{message.text}</span>
                        ) : message.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pt-3 pb-4" style={{ background: '#f7f1e8', borderTop: '1px solid rgba(63,50,42,0.08)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)' }}>
              {healingEnergy < activeHealingMode.cost && (
                <div className="mb-2 px-3 py-2" style={{ borderRadius: 12, background: 'rgba(190,118,76,0.10)', color: '#8a593f', fontSize: 12 }}>
                  今天先慢一点。等这盏小灯恢复后，尼克大叔还在。
                </div>
              )}
              <div className="mb-2 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex items-center gap-2" style={{ minWidth: 'max-content' }}>
                  <span style={{ color: 'rgba(47,40,37,0.38)', fontSize: 11, flexShrink: 0 }}>这句想让叔怎么陪你</span>
                  {healingModes.map(mode => {
                    const selected = healingMode === mode.id;
                    const ModeIcon = mode.icon;
                    return (
                      <button key={mode.id} type="button" className="px-2.5 py-1 flex items-center gap-1" style={{ borderRadius: 999, background: selected ? '#e0f1d4' : 'rgba(47,40,37,0.05)', border: selected ? '1px solid rgba(82,129,70,0.22)' : '1px solid rgba(47,40,37,0.06)', color: selected ? '#3f6d36' : 'rgba(47,40,37,0.54)', fontSize: 11, fontWeight: 800 }} onClick={() => setHealingMode(mode.id)}>
                        <ModeIcon size={12} strokeWidth={2.4} />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <button type="button" onClick={() => setHealingInput(prev => prev.trim() ? `${prev.trim()}\n\n${activeHealingMode.template}` : activeHealingMode.template)} disabled={healingSending}
                  style={{ color: '#5f774f', fontSize: 11, fontWeight: 900, opacity: healingSending ? 0.45 : 1 }}>
                  套个框架
                </button>
                {activeRelationshipProfile ? (
                  <span style={{ color: 'rgba(63,109,54,0.62)', fontSize: 10, fontWeight: 800 }}>读取 {activeRelationshipProfile.alias}</span>
                ) : (
                  <button type="button" onClick={openRelationshipLibrary} disabled={healingSending} style={{ color: 'rgba(47,40,37,0.38)', fontSize: 10, fontWeight: 800, opacity: healingSending ? 0.45 : 1 }}>
                    档案库
                  </button>
                )}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  value={healingInput}
                  onChange={e => setHealingInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendHealingMessage();
                    }
                  }}
                  placeholder={healingSending ? '尼克大叔正在听...' : activeHealingMode.placeholder}
                  disabled={healingSending}
                  rows={1}
                  className="flex-1 resize-none"
                  style={{ minHeight: 44, maxHeight: 112, borderRadius: 18, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 14, lineHeight: 1.5, padding: '11px 13px', outline: 'none' }}
                />
                <button className="w-11 h-11 flex items-center justify-center" disabled={!healingInput.trim() || !canUseHealing} onClick={sendHealingMessage}
                  style={{ borderRadius: 16, background: healingInput.trim() && canUseHealing ? '#68b45e' : 'rgba(47,40,37,0.10)', opacity: healingInput.trim() && canUseHealing ? 1 : 0.6 }}>
                  {healingSending ? <Loader2 size={18} color="#fff" className="animate-spin" /> : <Send size={18} color="#fff" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <button onClick={resetHealingChat} disabled={healingSending} style={{ color: 'rgba(47,40,37,0.42)', fontSize: 11, opacity: healingSending ? 0.45 : 1 }}>清空这场聊天</button>
                <span style={{ color: 'rgba(47,40,37,0.35)', fontSize: 10 }}>尼克大叔不能替代专业心理咨询</span>
              </div>
            </div>
          </motion.div>,
          document.body
        ) : null}

      {/* ====== 关系档案库 ====== */}
      {showRelationshipLibrary ? createPortal(
          <motion.div className="fixed inset-0 z-[1700] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(28,23,20,0.38)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full overflow-hidden" style={{ maxWidth: 440, maxHeight: '88vh', borderRadius: 24, background: '#f7f1e8', boxShadow: '0 24px 70px rgba(38,25,17,0.28)', border: '1px solid rgba(47,40,37,0.08)' }}
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(47,40,37,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: 14, background: 'rgba(104,180,94,0.14)' }}>
                    <Archive size={18} color="#4d6f45" />
                  </div>
                  <div>
                    <h3 style={{ color: '#2f2825', fontSize: 16, fontWeight: 900, margin: 0 }}>关系档案库</h3>
                    <p style={{ color: 'rgba(47,40,37,0.48)', fontSize: 11, margin: '2px 0 0' }}>选中后，尼克会带着这份背景跟你聊</p>
                  </div>
                </div>
                <button onClick={() => setShowRelationshipLibrary(false)} className="w-9 h-9 flex items-center justify-center" style={{ borderRadius: 12, background: 'rgba(47,40,37,0.06)' }}>
                  <X size={18} color="rgba(47,40,37,0.58)" />
                </button>
              </div>

              <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(88vh - 66px)', WebkitOverflowScrolling: 'touch' }}>
                {relationshipProfiles.length > 0 ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: 'rgba(47,40,37,0.48)', fontSize: 12, fontWeight: 800 }}>已有档案</span>
                      <button onClick={() => selectRelationshipProfile(null)} style={{ color: 'rgba(47,40,37,0.44)', fontSize: 11, fontWeight: 800 }}>
                        暂不绑定
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {relationshipProfiles.map(profile => {
                        const selected = profile.id === selectedRelationshipId;
                        return (
                          <div key={profile.id} className="p-3" style={{ borderRadius: 16, background: selected ? 'rgba(104,180,94,0.12)' : '#fffaf2', border: selected ? '1px solid rgba(82,129,70,0.22)' : '1px solid rgba(47,40,37,0.07)' }}>
                            <div className="flex items-start justify-between gap-3">
                              <div style={{ minWidth: 0 }}>
                                <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
                                  <span style={{ color: '#2f2825', fontSize: 14, fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.alias}</span>
                                  {selected && <CheckCircle2 size={14} color="#4d6f45" style={{ flexShrink: 0 }} />}
                                </div>
                                <div style={{ color: 'rgba(47,40,37,0.52)', fontSize: 11, marginTop: 4 }}>{profile.stage} · {profile.goal}</div>
                                {(profile.likes || profile.dislikes || profile.boundaries) && (
                                  <div className="flex flex-wrap gap-1.5" style={{ marginTop: 7 }}>
                                    {profile.likes && <span style={{ borderRadius: 999, padding: '3px 7px', background: 'rgba(104,180,94,0.10)', color: '#4d6f45', fontSize: 10, fontWeight: 800 }}>喜欢：{profile.likes}</span>}
                                    {profile.dislikes && <span style={{ borderRadius: 999, padding: '3px 7px', background: 'rgba(190,118,76,0.10)', color: '#8a593f', fontSize: 10, fontWeight: 800 }}>不喜欢：{profile.dislikes}</span>}
                                    {profile.boundaries && <span style={{ borderRadius: 999, padding: '3px 7px', background: 'rgba(219,91,69,0.08)', color: '#a65446', fontSize: 10, fontWeight: 800 }}>雷区：{profile.boundaries}</span>}
                                  </div>
                                )}
                                {profile.lastEvent && <div style={{ color: 'rgba(47,40,37,0.58)', fontSize: 12, marginTop: 7, lineHeight: 1.5 }}>最近：{profile.lastEvent}</div>}
                              </div>
                              <div className="flex items-center gap-1" style={{ flexShrink: 0 }}>
                                <button onClick={() => beginEditRelationshipProfile(profile)} className="px-2.5 py-1 flex items-center gap-1" style={{ borderRadius: 999, background: editingRelationshipId === profile.id ? '#e8f4dd' : 'rgba(47,40,37,0.06)', color: editingRelationshipId === profile.id ? '#3f6d36' : 'rgba(47,40,37,0.56)', fontSize: 11, fontWeight: 900 }}>
                                  <Pencil size={12} />
                                  编辑
                                </button>
                                <button onClick={() => selectRelationshipProfile(profile.id)} className="px-2.5 py-1" style={{ borderRadius: 999, background: selected ? '#dff1d6' : 'rgba(47,40,37,0.06)', color: selected ? '#3f6d36' : 'rgba(47,40,37,0.56)', fontSize: 11, fontWeight: 900 }}>
                                  {selected ? '已选' : '使用'}
                                </button>
                                <button onClick={() => deleteRelationshipProfile(profile.id)} className="w-8 h-8 flex items-center justify-center" style={{ borderRadius: 10, background: 'rgba(219,91,69,0.08)' }}>
                                  <Trash2 size={14} color="#b65d4e" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 px-4 py-5 text-center" style={{ borderRadius: 18, background: '#fffaf2', border: '1px dashed rgba(47,40,37,0.16)' }}>
                    <div style={{ color: '#2f2825', fontSize: 15, fontWeight: 900 }}>还没有关系档案</div>
                    <div style={{ color: 'rgba(47,40,37,0.52)', fontSize: 12, lineHeight: 1.6, marginTop: 6 }}>先给这个人起个代号，之后尼克就能记住你们这条线。</div>
                  </div>
                )}

                <div className="p-4" style={{ borderRadius: 18, background: 'rgba(47,40,37,0.04)', border: '1px solid rgba(47,40,37,0.06)' }}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {editingRelationshipId ? <Pencil size={16} color="#4d6f45" /> : <Plus size={16} color="#4d6f45" />}
                      <span style={{ color: '#2f2825', fontSize: 14, fontWeight: 900 }}>{editingRelationshipId ? '编辑关系档案' : '新建关系档案'}</span>
                    </div>
                    {editingRelationshipId && (
                      <button onClick={cancelRelationshipEditing} style={{ flexShrink: 0, color: 'rgba(47,40,37,0.46)', fontSize: 11, fontWeight: 800 }}>
                        取消编辑
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <input value={relationshipDraft.alias} onChange={event => updateRelationshipDraft('alias', event.target.value)} placeholder="给 TA 一个代号，比如 小夏 / 相亲对象 A" maxLength={18}
                      style={{ height: 42, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 14, padding: '0 12px', outline: 'none' }} />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={relationshipDraft.stage} onChange={event => updateRelationshipDraft('stage', event.target.value)} style={{ height: 40, borderRadius: 13, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, padding: '0 10px', outline: 'none' }}>
                        {RELATIONSHIP_STAGE_OPTIONS.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                      </select>
                      <select value={relationshipDraft.goal} onChange={event => updateRelationshipDraft('goal', event.target.value)} style={{ height: 40, borderRadius: 13, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, padding: '0 10px', outline: 'none' }}>
                        {RELATIONSHIP_GOAL_OPTIONS.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                      </select>
                    </div>
                    <textarea value={relationshipDraft.traits} onChange={event => updateRelationshipDraft('traits', event.target.value)} placeholder="TA 的性格/状态：慢热、边界感强、容易焦虑、很重视事业..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <textarea value={relationshipDraft.likes} onChange={event => updateRelationshipDraft('likes', event.target.value)} placeholder="TA 喜欢什么：猫、摄影、独处、被尊重边界..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                        style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                      <textarea value={relationshipDraft.dislikes} onChange={event => updateRelationshipDraft('dislikes', event.target.value)} placeholder="TA 不喜欢什么：催回复、说教、开过界玩笑..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                        style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    </div>
                    <textarea value={relationshipDraft.communicationStyle} onChange={event => updateRelationshipDraft('communicationStyle', event.target.value)} placeholder="沟通风格：回复慢但认真，讨厌连环追问，更吃轻松分享..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <textarea value={relationshipDraft.topics} onChange={event => updateRelationshipDraft('topics', event.target.value)} placeholder="可聊话题：咖啡店、旅行、电影、她最近的项目、共同朋友..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <textarea value={relationshipDraft.boundaries} onChange={event => updateRelationshipDraft('boundaries', event.target.value)} placeholder="雷区/边界：别查岗，别追问前任，别在她忙的时候连续发消息..." rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <textarea value={relationshipDraft.lastEvent} onChange={event => updateRelationshipDraft('lastEvent', event.target.value)} placeholder="你和 TA 最近发生了什么？比如：她两天没回，但刚刚点赞了你的朋友圈。" rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <textarea value={relationshipDraft.notes} onChange={event => updateRelationshipDraft('notes', event.target.value)} placeholder="补充备注：你最怕什么、你们目前卡在哪里、需要尼克特别记住的事。" rows={2} maxLength={RELATIONSHIP_TEXT_FIELD_LIMIT}
                      style={{ minHeight: 58, borderRadius: 14, border: '1px solid rgba(47,40,37,0.10)', background: '#fffaf2', color: '#2f2825', fontSize: 13, lineHeight: 1.5, padding: '10px 12px', outline: 'none', resize: 'none' }} />
                    <button onClick={saveRelationshipProfile} disabled={!relationshipDraft.alias.trim()} className="h-11 flex items-center justify-center gap-2" style={{ borderRadius: 15, background: relationshipDraft.alias.trim() ? '#68b45e' : 'rgba(47,40,37,0.10)', color: '#fff', fontSize: 14, fontWeight: 900, opacity: relationshipDraft.alias.trim() ? 1 : 0.6 }}>
                      {editingRelationshipId ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                      {editingRelationshipId ? '保存修改' : '新建并使用'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        ) : null}

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
            const synopsis = levelImmersiveData?.chapters.find(c => c.id === firstPlayable.id)?.synopsis || firstPlayable.desc || '';
            startChat(String(firstPlayable.id), firstPlayable.title, levelPartners[firstPlayable.id] ?? null, { levelKid: kid, mode: practiceMode, coverImage: firstPlayable.image || null, sceneSynopsis: synopsis });
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
            const sameChapterLevels = currentLevels.filter(item => item.chapter === lv.chapter);
            const isFinale = sameChapterLevels[sameChapterLevels.length - 1]?.id === lv.id;
            const synopsis = levelImmersiveData?.chapters.find(c => c.id === lv.id)?.synopsis || lv.desc || '';
            startChat(String(lv.id), lv.title, levelPartners[lv.id] ?? null, { levelKid: kid, mode: practiceMode, coverImage: lv.image || null, isFinale, sceneSynopsis: synopsis });
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
