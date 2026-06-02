import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { storage } from '../lib/storage';

const STORAGE_KEY = 'user_state';

function randomUserId() {
  return 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** 新用户注册后的初始状态（与 defaultUser 分开，后者充当“未鉴定访客”样本） */
const freshUser = {
  userId: null,
  name: '小鹿',
  xp: 0,
  level: 1,
  title: '恋爱新生',
  streak: 0,
  lastCheckinDate: null,
  achievements: 0,
  isVip: false,
  subTier: null,         // 'lite' | 'pro' | 'proplus'
  subPlan: null,
  subExpireAt: null,
  subChannel: null,
  subAutoRenew: false,
  gender: null,
  age: null,
  goals: [],
  speciesId: null,
  speciesName: null,
  speciesEmoji: null,
  matchRate: 0,
  recommendedTags: [],
  abilityScores: null,
  onboardedAt: null,
  followers: 0,
  following: 0,
  profileViews: 0,
  avatarFrame: 'default',
  skinId: 'classic',
  earnedBadges: ['starter'],
  equippedBadges: ['starter'],
  schemaVersion: 2,
};

const defaultUser = {
  userId: null,
  name: '小鹿',
  xp: 0,
  level: 1,
  title: '恋爱新生',
  streak: 0,
  lastCheckinDate: null,
  achievements: 0,
  isVip: false,
  // 商业化字段
  subTier: null,
  subPlan: null,
  subExpireAt: null,
  subChannel: null,
  subAutoRenew: false,
  gender: null,
  age: null,
  goals: [],
  speciesId: null,
  speciesName: null,
  speciesEmoji: null,
  followers: 0,
  following: 0,
  profileViews: 0,
  avatarFrame: 'default',
  skinId: 'classic',
  // 徽章系统（文档 §2.6 约定）
  earnedBadges: ['starter'],
  equippedBadges: ['starter'],
  // 数据结构版本，用于一次性迁移
  schemaVersion: 2,
};

/** Schema 校验：确保 localStorage 中的用户数据结构合法 */
function validateUserShape(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  if (obj.name !== undefined && typeof obj.name !== 'string') return false;
  if (obj.xp !== undefined && typeof obj.xp !== 'number') return false;
  if (obj.level !== undefined && typeof obj.level !== 'number') return false;
  if (obj.isVip !== undefined && typeof obj.isVip !== 'boolean') return false;
  if (obj.goals !== undefined && !Array.isArray(obj.goals)) return false;
  if (obj.earnedBadges !== undefined && !Array.isArray(obj.earnedBadges)) return false;
  if (obj.equippedBadges !== undefined && !Array.isArray(obj.equippedBadges)) return false;
  if (obj.followers !== undefined && typeof obj.followers !== 'number') return false;
  if (obj.following !== undefined && typeof obj.following !== 'number') return false;
  if (obj.schemaVersion !== undefined && typeof obj.schemaVersion !== 'number') return false;
  return true;
}

function loadUser() {
  const saved = storage.json(STORAGE_KEY, null);
  if (saved && typeof saved === 'object' && validateUserShape(saved)) {
    const merged = { ...defaultUser, ...saved, userId: saved.userId || randomUserId() };
    // schema v2：首次引入 3 枚默认徽章，覆盖旧存档
    if ((saved.schemaVersion || 0) < 2) {
      merged.earnedBadges = defaultUser.earnedBadges;
      merged.equippedBadges = defaultUser.equippedBadges;
      merged.schemaVersion = 2;
    }
    return merged;
  }
  if (saved) {
    console.warn('[UserContext] localStorage user data failed schema validation, resetting to fresh');
  }
  return { ...freshUser, userId: randomUserId() };
}

const UserContext = createContext({
  ...defaultUser,
  updateUser: () => {},
  checkIn: () => {},
  followedNames: [],
  toggleFollow: () => {},
  isFollowing: () => false,
  isPro: () => false,
  daysLeft: () => 0,
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [followedNames, setFollowedNames] = useState(() => storage.json('followed_names', []));

  useEffect(() => { storage.setJson(STORAGE_KEY, user); }, [user]);
  useEffect(() => { storage.setJson('followed_names', followedNames); }, [followedNames]);

  const updateUser = useCallback((data) => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return;
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  /**
   * 打卡：每天首次调用时更新 streak。
   * - 同一天重复调用无效。
   * - 跟昨天连续则 streak+1，否则重置为 1。
   */
  const checkIn = useCallback(() => {
    setUser(prev => {
      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
      if (prev.lastCheckinDate === today) return prev; // 今天已打卡
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = prev.lastCheckinDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastCheckinDate: today };
    });
  }, []);

  /**
   * 新用户注册 / 重新鉴定后调用：清除旧本地状态。
   * patch 允许在重置同时写入鉴定结果（speciesId 等）。
   */
  const resetUserForNewAccount = useCallback((patch = {}) => {
    try {
      const fresh = { ...freshUser, userId: randomUserId(), ...patch };
      setUser(fresh);
      setFollowedNames([]);
      storage.setJson(STORAGE_KEY, fresh);
      storage.setJson('followed_names', []);
      // 清除上一个账号残留的每日状态（签到、感情加热、每日任务等）
      if (typeof window !== 'undefined') {
        const PREFIX = 'foxsay:';
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('foxsay_checkin_') || k.startsWith('heatup_') || k.startsWith('foxsay_daily_') || k.startsWith('foxsay_task_')
              || k.startsWith(PREFIX + 'checkin_') || k.startsWith(PREFIX + 'heatup:') || k.startsWith(PREFIX + 'daily_') || k.startsWith(PREFIX + 'tasks:')) {
            localStorage.removeItem(k);
          }
        });
      }
    } catch (err) {
      console.error('[UserContext] resetUserForNewAccount failed:', err);
    }
  }, []);

  const toggleFollow = useCallback((name) => {
    if (!name) return;
    setFollowedNames(prev => {
      const willFollow = !prev.includes(name);
      setUser(u => ({
        ...u,
        following: willFollow ? u.following + 1 : Math.max(0, u.following - 1),
      }));
      return willFollow ? [...prev, name] : prev.filter(n => n !== name);
    });
  }, []);

  const isFollowing = useCallback((name) => followedNames.includes(name), [followedNames]);

  const isPro = useCallback(() => {
    if (!user.isVip) return false;
    if (!user.subExpireAt) return !!user.isVip;
    const exp = typeof user.subExpireAt === 'string' ? new Date(user.subExpireAt).getTime() : user.subExpireAt;
    return exp > Date.now();
  }, [user.isVip, user.subExpireAt]);

  const daysLeft = useCallback(() => {
    if (!user.subExpireAt) return 0;
    const exp = typeof user.subExpireAt === 'string' ? new Date(user.subExpireAt).getTime() : user.subExpireAt;
    return Math.max(0, Math.ceil((exp - Date.now()) / (24 * 60 * 60 * 1000)));
  }, [user.subExpireAt]);

  return (
    <UserContext.Provider value={{
      ...user,
      updateUser,
      checkIn,
      resetUserForNewAccount,
      followedNames,
      toggleFollow,
      isFollowing,
      isPro,
      daysLeft,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
