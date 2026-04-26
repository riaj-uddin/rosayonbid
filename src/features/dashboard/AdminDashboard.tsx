import React from 'react';
import { motion } from 'motion/react';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { Shield, Activity, Database, Users, Terminal, Trash2, Edit2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const demoUsers = [
    { name: 'Dr. Aris Thorne', email: 'admin@example.com', role: 'admin', status: 'Active', color: 'text-red-400' },
    { name: 'Sarah Miller', email: 'manager@example.com', role: 'content-manager', status: 'Online', color: 'text-purple-400' },
    { name: 'Robert Chen', email: 'user@example.com', role: 'user', status: 'Connected', color: 'text-cyan-400' },
  ];

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6 pb-12">
        {/* Header / System Identity */}
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Central Admin Command</h1>
                <p className="text-slate-400 font-mono text-xs">Operator: {user?.name} // Security Protocol: OMEGA-4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatBox icon={Users} label="Auth Entities" value="2,482" color="text-white" />
              <StatBox icon={Database} label="Sync Health" value="99.9%" color="text-green-400" />
              <StatBox icon={Activity} label="System Payload" value="42%" color="text-yellow-400" />
              <StatBox icon={Terminal} label="Active Threads" value="12" color="text-red-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manage Users Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Auth Management Terminal</h2>
              <button className="text-[10px] text-red-400 hover:underline">Add New Protocol</button>
            </div>
            
            <div className="bg-[#0c0e14] border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Operator Identity</th>
                    <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Clearance</th>
                    <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Status</th>
                    <th className="p-4 text-[10px] uppercase font-mono text-slate-500 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {demoUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-white/2 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white font-medium">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border border-current ${u.color} bg-current/5`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          <span className="text-xs text-slate-400">{u.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 text-slate-500">
                          <button className="hover:text-white transition-colors p-1"><Edit2 size={14} /></button>
                          <button className="hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Overview Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 px-2">Quantum Status Feed</h2>
            
            <div className="bg-[#0c0e14] border border-white/10 rounded-2xl p-6 space-y-6">
              <SystemMetric label="Elemental Data Integrity" progress={98} color="bg-green-500" />
              <SystemMetric label="Spectroscopic Matching Speed" progress={72} color="bg-cyan-500" />
              <SystemMetric label="AI Tutor Synchronization" progress={45} color="bg-yellow-500" />
              <SystemMetric label="Security Layer Firewall" progress={100} color="bg-red-500" />

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal size={14} className="text-red-400" />
                  <span className="text-[10px] uppercase font-mono text-slate-500">Log Output</span>
                </div>
                <div className="bg-black/50 p-3 rounded font-mono text-[9px] text-green-500/70 space-y-1">
                  <p>{">"} INITIALIZING SECURITY_CORE_V4</p>
                  <p>{">"} SCANNING NODES... [OK]</p>
                  <p className="text-yellow-500/70">{">"} 2 ATTEMPTS FROM IP 192.168.1.1 [BLOCKED]</p>
                  <p>{">"} ENCRYPTING SESSION_TOKEN_{Math.floor(Math.random()*1000)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

function StatBox({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg text-slate-500">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500">{label}</p>
        <p className={`text-xl font-medium tracking-tight ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function SystemMetric({ label, progress, color }: { label: string, progress: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase font-mono">
        <span className="text-slate-500">{label}</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
