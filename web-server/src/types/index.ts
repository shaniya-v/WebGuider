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
  pageContext?: PageContext;
}

export interface PageContext {
  url: string;
  title: string;
  domain: string;
  buttons: PageButton[];
  inputs: PageInput[];
  links: PageLink[];
  forms: PageForm[];
  dialogs: PageDialog[];
  visibleText: string;
  pagePurpose: string;
  activeWorkflow: string;
  successMessages: string[];
  errorMessages: string[];
  validationMessages: string[];
}

export interface PageButton {
  text: string;
  selector: string;
  visible: boolean;
}

export interface PageInput {
  type: string;
  name: string;
  placeholder: string;
  label: string;
  selector: string;
  required: boolean;
  visible: boolean;
}

export interface PageLink {
  text: string;
  href: string;
  selector: string;
  visible: boolean;
}

export interface PageForm {
  action: string;
  method: string;
  fields: number;
  submitText: string;
  selector: string;
}

export interface PageDialog {
  text: string;
  selector: string;
}

export interface ExploreStep {
  id: string;
  instruction: string;
  reasoning?: string;
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

export interface ExploreChatRequest {
  goal: string;
  url: string;
  pageContext?: PageContext;
  question: string;
  steps: ExploreStep[];
  currentStep?: number;
}

export interface ExploreChatResponse {
  answer: string;
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
