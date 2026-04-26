import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';

const blogPosts = [
  {
    id: 1,
    titleBn: 'SSC রসায়ন: ইলেকট্রন বিন্যাসের গোপন টিপস',
    titleEn: 'SSC Chemistry: Secret Tips for Electron Configuration',
    date: '2024-05-20',
    category: 'SSC',
    readTime: '5 min'
  },
  {
    id: 2,
    titleBn: 'HSC রসায়ন: জৈব যৌগের নামকরণ সহজ করার উপায়',
    titleEn: 'HSC Chemistry: Easy Ways to Name Organic Compounds',
    date: '2024-05-18',
    category: 'HSC',
    readTime: '8 min'
  },
  {
    id: 3,
    titleBn: 'পর্যায় সারণী মনে রাখার মজার ছন্দ',
    titleEn: 'Fun Mnemonics to Remember the Periodic Table',
    date: '2024-05-15',
    category: 'General',
    readTime: '4 min'
  }
];

export const Blog: React.FC = () => {
  const { language } = useStore();
  const t = translations[language].nav;

  return (
    <div className="flex-1 overflow-y-auto space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Newspaper size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">{t.blog}</h1>
          </div>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Scientific Insights & Academic Research (SSC/HSC)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-[#0c0e14] border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all flex flex-col"
          >
            <div className="h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center p-8 relative overflow-hidden">
               <BookOpen size={48} className="text-purple-500/20 rotate-12 group-hover:scale-110 transition-transform" />
               <div className="absolute top-4 left-4 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-[10px] font-mono text-purple-400 uppercase">
                  {post.category}
               </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                  </div>
                  <span>•</span>
                  <span>{post.readTime} read</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-purple-400 transition-colors">
                  {language === 'bn' ? post.titleBn : post.titleEn}
                </h3>
              </div>
              
              <button className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors group/btn">
                READ FULL STUDY 
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
