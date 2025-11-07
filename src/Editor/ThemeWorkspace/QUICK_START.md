# 🚀 ThemeWorkspace Quick Start

Get started with ThemeWorkspace in **5 minutes**.

---

## Step 1: Import the Module

```tsx
import {
  ThemePreviewPane,
  useThemeValue,
  useThemeWorkspaceStore,
} from '@/Editor/ThemeWorkspace';
```

---

## Step 2: Wrap Your Preview Area

```tsx
function App() {
  return (
    <ThemePreviewPane>
      <YourThemedComponents />
    </ThemePreviewPane>
  );
}
```

That's it! Your components are now using the theme from ThemeWorkspace.

---

## Step 3: Create a Color Picker

```tsx
function ColorPicker() {
  const { value, setValue, isControlledByFunction } = useThemeValue('palette.primary.main');

  return (
    <input
      type="color"
      value={value || '#1976d2'}
      onChange={(e) => setValue(e.target.value)}
      disabled={isControlledByFunction} // ← Auto-disables if function controls this
    />
  );
}
```

**Key feature**: The input automatically disables if the path is controlled by a function string!

---

## Step 4: Add Save/Discard Buttons

```tsx
function SaveControls() {
  const store = useThemeWorkspaceStore();

  return (
    <>
      <button
        onClick={() => store.commitRawModifications()}
        disabled={!store.isDirty}
      >
        💾 Save Changes
      </button>

      <button
        onClick={() => store.discardChanges()}
        disabled={!store.isDirty}
      >
        🗑️ Discard
      </button>

      {store.isDirty && <span>⚠️ Unsaved changes</span>}
    </>
  );
}
```

---

## Step 5: Add Undo/Redo Buttons

```tsx
import { useThemeHistory } from '@/Editor/ThemeWorkspace';

function HistoryControls() {
  const { undo, redo, canUndo, canRedo, historySize } = useThemeHistory();

  return (
    <>
      <button onClick={() => undo()} disabled={!canUndo}>
        ↶ Undo
      </button>

      <button onClick={() => redo()} disabled={!canRedo}>
        ↷ Redo
      </button>

      <span>{historySize} changes</span>
    </>
  );
}
```

---

## Step 6: Add Base Theme Selector (Optional)

```tsx
import { listBaseThemeIds } from '@/Editor/ThemeWorkspace';

function ThemeSwitcher() {
  const store = useThemeWorkspaceStore();
  const themes = listBaseThemeIds(); // ['default', 'dark', 'ios', 'material3']

  return (
    <select
      value={store.activeBaseThemeOption.ref}
      onChange={(e) => store.setActiveBaseTheme({ type: 'static', ref: e.target.value })}
    >
      {themes.map(id => <option key={id} value={id}>{id}</option>)}
    </select>
  );
}
```

---

## 🎉 You're Done!

Your theme editor is now functional with:
- ✅ Live preview
- ✅ Undo/redo (with `useThemeHistory` hook)
- ✅ Save/discard workflow
- ✅ Auto-disable for function-controlled paths

---

## 🔥 Advanced: Add Monaco Editor for Functions

```tsx
import Editor from '@monaco-editor/react';

function FunctionEditor() {
  const store = useThemeWorkspaceStore();
  const [code, setCode] = useState('');

  const handleSave = () => {
    // Parse the code string and update store
    store.setRawModificationAtPath('palette.primary.main', code);
  };

  return (
    <>
      <Editor
        height="400px"
        language="typescript"
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
      />
      <button onClick={handleSave}>Apply Function</button>
    </>
  );
}
```

---

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed API documentation
- Check out [example.tsx](./example.tsx) for a complete working demo
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Run [tests.ts](./tests.ts) to validate behavior

---

## 🆘 Common Issues

### Issue: UI controls not disabling for functions
**Solution**: Ensure you're using the `isControlledByFunction` flag from `useThemeValue`:
```tsx
const { isControlledByFunction } = useThemeValue(path);
<input disabled={isControlledByFunction} />
```

### Issue: Changes not appearing in preview
**Solution**: Make sure your components are wrapped in `<ThemePreviewPane>`:
```tsx
<ThemePreviewPane>
  <YourComponents />
</ThemePreviewPane>
```

### Issue: Undo/redo not working
**Solution**: Make sure you're calling `commitRawModifications()` after edits:
```tsx
store.commitRawModifications(); // Creates history snapshot
```

---

## 💡 Pro Tips

1. **Debounce rapid changes**:
   ```tsx
   const debouncedSetValue = useMemo(
     () => debounce((val) => setValue(val), 300),
     [setValue]
   );
   ```

2. **Persist to localStorage**:
   ```tsx
   useEffect(() => {
     const state = useThemeWorkspaceStore.getState();
     localStorage.setItem('theme', JSON.stringify({
       activeBaseThemeOption: state.activeBaseThemeOption,
       resolvedThemeOptionsModifications: state.resolvedThemeOptionsModifications,
     }));
   }, [/* subscribe to store changes */]);
   ```

3. **Export theme as JSON**:
   ```tsx
   import { resolveThemeOptionsForExport } from '@/Editor/ThemeWorkspace';
   
   const exportTheme = () => {
     const themeOptions = resolveThemeOptionsForExport();
     const json = JSON.stringify(themeOptions, null, 2);
     downloadFile('theme.json', json);
   };
   ```

---

**Ready to build amazing theme editors!** 🎨✨
