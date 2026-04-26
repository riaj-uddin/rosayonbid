import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, TrendingUp, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { RoleGuard } from '../../components/auth/RoleGuard';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  level: number;
  isCurrentUser?: boolean;
}

const leaders: LeaderboardEntry[] = [
  { rank: 1, name: "Dr. Victor Von Chem", points: 15420, level: 85 },
  { rank: 2, name: "Marie Curie Enthusiast", points: 14200, level: 78 },
  { rank: 3, name: "QuantumLeaper_01", points: 12150, level: 65 },
  { rank: 4, name: "Niels Bohr Fan", points: 11800, level: 62 },
  { rank: 5, name: "Mendeleev_Spirit", points: 11000, level: 58 },
  { rank: 6, name: "ElectronSharer", points: 10500, level: 55 },
  { rank: 7, name: "Researcher_X", points: 9800, level: 50 },
  { rank: 8, name: "ValenceVibes", points: 9200, level: 48 },
  { rank: 9, name: "PeriodicPirate", points: 8750, level: 45 },
  { rank: 10, name: "LabRat_99", points: 8100, level: 42 },
];

export const Leaderboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { setActiveTab } = useStore();

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center space-y-6 backdrop-blur-xl">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Competitive Access Restricted</h2>
          <p className="text-slate-400 text-sm">
            Join the global scientific network to rank among top researchers, 
            earn distinctions, and compare your research progress with the elite.
          </p>
          <button 
            onClick={() => setActiveTab('login' as any)}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-cyan-900/20"
          >
            Authenticate Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['user', 'admin', 'content-manager']}>
      <div className="p-8 h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Trophy className="text-yellow-500 w-8 h-8" />
              Global Research Leaderboard
            </h1>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-[0.2em]">Top contributors to the scientific network</p>
          </div>
          <div className="hidden md:flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Active Researchers</span>
                <span className="text-xl font-mono text-cyan-400">12,482</span>
             </div>
             <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-500">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
             </div>
          </div>
        </div>

        {/* Podium / Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PodiumCard entry={leaders[1]} medal={<Medal className="text-slate-400" />} color="border-slate-400/20" delay={0.1} />
          <PodiumCard entry={leaders[0]} medal={<Crown className="text-yellow-400 w-10 h-10" />} color="border-yellow-400/30 scale-105 bg-yellow-400/5" delay={0} />
          <PodiumCard entry={leaders[2]} medal={<Medal className="text-amber-600" />} color="border-amber-600/20" delay={0.2} />
        </div>

        {/* Table View */}
        <div className="bg-[#0c0e14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Find researcher..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <div className="flex gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">All Time</button>
              <button className="px-4 py-2 hover:text-white">This Month</button>
              <button className="px-4 py-2 hover:text-white">Weekly</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-[#0c0e14] z-10">
                <tr className="border-b border-white/5 bg-black/20">
                  <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Rank</th>
                  <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Researcher</th>
                  <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Scientific Quotient</th>
                  <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaders.map((entry, i) => (
                  <motion.tr 
                    key={entry.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "group hover:bg-white/2 transition-colors",
                      i < 3 ? "bg-white/[0.01]" : ""
                    )}
                  >
                    <td className="p-4">
                      <span className={cn(
                        "font-mono text-sm inline-flex w-8 h-8 items-center justify-center rounded-lg",
                        i === 0 ? "bg-yellow-500/10 text-yellow-500" :
                        i === 1 ? "bg-slate-500/10 text-slate-400" :
                        i === 2 ? "bg-amber-600/10 text-amber-600" :
                        "text-slate-600"
                      )}>
                        {entry.rank}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-white/10">
                          {entry.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-sm font-medium transition-colors group-hover:text-cyan-400",
                            entry.rank === 1 ? "text-yellow-400" : "text-slate-200"
                          )}>
                            {entry.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 uppercase">Lv. {entry.level} Researcher</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-white">{entry.points.toLocaleString()} XP</span>
                        <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${(entry.points / 16000) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-green-400">
                        <TrendingUp size={12} />
                        +{Math.floor(Math.random() * 500)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

function PodiumCard({ entry, medal, color, delay }: { entry: LeaderboardEntry, medal: any, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-white/5 border rounded-3xl p-8 text-center space-y-4 flex flex-col items-center relative overflow-hidden backdrop-blur-xl group",
        color
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-50">
        {medal}
      </div>
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-2xl font-bold text-cyan-400 border border-white/10 shadow-2xl transition-transform group-hover:scale-110">
        {entry.name[0]}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">{entry.name}</h3>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Level {entry.level} Initiate</p>
      </div>
      <div className="text-3xl font-mono text-cyan-400 tracking-tighter">
        {entry.points.toLocaleString()}
        <span className="text-xs text-slate-600 ml-1">XP</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(entry.points / 16000) * 100}%` }}
          transition={{ duration: 1, delay: delay + 0.5 }}
          className="h-full bg-cyan-500" 
        />
      </div>
    </motion.div>
  );
}
