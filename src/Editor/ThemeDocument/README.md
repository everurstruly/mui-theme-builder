# ThemeDocument

A complete MUI theme editing system with multi-layer architecture, undo/redo support, and performance-optimized React hooks.

## Architecture

### Mental Model

**ThemeDocument = Template + Base Modifications + Color Scheme Modifications**

- **Template** = Provides complete theme with full palette for each color scheme
- **Base Layer** = Color-independent modifications (typography, spacing, shape, etc.) that apply to both light and dark
- **Color Scheme Layer** = Palette and shadows only - separate for light and dark

### Layer Hierarchy

Modifications are applied in this order (later layers override earlier ones):

```
1. Template (provides complete theme with full palette for color scheme)
   ↓
2. Composables (toggleable presets like "Dense spacing", "High contrast")
   ↓
3. Base Visual Edits (typography, spacing, shape - apply to both light & dark)
   ↓
4. Color Scheme Visual Edits (palette, shadows - separate for light & dark)
   ↓
5. Code Overrides (global - can override ANY path including palette - highest priority)
```

**Note**: Code overrides are global and apply across both light and dark modes. You can write mode-aware code like:

```javascript
{
  typography: { fontSize: 16 },
  palette: {
    primary: {
      main: theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'
    }
  }
}
```

### Path Scoping

- **Color-scheme-specific paths**: `palette.*`, `shadows`
  - Stored separately for light and dark mode
  - User can customize light and dark palettes independently
  - Each template provides complete default palettes via MUI's `createTheme()`
  
- **Base paths**: Everything else (`typography`, `spacing`, `shape`, `breakpoints`, `components`, etc.)
  - Single value applies to both light and dark mode
  - Inheritance: dark mode inherits all base properties from light mode
  - Only palette and shadows differ between schemes

### Why This Design?

**Before (Global + Color Schemes):**
- Typography stored twice (once in global, duplicated in light/dark)
- Confusing: "Should I edit this globally or in light mode?"
- More storage, more duplication

**After (Base + Color Schemes):**
- Typography stored once in base layer ✅
- Clear: "Base for color-independent, Color Scheme for palette only" ✅
- Matches designer mental model: "Dark mode is just a palette swap" ✅
- Less storage, no duplication ✅

## Usage

### Basic Theme Preview

```typescript
import { useThemeDocumentTheme } from '@/Editor/ThemeDocument';
import { ThemeProvider } from '@mui/material/styles';

function PreviewPane() {
  const theme = useThemeDocumentTheme('light');
  
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Color Picker Control

```typescript
import { useThemeDocumentEditValue } from '@/Editor/ThemeDocument';

function PrimaryColorPicker() {
  const {
    value,
    hasCodeOverride,
    hasVisualEdit,
    isModified,
    setValue,
    reset,
  } = useThemeDocumentEditValue('palette.primary.main');

  return (
    <div>
      <input
        type="color"
        value={value || '#1976d2'}
        onChange={(e) => setValue(e.target.value)}
        disabled={hasCodeOverride}
      />
      
      {hasCodeOverride && (
        <Badge color="warning">Overridden in code</Badge>
      )}
      
      {hasVisualEdit && !hasCodeOverride && (
        <Badge color="info">Modified</Badge>
      )}
      
      {isModified && (
        <Button onClick={reset} size="small">
          Reset
        </Button>
      )}
    </div>
  );
}
```

### Code Editor Panel

```typescript
import { useState } from 'react';
import { useCodeEditorPanel } from '@/Editor/ThemeDocument';
import MonacoEditor from '@monaco-editor/react';

function CodeEditorPanel() {
  const {
    source,
    error,
    hasOverrides,
    mergedPreview,
    applyChanges,
    clearOverrides,
    resetToVisual,
    resetToTemplate,
  } = useCodeEditorPanel('current-scheme');

  const [editorContent, setEditorContent] = useState(source);

  return (
    <div>
      <MonacoEditor
        language="typescript"
        value={editorContent}
        onChange={(value) => setEditorContent(value || '')}
        height="400px"
      />
      
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      
      <ButtonGroup>
        <Button onClick={() => applyChanges(editorContent)}>
          Apply Changes
        </Button>
        <Button onClick={clearOverrides} disabled={!hasOverrides}>
          Clear Overrides
        </Button>
        <Button onClick={resetToVisual}>
          Reset to Visual
        </Button>
        <Button onClick={resetToTemplate} color="error">
          Reset to Template
        </Button>
      </ButtonGroup>
      
      <DiffViewer
        before={JSON.stringify(mergedPreview, null, 2)}
        after={editorContent}
      />
    </div>
  );
}
```

### Template Switching

```typescript
import { useThemeDocumentStore } from '@/Editor/ThemeDocument';

function TemplateSelector() {
  const switchTemplate = useThemeDocumentStore((s) => s.switchTemplate);
  const currentTemplate = useThemeDocumentStore((s) => s.selectedTemplateId);

  const handleSwitch = (newTemplateId: string) => {
    const confirmed = window.confirm(
      'Switch template? Your modifications will be preserved and reapplied.'
    );
    
    if (confirmed) {
      switchTemplate(
        { type: 'builtin', id: newTemplateId },
        true // keepEdits
      );
    }
  };

  return (
    <Select value={currentTemplate.id} onChange={(e) => handleSwitch(e.target.value)}>
      <MenuItem value="material">Material Design</MenuItem>
      <MenuItem value="fluent">Fluent</MenuItem>
      <MenuItem value="custom">Custom</MenuItem>
    </Select>
  );
}
```

### Composables (Presets)

```typescript
import { useThemeDocumentStore } from '@/Editor/ThemeDocument';

function ComposablesPanel() {
  const enabledComposables = useThemeDocumentStore((s) => s.enabledComposables);
  const toggleComposable = useThemeDocumentStore((s) => s.toggleComposable);

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={enabledComposables['dense-spacing'] || false}
            onChange={(e) => toggleComposable('dense-spacing', e.target.checked)}
          />
        }
        label="Dense Spacing"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={enabledComposables['high-contrast'] || false}
            onChange={(e) => toggleComposable('high-contrast', e.target.checked)}
          />
        }
        label="High Contrast"
      />
    </div>
  );
}
```

## Performance

### Target: <100ms for theme updates

Optimizations:
- **Targeted Zustand selectors**: UI controls only subscribe to their specific path
- **Memoized theme resolution**: `createTheme()` only runs when layers actually change
- **Flat storage**: Visual edits stored as `Record<string, SerializableValue>` for O(1) lookups
- **Code evaluation once**: Code overrides evaluated on "Apply", not on every keystroke
- **Flattened code overrides**: Quick path lookup to detect overrides (no deep object traversal)

### Hook Performance Characteristics

- **`useThemeDocumentEditValue(path)`**: O(1) - flat object lookup, no theme computation
- **`useThemeDocumentTheme()`**: O(n) where n = number of layers, memoized
- **`useCodeEditorPanel()`**: O(1) for state access, O(n) for preview computation (memoized)

## Undo/Redo

Powered by [zundo](https://github.com/charkour/zundo):

```typescript
import { useThemeDocumentStore } from '@/Editor/ThemeDocument';
import { temporal } from 'zundo';

function HistoryControls() {
  const { undo, redo, pastStates, futureStates } = temporal.useTemporalStore(
    (state) => state
  );

  return (
    <ButtonGroup>
      <Button onClick={undo} disabled={pastStates.length === 0}>
        Undo
      </Button>
      <Button onClick={redo} disabled={futureStates.length === 0}>
        Redo
      </Button>
    </ButtonGroup>
  );
}
```

**What's tracked:**
- Template switches
- Composable toggles
- Visual edits (UI controls)
- Code override applications (on "Apply", not during typing)

**What's NOT tracked:**
- UI state (active color scheme, selected preview)
- Monaco editor typing (handled by Monaco's internal undo)

## Code Editor

### Syntax

Users write standard JavaScript/TypeScript:

```typescript
{
  palette: {
    primary: {
      main: '#ff0000',
      dark: '#cc0000',
      light: '#ff3333',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    fontSize: 16
  }
}
```

### Evaluation

- Uses `new Function()` for safe evaluation (no closure scope access)
- Validates result is an object
- Flattens result for quick path lookups
- Errors shown in UI (non-blocking)

### When to Apply

- **Manual**: User clicks "Apply" button
- **Auto-save**: Optional (implement with debounce if desired)

## Implementation Notes

### TODO: Template Loading

You need to implement:

```typescript
function getTemplate(templateId: string, colorScheme: 'light' | 'dark'): ThemeOptions {
  // Load template by ID and return ThemeOptions for color scheme
}
```

### TODO: Composable Loading

You need to implement:

```typescript
function getComposableOptions(composableId: string, colorScheme: 'light' | 'dark'): ThemeOptions {
  // Load composable by ID and return ThemeOptions for color scheme
}
```

These are placeholders in `themeDocument.hooks.ts` - replace with your actual template/composable system.

## File Structure

```
ThemeDocument/
├── types.ts                    # TypeScript types
├── themeDocument.store.ts      # Zustand store with temporal middleware
├── themeDocument.resolver.ts   # Pure layer merge logic
├── themeDocument.utils.ts      # Utility functions
├── themeDocument.hooks.ts      # React hooks
├── index.ts                    # Public API exports
└── README.md                   # This file
```

## FAQ

**Q: Why separate visual edits from code overrides?**  
A: Visual edits are serializable (can be saved, versioned, shared). Code overrides may contain functions and are an "escape hatch" for advanced users.

**Q: Why route paths to global vs color-scheme-specific storage?**  
A: Some properties (typography, spacing) should be consistent across light/dark modes. Others (palette, shadows) need independent customization per mode.

**Q: Why evaluate code on "Apply" instead of live?**  
A: Parsing/evaluating on every keystroke is expensive and may cause errors during incomplete typing. Explicit "Apply" gives users control.

**Q: Can I disable code overrides entirely?**  
A: Yes - just don't render the code editor panel. The store still supports it, but users won't see it.

**Q: How do I export a theme?**  
A: Use `useThemeDocumentTheme()` to get the final Theme object, or use `resolveThemeOptions()` to get ThemeOptions. Serialize to JSON or TypeScript code.

## License

Part of mui-theme-builder project.
