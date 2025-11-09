# ThemeSheet

A powerful, flat-structure theme management system for Material-UI (MUI) applications.

## Overview

ThemeSheet combines the best aspects of two design iterations:
- **Alpha's superior flat structure + resolver strategy** for granular control and easy state management
- **V2's clearer naming conventions** (using `themeOptions`, `themeTemplate`, etc. instead of ambiguous names)

## Key Features

✅ **Flat Storage Architecture** - Store theme values as `"palette.primary.main": "#1976d2"` for easy updates  
✅ **Granular Control** - Update individual properties without complex deep merging  
✅ **Path-Based Access** - Direct targeting of any theme value via dot-notation strings  
✅ **Undo/Redo Support** - Built-in history tracking with Zustand's temporal middleware  
✅ **Live Preview** - Separate edit buffer for real-time changes before committing  
✅ **Function Support** - Store dynamic theme values as function strings  
✅ **Performance Optimized** - Caching layer to avoid redundant theme resolution  
✅ **TypeScript First** - Full type safety throughout the API  

## Architecture

### Storage Strategy

ThemeSheet uses a **flat structure** for storing theme modifications, then **resolves** them to nested `ThemeOptions` for MUI consumption:

```typescript
// Storage format (flat)
{
  literals: {
    "palette.primary.main": "#1976d2",
    "typography.fontSize": 14,
    "spacing": 8
  },
  functions: {
    "palette.primary.dark": "(theme) => theme.palette.primary.main"
  }
}

// Runtime (resolved to nested ThemeOptions)
{
  palette: { 
    primary: { 
      main: "#1976d2",
      dark: "#115293" // evaluated from function
    } 
  },
  typography: { fontSize: 14 },
  spacing: 8
}
```

### State Layers

ThemeSheet resolves themes in layers:

1. **Theme Template** - Base starting point (e.g., Material, iOS, Material 3)
2. **Theme Presets** - Toggleable modifications (e.g., Dense Spacing, Rounded Corners)
3. **User Literals** - Flat storage of serializable values
4. **User Functions** - Flat storage of dynamic values (hydrated at runtime)

### Persistent vs Transient State

- **`flatThemeOptions`** - Committed user edits (history-tracked, persistent)
- **`editBuffer`** - Live preview changes (transient, not history-tracked)
- **`hasUnsavedEdits`** - Flag indicating if buffer differs from flat storage

## Quick Start

### Basic Usage

```tsx
import { useThemeSheetTheme, useThemeSheetValue } from '@/Editor/ThemeSheet';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  // Get the fully resolved MUI theme
  const theme = useThemeSheetTheme();
  
  return (
    <ThemeProvider theme={theme}>
      <YourComponents />
    </ThemeProvider>
  );
}

function ColorPicker() {
  const { value, setValue, isControlledByFunction } = 
    useThemeSheetValue('palette.primary.main');
  
  if (isControlledByFunction) {
    return <div>This color is controlled by a function</div>;
  }
  
  return (
    <input
      type="color"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Store Actions

```tsx
import { useThemeSheetStore } from '@/Editor/ThemeSheet';

function ThemeEditor() {
  const store = useThemeSheetStore();
  
  // Live editing (no history trigger)
  store.setEditValue('palette.primary.main', '#ff0000');
  
  // Commit changes (triggers history)
  store.commitEdits();
  
  // Discard unsaved changes
  store.discardEdits();
  
  // Select a theme template
  store.selectThemeTemplate({ type: 'static', id: 'material3' });
  
  // Toggle a preset
  store.togglePreset('dense-spacing', true);
  
  // Change color scheme
  store.setColorScheme('dark');
}
```

### Undo/Redo

```tsx
import { useThemeSheetStore } from '@/Editor/ThemeSheet';
import { useTemporalStore } from 'zundo';

function UndoRedoButtons() {
  const { undo, redo, futureStates, pastStates } = useTemporalStore(
    useThemeSheetStore
  );
  
  return (
    <>
      <button onClick={undo} disabled={pastStates.length === 0}>
        Undo
      </button>
      <button onClick={redo} disabled={futureStates.length === 0}>
        Redo
      </button>
    </>
  );
}
```

## API Reference

### Hooks

#### `useThemeSheetTheme()`
Returns a fully resolved MUI `Theme` instance for use with `ThemeProvider`.

```tsx
const theme = useThemeSheetTheme();
```

#### `useThemeSheetOptions(mode?)`
Returns resolved `ThemeOptions` (before `createTheme`). Useful for code editors and export.

```tsx
const themeOptions = useThemeSheetOptions('strict'); // or 'safe'
```

#### `useThemeSheetValue(path)`
Hook for reading/writing individual theme values at a specific path.

```tsx
const { 
  value,           // Current value (from buffer or committed)
  setValue,        // Update value in edit buffer
  resetValue,      // Remove edit (revert to template)
  isCustomized,    // True if value differs from template
  isControlledByFunction // True if path has a function
} = useThemeSheetValue('palette.primary.main');
```

### Store Actions

```tsx
const store = useThemeSheetStore();

// Edit buffer operations (transient, no history)
store.setEditValue(path, value);      // Set single value
store.removeEditValue(path);           // Remove single value
store.setEditBuffer(buffer);           // Replace entire buffer

// Commit operations (persistent, triggers history)
store.commitEdits();                   // Save buffer to flat storage
store.discardEdits();                  // Reset buffer to flat storage
store.clearAllEdits();                 // Clear all user edits

// Template & presets (triggers history)
store.selectThemeTemplate(ref);        // Select base template
store.togglePreset(id, enabled);       // Toggle preset on/off
store.setColorScheme('light' | 'dark'); // Change color scheme

// Canvas operations (no history)
store.selectPreview(id);               // Select preview component
```

### Utilities

```tsx
import {
  flattenThemeOptions,
  expandFlatThemeOptions,
  splitThemeOptions,
  getNestedValue,
  setNestedValue,
} from '@/Editor/ThemeSheet';

// Flatten nested object to dot-notation
const flat = flattenThemeOptions({ palette: { primary: { main: '#000' } } });
// => { 'palette.primary.main': '#000' }

// Expand flat object to nested
const nested = expandFlatThemeOptions({ 'palette.primary.main': '#000' });
// => { palette: { primary: { main: '#000' } } }

// Split into literals and functions
const { literals, functions } = splitThemeOptions(themeOptions);

// Get/set nested values
const value = getNestedValue(obj, 'palette.primary.main');
setNestedValue(obj, 'palette.primary.main', '#ff0000');
```

## Theme Templates

Built-in templates:
- **material** - Default Material UI theme
- **materialDark** - Material UI with darker backgrounds
- **ios** - Apple iOS-inspired design
- **material3** - Material Design 3 (Material You)

```tsx
import { getThemeTemplate, listThemeTemplateIds } from '@/Editor/ThemeSheet';

const template = getThemeTemplate('material3', 'dark');
const allIds = listThemeTemplateIds();
```

## Theme Presets

Built-in presets:
- **dense-spacing** - Tighter spacing for compact layouts
- **rounded-corners** - Extra rounded corners (16px radius)
- **elevated-surfaces** - Enhanced shadows for depth
- **high-contrast** - High contrast mode for accessibility
- **large-text** - 1.25x larger text for accessibility

```tsx
import { getThemePreset, listThemePresets } from '@/Editor/ThemeSheet';

const preset = getThemePreset('dense-spacing');
const allPresets = listThemePresets();
```

## Why Flat Structure?

### Benefits

1. **Granular Updates** - Change `palette.primary.main` without touching the entire palette
2. **Simple State Management** - No deep object merging logic needed
3. **Path-Based Queries** - Easy to target specific values: `"palette.primary.main"`
4. **Better History** - Track individual property changes, not entire objects
5. **Conflict Resolution** - Clear which specific values changed in collaborative editing

### Trade-offs

- **Conversion Overhead** - Must convert flat ↔ nested (mitigated by caching)
- **Resolver Complexity** - Need utilities to handle flattening/expansion

### Performance Optimization

ThemeSheet uses caching to minimize resolver overhead:

```typescript
// Cached until state changes
const theme1 = resolveThemeOptions(params);
const theme2 = resolveThemeOptions(params); // Returns cached result

// Force cache invalidation
invalidateThemeCache();
```

## Comparison with V2

| Feature | ThemeSheetAlpha | ThemeSheetV2 | **ThemeSheet (New)** |
|---------|-----------------|--------------|----------------------|
| Storage | Flat structure | Nested | **Flat structure** ✅ |
| Naming | Ambiguous terms | Clear terms | **Clear terms** ✅ |
| Updates | O(1) per property | O(d) deep merge | **O(1) per property** ✅ |
| History | Granular | Full snapshots | **Granular** ✅ |
| Conversion | Yes (with cache) | No | **Yes (with cache)** ✅ |
| Complexity | Medium | Low | **Medium** |

## Best Practices

### ✅ Do

- Use `setEditValue` for live updates during user interaction
- Call `commitEdits()` when user confirms changes (e.g., blur, save button)
- Use `discardEdits()` to implement cancel functionality
- Leverage `isControlledByFunction` to disable UI controls for dynamic values

### ❌ Don't

- Don't call `commitEdits()` on every keystroke (use edit buffer instead)
- Don't mutate `flatThemeOptions` directly (use store actions)
- Don't forget to handle `isControlledByFunction` in UI controls

## Migration Guide

### From ThemeSheetAlpha

```diff
- import { useThemeValue } from '@/Editor/ThemeSheetAlpha';
+ import { useThemeSheetValue } from '@/Editor/ThemeSheet';

- const { value, setValue, resetToBase, isOverridden } = useThemeValue(path);
+ const { value, setValue, resetValue, isCustomized } = useThemeSheetValue(path);
```

### From ThemeSheetV2

```diff
- import { useThemeSheet } from '@/Editor/ThemeSheetV2';
+ import { useThemeSheetTheme } from '@/Editor/ThemeSheet';

- const { theme } = useThemeSheet();
+ const theme = useThemeSheetTheme();
```

## Contributing

When adding new features, maintain the flat structure philosophy:
1. Store values as flat paths
2. Resolve to nested structure only when needed
3. Cache resolved results
4. Keep naming clear and unambiguous

## License

Part of the MUI Theme Builder project.
