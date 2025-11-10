import { useMemo } from 'react';
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';
import { useThemeDesignStore } from './themeDesign.store';
import { resolveThemeOptions } from './themeDesign.resolver';
import { isColorSchemePath, getNestedValue } from './themeDesign.utils';
import type { SerializableValue } from './types';
import { getThemeTemplate } from './themeTemplates';
import { getThemeComposable } from './themeComposables';

// Template loader - uses existing ThemeSheet templates
function getTemplate(templateId: string, colorScheme: 'light' | 'dark'): ThemeOptions {
  try {
    const rawTemplate = getThemeTemplate(templateId, colorScheme);
    
    // CRITICAL: Templates only define minimal palette (primary, secondary, etc.)
    // We need to run createTheme() to get MUI's full defaults (divider, error, warning, etc.)
    // Then extract the options back out to get a complete ThemeOptions object
    const expandedTheme = createTheme(rawTemplate);
    
    // Extract the fully-expanded options from the Theme object
    // This includes all MUI-generated defaults for palette, typography, spacing, etc.
    return {
      palette: expandedTheme.palette,
      typography: expandedTheme.typography,
      spacing: expandedTheme.spacing,
      shape: expandedTheme.shape,
      breakpoints: expandedTheme.breakpoints,
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

// Composables loader - uses ThemeDesign composables
function getComposableOptions(composableId: string, colorScheme: 'light' | 'dark'): ThemeOptions {
  try {
    const composable = getThemeComposable(composableId);
    
    // Call getOptions with the color scheme
    return composable.getOptions(colorScheme);
  } catch (error) {
    console.error(`[getComposableOptions] Failed to load composable ${composableId}:`, error);
    return {};
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
  const enabledComposables = useThemeDesignStore((s) => s.enabledComposables);
  const baseVisualEdits = useThemeDesignStore((s) => s.baseVisualEdits);
  const codeOverridesEvaluated = useThemeDesignStore((s) => s.codeOverridesEvaluated);
  const lightMode = useThemeDesignStore((s) => s.lightMode);
  const darkMode = useThemeDesignStore((s) => s.darkMode);
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);

  const targetScheme = colorScheme ?? activeColorScheme;
  const modeEdits = targetScheme === 'light' ? lightMode : darkMode;

  return useMemo(() => {
    console.log('Recalculating... theme options with:', { templateId, targetScheme });

    // Get base template
    const template = getTemplate(templateId, targetScheme);

    // Get enabled composables
    const composables = Object.entries(enabledComposables)
      .filter(([, enabled]) => enabled)
      .map(([id]) => getComposableOptions(id, targetScheme));

    // Resolve all layers
    return resolveThemeOptions({
      template,
      composables,
      baseVisualEdits,
      colorSchemeVisualEdits: modeEdits.visualEdits,
      codeOverrides: codeOverridesEvaluated,
      colorScheme: targetScheme,
    });
  }, [
    templateId,
    enabledComposables,
    baseVisualEdits,
    codeOverridesEvaluated,
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
      // Fallback to default MUI theme
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
 * Hook for code editor panel to manage code overrides.
 * 
 * @param scope - 'global' or 'current-scheme'
 * @returns Code editor state and actions
 * 
 * @example
 * function CodeEditorPanel() {
 *   const {
 *     source,
 *     error,
 *     hasChanges,
 *     mergedPreview,
 *     applyChanges,
 *     clearOverrides,
 *   } = useCodeEditorPanel('current-scheme');
 *   
 *   const [editorContent, setEditorContent] = useState(source);
 *   
 *   return (
 *     <div>
 *       <MonacoEditor value={editorContent} onChange={setEditorContent} />
 *       {error && <ErrorBanner>{error}</ErrorBanner>}
 *       <Button onClick={() => applyChanges(editorContent)}>Apply</Button>
 *       <Button onClick={clearOverrides}>Clear Overrides</Button>
 *       <DiffPanel before={mergedPreview} after={editorContent} />
 *     </div>
 *   );
 * }
 */
export function useCodeEditorPanel() {
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);

  // Select state
  const source = useThemeDesignStore((s) => s.codeOverridesSource);
  const error = useThemeDesignStore((s) => s.codeOverridesError);

  // Select actions
  const applyCodeOverrides = useThemeDesignStore((s) => s.applyCodeOverrides);
  const clearCodeOverrides = useThemeDesignStore((s) => s.clearCodeOverrides);
  const resetToVisual = useThemeDesignStore((s) => s.resetToVisual);
  const resetToTemplate = useThemeDesignStore((s) => s.resetToTemplate);

  // Compute merged preview (template + composables + visual edits, excluding code overrides)
  const mergedPreview = useResolvedThemeOptionsWithoutCode(activeColorScheme);

  return {
    /** Current saved code override source */
    source,

    /** Parse/evaluation error, if any */
    error,

    /** True if there are code overrides applied */
    hasOverrides: source.length > 0,

    /** Merged theme preview (excludes code overrides, for diff comparison) */
    mergedPreview,

    /** Apply code overrides from Monaco editor */
    applyChanges: (code: string) => applyCodeOverrides(code),

    /** Clear all code overrides */
    clearOverrides: () => clearCodeOverrides(),

    /** Reset to visual edits only (clear all code overrides) */
    resetToVisual,

    /** Reset to template base (clear all modifications) */
    resetToTemplate,
  };
}

/**
 * Internal helper that resolves theme options WITHOUT code overrides.
 * Used for diff comparison in code editor.
 */
function useResolvedThemeOptionsWithoutCode(
  colorScheme: 'light' | 'dark'
): ThemeOptions {
  const templateId = useThemeDesignStore((s) => s.selectedTemplateId.id);
  const enabledComposables = useThemeDesignStore((s) => s.enabledComposables);
  const baseVisualEdits = useThemeDesignStore((s) => s.baseVisualEdits);
  const lightMode = useThemeDesignStore((s) => s.lightMode);
  const darkMode = useThemeDesignStore((s) => s.darkMode);

  const modeEdits = colorScheme === 'light' ? lightMode : darkMode;

  return useMemo(() => {
    const template = getTemplate(templateId, colorScheme);
    const composables = Object.entries(enabledComposables)
      .filter(([, enabled]) => enabled)
      .map(([id]) => getComposableOptions(id, colorScheme));

    return resolveThemeOptions({
      template,
      composables,
      baseVisualEdits,
      colorSchemeVisualEdits: modeEdits.visualEdits,
      codeOverrides: {}, // Exclude code overrides for diff comparison
      colorScheme,
    });
  }, [templateId, enabledComposables, baseVisualEdits, modeEdits.visualEdits, colorScheme]);
}

