import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Gift, Heart, ImagePlus, Lightbulb, MessageCircle, Mic, MoreHorizontal, NotebookText, Plus, Smile, Sparkles, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { chatOnce, chatStream, type ChatMessage } from '../services/ai';
import { loadAffinityByKid, mainAffinity } from '../services/affinity';
import { buildRolePersonaPrompt } from '../services/roleCards';
import { loadProfile, saveProfile, type FoxsayProfile } from '../services/socialLocal';
import { getRoleChatStorageKey, resolveContactCard, type ContactCard } from '../services/unlockedRoles';

type UiMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

type RoleView = 'chat' | 'profile' | 'moments';
type PanelView = 'gifts' | 'memory' | 'emoji' | 'attach' | null;

type GiftItem = {
  id: string;
  name: string;
  price: number;
  topic: string;
  note: string;
};

interface RoleChatPageProps {
  kid: string;
  onBack: () => void;
}

const SUGGESTION_USAGE_KEY = 'foxsay_role_suggestion_used_v1';
const FREE_SUGGESTION_LIMIT = 10;
const SUGGESTION_DIAMOND_COST = 8;

const gifts: GiftItem[] = [
  { id: 'coffee', name: '热咖啡', price: 12, topic: '今天的状态', note: '轻量关心，不显得用力。' },
  { id: 'note', name: '手写便签', price: 18, topic: '认真听她说过的话', note: '适合推进信任感。' },
  { id: 'ticket', name: '展览票', price: 28, topic: '周末和兴趣', note: '适合打开生活话题。' },
  { id: 'flower', name: '小花束', price: 38, topic: '表达好感', note: '偏暧昧，关系太早时要谨慎。' },
];

export function RoleChatPage({ kid, onBack }: RoleChatPageProps) {
  const user = useUser() as any;
  const card = useMemo(() => resolveContactCard(kid), [kid]);
  const [profile, setProfile] = useState<FoxsayProfile>(() => loadProfile(user));
  const storageKey = getRoleChatStorageKey(kid);
  const giftKey = `foxsay_role_gifts_v1_${kid}`;
  const [view, setView] = useState<RoleView>('chat');
  const [panel, setPanel] = useState<PanelView>(null);
  const [messages, setMessages] = useState<UiMessage[]>(() => loadMessages(storageKey));
  const [giftLogs, setGiftLogs] = useState<GiftItem[]>(() => loadGiftLogs(giftKey));
  const [suggestionUsed, setSuggestionUsed] = useState(() => readNumber(SUGGESTION_USAGE_KEY));
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const hasDraft = !!draft.trim();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const affinityScore = card ? mainAffinity(loadAffinityByKid(card.kid)) : 40;
  const relation = getRelationStage(affinityScore);
  const freeLeft = Math.max(0, FREE_SUGGESTION_LIMIT - suggestionUsed);

  useEffect(() => {
    saveMessages(storageKey, messages);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, storageKey]);

  useEffect(() => {
    saveGiftLogs(giftKey, giftLogs);
  }, [giftKey, giftLogs]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!card) {
    return (
      <main style={{ minHeight: '100%', background: '#ededed' }}>
        <ChatHeader title="联系人不存在" onBack={onBack} />
      </main>
    );
  }

  const spendDiamonds = (amount: number) => {
    const nextProfile = { ...profile, diamonds: Math.max(0, profile.diamonds - amount) };
    setProfile(nextProfile);
    saveProfile(nextProfile);
  };

  const send = () => {
    const text = draft.trim();
    if (!text || sending) return;
    abortRef.current?.abort();
    const userMsg: UiMessage = { id: createId(), role: 'user', text, ts: Date.now() };
    const aiId = createId();
    const aiMsg: UiMessage = { id: aiId, role: 'assistant', text: '', ts: Date.now() };
    const nextMessages = [...messages, userMsg, aiMsg];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);

    const systemPrompt = [
      buildRolePersonaPrompt(kid),
      `你现在和用户在微信式私聊里对话。你们认识的来源是用户在 FoxSay 真实案例训练里拿到了你的联系方式。`,
      `只输出${card.name}本人会发出的聊天消息，不写旁白，不写括号动作，不写心理分析。`,
      '每次回复 1-3 句中文口语，真实、克制、有生活感；如果用户越界，礼貌降温并拉回健康沟通。',
    ].filter(Boolean).join('\n\n');

    const history: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...nextMessages
        .filter(message => message.text.trim())
        .slice(-12)
        .map(message => ({ role: message.role, content: message.text } as ChatMessage)),
    ];

    abortRef.current = chatStream(
      history,
      chunk => {
        setMessages(current => current.map(item => item.id === aiId ? { ...item, text: item.text + chunk } : item));
      },
      full => {
        setMessages(current => current.map(item => item.id === aiId ? { ...item, text: full || '我刚才卡了一下，你再说一遍？' } : item));
        setSending(false);
      },
      err => {
        setMessages(current => current.map(item => item.id === aiId ? { ...item, text: `刚才网络有点慢：${err.message}` } : item));
        setSending(false);
      },
      { model: 'deepseek-chat', temperature: 0.82, max_tokens: 320 },
    );
  };

  const generateSuggestion = async () => {
    if (suggesting) return;
    const willCharge = suggestionUsed >= FREE_SUGGESTION_LIMIT;
    if (willCharge && profile.diamonds < SUGGESTION_DIAMOND_COST) {
      setSuggestion(`免费建议已用完。继续让尼克大叔出建议需要 ${SUGGESTION_DIAMOND_COST} 钻石，你现在有 ${profile.diamonds} 钻石。`);
      return;
    }

    setSuggesting(true);
    setSuggestion('');
    const recent = messages.slice(-8).map(item => `${item.role === 'user' ? '用户' : card.name}：${item.text}`).join('\n');
    try {
      const text = await chatOnce([
        { role: 'system', content: '你是 FoxSay 的尼克大叔。根据用户和角色最近聊天，给用户一条可以直接发送的中文回复建议。只输出一句自然微信消息，不要解释。' },
        { role: 'user', content: `角色：${card.name}\n关系：${card.identity}\n当前好感：${affinityScore}\n最近聊天：\n${recent || '刚开始聊天'}\n用户草稿：${draft || '空'}` },
      ], { model: 'deepseek-chat', temperature: 0.7, max_tokens: 120 });
      if (willCharge) spendDiamonds(SUGGESTION_DIAMOND_COST);
      const nextUsed = suggestionUsed + 1;
      setSuggestionUsed(nextUsed);
      writeNumber(SUGGESTION_USAGE_KEY, nextUsed);
      setSuggestion(text.trim() || '可以先接住她的情绪，再轻轻问一句她现在最需要什么。');
    } catch (err: any) {
      setSuggestion(`建议生成失败：${err.message || '网络异常'}`);
    } finally {
      setSuggesting(false);
    }
  };

  const sendGift = (gift: GiftItem) => {
    if (profile.diamonds < gift.price) {
      setSuggestion(`钻石不足。送出「${gift.name}」需要 ${gift.price} 钻石，你现在有 ${profile.diamonds} 钻石。`);
      setPanel(null);
      return;
    }
    spendDiamonds(gift.price);
    setGiftLogs(current => [gift, ...current].slice(0, 20));
    setPanel(null);
    setMessages(current => [
      ...current,
      {
        id: createId(),
        role: 'assistant',
        text: `你送出了「${gift.name}」。这份礼物更适合打开「${gift.topic}」的话题，不会直接买到好感，但能让聊天氛围更自然。`,
        ts: Date.now(),
      },
    ]);
  };

  if (view === 'profile') {
    return <RoleProfilePage card={card} onBack={() => setView('chat')} onOpenMoments={() => setView('moments')} onMessage={() => setView('chat')} />;
  }
  if (view === 'moments') {
    return <RoleMomentsPage card={card} onBack={() => setView('profile')} />;
  }

  return (
    <main style={{ minHeight: '100%', height: '100%', background: '#ededed', display: 'flex', flexDirection: 'column', color: '#111' }}>
      <ChatHeader title={card.name} onBack={onBack} onInfo={() => setView('profile')} affinity={affinityScore} />
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 18px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 12 }}>
            你们已经互换联系方式，可以像微信一样自由聊天。
          </div>
        )}
        {messages.map(message => (
          message.role === 'assistant' && !message.text
            ? null
            : <Bubble key={message.id} message={message} avatar={card.avatar} userAvatar={profile.avatar} onOpenProfile={() => setView('profile')} />
        ))}
        {sending && <TypingLine avatar={card.avatar} />}
      </div>
      <BottomToolStrip
        affinity={affinityScore}
        gifts={giftLogs.length}
        relation={relation}
        onGift={() => setPanel('gifts')}
        onMemory={() => setPanel('memory')}
        onTopic={() => setDraft(`刚才想到一个和你有关的话题，想听听你怎么看：${relation.topic}`)}
        onReview={() => setSuggestion(`复盘：当前好感 ${affinityScore}，适合少一点用力证明，多做具体回应。下一句可以围绕「${relation.topic}」自然展开。`)}
      />
      <div style={inputBar}>
        <div style={inputWrap}>
          <input
            className="wechat-input"
            value={draft}
            onChange={event => setDraft(event.target.value)}
            onFocus={() => setPanel(null)}
            onKeyDown={event => {
              if (event.key === 'Enter') send();
            }}
            placeholder="发消息"
            style={messageInput}
          />
          {!hasDraft && <Mic size={20} color="#777" style={{ flexShrink: 0 }} />}
        </div>
        <button type="button" aria-label="表情" onClick={() => setPanel(panel === 'emoji' ? null : 'emoji')} style={roundToolButton}>
          <Smile size={25} />
        </button>
        {hasDraft ? (
          <button type="button" aria-label="发送" onClick={send} disabled={sending} style={sendTextButton}>
            发送
          </button>
        ) : (
          <button type="button" aria-label="更多" onClick={() => setPanel(panel === 'attach' ? null : 'attach')} style={roundToolButton}>
            <Plus size={27} />
          </button>
        )}
      </div>
      {(suggesting || suggestion) && (
        <SuggestionSheet
          loading={suggesting}
          suggestion={suggestion}
          freeLeft={freeLeft}
          diamonds={profile.diamonds}
          onClose={() => setSuggestion('')}
          onInsert={() => {
            if (suggestion && !suggestion.includes('失败') && !suggestion.includes('钻石不足') && !suggestion.includes('免费建议已用完')) setDraft(suggestion);
            setSuggestion('');
          }}
          onRetry={generateSuggestion}
        />
      )}
      {panel === 'gifts' && <GiftPanel diamonds={profile.diamonds} onClose={() => setPanel(null)} onSend={sendGift} />}
      {panel === 'memory' && <MemoryPanel card={card} relation={relation} giftLogs={giftLogs} onClose={() => setPanel(null)} />}
      {panel === 'emoji' && <EmojiPanel onClose={() => setPanel(null)} onPick={emoji => setDraft(current => `${current}${emoji}`)} />}
      {panel === 'attach' && <AttachPanel onClose={() => setPanel(null)} onSuggest={generateSuggestion} />}
    </main>
  );
}

function BottomToolStrip({
  affinity,
  gifts,
  relation,
  onGift,
  onMemory,
  onTopic,
  onReview,
}: {
  affinity: number;
  gifts: number;
  relation: ReturnType<typeof getRelationStage>;
  onGift: () => void;
  onMemory: () => void;
  onTopic: () => void;
  onReview: () => void;
}) {
  return (
    <section style={bottomToolWrap}>
      <div style={miniAffinity}>
        <Heart size={15} fill="#fa5151" color="#fa5151" />
        <span>{affinity}</span>
        <small>{relation.label}</small>
      </div>
      <ToolButton icon={<Gift size={15} />} label={`送礼 ${gifts}`} onClick={onGift} />
      <ToolButton icon={<Sparkles size={15} />} label="话题" onClick={onTopic} />
      <ToolButton icon={<NotebookText size={15} />} label="记忆" onClick={onMemory} />
      <ToolButton icon={<MessageCircle size={15} />} label="复盘" onClick={onReview} />
    </section>
  );
}

function ToolButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={toolPill}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ChatHeader({ title, onBack, onInfo, affinity }: { title: string; onBack: () => void; onInfo?: () => void; affinity?: number }) {
  return (
    <header style={chatHeader}>
      <button type="button" onClick={onBack} style={chatBackButton}>
        <ChevronLeft size={25} /> 聊天
      </button>
      <div style={{ fontSize: 17, fontWeight: 850 }}>{title}</div>
      {affinity != null && (
        <div style={heartBadge}>
          <span style={heartPulse} />
          <Heart size={27} fill="#fa5151" color="#fa5151" />
          <span style={{ position: 'absolute', fontSize: 9, fontWeight: 950 }}>{affinity}</span>
        </div>
      )}
      {onInfo && (
        <button type="button" onClick={onInfo} style={infoButton}>
          <MoreHorizontal size={25} />
        </button>
      )}
    </header>
  );
}

function RoleProfilePage({ card, onBack, onOpenMoments, onMessage }: { card: ContactCard; onBack: () => void; onOpenMoments: () => void; onMessage: () => void }) {
  const preview = getRoleMomentCopies(card).slice(0, 2);

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title="个人信息" onBack={onBack} />
      <section style={{ background: '#fff', padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
        <img src={card.avatar} alt={card.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 950 }}>{card.name}</div>
          <div style={{ marginTop: 5, color: '#888', fontSize: 13 }}>{card.identity}</div>
        </div>
      </section>
      <section style={{ marginTop: 10, background: '#fff' }}>
        <ProfileRow label="个性签名" value={card.signature || '还没有签名'} />
        <ProfileRow label="身份标签" value={card.tags.join('、') || '训练角色'} />
      </section>
      <section style={{ marginTop: 10, background: '#fff' }}>
        <button type="button" onClick={onOpenMoments} style={rowButton}>
          <span>她的朋友圈</span>
          <ChevronRight size={17} color="#bbb" />
        </button>
        <div style={{ padding: '0 14px 14px' }}>
          {preview.length ? preview.map((copy, index) => (
            <div key={copy} style={{ display: 'flex', gap: 9, paddingTop: index ? 10 : 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: '#c8c8c8', marginTop: 8, flexShrink: 0 }} />
              <div style={{ flex: 1, color: '#666', fontSize: 13, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {copy.replace(`${card.name}：`, '')}
              </div>
            </div>
          )) : (
            <div style={{ padding: '14px 0 4px', color: '#aaa', fontSize: 13 }}>暂无朋友圈内容</div>
          )}
        </div>
      </section>
      <section style={{ marginTop: 10, background: '#fff' }}>
        <button type="button" onClick={onMessage} style={messageButton}>
          <MessageCircle size={19} /> 发消息
        </button>
      </section>
    </main>
  );
}

function RoleMomentsPage({ card, onBack }: { card: ContactCard; onBack: () => void }) {
  const copies = getRoleMomentCopies(card);
  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111' }}>
      <SubHeader title={`${card.name}的朋友圈`} onBack={onBack} />
      <section style={{ height: 166, position: 'relative', background: '#222' }}>
        <img src="/immersive/backgrounds/park.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72)' }} />
        <div style={{ position: 'absolute', right: 16, bottom: -24, display: 'flex', alignItems: 'flex-end', gap: 10, color: '#fff' }}>
          <span style={{ fontSize: 20, fontWeight: 900, textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>{card.name}</span>
          <img src={card.avatar} alt="" style={{ width: 68, height: 68, borderRadius: 9, border: '3px solid #fff', objectFit: 'cover' }} />
        </div>
      </section>
      <section style={{ background: '#fff', marginTop: 34 }}>
        {copies.map((copy, index) => (
          <article key={copy} style={{ padding: 15, borderBottom: '1px solid #eee', display: 'flex', gap: 10 }}>
            <img src={card.avatar} alt="" style={{ width: 42, height: 42, borderRadius: 7, objectFit: 'cover' }} />
            <div>
              <div style={{ color: '#576b95', fontWeight: 850 }}>{card.name}</div>
              <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55 }}>{copy}</p>
              <div style={{ marginTop: 7, color: '#999', fontSize: 12 }}>{index + 1}天前</div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function SuggestionSheet({
  loading,
  suggestion,
  freeLeft,
  diamonds,
  onClose,
  onInsert,
  onRetry,
}: {
  loading: boolean;
  suggestion: string;
  freeLeft: number;
  diamonds: number;
  onClose: () => void;
  onInsert: () => void;
  onRetry: () => void;
}) {
  return (
    <div style={suggestionSheet}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>尼克大叔建议</div>
          <div style={{ marginTop: 3, color: '#999', fontSize: 12 }}>
            {freeLeft > 0 ? `免费剩余 ${freeLeft} 次` : `每次 ${SUGGESTION_DIAMOND_COST} 钻石 · 当前 ${diamonds}`}
          </div>
        </div>
        <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent' }}><X size={20} /></button>
      </div>
      <div style={suggestionContent}>
        {loading ? '尼克大叔正在帮你想一句更稳的回复...' : suggestion}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button type="button" onClick={onRetry} style={sheetSecondary}>重新生成</button>
        <button type="button" onClick={onInsert} style={sheetPrimary}>插入输入框</button>
      </div>
    </div>
  );
}

function GiftPanel({ diamonds, onClose, onSend }: { diamonds: number; onClose: () => void; onSend: (gift: GiftItem) => void }) {
  return (
    <div style={sheetBase}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900 }}>送礼物</div>
          <div style={{ marginTop: 3, color: '#999', fontSize: 12 }}>当前 {diamonds} 钻石，礼物只打开话题，不直接买好感。</div>
        </div>
        <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent' }}><X size={20} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        {gifts.map(gift => (
          <button key={gift.id} type="button" onClick={() => onSend(gift)} style={giftCard}>
            <Gift size={20} color="#b26f21" />
            <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900 }}>{gift.name}</div>
            <div style={{ marginTop: 3, color: '#888', fontSize: 11 }}>{gift.note}</div>
            <div style={{ marginTop: 8, color: '#07c160', fontSize: 13, fontWeight: 900 }}>{gift.price} 钻石</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmojiPanel({ onClose, onPick }: { onClose: () => void; onPick: (emoji: string) => void }) {
  const emojis = ['🙂', '😂', '😌', '😉', '🥺', '👍', '👏', '❤️', '☕', '🌧️', '✨', '🍀'];
  return (
    <div style={emojiPanel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: '#666' }}>常用表情</span>
        <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent' }}><X size={18} /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {emojis.map(emoji => (
          <button key={emoji} type="button" onClick={() => onPick(emoji)} style={emojiButton}>{emoji}</button>
        ))}
      </div>
    </div>
  );
}

function AttachPanel({ onClose, onSuggest }: { onClose: () => void; onSuggest: () => void }) {
  return (
    <div style={attachPanel}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <AttachAction icon={<ImagePlus size={24} />} label="图片" onClick={onClose} />
        <AttachAction icon={<Lightbulb size={24} />} label="建议" onClick={() => { onClose(); onSuggest(); }} />
        <AttachAction icon={<Gift size={24} />} label="礼物" onClick={onClose} />
        <AttachAction icon={<NotebookText size={24} />} label="记忆" onClick={onClose} />
      </div>
    </div>
  );
}

function AttachAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={attachAction}>
      <span style={attachIcon}>{icon}</span>
      <span style={{ marginTop: 6, color: '#666', fontSize: 12 }}>{label}</span>
    </button>
  );
}

function MemoryPanel({ card, relation, giftLogs, onClose }: { card: ContactCard; relation: ReturnType<typeof getRelationStage>; giftLogs: GiftItem[]; onClose: () => void }) {
  return (
    <div style={sheetBase}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16, fontWeight: 900 }}>关系记忆</div>
        <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent' }}><X size={20} /></button>
      </div>
      <div style={memoryRow}><b>当前状态</b><span>{relation.label}</span></div>
      <div style={memoryRow}><b>她的身份</b><span>{card.identity}</span></div>
      <div style={memoryRow}><b>聊天方向</b><span>{relation.topic}</span></div>
      <div style={memoryRow}><b>最近礼物</b><span>{giftLogs[0]?.name || '暂无'}</span></div>
    </div>
  );
}

function Bubble({ message, avatar, userAvatar, onOpenProfile }: { message: UiMessage; avatar: string; userAvatar: string; onOpenProfile: () => void }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start', marginTop: 12 }}>
      {isUser ? (
        <img src={userAvatar} alt="我" style={avatarBubble} />
      ) : (
        <button type="button" onClick={onOpenProfile} style={avatarButton}>
          <img src={avatar} alt="" style={avatarBubble} />
        </button>
      )}
      <div style={{ maxWidth: '72%', borderRadius: 7, padding: '9px 11px', background: isUser ? '#95ec69' : '#fff', color: '#111', fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        {message.text || '...'}
      </div>
    </div>
  );
}

function getRoleMomentCopies(card: ContactCard): string[] {
  return [
    `${card.name}：今天的风有点软，适合把话慢慢说清楚。`,
    `${card.name}：被认真听完的时候，真的会记很久。`,
    `${card.name}：成年人的靠近，还是要有边界感才舒服。`,
  ];
}

function TypingLine({ avatar }: { avatar: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
      <img src={avatar} alt="" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
      <div style={{ background: '#fff', borderRadius: 7, padding: '8px 10px', color: '#777', fontSize: 13 }}>对方正在输入...</div>
    </div>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header style={subHeader}>
      <button type="button" onClick={onBack} style={subBackButton}>
        <ChevronLeft size={24} /> 返回
      </button>
      <div style={{ fontSize: 17, fontWeight: 850 }}>{title}</div>
    </header>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minHeight: 50, padding: '0 14px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
      <span style={{ width: 86, color: '#111', fontSize: 15 }}>{label}</span>
      <span style={{ flex: 1, color: '#777', fontSize: 14, lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function getRelationStage(score: number) {
  const stages = [
    { min: 0, label: '熟悉', topic: '今天过得怎么样' },
    { min: 55, label: '心动', topic: '一次自然的夸赞' },
    { min: 72, label: '暧昧', topic: '周末想做什么' },
    { min: 88, label: '信任', topic: '彼此在意的关系边界' },
  ];
  return stages.reduce((current, item) => (score >= item.min ? item : current), stages[0]);
}

function loadMessages(key: string): UiMessage[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(key: string, messages: UiMessage[]) {
  try {
    localStorage.setItem(key, JSON.stringify(messages.slice(-80)));
  } catch {}
}

function loadGiftLogs(key: string): GiftItem[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGiftLogs(key: string, logs: GiftItem[]) {
  try {
    localStorage.setItem(key, JSON.stringify(logs.slice(0, 20)));
  } catch {}
}

function readNumber(key: string): number {
  try {
    const value = Number(localStorage.getItem(key) || 0);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

function createId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const chatHeader: CSSProperties = {
  height: 52,
  flexShrink: 0,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const chatBackButton: CSSProperties = {
  position: 'absolute',
  left: 6,
  top: 0,
  height: 52,
  border: 0,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  color: '#111',
  fontSize: 15,
};

const heartBadge: CSSProperties = {
  position: 'absolute',
  right: 50,
  top: 12,
  width: 28,
  height: 28,
  display: 'grid',
  placeItems: 'center',
  color: '#fff',
  filter: 'drop-shadow(0 4px 8px rgba(250,81,81,0.28))',
  animation: 'foxsay-heart-float 2.4s ease-in-out infinite',
};

const heartPulse: CSSProperties = {
  position: 'absolute',
  width: 30,
  height: 30,
  borderRadius: 999,
  background: 'rgba(250,81,81,0.16)',
  animation: 'foxsay-heart-pulse 1.8s ease-out infinite',
};

const infoButton: CSSProperties = {
  position: 'absolute',
  right: 7,
  top: 0,
  height: 52,
  width: 42,
  border: 0,
  background: 'transparent',
  color: '#111',
  display: 'grid',
  placeItems: 'center',
};

const bottomToolWrap: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  overflowX: 'auto',
  padding: '8px 10px 6px',
  background: 'linear-gradient(180deg, rgba(237,237,237,0.1), #ededed 28%)',
  scrollbarWidth: 'none',
};

const miniAffinity: CSSProperties = {
  height: 32,
  borderRadius: 999,
  padding: '0 10px',
  background: 'rgba(255,255,255,0.78)',
  border: '1px solid rgba(0,0,0,0.05)',
  color: '#111',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
  fontSize: 12,
  fontWeight: 900,
  backdropFilter: 'blur(10px)',
};

const toolPill: CSSProperties = {
  height: 32,
  border: 0,
  borderRadius: 999,
  padding: '0 12px',
  background: 'rgba(255,255,255,0.72)',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  fontSize: 12,
  fontWeight: 850,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  backdropFilter: 'blur(10px)',
};

const inputBar: CSSProperties = {
  borderTop: '1px solid #d8d8d8',
  background: '#f7f7f7',
  padding: '6px 8px calc(7px + env(safe-area-inset-bottom, 0px))',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const inputWrap: CSSProperties = {
  flex: 1,
  height: 40,
  border: 0,
  background: '#fff',
  padding: '0 9px 0 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const messageInput: CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: 40,
  border: 0,
  background: 'transparent',
  color: '#111',
  fontSize: 15,
};

const roundToolButton: CSSProperties = {
  width: 36,
  height: 40,
  border: 0,
  background: 'transparent',
  color: '#222',
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
};

const sendTextButton: CSSProperties = {
  width: 52,
  height: 34,
  border: 0,
  borderRadius: 4,
  background: '#07c160',
  color: '#fff',
  fontSize: 14,
  fontWeight: 850,
  flexShrink: 0,
};

const emojiPanel: CSSProperties = {
  background: '#f7f7f7',
  borderTop: '1px solid #dedede',
  padding: '12px 14px calc(14px + env(safe-area-inset-bottom, 0px))',
};

const emojiButton: CSSProperties = {
  height: 42,
  border: 0,
  borderRadius: 8,
  background: '#fff',
  fontSize: 23,
};

const attachPanel: CSSProperties = {
  background: '#f7f7f7',
  borderTop: '1px solid #dedede',
  padding: '18px 18px calc(18px + env(safe-area-inset-bottom, 0px))',
};

const attachAction: CSSProperties = {
  border: 0,
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const attachIcon: CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: 12,
  background: '#fff',
  color: '#555',
  display: 'grid',
  placeItems: 'center',
};

const subHeader: CSSProperties = {
  height: 52,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
  color: '#111',
  display: 'flex',
  alignItems: 'center',
  fontSize: 15,
};

const rowButton: CSSProperties = {
  width: '100%',
  minHeight: 52,
  border: 0,
  background: '#fff',
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#111',
  fontSize: 16,
  fontWeight: 760,
};

const messageButton: CSSProperties = {
  width: '100%',
  height: 52,
  border: 0,
  borderRadius: 0,
  background: '#fff',
  color: '#07c160',
  fontSize: 16,
  fontWeight: 900,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
};

const sheetBase: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  background: '#fff',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: '14px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
  boxShadow: '0 -8px 28px rgba(0,0,0,0.18)',
  zIndex: 82,
};

const suggestionSheet: CSSProperties = {
  ...sheetBase,
  zIndex: 80,
};

const suggestionContent: CSSProperties = {
  marginTop: 12,
  background: '#f7f7f7',
  borderRadius: 10,
  padding: 12,
  minHeight: 64,
  fontSize: 14,
  lineHeight: 1.6,
  color: '#333',
};

const giftCard: CSSProperties = {
  border: '1px solid #eeeeee',
  background: '#fff',
  borderRadius: 10,
  padding: 12,
  textAlign: 'left',
  minHeight: 126,
};

const memoryRow: CSSProperties = {
  minHeight: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  borderBottom: '1px solid #eeeeee',
  fontSize: 14,
};

const sheetPrimary: CSSProperties = {
  flex: 1,
  border: 0,
  borderRadius: 8,
  background: '#07c160',
  color: '#fff',
  height: 40,
  fontSize: 15,
  fontWeight: 900,
};

const sheetSecondary: CSSProperties = {
  flex: 1,
  border: 0,
  borderRadius: 8,
  background: '#f1f1f1',
  color: '#333',
  height: 40,
  fontSize: 15,
  fontWeight: 800,
};

const avatarBubble: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 6,
  objectFit: 'cover',
  flexShrink: 0,
  background: '#ddd',
};

const avatarButton: CSSProperties = {
  border: 0,
  padding: 0,
  background: 'transparent',
  width: 38,
  height: 38,
  flexShrink: 0,
};
