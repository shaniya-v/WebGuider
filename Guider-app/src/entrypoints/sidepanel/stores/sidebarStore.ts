import { create } from 'zustand';
import type { Mode, RichExplorerResponse, HighlightTarget, ConfirmHighlightResult, ExploreStep } from '../../../types';
import { classifyIntent, getConversationResponse, getUnclearResponse } from '../../../lib/intentClassifier';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ExplorerStep {
  instruction: string;
  completed: boolean;
}

export type ExplorerStatus = 'idle' | 'analyzing' | 'waiting' | 'completed' | 'error';
export type IntentType = 'conversation' | 'website_task' | 'unclear' | null;

interface SidebarState {
  isVisible: boolean;
  mode: Mode;
  messages: ChatMessage[];
  isLoading: boolean;
  domain: string;

  goal: string;
  currentInstruction: string;
  aiReasoning: string;
  explorerStatus: ExplorerStatus;
  confidence: number;
  completedSteps: ExplorerStep[];
  currentPageTitle: string;
  pageUrl: string;

  pageSummary: string;
  details: string[];
  highlightTarget: HighlightTarget | null;
  highlightConfirmed: boolean;
  successMessage: string;
  exploreSteps: ExploreStep[];
  currentStepIndex: number;

  exploreChatOpen: boolean;
  exploreChatMessages: ChatMessage[];
  exploreChatLoading: boolean;

  lastIntent: IntentType;
  lastIntentConfidence: number;

  setVisible: (visible: boolean) => void;
  toggle: () => void;
  setMode: (mode: Mode) => void;
  setDomain: (domain: string) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setLoading: (loading: boolean) => void;

  setGoal: (goal: string) => void;
  submitUserInput: () => Promise<void>;
  startExploration: () => Promise<void>;
  analyzeCurrentPage: () => Promise<void>;
  resetExploration: () => void;
  triggerHighlight: () => void;
  toggleExploreChat: () => void;
  askExploreDoubt: (question: string) => Promise<void>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isVisible: true,
  mode: 'explore',
  messages: [],
  isLoading: false,
  domain: '',

  goal: '',
  currentInstruction: '',
  aiReasoning: '',
  explorerStatus: 'idle',
  confidence: 0,
  completedSteps: [],
  currentPageTitle: '',
  pageUrl: '',

  pageSummary: '',
  details: [],
  highlightTarget: null,
  highlightConfirmed: false,
  successMessage: '',
  exploreSteps: [],
  currentStepIndex: 0,

  exploreChatOpen: false,
  exploreChatMessages: [],
  exploreChatLoading: false,

  lastIntent: null,
  lastIntentConfidence: 0,

  setVisible: (visible) => set({ isVisible: visible }),
  toggle: () => set((s) => ({ isVisible: !s.isVisible })),
  setMode: (mode) => set({ mode }),
  setDomain: (domain) => set({ domain }),

  addMessage: (role, content) =>
    set((s) => ({
      messages: [...s.messages, { id: generateId(), role, content, timestamp: Date.now() }],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setGoal: (goal) => set({ goal }),
  toggleExploreChat: () => set((s) => ({ exploreChatOpen: !s.exploreChatOpen })),

  askExploreDoubt: async (question: string) => {
    const { goal, exploreSteps, currentStepIndex, pageUrl } = get();
    if (!question.trim()) return;

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: question, timestamp: Date.now() };
    set((s) => ({ exploreChatMessages: [...s.exploreChatMessages, userMsg], exploreChatLoading: true }));

    try {
      const resp: { answer: string } = await browser.runtime.sendMessage({
        type: 'EXPLORE_QUERY',
        goal,
        query: question,
        steps: exploreSteps,
        currentStep: currentStepIndex,
      });
      const assistantMsg: ChatMessage = { id: generateId(), role: 'assistant', content: resp.answer || 'No answer available.', timestamp: Date.now() };
      set((s) => ({ exploreChatMessages: [...s.exploreChatMessages, assistantMsg], exploreChatLoading: false }));
    } catch (err) {
      console.error('[WebGuider] askExploreDoubt error:', err);
      const errorMsg: ChatMessage = { id: generateId(), role: 'assistant', content: 'Sorry, I could not answer that right now.', timestamp: Date.now() };
      set((s) => ({ exploreChatMessages: [...s.exploreChatMessages, errorMsg], exploreChatLoading: false }));
    }
  },

  submitUserInput: async () => {
    const { goal } = get();
    const text = goal.trim();
    if (!text) return;

    const { intent, confidence } = classifyIntent(text);
    set({ lastIntent: intent, lastIntentConfidence: confidence });

    if (intent === 'website_task') {
      await get().startExploration();
      return;
    }

    const response = intent === 'conversation'
      ? getConversationResponse(text)
      : getUnclearResponse(text);

    set((s) => ({
      messages: [
        ...s.messages,
        { id: generateId(), role: 'user', content: text, timestamp: Date.now() },
        { id: generateId(), role: 'assistant', content: response, timestamp: Date.now() },
      ],
      goal: '',
    }));
  },

  startExploration: async () => {
    const { goal } = get();
    if (!goal.trim()) return;

    set({ explorerStatus: 'analyzing', currentInstruction: '', aiReasoning: '', completedSteps: [] });

    try {
      const result: RichExplorerResponse = await browser.runtime.sendMessage({
        type: 'EXPLORE_ANALYZE',
        goal: goal.trim(),
      });

      if ((result as any).error) {
        const errResult = result as any;
        set({
          explorerStatus: 'error',
          currentInstruction: errResult.nextInstruction || errResult.error,
          aiReasoning: errResult.reason || '',
          confidence: 0,
          currentPageTitle: '',
        });
        return;
      }

      const steps = (result as any).steps || [];
      set({
        explorerStatus: result.completed ? 'completed' : 'waiting',
        currentInstruction: result.instruction,
        pageSummary: result.pageSummary,
        details: result.details,
        exploreSteps: steps,
        currentStepIndex: 0,
        highlightTarget: result.highlightTarget,
        highlightConfirmed: result.highlightConfirmed || false,
        successMessage: result.successMessage,
        aiReasoning: result.currentStage || '',
        confidence: result.confidence,
        currentPageTitle: (result as any).currentPage || '',
        pageUrl: result.expectedNextPage || '',
        completedSteps: steps.length > 0
          ? steps.map((s: any, i: number) => ({ instruction: s.instruction, completed: i === 0 ? false : false }))
          : [{ instruction: result.instruction, completed: false }],
      });

      if (result.highlightTarget) {
        get().triggerHighlight();
      }
    } catch (err) {
      console.error('[WebGuider] startExploration error:', err);
      set({
        explorerStatus: 'error',
        currentInstruction: 'Unable to inspect current webpage. Content script not connected.',
        aiReasoning: 'The content script could not analyze the page. Try reloading the page.',
        confidence: 0,
      });
    }
  },

  analyzeCurrentPage: async () => {
    const { goal, explorerStatus } = get();
    if (explorerStatus === 'analyzing' || explorerStatus === 'completed') return;

    set({ explorerStatus: 'analyzing' });

    try {
      const progress: { steps: ExplorerStep[] } = await browser.runtime.sendMessage({
        type: 'EXPLORE_GET_PROGRESS',
        goal,
      });

      const allSteps = progress.steps || [];

      const result: RichExplorerResponse = await browser.runtime.sendMessage({
        type: 'EXPLORE_ANALYZE',
        goal,
      });

      if ((result as any).error) {
        const errResult = result as any;
        set({
          explorerStatus: 'error',
          currentInstruction: errResult.nextInstruction || errResult.error,
          aiReasoning: errResult.reason || '',
          confidence: 0,
          completedSteps: allSteps,
        });
        return;
      }

      if (result.completed) {
        set({
          explorerStatus: 'completed',
          currentInstruction: result.instruction,
          pageSummary: result.pageSummary,
          details: result.details,
          highlightTarget: null,
          highlightConfirmed: false,
          successMessage: result.successMessage || 'Goal accomplished!',
          aiReasoning: result.currentStage || '',
          confidence: result.confidence,
          currentPageTitle: (result as any).currentPage || '',
          completedSteps: allSteps.map((s) => ({ ...s, completed: true })),
        });
        return;
      }

      const steps = (result as any).steps || [];
      const newSteps = steps.length > 0
        ? steps.map((s: any) => ({ instruction: s.instruction, completed: false }))
        : [...allSteps];
      if (newSteps.length === 0 && !newSteps.find((s) => s.instruction === result.instruction)) {
        newSteps.push({ instruction: result.instruction, completed: false });
      }

      set({
        explorerStatus: 'waiting',
        currentInstruction: result.instruction,
        pageSummary: result.pageSummary,
        details: result.details,
        exploreSteps: steps,
        currentStepIndex: 0,
        highlightTarget: result.highlightTarget,
        highlightConfirmed: result.highlightConfirmed || false,
        successMessage: result.successMessage,
        aiReasoning: result.currentStage || '',
        confidence: result.confidence,
        currentPageTitle: (result as any).currentPage || '',
        pageUrl: result.expectedNextPage || '',
        completedSteps: newSteps,
      });

      if (result.highlightTarget) {
        get().triggerHighlight();
      }
    } catch (err) {
      console.error('[WebGuider] analyzeCurrentPage error:', err);
      set({ explorerStatus: 'error', currentInstruction: 'Analysis failed unexpectedly.', aiReasoning: String(err), confidence: 0 });
    }
  },

  resetExploration: () => {
    const { goal } = get();
    browser.runtime.sendMessage({ type: 'EXPLORE_RESET', goal }).catch(() => {});
    browser.runtime.sendMessage({ type: 'STOP_GUIDE' }).catch(() => {});
    set({
      goal: '',
      currentInstruction: '',
      aiReasoning: '',
      explorerStatus: 'idle',
      confidence: 0,
      completedSteps: [],
      currentPageTitle: '',
      pageUrl: '',
      pageSummary: '',
      details: [],
      highlightTarget: null,
      highlightConfirmed: false,
      successMessage: '',
      exploreSteps: [],
      currentStepIndex: 0,
      exploreChatOpen: false,
      exploreChatMessages: [],
      exploreChatLoading: false,
      lastIntent: null,
      lastIntentConfidence: 0,
    });
  },

  triggerHighlight: async () => {
    const { highlightTarget, goal } = get();
    if (!highlightTarget) return;
    try {
      const result: ConfirmHighlightResult = await browser.runtime.sendMessage({
        type: 'FIND_AND_HIGHLIGHT',
        target: highlightTarget,
      });
      if (result?.success) {
        set({ highlightConfirmed: true });
      } else {
        console.warn('[WebGuider] Highlight confirmation failed:', result?.error);
        set({ highlightConfirmed: false });
      }
      browser.runtime.sendMessage({
        type: 'CONFIRM_HIGHLIGHT',
        goal,
        success: !!result?.success,
      }).catch(() => {});
    } catch (err) {
      console.warn('[WebGuider] triggerHighlight error:', err);
    }
  },
}));
