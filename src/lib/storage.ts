/**
 * @file storage.ts
 * @desc 统一 localStorage 封装 — 所有 key 强制 foxsay: 前缀。
 *       支持一次性迁移旧 key（darkMode / heatup_* / tasks_*）。
 */

const PREFIX = 'foxsay:';
const MIGRATION_FLAG = `${PREFIX}__migrated_v1`;

/** 明确需要迁移的旧 key 清单 (old -> new) */
const MIGRATIONS: Array<[RegExp | string, (old: string) => string]> = [
  ['darkMode', () => 'dark_mode'],
  ['foxsay_booked_coaches', () => 'booked_coaches'],
  ['foxsay_coach_chats', () => 'coach_chats'],
  ['foxsay_coach_unread', () => 'coach_unread'],
  [/^foxsay_(.+)$/, (k) => (k.match(/^foxsay_(.+)$/)?.[1] ?? k)],
  [/^heatup_(.+)$/, (k) => `heatup:${k.match(/^heatup_(.+)$/)?.[1]}`],
  [/^tasks_(.+)$/, (k) => `tasks:${k.match(/^tasks_(.+)$/)?.[1]}`],
];

function safeGet(raw: string): string | null {
  try { return localStorage.getItem(raw); } catch { return null; }
}
function safeSet(raw: string, v: string) {
  try { localStorage.setItem(raw, v); } catch {}
}
function safeRemove(raw: string) {
  try { localStorage.removeItem(raw); } catch {}
}

export const storage = {
  key: (k: string) => (k.startsWith(PREFIX) ? k : PREFIX + k),

  get(k: string): string | null {
    return safeGet(storage.key(k));
  },
  set(k: string, v: string) {
    safeSet(storage.key(k), v);
  },
  remove(k: string) {
    safeRemove(storage.key(k));
  },

  /** 读取并 JSON 解析，失败返回 fallback */
  json<T>(k: string, fallback: T): T {
    const raw = storage.get(k);
    if (!raw) return fallback;
    try { return JSON.parse(raw) as T; } catch { return fallback; }
  },
  setJson(k: string, v: unknown) {
    try { storage.set(k, JSON.stringify(v)); } catch {}
  },
};

/**
 * 一次性迁移旧 key 到新前缀。调用后写迁移标记，幂等。
 * 在 main.jsx 启动前调用一次即可。
 */
export function runStorageMigration() {
  try {
    if (localStorage.getItem(MIGRATION_FLAG)) return;

    const allKeys = Object.keys(localStorage);
    for (const oldKey of allKeys) {
      if (oldKey.startsWith(PREFIX)) continue; // 已迁移
      let matched = false;
      for (const [pattern, mapper] of MIGRATIONS) {
        const hit = typeof pattern === 'string' ? oldKey === pattern : pattern.test(oldKey);
        if (!hit) continue;
        const newKey = PREFIX + mapper(oldKey);
        const value = safeGet(oldKey);
        if (value != null) safeSet(newKey, value);
        safeRemove(oldKey);
        matched = true;
        break;
      }
      // 其余与本 app 无关的 key 不动
      if (!matched) continue;
    }
    localStorage.setItem(MIGRATION_FLAG, '1');
  } catch {
    // 隐私模式等情况，忽略
  }
}
