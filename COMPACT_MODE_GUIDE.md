# Compact Mode Guide

## Overview

A safe 50% size reduction for the UI that can be easily toggled on/off, with locked bottom navigation.

## How to Use

### Toggle Compact Mode

- **Keyboard Shortcut**: Press `Ctrl + Shift + C`
- **Effect**: Toggles between normal and compact mode
- **Console**: Shows "Compact mode: ON" or "Compact mode: OFF"

### What Gets Reduced (50% smaller)

- **Cards**: Padding, border radius, and overall size
- **Grid Gaps**: Spacing between cards
- **Icons**: Size of navigation icons
- **Text**: Smaller but still readable
- **Overall UI**: 50% scale reduction

### What Stays Readable

- **Body Text**: Maintains readability
- **Navigation**: Still functional and clear
- **Buttons**: Remains clickable
- **Content**: All content remains accessible

### Bottom Navigation

- **Locked**: Fixed at bottom of screen
- **Always Visible**: Stays on top of content
- **High Z-Index**: Ensures it's always accessible
- **Spacing**: Content has bottom padding to avoid overlap

## How to Revert

### Method 1: Keyboard Shortcut

- Press `Ctrl + Shift + C` again to toggle back

### Method 2: Browser Console

```javascript
// Turn off compact mode
document.body.classList.remove("compact-mode");

// Turn on compact mode
document.body.classList.add("compact-mode");
```

### Method 3: Clear Local Storage

```javascript
// Clear saved preference
localStorage.removeItem("compact-mode");
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

- `--scale-factor`: Controls overall scaling (0.5 = 50% reduction)
- `--card-padding`: Card padding (0.5rem in compact mode)
- `--grid-gap`: Grid spacing (0.5rem in compact mode)
- `--border-radius`: Border radius (0.5rem in compact mode)
- `--icon-size`: Icon size (0.75rem in compact mode)
- `--text-size`: Text size (0.85rem in compact mode)

### Utility Classes

- `.compact-scale`: Applies transform scaling
- `.compact-pad`: Applies compact padding
- `.compact-gap`: Applies compact grid gaps
- `.compact-radius`: Applies compact border radius
- `.compact-text`: Applies compact text size
- `.compact-icon`: Applies compact icon size
- `.bottom-nav-locked`: Adds bottom padding for fixed navigation

## Safety Features

- **Reversible**: Easy to toggle back to normal
- **Persistent**: Remembers your preference
- **Non-destructive**: Doesn't break existing functionality
- **Accessible**: Maintains readability and usability
- **Locked Navigation**: Bottom nav always accessible
