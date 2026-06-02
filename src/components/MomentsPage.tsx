import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Camera, Heart, ImagePlus, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getKnownContactCards, readStoredUnlockedRoleKids, type ContactCard } from '../services/unlockedRoles';
import { loadProfile, MOMENTS_PROFILE_KEY, readFileAsDataUrl, readJson, writeJson } from '../services/socialLocal';
import { WechatHeader } from './WechatHeader';

type MomentState = Record<string, { liked?: boolean; comments?: string[] }>;
type MomentsProfile = { cover: string; bio: string };

const MOMENTS_KEY = 'foxsay_moments_state_v1';
const DEFAULT_COVER = '/immersive/backgrounds/park.jpg';

const momentCopies = [
  '雨停以后，城市路灯会把普通人照得很温柔。',
  '今天又一次把想说的话咽回去了。慢一点，好像也不是坏事。',
  '真正舒服的聊天，是不用一直证明自己有趣。',
  '有人记得小事的时候，心里会偷偷松一口气。',
  '练习不是为了赢过谁，是为了下一次别把喜欢的人推远。',
];

const momentImages = [
  '/immersive/backgrounds/park.jpg',
  '/immersive/backgrounds/mall.jpg',
  '/immersive/backgrounds/office.jpg',
  '/chapters/maps/story-city-map-canva-v1.png',
  '/chapters/cover/story-1.jpg',
];

export function MomentsPage({ onSearch, onCreateGroup, onAddFriend }: { onSearch?: () => void; onCreateGroup?: () => void; onAddFriend?: () => void } = {}) {
  const user = useUser() as any;
  const foxsayProfile = loadProfile(user);
  const unlocked = new Set(readStoredUnlockedRoleKids());
  const [state, setState] = useState<MomentState>(() => readJson(MOMENTS_KEY, {}));
  const [profile, setProfile] = useState<MomentsProfile>(() => readJson(MOMENTS_PROFILE_KEY, {
    cover: DEFAULT_COVER,
    bio: '正在练习把喜欢说得更自然一点。',
  }));
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const moments = useMemo(() => getKnownContactCards().slice(0, 10), []);

  const updateState = (next: MomentState) => {
    setState(next);
    writeJson(MOMENTS_KEY, next);
  };

  const updateProfile = (next: MomentsProfile) => {
    setProfile(next);
    writeJson(MOMENTS_PROFILE_KEY, next);
  };

  const handleCoverPick = async (file?: File | null) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateProfile({ ...profile, cover: dataUrl });
  };

  const toggleLike = (kid: string) => {
    updateState({ ...state, [kid]: { ...state[kid], liked: !state[kid]?.liked } });
  };

  const submitComment = (kid: string) => {
    const text = draft.trim();
    if (!text) return;
    updateState({
      ...state,
      [kid]: {
        ...state[kid],
        comments: [...(state[kid]?.comments || []), text],
      },
    });
    setDraft('');
    setCommentingId(null);
  };

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <WechatHeader title="朋友圈" onSearch={onSearch} onCreateGroup={onCreateGroup} onAddFriend={onAddFriend} />

      <section style={{ height: 270, position: 'relative', background: '#222', color: '#fff' }}>
        <img src={profile.cover} alt="朋友圈封面" style={{ width: '100%', height: 222, objectFit: 'cover', filter: 'brightness(0.76) saturate(0.98)' }} />
        <div style={{ position: 'absolute', inset: '0 0 48px', background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.56))' }} />
        <button type="button" onClick={() => coverInputRef.current?.click()} style={coverButton}>
          <Camera size={18} />
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={event => handleCoverPick(event.target.files?.[0])} />

        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 12, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'right', paddingBottom: 13 }}>
            <div style={{ fontSize: 21, fontWeight: 900, textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}>{foxsayProfile.name}</div>
            <input
              value={profile.bio}
              onChange={event => updateProfile({ ...profile, bio: event.target.value.slice(0, 28) })}
              placeholder="写一句朋友圈签名"
              style={bioInput}
            />
          </div>
          <div style={coverAvatarWrap}>
            <img src={foxsayProfile.avatar} alt="头像" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      <section style={{ background: '#fff', borderTop: '1px solid #e9e9e9' }}>
        <ComposerPreview avatar={foxsayProfile.avatar} nickname={foxsayProfile.name || '我'} />
        {moments.map((card, index) => {
          const isUnlocked = unlocked.has(card.kid);
          const itemState = state[card.kid] || {};
          return (
            <MomentItem
              key={card.kid}
              card={card}
              index={index}
              isUnlocked={isUnlocked}
              itemState={itemState}
              commenting={commentingId === card.kid}
              draft={draft}
              setDraft={setDraft}
              onToggleLike={() => toggleLike(card.kid)}
              onComment={() => isUnlocked && setCommentingId(commentingId === card.kid ? null : card.kid)}
              onSubmitComment={() => submitComment(card.kid)}
            />
          );
        })}
      </section>
    </main>
  );
}

function ComposerPreview({ avatar, nickname }: { avatar: string; nickname: string }) {
  return (
    <div style={{ padding: '14px', display: 'flex', gap: 11, borderBottom: '1px solid #eeeeee', background: '#fff' }}>
      <img src={avatar} alt={nickname} style={{ width: 42, height: 42, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
      <div style={composerBox}>
        <span>这一刻的想法...</span>
        <ImagePlus size={18} color="#999" />
      </div>
    </div>
  );
}

function MomentItem({
  card,
  index,
  isUnlocked,
  itemState,
  commenting,
  draft,
  setDraft,
  onToggleLike,
  onComment,
  onSubmitComment,
}: {
  card: ContactCard;
  index: number;
  isUnlocked: boolean;
  itemState: { liked?: boolean; comments?: string[] };
  commenting: boolean;
  draft: string;
  setDraft: (value: string) => void;
  onToggleLike: () => void;
  onComment: () => void;
  onSubmitComment: () => void;
}) {
  return (
    <article style={{ padding: '16px 14px', borderBottom: '1px solid #eeeeee', display: 'flex', gap: 10 }}>
      <img
        src={card.avatar}
        alt={isUnlocked ? card.name : '未解锁'}
        style={{ width: 44, height: 44, borderRadius: 7, objectFit: 'cover', filter: isUnlocked ? 'none' : 'grayscale(1) blur(1px)', opacity: isUnlocked ? 1 : 0.48, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, color: isUnlocked ? '#576b95' : '#999', fontSize: 15, fontWeight: 850 }}>
            {isUnlocked ? card.name : '一位待解锁联系人'}
          </div>
          <button type="button" style={moreButton}>
            <MoreHorizontal size={17} />
          </button>
        </div>
        <p style={{ marginTop: 7, fontSize: 14, lineHeight: 1.55, color: isUnlocked ? '#222' : '#aaa', filter: isUnlocked ? 'none' : 'blur(1.5px)' }}>
          {isUnlocked ? momentCopies[index % momentCopies.length] : '完成她对应的训练后，可以看到完整动态内容。'}
        </p>
        {isUnlocked && (
          <div style={{ marginTop: 9, width: '78%', aspectRatio: '4 / 3', borderRadius: 4, overflow: 'hidden', background: '#eee' }}>
            <img src={momentImages[index % momentImages.length]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#999', fontSize: 12 }}>{index + 1}小时前</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <button type="button" onClick={() => isUnlocked && onToggleLike()} style={toolButton}>
              <Heart size={17} fill={itemState.liked ? '#fa5151' : 'none'} color={itemState.liked ? '#fa5151' : '#576b95'} />
            </button>
            <button type="button" onClick={onComment} style={toolButton}>
              <MessageCircle size={17} color="#576b95" />
            </button>
          </div>
        </div>
        {(itemState.liked || (itemState.comments || []).length > 0) && (
          <div style={reactionBox}>
            {itemState.liked && <div>我觉得很有共鸣</div>}
            {(itemState.comments || []).map((comment, cIndex) => (
              <div key={`${comment}-${cIndex}`} style={{ marginTop: itemState.liked || cIndex ? 4 : 0 }}>
                <b>我：</b>{comment}
              </div>
            ))}
          </div>
        )}
        {commenting && (
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input
              className="wechat-input"
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder="评论"
              style={commentInput}
            />
            <button type="button" onClick={onSubmitComment} style={sendCommentButton}>
              <Send size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

const coverButton: CSSProperties = {
  position: 'absolute',
  right: 14,
  top: 14,
  border: '1px solid rgba(255,255,255,0.28)',
  background: 'rgba(0,0,0,0.28)',
  color: '#fff',
  borderRadius: 999,
  width: 34,
  height: 34,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  backdropFilter: 'blur(10px)',
};

const bioInput: CSSProperties = {
  marginTop: 5,
  width: '100%',
  maxWidth: 250,
  textAlign: 'right',
  border: 0,
  background: 'transparent',
  color: 'rgba(255,255,255,0.82)',
  fontSize: 12,
};

const coverAvatarWrap: CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: 10,
  border: '3px solid #fff',
  padding: 0,
  background: '#fff',
  overflow: 'hidden',
  boxShadow: '0 7px 18px rgba(0,0,0,0.24)',
  flexShrink: 0,
};

const composerBox: CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: '#f7f7f7',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#8a8a8a',
  fontSize: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const moreButton: CSSProperties = {
  border: 0,
  background: '#f1f1f1',
  color: '#576b95',
  borderRadius: 4,
  width: 30,
  height: 22,
  display: 'grid',
  placeItems: 'center',
};

const toolButton: CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  width: 24,
  height: 24,
  display: 'grid',
  placeItems: 'center',
};

const reactionBox: CSSProperties = {
  marginTop: 8,
  background: '#f3f3f3',
  borderRadius: 5,
  padding: '7px 8px',
  fontSize: 13,
  color: '#576b95',
};

const commentInput: CSSProperties = {
  flex: 1,
  height: 34,
  border: 0,
  borderRadius: 6,
  background: '#f1f1f1',
  padding: '0 10px',
  fontSize: 14,
  color: '#111',
};

const sendCommentButton: CSSProperties = {
  width: 40,
  border: 0,
  borderRadius: 6,
  background: '#07c160',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
};
