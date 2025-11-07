# 🎨 ThemeWorkspace Module

**Zero ambiguity. Pure data flow. Functions are strings until resolved.**

---

## 📦 What It Does

ThemeWorkspace is a complete MUI theme management system that:
- ✅ **Keeps all state serializable** (no functions in stores)
- ✅ **Separates literals from functions** (functions stored as strings)
- ✅ **Supports live preview with failsafe mode** (safe evaluation with fallbacks)
- ✅ **Provides undo/redo history** (via `zundo`)
- ✅ **Disables UI controls for function-controlled paths**
- ✅ **Layers theme modifications**: Base → Composables → User Literals → User Functions

---

## 🏗️ Architecture

```
activeBaseThemeOption (immutable)
    ↓
+ appearanceComposables (toggles)
    ↓
+ rawThemeOptionsModifications (transient buffer)
    ↓ commit
+ resolvedThemeOptionsModifications (persistent)
    ↓ resolve
→ ThemeOptions (passed to MUI createTheme)
```

### Key Concepts

| Term | Purpose |
|------|---------|
| `rawThemeOptionsModifications` | **Transient** input buffer (live edits, not persisted) |
| `resolvedThemeOptionsModifications` | **Persistent** committed state (history-tracked) |
| `ResolutionMode` | `'raw'` (strict) or `'failsafe'` (safe preview) |

---

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { ThemePreviewPane, useThemeValue } from './ThemeWorkspace';
import { Button, TextField } from '@mui/material';

function MyApp() {
  return (
    <ThemePreviewPane>
      <Button variant="contained">Themed Button</Button>
      <ColorPicker path="palette.primary.main" />
    </ThemePreviewPane>
  );
}

function ColorPicker({ path }: { path: string }) {
  const { value, setValue, isControlledByFunction } = useThemeValue(path);

  return (
    <TextField
      label="Primary Color"
      value={value || ''}
      onChange={(e) => setValue(e.target.value)}
      disabled={isControlledByFunction} // ← AUTO-DISABLE if function controls this
    />
  );
}
```

### 2. Managing State

```tsx
import { useThemeWorkspaceStore } from './ThemeWorkspace';

function ThemeEditor() {
  const store = useThemeWorkspaceStore();

  const handleCommit = () => {
    store.commitRawModifications(); // Save changes to history
  };

  const handleDiscard = () => {
    store.discardChanges(); // Reset to last committed state
  };

  return (
    <>
      <button onClick={handleCommit} disabled={!store.isDirty}>Save</button>
      <button onClick={handleDiscard} disabled={!store.isDirty}>Discard</button>
    </>
  );
}
```

### 3. Undo/Redo History

```tsx
import { useThemeHistory } from './ThemeWorkspace';

function HistoryControls() {
  const { undo, redo, canUndo, canRedo, historySize, isDirty } = useThemeHistory();

  return (
    <>
      <button onClick={() => undo()} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={() => redo()} disabled={!canRedo}>
        Redo
      </button>
      <span>{historySize} revisions stored</span>
      {isDirty && <span>⚠️ Uncommitted changes</span>}
    </>
  );
}
```

### 4. Switching Base Themes

```tsx
import { useThemeWorkspaceStore, listBaseThemeIds } from './ThemeWorkspace';

function BaseThemeSelector() {
  const store = useThemeWorkspaceStore();
  const themes = listBaseThemeIds(); // ['default', 'dark', 'ios', 'material3']

  return (
    <select
      value={store.activeBaseThemeOption.ref}
      onChange={(e) =>
        store.setActiveBaseTheme({ type: 'static', ref: e.target.value })
      }
    >
      {themes.map((id) => (
        <option key={id} value={id}>{id}</option>
      ))}
    </select>
  );
}
```

### 4. Toggling Composables

```tsx
import { useThemeWorkspaceStore, listComposables } from './ThemeWorkspace';

function ComposablesPanel() {
  const store = useThemeWorkspaceStore();
  const composables = listComposables();

  return (
    <>
      {composables.map((comp) => (
        <label key={comp.id}>
          <input
            type="checkbox"
            checked={store.appearanceComposablesState[comp.id]?.enabled || false}
            onChange={(e) => store.toggleComposable(comp.id, e.target.checked)}
          />
          {comp.label}
        </label>
      ))}
    </>
  );
}
```

---

## 🧪 Resolution Modes

### `'failsafe'` (Preview Mode)
- **Safe evaluation** with fallbacks
- Used in `ThemePreviewPane`
- Catches errors → returns sensible defaults
- Example: invalid function → `#cccccc` for colors

### `'raw'` (Export Mode)
- **Strict evaluation** (throws on errors)
- Used for exporting committed themes
- Ensures valid code before export

```tsx
import { resolveThemeOptionsForExport } from './ThemeWorkspace';
import { createTheme } from '@mui/material/styles';

function exportTheme() {
  try {
    const themeOptions = resolveThemeOptionsForExport(); // ← throws if invalid
    const theme = createTheme(themeOptions);
    console.log(JSON.stringify(theme, null, 2));
  } catch (error) {
    alert('Theme has errors. Please fix before exporting.');
  }
}
```

---

## 📐 Data Flow

### Editing Flow
1. User types in Monaco or UI control
2. → `setRawModificationAtPath(path, value)`
3. → Updates `rawThemeOptionsModifications` (transient)
4. → `isDirty` set to `true`
5. → Preview re-renders (failsafe mode)

### Commit Flow
1. User clicks "Save"
2. → `commitRawModifications()`
3. → `rawThemeOptionsModifications` → split into `literals` + `functions`
4. → Stored in `resolvedThemeOptionsModifications`
5. → History snapshot created (undo/redo)
6. → `isDirty` reset to `false`

---

## 🔐 Security Note

Functions are evaluated using `new Function()` with limited scope. For production:
- Consider sandboxing (Web Workers, VM contexts)
- Validate function strings before execution
- Use CSP headers to mitigate injection risks

---

## ✅ Definition of Done

- [x] `useThemeValue` disables control if path is a function
- [x] Monaco can input functions → stored as strings → UI disables
- [x] Preview uses failsafe mode; export uses raw mode
- [x] Undo/redo excludes `rawThemeOptionsModifications`
- [x] All persistent state (except `raw*`) tracked in history
- [x] Resolver output is valid `ThemeOptions` for MUI

---

## 📂 File Structure

```
ThemeWorkspace/
├── index.ts                      # Public API exports
├── types.ts                      # Core type definitions
├── baseThemes.ts                 # Built-in base themes registry
├── appearanceComposables.ts      # Reusable theme modifications
├── themeOptionsResolver.ts       # Resolution engine (raw/failsafe)
├── stores/
│   └── themeWorkspace.store.ts   # Zustand + Zundo state management
├── hooks/
│   └── useThemeValue.hooks.ts    # Hook for UI controls
├── components/
│   └── ThemePreviewPane.tsx      # Preview wrapper component
└── utils/
    ├── flattenThemeOptions.ts    # Nested → flat conversion
    ├── expandFlatThemeOptions.ts # Flat → nested conversion
    ├── splitThemeOptions.ts      # Literals + functions splitter
    ├── hydrateFunctionsSafely.ts # Function string → executable
    └── objectHelpers.ts          # Dot-notation get/set
```

---

## 🧑‍💻 Advanced Usage

### Custom Composables

```tsx
import { Composable } from './ThemeWorkspace/types';

const myComposable: Composable = {
  id: 'custom-spacing',
  label: 'Custom Spacing',
  value: (base) => ({
    ...base,
    spacing: (base.spacing as number) * 1.5,
  }),
};
```

### Persistence

```tsx
// Save to localStorage
const state = useThemeWorkspaceStore.getState();
localStorage.setItem('theme', JSON.stringify({
  activeBaseThemeOption: state.activeBaseThemeOption,
  appearanceComposablesState: state.appearanceComposablesState,
  resolvedThemeOptionsModifications: state.resolvedThemeOptionsModifications,
}));

// Rehydrate
const saved = JSON.parse(localStorage.getItem('theme') || '{}');
useThemeWorkspaceStore.setState(saved);
```

---

## 🐛 Debugging

```tsx
// Log current resolved theme
import { resolveThemeOptionsForPreview } from './ThemeWorkspace';
console.log(resolveThemeOptionsForPreview());

// Inspect store state
import { useThemeWorkspaceStore } from './ThemeWorkspace';
console.log(useThemeWorkspaceStore.getState());
```

---

**Built with ❤️ using Zustand, Zundo, and MUI**
