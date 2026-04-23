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
import { IconBubble, IcShield, IcSparkle, gradients } from './components/CuteIcons';
import { TabBar } from './components/TabBar';
const PracticePage = lazy(() => import('./components/PracticePage').then(m => ({ default: m.PracticePage })));
const DiagnosticPage = lazy(() => import('./components/DiagnosticPage').then(m => ({ default: m.DiagnosticPage })));
const CommunityPage = lazy(() => import('./components/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OrderPage = lazy(() => import('./components/OrderPage').then(m => ({ default: m.OrderPage })));
import { MicroPracticePage } from './components/MicroPracticePage';
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
    // 练习页已合并到首页，idx 0 即练习内容，无需跳转
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
    } catch {}
    // 练习内容已在首页（idx 0），不再需要新用户跳转
  }, []);
  const handleLogout = useCallback(() => {
    try { localStorage.clear(); } catch {}
    setStage('splash');
    setActiveTab(0);
    setHomeLoading(true);
  }, []);

  const goPractice = useCallback(() => setActiveTab(0), []);

  const handlePracticeAction = useCallback((action) => {
    if (action === 'go_vip' || action?.type === 'go_vip') {
      skipTabAnimRef.current = true;
      setActiveTab(3);
      return;
    }
    setPracticeAction(action);
    skipTabAnimRef.current = true;
    setActiveTab(0);
  }, []);

  // 练习内容已合并到首页（idx 0），无需兜底跳转

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
                  {activeTab === 0 && (homeLoading ? <HomeSkeletonLoader /> : <ErrorBoundary><Suspense fallback={<TabFallback />}><PracticePage pendingAction={practiceAction} onActionConsumed={() => setPracticeAction(null)} /></Suspense></ErrorBoundary>)}
                  {activeTab === 1 && <ErrorBoundary><Suspense fallback={<TabFallback />}><DiagnosticPage /></Suspense></ErrorBoundary>}
                  {activeTab === 2 && <ErrorBoundary><MicroPracticePage onPracticeAction={handlePracticeAction} /></ErrorBoundary>}
                  {activeTab === 3 && <ErrorBoundary><Suspense fallback={<TabFallback />}><OrderPage /></Suspense></ErrorBoundary>}
                  {activeTab === 4 && <ErrorBoundary><Suspense fallback={<TabFallback />}><ProfilePage onLogout={handleLogout} onPracticeAction={handlePracticeAction} /></Suspense></ErrorBoundary>}
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

