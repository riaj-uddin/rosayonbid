import React from 'react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

interface CategoryItem {
  id: string;
  en: string;
  bn: string;
  color: string;
}

const categories: CategoryItem[] = [
  { id: 'nonmetal', en: 'Nonmetal', bn: 'অধাতু', color: 'bg-yellow-500' },
  { id: 'noble gas', en: 'Noble Gas', bn: 'নিষ্ক্রিয় গ্যাস', color: 'bg-indigo-500' },
  { id: 'alkali metal', en: 'Alkali Metal', bn: 'ক্ষার ধাতু', color: 'bg-purple-500' },
  { id: 'alkaline earth metal', en: 'Alkaline Earth Metal', bn: 'মৃৎ ক্ষার ধাতু', color: 'bg-green-500' },
  { id: 'metalloid', en: 'Metalloid', bn: 'উপধাতু (Metalloid)', color: 'bg-cyan-500' },
  { id: 'halogen', en: 'Halogen', bn: 'হ্যালোজেন', color: 'bg-orange-500' },
  { id: 'post-transition metal', en: 'Post-Transition Metal', bn: 'পোস্ট অবস্থান্তর ধাতু', color: 'bg-teal-500' },
  { id: 'transition metal', en: 'Transition Metal', bn: 'অবস্থান্তর ধাতু', color: 'bg-blue-500' },
  { id: 'lanthanide', en: 'Lanthanide', bn: 'ল্যান্থানাইড', color: 'bg-pink-500' },
  { id: 'actinide', en: 'Actinide', bn: 'অ্যাক্টিনাইড', color: 'bg-red-500' },
];

export const CategoryLegend: React.FC = () => {
  const { language, activeCategory, setActiveCategory } = useStore();

  const handleCategoryClick = (id: string) => {
    if (activeCategory === id) {
      setActiveCategory(null);
    } else {
      setActiveCategory(id);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="grid grid-cols-5 sm:grid-cols-2 gap-1 sm:gap-x-8 sm:gap-y-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          
          return (
            <button 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              className={cn(
                "flex items-center gap-3 transition-all p-1 rounded-lg border border-transparent text-left",
                isActive ? "bg-white/10 border-white/20 shadow-lg scale-105" : "hover:bg-white/5 opacity-80 hover:opacity-100"
              )}
            >
              <div className={cn(
                "w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform",
                cat.color,
                isActive ? "scale-125" : ""
              )} />
              <div className="flex flex-col overflow-hidden">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider truncate",
                  isActive ? "text-white" : "text-white/70"
                )}>
                  {language === 'en' ? cat.en : cat.bn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
