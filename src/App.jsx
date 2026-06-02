import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { UserProvider } from './context/UserContext';
import { ProfileModalProvider } from './components/ProfileModals';
import { SubscriptionProvider } from './components/SubscriptionSheet';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WechatTabBar } from './components/WechatTabBar';
import { TrainingAccountPage } from './components/TrainingAccountPage';
import { ChatListPage } from './components/ChatListPage';
import { ContactsPage } from './components/ContactsPage';
import { MomentsPage } from './components/MomentsPage';
import { WechatMinePage } from './components/WechatMinePage';
import { RoleChatPage } from './components/RoleChatPage';
import { NickChatPage } from './components/NickChatPage';
import { SocialActionPlaceholder, SocialSearchPage } from './components/SocialSheets';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeSkeletonLoader } from './components/SkeletonLoader';

const OrderPage = lazy(() => import('./components/OrderPage').then(m => ({ default: m.OrderPage })));

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
  const [activeTab, setActiveTab] = useState(0);
  const [homeLoading, setHomeLoading] = useState(true);
  const [practiceAction, setPracticeAction] = useState(null);
  const [roleChatKid, setRoleChatKid] = useState(null);
  const [showNickChat, setShowNickChat] = useState(false);
  const [showTrainingAccount, setShowTrainingAccount] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [utilityView, setUtilityView] = useState(null);
  const skipTabAnimRef = useRef(false);

  const closeUtility = useCallback(() => setUtilityView(null), []);
  const openSearch = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView('search');
  }, []);
  const openCreateGroup = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView('group');
  }, []);
  const openAddFriend = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView('friend');
  }, []);

  const tabToolProps = {
    onSearch: openSearch,
    onCreateGroup: openCreateGroup,
    onAddFriend: openAddFriend,
  };

  const goToOnboarding = useCallback(() => setStage('onboarding'), []);
  const goToAuth = useCallback(() => setStage('auth'), []);
  const goToMain = useCallback(() => {
    setStage('main');
    try {
      localStorage.setItem('foxsay_stage', 'main');
    } catch {}
  }, []);

  const handleLogout = useCallback(() => {
    try { localStorage.clear(); } catch {}
    setStage('splash');
    setActiveTab(0);
    setHomeLoading(true);
    setRoleChatKid(null);
    setShowNickChat(false);
    setShowTrainingAccount(false);
    setShowOrder(false);
    setUtilityView(null);
  }, []);

  const handlePracticeAction = useCallback((action) => {
    if (action === 'go_vip' || action?.type === 'go_vip') {
      skipTabAnimRef.current = true;
      setUtilityView(null);
      setShowOrder(true);
      return;
    }
    setPracticeAction(action);
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setRoleChatKid(null);
    setShowNickChat(false);
    setShowTrainingAccount(true);
    setShowOrder(false);
    setActiveTab(0);
  }, []);

  const handleTabChange = useCallback((idx) => {
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setRoleChatKid(null);
    setShowNickChat(false);
    setShowTrainingAccount(false);
    setShowOrder(false);
    setActiveTab(idx);
  }, []);

  const openRoleChat = useCallback((kid) => {
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setActiveTab(0);
    setShowNickChat(false);
    setShowTrainingAccount(false);
    setShowOrder(false);
    setRoleChatKid(kid);
  }, []);

  const openNickChat = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setActiveTab(0);
    setRoleChatKid(null);
    setShowTrainingAccount(false);
    setShowOrder(false);
    setShowNickChat(true);
  }, []);

  const openTrainingAccount = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setActiveTab(0);
    setRoleChatKid(null);
    setShowNickChat(false);
    setShowOrder(false);
    setShowTrainingAccount(true);
  }, []);

  const openOrder = useCallback(() => {
    skipTabAnimRef.current = true;
    setUtilityView(null);
    setRoleChatKid(null);
    setShowNickChat(false);
    setShowTrainingAccount(false);
    setShowOrder(true);
  }, []);

  useEffect(() => {
    if (stage === 'main' && homeLoading) {
      const t = setTimeout(() => setHomeLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [stage, homeLoading]);

  const isFullScreenView = !!showOrder || !!showTrainingAccount || !!showNickChat || !!roleChatKid || !!utilityView;
  const pageKey = showOrder
    ? 'order'
    : showTrainingAccount
      ? 'training-account'
      : showNickChat
        ? 'nick'
        : roleChatKid
          ? `role-${roleChatKid}`
          : utilityView
            ? `utility-${utilityView}`
            : `tab-${activeTab}`;

  return (
    <UserProvider>
      <SubscriptionProvider>
        <ProfileModalProvider>
          <div
            className="w-full h-screen flex flex-col overflow-hidden"
            style={{ background: stage === 'main' ? '#ededed' : '#2b2535' }}
          >
            <div
              className="relative flex flex-col h-full w-full overflow-hidden"
              style={{
                maxWidth: 430,
                margin: '0 auto',
                background: stage === 'main' ? '#ededed' : '#2b2535',
                fontFamily: 'inherit',
              }}
            >
              {stage === 'splash' && <SplashScreen onFinish={goToOnboarding} />}
              {stage === 'onboarding' && <OnboardingScreen onFinish={goToAuth} />}
              {stage === 'auth' && <AuthScreen onComplete={goToMain} />}

              {stage === 'main' && (
                <>
                  <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={pageKey}
                        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                        style={{ WebkitOverflowScrolling: 'touch' }}
                        initial={skipTabAnimRef.current ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={skipTabAnimRef.current ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={{ duration: skipTabAnimRef.current ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
                        onAnimationComplete={() => { skipTabAnimRef.current = false; }}
                      >
                        {showOrder && (
                          <ErrorBoundary>
                            <div style={{ minHeight: '100%', background: '#2b2535' }}>
                              <button type="button" onClick={() => setShowOrder(false)} style={orderBackButton}>
                                <span style={{ position: 'absolute', left: 8, display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 700 }}>
                                  <ChevronLeft size={22} /> 返回
                                </span>
                                会员中心
                              </button>
                              <Suspense fallback={<TabFallback />}><OrderPage /></Suspense>
                            </div>
                          </ErrorBoundary>
                        )}

                        {utilityView === 'search' && (
                          <ErrorBoundary><SocialSearchPage onBack={closeUtility} /></ErrorBoundary>
                        )}
                        {(utilityView === 'group' || utilityView === 'friend') && (
                          <ErrorBoundary><SocialActionPlaceholder type={utilityView} onBack={closeUtility} /></ErrorBoundary>
                        )}

                        {showTrainingAccount && (
                          <ErrorBoundary>
                            <TrainingAccountPage
                              pendingAction={practiceAction}
                              onActionConsumed={() => setPracticeAction(null)}
                              onBack={() => setShowTrainingAccount(false)}
                              onOpenOrder={openOrder}
                            />
                          </ErrorBoundary>
                        )}
                        {showNickChat && <ErrorBoundary><NickChatPage onBack={() => setShowNickChat(false)} /></ErrorBoundary>}
                        {roleChatKid && <ErrorBoundary><RoleChatPage kid={roleChatKid} onBack={() => setRoleChatKid(null)} /></ErrorBoundary>}

                        {!isFullScreenView && activeTab === 0 && (
                          homeLoading
                            ? <HomeSkeletonLoader />
                            : (
                              <ErrorBoundary>
                                <ChatListPage
                                  onOpenTrainingAccount={openTrainingAccount}
                                  onOpenNick={openNickChat}
                                  onOpenRoleChat={openRoleChat}
                                  {...tabToolProps}
                                />
                              </ErrorBoundary>
                            )
                        )}
                        {!isFullScreenView && activeTab === 1 && (
                          <ErrorBoundary><ContactsPage onOpenNick={openNickChat} onOpenRoleChat={openRoleChat} {...tabToolProps} /></ErrorBoundary>
                        )}
                        {!isFullScreenView && activeTab === 2 && (
                          <ErrorBoundary><MomentsPage {...tabToolProps} /></ErrorBoundary>
                        )}
                        {!isFullScreenView && activeTab === 3 && (
                          <ErrorBoundary><WechatMinePage onLogout={handleLogout} onOpenOrder={openOrder} {...tabToolProps} /></ErrorBoundary>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {!isFullScreenView && (
                    <WechatTabBar active={activeTab} onTabChange={handleTabChange} />
                  )}
                </>
              )}
            </div>
          </div>
        </ProfileModalProvider>
      </SubscriptionProvider>
    </UserProvider>
  );
}

const orderBackButton = {
  position: 'sticky',
  top: 0,
  zIndex: 60,
  height: 48,
  width: '100%',
  border: 0,
  background: 'rgba(43,37,53,0.94)',
  color: '#f5efe8',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  fontWeight: 850,
  backdropFilter: 'blur(18px)',
};
