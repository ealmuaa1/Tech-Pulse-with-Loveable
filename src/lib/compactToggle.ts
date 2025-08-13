export function isCompact() {
  try { return localStorage.getItem('tp:ui:compact') === '1'; } catch { return false; }
}

export function setCompact(on: boolean) {
  try {
    localStorage.setItem('tp:ui:compact', on ? '1' : '0');
    document.body.classList.toggle('ui-compact', on);
  } catch {}
}

export function initCompactFromStorage() {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('ui-compact', isCompact());
  }
}

// Debug-only keyboard toggle (optional, dev only)
export function initKeyboardToggle() {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'u') {
        const on = !document.body.classList.contains('ui-compact');
        setCompact(on);
        console.info('Compact UI: ', on);
      }
    });
  }
}
