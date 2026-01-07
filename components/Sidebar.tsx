import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, Disc, Activity } from 'lucide-react';
import { AppMode, Tier } from '../types';
import { MODE_CONFIGS, TIER_CONFIGS } from '../constants';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  tier: Tier;
  onOpenSettings: () => void;
}

const NeuralActivityWidget = ({ tier }: { tier: Tier }) => {
    const [bars, setBars] = useState<number[]>(new Array(12).fill(10));
    
    useEffect(() => {
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.random() * 100));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const getColor = () => {
        if (tier === 'ADMIN') return 'bg-white';
        if (tier === 'GOD') return 'bg-purple-500';
        if (tier === 'PRO') return 'bg-amber-500';
        return 'bg-cyan-500';
    };

    return (
        <div className="h-12 flex items-end justify-between gap-0.5 px-2 opacity-50">
            {bars.map((height, i) => (
                <div 
                    key={i} 
                    className={`w-1 rounded-t-sm transition-all duration-300 ${getColor()}`}
                    style={{ height: `${height}%`, opacity: Math.max(0.2, height / 100) }} 
                />
            ))}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, tier, onOpenSettings }) => {
  const tierConfig = TIER_CONFIGS[tier];

  return (
    <motion.aside 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-20 lg:w-64 flex flex-col h-full bg-[#050505]/50 backdrop-blur-xl border-r border-white/5 z-20"
    >
      {/* Brand */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tierConfig.gradient} flex items-center justify-center shadow-lg`}>
          <Disc className="text-white w-5 h-5 animate-spin-slow" style={{ animationDuration: '10s' }}/>
        </div>
        <div className="hidden lg:block ml-3">
          <h2 className="font-bold text-lg tracking-tight text-white">KRYLO</h2>
          <div className={`text-[10px] font-mono tracking-widest uppercase ${tierConfig.color}`}>
            {tierConfig.name} Tier
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {(Object.keys(MODE_CONFIGS) as AppMode[]).map((mode) => {
          const config = MODE_CONFIGS[mode];
          const isActive = currentMode === mode;
          const Icon = config.icon;

          return (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={`relative flex items-center justify-center lg:justify-start lg:px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-full lg:hidden" 
                />
              )}
              <Icon size={20} className={`transition-colors ${isActive ? tierConfig.color : ''}`} />
              <span className="hidden lg:block ml-3 text-sm font-medium tracking-wide">
                {config.label}
              </span>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-lg -z-10" />
            </button>
          );
        })}
      </nav>

      {/* Footer / Stats */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-4">
         {/* Neural Load Widget */}
         <div className="hidden lg:block p-3 bg-black/40 rounded-xl border border-white/5">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-[10px] text-white/40 font-mono uppercase">Neural Load</span>
                 <Activity size={10} className={tierConfig.color} />
             </div>
             <NeuralActivityWidget tier={tier} />
         </div>

         <button 
           onClick={onOpenSettings}
           className="flex items-center justify-center lg:justify-start lg:px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
         >
           <Settings size={20} />
           <span className="hidden lg:block ml-3 text-sm">Settings</span>
         </button>
         
         {/* User Avatar Placeholder */}
         <div className="mt-2 flex items-center justify-center lg:justify-start lg:px-4 pt-4 border-t border-white/5">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${tierConfig.gradient} ring-2 ring-black`} />
            <div className="hidden lg:block ml-3 overflow-hidden">
                <p className="text-xs text-white font-medium truncate">Operator</p>
                <p className="text-[10px] text-white/30 truncate">Online</p>
            </div>
         </div>
      </div>
    </motion.aside>
  );
};