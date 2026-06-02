import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, Crown, Gem, ImagePlus, LogOut, MessageSquare, QrCode, Settings, SmilePlus } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUnlockedContactCards } from '../services/unlockedRoles';
import {
  addUserMoment,
  formatDateTime,
  getRoleStickerPacks,
  loadProfile,
  loadUserMoments,
  readFileAsDataUrl,
  saveProfile,
  saveUserMoments,
  type FoxsayProfile,
  type UserMoment,
} from '../services/socialLocal';
import { WechatHeader } from './WechatHeader';

interface WechatMinePageProps {
  onOpenOrder: () => void;
  onLogout?: () => void;
  onSearch?: () => void;
  onCreateGroup?: () => void;
  onAddFriend?: () => void;
}

type MineView = 'home' | 'profile' | 'moments' | 'stickers' | 'settings' | 'diamondRecharge';

export function WechatMinePage({ onOpenOrder, onLogout, onSearch, onCreateGroup, onAddFriend }: WechatMinePageProps) {
  const user = useUser() as any;
  const [view, setView] = useState<MineView>('home');
  const [profile, setProfile] = useState<FoxsayProfile>(() => loadProfile(user));
  const [moments, setMoments] = useState<UserMoment[]>(() => loadUserMoments());
  const unlockedCount = getUnlockedContactCards().length;
  const stickerPacks = getRoleStickerPacks();
  const isVip = !!user.isVip || !!user.isPro?.();

  const updateProfile = (next: FoxsayProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  if (view === 'profile') {
    return <ProfileEditor profile={profile} onBack={() => setView('home')} onChange={updateProfile} />;
  }
  if (view === 'moments') {
    return <MyMomentsPage moments={moments} onBack={() => setView('home')} onChange={next => { setMoments(next); saveUserMoments(next); }} />;
  }
  if (view === 'stickers') {
    return <StickerPacksPage packs={stickerPacks} onBack={() => setView('home')} />;
  }
  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('home')} onLogout={onLogout} />;
  }
  if (view === 'diamondRecharge') {
    return <DiamondRechargePage profile={profile} onBack={() => setView('home')} onChange={updateProfile} />;
  }

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111', paddingBottom: 22 }}>
      <WechatHeader title="我的" onSearch={onSearch} onCreateGroup={onCreateGroup} onAddFriend={onAddFriend} />

      <button type="button" onClick={() => setView('profile')} style={profileEntry}>
        <img src={profile.avatar} alt={profile.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', background: '#ddd' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 900 }}>{profile.name}</div>
          <div style={{ marginTop: 6, color: '#888', fontSize: 13 }}>FoxSay ID：{profile.qrId}</div>
          <div style={signatureLine}>{profile.signature}</div>
        </div>
        <QrCode size={20} color="#888" />
        <ChevronRight size={18} color="#aaa" />
      </button>

      <section style={mineModuleSection}>
        <WalletEntry
          title="充值钻石"
          caption="用于回复建议、训练复盘等"
          icon={<Gem size={22} />}
          color="#32c5ff"
          onClick={() => setView('diamondRecharge')}
        />
        <WalletEntry
          title="开通会员"
          value={isVip ? '已开通' : 'Pro+'}
          caption="解锁更多训练与记忆权益"
          icon={<Crown size={22} />}
          color="#ff8bbd"
          onClick={onOpenOrder}
        />

        <div style={statsSection}>
          <StatItem icon={<MessageSquare size={19} />} value={unlockedCount} label="聊过" />
          <StatItem icon={<SmilePlus size={19} />} value={stickerPacks.length} label="表情" />
          <StatItem icon={<BarChart3 size={19} />} value={moments.length} label="动态" />
          <StatItem icon={<Gem size={19} />} value={profile.diamonds} label="钻石" />
        </div>

        <MineRow icon={<ImagePlus size={20} />} title="个人朋友圈" value={`${moments.length} 条`} color="#07c160" onClick={() => setView('moments')} />
        <MineRow icon={<SmilePlus size={20} />} title="表情" value={`${stickerPacks.length} 套`} color="#f06292" onClick={() => setView('stickers')} />
        <MineRow icon={<Settings size={20} />} title="设置" value="账号与偏好" color="#576b95" onClick={() => setView('settings')} />
      </section>
    </main>
  );
}

function ProfileEditor({ profile, onBack, onChange }: { profile: FoxsayProfile; onBack: () => void; onChange: (profile: FoxsayProfile) => void }) {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const pickAvatar = async (file?: File | null) => {
    if (!file) return;
    onChange({ ...profile, avatar: await readFileAsDataUrl(file) });
  };

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="个人信息" onBack={onBack} />
      <section style={{ marginTop: 10, background: '#fff' }}>
        <InfoRow label="头像" onClick={() => avatarInputRef.current?.click()}>
          <img src={profile.avatar} alt="头像" style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover' }} />
          <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={event => pickAvatar(event.target.files?.[0])} />
        </InfoRow>
        <TextInfoRow label="名字" value={profile.name} onChange={value => onChange({ ...profile, name: value })} />
        <SelectInfoRow label="性别" value={profile.gender} options={['未设置', '男', '女']} onChange={value => onChange({ ...profile, gender: value })} />
        <TextInfoRow label="地区" value={profile.region} onChange={value => onChange({ ...profile, region: value })} />
        <InfoRow label="二维码">
          <div style={qrBox}>{profile.qrId}</div>
        </InfoRow>
        <TextInfoRow label="个性签名" value={profile.signature} onChange={value => onChange({ ...profile, signature: value })} maxLength={40} />
      </section>
    </main>
  );
}

function MyMomentsPage({ moments, onBack, onChange }: { moments: UserMoment[]; onBack: () => void; onChange: (moments: UserMoment[]) => void }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const submit = () => {
    if (!text.trim() && !image) return;
    const next = addUserMoment({ text, image });
    onChange(next);
    setText('');
    setImage(undefined);
  };

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="个人朋友圈" onBack={onBack} />
      <section style={{ marginTop: 10, background: '#fff', padding: 14 }}>
        <textarea
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="这一刻的想法..."
          style={momentTextarea}
        />
        {image && <img src={image} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} />}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <button type="button" onClick={() => fileInputRef.current?.click()} style={plainButton}><ImagePlus size={18} /> 图片</button>
          <button type="button" onClick={submit} style={greenButton}>发布</button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async event => setImage(event.target.files?.[0] ? await readFileAsDataUrl(event.target.files[0]) : undefined)}
        />
      </section>
      <section style={{ marginTop: 10, background: '#fff' }}>
        {moments.length ? moments.map(moment => (
          <article key={moment.id} style={{ padding: 14, borderBottom: '1px solid #eee' }}>
            <div style={{ color: '#888', fontSize: 12 }}>{formatDateTime(moment.createdAt)}</div>
            {moment.text && <p style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55 }}>{moment.text}</p>}
            {moment.image && <img src={moment.image} alt="" style={{ width: 116, height: 116, objectFit: 'cover', borderRadius: 6, marginTop: 8 }} />}
          </article>
        )) : <Empty text="还没有发布过朋友圈" />}
      </section>
    </main>
  );
}

function StickerPacksPage({ packs, onBack }: { packs: ReturnType<typeof getRoleStickerPacks>; onBack: () => void }) {
  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="表情" onBack={onBack} />
      <section style={{ padding: 12 }}>
        {packs.length ? packs.map(pack => (
          <div key={pack.kid} style={stickerPackCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={pack.avatar} alt={pack.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ fontSize: 16, fontWeight: 900 }}>{pack.name} 专属表情包</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 12 }}>
              {pack.stickers.map(sticker => (
                <div key={sticker} style={stickerTile}>
                  <img src={pack.avatar} alt="" style={{ width: 34, height: 34, borderRadius: 999, objectFit: 'cover' }} />
                  <span style={{ fontSize: 11, color: '#555' }}>{sticker}</span>
                </div>
              ))}
            </div>
          </div>
        )) : <Empty text="解锁角色卡后，会获得她的专属表情包。" />}
      </section>
    </main>
  );
}

function SettingsPage({ onBack, onLogout }: { onBack: () => void; onLogout?: () => void }) {
  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="设置" onBack={onBack} />
      <section style={{ marginTop: 10, background: '#fff' }}>
        <MineRow icon={<Settings size={20} />} title="账号与偏好" value="本地版本" color="#576b95" />
        <MineRow icon={<LogOut size={20} />} title="退出登录" color="#fa5151" onClick={onLogout} />
      </section>
    </main>
  );
}

function DiamondRechargePage({ profile, onBack, onChange }: { profile: FoxsayProfile; onBack: () => void; onChange: (profile: FoxsayProfile) => void }) {
  const tiers = [
    { diamonds: 60, price: '¥6', bonus: '' },
    { diamonds: 300, price: '¥30', bonus: '送 20' },
    { diamonds: 680, price: '¥68', bonus: '送 80' },
    { diamonds: 1280, price: '¥128', bonus: '送 180' },
    { diamonds: 3280, price: '¥328', bonus: '送 520' },
    { diamonds: 6480, price: '¥648', bonus: '送 1280' },
  ];

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="充值钻石" onBack={onBack} />
      <section style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {tiers.map(tier => {
          const total = tier.diamonds + (Number(tier.bonus.replace(/\D/g, '')) || 0);
          return (
            <button
              key={tier.price}
              type="button"
              onClick={() => onChange({ ...profile, diamonds: profile.diamonds + total })}
              style={diamondTier}
            >
              <Gem size={20} color="#32c5ff" />
              <div style={{ marginTop: 7, fontSize: 18, fontWeight: 950 }}>{tier.diamonds}</div>
              {tier.bonus && <div style={{ marginTop: 2, color: '#fa5151', fontSize: 11 }}>{tier.bonus}</div>}
              <div style={{ marginTop: 9, color: '#07c160', fontSize: 14, fontWeight: 850 }}>{tier.price}</div>
            </button>
          );
        })}
      </section>
      <div style={{ padding: '0 14px', color: '#888', fontSize: 12, lineHeight: 1.6 }}>
        V2 为本地测试充值，点击档位会模拟完成充值，后续可接入真实支付。
      </div>
    </main>
  );
}

function WalletEntry({ title, value, caption, icon, color, onClick }: { title: string; value?: string; caption: string; icon: ReactNode; color: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={walletEntry}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 850 }}>{title}</div>
        <div style={{ marginTop: 4, color: '#888', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{caption}</div>
      </div>
      {value && <div style={{ color: '#111', fontSize: 14, fontWeight: 850 }}>{value}</div>}
      <ChevronRight size={17} color="#bbb" />
    </button>
  );
}

function StatItem({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div style={{ minHeight: 66, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
      <div style={{ color: '#07c160' }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 900 }}>{value}</div>
      <div style={{ color: '#999', fontSize: 12 }}>{label}</div>
    </div>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={subHeader}>
      <button type="button" onClick={onBack} style={subBackButton}>
        <ChevronLeft size={24} /> 返回
      </button>
      <div style={{ fontSize: 17, fontWeight: 850 }}>{title}</div>
    </div>
  );
}

function InfoRow({ label, children, onClick }: { label: string; children: ReactNode; onClick?: () => void }) {
  const content = (
    <>
      <div style={{ width: 86, color: '#111', fontSize: 15 }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: '#888' }}>{children}</div>
      <ChevronRight size={16} color="#bbb" />
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={infoRowButton}>
        {content}
      </button>
    );
  }

  return <div style={infoRowButton}>{content}</div>;
}

function TextInfoRow({ label, value, onChange, maxLength = 18 }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  return (
    <InfoRow label={label}>
      <input value={value} maxLength={maxLength} onChange={event => onChange(event.target.value)} style={textInput} />
    </InfoRow>
  );
}

function SelectInfoRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <InfoRow label={label}>
      <select value={value} onChange={event => onChange(event.target.value)} style={selectInput}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </InfoRow>
  );
}

function MineRow({ icon, title, value, color, onClick }: { icon: ReactNode; title: string; value?: string; color: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ width: '100%', minHeight: 54, border: 0, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', textAlign: 'left' }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: `${color}18`, color, display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1, borderBottom: '1px solid #eeeeee', minHeight: 54, display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 760 }}>{title}</div>
        {value && <div style={{ color: '#999', fontSize: 13, marginRight: 8 }}>{value}</div>}
        <ChevronRight size={17} color="#bbb" />
      </div>
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ color: '#999', fontSize: 13, padding: 24, textAlign: 'center' }}>{text}</div>;
}

const profileEntry: CSSProperties = {
  width: '100%',
  border: 0,
  background: '#fff',
  marginTop: 12,
  padding: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  textAlign: 'left',
};

const signatureLine: CSSProperties = {
  marginTop: 3,
  color: '#aaa',
  fontSize: 12,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const statsSection: CSSProperties = {
  background: '#fff',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  padding: '6px 0 8px',
};

const mineModuleSection: CSSProperties = {
  marginTop: 12,
  background: '#fff',
  borderTop: '1px solid #e5e5e5',
  borderBottom: '1px solid #e5e5e5',
};

const walletEntry: CSSProperties = {
  width: '100%',
  minHeight: 72,
  border: 0,
  background: '#fff',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textAlign: 'left',
};

const diamondTier: CSSProperties = {
  border: '1px solid #e7e7e7',
  borderRadius: 9,
  background: '#fff',
  minHeight: 112,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: '#111',
};

const subHeader: CSSProperties = {
  height: 52,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  position: 'sticky',
  top: 0,
  zIndex: 50,
};

const subBackButton: CSSProperties = {
  position: 'absolute',
  left: 6,
  height: 52,
  border: 0,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  color: '#111',
  fontSize: 15,
};

const infoRowButton: CSSProperties = {
  width: '100%',
  minHeight: 58,
  border: 0,
  background: '#fff',
  padding: '8px 14px',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
};

const qrBox: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 6,
  background: '#111',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontSize: 10,
  lineHeight: 1.2,
  textAlign: 'center',
  padding: 5,
};

const textInput: CSSProperties = {
  width: '100%',
  border: 0,
  textAlign: 'right',
  color: '#666',
  fontSize: 15,
  background: 'transparent',
};

const selectInput: CSSProperties = {
  border: 0,
  color: '#666',
  fontSize: 15,
  background: 'transparent',
};

const momentTextarea: CSSProperties = {
  width: '100%',
  minHeight: 82,
  border: 0,
  resize: 'none',
  fontSize: 15,
  color: '#111',
};

const greenButton: CSSProperties = {
  border: 0,
  background: '#07c160',
  color: '#fff',
  borderRadius: 7,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 850,
};

const plainButton: CSSProperties = {
  border: 0,
  background: '#f1f1f1',
  color: '#576b95',
  borderRadius: 7,
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 14,
};

const stickerPackCard: CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: 14,
  marginBottom: 10,
};

const stickerTile: CSSProperties = {
  aspectRatio: '1 / 1',
  borderRadius: 9,
  background: '#f6f6f6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 5,
};
