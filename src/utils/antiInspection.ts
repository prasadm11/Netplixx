/**
 * Anti-Inspection & Client Protection Utility
 * Discourages casual inspection, DevTools opening, source viewing, and asset dragging.
 */

export function initAntiInspection(): void {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu (except inside text inputs and textareas)
  window.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (!isInput) {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );

  // 2. Block Common Inspection & Developer Keyboard Shortcuts
  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // F12 (Standard DevTools)
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I or Cmd+Option+I (Inspect Element)
      if ((ctrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) ||
          (isMac && e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I' || e.keyCode === 73))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+J or Cmd+Option+J (DevTools Console)
      if ((ctrlOrCmd && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) ||
          (isMac && e.metaKey && e.altKey && (e.key === 'j' || e.key === 'J' || e.keyCode === 74))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+C or Cmd+Option+C (Inspect Element Picker)
      if ((ctrlOrCmd && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) ||
          (isMac && e.metaKey && e.altKey && (e.key === 'c' || e.key === 'C' || e.keyCode === 67))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U or Cmd+Option+U (View Page Source)
      if ((ctrlOrCmd && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) ||
          (isMac && e.metaKey && e.altKey && (e.key === 'u' || e.key === 'U' || e.keyCode === 85))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S or Cmd+S (Save Page)
      if (ctrlOrCmd && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Disable Dragging of Images & Media
  window.addEventListener(
    'dragstart',
    (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'A')) {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );

  // 4. Console Protection Warning & Periodic Scrubbing
  const printConsoleWarning = () => {
    try {
      console.clear();
      console.log(
        '%cStop!',
        'color: #ff3b30; font-size: 46px; font-weight: 900; -webkit-text-stroke: 1px black; font-family: -apple-system, system-ui, sans-serif;'
      );
      console.log(
        '%cThis browser feature is intended for developers. Casual inspection and unauthorized copying of media or code are strictly prohibited.',
        'color: #86868b; font-size: 14px; font-weight: 500; font-family: -apple-system, system-ui, sans-serif;'
      );
    } catch {
      // ignore
    }
  };

  printConsoleWarning();

  // Re-print warning periodically if DevTools is opened
  setInterval(() => {
    // Subtle window outer vs inner dimension check
    const widthDiff = window.outerWidth - window.innerWidth > 160;
    const heightDiff = window.outerHeight - window.innerHeight > 160;
    if (widthDiff || heightDiff) {
      printConsoleWarning();
    }
  }, 3000);
}
