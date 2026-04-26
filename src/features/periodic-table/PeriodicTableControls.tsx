import React from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'motion/react';

export const PeriodicTableControls: React.FC = () => {
  const { zoomLevel, setZoomLevel } = useStore();

  const handleZoom = (delta: number) => {
    const nextZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 1.5);
    setZoomLevel(nextZoom);
  };

  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl shadow-2xl">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleZoom(0.1)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-white/5"
        title="Zoom In"
      >
        <Plus size={16} />
      </motion.button>
      
      <div className="px-2 min-w-[48px] text-center">
        <span className="text-[10px] font-mono text-cyan-400 font-bold">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleZoom(-0.1)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-white/5"
        title="Zoom Out"
      >
        <Minus size={16} />
      </motion.button>

      <div className="w-[1px] h-6 bg-white/10 mx-1" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setZoomLevel(1)}
        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-white/5"
        title="Reset Zoom"
      >
        <RotateCcw size={16} />
      </motion.button>
    </div>
  );
};
