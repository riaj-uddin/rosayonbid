import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Home,
  Globe, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Trophy, 
  Award,
  Menu,
  X,
  GraduationCap,
  Grid,
  Atom,
  Bot,
  ClipboardCheck,
  FileText,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const { language, setLanguage, setActiveTab, activeTab, setAIPanelOpen } = useStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'course', label: t.nav.course, icon: GraduationCap },
    { id: 'periodicTable', label: t.nav.periodicTable, icon: Grid },
    { id: 'visualizer', label: t.nav.visualizer, icon: Atom },
    { id: 'quiz', label: t.nav.quiz, icon: ClipboardCheck },
    { id: 'blog', label: t.nav.blog, icon: FileText },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'tutor') {
      setAIPanelOpen(true);
      setIsMobileMenuOpen(false);
      return;
    }
    setActiveTab(id as any);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050608]/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/20">
      {/* LEFT: Logo & App Name */}
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => handleNavClick('home')}
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform duration-300">
          <Atom size={22} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base md:text-xl tracking-tight leading-none">
            {t.ui.appName}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-500 font-mono opacity-60 hidden sm:block">
            Scientific Platform
          </span>
        </div>
      </div>

      {/* CENTER: Navigation Links (Desktop & Tablet) */}
      <nav className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => handleNavClick(link.id)}
            className={cn(
              "flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-all relative group",
              activeTab === link.id 
                ? "text-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(34,211,238,0.05)]" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <link.icon size={18} className={cn(
              "transition-transform duration-300",
              activeTab === link.id ? "text-cyan-400" : "group-hover:scale-110 text-slate-500 group-hover:text-cyan-400"
            )} />
            <span>{link.label}</span>
            {activeTab === link.id && (
              <motion.div 
                layoutId="nav-active"
                className="absolute bottom-1 left-3 lg:left-4 right-3 lg:right-4 h-0.5 bg-cyan-500 rounded-full"
              />
            )}
          </button>
        ))}
      </nav>

      {/* RIGHT: Utils & Auth */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1 group hover:border-cyan-500/30 transition-all font-mono"
        >
          <div className={cn(
            "px-2 py-1 rounded-lg text-[10px] md:text-xs transition-all",
            language === 'bn' ? "bg-cyan-500 text-black font-bold" : "text-slate-500"
          )}>BN</div>
          <div className={cn(
            "px-2 py-1 rounded-lg text-[10px] md:text-xs transition-all",
            language === 'en' ? "bg-cyan-500 text-black font-bold" : "text-slate-500"
          )}>EN</div>
        </button>

        <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block">
              <div className="text-xs font-semibold text-white tracking-tight leading-none">{user?.name}</div>
              <div className="text-[10px] text-cyan-500/60 font-mono uppercase tracking-widest mt-1">
                {user?.role}
              </div>
            </div>
            
            <div className="group relative">
              <button 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-white/10 transition-all hover:border-cyan-500/40 p-0.5"
              >
                <div className="w-full h-full rounded-[10px] bg-[#0c0e14] flex items-center justify-center text-cyan-400">
                  <UserIcon size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#050608] rounded-full" />
              </button>
              
              {/* Profile Dropdown */}
              <div className="absolute top-full right-0 mt-3 w-56 bg-[#0c0e14] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 scale-95 group-hover:scale-100 origin-top-right">
                <div className="p-4 border-b border-white/5 mb-2">
                   <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-1">Authenticated Session</div>
                   <div className="text-sm text-white truncate font-bold font-sans">{user?.name}</div>
                   <div className="text-[10px] text-cyan-400 opacity-70 truncate">{user?.role}@rosayonbid.sys</div>
                </div>

                <div className="space-y-1">
                  <button 
                    onClick={() => handleNavClick('dashboard')}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 text-xs md:text-sm rounded-xl transition-all",
                      activeTab === 'dashboard' ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <LayoutDashboard size={16} />
                    {t.ui.profile}
                  </button>

                  <button 
                    onClick={() => handleNavClick('leaderboard')}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 text-xs md:text-sm rounded-xl transition-all",
                      activeTab === 'leaderboard' ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Trophy size={16} />
                    {t.nav.leaderboard}
                  </button>

                  <button 
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-3 text-xs md:text-sm text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                  >
                    <Award size={16} />
                    {t.nav.gamification}
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-xs md:text-sm text-red-500 hover:bg-red-500/5 rounded-xl transition-all font-bold"
                  >
                    <LogOut size={16} />
                    {t.ui.logout}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => handleNavClick('login')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all group overflow-hidden relative"
          >
            <UserIcon size={18} className="text-cyan-400 group-hover:scale-110 transition-transform z-10" />
            <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest z-10">{t.ui.login}</span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 group-hover:translate-x-full transition-transform duration-700" />
          </button>
        )}

        {/* Mobile Hamburger Toggle (Hidden on Tablet/Desktop) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="absolute top-full left-0 right-0 bg-[#0c0e14] border-b border-white/5 z-40 p-4 origin-top shadow-2xl md:hidden max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={cn(
                    "flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-left group",
                    activeTab === link.id 
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]" 
                      : "bg-white/5 text-slate-300 border border-transparent hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      activeTab === link.id ? "bg-cyan-500/20" : "bg-white/5 group-hover:bg-white/10"
                    )}>
                      <link.icon size={20} className={activeTab === link.id ? "text-cyan-400" : "text-slate-400"} />
                    </div>
                    <span className="font-bold text-sm tracking-wide">{link.label}</span>
                  </div>
                  <ChevronDown className={cn("text-slate-600 transition-transform", activeTab === link.id && "rotate-[-90deg] text-cyan-400")} size={16} />
                </button>
              ))}
            </div>

            {/* Mobile Bottom Stats (Optional but cool) */}
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Bilingual Education Platform</span>
              <span>v4.3.0 // BUILD_A22</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
