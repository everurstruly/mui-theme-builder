import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { resolveThemeOptionsForPreview } from '../themeOptionsResolver';
import { useThemeSheetStore } from '../stores/themeWorkspace.store';

/**
 * Hook that returns a fully resolved MUI Theme for preview/canvas rendering.
 * Uses failsafe resolution mode for safe live preview with error handling.
 *
 * Automatically re-renders when:
 * - Base theme changes
 * - Composables are toggled
 * - Raw modifications change (live editing)
 * - Resolved modifications change (committed)
 *
 * @returns MUI Theme instance ready for use with ThemeProvider or sx prop
 *
 * @example
 * ```tsx
 * function Canvas() {
 *   const theme = useThemePreview();
 *   return (
 *     <Box sx={{ bgcolor: theme.palette.background.default }}>
 *       <ThemeProvider theme={theme}>
 *         <YourComponents />
 *       </ThemeProvider>
 *     </Box>
 *   );
 * }
 * ```
 */
export const useThemeSheetCreatedTheme = (): Theme => {
  // Subscribe to all state that affects theme resolution
  const activeBaseTheme = useThemeSheetStore((state) => state.activeBaseThemeOption);
  const composables = useThemeSheetStore((state) => state.appearanceComposablesState);
  const resolved = useThemeSheetStore((state) => state.resolvedThemeOptionsModifications);
  const raw = useThemeSheetStore((state) => state.rawThemeOptionsModifications);
  const colorScheme = useThemeSheetStore((state) => state.colorScheme);

  // Resolve theme options in failsafe mode and create MUI theme
  const theme = useMemo(() => {
    try {
      const themeOptions = resolveThemeOptionsForPreview();
      // Simple createTheme with palette.mode control
      return createTheme(themeOptions);
    } catch (error) {
      console.error('[useThemePreview] Failed to create theme:', error);
      // Fallback to default MUI theme
      return createTheme();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBaseTheme, composables, resolved, raw, colorScheme]);

  return theme;
};

