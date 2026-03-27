# Context-Compressor Design System

This document outlines the visual identity and technical implementation of the design system used in **Context-Compressor**. The goal is to provide a comprehensive guide for regenerating this high-fidelity, premium aesthetic in other web applications.

---

## 🎨 1. Color Palette

The design sits on a sophisticated, multi-layered dark foundation with vibrant accents for clarity and brand identity.

| Feature       | Variable | Hex Value  | Usage                                     |
| :------------ | :------- | :--------- | :---------------------------------------- |
| **Background**| `--bg`   | `#020617`  | Deepest night blue. Core background.      |
| **Foreground**| `--fg`   | `#F8FAFC`  | Off-white for body text.                  |
| **Slate**     | `--slate`| `#94A3B8`  | Secondary/Muted text and subtle borders.  |
| **Primary**   | `--indigo`| `#6366F1` | Core brand color (Compression icons/btns).|
| **Secondary** | `--sky`   | `#0EA5E9` | Recognition color (Decompression, result).|
| **Success**   | `--emerald`| `#10B981`| Savings percentages and active indicators.|
| **Alert**     | `--amber` | `#F59E0B` | Critical info and focus-attention cards.  |

---

## 🏗️ 2. Background & Surface

The application avoids flat surfaces, using multiple layers of depth.

### Grid Foundation
A low-contrast grid creates a "technical blueprint" feel.
```css
.bg-grid {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
```

### Glass Houses
Standard containers use a "Glassmorphic" look with a subtle blur and translucent border to define space without losing the background context.
```css
.glass {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

## ⚡ 3. Interactions & Motion

The "premium" feel is achieved through motion that follows the user's intent.

### Entrance Animations
The main workspace slide-in should be directional.
- **Desktop**: Components slide from sides to meet in the middle (`x` offset).
- **Mobile**: Staggered vertical fade-up (`y` offset) provides a more cohesive arrival.

### Haptic Feedback
Technical applications benefit from tactile confirmation of success/failure.
- **Success**: Two quick, distinct vibrations.
- **Error**: Three sharp, intense pulses.
- **Selection**: A single, virtually imperceptible "nudge" (tap).

### Micro-Interactions
Every interactive element has a response:
- **Buttons**: Scale down slightly on `active` (e.g., `scale: 0.95`).
- **Cards**: Hover events triggers subtle scaling and shadow expansion.

---

## 🧩 4. Component Patterns

### Editor Glass Panels
Textareas are wrapped in darker, inset surfaces.
- **Shadow**: `inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)` gives it a "carved out" look from the board.

### Status Indicators
- Use a **Pulsing Emerald Glow** for "Live" or "Ready" statuses to show life in the application.
- Use **Tooltips with Absolute Positioning** to provide deep technical context without cluttering the screen.

### Author Peeks (Credit Style)
Custom cursor peeking for credits provides a surprising delightful moment. 
- Use `framer-motion` to track `window.mousemove` and display a floating `AnimatePresence` card tied to the anchor's `onMouseEnter`.

---

## 📱 5. Responsive Strategy

The design follows a "Context-Aware" layout.
- **Desktop**: Side-by-side workspace allows comparison. Action buttons float in the center.
- **Tablet**: Layout maintains 2 columns, but floating elements might stack.
- **Mobile**: Full vertical stack. Control buttons are consolidated into a high-visibility row with text labels (replaces tooltips).

---

## 💡 6. Design Principles
1. **Never use generic Blue/Red**: Use curated, technical tones like Slate-900 or Indigo-600.
2. **Technical Brutalism meets Glassmorphism**: High-contrast mono fonts inside elegant, blurred surfaces.
3. **Don't hide complexity, optimize it**: Large JSON views are given space, formatted with monochrome themes.
