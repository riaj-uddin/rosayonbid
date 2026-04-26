import React, { useEffect } from 'react';
import { Beaker } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { 
  GraduationCap,
  Bot
} from 'lucide-react';
import { AtomViewer } from './features/visualizer/AtomViewer';
import { PeriodicTable } from './features/periodic-table/PeriodicTable';
import { AITutor } from './features/tutor/AITutor';
import { VisualizationDashboard } from './features/visualizer/VisualizationDashboard';
import { QuizManager } from './features/quiz/QuizManager';
import { UserDashboard } from './features/dashboard/UserDashboard';
import { Leaderboard } from './features/dashboard/Leaderboard';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { ContentDashboard } from './features/dashboard/ContentDashboard';
import { AIFloatingPanel } from './features/tutor/AIFloatingPanel';
import { ElementDetailsPanel } from './components/ElementDetailsPanel';
import { LoginPage } from './components/auth/LoginPage';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { motion, AnimatePresence } from 'motion/react';
import { ElementData } from './types';
import { translations } from './translations';
import { Blog } from './features/blog/Blog';
import { HomePage } from './features/home/HomePage';
import { cn } from './lib/utils';

export default function App() {
  const { activeTab, setActiveTab, selectedElement, setSelectedElement, syncProgress, fetchElements, elements, language } = useStore();
  const { isAuthenticated, user } = useAuthStore();
  const t = translations[language].nav;

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const currentTab = useStore.getState().activeTab;
      if (hash && (hash as any) !== currentTab) {
        setActiveTab(hash as any);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial sync from hash to store
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      setActiveTab(initialHash as any);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveTab]);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    if (activeTab && activeTab !== currentHash) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Role validation for admin tabs & AI Panel redirect
  useEffect(() => {
    if (activeTab === 'admin_dashboard' && user?.role !== 'admin') {
      setActiveTab('periodicTable');
    }
    if (activeTab === 'content_dashboard' && user?.role !== 'content-manager') {
      setActiveTab('periodicTable');
    }
    if (activeTab === 'tutor') {
      setActiveTab('periodicTable');
      useStore.getState().setAIPanelOpen(true);
    }
  }, [activeTab, user, setActiveTab]);

  useEffect(() => {
    fetchElements();
    syncProgress();
  }, [syncProgress, fetchElements]);

  // Handle URL query parameters for element selection
  useEffect(() => {
    if (elements.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const elementSymbol = params.get('element');
      
      if (elementSymbol) {
        const target = elements.find(el => el.symbol.toLowerCase() === elementSymbol.toLowerCase());
        if (target) {
          setSelectedElement(target);
          setActiveTab('visualizer');
          
          // Clear query param to prevent re-selection on every element list update
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  }, [elements, setSelectedElement, setActiveTab]);

  const isWideModule = activeTab === 'home' || activeTab === 'periodicTable' || activeTab === 'dashboard' || activeTab === 'blog' || activeTab === 'leaderboard' || activeTab === 'course' || activeTab === 'visualizer';
  const isScrollableUI = activeTab === 'home' || activeTab === 'blog' || activeTab === 'dashboard' || activeTab === 'leaderboard';

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 font-sans flex flex-col overflow-x-hidden">
      <Header />

      <motion.main 
        className={cn(
          "flex-1 flex flex-col relative",
          !isScrollableUI && "h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden"
        )}
      >
        <div className={cn(
          "flex-1 flex gap-6",
          activeTab === 'home' ? "p-0" : "p-6",
          !isScrollableUI ? "overflow-hidden" : "overflow-y-auto"
        )}>
          {/* Main Visual/Module Area */}
          <div className={cn(
            "flex-1 flex flex-col min-w-0",
            activeTab !== 'home' && "gap-6",
            !isScrollableUI && "overflow-y-auto pr-2 scrollbar-thin"
          )}>
            
            <AnimatePresence mode="wait">
              {activeTab === 'home' ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <HomePage />
                </motion.div>
              ) : activeTab as string === 'login' ? (
                <motion.div 
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1"
                >
                  <LoginPage />
                </motion.div>
              ) : activeTab === 'dashboard' ? (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <UserDashboard />
                </motion.div>
              ) : activeTab === 'leaderboard' ? (
                <motion.div 
                  key="leaderboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <Leaderboard />
                </motion.div>
              ) : activeTab === 'admin_dashboard' ? (
                <motion.div 
                  key="admin_dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <AdminDashboard />
                </motion.div>
              ) : activeTab === 'content_dashboard' ? (
                <motion.div 
                  key="content_dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <ContentDashboard />
                </motion.div>
              ) : activeTab === 'periodicTable' ? (
                <motion.div 
                  key="periodicTable"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                   <div className="mb-4 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
                        <span>Quantum_Matrix // Active</span>
                        <span>Rev_SSC_HSC_2024</span>
                    </div>
                   <PeriodicTable />
                </motion.div>
              ) : activeTab === 'blog' ? (
                <motion.div 
                  key="blog"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <Blog />
                </motion.div>
              ) : activeTab === 'course' ? (
                <motion.div 
                  key="course"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 min-h-0"
                >
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-6 backdrop-blur-xl">
                      <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                        <GraduationCap className="w-10 h-10 text-cyan-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white tracking-tight">Academic Curriculum</h2>
                      <p className="text-slate-400 text-lg">
                        Select your grade level to access structured chemistry lessons, 
                        interactive experiments, and preparatory assignments.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-2xl p-6 transition-all text-left group">
                          <h3 className="text-white font-bold mb-1">SSC Level</h3>
                          <p className="text-xs text-slate-500 uppercase font-mono tracking-widest group-hover:text-cyan-400">Class 9 - 10</p>
                        </button>
                        <button className="bg-white/5 hover:bg-cyan-500/10 border border-white/10 rounded-2xl p-6 transition-all text-left group">
                          <h3 className="text-white font-bold mb-1">HSC Level</h3>
                          <p className="text-xs text-slate-500 uppercase font-mono tracking-widest group-hover:text-cyan-400">Class 11 - 12</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="standard-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-6"
                >
                  <div className="min-h-[500px] flex-shrink-0">
                    <AnimatePresence mode="wait">
                      {activeTab === 'visualizer' && (
                        <motion.div 
                          key="visualizer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="w-full"
                        >
                          <VisualizationDashboard />
                        </motion.div>
                      )}
                      {activeTab === 'quiz' && (
                        <motion.div 
                          key="quiz"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="h-full"
                        >
                          <QuizManager />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar Desktop Tutor - Only Stats and Details now */}
          {!isWideModule && (
            <aside className="hidden lg:flex w-80 flex-col gap-6 h-full flex-shrink-0">
             <div className="flex-1">
                <ElementDetailsPanel />
             </div>
          </aside>
          )}
        </div>

        <Footer />
      </motion.main>
      
      <AIFloatingPanel />
    </div>
  );
}

function StatCard({ label, value, unit, progress }: { label: string, value: string, unit: string, progress: number }) {
   return (
      <div className="bg-white/5 rounded-2xl border border-white/5 p-5 flex flex-col justify-between hover:bg-white/10 transition-all group overflow-hidden relative">
         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
         <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl text-white font-mono tracking-tighter group-hover:text-cyan-400 transition-colors">{value}</span>
            <span className="text-[10px] text-slate-600 font-mono">{unit}</span>
         </div>
         <div className="w-full h-1 bg-cyan-950 rounded-full mt-2 relative overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1 }}
               className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
            />
         </div>
      </div>
   );
}
