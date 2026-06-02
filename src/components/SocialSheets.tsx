import { ChevronLeft, Search, UserPlus, UsersRound } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { addSearchRecent, loadSearchRecent, searchSocialContent } from '../services/socialLocal';

interface SearchPageProps {
  onBack: () => void;
}

export function SocialSearchPage({ onBack }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => loadSearchRecent());
  const results = searchSocialContent(query);

  const commitSearch = () => {
    setRecent(addSearchRecent(query));
  };

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <div style={searchHeader}>
        <button type="button" onClick={onBack} style={backButton}>
          <ChevronLeft size={24} /> 返回
        </button>
        <div style={searchBox}>
          <Search size={16} color="#999" />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => { if (event.key === 'Enter') commitSearch(); }}
            placeholder="搜索"
            autoFocus
            className="wechat-input"
            style={searchInput}
          />
        </div>
      </div>

      <section style={{ padding: 14 }}>
        {query.trim() ? (
          <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            {results.length ? results.map(item => (
              <div key={`${item.type}-${item.title}`} style={resultRow}>
                {item.avatar ? (
                  <img src={item.avatar} alt="" style={{ width: 38, height: 38, borderRadius: 7, objectFit: 'cover' }} />
                ) : (
                  <div style={resultIcon}><Search size={18} /></div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{item.title}</div>
                  <div style={{ marginTop: 3, color: '#888', fontSize: 12 }}>{item.type} · {item.subtitle}</div>
                </div>
              </div>
            )) : <Empty text="没有找到相关内容" />}
          </div>
        ) : (
          <>
            <div style={{ color: '#888', fontSize: 13, margin: '4px 0 10px' }}>最近搜索</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recent.length ? recent.map(item => (
                <button key={item.id} type="button" onClick={() => setQuery(item.text)} style={recentChip}>
                  {item.text}
                </button>
              )) : <Empty text="还没有搜索记录" />}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export function SocialActionPlaceholder({ type, onBack }: { type: 'group' | 'friend'; onBack: () => void }) {
  const isGroup = type === 'group';
  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <div style={subHeader}>
        <button type="button" onClick={onBack} style={subBackButton}>
          <ChevronLeft size={24} /> 返回
        </button>
        <div style={{ fontSize: 17, fontWeight: 850 }}>{isGroup ? '发起群聊' : '添加朋友'}</div>
      </div>
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={placeholderIcon}>
          {isGroup ? <UsersRound size={34} /> : <UserPlus size={34} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{isGroup ? '群聊功能预留' : '添加朋友功能预留'}</div>
        <p style={{ marginTop: 8, color: '#777', fontSize: 14, lineHeight: 1.6 }}>
          V2 先保留微信式入口，后续可以接入角色群聊、训练营同学或好友系统。
        </p>
      </div>
    </main>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ color: '#999', fontSize: 13, padding: 20, textAlign: 'center', width: '100%' }}>{text}</div>;
}

const searchHeader: CSSProperties = {
  height: 52,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '0 8px',
};

const backButton: CSSProperties = {
  border: 0,
  background: 'transparent',
  color: '#111',
  display: 'flex',
  alignItems: 'center',
  fontSize: 15,
};

const searchBox: CSSProperties = {
  flex: 1,
  height: 36,
  borderRadius: 8,
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
};

const searchInput: CSSProperties = {
  flex: 1,
  border: 0,
  background: 'transparent',
  color: '#111',
  fontSize: 15,
};

const resultRow: CSSProperties = {
  minHeight: 62,
  padding: '10px 14px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const resultIcon: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 7,
  background: '#e8f7ee',
  color: '#07c160',
  display: 'grid',
  placeItems: 'center',
};

const recentChip: CSSProperties = {
  border: 0,
  borderRadius: 999,
  background: '#fff',
  color: '#555',
  padding: '8px 12px',
  fontSize: 13,
};

const subHeader: CSSProperties = {
  height: 52,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const subBackButton: CSSProperties = {
  position: 'absolute',
  left: 6,
  height: 52,
  border: 0,
  background: 'transparent',
  color: '#111',
  display: 'flex',
  alignItems: 'center',
  fontSize: 15,
};

const placeholderIcon: CSSProperties = {
  width: 72,
  height: 72,
  margin: '40px auto 16px',
  borderRadius: 18,
  background: '#e8f7ee',
  color: '#07c160',
  display: 'grid',
  placeItems: 'center',
};
