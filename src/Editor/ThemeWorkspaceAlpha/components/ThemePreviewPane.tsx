import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { resolveThemeOptionsForPreview } from '../themeOptionsResolver';
import { useThemeWorkspaceStore } from '../stores/themeWorkspace.store';
import type { ReactNode } from 'react';

interface ThemePreviewPaneProps {
  /** Child components to render within the themed context */
  children: ReactNode;
}

/**
 * Preview pane that wraps children with a MUI ThemeProvider.
 * Uses failsafe resolution mode for safe live preview.
 *
 * Automatically re-renders when:
 * - Base theme changes
 * - Composables are toggled
 * - Raw modifications change (live editing)
 * - Resolved modifications change (committed)
 */
export const ThemePreviewPane = ({ children }: ThemePreviewPaneProps) => {
  // Subscribe to all state that affects theme resolution
  const activeBaseTheme = useThemeWorkspaceStore((state) => state.activeBaseThemeOption);
  const composables = useThemeWorkspaceStore((state) => state.appearanceComposablesState);
  const resolved = useThemeWorkspaceStore((state) => state.resolvedThemeOptionsModifications);
  const raw = useThemeWorkspaceStore((state) => state.rawThemeOptionsModifications);

  // Resolve theme options in failsafe mode (safe for live preview)
  const themeOptions = useMemo(() => {
    return resolveThemeOptionsForPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBaseTheme, composables, resolved, raw]);

  // Create MUI theme
  const theme = useMemo(() => {
    try {
      return createTheme(themeOptions);
    } catch (error) {
      console.error('[ThemePreviewPane] Failed to create theme:', error);
      // Fallback to default MUI theme
      return createTheme();
    }
  }, [themeOptions]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
