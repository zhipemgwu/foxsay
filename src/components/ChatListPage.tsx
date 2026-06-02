import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { getUnlockedContactCards, ROLE_CARD_EVENT, type ContactCard } from '../services/unlockedRoles';
import { WechatHeader } from './WechatHeader';

interface ChatListPageProps {
  onOpenTrainingAccount: () => void;
  onOpenNick: () => void;
  onOpenRoleChat: (kid: string) => void;
  onSearch?: () => void;
  onCreateGroup?: () => void;
  onAddFriend?: () => void;
}

export function ChatListPage({
  onOpenTrainingAccount,
  onOpenNick,
  onOpenRoleChat,
  onSearch,
  onCreateGroup,
  onAddFriend,
}: ChatListPageProps) {
  const [contacts, setContacts] = useState<ContactCard[]>(() => getUnlockedContactCards());

  useEffect(() => {
    const update = () => setContacts(getUnlockedContactCards());
    window.addEventListener(ROLE_CARD_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(ROLE_CARD_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const latest = useMemo(() => contacts.slice(0, 8), [contacts]);

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <WechatHeader title="聊天" onSearch={onSearch} onCreateGroup={onCreateGroup} onAddFriend={onAddFriend} />

      <section style={listSection}>
        <ChatRow
          avatarLabel="训"
          avatarColor="#07c160"
          name="FoxSay 训练营"
          text="公众号 · 今日副本：便利店雨夜借伞"
          time="服务号"
          pinned
          onClick={onOpenTrainingAccount}
        />
        <ChatRow
          avatar="/avatars/nick-uncle.png"
          name="尼克大叔"
          text="置顶 · 有事就来，我帮你拆话术和现场。"
          time="置顶"
          pinned
          onClick={onOpenNick}
        />
        {latest.map(card => (
          <ChatRow
            key={card.kid}
            avatar={card.avatar}
            name={card.name}
            text={`联系方式已解锁 · ${card.identity}`}
            time="刚刚"
            onClick={() => onOpenRoleChat(card.kid)}
          />
        ))}
        {contacts.length === 0 && (
          <InlineEmptyRow onClick={onOpenTrainingAccount} />
        )}
      </section>
    </main>
  );
}

function ChatRow({
  avatar,
  avatarLabel,
  avatarColor,
  name,
  text,
  time,
  pinned,
  onClick,
}: {
  avatar?: string;
  avatarLabel?: string;
  avatarColor?: string;
  name: string;
  text: string;
  time: string;
  pinned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        border: 0,
        background: pinned ? '#f7fbf8' : '#fff',
        minHeight: 72,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      {avatar ? (
        <img src={avatar} alt={name} style={avatarStyle} />
      ) : (
        <div style={{ ...avatarFallback, background: avatarColor || '#07c160' }}>
          {avatarLabel || name.slice(0, 1)}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, borderBottom: '1px solid #eeeeee', paddingBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 780, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ fontSize: 11, color: pinned ? '#07c160' : '#aaa' }}>{time}</div>
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: '#8a8a8a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
      </div>
    </button>
  );
}

function InlineEmptyRow({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={emptyRow}>
      <div style={emptyIcon}>+</div>
      <div style={{ flex: 1, minWidth: 0, borderBottom: '1px solid #eeeeee', paddingBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 780, color: '#333' }}>还没有更多角色聊天</div>
        <div style={{ marginTop: 5, fontSize: 13, color: '#8a8a8a' }}>去训练营通关真实案例，解锁新的联系方式</div>
      </div>
    </button>
  );
}

const listSection: CSSProperties = {
  background: '#fff',
  borderBottom: '1px solid #e5e5e5',
};

const avatarStyle: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 8,
  objectFit: 'cover',
  background: '#ddd',
  flexShrink: 0,
};

const avatarFallback: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 8,
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontSize: 21,
  fontWeight: 950,
  flexShrink: 0,
};

const emptyRow: CSSProperties = {
  width: '100%',
  minHeight: 70,
  border: 0,
  background: '#fff',
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textAlign: 'left',
};

const emptyIcon: CSSProperties = {
  width: 50,
  height: 50,
  borderRadius: 8,
  background: '#f1f1f1',
  color: '#999',
  display: 'grid',
  placeItems: 'center',
  fontSize: 24,
  flexShrink: 0,
};
