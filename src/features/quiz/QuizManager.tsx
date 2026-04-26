import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Brain, Trophy, ChevronRight, Zap, Target, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';

interface Question {
  textEn: string;
  textBn: string;
  optionsEn: string[];
  optionsBn: string[];
  correct: number;
}

interface Topic {
  id: string;
  titleEn: string;
  titleBn: string;
  category: 'SSC' | 'HSC';
  questions: Question[];
}

const quizData: Topic[] = [
  {
    id: 'structure-of-atom',
    titleEn: 'Structure of Atom',
    titleBn: 'পদার্থের গঠন',
    category: 'SSC',
    questions: [
      { 
        textEn: "What defines a neutral atom's atomic number?", 
        textBn: "নিরপেক্ষ পরমাণুর পারমাণবিক সংখ্যা কী নির্নয় করে?",
        optionsEn: ["Neutrons", "Electrons", "Protons", "Nucleons"], 
        optionsBn: ["নিউট্রন", "ইলেকট্রন", "প্রোটন", "নিউক্লন"],
        correct: 2 
      },
      { 
        textEn: "Which shell layer defines chemical reactivity?", 
        textBn: "কোন ইলেকট্রন স্তর রাসায়নিক সক্রিয়তা নির্ধারণ করে?",
        optionsEn: ["Core shell", "Valence shell", "Sub-orbital", "Quantum ring"], 
        optionsBn: ["কোর স্তর", "যোজ্যতা স্তর", "উপ-অরবিটাল", "কোয়ান্টাম রিং"],
        correct: 1 
      },
      { 
        textEn: "Helium (He) belongs to which group?", 
        textBn: "হিলিয়াম (He) কোন গ্রুপের অন্তর্ভুক্ত?",
        optionsEn: ["Halogens", "Alkali Metals", "Noble Gases", "Metalloids"], 
        optionsBn: ["হ্যালোজেন", "ক্ষার ধাতু", "নিষ্ক্রিয় গ্যাস", "অপধাতু"],
        correct: 2 
      },
    ]
  },
  {
    id: 'organic-chemistry',
    titleEn: 'Organic Chemistry Basics',
    titleBn: 'জৈব রসায়ন প্রাথমিক ধারণা',
    category: 'HSC',
    questions: [
      { 
        textEn: "What is the general formula of Alkenes?", 
        textBn: "অ্যালকিনের সাধারণ সংকেত কোনটি?",
        optionsEn: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnH2n+1"], 
        optionsBn: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnH2n+1"],
        correct: 1 
      },
      { 
        textEn: "Functional group of Alcohol is?", 
        textBn: "অ্যালকোহলের কার্যকরী মূলক কোনটি?",
        optionsEn: ["-CHO", "-COOH", "-OH", "-CO-"], 
        optionsBn: ["-CHO", "-COOH", "-OH", "-CO-"],
        correct: 2 
      },
    ]
  }
];

export const QuizManager: React.FC = () => {
  const { language, updatePoints, incrementQuizzes } = useStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (idx: number) => {
    if (!selectedTopic) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === selectedTopic.questions[currentIdx].correct;

    setTimeout(() => {
      if (isCorrect) setScore(s => s + 1);

      if (currentIdx < selectedTopic.questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore >= selectedTopic.questions.length - 1) {
          confetti({ particleCount: 150, spread: 90, colors: ['#22d3ee', '#3b82f6', '#ffffff'] });
        }
        updatePoints(finalScore * 100);
        incrementQuizzes();
      }
    }, 800);
  };

  if (!selectedTopic) {
    return (
      <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto">
         <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">Assesment Lab</h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-loose">Select a specialized research topic aligned with National Curriculum (SSC/HSC)</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizData.map((topic) => (
               <motion.button
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => startTopic(topic)}
                className="group relative bg-[#0c0e14] border border-white/5 rounded-2xl p-6 text-left hover:border-cyan-500/30 transition-all"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className={`px-2 py-1 rounded text-[9px] font-mono border ${topic.category === 'SSC' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'} uppercase`}>
                        {topic.category}
                     </div>
                     <BookOpen size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {language === 'bn' ? topic.titleBn : topic.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                     <Target size={12} />
                     <span>{topic.questions.length} Questions</span>
                  </div>
               </motion.button>
            ))}
         </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[500px] p-12 text-center bg-gradient-to-b from-cyan-950/20 to-black/40 rounded-2xl border border-cyan-500/10 shadow-2xl"
      >
        <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <Trophy className="text-cyan-400" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Module Complete</h2>
        <p className="text-slate-400 mb-8 font-mono text-sm uppercase">Synchronization Accuracy: <span className="text-cyan-400">{(score/selectedTopic.questions.length * 100).toFixed(0)}%</span></p>
        <div className="flex gap-4">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all font-bold uppercase text-xs tracking-widest border border-white/10"
          >
            Switch Topic
          </button>
          <button 
            onClick={() => { setCurrentIdx(0); setScore(0); setShowResult(false); setSelectedAnswer(null); }}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all font-bold uppercase text-xs tracking-widest flex items-center gap-3"
          >
            Retry <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  const q = selectedTopic.questions[currentIdx];

  return (
    <div className="h-full flex flex-col p-8 bg-[#0c0e14] border border-white/5 rounded-2xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="flex justify-between items-center mb-10">
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{selectedTopic.category} // {language === 'bn' ? selectedTopic.titleBn : selectedTopic.titleEn}</span>
            <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-[0.2em]">Research_Phase_0{currentIdx + 1}</span>
        </div>
        <div className="flex gap-1">
          {selectedTopic.questions.map((_, i) => (
             <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i <= currentIdx ? 'bg-cyan-500' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-10 leading-relaxed border-l-2 border-cyan-500 pl-6 min-h-[4rem] flex items-center">
        {language === 'bn' ? q.textBn : q.textEn}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {(language === 'bn' ? q.optionsBn : q.optionsEn).map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selectedAnswer;
          
          let bgColor = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
          if (selectedAnswer !== null) {
              if (isSelected) {
                  bgColor = isCorrect ? "bg-green-500/10 border-green-500/40 text-green-400" : "bg-red-500/10 border-red-500/40 text-red-400";
              } else if (isCorrect) {
                  bgColor = "bg-green-500/10 border-green-500/40 text-green-400";
              }
          }

          return (
            <motion.button
              key={i}
              whileHover={selectedAnswer === null ? { x: 5 } : {}}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswer(i)}
              className={`flex items-center justify-between w-full p-5 rounded-xl border text-left transition-all duration-300 font-sans text-sm font-medium ${bgColor}`}
            >
              <span>{opt}</span>
              {selectedAnswer !== null && (
                <div className="flex items-center gap-2">
                   {isCorrect ? <CheckCircle size={14} className="text-green-400" /> : isSelected && <XCircle size={14} className="text-red-400" />}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
