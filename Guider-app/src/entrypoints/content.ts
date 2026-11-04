import type { HighlightTarget } from '../types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    let lastUrl = location.href;
    let observer: MutationObserver | null = null;
    let pageLoaded = false;
    let currentHighlightElement: HTMLElement | null = null;
    let highlightPositionUpdater: (() => void) | null = null;
    let clickDismissListener: ((e: MouseEvent) => void) | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    function analyzePage() {
      try {
        return {
          url: location.href,
          domain: location.hostname,
          title: document.title,
          visibleText: extractVisibleText(),
          buttons: extractButtons(),
          links: extractLinks(),
          inputs: extractInputs(),
          forms: extractForms(),
          headings: extractHeadings(),
          navigation: extractNavigation(),
          dialogs: extractDialogs(),
          ariaLabels: extractAriaLabels(),
          placeholders: extractPlaceholders(),
          images: extractImages(),
          selectElement: extractSelects(),
          checkboxes: extractCheckboxes(),
          tabs: extractTabs(),
          successMessages: extractSuccessMessages(),
          errorMessages: extractErrorMessages(),
          validationMessages: extractValidationMessages(),
          disabledButtons: extractDisabledButtons(),
          breadcrumbs: extractBreadcrumbs(),
          toasts: extractToasts(),
          pagePurpose: extractPagePurpose(),
          activeWorkflow: extractActiveWorkflow(),
          pageState: document.readyState,
        };
      } catch (err) {
        console.error('[WebGuider] analyzePage error:', err);
        return {
          url: location.href, domain: location.hostname, title: document.title,
          visibleText: '', buttons: [], links: [], inputs: [], forms: [],
          headings: [], navigation: [], dialogs: [], ariaLabels: [],
          placeholders: [], images: [], selectElement: [], checkboxes: [],
          tabs: [], successMessages: [], errorMessages: [], validationMessages: [],
          disabledButtons: [], breadcrumbs: [], toasts: [],
          pagePurpose: '', activeWorkflow: '', pageState: document.readyState,
        };
      }
    }

    function extractVisibleText(): string {
      const body = document.body;
      if (!body) return '';
      const clone = body.cloneNode(true) as HTMLElement;
      const tagsToRemove = clone.querySelectorAll('script, style, noscript, iframe, svg, [aria-hidden="true"]');
      tagsToRemove.forEach((el) => el.remove());
      return (clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 3000);
    }

    function extractButtons() {
      const els = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]');
      return Array.from(els).slice(0, 80).map((el) => ({
        text: (el.textContent || (el as HTMLInputElement).value || '').trim().slice(0, 60),
        selector: generateSelector(el as HTMLElement),
        type: el.tagName.toLowerCase(),
        visible: isVisible(el as HTMLElement),
      })).filter((b) => b.text || b.selector);
    }

    function extractLinks() {
      const els = document.querySelectorAll('a[href]');
      return Array.from(els).slice(0, 80).map((el) => ({
        text: (el.textContent || '').trim().slice(0, 60),
        href: (el as HTMLAnchorElement).href,
        selector: generateSelector(el as HTMLElement),
        visible: isVisible(el as HTMLElement),
      })).filter((l) => l.text || l.href);
    }

    function extractInputs() {
      const els = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), textarea, select');
      return Array.from(els).slice(0, 40).map((el) => ({
        type: (el as HTMLInputElement).type || 'text',
        name: (el as HTMLInputElement).name || '',
        placeholder: (el as HTMLInputElement).placeholder || '',
        label: getLabel(el as HTMLElement),
        selector: generateSelector(el as HTMLElement),
        required: (el as HTMLInputElement).required || false,
        visible: isVisible(el as HTMLElement),
        value: (el as HTMLInputElement).value?.slice(0, 80) || '',
      }));
    }

    function extractForms() {
      const forms = document.querySelectorAll('form');
      return Array.from(forms).slice(0, 10).map((form) => ({
        action: (form as HTMLFormElement).action || '',
        method: (form as HTMLFormElement).method || 'get',
        fields: Array.from(form.querySelectorAll('input, textarea, select')).length,
        submitText: (form.querySelector('button[type="submit"], input[type="submit"]')?.textContent || '').trim(),
        selector: generateSelector(form as HTMLElement),
      }));
    }

    function extractHeadings() {
      const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(els).slice(0, 30).map((el) => ({
        level: parseInt(el.tagName[1]),
        text: (el.textContent || '').trim().slice(0, 100),
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractNavigation() {
      const navs = document.querySelectorAll('nav, [role="navigation"], header');
      return Array.from(navs).slice(0, 5).map((nav) => ({
        links: Array.from(nav.querySelectorAll('a')).slice(0, 20).map((a) => ({
          text: (a.textContent || '').trim().slice(0, 40),
          href: (a as HTMLAnchorElement).href,
        })),
      }));
    }

    function extractDialogs() {
      const els = document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog, .modal, [class*="modal"]');
      return Array.from(els).slice(0, 10).filter((el) => isVisible(el as HTMLElement)).map((el) => ({
        text: (el.textContent || '').trim().slice(0, 200),
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractAriaLabels() {
      const els = document.querySelectorAll('[aria-label]:not([aria-label=""]), [aria-describedby]');
      return Array.from(els).slice(0, 40).map((el) => ({
        label: el.getAttribute('aria-label') || '',
        tag: el.tagName.toLowerCase(),
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractPlaceholders() {
      const els = document.querySelectorAll('[placeholder]');
      return Array.from(new Set(Array.from(els).map((el) => (el as HTMLInputElement).placeholder))).slice(0, 20);
    }

    function extractImages() {
      const els = document.querySelectorAll('img[alt]:not([alt=""])');
      return Array.from(els).slice(0, 30).map((el) => ({
        alt: (el as HTMLImageElement).alt,
        src: (el as HTMLImageElement).src?.slice(0, 100),
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractSelects() {
      const els = document.querySelectorAll('select');
      return Array.from(els).slice(0, 20).map((el) => ({
        name: (el as HTMLSelectElement).name || '',
        options: Array.from((el as HTMLSelectElement).options).map((o) => o.text).slice(0, 10),
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractCheckboxes() {
      const els = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
      return Array.from(els).slice(0, 20).map((el) => ({
        type: (el as HTMLInputElement).type,
        name: (el as HTMLInputElement).name || '',
        label: getLabel(el as HTMLElement),
        checked: (el as HTMLInputElement).checked,
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractTabs() {
      const els = document.querySelectorAll('[role="tab"], [role="tabpanel"], [data-tab]');
      return Array.from(els).slice(0, 20).map((el) => ({
        text: (el.textContent || '').trim().slice(0, 40),
        selected: el.getAttribute('aria-selected') === 'true' || el.classList.contains('active'),
        role: el.getAttribute('role') || '',
        selector: generateSelector(el as HTMLElement),
      }));
    }

    function extractSuccessMessages(): string[] {
      const results: string[] = [];
      const selectors = [
        '[role="status"][aria-live="polite"]',
        '[role="alert"][aria-live="assertive"]',
        '.success, .alert-success, .notification-success, .toast-success',
        '[data-testid*="success"]',
        '[class*="success"]:not([class*="error"]):not([class*="danger"])',
      ].join(', ');
      const els = document.querySelectorAll<HTMLElement>(selectors);
      els.forEach((el) => {
        const text = (el.textContent || '').trim();
        if (text && text.length > 5 && text.length < 200 && isVisible(el)) {
          const style = window.getComputedStyle(el);
          const color = style.color || '';
          const bg = style.backgroundColor || '';
          const isGreen = /green|#00|#0a|#2e|rgb\(0,\s*1/i.test(color + bg);
          if (isGreen || /success/i.test(el.className)) {
            results.push(text);
          }
        }
      });
      if (results.length === 0) {
        const bodyText = document.body?.innerText || '';
        const successPatterns = [
          /successfully|completed successfully|has been created|has been updated|you('| a)re all set|changes saved|your changes have been|account created|signed in successfully|logged in successfully|welcome back/i,
        ];
        for (const p of successPatterns) {
          const match = bodyText.match(p);
          if (match) {
            const sentence = extractNearbySentence(bodyText, match.index!);
            if (sentence) results.push(sentence);
          }
        }
      }
      return results.slice(0, 3);
    }

    function extractErrorMessages(): string[] {
      const results: string[] = [];
      const selectors = [
        '[role="alert"]',
        '[aria-live="assertive"]',
        '.error, .alert-error, .alert-danger, .notification-error',
        '[data-testid*="error"]',
        '[class*="error"]:not([class*="success"])',
        '.field-error, .form-error, .validation-error',
        '.invalid-feedback',
        '[data-error]',
      ].join(', ');
      const els = document.querySelectorAll<HTMLElement>(selectors);
      els.forEach((el) => {
        const text = (el.textContent || '').trim();
        if (text && text.length > 3 && text.length < 300 && isVisible(el)) {
          const style = window.getComputedStyle(el);
          const color = style.color || '';
          const isRed = /red|#e[0-9a-f]{3,}|#c[0-9a-f]{3,}|#d[0-9a-f]{3,}|rgb\(2[0-9][0-9]|rgb\(1[8-9]/i.test(color);
          if (isRed || /error|danger|invalid|required/i.test(el.className + el.id)) {
            if (!results.includes(text)) results.push(text);
          }
        }
      });
      if (results.length === 0) {
        const bodyText = document.body?.innerText || '';
        const errorPatterns = [
          /incorrect\s+(username|password|email|otp|pwd)|invalid\s+(username|password|email|otp|credentials?)|wrong\s+(password|otp|email|username)/i,
          /(username|password|email)\s+(is\s+)?(required|invalid|incorrect|wrong|taken|already\s+exists)/i,
          /(login|sign\s*in)\s+(failed|unsuccessful|error)/i,
          /(password|otp)\s+(doesn't\s+match|do\s+not\s+match|mismatch)/i,
          /(payment|transaction|order)\s+(failed|declined|rejected|error)/i,
          /(repository|package|name)\s+(already\s+exists|is\s+taken|invalid)/i,
          /(access|permission)\s+denied|unauthorized|forbidden/i,
          /(not\s+found|page\s+not\s+found|404)/i,
          /(something\s+went\s+wrong|try\s+again|please\s+try\s+again)/i,
        ];
        for (const p of errorPatterns) {
          const match = bodyText.match(p);
          if (match) {
            const sentence = extractNearbySentence(bodyText, match.index!);
            if (sentence && !results.includes(sentence)) results.push(sentence);
          }
        }
      }
      return results.slice(0, 3);
    }

    function extractValidationMessages(): string[] {
      const results: string[] = [];
      const els = document.querySelectorAll<HTMLElement>(
        '.field-validation-error, .validation-summary-errors, .text-danger, [data-valmsg-for]'
      );
      els.forEach((el) => {
        const text = (el.textContent || '').trim();
        if (text && text.length > 3 && isVisible(el)) {
          if (!results.includes(text)) results.push(text);
        }
      });
      document.querySelectorAll<HTMLInputElement>('input:invalid, textarea:invalid, select:invalid').forEach((el) => {
        const validity = el.validity;
        if (validity.valid) return;
        if (validity.valueMissing && !validity.patternMismatch && !validity.typeMismatch && !validity.tooLong && !validity.tooShort && !validity.rangeOverflow && !validity.rangeUnderflow && !validity.stepMismatch && !validity.badInput && !validity.customError) return;
        const label = getLabel(el);
        const validationMsg = el.validationMessage;
        if (validationMsg) {
          const msg = label ? `"${label}" — ${validationMsg}` : validationMsg;
          if (!results.includes(msg)) results.push(msg);
        }
      });
      return results.slice(0, 5);
    }

    function extractDisabledButtons(): { text: string; selector: string }[] {
      return Array.from(document.querySelectorAll<HTMLElement>(
        'button:disabled, [role="button"][aria-disabled="true"], input[type="submit"]:disabled, a.disabled'
      )).slice(0, 10).map((el) => ({
        text: (el.textContent || (el as HTMLInputElement).value || '').trim().slice(0, 60),
        selector: generateSelector(el),
      })).filter((b) => b.text);
    }

    function extractBreadcrumbs(): string[] {
      const nav = document.querySelector<HTMLElement>('nav[aria-label="Breadcrumb"], .breadcrumb, [role="navigation"][aria-label*="breadcrumb"]');
      if (nav) {
        return Array.from(nav.querySelectorAll('a, span, [aria-current="page"]')).map((el) =>
          (el.textContent || '').trim()
        ).filter(Boolean);
      }
      const items = document.querySelectorAll<HTMLElement>('[itemprop="itemListElement"]');
      if (items.length > 0) {
        return Array.from(items).map((el) =>
          (el.querySelector('[itemprop="name"]')?.textContent || el.textContent || '').trim()
        ).filter(Boolean);
      }
      return [];
    }

    function extractToasts(): string[] {
      const results: string[] = [];
      const els = document.querySelectorAll<HTMLElement>(
        '[role="status"], [role="log"], [aria-live="polite"], .toast, .notification, .alert:not([role="alert"])'
      );
      els.forEach((el) => {
        if (el.closest('[role="dialog"], dialog, .modal')) return;
        const text = (el.textContent || '').trim();
        if (text && text.length > 3 && text.length < 300 && isVisible(el)) {
          if (!results.includes(text)) results.push(text);
        }
      });
      return results.slice(0, 3);
    }

    function extractPagePurpose(): string {
      const url = location.pathname + location.search;
      const title = document.title.toLowerCase();
      const h1 = document.querySelector('h1')?.textContent?.toLowerCase().trim() || '';
      const mainHeading = document.querySelector('h1, h2')?.textContent?.toLowerCase().trim() || '';

      const purposeMap: [RegExp, string][] = [
        [/\/login|log(in|out)|signin|auth|authenticate/i, 'Login / Authentication'],
        [/\/signup|register|create-account|sign-up/i, 'Account Registration'],
        [/\/dashboard|my-account|account(\/|$)/i, 'Dashboard / Account Overview'],
        [/\/settings|preferences|profile\/edit/i, 'Settings / Profile Management'],
        [/\/search|find|results\?search/i, 'Search Results'],
        [/\/checkout|cart|payment|order\/review/i, 'Checkout / Payment'],
        [/\/orders?(\/|$)|purchases?|history/i, 'Order History'],
        [/\/products?(\/|$)|items?(\/|$)|catalog|shop/i, 'Product / Catalog Browsing'],
        [/\/create|new(\/|$)|add(\/|$)/i, 'Create New Item'],
        [/\/edit|update|modify|change/i, 'Edit / Update'],
        [/\/issues?(\/|$)|bugs?|tickets/i, 'Issue / Ticket Management'],
        [/\/repos?(itory)?(\/|$)|projects?(\/|$)/i, 'Repository / Project View'],
        [/\/pulls?|merge|pull-request/i, 'Pull Requests'],
        [/\/wiki|docs?|documentation|help|support/i, 'Documentation / Help'],
        [/\/profile(\/|$)|user(\/|$)/i, 'User Profile'],
        [/\/notifications|inbox|messages/i, 'Notifications / Messages'],
      ];

      for (const [pattern, purpose] of purposeMap) {
        if (pattern.test(url) || pattern.test(title) || pattern.test(h1)) {
          return purpose;
        }
      }

      if (/dashboard|overview|home\s*page|welcome/i.test(mainHeading)) return 'Dashboard / Home';
      if (/login|sign\s*in|log\s*in/i.test(mainHeading)) return 'Login / Authentication';
      if (/register|sign\s*up|create\s*account/i.test(mainHeading)) return 'Account Registration';
      if (/settings|preferences|profile/i.test(mainHeading)) return 'Settings / Profile';
      if (/search|find|browse/i.test(mainHeading)) return 'Search / Browse';

      return '';
    }

    function extractActiveWorkflow(): string {
      const url = location.pathname + location.search;
      const title = document.title.toLowerCase();

      if (/\/login|log(in|out)|signin|auth/i.test(url) || /login|sign\s*in/i.test(title)) return 'login';
      if (/register|signup|create-account|sign-up/i.test(url) || /register|sign\s*up/i.test(title)) return 'signup';
      if (/\/checkout|cart|payment/i.test(url) || /checkout|cart/i.test(title)) return 'checkout';
      if (/\/orders?(\/|$)|order\/confirm/i.test(url)) return 'order-confirmation';
      if (/\/settings|preferences|profile/i.test(url)) return 'settings';
      if (/\/create|new(\/|$)/i.test(url)) return 'creation';
      if (/\/edit|update/i.test(url)) return 'editing';

      const activeEl = document.querySelector('[aria-current="page"], [aria-current="step"], .active, .current');
      if (activeEl) {
        const text = (activeEl.textContent || '').toLowerCase().trim();
        if (text) return text;
      }

      return '';
    }

    function extractNearbySentence(text: string, index: number): string {
      const before = text.slice(Math.max(0, index - 80), index);
      const after = text.slice(index, index + 200);
      const sentenceStart = Math.max(before.lastIndexOf('.') + 1, before.lastIndexOf('!') + 1, before.lastIndexOf('?') + 1, 0);
      const sentenceEnd = (() => {
        const endMatch = after.match(/[.!?](\s|$)/);
        return endMatch ? endMatch.index! + 1 : after.length;
      })();
      return (before.slice(sentenceStart) + after.slice(0, sentenceEnd)).trim();
    }

    function getLabel(el: HTMLElement): string {
      const id = el.getAttribute('id');
      if (id) {
        const labelEl = document.querySelector(`label[for="${id}"]`);
        if (labelEl) return (labelEl.textContent || '').trim();
      }
      const parent = el.closest('label');
      if (parent) return (parent.textContent || '').trim().replace(el.textContent || '', '').trim();
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) return ariaLabel;
      return '';
    }

    function isVisible(el: HTMLElement): boolean {
      if (!el.offsetParent && el.tagName !== 'BODY') return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
      return true;
    }

    function generateSelector(el: HTMLElement): string {
      if (el.id) return `#${CSS.escape(el.id)}`;
      if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;
      if (el.getAttribute('name')) return `${el.tagName.toLowerCase()}[name="${el.getAttribute('name')}"]`;
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(el) + 1;
          return `${el.tagName.toLowerCase()}:nth-child(${index})`;
        }
      }
      return el.tagName.toLowerCase();
    }

    interface SmartMatchResult {
      element: HTMLElement;
      selector: string;
      confidence: number;
      strategy: string;
    }

    function findElementSmart(target: HighlightTarget): SmartMatchResult | null {
      const { text, role, elementType } = target;
      if (!text) return null;

      const textLower = text.toLowerCase().trim();
      if (!textLower) return null;

      const candidates: SmartMatchResult[] = [];

      function scoreByVisibility(el: HTMLElement): number {
        if (!isVisible(el)) return -50;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return -50;
        const viewportH = window.innerHeight;
        const viewportW = window.innerWidth;
        const centerY = viewportH / 2;
        const centerX = viewportW / 2;
        const elCenterY = rect.top + rect.height / 2;
        const elCenterX = rect.left + rect.width / 2;
        const distFromCenter = Math.sqrt((elCenterX - centerX) ** 2 + (elCenterY - centerY) ** 2);
        return Math.max(0, 30 - distFromCenter / 50);
      }

      function normalizeText(t: string): string {
        return t.replace(/\s+/g, ' ').trim().toLowerCase();
      }

      function addCandidate(el: HTMLElement, strategy: string, confBonus: number) {
        if (candidates.some((c) => c.element === el)) return;
        const visScore = scoreByVisibility(el);
        const totalConf = Math.min(100, Math.max(0, confBonus + visScore));
        candidates.push({
          element: el,
          selector: generateSelector(el),
          confidence: totalConf,
          strategy,
        });
      }

      const roleTagMap: Record<string, string> = {
        button: 'button, [role="button"], input[type="submit"], input[type="button"]',
        link: 'a, [role="link"]',
        textbox: 'input, textarea, [role="textbox"]',
        input: 'input, textarea, select, [role="textbox"], [role="combobox"]',
        tab: '[role="tab"]',
        menuitem: '[role="menuitem"]',
        option: '[role="option"]',
        combobox: '[role="combobox"], select',
        dialog: '[role="dialog"], [role="alertdialog"], dialog',
        checkbox: 'input[type="checkbox"], [role="checkbox"]',
        radio: 'input[type="radio"], [role="radio"]',
      };

      const elementTypeMap: Record<string, string> = {
        button: 'button, [role="button"], input[type="submit"], input[type="button"]',
        link: 'a, [role="link"]',
        input: 'input, textarea, select, [role="textbox"], [role="combobox"]',
        form: 'form',
      };

      const queryParts: string[] = [];

      if (role && roleTagMap[role]) {
        queryParts.push(roleTagMap[role]);
      }
      if (elementType && elementTypeMap[elementType]) {
        queryParts.push(elementTypeMap[elementType]);
      }
      queryParts.push('button, a, input, textarea, select, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [tabindex]:not([tabindex="-1"])');

      const query = queryParts.join(', ');
      const allInteractive = document.querySelectorAll<HTMLElement>(query);

      for (const el of allInteractive) {
        const elText = normalizeText(el.textContent || '');
        const elValue = normalizeText((el as HTMLInputElement).value || '');
        const elPlaceholder = normalizeText(el.placeholder || '');
        const elAriaLabel = normalizeText(el.getAttribute('aria-label') || '');
        const elTitle = normalizeText(el.title || '');
        const elName = normalizeText(el.getAttribute('name') || '');
        const elAlt = normalizeText(el.getAttribute('alt') || '');

        if (elText === textLower) { addCandidate(el, 'exact-text-match', 99); }
        else if (elAriaLabel === textLower) { addCandidate(el, 'aria-label-exact', 97); }
        else if (elTitle === textLower) { addCandidate(el, 'title-exact', 95); }
        else if (elPlaceholder === textLower) { addCandidate(el, 'placeholder-exact', 94); }
        else if (elValue === textLower) { addCandidate(el, 'value-exact', 93); }
        else if (elName === textLower) { addCandidate(el, 'name-exact', 92); }
        else if (elAlt === textLower) { addCandidate(el, 'alt-text-exact', 91); }
        else if (elText.includes(textLower)) { addCandidate(el, 'text-contains', 82); }
        else if (elAriaLabel.includes(textLower)) { addCandidate(el, 'aria-label-contains', 80); }
        else if (elTitle.includes(textLower)) { addCandidate(el, 'title-contains', 78); }
        else if (elPlaceholder.includes(textLower)) { addCandidate(el, 'placeholder-contains', 76); }
        else if (elName.includes(textLower)) { addCandidate(el, 'name-contains', 72); }
        else if (elAlt.includes(textLower)) { addCandidate(el, 'alt-text-contains', 70); }
        else if (textLower.includes(elText) && elText.length > 0) { addCandidate(el, 'query-contains-element-text', 60); }
      }

      if (candidates.length === 0 && textLower.length > 1) {
        const allElements = document.querySelectorAll<HTMLElement>('*');
        for (const el of allElements) {
          if (el.children.length > 0 && !el.matches('button, a, input, textarea, select, [role="button"]')) continue;
          const elText = normalizeText(el.textContent || '');
          if (elText === textLower) {
            addCandidate(el, 'broad-exact-text', 80);
          } else if (elText.includes(textLower)) {
            addCandidate(el, 'broad-text-contains', 55);
          }
        }
      }

      if (candidates.length === 0 && textLower.length > 1) {
        try {
          const safeText = textLower.replace(/['"]/g, '');
          const xpathResult = document.evaluate(
            `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${safeText}')]`,
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
          );
          for (let i = 0; i < xpathResult.snapshotLength && i < 20; i++) {
            const el = xpathResult.snapshotItem(i);
            if (el instanceof HTMLElement && !candidates.some((c) => c.element === el)) {
              addCandidate(el, 'xpath-fallback', 50);
            }
          }
        } catch {}
      }

      if (candidates.length === 0 && textLower.length > 1) {
        try {
          const safeText = textLower.replace(/['"]/g, '');
          const partialXpath = document.evaluate(
            `//*[contains(translate(@aria-label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${safeText}')]`,
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
          );
          for (let i = 0; i < partialXpath.snapshotLength && i < 10; i++) {
            const el = partialXpath.snapshotItem(i);
            if (el instanceof HTMLElement && !candidates.some((c) => c.element === el)) {
              addCandidate(el, 'aria-label-xpath', 45);
            }
          }
        } catch {}
      }

      candidates.sort((a, b) => b.confidence - a.confidence);
      return candidates[0] || null;
    }

    const HIGHLIGHT_STYLE_ID = 'wg-highlight-style';

    function injectHighlightStyles() {
      if (document.getElementById(HIGHLIGHT_STYLE_ID)) return;
      const style = document.createElement('style');
      style.id = HIGHLIGHT_STYLE_ID;
      style.textContent = `
        @keyframes wg-glow-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.5), 0 0 15px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 20px rgba(99,102,241,0.9), 0 0 40px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2); }
        }
        @keyframes wg-bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wg-pulse-ring {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .wg-spotlight {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483644 !important;
          pointer-events: none !important;
          transition: all 0.3s ease !important;
        }
        .wg-spotlight-hole {
          position: absolute !important;
          border-radius: 8px !important;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.35) !important;
          transition: all 0.3s ease !important;
        }
        .wg-spotlight-hole::after {
          content: '' !important;
          position: absolute !important;
          inset: -8px !important;
          border-radius: 14px !important;
          border: 3px solid rgba(99,102,241,0.3) !important;
          animation: wg-glow-pulse 2s ease-in-out infinite !important;
          pointer-events: none !important;
        }
        .wg-highlight-overlay {
          position: fixed !important;
          pointer-events: none !important;
          z-index: 2147483646 !important;
          border: 3px solid #6366f1 !important;
          border-radius: 6px !important;
          animation: wg-glow-pulse 1.5s ease-in-out infinite !important;
          transition: all 0.15s ease !important;
          background: rgba(99,102,241,0.08) !important;
        }
        .wg-pulse-ring {
          position: fixed !important;
          pointer-events: none !important;
          z-index: 2147483645 !important;
          border: 3px solid #818cf8 !important;
          border-radius: 12px !important;
          animation: wg-pulse-ring 2s ease-out infinite !important;
        }
        .wg-highlight-arrow {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          animation: wg-bounce-arrow 0.8s ease-in-out infinite !important;
          color: #4f46e5 !important;
          font-size: 30px !important;
          line-height: 1 !important;
          text-shadow: 0 2px 12px rgba(79,70,229,0.6) !important;
          filter: drop-shadow(0 0 6px rgba(99,102,241,0.5)) !important;
        }
        .wg-highlight-tooltip {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          background: #4f46e5 !important;
          color: white !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 6px 14px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 16px rgba(79,70,229,0.5), 0 0 0 1px rgba(255,255,255,0.1) !important;
          text-align: center !important;
          line-height: 1.3 !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          word-wrap: break-word !important;
        }
        .wg-highlight-tooltip::after {
          content: '' !important;
          position: absolute !important;
          top: 100% !important;
          left: 50% !important;
          margin-left: -6px !important;
          border: 6px solid transparent !important;
          border-top-color: #4f46e5 !important;
        }
        .wg-step-badge {
          position: fixed !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          background: #4f46e5 !important;
          color: white !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          padding: 2px 8px !important;
          border-radius: 10px !important;
          box-shadow: 0 2px 8px rgba(79,70,229,0.4) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .wg-step-indicator {
          position: fixed !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          z-index: 2147483647 !important;
          pointer-events: none !important;
          animation: wg-fade-in 0.3s ease !important;
        }
        @keyframes wg-fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .wg-step-indicator-inner {
          background: #1e1b4b !important;
          color: white !important;
          padding: 12px 20px !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          max-width: 90vw !important;
          width: 400px !important;
        }
        .wg-step-indicator-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          margin-bottom: 8px !important;
        }
        .wg-step-indicator-count {
          font-size: 11px !important;
          font-weight: 600 !important;
          color: #a5b4fc !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .wg-step-indicator-progress {
          display: flex !important;
          gap: 6px !important;
          margin-bottom: 8px !important;
        }
        .wg-step-indicator-dot {
          flex: 1 !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: rgba(255,255,255,0.15) !important;
          transition: all 0.3s ease !important;
        }
        .wg-step-indicator-dot.active {
          background: #818cf8 !important;
          box-shadow: 0 0 6px rgba(129,140,248,0.5) !important;
        }
        .wg-step-indicator-dot.completed {
          background: #34d399 !important;
        }
        .wg-step-indicator-text {
          font-size: 13px !important;
          line-height: 1.4 !important;
          color: #e0e7ff !important;
        }
      `;
      document.head.appendChild(style);
    }

    function clearHighlights() {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }
      if (currentHighlightElement) {
        currentHighlightElement.style.outline = '';
        currentHighlightElement.style.outlineOffset = '';
        currentHighlightElement.style.position = '';
        currentHighlightElement.style.zIndex = '';
        currentHighlightElement = null;
      }
      if (clickDismissListener) {
        document.removeEventListener('click', clickDismissListener, true);
        clickDismissListener = null;
      }
      if (highlightPositionUpdater) {
        highlightPositionUpdater();
        highlightPositionUpdater = null;
      }
      document.querySelectorAll('.wg-highlight-overlay, .wg-highlight-arrow, .wg-highlight-tooltip, .wg-spotlight, .wg-pulse-ring, .wg-step-badge, .wg-step-indicator').forEach((el) => el.remove());
    }

    let currentStepNumber = 0;
    let currentStepTotal = 0;

    function showStepIndicator(step: number, total: number, instruction: string) {
      clearStepIndicator();
      currentStepNumber = step;
      currentStepTotal = total;
      injectHighlightStyles();

      const indicator = document.createElement('div');
      indicator.className = 'wg-step-indicator';
      indicator.innerHTML = `
        <div class="wg-step-indicator-inner">
          <div class="wg-step-indicator-header">
            <span class="wg-step-indicator-count">Step ${step} of ${total}</span>
          </div>
          <div class="wg-step-indicator-progress">
            ${Array.from({ length: total }, (_, i) => `<div class="wg-step-indicator-dot ${i < step ? 'completed' : i === step - 1 ? 'active' : ''}"></div>`).join('')}
          </div>
          <div class="wg-step-indicator-text">${instruction}</div>
        </div>
      `;
      document.body.appendChild(indicator);
    }

    function clearStepIndicator() {
      document.querySelectorAll('.wg-step-indicator').forEach(el => el.remove());
    }

function showSmartHighlight(element: HTMLElement, instruction?: string) {
      clearHighlights();
      injectHighlightStyles();

      currentHighlightElement = element;
      element.style.outline = '3px solid #818cf8';
      element.style.outlineOffset = '2px';
      element.style.position = 'relative';
      element.style.zIndex = '2147483647';

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const rect = element.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Spotlight backdrop with cutout
      const spotlight = document.createElement('div');
      spotlight.className = 'wg-spotlight';
      const cutout = document.createElement('div');
      cutout.className = 'wg-spotlight-hole';
      cutout.style.top = `${rect.top}px`;
      cutout.style.left = `${rect.left}px`;
      cutout.style.width = `${rect.width}px`;
      cutout.style.height = `${rect.height}px`;
      spotlight.appendChild(cutout);
      document.body.appendChild(spotlight);

      // Expanding pulse ring
      const pulseRing = document.createElement('div');
      pulseRing.className = 'wg-pulse-ring';
      pulseRing.style.top = `${rect.top + window.scrollY - 8}px`;
      pulseRing.style.left = `${rect.left + window.scrollX - 8}px`;
      pulseRing.style.width = `${rect.width + 16}px`;
      pulseRing.style.height = `${rect.height + 16}px`;
      document.body.appendChild(pulseRing);

      // Glow highlight overlay
      const overlay = document.createElement('div');
      overlay.className = 'wg-highlight-overlay';
      overlay.style.top = `${rect.top + scrollY - 4}px`;
      overlay.style.left = `${rect.left + scrollX - 4}px`;
      overlay.style.width = `${rect.width + 8}px`;
      overlay.style.height = `${rect.height + 8}px`;
      document.body.appendChild(overlay);

      // Step number badge
      const badge = document.createElement('div');
      badge.className = 'wg-step-badge';
      badge.textContent = '📍 Next';
      badge.style.top = `${rect.top + scrollY - 24}px`;
      badge.style.left = `${rect.left + scrollX + rect.width / 2}px`;
      document.body.appendChild(badge);

      // Bouncing arrow indicator
      const arrow = document.createElement('div');
      arrow.className = 'wg-highlight-arrow';
      arrow.textContent = '👆';
      arrow.style.top = `${rect.top + scrollY - 44}px`;
      arrow.style.left = `${rect.left + scrollX + rect.width / 2 - 15}px`;
      document.body.appendChild(arrow);

      // Instruction tooltip (shows what to do, not just "Next Step")
      const tooltipText = instruction || 'Click here';
      const tooltip = document.createElement('div');
      tooltip.className = 'wg-highlight-tooltip';
      tooltip.textContent = tooltipText.length > 80 ? tooltipText.slice(0, 77) + '...' : tooltipText;
      const tooltipW = Math.min(Math.max(rect.width + 20, 120), 340);
      tooltip.style.maxWidth = `${tooltipW}px`;
      tooltip.style.top = `${rect.top + scrollY - 80}px`;
      tooltip.style.left = `${rect.left + scrollX + rect.width / 2 - tooltipW / 2}px`;
      document.body.appendChild(tooltip);

      const updatePositions = () => {
        const r = element.getBoundingClientRect();
        cutout.style.top = `${r.top}px`;
        cutout.style.left = `${r.left}px`;
        cutout.style.width = `${r.width}px`;
        cutout.style.height = `${r.height}px`;
        overlay.style.top = `${r.top + window.scrollY - 4}px`;
        overlay.style.left = `${r.left + window.scrollX - 4}px`;
        overlay.style.width = `${r.width + 8}px`;
        overlay.style.height = `${r.height + 8}px`;
        pulseRing.style.top = `${r.top + window.scrollY - 8}px`;
        pulseRing.style.left = `${r.left + window.scrollX - 8}px`;
        pulseRing.style.width = `${r.width + 16}px`;
        pulseRing.style.height = `${r.height + 16}px`;
        arrow.style.top = `${r.top + window.scrollY - 44}px`;
        arrow.style.left = `${r.left + window.scrollX + r.width / 2 - 15}px`;
        badge.style.top = `${r.top + window.scrollY - 24}px`;
        badge.style.left = `${r.left + window.scrollX + r.width / 2}px`;
        tooltip.style.top = `${r.top + window.scrollY - 80}px`;
        tooltip.style.left = `${r.left + window.scrollX + r.width / 2 - tooltipW / 2}px`;
      };

      window.addEventListener('scroll', updatePositions, { passive: true });
      window.addEventListener('resize', updatePositions, { passive: true });

      const positionObserver = new MutationObserver(() => updatePositions());
      positionObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });

      highlightPositionUpdater = () => {
        window.removeEventListener('scroll', updatePositions);
        window.removeEventListener('resize', updatePositions);
        positionObserver.disconnect();
      };

      clickDismissListener = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (element.contains(target) || target === element) {
          clearHighlights();
        }
      };
      document.addEventListener('click', clickDismissListener, true);
    }

    function handleHighlightRequest(target: HighlightTarget): { success: boolean; selector?: string; confidence?: number; error?: string } {
      const result = findElementSmart(target);
      if (!result) {
        clearHighlights();
        console.warn(`[WebGuider] Could not find element matching "${target.text}" (role: ${target.role || 'any'}, type: ${target.elementType || 'any'}) — no candidates found`);
        return { success: false, error: `Could not find element matching "${target.text}" on the page.` };
      }
      if (result.confidence < 25) {
        clearHighlights();
        console.warn(`[WebGuider] Could not find element matching "${target.text}" — best candidate confidence ${result.confidence} (${result.strategy}) below threshold`);
        return { success: false, error: `Could not reliably find "${target.text}" on the page (confidence too low: ${result.confidence}%).` };
      }
      console.log(`[WebGuider] Found "${target.text}" → via ${result.strategy} (confidence: ${result.confidence}%)`);
      return { success: true, selector: result.selector, confidence: result.confidence };
    }

    function handleHighlightWithRetry(target: HighlightTarget, attempt: number = 0): { success: boolean; selector?: string; confidence?: number; error?: string } {
      const result = handleHighlightRequest(target);
      if (!result.success && attempt < 2) {
        const fallbackTarget = { ...target };
        if (attempt === 0) {
          fallbackTarget.text = target.text;
          fallbackTarget.role = undefined;
        } else if (attempt === 1) {
          const words = target.text.split(/\s+/);
          if (words.length > 1) {
            fallbackTarget.text = words[words.length - 1];
          } else {
            return result;
          }
        }
        retryTimeout = setTimeout(() => {
          handleHighlightWithRetry(fallbackTarget, attempt + 1);
        }, 500);
        return { success: false, error: `Retrying with fallback strategy (attempt ${attempt + 1})...` };
      }
      return result;
    }

    function startMutationWatching() {
      if (observer) observer.disconnect();
      observer = new MutationObserver(() => {
        if (!pageLoaded) return;
        browser.runtime.sendMessage({ type: 'PAGE_CHANGED' }).catch(() => {});
      });
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-hidden', 'role'],
      });
    }

    function startUrlWatching() {
      let previousUrl = location.href;
      const checkInterval = setInterval(() => {
        if (location.href !== previousUrl) {
          previousUrl = location.href;
          lastUrl = location.href;
          clearHighlights();
          browser.runtime.sendMessage({ type: 'URL_CHANGED', url: location.href }).catch(() => {});
        }
      }, 500);
      new MutationObserver(() => {
        if (location.href !== previousUrl) {
          previousUrl = location.href;
          lastUrl = location.href;
          clearHighlights();
          browser.runtime.sendMessage({ type: 'URL_CHANGED', url: location.href }).catch(() => {});
        }
      }).observe(document, { subtree: true, childList: true });
    }

    browser.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
      switch (message.type) {
        case 'ANALYZE_PAGE':
          try {
            sendResponse(analyzePage());
          } catch (err) {
            console.error('[WebGuider] ANALYZE_PAGE failed:', err);
            sendResponse({ error: String(err) });
          }
          break;
        case 'HIGHLIGHT_STEP':
          if (message.step?.selector) {
            const el = document.querySelector(message.step.selector) as HTMLElement;
            if (el) showSmartHighlight(el, message.step.instruction);
          }
          if (message.stepNumber && message.stepTotal) {
            showStepIndicator(message.stepNumber, message.stepTotal, message.step?.instruction || '');
          }
          sendResponse({ success: true });
          break;
        case 'HIGHLIGHT_SELECTOR':
          if (message.selector) {
            const el = document.querySelector(message.selector) as HTMLElement;
            if (el) {
              showSmartHighlight(el, message.instruction);
              if (message.stepNumber && message.stepTotal) {
                showStepIndicator(message.stepNumber, message.stepTotal, message.instruction || '');
              }
              sendResponse({ success: true });
            } else {
              sendResponse({ success: false, error: 'Selector did not match any element' });
            }
          } else {
            sendResponse({ success: false, error: 'No selector provided' });
          }
          break;
        case 'FIND_AND_HIGHLIGHT':
          if (message.target) {
            const hlResult = handleHighlightWithRetry(message.target as HighlightTarget);
            if (hlResult.success && hlResult.selector) {
              const el = document.querySelector(hlResult.selector) as HTMLElement;
              if (el) {
                showSmartHighlight(el, message.instruction);
                if (message.stepNumber && message.stepTotal) {
                  showStepIndicator(message.stepNumber, message.stepTotal, message.instruction || '');
                }
              }
            }
            sendResponse({ ...hlResult, instruction: message.instruction });
          } else {
            sendResponse({ success: false, error: 'No target provided' });
          }
          break;
        case 'STOP_GUIDE':
          clearHighlights();
          sendResponse({ success: true });
          break;
        case 'GET_PAGE_INFO':
          sendResponse({ url: location.href, title: document.title, domain: location.hostname });
          break;
        case 'GET_ACTIVITY': {
          const buf = activityBuffer.splice(0);
          sendResponse({ activities: buf });
          break;
        }
        default:
          sendResponse({ error: 'Unknown message type: ' + message.type });
      }
      return true;
    });

    const activityBuffer: Array<{ type: string; target?: string; selector?: string; value?: string; url?: string; timestamp: number }> = [];
    let activityTimer: ReturnType<typeof setTimeout> | null = null;

    function trackActivity(type: string, detail?: { target?: string; selector?: string; value?: string }) {
      activityBuffer.push({ type, ...detail, url: location.href, timestamp: Date.now() });
      if (activityBuffer.length > 50) activityBuffer.splice(0, 10);
      if (!activityTimer) {
        activityTimer = setTimeout(() => {
          activityTimer = null;
          browser.runtime.sendMessage({ type: 'USER_ACTIVITY', activities: activityBuffer.splice(0) }).catch(() => {});
        }, 3000);
      }
    }

    function injectActivityListeners() {
      document.addEventListener('click', (e) => {
        const el = e.target as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const text = (el as any).textContent?.trim().slice(0, 60) || el.getAttribute('aria-label') || '';
        const selector = tag + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : '');
        trackActivity('click', { target: text || tag, selector: selector.slice(0, 80) });
      }, true);

      document.addEventListener('input', (e) => {
        const el = e.target as HTMLInputElement;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          const name = el.getAttribute('name') || el.getAttribute('placeholder') || el.id || '';
          trackActivity('input', { target: name, value: (el as HTMLInputElement).value?.slice(0, 40) });
        }
      }, true);

      document.addEventListener('submit', (e) => {
        const el = e.target as HTMLElement;
        const text = (el.querySelector('[type="submit"], button') as HTMLElement)?.textContent?.trim() || 'form';
        trackActivity('submit', { target: text });
      }, true);
    }

    function onReady() {
      pageLoaded = true;
      startMutationWatching();
      startUrlWatching();
      injectActivityListeners();
      browser.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY', url: location.href }).catch(() => {});
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  },
});
