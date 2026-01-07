export type Tier = 'LOCKED' | 'STARTER' | 'PRO' | 'GOD' | 'ADMIN';

export type AppMode = 'CHAT' | 'VISION' | 'ACADEMY' | 'DEV' | 'IMAGINE';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  image?: string; // base64 string
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface TierConfig {
  name: string;
  color: string;
  accent: string;
  gradient: string;
  glow: string;
  badge?: string;
}