import { useMemo } from 'react';
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';
import { useThemeDesignStore } from './themeDesign.store';
import { resolveThemeOptions } from './themeDesign.resolver';
import { transformDslToThemeOptions } from './themeDesign.dslToTheme';
import { isColorSchemePath, getNestedValue } from './themeDesign.utils';
import type { SerializableValue } from './types';
import { getThemeTemplate } from './themeTemplates';

// Template loader - uses existing ThemeSheet templates
function getTemplate(templateId: string, colorScheme: 'light' | 'dark'): ThemeOptions {
  try {
    const rawTemplate = getThemeTemplate(templateId, colorScheme);
    
    // CRITICAL: Templates only define minimal palette (primary, secondary, etc.)
    // We need to run createTheme() to get MUI's full defaults (divider, error, warning, etc.)
    // Then extract the options back out to get a complete ThemeOptions object
    const expandedTheme = createTheme(rawTemplate);
    
    // Extract the fully-expanded options from the Theme object
    // IMPORTANT: Some properties become functions after createTheme() (spacing, breakpoints)
    // We need to preserve the original config values, not the computed functions
    return {
      palette: expandedTheme.palette,
      typography: expandedTheme.typography,
      spacing: rawTemplate.spacing ?? 8, // Use original value, not the function
      shape: rawTemplate.shape ?? { borderRadius: 4 }, // Use original object
      breakpoints: rawTemplate.breakpoints, // Original breakpoint config
      zIndex: expandedTheme.zIndex,
      transitions: expandedTheme.transitions,
      components: expandedTheme.components,
      shadows: expandedTheme.shadows,
      mixins: expandedTheme.mixins,
    } as ThemeOptions;
  } catch (error) {
    console.error(`[getTemplate] Failed to load template ${templateId}:`, error);
    // Fallback to empty object with just the palette mode set
    return {
      palette: {
        mode: colorScheme,
      },
    };
  }
}

/**
 * Internal hook that resolves ThemeOptions from all layers.
 * Used by useThemeDesignTheme to compute the final theme.
 * 
 * @param colorScheme - Target color scheme (defaults to active scheme)
 * @returns Resolved ThemeOptions ready for createTheme()
 */
function useResolvedThemeOptions(colorScheme?: 'light' | 'dark'): ThemeOptions {
  // Subscribe to all relevant state slices with selectors
  const templateId = useThemeDesignStore((s) => s.selectedTemplateId.id);
  const baseVisualEdits = useThemeDesignStore((s) => s.baseVisualEdits);
  const codeOverridesDsl = useThemeDesignStore((s) => s.codeOverridesDsl);
  const lightMode = useThemeDesignStore((s) => s.lightMode);
  const darkMode = useThemeDesignStore((s) => s.darkMode);
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);

  const targetScheme = colorScheme ?? activeColorScheme;
  const modeEdits = targetScheme === 'light' ? lightMode : darkMode;

  return useMemo(() => {
    // Get base template
    const template = getTemplate(templateId, targetScheme);

    // Resolve DSL to executable ThemeOptions (only if DSL exists)
    const codeOverrides =
      Object.keys(codeOverridesDsl).length > 0
        ? transformDslToThemeOptions(codeOverridesDsl, {
            template,
            colorScheme: targetScheme,
            spacingFactor: 8, // TODO: get from template if available
          })
        : {};

    // Resolve all layers
    return resolveThemeOptions({
      template,
      baseVisualEdits,
      colorSchemeVisualEdits: modeEdits.visualEdits,
      codeOverrides,
      colorScheme: targetScheme,
    });
  }, [
    templateId,
    baseVisualEdits,
    codeOverridesDsl,
    modeEdits.visualEdits,
    targetScheme,
  ]);
}

/**
 * Hook that returns a fully resolved MUI Theme for preview/canvas rendering.
 * 
 * Performance:
 * - Only recomputes when theme-affecting state changes (via memoization)
 * - Uses Zustand selectors to minimize unnecessary re-renders
 * - Target: <100ms for theme recomputation
 * 
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns MUI Theme instance ready for use with ThemeProvider
 * 
 * @example
 * function PreviewPane() {
 *   const theme = useThemeDesignTheme('light');
 *   return <ThemeProvider theme={theme}><YourApp /></ThemeProvider>;
 * }
 */
export function useThemeDesignTheme(colorScheme?: 'light' | 'dark'): Theme {
  const themeOptions = useResolvedThemeOptions(colorScheme);

  const theme = useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (error) {
      console.error('[useThemeDesignTheme] Failed to create theme:', error);
      return createTheme();
    }
  }, [themeOptions]);

  return theme;
}

/**
 * Hook that returns resolved ThemeOptions (not yet passed to createTheme).
 * Useful for code editors, export functionality, or debugging.
 * 
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns Resolved ThemeOptions object (plain object, not Theme instance)
 * 
 * @example
 * function ExportButton() {
 *   const themeOptions = useThemeDesignOptions('light');
 *   const handleExport = () => {
 *     const json = JSON.stringify(themeOptions, null, 2);
 *     downloadFile('theme.json', json);
 *   };
 *   return <Button onClick={handleExport}>Export Theme</Button>;
 * }
 */
export function useThemeDesignOptions(colorScheme?: 'light' | 'dark'): ThemeOptions {
  return useResolvedThemeOptions(colorScheme);
}

/**
 * Hook for UI controls to read and update theme values at specific paths.
 * 
 * Performance:
 * - Uses targeted Zustand selectors (only re-renders when specific path changes)
 * - No expensive theme computation (just flat object lookups)
 * - O(1) lookups for override detection
 * 
 * @param path - Dot-notation path (e.g., 'palette.primary.main')
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns Object with value, override flags, and setter functions
 * 
 * @example
 * function ColorPicker() {
 *   const { value, hasCodeOverride, hasVisualEdit, setValue, reset } =
 *     useThemeDesignEditValue('palette.primary.main');
 *   
 *   return (
 *     <div>
 *       <input
 *         type="color"
 *         value={value}
 *         onChange={(e) => setValue(e.target.value)}
 *         disabled={hasCodeOverride}
 *       />
 *       {hasCodeOverride && <Badge>Overridden in code</Badge>}
 *       <Button onClick={reset}>Reset</Button>
 *     </div>
 *   );
 * }
 */
export function useThemeDesignEditValue(path: string, colorScheme?: 'light' | 'dark') {
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);
  const targetScheme = colorScheme ?? activeColorScheme;
  const isColorScheme = isColorSchemePath(path);
  
  // Determine which mode to read from
  const modeKey = targetScheme === 'light' ? 'lightMode' : 'darkMode';

  // Select only the data we need (performance: minimal subscriptions)
  const baseVisualValue = useThemeDesignStore((s) =>
    isColorScheme ? undefined : s.baseVisualEdits[path]
  );
  const schemeVisualValue = useThemeDesignStore((s) =>
    isColorScheme ? s[modeKey].visualEdits[path] : undefined
  );
  const codeFlattened = useThemeDesignStore((s) => s.codeOverridesFlattened);

  // Select action functions (stable references)
  const setVisualEdit = useThemeDesignStore((s) => s.setVisualEdit);
  const resetPath = useThemeDesignStore((s) => s.resetPath);

  // Get the resolved theme options (not Theme object) to read actual values
  const themeOptions = useResolvedThemeOptions(targetScheme);

  // Determine effective value and override flags
  const hasCodeOverride = path in codeFlattened;

  const hasVisualEdit = isColorScheme
    ? schemeVisualValue !== undefined
    : baseVisualValue !== undefined;

  // Effective value priority: code > visual > themeOptions (resolved from template + composables)
  const codeValue = hasCodeOverride ? codeFlattened[path] : undefined;
  const visualValue = isColorScheme ? schemeVisualValue : baseVisualValue;
  const themeValue = getNestedValue(themeOptions as unknown as Record<string, unknown>, path);
  const effectiveValue = (codeValue ?? visualValue ?? themeValue) as SerializableValue | undefined;

  // Return memoized value with all controls
  return useMemo(
    () => ({
      /** Current value at this path (may be from code override or visual edit) */
      value: effectiveValue,

    /** If true, this path is controlled by code override (UI should disable) */
    hasCodeOverride,

    /** If true, this path has a visual edit (user modified via UI) */
    hasVisualEdit,

    /** If true, this path has any modification (visual or code) */
    isModified: hasCodeOverride || hasVisualEdit,

    /** Update the value (always writes to visual layer) */
    setValue: (value: SerializableValue) => setVisualEdit(path, value),

    /** Reset this path (removes highest layer: code → visual → template) */
    reset: () => resetPath(path),
    }),
    [effectiveValue, hasCodeOverride, hasVisualEdit, setVisualEdit, path, resetPath]
  );
}

/**
 * Hook for accessing code overrides state.
 * Provides read-only access to source, error, and override status.
 * 
 * @returns Code overrides state
 * 
 * @example
 * function StatusBadge() {
 *   const { hasOverrides, error } = useCodeOverridesState();
 *   return hasOverrides ? <Badge color="warning">Code Active</Badge> : null;
 * }
 */
export function useCodeOverridesState() {
  const source = useThemeDesignStore((s) => s.codeOverridesSource);
  const error = useThemeDesignStore((s) => s.codeOverridesError);
  const hasOverrides = source.length > 0;

  return useMemo(
    () => ({
      /** Current saved code override source */
      source,

      /** Parse/evaluation error, if any */
      error,

      /** True if there are code overrides applied */
      hasOverrides,
    }),
    [source, error, hasOverrides]
  );
}

/**
 * Hook for accessing code overrides actions.
 * Provides functions to modify code overrides.
 * 
 * @returns Code overrides actions
 * 
 * @example
 * function ApplyButton() {
 *   const { applyChanges } = useCodeOverridesActions();
 *   const handleApply = () => applyChanges('{ palette: { primary: { main: "#ff0000" } } }');
 *   return <Button onClick={handleApply}>Apply</Button>;
 * }
 */
export function useCodeOverridesActions() {
  const applyCodeOverrides = useThemeDesignStore((s) => s.applyCodeOverrides);
  const clearCodeOverrides = useThemeDesignStore((s) => s.clearCodeOverrides);
  const resetToVisual = useThemeDesignStore((s) => s.resetToVisual);
  const resetToTemplate = useThemeDesignStore((s) => s.resetToTemplate);

  return useMemo(
    () => ({
      /** Apply code overrides from editor */
      applyChanges: (code: string) => applyCodeOverrides(code),

      /** Clear all code overrides */
      clearOverrides: () => clearCodeOverrides(),

      /** Reset to visual edits only (clear all code overrides) */
      resetToVisual,

      /** Reset to template base (clear all modifications) */
      resetToTemplate,
    }),
    [applyCodeOverrides, clearCodeOverrides, resetToVisual, resetToTemplate]
  );
}

/**
 * Hook for accessing merged theme preview without code overrides.
 * Used for diff comparison in code editor.
 * 
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns Merged theme preview (excludes code overrides)
 * 
 * @example
 * function DiffViewer() {
 *   const mergedPreview = useMergedThemePreview();
 *   return <pre>{JSON.stringify(mergedPreview, null, 2)}</pre>;
 * }
 */
export function useMergedThemePreview(colorScheme?: 'light' | 'dark'): ThemeOptions {
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);
  const targetScheme = colorScheme ?? activeColorScheme;

  const templateId = useThemeDesignStore((s) => s.selectedTemplateId.id);
  const baseVisualEdits = useThemeDesignStore((s) => s.baseVisualEdits);
  const lightMode = useThemeDesignStore((s) => s.lightMode);
  const darkMode = useThemeDesignStore((s) => s.darkMode);

  const modeEdits = targetScheme === 'light' ? lightMode : darkMode;

  return useMemo(() => {
    const template = getTemplate(templateId, targetScheme);

    return resolveThemeOptions({
      template,
      baseVisualEdits,
      colorSchemeVisualEdits: modeEdits.visualEdits,
      codeOverrides: {}, // Exclude code overrides for diff comparison
      colorScheme: targetScheme,
    });
  }, [templateId, baseVisualEdits, modeEdits.visualEdits, targetScheme]);
}

/**
 * Hook for code editor panel to manage code overrides.
 * Composes state, actions, and preview hooks for convenience.
 * 
 * @param colorScheme - Optional color scheme override (defaults to active scheme)
 * @returns Combined code editor state, actions, and preview
 * 
 * @example
 * function CodeEditorPanel() {
 *   const {
 *     source,
 *     error,
 *     hasOverrides,
 *     mergedPreview,
 *     applyChanges,
 *     clearOverrides,
 *   } = useCodeEditorPanel();
 *   
 *   const [editorContent, setEditorContent] = useState(source);
 *   
 *   return (
 *     <div>
 *       <CodeMirror value={editorContent} onChange={setEditorContent} />
 *       {error && <ErrorBanner>{error}</ErrorBanner>}
 *       <Button onClick={() => applyChanges(editorContent)}>Apply</Button>
 *       <Button onClick={clearOverrides}>Clear Overrides</Button>
 *       <DiffPanel before={mergedPreview} after={editorContent} />
 *     </div>
 *   );
 * }
 */
export function useCodeEditorPanel(colorScheme?: 'light' | 'dark') {
  const state = useCodeOverridesState();
  const actions = useCodeOverridesActions();
  const mergedPreview = useMergedThemePreview(colorScheme);

  return useMemo(
    () => ({
      ...state,
      ...actions,
      /** Merged theme preview (excludes code overrides, for diff comparison) */
      mergedPreview,
    }),
    [state, actions, mergedPreview]
  );
}

