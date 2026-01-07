import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { Tier } from '../types';
import { TIER_CONFIGS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, tier }) => {
  const tierConfig = TIER_CONFIGS[tier];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield size={18} className={tierConfig.color} />
                  System Configuration
                </h2>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="block text-xs font-mono text-white/40 uppercase mb-2">API Configuration</p>
                  <p className="text-sm text-white/70">
                    The Neural Engine is connected via secure environment variables.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/80">Current Clearance Level</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border border-white/10 bg-black/40 ${tierConfig.color}`}>
                      {tier}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${tierConfig.gradient} w-full`} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-end">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};