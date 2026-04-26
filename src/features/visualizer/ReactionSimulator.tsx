import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ReactionSimulator: React.FC = () => {
    const { language } = useStore();
    const [state, setState] = useState<'idle' | 'reacting' | 'completed'>('idle');

    const reset = () => setState('idle');
    const start = () => {
        setState('reacting');
        setTimeout(() => setState('completed'), 3000);
    };

    return (
        <div className="w-full h-full p-8 flex flex-col bg-[#050608] relative overflow-hidden">
            {/* Simulation Stage */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px]" />
                
                <div className="relative w-full max-w-2xl h-64 flex items-center justify-between px-12">
                    {/* Reactant A */}
                    <AnimatePresence mode="popLayout">
                        {state !== 'completed' ? (
                            <motion.div 
                                className="w-24 h-24 rounded-full bg-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)] flex items-center justify-center text-white font-bold text-2xl border-4 border-white/20"
                                animate={state === 'reacting' ? { x: 200, scale: 0.8 } : { x: 0 }}
                                transition={{ duration: 3, ease: "easeIn" }}
                                key="reactant-a"
                            >
                                H₂
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Reactant B */}
                    <AnimatePresence mode="popLayout">
                        {state !== 'completed' ? (
                            <motion.div 
                                className="w-32 h-32 rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] flex items-center justify-center text-white font-bold text-2xl border-4 border-white/20"
                                animate={state === 'reacting' ? { x: -200, scale: 0.8 } : { x: 0 }}
                                transition={{ duration: 3, ease: "easeIn" }}
                                key="reactant-b"
                            >
                                O₂
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Resulting Product */}
                    <AnimatePresence>
                        {state === 'completed' && (
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4"
                                key="product"
                            >
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-[0_0_60px_rgba(168,85,247,0.5)] flex items-center justify-center text-white font-bold text-3xl border-4 border-white/30 relative">
                                    H₂O
                                    <div className="absolute -inset-4 rounded-full border border-white/10 animate-pulse" />
                                    <div className="absolute -inset-8 rounded-full border border-white/5 animate-ping opacity-20" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reaction Energy Burst */}
                    {state === 'reacting' && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 4, 3], opacity: [0, 1, 0] }}
                            transition={{ duration: 3, times: [0, 0.9, 1] }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"
                        />
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 pb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={start}
                        disabled={state !== 'idle'}
                        className="flex items-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all shadow-xl shadow-yellow-500/20"
                    >
                        <Play size={20} />
                        {language === 'bn' ? 'বিক্রিয়া শুরু করুন' : 'Initiate Reaction'}
                    </button>
                    <button 
                        onClick={reset}
                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div className="max-w-xl text-center space-y-2">
                    <h3 className="text-white font-bold text-lg">
                        {language === 'bn' ? 'দহন বিক্রিয়া: পানি উৎপাদন' : 'Combustion Reaction: Water Synthesis'}
                    </h3>
                    <p className="text-slate-400 text-sm italic">
                        2H₂ (g) + O₂ (g) → 2H₂O (l) + ΔH
                    </p>
                </div>
            </div>

            {/* Info Panel */}
            <div className="absolute top-8 left-8 max-w-xs p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4 text-yellow-400">
                    <Info size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Observer_Log</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn' ? 
                      'এই সিমুলেশনে হাইড্রোজেন এবং অক্সিজেনের মধ্যে দহন বিক্রিয়া দেখানো হয়েছে। যখন অণুগুলো উচ্চ গতিতে সংঘর্ষ করে, তখন রাসায়নিক বন্ধন ভেঙে যায় এবং নতুন বন্ধন তৈরি হয়ে পানি অণু গঠিত হয়, পাশাপাশি তাপ নির্গত হয়।' :
                      'This simulation depicts the explosive synthesis of water from hydrogen and oxygen gases. As molecules collide at high velocities, chemical bonds are broken and reformed into water molecules, releasing significant thermal energy.'
                    }
                </p>
            </div>
        </div>
    );
};
