import type { PageState, PageType } from '../types';

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

function textLower(t: string): string {
  return (t || '').toLowerCase();
}

function clean(t: string): string {
  return t.replace(/\s+/g, ' ').trim().toLowerCase();
}

function matchText(actual: string, pattern: RegExp): boolean {
  return pattern.test(clean(actual));
}

const AUTH_BTN = /login|sign\s*in|log\s*in|signin/i;
const SIGNUP_BTN = /sign\s*up|register|create\s*account|get\s*started|join/i;
const SEARCH_RELATED = /search|find|query|look\s*up|browse|catalog|filter|sort/i;
const SUBMIT_BTN = /submit|save|continue|next|done|finish|confirm/i;

export function buildPageState(goal: string, page: PageData): PageState {
  const text = page.visibleText.toLowerCase();
  const hasPasswordField = page.inputs.some((i) => i.visible && i.type === 'password');
  const hasEmailField = page.inputs.some((i) => i.visible && (i.type === 'email' || /email/i.test(textOf(i))));
  const hasSearchField = page.inputs.some((i) => i.visible && SEARCH_RELATED.test(textOf(i)));
  const hasForm = page.forms.length > 0 || page.inputs.filter((i) => i.visible).length > 1;
  const mainHeading = page.headings.filter((h) => h.level <= 2).sort((a, b) => a.level - b.level)[0]?.text || '';
  const urlLower = page.url.toLowerCase();

  const authInputs = page.inputs
    .filter((i) => i.visible && (i.type === 'password' || i.type === 'email' || !SEARCH_RELATED.test(textOf(i))))
    .map((i) => ({ placeholder: i.placeholder, type: i.type, label: i.label }));

  const formInputs = page.inputs
    .filter((i) => i.visible)
    .map((i) => ({ placeholder: i.placeholder, type: i.type, label: i.label, name: i.name, required: i.required }));

  const loginButton = findBtn(page, AUTH_BTN);
  const signupButton = findBtn(page, SIGNUP_BTN);
  const submitButton = findBtn(page, SUBMIT_BTN);

  const submitButtonText = submitButton?.text || page.forms[0]?.submitText || null;

  const goalLower = goal.toLowerCase();
  const isAuthGoal = /login|sign\s*in|log\s*in|authenticate/i.test(goalLower);
  const isSignupGoal = /register|sign\s*up|create\s*account/i.test(goalLower);
  const isCreateGoal = /create|make|new|add|upload|post|start/i.test(goalLower);
  const isSearchGoal = /search|find|look\s*up|query/i.test(goalLower);
  const isIssueGoal = /issue|pull\s*request|pr/i.test(goalLower);
  const isCheckoutGoal = /checkout|book|buy|purchase|order|pay/i.test(goalLower);
  const isSettingsGoal = /settings|profile|password|preferences|edit|update|change/i.test(goalLower);

  const pageType = detectPageType(page, goalLower, {
    hasPasswordField, hasEmailField, hasSearchField, hasForm,
    loginButton, signupButton, submitButton, mainHeading,
    isAuthGoal, isSignupGoal, isCreateGoal, isSearchGoal,
    isIssueGoal, isCheckoutGoal, isSettingsGoal, urlLower,
  });

  const pagePurpose = page.pagePurpose || '';

  const availableTargets: { text: string; elementType: string; confidence: number; action: string }[] = [];

  if (pageType === 'login' || isAuthGoal) {
    for (const btn of page.buttons) {
      if (!btn.visible) continue;
      if (AUTH_BTN.test(btn.text) || /login|sign/i.test(btn.text)) {
        availableTargets.push({ text: btn.text, elementType: 'button', confidence: 94, action: 'click' });
      }
    }
    for (const link of page.links) {
      if (!link.visible) continue;
      if (AUTH_BTN.test(link.text) || /login|sign/i.test(link.text)) {
        availableTargets.push({ text: link.text, elementType: 'link', confidence: 88, action: 'click' });
      }
    }
    for (const inp of page.inputs) {
      if (!inp.visible) continue;
      if (inp.type === 'password' || inp.type === 'email' || /email|user|phone|mobile/i.test(textOf(inp))) {
        availableTargets.push({ text: inp.placeholder || inp.label || inp.name || 'input field', elementType: 'input', confidence: 80, action: 'input' });
      }
    }
  }

  if (pageType === 'signup' || isSignupGoal) {
    for (const btn of page.buttons) {
      if (!btn.visible) continue;
      if (SIGNUP_BTN.test(btn.text) || /register|sign\s*up|create/i.test(btn.text)) {
        availableTargets.push({ text: btn.text, elementType: 'button', confidence: 94, action: 'click' });
      }
    }
    for (const inp of page.inputs) {
      if (!inp.visible) continue;
      if (inp.type === 'password' || inp.type === 'email' || /name|user|email|phone/i.test(textOf(inp))) {
        availableTargets.push({ text: inp.placeholder || inp.label || inp.name || 'field', elementType: 'input', confidence: 82, action: 'input' });
      }
    }
  }

  if (isCreateGoal && (isIssueGoal || /repo/i.test(goalLower))) {
    for (const link of page.links) {
      if (!link.visible) continue;
      if (/issues?|pulls?|pull.request/i.test(link.text) && /\/[^/]+\/[^/]+/.test(page.url)) {
        availableTargets.push({ text: link.text, elementType: 'link', confidence: 92, action: 'click' });
      }
    }
    for (const btn of page.buttons) {
      if (!btn.visible) continue;
      if (/new\s+(issue|pull\s*request)|create/i.test(btn.text)) {
        availableTargets.push({ text: btn.text, elementType: 'button', confidence: 96, action: 'click' });
      }
    }
    for (const link of page.links) {
      if (!link.visible) continue;
      if (/new\s+(issue|pull\s*request)/i.test(link.text)) {
        availableTargets.push({ text: link.text, elementType: 'link', confidence: 90, action: 'click' });
      }
    }
  }

  if (isSearchGoal) {
    for (const inp of page.inputs) {
      if (!inp.visible) continue;
      if (SEARCH_RELATED.test(textOf(inp))) {
        availableTargets.push({ text: inp.placeholder || inp.label || 'search', elementType: 'input', confidence: 92, action: 'input' });
      }
    }
    for (const btn of page.buttons) {
      if (!btn.visible) continue;
      if (SEARCH_RELATED.test(btn.text) || /go|find/i.test(btn.text)) {
        availableTargets.push({ text: btn.text, elementType: 'button', confidence: 80, action: 'click' });
      }
    }
  }

  if (availableTargets.length === 0) {
    for (const btn of page.buttons) {
      if (!btn.visible) continue;
      if (btn.text && !SEARCH_RELATED.test(btn.text)) {
        availableTargets.push({ text: btn.text, elementType: 'button', confidence: 55, action: 'click' });
      }
    }
    for (const link of page.links) {
      if (!link.visible) continue;
      if (link.text && !SEARCH_RELATED.test(link.text)) {
        availableTargets.push({ text: link.text, elementType: 'link', confidence: 50, action: 'click' });
      }
    }
    for (const inp of page.inputs) {
      if (!inp.visible) continue;
      availableTargets.push({ text: inp.placeholder || inp.label || inp.name || 'input', elementType: 'input', confidence: 45, action: 'input' });
    }
  }

  return {
    pageType,
    pagePurpose,
    url: page.url,
    title: page.title,
    domain: page.domain,
    mainHeading,
    visibleErrors: [...page.errorMessages, ...page.validationMessages],
    successMessages: page.successMessages,
    validationMessages: page.validationMessages,
    hasActiveModal: page.dialogs.length > 0,
    hasActiveDialog: page.dialogs.length > 0,
    hasPasswordField,
    hasEmailField,
    hasSearchField,
    hasForm,
    submitButtonText,
    loginButton,
    signupButton,
    authInputs,
    formInputs,
    disabledButtons: page.disabledButtons.map((b) => b.text),
    breadcrumbs: page.breadcrumbs,
    toasts: page.toasts,
    availableTargets: availableTargets.slice(0, 10),
    workflowHint: page.activeWorkflow || '',
  };
}

type MatchedButton = { text: string } | null;
function findBtn(page: PageData, pattern: RegExp): MatchedButton {
  for (const btn of page.buttons) {
    if (btn.visible && pattern.test(btn.text)) return { text: btn.text };
  }
  for (const link of page.links) {
    if (link.visible && pattern.test(link.text)) return { text: link.text };
  }
  return null;
}

function textOf(inp: { placeholder?: string; label?: string; name?: string; type?: string }): string {
  return (inp.placeholder || inp.label || inp.name || inp.type || '').toLowerCase();
}

function detectPageType(
  page: PageData,
  goalLower: string,
  deps: {
    hasPasswordField: boolean; hasEmailField: boolean; hasSearchField: boolean; hasForm: boolean;
    loginButton: { text: string } | null; signupButton: { text: string } | null;
    submitButton: { text: string } | null; mainHeading: string;
    isAuthGoal: boolean; isSignupGoal: boolean; isCreateGoal: boolean; isSearchGoal: boolean;
    isIssueGoal: boolean; isCheckoutGoal: boolean; isSettingsGoal: boolean;
    urlLower: string;
  }
): PageType {
  const { hasPasswordField, hasEmailField, hasSearchField, hasForm,
    loginButton, signupButton, submitButton, mainHeading,
    isAuthGoal, isSignupGoal, isCreateGoal, isSearchGoal,
    isIssueGoal, isCheckoutGoal, isSettingsGoal, urlLower } = deps;

  const url = urlLower;
  const hasErrors = page.errorMessages.length > 0 || page.validationMessages.length > 0;
  const purpose = page.pagePurpose.toLowerCase();
  const wf = page.activeWorkflow;

  if (wf === 'login' || purpose.includes('login') || (isAuthGoal && (hasPasswordField || (loginButton && !signupButton)))) {
    if (hasPasswordField || hasEmailField || hasForm) return 'login';
    if (loginButton) return 'login';
  }

  if (wf === 'signup' || purpose.includes('registration') || isSignupGoal) return 'signup';

  if (isCreateGoal && isIssueGoal) {
    if (url.includes('/issues/new') || url.includes('/new/issue') || url.includes('/issues/new/choose')) return 'issue_form';
    if (/\/issues?(\/|$)/.test(url) && !url.includes('/new')) return 'issues_list';
    if (url.includes('/pulls') && !url.includes('/new')) return 'pull_requests';
    if (/\/[^/]+\/[^/]+(\/|$)/.test(url) && !url.includes('issues') && !url.includes('pulls')) return 'repo';
    if (url === 'https://github.com/' || url === 'https://github.com' || /^https?:\/\/github\.com\/?$/.test(url)) return 'dashboard';
  }

  if (isCheckoutGoal) {
    if (url.includes('/checkout') || url.includes('/payment') || url.includes('/review')) return 'checkout';
    if (url.includes('/cart')) return 'cart';
    if (purpose.includes('checkout') || purpose.includes('payment')) return 'checkout';
  }

  if (isSettingsGoal || wf === 'settings' || purpose.includes('settings') || purpose.includes('profile')) return 'settings';

  if (isSearchGoal || hasSearchField) return 'search';
  if (hasErrors) return 'error_page';
  if (hasPasswordField || hasEmailField || (loginButton && hasForm)) return 'login';
  if (signupButton && hasForm) return 'signup';
  if (submitButton && hasForm && !loginButton && !signupButton) return 'form';
  if (hasForm) return 'form';

  const headingText = mainHeading.toLowerCase();
  if (/dashboard|overview|home|feed|inbox/i.test(headingText)) return 'dashboard';
  if (/search|find|browse|results/i.test(headingText)) return 'search_results';

  if (page.links.filter((l) => l.visible).length > 5) return 'landing';
  if (page.buttons.filter((b) => b.visible).length > 3) return 'landing';

  return 'unknown';
}
