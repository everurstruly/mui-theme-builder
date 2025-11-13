import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  ThemeDesignStore,
  ColorSchemeEdits,
  ThemeTemplateRef,
  SerializableValue,
} from './types';
import { isColorSchemePath } from './themeDesign.utils';
import { transformCodeToDsl } from './themeDesign.codeToDsl';

/**
 * Initial color scheme edits state.
 */
const createInitialColorSchemeEdits = (): ColorSchemeEdits => ({
  visualEdits: {},
});

/**
 * Theme Design Zustand store with undo/redo support.
 * 
 * Key features:
 * - Separate layers: template, global edits, color scheme edits, code overrides
 * - Undo/redo via zundo temporal middleware
 * - Automatic path routing (palette/shadows → color scheme, everything else → global)
 * - Code evaluation with error handling
 */
export const useThemeDesignStore = create<ThemeDesignStore>()(
  temporal(
    (set, get) => ({
      // ===== Initial State =====
      selectedTemplateId: { type: 'builtin', id: 'material' },
      templateHistory: [],
      baseVisualEdits: {},
      codeOverridesSource: '',
      codeOverridesDsl: {},
      codeOverridesResolved: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      lightMode: createInitialColorSchemeEdits(),
      darkMode: createInitialColorSchemeEdits(),
      activeColorScheme: 'light',
      activePreviewId: 'DashboardExample',
      hasUnsavedChanges: false,
  // Per-experience history (kept in-memory only)
  visualHistoryPast: [],
  visualHistoryFuture: [],
  codeHistoryPast: [],
  codeHistoryFuture: [],

      // ===== Template Management =====

      switchTemplate: (templateId: ThemeTemplateRef, keepEdits: boolean) => {
        const currentTemplateId = get().selectedTemplateId.id;

        set({
          selectedTemplateId: templateId,
          templateHistory: [...get().templateHistory, currentTemplateId],
          // Clear edits if not keeping them
          ...(keepEdits
            ? {}
            : {
                baseVisualEdits: {},
                codeOverridesSource: '',
                codeOverridesDsl: {},
                codeOverridesResolved: {},
                codeOverridesFlattened: {},
                codeOverridesError: null,
                lightMode: createInitialColorSchemeEdits(),
                darkMode: createInitialColorSchemeEdits(),
              }),
          hasUnsavedChanges: true,
        });
      },

      // ===== Visual Edits =====

      setVisualEdit: (path: string, value: SerializableValue) => {
        const isColorScheme = isColorSchemePath(path);
        const scheme = get().activeColorScheme;

        // Snapshot visual state before mutation
        const snapshot = () => ({
          baseVisualEdits: get().baseVisualEdits,
          light: get().lightMode.visualEdits,
          dark: get().darkMode.visualEdits,
        });

        set((state) => ({
          visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
          visualHistoryFuture: [],
        }));

        if (isColorScheme) {
          // Color-scheme-specific path (palette.*, shadows)
          const modeKey = scheme === 'light' ? 'lightMode' : 'darkMode';
          set((state) => ({
            [modeKey]: {
              ...state[modeKey],
              visualEdits: {
                ...state[modeKey].visualEdits,
                [path]: value,
              },
            },
            hasUnsavedChanges: true,
          }));
        } else {
          // Base path (typography, spacing, shape, etc.)
          set((state) => ({
            baseVisualEdits: {
              ...state.baseVisualEdits,
              [path]: value,
            },
            hasUnsavedChanges: true,
          }));
        }
      },

      removeVisualEdit: (path: string) => {
        const isColorScheme = isColorSchemePath(path);
        const scheme = get().activeColorScheme;

        // Snapshot before removal
        const snapshot = () => ({
          baseVisualEdits: get().baseVisualEdits,
          light: get().lightMode.visualEdits,
          dark: get().darkMode.visualEdits,
        });

        set((state) => ({
          visualHistoryPast: [...state.visualHistoryPast, snapshot()].slice(-50),
          visualHistoryFuture: [],
        }));

        if (isColorScheme) {
          const modeKey = scheme === 'light' ? 'lightMode' : 'darkMode';
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [path]: _, ...restEdits } = state[modeKey].visualEdits;
            return {
              [modeKey]: {
                ...state[modeKey],
                visualEdits: restEdits,
              },
              hasUnsavedChanges: true,
            };
          });
        } else {
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [path]: _, ...restEdits } = state.baseVisualEdits;
            return {
              baseVisualEdits: restEdits,
              hasUnsavedChanges: true,
            };
          });
        }
      },

      clearVisualEdits: (scope: 'global' | 'current-scheme' | 'all') => {
        const scheme = get().activeColorScheme;
        const modeKey = scheme === 'light' ? 'lightMode' : 'darkMode';

        // Snapshot before clearing visual edits
        set((state) => ({
          visualHistoryPast: [...state.visualHistoryPast, {
            baseVisualEdits: state.baseVisualEdits,
            light: state.lightMode.visualEdits,
            dark: state.darkMode.visualEdits,
          }].slice(-50),
          visualHistoryFuture: [],
        }));

        if (scope === 'global') {
          set({ baseVisualEdits: {}, hasUnsavedChanges: true });
        } else if (scope === 'current-scheme') {
          set((state) => ({
            [modeKey]: {
              ...state[modeKey],
              visualEdits: {},
            },
            hasUnsavedChanges: true,
          }));
        } else {
          // 'all'
          set({
            baseVisualEdits: {},
            lightMode: {
              ...get().lightMode,
              visualEdits: {},
            },
            darkMode: {
              ...get().darkMode,
              visualEdits: {},
            },
            hasUnsavedChanges: true,
          });
        }
      },

      // ===== Code Overrides =====

      applyCodeOverrides: (source: string) => {
        // Transform user code to DSL (no eval - safe)
        const result = transformCodeToDsl(source);

        // If transform failed, store error and clear DSL
        if (result.error) {
          set({
            codeOverridesSource: source,
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
          codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(-50),
          codeHistoryFuture: [],
        }));

        // Transform succeeded - store DSL
        // The resolved ThemeOptions will be computed on-demand in the resolver
        set({
          codeOverridesSource: source,
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
          codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(-50),
          codeHistoryFuture: [],
        }));

        set({
          codeOverridesSource: '',
          codeOverridesDsl: {},
          codeOverridesResolved: {},
          codeOverridesFlattened: {},
          codeOverridesError: null,
          hasUnsavedChanges: true,
        });
      },

      // ===== Reset Actions =====

      resetPath: (path: string) => {
        const isColorScheme = isColorSchemePath(path);
        const scheme = get().activeColorScheme;
        const modeKey = scheme === 'light' ? 'lightMode' : 'darkMode';

        // Check what layers exist for this path
        const hasCodeOverride = path in get().codeOverridesFlattened;
        const hasBaseVisual = !isColorScheme && path in get().baseVisualEdits;
        const hasSchemeVisual = isColorScheme && path in get()[modeKey].visualEdits;

        // Remove highest priority layer first
        if (hasCodeOverride) {
          // Has code override - clear all code (can't remove individual paths from code)
          // User will need to manually edit code to remove specific path
          get().clearCodeOverrides();
        } else if (hasSchemeVisual || hasBaseVisual) {
          // Has visual edit - remove it (template value will be revealed)
          get().removeVisualEdit(path);
        }
      },

      resetToVisual: () => {
        get().clearCodeOverrides();
      },

      resetToTemplate: () => {
        // Snapshot visual and code before wiping
        set((state) => ({
          visualHistoryPast: [...state.visualHistoryPast, {
            baseVisualEdits: state.baseVisualEdits,
            light: state.lightMode.visualEdits,
            dark: state.darkMode.visualEdits,
          }].slice(-50),
          codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(-50),
          visualHistoryFuture: [],
          codeHistoryFuture: [],
        }));

        set({
          baseVisualEdits: {},
          codeOverridesSource: '',
          codeOverridesDsl: {},
          codeOverridesResolved: {},
          codeOverridesFlattened: {},
          codeOverridesError: null,
          lightMode: createInitialColorSchemeEdits(),
          darkMode: createInitialColorSchemeEdits(),
          hasUnsavedChanges: true,
        });
      },

      // ===== Scoped undo/redo actions =====

      undoVisual: () => {
        const past = get().visualHistoryPast;
        if (!past || past.length === 0) return;
        const prev = past[past.length - 1];
        set((state) => ({
          visualHistoryPast: state.visualHistoryPast.slice(0, -1),
          visualHistoryFuture: [...state.visualHistoryFuture, {
            baseVisualEdits: state.baseVisualEdits,
            light: state.lightMode.visualEdits,
            dark: state.darkMode.visualEdits,
          }].slice(-50),
          baseVisualEdits: prev.baseVisualEdits,
          lightMode: { ...state.lightMode, visualEdits: prev.light },
          darkMode: { ...state.darkMode, visualEdits: prev.dark },
          hasUnsavedChanges: true,
        }));
      },

      redoVisual: () => {
        const future = get().visualHistoryFuture;
        if (!future || future.length === 0) return;
        const next = future[future.length - 1];
        set((state) => ({
          visualHistoryFuture: state.visualHistoryFuture.slice(0, -1),
          visualHistoryPast: [...state.visualHistoryPast, {
            baseVisualEdits: state.baseVisualEdits,
            light: state.lightMode.visualEdits,
            dark: state.darkMode.visualEdits,
          }].slice(-50),
          baseVisualEdits: next.baseVisualEdits,
          lightMode: { ...state.lightMode, visualEdits: next.light },
          darkMode: { ...state.darkMode, visualEdits: next.dark },
          hasUnsavedChanges: true,
        }));
      },

      undoCode: () => {
        const past = get().codeHistoryPast;
        if (!past || past.length === 0) return;
        const prevSource = past[past.length - 1];
        // push current to future
        set((state) => ({
          codeHistoryPast: state.codeHistoryPast.slice(0, -1),
          codeHistoryFuture: [...state.codeHistoryFuture, state.codeOverridesSource].slice(-50),
          codeOverridesSource: prevSource,
          // Re-run transform to set DSL (best-effort)
          codeOverridesDsl: prevSource ? transformCodeToDsl(prevSource).dsl : {},
          hasUnsavedChanges: true,
        }));
      },

      redoCode: () => {
        const future = get().codeHistoryFuture;
        if (!future || future.length === 0) return;
        const nextSource = future[future.length - 1];
        set((state) => ({
          codeHistoryFuture: state.codeHistoryFuture.slice(0, -1),
          codeHistoryPast: [...state.codeHistoryPast, state.codeOverridesSource].slice(-50),
          codeOverridesSource: nextSource,
          codeOverridesDsl: nextSource ? transformCodeToDsl(nextSource).dsl : {},
          hasUnsavedChanges: true,
        }));
      },

      // ===== UI State =====

      setActiveColorScheme: (scheme: 'light' | 'dark') => {
        set({ activeColorScheme: scheme });
      },

      selectPreview: (previewId: string) => {
        set({ activePreviewId: previewId });
      },
    }),
    {
      // Only track persistent state in history (exclude UI state)
      partialize: (state) => ({
        selectedTemplateId: state.selectedTemplateId,
        templateHistory: state.templateHistory,
        baseVisualEdits: state.baseVisualEdits,
        codeOverridesSource: state.codeOverridesSource,
        codeOverridesDsl: state.codeOverridesDsl,
        codeOverridesResolved: state.codeOverridesResolved,
        codeOverridesFlattened: state.codeOverridesFlattened,
        codeOverridesError: state.codeOverridesError,
        lightMode: state.lightMode,
        darkMode: state.darkMode,
      }),
      limit: 50, // Keep last 50 history states
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);

