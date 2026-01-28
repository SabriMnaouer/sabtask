
import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationsPanel } from './components/NotificationsPanel';
import { LoginScreen } from './components/auth/LoginScreen';
import { ViewManager } from './components/views/ViewManager';
import { ModalManager } from './components/modals/ModalManager';
import { AppProvider, useApp } from './context/AppContext';

const AppLayout = () => {
  const { state, actions } = useApp();

  if (!state.isAuth) {
    return <LoginScreen onLogin={() => actions.setIsAuth(true)} />;
  }
  const isFixedView = state.activeTab === 'hub';

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-primary-500/30">

      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />

        {state.showNotifications && <NotificationsPanel />}

        <div className={`
            flex-1 p-4 md:p-6 lg:p-8 relative
            ${isFixedView ? 'overflow-hidden flex flex-col' : 'overflow-auto scroll-smooth custom-scrollbar'}
        `}>
          {/* Top Line Loader (Optional overlap with Skeleton) */}
          {state.isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary-100 overflow-hidden z-50">
              <div className="h-full bg-primary-500 animate-pulse w-full origin-left-right"></div>
            </div>
          )}

          <div className={`mx-auto ${isFixedView ? 'h-full w-full' : '' /* Removed max-w constraint for Kanban/Projects to use full width if needed */}`}>
            <ViewManager />
          </div>
        </div>
      </main>

      <ModalManager />
    </div>
  );
};

// --- Root App ---
export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
