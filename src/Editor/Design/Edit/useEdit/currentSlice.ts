/**
 * Current Slice - Pure Theme Design Model
 *
 * Responsibilities:
 * - Store base theme representation (DSL format)
 * - Store visual tool edits (UI-driven modifications)
 * - Store code overrides (developer-driven modifications)
 * - Maintain theme metadata and provenance
 *
 * Does NOT contain:
 * - UI state (activeColorScheme, selectedPreview, etc.)
 * - History/undo/redo logic
 * - Storage status
 * - Compiler/transformation logic
 * - Runtime decisions (no isColorSchemePath checks)
 *
 * Actions are DUMB mutations:
 * - Caller provides all context (scheme, path, value)
 * - No service calls (themeCompiler)
 * - No conditional routing
 */

import type { StateCreator } from "zustand";
import type { ThemeDsl } from "../../compiler";
import { serializeThemeOptions } from "../../compiler";
import templatesRegistry from "../../../Templates/registry";
import { createAddPatch, createRemovePatch } from "./historySlice";

// Helper: store-owned default base theme code
function getDefaultBaseThemeCode(): string {
  return serializeThemeOptions(templatesRegistry.material.themeOptions);
}

// Helper: compute a deterministic content hash (JSON string) for dirty checking
// Only includes the serializable parts relevant to storage/dirty checks.
export function computeContentHash(state: any): string {
  const content = {
    baseTheme: state.baseThemeCode,
    visualEdits: {
      global: state.colorSchemeIndependentVisualToolEdits,
      schemes: state.colorSchemes,
    },
    codeOverrides: state.codeOverridesFlattened,
  };
  return JSON.stringify(content);
}

// ===== Types =====

export type SerializableValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * Color-scheme-specific modifications.
 * Only palette.* and shadows paths are color-scheme scoped.
 */
export interface ColorSchemeEdits {
  /** Visual edits for color-scheme paths (palette.*, shadows) */
  visualToolEdits: Record<string, SerializableValue>;
}

/**
 * Base theme metadata for provenance tracking.
 */
export interface ThemeMetadata {
  sourceTemplateId?: string;
  createdAtTimestamp: number;
  lastModifiedTimestamp: number;
}

/**
 * Domain state - pure theme design model.
 */
export interface ThemeCurrentState {
  /** Human-readable design title */
  title: string;

  /** Base theme as JSON string (DSL format) */
  baseThemeCode: string;

  /** Base theme metadata */
  baseThemeMetadata: ThemeMetadata;

  /** Global visual edits (typography, spacing, shape, breakpoints, etc.) */
  colorSchemeIndependentVisualToolEdits: Record<string, SerializableValue>;

  /**
   * Color scheme-specific edits (palette.*, shadows).
   * Supports any scheme name: 'light', 'dark', 'high-contrast', 'sepia', etc.
   * Future-proofs for MUI v6+ custom color schemes.
   */
  colorSchemes: Record<string, ColorSchemeEdits>;

  /** Code overrides source (raw JavaScript/TypeScript) */
  codeOverridesSource: string;

  /** Code overrides as DSL (safe, serializable) */
  codeOverridesDsl: ThemeDsl;

  /** Code overrides flattened for path lookups */
  codeOverridesFlattened: Record<string, SerializableValue>;

  /** Code override error, if any */
  codeOverridesError: string | null;

  /** Content hash of the serializable parts of the design */
  contentHash: string;

  /** Last stored content hash - for dirty checking */
  lastStoredContentHash: string;

  /** Per-path modification timestamps (ms since epoch) */
  modificationTimestamps: Record<string, number>;
}

/**
 * Domain actions - mutations on the theme design model.
 */
export interface ThemeCurrentActions {
  /** Set design title */
  setTitle: (title: string) => void;

  /** Set or update base theme */
  setBaseTheme: (
    themeCodeOrDsl: string | ThemeDsl,
    metadata?: Partial<ThemeMetadata> & { title?: string }
  ) => void;

  /** Add or update a global visual edit (typography, spacing, shape, etc.) */
  addGlobalVisualEdit: (path: string, value: SerializableValue) => void;

  /** Add or update a scheme-specific visual edit (palette.*, shadows) */
  addSchemeVisualEdit: (
    scheme: string,
    path: string,
    value: SerializableValue
  ) => void;

  /** Remove a global visual edit */
  removeGlobalVisualEdit: (path: string) => void;

  /** Remove a scheme-specific visual edit */
  removeSchemeVisualEdit: (scheme: string, path: string) => void;

  /** Get a global visual edit value */
  getGlobalVisualEdit: (path: string) => SerializableValue;

  /** Get a scheme-specific visual edit value */
  getSchemeVisualEdit: (scheme: string, path: string) => SerializableValue;

  /** Clear visual edits */
  clearVisualEdits: (
    scope: "global" | "current-scheme" | "all",
    scheme: string
  ) => void;

  /** Set code overrides (pre-transformed by caller) */
  setCodeOverrides: (
    source: string,
    dsl: ThemeDsl,
    flattened: Record<string, SerializableValue>,
    error: string | null
  ) => void;

  /** Clear code overrides */
  clearCodeOverrides: () => void;

  /** Load a completely new design */
  loadNew: (
    themeCodeOrDsl?: string | ThemeDsl,
    metadata?: Partial<ThemeMetadata> & { title?: string }
  ) => void;

  /** Reset to base theme (clear all edits) */
  resetToBase: () => void;

  /** Mark current version as saved */
  acknowledgeStoredModifications: () => void;
}

export type DesignEditCurrentSlice = ThemeCurrentState & ThemeCurrentActions;

// ===== Initial State Factory =====

function createInitialColorSchemeEdits(): ColorSchemeEdits {
  return { visualToolEdits: {} };
}

// ===== Slice Creator =====

export const createCurrentSlice: StateCreator<
  DesignEditCurrentSlice,
  [],
  [],
  DesignEditCurrentSlice
> = (set, get) => ({
  // (Content hash helper moved to top-level `computeContentHash`)
  // Initial state - store supplies its own default baseline
  title: templatesRegistry.material.label,
  baseThemeCode: getDefaultBaseThemeCode(),
  baseThemeMetadata: {
    sourceTemplateId: "material",
    createdAtTimestamp: Date.now(),
    lastModifiedTimestamp: Date.now(),
  },
  colorSchemeIndependentVisualToolEdits: {},
  colorSchemes: {
    light: createInitialColorSchemeEdits(),
    dark: createInitialColorSchemeEdits(),
  },
  codeOverridesSource: "",
  codeOverridesDsl: {},
  codeOverridesFlattened: {},
  codeOverridesError: null,
  // Initial content hash computed from the initial state fields used in hashing
  contentHash: computeContentHash({
    baseThemeCode: getDefaultBaseThemeCode(),
    colorSchemeIndependentVisualToolEdits: {},
    colorSchemes: {
      light: { visualToolEdits: {} },
      dark: { visualToolEdits: {} },
    },
    codeOverridesFlattened: {},
  }),
  lastStoredContentHash: computeContentHash({
    baseThemeCode: getDefaultBaseThemeCode(),
    colorSchemeIndependentVisualToolEdits: {},
    colorSchemes: {
      light: { visualToolEdits: {} },
      dark: { visualToolEdits: {} },
    },
    codeOverridesFlattened: {},
  }),
  modificationTimestamps: {},

  // Actions
  setTitle: (title: string) => {
    set((state) => {
      const newState = { title };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          title: Date.now(),
        },
      };
    });
  },

  setBaseTheme: (themeCodeOrDsl, metadata) => {
    const codeString =
      typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl);

    set((state) => {
      const newState = {
        baseThemeCode: codeString,
        baseThemeMetadata: {
          ...state.baseThemeMetadata,
          ...metadata,
          lastModifiedTimestamp: Date.now(),
        },
        title: metadata?.title ?? state.title,
      };

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          baseThemeCode: Date.now(),
        },
      };
    });
  },

  addGlobalVisualEdit: (path, value) => {
    set((state) => {
      const current = state.colorSchemeIndependentVisualToolEdits[path];
      if (current === value) return state; // Skip if no change

      // Record history patch for this change
      try {
        const patch = createAddPatch(path, value, current, undefined, true);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // non-fatal; continue
      }

      const newEdits = {
        ...state.colorSchemeIndependentVisualToolEdits,
        [path]: value,
      };

      const newState = { colorSchemeIndependentVisualToolEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  addSchemeVisualEdit: (scheme, path, value) => {
    set((state) => {
      const schemeObj = state.colorSchemes[scheme] || { visualToolEdits: {} };
      const current = schemeObj.visualToolEdits[path];
      if (current === value) return state;

      // Record history patch for scheme-specific change
      try {
        const patch = createAddPatch(path, value, current, scheme as any, false);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes = {
        ...state.colorSchemes,
        [scheme]: {
          ...schemeObj,
          visualToolEdits: {
            ...(schemeObj.visualToolEdits || {}),
            [path]: value,
          },
        },
      };

      const newState = { colorSchemes: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        colorSchemes: newSchemes,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  removeGlobalVisualEdit: (path) => {
    set((state) => {
      const newEdits = { ...state.colorSchemeIndependentVisualToolEdits };
      if (!(path in newEdits)) return state;
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch
      try {
        const patch = createRemovePatch(path, oldValue, undefined, true);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }
      const newState = { colorSchemeIndependentVisualToolEdits: newEdits };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        colorSchemeIndependentVisualToolEdits: newEdits,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["global:" + path]: Date.now(),
        },
      };
    });
  },

  removeSchemeVisualEdit: (scheme, path) => {
    set((state) => {
      const schemeEdits = state.colorSchemes[scheme];
      if (!schemeEdits) return state;

      if (!(path in schemeEdits.visualToolEdits)) return state;

      const newEdits = { ...schemeEdits.visualToolEdits };
      const oldValue = newEdits[path];
      delete newEdits[path];

      // Record removal patch for scheme edit
      try {
        const patch = createRemovePatch(path, oldValue, scheme as any, false);
        (get() as any).recordVisualChange?.([patch]);
      } catch {
        // ignore
      }

      const newSchemes = {
        ...state.colorSchemes,
        [scheme]: {
          ...schemeEdits,
          visualToolEdits: newEdits,
        },
      };

      const newState = { colorSchemes: newSchemes };
      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        colorSchemes: newSchemes,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["scheme:" + scheme + ":" + path]: Date.now(),
        },
      };
    });
  },

  getGlobalVisualEdit: (path) => {
    return get().colorSchemeIndependentVisualToolEdits[path];
  },

  getSchemeVisualEdit: (scheme, path) => {
    const schemeEdits = get().colorSchemes[scheme];
    return schemeEdits?.visualToolEdits[path];
  },

  // Backward compatibility helper - merges global + scheme edits
  getVisualToolEdit: (path: string, scheme: string) => {
    const state = get();
    return {
      ...state.colorSchemeIndependentVisualToolEdits,
      ...(state.colorSchemes[scheme]?.visualToolEdits || {}),
    }[path];
  },

  clearVisualEdits: (scope, scheme) => {
    if (scope === "global") {
      set((state) => {
        const newState = { colorSchemeIndependentVisualToolEdits: {} };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          colorSchemeIndependentVisualToolEdits: {},
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:global:clear"]: Date.now(),
          },
        };
      });
    } else if (scope === "current-scheme") {
      set((state) => {
        const newSchemes = {
          ...state.colorSchemes,
          [scheme]: {
            ...state.colorSchemes[scheme],
            visualToolEdits: {},
          },
        };
        const newState = { colorSchemes: newSchemes };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          colorSchemes: newSchemes,
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:scheme:clear:" + scheme]: Date.now(),
          },
        };
      });
    } else {
      set((state) => {
        const newState = {
          colorSchemeIndependentVisualToolEdits: {},
          colorSchemes: {
            light: createInitialColorSchemeEdits(),
            dark: createInitialColorSchemeEdits(),
          },
        };
        const contentHash = computeContentHash({ ...state, ...newState });
        return {
          colorSchemeIndependentVisualToolEdits: {},
          colorSchemes: {
            light: createInitialColorSchemeEdits(),
            dark: createInitialColorSchemeEdits(),
          },
          contentHash,
          modificationTimestamps: {
            ...state.modificationTimestamps,
            ["visual:all:clear"]: Date.now(),
          },
        };
      });
    }
  },

  setCodeOverrides: (source, dsl, flattened, error) => {
    set((state) => {
      const previousSource = state.codeOverridesSource;

      // Record code history (previous source) for undo
      try {
        (get() as any).recordCodeChange?.(previousSource);
      } catch {
        // ignore
      }

      const newState = {
        codeOverridesSource: source,
        codeOverridesDsl: dsl,
        codeOverridesFlattened: flattened,
        codeOverridesError: error,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          codeOverrides: Date.now(),
        },
      };
    });
  },

  clearCodeOverrides: () => {
    set((state) => {
      const newState = {
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesFlattened: {},
        codeOverridesError: null,
      };
      const contentHash = computeContentHash({ ...state, ...newState });
      return {
        ...newState,
        contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          ["codeOverrides:clear"]: Date.now(),
        },
      };
    });
  },

  loadNew: (themeCodeOrDsl, metadata) => {
    // If caller doesn't provide a theme, store will use its internal default.
    const codeString = themeCodeOrDsl
      ? typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl)
      : getDefaultBaseThemeCode();

    set((state) => {
      const newState = {
        title: metadata?.title || templatesRegistry.material.label,
        baseThemeCode: codeString,
        baseThemeMetadata: {
          sourceTemplateId:
            metadata?.sourceTemplateId ?? (themeCodeOrDsl ? undefined : "material"),
          createdAtTimestamp: Date.now(),
          lastModifiedTimestamp: Date.now(),
        },
        colorSchemeIndependentVisualToolEdits: {},
        colorSchemes: {
          light: createInitialColorSchemeEdits(),
          dark: createInitialColorSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesFlattened: {},
        codeOverridesError: null,
      } as any;

      const contentHash = computeContentHash({ ...state, ...newState });

      return {
        ...newState,
        contentHash,
        lastStoredContentHash: contentHash,
        modificationTimestamps: {
          ...state.modificationTimestamps,
          loadNew: Date.now(),
        },
      } as any;
    });
  },

  resetToBase: () => {
    set((state) => {
      const newState = {
        colorSchemeIndependentVisualToolEdits: {},
        colorSchemes: {
          light: createInitialColorSchemeEdits(),
          dark: createInitialColorSchemeEdits(),
        },
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesFlattened: {},
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

  acknowledgeStoredModifications: () => {
    set((state) => ({
      lastStoredContentHash: state.contentHash,
    }));
  },
});
