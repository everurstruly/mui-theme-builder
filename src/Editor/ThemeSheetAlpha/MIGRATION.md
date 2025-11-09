# 🔄 Migration from Workfile to ThemeSheet

This document outlines the migration from the old `Workfile` system to the new `ThemeSheet` module.

---

## ✅ Migration Complete

All editor components have been successfully migrated to use the new ThemeSheet system.

---

## 📝 What Changed

### State Management

**Before (Workfile)**:
```tsx
import useWorkfileStore from "../Workfile/useWorkfileStore";

const { activePreviewId, selectPreview } = useWorkfileStore();
const theme = useWorkfileHydratedTheme();
```

**After (ThemeSheet)**:
```tsx
import { useThemeSheetStore, resolveThemeOptionsForPreview } from "../ThemeSheet";
import { createTheme } from "@mui/material/styles";

const activePreviewId = useThemeSheetStore((state) => state.activePreviewId);
const selectPreview = useThemeSheetStore((state) => state.selectPreview);

const themeOptions = resolveThemeOptionsForPreview();
const theme = createTheme(themeOptions);
```

### Theme Modifications

**Before (Workfile)**:
```tsx
const workfileTheme = useWorkfileStore((s) => s.themeModifications);
const updateTheme = useWorkfileStore((s) => s.setThemeModifications);

// Update entire theme object
updateTheme({
  ...workfileTheme,
  palette: {
    ...workfileTheme?.palette,
    mode: "dark",
  },
});
```

**After (ThemeSheet)**:
```tsx
import { useThemeSheetEditValue } from "../ThemeSheet";

const { value: mode, setValue } = useThemeSheetEditValue("palette.mode");

// Update specific path
setValue("dark");
```

### History (Undo/Redo)

**Before (Workfile)**:
```tsx
const temporalState = useWorkfileStore.temporal.getState();
temporalState.undo();
temporalState.redo();
```

**After (ThemeSheet)** - Same API!:
```tsx
const temporalState = useThemeSheetStore.temporal.getState();
temporalState.undo();
temporalState.redo();

// Check if can undo/redo
const canUndo = useThemeSheetStore.temporal.getState().pastStates.length > 0;
const canRedo = useThemeSheetStore.temporal.getState().futureStates.length > 0;
```

---

## 🔄 Updated Files

### Core Components
1. ✅ **Canvas.tsx** - Updated to use `resolveThemeOptionsForPreview()` and `createTheme()`
2. ✅ **SampleCanvasObjectsTree.tsx** - Updated to use `selectPreview` from ThemeSheet
3. ✅ **MuiComponentsTree.tsx** - Updated to use `selectPreview` from ThemeSheet

### Properties Panel
4. ✅ **ColorSchemeToggle.tsx** - Migrated to use `useThemeSheetEditValue` hook with path-based updates

### Toolbar
5. ✅ **ChangesHistoryActions.tsx** - Updated to use Zundo temporal API with proper undo/redo

---

## 🎯 Key Improvements

### 1. **Path-Based Modifications**
Instead of updating entire theme objects, modifications are now path-based:
```tsx
// Old: manual deep merge
updateTheme({ ...theme, palette: { ...theme.palette, mode: 'dark' } });

// New: direct path update
setValue('dark'); // for path 'palette.mode'
```

### 2. **Automatic UI Disabling**
Controls automatically disable when a path is controlled by a function:
```tsx
const { value, setValue, isControlledByFunction } = useThemeSheetEditValue('palette.primary.main');

<input 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
  disabled={isControlledByFunction} // ← Automatic!
/>
```

### 3. **Separate Literals and Functions**
Functions are stored as strings and evaluated safely:
```tsx
// Literal modifications (safe, serializable)
resolvedThemeOptionsModifications.literals = {
  'palette.primary.main': '#ff0000'
};

// Function modifications (stored as strings)
resolvedThemeOptionsModifications.functions = {
  'palette.primary.contrast': 't => t.palette.getContrastText(t.palette.primary.main)'
};
```

### 4. **Two Resolution Modes**
- **'failsafe'** (preview): Safe evaluation with fallbacks
- **'raw'** (export): Strict evaluation, throws on errors

```tsx
// For live preview (safe)
const previewTheme = resolveThemeOptionsForPreview();

// For export (strict)
const exportTheme = resolveThemeOptionsForExport();
```

### 5. **Transient Raw Buffer**
Live edits go into a transient buffer that doesn't trigger history:
```tsx
// Typing in UI updates raw buffer (no history)
setValue('#ff0000');

// Commit when ready (creates history snapshot)
store.commitRawModifications();

// Or discard uncommitted changes
store.discardChanges();
```

---

## 🚀 New Features Available

### Base Theme Switching
```tsx
import { listBaseThemeIds, useThemeSheetStore } from "../ThemeSheet";

const themes = listBaseThemeIds(); // ['default', 'dark', 'ios', 'material3']
store.setActiveBaseTheme({ type: 'static', ref: 'dark' });
```

### Composables (Theme Presets)
```tsx
import { listComposables, useThemeSheetStore } from "../ThemeSheet";

const composables = listComposables();
store.toggleComposable('dense-spacing', true);
```

### Export with Validation
```tsx
import { resolveThemeOptionsForExport } from "../ThemeSheet";

try {
  const theme = resolveThemeOptionsForExport(); // Throws if invalid
  console.log(JSON.stringify(theme, null, 2));
} catch (error) {
  alert('Theme has errors. Please fix before exporting.');
}
```

---

## 🗂️ Old vs New Structure

### State Structure Comparison

**Old Workfile State**:
```typescript
{
  themeModifications?: ThemeOptions;           // Entire theme object
  themeFunctionsModification: Record<string, string>;
  activePreviewId: string;
}
```

**New ThemeSheet State**:
```typescript
{
  activeBaseThemeOption: BaseThemeReference;
  appearanceComposablesState: Record<string, { enabled: boolean }>;
  resolvedThemeOptionsModifications: {
    literals: Record<string, SerializableValue>;
    functions: Record<string, string>;
  };
  rawThemeOptionsModifications: Record<string, RawThemeModification>; // Transient
  isDirty: boolean;
  activePreviewId: string;
}
```

### Benefits of New Structure
1. ✅ **Granular modifications** - Path-based instead of whole objects
2. ✅ **Better history** - Only tracks committed changes
3. ✅ **Clearer separation** - Literals vs functions
4. ✅ **Live preview buffer** - Raw modifications don't pollute history
5. ✅ **Base themes** - Switch between preset starting points
6. ✅ **Composables** - Toggle reusable modifications

---

## 🔒 Breaking Changes

### 1. Theme Access
❌ **Removed**: Direct access to `themeModifications` object  
✅ **Use instead**: `resolveThemeOptionsForPreview()` or path-based `useThemeSheetEditValue`

### 2. Theme Updates
❌ **Removed**: `setThemeModifications(themeObject)`  
✅ **Use instead**: `useThemeSheetEditValue(path).setValue(value)` or `setRawModificationAtPath(path, value)`

### 3. Functions
❌ **Removed**: Direct function assignment in theme object  
✅ **Use instead**: Store as strings in `functions` map, evaluated during resolution

---

## 📦 Deprecated Files

The following files from the old Workfile system are now deprecated:

- `Workfile/useWorkfileStore.ts` → Use `ThemeSheet/stores/themeWorkspace.store.ts`
- `Workfile/useWorkfileHydratedTheme.ts` → Use `resolveThemeOptionsForPreview()` + `createTheme()`
- `Workfile/useWorkfileHistory.ts` → Use `useThemeSheetStore.temporal` directly

**Note**: These files can be safely deleted after confirming no external dependencies.

---

## 🧪 Testing the Migration

### 1. Preview Selection
```tsx
// Should work: selecting previews in tree
selectPreview('DashboardExample');
```

### 2. Theme Modifications
```tsx
// Should work: toggling color mode
const { setValue } = useThemeSheetEditValue('palette.mode');
setValue('dark');
```

### 3. Undo/Redo
```tsx
// Should work: undo/redo history
useThemeSheetStore.temporal.getState().undo();
useThemeSheetStore.temporal.getState().redo();
```

### 4. Live Preview
```tsx
// Should work: canvas updates immediately on modification
const { setValue } = useThemeSheetEditValue('palette.primary.main');
setValue('#ff0000'); // Canvas should update instantly
```

---

## 💡 Migration Tips

1. **Search and Replace**: Use your IDE to find and replace:
   - `useWorkfileStore` → `useThemeSheetStore`
   - `useWorkfileHydratedTheme` → `resolveThemeOptionsForPreview`
   - `from "../Workfile/` → `from "../ThemeSheet/`

2. **Check Theme Access**: Look for any direct theme object access and convert to path-based

3. **Test Undo/Redo**: Ensure history tracking works after migration

4. **Verify Preview**: Confirm canvas updates reflect theme changes

---

## 📞 Support

If you encounter issues:
1. Check `ThemeSheet/README.md` for API documentation
2. Review `ThemeSheet/example.tsx` for usage patterns
3. Run `ThemeSheet/tests.ts` to validate system integrity

---

**Migration completed successfully! 🎉**  
The editor now uses the modern ThemeSheet architecture with improved state management, better history tracking, and a cleaner API.
