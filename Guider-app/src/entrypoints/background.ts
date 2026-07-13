import type { ExploreStep } from '../types';
import { analyzePageForGoal, resetTaskMemory, getCompletedSteps, confirmHighlight } from '../lib/explorerEngine';

interface SessionState {
  mode: 'tutor' | 'explore' | null;
  active: boolean;
  currentSteps: ExploreStep[];
  currentStepIndex: number;
  currentTabId: number | null;
}

const readyTabs = new Set<number>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
              const result = analyzePageForGoal(message.goal, pageData);
              sendResponse(result);
            } catch (err) {
              console.error('[WebGuider] EXPLORE_ANALYZE error:', err);
              sendResponse({ error: String(err), completed: false, confidence: 0, nextInstruction: 'An unexpected error occurred. Please try again.' });
            }
          })();
          return true;
        }

        case 'EXPLORE_RESET': {
          (async () => {
            try {
              const tabs = await browser.tabs.query({ active: true, currentWindow: true });
              if (tabs[0]?.url) {
                resetTaskMemory(message.goal, tabs[0].url);
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

          if (state.currentTabId) {
            sendToContent(state.currentTabId, {
              type: 'START_GUIDE',
              steps: state.currentSteps,
            });
          }
          sendResponse({ success: true });
          break;
        }

        case 'STEP_NEXT': {
          if (state.currentStepIndex < state.currentSteps.length - 1) {
            state.currentStepIndex++;
            if (state.currentTabId) {
              sendToContent(state.currentTabId, {
                type: 'HIGHLIGHT_STEP',
                step: state.currentSteps[state.currentStepIndex],
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
              sendToContent(state.currentTabId, {
                type: 'HIGHLIGHT_STEP',
                step: state.currentSteps[state.currentStepIndex],
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
              await sendToContent(tabId, { type: 'HIGHLIGHT_SELECTOR', selector: message.selector });
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
