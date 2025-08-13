# Compact UI Mode

## Overview

The Compact UI mode provides a reversible way to reduce overall UI density by ~40% while increasing text readability. This is implemented using CSS custom properties and Tailwind utilities.

## How to Use

### Keyboard Toggle (Development)

- Press `Alt + Shift + U` to toggle Compact UI mode on/off
- The state is automatically saved to localStorage
- Console will show "Compact UI: true/false" when toggled

### Programmatic Control

```typescript
import { setCompact, isCompact } from "@/lib/compactToggle";

// Enable compact mode
setCompact(true);

// Check current state
const isCurrentlyCompact = isCompact();
```

## Implementation Details

### CSS Variables

The compact mode uses CSS custom properties defined in `src/index.css`:

```css
:root {
  --tp-scale: 1; /* default */
  --tp-font-body: 0.95rem; /* ~15px */
  --tp-leading: 1.55; /* comfy */
  --tp-card-pad: 1rem;
  --tp-icon: 1rem;
  --tp-h3: 1rem;
  --tp-grid-gap: 1rem; /* default grid gap */
  --tp-card-radius: 0.75rem; /* default border radius */
}

.ui-compact {
  --tp-scale: 0.68; /* shrink containers/padding/icons by 40% */
  --tp-font-body: 1rem; /* ~16px body for readability */
  --tp-leading: 1.6;
  --tp-card-pad: 0.6rem; /* reduced from 0.75rem */
  --tp-icon: 0.8rem; /* reduced from 0.9rem */
  --tp-h3: 0.9rem; /* reduced from 0.95rem */
  --tp-grid-gap: 0.6rem; /* reduced grid gap */
  --tp-card-radius: 0.5rem; /* smaller border radius */
}
```

### Tailwind Utilities

- `.tp-scale` - Applies transform scale to containers (40% reduction)
- `.tp-body` - Applies font-size and line-height for body text
- `.tp-pad` - Applies padding using CSS variable
- `.tp-icon` - Applies icon sizing
- `.tp-h3` - Applies heading sizing
- `.tp-gap` - Applies grid gap spacing
- `.tp-radius` - Applies border radius

### Components Updated

- **App.tsx** - Wrapped with `tp-scale` and `tp-body` classes
- **NewsCard.tsx** - Added `tp-pad` to content section, `tp-h3` to titles, `tp-radius` to cards
- **SummaryPage.tsx** - Added `tp-body` to main content, `tp-h3` to headings
- **TechDigestSection.tsx** - Added `tp-gap` to grid containers
- **TopNavigation.tsx** - Added `tp-pad` to container, `tp-body` to text
- **BottomNavigation.tsx** - Added `tp-pad`, `tp-body`, `tp-icon` and proper z-index

## Reverting Changes

To disable compact mode:

1. Press `Alt + Shift + U` again, or
2. Call `setCompact(false)`, or
3. Remove the `ui-compact` class from the `<body>` element

## localStorage Key

The compact mode state is stored in localStorage under the key: `tp:ui:compact`

## Benefits

- **Reversible**: Easy to toggle on/off without code changes
- **Non-destructive**: Uses additive CSS classes that don't break existing styles
- **Consistent**: Applied globally through CSS variables
- **Accessible**: Maintains readability while reducing visual density by 40%
- **Fixed Navigation**: Bottom navigation is properly locked with z-index
