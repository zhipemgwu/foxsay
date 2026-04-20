/**
 * 社交主页 — 点击头像进入的全屏个人主页
 * 包含：社交名片、动态、好友推荐、头像框/皮肤更换
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Sparkles, Palette, Frame, Image, Heart, MessageCircle, Lock, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcHeart, IcSparkle, IcChat, IcCrown, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';
import { useProfileModal } from './ProfileModals';
import { initialMyPosts } from './MyPostsPage';
import { EquippedBadges } from './EquippedBadges';

const avatarFrames = [
  { id: 'default', name: '默认', preview: '', color: 'rgba(155,126,222,0.4)', unlocked: true },
  { id: 'flame', name: '烈焰', preview: '', color: '#FF8A80', unlocked: true },
  { id: 'ocean', name: '深海', preview: '', color: '#4ECDC4', unlocked: true },
  { id: 'golden', name: '黄金VIP', preview: '', color: '#FFD93D', unlocked: true },
  { id: 'rainbow', name: '彩虹', preview: '', color: '#E040FB', unlocked: false, hint: 'Lv.15 解锁' },
  { id: 'sakura', name: '樱花', preview: '', color: '#F48FB1', unlocked: false, hint: '限定活动' },
];

/* ====== 徽章池 —— 对齐系统逻辑文档 §2.6 ====== */
export const badgePool = [
  // 赛季徽章
  { id: 'season_star', name: '赛季之星', icon: '🏅', img: '/badges/star_purple.png', color: '#B39DDB', desc: '赛季内累计 3000 XP', rarity: 'season', unlockHint: '本赛季还差 1580 XP' },
  { id: 'season_allaround', name: '赛季全能王', icon: '🏆', img: '/badges/star_orange_orbit.png', color: '#FFB74D', desc: '赛季 4500 XP 且 5 维均 ≥ 85', rarity: 'season', unlockHint: 'VIP 冲刺目标' },
  // 永久徽章
  { id: 'starter', name: '启程', icon: '🌱', img: '/badges/sagittarius.png', color: '#4ECDC4', desc: '完成第 1 次 AI 对话', rarity: 'perm' },
  { id: 'hot10', name: '热情', icon: '🔥', img: '/badges/aries.png', color: '#FF8A80', desc: '累计 10 次 AI 对话', rarity: 'perm' },
  { id: 'xp100', name: '百 XP 俱乐部', icon: '💯', img: '/badges/leo.png', color: '#FFB74D', desc: '累计获得 100 XP', rarity: 'perm' },
  { id: 'streak30', name: '月度达人', icon: '📅', img: '/badges/aquarius.png', color: '#4ECDC4', desc: '累计 30 天打卡', rarity: 'perm' },
  { id: 'allround80', name: '全能', icon: '🌈', img: '/badges/libra.png', color: '#F48FB1', desc: '5 维任一次均 ≥ 80', rarity: 'perm', locked: true },
  { id: 'master95', name: '大师', icon: '👑', img: '/badges/scorpio.png', color: '#CE93D8', desc: '综合恋商 ≥ 95', rarity: 'perm', locked: true },
  // 限定
  { id: 'halloween', name: '万圣树洞', icon: '🎃', img: '/badges/gemini.png', color: '#FF9E80', desc: '2025 万圣节限定', rarity: 'rare', locked: true },
  { id: 'xmas', name: '圣诞礼物派', icon: '🎄', img: '/badges/virgo.png', color: '#A5D6A7', desc: '2025 圣诞限定', rarity: 'rare', locked: true },
  { id: 'cool_cancer', name: '静水流深', icon: '💎', img: '/badges/cancer.png', color: '#90CAF9', desc: '保持冷静对话 50 次', rarity: 'perm', locked: true },
  { id: 'pisces', name: '共情之心', icon: '💗', img: '/badges/pisces.png', color: '#F48FB1', desc: '收到 50 个共情回复', rarity: 'perm', locked: true },
  { id: 'capricorn', name: '自律之巅', icon: '🏔', img: '/badges/capricorn.png', color: '#64B5F6', desc: '连续 90 天打卡', rarity: 'perm', locked: true },
  { id: 'taurus', name: '沉稳如山', icon: '🪨', img: '/badges/taurus.png', color: '#81D4FA', desc: '练习累计 1000 分钟', rarity: 'perm', locked: true },
];

const rarityLabel = { season: '赛季', perm: '永久', rare: '限定' };
const rarityColor = { season: '#FFD93D', perm: 'rgba(155,126,222,0.9)', rare: '#FF6B35' };
const MAX_EQUIPPED = 3;

const skins = [
  { id: 'classic', name: '经典暗紫', bg: '#352f45', accent: '#B39DDB', active: true },
  { id: 'midnight', name: '午夜蓝', bg: '#1a1f3a', accent: '#64B5F6', active: false },
  { id: 'rose', name: '玫瑰金', bg: '#3a2535', accent: '#FF8A80', active: false },
  { id: 'forest', name: '森林绿', bg: '#1f3529', accent: '#4ECDC4', active: false },
  { id: 'sunset', name: '日落橙', bg: '#3a2a1f', accent: '#FFB74D', active: false },
];

const activities = [
  { time: '2小时前', text: '完成了「咖啡馆初遇」场景练习，获得 50 XP！', icon: '☕', color: '#FF8A80' },
  { time: '昨天', text: '恋爱物种鉴定结果：老司狐 🦊 匹配度 98%', icon: '🦊', color: '#FFD93D' },
  { time: '2天前', text: '连续打卡 23 天，解锁「坚持达人」成就', icon: '🔥', color: '#4ECDC4' },
  { time: '3天前', text: '恋商评分提升至 82 分 (+4)', icon: '📈', color: '#B39DDB' },
  { time: '5天前', text: '完成「深夜便利店」场景挑战', icon: '🌙', color: '#81D4FA' },
];

/* ====== 帖子 tag 颜色映射 ====== */
const postTagColor: Record<string, { bg: string; color: string }> = {
  '练习心得': { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' },
  '成长记录': { bg: 'rgba(78,205,196,0.18)', color: '#4ECDC4' },
  '求助': { bg: 'rgba(255,217,61,0.18)', color: '#FFD93D' },
  '技巧分享': { bg: 'rgba(155,126,222,0.22)', color: '#B39DDB' },
};

const friendSuggestions = [
  { name: '恋爱实习生', species: '甜茶鸭', emoji: '🦆', level: 8, mutual: 3 },
  { name: '月亮代表我的心', species: '钛金直球虎', emoji: '🐯', level: 15, mutual: 1 },
  { name: '温柔小太阳', species: '自燃型海豚', emoji: '🐬', level: 11, mutual: 5 },
  { name: '星河漫步者', species: '量子纠缠猫', emoji: '🐱', level: 19, mutual: 2 },
];

export function SocialPage({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const { openProfile } = useProfileModal();
  const isNewUser = !user.xp && !user.achievements;
  const [tab, setTab] = useState<'posts' | 'journey' | 'frames' | 'skins'>('posts');
  const [activeFrame, setActiveFrame] = useState(user.avatarFrame || 'default');
  const [activeSkin, setActiveSkin] = useState(user.skinId || 'classic');
  const [followedIds, setFollowedIds] = useState<number[]>([]);
  const earnedIds: string[] = Array.isArray((user as any).earnedBadges) ? (user as any).earnedBadges : [];
  const equippedIds: string[] = Array.isArray((user as any).equippedBadges) ? (user as any).equippedBadges : [];

  const toggleEquip = (id: string) => {
    if (!earnedIds.includes(id)) return;
    const cur = equippedIds.slice();
    const idx = cur.indexOf(id);
    let next: string[];
    if (idx >= 0) {
      next = cur.filter(x => x !== id);
    } else {
      next = cur.length >= MAX_EQUIPPED ? [...cur.slice(1), id] : [...cur, id];
    }
    user.updateUser({ equippedBadges: next });
  };

  const toggleFollow = (i: number) => {
    setFollowedIds(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  const frameColors: Record<string, string> = {};
  avatarFrames.forEach(f => { frameColors[f.id] = f.color; });
  const currentFrameColor = frameColors[activeFrame] || 'rgba(155,126,222,0.4)';
  const currentSkin = skins.find(s => s.id === activeSkin) || skins[0];
  const pageBg = currentSkin.bg;
  const accentColor = currentSkin.accent;
  const cardBg = `${accentColor}12`;
  const cardBgSolid = activeSkin === 'classic' ? '#453a60' : `color-mix(in srgb, ${pageBg} 85%, ${accentColor})`;

  return (
    <motion.div
      className="fixed inset-0 z-[1100] flex flex-col"
      style={{ background: pageBg, transition: 'background 0.5s ease' }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
        <div className="flex items-center justify-between px-5 h-12">
          <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>个人主页</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
            <X size={22} color="rgba(245,239,232,0.6)" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 封面 + 头像名片 */}
        <div className="relative" style={{ height: 160, background: `linear-gradient(135deg, ${accentColor}30 0%, ${currentFrameColor}25 50%, ${accentColor}15 100%)`, transition: 'background 0.5s ease' }}>
          <div className="absolute inset-0 overflow-hidden">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="absolute rounded-full" style={{
                width: 80 + i * 40, height: 80 + i * 40,
                background: i === 0 ? `${currentFrameColor}20` : i === 1 ? `${accentColor}18` : `${currentFrameColor}10`,
                left: `${20 + i * 25}%`, top: `${10 + i * 15}%`,
                transition: 'background 0.5s ease',
              }} animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
          </div>
        </div>

        {/* 头像 + 基础信息 */}
        <div className="px-5 relative" style={{ marginTop: -44 }}>
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
              <motion.div className="absolute inset-0 rounded-full"
                key={activeFrame}
                style={{ background: `linear-gradient(135deg, ${currentFrameColor}, ${currentFrameColor}88)` }}
                initial={{ opacity: 0.3, scale: 1.05 }}
                animate={{ opacity: [0.4, 0.7, 0.4], scale: 1.05 }}
                transition={{ opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }} />
              <div className="absolute rounded-full overflow-hidden" style={{ top: 6, left: 6, width: 76, height: 76, border: `3px solid ${currentFrameColor}`, transition: 'border-color 0.3s ease', boxShadow: `0 0 16px ${currentFrameColor}50` }}>
                <ImageWithFallback src="/avatars/face5.webp" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <img src="/avatar-frame.png" alt="" style={{ position: 'absolute', top: 0, left: 0, width: 88, height: 88, pointerEvents: 'none' }} />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <span style={{ color: '#f5efe8', fontSize: 20, fontWeight: 700 }}>{user.name}</span>
                {user.isVip && <span className="px-2 py-0.5" style={{ background: 'rgba(155,126,222,0.2)', borderRadius: 4, color: '#B39DDB', fontSize: 10, fontWeight: 700 }}>{(user as any).subTier === 'proplus' ? 'PRO+' : (user as any).subTier === 'pro' ? 'PRO' : user.isVip ? 'VIP' : ''}</span>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: 12 }}>{user.speciesEmoji}</span>
                <span style={{ color: '#FF8A80', fontSize: 11, fontWeight: 600 }}>{user.speciesName}</span>
                <span style={{ color: 'rgba(245,239,232,0.2)' }}>·</span>
                <span style={{ color: '#B39DDB', fontSize: 11, fontWeight: 600 }}>Lv.{user.level} {user.title}</span>
              </div>
              {/* 徽章立体勋章带 —— SOUL 风格，与扁平 pill 区分 */}
              {equippedIds.length > 0 && (
                <div className="mt-2">
                  <EquippedBadges
                    ids={equippedIds.slice(0, MAX_EQUIPPED)}
                    size="sm"
                    onClick={() => setTab('frames')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 关注 / 粉丝 / 看过我 */}
          <div className="flex items-center gap-6 mt-4 mb-5">
            <div className="text-center">
              <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>{user.following ?? 0}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginLeft: 4 }}>关注</span>
            </div>
            <div className="text-center">
              <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>{user.followers ?? 0}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginLeft: 4 }}>粉丝</span>
            </div>
            <div className="text-center">
              <span style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800 }}>{(user as any).profileViews ?? 0}</span>
              <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginLeft: 4 }}>看过我</span>
            </div>
          </div>

          {/* 兴趣标签 */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['自由', '佛系', '猫控', '民谣', '旅行', '文学'].map(tag => (
              <span key={tag} className="px-3 py-1" style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 20, color: 'rgba(245,239,232,0.6)', fontSize: 12, fontWeight: 500 }}>{tag}</span>
            ))}
            <span className="px-3 py-1" style={{ background: `${accentColor}12`, borderRadius: 20, color: `${accentColor}80`, fontSize: 12, transition: 'all 0.4s ease' }}>+</span>
          </div>

          {/* Tab 切换：瞬间(帖子) / 轨迹 / 头像框·徽章 / 皮肤 */}
          <div className="flex gap-1 mb-4 p-1" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 12 }}>
            {[
              { key: 'posts' as const, label: '瞬间', icon: '📢' },
              { key: 'journey' as const, label: '轨迹', icon: '🌱' },
              { key: 'frames' as const, label: '装扮', icon: '✨' },
              { key: 'skins' as const, label: '皮肤', icon: '🎨' },
            ].map(t => (
              <motion.button key={t.key} className="flex-1 py-2 flex items-center justify-center gap-1"
                style={{
                  borderRadius: 10,
                  background: tab === t.key ? `${accentColor}25` : 'transparent',
                  color: tab === t.key ? '#f5efe8' : 'rgba(245,239,232,0.45)',
                  fontSize: 12, fontWeight: 600,
                  transition: 'background 0.3s ease',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTab(t.key)}>
                <span style={{ fontSize: 11 }}>{t.icon}</span>
                {t.label}
              </motion.button>
            ))}
          </div>

          {/* ========= 瞬间 Tab —— SOUL 风格，显示用户发的帖子 ========= */}
          {tab === 'posts' && (() => {
            const myPosts = isNewUser ? [] : initialMyPosts;
            return (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>我的瞬间</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>共 {myPosts.length} 条</span>
              </div>
              {myPosts.length === 0 ? (
                <div className="py-10 text-center" style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>还没有发布过瞬间～</div>
              ) : (
                <div className="flex flex-col gap-3 mb-5">
                  {myPosts.map((p, i) => {
                    const tc = postTagColor[p.tag] || { bg: 'rgba(245,239,232,0.06)', color: 'rgba(245,239,232,0.6)' };
                    return (
                      <motion.div key={p.id} className="p-3"
                        style={{ background: `${accentColor}0d`, borderRadius: 14, border: '1px solid rgba(245,239,232,0.05)' }}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5" style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, borderRadius: 6 }}>{p.tag}</span>
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>{p.time}</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.85)', fontSize: 13, lineHeight: 1.55 }} className="line-clamp-3">{p.content}</p>
                        <div className="flex items-center gap-4 mt-2.5" style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>
                          <span className="flex items-center gap-1"><Heart size={12} /> {p.likes}</span>
                          <span className="flex items-center gap-1"><MessageCircle size={12} /> {p.comments}</span>
                          <span>· 收藏 {p.bookmarks}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })()}

          {/* ========= 成长轨迹 Tab —— 学习记录/场景完成 ========= */}
          {tab === 'journey' && (() => {
            const myActivities = isNewUser ? [] : activities;
            return (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>成长轨迹</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>练习·打卡·成就记录</span>
              </div>
              {myActivities.length === 0 ? (
                <div className="py-10 text-center" style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>还没有成长记录，开始你的第一次练习吧！</div>
              ) : (
              <div className="mb-5">
                {myActivities.map((activity, i) => (
                  <motion.div key={i} className="flex items-start gap-3 py-3"
                    style={{ borderBottom: i < myActivities.length - 1 ? '1px solid rgba(245,239,232,0.06)' : 'none' }}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${activity.color}15` }}>
                      <span style={{ fontSize: 14 }}>{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ color: 'rgba(245,239,232,0.75)', fontSize: 13, lineHeight: 1.55 }}>{activity.text}</p>
                      <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10, marginTop: 2, display: 'block' }}>{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              )}

              {/* 推荐好友 */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14 }}>👥</span>
                    <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>推荐好友</span>
                  </div>
                </div>
                {friendSuggestions.map((friend, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 mb-2" style={{ background: `${accentColor}10`, borderRadius: 12, transition: 'background 0.4s ease' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'rgba(155,126,222,0.15)', fontSize: 18 }}
                      onClick={(e) => { e.stopPropagation(); openProfile({ name: friend.name, emoji: friend.emoji, species: friend.species, level: 'Lv.' + friend.level }); }}>
                      {friend.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{friend.name}</p>
                      <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 10 }}>{friend.species} · Lv.{friend.level} · {friend.mutual}个共同好友</span>
                    </div>
                    <motion.button className="px-3 py-1.5"
                      style={{
                        background: followedIds.includes(i) ? 'rgba(245,239,232,0.06)' : 'rgba(255,138,128,0.12)',
                        borderRadius: 8,
                        color: followedIds.includes(i) ? 'rgba(245,239,232,0.4)' : '#FF8A80',
                        fontSize: 11, fontWeight: 700,
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFollow(i)}>
                      {followedIds.includes(i) ? '已关注' : '关注'}
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* 邀请 */}
              <motion.button className="w-full py-3.5 flex items-center justify-center gap-2 mb-6"
                style={{ background: `linear-gradient(135deg, ${currentFrameColor}, ${accentColor})`, borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 700, transition: 'background 0.4s ease' }}
                whileTap={{ scale: 0.98 }}>
                🎁 邀请好友一起成长
              </motion.button>
            </div>
            );
          })()}

          {/* ========= 装扮 Tab：徽章 + 头像框 ========= */}
          {tab === 'frames' && (
            <div>
              {/* —— 徽章选择区 —— */}
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>我的徽章</span>
                <span style={{ color: 'rgba(245,239,232,0.45)', fontSize: 11 }}>
                  已佩戴 {equippedIds.length}/{MAX_EQUIPPED}
                </span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, marginBottom: 12 }}>
                点击已解锁徽章佩戴，最多同时展示 3 枚
              </p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {badgePool.map(b => {
                  const owned = earnedIds.includes(b.id);
                  const equipped = equippedIds.includes(b.id);
                  return (
                    <motion.button key={b.id}
                      className="relative flex flex-col items-center gap-1 p-3"
                      style={{
                        background: equipped ? `${b.color}22` : owned ? `${accentColor}08` : 'rgba(245,239,232,0.03)',
                        borderRadius: 14,
                        border: equipped ? `2px solid ${b.color}80` : '2px solid rgba(245,239,232,0.06)',
                        opacity: owned ? 1 : 0.5,
                        transition: 'all 0.25s ease',
                      }}
                      whileTap={owned ? { scale: 0.95 } : {}}
                      onClick={() => toggleEquip(b.id)}
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        {(b as any).img ? (
                          <img src={(b as any).img} alt="" style={{ width: 48, height: 48, objectFit: 'contain', filter: owned ? `drop-shadow(0 2px 6px ${b.color}80)` : 'grayscale(0.8)' }} />
                        ) : (
                          <span style={{ fontSize: 24 }}>{b.icon}</span>
                        )}
                      </div>
                      <span style={{ color: equipped ? b.color : '#f5efe8', fontSize: 11, fontWeight: 700 }}>{b.name}</span>
                      <span className="px-1.5 py-0.5" style={{
                        background: `${rarityColor[b.rarity as keyof typeof rarityColor]}22`,
                        color: rarityColor[b.rarity as keyof typeof rarityColor],
                        fontSize: 9, fontWeight: 700, borderRadius: 4,
                      }}>{rarityLabel[b.rarity as keyof typeof rarityLabel]}</span>
                      {!owned && (
                        <div className="flex items-center gap-0.5" style={{ color: 'rgba(245,239,232,0.4)', fontSize: 9 }}>
                          <Lock size={9} /> {b.unlockHint || '未解锁'}
                        </div>
                      )}
                      {equipped && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: b.color }}>
                          <Check size={10} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* —— 头像框区 —— */}
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 700 }}>头像框</span>
              </div>
              <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginBottom: 14 }}>选择你喜欢的头像框风格，个性装扮你的社交形象</p>
              {/* 实时预览区 */}
              <div className="flex items-center justify-center mb-5 py-4" style={{ background: `${currentFrameColor}08`, borderRadius: 16, border: `1px solid ${currentFrameColor}15`, transition: 'all 0.4s ease' }}>
                <div className="relative" style={{ width: 80, height: 80 }}>
                  <motion.div className="absolute inset-0 rounded-full" key={activeFrame}
                    style={{ background: `linear-gradient(135deg, ${currentFrameColor}, ${currentFrameColor}66)` }}
                    initial={{ opacity: 0.2, scale: 1.1 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: 1.1 }}
                    transition={{ opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }} />
                  <div className="absolute rounded-full overflow-hidden" style={{ top: 5, left: 5, width: 70, height: 70, border: `3px solid ${currentFrameColor}`, boxShadow: `0 0 20px ${currentFrameColor}40`, transition: 'all 0.3s ease' }}>
                    <ImageWithFallback src="/avatars/face5.webp" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="ml-4">
                  <span style={{ color: currentFrameColor, fontSize: 14, fontWeight: 700, display: 'block', transition: 'color 0.3s' }}>{avatarFrames.find(f => f.id === activeFrame)?.name || '默认'}</span>
                  <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11 }}>当前头像框</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {avatarFrames.map(frame => (
                  <motion.button key={frame.id} className="relative p-3 flex flex-col items-center gap-2"
                    style={{
                      background: activeFrame === frame.id ? `${frame.color}18` : `${accentColor}08`,
                      borderRadius: 16,
                      border: activeFrame === frame.id ? `2px solid ${frame.color}60` : '2px solid rgba(245,239,232,0.06)',
                      opacity: frame.unlocked ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                    }}
                    whileTap={frame.unlocked ? { scale: 0.95 } : {}}
                    onClick={() => { if (frame.unlocked) { setActiveFrame(frame.id); user.updateUser({ avatarFrame: frame.id }); } }}>
                    {/* 头像预览 */}
                    <div className="relative" style={{ width: 52, height: 52 }}>
                      <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${frame.color}, ${frame.color}66)`, opacity: 0.4 }} />
                      <div className="absolute rounded-full overflow-hidden" style={{ top: 4, left: 4, width: 44, height: 44, border: `2px solid ${frame.color}` }}>
                        <ImageWithFallback src="/avatars/face5.webp" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span style={{ color: activeFrame === frame.id ? frame.color : 'rgba(245,239,232,0.7)', fontSize: 11, fontWeight: 600 }}>{frame.name}</span>
                    {!frame.unlocked && (
                      <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 9 }}>🔒 {frame.hint}</span>
                    )}
                    {activeFrame === frame.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: frame.color, fontSize: 8, color: '#fff' }}>✓</div>
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button className="w-full py-3 flex items-center justify-center gap-2 mb-6"
                style={{ background: `${accentColor}15`, borderRadius: 12, border: `1px solid ${accentColor}25`, color: accentColor, fontSize: 13, fontWeight: 600, transition: 'all 0.4s ease' }}
                whileTap={{ scale: 0.98 }}>
                <IcSparkle size={14} color={accentColor} /> 更多头像框
              </motion.button>
            </div>
          )}

          {/* ========= 主题皮肤 Tab ========= */}
          {tab === 'skins' && (
            <div>
              <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 12, marginBottom: 14 }}>切换主题配色，打造你的专属视觉风格</p>
              {/* 当前主题预览条 */}
              <div className="flex items-center gap-3 p-3 mb-4" style={{ background: `${accentColor}10`, borderRadius: 12, border: `1px solid ${accentColor}20`, transition: 'all 0.5s ease' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: pageBg, position: 'relative', overflow: 'hidden', border: `2px solid ${accentColor}40`, transition: 'all 0.5s ease' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `linear-gradient(0deg, ${accentColor}50, transparent)` }} />
                </div>
                <div className="flex-1">
                  <span style={{ color: accentColor, fontSize: 13, fontWeight: 700, transition: 'color 0.4s ease' }}>当前：{currentSkin.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: pageBg, transition: 'background 0.4s ease' }} />
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: accentColor, transition: 'background 0.4s ease' }} />
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: `${accentColor}40`, transition: 'background 0.4s ease' }} />
                  </div>
                </div>
                <span style={{ color: `${accentColor}80`, fontSize: 10, fontWeight: 600 }}>已应用 ✓</span>
              </div>
              <div className="flex flex-col gap-3 mb-6">
                {skins.map(skin => (
                  <motion.button key={skin.id} className="flex items-center gap-4 p-4"
                    style={{
                      background: activeSkin === skin.id ? `${skin.accent}15` : `${accentColor}06`,
                      borderRadius: 14,
                      border: activeSkin === skin.id ? `2px solid ${skin.accent}50` : '2px solid rgba(245,239,232,0.06)',
                      transition: 'all 0.3s ease',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveSkin(skin.id); user.updateUser({ skinId: skin.id }); }}>
                    {/* 颜色预览 */}
                    <div className="flex-shrink-0" style={{ width: 48, height: 48, borderRadius: 12, background: skin.bg, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `linear-gradient(0deg, ${skin.accent}40, transparent)` }} />
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full" style={{ background: skin.accent }} />
                    </div>
                    <div className="flex-1 text-left">
                      <span style={{ color: activeSkin === skin.id ? skin.accent : '#f5efe8', fontSize: 14, fontWeight: 600, display: 'block' }}>{skin.name}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: skin.bg }} />
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: skin.accent }} />
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: `${skin.accent}40` }} />
                      </div>
                    </div>
                    {activeSkin === skin.id && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: skin.accent, color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="p-3 flex items-center gap-3 mb-6" style={{ background: 'rgba(255,217,61,0.08)', borderRadius: 12, border: '1px solid rgba(255,217,61,0.12)' }}>
                <span style={{ fontSize: 16 }}>👑</span>
                <div className="flex-1">
                  <span style={{ color: '#FFD93D', fontSize: 12, fontWeight: 600, display: 'block' }}>VIP 可解锁全部主题</span>
                  <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>含限定版配色、季节限定主题</span>
                </div>
                <ChevronRight size={14} color="#FFD93D" />
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 'env(safe-area-inset-bottom, 20px)' }} />
      </div>
    </motion.div>
  );
}
