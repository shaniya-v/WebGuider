import { create } from 'zustand';
import type { Mode, UserPreferences } from '../types';
import { loadModelPreference } from '../lib/ai';

interface AppState {
  mode: Mode;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  preferences: UserPreferences;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const useAppStore = create<AppState>((set) => {
  loadModelPreference();

  return {
    mode: 'learn',
    theme: 'system',
    sidebarOpen: true,
    preferences: {
      theme: 'system',
      model: localStorage.getItem('wg-model') || 'gpt-4',
      voiceEnabled: false,
      autoProgress: true,
    },

    setMode: (mode) => set({ mode }),
    toggleMode: () => set((s) => ({ mode: s.mode === 'learn' ? 'explore' : 'learn' })),

    setTheme: (theme) => set({ theme }),

    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    updatePreferences: (prefs) =>
      set((s) => ({
        preferences: { ...s.preferences, ...prefs },
      })),
  };
});
