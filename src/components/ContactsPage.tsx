import { ChevronRight, LockKeyhole } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { getKnownContactCards, readStoredUnlockedRoleKids, type ContactCard } from '../services/unlockedRoles';
import { WechatHeader } from './WechatHeader';

interface ContactsPageProps {
  onOpenNick: () => void;
  onOpenRoleChat: (kid: string) => void;
  onSearch?: () => void;
  onCreateGroup?: () => void;
  onAddFriend?: () => void;
}

export function ContactsPage({ onOpenNick, onOpenRoleChat, onSearch, onCreateGroup, onAddFriend }: ContactsPageProps) {
  const unlocked = new Set(readStoredUnlockedRoleKids());
  const contacts = getKnownContactCards();
  const unlockedContacts = contacts.filter(card => unlocked.has(card.kid));
  const lockedContacts = contacts.filter(card => !unlocked.has(card.kid));

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <WechatHeader title="通讯录" onSearch={onSearch} onCreateGroup={onCreateGroup} onAddFriend={onAddFriend} />
      <Group title="置顶">
        <ContactRow avatar="/avatars/nick-uncle.png" name="尼克大叔" subtitle="恋爱训练导师" onClick={onOpenNick} />
      </Group>
      <Group title="已解锁角色">
        {unlockedContacts.length ? unlockedContacts.map(card => (
          <ContactRow
            key={card.kid}
            avatar={card.avatar}
            name={card.name}
            subtitle={card.identity}
            onClick={() => onOpenRoleChat(card.kid)}
          />
        )) : <Empty text="通关训练后，角色联系方式会显示在这里。" />}
      </Group>
      <Group title="待解锁角色">
        {lockedContacts.map(card => (
          <LockedContactRow key={card.kid} card={card} />
        ))}
      </Group>
    </main>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 10 }}>
      <div style={{ padding: '7px 14px', color: '#8b8b8b', fontSize: 12, fontWeight: 700 }}>{title}</div>
      <div style={groupBody}>{children}</div>
    </section>
  );
}

function ContactRow({ avatar, name, subtitle, onClick }: { avatar: string; name: string; subtitle: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={rowButton}>
      <img src={avatar} alt={name} style={avatarStyle} />
      <div style={rowText}>
        <div style={{ fontSize: 16, fontWeight: 760 }}>{name}</div>
        <div style={subtitleStyle}>{subtitle}</div>
      </div>
      <ChevronRight size={17} color="#bbb" />
    </button>
  );
}

function LockedContactRow({ card }: { card: ContactCard }) {
  return (
    <div style={{ minHeight: 62, background: '#fff', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
        <img src={card.avatar} alt="" style={{ ...avatarStyle, filter: 'grayscale(1) blur(1px)', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#555' }}>
          <LockKeyhole size={18} />
        </div>
      </div>
      <div style={rowText}>
        <div style={{ fontSize: 16, fontWeight: 760, color: '#888' }}>未解锁联系人</div>
        <div style={{ marginTop: 3, color: '#aaa', fontSize: 12 }}>完成对应训练后显示姓名和聊天入口</div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ padding: 18, fontSize: 13, color: '#999', textAlign: 'center' }}>{text}</div>;
}

const groupBody: CSSProperties = {
  background: '#fff',
  borderTop: '1px solid #e5e5e5',
  borderBottom: '1px solid #e5e5e5',
};

const rowButton: CSSProperties = {
  width: '100%',
  minHeight: 62,
  background: '#fff',
  border: 0,
  padding: '9px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textAlign: 'left',
};

const avatarStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 7,
  objectFit: 'cover',
  background: '#ddd',
};

const rowText: CSSProperties = {
  flex: 1,
  minWidth: 0,
  borderBottom: '1px solid #f0f0f0',
  paddingBottom: 9,
};

const subtitleStyle: CSSProperties = {
  marginTop: 3,
  color: '#8b8b8b',
  fontSize: 12,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
