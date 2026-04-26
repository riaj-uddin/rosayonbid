import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Thermometer, Layers, Activity, Box } from 'lucide-react';
import { translations } from '../translations';

export const ElementDetailsPanel: React.FC = () => {
  const { selectedElement, language, setActiveTab } = useStore();
  const t = translations[language].ui;

  if (!selectedElement) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center opacity-20 py-12">
        <Beaker size={48} />
        <p className="text-xs uppercase font-mono mt-4 tracking-widest">{t.awaitingSignal}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0c0e14] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t.technicalMetadata}</h3>
          <h2 className="text-3xl font-light text-white tracking-tighter">{selectedElement.name}</h2>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-white/10 font-mono leading-none">{selectedElement.atomicNumber}</div>
          <div className="text-[9px] font-mono text-cyan-500/60 uppercase">Z_NUMBER</div>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem 
          icon={<Beaker size={14} className="text-purple-400" />} 
          label={language === 'en' ? "Family" : "পরিবার"} 
          value={selectedElement.category} 
        />
        <StatItem 
          icon={<Thermometer size={14} className="text-orange-400" />} 
          label={language === 'en' ? "Electronegativity" : "তড়িৎ ঋণাত্মকতা"} 
          value={selectedElement.electronegativity?.toString() || "N/A"} 
        />
        <StatItem 
          icon={<Layers size={14} className="text-blue-400" />} 
          label={language === 'en' ? "Shells" : "শেলসমূহ"} 
          value={selectedElement.shells.join(', ')} 
        />
        <StatItem 
          icon={<Activity size={14} className="text-green-400" />} 
          label={t.atomicMass} 
          value={`${selectedElement.atomicMass.toFixed(3)} u`} 
        />
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Electron Config */}
      <div>
        <p className="text-[9px] text-slate-500 uppercase tracking-tighter mb-3">{language === 'en' ? "Electronic Configuration" : "ইলেকট্রন বিন্যাস"}</p>
        <div className="flex flex-wrap gap-2">
          {selectedElement.electronConfiguration.split(' ').map((orbital, i) => (
             <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono text-cyan-400 hover:bg-white/10 transition-colors cursor-default">
                {orbital}
             </span>
          ))}
        </div>
      </div>

      {/* Color Swatch */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{t.spectralSignature}</span>
        <div 
          className="w-12 h-1.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-colors duration-500" 
          style={{ backgroundColor: selectedElement.color }}
        />
      </div>

      <button
        onClick={() => setActiveTab('visualizer')}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
      >
        <Box size={18} />
        <span className="text-xs uppercase tracking-wider">
          ভিজুয়ালাইজেশন দেখুন / See Visualization
        </span>
      </button>
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[8px] text-slate-500 uppercase tracking-tighter">{label}</span>
    </div>
    <p className="text-[11px] text-white font-medium truncate">{value}</p>
  </div>
);
