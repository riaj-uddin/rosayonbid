import React from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { 
  Atom, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab } = useStore();
  const t = translations[language];

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'periodicTable', label: t.nav.periodicTable },
    { id: 'visualizer', label: t.nav.visualizer },
    { id: 'quiz', label: t.nav.quiz },
    { id: 'blog', label: t.nav.blog },
  ];

  return (
    <footer className="bg-[#0c0e14] border-t border-white/5 pt-16 pb-8 text-slate-400">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <Atom size={22} />
              </div>
              <span className="font-bold text-white text-xl tracking-tight leading-none group-hover:text-cyan-400 transition-colors">
                {t.ui.appName}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 font-light">
              The next-generation scientific platform for chemistry education. 
              Interactive 3D atoms, real-time data, and AI-powered curriculum.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-cyan-400 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-cyan-400 transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* COLUMN 2: Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => setActiveTab(link.id as any)}
                    className="text-sm hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-cyan-500" />
                <span>support@rosayonbid.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={16} className="text-cyan-500" />
                <span>Global Science Division</span>
              </li>
              <li className="mt-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                   <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-2 text-slate-500">System Status</p>
                   <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      All Systems Operational
                   </div>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Newsletter/Promo */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Scientific Hub</h4>
            <p className="text-xs mb-4 leading-relaxed font-light italic">
              "Equipping the next generation of researchers with molecular-scale visualization technology."
            </p>
            <div className="h-24 w-full bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Atom size={60} className="text-white/5 absolute -right-4 -bottom-4 rotate-12" />
                <div className="text-[10px] font-mono tracking-[0.5em] text-cyan-400">RESEARCH_MODE</div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em]">
          <p>© {currentYear} ROSAYONBID CO. ACCREDITED EDUCATIONAL PARTNER.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Protocol</a>
            <a href="#" className="hover:text-white">Security Terms</a>
            <a href="#" className="hover:text-white">API Access</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
