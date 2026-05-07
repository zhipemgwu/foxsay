/**
 * 微练习首页 · Tab 3
 * ---------------------------------------------
 * · 免费精选题 + 主题实战
 * · 模拟考（免费每日1次 / 会员全量+按分类）
 * · 错题本 + 深度复盘
 * · 主会员权益 + 体验周卡入口
 */
import {  useMemo, useState  } from 'react';
import { motion } from 'motion/react';
import { Play, FileText, BookOpen, Crown, BrainCircuit, ArrowRight, Star, ChevronLeft } from 'lucide-react';
import { QuizSession, type QuizSessionResult } from './QuizSession';
import { QuizResult } from './QuizResult';
import { ThemeBattleSession } from './ThemeBattleSession';
import { GreetingSection } from './GreetingSection';
import { TodayScene } from './TodayScene';
import { useUser } from '../context/UserContext';
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
import { settleMicroPracticeGrowth, type MicroGrowthResult, type MicroSessionKind } from '../services/microGrowth';
import { QUIZ_BANK, getByCategory, getQuestionById } from '../data/quizBank';
import {
  THEME_BATTLE_CATEGORY_COVERS,
  getThemeBattleChallenges,
  getThemeBattleQuestionCount,
  type ThemeBattleChallenge,
} from '../data/themeBattleChallenges';

const FREE_POOL_COUNT = 10;
const FREE_MOCK_DAILY_KEY = 'foxsay:quiz_mock_free_daily';
const MICRO_TRIAL_EXPIRE_KEY = 'foxsay:micro_week_trial_expire_at';

const getPracticeScenarioKey = (q: Question) => {
  const base = (q.scenario || q.prompt || q.id).split('；')[0].trim();
  return base.replace(/\s+/g, '');
};

const pickUniqueScenarioQuestions = (questions: Question[], limit: number): Question[] => {
  const unique: Question[] = [];
  const overflow: Question[] = [];
  const seen = new Set<string>();

  for (const question of shuffle(questions)) {
    const key = getPracticeScenarioKey(question);
    if (seen.has(key)) {
      overflow.push(question);
      continue;
    }
    seen.add(key);
    unique.push(question);
  }

  return [...unique, ...overflow].slice(0, limit);
};

type Mode =
  | { kind: 'hub' }
  | { kind: 'theme-battle' }
  | { kind: 'theme-battle-list'; category: QuizCategory }
  | { kind: 'theme-battle-play'; challenge: ThemeBattleChallenge }
  | { kind: 'quiz'; questions: Question[]; title: string; sessionKind: MicroSessionKind }
  | { kind: 'result'; total: number; correct: number; wrong: Question[]; combo: number; retryQs?: Question[]; retryChallenge?: ThemeBattleChallenge; retryTitle: string; retryKind: MicroSessionKind; growth?: MicroGrowthResult | null };

interface MicroPracticePageProps {
  onPracticeAction?: (action: any) => void;
}

export function MicroPracticePage({ onPracticeAction }: MicroPracticePageProps = {}) {
  const user = useUser();
  const [mode, setMode] = useState<Mode>({ kind: 'hub' });
  const [toastMsg, setToastMsg] = useState('');
  const flash = (m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(''), 1800); };
  const [version, setVersion] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFrom, setPaywallFrom] = useState('主题实战');
  const [accessVersion, setAccessVersion] = useState(0);

  const hasMainVip = useMemo(() => !!user.isPro?.(), [user, accessVersion]);

  const hasMicroTrial = useMemo(() => {
    const raw = localStorage.getItem(MICRO_TRIAL_EXPIRE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && ts > Date.now();
  }, [accessVersion]);

  const hasMicroVip = hasMainVip || hasMicroTrial;

  const freePool = useMemo(() => QUIZ_BANK.slice(0, Math.min(FREE_POOL_COUNT, QUIZ_BANK.length)), []);
  const activeBank = hasMicroVip ? QUIZ_BANK : freePool;

  const stats = useMemo(() => getStats(), [version]);
  const streak = useMemo(() => getStreak(), [version]);
  const wrongIds = useMemo(() => getWrongBook(), [version]);
  const dailyPicks = useMemo(() => getDailyPicks(activeBank, 30), [version, hasMicroVip]);

  const startSession = (qs: Question[], title: string, sessionKind: MicroSessionKind = 'practice') => {
    if (qs.length === 0) return;
    setMode({ kind: 'quiz', questions: qs, title, sessionKind });
  };

  const applyGrowthResult = (result: QuizSessionResult, title: string, sessionKind: MicroSessionKind) => {
    const growth = settleMicroPracticeGrowth({
      userId: (user as any).userId,
      title,
      sessionKind,
      attempts: result.attempts,
      completed: result.completed,
      plannedTotal: result.plannedTotal,
      abilityScores: (user as any).abilityScores,
    });
    if (growth.applied) {
      (user as any).updateUser?.({ abilityScores: growth.nextAbilityScores });
    }
    return growth;
  };

  const startDaily = () => {
    const unanswered = dailyPicks.filter(p => !p.answered).map(p => p.q);
    const pool = unanswered.length > 0 ? unanswered : dailyPicks.map(p => p.q);
    startSession(pickUniqueScenarioQuestions(pool, pool.length), '今日推荐');
  };

  const startCategory = (cat: QuizCategory) => {
    const allInCat = getByCategory(cat);
    const qs = hasMicroVip ? allInCat : allInCat.filter(q => freePool.some(f => f.id === q.id));
    if (qs.length === 0) {
      if (hasMicroVip) {
        flash('当前分类暂无题目，题库正在扩充中。');
        return;
      }
      setPaywallFrom(`${CATEGORY_META[cat].label} · 主题精练扩展`);
      setShowPaywall(true);
      return;
    }
    startSession(pickUniqueScenarioQuestions(qs, 10), hasMicroVip ? CATEGORY_META[cat].label : `${CATEGORY_META[cat].label} · 免费`);
  };

  const startWrongBook = () => {
    const qs = wrongIds.map(id => getQuestionById(id)).filter((q): q is Question => !!q);
    if (qs.length === 0) {
      flash('错题本是空的～');
      return;
    }
    startSession(qs, '错题本');
  };

  const startDeepReview = () => {
    if (!hasMicroVip) {
      setPaywallFrom('错题本 · 深度复盘');
      setShowPaywall(true);
      return;
    }
    const wrongQs = wrongIds.map(id => getQuestionById(id)).filter((q): q is Question => !!q);
    if (wrongQs.length === 0) {
      flash('你还没有错题，先刷几道再来深度复盘。');
      return;
    }
    const inject = shuffle(QUIZ_BANK.filter(q => !wrongIds.includes(q.id))).slice(0, Math.max(0, 10 - wrongQs.length));
    startSession(shuffle([...wrongQs, ...inject]).slice(0, 10), '深度复盘 · 10 题');
  };

  const canUseFreeMockToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    const used = localStorage.getItem(FREE_MOCK_DAILY_KEY);
    return used !== today;
  };

  const markFreeMockUsed = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(FREE_MOCK_DAILY_KEY, today);
  };

  // 按 8 大分类分层抽样，凑出 50 题：先每类均分，剩余的随机补齐
  const buildStratifiedMockPool = (bank: Question[], total = 50): Question[] => {
    const cats = Object.keys(CATEGORY_META) as QuizCategory[];
    const byCat = new Map<QuizCategory, Question[]>();
    cats.forEach(c => byCat.set(c, shuffle(bank.filter(q => q.category === c))));
    const picked: Question[] = [];
    const pickedIds = new Set<string>();
    const seenScenarios = new Set<string>();
    const overflow: Question[] = [];
    const overflowIds = new Set<string>();
    const base = Math.floor(total / cats.length);

    const holdForFallback = (question: Question) => {
      if (pickedIds.has(question.id) || overflowIds.has(question.id)) return;
      overflowIds.add(question.id);
      overflow.push(question);
    };

    const addQuestions = (candidates: Question[], maxCount = total, allowRepeatedScenario = false) => {
      let added = 0;
      for (const question of candidates) {
        if (picked.length >= total || added >= maxCount) break;
        if (pickedIds.has(question.id)) continue;
        const key = getPracticeScenarioKey(question);
        if (!allowRepeatedScenario && seenScenarios.has(key)) {
          holdForFallback(question);
          continue;
        }
        pickedIds.add(question.id);
        seenScenarios.add(key);
        picked.push(question);
        added += 1;
      }
    };

    // 第一轮：每类先取 base 道
    cats.forEach(c => {
      const arr = byCat.get(c)!;
      addQuestions(arr, Math.min(base, arr.length));
      byCat.set(c, arr.filter(q => !pickedIds.has(q.id)));
    });

    // 第二轮：在剩余的题里优先用没出现过的基础情境补齐
    const rest = shuffle(cats.flatMap(c => byCat.get(c)!));
    addQuestions(rest);

    // 题量不足时再回退到重复情境，保证模拟考仍可凑满 50 题
    addQuestions(overflow, total, true);
    return picked.slice(0, total);
  };

  const startMock = () => {
    if (QUIZ_BANK.length < 50) {
      flash('题库还在建设中，先多刷几道吧');
      return;
    }
    if (!hasMicroVip) {
      if (!canUseFreeMockToday()) {
        setPaywallFrom('模拟考 · 今日免费次数已用完');
        setShowPaywall(true);
        return;
      }
      markFreeMockUsed();
    }
    const pool = buildStratifiedMockPool(QUIZ_BANK, 50);
    if (pool.length === 0) {
      flash('题库还在建设中。');
      return;
    }
    startSession(pool, `模拟考 · 全量 ${pool.length} 题`, 'mock');
  };

  const openThemeBattle = () => {
    if (!hasMicroVip) {
      setPaywallFrom('主题实战');
      setShowPaywall(true);
      return;
    }
    setMode({ kind: 'theme-battle' });
  };

  const startThemeBattleChallenge = (challenge: ThemeBattleChallenge) => {
    setMode({ kind: 'theme-battle-play', challenge });
  };

  const activateMicroWeekTrial = () => {
    const expireTs = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(MICRO_TRIAL_EXPIRE_KEY, String(expireTs));
    setShowPaywall(false);
    setAccessVersion(v => v + 1);
    flash('已开通微练习体验周卡（7天）');
  };

  const goOpenMembership = () => {
    setShowPaywall(false);
    if (onPracticeAction) {
      onPracticeAction({ type: 'go_vip' });
    }
  };

  if (mode.kind === 'quiz') {
    return (
      <QuizSession
        questions={mode.questions}
        title={mode.title}
        onExit={(partial) => {
          if (partial) {
            const growth = applyGrowthResult(partial, mode.title, mode.sessionKind);
            flash(growth.summary);
          }
          setMode({ kind: 'hub' });
          setVersion(v => v + 1);
        }}
        onFinish={(r) => {
          const growth = applyGrowthResult(r, mode.title, mode.sessionKind);
          setVersion(v => v + 1);
          setMode({
            kind: 'result',
            ...r,
            retryQs: mode.questions,
            retryTitle: mode.title,
            retryKind: mode.sessionKind,
            growth,
          });
        }}
      />
    );
  }

  if (mode.kind === 'theme-battle-play') {
    const title = `主题实战 · ${CATEGORY_META[mode.challenge.category].label} · ${mode.challenge.title}`;
    return (
      <ThemeBattleSession
        challenge={mode.challenge}
        title={title}
        onExit={(partial) => {
          if (partial) {
            const growth = applyGrowthResult(partial, title, 'advanced');
            flash(growth.summary);
          }
          setMode({ kind: 'theme-battle-list', category: mode.challenge.category });
          setVersion(versionValue => versionValue + 1);
        }}
        onFinish={(result) => {
          const growth = applyGrowthResult(result, title, 'advanced');
          setVersion(versionValue => versionValue + 1);
          setMode({
            kind: 'result',
            ...result,
            retryChallenge: mode.challenge,
            retryTitle: title,
            retryKind: 'advanced',
            growth,
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
        variant={mode.retryChallenge ? 'themeBattle' : 'quiz'}
        growth={mode.growth}
        onRetry={() => {
          if (mode.retryChallenge) {
            setMode({ kind: 'theme-battle-play', challenge: mode.retryChallenge });
            return;
          }
          if (mode.retryQs) setMode({ kind: 'quiz', questions: mode.retryQs, title: mode.retryTitle, sessionKind: mode.retryKind });
        }}
        onExit={() => setMode({ kind: 'hub' })}
        onReviewWrong={mode.wrong.length > 0 && mode.retryKind !== 'advanced' ? () => {
          setMode({ kind: 'quiz', questions: mode.wrong, title: '错题重刷', sessionKind: 'practice' });
        } : undefined}
      />
    );
  }

  if (mode.kind === 'theme-battle') {
    return (
      <div style={subPageStyle}>
        <SubPageHeader
          title="主题实战"
          subtitle="八个主题的高压短剧副本"
          onBack={() => setMode({ kind: 'hub' })}
        />
        <div style={{ padding: '16px 18px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {(Object.keys(CATEGORY_META) as QuizCategory[]).map(cat => {
              const meta = CATEGORY_META[cat];
              const challengeCount = getThemeBattleChallenges(cat).length;
              const nodeCount = getThemeBattleQuestionCount(cat);
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setMode({ kind: 'theme-battle-list', category: cat })}
                  style={themeBattleCardStyle(meta.color, THEME_BATTLE_CATEGORY_COVERS[cat])}
                >
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${meta.color}12, rgba(15,10,24,0.88))` }} />
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 13, background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, backdropFilter: 'blur(10px)' }}>
                      {meta.emoji}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#fff', padding: '4px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.34)' }}>
                      {challengeCount} 副本
                    </div>
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                    <div style={{ color: '#fff', fontSize: 17, fontWeight: 900, marginBottom: 4 }}>{meta.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 11, lineHeight: 1.45 }}>{nodeCount} 个剧情回复节点</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (mode.kind === 'theme-battle-list') {
    const meta = CATEGORY_META[mode.category];
    const challenges = getThemeBattleChallenges(mode.category);
    return (
      <div style={subPageStyle}>
        <SubPageHeader
          title={`${meta.label} · 主题实战`}
          subtitle="选择一个高阶副本进入短剧场"
          onBack={() => setMode({ kind: 'theme-battle' })}
        />
        <div style={{ padding: '16px 18px 40px', display: 'grid', gap: 14 }}>
          {challenges.map((challenge) => (
            <motion.button
              key={challenge.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -3 }}
              onClick={() => startThemeBattleChallenge(challenge)}
              style={challengeCardStyle(meta.color, challenge.cover)}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,14,28,0.92) 0%, rgba(20,14,28,0.58) 58%, rgba(20,14,28,0.78) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: 154 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ padding: '5px 9px', borderRadius: 999, background: `${meta.color}22`, color: meta.color, border: `1px solid ${meta.color}66`, fontSize: 11, fontWeight: 900 }}>{challenge.focus}</span>
                  <span style={{ padding: '5px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: 800 }}>{challenge.nodes.length}幕短剧</span>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ color: '#fff', fontSize: 21, fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>{challenge.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.55, maxWidth: 280 }}>{challenge.subtitle}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '8px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.14)', color: '#fff', fontSize: 12, fontWeight: 900, border: '1px solid rgba(255,255,255,0.12)' }}>
                    进入副本 <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  /* ============== HUB ============== */
  const overallPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const freeUsed = !hasMicroVip && !canUseFreeMockToday();

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(1200px 500px at 50% -15%, rgba(255,195,121,0.22), transparent 55%), linear-gradient(180deg,#211b2e 0%, #171222 100%)',
      color: '#f5efe8',
      overflowY: 'auto',
      paddingBottom: 44,
    }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px', borderRadius: 8,
          zIndex: 9999, pointerEvents: 'none', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center', whiteSpace: 'nowrap'
        }}>
          {toastMsg}
        </div>
      )}
      {/* 顶部：问候（从首页迁入） */}
      <GreetingSection />

      {/* 微练习正文 */}
      <div style={{ padding: '12px 18px 0' }}>
      <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6, marginTop: 10, letterSpacing: 0.5 }}>微练习</div>
      <div style={{ color: 'rgba(245,239,232,0.62)', fontSize: 13, marginBottom: 16 }}>
        主题精练打基础，主题实战练高压判断
      </div>

      <div style={{
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        background: 'linear-gradient(135deg, rgba(255,214,161,0.15), rgba(124,89,255,0.12))',
        border: '1px solid rgba(255,214,161,0.35)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.22)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.7)' }}>今日训练状态</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 2 }}>
              {hasMicroVip ? (hasMainVip ? '主会员已解锁全量训练' : '体验周卡已生效') : '免费版（10题）'}
            </div>
          </div>
          <div style={{
            padding: '8px 12px', borderRadius: 999,
            background: hasMicroVip ? 'rgba(255,213,160,0.22)' : 'rgba(255,255,255,0.08)',
            border: hasMicroVip ? '1px solid rgba(255,213,160,0.55)' : '1px solid rgba(255,255,255,0.14)',
            color: hasMicroVip ? '#FFD5A0' : '#D6D0E4', fontSize: 12, fontWeight: 800,
          }}>
            {hasMicroVip ? (hasMainVip ? '会员已开通' : '体验中') : '立即升级'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
          <div style={statCardStyle('rgba(255,138,128,0.18)', '#FF9D8C')}>
            <div style={statLabelStyle}>连续打卡</div>
            <div style={statValueStyle}>{streak} 天</div>
          </div>
          <div style={statCardStyle('rgba(255,217,61,0.16)', '#FFD93D')}>
            <div style={statLabelStyle}>答对率</div>
            <div style={statValueStyle}>{overallPct}%</div>
          </div>
          <div style={statCardStyle('rgba(128,200,255,0.16)', '#9AC7FF')}>
            <div style={statLabelStyle}>错题待复盘</div>
            <div style={statValueStyle}>{wrongIds.length}</div>
          </div>
        </div>
      </div>

      
      
      {/* 高级 Bento Grid 模块区 */}
      <div style={{ marginTop: 24, marginBottom: 32, padding: '0 4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          
          {/* 1. 核心模块：今日推荐 (全宽) */}
          <button
            onClick={startDaily}
            style={{
              gridColumn: '1 / -1',
              position: 'relative',
              overflow: 'hidden',
              padding: 24,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(255,213,160,0.1) 0%, rgba(255,106,136,0.05) 100%)',
              border: '1px solid rgba(255,213,160,0.2)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            {/* 炫光点缀 */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: 'rgba(255,106,136,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'linear-gradient(135deg, #ffb367, #ff6a88)', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={20} color="#fff" fill="#fff" />
                </div>
                <div style={{ color: '#FFD5A0', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>TODAY'S PICK</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: 'rgba(245,239,232,0.8)' }}>
                {dailyPicks.filter(p => p.answered).length} / {dailyPicks.length} 题
              </div>
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6, position: 'relative', zIndex: 1 }}>
              快速开练 
            </div>
            <div style={{ fontSize: 13, color: 'rgba(245,239,232,0.6)', position: 'relative', zIndex: 1 }}>
              为你量身定制的每日核心训练
            </div>
          </button>

          {/* 2. 模拟考 */}
          <button onClick={startMock} style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ background: 'rgba(154,199,255,0.1)', padding: 10, borderRadius: 12, color: '#9AC7FF' }}>
                <FileText size={22} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 6 }}>
                {hasMicroVip ? '全量50题' : (freeUsed ? '次数尽' : '免费1次')}
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f5efe8', marginBottom: 4 }}>全真模拟</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.5)' }}>随机50题摸底</div>
          </button>

          {/* 3. 错题本 */}
          <button onClick={startWrongBook} style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(255,176,128,0.1)', padding: 10, borderRadius: 12, color: '#FFB080' }}>
                <BookOpen size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f5efe8', marginBottom: 4 }}>错题本</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.5)' }}>待复习 {wrongIds.length} 题</div>
          </button>

          {/* 4. 主题实战 (VIP) */}
          <motion.button whileTap={{ scale: 0.97 }} whileHover={{ y: -2 }} onClick={openThemeBattle} style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(145deg, rgba(255,213,160,0.08) 0%, rgba(255,213,160,0.02) 100%)', border: '1px solid rgba(255,213,160,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            {!hasMicroVip && <div style={{ position: 'absolute', right: -24, top: 12, background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', color: '#3a2c17', fontSize: 9, fontWeight: 900, padding: '2px 24px', transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: 1 }}>VIP</div>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(255,213,160,0.15)', padding: 10, borderRadius: 12, color: '#FFD5A0' }}>
                <Crown size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFD5A0', marginBottom: 4 }}>主题实战</div>
            <div style={{ fontSize: 12, color: 'rgba(255,213,160,0.6)' }}>高压短剧副本</div>
          </motion.button>

          {/* 5. 深度复盘 (PRO) */}
          <button onClick={startDeepReview} style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(145deg, rgba(247,166,217,0.08) 0%, rgba(247,166,217,0.02) 100%)', border: '1px solid rgba(247,166,217,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -24, top: 12, background: 'linear-gradient(90deg, #F7A6D9, #EC407A)', color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 24px', transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: 1 }}>PRO</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(247,166,217,0.15)', padding: 10, borderRadius: 12, color: '#F7A6D9' }}>
                <BrainCircuit size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F7A6D9', marginBottom: 4 }}>深度复盘</div>
            <div style={{ fontSize: 12, color: 'rgba(247,166,217,0.6)' }}>巩固与强化</div>
          </button>
          
        </div>
      </div>

      {/* 按主题练习：极简列表式卡片设计 */}
      <div style={{ margin: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Star size={18} color="#FFD5A0" fill="#FFD5A0" />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#f5efe8', letterSpacing: 0.5 }}>按主题精练</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {(Object.keys(CATEGORY_META) as QuizCategory[]).map(cat => {
            const meta = CATEGORY_META[cat];
            const allCount = getByCategory(cat).length;
            const freeCount = getByCategory(cat).filter(q => freePool.some(f => f.id === q.id)).length;
            const count = hasMicroVip ? allCount : freeCount;
            const catStat = stats.byCategory[cat];
            const catPct = catStat && catStat.total > 0 ? Math.round((catStat.correct / catStat.total) * 100) : 0;
            
            return (
              <button
                key={cat}
                onClick={() => startCategory(cat)}
                style={{
                  padding: '16px 14px', 
                  borderRadius: 20, 
                  textAlign: 'left', 
                  cursor: count > 0 ? 'pointer' : 'not-allowed',
                  background: count > 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  border: count > 0 ? '1px solid rgba(255,255,255,0.06)' : '1px dashed rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  opacity: count > 0 ? 1 : 0.5,
                  minHeight: 120
                }}
              >
                {/* 装饰色条 */}
                <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, background: count > 0 ? meta.color : 'transparent', filter: 'blur(30px)', borderRadius: '50%', opacity: 0.15 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${meta.color}15`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {meta.emoji}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {!hasMicroVip && allCount > freeCount && (
                      <span style={{
                        fontSize: 9, color: '#3a2c17', fontWeight: 900,
                        background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', borderRadius: 6, padding: '2px 6px',
                        marginBottom: 4
                      }}>VIP</span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,239,232,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 8 }}>
                      {hasMicroVip ? `${allCount}` : `${freeCount} / ${allCount}`}
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1 }} />
                
                <div style={{ fontSize: 16, fontWeight: 800, color: count > 0 ? '#f5efe8' : 'rgba(245,239,232,0.3)', letterSpacing: 0.5, marginBottom: 4 }}>
                  {meta.label}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(245,239,232,0.4)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    {meta.desc}
                  </div>
                  {catStat && catStat.total > 0 && (
                    <div style={{ fontSize: 10, color: meta.color, fontWeight: 800 }}>
                      {catPct}%
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      </div>

      {showPaywall && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: 'min(92vw, 430px)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>解锁微练习主题实战</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.68)', marginBottom: 12 }}>
              当前入口：{paywallFrom}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {!hasMainVip && (
                <div style={planCard('rgba(154,199,255,0.18)', 'rgba(154,199,255,0.45)')}>
                  <div style={planTitle}>体验周卡 9.9</div>
                  <div style={planDesc}>单独解锁微练习主题实战 + 深度复盘（7天体验）</div>
                  <button style={planBtn} onClick={activateMicroWeekTrial}>开通体验周卡</button>
                </div>
              )}
              <div style={planCard('rgba(255,213,160,0.2)', 'rgba(255,213,160,0.58)')}>
                <div style={planTitle}>主会员（推荐）</div>
                <div style={planDesc}>微练习权益已并入会员：全量题库 + 主题实战 + 深度复盘</div>
                <button style={planBtn} onClick={goOpenMembership}>去订购页开通</button>
              </div>
            </div>
            <button onClick={() => setShowPaywall(false)} style={{ ...ghostBtn, marginTop: 10 }}>暂不开通</button>
          </div>
        </div>
      )}

      {/* 底部：今日推荐（从首页迁入） */}
      <div style={{ marginTop: 24 }}>
        <TodayScene onPracticeAction={onPracticeAction} />
      </div>
    </div>
  );
}

function SubPageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, padding: '14px 18px 12px', background: 'linear-gradient(180deg, rgba(33,27,46,0.98), rgba(33,27,46,0.86))', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={onBack}
        style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#f5efe8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 10 }}
      >
        <ChevronLeft size={20} />
      </button>
      <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: 0 }}>{title}</div>
      <div style={{ marginTop: 4, color: 'rgba(245,239,232,0.62)', fontSize: 13 }}>{subtitle}</div>
    </div>
  );
}

const subPageStyle = {
  position: 'absolute' as const,
  inset: 0,
  background: 'radial-gradient(900px 420px at 50% -12%, rgba(255,195,121,0.2), transparent 58%), linear-gradient(180deg,#211b2e 0%, #171222 100%)',
  color: '#f5efe8',
  overflowY: 'auto' as const,
  paddingBottom: 44,
};

const themeBattleCardStyle = (accent: string, cover: string) => ({
  minHeight: 166,
  border: `1px solid ${accent}44`,
  borderRadius: 18,
  padding: 14,
  position: 'relative' as const,
  overflow: 'hidden' as const,
  cursor: 'pointer',
  textAlign: 'left' as const,
  display: 'flex',
  flexDirection: 'column' as const,
  backgroundImage: `url(${cover})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
});

const challengeCardStyle = (accent: string, cover: string) => ({
  position: 'relative' as const,
  overflow: 'hidden' as const,
  borderRadius: 20,
  border: `1px solid ${accent}50`,
  padding: 16,
  cursor: 'pointer',
  textAlign: 'left' as const,
  backgroundImage: `url(${cover})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 16px 34px rgba(0,0,0,0.26)',
});

const statCardStyle = (bg: string, color: string) => ({
  borderRadius: 12,
  padding: 10,
  background: bg,
  border: `1px solid ${color}55`,
});

const statLabelStyle = {
  fontSize: 11,
  color: 'rgba(245,239,232,0.65)',
};

const statValueStyle = {
  fontSize: 18,
  color: '#fff',
  marginTop: 4,
  fontWeight: 900,
};

const entryCardStyle = (accent: string) => ({
  textAlign: 'left' as const,
  borderRadius: 14,
  border: `1px solid ${accent}55`,
  padding: 14,
  background: `${accent}17`,
  color: '#f5efe8',
  cursor: 'pointer',
});

const overlayStyle = {
  position: 'fixed' as const,
  inset: 0,
  zIndex: 1200,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 18,
};

const modalStyle = {
  width: 'min(92vw, 420px)',
  background: 'linear-gradient(180deg,#2c233a 0%, #1f182b 100%)',
  border: '1px solid rgba(255,255,255,0.13)',
  borderRadius: 14,
  padding: 14,
};

const primaryBtn = {
  width: '100%',
  border: 'none',
  borderRadius: 10,
  padding: '10px 12px',
  cursor: 'pointer',
  color: '#2a1f13',
  fontWeight: 800,
  background: 'linear-gradient(135deg,#FFD5A0,#FFBD73)',
};

const miniBtn = (color: string) => ({
  border: `1px solid ${color}66`,
  borderRadius: 10,
  padding: '8px 10px',
  cursor: 'pointer',
  color: '#f5efe8',
  background: `${color}20`,
  textAlign: 'left' as const,
  fontSize: 12,
  fontWeight: 700,
});

const ghostBtn = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 10,
  padding: '10px 12px',
  cursor: 'pointer',
  color: 'rgba(245,239,232,0.9)',
  background: 'rgba(255,255,255,0.05)',
};

const planCard = (bg: string, border: string) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 12,
  padding: 10,
});

const planTitle = {
  fontSize: 14,
  fontWeight: 900,
  color: '#f5efe8',
};

const planDesc = {
  marginTop: 4,
  color: 'rgba(245,239,232,0.75)',
  fontSize: 11,
  lineHeight: 1.45,
};

const planBtn = {
  marginTop: 8,
  width: '100%',
  border: 'none',
  borderRadius: 8,
  padding: '8px 10px',
  cursor: 'pointer',
  color: '#2a1f13',
  background: 'linear-gradient(135deg,#FFD5A0,#FFBD73)',
  fontWeight: 800,
  fontSize: 12,
};
