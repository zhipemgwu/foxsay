/**
 * 微练习首页 · Tab 3
 * ---------------------------------------------
 * · 免费精选题 + 进阶题库
 * · 模拟考（免费每日1次 / 会员全量+按分类）
 * · 错题本 + 深度复盘
 * · 主会员权益 + 体验周卡入口
 */
import {  useMemo, useState  } from 'react';
import { Play, FileText, BookOpen, Crown, BrainCircuit, ArrowRight, Star, Clock } from 'lucide-react';
import { QuizSession } from './QuizSession';
import { QuizResult } from './QuizResult';
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
import { QUIZ_BANK, getByCategory, getQuestionById } from '../data/quizBank';

const FREE_POOL_COUNT = 10;
const FREE_MOCK_DAILY_KEY = 'foxsay:quiz_mock_free_daily';
const MICRO_TRIAL_EXPIRE_KEY = 'foxsay:micro_week_trial_expire_at';

type Mode =
  | { kind: 'hub' }
  | { kind: 'quiz'; questions: Question[]; title: string }
  | { kind: 'result'; total: number; correct: number; wrong: Question[]; combo: number; retryQs: Question[]; retryTitle: string };

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
  const [paywallFrom, setPaywallFrom] = useState('进阶题库');
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
  const advancedPool = useMemo(() => QUIZ_BANK.slice(Math.min(FREE_POOL_COUNT, QUIZ_BANK.length)), []);
  const activeBank = hasMicroVip ? QUIZ_BANK : freePool;

  const stats = useMemo(() => getStats(), [version]);
  const streak = useMemo(() => getStreak(), [version]);
  const wrongIds = useMemo(() => getWrongBook(), [version]);
  const dailyPicks = useMemo(() => getDailyPicks(activeBank, 30), [version, hasMicroVip]);

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
    const allInCat = getByCategory(cat);
    const qs = hasMicroVip ? allInCat : allInCat.filter(q => freePool.some(f => f.id === q.id));
    if (qs.length === 0) {
      if (hasMicroVip) {
        flash('当前分类暂无题目，题库正在扩充中。');
        return;
      }
      setPaywallFrom(`${CATEGORY_META[cat].label} · 进阶题`);
      setShowPaywall(true);
      return;
    }
    startSession(shuffle(qs).slice(0, 10), hasMicroVip ? CATEGORY_META[cat].label : `${CATEGORY_META[cat].label} · 免费`);
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
    const base = Math.floor(total / cats.length);
    // 第一轮：每类先取 base 道
    cats.forEach(c => {
      const arr = byCat.get(c)!;
      picked.push(...arr.splice(0, Math.min(base, arr.length)));
    });
    // 第二轮：在剩余的题里随机补齐到 total
    const rest = shuffle(cats.flatMap(c => byCat.get(c)!));
    while (picked.length < total && rest.length > 0) {
      picked.push(rest.shift()!);
    }
    return shuffle(picked);
  };

  const startMock = () => {
    if (activeBank.length < 5) {
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
    const pool = buildStratifiedMockPool(activeBank, 50);
    if (pool.length === 0) {
      flash('题库还在建设中。');
      return;
    }
    startSession(pool, `模拟考 · 全量 ${pool.length} 题`);
  };

  const startAdvancedBank = () => {
    if (!hasMicroVip) {
      setPaywallFrom('进阶题库');
      setShowPaywall(true);
      return;
    }
    if (advancedPool.length === 0) {
      flash('进阶题库正在扩充中。');
      return;
    }
    startSession(shuffle(advancedPool).slice(0, Math.min(30, advancedPool.length)), '进阶题库 · 30 题');
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
        精简 50 题高频场景，免费先刷 10 题，进阶题库解锁后全量训练
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

          {/* 4. 进阶库 (VIP) */}
          <button onClick={startAdvancedBank} style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(145deg, rgba(255,213,160,0.08) 0%, rgba(255,213,160,0.02) 100%)', border: '1px solid rgba(255,213,160,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            {!hasMicroVip && <div style={{ position: 'absolute', right: -24, top: 12, background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', color: '#3a2c17', fontSize: 9, fontWeight: 900, padding: '2px 24px', transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: 1 }}>VIP</div>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(255,213,160,0.15)', padding: 10, borderRadius: 12, color: '#FFD5A0' }}>
                <Crown size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFD5A0', marginBottom: 4 }}>进阶题库</div>
            <div style={{ fontSize: 12, color: 'rgba(255,213,160,0.6)' }}>高难度挑战</div>
          </button>

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
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>解锁微练习进阶题库</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.68)', marginBottom: 12 }}>
              当前入口：{paywallFrom}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {!hasMainVip && (
                <div style={planCard('rgba(154,199,255,0.18)', 'rgba(154,199,255,0.45)')}>
                  <div style={planTitle}>体验周卡 9.9</div>
                  <div style={planDesc}>单独解锁微练习进阶题库 + 深度复盘（7天体验）</div>
                  <button style={planBtn} onClick={activateMicroWeekTrial}>开通体验周卡</button>
                </div>
              )}
              <div style={planCard('rgba(255,213,160,0.2)', 'rgba(255,213,160,0.58)')}>
                <div style={planTitle}>主会员（推荐）</div>
                <div style={planDesc}>微练习权益已并入会员：全量题库 + 分类模拟 + 深度复盘</div>
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
