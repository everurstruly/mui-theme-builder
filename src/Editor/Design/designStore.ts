import { create } from "zustand";
import { isColorSchemePath } from "./shared";
import { transformCodeToDsl } from "./domainSpecificLanguage/themeOptionsToDslTransformer";
import { validateCodeBeforeEvaluation } from "./domainSpecificLanguage/dslValidator";
import { devtools } from "zustand/middleware";
import type { EditorDesignExperienceId } from "../editorDesignExperience";
import type { ThemeDsl } from "./domainSpecificLanguage/types";
import type { ThemeOptions } from "@mui/material";
import templatesRegistry, {
  type TemplateMetadata,
  getTemplateById,
  isTemplateIdValid,
  buildTemplatesTree,
  type TreeNode as TemplateTreeNode,
} from "../Templates/registry";

// Initial template reference and derived initial title (use `label` from registry)
const initialTemplateRef: ThemeTemplateRef = { type: "builtin", id: "material" };
const initialTitle = getTemplateById(initialTemplateRef.id)?.label ?? "Untitled";

export const useDesignStore = create<ThemeDesignStore>()(
  devtools((set, get) => ({
    selectedExperienceId: "primitives",
    activePreviewId: "DevSandbox",

    activeColorScheme: "light",
    light: createInitialColorSchemeEdits(),
    dark: createInitialColorSchemeEdits(),

    // Template reference and human-facing title
    selectedTemplateId: initialTemplateRef,
    title: initialTitle,
    templateHistory: [],

    // Template Registry Integration
    templatesRegistry: templatesRegistry,
    templatesTree: buildTemplatesTree(),

    colorSchemeIndependentVisualToolEdits: {},

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

    addVisualToolEdit: (path: string, value: SerializableValue) => {
      const isColorSchemeScoped = isColorSchemePath(path);
      const scheme = get().activeColorScheme;

      const snapshot = () => ({
        baseVisualToolEdits: get().colorSchemeIndependentVisualToolEdits,
        light: get().light.visualToolEdits,
        dark: get().dark.visualToolEdits,
      });

      set((state) => ({
        visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
        visualHistoryFuture: [],
      }));

      if (isColorSchemeScoped) {
        return set((state) => ({
          [scheme]: {
            ...state[scheme],
            visualToolEdits: {
              ...state[scheme].visualToolEdits,
              [path]: value,
            },
          },
          hasUnsavedChanges: true,
        }));
      }

      set((state) => ({
        colorSchemeIndependentVisualToolEdits: {
          ...state.colorSchemeIndependentVisualToolEdits,
          [path]: value,
        },
        hasUnsavedChanges: true,
      }));
    },

    removeVisualToolEdit: (path: string) => {
      const isColorSchemeScoped = isColorSchemePath(path);
      const scheme = get().activeColorScheme;

      // Snapshot before removal
      const snapshot = () => ({
        baseVisualToolEdits: get().colorSchemeIndependentVisualToolEdits,
        light: get().light.visualToolEdits,
        dark: get().dark.visualToolEdits,
      });

      set((state) => ({
        visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
        visualHistoryFuture: [],
      }));

      if (isColorSchemeScoped) {
        return set((state) => {
          const newEdits = { ...state[scheme].visualToolEdits };
          delete newEdits[path];
          return {
            [scheme]: {
              ...state[scheme],
              visualToolEdits: newEdits,
            },
            hasUnsavedChanges: true,
          };
        });
      }

      set((state) => {
        const edits = { ...state.colorSchemeIndependentVisualToolEdits };
        delete edits[path];
        return {
          colorSchemeIndependentVisualToolEdits: edits,
          hasUnsavedChanges: true,
        };
      });
    },

    getVisualToolEdit: (path: string) => {
      const { activeColorScheme, colorSchemeIndependentVisualToolEdits, ...rest } =
        get();

      return {
        ...colorSchemeIndependentVisualToolEdits,
        ...rest[activeColorScheme].visualToolEdits,
      }[path];
    },

    removeAllVisualToolsEdits: (scope: "global" | "current-scheme" | "all") => {
      const scheme = get().activeColorScheme;

      // Snapshot before clearing visual edits
      set((state) => ({
        visualHistoryPast: [
          ...state.visualHistoryPast,
          {
            baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
            light: state.light.visualToolEdits,
            dark: state.dark.visualToolEdits,
          },
        ].slice(-50),
        visualHistoryFuture: [],
      }));

      if (scope === "global") {
        return set({
          colorSchemeIndependentVisualToolEdits: {},
          hasUnsavedChanges: true,
        });
      }

      if (scope === "current-scheme") {
        return set((state) => ({
          [scheme]: {
            ...state[scheme],
            visualToolEdits: {},
          },
          hasUnsavedChanges: true,
        }));
      }

      set({
        colorSchemeIndependentVisualToolEdits: {},
        light: {
          ...get().light,
          visualToolEdits: {},
        },
        dark: {
          ...get().dark,
          visualToolEdits: {},
        },
        hasUnsavedChanges: true,
      });
    },

    applyCodeOverrides: (unsafeThemeAsCode: string) => {
      // Pre-validate code before attempting transformation/evaluation to
      // prevent invalid ThemeOptions from reaching runtime and crashing
      // createTheme. This is a defensive store-level guard in case code is
      // applied from anywhere other than the editor UI.
      const validation = validateCodeBeforeEvaluation(unsafeThemeAsCode);
      if (!validation.valid) {
        set({
          codeOverridesSource: unsafeThemeAsCode,
          codeOverridesDsl: {},
          codeOverridesResolved: {},
          codeOverridesFlattened: {},
          codeOverridesError: validation.errors.map(e => e.message).join('\n'),
          hasUnsavedChanges: true,
        });
        return;
      }

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

    /** Set or rename the design title (user editable). */
    setTitle: (t: string) => set({ title: t, hasUnsavedChanges: true }),

    removeAllCodeOverrides: () => {
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

    resetToTemplate: () => {
      // Snapshot visual and code before wiping
      set((state) => ({
        visualHistoryPast: [
          ...state.visualHistoryPast,
          {
            baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
            light: state.light.visualToolEdits,
            dark: state.dark.visualToolEdits,
          },
        ].slice(-50),
        codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(
          -50
        ),
        visualHistoryFuture: [],
        codeHistoryFuture: [],
      }));

      set({
        colorSchemeIndependentVisualToolEdits: {},
        codeOverridesSource: "",
        codeOverridesDsl: {},
        codeOverridesResolved: {},
        codeOverridesFlattened: {},
        codeOverridesError: null,
        light: createInitialColorSchemeEdits(),
        dark: createInitialColorSchemeEdits(),
        // Reset title to current template's label (or fallback)
        title: getTemplateById(get().selectedTemplateId.id)?.label ?? "Untitled",
        hasUnsavedChanges: true,
      });
    },

    undoVisualToolEdit: () => {
      const past = get().visualHistoryPast;
      if (!past || past.length === 0) return;
      const prev = past[past.length - 1];
      set((state) => ({
        visualHistoryPast: state.visualHistoryPast.slice(0, -1),
        visualHistoryFuture: [
          ...state.visualHistoryFuture,
          {
            baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
            light: state.light.visualToolEdits,
            dark: state.dark.visualToolEdits,
          },
        ].slice(-50),
        colorSchemeIndependentVisualToolEdits: prev.baseVisualToolEdits,
        light: { ...state.light, visualToolEdits: prev.light },
        dark: { ...state.dark, visualToolEdits: prev.dark },
        hasUnsavedChanges: true,
      }));
    },

    redoVisualToolEdit: () => {
      const future = get().visualHistoryFuture;
      if (!future || future.length === 0) return;
      const next = future[future.length - 1];
      set((state) => ({
        visualHistoryFuture: state.visualHistoryFuture.slice(0, -1),
        visualHistoryPast: [
          ...state.visualHistoryPast,
          {
            baseVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
            light: state.light.visualToolEdits,
            dark: state.dark.visualToolEdits,
          },
        ].slice(-50),
        colorSchemeIndependentVisualToolEdits: next.baseVisualToolEdits,
        light: { ...state.light, visualToolEdits: next.light },
        dark: { ...state.dark, visualToolEdits: next.dark },
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

      // Determine new title: preserve existing if keeping edits, otherwise use template title or fallback
      const newTitle = keepEdits
        ? get().title
        : getTemplateById(templateId.id)?.label ?? "Untitled";

      set({
        selectedTemplateId: templateId,
        templateHistory: [...get().templateHistory, currentTemplateId],
        // Clear edits if not keeping them
        ...(keepEdits
          ? {}
          : {
              colorSchemeIndependentVisualToolEdits: {},
              codeOverridesSource: "",
              codeOverridesDsl: {},
              codeOverridesResolved: {},
              codeOverridesFlattened: {},
              codeOverridesError: null,
              light: createInitialColorSchemeEdits(),
              dark: createInitialColorSchemeEdits(),
            }),
        title: newTitle,
        hasUnsavedChanges: true,
      });
    },

    setActiveColorScheme: (scheme: "light" | "dark") => {
      set({ activeColorScheme: scheme });
    },

    selectPreview: (previewId: string) => {
      set({ activePreviewId: previewId });
    },

    selectExperience: (experienceId: EditorDesignExperienceId) => {
      set({ selectedExperienceId: experienceId });
    },

    getTemplateFromRegistry: (templateId: string): TemplateMetadata | undefined => {
      return getTemplateById(templateId);
    },

    isTemplateAvailable: (templateId: string): boolean => {
      return isTemplateIdValid(templateId);
    },

    getTemplatesTree: () => {
      return get().templatesTree;
    },

    getAllTemplates: () => {
      return Object.values(get().templatesRegistry);
    },
  }), { trace: true })
);

function createInitialColorSchemeEdits(): ColorSchemeEdits {
  return { visualToolEdits: {} };
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
  visualToolEdits: Record<string, SerializableValue>;
}

/**
 * Complete state of a Theme Design.
 * Separates base layer (color-independent) from color schemes (palette/shadows only).
 */
export interface ThemeDesignState {
  selectedExperienceId: EditorDesignExperienceId;

  // === Base Layer ===
  /** Currently selected base template */
  selectedTemplateId: ThemeTemplateRef;

  /** History of previously selected templates (for comparison feature) */
  templateHistory: string[];

  // === Template Registry ===
  /** Registry of available templates */
  templatesRegistry: Record<string, TemplateMetadata>;

  /** Tree structure of templates (for UI organization) */
  templatesTree: Record<string, TemplateTreeNode>;

  // === Base Modifications (Color-Independent) ===
  /** Base visual edits (typography, spacing, shape, breakpoints, component defaults, etc.) */
  colorSchemeIndependentVisualToolEdits: Record<string, SerializableValue>;

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

  /** Human-facing title for this design (template title, 'Untitled', or user-renamed) */
  title: string;

  // === Per-experience history (non-persistent) ===
  /** Visual edits history (past snapshots) */
  visualHistoryPast: Array<{
    baseVisualToolEdits: Record<string, SerializableValue>;
    light: Record<string, SerializableValue>;
    dark: Record<string, SerializableValue>;
  }>;

  /** Visual edits redo stack */
  visualHistoryFuture: Array<{
    baseVisualToolEdits: Record<string, SerializableValue>;
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
  selectExperience: (experienceId: EditorDesignExperienceId) => void;

  // === Template Registry Management ===
  /**
   * Get a template from the registry by ID
   * @param templateId - Template identifier
   * @returns Template metadata or undefined if not found
   */
  getTemplateFromRegistry: (templateId: string) => TemplateMetadata | undefined;

  /**
   * Check if a template is available in the registry
   * @param templateId - Template identifier
   * @returns True if template exists
   */
  isTemplateAvailable: (templateId: string) => boolean;

  /**
   * Get the templates tree structure for UI organization
   * @returns Tree structure of templates
   */
  getTemplatesTree: () => Record<string, TemplateTreeNode>;

  /**
   * Get all available templates
   * @returns Array of all template metadata
   */
  getAllTemplates: () => TemplateMetadata[];

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
  addVisualToolEdit: (path: string, value: SerializableValue) => void;

  getVisualToolEdit: (path: string) => SerializableValue;

  /**
   * Remove a visual edit at a specific path.
   * @param path - Dot-notation path
   */
  removeVisualToolEdit: (path: string) => void;

  /**
   * Clear all visual edits for current color scheme or globally.
   * @param scope - 'global' | 'current-scheme' | 'all'
   */
  removeAllVisualToolsEdits: (scope: "global" | "current-scheme" | "all") => void;

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
  removeAllCodeOverrides: () => void;

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

  /** Set or rename the design title (user editable) */
  setTitle: (title: string) => void;

  // === Scoped undo/redo (per-experience) ===
  /** Undo last visual edit (affects baseVisualToolEdits/lightMode/darkMode) */
  undoVisualToolEdit: () => void;
  /** Redo last undone visual edit */
  redoVisualToolEdit: () => void;
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
  | undefined
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

export type ThemeDesignStore = ThemeDesignState & ThemeDesignActions;
