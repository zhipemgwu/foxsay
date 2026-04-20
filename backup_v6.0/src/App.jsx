import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryTabs } from './components/CategoryTabs';
import { GreetingSection } from './components/GreetingSection';
import { HeroCard } from './components/HeroCard';
import { FeatureGrid } from './components/FeatureGrid';
import { DiagnosticStream } from './components/DiagnosticStream';
import { TabBar } from './components/TabBar';
import { PracticePage } from './components/PracticePage';
import { DiagnosticPage } from './components/DiagnosticPage';
import { CommunityPage } from './components/CommunityPage';
import { ProfilePage } from './components/ProfilePage';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeSkeletonLoader } from './components/SkeletonLoader';
import { MoodCard } from './components/MoodCard';

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
                  {activeTab === 1 && <DiagnosticPage />}
                  {activeTab === 2 && <PracticePage />}
                  {activeTab === 3 && <CommunityPage />}
                  {activeTab === 4 && <ProfilePage />}
                </motion.div>
              </AnimatePresence>
            </div>

            <TabBar active={activeTab} onTabChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
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
        <CategoryTabs />
        <GreetingSection />
      </div>
      <MoodCard />
      <div style={{ height: 24 }} />
      <HeroCard />
      <div style={{ height: 24 }} />
      <FeatureGrid />
      <div style={{ height: 24 }} />
      <DiagnosticStream />
      <div style={{ height: 40 }} />
    </>
  );
}
