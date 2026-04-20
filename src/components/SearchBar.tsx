import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, TrendingUp, Clock } from 'lucide-react';

const hotSearches = ['初次约会话题', '如何表白', '聊天开场白', '约会穿搭', '怎么追女生'];
const recentSearches = ['咖啡馆搭讪', '朋友圈互动技巧'];

const searchableContent = [
  { title: '咖啡馆初见', type: '练习', desc: 'AI 约会模拟场景' },
  { title: '公园约会', type: '练习', desc: '户外浪漫场景训练' },
  { title: '聊天开场白技巧', type: '技巧', desc: '如何自然地开启对话' },
  { title: '约会穿搭指南', type: '技巧', desc: '第一印象很重要' },
  { title: '如何表白成功', type: '话题', desc: '时机、方式与心态' },
  { title: '深度倾听练习', type: '练习', desc: '学会用心倾听对方' },
  { title: '朋友圈互动技巧', type: '技巧', desc: '点赞评论的艺术' },
  { title: '初次约会话题', type: '话题', desc: '避免冷场的秘诀' },
  { title: '暖冬约会', type: '练习', desc: '温馨冬日场景训练' },
  { title: '浪漫晚餐模拟', type: '练习', desc: '正式约会场景练习' },
  { title: '共情式回应模板', type: '话术', desc: '让对方感到被理解' },
  { title: '怎么追女生', type: '话题', desc: '真诚是最好的策略' },
];

export function SearchBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <>
      {/* Compact search trigger — renders as icon button, used inline in Header area */}
      <div className="px-5 pb-2 pt-1">
        <motion.button
          className="w-full flex items-center gap-3 h-10 px-4"
          style={{ background: 'rgba(245,239,232,0.06)', borderRadius: 10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSearch(true)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Search size={15} color="rgba(245,239,232,0.45)" strokeWidth={2} />
          <span style={{ color: 'rgba(245,239,232,0.4)', fontSize: '13px', fontWeight: 400 }}>搜索练习·技巧·话题</span>
        </motion.button>
      </div>

      {/* Full-screen search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }} />
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 flex items-center gap-3 h-11 px-4" style={{ background: '#453a60', borderRadius: 11 }}>
                <Search size={16} color="rgba(245,239,232,0.58)" strokeWidth={2} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="搜索练习·技巧·话题"
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: '#f5efe8', fontSize: '14px' }}
                />
                {query && (
                  <button onClick={() => setQuery('')}>
                    <X size={14} color="rgba(245,239,232,0.5)" />
                  </button>
                )}
              </div>
              <button onClick={() => setShowSearch(false)} style={{ color: '#FF8A80', fontSize: '14px', fontWeight: 500 }}>
                取消
              </button>
            </div>

            <div className="px-5 pt-4 overflow-y-auto flex-1">
              {query.trim() ? (
                <div>
                  {searchableContent.filter(c => c.title.includes(query) || c.desc.includes(query) || c.type.includes(query)).length === 0 ? (
                    <div className="text-center py-12">
                      <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '14px' }}>没有找到相关内容</p>
                    </div>
                  ) : (
                    searchableContent.filter(c => c.title.includes(query) || c.desc.includes(query) || c.type.includes(query)).map((c, i) => (
                      <button key={i} className="w-full flex items-center gap-3 py-3 text-left" style={{ borderBottom: '1px solid rgba(245,239,232,0.08)' }}>
                        <Search size={14} color="rgba(245,239,232,0.55)" />
                        <div className="flex-1 min-w-0">
                          <p style={{ color: '#f5efe8', fontSize: '14px' }}>{c.title}</p>
                          <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px' }}>{c.type} · {c.desc}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <>
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={13} color="rgba(245,239,232,0.5)" />
                    <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: 500 }}>最近搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(s => (
                      <button key={s} className="px-3 py-1.5" style={{ background: '#453a60', borderRadius: 980, color: 'rgba(245,239,232,0.75)', fontSize: '13px' }}
                        onClick={() => setQuery(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={13} color="#FF8A80" />
                  <span style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: 500 }}>热门搜索</span>
                </div>
                {hotSearches.map((s, i) => (
                  <button key={s} className="w-full flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(245,239,232,0.08)' }}
                    onClick={() => setQuery(s)}>
                    <span style={{ color: i < 3 ? '#FF8A80' : 'rgba(245,239,232,0.55)', fontSize: '14px', fontWeight: 600, width: 20, textAlign: 'center' }}>{i + 1}</span>
                    <span style={{ color: '#f5efe8', fontSize: '14px' }}>{s}</span>
                  </button>
                ))}
              </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
