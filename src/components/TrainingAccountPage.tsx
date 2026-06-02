import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MessageSquareHeart,
  Newspaper,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { PracticePage } from './PracticePage';
import { getUnlockedContactCards, ROLE_CARD_EVENT } from '../services/unlockedRoles';

interface TrainingAccountPageProps {
  pendingAction?: { type: 'openLevel' | 'openChapter'; mode?: 'story' | 'challenge'; chapterId?: number; levelIndex?: number } | null;
  onActionConsumed?: () => void;
  onBack: () => void;
  onOpenOrder?: () => void;
}

interface ArticleItem {
  id: string;
  title: string;
  desc: string;
  meta: string;
  cover: string;
  mode: 'story' | 'challenge';
  badge?: string;
}

const articles: ArticleItem[] = [
  {
    id: 'rain-night',
    title: '今日副本：便利店雨夜借伞',
    desc: '从一句自然开场开始，练习低压帮助、边界感和联系方式推进。',
    meta: '第 1 章 · 初遇 · 约 8 分钟',
    cover: '/chapters/maps/story-city-map-canva-v1.png',
    mode: 'story',
    badge: '今日推荐',
  },
  {
    id: 'story-cases',
    title: '我的故事：真实搭讪案例训练',
    desc: '咖啡店、朋友局、雨夜街区等真实改编副本，通关后沉淀成你的训练记录。',
    meta: '真实案例 · 分寸表达 · 可反复练习',
    cover: '/chapters/maps/story-city-map-source.jpg',
    mode: 'story',
  },
  {
    id: 'role-challenge',
    title: '人物邂逅：角色专属挑战',
    desc: '完成角色剧情和人物挑战，像真实社交一样逐步解锁联系方式。',
    meta: '角色卡 · 联系方式 · 自由聊天',
    cover: '/chapters/maps/encounter-city-map-source.jpg',
    mode: 'challenge',
  },
];

function useUnlockedCount() {
  const [count, setCount] = useState(() => getUnlockedContactCards().length);

  useEffect(() => {
    const update = () => setCount(getUnlockedContactCards().length);
    window.addEventListener(ROLE_CARD_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(ROLE_CARD_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return count;
}

export function TrainingAccountPage({ pendingAction, onActionConsumed, onBack, onOpenOrder }: TrainingAccountPageProps) {
  const [showPractice, setShowPractice] = useState(!!pendingAction);
  const [practiceAction, setPracticeAction] = useState(pendingAction || null);
  const unlockedCount = useUnlockedCount();

  useEffect(() => {
    if (!pendingAction) return;
    setShowPractice(true);
    setPracticeAction(pendingAction);
  }, [pendingAction]);

  const openPractice = (mode: 'story' | 'challenge') => {
    setPracticeAction({ type: 'openChapter', mode, chapterId: 1 });
    setShowPractice(true);
  };

  if (showPractice) {
    return (
      <div style={{ minHeight: '100%', background: '#2b2535' }}>
        <button
          type="button"
          onClick={() => {
            setShowPractice(false);
            setPracticeAction(null);
          }}
          style={practiceBackButton}
        >
          返回 FoxSay 训练营
        </button>
        <PracticePage
          pendingAction={practiceAction}
          onActionConsumed={() => {
            setPracticeAction(null);
            onActionConsumed?.();
          }}
        />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100%', background: '#ededed', color: '#111', paddingBottom: 18 }}>
      <header style={headerStyle}>
        <button type="button" onClick={onBack} style={backButtonStyle}>
          <ChevronLeft size={25} /> 聊天
        </button>
        <div style={{ fontSize: 17, fontWeight: 850 }}>FoxSay 训练营</div>
      </header>

      <section style={accountProfileStyle}>
        <div style={accountLogoStyle}>训</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>FoxSay 训练营</div>
          <div style={{ marginTop: 4, color: '#8a8a8a', fontSize: 13 }}>真实案例训练服务号</div>
          <div style={{ marginTop: 9, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <MiniBadge icon={<UsersRound size={12} />} text={`已解锁 ${unlockedCount} 位联系人`} />
            <MiniBadge icon={<ShieldCheck size={12} />} text="通关解锁角色卡" />
          </div>
        </div>
      </section>

      <section style={{ padding: '12px 12px 4px' }}>
        <OfficialUpdateCard article={articles[0]} onClick={() => openPractice(articles[0].mode)} />
      </section>

      <section style={listSectionStyle}>
        <SectionTitle title="副本入口" subtitle="像公众号文章一样打开不同训练副本" />
        {articles.slice(1).map(article => (
          <ArticleRow key={article.id} article={article} onClick={() => openPractice(article.mode)} />
        ))}
      </section>

      <section style={listSectionStyle}>
        <SectionTitle title="训练工具" subtitle="先保留入口，后续接复盘、记忆和会员权益" />
        <ToolRow
          icon={<BookmarkCheck size={21} />}
          color="#576b95"
          title="训练记录"
          desc="查看已经完成的案例、角色联系方式和复盘记录"
          onClick={() => openPractice('story')}
        />
        <ToolRow
          icon={<Sparkles size={21} />}
          color="#9b6cff"
          title="人物挑战"
          desc="进入角色专属剧情，完成后在聊天里继续自由对话"
          onClick={() => openPractice('challenge')}
        />
        {onOpenOrder && (
          <ToolRow
            icon={<MessageSquareHeart size={21} />}
            color="#c0703d"
            title="会员权益"
            desc="高级副本、更多记忆和回复建议额度"
            onClick={onOpenOrder}
          />
        )}
      </section>
    </main>
  );
}

function OfficialUpdateCard({ article, onClick }: { article: ArticleItem; onClick: () => void }) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.99 }} onClick={onClick} style={updateCardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#576b95', fontSize: 13, fontWeight: 850 }}>
        <Newspaper size={16} />
        <span>{article.badge || '训练更新'}</span>
      </div>
      <h1 style={{ margin: '11px 0 10px', fontSize: 21, lineHeight: 1.25, fontWeight: 950 }}>{article.title}</h1>
      <div style={{ height: 156, borderRadius: 8, overflow: 'hidden', background: '#ddd', position: 'relative' }}>
        <img src={article.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 44%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.28))' }} />
      </div>
      <p style={{ marginTop: 10, color: '#606060', fontSize: 14, lineHeight: 1.55 }}>{article.desc}</p>
      <div style={cardFooterStyle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock3 size={14} />
          {article.meta}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#576b95', fontWeight: 850 }}>
          进入 <ChevronRight size={16} />
        </span>
      </div>
    </motion.button>
  );
}

function ArticleRow({ article, onClick }: { article: ArticleItem; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={articleRowStyle}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#111', fontSize: 16, lineHeight: 1.35, fontWeight: 850 }}>{article.title}</div>
        <div style={{ marginTop: 5, color: '#777', fontSize: 12.5, lineHeight: 1.45 }}>{article.desc}</div>
        <div style={{ marginTop: 8, color: '#aaa', fontSize: 12 }}>{article.meta}</div>
      </div>
      <img src={article.cover} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, background: '#ddd', flexShrink: 0 }} />
    </button>
  );
}

function ToolRow({ icon, color, title, desc, onClick }: { icon: ReactNode; color: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={toolRowStyle}>
      <div style={{ width: 38, height: 38, borderRadius: 9, background: `${color}18`, color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 850 }}>{title}</div>
        <div style={{ marginTop: 3, fontSize: 12.5, color: '#888', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{desc}</div>
      </div>
      <ChevronRight size={17} color="#bbb" />
    </button>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ padding: '12px 14px 8px' }}>
      <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
      <div style={{ marginTop: 3, color: '#999', fontSize: 12 }}>{subtitle}</div>
    </div>
  );
}

function MiniBadge({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span style={miniBadgeStyle}>
      {icon}
      {text}
    </span>
  );
}

const practiceBackButton: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 40,
  width: '100%',
  height: 46,
  border: 0,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(43,37,53,0.92)',
  color: '#f5efe8',
  fontSize: 15,
  fontWeight: 800,
  backdropFilter: 'blur(18px)',
};

const headerStyle: React.CSSProperties = {
  height: 52,
  background: '#f7f7f7',
  borderBottom: '1px solid #dcdcdc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 20,
};

const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: 6,
  top: 0,
  height: 52,
  border: 0,
  background: 'transparent',
  color: '#111',
  display: 'flex',
  alignItems: 'center',
  fontSize: 15,
};

const accountProfileStyle: React.CSSProperties = {
  background: '#fff',
  padding: '18px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: '1px solid #e5e5e5',
};

const accountLogoStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 10,
  background: '#07c160',
  color: '#fff',
  display: 'grid',
  placeItems: 'center',
  fontSize: 24,
  fontWeight: 950,
};

const miniBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 7px',
  borderRadius: 999,
  background: '#f3f7f5',
  color: '#576b95',
  fontSize: 11,
  fontWeight: 800,
};

const updateCardStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #e3e3e3',
  background: '#fff',
  borderRadius: 10,
  padding: 14,
  textAlign: 'left',
};

const cardFooterStyle: React.CSSProperties = {
  marginTop: 12,
  borderTop: '1px solid #f0f0f0',
  paddingTop: 10,
  color: '#999',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const listSectionStyle: React.CSSProperties = {
  background: '#fff',
  borderTop: '1px solid #e5e5e5',
  borderBottom: '1px solid #e5e5e5',
  marginTop: 10,
};

const articleRowStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 96,
  border: 0,
  borderTop: '1px solid #f0f0f0',
  background: '#fff',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  textAlign: 'left',
};

const toolRowStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 62,
  border: 0,
  borderTop: '1px solid #f0f0f0',
  background: '#fff',
  padding: '10px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 11,
  textAlign: 'left',
};
