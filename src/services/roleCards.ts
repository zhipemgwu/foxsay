/**
 * 角色卡（Role Card）前端访问层
 * ------------------------------------------
 * 数据源：src/data/role-cards.json（从 data/role-cards.json 同步而来）
 * 对外暴露：
 *   - getRoleCard(kid)         按 KID 取完整角色卡
 *   - getAllRoleKids()         列出所有 R001..RNNN
 *   - roleCardToPartnerInfo()  把角色卡转成 ChapterImmersiveView 使用的 PartnerInfo
 *   - buildRolePersonaPrompt() 把角色卡拍平成适合注入到 chat system prompt 的文本
 *   - getRoleImage(kid)        按 KID 拿到立绘图片路径（/chapters/roles/role-NN.jpg）
 * ------------------------------------------
 */

import rolesJson from '../data/role-cards.json';
import partnersJson from '../data/partner-cards.json';

// JSON 结构松散，这里用 any 描述
type AnyRole = any;
const _rolesMap: Record<string, AnyRole> = (rolesJson as any).roles || {};
const _allKids: string[] = Object.keys(_rolesMap).filter(k => !k.startsWith('_'));
const _partnersMap: Record<string, AnyRole> = (partnersJson as any).partners || {};
const _allPartnerKids: string[] = Object.keys(_partnersMap).filter(k => !k.startsWith('_'));

const COMPLIANCE_RULE = '中国大陆上线合规底线：允许暧昧、心动、拉扯和恋爱张力，但绝对禁止色情、露骨性描写、性器官/性行为描写、未成年人性化、诱导线下越界、骚扰、胁迫或无视拒绝。遇到用户越界时，角色必须自然降温、转移话题或明确拒绝，并把互动拉回健康恋爱沟通训练。';

/** 取出完整角色卡 */
export function getRoleCard(kid: string): AnyRole | null {
  return _rolesMap[kid] || null;
}

/** 取出完整搭档卡 */
export function getPartnerCard(kid: string): AnyRole | null {
  return _partnersMap[kid] || null;
}

/** 所有角色 KID（按定义顺序） */
export function getAllRoleKids(): string[] {
  return _allKids.slice();
}

/** 所有固定搭档 KID（P001..P005） */
export function getAllPartnerKids(): string[] {
  return _allPartnerKids.slice();
}

/**
 * 按 KID 推导立绘图片路径
 * R001 -> /chapters/roles/role-01.jpg
 * R030 -> /chapters/roles/role-30.jpg
 */
export function getRoleImage(kid: string): string {
  const partner = getPartnerCard(kid);
  if (partner?.core?.image) return partner.core.image;
  const m = /^R(\d+)$/.exec(kid);
  const n = m ? parseInt(m[1], 10) : 1;
  const padded = String(n).padStart(2, '0');
  return `/chapters/roles/role-${padded}.jpg`;
}

/** 把搭档卡转换成沉浸页卡片用的 PartnerInfo */
export function partnerCardToPartnerInfo(kid: string): {
  kid: string;
  img: string;
  name: string;
  age: number;
  signature: string;
  traits: string[];
  identities?: string[];
  temperament?: string;
  attachment?: string;
  hobbies?: string[];
  height?: string;
  loveReceiving?: string;
  biggestFear?: string;
  biggestDesire?: string;
} | null {
  const partner = getPartnerCard(kid);
  if (!partner) return null;
  const core = partner.core || {};
  const personality = partner.personality || {};
  const relationship = partner.relationship_positioning || {};
  const shortLabel = (s: string): string => {
    if (!s) return '';
    const head = String(s).split(/[，。,.；;]/)[0].trim();
    return head.length > 8 ? head.slice(0, 8) : head;
  };
  const traits = Array.isArray(personality.core_traits)
    ? personality.core_traits.map(shortLabel).filter(Boolean).slice(0, 3)
    : ['搭档'];
  const identities = Array.isArray(core.identities) ? core.identities.filter(Boolean).slice(0, 3) : undefined;
  return {
    kid,
    img: core.image || getRoleImage(kid),
    name: core.name || kid,
    age: typeof core.age === 'number' ? core.age : 22,
    signature: core.one_line_summary || core.role_positioning || '',
    traits: traits.length ? traits : ['搭档'],
    identities,
    temperament: personality.temperament || relationship.experience || undefined,
    biggestFear: personality.biggest_fear || undefined,
    biggestDesire: personality.biggest_desire || undefined,
  };
}

/** 把角色卡转换成沉浸页卡片用的 PartnerInfo（带扩展个人资料） */
export function roleCardToPartnerInfo(kid: string): {
  kid: string;
  img: string;
  name: string;
  age: number;
  signature: string;
  traits: string[];
  identities?: string[];
  temperament?: string;
  attachment?: string;
  hobbies?: string[];
  height?: string;
  loveReceiving?: string;
  biggestFear?: string;
  biggestDesire?: string;
} | null {
  const role = getRoleCard(kid);
  if (!role) return null;
  const core = role.core || {};
  const personality = role.personality || {};
  const appearance = role.appearance || {};
  const lifestyle = role.lifestyle || {};
  const attach = role.attachment_style || {};
  const love = role.love_language || {};
  // 用 surface_traits 前两条 + core_traits 第一条，尽量给 3 个"标签化"的短词
  const shortLabel = (s: string): string => {
    if (!s) return '';
    // 去句号、去逗号后保留前 6 字
    const head = String(s).split(/[，。,.；;]/)[0].trim();
    return head.length > 8 ? head.slice(0, 8) : head;
  };
  const rawTraits: string[] = [];
  if (Array.isArray(personality.surface_traits)) rawTraits.push(...personality.surface_traits);
  if (Array.isArray(personality.core_traits)) rawTraits.push(...personality.core_traits);
  const traits = Array.from(new Set(rawTraits.map(shortLabel).filter(Boolean))).slice(0, 3);
  const identities = Array.isArray(core.identities) ? core.identities.filter(Boolean).slice(0, 3) : undefined;
  const hobbies = Array.isArray(lifestyle.hobbies) ? lifestyle.hobbies.filter(Boolean).slice(0, 4) : undefined;
  const height = appearance?.physique?.height || undefined;
  return {
    kid,
    img: getRoleImage(kid),
    name: core.name || kid,
    age: typeof core.age === 'number' ? core.age : 22,
    signature: core.one_line_summary || '',
    traits: traits.length ? traits : ['神秘'],
    identities,
    temperament: personality.temperament || undefined,
    attachment: attach.type ? `${attach.type}${attach.description ? ` · ${attach.description}` : ''}` : undefined,
    hobbies,
    height,
    loveReceiving: love.receiving || undefined,
    biggestFear: personality.biggest_fear || undefined,
    biggestDesire: personality.biggest_desire || undefined,
  };
}

/**
 * 生成注入到聊天 system prompt 的人设段
 * 只挑聊天最相关的字段，避免 prompt 过长
 */
export function buildRolePersonaPrompt(kid: string, chapterId?: number): string {
  const partner = getPartnerCard(kid);
  if (partner) return buildPartnerPersonaPrompt(partner, chapterId);

  const role = getRoleCard(kid);
  if (!role) return '';
  const core = role.core || {};
  const personality = role.personality || {};
  const comm = role.communication || {};
  const attach = role.attachment_style || {};
  const love = role.love_language || {};
  const ai = role.ai_instruction || {};
  const lines: string[] = [];
  lines.push(`【你扮演的人物】`);
  lines.push(`【全局合规底线】${COMPLIANCE_RULE}`);
  lines.push(`- 姓名：${core.name || kid}${core.age ? ` / ${core.age}岁` : ''}${core.gender === 'female' ? ' / 女' : core.gender === 'male' ? ' / 男' : ''}`);
  if (Array.isArray(core.identities) && core.identities.length) lines.push(`- 身份：${core.identities.join('、')}`);
  if (core.one_line_summary) lines.push(`- 一句话：${core.one_line_summary}`);
  if (personality.temperament) lines.push(`- 气质：${personality.temperament}`);
  if (Array.isArray(personality.core_traits) && personality.core_traits.length) {
    lines.push(`- 核心性格：${personality.core_traits.join('；')}`);
  }
  if (Array.isArray(personality.surface_traits) && personality.surface_traits.length) {
    lines.push(`- 外在表现：${personality.surface_traits.join('；')}`);
  }
  if (Array.isArray(personality.inner_traits) && personality.inner_traits.length) {
    lines.push(`- 内心真相：${personality.inner_traits.join('；')}`);
  }
  if (personality.biggest_fear) lines.push(`- 最害怕：${personality.biggest_fear}`);
  if (personality.biggest_desire) lines.push(`- 最渴望：${personality.biggest_desire}`);
  if (comm.speak_style) lines.push(`- 说话风格：${comm.speak_style}`);
  if (Array.isArray(comm.phrases) && comm.phrases.length) {
    lines.push(`- 口头禅：${comm.phrases.slice(0, 4).join('、')}`);
  }
  if (comm.reply_speed) lines.push(`- 回复节奏：${comm.reply_speed}`);
  if (attach.type || attach.description) {
    lines.push(`- 依恋风格：${attach.type || ''}${attach.description ? ` —— ${attach.description}` : ''}`);
  }
  if (love.receiving) lines.push(`- 喜欢被对待的方式：${love.receiving}`);
  if (Array.isArray(ai.do) && ai.do.length) {
    lines.push(`【AI 扮演 DO】${ai.do.slice(0, 5).join('；')}`);
  }
  if (Array.isArray(ai.dont) && ai.dont.length) {
    lines.push(`【AI 扮演 DON'T】${ai.dont.slice(0, 5).join('；')}`);
  }
  return lines.join('\n');
}

function buildPartnerPersonaPrompt(partner: AnyRole, chapterId?: number): string {
  const core = partner.core || {};
  const personality = partner.personality || {};
  const comm = partner.communication || {};
  const interaction = partner.interaction_rules || {};
  const relationship = partner.relationship_positioning || {};
  const crackedMask = partner.cracked_mask || {};
  const ai = partner.ai_instruction || {};
  const stageEngine = partner.stage_engine || {};
  const resolvedChapter = String(chapterId || 1);
  const currentStage = stageEngine.stages?.[resolvedChapter];
  const lines: string[] = [];
  const listAll = (items: unknown): string => {
    if (!Array.isArray(items)) return '';
    return items
      .map(item => String(item).trim())
      .filter(Boolean)
      .join('；');
  };

  lines.push(`【你扮演的固定搭档】`);
  lines.push(`【全局合规底线】${COMPLIANCE_RULE}`);
  lines.push(`- 姓名：${core.name || core.kid}${core.alias ? ` / ${core.alias}` : ''}${core.age ? ` / ${core.age}岁` : ''}${core.gender === 'female' ? ' / 女' : core.gender === 'male' ? ' / 男' : ''}`);
  if (Array.isArray(core.identities) && core.identities.length) lines.push(`- 身份：${core.identities.join('、')}`);
  if (core.role_positioning) lines.push(`- 产品定位：${core.role_positioning}`);
  if (core.psychological_age) lines.push(`- 心理状态：${core.psychological_age}`);
  if (core.one_line_summary) lines.push(`- 一句话：${core.one_line_summary}`);
  if (partner.visual_motif) lines.push(`- 视觉母题：${partner.visual_motif}`);
  if (relationship.experience) lines.push(`- 关系体验：${relationship.experience}`);
  if (relationship.initial_attitude) lines.push(`- 初始态度：${relationship.initial_attitude}`);
  if (relationship.growth_path) lines.push(`- 成长路径：${relationship.growth_path}`);
  if (personality.temperament) lines.push(`- 气质：${personality.temperament}`);
  const coreTraits = listAll(personality.core_traits);
  const surfaceTraits = listAll(personality.surface_traits);
  const innerTraits = listAll(personality.inner_traits);
  if (coreTraits) lines.push(`- 核心性格：${coreTraits}`);
  if (surfaceTraits) lines.push(`- 外在表现：${surfaceTraits}`);
  if (innerTraits) lines.push(`- 内心底色：${innerTraits}`);
  if (personality.biggest_fear) lines.push(`- 最害怕：${personality.biggest_fear}`);
  if (personality.biggest_desire) lines.push(`- 最渴望：${personality.biggest_desire}`);
  if (personality.deep_motivation) lines.push(`- 底层动机：${personality.deep_motivation}`);

  if (crackedMask.trigger || crackedMask.state || Array.isArray(crackedMask.behaviors)) {
    lines.push(`【破防真实状态】`);
    if (crackedMask.trigger) lines.push(`- 触发条件：${crackedMask.trigger}`);
    if (crackedMask.state) lines.push(`- 状态变化：${crackedMask.state}`);
    const crackedBehaviors = listAll(crackedMask.behaviors);
    if (crackedBehaviors) lines.push(`- 行为表现：${crackedBehaviors}`);
    if (crackedMask.meaning) lines.push(`- 意义：${crackedMask.meaning}`);
  }

  lines.push(`【章节亲密度阈值】`);
  lines.push(`- 当前章节：第${resolvedChapter}章`);
  if (stageEngine.rule) lines.push(`- 阶段规则：${stageEngine.rule}`);
  if (currentStage) {
    const range = Array.isArray(currentStage.intimacy_range) ? currentStage.intimacy_range.join('-') : '未知';
    lines.push(`- 当前阶段：${currentStage.stage_name || resolvedChapter}（亲密度 ${range}）`);
    if (currentStage.current_state) lines.push(`- 当前状态：${currentStage.current_state}`);
    if (currentStage.dialogue_temperature) lines.push(`- 对话温度：${currentStage.dialogue_temperature}`);
    if (currentStage.training_goal) lines.push(`- 训练目标：${currentStage.training_goal}`);
    const allowed = listAll(currentStage.allowed_behaviors);
    if (allowed) lines.push(`- 本阶段允许：${allowed}`);
    const forbidden = listAll(currentStage.forbidden_behaviors);
    if (forbidden) lines.push(`- 本阶段禁止：${forbidden}`);
  }
  if (stageEngine.intimacy_gate) {
    lines.push(`- 亲密度阈值：${Object.entries(stageEngine.intimacy_gate).map(([range, rule]) => `${range}=${rule}`).join(' / ')}`);
  }
  lines.push(`- 硬规则：必须服从当前章节阶段，不可越级进入更高亲密度状态。`);

  if (interaction.primary_rule) lines.push(`- 互动判定：${interaction.primary_rule}`);
  if (Array.isArray(interaction.best_response_order) && interaction.best_response_order.length) lines.push(`- 回应顺序：${interaction.best_response_order.join(' → ')}`);
  const rewards = listAll(interaction.reward_triggers);
  if (rewards) lines.push(`- 加分触发：${rewards}`);
  const penalties = listAll(interaction.penalty_triggers);
  if (penalties) lines.push(`- 扣分触发：${penalties}`);
  if (interaction.penalty_levels) {
    lines.push(`- 雷区分级：${Object.entries(interaction.penalty_levels).map(([level, rule]) => `${level}: ${rule}`).join(' / ')}`);
  }
  if (comm.speak_style) lines.push(`- 说话风格：${comm.speak_style}`);
  if (comm.voice_tone) lines.push(`- 语气：${comm.voice_tone}`);
  if (comm.text_style) lines.push(`- 文字风格：${comm.text_style}`);
  if (comm.reply_speed) lines.push(`- 回复节奏：${comm.reply_speed}`);
  if (Array.isArray(comm.common_phrases) && comm.common_phrases.length) lines.push(`- 常用表达：${comm.common_phrases.join('、')}`);
  const dos = listAll(ai.do);
  const donts = listAll(ai.dont);
  if (dos) lines.push(`【扮演重点】${dos}`);
  if (donts) lines.push(`【避免】${donts}`);

  return lines.join('\n');
}
