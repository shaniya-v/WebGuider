import { create } from 'zustand';
import type { ExploreStep, DomElement } from '../types';
import { generateId } from '../lib/utils';

interface ExploreState {
  goal: string;
  steps: ExploreStep[];
  currentStepIndex: number;
  isActive: boolean;
  isAnalyzing: boolean;
  domElements: DomElement[];
  sessionId: string | null;

  setGoal: (goal: string) => void;
  setSteps: (steps: ExploreStep[]) => void;
  setCurrentStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setActive: (active: boolean) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setDomElements: (elements: DomElement[]) => void;
  setSessionId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  goal: '',
  steps: [],
  currentStepIndex: 0,
  isActive: false,
  isAnalyzing: false,
  domElements: [],
  sessionId: null,
};

export const useExploreStore = create<ExploreState>((set) => ({
  ...initialState,

  setGoal: (goal) => set({ goal }),
  setSteps: (steps) => set({ steps, currentStepIndex: 0 }),
  setCurrentStep: (index) => set({ currentStepIndex: index }),
  nextStep: () =>
    set((s) => ({
      currentStepIndex: Math.min(s.currentStepIndex + 1, s.steps.length - 1),
    })),
  prevStep: () =>
    set((s) => ({
      currentStepIndex: Math.max(s.currentStepIndex - 1, 0),
    })),
  setActive: (isActive) => set({ isActive }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setDomElements: (domElements) => set({ domElements }),
  setSessionId: (sessionId) => set({ sessionId }),
  reset: () => set(initialState),
}));
