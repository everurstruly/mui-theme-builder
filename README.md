# MUI Theme Builder 

A modern visual editor for customizing MUI components with Material and iOS design. 

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Why This Exists

Existing MUI theme builders are well-built and functional, but there were a few gaps I wanted to fill:
- **Simultaneous light/dark theming**: Most tools make you switch modes to preview - I wanted to design both side-by-side
- **Code editor access**: Working directly with the theme object felt missing
- **Modern aesthetics**: Prove that MUI can look elegant in dev tools, not just production apps

This isn't about replacing what's out there - those projects are solid, senior-level work with great docs and optimization. This is about exploring a different approach to the same problem.

## What Makes This Different

### 1. Simultaneous Light & Dark Mode
Design and preview both color schemes side-by-side. Export independent configurations for each mode - not just a `palette.mode` toggle.

### 2. Real Export Flexibility
- **ThemeOptions only** or **full Theme object**
- **TypeScript**, **JavaScript**, or **JSON**
- Clean, copy-paste ready code

### 3. Code Editor Integration
Direct access to the theme object. Write custom overrides in TypeScript with full autocomplete. No more guessing at deeply nested paths.

### 4. Design Presets You'd Love
- **Material Design** (default MUI)
- **iOS Design** (proper HIG-inspired preset, not liquid glass garbage)
- Clean foundation to build from

### 5. Modern, Intuitive Interface
Proves MUI can be used to build beautiful tools, not just boring enterprise dashboards. Clean panels, smooth interactions, real-time previews on actual components.


## Credits & Inspiration

This editor's design was inspired by:
- **MUI Theme Creator** - Code optimization inspiration and more 
- **Shadcn/ui** - Made me realize I like to prototype themes remotely and visually
- **AntDesign** - Polished editor design experience
- **Figma** - Best-in-class design editor UX

Started as a potential PR to existing projects, but the vision diverged enough to warrant building it separately.

## License

MIT - Build whatever you want with this.
