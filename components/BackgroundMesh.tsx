import React from 'react';
import { Tier } from '../types';

export const BackgroundMesh: React.FC<{ tier: Tier }> = ({ tier }) => {
  // Determine gradient colors based on tier
  const getColors = () => {
    switch(tier) {
      case 'STARTER': return ['bg-cyan-900', 'bg-blue-900', 'opacity-20'];
      case 'PRO': return ['bg-amber-900', 'bg-orange-900', 'opacity-20'];
      case 'GOD': return ['bg-purple-900', 'bg-emerald-900', 'opacity-30'];
      case 'ADMIN': return ['bg-white', 'bg-gray-200', 'opacity-5']; // The Void (White light in darkness)
      default: return ['bg-gray-900', 'bg-black', 'opacity-20'];
    }
  };

  const colors = getColors();

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ${tier === 'ADMIN' ? 'bg-black' : 'bg-[#050505]'}`}>
        
        {/* Base Blobs */}
        <div className={`absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] animate-blob ${colors[0]} ${colors[2]}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] animate-blob animation-delay-2000 ${colors[1]} ${colors[2]}`} />
        
        {/* God Mode RGB Pulse */}
        {tier === 'GOD' && (
           <div className="absolute top-[30%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[100px] bg-indigo-900/30 animate-pulse-slow" />
        )}

        {/* Admin Mode: The Singularity */}
        {tier === 'ADMIN' && (
           <>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] animate-pulse-slow" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[1px] bg-white/50 blur-xl rotate-45" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[1px] bg-white/50 blur-xl -rotate-45" />
           </>
        )}

        {/* Cinematic Grain - Increased for ADMIN for gritty realism */}
        <div className={`absolute inset-0 ${tier === 'ADMIN' ? 'opacity-[0.07]' : 'opacity-[0.03]'}`} style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
};