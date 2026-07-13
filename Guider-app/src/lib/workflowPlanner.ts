import type { PageState, ExplorerMemory, HighlightTarget } from '../types';

export interface WorkflowAction {
  highlightTarget: HighlightTarget | null;
  instruction: string;
  details: string[];
  summary: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  isOnThisPage(state: PageState): boolean;
  getAction(state: PageState): WorkflowAction | null;
  isComplete(state: PageState, memory: ExplorerMemory): boolean;
}

export interface Workflow {
  name: string;
  goalPattern: RegExp;
  stages: WorkflowStage[];
}

function findTarget(state: PageState, pattern: RegExp): { text: string; elementType: string; confidence: number } | null {
  for (const t of state.availableTargets) {
    if (pattern.test(t.text)) return t;
  }
  return null;
}

function findTargetByType(state: PageState, elementType: string): { text: string; elementType: string; confidence: number } | null {
  const target = state.availableTargets.find((t) => t.elementType === elementType);
  return target || null;
}

function hasUrlChanged(memory: ExplorerMemory, state: PageState): boolean {
  return memory.previousUrl !== '' && state.url !== memory.previousUrl;
}

const loginWorkflow: Workflow = {
  name: 'login',
  goalPattern: /login|sign\s*in|log\s*in|signin|authenticate|log\s*me\s*in/i,
  stages: [
    {
      id: 'click_login',
      name: 'Open Login Form',
      description: 'Click the sign-in button to open the login form',
      isOnThisPage(state) {
        return state.loginButton !== null || state.pageType === 'login';
      },
      getAction(state) {
        if (state.loginButton) {
          return {
            highlightTarget: { text: state.loginButton.text, role: 'button', elementType: 'button', confidence: 95 },
            instruction: `Click the **${state.loginButton.text}** button highlighted on your screen. It's usually in the top-right corner.`,
            details: [
              `The **${state.loginButton.text}** button will open a sign-in form where you can enter your credentials.`,
              `Once the form appears, I'll guide you through filling in your email and password.`,
              `After you sign in, I'll automatically detect the next page and continue guiding you.`,
            ],
            summary: `You're on **${state.domain}** — click the sign-in button to get started.`,
          };
        }
        const target = findTarget(state, /login|sign\s*in|log\s*in/i);
        if (target) {
          return {
            highlightTarget: { text: target.text, role: 'button', elementType: target.elementType as any, confidence: target.confidence },
            instruction: `Click the **${target.text}** button highlighted on your screen.`,
            details: [
              `This will open the sign-in form where you can enter your email address and password.`,
              `After you sign in, I'll automatically continue guiding you.`,
            ],
            summary: `You're on **${state.domain}** — let's sign you in.`,
          };
        }
        return null;
      },
      isComplete(state, memory) {
        if (state.pageType === 'login') return true;
        if (state.hasActiveDialog || state.hasActiveModal) return true;
        if (state.hasPasswordField && state.hasForm) return true;
        return hasUrlChanged(memory, state);
      },
    },
    {
      id: 'fill_credentials',
      name: 'Sign In',
      description: 'Enter your email and password, then click sign in',
      isOnThisPage(state) {
        if (state.pageType === 'login') return true;
        if (state.hasPasswordField && state.hasEmailField) return true;
        if (state.hasActiveDialog && (state.hasPasswordField || state.authInputs.length >= 2)) return true;
        return false;
      },
      getAction(state) {
        const pwField = state.authInputs.find((i) => i.type === 'password');
        const emailField = state.authInputs.find((i) => i.type === 'email' || /email|user|phone|mobile/i.test(i.label + ' ' + i.placeholder));
        const firstField = emailField || state.authInputs.find((i) => i.type !== 'password') || state.authInputs[0];

        const details: string[] = [];
        if (firstField) {
          const label = firstField.placeholder || firstField.label || 'Email or username';
          details.push(`Type your **${label}** in the first field.`);
        } else {
          details.push(`Enter your **email address or username** in the first input field.`);
        }
        if (pwField) {
          const label = pwField.placeholder || pwField.label || 'Password';
          details.push(`Type your **${label}** in the password field.`);
        } else {
          details.push(`Type your **password** in the password field.`);
        }

        const signInBtn = findTarget(state, /sign\s*in|login|log\s*in|continue|submit/i);
        if (signInBtn) {
          details.push(`Click **${signInBtn.text}** to complete sign-in.`);
        } else if (state.submitButtonText) {
          details.push(`Click **${state.submitButtonText}** to complete sign-in.`);
        } else {
          details.push(`Click the **Sign In** button to complete sign-in.`);
        }
        details.push(`After signing in, I'll automatically detect the next page and continue guiding you.`);

        const highlightTarget: HighlightTarget | null = firstField
          ? { text: firstField.placeholder || firstField.label || 'email', role: 'textbox', elementType: 'input', confidence: 85 }
          : null;

        return {
          highlightTarget,
          instruction: `Enter your credentials here on **${state.domain}**. Type your email address and password, then click **Sign In**. I'll automatically detect the next step once you're logged in.`,
          details,
          summary: `You're on the sign-in page for **${state.domain}** — enter your credentials to continue.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        if (state.pageType === 'dashboard' || state.pageType === 'landing') return true;
        return hasUrlChanged(_memory, state);
      },
    },
  ],
};

const signupWorkflow: Workflow = {
  name: 'signup',
  goalPattern: /register|sign\s*up|create\s*account/i,
  stages: [
    {
      id: 'fill_signup_form',
      name: 'Fill Registration Form',
      description: 'Fill in the registration form fields',
      isOnThisPage(state) {
        return state.pageType === 'signup' || (state.signupButton !== null && state.hasForm);
      },
      getAction(state) {
        const details: string[] = [];
        const inputs = state.formInputs.filter((i) => i.type !== 'hidden');
        for (const inp of inputs.slice(0, 5)) {
          const label = inp.placeholder || inp.label || inp.name || 'field';
          if (inp.type === 'password') {
            if (!details.some((d) => d.includes('password'))) details.push(`Choose a strong password and enter it in the **${label}** field.`);
          } else if (inp.type === 'email') {
            details.push(`Enter your email address in the **${label}** field.`);
          } else if (!details.some((d) => d.includes(label))) {
            details.push(`Fill in **${label}**${inp.required ? ' (required)' : ''}.`);
          }
        }

        const submitBtn = findTarget(state, /create|sign\s*up|register|submit|continue/i) || findTarget(state, /submit|continue|next/i);
        if (submitBtn) {
          details.push(`Finally, click **${submitBtn.text}** to create your account.`);
        } else if (state.submitButtonText) {
          details.push(`Finally, click **${state.submitButtonText}** to create your account.`);
        } else {
          details.push(`Finally, click the **Sign Up** button to create your account.`);
        }
        details.push(`After registration, I'll automatically continue guiding you.`);

        const firstInput = inputs[0];
        return {
          highlightTarget: firstInput
            ? { text: firstInput.placeholder || firstInput.label || 'first field', role: 'textbox', elementType: 'input', confidence: 80 }
            : null,
          instruction: `Let's set up your account on **${state.domain}**. Fill in the required information below to create your account.`,
          details,
          summary: `You're on the registration page for **${state.domain}** — let's create your account.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        const urlChanged = hasUrlChanged(_memory, state);
        if (urlChanged) return true;
        return false;
      },
    },
  ],
};

const createIssueWorkflow: Workflow = {
  name: 'create_issue',
  goalPattern: /create\s+(a\s+)?(new\s+)?(issue|pull\s*request|pr)\b/i,
  stages: [
    {
      id: 'open_repo',
      name: 'Open Repository',
      description: 'Navigate to the repository where you want to create the item',
      isOnThisPage(state) {
        return state.pageType === 'dashboard' || state.pageType === 'landing' || state.pageType === 'unknown';
      },
      getAction(state) {
        const target = findTarget(state, /repo|project|repository/i);
        const anyLink = findTargetByType(state, 'link');
        return {
          highlightTarget: target
            ? { text: target.text, role: 'link', elementType: 'link', confidence: target.confidence }
            : null,
          instruction: `To create an ${state.url.includes('github') ? 'issue' : 'item'}, you first need to open the repository or project where it belongs. Look for a repository in your list or use the search bar.`,
          details: [
            `${state.url.includes('github') ? 'Issues and pull requests belong to individual repositories.' : 'Items belong to specific projects.'}`,
            `Find and click on the **repository** or **project** where you want to create this.`,
            `Once you're inside, I'll guide you to the next step.`,
            `I'll automatically detect when you navigate to a repository and continue guiding you.`,
          ],
          summary: `You're on **${state.domain}** — first, open the repository where the item belongs.`,
        };
      },
      isComplete(state, _memory) {
        return state.pageType === 'repo' || state.pageType === 'issues_list' || state.pageType === 'issue_form' || hasUrlChanged(_memory, state);
      },
    },
    {
      id: 'open_issues_tab',
      name: 'Open Issues Tab',
      description: 'Click the Issues tab in the repository',
      isOnThisPage(state) {
        return state.pageType === 'repo' || (state.pageType === 'unknown' && /\/[^/]+\/[^/]+/.test(state.url));
      },
      getAction(state) {
        const issuesTab = findTarget(state, /issues?/i);
        if (issuesTab) {
          return {
            highlightTarget: { text: issuesTab.text, role: 'tab', elementType: 'tab', confidence: issuesTab.confidence },
            instruction: `Now click the **${issuesTab.text}** tab in the repository navigation bar.`,
            details: [
              `The Issues tab shows all current and past issues for this repository.`,
              `Once on the issues page, I'll guide you to click **New Issue**.`,
            ],
            summary: `You're in the **${state.domain}** repository — let's open the Issues tab.`,
          };
        }
        return {
          highlightTarget: null,
          instruction: `Look for the **Issues** tab near the top of the repository page and click it.`,
          details: [
            `The Issues tab is usually in the navigation bar below the repository name.`,
            `Once you're there, I'll help you create a new issue.`,
          ],
          summary: `You're in the repository — find and click the **Issues** tab.`,
        };
      },
      isComplete(state, _memory) {
        return state.pageType === 'issues_list' || state.pageType === 'issue_form';
      },
    },
    {
      id: 'click_new_issue',
      name: 'Click New Issue',
      description: 'Click the New Issue button',
      isOnThisPage(state) {
        return state.pageType === 'issues_list' || state.pageType === 'pull_requests';
      },
      getAction(state) {
        const target = findTarget(state, /new\s+(issue|pull\s*request)|create/i);
        if (target) {
          return {
            highlightTarget: { text: target.text, role: 'button', elementType: 'button', confidence: target.confidence },
            instruction: `Click the **${target.text}** button highlighted on your screen.`,
            details: [
              `This opens the form where you can write the title and description.`,
              `Fill in the details and submit to create the issue.`,
            ],
            summary: `You're on the issues list — click **New Issue** to continue.`,
          };
        }
        return {
          highlightTarget: null,
          instruction: `Click the **New Issue** button on this page.`,
          details: [
            `It's usually a green button near the top right of the issues list.`,
            `Fill in the form and submit to create your issue.`,
          ],
          summary: `Look for the **New Issue** button on this page.`,
        };
      },
      isComplete(state, _memory) {
        return state.pageType === 'issue_form';
      },
    },
    {
      id: 'fill_issue_form',
      name: 'Fill Issue Form',
      description: 'Write the issue title and description, then submit',
      isOnThisPage(state) {
        return state.pageType === 'issue_form';
      },
      getAction(state) {
        const titleInput = state.formInputs.find((i) => /title|subject/i.test(i.placeholder || i.label || i.name));
        const bodyInput = state.formInputs.find((i) => /description|body|comment/i.test(i.placeholder || i.label || i.name));

        const details: string[] = [];
        if (titleInput) {
          details.push(`Write a clear, descriptive title in the **${titleInput.placeholder || titleInput.label || 'title'}** field.`);
        } else {
          details.push(`Write a clear, descriptive **title** for your issue.`);
        }
        if (bodyInput) {
          details.push(`Add details in the **${bodyInput.placeholder || bodyInput.label || 'description'}** field — explain the problem or feature request.`);
        } else {
          details.push(`Add **details** in the description field — explain what the issue is about.`);
        }
        details.push(`Click **Submit new issue** to create it.`);

        const firstField = titleInput || bodyInput || state.formInputs[0];
        return {
          highlightTarget: firstField
            ? { text: firstField.placeholder || firstField.label || 'title', role: 'textbox', elementType: 'input', confidence: 85 }
            : null,
          instruction: `Now fill in the issue form. Give your issue a clear title and description, then submit it.`,
          details,
          summary: `You're on the new issue form — write your issue details here.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        if (state.pageType === 'issues_list' || state.pageType === 'repo' || state.pageType === 'dashboard') return true;
        return false;
      },
    },
  ],
};

const searchWorkflow: Workflow = {
  name: 'search',
  goalPattern: /search|find|look\s*for|look\s*up|query/i,
  stages: [
    {
      id: 'do_search',
      name: 'Search',
      description: 'Enter your search query',
      isOnThisPage(_state) {
        return true;
      },
      getAction(state) {
        const searchInput = state.availableTargets.find((t) => t.elementType === 'input' && /search|find/i.test(t.text));
        if (searchInput) {
          return {
            highlightTarget: { text: searchInput.text, role: 'textbox', elementType: 'input', confidence: searchInput.confidence },
            instruction: `Type what you're looking for in the **${searchInput.text}** field, then press **Enter** or click the search button.`,
            details: [
              `Enter your search terms in the field highlighted on your screen.`,
              `Press Enter or click the search button to see results.`,
              `I'll help you navigate the results.`,
            ],
            summary: `You're on **${state.domain}** — let's search for what you need.`,
          };
        }
        const input = findTargetByType(state, 'input');
        if (input) {
          return {
            highlightTarget: { text: input.text, role: 'textbox', elementType: 'input', confidence: input.confidence },
            instruction: `Type your search query here. I'll help you find what you need.`,
            details: [
              `Enter your search terms in the field highlighted on your screen.`,
              `Press Enter or click the search button.`,
            ],
            summary: `You're on **${state.domain}** — let's search.`,
          };
        }
        return null;
      },
      isComplete(state, _memory) {
        return state.pageType === 'search_results' || hasUrlChanged(_memory, state);
      },
    },
  ],
};

const bookCheckoutWorkflow: Workflow = {
  name: 'checkout',
  goalPattern: /book|reserve|order|purchase|buy|checkout|pay|place\s*order/i,
  stages: [
    {
      id: 'go_to_checkout',
      name: 'Go to Checkout',
      description: 'Navigate to the checkout or payment page',
      isOnThisPage(state) {
        return state.pageType !== 'checkout' && state.pageType !== 'checkout_review';
      },
      getAction(state) {
        const cartBtn = findTarget(state, /cart|checkout|buy|purchase|order/i);
        if (cartBtn) {
          return {
            highlightTarget: { text: cartBtn.text, role: 'button', elementType: cartBtn.elementType as any, confidence: cartBtn.confidence },
            instruction: `Click the **${cartBtn.text}** button highlighted on your screen to start the checkout process.`,
            details: [
              `This will take you to the checkout or payment page.`,
              `I'll guide you through filling in the required details.`,
            ],
            summary: `You're on **${state.domain}** — let's start your checkout.`,
          };
        }
        return null;
      },
      isComplete(state, _memory) {
        return state.pageType === 'checkout' || state.pageType === 'checkout_review' || state.pageType === 'cart';
      },
    },
    {
      id: 'fill_checkout',
      name: 'Complete Checkout',
      description: 'Fill in checkout details and confirm',
      isOnThisPage(state) {
        return state.pageType === 'checkout' || state.pageType === 'checkout_review' || state.pageType === 'cart';
      },
      getAction(state) {
        const details: string[] = [];
        const inputs = state.formInputs.filter((i) => i.type !== 'hidden');
        for (const inp of inputs.slice(0, 5)) {
          const label = inp.placeholder || inp.label || inp.name || 'field';
          if (!details.some((d) => d.includes(label))) {
            details.push(`Fill in **${label}**${inp.required ? ' (required)' : ''}.`);
          }
        }
        const payBtn = findTarget(state, /pay|confirm|order|purchase|place\s*order|buy|submit/i);
        if (payBtn) {
          details.push(`Review your order, then click **${payBtn.text}** to complete.`);
        } else if (state.submitButtonText) {
          details.push(`Review your order, then click **${state.submitButtonText}** to complete.`);
        } else {
          details.push(`Review your order carefully, then click **Place Order** or **Pay Now** to complete.`);
        }
        details.push(`After your order is placed, I'll automatically confirm it for you.`);

        return {
          highlightTarget: null,
          instruction: `Let's complete your order on **${state.domain}**. Fill in the required information and confirm your purchase.`,
          details,
          summary: `You're on the checkout page for **${state.domain}** — let's complete your order.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        return false;
      },
    },
  ],
};

const settingsWorkflow: Workflow = {
  name: 'settings',
  goalPattern: /settings|profile|password|preferences|edit|update|change|modify/i,
  stages: [
    {
      id: 'go_to_settings',
      name: 'Open Settings',
      description: 'Navigate to the settings or profile page',
      isOnThisPage(state) {
        return state.pageType !== 'settings' && state.pageType !== 'profile';
      },
      getAction(state) {
        const target = findTarget(state, /settings|profile|account|preferences/i);
        if (target) {
          return {
            highlightTarget: { text: target.text, role: 'link', elementType: target.elementType as any, confidence: target.confidence },
            instruction: `Click the **${target.text}** option highlighted on your screen to open your settings.`,
            details: [
              `This will take you to your settings page where you can make changes.`,
              `From there, you can update your preferences, change your password, or modify your profile.`,
            ],
            summary: `You're on **${state.domain}** — let's open your settings.`,
          };
        }
        return null;
      },
      isComplete(state, _memory) {
        return state.pageType === 'settings' || state.pageType === 'profile';
      },
    },
    {
      id: 'adjust_settings',
      name: 'Update Settings',
      description: 'Make the desired changes',
      isOnThisPage(state) {
        return state.pageType === 'settings' || state.pageType === 'profile';
      },
      getAction(state) {
        const inputs = state.formInputs.filter((i) => i.type !== 'hidden');
        const details: string[] = inputs.slice(0, 5).map((inp) => {
          const label = inp.placeholder || inp.label || inp.name || 'field';
          return `You can update **${label}** here.`;
        });
        if (details.length === 0) {
          details.push('Look for the setting you want to change on this page.');
        }

        const saveBtn = findTarget(state, /save|update|apply|change|submit/i) || (state.submitButtonText ? { text: state.submitButtonText, elementType: 'button' as const, confidence: 70 } : null);
        if (saveBtn) {
          details.push(`Click **${saveBtn.text}** to save your changes.`);
        } else {
          details.push(`Look for a **Save** or **Update** button to apply your changes.`);
        }

        return {
          highlightTarget: null,
          instruction: `You can update your settings here on **${state.domain}**. Make the changes you need and save them.`,
          details,
          summary: `You're on the settings page for **${state.domain}** — make your changes here.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        return false;
      },
    },
  ],
};

const genericFormWorkflow: Workflow = {
  name: 'form',
  goalPattern: /create|make|new|add|upload|post|start|fill|submit|apply/i,
  stages: [
    {
      id: 'fill_form',
      name: 'Complete Form',
      description: 'Fill in the form and submit',
      isOnThisPage(_state) {
        return true;
      },
      getAction(state) {
        const inputs = state.formInputs.filter((i) => i.type !== 'hidden');
        const details: string[] = inputs.slice(0, 5).map((inp) => {
          const label = inp.placeholder || inp.label || inp.name || 'field';
          if (inp.type === 'password') return `Choose a **password** and enter it in the ${label} field.`;
          if (inp.type === 'email') return `Enter your **email address** in the ${label} field.`;
          return `Fill in **${label}**${inp.required ? ' (required)' : ''}.`;
        });
        if (details.length === 0) {
          details.push('Start filling in the fields on this form.');
        }

        const submitTarget = state.submitButtonText
          ? { text: state.submitButtonText, elementType: 'button' as const, confidence: 80 }
          : findTarget(state, /submit|save|continue|next|done|finish|create|add/i);
        if (submitTarget) {
          details.push(`Click **${submitTarget.text}** to submit the form.`);
        } else {
          details.push(`Click the **Submit** button to complete the form.`);
        }
        details.push(`I'll automatically detect the next step once the form is submitted.`);

        const firstInput = inputs[0];
        return {
          highlightTarget: firstInput
            ? { text: firstInput.placeholder || firstInput.label || 'first field', role: 'textbox', elementType: 'input', confidence: 75 }
            : null,
          instruction: `Let's complete this form on **${state.domain}**. Fill in the required details below.`,
          details,
          summary: `You're on a form on **${state.domain}** — fill in the details.`,
        };
      },
      isComplete(state, _memory) {
        if (state.successMessages.length > 0) return true;
        return hasUrlChanged(_memory, state);
      },
    },
  ],
};

const allWorkflows: Workflow[] = [
  loginWorkflow,
  signupWorkflow,
  createIssueWorkflow,
  searchWorkflow,
  bookCheckoutWorkflow,
  settingsWorkflow,
  genericFormWorkflow,
];

export interface PlannerResult {
  workflow: Workflow;
  currentStage: WorkflowStage;
  action: WorkflowAction;
  completed: boolean;
  confidence: number;
}

export function planWorkflow(goal: string, state: PageState, memory: ExplorerMemory): PlannerResult | null {
  const goalLower = goal.toLowerCase();

  for (const wf of allWorkflows) {
    if (!wf.goalPattern.test(goalLower)) continue;

    let foundCurrentStage: WorkflowStage | null = null;
    let foundStageIndex = -1;

    for (let i = 0; i < wf.stages.length; i++) {
      const stage = wf.stages[i];
      const stageCompleted = memory.completedStageIds.includes(stage.id);

      if (stage.isOnThisPage(state)) {
        foundCurrentStage = stage;
        foundStageIndex = i;

        if (stageCompleted) {
          if (stage.isComplete(state, memory)) {
            continue;
          }
          break;
        }

        if (!stage.isComplete(state, memory)) {
          break;
        }

        if (stage.isComplete(state, memory)) {
          if (i + 1 < wf.stages.length) {
            foundCurrentStage = wf.stages[i + 1];
            foundStageIndex = i + 1;
          }
          break;
        }
      }
    }

    if (foundCurrentStage) {
      const completed = foundStageIndex >= wf.stages.length - 1 && foundCurrentStage.isComplete(state, memory);

      const action = foundCurrentStage.getAction(state);
      if (!action) {
        const stageCompleted = foundCurrentStage.isComplete(state, memory);
        if (stageCompleted && foundStageIndex < wf.stages.length - 1) {
          const nextStage = wf.stages[foundStageIndex + 1];
          const nextAction = nextStage.getAction(state);
          if (nextAction) {
            return {
              workflow: wf,
              currentStage: nextStage,
              action: nextAction,
              completed: false,
              confidence: 75,
            };
          }
        }
        return null;
      }

      return {
        workflow: wf,
        currentStage: foundCurrentStage,
        action,
        completed,
        confidence: completed ? 95 : action.highlightTarget ? 85 : 70,
      };
    }
  }

  return null;
}
