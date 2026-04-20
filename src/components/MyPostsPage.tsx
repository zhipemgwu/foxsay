/**
 * 我的帖子 — 管理自己在社区发布的帖子
 * 功能：查看/编辑/删除帖子，帖子详情（评论/点赞/收藏），与用户互动
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Edit3, Trash2, Send, ThumbsUp, Flag, AtSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcPen, IcChat, IcSparkle, IcHeart, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';
import { useProfileModal } from './ProfileModals';

/* ====== 头像资源 ====== */
const avatarImages = [
  '/avatars/face1.jpg', '/avatars/face2.png', '/avatars/face3.png',
  '/avatars/face4.png', '/avatars/face5.webp', '/avatars/face6.png',
];

/* ====== 我的帖子初始数据 ====== */
export const initialMyPosts = [
  {
    id: 1001,
    content: '今天在咖啡馆练习了搭讪技巧，没想到真的有效果！对方居然主动问我要微信了 😆 感觉AI模拟训练真的有用，至少让我不那么紧张了。分享一下我的经验：保持微笑、找共同话题、不要太刻意。',
    time: '2小时前',
    timestamp: Date.now() - 2 * 3600000,
    tag: '练习心得',
    images: [],
    likes: 24,
    comments: 8,
    bookmarks: 3,
    shares: 2,
    liked: false,
    bookmarked: false,
  },
  {
    id: 1002,
    content: '连续打卡30天了！从一开始的社恐到现在能自然地和异性交流，真的感觉自己进步很大。恋商分数从62涨到了82，继续加油💪',
    time: '昨天',
    timestamp: Date.now() - 24 * 3600000,
    tag: '成长记录',
    images: [],
    likes: 56,
    comments: 15,
    bookmarks: 8,
    shares: 5,
    liked: false,
    bookmarked: false,
  },
  {
    id: 1003,
    content: '请问大家，约会的时候对方一直看手机该怎么办？是不是她对我不感兴趣？还是说现在年轻人都这样？求大佬们指点🥺',
    time: '3天前',
    timestamp: Date.now() - 3 * 24 * 3600000,
    tag: '求助',
    images: [],
    likes: 18,
    comments: 23,
    bookmarks: 1,
    shares: 0,
    liked: false,
    bookmarked: false,
  },
  {
    id: 1004,
    content: '分享一个超好用的开场白：「你好，我注意到你在看XX（对方正在看的东西），我也很喜欢，你觉得XXX怎么样？」自然不做作，亲测有效！',
    time: '5天前',
    timestamp: Date.now() - 5 * 24 * 3600000,
    tag: '技巧分享',
    images: [],
    likes: 89,
    comments: 31,
    bookmarks: 22,
    shares: 14,
    liked: false,
    bookmarked: false,
  },
  {
    id: 1005,
    content: '恋爱物种鉴定出来是老司狐，说我"表面淡定内心波涛汹涌"，太准了吧😂  有没有同款老司狐的朋友来交流一下？',
    time: '1周前',
    timestamp: Date.now() - 7 * 24 * 3600000,
    tag: '练习心得',
    images: [],
    likes: 42,
    comments: 19,
    bookmarks: 5,
    shares: 7,
    liked: false,
    bookmarked: false,
  },
];

/* ====== 评论数据 ====== */
const generateComments = (postId: number) => [
  {
    id: `${postId}-c1`,
    user: '恋爱实习生',
    avatarIdx: 0,
    level: 'Lv.8',
    content: '太厉害了！我也想试试这个方法',
    time: '1小时前',
    likes: 5,
    liked: false,
    replies: [
      { id: `${postId}-c1-r1`, user: '温柔小太阳', avatarIdx: 3, content: '我也觉得超有用！', time: '45分钟前', likes: 2, liked: false },
    ],
  },
  {
    id: `${postId}-c2`,
    user: '月亮代表我的心',
    avatarIdx: 1,
    level: 'Lv.15',
    content: '加油！坚持就是胜利，我当初也是这样一步步走过来的 💪',
    time: '3小时前',
    likes: 12,
    liked: false,
    replies: [],
  },
  {
    id: `${postId}-c3`,
    user: '星河漫步者',
    avatarIdx: 5,
    level: 'Lv.19',
    content: '写得很好，收藏了！有机会交流一下心得',
    time: '5小时前',
    likes: 8,
    liked: false,
    replies: [
      { id: `${postId}-c3-r1`, user: '窦国立', avatarIdx: 2, content: '同意，内容很有参考价值', time: '4小时前', likes: 3, liked: false },
      { id: `${postId}-c3-r2`, user: '恋爱实习生', avatarIdx: 0, content: '@星河漫步者 可以的！随时交流', time: '3小时前', likes: 1, liked: false },
    ],
  },
  {
    id: `${postId}-c4`,
    user: '情感小确幸',
    avatarIdx: 4,
    level: 'Lv.6',
    content: '哈哈哈笑死我了，感同身受！',
    time: '8小时前',
    likes: 3,
    liked: false,
    replies: [],
  },
  {
    id: `${postId}-c5`,
    user: '占方剑',
    avatarIdx: 2,
    level: 'Lv.22',
    content: '作为恋爱导师来说几句：这个方向是对的，但要注意把握分寸，不要过度用力。自然和真诚永远是最重要的。',
    time: '昨天',
    likes: 28,
    liked: false,
    replies: [
      { id: `${postId}-c5-r1`, user: '月亮代表我的心', avatarIdx: 1, content: '导师说得对！真诚最重要', time: '12小时前', likes: 6, liked: false },
    ],
  },
];

const tagColors: Record<string, { bg: string; color: string }> = {
  '练习心得': { bg: 'rgba(255,138,128,0.12)', color: '#FF8A80' },
  '技巧分享': { bg: 'rgba(78,205,196,0.12)', color: '#4ECDC4' },
  '成长记录': { bg: 'rgba(155,126,222,0.12)', color: '#B39DDB' },
  '求助': { bg: 'rgba(255,183,77,0.12)', color: '#FFB74D' },
};

export function MyPostsPage({ onClose }: { onClose: () => void }) {
  const user = useUser();
  const { openProfile } = useProfileModal();
  const [posts, setPosts] = useState(initialMyPosts);
  const [viewingPost, setViewingPost] = useState<typeof initialMyPosts[0] | null>(null);
  const [editingPost, setEditingPost] = useState<typeof initialMyPosts[0] | null>(null);
  const [editText, setEditText] = useState('');
  const [editTag, setEditTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [comments, setComments] = useState<ReturnType<typeof generateComments>>([]);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; user: string } | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'hot'>('time');
  const inputRef = useRef<HTMLInputElement>(null);

  // 打开帖子详情
  const openPost = (post: typeof initialMyPosts[0]) => {
    setViewingPost(post);
    setComments(generateComments(post.id));
    setCommentInput('');
    setReplyingTo(null);
  };

  // 点赞帖子
  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    if (viewingPost?.id === id) {
      setViewingPost(prev => prev ? { ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 } : null);
    }
  };

  // 收藏帖子
  const toggleBookmark = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, bookmarked: !p.bookmarked, bookmarks: p.bookmarked ? p.bookmarks - 1 : p.bookmarks + 1 } : p));
    if (viewingPost?.id === id) {
      setViewingPost(prev => prev ? { ...prev, bookmarked: !prev.bookmarked, bookmarks: prev.bookmarked ? prev.bookmarks - 1 : prev.bookmarks + 1 } : null);
    }
  };

  // 删除帖子
  const deletePost = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
    setShowMenu(null);
    if (viewingPost?.id === id) setViewingPost(null);
  };

  // 开始编辑
  const startEdit = (post: typeof initialMyPosts[0]) => {
    setEditingPost(post);
    setEditText(post.content);
    setEditTag(post.tag);
    setShowMenu(null);
  };

  // 保存编辑
  const saveEdit = () => {
    if (!editingPost || !editText.trim()) return;
    setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, content: editText.trim(), tag: editTag } : p));
    if (viewingPost?.id === editingPost.id) {
      setViewingPost(prev => prev ? { ...prev, content: editText.trim(), tag: editTag } : null);
    }
    setEditingPost(null);
  };

  // 评论点赞
  const toggleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 };
      return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r) };
    }));
  };

  // 发送评论
  const sendComment = () => {
    if (!commentInput.trim() || !viewingPost) return;
    const newComment = {
      id: `${viewingPost.id}-c${Date.now()}`,
      user: user.name,
      avatarIdx: 4,
      level: `Lv.${user.level}`,
      content: replyingTo ? `@${replyingTo.user} ${commentInput.trim()}` : commentInput.trim(),
      time: '刚刚',
      likes: 0,
      liked: false,
      replies: [] as { id: string; user: string; avatarIdx: number; content: string; time: string; likes: number; liked: boolean }[],
    };
    if (replyingTo) {
      setComments(prev => prev.map(c => {
        if (c.id === replyingTo!.id) {
          return { ...c, replies: [...c.replies, { id: newComment.id, user: newComment.user, avatarIdx: newComment.avatarIdx, content: commentInput.trim(), time: '刚刚', likes: 0, liked: false }] };
        }
        return { ...c, replies: c.replies.map(r => r.id === replyingTo!.id ? r : r) };
      }));
    } else {
      setComments(prev => [newComment, ...prev]);
    }
    // 更新评论计数
    setPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, comments: p.comments + 1 } : p));
    setViewingPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    setCommentInput('');
    setReplyingTo(null);
  };

  const sortedPosts = [...posts].sort((a, b) => sortBy === 'time' ? b.timestamp - a.timestamp : (b.likes + b.comments) - (a.likes + a.comments));

  return (
    <motion.div
      className="fixed inset-0 z-[1100] flex flex-col"
      style={{ background: '#2b2535' }}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* ======== 帖子列表页 ======== */}
      {!viewingPost && (
        <>
          {/* 顶栏 */}
          <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
            <div className="flex items-center justify-between px-5 h-12">
              <div className="flex items-center gap-3">
                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                  <ChevronLeft size={22} color="rgba(245,239,232,0.6)" />
                </motion.button>
                <span style={{ color: '#f5efe8', fontSize: 17, fontWeight: 700 }}>我的帖子</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>{posts.length}篇</span>
              </div>
              {/* 排序切换 */}
              <div className="flex items-center gap-1 p-0.5" style={{ background: 'rgba(245,239,232,0.04)', borderRadius: 8 }}>
                {(['time', 'hot'] as const).map(s => (
                  <motion.button key={s} className="px-3 py-1" whileTap={{ scale: 0.95 }}
                    style={{ borderRadius: 6, background: sortBy === s ? 'rgba(155,126,222,0.2)' : 'transparent', color: sortBy === s ? '#B39DDB' : 'rgba(245,239,232,0.4)', fontSize: 11, fontWeight: 600 }}
                    onClick={() => setSortBy(s)}>
                    {s === 'time' ? '最新' : '最热'}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* 统计条 */}
          <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: '1px solid rgba(245,239,232,0.06)' }}>
            <div className="flex items-center gap-1.5">
              <Heart size={13} color="#FF8A80" />
              <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12 }}>共 <span style={{ color: '#FF8A80', fontWeight: 700 }}>{posts.reduce((a, p) => a + p.likes, 0)}</span> 赞</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={13} color="#B39DDB" />
              <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12 }}>共 <span style={{ color: '#B39DDB', fontWeight: 700 }}>{posts.reduce((a, p) => a + p.comments, 0)}</span> 评论</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bookmark size={13} color="#4ECDC4" />
              <span style={{ color: 'rgba(245,239,232,0.6)', fontSize: 12 }}>共 <span style={{ color: '#4ECDC4', fontWeight: 700 }}>{posts.reduce((a, p) => a + p.bookmarks, 0)}</span> 收藏</span>
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="flex-1 overflow-y-auto">
            {sortedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <span style={{ fontSize: 48, marginBottom: 12 }}>📝</span>
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 14 }}>还没有发布过帖子</span>
                <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 12, marginTop: 4 }}>去社区发布你的第一条帖子吧</span>
              </div>
            ) : (
              sortedPosts.map((post, idx) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  style={{ borderBottom: '1px solid rgba(245,239,232,0.06)' }}>
                  <div className="px-5 py-4">
                    {/* 头部：头像 + 名字 + 标签 + 更多按钮 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                          <ImageWithFallback src="/avatars/face5.webp" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600 }}>{user.name}</span>
                            <span style={{ color: '#B39DDB', fontSize: 10, fontWeight: 600 }}>Lv.{user.level}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 10 }}>{post.time}</span>
                            <span className="px-1.5 py-0.5" style={{ ...tagColors[post.tag], borderRadius: 4, fontSize: 9, fontWeight: 600 }}>{post.tag}</span>
                          </div>
                        </div>
                      </div>
                      {/* 更多操作 */}
                      <div className="relative">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}>
                          <MoreHorizontal size={18} color="rgba(245,239,232,0.4)" />
                        </motion.button>
                        <AnimatePresence>
                          {showMenu === post.id && (
                            <motion.div className="absolute right-0 top-6 flex flex-col overflow-hidden"
                              style={{ background: '#453a60', borderRadius: 12, border: '1px solid rgba(245,239,232,0.08)', minWidth: 120, zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                              initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                              <motion.button className="flex items-center gap-2.5 px-4 py-3 text-left" whileTap={{ scale: 0.98 }}
                                style={{ borderBottom: '1px solid rgba(245,239,232,0.06)' }}
                                onClick={() => startEdit(post)}>
                                <Edit3 size={14} color="#B39DDB" />
                                <span style={{ color: '#f5efe8', fontSize: 13 }}>编辑帖子</span>
                              </motion.button>
                              <motion.button className="flex items-center gap-2.5 px-4 py-3 text-left" whileTap={{ scale: 0.98 }}
                                onClick={() => { setShowDeleteConfirm(post.id); setShowMenu(null); }}>
                                <Trash2 size={14} color="#FF8A80" />
                                <span style={{ color: '#FF8A80', fontSize: 13 }}>删除帖子</span>
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* 内容 — 点击进入详情 */}
                    <motion.button className="w-full text-left mb-3" whileTap={{ scale: 0.99 }} onClick={() => openPost(post)}>
                      <p style={{ color: 'rgba(245,239,232,0.85)', fontSize: 14, lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.content}
                      </p>
                    </motion.button>

                    {/* 底部交互栏 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(post.id)}>
                          <Heart size={15} color={post.liked ? '#FF8A80' : 'rgba(245,239,232,0.35)'} fill={post.liked ? '#FF8A80' : 'none'} />
                          <span style={{ color: post.liked ? '#FF8A80' : 'rgba(245,239,232,0.35)', fontSize: 12, fontWeight: 500 }}>{post.likes}</span>
                        </motion.button>
                        <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}
                          onClick={() => openPost(post)}>
                          <MessageCircle size={15} color="rgba(245,239,232,0.35)" />
                          <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 12, fontWeight: 500 }}>{post.comments}</span>
                        </motion.button>
                        <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}
                          onClick={() => toggleBookmark(post.id)}>
                          <Bookmark size={15} color={post.bookmarked ? '#4ECDC4' : 'rgba(245,239,232,0.35)'} fill={post.bookmarked ? '#4ECDC4' : 'none'} />
                          <span style={{ color: post.bookmarked ? '#4ECDC4' : 'rgba(245,239,232,0.35)', fontSize: 12, fontWeight: 500 }}>{post.bookmarks}</span>
                        </motion.button>
                      </div>
                      <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}>
                        <Share2 size={13} color="rgba(245,239,232,0.25)" />
                        <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 11 }}>{post.shares}</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div style={{ height: 'env(safe-area-inset-bottom, 20px)' }} />
          </div>
        </>
      )}

      {/* ======== 帖子详情页 ======== */}
      <AnimatePresence>
        {viewingPost && (
          <motion.div className="absolute inset-0 flex flex-col" style={{ background: '#2b2535', zIndex: 2 }}
            initial={{ opacity: 0, x: '30%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '30%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            {/* 详情顶栏 */}
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-12">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setViewingPost(null)}>
                  <ChevronLeft size={22} color="rgba(245,239,232,0.6)" />
                </motion.button>
                <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 600 }}>帖子详情</span>
                <div className="flex items-center gap-3">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => startEdit(viewingPost)}>
                    <Edit3 size={17} color="rgba(245,239,232,0.5)" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowDeleteConfirm(viewingPost.id)}>
                    <Trash2 size={17} color="rgba(255,138,128,0.5)" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* 帖子内容 + 评论列表 */}
            <div className="flex-1 overflow-y-auto">
              {/* 帖子正文 */}
              <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(245,239,232,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <ImageWithFallback src="/avatars/face5.webp" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>{user.name}</span>
                      <span style={{ color: '#B39DDB', fontSize: 10, fontWeight: 600 }}>Lv.{user.level}</span>
                      <span className="px-1.5 py-0.5" style={{ ...tagColors[viewingPost.tag], borderRadius: 4, fontSize: 9, fontWeight: 600 }}>{viewingPost.tag}</span>
                    </div>
                    <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: 11 }}>{viewingPost.time}</span>
                  </div>
                </div>
                <p style={{ color: 'rgba(245,239,232,0.9)', fontSize: 15, lineHeight: 1.75, marginBottom: 16 }}>{viewingPost.content}</p>

                {/* 交互数据栏 */}
                <div className="flex items-center gap-4 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.06)' }}>
                  <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLike(viewingPost.id)}>
                    <motion.div animate={viewingPost.liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                      <Heart size={18} color={viewingPost.liked ? '#FF8A80' : 'rgba(245,239,232,0.4)'} fill={viewingPost.liked ? '#FF8A80' : 'none'} />
                    </motion.div>
                    <span style={{ color: viewingPost.liked ? '#FF8A80' : 'rgba(245,239,232,0.4)', fontSize: 13, fontWeight: 600 }}>{viewingPost.likes}</span>
                  </motion.button>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={18} color="rgba(245,239,232,0.4)" />
                    <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 13, fontWeight: 600 }}>{viewingPost.comments}</span>
                  </div>
                  <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.9 }}
                    onClick={() => toggleBookmark(viewingPost.id)}>
                    <motion.div animate={viewingPost.bookmarked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                      <Bookmark size={18} color={viewingPost.bookmarked ? '#4ECDC4' : 'rgba(245,239,232,0.4)'} fill={viewingPost.bookmarked ? '#4ECDC4' : 'none'} />
                    </motion.div>
                    <span style={{ color: viewingPost.bookmarked ? '#4ECDC4' : 'rgba(245,239,232,0.4)', fontSize: 13, fontWeight: 600 }}>{viewingPost.bookmarks}</span>
                  </motion.button>
                  <motion.button className="flex items-center gap-1.5 ml-auto" whileTap={{ scale: 0.9 }}>
                    <Share2 size={16} color="rgba(245,239,232,0.3)" />
                    <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 12 }}>分享</span>
                  </motion.button>
                </div>
              </div>

              {/* 评论区标题 */}
              <div className="flex items-center justify-between px-5 py-3">
                <span style={{ color: '#f5efe8', fontSize: 14, fontWeight: 600 }}>评论 ({comments.length})</span>
                <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 11 }}>按热度排序</span>
              </div>

              {/* 评论列表 */}
              {comments.map((comment) => (
                <div key={comment.id} className="px-5 py-3" style={{ borderBottom: '1px solid rgba(245,239,232,0.04)' }}>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-0.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); openProfile({ name: comment.user, avatarIdx: comment.avatarIdx, level: comment.level }); }}>
                      <ImageWithFallback src={avatarImages[comment.avatarIdx]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: '#f5efe8', fontSize: 12, fontWeight: 600 }}>{comment.user}</span>
                        <span style={{ color: 'rgba(155,126,222,0.5)', fontSize: 9, fontWeight: 600 }}>{comment.level}</span>
                        <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9 }}>{comment.time}</span>
                      </div>
                      <p style={{ color: 'rgba(245,239,232,0.8)', fontSize: 13, lineHeight: 1.55, marginBottom: 6 }}>{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9 }}
                          onClick={() => toggleCommentLike(comment.id)}>
                          <ThumbsUp size={12} color={comment.liked ? '#FF8A80' : 'rgba(245,239,232,0.3)'} fill={comment.liked ? '#FF8A80' : 'none'} />
                          <span style={{ color: comment.liked ? '#FF8A80' : 'rgba(245,239,232,0.3)', fontSize: 10 }}>{comment.likes}</span>
                        </motion.button>
                        <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9 }}
                          onClick={() => { setReplyingTo({ id: comment.id, user: comment.user }); inputRef.current?.focus(); }}>
                          <MessageCircle size={12} color="rgba(245,239,232,0.3)" />
                          <span style={{ color: 'rgba(245,239,232,0.3)', fontSize: 10 }}>回复</span>
                        </motion.button>
                      </div>

                      {/* 回复列表 */}
                      {comment.replies.length > 0 && (
                        <div className="mt-2 pl-2" style={{ borderLeft: '2px solid rgba(245,239,232,0.06)' }}>
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex gap-2.5 py-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); openProfile({ name: reply.user, avatarIdx: reply.avatarIdx }); }}>
                                <ImageWithFallback src={avatarImages[reply.avatarIdx]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span style={{ color: 'rgba(245,239,232,0.7)', fontSize: 11, fontWeight: 600 }}>{reply.user}</span>
                                  <span style={{ color: 'rgba(245,239,232,0.2)', fontSize: 8 }}>{reply.time}</span>
                                </div>
                                <p style={{ color: 'rgba(245,239,232,0.65)', fontSize: 12, lineHeight: 1.5 }}>{reply.content}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleCommentLike(reply.id)}>
                                    <ThumbsUp size={10} color={reply.liked ? '#FF8A80' : 'rgba(245,239,232,0.25)'} fill={reply.liked ? '#FF8A80' : 'none'} />
                                    <span style={{ color: reply.liked ? '#FF8A80' : 'rgba(245,239,232,0.25)', fontSize: 9 }}>{reply.likes}</span>
                                  </motion.button>
                                  <motion.button className="flex items-center gap-1" whileTap={{ scale: 0.9 }}
                                    onClick={() => { setReplyingTo({ id: comment.id, user: reply.user }); inputRef.current?.focus(); }}>
                                    <MessageCircle size={10} color="rgba(245,239,232,0.25)" />
                                    <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 9 }}>回复</span>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ height: 80 }} />
            </div>

            {/* 底部评论输入栏 */}
            <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3"
              style={{ background: '#352f45', borderTop: '1px solid rgba(245,239,232,0.08)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
              {replyingTo && (
                <div className="absolute -top-8 left-4 right-4 flex items-center justify-between px-3 py-1.5" style={{ background: '#453a60', borderRadius: '8px 8px 0 0' }}>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>回复 <span style={{ color: '#B39DDB' }}>@{replyingTo.user}</span></span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setReplyingTo(null)}>
                    <X size={14} color="rgba(245,239,232,0.4)" />
                  </motion.button>
                </div>
              )}
              <div className="flex-1 flex items-center px-3 py-2" style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 20 }}>
                <input ref={inputRef} value={commentInput} onChange={e => setCommentInput(e.target.value)}
                  placeholder={replyingTo ? `回复 @${replyingTo.user}...` : '写评论...'}
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: '#f5efe8', fontSize: 13 }}
                  onKeyDown={e => e.key === 'Enter' && sendComment()} />
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={sendComment}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: commentInput.trim() ? gradients.coral : 'rgba(245,239,232,0.06)' }}>
                <Send size={16} color={commentInput.trim() ? '#fff' : 'rgba(245,239,232,0.3)'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== 编辑帖子弹窗 ======== */}
      <AnimatePresence>
        {editingPost && (
          <motion.div className="fixed inset-0 z-[1200] flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setEditingPost(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#352f45', borderRadius: '20px 20px 0 0' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              {/* 编辑顶栏 */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(245,239,232,0.08)' }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingPost(null)}>
                  <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 14 }}>取消</span>
                </motion.button>
                <span style={{ color: '#f5efe8', fontSize: 15, fontWeight: 600 }}>编辑帖子</span>
                <motion.button whileTap={{ scale: 0.95 }} onClick={saveEdit}
                  style={{ background: editText.trim() ? gradients.coral : 'rgba(245,239,232,0.08)', borderRadius: 8, padding: '6px 16px' }}>
                  <span style={{ color: editText.trim() ? '#fff' : 'rgba(245,239,232,0.3)', fontSize: 13, fontWeight: 600 }}>保存</span>
                </motion.button>
              </div>

              {/* 标签选择 */}
              <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: 12 }}>标签：</span>
                {Object.keys(tagColors).map(tag => (
                  <motion.button key={tag} className="px-2.5 py-1" whileTap={{ scale: 0.95 }}
                    style={{
                      borderRadius: 6,
                      background: editTag === tag ? tagColors[tag].bg : 'rgba(245,239,232,0.04)',
                      border: editTag === tag ? `1px solid ${tagColors[tag].color}30` : '1px solid transparent',
                      color: editTag === tag ? tagColors[tag].color : 'rgba(245,239,232,0.4)',
                      fontSize: 11, fontWeight: 600,
                    }}
                    onClick={() => setEditTag(tag)}>
                    {tag}
                  </motion.button>
                ))}
              </div>

              {/* 内容编辑区 */}
              <div className="px-5 py-3">
                <textarea value={editText} onChange={e => setEditText(e.target.value)}
                  className="w-full bg-transparent outline-none resize-none"
                  style={{ color: '#f5efe8', fontSize: 14, lineHeight: 1.7, minHeight: 160, maxHeight: 300 }}
                  placeholder="编辑帖子内容..." />
              </div>

              {/* 字数统计 */}
              <div className="px-5 pb-4 flex items-center justify-between">
                <span style={{ color: 'rgba(245,239,232,0.25)', fontSize: 11 }}>{editText.length} 字</span>
                <span style={{ color: editText.length > 500 ? '#FF8A80' : 'rgba(245,239,232,0.25)', fontSize: 11 }}>上限 500 字</span>
              </div>

              <div style={{ height: 'env(safe-area-inset-bottom, 12px)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== 删除确认弹窗 ======== */}
      <AnimatePresence>
        {showDeleteConfirm !== null && (
          <motion.div className="fixed inset-0 z-[1200] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowDeleteConfirm(null)} />
            <motion.div className="relative p-6 mx-5" style={{ background: '#453a60', borderRadius: 20, maxWidth: 320, width: '100%' }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,138,128,0.12)' }}>
                  <Trash2 size={24} color="#FF8A80" />
                </div>
                <h3 style={{ color: '#f5efe8', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>确认删除？</h3>
                <p style={{ color: 'rgba(245,239,232,0.5)', fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
                  删除后将无法恢复，帖子下的所有评论也将被清除
                </p>
                <div className="flex gap-3 w-full">
                  <motion.button className="flex-1 py-2.5" whileTap={{ scale: 0.95 }}
                    style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 10, color: 'rgba(245,239,232,0.6)', fontSize: 14, fontWeight: 600 }}
                    onClick={() => setShowDeleteConfirm(null)}>
                    取消
                  </motion.button>
                  <motion.button className="flex-1 py-2.5" whileTap={{ scale: 0.95 }}
                    style={{ background: '#FF8A80', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700 }}
                    onClick={() => deletePost(showDeleteConfirm)}>
                    删除
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 拦截 menu 外部点击 */}
      {showMenu !== null && (
        <div className="fixed inset-0 z-[1]" onClick={() => setShowMenu(null)} />
      )}
    </motion.div>
  );
}
