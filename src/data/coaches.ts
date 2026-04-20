/**
 * @file coaches.ts
 * @desc 导师数据集中管理 — 全站唯一数据源
 */

export interface Coach {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  sessions: number;
  desc: string;
  online: boolean;
  followers: string;
  articles: number;
  specialties: string[];
}

export const COACHES: Coach[] = [
  { id: 1, name: '汪俊豪', avatar: '/avatars/face1.jpg', specialty: '约会场景', rating: 4.9, sessions: 256, desc: '国家二级心理咨询师', online: true, followers: '12.8k', articles: 46, specialties: ['情感沟通', '共情训练', '聊天技巧', '情绪管理'] },
  { id: 2, name: '余水', avatar: '/avatars/face2.png', specialty: '情感沟通', rating: 4.8, sessions: 189, desc: '恋爱导师 · 全关卡通关者', online: true, followers: '9.5k', articles: 37, specialties: ['关系破冰', '约会技巧', '亲密关系', '分手修复'] },
  { id: 3, name: '占方剑', avatar: '/avatars/face3.png', specialty: '聊天技巧', rating: 4.95, sessions: 312, desc: '两性沟通专家', online: false, followers: '15.2k', articles: 52, specialties: ['两性心理', '冲突化解', '深度对话', '情商提升'] },
  { id: 4, name: '窦国立', avatar: '/avatars/face4.png', specialty: '冲突化解', rating: 4.85, sessions: 145, desc: '情感博主 · 通关认证导师', online: true, followers: '7.3k', articles: 28, specialties: ['恋爱观察', '社交礼仪', '个人魅力', '心动经营'] },
];

/** 按名称查找导师 */
export function getCoachByName(name: string): Coach | undefined {
  return COACHES.find(c => c.name === name);
}

/** 按 ID 查找导师 */
export function getCoachById(id: number): Coach | undefined {
  return COACHES.find(c => c.id === id);
}

/** 判断是否为认证导师名称 */
export function isCoachName(name: string): boolean {
  return COACHES.some(c => c.name === name);
}

/** ID → 名称映射（用于通知等场景） */
export const COACH_NAME_MAP: Record<number, string> = Object.fromEntries(
  COACHES.map(c => [c.id, c.name])
);
