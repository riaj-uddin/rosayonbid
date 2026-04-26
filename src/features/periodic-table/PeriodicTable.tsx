import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { ElementData } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { translations } from '../../translations';
import { ElementTooltip } from './ElementTooltip';
import { PeriodicTableControls } from './PeriodicTableControls';
import { CategoryLegend } from './CategoryLegend';
import { GlobalSearch } from '../../components/common/GlobalSearch';
import { bnNames } from '../../constants/elements';

export const PeriodicTable: React.FC = () => {
  const { 
    elements, 
    selectedElement, 
    setSelectedElement, 
    language, 
    zoomLevel, 
    activeCategory,
    hoveredSeries,
    setHoveredSeries,
    searchResults
  } = useStore();
  const t = translations[language].ui;
  const [hoveredElement, setHoveredElement] = useState<ElementData | null>(null);
  const [seriesHoverPos, setSeriesHoverPos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const scrollLeft = React.useRef(0);
  const scrollTop = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    startY.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    scrollTop.current = scrollContainerRef.current.scrollTop;
  };

  const handleMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startX.current) * 1.5;
    const walkY = (y - startY.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walkX;
    scrollContainerRef.current.scrollTop = scrollTop.current - walkY;
  };

  const filteredElements = useMemo(() => {
    return elements.filter(el => {
      const matchesSearch = searchResults.length === 0 || searchResults.some(r => r.atomicNumber === el.atomicNumber);
      const matchesCategory = !activeCategory || el.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [elements, searchResults, activeCategory]);

  useEffect(() => {
    if (selectedElement && scrollContainerRef.current) {
      const el = document.getElementById(`element-${selectedElement.symbol}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [selectedElement]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (hoveredElement && !(e.target as HTMLElement).closest('.element-tooltip-container') && !(e.target as HTMLElement).closest('[id^="element-"]')) {
        setHoveredElement(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [hoveredElement]);

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
    <div className="space-y-6 relative flex flex-col items-center">
      {/* Top Toolbar */}
      <div className="w-full flex items-center justify-between gap-4 p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl relative z-50">
        <GlobalSearch className="w-64 md:w-80" />

        <div className="flex items-center gap-2">
           <PeriodicTableControls />
        </div>
      </div>

      {/* Grid Container */}
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className="relative w-full overflow-auto pb-12 pt-4 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent touch-pan-x touch-pan-y cursor-grab active:cursor-grabbing select-none"
      >
        <div 
          className="grid gap-1.5 transition-transform duration-300 origin-top-left" 
          style={{ 
            gridTemplateColumns: 'minmax(32px, 32px) repeat(18, minmax(65px, 1fr))',
            gridTemplateRows: '32px repeat(10, minmax(80px, 1fr))',
            width: '1350px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Group Labels (1-18) */}
          {Array.from({ length: 18 }, (_, i) => (
            <div 
              key={`group-${i + 1}`}
              style={{ gridColumn: i + 2, gridRow: 1 }}
              className="flex items-center justify-center text-[11px] font-mono font-bold text-white/30 select-none"
            >
              {i + 1}
            </div>
          ))}

          {/* Period Labels (1-7) */}
          {Array.from({ length: 7 }, (_, i) => (
            <div 
              key={`period-${i + 1}`}
              style={{ gridColumn: 1, gridRow: i + 2 }}
              className="flex items-center justify-center text-[11px] font-mono font-bold text-white/30 select-none"
            >
              {i + 1}
            </div>
          ))}

          {/* Legend Area (Group 3-12, Rows 1-3 shifted by labels) */}
          <div 
            style={{ 
              gridColumn: '4 / 14', 
              gridRow: '2 / 5',
              padding: '6px'
            }}
          >
            <CategoryLegend />
          </div>

          {/* Series Placeholder Labels */}
          <div 
            style={{ gridColumn: 4, gridRow: 7 }}
            className={cn(
              "relative aspect-[4/5] flex items-center justify-center border border-pink-500/30 bg-pink-500/10 rounded-lg p-1 text-center cursor-help transition-all duration-300 shadow-sm select-none",
              hoveredSeries === 'lanthanide' ? "scale-110 z-30 border-pink-500 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.4)]" : "opacity-80"
            )}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') {
                setHoveredSeries('lanthanide');
                setSeriesHoverPos({ x: e.clientX, y: e.clientY });
              }
            }}
            onPointerLeave={() => setHoveredSeries(null)}
            onClick={(e) => {
              setHoveredSeries('lanthanide');
              setSeriesHoverPos({ x: e.clientX, y: e.clientY });
            }}
          >
            <span className="text-[7px] font-bold text-pink-400 uppercase leading-tight tracking-tighter">
              Lanthanide<br/>Series
            </span>
          </div>

          <div 
            style={{ gridColumn: 4, gridRow: 8 }}
            className={cn(
              "relative aspect-[4/5] flex items-center justify-center border border-red-500/30 bg-red-500/10 rounded-lg p-1 text-center cursor-help transition-all duration-300 shadow-sm select-none",
              hoveredSeries === 'actinide' ? "scale-110 z-30 border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "opacity-80"
            )}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') {
                setHoveredSeries('actinide');
                setSeriesHoverPos({ x: e.clientX, y: e.clientY });
              }
            }}
            onPointerLeave={() => setHoveredSeries(null)}
            onClick={(e) => {
              setHoveredSeries('actinide');
              setSeriesHoverPos({ x: e.clientX, y: e.clientY });
            }}
          >
            <span className="text-[7px] font-bold text-red-400 uppercase leading-tight tracking-tighter">
              Actinide<br/>Series
            </span>
          </div>

          {/* Elements Map */}
          {elements.map((el) => {
            const isActive = selectedElement?.atomicNumber === el.atomicNumber;
            const isMatch = filteredElements.some(f => f.atomicNumber === el.atomicNumber);
            const isCategoryDimmed = activeCategory && activeCategory !== el.category;
            
            // Series highlight logic
            const isSeriesHighlighted = hoveredSeries && el.category === hoveredSeries;
            const isSeriesDimmed = hoveredSeries && el.category !== hoveredSeries;

            return (
              <motion.div
                key={el.atomicNumber}
                id={`element-${el.symbol}`}
                layout
                style={{
                  gridColumn: el.xpos + 1,
                  gridRow: el.ypos + 1,
                }}
                className={cn(
                  "relative aspect-[4/5] cursor-pointer transition-all duration-500",
                  "border rounded-lg p-1.5 flex flex-col justify-between group",
                  getCategoryColor(el.category),
                  isActive || isSeriesHighlighted ? "ring-2 ring-white z-20 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-105" : "",
                  (!isMatch || isCategoryDimmed || isSeriesDimmed) ? "opacity-20 grayscale-1/2 scale-95" : "opacity-100",
                  "hover:scale-110 hover:z-30 hover:shadow-2xl select-none"
                )}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') {
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    setHoveredElement(el);
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }
                }}
                onPointerMove={(e) => {
                  if (e.pointerType === 'mouse') {
                    setMousePos({ x: e.clientX, y: e.clientY });
                  }
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoveredElement(null);
                    }, 400);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                  setHoveredElement(el);
                  setMousePos({ x: e.clientX, y: e.clientY });
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono opacity-60 leading-none">{el.atomicNumber}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center flex-1">
                   <span className="text-sm font-bold tracking-tighter leading-none">{el.symbol}</span>
                   <span className="text-[7px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate w-full text-center">{el.name}</span>
                </div>

                <div className="text-[7px] font-mono opacity-40 text-center leading-none">
                  {el.atomicMass.toFixed(1)}
                </div>
              </motion.div>
            );
          })}

          {/* Lanthanides/Actinides Spacing */}
          <div className="h-4" style={{ gridRow: 9, gridColumn: '1 / 20' }} />
        </div>
      </div>

      <AnimatePresence>
        {hoveredElement && (
           <div className="element-tooltip-container">
             <ElementTooltip 
                element={{
                  ...hoveredElement,
                  nameBn: bnNames[hoveredElement.symbol]
                }} 
                x={mousePos.x} 
                y={mousePos.y}
                onMouseEnter={() => {
                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }}
                onMouseLeave={() => {
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredElement(null);
                  }, 300);
                }}
             />
           </div>
        )}

        {hoveredSeries && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{ 
              position: 'fixed', 
              left: seriesHoverPos.x + 20, 
              top: seriesHoverPos.y - 40,
              zIndex: 1000,
              pointerEvents: 'none'
            }}
            className="px-4 py-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl flex flex-col gap-1"
          >
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {hoveredSeries === 'lanthanide' ? 'See Lanthanide Series Below' : 'See Actinide Series Below'}
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">
              {language === 'bn' 
                ? (hoveredSeries === 'lanthanide' ? 'নিচে ল্যান্থানাইড সিরিজ দেখুন' : 'নিচে অ্যাক্টিনাইড সিরিজ দেখুন')
                : (hoveredSeries === 'lanthanide' ? 'Lanthanide Series (57-71)' : 'Actinide Series (89-103)')
              }
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
