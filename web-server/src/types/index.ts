export interface AskRequest {
  query: string;
  history?: string[];
  model?: string;
}

export interface AskResponse {
  content: string;
  resources?: ResourceResult[];
  quiz?: QuizQuestion[];
}

export interface ResourceResult {
  title: string;
  url: string;
  type: 'documentation' | 'video' | 'tutorial' | 'interactive' | 'article';
  platform: string;
  free: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ExploreRequest {
  goal: string;
  url: string;
}

export interface ExploreStep {
  id: string;
  instruction: string;
  selector: string;
  action: 'click' | 'input' | 'wait' | 'navigate' | 'highlight';
  value?: string;
  optional?: boolean;
}

export interface ExploreSession {
  id: string;
  goal: string;
  website: string;
  steps: ExploreStep[];
  currentStep: number;
  completed: boolean;
  createdAt: string;
}

export interface StepRequest {
  action: 'next' | 'prev' | 'complete' | 'retry';
  data?: Record<string, unknown>;
}

export interface StepResponse {
  nextStep?: ExploreStep;
  completed: boolean;
  session?: ExploreSession;
}

export interface DomAnalysis {
  url: string;
  title: string;
  elements: DomElement[];
}

export interface DomElement {
  tag: string;
  selector: string;
  text: string;
  type: string;
  attributes: Record<string, string>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  model: string;
  voiceEnabled: boolean;
  autoProgress: boolean;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface ResourceQuery {
  query: string;
  limit?: number;
}
