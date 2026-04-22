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

// JSON 结构松散，这里用 any 描述
type AnyRole = any;
const _rolesMap: Record<string, AnyRole> = (rolesJson as any).roles || {};
const _allKids: string[] = Object.keys(_rolesMap).filter(k => !k.startsWith('_'));

/** 取出完整角色卡 */
export function getRoleCard(kid: string): AnyRole | null {
  return _rolesMap[kid] || null;
}

/** 所有角色 KID（按定义顺序） */
export function getAllRoleKids(): string[] {
  return _allKids.slice();
}

/**
 * 按 KID 推导立绘图片路径
 * R001 -> /chapters/roles/role-01.jpg
 * R030 -> /chapters/roles/role-30.jpg
 */
export function getRoleImage(kid: string): string {
  const m = /^R(\d+)$/.exec(kid);
  const n = m ? parseInt(m[1], 10) : 1;
  const padded = String(n).padStart(2, '0');
  return `/chapters/roles/role-${padded}.jpg`;
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
export function buildRolePersonaPrompt(kid: string): string {
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
