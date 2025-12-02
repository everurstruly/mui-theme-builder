import type { ThemeDsl } from "../../compiler";

export type SerializableValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

export interface SchemeEdits {
  designer: Record<string, SerializableValue>;
}

export interface DesignBaseMetadata {
  label?: string;
  templateId?: string;
  createdAtTimestamp: number;
  lastModifiedTimestamp: number;
}

// ===== Edit Slice Types =====
export interface CurrentDesignEditState {
  title: string;
  baseThemeOptionSource: string;
  baseThemeOptionSourceMetadata: DesignBaseMetadata;
  neutralEdits: Record<string, SerializableValue>;
  schemeEdits: Record<string, SchemeEdits>;
  codeOverridesSource: string;
  codeOverridesDsl: ThemeDsl;
  codeOverridesEdits: Record<string, SerializableValue>;
  codeOverridesError: string | null;
  contentHash: string;
  checkpointHash: string | null;
  modificationTimestamps: Record<string, number>;
}

export interface CurrentDesignEditActions {
  setTitle: (title: string) => void;
  setBaseThemeOption: (
    themeCodeOrDsl: string | ThemeDsl,
    metadata?: Partial<DesignBaseMetadata> & { title?: string }
  ) => void;
  addNeutralDesignerEdit: (path: string, value: SerializableValue) => void;
  addSchemeDesignerEdit: (
    scheme: string,
    path: string,
    value: SerializableValue
  ) => void;
  removeNeutralDesignerEdit: (path: string) => void;
  removeSchemeDesignerEdit: (scheme: string, path: string) => void;
  getDesignerNeutralEdit: (path: string) => SerializableValue;
  getDesignerSchemeEdit: (scheme: string, path: string) => SerializableValue;
  clearDesignerEdits: (
    scope: "global" | "current-scheme" | "all",
    scheme: string
  ) => void;
  setCodeOverrides: (
    source: string,
    dsl: ThemeDsl,
    flattened: Record<string, SerializableValue>,
    error: string | null
  ) => void;
  clearCodeOverrides: () => void;
  hydrate: (snapshot: ThemeSnapshot, options?: { isSaved?: boolean }) => void;
  loadNew: (
    themeCodeOrDsl?: string | ThemeDsl,
    metadata?: Partial<DesignBaseMetadata> & { title?: string }
  ) => void;
  resetToBase: () => void;
  setCheckpoint: (hash: string) => void;
  clearCheckpoint: () => void;
}

export type CurrentDesignEditStore = CurrentDesignEditState &
  CurrentDesignEditActions;

// ===== History Slice Types =====
export interface HistoryPatch {
  /** Operation type */
  op: "add" | "remove";

  /** Path that was modified */
  path: string;

  /** Previous value (for undo) */
  oldValue?: SerializableValue;

  /** New value (for redo) */
  newValue?: SerializableValue;

  /** Color scheme if applicable */
  // scheme?: "light" | "dark";
  scheme?: string;

  /** Whether this is a global visual edit */
  isGlobal?: boolean;
}

/**
 * A collection of patches representing a single atomic change.
 * Used for batch operations.
 */
export interface HistoryEntry {
  /** Array of patches in this entry */
  patches: HistoryPatch[];

  /** Timestamp for debugging */
  timestamp: number;

  /** Content hash representing state at this entry (optional) */
  contentHash?: string;

  /** Marks this entry as a save point so undo/redo can skip or treat specially */
  isSavePoint?: boolean;
}

export interface CodeHistoryEntry {
  /** Previous source code */
  source: string;

  /** Timestamp */
  timestamp: number;

  /** Content hash representing state at this entry (optional) */
  contentHash?: string;

  /** Marks this entry as a save point */
  isSavePoint?: boolean;
}

export interface CurrentDesignHistoryState {
  /** Visual edit history (past) */
  visualHistoryPast: HistoryEntry[];

  /** Visual edit history (future/redo stack) */
  visualHistoryFuture: HistoryEntry[];

  /** Code override history (past) */
  codeHistoryPast: CodeHistoryEntry[];

  /** Code override history (future/redo stack) */
  codeHistoryFuture: CodeHistoryEntry[];
}

export interface CurrentDesignHistoryActions {
  /** Record a visual edit change */
  recordVisualChange: (patches: HistoryPatch[]) => void;

  /** Record a code override change */
  recordCodeChange: (previousSource: string) => void;
  /** Record a save point in visual history */
  recordStoragePoint: (contentHash: string) => void;
  /** Record a save point in code history */
  recordCodeStoragePoint: (contentHash: string) => void;

  /** Get undo/redo availability */
  canUndoVisual: () => boolean;
  canRedoVisual: () => boolean;
  canUndoCode: () => boolean;
  canRedoCode: () => boolean;
  /** Undo/redo operations (scope: visual or code) */
  undoVisualToolEdit: () => void;
  redoVisualToolEdit: () => void;
  undoCodeOverride: () => void;
  redoCodeOverride: () => void;

  /** Mark current version as stored */
  // lastStoredModificationVersion tracking is handled by the domain slice; history does not track it.

  /** Clear all history */
  clearHistory: () => void;

  /** Get entries for debugging */
  getVisualHistory: () => { past: HistoryEntry[]; future: HistoryEntry[] };
  getCodeHistory: () => { past: CodeHistoryEntry[]; future: CodeHistoryEntry[] };
}

export type CurrentDesignHistorySlice = CurrentDesignHistoryState &
  CurrentDesignHistoryActions;

// ===== Preview Slice Types =====
export interface CurrentDesignPreviewState {
  /** Currently active color scheme being edited */
  activeColorScheme: "light" | "dark";

  /** Currently selected preview component */
  activePreviewId: string;
}

export interface CurrentDesignPreviewActions {
  setActiveColorScheme: (scheme: "light" | "dark") => void;
  selectPreview: (previewId: string) => void;
}

export type CurrentDesignPreviewSlice = CurrentDesignPreviewState &
  CurrentDesignPreviewActions;

// ===== Persistence Slice Types =====
export interface CurrentDesignPersistenceState {
  saveStatus: "idle" | "saving" | "saved" | "error";
  loadStatus: "idle" | "loading" | "error";
  persistenceError: PersistenceError | null;
  persistenceSnapshotId: string | null;
  lastPersistedAt: number | null;
}

export interface CurrentDesignPersistenceActions {
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
  setLoadStatus: (status: "idle" | "loading" | "error") => void;
  setPersistenceError: (error: PersistenceError | null) => void;
  setPersistenceSnapshotId: (id: string | null) => void;
  setPersistedAt: (timestamp: number | null) => void;
  reset: () => void;
}

export type CurrentDesignPersistenceSlice = CurrentDesignPersistenceState &
  CurrentDesignPersistenceActions;

// ===== Combined Store Type =====
export type CurrentDesignStore = CurrentDesignEditStore &
  CurrentDesignPreviewSlice &
  CurrentDesignHistorySlice &
  CurrentDesignPersistenceSlice;

/**
 * Serialization strategy for base theme storage
 */
export type SerializationStrategy = "full" | "delta" | "hybrid";

/**
 * Base theme storage format
 */
export type BaseThemeStorage =
  | {
      type: "inline";
      dsl: ThemeDsl;
      metadata: {
        templateId?: string;
        sourceLabel?: string;
        [key: string]: any;
      };
    }
  | {
      type: "reference";
      reference: {
        templateId: string;
        version: string;
        checksum: string;
      };
      metadata: {
        templateId: string;
        sourceLabel?: string;
        [key: string]: any;
      };
    };

/**
 * Theme snapshot - the persisted format
 */
export interface ThemeSnapshot {
  id: string;
  version: number;
  title: string;
  createdAt: number;
  updatedAt?: number;
  strategy: SerializationStrategy;

  baseTheme: BaseThemeStorage;

  edits: {
    neutral: Record<string, SerializableValue>;
    schemes: {
      [scheme: string]: SchemeEdits;
    };
    codeOverrides: {
      source: string;
      dsl: ThemeDsl;
      flattened: Record<string, SerializableValue>;
    };
  };

  preferences: {
    activeColorScheme: "light" | "dark";
  };

  checkpointHash: string;
}

/**
 * Lightweight metadata for browsing collection
 */
export interface ThemeSnapshotMetadata {
  id: string;
  title: string;
  createdAt: number;
  updatedAt?: number;
  strategy: SerializationStrategy;
  checkpointHash: string;
}

/**
 * Transaction interface for atomic multi-operation updates
 */
export interface StorageTransaction {
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, "id" | "createdAt">): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  // CRUD operations
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, "id" | "createdAt">): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;

  // Querying
  list(): Promise<ThemeSnapshotMetadata[]>;
  exists(id: string): Promise<boolean>;
  findByTitle(title: string): Promise<ThemeSnapshotMetadata[]>;
  count(): Promise<number>;

  // Transaction support
  transaction<T>(callback: (tx: StorageTransaction) => Promise<T>): Promise<T>;

  // Cleanup
  clear(): Promise<void>;
}

/**
 * Conflict information
 */
export interface ConflictInfo {
  type: "title" | "content";
  existingId: string;
  existingTitle?: string;
  currentTitle?: string;
  details?: string;
}

/**
 * Persistence error
 */
export interface PersistenceError {
  code:
    | "INIT_ERROR"
    | "CONFLICT"
    | "INVALID_DATA"
    | "TEMPLATE_MISSING"
    | "STORAGE_ERROR"
    | "UNKNOWN";
  message: string;
  context?: any;
  recoverable?: boolean;
}

/**
 * Save options
 */
export interface SaveOptions {
  mode?: "create" | "update" | "update-or-create";
  snapshotId?: string;
  title?: string;
  strategy?: SerializationStrategy;
  onConflict?: "fail" | "overwrite" | "prompt";
}

/**
 * Load options
 */
export interface LoadOptions {
  mode?: "replace" | "merge";
  skipBlockerCheck?: boolean;
}

/**
 * Load blocker information
 */
export interface LoadBlocker {
  reason: "UNSAVED_CHANGES";
  context: Record<string, any>;
  resolutions: {
    discardAndProceed: () => void;
    cancel: () => void;
  };
}

/**
 * Persistence state
 */
export interface PersistenceState {
  status: "idle" | "saving" | "loading" | "error";
  error: PersistenceError | null;
  currentSnapshotId: string | null;
  lastSavedAt: number | null;
  collection: ThemeSnapshotMetadata[];
}
