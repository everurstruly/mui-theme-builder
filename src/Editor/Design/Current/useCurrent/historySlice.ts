import type { StateCreator } from "zustand";
import type { CurrentDesignStore } from ".";
import type {
  CurrentDesignHistorySlice,
  HistoryPatch,
  SerializableValue,
} from "./types";

const MAX_HISTORY_SIZE = 50;

export const createHistorySlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignHistorySlice
> = (set, get) => ({
  visualHistoryPast: [],
  visualHistoryFuture: [],
  codeHistoryPast: [],
  codeHistoryFuture: [],

  // Actions
  recordVisualChange: (patches) => {
    set((state) => ({
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
    set((state) => ({
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
    set((state) => ({
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
    set((state) => ({
      codeHistoryPast: [
        ...state.codeHistoryPast,
        {
          source: "",
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
      if (patch.op === "add") {
        // inverse of add is remove
        if (patch.isGlobal) {
          get().removeNeutralDesignerEdit(patch.path);
        } else {
          get().removeSchemeDesignerEdit(patch.scheme!, patch.path);
        }
      } else if (patch.op === "remove") {
        // inverse of remove is add with oldValue
        if (patch.isGlobal) {
          get().addNeutralDesignerEdit(patch.path, patch.oldValue!);
        } else {
          get().addSchemeDesignerEdit(patch.scheme!, patch.path, patch.oldValue!);
        }
      }
    });

    // Move undone entry and any later entries to the future (redo) stack
    set((state) => ({
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
      if (patch.op === "add") {
        if (patch.isGlobal) {
          get().addNeutralDesignerEdit(patch.path, patch.newValue!);
        } else {
          get().addSchemeDesignerEdit(patch.scheme!, patch.path, patch.newValue!);
        }
      }
      // remove ops are already reflected by the current state
    });

    // Move the redone entry and any preceding save points to past
    set((state) => ({
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

    set((state) => ({
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

    set((state) => ({
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
  scheme?: string,
  isGlobal?: boolean
): HistoryPatch {
  return {
    op: "add",
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
  scheme?: string,
  isGlobal?: boolean
): HistoryPatch {
  return {
    op: "remove",
    path,
    oldValue,
    scheme,
    isGlobal,
  };
}
