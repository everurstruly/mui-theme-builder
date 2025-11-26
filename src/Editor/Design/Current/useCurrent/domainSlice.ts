/**
 * Domain Slice - Pure Theme Design Model
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
export interface ThemeDesignDomainState {
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

  /** Version counter - incremented on any domain change */
  modificationVersion: number;

  /** Last saved version - for dirty checking */
  lastStoredModificationVersion: number;
}

/**
 * Domain actions - mutations on the theme design model.
 */
export interface ThemeDesignDomainActions {
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
  acknowledgeStoredVersion: () => void;
}

export type ThemeDesignDomainSlice = ThemeDesignDomainState &
  ThemeDesignDomainActions;

// ===== Initial State Factory =====

function createInitialColorSchemeEdits(): ColorSchemeEdits {
  return { visualToolEdits: {} };
}

function createInitialMetadata(): ThemeMetadata {
  return {
    createdAtTimestamp: Date.now(),
    lastModifiedTimestamp: Date.now(),
  };
}

// ===== Slice Creator =====

export const createDomainSlice: StateCreator<
  ThemeDesignDomainSlice,
  [],
  [],
  ThemeDesignDomainSlice
> = (set, get) => ({
  // Initial state
  title: "MUI Default",
  baseThemeCode: "",
  baseThemeMetadata: createInitialMetadata(),
  colorSchemeIndependentVisualToolEdits: {},
  colorSchemes: {
    light: createInitialColorSchemeEdits(),
    dark: createInitialColorSchemeEdits(),
  },
  codeOverridesSource: "",
  codeOverridesDsl: {},
  codeOverridesFlattened: {},
  codeOverridesError: null,
  modificationVersion: 0,
  lastStoredModificationVersion: 0,

  // Actions
  setTitle: (title: string) => {
    set({
      title,
      modificationVersion: get().modificationVersion + 1,
    });
  },

  setBaseTheme: (themeCodeOrDsl, metadata) => {
    const codeString =
      typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl);

    set((state) => ({
      baseThemeCode: codeString,
      baseThemeMetadata: {
        ...state.baseThemeMetadata,
        ...metadata,
        lastModifiedTimestamp: Date.now(),
      },
      title: metadata?.title ?? state.title,
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  addGlobalVisualEdit: (path, value) => {
    set((state) => ({
      colorSchemeIndependentVisualToolEdits: {
        ...state.colorSchemeIndependentVisualToolEdits,
        [path]: value,
      },
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  addSchemeVisualEdit: (scheme, path, value) => {
    set((state) => ({
      colorSchemes: {
        ...state.colorSchemes,
        [scheme]: {
          ...state.colorSchemes[scheme],
          visualToolEdits: {
            ...(state.colorSchemes[scheme]?.visualToolEdits || {}),
            [path]: value,
          },
        },
      },
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  removeGlobalVisualEdit: (path) => {
    set((state) => {
      const newEdits = { ...state.colorSchemeIndependentVisualToolEdits };
      delete newEdits[path];
      return {
        colorSchemeIndependentVisualToolEdits: newEdits,
        modificationVersion: state.modificationVersion + 1,
      };
    });
  },

  removeSchemeVisualEdit: (scheme, path) => {
    set((state) => {
      const schemeEdits = state.colorSchemes[scheme];
      if (!schemeEdits) return state;

      const newEdits = { ...schemeEdits.visualToolEdits };
      delete newEdits[path];
      return {
        colorSchemes: {
          ...state.colorSchemes,
          [scheme]: {
            ...schemeEdits,
            visualToolEdits: newEdits,
          },
        },
        modificationVersion: state.modificationVersion + 1,
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
      set((state) => ({
        colorSchemeIndependentVisualToolEdits: {},
        modificationVersion: state.modificationVersion + 1,
      }));
    } else if (scope === "current-scheme") {
      set((state) => ({
        colorSchemes: {
          ...state.colorSchemes,
          [scheme]: {
            ...state.colorSchemes[scheme],
            visualToolEdits: {},
          },
        },
        modificationVersion: state.modificationVersion + 1,
      }));
    } else {
      set((state) => ({
        colorSchemeIndependentVisualToolEdits: {},
        colorSchemes: {
          light: createInitialColorSchemeEdits(),
          dark: createInitialColorSchemeEdits(),
        },
        modificationVersion: state.modificationVersion + 1,
      }));
    }
  },

  setCodeOverrides: (source, dsl, flattened, error) => {
    set((state) => ({
      codeOverridesSource: source,
      codeOverridesDsl: dsl,
      codeOverridesFlattened: flattened,
      codeOverridesError: error,
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  clearCodeOverrides: () => {
    set((state) => ({
      codeOverridesSource: "",
      codeOverridesDsl: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  loadNew: (themeCodeOrDsl, metadata) => {
    const codeString = themeCodeOrDsl
      ? typeof themeCodeOrDsl === "string"
        ? themeCodeOrDsl
        : JSON.stringify(themeCodeOrDsl)
      : "";

    set({
      title: metadata?.title || "MUI Default",
      baseThemeCode: codeString,
      baseThemeMetadata: {
        sourceTemplateId: metadata?.sourceTemplateId,
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
      modificationVersion: 0, // Reset version on new load
    });
  },

  resetToBase: () => {
    set((state) => ({
      colorSchemeIndependentVisualToolEdits: {},
      colorSchemes: {
        light: createInitialColorSchemeEdits(),
        dark: createInitialColorSchemeEdits(),
      },
      codeOverridesSource: "",
      codeOverridesDsl: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      modificationVersion: state.modificationVersion + 1,
    }));
  },

  acknowledgeStoredVersion: () => {
    set((state) => ({
      lastStoredModificationVersion: state.modificationVersion,
    }));
  },
});
