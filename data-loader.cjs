/**
 * FoxSay 数据加载器
 * 根据 KID 读取角色卡和关卡数据，拼装成 system prompt
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

/** 缓存 */
let _roles = null;
let _levels = null;

function loadRoles() {
  if (!_roles) {
    const raw = fs.readFileSync(path.join(DATA_DIR, 'role-cards.json'), 'utf-8');
    _roles = JSON.parse(raw).roles;
  }
  return _roles;
}

function loadLevels() {
  if (!_levels) {
    const raw = fs.readFileSync(path.join(DATA_DIR, 'level-cards.json'), 'utf-8');
    _levels = JSON.parse(raw).levels;
  }
  return _levels;
}

/** 热重载：开发时修改 JSON 后自动刷新缓存 */
function reloadAll() {
  _roles = null;
  _levels = null;
}

/** 根据 KID 获取角色卡 */
function getRole(kid) {
  const roles = loadRoles();
  return roles[kid] || null;
}

/** 根据 KID 获取关卡 */
function getLevel(kid) {
  const levels = loadLevels();
  return levels[kid] || null;
}

/** 列出所有角色 KID */
function listRoles() {
  return Object.keys(loadRoles()).filter(k => !k.startsWith('_'));
}

/** 列出所有关卡 KID */
function listLevels() {
  return Object.keys(loadLevels()).filter(k => !k.startsWith('_'));
}

/**
 * 根据关卡 KID 构建完整的 system prompt
 * 自动拉取关卡信息 + 关联角色卡
 */
function buildPromptForLevel(levelKid) {
  const level = getLevel(levelKid);
  if (!level) throw new Error(`关卡 ${levelKid} 不存在`);

  const parts = [];

  // ===== 1. 世界观 =====
  parts.push(`【世界观】`);
  parts.push(`时代: ${level.world.era}`);
  parts.push(`城市: ${level.world.city}`);
  parts.push(`季节: ${level.world.season}`);
  parts.push(`世界规则: ${level.world.world_rules}`);
  parts.push(`社会背景: ${level.world.social_context}`);
  parts.push(`整体基调: ${level.world.tone}`);
  parts.push('');

  // ===== 2. 场景 =====
  parts.push(`【当前场景】`);
  parts.push(`地点: ${level.scene.location}`);
  parts.push(`时间: ${level.scene.time_of_day}`);
  parts.push(`天气: ${level.scene.weather}`);
  parts.push(`氛围: ${level.scene.atmosphere}`);
  if (level.scene.sensory_details) {
    const s = level.scene.sensory_details;
    if (s.visual) parts.push(`视觉: ${s.visual}`);
    if (s.audio) parts.push(`听觉: ${s.audio}`);
    if (s.smell) parts.push(`嗅觉: ${s.smell}`);
    if (s.touch) parts.push(`触觉: ${s.touch}`);
  }
  if (level.scene.props?.length) {
    parts.push(`场景道具: ${level.scene.props.join('、')}`);
  }
  parts.push('');

  // ===== 3. 剧情节点 =====
  parts.push(`【剧情节点】`);
  parts.push(`前提: ${level.story_node.premise}`);
  parts.push(`玩家目标: ${level.story_node.player_objective}`);
  parts.push(`叙事弧线: ${level.story_node.narrative_arc}`);
  if (level.story_node.key_plot_beats?.length) {
    parts.push(`关键剧情节拍:`);
    level.story_node.key_plot_beats.forEach((b, i) => parts.push(`  ${i + 1}. ${b}`));
  }
  parts.push('');

  // ===== 4. 角色卡 =====
  const npcs = level.characters?.npc_list || [];
  for (const npc of npcs) {
    const role = getRole(npc.role_kid);
    if (!role) continue;

    parts.push(`【角色: ${role.core.name}】`);
    parts.push(`身份: ${role.core.identities.join('、')}`);
    parts.push(`年龄: ${role.core.age}岁  性别: ${role.core.gender === 'female' ? '女' : '男'}`);
    parts.push(`一句话概括: ${role.core.one_line_summary}`);
    parts.push('');

    // 背景
    parts.push(`成长经历: ${role.background.growth_experience}`);
    parts.push(`家庭背景: ${role.background.family_background}`);
    if (role.background.trauma_or_scar) {
      parts.push(`内心创伤: ${role.background.trauma_or_scar}`);
    }
    parts.push('');

    // 外貌
    parts.push(`外貌: ${role.appearance.overall_impression}`);
    parts.push(`身高${role.appearance.physique.height} 体重${role.appearance.physique.weight}`);
    parts.push(`发型: ${role.appearance.hair}`);
    parts.push('');

    // 性格
    parts.push(`核心性格: ${role.personality.core_traits.join('；')}`);
    parts.push(`表面性格: ${role.personality.surface_traits.join('；')}`);
    parts.push(`内在性格: ${role.personality.inner_traits.join('；')}`);
    parts.push(`气质: ${role.personality.temperament}`);
    parts.push(`最大恐惧: ${role.personality.biggest_fear}`);
    parts.push(`最大渴望: ${role.personality.biggest_desire}`);
    parts.push('');

    // 情绪触发
    if (role.emotional_triggers) {
      parts.push(`愤怒触发: ${role.emotional_triggers.anger_triggers.join('；')}`);
      parts.push(`心软触发: ${role.emotional_triggers.soft_triggers.join('；')}`);
      parts.push(`脆弱触发: ${role.emotional_triggers.vulnerability_triggers.join('；')}`);
      parts.push('');
    }

    // 说话风格
    parts.push(`说话风格: ${role.communication.speak_style}`);
    parts.push(`语气: ${role.communication.voice_tone}`);
    if (role.communication.common_phrases?.length) {
      parts.push(`口头禅: ${role.communication.common_phrases.join('、')}`);
    }
    if (role.communication.text_style) {
      parts.push(`文字风格: ${role.communication.text_style}`);
    }
    parts.push('');

    // 小动作
    if (role.habitual_mannerisms?.length) {
      parts.push(`习惯性小动作:`);
      role.habitual_mannerisms.forEach(m => parts.push(`  - ${m}`));
      parts.push('');
    }

    // 依恋风格（新字段）
    if (role.attachment_style) {
      const a = role.attachment_style;
      parts.push(`[依恋风格]`);
      if (a.type) parts.push(`类型: ${a.type}`);
      if (a.description) parts.push(`说明: ${a.description}`);
      if (a.in_conflict) parts.push(`冲突时: ${a.in_conflict}`);
      if (a.when_feeling_safe) parts.push(`有安全感时: ${a.when_feeling_safe}`);
      parts.push('');
    }

    // 爱的语言（新字段）
    if (role.love_language) {
      const l = role.love_language;
      parts.push(`[爱的语言]`);
      if (l.giving) parts.push(`给予方式: ${l.giving}`);
      if (l.receiving) parts.push(`需要接收: ${l.receiving}`);
      if (l.dealbreaker) parts.push(`绝对雷区: ${l.dealbreaker}`);
      parts.push('');
    }

    // 冲突模式（新字段）
    if (role.conflict_style) {
      const c = role.conflict_style;
      parts.push(`[冲突模式]`);
      if (c.pattern) parts.push(`应对模式: ${c.pattern}`);
      if (c.escalation_trigger) parts.push(`激化触发: ${c.escalation_trigger}`);
      if (c.resolution_key) parts.push(`和解关键: ${c.resolution_key}`);
      parts.push('');
    }

    // 吸引/排斥（新字段）
    if (role.attraction_triggers) {
      const t = role.attraction_triggers;
      if (t.attracted_by?.length) parts.push(`她会被吸引的特质: ${t.attracted_by.join('；')}`);
      if (t.repelled_by?.length) parts.push(`她绝对反感的特质: ${t.repelled_by.join('；')}`);
      parts.push('');
    }

    // 亲密递进 5 阶段（新字段） —— 关键：决定当前该以哪一阶段的态度回应
    if (role.intimacy_stages) {
      parts.push(`[亲密度 5 阶段递进参考]`);
      const s = role.intimacy_stages;
      if (s.stage_1) parts.push(`阶段1 陌生/试探: ${s.stage_1}`);
      if (s.stage_2) parts.push(`阶段2 开始留意: ${s.stage_2}`);
      if (s.stage_3) parts.push(`阶段3 真正兴趣: ${s.stage_3}`);
      if (s.stage_4) parts.push(`阶段4 放下防备: ${s.stage_4}`);
      if (s.stage_5) parts.push(`阶段5 真心投入: ${s.stage_5}`);
      parts.push(`⚠ 根据玩家进展的亲密度停留在对应阶段，不可跳级`);
      parts.push('');
    }

    // 本关卡特殊状态
    parts.push(`[本关状态]`);
    parts.push(`在本关的角色: ${npc.role_in_this_level}`);
    parts.push(`当前心情: ${npc.current_mood}`);
    parts.push(`当前状态: ${npc.current_status}`);
    parts.push(`对玩家的态度: ${npc.attitude_toward_player}`);
    if (npc.this_level_special_behavior) {
      parts.push(`本关特殊行为: ${npc.this_level_special_behavior}`);
    }
    parts.push('');

    // AI 指令
    if (role.ai_instruction) {
      if (role.ai_instruction.do?.length) {
        parts.push(`[角色扮演要求-DO]`);
        role.ai_instruction.do.forEach(d => parts.push(`  ✓ ${d}`));
      }
      if (role.ai_instruction.dont?.length) {
        parts.push(`[角色扮演要求-DONT]`);
        role.ai_instruction.dont.forEach(d => parts.push(`  ✗ ${d}`));
      }
      parts.push('');
    }
  }

  // ===== 5. 玩家角色 =====
  if (level.characters?.player_role) {
    const pr = level.characters.player_role;
    parts.push(`【玩家角色】`);
    parts.push(`身份: ${pr.identity}`);
    parts.push(`玩家知道的: ${pr.player_knows}`);
    parts.push(`玩家不知道的: ${pr.player_doesnt_know}`);
    parts.push('');
  }

  // ===== 6. 对话控制 =====
  parts.push(`【对话规则】`);
  parts.push(`叙述风格: ${level.dialogue.system_narration_style}`);
  parts.push(`每次回复控制在 2-5 句话，像真人聊天一样自然。`);
  parts.push(`你扮演场景中的 NPC 角色，同时负责旁白描写。`);
  parts.push(`用「」包裹角色的对话，用叙述文字描写动作和心理。`);
  parts.push(`不要替玩家做决定或说话。`);

  return parts.join('\n');
}

module.exports = {
  getRole,
  getLevel,
  listRoles,
  listLevels,
  buildPromptForLevel,
  reloadAll,
};
