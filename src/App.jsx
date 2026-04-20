import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProvider } from './context/UserContext';
import { ProfileModalProvider } from './components/ProfileModals';
import { SubscriptionProvider } from './components/SubscriptionSheet';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { GreetingSection } from './components/GreetingSection';
import { TodayScene } from './components/TodayScene';
import { DiagnosticStream } from './components/DiagnosticStream';
import { ChatTranslator } from './components/ChatTranslator';
import { RedFlagDetector } from './components/RedFlagDetector';
import { DatePlanner } from './components/DatePlanner';
import { IconBubble, IcShield, gradients } from './components/CuteIcons';
import { TabBar } from './components/TabBar';
const PracticePage = lazy(() => import('./components/PracticePage').then(m => ({ default: m.PracticePage })));
const DiagnosticPage = lazy(() => import('./components/DiagnosticPage').then(m => ({ default: m.DiagnosticPage })));
const CommunityPage = lazy(() => import('./components/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeSkeletonLoader } from './components/SkeletonLoader';
import { HeatUpCard } from './components/HeatUpCard';
import { TodayTaskList } from './components/TodayTaskList';

function TabFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 28, height: 28, borderRadius: '50%', border: '2.5px solid rgba(255,217,61,0.25)', borderTopColor: '#FFD93D' }}
      />
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState(() => {
    try {
      const saved = localStorage.getItem('foxsay_stage');
      if (saved === 'main') return 'main';
    } catch {}
    return 'splash';
  });
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('foxsay_stage');
      if (saved === 'main') {
        const jumped = localStorage.getItem('foxsay_newuser_jumped');
        if (!jumped) {
          const hasPractice = localStorage.getItem('foxsay_practice_history');
          if (!hasPractice) return 2;
        }
      }
    } catch {}
    return 0;
  });
  const [homeLoading, setHomeLoading] = useState(true);
  const [practiceAction, setPracticeAction] = useState(null);
  const skipTabAnimRef = useRef(false);

  const goToOnboarding = useCallback(() => setStage('onboarding'), []);
  const goToAuth = useCallback(() => setStage('auth'), []);
  const goToMain = useCallback(() => {
    setStage('main');
    try {
      localStorage.setItem('foxsay_stage', 'main');
      // 新用户首次进入直接跳练习页（与 setStage 同批，避免闪 HomePage）
      const jumped = localStorage.getItem('foxsay_newuser_jumped');
      if (!jumped) {
        const hasPractice = localStorage.getItem('foxsay_practice_history');
        if (!hasPractice) {
          setActiveTab(2);
          localStorage.setItem('foxsay_newuser_jumped', '1');
        }
      }
    } catch {}
  }, []);
  const handleLogout = useCallback(() => {
    try { localStorage.clear(); } catch {}
    setStage('splash');
    setActiveTab(0);
    setHomeLoading(true);
  }, []);

  const goPractice = useCallback(() => setActiveTab(2), []);

  const handlePracticeAction = useCallback((action) => {
    setPracticeAction(action);
    skipTabAnimRef.current = true;
    setActiveTab(2);
  }, []);

  // 刷新页面时的兜底：如果 goToMain 未触发但 stage 已是 main
  useEffect(() => {
    if (stage === 'main') {
      try {
        const jumped = localStorage.getItem('foxsay_newuser_jumped');
        if (!jumped) {
          const hasPractice = localStorage.getItem('foxsay_practice_history');
          if (!hasPractice) {
            setActiveTab(2);
            localStorage.setItem('foxsay_newuser_jumped', '1');
          }
        }
      } catch {}
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'main' && homeLoading) {
      const t = setTimeout(() => setHomeLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [stage, homeLoading]);

  return (
    <UserProvider>
    <SubscriptionProvider>
    <ProfileModalProvider>
    <div
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ background: '#2b2535' }}
    >
      <div
        className="relative flex flex-col h-full w-full overflow-hidden"
        style={{
          maxWidth: 430,
          margin: '0 auto',
          background: '#2b2535',
          fontFamily: "inherit",
        }}
      >
        {stage === 'splash' && (
          <SplashScreen onFinish={goToOnboarding} />
        )}

        {stage === 'onboarding' && (
          <OnboardingScreen onFinish={goToAuth} />
        )}

        {stage === 'auth' && (
          <AuthScreen onComplete={goToMain} />
        )}

        {stage === 'main' && (
          <>
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  initial={skipTabAnimRef.current ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={skipTabAnimRef.current ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: skipTabAnimRef.current ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                  onAnimationComplete={() => { skipTabAnimRef.current = false; }}
                >
                  {activeTab === 0 && (homeLoading ? <HomeSkeletonLoader /> : <HomePage onPracticeAction={handlePracticeAction} />)}
                  {activeTab === 1 && <ErrorBoundary><Suspense fallback={<TabFallback />}><DiagnosticPage /></Suspense></ErrorBoundary>}
                  {activeTab === 2 && <ErrorBoundary><Suspense fallback={<TabFallback />}><PracticePage pendingAction={practiceAction} onActionConsumed={() => setPracticeAction(null)} /></Suspense></ErrorBoundary>}
                  {activeTab === 3 && <ErrorBoundary><Suspense fallback={<TabFallback />}><CommunityPage /></Suspense></ErrorBoundary>}
                  {activeTab === 4 && <ErrorBoundary><Suspense fallback={<TabFallback />}><ProfilePage onLogout={handleLogout} /></Suspense></ErrorBoundary>}
                </motion.div>
              </AnimatePresence>
            </div>

            <TabBar active={activeTab} onTabChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
    </ProfileModalProvider>
    </SubscriptionProvider>
    </UserProvider>
  );
}

function HomePage({ onPracticeAction }) {
  return (
    <>
      {/* Unified top gradient covering Header → GreetingSection */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 420,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.22) 0%, rgba(155,126,222,0.10) 40%, transparent 100%)',
        }} />
        <Header />
        <GreetingSection />
      </div>

      {/* 每日测评（独立 check-in） */}
      <HeatUpCard />
      {/* 今日任务（独立模块，始终显示） */}
      <TodayTaskList />
      <div style={{ height: 16 }} />

      {/* 今日推荐 — 沉浸式故事/邂逅封面 */}
      <TodayScene onPracticeAction={onPracticeAction} />
      <div style={{ height: 16 }} />

      {/* 快速工具箱 （从练习页提前到首页） */}
      <HomeQuickTools onPracticeAction={onPracticeAction} />
      <div style={{ height: 16 }} />

      {/* 今日洞察 — 暂隐藏 */}
      {false && <DiagnosticStream />}
      <div style={{ height: 40 }} />
    </>
  );
}

function HomeQuickTools({ onPracticeAction }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 恋爱急诊室 — 跳转到练习页并启动 SOS 对话 */}
      <motion.button
        className="flex items-center gap-3 p-4 text-left"
        style={{ background: '#453a60', borderRadius: 14 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => onPracticeAction?.({ type: 'openSos' })}
      >
        <IconBubble size={42} bg={gradients.rose}><IcShield size={20} color="#fff" /></IconBubble>
        <div className="flex-1 min-w-0">
          <span style={{ color: '#f5efe8', fontSize: 13, fontWeight: 600, display: 'block' }}>恋爱急诊室</span>
          <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11 }}>遇到问题马上问</span>
        </div>
      </motion.button>
      <ChatTranslator delay={0.06} />
      <RedFlagDetector delay={0.1} />
      <DatePlanner delay={0.14} />
    </div>
  );
}
