import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { Info } from 'lucide-react';

const trendData = [
    { name: 'H', radius: 31, electronegativity: 2.20, ionization: 1312 },
    { name: 'He', radius: 28, electronegativity: 0, ionization: 2372 },
    { name: 'Li', radius: 128, electronegativity: 0.98, ionization: 520 },
    { name: 'Be', radius: 96, electronegativity: 1.57, ionization: 899 },
    { name: 'B', radius: 84, electronegativity: 2.04, ionization: 801 },
    { name: 'C', radius: 76, electronegativity: 2.55, ionization: 1086 },
    { name: 'N', radius: 71, electronegativity: 3.04, ionization: 1402 },
    { name: 'O', radius: 66, electronegativity: 3.44, ionization: 1314 },
    { name: 'F', radius: 57, electronegativity: 3.98, ionization: 1681 },
    { name: 'Ne', radius: 58, electronegativity: 0, ionization: 2081 },
    { name: 'Na', radius: 166, electronegativity: 0.93, ionization: 496 },
    { name: 'Mg', radius: 141, electronegativity: 1.31, ionization: 738 },
    { name: 'Al', radius: 121, electronegativity: 1.61, ionization: 578 },
    { name: 'Si', radius: 111, electronegativity: 1.90, ionization: 786 },
    { name: 'P', radius: 107, electronegativity: 2.19, ionization: 1012 },
    { name: 'S', radius: 105, electronegativity: 2.58, ionization: 1000 },
    { name: 'Cl', radius: 102, electronegativity: 3.16, ionization: 1251 },
    { name: 'Ar', radius: 106, electronegativity: 0, ionization: 1521 },
];

export const PeriodicTrends: React.FC = () => {
    const { language } = useStore();

    return (
        <div className="w-full h-full p-8 flex flex-col gap-8 bg-[#050608]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Atomic Radius Trend */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold tracking-tight">
                            {language === 'bn' ? 'পারমাণবিক ব্যাসার্ধের প্রবণতা' : 'Atomic Radius Trend'}
                        </h3>
                        <div className="px-2 py-1 bg-cyan-500/10 rounded text-[9px] font-mono text-cyan-400">PM (Picometers)</div>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorRadius" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0c0e14', border: '1px solid #ffffff1a', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#22d3ee' }}
                                />
                                <Area type="monotone" dataKey="radius" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorRadius)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Electronegativity Trend */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold tracking-tight">
                            {language === 'bn' ? 'তড়িৎ-ঋণাত্মকতার প্রবণতা' : 'Electronegativity Trend'}
                        </h3>
                        <div className="px-2 py-1 bg-yellow-500/10 rounded text-[9px] font-mono text-yellow-400">Pauling Scale</div>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0c0e14', border: '1px solid #ffffff1a', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#eab308' }}
                                />
                                <Bar dataKey="electronegativity" fill="#eab308" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Ionization Energy Trend */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold tracking-tight">
                            {language === 'bn' ? 'আয়নীকরণ শক্তি প্রবণতা' : 'Ionization Energy Trend'}
                        </h3>
                        <div className="px-2 py-1 bg-purple-500/10 rounded text-[9px] font-mono text-purple-400">kJ/mol</div>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0c0e14', border: '1px solid #ffffff1a', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#a855f7' }}
                                />
                                <Line type="stepAfter" dataKey="ionization" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#08090a' }} activeDot={{ r: 6, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 flex items-start gap-4">
               <Info className="text-cyan-400 shrink-0 mt-0.5" size={16} />
               <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'bn' ? 
                    'এই গ্রাফগুলি পর্যায় সারণির প্রথম ১৮টি মৌলের মৌলিক বৈশিষ্ট্যগুলির পর্যায়বৃত্ত প্রবণতা প্রদর্শন করে। লক্ষ্য করুন কীভাবে একটি পর্যায় বরাবর পারমাণবিক ব্যাসার্ধ হ্রাস পায় এবং আয়নীকরণ শক্তি সাধারণত বৃদ্ধি পায়।' :
                    'These graphs demonstrate the periodic trends of intrinsic properties across the first 18 elements. Notice how atomic radius decreases across a period while ionization energy generally increases.'
                  }
               </p>
            </div>
        </div>
    );
};
