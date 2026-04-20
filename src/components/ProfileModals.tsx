/**
 * 全站用户资料弹窗系统
 *   - CoachProfileModal: 导师资料弹窗（+号关注 + 预约指导）
 *   - UserProfileModal: 普通用户资料弹窗（+号关注，无预约）
 *   - ProfileModalProvider: 全局 Context，任意位置调用 openProfile(...)
 *
 * 使用：
 *   const { openProfile } = useProfileModal();
 *   <div onClick={e => { e.stopPropagation(); openProfile({ name, avatarIdx }); }}>...</div>
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Check, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IcStar, IcChat, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';
import { bookCoach } from './CoachChatPage';
import { COACHES, isCoachName } from '../data/coaches';

/* ===== 导师名册 & 数据（从集中数据源构建） ===== */
const COACH_MAP: Record<string, {
  avatarIdx: number;
  desc: string;
  followers: string;
  articles: number;
  id: number;
  specialties: string[];
}> = Object.fromEntries(
  COACHES.map((c, idx) => [c.name, {
    id: c.id,
    avatarIdx: idx,
    desc: c.desc,
    followers: c.followers,
    articles: c.articles,
    specialties: c.specialties,
  }])
);

export { isCoachName };

/* ===== 头像图库 ===== */
const avatarImages = [
  '/avatars/face1.jpg',
  '/avatars/face2.png',
  '/avatars/face3.png',
  '/avatars/face4.png',
  '/avatars/face5.webp',
  '/avatars/face6.png',
];
const avatarBorders = [gradients.coral, gradients.sky, gradients.rose, gradients.golden, gradients.mint, gradients.purple];

/* ===== 认证徽章 ===== */
function CertifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1l2.39 3.66L18.5 3.5l-1.16 4.11L21 10.5l-3.66 2.39L18.5 17l-4.11-1.16L12 19.5l-2.39-3.66L5.5 17l1.16-4.11L3 10.5l3.66-2.39L5.5 4l4.11 1.16L12 1z" fill="url(#pmCertGrad)" />
      <path d="M9 11l2 2 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="pmCertGrad" x1="3" y1="1" x2="21" y2="19">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ===== 类型 ===== */
export interface ProfilePayload {
  name: string;
  avatarIdx?: number;        // 默认 0
  level?: string;            // 普通用户的等级，例如 "Lv.8 · 恋爱学徒"
  emoji?: string;            // 用于 emoji 头像（如 SocialPage 推荐好友）
  description?: string;      // 个人签名
  species?: string;          // 恋爱物种
}

interface OpenedProfile extends ProfilePayload { isCoach: boolean }

/* ===== Context ===== */
interface ProfileModalCtx {
  openProfile: (p: ProfilePayload) => void;
}

const ProfileModalContext = createContext<ProfileModalCtx>({ openProfile: () => {} });

export function useProfileModal(): ProfileModalCtx {
  return useContext(ProfileModalContext);
}

/* ============================================================
 *  Provider + Modal 渲染
 * ============================================================ */
export function ProfileModalProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<OpenedProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{ name: string; time: string } | null>(null);
  const { toggleFollow, isFollowing } = useUser();

  const openProfile = useCallback((p: ProfilePayload) => {
    setCurrent({ ...p, isCoach: isCoachName(p.name) });
  }, []);

  const close = () => setCurrent(null);

  const following = current ? isFollowing(current.name) : false;

  const handleBook = () => {
    if (!current) return;
    const cd = COACH_MAP[current.name];
    if (!cd) return;
    const t = bookCoach(cd.id, current.name);
    setCurrent(null);
    setBookingSuccess({ name: current.name, time: t });
  };

  return (
    <ProfileModalContext.Provider value={{ openProfile }}>
      {children}

      {/* ====== Modal 本体 ====== */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[1500] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)' }} onClick={close} />
            <motion.div
              className="relative w-[90%] overflow-hidden"
              style={{ maxWidth: 360, background: '#453a60', borderRadius: 20 }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              {/* 头部背景渐变 */}
              <div className="relative" style={{
                height: 80,
                background: current.isCoach
                  ? 'linear-gradient(135deg, rgba(155,126,222,0.35), rgba(255,217,61,0.2))'
                  : 'linear-gradient(135deg, rgba(255,138,128,0.3), rgba(78,205,196,0.2))',
              }}>
                <motion.button className="absolute top-3 right-3" whileTap={{ scale: 0.9 }} onClick={close}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <X size={16} color="#fff" />
                  </div>
                </motion.button>
              </div>

              <div className="px-6 pb-6">
                {/* 头像 */}
                <div className="flex items-end gap-3 -mt-10 mb-4">
                  <div className="flex-shrink-0 p-[3px] rounded-full"
                    style={{
                      background: current.isCoach
                        ? 'linear-gradient(135deg, #FFD54F, #FFA726)'
                        : avatarBorders[(current.avatarIdx ?? 0) % avatarBorders.length],
                    }}>
                    <div className="rounded-full overflow-hidden flex items-center justify-center"
                      style={{ width: 72, height: 72, background: 'rgba(155,126,222,0.2)' }}>
                      {current.emoji ? (
                        <span style={{ fontSize: 36 }}>{current.emoji}</span>
                      ) : (
                        <ImageWithFallback
                          src={avatarImages[(current.avatarIdx ?? 0) % avatarImages.length]}
                          alt={current.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  {/* 关注 + 号按钮（悬浮在头像右下） */}
                  <motion.button
                    className="flex items-center gap-1 px-3 py-1.5 mb-1 flex-shrink-0"
                    style={{
                      background: following ? 'rgba(245,239,232,0.12)' : gradients.coral,
                      borderRadius: 20,
                      border: following ? '1px solid rgba(245,239,232,0.18)' : 'none',
                      boxShadow: following ? 'none' : '0 4px 14px rgba(255,107,107,0.35)',
                    }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggleFollow(current.name)}>
                    {following ? <Check size={13} color="rgba(245,239,232,0.7)" /> : <Plus size={13} color="#fff" strokeWidth={3} />}
                    <span style={{ color: following ? 'rgba(245,239,232,0.7)' : '#fff', fontSize: 12, fontWeight: 700 }}>
                      {following ? '已关注' : '关注'}
                    </span>
                  </motion.button>
                  <div className="flex-1" />
                </div>

                {/* 名字 + 认证徽章 */}
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 style={{ color: '#f5efe8', fontSize: 20, fontWeight: 800 }}>{current.name}</h3>
                  {current.isCoach && <CertifiedBadge size={18} />}
                  {current.isCoach && (
                    <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,217,61,0.2)', borderRadius: 5, color: '#FFD54F', fontSize: 9, fontWeight: 800 }}>认证导师</span>
                  )}
                </div>

                {/* 描述行 */}
                {current.isCoach ? (
                  <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: 12, marginBottom: 14 }}>
                    {COACH_MAP[current.name]?.desc}
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 mb-14px" style={{ marginBottom: 14 }}>
                    {current.level && (
                      <span className="px-1.5 py-0.5" style={{ background: 'rgba(155,126,222,0.22)', borderRadius: 5, color: '#B39DDB', fontSize: 10, fontWeight: 700 }}>
                        {current.level}
                      </span>
                    )}
                    {current.species && (
                      <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>· {current.species}</span>
                    )}
                  </div>
                )}

                {/* 数据统计 */}
                <div className="flex items-center gap-5 py-3 mb-4" style={{ borderTop: '1px solid rgba(245,239,232,0.06)', borderBottom: '1px solid rgba(245,239,232,0.06)' }}>
                  {current.isCoach ? (
                    <>
                      <div className="flex-1 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <IcStar size={12} color="#FFD93D" />
                          <span style={{ color: '#FFD93D', fontSize: 16, fontWeight: 800 }}>4.9</span>
                        </div>
                        <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>评分</span>
                      </div>
                      <div className="w-px h-7" style={{ background: 'rgba(245,239,232,0.08)' }} />
                      <div className="flex-1 text-center">
                        <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>{COACH_MAP[current.name]?.articles}</span>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>专栏</p>
                      </div>
                      <div className="w-px h-7" style={{ background: 'rgba(245,239,232,0.08)' }} />
                      <div className="flex-1 text-center">
                        <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>{COACH_MAP[current.name]?.followers}</span>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>粉丝</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 text-center">
                        <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>
                          {((current.name || '').length * 37 + 23) % 999}
                        </span>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>粉丝</p>
                      </div>
                      <div className="w-px h-7" style={{ background: 'rgba(245,239,232,0.08)' }} />
                      <div className="flex-1 text-center">
                        <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>
                          {((current.name || '').length * 17 + 12) % 288}
                        </span>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>关注</p>
                      </div>
                      <div className="w-px h-7" style={{ background: 'rgba(245,239,232,0.08)' }} />
                      <div className="flex-1 text-center">
                        <span style={{ color: '#f5efe8', fontSize: 16, fontWeight: 800 }}>
                          {((current.name || '').length * 11 + 3) % 66}
                        </span>
                        <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 10 }}>动态</p>
                      </div>
                    </>
                  )}
                </div>

                {/* 专长 / 简介 */}
                {current.isCoach ? (
                  <>
                    <div className="mb-4">
                      <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 8 }}>专长领域</p>
                      <div className="flex flex-wrap gap-1.5">
                        {COACH_MAP[current.name]?.specialties.map(tag => (
                          <span key={tag} className="px-2 py-1" style={{ background: 'rgba(155,126,222,0.14)', borderRadius: 6, color: '#B39DDB', fontSize: 11, fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-5 p-3" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                      <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 4 }}>导师简介</p>
                      <p style={{ color: 'rgba(245,239,232,0.72)', fontSize: 12.5, lineHeight: 1.65 }}>
                        {COACH_MAP[current.name]?.desc}，拥有多年情感咨询经验。已发布 {COACH_MAP[current.name]?.articles} 篇专栏文章，{COACH_MAP[current.name]?.followers} 粉丝关注。一对一指导风格温和耐心，善于发现学员的潜力。
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="mb-5 p-3" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 10 }}>
                    <p style={{ color: 'rgba(245,239,232,0.4)', fontSize: 11, marginBottom: 4 }}>个人签名</p>
                    <p style={{ color: 'rgba(245,239,232,0.72)', fontSize: 12.5, lineHeight: 1.65 }}>
                      {current.description || '这个人很神秘，还没有留下什么～'}
                    </p>
                  </div>
                )}

                {/* 底部操作按钮 */}
                <div className="flex gap-2">
                  {current.isCoach ? (
                    <motion.button
                      className="flex-1 py-3 flex items-center justify-center gap-1.5"
                      style={{ background: gradients.purple, borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleBook}>
                      <IcChat size={14} color="#fff" /> 预约1对1 · ¥299
                    </motion.button>
                  ) : (
                    <motion.button
                      className="flex-1 py-3 flex items-center justify-center gap-1.5"
                      style={{ background: 'rgba(245,239,232,0.08)', borderRadius: 12, color: 'rgba(245,239,232,0.7)', fontSize: 13, fontWeight: 600, border: '1px solid rgba(245,239,232,0.1)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={close}>
                      <MessageCircle size={14} /> 去他的主页
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 预约成功提示 */}
      <AnimatePresence>
        {bookingSuccess && (
          <motion.div
            className="fixed inset-0 z-[1600] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setBookingSuccess(null)} />
            <motion.div className="relative w-[85%] p-6 text-center"
              style={{ maxWidth: 320, background: '#453a60', borderRadius: 20 }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🎉</span>
              <h3 style={{ color: '#f5efe8', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>预约成功</h3>
              <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                已为你预约 <span style={{ color: '#FFD54F', fontWeight: 700 }}>{bookingSuccess.name}</span> 导师<br />
                时间：{bookingSuccess.time}
              </p>
              <motion.button className="w-full py-3"
                style={{ background: gradients.purple, borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setBookingSuccess(null)}>
                知道了
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProfileModalContext.Provider>
  );
}
