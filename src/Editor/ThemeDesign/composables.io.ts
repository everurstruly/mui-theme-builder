/**
 * Composables Import/Export utilities
 * 
 * Enables sharing and reusing composable configurations independently from themes.
 * Composables can be exported as JSON and imported into any project.
 */

import { listThemeComposables } from './themeComposables';

/**
 * Export format for composables configuration
 */
export interface ComposablesExport {
  /** Format version for backward compatibility */
  version: string;
  /** Map of composable IDs to enabled state */
  composables: Record<string, boolean>;
  /** Optional metadata about this composables set */
  metadata?: {
    name?: string;
    description?: string;
    author?: string;
    createdAt?: string;
  };
}

/**
 * Result of importing composables
 */
export interface ComposablesImportResult {
  /** Successfully imported composables */
  composables: Record<string, boolean>;
  /** Composable IDs that were invalid/not found */
  invalidIds: string[];
  /** Warning messages */
  warnings: string[];
}

/**
 * Exports enabled composables to a shareable format.
 * 
 * @param enabledComposables - Map of composable IDs to enabled state
 * @param metadata - Optional metadata about this set
 * @returns ComposablesExport object ready for JSON serialization
 * 
 * @example
 * const exported = exportComposables(
 *   { 'dense-buttons': true, 'rounded-corners': true },
 *   { name: 'Dense UI', description: 'Compact layout with dense buttons' }
 * );
 * console.log(JSON.stringify(exported, null, 2));
 */
export function exportComposables(
  enabledComposables: Record<string, boolean>,
  metadata?: ComposablesExport['metadata']
): ComposablesExport {
  // Only include enabled composables
  const filtered: Record<string, boolean> = {};
  for (const [id, enabled] of Object.entries(enabledComposables)) {
    if (enabled) {
      filtered[id] = true;
    }
  }

  return {
    version: '1.0.0',
    composables: filtered,
    metadata: metadata
      ? {
          ...metadata,
          createdAt: metadata.createdAt || new Date().toISOString(),
        }
      : undefined,
  };
}

/**
 * Imports and validates composables from exported JSON.
 * 
 * @param json - Exported composables JSON (can be string or parsed object)
 * @returns Import result with validated composables and any warnings
 * @throws Error if JSON is invalid or version is unsupported
 * 
 * @example
 * const result = importComposables(jsonString);
 * if (result.warnings.length > 0) {
 *   console.warn('Import warnings:', result.warnings);
 * }
 * // Apply validated composables
 * themeDesignStore.applyComposables(result.composables);
 */
export function importComposables(
  json: string | ComposablesExport
): ComposablesImportResult {
  // Parse if string
  let data: ComposablesExport;
  if (typeof json === 'string') {
    try {
      data = JSON.parse(json);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Parse failed'}`);
    }
  } else {
    data = json;
  }

  // Validate structure
  if (!data.version || !data.composables) {
    throw new Error('Invalid composables export format: missing version or composables');
  }

  // Check version compatibility
  const [major] = data.version.split('.').map(Number);
  if (major !== 1) {
    throw new Error(`Unsupported version: ${data.version}. Expected 1.x.x`);
  }

  // Get list of valid composable IDs
  const validComposableIds = new Set(
    listThemeComposables().map((c) => c.id)
  );

  // Validate each composable ID
  const validated: Record<string, boolean> = {};
  const invalidIds: string[] = [];
  const warnings: string[] = [];

  for (const [id, enabled] of Object.entries(data.composables)) {
    if (!validComposableIds.has(id)) {
      invalidIds.push(id);
      warnings.push(`Composable "${id}" not found in current registry`);
      continue;
    }

    validated[id] = enabled;
  }

  return {
    composables: validated,
    invalidIds,
    warnings,
  };
}

/**
 * Generates a human-readable description of a composables set.
 * Useful for displaying in UI before importing.
 */
export function describeComposablesExport(data: ComposablesExport): string {
  const enabledCount = Object.values(data.composables).filter(Boolean).length;
  const allComposables = listThemeComposables();
  
  const descriptions: string[] = [];
  
  if (data.metadata?.name) {
    descriptions.push(`Name: ${data.metadata.name}`);
  }
  
  if (data.metadata?.description) {
    descriptions.push(`Description: ${data.metadata.description}`);
  }
  
  descriptions.push(`Enabled composables: ${enabledCount}`);
  
  // List enabled composables with their labels
  const enabled = Object.entries(data.composables)
    .filter(([, isEnabled]) => isEnabled)
    .map(([id]) => {
      const composable = allComposables.find((c) => c.id === id);
      return composable ? composable.label : id;
    });
  
  if (enabled.length > 0) {
    descriptions.push(`Includes: ${enabled.join(', ')}`);
  }
  
  return descriptions.join('\n');
}
