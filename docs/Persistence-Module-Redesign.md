# Persistence Module Redesign

## Executive Summary

The current Storage feature has significant architectural issues that create confusion, leaky abstractions, and inefficiencies. This document identifies these problems and proposes a redesign as the "Persistence" module with clearer boundaries and responsibilities.

---

## Critical Issues Identified

### 1. **Dual State Management - Storage vs Edit Store**

**Problem**: Two separate stores (`useStorage` and `useEdit`) both track save state, causing synchronization issues and confusion.

```typescript
// useStorage.ts - Tracks save progress
lastSavedId?: string | null;
storageProgress: StorageStatus;
lastSavedTimestamp: number | null;

// useEdit currentSlice.ts - Also tracks save state  
contentHash: string;
lastStoredContentHash: string;
acknowledgeStoredModifications: () => void;
```

**Issues**:
- **Leaky Abstraction**: The Edit store shouldn't know about "storage" concepts
- **Truth Source Confusion**: Who is authoritative on save state?
- **Race Conditions**: Two stores updating independently can desync
- **Circular Dependencies**: Storage depends on Edit, Edit depends on Storage concepts

### 2. **Orchestration Ambiguity - Who Controls Saving?**

**Problem**: Save action orchestration is scattered across multiple layers.

**Current Flow** (confusing):
```
StoreCurrentButton.tsx
  ↓ calls
useStorageCollection.saveCurrent()
  ↓ calls
useEdit.acknowledgeStoredModifications()
  ↓ also calls
useStorage.recordLastStored()
  ↓ also calls
useEdit.recordStoragePoint()
```

**Issues**:
- **No Clear Owner**: Button, Collection, Edit, and Storage all participate
- **Multiple Write Points**: 4 different state updates across 3 stores
- **Error Handling**: Unclear which layer should handle failures
- **No Transaction Semantics**: Partial saves can leave inconsistent state

### 3. **Confusing State Properties: `isCurrentlyStored` vs `hasStoredModifications`**

**Problem**: Two similar concepts with overlapping responsibilities.

```typescript
// StoreCurrentButton.tsx
const hasStoredAllModifications = useHasStoredAllModifications();
// Returns: contentHash === lastStoredContentHash

const isCurrentlyStored =
  hasStoredAllModifications &&
  storageProgress === "success" &&
  currentSourceId != null &&
  lastSavedId === currentSourceId;
```

**Issues**:
- **hasStoredAllModifications**: Tracks if content matches last saved version (domain concern)
- **isCurrentlyStored**: Tracks if current design exists in storage collection (storage concern)
- **Confusion**: Users/developers conflate these concepts
- **Redundancy**: Both effectively answer "is saved?" but differently
- **UI Logic**: Button combines both + progress state to determine disabled state

### 4. **Session Data Architecture**

**Problem**: Session storage is tightly coupled and uses mixed serialization strategies.

```typescript
// sessionBuilder.ts
export function buildSessionData(state: DesignEditStore): SavedSessionData {
  const shouldMigrate = !!(state as any)["colorSchemes"]; // Type casting!
  
  if (shouldMigrate) {
    const _state = state as any; // More casting!
    return {
      activeColorScheme: state.activeColorScheme,
      neutralEdits: state.neutralEdits,
      light: { designer: _state.colorSchemes?.light?.designer || {} },
      dark: { designer: _state.colorSchemes?.dark?.designer || {} },
      codeOverridesSource: state.codeOverridesSource,
    };
  }
  // ...
}
```

**Issues**:
- **Type Safety**: Heavy use of `any` casting
- **Migration Logic**: Storage layer shouldn't handle schema migrations
- **Partial Serialization**: Stores only designer edits, loses other state
- **Implicit Knowledge**: Restorer must know exact shape and restoration order

### 5. **Compiler Integration Gap**

**Problem**: Storage layer doesn't leverage compiler architecture properly.

**Current**:
```typescript
// useStorageCollection.ts
const themeOptionsCode = JSON.stringify(createdThemeOptions, null, 2);
// Saves final ThemeOptions, not source code or DSL
```

**Issues**:
- **Loss of Fidelity**: Saves compiled output, not source edits
- **No Round-Trip**: Can't reconstruct exact editor state from saved data
- **Compiler Ignored**: Doesn't use compiler's DSL representation
- **Session Workaround**: Needs separate session object to restore edits

### 6. **Storage Adapter Abstraction Leakage**

**Problem**: Storage adapter interface leaks implementation details.

```typescript
// storageAdapters.ts
export interface StorageAdapter {
  read(): Promise<SavedToStorageDesign[]>;
  write(items: SavedToStorageDesign[]): Promise<void>;
  clear(): Promise<void>;
}
```

**Issues**:
- **Array API**: Forces all adapters to use array structure
- **No Querying**: Must load all items, then filter in memory
- **No Indexing**: Can't efficiently check if ID exists
- **Scalability**: Won't work well with server-based storage

### 7. **History Integration Issues**

**Problem**: History slice and storage coordination is unclear.

```typescript
// historySlice.ts
recordStoragePoint: (contentHash: string) => void;
// Creates a save point marker in history

// But useStorageCollection also calls:
recordStoragePoint?.(contentHash); // Optional chaining!
```

**Issues**:
- **Optional Integration**: Using optional chaining suggests fragile coupling
- **No Clear Protocol**: When to mark save points?
- **Undo/Redo**: Unclear how save points affect undo/redo behavior
- **Multiple Markers**: Both visual and code history have save points

### 8. **Title Conflict Handling**

**Problem**: Complex title conflict resolution with unclear ownership.

```typescript
// useStorageCollection.saveCurrent()
const conflict = detectTitleConflict(before, title, currentSourceId);
if (conflict) {
  try {
    setStatus("idle");
  } catch (e) {
    void e; // Swallowing errors!
  }
  throw new Error(`TITLE_CONFLICT:${conflict.id}`);
}
```

**Issues**:
- **Error as Control Flow**: Using exceptions for expected behavior
- **String Parsing**: Error message contains data (`TITLE_CONFLICT:${id}`)
- **UI Coupling**: Button component handles conflict dialog
- **Business Logic**: Storage layer decides conflict policy

---

## Architectural Principles for Persistence Module

### 1. **Single Source of Truth**
- Edit store owns **content state** and **dirty detection**
- Persistence module owns **persistence operations** and **save state**
- No duplication of state across boundaries

### 2. **Clear Boundaries**
```
┌─────────────────────────────────────────┐
│           Edit Store (Domain)           │
│  - Theme edits (neutral, scheme, code)  │
│  - Content hash (for dirty detection)   │
│  - Checkpoint hash (generic savepoint)  │
│  - isDirty: contentHash !== checkpoint  │
│  - History tracking                      │
│  - NO persistence/storage knowledge      │
└─────────────────────────────────────────┘
 * Transaction interface for atomic multi-operation updates
 */
export interface StorageTransaction {
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, 'id' | 'createdAt'>): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;
  
  // Commit/rollback managed by adapter
}

/**
 * Edit command for pure deserialization
 */
export type EditCommand =
  | { type: 'set-base-theme'; dsl: ThemeDsl; metadata: any }
  | { type: 'set-title'; title: string }
  | { type: 'apply-neutral-edit'; path: string; value: SerializableValue }
  | { type: 'apply-scheme-edit'; scheme: string; path: string; value: SerializableValue }
  | { type: 'apply-code-overrides'; source: string; dsl: ThemeDsl; flattened: Record<string, SerializableValue> }
  | { type: 'set-active-scheme'; scheme: 'light' | 'dark' }
  | { type: 'set-checkpoint'; hash: string };

/**
 * Conflict information
 */
export interface ConflictInfo {
  type: 'title' | 'content';
  existingId: string;
  existingTitle?: string;
  currentTitle?: string;
  details?: string;
}
```

---

## Serialization Strategies

### Strategy Selection

Three strategies handle the tradeoff between snapshot size and template dependency:

| Strategy | When to Use | Base Theme Storage | Pros | Cons |
|----------|-------------|-------------------|------|------|
| **Full** | Small templates, custom themes | Inline complete DSL | Self-contained, no dependencies | Larger storage |
| **Delta** | Standard templates, few edits | Reference to template ID | Minimal storage | Template dependency |
| **Hybrid** | Auto-detect based on size | Inline if <10KB, reference if >10KB | Balanced | More complex |

### Strategy 1: Full Snapshot

**Use case**: User creates a theme from scratch or heavily modifies a template.

```typescript
{
  id: "abc-123",
  ### React Hooks

  ```typescript
  // Hooks built on the Zustand store (no manual subscribe/context)

  export function useSave() {
    const save = usePersistenceStore((s) => s.save);
    const status = usePersistenceStore((s) => s.status);
    const error = usePersistenceStore((s) => s.error);
    const isDirty = useDesignEditStore((s) => (s as any).isDirty);
    const isSaving = status === 'saving';
    const canSave = status === 'idle' && !!isDirty;
    return { save, isSaving, canSave, error, isDirty };
  }

  export function useLoad() {
    const load = usePersistenceStore((s) => s.load);
    const status = usePersistenceStore((s) => s.status);
    const error = usePersistenceStore((s) => s.error);
    return { load, isLoading: status === 'loading', error };
  }

  export function useTitleValidation() {
    const validateTitle = usePersistenceStore((s) => s.validateTitle);
    const [conflict, setConflict] = useState<ConflictInfo | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const checkTitle = useMemo(() => debounce(async (title: string) => {
      setIsChecking(true);
      const result = await validateTitle(title);
      setConflict(result);
      setIsChecking(false);
    }, 300), [validateTitle]);
    return { checkTitle, conflict, isChecking, hasConflict: conflict !== null };
  }
  ```
          flattened: editState.codeOverridesEdits,
        },
      },
      preferences: {
        activeColorScheme: editState.activeColorScheme,
      },
      checkpointHash: editState.contentHash,
    };
  }
  
  private serializeBaseTheme(
    editState: DesignEditStore,
    strategy: SerializationStrategy
  ): ThemeSnapshot['baseTheme'] {
    const templateId = editState.baseThemeOptionSourceMetadata?.templateId;
    const baseDsl = parseThemeCode(editState.baseThemeOptionSource);
    
    if (strategy === 'full') {
      return {
        type: 'inline',
        dsl: baseDsl,
        metadata: {
          templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.sourceLabel,
        },
      };
    }
    
    // Delta strategy
    if (!templateId) {
      throw new Error('Cannot use delta strategy without template ID');
    }
    
    const template = this.templateRegistry.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    return {
      type: 'reference',
      reference: {
        templateId,
        version: template.version,
        checksum: this.computeChecksum(template.themeOptions),
      },
      metadata: {
        templateId,
        sourceLabel: template.label,
      },
    };
  }
  
  private autoDetectStrategy(editState: DesignEditStore): SerializationStrategy {
    const size = editState.baseThemeOptionSource.length;
    const hasTemplateId = !!editState.baseThemeOptionSourceMetadata?.templateId;
    
    return (size < 10_000 || !hasTemplateId) ? 'full' : 'delta';
  }
  
  private computeChecksum(themeOptions: ThemeOptions): string {
    // Simple hash for template verification
    return JSON.stringify(themeOptions)
      .split('')
      .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)
      .toString(36);
  }
}
```

### Deserializer Implementation (Pure Function)

```typescript
// Serialization/ThemeDeserializer.ts

export class ThemeDeserializer {
  constructor(
    private templateRegistry: TemplateRegistry
  ) {}
  
  /**
   * Pure deserialization - returns commands, no side effects
   */
  deserialize(snapshot: ThemeSnapshot): EditCommand[] {
    const commands: EditCommand[] = [];
    
    // 1. Resolve base theme
    const baseDsl = this.resolveBaseTheme(snapshot.baseTheme);
    commands.push({
      type: 'set-base-theme',
      dsl: baseDsl,
      metadata: snapshot.baseTheme.metadata,
    });
    
    // 2. Set title
    commands.push({
      type: 'set-title',
      title: snapshot.title,
    });
    
    // 3. Apply neutral edits
    Object.entries(snapshot.edits.neutral).forEach(([path, value]) => {
      commands.push({
        type: 'apply-neutral-edit',
        path,
        value,
      });
    });
    
    // 4. Apply scheme edits
    Object.entries(snapshot.edits.schemes).forEach(([scheme, schemeData]) => {
      Object.entries(schemeData.designer).forEach(([path, value]) => {
        commands.push({
          type: 'apply-scheme-edit',
          scheme,
          path,
          value,
        });
      });
    });
    
    // 5. Apply code overrides
    if (snapshot.edits.codeOverrides.source) {
      commands.push({
        type: 'apply-code-overrides',
        source: snapshot.edits.codeOverrides.source,
        dsl: snapshot.edits.codeOverrides.dsl,
        flattened: snapshot.edits.codeOverrides.flattened,
      });
    }
    
    // 6. Set active color scheme
    commands.push({
      type: 'set-active-scheme',
      scheme: snapshot.preferences.activeColorScheme,
    });
    
    // 7. Set checkpoint
    commands.push({
      type: 'set-checkpoint',
      hash: snapshot.checkpointHash,
    });
    
    return commands;
  }
  
  private resolveBaseTheme(baseTheme: ThemeSnapshot['baseTheme']): ThemeDsl {
    if (baseTheme.type === 'inline') {
      return baseTheme.dsl!;
    }
    
    // Reference type - resolve from registry
    const ref = baseTheme.reference!;
    const template = this.templateRegistry.get(ref.templateId);
    
    if (!template) {
      throw new PersistenceError(
        'TEMPLATE_MISSING',
        `Template ${ref.templateId} not found`,
        { reference: ref },
        false
      );
    }
    
    // Verify template hasn't changed
    const currentChecksum = this.computeChecksum(template.themeOptions);
    if (ref.checksum && ref.checksum !== currentChecksum) {
      throw new PersistenceError(
        'INVALID_DATA',
        `Template ${ref.templateId} has evolved since save`,
        {
          reference: ref,
          savedChecksum: ref.checksum,
          currentChecksum,
          migrateToFull: true, // Hint: convert to full snapshot
        },
        true // Recoverable by migrating
      );
    }
    
    return parseThemeCode(JSON.stringify(template.themeOptions));
  }
  
  private computeChecksum(themeOptions: ThemeOptions): string {
    return JSON.stringify(themeOptions)
      .split('')
      .reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0)
      .toString(36);
  }
}
```

### Command Application (Service Layer)

```typescript
// PersistenceService.ts (partial)

private applyEditCommands(commands: EditCommand[]): void {
  const store = this.editStore.getState();
  
  for (const command of commands) {
    switch (command.type) {
      case 'set-base-theme':
        store.setBaseThemeOption(command.dsl, command.metadata);
        break;
        
      case 'set-title':
        store.setTitle(command.title);
        break;
        
      case 'apply-neutral-edit':
        store.addGlobalDesignerEdit(command.path, command.value);
        break;
        
      case 'apply-scheme-edit':
        store.addSchemeDesignerEdit(command.scheme, command.path, command.value);
        break;
        
      case 'apply-code-overrides':
        store.setCodeOverrides(
          command.source,
          command.dsl,
          command.flattened,
          null
        );
        break;
        
      case 'set-active-scheme':
        store.setActiveColorScheme(command.scheme);
        break;
        
      case 'set-checkpoint':
        store.setCheckpoint(command.hash);
        break;
    }
  }
}
```

---

### Persistence Service

```typescript
// This section has been replaced by the Zustand-based Persistence Store.
// Prefer using the store and hooks in the next section.


```

### React Integration (Deprecated)

The previous context-based hooks and manual `.subscribe()` patterns have been removed from the recommended path. Use the Zustand-based hooks and the `usePersistence` orchestrator hook described later.

---

## Persistence Store Implementation

This section presents the recommended, non-invasive approach: a pure Zustand store for reactive state and a separate React hook (`usePersistence`) that orchestrates side effects (serialization, adapter I/O, transactions). The hook receives dependencies (adapter, serializer, deserializer) from a provider or context and updates the pure store via its setters.

### Pure Zustand Store

```typescript
// src/Editor/Design/Persistence/persistenceStore.ts
import { create } from 'zustand';

export type PersistenceState = {
  status: 'idle' | 'saving' | 'loading' | 'error';
  error: any | null;
  currentSnapshotId: string | null;
  lastSavedAt: number | null;
  collection: ThemeSnapshotMetadata[];
};

export type PersistenceActions = {
  setStatus: (status: PersistenceState['status']) => void;
  setError: (error: any | null) => void;
  setSnapshotId: (id: string | null) => void;
  setLastSavedAt: (timestamp: number | null) => void;
  setCollection: (items: ThemeSnapshotMetadata[]) => void;
};

export const usePersistenceStore = create<PersistenceState & PersistenceActions>((set) => ({
  status: 'idle',
  error: null,
  currentSnapshotId: null,
  lastSavedAt: null,
  collection: [],

  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setSnapshotId: (currentSnapshotId) => set({ currentSnapshotId }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
  setCollection: (collection) => set({ collection }),
}));
```

### Orchestrator Hook (`usePersistence`)

The orchestrator receives the dependencies (adapter, serializer, deserializer) and performs the I/O and transaction logic. It only uses the pure store's setters to reflect operation status back to the UI.

```typescript
// src/Editor/Design/Persistence/usePersistence.ts
import { useCallback } from 'react';
import { usePersistenceStore } from './persistenceStore';
import { useDesignEditStore } from '../Edit/useEdit';
import type { StorageAdapter, ThemeSerializer, ThemeDeserializer } from './types';

export function usePersistence(adapter: StorageAdapter, serializer: ThemeSerializer, deserializer: ThemeDeserializer) {
  const { setStatus, setError, setSnapshotId, setLastSavedAt } = usePersistenceStore();

  const save = useCallback(async (options: SaveOptions = { mode: 'update-or-create' }) => {
    if (!adapter || !serializer) {
      const err = { code: 'INIT_ERROR', message: 'Persistence dependencies missing' };
      setError(err);
      throw err;
    }

    setStatus('saving');
    setError(null);

    try {
      const editState = useDesignEditStore.getState();
      const snapshot = serializer.serialize(editState, {
        id: options.snapshotId ?? editState.currentSnapshotId ?? undefined,
        title: options.title ?? editState.title,
        strategy: options.strategy,
      });

      // Conflict detection (delegated to adapter or optional helper)
      if (options.onConflict !== 'overwrite') {
        const existing = await adapter.findByTitle(snapshot.title);
        const conflict = existing.find((m) => m.id !== snapshot.id);
        if (conflict && options.onConflict === 'fail') {
          const err = { code: 'CONFLICT', message: 'Title already exists', context: { conflict } } as PersistenceError;
          setStatus('error');
          setError(err);
          throw err;
        }
      }

      // Persist with transaction support
      const saved = await adapter.transaction(async (tx) => {
        return snapshot.id ? await tx.update(snapshot.id, snapshot) : await tx.create(snapshot);
      });

      // Update reactive state
      setStatus('idle');
      setSnapshotId(saved.id);
      setLastSavedAt(Date.now());

      // Set domain checkpoint
      useDesignEditStore.getState().setCheckpoint(saved.checkpointHash);

      return saved;
    } catch (error: any) {
      const persistenceError = { code: error.code ?? 'UNKNOWN', message: error.message ?? String(error) };
      setStatus('error');
      setError(persistenceError);
      throw persistenceError;
    }
  }, [adapter, serializer, setError, setStatus, setSnapshotId, setLastSavedAt]);

  const load = useCallback(async (id: string, options: LoadOptions = { mode: 'replace' }) => {
    setStatus('loading');
    setError(null);
    try {
      const snapshot = await adapter.get(id);
      if (!snapshot) throw { code: 'INVALID_DATA', message: 'Snapshot not found' } as PersistenceError;
      const commands = deserializer.deserialize(snapshot);
      const editStore = useDesignEditStore.getState();
      if (options.mode === 'replace') editStore.loadNew('', { title: snapshot.title });
      commands.forEach((cmd) => applyEditCommand(editStore, cmd));
      editStore.setCheckpoint(editStore.contentHash);
      setStatus('idle');
      setSnapshotId(snapshot.id);
      setLastSavedAt(snapshot.updatedAt ?? Date.now());
    } catch (error: any) {
      const persistenceError = { code: error.code ?? 'UNKNOWN', message: error.message ?? String(error) };
      setStatus('error');
      setError(persistenceError);
      throw persistenceError;
    }
  }, [adapter, deserializer, setError, setStatus, setSnapshotId, setLastSavedAt]);

  return { save, load, status: usePersistenceStore((s) => s.status), error: usePersistenceStore((s) => s.error) };
}
```

### Example: SaveButton using `usePersistence`

```tsx
// UI/SaveButton.usePersistence.tsx
import React, { useContext } from 'react';
import { Button, Badge } from '@mui/material';
import { PersistenceContext } from './PersistenceProvider'; // provider supplies adapter/serializer/deserializer
import { usePersistence } from './usePersistence';
import { useDesignEditStore } from '../Edit/useEdit';

export function SaveButtonUsingPersistence() {
  const deps = useContext(PersistenceContext);
  const { save, status } = usePersistence(deps.adapter, deps.serializer, deps.deserializer);
  const isDirty = useDesignEditStore((s) => (s as any).isDirty);
  const isSaving = status === 'saving';

  const handleSave = async () => {
    try {
      await save({ onConflict: 'prompt' });
      // show success UI (snackbar, etc.)
    } catch (e) {
      // error state is reflected in the store; additional handling optional
      console.error('Save failed', e);
    }
  };

  return (
    <Badge badgeContent={isSaving ? '...' : isDirty ? '•' : ''} color="primary">
      <Button onClick={handleSave} disabled={!isDirty || isSaving}>
        {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
      </Button>
    </Badge>
  );
}
```

### Hooks (No manual subscribe)

```typescript
// src/Editor/Design/Persistence/hooks/useSave.ts
export function useSave() {
  const save = usePersistenceStore((s) => s.save);
  const status = usePersistenceStore((s) => s.status);
  const error = usePersistenceStore((s) => s.error);
  const isDirty = useEdit((s) => (s as any).isDirty);
  const isSaving = status === 'saving';
  const canSave = status === 'idle' && !!isDirty;
  return { save, isSaving, canSave, error };
}

// src/Editor/Design/Persistence/hooks/useLoad.ts
export function useLoad() {
  const load = usePersistenceStore((s) => s.load);
  const status = usePersistenceStore((s) => s.status);
  const error = usePersistenceStore((s) => s.error);
  return { load, isLoading: status === 'loading', error };
}

// src/Editor/Design/Persistence/hooks/useTitleValidation.ts
export function useTitleValidation() {
  const validateTitle = usePersistenceStore((s) => s.validateTitle);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const checkTitle = useMemo(() => debounce(async (title: string) => {
    setIsChecking(true);
    const result = await validateTitle(title);
    setConflict(result);
    setIsChecking(false);
  }, 300), [validateTitle]);
  return { checkTitle, conflict, isChecking, hasConflict: conflict !== null };
}
```

### Provider Setup

```typescript
// src/Editor/Design/Persistence/PersistenceProvider.tsx
export function PersistenceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializePersistence(new DeviceStorageAdapter(), new ThemeSerializer(templateRegistry), new ThemeDeserializer(templateRegistry));
  }, []);
  return children;
}
```

### Testing (No React wrapper needed)

```typescript
it('saves snapshot via store', async () => {
  initializePersistence(new MockAdapter(), new ThemeSerializer(templateRegistry), new ThemeDeserializer(templateRegistry));
  const result = await usePersistenceStore.getState().save({ mode: 'create' });
  expect(result.id).toBeDefined();
  expect(usePersistenceStore.getState().status).toBe('idle');
});
```

### Simplified Save Button

```typescript
// UI/SaveButton.tsx

export function SaveButton() {
  const { save, isSaving, canSave, isDirty } = useSave();
  const { hasConflict, conflict } = useTitleValidation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  
  const handleSave = async () => {
    try {
      await save({ onConflict: 'prompt' });
      setShowSuccess(true);
    } catch (error: any) {
      if (error.code === 'CONFLICT') {
        setShowConflictDialog(true);
      }
      // Other errors handled by persistence service state
    }
  };
  
  return (
    <>
      <Badge
        badgeContent={hasConflict ? '!' : 0}
        color="warning"
      >
        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          color={hasConflict ? 'warning' : 'primary'}
        >
          {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
        </Button>
      </Badge>
      
      {hasConflict && (
        <Typography variant="caption" color="warning">
          Title "{conflict?.currentTitle}" already exists
        </Typography>
      )}
      
      <ConflictDialog
        open={showConflictDialog}
        conflict={conflict}
        onClose={() => setShowConflictDialog(false)}
        onResolve={async (resolution) => {
          if (resolution === 'overwrite') {
            await save({ onConflict: 'overwrite' });
          } else if (resolution === 'rename') {
            // Let user provide new title
            const newTitle = prompt('Enter new title:');
            if (newTitle) {
              await save({ title: newTitle });
            }
          }
          setShowConflictDialog(false);
          setShowSuccess(true);
        }}
      />
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        message="Design saved successfully"
      />
    </>
  );
}
```

---

## Edit Store Changes Required

To support the new Persistence module, the Edit store needs these additions:

```typescript
// Edit/useEdit/currentSlice.ts additions

export interface ThemeCurrentState {
  // ... existing fields ...
  
  // Checkpoint for dirty detection (replaces lastStoredContentHash)
  checkpointHash: string | null;
  
  // Computed property
  get isDirty(): boolean {
    return this.checkpointHash !== null && this.contentHash !== this.checkpointHash;
  }
}

export interface ThemeCurrentActions {
  // ... existing actions ...
  
  // Checkpoint management (replaces acknowledgeStoredModifications)
  setCheckpoint: (hash: string) => void;
  clearCheckpoint: () => void;
}

// Implementation
setCheckpoint: (hash: string) => {
  set({ checkpointHash: hash });
},

clearCheckpoint: () => {
  set({ checkpointHash: null });
},
```

**Removals**:
- Remove `lastStoredContentHash`
- Remove `acknowledgeStoredModifications()`
- Remove `recordStoragePoint()` from history slice (persistence handles this)

---

## Migration Strategy

### Phase 0: Data Migration Script (CRITICAL FIRST STEP)

**Before any code changes**, create and test data migration:

```typescript
// scripts/migrat e-storage-to-persistence.ts

interface OldStorageDesign {
  id: string;
  title: string;
  createdAt: number;
  updatedAt?: number;
  themeOptionsCode: string; // Compiled output
  session?: OldSessionData; // Editor state
}

interface OldSessionData {
  activeColorScheme?: "light" | "dark";
  neutralEdits?: Record<string, any>;
  light?: { designer?: Record<string, any> };
  dark?: { designer?: Record<string, any> };
  codeOverridesSource?: string;
}

async function migrateOldStorageToNewFormat(): Promise<void> {
  // 1. Read old storage format
  const oldData = localStorage.getItem('mui-theme-builder-designs');
  if (!oldData) return;
  
  const oldDesigns: OldStorageDesign[] = JSON.parse(oldData);
  
  // 2. Convert each design to new ThemeSnapshot format
  const newSnapshots: ThemeSnapshot[] = [];
  
  for (const old of oldDesigns) {
    try {
      const snapshot = await convertOldToNew(old);
      newSnapshots.push(snapshot);
    } catch (error) {
      console.error(`Failed to migrate design ${old.id}:`, error);
      // Keep old data, log error
    }
  }
  
  // 3. Verify round-trip fidelity
  for (const snapshot of newSnapshots) {
    const reconstructed = await testRoundTrip(snapshot);
    if (!reconstructed.success) {
      throw new Error(`Round-trip failed for ${snapshot.id}`);
    }
  }
  
  // 4. Write to new storage location
  localStorage.setItem('mui-theme-builder-snapshots-v2', JSON.stringify(newSnapshots));
  
  // 5. Keep old storage as backup (don't delete yet)
  localStorage.setItem('mui-theme-builder-designs-backup', oldData);
  
  console.log(`Migrated ${newSnapshots.length} designs successfully`);
}

async function convertOldToNew(old: OldStorageDesign): Promise<ThemeSnapshot> {
  // Parse compiled theme options back to DSL
  const themeOptions = JSON.parse(old.themeOptionsCode);
  const baseDsl = parseThemeCode(old.themeOptionsCode);
  
  // Reconstruct edits from session data
  const edits = {
    neutral: old.session?.neutralEdits ?? {},
    schemes: {
      light: { designer: old.session?.light?.designer ?? {} },
      dark: { designer: old.session?.dark?.designer ?? {} },
    },
    codeOverrides: {
      source: old.session?.codeOverridesSource ?? '',
      dsl: old.session?.codeOverridesSource
        ? parseThemeCode(old.session.codeOverridesSource)
        : {},
      flattened: {},
    },
  };
  
  // Compute checkpoint hash
  const checkpointHash = JSON.stringify({
    base: old.themeOptionsCode,
    ...edits,
  });
  
  return {
    id: old.id,
    version: 1,
    title: old.title,
    createdAt: old.createdAt,
    updatedAt: old.updatedAt ?? old.createdAt,
    strategy: 'full', // Old format didn't have delta snapshots
    baseTheme: {
      type: 'inline',
      dsl: baseDsl,
      metadata: {},
    },
    edits,
    preferences: {
      activeColorScheme: old.session?.activeColorScheme ?? 'light',
    },
    checkpointHash,
  };
}

async function testRoundTrip(snapshot: ThemeSnapshot): Promise<{ success: boolean; error?: string }> {
  try {
    // Deserialize to commands
    const deserializer = new ThemeDeserializer(templateRegistry);
    const commands = deserializer.deserialize(snapshot);
    
    // Apply to a fresh edit store
    const testStore = createTestEditStore();
    commands.forEach(cmd => applyCommand(testStore, cmd));
    
    // Serialize back
    const serializer = new ThemeSerializer(templateRegistry);
    const reserialized = serializer.serialize(testStore.getState(), {
      title: snapshot.title,
    });
    
    // Compare (should be equivalent)
    const equivalent = deepEqual(
      normalize(snapshot),
      normalize(reserialized)
    );
    
    return { success: equivalent };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

### Phase 1: Create New Persistence Module (Parallel to old Storage)

**Goal**: New module exists but isn't used yet. Zero breaking changes.

1. ✅ Create `Persistence/` folder structure
2. ✅ Implement `PersistenceService` class
3. ✅ Implement `StorageAdapter` v2 interface with transactions
4. ✅ Implement `ThemeSerializer` with strategy selection
5. ✅ Implement `ThemeDeserializer` (pure, command-based)
6. ✅ Create React context and hooks (`useSave`, `useLoad`, `useTitleValidation`)
7. ✅ Add comprehensive unit tests
8. ✅ Add integration tests with mock storage
9. ✅ **Run migration script** and verify data integrity

**Storage Keys** (avoid collision):
- Old: `mui-theme-builder-designs`
- New: `mui-theme-builder-snapshots-v2`

### Phase 2: Update Edit Store (Breaking Change, But Isolated)

**Goal**: Edit store supports checkpoint API, but Storage still works.

1. ✅ Add `checkpointHash` field to `ThemeCurrentState`
2. ✅ Add `isDirty` computed property
3. ✅ Add `setCheckpoint()` and `clearCheckpoint()` actions
4. ✅ Keep `lastStoredContentHash` and `acknowledgeStoredModifications()` (for backward compat)
5. ✅ Update `useHasStoredAllModifications` to use `isDirty` internally
6. ✅ Test that old Storage module still works

### Phase 3: Feature Flag Implementation

**Goal**: Can toggle between old and new systems for testing.

```typescript
// Feature flag in config
export const FEATURE_FLAGS = {
  USE_NEW_PERSISTENCE: import.meta.env.VITE_NEW_PERSISTENCE === 'true',
};

// Conditional rendering
export function SaveButton() {
  if (FEATURE_FLAGS.USE_NEW_PERSISTENCE) {
    return <NewSaveButton />;
  }
  return <OldStoreCurrentButton />;
}
```

1. ✅ Add feature flag to environment
2. ✅ Create new UI components (`SaveButton`, `CollectionBrowser`)
3. ✅ Keep old components intact
4. ✅ Test both paths extensively
5. ✅ Gather user feedback (dogfooding)

### Phase 4: Gradual Rollout

**Goal**: New Persistence becomes default, old Storage deprecated.

1. ✅ Enable new persistence by default (`USE_NEW_PERSISTENCE=true`)
2. ✅ Add deprecation warnings to old Storage components
3. ✅ Monitor for issues (error tracking, user reports)
4. ✅ Keep feature flag for quick rollback if needed
5. ⏱️ Wait 2-4 weeks for stability

### Phase 5: Cleanup (Remove Old Storage)

**Goal**: Delete old code, complete migration.

1. ✅ Remove `Storage/` folder entirely
2. ✅ Remove `lastStoredContentHash` from Edit store
3. ✅ Remove `acknowledgeStoredModifications()` from Edit store
4. ✅ Remove `recordStoragePoint()` from History slice
5. ✅ Update all imports
6. ✅ Remove feature flag
7. ✅ Delete old storage key (`mui-theme-builder-designs`)
8. ✅ Update documentation

### Phase 6: Optimization & New Features

**Goal**: Leverage new architecture for improvements.

1. ✅ Implement IndexedDB adapter for larger datasets
2. ✅ Add compression for snapshots (gzip/brotli)
3. ✅ Implement incremental saves (only changed fields)
4. ✅ Add auto-save functionality (with debouncing)
5. ✅ Add "revert to saved" command
6. ✅ Implement snapshot branching/versioning
7. ✅ Prepare for cloud sync (server adapter)

---

## Answers to Open Questions

### 1. **Who owns the checkpoint hash?**
**Answer**: Edit store owns `checkpointHash` (domain concern). Persistence service **sets** the checkpoint after successful save. This keeps domain logic in the domain store while allowing Persistence to orchestrate.

### 2. **What's the serialization strategy for base themes?**
**Answer**: Hybrid strategy with auto-detection:
- **Full** (<10KB or custom): Inline complete DSL for self-containment
- **Delta** (>10KB and templated): Reference template ID with version pinning
- Supports manual override via `SaveOptions.strategy`

### 3. **How do you handle template evolution?**
**Answer**: 
- Store template version and checksum in delta snapshots
- On load, verify checksum matches current template
- If mismatch: Offer migration to new version OR convert to full snapshot (preserve old template inline)
- User can choose: "Update to new template" or "Keep as-is"

### 4. **Is deserialization pure or does it have side effects?**
**Answer**: **Pure**. `ThemeDeserializer.deserialize()` returns `EditCommand[]`, no side effects. `PersistenceService.applyEditCommands()` applies them to the Edit store. This separation enables:
- Easy testing of deserialization logic
- Command inspection/logging
- Undo/redo integration
- Middleware patterns

### 5. **What's the transaction model?**
**Answer**: `StorageAdapter.transaction<T>(callback)` provides atomic multi-operation updates. Example:
```typescript
await adapter.transaction(async (tx) => {
  const snapshot = await tx.create(newSnapshot);
  await tx.update('recent-list-id', { items: [snapshot.id, ...] });
  return snapshot;
});
// Both succeed or both rollback
```

### 6. **How do you handle storage adapter failures mid-transaction?**
**Answer**: 
- Transaction callback throws → entire transaction rolls back
- Service catches error → `normalizeToPersistenceError()` → emit `save-error` event
- Optimistic updates: `rollback()` restores previous UI state
- User sees error toast with recovery options (retry, save elsewhere, export)

### 7. **Should conflict detection be proactive or reactive?**
**Answer**: **Proactive**. `ConflictDetector` checks title conflicts:
- **On title change** (as user types, with debouncing)
- **On save attempt** (double-check before storage)
- Shows inline warning BEFORE save button is clicked
- Caches results for 5 seconds to reduce queries
- UI shows badge/warning if conflict detected

---

## Benefits Summary

### ✅ Clearer Boundaries
- Edit store focuses on domain logic
- Persistence module owns all storage concerns
- No circular dependencies

### ✅ Single Source of Truth
- One `isDirty` flag (in persistence state)
- One save status (in persistence state)
- No synchronization issues

### ✅ Better Error Handling
- Atomic save operations with rollback
- Typed error codes with context
- Recoverable vs non-recoverable errors

### ✅ Improved Type Safety
- No `any` casting in serialization
- Strongly typed snapshot format
- Schema versioning for migrations

### ✅ Compiler Integration
- Uses DSL format for base theme
- Preserves edit granularity
- Round-trip fidelity

### ✅ Scalable Storage
- Query-friendly adapter interface
- Efficient metadata browsing
- Ready for server-based storage

### ✅ Simpler UI
- Single hook for all persistence needs
- Clear loading/error states
- Consistent button behavior

---

## Remaining Open Questions for Implementation

1. **Auto-save timing**: Debounce duration (3s? 5s?) and triggers (on blur, on idle, periodic)?
2. **Conflict UI specifics**: Inline warning vs modal? Auto-rename with suffix (e.g., "Design (2)")?
3. **Storage quota handling**: Warn at 80% full? Auto-cleanup of oldest snapshots?
4. **Compression**: Worth the complexity for localStorage? (IndexedDB yes, localStorage maybe)
5. **Snapshot versioning**: Support branches (e.g., "Design v1", "Design v2") or just linear history?
6. **Cloud sync architecture**: REST API? WebSockets for real-time? Conflict resolution strategy?
7. **Export format**: Keep JSON or switch to more portable format (YAML, etc.)?

---

## Benefits Summary (Updated)

### ✅ Clearer Boundaries
- Edit store focuses on domain logic (content + checkpoints)
- Persistence module owns all storage concerns (save/load orchestration)
- No circular dependencies or leaky abstractions

### ✅ Single Source of Truth
- `isDirty` lives in Edit store (domain concern)
- Save status lives in Persistence state (operation concern)
- No synchronization issues between stores

### ✅ Better Error Handling
- Atomic save operations with transaction support
- Typed error codes with context and recovery hints
- Rollback support for optimistic updates
- Lifecycle events for error tracking/analytics

### ✅ Improved Type Safety
- No `any` casting in serialization (strongly typed commands)
- Schema versioning for safe migrations
- Pure deserialization (testable, composable)

### ✅ Compiler Integration
- Three serialization strategies (full/delta/hybrid)
- Uses DSL format for base theme
- Preserves edit granularity with command pattern
- Round-trip fidelity guaranteed

### ✅ Scalable Storage
- Query-friendly adapter interface (exists, findByTitle, count)
- Transaction support for atomic multi-operations
- Efficient metadata browsing (no full snapshot loading)
- Ready for IndexedDB and server-based storage

### ✅ Proactive Conflict Detection
- Real-time title validation (as user types)
- Visual feedback before save attempt
- Caching to reduce storage queries
- Clear conflict resolution flow

### ✅ Extensibility
- Lifecycle events for middleware patterns
- Event-driven architecture (before-save, after-load, etc.)
- Analytics, logging, custom validation via events
- Command pattern enables undo/redo integration

### ✅ Simpler UI
- User-facing hooks: `useSave()`, `useLoad()`, `useTitleValidation()`
- Clear loading/error states
- Consistent button behavior
- Separation of concerns (UI ↔ Service ↔ Domain)

---

## Conclusion

### Problems Solved

The current Storage feature suffers from:
1. ❌ **Dual state management** causing sync issues
2. ❌ **Unclear orchestration** with 4 layers touching save logic
3. ❌ **Confusing state properties** (`isCurrentlyStored` vs `hasStoredModifications`)
4. ❌ **Poor compiler integration** (saves compiled output, needs session workaround)
5. ❌ **Leaky abstractions** (Edit store knows about "storage")
6. ❌ **Reactive conflict detection** (errors instead of warnings)
7. ❌ **No transaction support** (partial failures leave inconsistent state)
8. ❌ **Type unsafety** (heavy `any` casting in session builder)

### Solutions Delivered

The proposed Persistence module solves these by:
1. ✅ **Single source of truth**: `isDirty` in Edit store, save status in Persistence
2. ✅ **Clear service-based orchestration**: `PersistenceService` owns save/load
3. ✅ **Explicit boundaries**: Domain ↔ Service ↔ Infrastructure
4. ✅ **Better compiler integration**: Three strategies (full/delta/hybrid) with DSL
5. ✅ **Proactive conflict detection**: Real-time title validation
6. ✅ **Transaction support**: Atomic multi-operation updates
7. ✅ **Pure deserialization**: Command pattern for testability
8. ✅ **Lifecycle events**: Extensibility for analytics, middleware
9. ✅ **Type safety**: No `any` casting, strongly typed throughout

### Key Architectural Decisions (Addressing Pushbacks)

| Concern | Decision | Rationale |
|---------|----------|-----------|
| **Dirty flag ownership** | Edit store owns `isDirty` | Domain concern; Persistence triggers checkpoints |
| **Serialization strategy** | Hybrid with auto-detect | Balances size vs dependencies |
| **Template evolution** | Version pinning + checksum | Safe with clear migration path |
| **Deserialization purity** | Returns commands, no side effects | Testable, composable, inspectable |
| **Conflict timing** | Proactive (on title change) | Better UX than reactive errors |
| **Transaction model** | Adapter-level support | Enables atomic multi-operations |
| **Naming** | `useSave`/`useLoad` (not `usePersistence`) | User-facing language |

### Implementation Readiness

✅ **Ready to implement**:
- Core architecture defined
- All critical concerns addressed
- Migration strategy includes data verification
- Feature flag for safe rollout

⚠️ **Decisions still needed**:
- Auto-save timing (implementation detail)
- Compression strategy (can be added later)
- Cloud sync architecture (future feature)

### Next Steps

1. **Review this revision** with team for final approval
2. **Implement Phase 0**: Data migration script + testing
3. **Implement Phase 1**: New Persistence module (parallel to old)
4. **Implement Phase 2-3**: Edit store changes + feature flag
5. **Rollout Phase 4-5**: Gradual adoption + cleanup
6. **Optimize Phase 6**: IndexedDB, compression, auto-save

This redesign will make the codebase significantly more maintainable, eliminate architectural bugs, and provide a solid foundation for advanced features like auto-save, versioning, and cloud sync.
