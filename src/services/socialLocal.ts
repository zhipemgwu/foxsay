import { getUnlockedContactCards, readStoredUnlockedRoleKids, resolveContactCard, type ContactCard } from './unlockedRoles';

export const PROFILE_KEY = 'foxsay_profile_v1';
export const USER_MOMENTS_KEY = 'foxsay_user_moments_v1';
export const STICKER_PACKS_KEY = 'foxsay_role_sticker_packs_v1';
export const SEARCH_RECENT_KEY = 'foxsay_social_search_recent_v1';
export const MOMENTS_PROFILE_KEY = 'foxsay_moments_profile_v1';

export interface FoxsayProfile {
  avatar: string;
  name: string;
  gender: string;
  region: string;
  signature: string;
  qrId: string;
  diamonds: number;
}

export interface UserMoment {
  id: string;
  text: string;
  image?: string;
  createdAt: number;
}

export interface RoleStickerPack {
  kid: string;
  name: string;
  avatar: string;
  stickers: string[];
}

export interface SearchRecord {
  id: string;
  text: string;
  createdAt: number;
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function createId(prefix = 'foxsay'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getDefaultProfile(user?: any): FoxsayProfile {
  const rawName = String(user?.name || user?.nickname || '').trim();
  return {
    avatar: '/avatars/avatar1.png',
    name: rawName || 'FoxSay用户',
    gender: '未设置',
    region: '中国大陆',
    signature: '正在练习把喜欢说得更自然一点。',
    qrId: `foxsay-${String(user?.userId || user?.id || 'guest').slice(-8)}`,
    diamonds: 0,
  };
}

export function loadProfile(user?: any): FoxsayProfile {
  return { ...getDefaultProfile(user), ...readJson<Partial<FoxsayProfile>>(PROFILE_KEY, {}) };
}

export function saveProfile(profile: FoxsayProfile): void {
  writeJson(PROFILE_KEY, profile);
}

export function loadUserMoments(): UserMoment[] {
  return readJson<UserMoment[]>(USER_MOMENTS_KEY, []);
}

export function saveUserMoments(moments: UserMoment[]): void {
  writeJson(USER_MOMENTS_KEY, moments);
}

export function addUserMoment(input: { text: string; image?: string }): UserMoment[] {
  const moments = loadUserMoments();
  const next = [
    {
      id: createId('moment'),
      text: input.text.trim(),
      image: input.image,
      createdAt: Date.now(),
    },
    ...moments,
  ].filter(item => item.text || item.image);
  saveUserMoments(next);
  return next;
}

export function getRoleStickerPacks(): RoleStickerPack[] {
  const unlocked = new Set(readStoredUnlockedRoleKids());
  const stored = new Set(readJson<string[]>(STICKER_PACKS_KEY, []));
  const kids = Array.from(new Set([...unlocked, ...stored]));
  writeJson(STICKER_PACKS_KEY, kids);
  return kids
    .map(kid => resolveContactCard(kid))
    .filter(Boolean)
    .map(card => {
      const contact = card as ContactCard;
      return {
        kid: contact.kid,
        name: contact.name,
        avatar: contact.avatar,
        stickers: ['打招呼', '害羞', '收到', '开心'],
      };
    });
}

export function loadSearchRecent(): SearchRecord[] {
  return readJson<SearchRecord[]>(SEARCH_RECENT_KEY, []);
}

export function addSearchRecent(text: string): SearchRecord[] {
  const query = text.trim();
  if (!query) return loadSearchRecent();
  const next = [
    { id: createId('search'), text: query, createdAt: Date.now() },
    ...loadSearchRecent().filter(item => item.text !== query),
  ].slice(0, 8);
  writeJson(SEARCH_RECENT_KEY, next);
  return next;
}

export function searchSocialContent(query: string): Array<{ type: string; title: string; subtitle: string; avatar?: string; kid?: string }> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const contacts = getUnlockedContactCards()
    .filter(card => [card.name, card.identity, card.signature, ...card.tags].join(' ').toLowerCase().includes(q))
    .map(card => ({ type: '联系人', title: card.name, subtitle: card.identity, avatar: card.avatar, kid: card.kid }));
  const userMoments = loadUserMoments()
    .filter(moment => moment.text.toLowerCase().includes(q))
    .map(moment => ({ type: '我的朋友圈', title: moment.text.slice(0, 22) || '图片动态', subtitle: formatDateTime(moment.createdAt) }));
  return [...contacts, ...userMoments];
}

export function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
