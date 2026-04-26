import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { Send, Bot, User, Sparkles, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AITutor: React.FC = () => {
  const { selectedElement, aiExplanation, isAILoading, language, activeTab } = useStore();
  const t = translations[language].ui;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Context descriptions for the AI
  const pageContexts = {
    periodicTable: 'Viewing the Periodic Table of Elements',
    visualizer: 'Using the 3D Atomic Structure Visualizer',
    quiz: 'Taking a Chemistry Quiz',
    course: 'Reviewing academic curriculum',
    blog: 'Reading chemistry news and articles',
    dashboard: 'Managing user profile and progress',
    leaderboard: 'Viewing competitive rankings',
    tutor: 'In a general tutoring session'
  };

  // Initialize with explanation when element changes
  useEffect(() => {
    if (selectedElement) {
      setMessages([
        { role: 'assistant', content: `${t.researcherGreeting} **${selectedElement.name}**.` }
      ]);
    }
  }, [selectedElement, t.researcherGreeting]);

  // Append AI explanation when it arrives
  useEffect(() => {
    if (aiExplanation) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiExplanation }
      ]);
    }
  }, [aiExplanation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const context = `[Current Context: ${pageContexts[activeTab] || 'General interaction'}${selectedElement ? `, Ref Element: ${selectedElement.name}` : ''}] `;
      const response = await api.getAIExplanation(`${context}${currentInput}`);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.systemError }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0e14] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-white/5">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border font-mono text-[10px] ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                  : 'bg-white/5 border-white/10 text-white/50'
              }`}>
                {msg.role === 'user' ? 'USR' : 'AI'}
              </div>
              <div className={`max-w-[85%] p-3.5 rounded-xl text-[11px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyan-600/10 text-cyan-50 border border-cyan-500/20 rounded-tr-none' 
                  : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
              }`}>
                <div className="prose prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:text-white">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {(isTyping || isAILoading) && (
          <div className="flex gap-1.5 p-2 bg-white/5 w-fit rounded-full px-4 border border-white/5">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.searchScientificDb}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 pr-10 text-[11px] focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder:text-white/20 font-mono"
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
