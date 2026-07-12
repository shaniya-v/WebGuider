export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
      switch (message.type) {
        case 'HIGHLIGHT_STEP':
          highlightElement(message.step?.selector);
          sendResponse({ success: true });
          break;
        case 'STOP_GUIDE':
          clearHighlights();
          sendResponse({ success: true });
          break;
        case 'ANALYZE_PAGE': {
          const elements = document.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [tabindex]'
          );
          const result = Array.from(elements).slice(0, 50).map((el) => ({
            tag: el.tagName.toLowerCase(),
            selector: generateSelector(el as HTMLElement),
            text: (el.textContent || '').trim().slice(0, 60),
            type: getElementType(el),
          }));
          sendResponse({ elements: result, url: location.href, title: document.title });
          break;
        }
        default:
          sendResponse({ error: 'Unknown message type' });
      }
      return true;
    });
  },
});

function highlightElement(selector: string) {
  clearHighlights();
  try {
    const el = document.querySelector(selector) as HTMLElement;
    if (el) {
      el.style.outline = '3px solid #6366f1';
      el.style.outlineOffset = '2px';
      el.style.borderRadius = '4px';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } catch {}
}

function clearHighlights() {
  document.querySelectorAll('[style*="outline"]').forEach((el) => {
    (el as HTMLElement).style.outline = '';
    (el as HTMLElement).style.outlineOffset = '';
    (el as HTMLElement).style.borderRadius = '';
  });
}

function generateSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(
      (c) => c.tagName === el.tagName
    );
    const index = siblings.indexOf(el);
    return `${el.tagName.toLowerCase()}:nth-child(${index + 1})`;
  }
  return el.tagName.toLowerCase();
}

function getElementType(el: Element): string {
  const tag = el.tagName.toLowerCase();
  if (tag === 'button' || el.getAttribute('role') === 'button') return 'button';
  if (tag === 'a') return 'link';
  if (['input', 'select', 'textarea'].includes(tag)) return 'input';
  return 'other';
}
