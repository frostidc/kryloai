import { Tier, TierConfig, AppMode } from './types';
import { MessageSquare, Eye, GraduationCap, Code2, Palette } from 'lucide-react';

// SECURITY: API Key must be set in Environment Variables (process.env.GEMINI_API)
// Do not hardcode keys here.

export const ACCESS_KEYS: Record<string, Tier> = {
  'KRYLO-GENESIS-KEY': 'STARTER',
  'KRYLO-ELITE-X': 'PRO',
  'KRYLO-OMEGA-GOD': 'GOD',
  'close': 'ADMIN', // The secret admin key
};

export const TIER_CONFIGS: Record<Tier, TierConfig> = {
  LOCKED: {
    name: 'Locked',
    color: 'text-gray-500',
    accent: 'border-gray-500',
    gradient: 'from-gray-900 to-black',
    glow: 'shadow-none',
  },
  STARTER: {
    name: 'Genesis',
    color: 'text-cyan-400',
    accent: 'border-cyan-500/30',
    gradient: 'from-cyan-500/20 via-blue-600/20 to-cyan-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  },
  PRO: {
    name: 'Elite',
    color: 'text-amber-400',
    accent: 'border-amber-500/30',
    gradient: 'from-amber-500/20 via-orange-600/20 to-yellow-500/20',
    glow: 'shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  GOD: {
    name: 'Omega',
    color: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500',
    accent: 'border-purple-500/30',
    gradient: 'from-pink-500/20 via-purple-600/20 to-indigo-500/20',
    glow: 'shadow-[0_0_40px_-5px_rgba(168,85,247,0.4)]',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  ADMIN: {
    name: 'Overlord',
    color: 'text-white',
    accent: 'border-white/40',
    gradient: 'from-white/10 via-gray-200/5 to-white/10',
    glow: 'shadow-[0_0_50px_-10px_rgba(255,255,255,0.25)]',
    badge: 'bg-white/10 text-white border-white/40'
  }
};

export const MODE_CONFIGS: Record<AppMode, { label: string, icon: any, desc: string }> = {
  CHAT: { label: 'Universal Chat', icon: MessageSquare, desc: 'High-intelligence conversational model.' },
  VISION: { label: 'Krylo Vision', icon: Eye, desc: 'Multimodal image analysis engine.' },
  ACADEMY: { label: 'Academy', icon: GraduationCap, desc: 'Structured learning and tutoring.' },
  DEV: { label: 'Dev Studio', icon: Code2, desc: 'Advanced coding assistant.' },
  IMAGINE: { label: 'Imagine', icon: Palette, desc: 'Generative creative studio.' },
};
