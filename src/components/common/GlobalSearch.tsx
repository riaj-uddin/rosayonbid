import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useElementSearch } from '../../hooks/useElementSearch';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ElementData } from '../../types';

export const GlobalSearch: React.FC<{ className?: string, theme?: 'dark' | 'light' }> = ({ className, theme = 'dark' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setSelectedElement, setSearchResults, setActiveTab, language } = useStore();
  const results = useElementSearch(query);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchResults(results);
  }, [results, setSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (element: ElementData) => {
    setSelectedElement(element);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="relative group">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
          theme === 'light' ? "text-slate-400 group-focus-within:text-cyan-600" : "text-slate-500 group-focus-within:text-cyan-400"
        )} />
        <input
          type="text"
          placeholder={language === 'bn' ? 'মৌল খুঁজুন...' : 'Search elements...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full border rounded-xl pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all backdrop-blur-md",
            theme === 'light' 
              ? "bg-white/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-cyan-500/30" 
              : "bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:ring-cyan-500/50"
          )}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all",
              theme === 'light' ? "hover:bg-slate-100" : "hover:bg-white/10"
            )}
          >
            <X size={14} className={theme === 'light' ? "text-slate-400" : "text-slate-500"} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={cn(
              "absolute left-0 right-0 top-full mt-2 border rounded-2xl shadow-2xl overflow-hidden z-[100] max-h-[400px] overflow-y-auto scrollbar-thin",
              theme === 'light' 
                ? "bg-white border-slate-200 scrollbar-thumb-slate-200" 
                : "bg-[#0c0e14]/90 backdrop-blur-2xl border border-white/10 scrollbar-thumb-white/10"
            )}
          >
            <div className="p-2">
              {results.length > 0 ? (
                results.map((el, index) => (
                  <button
                    key={el.atomicNumber}
                    onClick={() => handleSelect(el)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group",
                      theme === 'light'
                        ? (selectedIndex === index ? "bg-slate-100" : "hover:bg-slate-50")
                        : (selectedIndex === index ? "bg-white/10" : "hover:bg-white/5")
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 border rounded-lg flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform",
                        theme === 'light'
                          ? "bg-slate-50 border-slate-200 text-cyan-600"
                          : "bg-white/5 border border-white/10 text-cyan-400"
                      )}>
                        {el.symbol}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm font-bold leading-none mb-1",
                          theme === 'light' ? "text-slate-900" : "text-white"
                        )}>
                          {el.name} <span className="text-slate-500 font-normal ml-1">({el.nameBn})</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                          {el.latinName || 'Scientific Root'} • {el.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className={cn(
                        "text-[10px] font-mono px-1.5 py-0.5 rounded uppercase",
                        theme === 'light' ? "text-cyan-700 bg-cyan-100" : "text-cyan-500 bg-cyan-500/10"
                      )}>
                        Z: {el.atomicNumber}
                      </span>
                      <span className="text-[8px] mt-1 text-slate-500 font-mono">
                        {el.atomicMass.toFixed(3)} u
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    theme === 'light' ? "bg-slate-50" : "bg-white/5"
                  )}>
                    <Command size={20} className="opacity-20" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest leading-none mb-1">No Quantum Matches</span>
                    <span className="text-[10px] opacity-60">System could not locate requested element in local clusters.</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
