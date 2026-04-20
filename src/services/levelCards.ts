/**
 * 关卡卡（Level Card）前端访问层
 * 数据源：src/data/level-cards.json（同步自 data/level-cards.json）
 */
import levelsJson from '../data/level-cards.json';

type AnyLevel = any;
const _levelsMap: Record<string, AnyLevel> = (levelsJson as any).levels || {};

/** 规范化 levelKid：可接受 'L001' 或 1（数字 id）*/
function normalizeKid(kidOrId: string | number): string {
  if (typeof kidOrId === 'number') return `L${String(kidOrId).padStart(3, '0')}`;
  if (/^\d+$/.test(kidOrId)) return `L${kidOrId.padStart(3, '0')}`;
  return kidOrId;
}

export function getLevelCard(kidOrId: string | number): AnyLevel | null {
  return _levelsMap[normalizeKid(kidOrId)] || null;
}

/** 取本关最大对话轮次（回合数，默认 20） */
export function getMaxTurns(kidOrId: string | number): number {
  const lv = getLevelCard(kidOrId);
  const t = lv?.dialogue?.max_turns;
  return typeof t === 'number' && t > 0 ? t : 20;
}

/** 取"触发 good ending 的最少轮次" */
export function getMinTurnsForGoodEnding(kidOrId: string | number): number {
  const lv = getLevelCard(kidOrId);
  const t = lv?.dialogue?.min_turns_for_good_ending;
  return typeof t === 'number' && t > 0 ? t : Math.max(6, Math.floor(getMaxTurns(kidOrId) * 0.6));
}

/** 取评分维度（默认 4 个） */
export function getScoringDims(kidOrId: string | number): { name: string; weight: number; description: string }[] {
  const lv = getLevelCard(kidOrId);
  const arr = lv?.scoring?.dimensions;
  if (Array.isArray(arr) && arr.length > 0) return arr;
  return [
    { name: '自然度', weight: 0.3, description: '对话是否自然不做作' },
    { name: '情商',   weight: 0.25, description: '是否读懂对方情绪与暗示' },
    { name: '吸引力', weight: 0.25, description: '是否展现了个人魅力' },
    { name: '分寸感', weight: 0.2, description: '知道什么时候进退' },
  ];
}

export function getPassScore(kidOrId: string | number): number {
  return getLevelCard(kidOrId)?.scoring?.pass_score ?? 60;
}

export function getPerfectThreshold(kidOrId: string | number): number {
  return getLevelCard(kidOrId)?.scoring?.perfect_score_threshold ?? 90;
}

export function getFailConditions(kidOrId: string | number): string[] {
  const arr = getLevelCard(kidOrId)?.scoring?.fail_conditions;
  return Array.isArray(arr) ? arr : [];
}

/** 取三档结局 */
export function getEndings(kidOrId: string | number): {
  good?: { title?: string; description?: string; reward?: string };
  neutral?: { title?: string; description?: string; reward?: string };
  bad?: { title?: string; description?: string; reward?: string };
} {
  return getLevelCard(kidOrId)?.endings || {};
}

/** 取开场 AI 消息 + 3 个预设选项 */
export function getOpening(kidOrId: string | number): { message: string; choices: string[] } {
  const lv = getLevelCard(kidOrId);
  return {
    message: lv?.dialogue?.opening_message || '',
    choices: Array.isArray(lv?.dialogue?.opening_choices) ? lv.dialogue.opening_choices : [],
  };
}

/**
 * 把关卡卡拍平成 "场景/剧情节点/NPC" 的 system prompt 段
 * 用于注入到 DeepSeek
 */
export function buildLevelScenePrompt(kidOrId: string | number): string {
  const lv = getLevelCard(kidOrId);
  if (!lv) return '';
  const world = lv.world || {};
  const scene = lv.scene || {};
  const node = lv.story_node || {};
  const chars = lv.characters || {};
  const player = chars.player_role || {};
  const dialogue = lv.dialogue || {};

  const lines: string[] = [];
  lines.push(`【关卡】${lv.meta?.title || '未命名'} · ${lv.meta?.chapter_name || ''}`);
  if (world.era || world.city || world.season) {
    lines.push(`【世界】${[world.era, world.city, world.season].filter(Boolean).join(' / ')}${world.tone ? ` · 语调：${world.tone}` : ''}`);
  }
  if (scene.location) lines.push(`【场景】${scene.location}（${scene.time_of_day || ''} / ${scene.weather || ''}）`);
  if (scene.atmosphere) lines.push(`- 氛围：${scene.atmosphere}`);
  if (scene.sensory_details?.visual) lines.push(`- 视觉：${scene.sensory_details.visual}`);
  if (scene.sensory_details?.audio)  lines.push(`- 声音：${scene.sensory_details.audio}`);
  if (scene.sensory_details?.smell)  lines.push(`- 气味：${scene.sensory_details.smell}`);
  if (Array.isArray(scene.props) && scene.props.length) lines.push(`- 场上物件：${scene.props.join('、')}`);

  if (node.premise) lines.push(`【剧情起点】${node.premise}`);
  if (node.player_objective) lines.push(`【玩家目标】${node.player_objective}`);
  if (node.narrative_arc) lines.push(`【叙事弧线】${node.narrative_arc}`);
  if (Array.isArray(node.key_plot_beats)) {
    lines.push(`【关键节拍】${node.key_plot_beats.join('；')}`);
  }

  if (Array.isArray(chars.npc_list)) {
    for (const npc of chars.npc_list) {
      lines.push(`【对话对象】${npc.role_in_this_level || ''}`);
      if (npc.current_mood) lines.push(`- 当前情绪：${npc.current_mood}`);
      if (npc.current_status) lines.push(`- 当前状态：${npc.current_status}`);
      if (npc.attitude_toward_player) lines.push(`- 对你的态度：${npc.attitude_toward_player}`);
      if (npc.this_level_special_behavior) lines.push(`- 本关特殊行为：${npc.this_level_special_behavior}`);
    }
  }

  if (player.identity) lines.push(`【玩家身份】${player.identity}`);
  if (player.player_knows) lines.push(`- 玩家知道：${player.player_knows}`);
  if (player.player_doesnt_know) lines.push(`- 玩家不知道：${player.player_doesnt_know}`);

  if (dialogue.system_narration_style) {
    lines.push(`【旁白风格】${dialogue.system_narration_style}`);
  }

  return lines.join('\n');
}
