import { create } from "zustand";
import { isColorSchemePath } from "./shared";
import { transformCodeToDsl } from "./domainSpecificLanguage/themeOptionsToDslTransformer";
import type { EditorExperienceId } from "./designExperience";
import type { ThemeDsl } from "./domainSpecificLanguage/types";
import type { ThemeOptions } from "@mui/material";

export const useDesignStore = create<ThemeDesignStore>((set, get) => ({
  selectedExperienceId: "primitives",
  activePreviewId: "DashboardExample",

  activeColorScheme: "light",
  light: createInitialColorSchemeEdits(),
  dark: createInitialColorSchemeEdits(),

  selectedTemplateId: { type: "builtin", id: "material" },
  templateHistory: [],

  colorSchemeIndependentDesignToolEdits: {},

  codeOverridesSource: "",
  codeOverridesDsl: {},
  codeOverridesResolved: {},
  codeOverridesFlattened: {},
  codeOverridesError: null,
  hasUnsavedChanges: false,

  visualHistoryPast: [],
  visualHistoryFuture: [],
  codeHistoryPast: [],
  codeHistoryFuture: [],

  addDesignToolEdit: (path: string, value: SerializableValue) => {
    const isColorSchemeScoped = isColorSchemePath(path);
    const scheme = get().activeColorScheme;

    const snapshot = () => ({
      baseVisualEdits: get().colorSchemeIndependentDesignToolEdits,
      light: get().light.designToolEdits,
      dark: get().dark.designToolEdits,
    });

    set((state) => ({
      visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
      visualHistoryFuture: [],
    }));

    if (isColorSchemeScoped) {
      return set((state) => ({
        [scheme]: {
          ...state[scheme],
          designToolEdits: {
            ...state[scheme].designToolEdits,
            [path]: value,
          },
        },
        hasUnsavedChanges: true,
      }));
    }

    set((state) => ({
      colorSchemeIndependentDesignToolEdits: {
        ...state.colorSchemeIndependentDesignToolEdits,
        [path]: value,
      },
      hasUnsavedChanges: true,
    }));
  },

  removeDesignToolEdit: (path: string) => {
    const isColorSchemeScoped = isColorSchemePath(path);
    const scheme = get().activeColorScheme;

    // Snapshot before removal
    const snapshot = () => ({
      baseVisualEdits: get().colorSchemeIndependentDesignToolEdits,
      light: get().light.designToolEdits,
      dark: get().dark.designToolEdits,
    });

    set((state) => ({
      visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
      visualHistoryFuture: [],
    }));

    if (isColorSchemeScoped) {
      return set((state) => {
        const newEdits = { ...state[scheme].designToolEdits };
        delete newEdits[path];
        return {
          [scheme]: {
            ...state[scheme],
            designToolEdits: newEdits,
          },
          hasUnsavedChanges: true,
        };
      });
    }

    set((state) => {
      const edits = { ...state.colorSchemeIndependentDesignToolEdits };
      delete edits[path];
      return {
        colorSchemeIndependentDesignToolEdits: edits,
        hasUnsavedChanges: true,
      };
    });
  },

  getDesignToolEdit: (path: string) => {
    const { activeColorScheme, colorSchemeIndependentDesignToolEdits, ...rest } =
      get();
    return {
      ...colorSchemeIndependentDesignToolEdits,
      ...rest[activeColorScheme].designToolEdits,
    }[path];
  },

  clearDesignToolsEdits: (scope: "global" | "current-scheme" | "all") => {
    const scheme = get().activeColorScheme;

    // Snapshot before clearing visual edits
    set((state) => ({
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          baseVisualEdits: state.colorSchemeIndependentDesignToolEdits,
          light: state.light.designToolEdits,
          dark: state.dark.designToolEdits,
        },
      ].slice(-50),
      visualHistoryFuture: [],
    }));

    if (scope === "global") {
      return set({
        colorSchemeIndependentDesignToolEdits: {},
        hasUnsavedChanges: true,
      });
    }

    if (scope === "current-scheme") {
      return set((state) => ({
        [scheme]: {
          ...state[scheme],
          designToolEdits: {},
        },
        hasUnsavedChanges: true,
      }));
    }

    set({
      colorSchemeIndependentDesignToolEdits: {},
      light: {
        ...get().light,
        designToolEdits: {},
      },
      dark: {
        ...get().dark,
        designToolEdits: {},
      },
      hasUnsavedChanges: true,
    });
  },

  applyCodeOverrides: (unsafeThemeAsCode: string) => {
    const result = transformCodeToDsl(unsafeThemeAsCode);

    // If transform failed, store error and clear DSL
    if (result.error) {
      set({
        codeOverridesSource: unsafeThemeAsCode,
        codeOverridesDsl: {},
        codeOverridesResolved: {},
        codeOverridesFlattened: {},
        codeOverridesError: result.error,
        hasUnsavedChanges: true,
      });
      return;
    }

    // Store previous source in code history (for undo) then store DSL
    set((state) => ({
      codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(
        -50
      ),
      codeHistoryFuture: [],
    }));

    // Transform succeeded - store DSL
    // The resolved ThemeOptions will be computed on-demand in the resolver
    set({
      codeOverridesSource: unsafeThemeAsCode,
      codeOverridesDsl: result.dsl,
      codeOverridesResolved: {}, // Will be resolved by themeDesign.resolver
      codeOverridesFlattened: {}, // Will be computed after resolution
      codeOverridesError: null,
      hasUnsavedChanges: true,
    });
  },

  clearCodeOverrides: () => {
    // Push current source to code history so clear is undoable
    set((state) => ({
      codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(
        -50
      ),
      codeHistoryFuture: [],
    }));

    set({
      codeOverridesSource: "",
      codeOverridesDsl: {},
      codeOverridesResolved: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      hasUnsavedChanges: true,
    });
  },

  resetToDesignToolEdits: () => {
    get().clearCodeOverrides();
  },

  resetToTemplate: () => {
    // Snapshot visual and code before wiping
    set((state) => ({
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          baseVisualEdits: state.colorSchemeIndependentDesignToolEdits,
          light: state.light.designToolEdits,
          dark: state.dark.designToolEdits,
        },
      ].slice(-50),
      codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(
        -50
      ),
      visualHistoryFuture: [],
      codeHistoryFuture: [],
    }));

    set({
      colorSchemeIndependentDesignToolEdits: {},
      codeOverridesSource: "",
      codeOverridesDsl: {},
      codeOverridesResolved: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      light: createInitialColorSchemeEdits(),
      dark: createInitialColorSchemeEdits(),
      hasUnsavedChanges: true,
    });
  },

  undoDesignToolEdit: () => {
    const past = get().visualHistoryPast;
    if (!past || past.length === 0) return;
    const prev = past[past.length - 1];
    set((state) => ({
      visualHistoryPast: state.visualHistoryPast.slice(0, -1),
      visualHistoryFuture: [
        ...state.visualHistoryFuture,
        {
          baseVisualEdits: state.colorSchemeIndependentDesignToolEdits,
          light: state.light.designToolEdits,
          dark: state.dark.designToolEdits,
        },
      ].slice(-50),
      colorSchemeIndependentDesignToolEdits: prev.baseVisualEdits,
      light: { ...state.light, designToolEdits: prev.light },
      dark: { ...state.dark, designToolEdits: prev.dark },
      hasUnsavedChanges: true,
    }));
  },

  redoDesignToolEdit: () => {
    const future = get().visualHistoryFuture;
    if (!future || future.length === 0) return;
    const next = future[future.length - 1];
    set((state) => ({
      visualHistoryFuture: state.visualHistoryFuture.slice(0, -1),
      visualHistoryPast: [
        ...state.visualHistoryPast,
        {
          baseVisualEdits: state.colorSchemeIndependentDesignToolEdits,
          light: state.light.designToolEdits,
          dark: state.dark.designToolEdits,
        },
      ].slice(-50),
      colorSchemeIndependentDesignToolEdits: next.baseVisualEdits,
      light: { ...state.light, designToolEdits: next.light },
      dark: { ...state.dark, designToolEdits: next.dark },
      hasUnsavedChanges: true,
    }));
  },

  undoCodeOverride: () => {
    const past = get().codeHistoryPast;
    if (!past || past.length === 0) return;
    const prevSource = past[past.length - 1];
    // push current to future
    set((state) => ({
      codeHistoryPast: state.codeHistoryPast.slice(0, -1),
      codeHistoryFuture: [
        ...state.codeHistoryFuture,
        state.codeOverridesSource,
      ].slice(-50),
      codeOverridesSource: prevSource,
      // Re-run transform to set DSL (best-effort)
      codeOverridesDsl: prevSource ? transformCodeToDsl(prevSource).dsl : {},
      hasUnsavedChanges: true,
    }));
  },

  redoCodeOverride: () => {
    const future = get().codeHistoryFuture;
    if (!future || future.length === 0) return;
    const nextSource = future[future.length - 1];
    set((state) => ({
      codeHistoryFuture: state.codeHistoryFuture.slice(0, -1),
      codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(
        -50
      ),
      codeOverridesSource: nextSource,
      codeOverridesDsl: nextSource ? transformCodeToDsl(nextSource).dsl : {},
      hasUnsavedChanges: true,
    }));
  },

  switchTemplate: (templateId: ThemeTemplateRef, keepEdits: boolean) => {
    const currentTemplateId = get().selectedTemplateId.id;

    set({
      selectedTemplateId: templateId,
      templateHistory: [...get().templateHistory, currentTemplateId],
      // Clear edits if not keeping them
      ...(keepEdits
        ? {}
        : {
            colorSchemeIndependentDesignToolEdits: {},
            codeOverridesSource: "",
            codeOverridesDsl: {},
            codeOverridesResolved: {},
            codeOverridesFlattened: {},
            codeOverridesError: null,
            light: createInitialColorSchemeEdits(),
            dark: createInitialColorSchemeEdits(),
          }),
      hasUnsavedChanges: true,
    });
  },

  setActiveColorScheme: (scheme: "light" | "dark") => {
    set({ activeColorScheme: scheme });
  },

  selectPreview: (previewId: string) => {
    set({ activePreviewId: previewId });
  },

  selectExperience: (experienceId: EditorExperienceId) => {
    set({ selectedExperienceId: experienceId });
  },
}));

function createInitialColorSchemeEdits(): ColorSchemeEdits {
  return { designToolEdits: {} };
}

/**
 * Reference to a base theme template.
 */
export type ThemeTemplateRef = {
  /** 'builtin' for static templates, 'imported' for user-provided */
  type: "builtin" | "imported";
  /** Template identifier (e.g., 'material', 'fluent') */
  id: string;
};

/**
 * Color-scheme-specific modifications (light or dark mode).
 * Only stores UI-based visual edits for palette and shadows.
 * Code overrides are global and stored at root level.
 */
export interface ColorSchemeEdits {
  /** Visual edits for color-scheme paths (palette.*, shadows) */
  designToolEdits: Record<string, SerializableValue>;
}

/**
 * Complete state of a Theme Design.
 * Separates base layer (color-independent) from color schemes (palette/shadows only).
 */
export interface ThemeDesignState {
  selectedExperienceId: EditorExperienceId;

  // === Base Layer ===
  /** Currently selected base template */
  selectedTemplateId: ThemeTemplateRef;

  /** History of previously selected templates (for comparison feature) */
  templateHistory: string[];

  // === Base Modifications (Color-Independent) ===
  /** Base visual edits (typography, spacing, shape, breakpoints, component defaults, etc.) */
  colorSchemeIndependentDesignToolEdits: Record<string, SerializableValue>;

  // === Code Overrides (Global - Can Override Any Path) ===
  /** Raw code overrides source (can override palette, typography, anything) */
  codeOverridesSource: string;

  /** DSL representation of code overrides (safe JSON with placeholders) */
  codeOverridesDsl: ThemeDsl;

  /** Resolved code overrides (executable ThemeOptions, cached) */
  codeOverridesResolved: ThemeOptions;

  /** Flattened code overrides for quick lookups */
  codeOverridesFlattened: Record<string, SerializableValue>;

  /** Code override error, if any */
  codeOverridesError: string | null;

  // === Color-Scheme-Specific Modifications (Palette + Shadows Only) ===
  /** Light mode modifications (palette.*, shadows) */
  light: ColorSchemeEdits;

  /** Dark mode modifications (palette.*, shadows) */
  dark: ColorSchemeEdits;

  // === UI State (Not Persisted) ===
  /** Currently active color scheme being edited */
  activeColorScheme: "light" | "dark";

  /** Currently selected preview component */
  activePreviewId: string;

  /** Dirty flag for unsaved changes */
  hasUnsavedChanges: boolean;

  // === Per-experience history (non-persistent) ===
  /** Visual edits history (past snapshots) */
  visualHistoryPast: Array<{
    baseVisualEdits: Record<string, SerializableValue>;
    light: Record<string, SerializableValue>;
    dark: Record<string, SerializableValue>;
  }>;

  /** Visual edits redo stack */
  visualHistoryFuture: Array<{
    baseVisualEdits: Record<string, SerializableValue>;
    light: Record<string, SerializableValue>;
    dark: Record<string, SerializableValue>;
  }>;

  /** Code edits history (past sources) */
  codeHistoryPast: string[];

  /** Code edits redo stack (future) */
  codeHistoryFuture: string[];
}

/**
 * Actions available on the Theme Design store.
 */
export interface ThemeDesignActions {
  selectExperience: (experienceId: EditorExperienceId) => void;

  // === Template Management ===
  /**
   * Switch to a different base template.
   * @param templateId - New template reference
   * @param keepEdits - If true, preserve existing modifications
   */
  switchTemplate: (templateId: ThemeTemplateRef, keepEdits: boolean) => void;

  // === Visual Edits ===
  /**
   * Set a visual edit at a specific path.
   * Routes to global or color-scheme-specific storage based on path.
   * @param path - Dot-notation path (e.g., 'palette.primary.main')
   * @param value - Serializable value
   */
  addDesignToolEdit: (path: string, value: SerializableValue) => void;

  getDesignToolEdit: (path: string) => SerializableValue;

  /**
   * Remove a visual edit at a specific path.
   * @param path - Dot-notation path
   */
  removeDesignToolEdit: (path: string) => void;

  /**
   * Clear all visual edits for current color scheme or globally.
   * @param scope - 'global' | 'current-scheme' | 'all'
   */
  clearDesignToolsEdits: (scope: "global" | "current-scheme" | "all") => void;

  // === Code Overrides ===
  /**
   * Apply code overrides from Monaco editor.
   * Can override any path (palette, typography, spacing, etc.).
   * Evaluates source and stores result.
   * @param source - Raw JavaScript/TypeScript code
   */
  applyCodeOverrides: (source: string) => void;

  /**
   * Clear all code overrides.
   */
  clearCodeOverrides: () => void;

  /**
   * Reset to visual edits only (clear all code overrides).
   */
  resetToDesignToolEdits: () => void;

  /**
   * Reset to template base (clear all modifications).
   */
  resetToTemplate: () => void;

  // === UI State ===
  /**
   * Set the active color scheme being edited.
   * @param scheme - 'light' or 'dark'
   */
  setActiveColorScheme: (scheme: "light" | "dark") => void;

  /**
   * Select a preview component to display.
   * @param previewId - Preview component identifier
   */
  selectPreview: (previewId: string) => void;

  // === Scoped undo/redo (per-experience) ===
  /** Undo last visual edit (affects baseVisualEdits/lightMode/darkMode) */
  undoDesignToolEdit: () => void;
  /** Redo last undone visual edit */
  redoDesignToolEdit: () => void;
  /** Undo last code apply (restores previous codeOverridesSource) */
  undoCodeOverride: () => void;
  /** Redo last undone code apply */
  redoCodeOverride: () => void;
}

/**
 * Serializable primitive values that can be stored and transmitted.
 * Excludes functions, which must be stored separately as strings.
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

export type ThemeDesignStore = ThemeDesignState & ThemeDesignActions;
