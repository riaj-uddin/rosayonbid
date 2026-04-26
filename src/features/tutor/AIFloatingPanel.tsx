import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AITutor } from './AITutor';
import { cn } from '../../lib/utils';

export const AIFloatingPanel: React.FC = () => {
  const { isAIPanelOpen, setAIPanelOpen, activeTab, language } = useStore();

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAIPanelOpen(!isAIPanelOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-12 md:h-14 flex items-center justify-center z-[100] shadow-2xl transition-all duration-300 px-4 md:px-6 rounded-full group overflow-hidden",
          isAIPanelOpen 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        )}
      >
        <div className="flex items-center gap-3">
          {isAIPanelOpen ? (
            <>
              <X className="text-white" size={24} />
              <span className="text-sm font-bold text-white uppercase tracking-widest hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Bot className="text-black group-hover:scale-110 transition-transform" size={24} />
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles size={10} className="text-white" />
                </motion.div>
              </div>
              <span className="text-xs md:text-sm font-bold text-black tracking-tight whitespace-nowrap">
                রসায়নবিদ এআই
              </span>
            </>
          )}
        </div>
      </motion.button>

      {/* Side Panel / Bottom Sheet */}
      <AnimatePresence>
        {isAIPanelOpen && (
          <>
            {/* Backdrop for Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAIPanelOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
            />

            {/* Panel Container */}
            <motion.div
              initial={{ 
                x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 400,
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 0,
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0, 
                opacity: 1 
              }}
              exit={{ 
                x: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 400,
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 0,
                opacity: 0 
              }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed z-[95] shadow-2xl",
                // Mobile: Bottom Sheet
                "bottom-0 left-0 right-0 h-[80vh] rounded-t-3xl overflow-hidden md:bottom-24 md:right-6 md:left-auto md:w-[400px] md:h-[600px] md:rounded-2xl"
              )}
            >
              <div className="h-full flex flex-col bg-[#0c0e14] border-t md:border border-white/10 overflow-hidden">
                {/* Header for the Panel */}
                <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">ROSAYONBID AI</h3>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">
                          Context: {activeTab === 'periodicTable' ? 'Structural Analysis' : 
                                   activeTab === 'visualizer' ? 'Atomic Layout' : 
                                   activeTab === 'quiz' ? 'Evaluation Assist' : 'General Tutor'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAIPanelOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0">
                  <AITutor />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
