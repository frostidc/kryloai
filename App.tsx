import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gatekeeper } from './components/Gatekeeper';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { BackgroundMesh } from './components/BackgroundMesh';
import { Tier, AppMode } from './types';

export default function App() {
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier>('LOCKED');
  const [currentMode, setCurrentMode] = useState<AppMode>('CHAT');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check local storage for persistent session (optional, keeps it fresh for now)
  useEffect(() => {
    // In a real app, we might persist the key/tier. 
    // For this demo, we start at Gatekeeper every reload for the cinematic effect.
  }, []);

  const handleAccessGranted = (key: string, detectedTier: Tier) => {
    setAccessKey(key);
    setTier(detectedTier);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans selection:bg-white/20">
      <BackgroundMesh tier={tier} />

      <AnimatePresence mode="wait">
        {tier === 'LOCKED' ? (
          <Gatekeeper key="gatekeeper" onAccessGranted={handleAccessGranted} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="flex h-full w-full relative z-10"
          >
            <Sidebar 
              currentMode={currentMode} 
              setMode={setCurrentMode} 
              tier={tier}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            
            <main className="flex-1 h-full relative overflow-hidden flex flex-col">
              <ChatInterface 
                tier={tier} 
                mode={currentMode} 
              />
            </main>

            <SettingsModal 
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              tier={tier}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}