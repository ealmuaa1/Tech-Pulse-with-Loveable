// Safe Compact Mode Toggle
export function toggleCompactMode() {
  const body = document.body;
  const isCompact = body.classList.contains('compact-mode');
  
  if (isCompact) {
    body.classList.remove('compact-mode');
    localStorage.setItem('compact-mode', 'off');
    console.log('Compact mode: OFF');
  } else {
    body.classList.add('compact-mode');
    localStorage.setItem('compact-mode', 'on');
    console.log('Compact mode: ON');
  }
}

export function initCompactMode() {
  const savedMode = localStorage.getItem('compact-mode');
  if (savedMode === 'on') {
    document.body.classList.add('compact-mode');
  }
}

// Keyboard shortcut: Ctrl + Shift + C
export function initKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      toggleCompactMode();
    }
  });
}
