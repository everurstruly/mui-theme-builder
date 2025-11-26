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
}

/**
 * Code override history entry.
 */
export interface CodeHistoryEntry {
  /** Previous source code */
  source: string;
  
  /** Timestamp */
  timestamp: number;
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

export type ThemeDesignHistorySlice = ThemeDesignHistoryState & ThemeDesignHistoryActions;

// ===== Constants =====

const MAX_HISTORY_SIZE = 50;

// ===== Slice Creator =====

export const createHistorySlice: StateCreator<
  any,
  [],
  [],
  ThemeDesignHistorySlice
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
    const prev = past[past.length - 1];
    set((state: any) => ({
      visualHistoryPast: state.visualHistoryPast.slice(0, -1),
      visualHistoryFuture: [
        ...state.visualHistoryFuture,
        {
          baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
          light: state.colorSchemes?.light?.visualToolEdits || {},
          dark: state.colorSchemes?.dark?.visualToolEdits || {},
        },
      ].slice(-MAX_HISTORY_SIZE),
      colorSchemeIndependentVisualToolEdits: prev.baseVisualToolEdits,
      colorSchemes: {
        ...state.colorSchemes,
        light: { ...state.colorSchemes.light, visualToolEdits: prev.light },
        dark: { ...state.colorSchemes.dark, visualToolEdits: prev.dark },
      },
    }));
  },

  redoVisualToolEdit: () => {
  const future = get().visualHistoryFuture;
  if (!future || future.length === 0) return;
  const next = future[future.length - 1];
  set((state: any) => ({
      visualHistoryFuture: state.visualHistoryFuture.slice(0, -1),
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
          light: state.colorSchemes?.light?.visualToolEdits || {},
          dark: state.colorSchemes?.dark?.visualToolEdits || {},
        },
      ].slice(-MAX_HISTORY_SIZE),
      colorSchemeIndependentVisualToolEdits: next.baseVisualToolEdits,
      colorSchemes: {
        ...state.colorSchemes,
        light: { ...state.colorSchemes.light, visualToolEdits: next.light },
        dark: { ...state.colorSchemes.dark, visualToolEdits: next.dark },
      },
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
    const prevSource = past[past.length - 1];
    set((state: any) => ({
      codeHistoryPast: state.codeHistoryPast.slice(0, -1),
      codeHistoryFuture: [...state.codeHistoryFuture, state.codeOverridesSource].slice(-MAX_HISTORY_SIZE),
      codeOverridesSource: prevSource,
      // Do not attempt to re-run transformations here (avoids circular imports/require). Clear DSL and let callers re-transform if needed.
      codeOverridesDsl: {},
    }));
  },

  redoCodeOverride: () => {
    const future = get().codeHistoryFuture;
    if (!future || future.length === 0) return;
    const nextSource = future[future.length - 1];
    set((state: any) => ({
      codeHistoryFuture: state.codeHistoryFuture.slice(0, -1),
        codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(-MAX_HISTORY_SIZE),
        codeOverridesSource: nextSource,
        // Do not attempt to re-run transformations here. Keep DSL empty; callers may re-run transform.
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
