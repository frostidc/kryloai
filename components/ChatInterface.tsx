import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X, Sparkles, Zap, ShieldAlert, Copy, Check } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Message, Tier, AppMode } from '../types';
import { TIER_CONFIGS, MODE_CONFIGS } from '../constants';

interface ChatInterfaceProps {
  tier: Tier;
  mode: AppMode;
}

// Simple Markdown Renderer Component
const MarkdownRenderer: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming }) => {
  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`font-sans whitespace-pre-wrap ${isStreaming ? 'typing-cursor' : ''}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extract language and code
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          const lang = match?.[1] || 'Code';
          const code = match?.[2] || part.slice(3, -3);

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-lg">
              <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-xs font-mono text-white/50 uppercase">{lang}</span>
                <div className="flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-500/20" />
                   <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                   <div className="w-2 h-2 rounded-full bg-green-500/20" />
                </div>
              </div>
              <div className="p-4 overflow-x-auto text-sm font-mono text-blue-300">
                {code}
              </div>
            </div>
          );
        }
        
        // Basic bold formatting
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={index}>
                {boldParts.map((bp, i) => 
                    bp.startsWith('**') && bp.endsWith('**') 
                    ? <strong key={i} className="text-white font-bold">{bp.slice(2, -2)}</strong> 
                    : bp
                )}
            </span>
        );
      })}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ tier, mode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'init',
        role: 'model',
        content: `KRYLO OS v3.1 Online.\nMode: ${mode}\nStreaming Protocol: Active`,
        timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const geminiService = useRef(new GeminiService());
  const tierConfig = TIER_CONFIGS[tier];
  const modeConfig = MODE_CONFIGS[mode];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Create a placeholder message for streaming
      const streamId = (Date.now() + 1).toString();
      const initialAiMsg: Message = {
        id: streamId,
        role: 'model',
        content: '', // Start empty
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, initialAiMsg]);

      // Start the stream
      const stream = geminiService.current.generateResponseStream(
        [...messages, userMsg],
        mode,
        userMsg.image
      );

      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
            msg.id === streamId ? { ...msg, content: fullContent } : msg
        ));
      }

    } catch (err) {
      const errorMsg: Message = {
         id: Date.now().toString(),
         role: 'model',
         content: "Error: Neural uplink interrupted.",
         isError: true,
         timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto relative z-10">
      {/* Cinematic Header */}
      <header className="h-20 flex items-center px-6 lg:px-8 border-b border-white/5 backdrop-blur-md z-10 sticky top-0">
        <div className={`p-2.5 rounded-xl bg-white/5 mr-4 border border-white/5 ${tierConfig.color}`}>
            <modeConfig.icon size={20} />
        </div>
        <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono flex items-center gap-2">
                {modeConfig.label}
                {tier === 'ADMIN' && <span className="bg-white text-black text-[10px] px-1.5 py-0.5 rounded font-bold">ROOT</span>}
            </h3>
            <p className="text-[10px] text-white/30 font-mono mt-0.5">{modeConfig.desc}</p>
        </div>
        <div className="ml-auto">
            <div className={`px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono tracking-widest uppercase flex items-center gap-2 ${tierConfig.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${tierConfig.color.replace('text-', 'bg-')}`} />
                {tierConfig.name} Protocol
            </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 scroll-smooth">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[95%] lg:max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${tierConfig.gradient} shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10`}>
                    {tier === 'ADMIN' ? <Zap size={14} className="text-white" /> : <Sparkles size={14} className="text-white" />}
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex-1`}>
                {/* Image Display */}
                {msg.image && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-2 rounded-2xl overflow-hidden border border-white/10 max-w-sm shadow-2xl"
                    >
                        <img src={msg.image} alt="Upload" className="w-full h-auto" />
                    </motion.div>
                )}
                
                <div className={`
                  relative px-6 py-4 text-sm leading-7 shadow-2xl
                  ${msg.role === 'user' 
                    ? 'rounded-2xl rounded-tr-sm bg-white text-black font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : `rounded-2xl rounded-tl-sm bg-[#050505]/80 backdrop-blur-xl border border-white/10 text-gray-200 ${tierConfig.glow} w-full min-w-[200px]`}
                `}>
                  {msg.isError ? (
                      <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
                          <ShieldAlert size={14} />
                          {msg.content}
                      </div>
                  ) : (
                      <MarkdownRenderer content={msg.content} isStreaming={isLoading && index === messages.length - 1 && msg.role === 'model'} />
                  )}
                </div>
                
                <span className="text-[9px] text-white/10 font-mono tracking-wider uppercase">
                    T+{Math.floor((Date.now() - msg.timestamp) / 1000)}s • {msg.role === 'user' ? 'SENT' : 'RCVD'}
                </span>
              </div>

            </div>
          </motion.div>
        ))}
        
        {/* Loading Indicator (Only show if no streaming message has started yet) */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex justify-start pl-12">
                 <div className="h-8 px-4 flex items-center gap-1">
                    <span className="text-xs font-mono text-white/30 animate-pulse">INITIATING STREAM...</span>
                 </div>
            </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-8 relative">
        <div className={`
            relative flex items-end gap-3 p-3 rounded-[24px] 
            bg-[#050505]/80 backdrop-blur-2xl border border-white/10
            shadow-2xl transition-all duration-300
            hover:border-white/20 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/10
            ${tierConfig.glow}
        `}>
          
          {selectedImage && (
            <div className="absolute bottom-full left-4 mb-3 p-2 bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center gap-3 shadow-xl">
                <img src={selectedImage} alt="Preview" className="h-14 w-14 object-cover rounded-lg border border-white/5" />
                <div className="pr-2">
                    <p className="text-[10px] text-white/40 font-mono uppercase">Image Loaded</p>
                    <button onClick={() => setSelectedImage(null)} className="text-[10px] text-red-400 hover:text-red-300 hover:underline">Remove</button>
                </div>
            </div>
          )}

          <div className="flex pb-2 pl-1">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
            >
                <ImageIcon size={20} />
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageSelect}
            />
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tier === 'ADMIN' ? "Enter root command..." : "Type your query..."}
            className="flex-1 bg-transparent border-none text-white px-2 py-3.5 max-h-32 min-h-[52px] focus:ring-0 focus:outline-none resize-none placeholder-white/20 scrollbar-hide text-base"
            rows={1}
            autoFocus
          />

          <button 
            onClick={handleSend}
            disabled={(!input && !selectedImage) || isLoading}
            className={`
                p-3.5 rounded-full mb-0.5 transition-all duration-300
                ${(!input && !selectedImage) || isLoading 
                    ? 'bg-white/5 text-white/20' 
                    : `bg-white text-black hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                }
            `}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
            ) : (
                <Send size={20} className="ml-0.5" />
            )}
          </button>
        </div>
        
        {/* Footer info */}
        <div className="mt-4 flex justify-center gap-6 opacity-30">
            <p className="text-[9px] text-white font-mono tracking-[0.2em] uppercase">Encrypted</p>
            <p className="text-[9px] text-white font-mono tracking-[0.2em] uppercase">Low Latency</p>
            <p className="text-[9px] text-white font-mono tracking-[0.2em] uppercase">{tier} Access</p>
        </div>
      </div>
    </div>
  );
};