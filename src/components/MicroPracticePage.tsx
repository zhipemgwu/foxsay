/**
 * 微练习首页 · Tab 3
 * ---------------------------------------------
 * · 打卡 & 总体进度
 * · 每日 3 道推荐题
 * · 分类入口（7 个领域）
 * · 错题本入口
 * · 模拟考入口（预留）
 */
import { useState, useMemo } from 'react';
import { QuizSession } from './QuizSession';
import { QuizResult } from './QuizResult';
import { GreetingSection } from './GreetingSection';
import { TodayScene } from './TodayScene';
import {
  CATEGORY_META,
  getDailyPicks,
  getStats,
  getStreak,
  getWrongBook,
  type Question,
  type QuizCategory,
  shuffle,
} from '../services/quiz';
import { QUIZ_BANK, getByCategory, getQuestionById } from '../data/quizBank';

type Mode =
  | { kind: 'hub' }
  | { kind: 'quiz'; questions: Question[]; title: string }
  | { kind: 'result'; total: number; correct: number; wrong: Question[]; combo: number; retryQs: Question[]; retryTitle: string };

interface MicroPracticePageProps {
  onPracticeAction?: (action: any) => void;
}

export function MicroPracticePage({ onPracticeAction }: MicroPracticePageProps = {}) {
  const [mode, setMode] = useState<Mode>({ kind: 'hub' });
  const [version, setVersion] = useState(0);

  const stats = useMemo(() => getStats(), [version]);
  const streak = useMemo(() => getStreak(), [version]);
  const wrongIds = useMemo(() => getWrongBook(), [version]);
  const dailyPicks = useMemo(() => getDailyPicks(QUIZ_BANK, 3), [version]);

  const startSession = (qs: Question[], title: string) => {
    if (qs.length === 0) return;
    setMode({ kind: 'quiz', questions: qs, title });
  };

  const startDaily = () => {
    const unanswered = dailyPicks.filter(p => !p.answered).map(p => p.q);
    const pool = unanswered.length > 0 ? unanswered : dailyPicks.map(p => p.q);
    startSession(pool, '今日推荐');
  };

  const startCategory = (cat: QuizCategory) => {
    const qs = getByCategory(cat);
    if (qs.length === 0) {
      alert('这个分类还没题目，稍等开发组加料～');
      return;
    }
    startSession(shuffle(qs).slice(0, 10), CATEGORY_META[cat].label);
  };

  const startWrongBook = () => {
    const qs = wrongIds.map(id => getQuestionById(id)).filter((q): q is Question => !!q);
    if (qs.length === 0) {
      alert('错题本是空的～');
      return;
    }
    startSession(qs, '错题本');
  };

  const startMock = () => {
    if (QUIZ_BANK.length < 5) {
      alert('题库还在建设中，先多刷几道吧');
      return;
    }
    startSession(shuffle(QUIZ_BANK).slice(0, Math.min(40, QUIZ_BANK.length)), '模拟考 · 40 题');
  };

  if (mode.kind === 'quiz') {
    return (
      <QuizSession
        questions={mode.questions}
        title={mode.title}
        onExit={() => { setMode({ kind: 'hub' }); setVersion(v => v + 1); }}
        onFinish={(r) => {
          setVersion(v => v + 1);
          setMode({
            kind: 'result',
            ...r,
            retryQs: mode.questions,
            retryTitle: mode.title,
          });
        }}
      />
    );
  }

  if (mode.kind === 'result') {
    return (
      <QuizResult
        total={mode.total}
        correct={mode.correct}
        wrong={mode.wrong}
        combo={mode.combo}
        onRetry={() => { setMode({ kind: 'quiz', questions: mode.retryQs, title: mode.retryTitle }); }}
        onExit={() => setMode({ kind: 'hub' })}
        onReviewWrong={mode.wrong.length > 0 ? () => {
          setMode({ kind: 'quiz', questions: mode.wrong, title: '错题重刷' });
        } : undefined}
      />
    );
  }

  /* ============== HUB ============== */
  const overallPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#2b2535',
      color: '#f5efe8',
      overflowY: 'auto',
      paddingBottom: 40,
    }}>
      {/* 顶部：问候（从首页迁入） */}
      <GreetingSection />

      {/* 微练习正文 */}
      <div style={{ padding: '10px 20px 0' }}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, marginTop: 12 }}>微练习</div>
      <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 13, marginBottom: 20 }}>
        五分钟刷几道，遇到真场景就知道怎么回
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,138,128,0.08)', border: '1px solid rgba(255,138,128,0.25)' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,239,232,0.55)' }}>🔥 连续打卡</div>
          <div style={{ color: '#FF8A80', fontWeight: 800, fontSize: 18, marginTop: 4 }}>{streak} 天</div>
        </div>
        <div style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.25)' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,239,232,0.55)' }}>🏆 答对率</div>
          <div style={{ color: '#FFD93D', fontWeight: 800, fontSize: 18, marginTop: 4 }}>{overallPct}%</div>
        </div>
        <div style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,176,128,0.08)', border: '1px solid rgba(255,176,128,0.25)' }}>
          <div style={{ fontSize: 11, color: 'rgba(245,239,232,0.55)' }}>📕 错题</div>
          <div style={{ color: '#FFB080', fontWeight: 800, fontSize: 18, marginTop: 4 }}>{wrongIds.length}</div>
        </div>
      </div>

      <button
        onClick={startDaily}
        style={{
          width: '100%', padding: 18, borderRadius: 16, marginBottom: 14,
          background: 'linear-gradient(135deg,#FF8A80,#EC407A)', border: 'none',
          color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', textAlign: 'left',
        }}
      >
        🎯 今日推荐 {dailyPicks.length} 道 · 已答 {dailyPicks.filter(p => p.answered).length}
      </button>

      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <button onClick={startWrongBook} style={btnStyle('#FFB080')}>
          📕 错题本 · {wrongIds.length}
        </button>
        <button onClick={startMock} style={btnStyle('#B8A4E8')}>
          🔀 模拟考 40 题
        </button>
      </div>

      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>按主题练习</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {(Object.keys(CATEGORY_META) as QuizCategory[]).map(cat => {
          const meta = CATEGORY_META[cat];
          const count = getByCategory(cat).length;
          const catStat = stats.byCategory[cat];
          const catPct = catStat && catStat.total > 0 ? Math.round((catStat.correct / catStat.total) * 100) : 0;
          return (
            <button
              key={cat}
              onClick={() => startCategory(cat)}
              disabled={count === 0}
              style={{
                padding: 14, borderRadius: 14, textAlign: 'left', cursor: count > 0 ? 'pointer' : 'not-allowed',
                background: count > 0 ? `${meta.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${count > 0 ? meta.color + '44' : 'rgba(255,255,255,0.06)'}`,
                color: '#f5efe8', opacity: count > 0 ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 24 }}>{meta.emoji}</div>
              <div style={{ color: meta.color, fontWeight: 700, fontSize: 14, marginTop: 4 }}>{meta.label}</div>
              <div style={{ color: 'rgba(245,239,232,0.55)', fontSize: 11, marginTop: 2 }}>{meta.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontWeight: 600 }}>
                <span style={{ color: 'rgba(245,239,232,0.55)' }}>{count > 0 ? `${count} 道` : '即将上线'}</span>
                {catStat && catStat.total > 0 && <span style={{ color: meta.color }}>{catPct}%</span>}
              </div>
            </button>
          );
        })}
      </div>
      </div>

      {/* 底部：今日推荐（从首页迁入） */}
      <div style={{ marginTop: 24 }}>
        <TodayScene onPracticeAction={onPracticeAction} />
      </div>
    </div>
  );
}

const btnStyle = (c: string): React.CSSProperties => ({
  flex: 1, padding: 14, borderRadius: 14,
  background: `${c}18`, border: `1px solid ${c}44`,
  color: c, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
});
