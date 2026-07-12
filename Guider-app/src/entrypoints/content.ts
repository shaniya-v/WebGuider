import { analyzePage, highlightElement, clickElement, fillInput } from '../lib/dom';
import type { ExploreStep } from '../types';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('[Web-Guider] Content script loaded');

    let currentSteps: ExploreStep[] = [];
    let currentStepIndex = 0;
    let overlayContainer: HTMLDivElement | null = null;

    function createOverlayContainer(): HTMLDivElement {
      const container = document.createElement('div');
      container.id = 'web-guider-overlay';
      container.style.cssText = `
        all: initial;
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 2147483647;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      document.body.appendChild(container);
      return container;
    }

    function showHighlight(selector: string) {
      removeHighlight();
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      el.style.outline = '3px solid #6366f1';
      el.style.outlineOffset = '2px';
      el.style.borderRadius = '4px';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function removeHighlight() {
      document.querySelectorAll('[style*="outline"]').forEach((el) => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
        (el as HTMLElement).style.borderRadius = '';
      });
    }

    function showTooltip(text: string) {
      const existing = document.getElementById('wg-tooltip');
      if (existing) existing.remove();

      const tooltip = document.createElement('div');
      tooltip.id = 'wg-tooltip';
      tooltip.style.cssText = `
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: #1f2937; color: white; padding: 16px 24px; border-radius: 12px;
        font-size: 14px; max-width: 400px; text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5; pointer-events: auto;
      `;
      tooltip.textContent = text;
      document.body.appendChild(tooltip);

      const buttons = document.createElement('div');
      buttons.style.cssText = 'display: flex; gap: 8px; margin-top: 12px; justify-content: center;';

      if (currentStepIndex > 0) {
        const prevBtn = createButton('Previous', 'secondary');
        prevBtn.onclick = () => browser.runtime.sendMessage({ type: 'STEP_PREV' });
        buttons.appendChild(prevBtn);
      }

      const btnLabel = currentStepIndex < currentSteps.length - 1 ? 'Next' : 'Complete';
      const nextBtn = createButton(btnLabel, 'primary');
      nextBtn.onclick = () => {
        const step = currentSteps[currentStepIndex];
        if (step.action === 'click') clickElement(step.selector);
        if (step.action === 'input' && step.value) fillInput(step.selector, step.value);
        browser.runtime.sendMessage({ type: 'STEP_NEXT' });
      };
      buttons.appendChild(nextBtn);

      const exitBtn = createButton('Exit', 'ghost');
      exitBtn.onclick = () => browser.runtime.sendMessage({ type: 'STOP_GUIDE' });
      buttons.appendChild(exitBtn);

      tooltip.appendChild(buttons);
    }

    function createButton(text: string, variant: 'primary' | 'secondary' | 'ghost'): HTMLButtonElement {
      const btn = document.createElement('button');
      const styles = {
        primary: 'background: #6366f1; color: white;',
        secondary: 'background: #374151; color: white;',
        ghost: 'background: transparent; color: #9ca3af;',
      };
      btn.style.cssText = `
        ${styles[variant]} border: none; padding: 8px 16px; border-radius: 8px;
        font-size: 13px; cursor: pointer; font-weight: 500; transition: opacity 0.2s;
      `;
      btn.textContent = text;
      btn.onmouseenter = () => { btn.style.opacity = '0.8'; };
      btn.onmouseleave = () => { btn.style.opacity = '1'; };
      return btn;
    }

    function removeTooltip() {
      const tooltip = document.getElementById('wg-tooltip');
      if (tooltip) tooltip.remove();
    }

    function showStepGuide(step: ExploreStep) {
      showHighlight(step.selector);
      showTooltip(step.instruction);
    }

    function cleanup() {
      removeHighlight();
      removeTooltip();
      if (overlayContainer) {
        overlayContainer.remove();
        overlayContainer = null;
      }
      currentSteps = [];
      currentStepIndex = 0;
    }

    browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
      switch (message.type) {
        case 'ANALYZE_PAGE': {
          sendResponse(analyzePage());
          break;
        }
        case 'START_GUIDE': {
          cleanup();
          currentSteps = message.steps;
          currentStepIndex = 0;
          overlayContainer = createOverlayContainer();
          if (currentSteps.length > 0) showStepGuide(currentSteps[0]);
          sendResponse({ success: true });
          break;
        }
        case 'HIGHLIGHT_STEP': {
          const idx = currentSteps.findIndex((s: ExploreStep) => s.id === message.step.id);
          if (idx >= 0) {
            currentStepIndex = idx;
            showStepGuide(currentSteps[currentStepIndex]);
          }
          sendResponse({ success: true });
          break;
        }
        case 'NEXT_STEP': {
          if (currentStepIndex < currentSteps.length - 1) {
            currentStepIndex++;
            showStepGuide(currentSteps[currentStepIndex]);
          } else {
            cleanup();
          }
          sendResponse({ success: true, completed: currentStepIndex >= currentSteps.length - 1 });
          break;
        }
        case 'PREV_STEP': {
          if (currentStepIndex > 0) {
            currentStepIndex--;
            showStepGuide(currentSteps[currentStepIndex]);
          }
          sendResponse({ success: true });
          break;
        }
        case 'STOP_GUIDE': {
          cleanup();
          sendResponse({ success: true });
          break;
        }
        case 'GET_DOM_ANALYSIS': {
          sendResponse(analyzePage());
          break;
        }
        default:
          sendResponse({ error: 'Unknown message type' });
      }
      return true;
    });
  },
});
