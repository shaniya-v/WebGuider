import type { RichExplorerResponse, ExplorerMemory, HighlightTarget } from '../types';
import { buildPageState } from './stateEngine';
import { planWorkflow, type PlannerResult } from './workflowPlanner';

interface PageData {
  url: string;
  domain: string;
  title: string;
  visibleText: string;
  buttons: { text: string; selector: string; type: string; visible: boolean }[];
  links: { text: string; href: string; selector: string; visible: boolean }[];
  inputs: { type: string; name: string; placeholder: string; label: string; selector: string; required: boolean; visible: boolean }[];
  forms: { action: string; method: string; fields: number; submitText: string; selector: string }[];
  headings: { level: number; text: string; selector: string }[];
  navigation: { links: { text: string; href: string }[] }[];
  dialogs: { text: string; selector: string }[];
  ariaLabels: { label: string; tag: string; selector: string }[];
  placeholders: string[];
  images: { alt: string; src: string; selector: string }[];
  selectElement: { name: string; options: string[]; selector: string }[];
  checkboxes: { type: string; name: string; label: string; checked: boolean; selector: string }[];
  tabs: { text: string; selected: boolean; role: string; selector: string }[];
  successMessages: string[];
  errorMessages: string[];
  validationMessages: string[];
  disabledButtons: { text: string; selector: string }[];
  breadcrumbs: string[];
  toasts: string[];
  pagePurpose: string;
  activeWorkflow: string;
  pageState: string;
}

const memoryStore: Map<string, ExplorerMemory> = new Map();

function getMemoryKey(goal: string, url: string): string {
  try {
    return `${goal}::${new URL(url).hostname}`;
  } catch {
    return `${goal}::unknown`;
  }
}

function getOrCreateMemory(goal: string, url: string): ExplorerMemory {
  const key = getMemoryKey(goal, url);
  let mem = memoryStore.get(key);
  if (!mem) {
    let domain = '';
    try { domain = new URL(url).hostname; } catch { domain = 'unknown'; }
    mem = {
      goal,
      website: domain,
      currentStageId: '',
      completedStageIds: [],
      previousUrl: url,
      expectedNextAction: '',
      lastHighlightSent: null,
      lastHighlightConfirmed: false,
      lastError: null,
      lastSuccess: null,
    };
    memoryStore.set(key, mem);
  } else if (url !== mem.previousUrl) {
    mem.previousUrl = url;
  }
  return mem;
}

export function analyzePageForGoal(goal: string, page: PageData): RichExplorerResponse {
  const memory = getOrCreateMemory(goal, page.url);
  const state = buildPageState(goal, page);

  const domain = state.domain.replace(/^www\./, '');

  const hasErrors = state.visibleErrors.length > 0;
  const hasSuccess = state.successMessages.length > 0;

  if (hasSuccess) {
    const successText = state.successMessages[0];
    if (!memory.completedStageIds.includes(memory.currentStageId) && memory.currentStageId) {
      memory.completedStageIds.push(memory.currentStageId);
    }
    memory.lastSuccess = successText;
    memory.lastError = null;
    return {
      pageSummary: `You're on **${state.title || domain}** — ${successText}`,
      currentStage: 'Complete',
      instruction: `✅ ${successText}`,
      details: ['All steps have been completed successfully. Let me know if you need help with anything else.'],
      highlightTarget: null,
      highlightConfirmed: false,
      expectedNextPage: page.url,
      successMessage: successText,
      completed: true,
      confidence: 98,
    };
  }

  if (hasErrors) {
    const errorText = state.visibleErrors[0];
    memory.lastError = errorText;
    memory.lastSuccess = null;

    const isAuthGoal = /login|sign\s*in|log\s*in|authenticate/i.test(goal);

    let recoveryHint = 'Please correct the issue and try again.';
    let highlightTarget: HighlightTarget | null = null;

    if (/incorrect|invalid|wrong|mismatch|not\s+found/i.test(errorText)) {
      if (isAuthGoal) {
        if (/password/i.test(errorText)) {
          recoveryHint = 'Check that Caps Lock is off and your password is correct. If you have forgotten your password, look for a "Forgot Password" link.';
          const pwField = state.authInputs.find((i) => i.type === 'password');
          if (pwField) {
            highlightTarget = { text: pwField.placeholder || pwField.label || 'password field', role: 'textbox', elementType: 'input', confidence: 85 };
          }
        } else if (/username|email/i.test(errorText)) {
          recoveryHint = 'Double-check your email or username. Make sure you are using the account you registered with.';
          const emailField = state.authInputs.find((i) => i.type === 'email' || /email|user/i.test(i.label + ' ' + i.placeholder));
          if (emailField) {
            highlightTarget = { text: emailField.placeholder || emailField.label || 'email field', role: 'textbox', elementType: 'input', confidence: 85 };
          }
        } else {
          recoveryHint = 'Please verify your credentials and try signing in again.';
        }
      }
    } else if (/required/i.test(errorText)) {
      recoveryHint = 'Some required fields are missing. Please fill them in before continuing.';
    } else if (/already\s+exists|taken/i.test(errorText)) {
      recoveryHint = 'That choice is already taken. Try something different.';
    }

    return {
      pageSummary: `You're on **${domain}** — the form returned an error`,
      currentStage: memory.currentStageId || 'Form',
      instruction: `**${errorText}** — ${recoveryHint} I will continue automatically once you correct it.`,
      details: [
        `The form returned: "${errorText}"`,
        recoveryHint,
        'I will automatically detect when the issue is resolved and continue guiding you.',
      ],
      highlightTarget,
      highlightConfirmed: false,
      expectedNextPage: page.url,
      successMessage: '',
      completed: false,
      confidence: highlightTarget ? 70 : 45,
    };
  }

  memory.lastError = null;

  const plan = planWorkflow(goal, state, memory);

  if (!plan) {
    const target = state.availableTargets[0] || null;
    return {
      pageSummary: `You're on **${state.title || domain}** — I can see the page but I am not sure about the next step.`,
      currentStage: 'Explore',
      instruction: target
        ? `I found **${target.text}** on this page. Try clicking it to move forward.`
        : `I am analyzing this page. Try navigating to where you want to go on **${domain}**.`,
      details: target
        ? [`Click **${target.text}** highlighted on your screen.`]
        : ['Try using the navigation menu or type a more specific request.'],
      highlightTarget: target
        ? { text: target.text, role: target.elementType === 'link' ? 'link' : 'button', elementType: target.elementType as any, confidence: target.confidence }
        : null,
      highlightConfirmed: false,
      expectedNextPage: page.url,
      successMessage: '',
      completed: false,
      confidence: target?.confidence || 30,
    };
  }

  memory.currentStageId = plan.currentStage.id;
  if (plan.completed && !memory.completedStageIds.includes(plan.currentStage.id)) {
    memory.completedStageIds.push(plan.currentStage.id);
  }

  return {
    pageSummary: plan.action.summary,
    currentStage: plan.currentStage.name,
    instruction: plan.action.instruction,
    details: plan.action.details,
    highlightTarget: plan.action.highlightTarget,
    highlightConfirmed: false,
    expectedNextPage: page.url,
    successMessage: plan.completed ? `Task complete! ${plan.currentStage.name} finished.` : '',
    completed: plan.completed,
    confidence: plan.completed ? 95 : plan.confidence,
  };
}

export function resetTaskMemory(goal: string, url: string) {
  const key = getMemoryKey(goal, url);
  memoryStore.delete(key);
}

export function getCompletedSteps(goal: string, url: string): { instruction: string; completed: boolean }[] {
  const key = getMemoryKey(goal, url);
  const mem = memoryStore.get(key);
  if (!mem) return [];
  return [
    ...mem.completedStageIds.map((id) => ({ instruction: `Stage: ${id}`, completed: true })),
  ];
}

export function confirmHighlight(goal: string, url: string, success: boolean) {
  const mem = memoryStore.get(getMemoryKey(goal, url));
  if (mem) {
    mem.lastHighlightConfirmed = success;
  }
}
