import {
  getAllPartnerKids,
  getAllRoleKids,
  getPartnerCard,
  getRoleCard,
  getRoleImage,
  partnerCardToPartnerInfo,
  roleCardToPartnerInfo,
} from './roleCards';

export const UNLOCKED_ROLE_STORAGE_KEY = 'foxsay_unlocked_role_cards_v1';
export const ROLE_CARD_EVENT = 'foxsay_role_cards_updated';

export interface ContactCard {
  kid: string;
  name: string;
  avatar: string;
  identity: string;
  signature: string;
  tags: string[];
  source: 'partner' | 'role';
}

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeKids(kids: unknown): string[] {
  if (!Array.isArray(kids)) return [];
  return Array.from(
    new Set(
      kids
        .map(kid => String(kid || '').trim().toUpperCase())
        .filter(kid => /^P\d{3}$/.test(kid) || /^R\d{3}$/.test(kid)),
    ),
  );
}

export function readStoredUnlockedRoleKids(): string[] {
  const stored = normalizeKids(safeReadJson<string[]>(UNLOCKED_ROLE_STORAGE_KEY, []));
  if (stored.length) return stored;
  return ['P001'];
}

export function writeStoredUnlockedRoleKids(kids: string[]): string[] {
  const normalized = normalizeKids(kids);
  try {
    localStorage.setItem(UNLOCKED_ROLE_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent(ROLE_CARD_EVENT, { detail: normalized }));
  } catch {}
  return normalized;
}

export function unlockRoleCard(kid?: string | null): string[] {
  const normalizedKid = String(kid || '').trim().toUpperCase();
  if (!normalizedKid) return readStoredUnlockedRoleKids();
  const current = readStoredUnlockedRoleKids();
  return writeStoredUnlockedRoleKids([...current, normalizedKid]);
}

export function lockRoleCardForDebug(kid: string): string[] {
  const normalizedKid = String(kid || '').trim().toUpperCase();
  return writeStoredUnlockedRoleKids(readStoredUnlockedRoleKids().filter(item => item !== normalizedKid));
}

export function getRoleChatStorageKey(kid: string): string {
  return `foxsay_role_chat_messages_v1_${kid}`;
}

export function resolveContactCard(kid: string): ContactCard | null {
  const partnerInfo = partnerCardToPartnerInfo(kid);
  if (partnerInfo) {
    return {
      kid,
      name: partnerInfo.name,
      avatar: partnerInfo.img || getRoleImage(kid),
      identity: partnerInfo.identities?.[0] || partnerInfo.traits?.[0] || '训练角色',
      signature: partnerInfo.signature || '完成对应训练后，可以继续像微信一样聊天。',
      tags: partnerInfo.traits || [],
      source: 'partner',
    };
  }

  const roleInfo = roleCardToPartnerInfo(kid);
  if (roleInfo) {
    return {
      kid,
      name: roleInfo.name,
      avatar: roleInfo.img || getRoleImage(kid),
      identity: roleInfo.identities?.[0] || roleInfo.traits?.[0] || '人物挑战角色',
      signature: roleInfo.signature || '你们已经建立了一个新的联系方式。',
      tags: roleInfo.traits || [],
      source: 'role',
    };
  }

  return null;
}

export function getKnownContactCards(): ContactCard[] {
  const preferredPartners = ['P001', 'P002', 'P003', 'P004', 'P005'];
  const partnerKids = getAllPartnerKids();
  const roleKids = getAllRoleKids().slice(0, 8);
  const allKids = Array.from(new Set([...preferredPartners, ...partnerKids, ...roleKids]));
  return allKids.map(resolveContactCard).filter(Boolean) as ContactCard[];
}

export function getUnlockedContactCards(): ContactCard[] {
  const unlocked = new Set(readStoredUnlockedRoleKids());
  return getKnownContactCards().filter(card => unlocked.has(card.kid));
}

export function getLockedContactCards(): ContactCard[] {
  const unlocked = new Set(readStoredUnlockedRoleKids());
  return getKnownContactCards().filter(card => !unlocked.has(card.kid));
}

export function getRoleDisplayName(kid: string): string {
  return (
    getPartnerCard(kid)?.core?.name ||
    getRoleCard(kid)?.core?.name ||
    resolveContactCard(kid)?.name ||
    kid
  );
}
