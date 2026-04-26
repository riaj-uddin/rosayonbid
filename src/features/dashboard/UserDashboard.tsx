import React from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useStore } from '../../store/useStore';
import * as LucideIcons from 'lucide-react';

const icons = {
  Rocket: LucideIcons.Rocket,
  Shield: LucideIcons.Shield,
  Trophy: LucideIcons.Trophy,
  Medal: LucideIcons.Medal,
  Target: LucideIcons.Target,
  Zap: LucideIcons.Zap,
  Star: LucideIcons.Star,
};

import { RoleGuard } from '../../components/auth/RoleGuard';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowRight, Grid3X3, BookOpen } from 'lucide-react';
import { translations } from '../../translations';

export const UserDashboard: React.FC = () => {
  const { progress, setActiveTab, language } = useStore();
  const { user, isAuthenticated } = useAuthStore();
  const t = translations[language].dashboard;

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-6 backdrop-blur-xl">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <LucideIcons.ShieldAlert className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Login Required</h2>
          <p className="text-slate-400 text-sm">
            You need to be part of the scientific network to access personal dossiers, 
            track your research progress, and participate in the global leaderboard.
          </p>
          <button 
            onClick={() => setActiveTab('login' as any)}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-900/20"
          >
            Connect to Terminal
          </button>
        </div>
      </div>
    );
  }

  const chartData = progress.quizHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score
  }));

  const stats = [
    { label: 'Total XP', value: progress.points, icon: LucideIcons.Zap, color: 'text-yellow-400' },
    { label: 'Quizzes', value: progress.solvedQuizzes, icon: LucideIcons.Target, color: 'text-cyan-400' },
    { label: 'Elements', value: progress.learnedElements.length, icon: LucideIcons.Database, color: 'text-purple-400' },
    { label: 'Rank', value: 'Quantum Chemist', icon: LucideIcons.Trophy, color: 'text-orange-400' },
  ];

  return (
    <RoleGuard allowedRoles={['user', 'admin', 'content-manager']}>
      <div className="p-8 h-full overflow-y-auto space-y-8 bg-[#050608]/50">
        {/* Welcome Section */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
          <div className="space-y-2 text-center md:text-left z-10">
             <h1 className="text-3xl font-bold text-white tracking-tight">{t.systemOnline}, {user?.name}</h1>
             <p className="text-slate-400 max-w-md">{t.quantumCoreSync}</p>
             <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setActiveTab('periodicTable')}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                >
                  <Grid3X3 size={16} />
                  {t.accessMatrix}
                </button>
                <button 
                  onClick={() => setActiveTab('visualizer')}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  {t.atomVisualizer}
                </button>
             </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">{t.networkSpeed}</span>
                <span className="text-xl font-mono text-green-400">1.2 Gbps</span>
             </div>
             <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                <LucideIcons.Wifi size={20} />
             </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-light text-white tracking-tight">{t.missionControl}</h1>
            <p className="text-slate-500 font-mono text-[10px] mt-2 uppercase tracking-widest">{t.performance}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">{t.currentEfficiency}</div>
            <div className="text-2xl font-mono text-cyan-400">98.2% <LucideIcons.TrendingUp className="inline w-4 h-4" /></div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/5 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-mono text-white tracking-tighter">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz Performance Chart */}
        <div className="lg:col-span-2 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <LucideIcons.Activity className="w-5 h-5 text-cyan-500" />
              {t.intelligenceHistory}
            </h3>
            <div className="flex gap-2">
               <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] text-cyan-500 uppercase font-mono">{t.realTimeData}</div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22d3ee" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badges Locker */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-8">
            <LucideIcons.Award className="w-5 h-5 text-purple-500" />
            {t.distinctionArchive}
          </h3>
          <div className="space-y-4">
            {progress.badges.map((badge, i) => {
              const Icon = (icons as any)[badge.icon] || LucideIcons.Shield;
              const isLocked = !badge.unlockedAt;
              
              return (
                <div 
                  key={badge.id}
                  className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                    isLocked ? 'bg-black/20 border-white/5 opacity-50 grayscale' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isLocked ? 'bg-slate-800' : 'bg-purple-500/20'}`}>
                    <Icon className={`w-5 h-5 ${isLocked ? 'text-slate-600' : 'text-purple-400'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{badge.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">
                      {isLocked ? t.classified : `${t.unlocked} ${new Date(badge.unlockedAt!).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-slate-400 uppercase font-mono transition-colors">
            {t.viewAllAchievements}
          </button>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
};
