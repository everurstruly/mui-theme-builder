import type { ThemeSnapshot } from ".";

/**
 * Create a fresh snapshot with all required fields.
 * This is the SINGLE SOURCE OF TRUTH for empty snapshot structure.
 *
 * CRITICAL RULES:
 * 1. Unsaved designs (templates/blank) MUST have empty string ID
 * 2. All edits MUST be empty (snapshots are flattened documents)
 * 3. baseTheme contains the complete final theme
 */
export function createFreshSnapshot(params: {
  id: string; // Use '' for unsaved (template/blank), real ID for saved
  title: string;
  baseThemeDsl: Record<string, unknown>;
  templateId?: string;
  sourceLabel?: string;
}): ThemeSnapshot {
  return {
    id: params.id,
    version: 1,
    title: params.title,
    createdAt: Date.now(),
    strategy: 'full',
    baseTheme: {
      type: 'inline',
      dsl: params.baseThemeDsl,
      metadata: {
        templateId: params.templateId,
        sourceLabel: params.sourceLabel,
      },
    },
    // ALWAYS empty - snapshots are flattened documents
    edits: {
      neutral: {},
      schemes: {
        light: { designer: {} },
        dark: { designer: {} },
      },
      codeOverrides: {
        source: '',
        dsl: {},
        flattened: {},
      },
    },
    preferences: {
      activeColorScheme: 'light',
    },
    checkpointHash: '',
  };
}
