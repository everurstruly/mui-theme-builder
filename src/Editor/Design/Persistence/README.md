# Persistence Module

A clean, well-architected persistence layer for theme snapshots with clear boundaries and responsibilities.

## Architecture

- **Pure Zustand Store**: Reactive state without side effects
- **Orchestrator Hook**: Zero-argument `usePersistence()` for save/load operations
- **Registry Pattern**: Simple global registry for dependency injection
- **Serializer/Deserializer**: Command-based deserialization for testability
- **Storage Adapter**: Abstract interface for different storage backends

## Usage

### 1. Initialize Persistence (App Startup)

```tsx
import { PersistenceProvider } from '@/Editor/Design/Persistence';

function App() {
  return (
    <PersistenceProvider>
      <YourApp />
    </PersistenceProvider>
  );
}
```

### 2. Use in Components

```tsx
import { useSave, useLoad } from '@/Editor/Design/Persistence';

function SaveButton() {
  const { save, isSaving, canSave, isDirty } = useSave();

  return (
    <button onClick={() => save()} disabled={!canSave || isSaving}>
      {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
    </button>
  );
}
```

### 3. Title Validation

```tsx
import { useTitleValidation } from '@/Editor/Design/Persistence';

function TitleInput() {
  const { checkTitle, hasConflict, conflict } = useTitleValidation();

  return (
    <input
      onChange={(e) => checkTitle(e.target.value)}
      style={{ borderColor: hasConflict ? 'red' : 'inherit' }}
    />
  );
}
```

## API Reference

### Hooks

- `useSave()` - Save current design with conflict detection
- `useLoad()` - Load design by ID
- `useTitleValidation()` - Proactive title conflict checking
- `usePersistence()` - Low-level orchestrator (advanced use)

### Types

- `ThemeSnapshot` - Complete snapshot format
- `StorageAdapter` - Storage interface to implement
- `EditCommand` - Commands from deserialization
- `PersistenceError` - Typed error format

## Implementation Status

✅ Core implementation complete
⚠️ Needs Edit store changes (checkpoint fields)
⚠️ Needs template registry integration
⚠️ Ready for testing and integration

## Next Steps

1. Add `checkpointHash` and `isDirty` to Edit store
2. Implement template registry for delta snapshots
3. Replace old Storage module usage
4. Add comprehensive tests
5. Implement feature flag for gradual rollout
