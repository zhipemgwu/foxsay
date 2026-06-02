import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ChevronLeft, ClipboardCheck, MessageSquareQuote, RefreshCw, Send, ShieldAlert, Sparkles, UserRound } from 'lucide-react';
import { chatStream, type ChatMessage } from '../services/ai';
import { loadProfile } from '../services/socialLocal';
import { useUser } from '../context/UserContext';

type NickMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

type NickTool = {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
};

const NICK_CHAT_KEY = 'foxsay_nick_chat_messages_v1';

const tools: NickTool[] = [
  { id: 'reply', label: '帮我回', icon: <MessageSquareQuote size={16} />, prompt: '帮我把下面这段情况拆成一句可以直接发出去的微信回复，要求自然、克制、不油。' },
  { id: 'review', label: '复盘', icon: <ClipboardCheck size={16} />, prompt: '帮我复盘这段聊天哪里做得好、哪里容易减分，并给下一步建议。' },
  { id: 'risk', label: '避雷', icon: <ShieldAlert size={16} />, prompt: '帮我判断这段关系或聊天有没有红旗、越界、过度讨好或被利用的风险。' },
  { id: 'tone', label: '改语气', icon: <Sparkles size={16} />, prompt: '把我想发的话改得更像真实微信聊天，少一点压力，多一点边界和松弛。' },
  { id: 'recover', label: '救场', icon: <RefreshCw size={16} />, prompt: '对方冷了、误会了或不回了，帮我设计一句不纠缠但能挽回氛围的话。' },
];

export function NickChatPage({ onBack }: { onBack: () => void }) {
  const user = useUser() as any;
  const profile = loadProfile(user);
  const [messages, setMessages] = useState<NickMessage[]>(() => loadMessages());
  const [draft, setDraft] = useState('');
  const [activeTool, setActiveTool] = useState<NickTool | null>(null);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    saveMessages(messages);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = (override?: string) => {
    const text = (override || draft).trim();
    if (!text || sending) return;
    abortRef.current?.abort();
    const toolPrefix = activeTool ? `【${activeTool.label}】${activeTool.prompt}\n\n` : '';
    const userMsg: NickMessage = { id: createId(), role: 'user', text: activeTool ? `${activeTool.label}：${text}` : text, ts: Date.now() };
    const aiId = createId();
    const aiMsg: NickMessage = { id: aiId, role: 'assistant', text: '', ts: Date.now() };
    const nextMessages = [...messages, userMsg, aiMsg];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);

    const systemPrompt = [
      '你是 FoxSay 里的尼克大叔，成熟、清醒、幽默，像微信里一个靠谱的恋爱训练导师。',
      '用户会向你倾诉聊天、搭讪、挽回或关系修复问题。你要拆清楚问题，给能直接用的说法和行动建议。',
      '回复像真实微信私聊，不要长篇鸡汤，不要空泛说教。每次 2-5 句中文，必要时给一句可复制的话术。',
      '保持健康恋爱沟通边界，遇到控制、骚扰、越界内容要明确降温并给尊重边界的替代做法。',
    ].join('\n');

    const history: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...nextMessages
        .slice(-14)
        .map(message => ({
          role: message.role,
          content: message.id === userMsg.id ? `${toolPrefix}${text}` : message.text,
        } as ChatMessage)),
    ];

    abortRef.current = chatStream(
      history,
      chunk => setMessages(current => current.map(item => item.id === aiId ? { ...item, text: item.text + chunk } : item)),
      full => {
        setMessages(current => current.map(item => item.id === aiId ? { ...item, text: full || '我刚才卡了一下，你把情况再发我一遍。' } : item));
        setSending(false);
        setActiveTool(null);
      },
      err => {
        setMessages(current => current.map(item => item.id === aiId ? { ...item, text: `网络有点不稳：${err.message}` } : item));
        setSending(false);
      },
      { model: 'deepseek-chat', temperature: 0.72, max_tokens: 420 },
    );
  };

  return (
    <main style={{ minHeight: '100%', height: '100%', background: '#ededed', display: 'flex', flexDirection: 'column', color: '#111' }}>
      <header style={headerStyle}>
        <button type="button" onClick={onBack} style={backButton}>
          <ChevronLeft size={25} /> 聊天
        </button>
        <div style={{ fontSize: 17, fontWeight: 850 }}>尼克大叔</div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 18px' }}>
        <section style={toolPanel}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/avatars/nick-uncle.png" alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>内置工具</div>
              <div style={{ marginTop: 3, color: '#888', fontSize: 12 }}>把聊天记录或你的想法发给我，我帮你拆。</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 7, marginTop: 12 }}>
            {tools.map(tool => (
              <button key={tool.id} type="button" onClick={() => setActiveTool(tool)} style={{ ...toolButton, background: activeTool?.id === tool.id ? '#e8f7ee' : '#f7f7f7', color: activeTool?.id === tool.id ? '#07c160' : '#333' }}>
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 12 }}>
            把聊天现场发给尼克大叔，他会帮你拆话和复盘。
          </div>
        )}
        {messages.map(message => (
          message.role === 'assistant' && !message.text
            ? null
            : <Bubble key={message.id} message={message} userAvatar={profile.avatar} />
        ))}
        {sending && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <img src="/avatars/nick-uncle.png" alt="" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }} />
            <div style={{ background: '#fff', borderRadius: 7, padding: '8px 10px', color: '#777', fontSize: 13 }}>尼克大叔正在输入...</div>
          </div>
        )}
      </div>

      {activeTool && (
        <div style={activeToolBar}>
          <span>{activeTool.label}</span>
          <button type="button" onClick={() => setActiveTool(null)} style={{ border: 0, background: 'transparent', color: '#888' }}>取消</button>
        </div>
      )}
      <div style={inputBar}>
        <input
          className="wechat-input"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') send();
          }}
          placeholder={activeTool ? `${activeTool.label}：粘贴聊天或写你的问题` : '发消息'}
          style={inputStyle}
        />
        <button type="button" onClick={() => send()} disabled={!draft.trim() || sending} style={{ width: 44, border: 0, borderRadius: 6, background: draft.trim() && !sending ? '#07c160' : '#cfcfcf', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <Send size={18} />
        </button>
      </div>
    </main>
  );
}

function Bubble({ message, userAvatar }: { message: NickMessage; userAvatar: string }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start', marginTop: 12 }}>
      {isUser ? (
        <img src={userAvatar} alt="我" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: '#ddd' }} />
      ) : (
        <img src="/avatars/nick-uncle.png" alt="" style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
      )}
      <div style={{ maxWidth: '72%', borderRadius: 7, padding: '9px 11px', background: isUser ? '#95ec69' : '#fff', color: '#111', fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
        {message.text || '...'}
      </div>
    </div>
  );
}

function loadMessages(): NickMessage[] {
  try {
    const raw = localStorage.getItem(NICK_CHAT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: NickMessage[]) {
  try {
    localStorage.setItem(NICK_CHAT_KEY, JSON.stringify(messages.slice(-100)));
  } catch {}
}

function createId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const headerStyle: CSSProperties = {
  height: 52,
  flexShrink: 0,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const backButton: CSSProperties = {
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

const toolPanel: CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 10,
  padding: 12,
};

const toolButton: CSSProperties = {
  minHeight: 52,
  border: 0,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 4,
  fontSize: 11,
  fontWeight: 800,
};

const activeToolBar: CSSProperties = {
  minHeight: 34,
  padding: '7px 10px',
  background: '#fff7d6',
  color: '#9a6a00',
  borderTop: '1px solid #eadfbb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 13,
  fontWeight: 850,
};

const inputBar: CSSProperties = {
  borderTop: '1px solid #d8d8d8',
  background: '#f7f7f7',
  padding: '8px 8px calc(8px + env(safe-area-inset-bottom, 0px))',
  display: 'flex',
  gap: 8,
};

const inputStyle: CSSProperties = {
  flex: 1,
  height: 40,
  border: 0,
  borderRadius: 6,
  background: '#fff',
  padding: '0 12px',
  color: '#111',
  fontSize: 15,
};
