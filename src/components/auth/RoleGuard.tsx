import React from 'react';
import { useAuthStore, UserRole } from '../../store/useAuthStore';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * RoleGuard Component
 * Enforces Role-Based Access Control (RBAC) at the component level.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  const setActiveTab = useStore(state => state.setActiveTab);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050608]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Authentication Required</h1>
          <p className="text-slate-500 max-w-md">You must be connected to the secure network to access this node.</p>
          <div className="pt-4">
             <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">REDIRECTING_TO_TERMINAL</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Denied</h1>
            <p className="text-slate-500 max-w-sm mx-auto">
              Clearance Level <span className="text-red-400 font-mono uppercase">[{user?.role}]</span> is insufficient.
              Authorized personnels: <span className="text-white font-mono uppercase">[{allowedRoles.join(', ')}]</span>
            </p>
          </div>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Researcher Node
          </button>

          <div className="text-[10px] font-mono text-red-500/40 uppercase tracking-[0.3em] pt-8">
            SECURITY_VIOLATION_LOGGED // 403_FORBIDDEN
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
