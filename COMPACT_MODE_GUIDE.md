# Compact Mode Guide

## Overview
A safe 40% size reduction for the UI that can be easily toggled on/off.

## How to Use

### Toggle Compact Mode
- **Keyboard Shortcut**: Press `Ctrl + Shift + C`
- **Effect**: Toggles between normal and compact mode
- **Console**: Shows "Compact mode: ON" or "Compact mode: OFF"

### What Gets Reduced (40% smaller)
- **Cards**: Padding, border radius, and overall size
- **Grid Gaps**: Spacing between cards
- **Icons**: Size of navigation icons
- **Text**: Slightly smaller but still readable
- **Overall UI**: 40% scale reduction

### What Stays Readable
- **Body Text**: Maintains readability
- **Navigation**: Still functional and clear
- **Buttons**: Remains clickable
- **Content**: All content remains accessible

## How to Revert

### Method 1: Keyboard Shortcut
- Press `Ctrl + Shift + C` again to toggle back

### Method 2: Browser Console
```javascript
// Turn off compact mode
document.body.classList.remove('compact-mode');

// Turn on compact mode
document.body.classList.add('compact-mode');
```

### Method 3: Clear Local Storage
```javascript
// Clear saved preference
localStorage.removeItem('compact-mode');
// Then refresh the page
```

### Method 4: Manual CSS Override
```css
/* Force normal size */
.compact-mode {
  --scale-factor: 1 !important;
  --card-padding: 1rem !important;
  --grid-gap: 1rem !important;
}
```

## Technical Details

### CSS Variables Used
- `--scale-factor`: Controls overall scaling (0.6 = 40% reduction)
- `--card-padding`: Card padding (0.6rem in compact mode)
- `--grid-gap`: Grid spacing (0.6rem in compact mode)
- `--border-radius`: Border radius (0.5rem in compact mode)
- `--icon-size`: Icon size (0.8rem in compact mode)
- `--text-size`: Text size (0.9rem in compact mode)

### Utility Classes
- `.compact-scale`: Applies transform scaling
- `.compact-pad`: Applies compact padding
- `.compact-gap`: Applies compact grid gaps
- `.compact-radius`: Applies compact border radius
- `.compact-text`: Applies compact text size
- `.compact-icon`: Applies compact icon size

## Safety Features
- **Reversible**: Easy to toggle back to normal
- **Persistent**: Remembers your preference
- **Non-destructive**: Doesn't break existing functionality
- **Accessible**: Maintains readability and usability
