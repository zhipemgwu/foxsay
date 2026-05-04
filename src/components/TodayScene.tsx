/**
 * 今日推荐 — 随机推荐具体关卡（精确到第几章第几节），沉浸式封面+一键跳转
 */
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, ChevronRight, BookOpen, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IcSparkle } from './CuteIcons';
import { getLevelCard } from '../services/levelCards';

/** 计算关卡实际封面（与 PracticePage buildLevels 一致） */
function getLevelImage(mode: 'story' | 'encounter', chapterId: number, levelIndex: number): string {
  if (mode === 'encounter') {
    // encounter: /chapters/encounter/encounter-01..30.png
    const idx = ((chapterId - 1) * 6 + levelIndex) % 30;
    return `/chapters/encounter/encounter-${String(idx + 1).padStart(2, '0')}.png`;
  }
  // story: /chapters/roles/role-01..37.jpg|png — 用稳定哈希
  const pool: string[] = [];
  for (let i = 1; i <= 36; i++) pool.push(`/chapters/roles/role-${String(i).padStart(2, '0')}.jpg`);
  pool.push('/chapters/roles/role-37.png');
  const h = (chapterId * 1000003) ^ (levelIndex * 2654435761) ^ (1 * 7919); // seed=1 for story
  return pool[Math.abs(h) % pool.length];
}

/* ── 剧情故事关卡池（从 level-cards.json 同步） ── */
const STORY_LEVEL_KIDS = Array.from({ length: 30 }, (_, i) => `L${String(i + 1).padStart(3, '0')}`);
const STORY_RECOMMENDATION_KIDS = ['L001', 'L003', 'L006', 'L010', 'L011', 'L016', 'L021', 'L027', 'L030'];
const STORY_TAGS: Record<number, string> = {
  1: '🔥 热门',
  2: '✨ 必练',
  3: '💫 暧昧',
  4: '❤️ 哄人',
  5: '🛡️ 现实',
  6: '⚠️ 边界',
  7: '🔥 爆点',
};

function compactNarrative(text: string, max = 46): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function storyLevelIndexInChapter(kid: string, chapterId: number): number {
  const idsInChapter = STORY_LEVEL_KIDS.filter(id => getLevelCard(id)?.meta?.chapter_id === chapterId);
  return Math.max(0, idsInChapter.indexOf(kid));
}

const storyLevelPool = STORY_RECOMMENDATION_KIDS.map((kid) => {
  const level = getLevelCard(kid);
  if (!level) return null;
  const chapterId = level.meta?.chapter_id || 1;
  const levelIndex = storyLevelIndexInChapter(kid, chapterId);
  const levelNumber = Number(kid.slice(1));
  const chapterName = String(level.meta?.chapter_name || '剧情故事').split('·')[0];
  return {
    chapterId,
    levelIndex,
    name: level.meta?.title || `第 ${levelNumber} 关`,
    narrative: compactNarrative(level.story_node?.premise || level.dialogue?.opening_message || ''),
    tag: STORY_TAGS[chapterId] || '✨ 推荐',
    chapter: `第 ${chapterId} 章 · 第 ${levelIndex + 1} 节`,
    chapterName,
    participants: 1800 + levelNumber * 137,
  };
}).filter(Boolean) as Array<{
  chapterId: number;
  levelIndex: number;
  name: string;
  narrative: string;
  tag: string;
  chapter: string;
  chapterName: string;
  participants: number;
}>;

/* ── 人物邂逅关卡池（具体到每一节） ── */
const encounterLevelPool = [
  { chapterId: 1, levelIndex: 0, name: '图书馆的小纸条', narrative: '她把笔记递过来的时候，你看到上面画了一只小猫', tag: '💕 治愈', chapter: '第 1 组 · 第 1 节', chapterName: '温柔的人', participants: 3620 },
  { chapterId: 1, levelIndex: 3, name: '诗集里夹着的车票', narrative: '他翻开书的时候，一张去海边的车票飘了下来', tag: '💕 治愈', chapter: '第 1 组 · 第 4 节', chapterName: '温柔的人', participants: 3280 },
  { chapterId: 2, levelIndex: 0, name: '她只跟猫说话', narrative: '你以为她不理任何人，直到你看到她蹲下来哄流浪猫', tag: '🧊 挑战', chapter: '第 2 组 · 第 1 节', chapterName: '疏离的人', participants: 2840 },
  { chapterId: 3, levelIndex: 1, name: '笑声背后的眼神', narrative: '全场都在笑，只有你注意到他笑完后眼神一闪而过的空', tag: '⭐ 人气', chapter: '第 3 组 · 第 2 节', chapterName: '闪耀的人', participants: 3200 },
  { chapterId: 3, levelIndex: 4, name: '第三杯酒的秘密', narrative: '"说吧，第三杯的时候大家都会讲真心话的。"', tag: '⭐ 人气', chapter: '第 3 组 · 第 5 节', chapterName: '闪耀的人', participants: 2960 },
  { chapterId: 4, levelIndex: 2, name: '那句没说完的话', narrative: '你不经意的一句话让空气突然安静了，她低头不看你', tag: '🌙 深度', chapter: '第 4 组 · 第 3 节', chapterName: '脆弱的人', participants: 1980 },
  { chapterId: 5, levelIndex: 0, name: '"我就随便问问"', narrative: '每句话都无辜，但你总觉得她在下一盘很大的棋', tag: '⚠️ 必修', chapter: '第 5 组 · 第 1 节', chapterName: '危险的人', participants: 2560 },
];

export interface PracticeAction {
  type: 'openLevel' | 'openChapter';
  mode: 'story' | 'challenge';
  chapterId: number;
  levelIndex?: number;  // 精确到第几节（0-based）
}

interface TodaySceneProps {
  onPracticeAction?: (action: PracticeAction) => void;
}

export function TodayScene({ onPracticeAction }: TodaySceneProps) {
  // 每天随机推荐 1 个剧情关卡 + 1 个邂逅关卡
  const picks = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const storyIdx = dayOfYear % storyLevelPool.length;
    const encounterIdx = (dayOfYear + 2) % encounterLevelPool.length;
    return [
      { ...storyLevelPool[storyIdx], type: 'story' as const, coverImage: getLevelImage('story', storyLevelPool[storyIdx].chapterId, storyLevelPool[storyIdx].levelIndex) },
      { ...encounterLevelPool[encounterIdx], type: 'encounter' as const, coverImage: getLevelImage('encounter', encounterLevelPool[encounterIdx].chapterId, encounterLevelPool[encounterIdx].levelIndex) },
    ];
  }, []);

  return (
    <div className="px-5 pb-2">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 600 }}>今日推荐</span>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <IcSparkle size={14} color="#FFD93D" />
          </motion.div>
        </div>
        <motion.button
          className="flex items-center gap-0.5"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const pick = picks[0];
            onPracticeAction?.({ type: 'openChapter', mode: pick.type === 'story' ? 'story' : 'challenge', chapterId: pick.chapterId });
          }}
        >
          <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 12 }}>查看全部</span>
          <ChevronRight size={14} color="rgba(245,239,232,0.35)" />
        </motion.button>
      </div>

      {/* 横向滚动推荐卡 */}
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {picks.map((item, idx) => (
          <motion.div
            key={`${item.type}-${item.chapterId}-${item.levelIndex}`}
            className="flex-shrink-0 relative overflow-hidden cursor-pointer"
            style={{ width: 280, borderRadius: 16 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPracticeAction?.({
              type: 'openLevel',
              mode: item.type === 'story' ? 'story' : 'challenge',
              chapterId: item.chapterId,
              levelIndex: item.levelIndex,
            })}
          >
            {/* 封面图 */}
            <div className="relative" style={{ height: 360 }}>
              <ImageWithFallback
                src={item.coverImage}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {/* 顶部渐变 */}
              <div className="absolute inset-x-0 top-0 pointer-events-none" style={{
                height: 100,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
              }} />
              {/* 底部渐变 */}
              <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{
                height: 200,
                background: 'linear-gradient(0deg, rgba(43,37,53,0.95) 0%, rgba(43,37,53,0.6) 50%, transparent 100%)',
              }} />

              {/* 标签 */}
              <div className="absolute top-3 left-3 px-2.5 py-1" style={{
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 20,
              }}>
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{item.tag}</span>
              </div>

              {/* 类型标签 */}
              <div className="absolute top-3 right-3 px-2 py-1 flex items-center gap-1" style={{
                background: item.type === 'story' ? 'rgba(255,138,128,0.8)' : 'rgba(155,126,222,0.8)',
                borderRadius: 20, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              }}>
                {item.type === 'story'
                  ? <BookOpen size={10} color="#fff" />
                  : <Heart size={10} color="#fff" fill="#fff" />}
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>
                  {item.type === 'story' ? '剧情故事' : '人物邂逅'}
                </span>
              </div>

              {/* 底部信息 */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, fontWeight: 500 }}>{item.chapter}</span>
                  <span style={{ color: 'rgba(245,239,232,0.25)' }}>·</span>
                  <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>{item.participants.toLocaleString()} 人在练</span>
                </div>
                <h3 style={{ color: '#f5efe8', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{item.name}</h3>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
                  "{item.narrative}"
                </p>
                <motion.div
                  className="w-full flex items-center justify-center gap-2 py-2.5"
                  style={{
                    background: item.type === 'story'
                      ? 'linear-gradient(135deg, #FF8A80 0%, #EC407A 100%)'
                      : 'linear-gradient(135deg, #9B7EDE 0%, #7C4DFF 100%)',
                    borderRadius: 12,
                    boxShadow: item.type === 'story'
                      ? '0 6px 20px rgba(236,64,122,0.35)'
                      : '0 6px 20px rgba(124,77,255,0.35)',
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Play size={14} color="#fff" fill="#fff" />
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>开始练习</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
