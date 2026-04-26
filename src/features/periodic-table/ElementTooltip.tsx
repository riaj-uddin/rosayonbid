import React from 'react';
import { motion } from 'motion/react';
import { ElementData } from '../../types';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { Box } from 'lucide-react';

interface ElementTooltipProps {
  element: ElementData;
  x: number;
  y: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ElementTooltip: React.FC<ElementTooltipProps> = ({ 
  element, 
  x, 
  y, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const { setActiveTab, setSelectedElement, language } = useStore();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isRightSide = x > window.innerWidth / 2;
  const horizontalOffset = isMobile ? -175 : (isRightSide ? -360 : 30);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alkali metal': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'alkaline earth metal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'transition metal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'post-transition metal': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
      case 'metalloid': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'nonmetal': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'halogen': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'noble gas': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'lanthanide': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'actinide': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ 
        position: 'fixed', 
        left: isMobile ? '50%' : x + horizontalOffset,
        transform: isMobile ? 'translateX(-50%)' : 'none',
        top: isMobile ? 'auto' : Math.max(10, Math.min(y - 120, window.innerHeight - 450)),
        bottom: isMobile ? 32 : 'auto',
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
      className={cn(
        "bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all",
        "w-[90vw] max-w-[350px] p-4 gap-3 md:w-80 md:p-6 md:gap-5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">Atomic NO.</span>
          <span className="text-2xl md:text-3xl font-bold text-white font-mono leading-none">{element.atomicNumber}</span>
        </div>
        <div className={cn("px-3 py-1.5 rounded text-[10px] md:text-[11px] font-bold uppercase tracking-widest border", getCategoryColor(element.category))}>
          {element.category}
        </div>
      </div>

      <div className="flex items-center gap-4 py-2 border-y border-white/5">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-white tracking-widest shrink-0">
          {element.symbol}
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-lg md:text-xl font-bold text-white truncate leading-tight">{language === 'bn' ? (element.nameBn ?? element.name) : (element.nameEn ?? element.name)}</h3>
          <p className="text-xs md:text-base text-cyan-400 font-medium truncate opacity-70">
            {language === 'bn' ? (element.nameEn ?? element.name) : (element.nameBn ?? '')}
          </p>
        </div>
      </div>

      {element.image && (
        <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 group">
          <img 
            src={element.image} 
            alt={element.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">Atomic Mass</span>
          <span className="text-xs md:text-sm font-bold text-white">{element.atomicMass.toFixed(3)} u</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-mono text-slate-500 uppercase tracking-widest">Physical State</span>
          <span className="text-xs md:text-sm font-bold text-cyan-400 capitalize">{element.state || 'Solid'}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
          setActiveTab('visualizer');
        }}
        className="mt-2 w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
      >
        <Box size={16} />
        <span className="text-xs md:text-sm uppercase tracking-wider">
          {language === 'bn' ? 'ভিজুয়ালাইজেশন দেখুন' : 'See Visualization'}
        </span>
      </button>
    </motion.div>
  );
};
