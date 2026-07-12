import type { ExploreStep } from '../types';

interface SessionState {
  mode: 'tutor' | 'explore' | null;
  active: boolean;
  currentSteps: ExploreStep[];
  currentStepIndex: number;
  currentTabId: number | null;
}

export default defineBackground({
  main() {
    console.log('[Web-Guider] Background service worker loaded');

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
      } catch {
        console.warn('[Web-Guider] Content script not available on this page');
        return null;
      }
    }

    browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
      switch (message.type) {
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

        case 'ANALYZE_PAGE': {
          (async () => {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            const tab = tabs[0];
            if (tab?.id) {
              const result = await sendToContent(tab.id, { type: 'ANALYZE_PAGE' });
              sendResponse(result);
            } else {
              sendResponse({ error: 'No active tab' });
            }
          })();
          return true;
        }

        default:
          sendResponse({ error: 'Unknown message type' });
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
