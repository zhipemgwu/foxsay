import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';

interface WechatHeaderProps {
  title: string;
  onSearch?: () => void;
  onCreateGroup?: () => void;
  onAddFriend?: () => void;
}

export function WechatHeader({ title, onSearch, onCreateGroup, onAddFriend }: WechatHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, fontSize: 17, fontWeight: 850 }}>{title}</h1>
      <div style={{ position: 'absolute', right: 9, top: 0, height: 52, display: 'flex', alignItems: 'center', gap: 2 }}>
        <button type="button" aria-label="搜索" onClick={onSearch} style={iconButton}>
          <Search size={21} />
        </button>
        <button type="button" aria-label="添加" onClick={() => setMenuOpen(open => !open)} style={iconButton}>
          <Plus size={24} />
        </button>
      </div>
      {menuOpen && (
        <>
          <button type="button" aria-label="关闭菜单" onClick={() => setMenuOpen(false)} style={scrimStyle} />
          <div style={menuStyle}>
            <MenuItem label="发起群聊" onClick={() => { setMenuOpen(false); onCreateGroup?.(); }} />
            <MenuItem label="添加朋友" onClick={() => { setMenuOpen(false); onAddFriend?.(); }} />
          </div>
        </>
      )}
    </header>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={menuItemStyle}>
      {label}
    </button>
  );
}

const headerStyle: CSSProperties = {
  height: 52,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 80,
};

const scrimStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  border: 0,
  background: 'transparent',
  zIndex: 79,
};

const menuStyle: CSSProperties = {
  position: 'absolute',
  right: 8,
  top: 48,
  width: 150,
  background: '#2f2f2f',
  color: '#fff',
  borderRadius: 6,
  overflow: 'hidden',
  boxShadow: '0 8px 26px rgba(0,0,0,0.22)',
  zIndex: 90,
};

const menuItemStyle: CSSProperties = {
  width: '100%',
  height: 45,
  border: 0,
  background: 'transparent',
  color: '#fff',
  textAlign: 'left',
  padding: '0 16px',
  fontSize: 15,
};

const iconButton: CSSProperties = {
  width: 38,
  height: 52,
  border: 0,
  background: 'transparent',
  color: '#111',
  display: 'grid',
  placeItems: 'center',
};
