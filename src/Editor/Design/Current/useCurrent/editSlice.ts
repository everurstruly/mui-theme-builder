import type { StateCreator } from "zustand";
import { serializeThemeOptions } from "../../compiler";
import type {
  SchemeEdits,
  CurrentDesignEditStore,
  CurrentDesignEditState,
} from "./types";
import templatesRegistry from "../../../Templates/registry";
import { createAddPatch, createRemovePatch } from "./historySlice";
import type { CurrentDesignStore } from "./types";

export const createEditSlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignEditStore
> = (set, get) => ({
  title: templatesRegistry.material.label,
  baseThemeOptionSource: generateDefaultBaseThemeOption(),
  baseThemeOptionSourceMetadata: {
    templateId: templatesRegistry.material.id,
    createdAtTimestamp: Date.now(),
    lastModifiedTimestamp: Date.now(),
  },

  neutralEdits: {},
  schemeEdits: {
    light: createInitialSchemeEdits(),
    dark: createInitialSchemeEdits(),
  },

  codeOverridesSource: "",
  codeOverridesDsl: {},
  codeOverridesEdits: {},
  codeOverridesError: null,

  contentHash: generateInitialContentHash(),
  checkpointHash: null,
  modificationTimestamps: {},

  setTitle: (title: string) => {
    set((state) => {
      const newState: Partial<CurrentDesignEditStore> = { title };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          title: Date.now(),
        },
      };
    });
  },

  setBaseThemeOption: (themeCodeOrDsl, metadata) => {
    const codeString =
      typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : sortedStringify(themeCodeOrDsl);

    set((state) => {
      const newState: Partial<CurrentDesignEditStore> = {
        baseThemeOptionSource: codeString,
        baseThemeOptionSourceMetadata: {
          ...state.baseThemeOptionSourceMetadata,
          ...metadata,
          lastModifiedTimestamp: Date.now(),
        },
        title: metadata?.title ?? state.title,
      };

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          baseThemeOptionSource: Date.now(),
        },
      };
    });
  },

  addNeutralDesignerEdit: (path, value) => {
    set((state) => {
      const current = state.neutralEdits[path];
      if (current === value) return state; // Skip if no change

      // Record history patch for this change
      try {
        const patch = createAddPatch(path, value, current, undefined, true);
        get().recordVisualChange?.([patch]);
      } catch {
        // non-fatal; continue
      }

      const newEdits = {
        ...state.neutralEdits,
        [path]: value,
      };

      const newState: Partial<CurrentDesignEditStore> = { neutralEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });
      
      console.log('[EDIT DEBUG] addNeutralDesignerEdit', {
        path,
        oldCheckpoint: state.checkpointHash,
        newContentHash: contentHash,
        isDirty: state.checkpointHash !== null && contentHash !== state.checkpointHash
      });

      return {
        ...newState,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  addSchemeDesignerEdit: (scheme, path, value) => {
    set((state) => {
      const schemeObj = state.schemeEdits[scheme] || { designer: {} };
      const current = schemeObj.designer[path];
      if (current === value) return state;

      // Record history patch for scheme-specific change
      try {
        const patch = createAddPatch(path, value, current, scheme, false);
        get().recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes: CurrentDesignEditStore["schemeEdits"] = {
        ...state.schemeEdits,
        [scheme]: {
          ...schemeObj,
          designer: {
            ...(schemeObj.designer || {}),
            [path]: value,
          },
        },
      };

      const newState: Partial<CurrentDesignEditStore> = { schemeEdits: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });
      
      console.log('[EDIT DEBUG] addSchemeDesignerEdit', {
        scheme,
        path,
        oldCheckpoint: state.checkpointHash,
        newContentHash: contentHash,
        isDirty: state.checkpointHash !== null && contentHash !== state.checkpointHash
      });

      return {
        schemeEdits: newSchemes,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  removeNeutralDesignerEdit: (path) => {
    set((state) => {
      const newEdits = { ...state.neutralEdits };
      if (!(path in newEdits)) return state;
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch
      try {
        const patch = createRemovePatch(path, oldValue, undefined, true);
        get().recordVisualChange?.([patch]);
      } catch {
        // ignore
      }
      const newState: Partial<CurrentDesignEditStore> = { neutralEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        neutralEdits: newEdits,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  removeSchemeDesignerEdit: (scheme, path) => {
    set((state) => {
      const schemeEdits = state.schemeEdits[scheme];
      if (!schemeEdits) return state;

      if (!(path in schemeEdits.designer)) return state;

      const newEdits = { ...schemeEdits.designer };
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch for scheme edit
      try {
        const patch = createRemovePatch(path, oldValue, scheme, false);
        get().recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes: CurrentDesignEditStore["schemeEdits"] = {
        ...state.schemeEdits,
        [scheme]: {
          ...schemeEdits,
          designer: newEdits,
        },
      };

      const newState: Partial<CurrentDesignEditStore> = { schemeEdits: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        schemeEdits: newSchemes,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  getDesignerNeutralEdit: (path) => {
    return get().neutralEdits[path];
  },

  getDesignerSchemeEdit: (scheme, path) => {
    const schemeEdits = get().schemeEdits[scheme];
    return schemeEdits?.designer[path];
  },

  // Backward compatibility helper - merges neutral + scheme edits
  getDeveloperToolEdit: (path: string, scheme: string) => {
    const state = get();
    return {
      ...state.neutralEdits,
      ...(state.schemeEdits[scheme]?.designer || {}),
    }[path];
  },

  clearDesignerEdits: (scope, scheme) => {
    if (scope === "global") {
      set((state) => {
        const newState: Partial<CurrentDesignEditStore> = { neutralEdits: {} };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          neutralEdits: {},
          contentHash,
          saveStatus: 'idle',
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["designer:global:clear"]: Date.now(),
          },
        };
      });
    } else if (scope === "current-scheme") {
      set((state) => {
        const newSchemes: CurrentDesignEditStore["schemeEdits"] = {
          ...state.schemeEdits,
          [scheme]: {
            ...state.schemeEdits[scheme],
            designer: {},
          },
        };
        const newState: Partial<CurrentDesignEditStore> = {
          schemeEdits: newSchemes,
        };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          schemeEdits: newSchemes,
          contentHash,
          saveStatus: 'idle',
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["designer:scheme:clear:" + scheme]: Date.now(),
          },
        };
      });
    } else {
      set((state) => {
        const newState: Partial<CurrentDesignEditStore> = {
          neutralEdits: {},
          schemeEdits: {
            light: createInitialSchemeEdits(),
            dark: createInitialSchemeEdits(),
          },
        };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          neutralEdits: {},
          schemeEdits: {
            light: createInitialSchemeEdits(),
            dark: createInitialSchemeEdits(),
          },
          contentHash,
          saveStatus: 'idle',
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["designer:all:clear"]: Date.now(),
          },
        };
      })
    }
  },

  setCodeOverrides: (source, dsl, flattened, error) => {
    set((state) => {
      const previousSource = state.codeOverridesSource;

      // Record code history (previous source) for undo
      try {
        get().recordCodeChange?.(previousSource);
      } catch {
        // ignore
      }

      const newState: Partial<CurrentDesignEditStore> = {
        codeOverridesSource: source,
        codeOverridesDsl: dsl,
        codeOverridesEdits: flattened,
        codeOverridesError: error,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          codeOverrides: Date.now(),
        },
      };
    });
  },

  clearCodeOverrides: () => {
    set((state) => {
      const newState: Partial<CurrentDesignEditStore> = {
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        saveStatus: 'idle',
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["codeOverrides:clear"]: Date.now(),
        },
      };
    });
  },

  hydrate: (snapshot, options = {}) => {
    set((state) => {
      // Resolve base theme DSL
      let baseDsl = snapshot.baseTheme.type === 'inline' 
        ? snapshot.baseTheme.dsl 
        : {};
      const baseMetadata = snapshot.baseTheme.metadata;

      // If reference type, resolve from template registry
      if (snapshot.baseTheme.type === 'reference') {
        const templateId = snapshot.baseTheme.reference.templateId;
        const template = templatesRegistry[templateId];
        if (template) {
          baseDsl = JSON.parse(serializeThemeOptions(template.themeOptions));
        }
      }

      const baseThemeSource = sortedStringify(baseDsl);

      // Build new state
      const newState: Partial<CurrentDesignEditStore> = {
        title: snapshot.title,
        baseThemeOptionSource: baseThemeSource,
        baseThemeOptionSourceMetadata: {
          templateId: baseMetadata.templateId,
          createdAtTimestamp: snapshot.createdAt,
          lastModifiedTimestamp: snapshot.updatedAt ?? snapshot.createdAt,
        },
        // Always start with empty edits - old snapshots are migrated by flattening into base
        neutralEdits: {},
        schemeEdits: {
          light: { designer: {} },
          dark: { designer: {} },
        },
        codeOverridesSource: '',
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };

      // Compute content hash based on hydrated state
      const contentHash = computeContentHash({ ...state, ...newState });

      // Only set checkpoint if this is a saved design (has persistenceSnapshotId)
      // Otherwise leave checkpoint null so design shows as unsaved
      const checkpointHash = options.isSaved ? contentHash : null;

      const result = {
        ...newState,
        contentHash,
        checkpointHash,
        saveStatus: 'idle' as const, // Reset save status on load
        modificationTimestamps: {},
        // Clear undo/redo history - loading a saved design starts a fresh editing session
        visualHistoryPast: [],
        visualHistoryFuture: [],
        codeHistoryPast: [],
        codeHistoryFuture: [],
      };

      // DEV-ONLY: Validate state after hydrate
      validateHydrateState(result, options.isSaved);

      return result;
    });
  },

  loadNew: (themeCodeOrDsl, metadata) => {
    // If caller doesn't provide a theme, store will use its internal default.
    const codeString = themeCodeOrDsl
      ? typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl)
      : generateDefaultBaseThemeOption();

    set((state) => {
      const newState: Partial<CurrentDesignEditStore> = {
        title: metadata?.title || templatesRegistry.material.label,
        baseThemeOptionSource: codeString,
        baseThemeOptionSourceMetadata: {
          templateId:
            metadata?.templateId ?? (themeCodeOrDsl ? undefined : "material"),
          createdAtTimestamp: Date.now(),
          lastModifiedTimestamp: Date.now(),
        },
        neutralEdits: {},
        schemeEdits: {
          light: createInitialSchemeEdits(),
          dark: createInitialSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        checkpointHash: null, // Fresh designs are unsaved - no checkpoint yet
        modificationTimestamps: {
          ...state.modificationTimestamps,
          loadNew: Date.now(),
        },
        // Clear undo/redo history so previous design's edits don't carry over
        visualHistoryPast: [],
        visualHistoryFuture: [],
        codeHistoryPast: [],
        codeHistoryFuture: [],
      };
    });
  },

  resetToBase: () => {
    set((state) => {
      const newState: Partial<CurrentDesignEditStore> = {
        neutralEdits: {},
        schemeEdits: {
          light: createInitialSchemeEdits(),
          dark: createInitialSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesEdits: {},
        codeOverridesError: null,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          resetToBase: Date.now(),
        },
      };
    });
  },

  setCheckpoint: (hash: string) => {
    set({ checkpointHash: hash });
  },

  clearCheckpoint: () => {
    set({ checkpointHash: null });
  },
});

function generateDefaultBaseThemeOption(): string {
  return serializeThemeOptions(templatesRegistry.material.themeOptions);
}

// Helper: compute a deterministic content hash for dirty checking
// Uses sorted JSON keys to ensure consistent hashing regardless of object key order
function sortedStringify(obj: any): string {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(sortedStringify).join(',')}]`;
  
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(k => `"${k}":${sortedStringify(obj[k])}`);
  return `{${pairs.join(',')}}`;
}

export function computeContentHash(state: Partial<CurrentDesignEditState>): string {
  const content = {
    base: state.baseThemeOptionSource,
    neutral: state.neutralEdits,
    schemes: state.schemeEdits,
    codeOverrides: state.codeOverridesEdits,
  };
  
  // Use sorted stringify for deterministic hashing
  const serialized = sortedStringify(content);
  
  // Simple but stable hash (FNV-1a variant)
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  
  return (hash >>> 0).toString(36);
}

function createInitialSchemeEdits(): SchemeEdits {
  return { designer: {} };
}

function generateInitialContentHash() {
  return computeContentHash({
    baseThemeOptionSource: generateDefaultBaseThemeOption(),
    codeOverridesEdits: {},
    neutralEdits: {},
    schemeEdits: {
      light: { designer: {} },
      dark: { designer: {} },
    },
  });
}

/**
 * Validate state after hydrate to catch bugs early
 */
function validateHydrateState(state: any, isSaved?: boolean): void {
  // Only in development - use console check as guard
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  if (!isDev) return;

  // Rule 1: saveStatus must always be 'idle' after hydrate
  if (state.saveStatus !== 'idle') {
    console.error(
      `[HYDRATE VIOLATION] saveStatus must be 'idle' after hydrate, got: "${state.saveStatus}". ` +
      `This will cause SaveButton to show wrong label.`
    );
  }

  // Rule 2: Edits must be empty (flattened architecture)
  const hasNeutralEdits = Object.keys(state.neutralEdits || {}).length > 0;
  const hasSchemeEdits = 
    Object.keys(state.schemeEdits?.light?.designer || {}).length > 0 ||
    Object.keys(state.schemeEdits?.dark?.designer || {}).length > 0;

  if (hasNeutralEdits || hasSchemeEdits) {
    console.error(
      `[HYDRATE VIOLATION] Edits must be empty after hydrate (flattened architecture). ` +
      `Found neutral: ${hasNeutralEdits}, scheme: ${hasSchemeEdits}`
    );
  }

  // Rule 3: History must be cleared
  if (state.visualHistoryPast?.length > 0 || state.visualHistoryFuture?.length > 0) {
    console.error(
      `[HYDRATE VIOLATION] History must be cleared after hydrate. ` +
      `Found past: ${state.visualHistoryPast?.length}, future: ${state.visualHistoryFuture?.length}`
    );
  }

  // Rule 4: Checkpoint should match isSaved flag
  if (isSaved && !state.checkpointHash) {
    console.warn(
      `[HYDRATE WARNING] Loading saved design but checkpointHash is null. ` +
      `This will show as dirty immediately.`
    );
  }
  if (!isSaved && state.checkpointHash) {
    console.error(
      `[HYDRATE VIOLATION] Loading unsaved design but checkpointHash is set. ` +
      `This will prevent "Save to Collection" from showing.`
    );
  }
}
