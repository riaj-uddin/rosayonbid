import React from 'react';
import { useAuthStore, User } from '../../store/useAuthStore';
import { ArrowRight } from 'lucide-react';

export const AuthDemo: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = (role: User['role']) => {
    // Demonstration of hardcoded login
    const demoUser: User = {
      name: role === 'admin' ? 'Dr. Aris Thorne' : role === 'content-manager' ? 'Sarah Miller' : 'John Doe',
      email: `${role}@example.com`,
      role: role,
    };
    login(demoUser);
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-slate-900 rounded-2xl border border-white/10 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">System Access</h2>
        <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${isAuthenticated ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isAuthenticated ? 'Online' : 'Offline'}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs uppercase font-mono tracking-widest">Active Operator</p>
            <p className="text-white text-lg font-medium">{user?.name}</p>
            <p className="text-slate-500 text-sm">{user?.email}</p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase mb-2">Clearance Level</p>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-mono border border-cyan-500/30 capitalize">
              {user?.role}
            </span>
          </div>

          <button 
            onClick={logout}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-medium"
          >
            Terminate Session
          </button>
        </div>
      ) : (
        <div className="space-y-4 py-4 text-center">
          <p className="text-slate-400 text-sm mb-6">Select a clearance level to initialize session:</p>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => handleLogin('user')}
              className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl transition-all font-medium group flex items-center justify-center gap-2"
            >
              Researcher Access
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => handleLogin('content-manager')}
              className="w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl transition-all font-medium group flex items-center justify-center gap-2"
            >
              Registry Access
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => handleLogin('admin')}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-medium group flex items-center justify-center gap-2"
            >
              Command Access
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-mono text-center">
          Zustand State Engine // LocalStorage Persisting
        </p>
      </div>
    </div>
  );
};
