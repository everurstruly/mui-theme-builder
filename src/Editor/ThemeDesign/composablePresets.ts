/**
 * Preset Composable Sets
 * 
 * Ready-to-use collections of composables for common use cases.
 * Users can apply these presets or use them as starting points.
 */

import type { ComposablesExport } from './composables.io';

/**
 * Dense UI preset - compact layout optimized for data-heavy interfaces
 */
export const DENSE_UI_PRESET: ComposablesExport = {
  version: '1.0.0',
  composables: {
    'dense-spacing': true,
    'dense-buttons': true,
    'dense-icon-buttons': true,
    'dense-inputs': true,
    'dense-tables': true,
    'dense-lists': true,
    'dense-toolbars': true,
  },
  metadata: {
    name: 'Dense UI',
    description: 'Compact layout with dense spacing and smaller components. Ideal for dashboards and data-heavy interfaces.',
    author: 'MUI Theme Builder',
  },
};

/**
 * Accessibility preset - enhanced readability and contrast
 */
export const ACCESSIBILITY_PRESET: ComposablesExport = {
  version: '1.0.0',
  composables: {
    'high-contrast': true,
    'large-text': true,
  },
  metadata: {
    name: 'Accessibility Enhanced',
    description: 'High contrast colors and larger text for better readability. Meets WCAG 2.1 Level AA standards.',
    author: 'MUI Theme Builder',
  },
};

/**
 * Minimalist preset - clean, spacious design with subtle elements
 */
export const MINIMALIST_PRESET: ComposablesExport = {
  version: '1.0.0',
  composables: {
    'rounded-corners': true,
  },
  metadata: {
    name: 'Minimalist',
    description: 'Clean, spacious design with subtle rounded corners. Less visual clutter.',
    author: 'MUI Theme Builder',
  },
};

/**
 * Elevated preset - prominent shadows and depth
 */
export const ELEVATED_PRESET: ComposablesExport = {
  version: '1.0.0',
  composables: {
    'elevated-surfaces': true,
    'rounded-corners': true,
  },
  metadata: {
    name: 'Elevated Surfaces',
    description: 'Prominent shadows and rounded corners for a floating, layered appearance.',
    author: 'MUI Theme Builder',
  },
};

/**
 * Dashboard preset - optimized for admin panels and dashboards
 */
export const DASHBOARD_PRESET: ComposablesExport = {
  version: '1.0.0',
  composables: {
    'dense-spacing': true,
    'dense-tables': true,
    'dense-toolbars': true,
  },
  metadata: {
    name: 'Dashboard Optimized',
    description: 'Dense spacing and compact tables/toolbars for efficient dashboard layouts.',
    author: 'MUI Theme Builder',
  },
};

/**
 * All available presets
 */
export const COMPOSABLE_PRESETS = {
  denseUi: DENSE_UI_PRESET,
  accessibility: ACCESSIBILITY_PRESET,
  minimalist: MINIMALIST_PRESET,
  elevated: ELEVATED_PRESET,
  dashboard: DASHBOARD_PRESET,
} as const;

/**
 * Preset IDs for easier access
 */
export type ComposablePresetId = keyof typeof COMPOSABLE_PRESETS;

/**
 * Get a preset by ID
 */
export function getComposablePreset(id: ComposablePresetId): ComposablesExport {
  return COMPOSABLE_PRESETS[id];
}

/**
 * List all available preset IDs
 */
export function listComposablePresets(): ComposablePresetId[] {
  return Object.keys(COMPOSABLE_PRESETS) as ComposablePresetId[];
}

/**
 * Get metadata for all presets (useful for UI display)
 */
export function getComposablePresetsMetadata() {
  return Object.entries(COMPOSABLE_PRESETS).map(([id, preset]) => ({
    id,
    ...preset.metadata,
    enabledCount: Object.values(preset.composables).filter(Boolean).length,
  }));
}
