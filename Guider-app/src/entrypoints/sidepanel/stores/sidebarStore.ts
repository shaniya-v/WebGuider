import { create } from 'zustand';
import type { Mode } from '../../../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AutomationStep {
  id: string;
  instruction: string;
  selector: string;
  action: 'click' | 'input' | 'wait' | 'navigate' | 'highlight';
  value?: string;
}

export type AutomationStatus = 'idle' | 'searching' | 'clicking' | 'waiting' | 'done';

interface SidebarState {
  isVisible: boolean;
  mode: Mode;
  messages: ChatMessage[];
  isLoading: boolean;
  domain: string;
  goal: string;
  steps: AutomationStep[];
  currentStepIndex: number;
  isActive: boolean;
  isAnalyzing: boolean;
  automationStatus: AutomationStatus;
  confidence: number;
  inputValue: string;
  suggestions: string[];
  setVisible: (visible: boolean) => void;
  toggle: () => void;
  setMode: (mode: Mode) => void;
  setDomain: (domain: string) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setLoading: (loading: boolean) => void;
  setInputValue: (value: string) => void;
  setGoal: (goal: string) => void;
  setSteps: (steps: AutomationStep[]) => void;
  setCurrentStepIndex: (index: number) => void;
  setActive: (active: boolean) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAutomationStatus: (status: AutomationStatus) => void;
  setConfidence: (confidence: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialSuggestions = [
  'Explain Docker containers',
  'What is Kubernetes?',
  'Learn React hooks',
  'Teach me Git basics',
];

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isVisible: false,
  mode: 'explore',
  messages: [],
  isLoading: false,
  domain: '',
  goal: '',
  steps: [],
  currentStepIndex: 0,
  isActive: false,
  isAnalyzing: false,
  automationStatus: 'idle',
  confidence: 0,
  inputValue: '',
  suggestions: initialSuggestions,

  setVisible: (visible) => set({ isVisible: visible }),
  toggle: () => set((s) => ({ isVisible: !s.isVisible })),
  setMode: (mode) => set({ mode }),
  setDomain: (domain) => set({ domain }),

  addMessage: (role, content) =>
    set((s) => ({
      messages: [...s.messages, { id: generateId(), role, content, timestamp: Date.now() }],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setInputValue: (value) => set({ inputValue: value }),
  setGoal: (goal) => set({ goal }),
  setSteps: (steps) => set({ steps }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  setActive: (active) => set({ isActive: active }),
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAutomationStatus: (status) => set({ automationStatus: status }),
  setConfidence: (confidence) => set({ confidence }),

  nextStep: () =>
    set((s) => ({
      currentStepIndex: Math.min(s.currentStepIndex + 1, s.steps.length - 1),
    })),

  prevStep: () =>
    set((s) => ({
      currentStepIndex: Math.max(s.currentStepIndex - 1, 0),
    })),

  reset: () =>
    set({
      goal: '',
      steps: [],
      currentStepIndex: 0,
      isActive: false,
      isAnalyzing: false,
      automationStatus: 'idle',
      confidence: 0,
    }),
}));
