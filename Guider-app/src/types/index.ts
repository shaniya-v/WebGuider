export type Mode = 'learn' | 'explore';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  prerequisites?: string[];
  subtopics: string[];
  progress: number;
  resources: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'video' | 'tutorial' | 'interactive' | 'article';
  platform: string;
  free: boolean;
}

export interface Quiz {
  id: string;
  topicId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  topicId: string;
}

export interface CodingExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  language: string;
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
}

export interface DomElement {
  tag: string;
  selector: string;
  text: string;
  type: 'button' | 'input' | 'link' | 'form' | 'dialog' | 'menu' | 'nav' | 'table' | 'heading';
  attributes: Record<string, string>;
  boundingBox: DOMRect | null;
}

export interface DomAnalysis {
  url: string;
  title: string;
  elements: DomElement[];
  forms: DomElement[];
  navigation: DomElement[];
  buttons: DomElement[];
  inputs: DomElement[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  resources?: Resource[];
  quiz?: QuizQuestion[];
  flashcards?: FlashCard[];
}

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  model: string;
  voiceEnabled: boolean;
  autoProgress: boolean;
}

export interface Session {
  id: string;
  mode: Mode;
  topic?: string;
  website?: string;
  messages: Message[];
  startedAt: number;
  lastActivityAt: number;
}
