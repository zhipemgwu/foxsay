/**
 * @file types.ts
 * @desc 全局 User 类型定义 — 替代散落各处的 as any
 */

export type SubTier = 'lite' | 'pro' | 'proplus' | null;
export type SubPlan = 'month' | 'quarter' | 'halfYear' | 'year' | 'lifetime' | null;
export type KbPlan = 'kb_month' | 'kb_quarter' | 'kb_year' | 'kb_lifetime' | null;
export type Gender = 'male' | 'female' | null;

export interface User {
  userId: string | null;
  name: string;
  xp: number;
  level: number;
  title: string;
  streak: number;
  achievements: number;
  isVip: boolean;
  subTier: SubTier;
  subPlan: SubPlan;
  subExpireAt: number | string | null;
  subChannel: string | null;
  subAutoRenew: boolean;
  kbVip: boolean;
  kbPlan: KbPlan;
  kbExpireAt: number | string | null;
  gender: Gender;
  age: string | null;
  goals: string[];
  speciesId: string | null;
  speciesName: string | null;
  speciesEmoji: string | null;
  matchRate: number;
  recommendedTags: string[];
  abilityScores: Record<string, number> | null;
  onboardedAt: string | null;
  followers: number;
  following: number;
  profileViews: number;
  avatarFrame: string;
  skinId: string;
  earnedBadges: string[];
  equippedBadges: string[];
  schemaVersion: number;
}

export interface UserContextValue extends User {
  updateUser: (data: Partial<User>) => void;
  resetUserForNewAccount: (patch?: Partial<User>) => void;
  followedNames: string[];
  toggleFollow: (name: string) => void;
  isFollowing: (name: string) => boolean;
  isPro: () => boolean;
  daysLeft: () => number;
}
