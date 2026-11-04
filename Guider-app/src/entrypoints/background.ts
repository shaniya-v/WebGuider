import type { ExploreStep } from '../types';
import { resetTaskMemory, getCompletedSteps, confirmHighlight } from '../lib/explorerEngine';

function getApiBase(): string {
  try {
    return (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
  } catch {
    return 'http://localhost:3001/api';
  }
}

interface SessionState {
  mode: 'tutor' | 'explore' | null;
  active: boolean;
  currentSteps: ExploreStep[];
  currentStepIndex: number;
  currentTabId: number | null;
}

const readyTabs = new Set<number>();
const lastAnalysisCache = new Map<string, { url: string; hash: string; timestamp: number }>();
const responseCache = new Map<string, any>();
const activityStore = new Map<number, Array<{ type: string; target?: string; selector?: string; value?: string; url?: string; timestamp: number }>>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simpleHash(obj: any): string {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return String(hash);
}

function shouldReAnalyze(goal: string, url: string, pageData: any): boolean {
  const key = `${goal}::${url}`;
  const cached = lastAnalysisCache.get(key);
  const now = Date.now();
  if (!cached) return true;
  if (cached.url !== url) return true;
  if (now - cached.timestamp < 5000) return false;
  const btnHash = simpleHash((pageData.buttons || []).map((b: any) => b.text + b.visible));
  const inputHash = simpleHash((pageData.inputs || []).map((i: any) => i.name + i.placeholder + i.visible));
  const dialogHash = simpleHash((pageData.dialogs || []).map((d: any) => d.text));
  const newHash = `${btnHash}:${inputHash}:${dialogHash}:${pageData.url}`;
  if (cached.hash === newHash) return false;
  lastAnalysisCache.set(key, { url, hash: newHash, timestamp: now });
  return true;
}

function updateAnalysisCache(goal: string, url: string, pageData: any) {
  const key = `${goal}::${url}`;
  const btnHash = simpleHash((pageData.buttons || []).map((b: any) => b.text + b.visible));
  const inputHash = simpleHash((pageData.inputs || []).map((i: any) => i.name + i.placeholder + i.visible));
  const dialogHash = simpleHash((pageData.dialogs || []).map((d: any) => d.text));
  const hash = `${btnHash}:${inputHash}:${dialogHash}:${pageData.url}`;
  lastAnalysisCache.set(key, { url, hash, timestamp: Date.now() });
}

interface SimplePageContext {
  url: string;
  title: string;
  domain: string;
  buttons: { text: string; selector: string; visible: boolean }[];
  inputs: { type: string; name: string; placeholder: string; label: string; selector: string; required: boolean; visible: boolean }[];
  links: { text: string; href: string; selector: string; visible: boolean }[];
  forms: { action: string; method: string; fields: number; submitText: string; selector: string }[];
  dialogs: { text: string; selector: string }[];
  visibleText: string;
  pagePurpose: string;
  activeWorkflow: string;
  successMessages: string[];
  errorMessages: string[];
  validationMessages: string[];
}

function buildPageContextFromAnalysis(pageData: any): SimplePageContext {
  return {
    url: pageData.url || '',
    title: pageData.title || '',
    domain: pageData.domain || '',
    buttons: (pageData.buttons || []).map((b: any) => ({ text: b.text, selector: b.selector, visible: b.visible })),
    inputs: (pageData.inputs || []).map((i: any) => ({ type: i.type, name: i.name, placeholder: i.placeholder, label: i.label, selector: i.selector, required: i.required, visible: i.visible })),
    links: (pageData.links || []).map((l: any) => ({ text: l.text, href: l.href, selector: l.selector, visible: l.visible })),
    forms: (pageData.forms || []).map((f: any) => ({ action: f.action, method: f.method, fields: f.fields, submitText: f.submitText, selector: f.selector })),
    dialogs: (pageData.dialogs || []).map((d: any) => ({ text: d.text, selector: d.selector })),
    visibleText: pageData.visibleText || '',
    pagePurpose: pageData.pagePurpose || '',
    activeWorkflow: pageData.activeWorkflow || '',
    successMessages: pageData.successMessages || [],
    errorMessages: pageData.errorMessages || [],
    validationMessages: pageData.validationMessages || [],
  };
}

function buildRichResponseFromAISteps(steps: any[], goal: string, pageData: any, summary?: string) {
  if (steps.length === 0) {
    return {
      pageSummary: `You're on **${pageData.title || pageData.domain}**`,
      currentStage: 'Complete',
      instruction: '✅ Goal already accomplished!',
      details: ['It looks like this task is already done. What would you like to do next?'],
      highlightTarget: null,
      highlightConfirmed: false,
      expectedNextPage: pageData.url,
      successMessage: summary || 'Goal accomplished',
      completed: true,
      confidence: 95,
      suggestion: null,
    };
  }

  const firstStep = steps[0];

  const hasRealSelector = firstStep.selector && firstStep.selector !== 'body';
  const highlightText = firstStep.instruction
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^Click (the|on) /i, '')
    .replace(/^Fill (in|out) /i, '')
    .replace(/^Enter /i, '')
    .split(' ').slice(0, 6).join(' ');

  return {
    pageSummary: summary || `You're on **${pageData.title || pageData.domain}** — I found a path for "${goal}"`,
    currentStage: firstStep.action === 'input' ? 'Fill Form' : firstStep.action === 'click' ? 'Click' : 'Navigate',
    instruction: firstStep.instruction,
    details: steps.map((s: any, i: number) => `${i + 1}. ${s.instruction}`),
    steps: steps.map((s: any) => ({
      id: s.id,
      instruction: s.instruction,
      reasoning: s.reasoning || '',
      selector: s.selector || 'body',
      action: s.action || 'highlight',
      value: s.value,
      optional: s.optional,
    })),
    highlightTarget: hasRealSelector
      ? { text: highlightText, role: firstStep.action === 'input' ? 'textbox' : 'button', elementType: firstStep.action === 'input' ? 'input' : 'button', confidence: 90 }
      : null,
    highlightConfirmed: false,
    expectedNextPage: pageData.url,
    successMessage: '',
    completed: false,
    confidence: 85,
    suggestion: null,
  };
}

export default defineBackground({
  main() {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
      browser.action.onClicked.addListener(async (tab) => {
        await browser.sidePanel.open({ tabId: tab.id! });
      });
    });

    const state: SessionState = {
      mode: null,
      active: false,
      currentSteps: [],
      currentStepIndex: 0,
      currentTabId: null,
    };

    async function sendToContent(tabId: number, message: Record<string, unknown>) {
      try {
        return await browser.tabs.sendMessage(tabId, message);
      } catch (err) {
        console.warn(`[WebGuider] sendToContent failed for tab ${tabId}:`, err);
        return null;
      }
    }

    async function injectContentScript(tabId: number): Promise<boolean> {
      try {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content-scripts/content.js'],
        });
        console.log(`[WebGuider] Content script injected into tab ${tabId}`);
        await sleep(300);
        return true;
      } catch (err) {
        console.warn(`[WebGuider] Failed to inject content script into tab ${tabId}:`, err);
        return false;
      }
    }

    async function analyzeCurrentTab(tabId: number): Promise<any | null> {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await browser.tabs.sendMessage(tabId, { type: 'ANALYZE_PAGE' });
          if (result) {
            readyTabs.add(tabId);
          }
          return result;
        } catch (err) {
          console.warn(`[WebGuider] analyzeCurrentTab attempt ${attempt + 1}/3 failed for tab ${tabId}:`, err);
          if (attempt === 0) {
            const injected = await injectContentScript(tabId);
            if (injected) {
              await sleep(500);
              continue;
            }
          }
          if (attempt < 2) {
            await sleep(500);
          }
        }
      }
      return null;
    }

    browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
      switch (message.type) {
        case 'CONTENT_SCRIPT_READY': {
          const tabId = sender.tab?.id;
          if (tabId) {
            readyTabs.add(tabId);
            console.log(`[WebGuider] Content script ready in tab ${tabId}`);
          }
          sendResponse({ received: true });
          break;
        }

        case 'EXPLORE_ANALYZE': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              const tabId = tabs[0]?.id;
              if (!tabId) {
                sendResponse({ error: 'No active tab', completed: false, confidence: 0, nextInstruction: 'Unable to inspect current webpage. No active tab found.' });
                return;
              }
              console.log(`[WebGuider] EXPLORE_ANALYZE for tab ${tabId}, goal:`, message.goal);
              const pageData = await analyzeCurrentTab(tabId);
              if (!pageData) {
                sendResponse({ error: 'Cannot access page', completed: false, confidence: 0, nextInstruction: 'Unable to inspect current webpage. Content script is not responding. Try reloading the page or navigating to a different URL.' });
                return;
              }
              if (pageData.error) {
                sendResponse({ error: pageData.error, completed: false, confidence: 0, nextInstruction: 'The page analysis encountered an error. Please try again.' });
                return;
              }

              const cacheKey = `${message.goal}::${pageData.url}`;
              const needsFresh = shouldReAnalyze(message.goal, pageData.url, pageData);

              if (!needsFresh) {
                const cached = responseCache.get(cacheKey);
                if (cached) {
                  sendResponse(cached);
                  return;
                }
              }

              const pageContext = buildPageContextFromAnalysis(pageData);
              const aiResponse = await fetch(`${getApiBase()}/explore/analyze-ai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal: message.goal, url: pageData.url, pageContext }),
              });

              if (!aiResponse.ok) {
                const errData = await aiResponse.json().catch(() => ({ error: aiResponse.statusText }));
                sendResponse({ error: errData.error || 'AI analysis failed', completed: false, confidence: 0, nextInstruction: 'AI analysis failed. Please check your API key or try again.' });
                return;
              }

              const aiData = await aiResponse.json();
              console.log(`[WebGuider] AI generated ${aiData.steps?.length || 0} steps for goal:`, message.goal);

              updateAnalysisCache(message.goal, pageData.url, pageData);
              const response = buildRichResponseFromAISteps(aiData.steps || [], message.goal, pageData, aiData.summary);

              const activityResp = await sendToContent(tabId, { type: 'GET_ACTIVITY' });
              if (activityResp?.activities?.length > 0) {
                const suggestResp = await fetch(`${getApiBase()}/explore/suggest`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    goal: message.goal,
                    url: pageData.url,
                    pageContext,
                    recentActivity: activityResp.activities,
                    currentSteps: response.steps || [],
                  }),
                }).catch(() => null);
                if (suggestResp?.ok) {
                  const suggestData = await suggestResp.json();
                  response.suggestion = suggestData.suggestion;
                }
              }

              responseCache.set(cacheKey, response);
              sendResponse(response);
            } catch (err) {
              console.error('[WebGuider] EXPLORE_ANALYZE error:', err);
              sendResponse({ error: String(err), completed: false, confidence: 0, nextInstruction: 'An unexpected error occurred. Please try again.' });
            }
          })();
          return true;
        }

        case 'EXPLORE_QUERY': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              const tabId = tabs[0]?.id;
              if (!tabId) {
                sendResponse({ answer: 'No active tab found.' });
                return;
              }
              const pageData = await analyzeCurrentTab(tabId);
              const pageContext = pageData ? buildPageContextFromAnalysis(pageData) : null;
              const resp = await fetch(`${getApiBase()}/explore/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  goal: message.goal,
                  url: tabs[0].url,
                  question: message.query,
                  steps: message.steps || [],
                  currentStep: message.currentStep,
                  pageContext,
                }),
              });
              if (!resp.ok) {
                sendResponse({ answer: 'Sorry, I could not answer that right now. Please try again.' });
                return;
              }
              const data = await resp.json();
              sendResponse({ answer: data.answer });
            } catch (err) {
              console.error('[WebGuider] EXPLORE_QUERY error:', err);
              sendResponse({ answer: 'An error occurred while answering your question.' });
            }
          })();
          return true;
        }

        case 'USER_ACTIVITY': {
          const tabId = sender.tab?.id;
          if (tabId && message.activities) {
            const existing = activityStore.get(tabId) || [];
            existing.push(...message.activities);
            if (existing.length > 100) existing.splice(0, 50);
            activityStore.set(tabId, existing);
          }
          sendResponse({ received: true });
          break;
        }

        case 'EXPLORE_RESET': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              if (tabs[0]?.url) {
                resetTaskMemory(message.goal, tabs[0].url);
                responseCache.delete(`${message.goal}::${tabs[0].url}`);
              }
            } catch (err) {
              console.warn('[WebGuider] EXPLORE_RESET error:', err);
            }
            sendResponse({ success: true });
          })();
          return true;
        }

        case 'EXPLORE_GET_PROGRESS': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              if (tabs[0]?.url) {
                const steps = getCompletedSteps(message.goal, tabs[0].url);
                sendResponse({ steps });
              } else {
                sendResponse({ steps: [] });
              }
            } catch (err) {
              console.warn('[WebGuider] EXPLORE_GET_PROGRESS error:', err);
              sendResponse({ steps: [] });
            }
          })();
          return true;
        }

        case 'PAGE_CHANGED': {
          sendResponse({ received: true });
          break;
        }

        case 'URL_CHANGED': {
          const tabId = sender.tab?.id;
          if (tabId) readyTabs.delete(tabId);
          sendResponse({ received: true });
          break;
        }

        case 'GET_PAGE_INFO': {
          (async () => {
            const tabId = sender.tab?.id || state.currentTabId;
            if (!tabId) {
              sendResponse({ url: '', title: '', domain: '' });
              return;
            }
            const result = await sendToContent(tabId, { type: 'GET_PAGE_INFO' });
            sendResponse(result || { url: '', title: '', domain: '' });
          })();
          return true;
        }

        case 'CONFIRM_HIGHLIGHT': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              if (tabs[0]?.url) {
                confirmHighlight(message.goal, tabs[0].url, message.success);
              }
            } catch (err) {
              console.warn('[WebGuider] CONFIRM_HIGHLIGHT error:', err);
            }
            sendResponse({ received: true });
          })();
          return true;
        }

        case 'START_GUIDE': {
          state.mode = 'explore';
          state.active = true;
          state.currentSteps = message.steps as ExploreStep[];
          state.currentStepIndex = 0;
          state.currentTabId = sender.tab?.id || null;

          if (state.currentTabId && state.currentSteps.length > 0) {
            const firstStep = state.currentSteps[0];
            sendToContent(state.currentTabId, {
              type: 'HIGHLIGHT_STEP',
              step: firstStep,
              stepNumber: 1,
              stepTotal: state.currentSteps.length,
            });
          }
          sendResponse({ success: true });
          break;
        }

        case 'STEP_NEXT': {
          if (state.currentStepIndex < state.currentSteps.length - 1) {
            state.currentStepIndex++;
            if (state.currentTabId) {
              const step = state.currentSteps[state.currentStepIndex];
              sendToContent(state.currentTabId, {
                type: 'HIGHLIGHT_STEP',
                step: { ...step, instruction: step.instruction },
                stepNumber: state.currentStepIndex + 1,
                stepTotal: state.currentSteps.length,
              });
            }
          } else {
            state.active = false;
            if (state.currentTabId) {
              sendToContent(state.currentTabId, { type: 'STOP_GUIDE' });
            }
          }
          sendResponse({ success: true, completed: !state.active });
          break;
        }

        case 'STEP_PREV': {
          if (state.currentStepIndex > 0) {
            state.currentStepIndex--;
            if (state.currentTabId) {
              const step = state.currentSteps[state.currentStepIndex];
              sendToContent(state.currentTabId, {
                type: 'HIGHLIGHT_STEP',
                step: { ...step, instruction: step.instruction },
                stepNumber: state.currentStepIndex + 1,
                stepTotal: state.currentSteps.length,
              });
            }
          }
          sendResponse({ success: true });
          break;
        }

        case 'STOP_GUIDE': {
          state.active = false;
          state.currentSteps = [];
          state.currentStepIndex = 0;
          if (state.currentTabId) {
            sendToContent(state.currentTabId, { type: 'STOP_GUIDE' });
          }
          sendResponse({ success: true });
          break;
        }

        case 'GET_STATE': {
          sendResponse(state);
          break;
        }

        case 'SEND_NOTIFICATION': {
          browser.notifications.create({
            type: 'basic',
            iconUrl: '/icons/icon-48.png',
            title: 'Web-Guider',
            message: message.text as string,
          });
          sendResponse({ success: true });
          break;
        }

        case 'HIGHLIGHT_SELECTOR': {
          (async () => {
            const tabId = sender.tab?.id || state.currentTabId;
            if (tabId) {
              await sendToContent(tabId, { type: 'HIGHLIGHT_SELECTOR', selector: message.selector, instruction: message.instruction });
            }
            sendResponse({ success: true });
          })();
          return true;
        }

        default:
          sendResponse({ error: 'Unknown message type: ' + message.type });
      }
      return true;
    });

    browser.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        browser.storage.local.set({
          installed: true,
          installDate: Date.now(),
          preferences: {
            theme: 'system',
            model: 'gpt-4',
            voiceEnabled: false,
            autoProgress: true,
          },
        });
      }
    });

    browser.tabs.onActivated.addListener((activeInfo) => {
      state.currentTabId = activeInfo.tabId;
    });
  },
});
