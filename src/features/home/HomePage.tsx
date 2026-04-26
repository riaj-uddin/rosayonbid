import React from 'react';
import { motion } from 'motion/react';
import { 
  Atom, 
  Grid, 
  ClipboardCheck, 
  FileText, 
  ArrowRight, 
  Zap, 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  Globe2 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AtomHeroBackground } from './AtomHeroBackground';
import { translations } from '../../translations';

export const HomePage: React.FC = () => {
  const { setActiveTab, language } = useStore();
  const t = translations[language];

  const features = [
    {
      id: 'periodicTable',
      title: t.nav.periodicTable,
      description: 'Explore elements with deep technical data and quantum state visualization.',
      icon: Grid,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'visualizer',
      title: t.nav.visualizer,
      description: 'Interact with high-fidelity 3D atomic models and orbital structures.',
      icon: Atom,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'quiz',
      title: t.nav.quiz,
      description: 'Test your knowledge with curriculum-based competitive chemistry assessments.',
      icon: ClipboardCheck,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'blog',
      title: t.nav.blog,
      description: 'Read the latest scientific insights and chemistry educational articles.',
      icon: FileText,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const courses = [
    {
      title: 'Atomic Structure',
      description: 'Master the fundamentals of subatomic particles and quantum numbers.',
      level: 'SSC / HSC'
    },
    {
      title: 'Chemical Bonding',
      description: 'Understand how atoms interact to form complex molecular structures.',
      level: 'HSC'
    },
    {
      title: 'Periodic Trends',
      description: 'Analyze electronegativity, ionization energy, and atomic radii patterns.',
      level: 'SSC / HSC'
    }
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <AtomHeroBackground />
        
        <div className="container mx-auto px-6 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">Quantum Learning Engine v4.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
              Explore Chemistry <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                in 3D Space
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
              Interactive periodic table, high-fidelity atom visualization, 
              and AI-powered scientific assistance for students and researchers.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setActiveTab('visualizer')}
                className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 group"
              >
                <span>Start Exploring</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setActiveTab('periodicTable')}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all backdrop-blur-xl"
              >
                View Periodic Table
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-cyan-500 to-transparent" />
        </div>
      </section>

      {/* 2. FEATURE CARDS */}
      <section className="py-20 md:py-32 bg-[#050608]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveTab(feature.id as any)}
                className="group cursor-pointer bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all hover:bg-white/[0.07] shadow-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  <span>Enter Module</span>
                  <ArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="py-20 bg-[#0c0e14] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Academic Modules</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                Expertly structured curriculum for SSC and HSC students covering fundamental to advanced chemistry concepts.
              </p>
            </div>
            <button 
                onClick={() => setActiveTab('course')}
                className="text-cyan-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-3 transition-all"
            >
                View Full Curriculum <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[#050608] border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all group"
              >
                <div className="text-[10px] font-mono font-bold text-cyan-500 mb-4 tracking-[0.2em]">{course.level}</div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{course.title}</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed font-light">{course.description}</p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm tracking-wide hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all">
                  Start Learning
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="container mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
                    Start learning chemistry <br /> the modern way
                </h2>
                <div className="flex flex-wrap justify-center gap-10 opacity-30 grayscale mb-12">
                   <div className="flex items-center gap-2"><Globe2 size={24}/> Scientific Data</div>
                   <div className="flex items-center gap-2"><Users size={24}/> 10k+ Learners</div>
                   <div className="flex items-center gap-2"><ShieldCheck size={24}/> Verified Content</div>
                </div>
                <button 
                   onClick={() => setActiveTab('visualizer')}
                   className="px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.2)] hover:scale-105 transition-all uppercase tracking-widest text-sm"
                >
                    Try 3D Visualization
                </button>
            </motion.div>
        </div>
      </section>
    </div>
  );
};
