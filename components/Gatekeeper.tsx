import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ScanLine, Cpu, Fingerprint } from 'lucide-react';
import { ACCESS_KEYS, TIER_CONFIGS } from '../constants';
import { Tier } from '../types';

interface GatekeeperProps {
  onAccessGranted: (key: string, tier: Tier) => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ onAccessGranted }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setLoading(true);
    setError(false);

    // Cinematic delay for "Verification"
    await new Promise(r => setTimeout(r, 1500));

    const tier = ACCESS_KEYS[inputKey.trim()];
    
    if (tier) {
      onAccessGranted(inputKey, tier);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_70%)]" />
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative w-full max-w-md p-8 z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 relative"
        >
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
             <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl animate-pulse-slow" />
             <div className="relative w-full h-full rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-2xl ring-1 ring-white/5">
                {loading ? (
                    <ScanLine className="w-8 h-8 text-white/80 animate-pulse" />
                ) : (
                    <Fingerprint className="w-10 h-10 text-white/80" strokeWidth={1} />
                )}
             </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tighter mb-4 text-white">
            KRYLO
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-white/20" />
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Identity Verification</p>
            <span className="h-px w-8 bg-white/20" />
          </div>
        </motion.div>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleValidation}
          className="relative group"
        >
            <div className={`
                relative flex items-center transition-all duration-300
                bg-white/[0.03] backdrop-blur-xl border 
                ${error ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10 focus-within:border-white/30 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)]'} 
                rounded-2xl p-2
            `}>
                <div className="pl-4 pr-2 text-white/30">
                <Lock size={16} />
                </div>
                <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => {
                        setInputKey(e.target.value);
                        setError(false);
                    }}
                    placeholder="ENTER ACCESS SEQUENCE"
                    className="w-full bg-transparent border-none text-white px-2 py-4 focus:ring-0 focus:outline-none placeholder-white/10 font-mono tracking-widest text-sm text-center"
                    autoFocus
                    autoComplete="off"
                />
                <button 
                disabled={loading}
                className={`
                    p-4 rounded-xl transition-all duration-500
                    ${loading 
                        ? 'bg-white/10 cursor-not-allowed' 
                        : 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg shadow-white/10'
                    }
                `}
                >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                    <ArrowRight size={20} />
                )}
                </button>
            </div>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="mt-6 text-center"
            >
              <p className="text-red-500 text-[10px] tracking-widest font-mono uppercase flex items-center justify-center gap-2 border border-red-900/30 bg-red-900/10 py-2 rounded-lg">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Access Denied: Invalid Sequence
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-[-100px] left-0 w-full text-center"
        >
             <p className="text-[10px] text-white/10 font-mono">SECURE CONNECTION ESTABLISHED</p>
        </motion.div>
      </div>
    </motion.div>
  );
};