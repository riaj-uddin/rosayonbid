import React from 'react';
import { motion } from 'motion/react';
import { Edit3, CheckCircle, FileText, Layers, Archive } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

import { RoleGuard } from '../../components/auth/RoleGuard';

export const ContentDashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <RoleGuard allowedRoles={['content-manager', 'admin']}>
      <div className="space-y-6">
      <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
            <Edit3 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Metadata Registry Control</h1>
            <p className="text-slate-400">Manager: {user?.name} [Access: {user?.role?.toUpperCase()}]</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] uppercase font-mono text-slate-500">Pending Approvals</p>
                 <p className="text-3xl font-light text-white">12</p>
              </div>
              <FileText className="text-purple-400 opacity-50" size={24} />
           </div>
           <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] uppercase font-mono text-slate-500">Active Protocols</p>
                 <p className="text-3xl font-light text-white">118</p>
              </div>
              <Layers className="text-cyan-400 opacity-50" size={24} />
           </div>
           <div className="bg-black/40 border border-white/5 p-6 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] uppercase font-mono text-slate-500">Last Synced</p>
                 <p className="text-lg font-light text-green-400">2 min ago</p>
              </div>
              <CheckCircle className="text-green-500 opacity-50" size={24} />
           </div>
        </div>
      </div>

      <div className="bg-[#0c0e14] border border-white/10 rounded-2xl overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Protocol Review Queue</h3>
            <button className="text-[10px] text-cyan-400 hover:underline">View Archive</button>
         </div>
         <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors">
                       <Archive size={18} />
                    </div>
                    <div>
                       <p className="text-sm text-white">Element {100 + i} Spectroscopic Data</p>
                       <p className="text-[10px] text-slate-500 font-mono">ID: PROTOCOL_X_{i*14}</p>
                    </div>
                 </div>
                 <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] uppercase">Review Required</span>
              </div>
            ))}
         </div>
      </div>
    </div>
    </RoleGuard>
  );
};
