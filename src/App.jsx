import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProvider } from './context/UserContext';
import { ProfileModalProvider } from './components/ProfileModals';
import { SubscriptionProvider } from './components/SubscriptionSheet';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GreetingSection } from './components/GreetingSection';
import { TodayScene } from './components/TodayScene';
import { DiagnosticStream } from './components/DiagnosticStream';
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
  const [stage, setStage] = useState('splash');
  const [activeTab, setActiveTab] = useState(0);
  const [homeLoading, setHomeLoading] = useState(true);

  const goToOnboarding = useCallback(() => setStage('onboarding'), []);
  const goToAuth = useCallback(() => setStage('auth'), []);
  const goToMain = useCallback(() => setStage('main'), []);

  useEffect(() => {
    if (stage === 'main' && homeLoading) {
      const t = setTimeout(() => setHomeLoading(false), 1200);
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  {activeTab === 0 && (homeLoading ? <HomeSkeletonLoader /> : <HomePage />)}
                  {activeTab === 1 && <ErrorBoundary><Suspense fallback={<TabFallback />}><DiagnosticPage /></Suspense></ErrorBoundary>}
                  {activeTab === 2 && <ErrorBoundary><Suspense fallback={<TabFallback />}><PracticePage /></Suspense></ErrorBoundary>}
                  {activeTab === 3 && <ErrorBoundary><Suspense fallback={<TabFallback />}><CommunityPage /></Suspense></ErrorBoundary>}
                  {activeTab === 4 && <ErrorBoundary><Suspense fallback={<TabFallback />}><ProfilePage /></Suspense></ErrorBoundary>}
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

function HomePage() {
  return (
    <>
      {/* Unified top gradient covering Header → GreetingSection */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 420,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,138,128,0.22) 0%, rgba(155,126,222,0.10) 40%, transparent 100%)',
        }} />
        <Header />
        <SearchBar />
        <GreetingSection />
      </div>
      <HeatUpCard />
      <TodayTaskList />
      <div style={{ height: 24 }} />
      <TodayScene />
      <div style={{ height: 24 }} />
      <DiagnosticStream />
      <div style={{ height: 40 }} />
    </>
  );
}
