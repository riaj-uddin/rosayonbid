import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Atom, 
  Share2, 
  Hexagon, 
  Zap, 
  BarChart3, 
  ChevronRight,
  Maximize2,
  Info
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { cn } from '../../lib/utils';
import { AtomViewer } from './AtomViewer';
import { BondingViewer } from './BondingViewer';
import { GeometryViewer } from './GeometryViewer';
import { ReactionSimulator } from './ReactionSimulator';
import { PeriodicTrends } from './PeriodicTrends';

type VisCategory = 'atomic' | 'bonding' | 'geometry' | 'reaction' | 'trends';

export const VisualizationDashboard: React.FC = () => {
  const { language } = useStore();
  const [activeCategory, setActiveCategory] = useState<VisCategory>('atomic');
  const t = translations[language];

  const categories = [
    { id: 'atomic', label: language === 'bn' ? 'পারমাণবিক গঠন' : 'Atomic Structure', icon: Atom, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'bonding', label: language === 'bn' ? 'রাসায়নিক বন্ধন' : 'Chemical Bonding', icon: Share2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'geometry', label: language === 'bn' ? 'আণবিক জ্যামিতি' : 'Molecular Geometry', icon: Hexagon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'reaction', label: language === 'bn' ? 'বিক্রিয়া সিমুলেশন' : 'Reaction Simulation', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { id: 'trends', label: language === 'bn' ? 'পর্যায়বৃত্তি' : 'Periodic Trends', icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Navigation Headers */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as VisCategory)}
            className={cn(
              "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group relative overflow-hidden",
              activeCategory === cat.id 
                ? "bg-white/5 border-white/20 shadow-xl" 
                : "bg-black/20 border-white/5 hover:border-white/10 opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", cat.bg, cat.color)}>
              <cat.icon size={24} />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest text-center leading-tight",
              activeCategory === cat.id ? "text-white" : "text-slate-500"
            )}>
              {cat.label}
            </span>
            {activeCategory === cat.id && (
              <motion.div 
                layoutId="vis-active"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              />
            )}
          </button>
        ))}
      </div>

      {/* Primary Visualization Area */}
      <div className="flex-1 overflow-visible relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full"
          >
            {activeCategory === 'atomic' && <AtomViewer />}
            {activeCategory === 'bonding' && <BondingViewer />}
            {activeCategory === 'geometry' && <GeometryViewer />}
            {activeCategory === 'reaction' && <ReactionSimulator />}
            {activeCategory === 'trends' && <PeriodicTrends />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
