/**
 * History Slice - Undo/Redo with Efficient Patches
 * 
 * Responsibilities:
 * - Track changes to domain state (visual edits + code overrides)
 * - Provide undo/redo operations
 * - Store O(1) diffs instead of O(n) full snapshots
 * 
 * Approach:
 * - Store minimal patches (only changed paths + values)
 * - Separate history stacks for visual edits vs code overrides
 * - Version-based tracking for efficient dirty checks
 * 
 * Does NOT contain:
 * - Domain state itself
 * - UI state
 * - Storage logic
 */

import type { StateCreator } from 'zustand';
import type { SerializableValue } from './currentSlice';

// ===== Types =====

/**
 * A lightweight patch representing a single change.
 */
export interface HistoryPatch {
  /** Operation type */
  op: 'add' | 'remove';
  
  /** Path that was modified */
  path: string;
  
  /** Previous value (for undo) */
  oldValue?: SerializableValue;
  
  /** New value (for redo) */
  newValue?: SerializableValue;
  
  /** Color scheme if applicable */
  scheme?: 'light' | 'dark';
  
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

/**
 * Code override history entry.
 */
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

/**
 * History state.
 */
export interface ThemeDesignHistoryState {
  /** Visual edit history (past) */
  visualHistoryPast: HistoryEntry[];
  
  /** Visual edit history (future/redo stack) */
  visualHistoryFuture: HistoryEntry[];
  
  /** Code override history (past) */
  codeHistoryPast: CodeHistoryEntry[];
  
  /** Code override history (future/redo stack) */
  codeHistoryFuture: CodeHistoryEntry[];
}

/**
 * History actions.
 */
export interface ThemeDesignHistoryActions {
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

export type DesignEditHistorySlice = ThemeDesignHistoryState & ThemeDesignHistoryActions;

// ===== Constants =====

const MAX_HISTORY_SIZE = 50;

// ===== Slice Creator =====

export const createHistorySlice: StateCreator<
  any,
  [],
  [],
  DesignEditHistorySlice
> = (set, get) => ({
  // Initial state
  visualHistoryPast: [],
  visualHistoryFuture: [],
  codeHistoryPast: [],
  codeHistoryFuture: [],
  

  // Actions
  recordVisualChange: (patches) => {
  set((state: any) => ({
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          patches,
          timestamp: Date.now(),
        },
      ].slice(-MAX_HISTORY_SIZE),
      visualHistoryFuture: [], // Clear redo stack on new change
    }));
  },

  recordStoragePoint: (contentHash: string) => {
    set((state: any) => ({
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          patches: [],
          timestamp: Date.now(),
          contentHash,
          isSavePoint: true,
        },
      ].slice(-MAX_HISTORY_SIZE),
      visualHistoryFuture: [], // clear redo stack on storage
    }));
  },

  recordCodeChange: (previousSource) => {
  set((state: any) => ({
      codeHistoryPast: [
        ...state.codeHistoryPast,
        {
          source: previousSource,
          timestamp: Date.now(),
        },
      ].slice(-MAX_HISTORY_SIZE),
      codeHistoryFuture: [], // Clear redo stack on new change
    }));
  },

  recordCodeStoragePoint: (contentHash: string) => {
    set((state: any) => ({
      codeHistoryPast: [
        ...state.codeHistoryPast,
        {
          source: '',
          timestamp: Date.now(),
          contentHash,
          isSavePoint: true,
        },
      ].slice(-MAX_HISTORY_SIZE),
      codeHistoryFuture: [],
    }));
  },

    canUndoVisual: () => {
    return get().visualHistoryPast.length > 0;
  },

  canRedoVisual: () => {
    return get().visualHistoryFuture.length > 0;
  },

  canUndoCode: () => {
    return get().codeHistoryPast.length > 0;
  },

  canRedoCode: () => {
    return get().codeHistoryFuture.length > 0;
  },

  clearHistory: () => {
    set({
      visualHistoryPast: [],
      visualHistoryFuture: [],
      codeHistoryPast: [],
      codeHistoryFuture: [],
    });
  },
  

  undoVisualToolEdit: () => {
    const past = get().visualHistoryPast;
    if (!past || past.length === 0) return;

    // Find the most recent non-save-point entry to undo
    let undoIndex = past.length - 1;
    while (undoIndex >= 0 && past[undoIndex].isSavePoint) {
      undoIndex--;
    }
    if (undoIndex < 0) return; // nothing to undo

    const entryToUndo = past[undoIndex];

    // Apply inverse patches
    entryToUndo.patches.forEach((patch: HistoryPatch) => {
      if (patch.op === 'add') {
        // inverse of add is remove
        if (patch.isGlobal) {
          get().removeGlobalDesignerEdit(patch.path);
        } else {
          get().removeSchemeDesignerEdit(patch.scheme!, patch.path);
        }
      } else if (patch.op === 'remove') {
        // inverse of remove is add with oldValue
        if (patch.isGlobal) {
          get().addGlobalDesignerEdit(patch.path, patch.oldValue!);
        } else {
          get().addSchemeDesignerEdit(patch.scheme!, patch.path, patch.oldValue!);
        }
      }
    });

    // Move undone entry and any later entries to the future (redo) stack
    set((state: any) => ({
      visualHistoryPast: state.visualHistoryPast.slice(0, undoIndex),
      visualHistoryFuture: [
        ...state.visualHistoryFuture,
        ...state.visualHistoryPast.slice(undoIndex),
      ].slice(-MAX_HISTORY_SIZE),
    }));
  },

  redoVisualToolEdit: () => {
    const future = get().visualHistoryFuture;
    if (!future || future.length === 0) return;

    // Find the first non-save-point entry in future to redo
    let redoIndex = 0;
    while (redoIndex < future.length && future[redoIndex].isSavePoint) {
      redoIndex++;
    }
    if (redoIndex >= future.length) return; // nothing to redo

    const entryToRedo = future[redoIndex];

    // Apply patches forward
    entryToRedo.patches.forEach((patch: HistoryPatch) => {
      if (patch.op === 'add') {
        if (patch.isGlobal) {
          get().addGlobalDesignerEdit(patch.path, patch.newValue!);
        } else {
          get().addSchemeDesignerEdit(patch.scheme!, patch.path, patch.newValue!);
        }
      }
      // remove ops are already reflected by the current state
    });

    // Move the redone entry and any preceding save points to past
    set((state: any) => ({
      visualHistoryPast: [
        ...state.visualHistoryPast,
        ...state.visualHistoryFuture.slice(0, redoIndex + 1),
      ].slice(-MAX_HISTORY_SIZE),
      visualHistoryFuture: state.visualHistoryFuture.slice(redoIndex + 1),
    }));
  },

  getVisualHistory: () => {
    const state = get();
    return {
      past: state.visualHistoryPast,
      future: state.visualHistoryFuture,
    };
  },

  getCodeHistory: () => {
    const state = get();
    return {
      past: state.codeHistoryPast,
      future: state.codeHistoryFuture,
    };
  },
  undoCodeOverride: () => {
    const past = get().codeHistoryPast;
    if (!past || past.length === 0) return;

    // Find most recent non-save-point entry
    let undoIndex = past.length - 1;
    while (undoIndex >= 0 && past[undoIndex].isSavePoint) {
      undoIndex--;
    }
    if (undoIndex < 0) return;

    const entryToUndo = past[undoIndex];

    set((state: any) => ({
      codeHistoryPast: state.codeHistoryPast.slice(0, undoIndex),
      codeHistoryFuture: [
        ...state.codeHistoryFuture,
        ...state.codeHistoryPast.slice(undoIndex),
      ].slice(-MAX_HISTORY_SIZE),
      codeOverridesSource: entryToUndo.source,
      codeOverridesDsl: {},
    }));
  },

  redoCodeOverride: () => {
    const future = get().codeHistoryFuture;
    if (!future || future.length === 0) return;

    // Find first non-save-point entry in future
    let redoIndex = 0;
    while (redoIndex < future.length && future[redoIndex].isSavePoint) {
      redoIndex++;
    }
    if (redoIndex >= future.length) return;

    const entryToRedo = future[redoIndex];

    set((state: any) => ({
      codeHistoryPast: [
        ...state.codeHistoryPast,
        ...state.codeHistoryFuture.slice(0, redoIndex + 1),
      ].slice(-MAX_HISTORY_SIZE),
      codeHistoryFuture: state.codeHistoryFuture.slice(redoIndex + 1),
      codeOverridesSource: entryToRedo.source,
      codeOverridesDsl: {},
    }));
  },
});

// ===== Helper Functions for Creating Patches =====

/**
 * Create a patch for adding/updating a visual edit.
 */
export function createAddPatch(
  path: string,
  newValue: SerializableValue,
  oldValue: SerializableValue | undefined,
  scheme?: 'light' | 'dark',
  isGlobal?: boolean
): HistoryPatch {
  return {
    op: 'add',
    path,
    oldValue,
    newValue,
    scheme,
    isGlobal,
  };
}

/**
 * Create a patch for removing a visual edit.
 */
export function createRemovePatch(
  path: string,
  oldValue: SerializableValue,
  scheme?: 'light' | 'dark',
  isGlobal?: boolean
): HistoryPatch {
  return {
    op: 'remove',
    path,
    oldValue,
    scheme,
    isGlobal,
  };
}
