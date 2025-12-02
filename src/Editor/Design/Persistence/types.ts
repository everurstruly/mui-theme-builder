import type { SerializableValue, ThemeDsl } from "../compiler";
import type { SchemeEdits } from "../Current/useCurrent/types";

/**
 * Serialization strategy for base theme storage
 */
export type SerializationStrategy = 'full' | 'delta' | 'hybrid';

/**
 * Base theme storage format
 */
export type BaseThemeStorage = 
  | {
      type: 'inline';
      dsl: ThemeDsl;
      metadata: {
        templateId?: string;
        sourceLabel?: string;
        [key: string]: any;
      };
    }
  | {
      type: 'reference';
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
    activeColorScheme: 'light' | 'dark';
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
  create(snapshot: Omit<ThemeSnapshot, 'id' | 'createdAt'>): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  // CRUD operations
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, 'id' | 'createdAt'>): Promise<ThemeSnapshot>;
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

/**
 * Persistence error
 */
export interface PersistenceError {
  code: 'INIT_ERROR' | 'CONFLICT' | 'INVALID_DATA' | 'TEMPLATE_MISSING' | 'STORAGE_ERROR' | 'UNKNOWN';
  message: string;
  context?: any;
  recoverable?: boolean;
}

/**
 * Save options
 */
export interface SaveOptions {
  mode?: 'create' | 'update' | 'update-or-create';
  snapshotId?: string;
  title?: string;
  strategy?: SerializationStrategy;
  onConflict?: 'fail' | 'overwrite' | 'prompt';
}

/**
 * Load options
 */
export interface LoadOptions {
  mode?: 'replace' | 'merge';
}

/**
 * Persistence state
 */
export interface PersistenceState {
  status: 'idle' | 'saving' | 'loading' | 'error';
  error: PersistenceError | null;
  currentSnapshotId: string | null;
  lastSavedAt: number | null;
  collection: ThemeSnapshotMetadata[];
}
