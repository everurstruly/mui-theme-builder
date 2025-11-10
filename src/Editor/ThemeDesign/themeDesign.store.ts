import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  ThemeDesignStore,
  ColorSchemeEdits,
  ThemeTemplateRef,
  SerializableValue,
} from './types';
import { isColorSchemePath, evaluateCodeOverrides } from './themeDesign.utils';

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
 * - Separate layers: template, composables, global edits, color scheme edits, code overrides
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
      enabledComposables: {},
      baseVisualEdits: {},
      codeOverridesSource: '',
      codeOverridesEvaluated: {},
      codeOverridesFlattened: {},
      codeOverridesError: null,
      lightMode: createInitialColorSchemeEdits(),
      darkMode: createInitialColorSchemeEdits(),
      activeColorScheme: 'light',
      activePreviewId: 'DashboardExample',
      hasUnsavedChanges: false,

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
                codeOverridesEvaluated: {},
                codeOverridesFlattened: {},
                codeOverridesError: null,
                lightMode: createInitialColorSchemeEdits(),
                darkMode: createInitialColorSchemeEdits(),
                enabledComposables: {},
              }),
          hasUnsavedChanges: true,
        });
      },

      // ===== Composables =====

      toggleComposable: (composableId: string, enabled: boolean) => {
        set((state) => ({
          enabledComposables: {
            ...state.enabledComposables,
            [composableId]: enabled,
          },
          hasUnsavedChanges: true,
        }));
      },

      // ===== Visual Edits =====

      setVisualEdit: (path: string, value: SerializableValue) => {
        const isColorScheme = isColorSchemePath(path);
        const scheme = get().activeColorScheme;

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
        const result = evaluateCodeOverrides(source);

        set({
          codeOverridesSource: source,
          codeOverridesEvaluated: result.evaluated,
          codeOverridesFlattened: result.flattened,
          codeOverridesError: result.error,
          hasUnsavedChanges: true,
        });
      },

      clearCodeOverrides: () => {
        set({
          codeOverridesSource: '',
          codeOverridesEvaluated: {},
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
        set({
          baseVisualEdits: {},
          codeOverridesSource: '',
          codeOverridesEvaluated: {},
          codeOverridesFlattened: {},
          codeOverridesError: null,
          lightMode: createInitialColorSchemeEdits(),
          darkMode: createInitialColorSchemeEdits(),
          enabledComposables: {},
          hasUnsavedChanges: true,
        });
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
        enabledComposables: state.enabledComposables,
        baseVisualEdits: state.baseVisualEdits,
        codeOverridesSource: state.codeOverridesSource,
        codeOverridesEvaluated: state.codeOverridesEvaluated,
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

