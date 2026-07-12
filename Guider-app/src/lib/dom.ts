export type ElementType = 'button' | 'input' | 'link' | 'form' | 'dialog' | 'menu' | 'nav' | 'table' | 'heading';

export interface DomElement {
  tag: string;
  selector: string;
  text: string;
  type: ElementType;
  attributes: Record<string, string>;
  boundingBox: DOMRect | null;
}

export interface DomAnalysisResult {
  url: string;
  title: string;
  elements: DomElement[];
}

function getElementType(el: Element): ElementType {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  const type = el.getAttribute('type');

  if (tag === 'button' || role === 'button') return 'button';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'input';
  if (tag === 'a') return 'link';
  if (tag === 'form') return 'form';
  if (tag === 'dialog' || role === 'dialog') return 'dialog';
  if (tag === 'nav' || role === 'navigation') return 'nav';
  if (tag === 'table') return 'table';
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return 'heading';
  if (role === 'menu' || role === 'menubar') return 'menu';
  return 'button';
}

function getUniqueSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
  if (el.getAttribute('aria-label')) return `[aria-label="${el.getAttribute('aria-label')}"]`;

  const tag = el.tagName.toLowerCase();
  const parent = el.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
    const index = siblings.indexOf(el);
    if (index >= 0) {
      return `${getUniqueSelector(parent)} > ${tag}:nth-of-type(${index + 1})`;
    }
  }
  return tag;
}

export function analyzePage(): DomAnalysisResult {
  const elements: DomElement[] = [];
  const interactables = document.querySelectorAll(
    'button, a, input, textarea, select, form, dialog, [role="button"], [role="dialog"], [role="navigation"], [role="menu"]'
  );

  interactables.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    elements.push({
      tag: el.tagName.toLowerCase(),
      selector: getUniqueSelector(el),
      text: (el.textContent || '').trim().slice(0, 100),
      type: getElementType(el),
      attributes: getAttributes(el),
      boundingBox: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
        x: rect.x,
        y: rect.y,
        toJSON: () => ({}),
      } as DOMRect,
    });
  });

  return {
    url: window.location.href,
    title: document.title,
    elements,
  };
}

function getAttributes(el: Element): Record<string, string> {
  const attrs: Record<string, string> = {};
  const important = ['href', 'src', 'type', 'name', 'placeholder', 'value', 'aria-label', 'data-testid', 'role'];
  important.forEach((attr) => {
    const val = el.getAttribute(attr);
    if (val) attrs[attr] = val;
  });
  return attrs;
}

export function highlightElement(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return el.getBoundingClientRect();
}

export function clickElement(selector: string): boolean {
  const el = document.querySelector(selector);
  if (!el) return false;
  (el as HTMLElement).click();
  return true;
}

export function fillInput(selector: string, value: string): boolean {
  const el = document.querySelector(selector) as HTMLInputElement | null;
  if (!el) return false;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  )?.set;
  nativeInputValueSetter?.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}
