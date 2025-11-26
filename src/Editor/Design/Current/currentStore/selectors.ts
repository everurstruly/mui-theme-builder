/**
 * Derived Selectors - Computed State
 * 
 * Responsibilities:
 * - Derive computed state from domain slices
 * - Memoize expensive computations
 * - Provide flattened/resolved theme options
 * 
 * Computed values:
 * - hasUnsavedChanges (derived from version comparison)
 * - resolvedCodeOverrides (lazy evaluation of DSL → ThemeOptions)
 * - flattenedCodeOverrides (lazy flattening for path lookups)
 * - canUndo/canRedo (derived from history state)
 */

import { useMemo } from 'react';
import { themeCompiler } from '../../themeCompiler';
import type { ThemeOptions } from '@mui/material';
import type { SerializableValue } from './domainSlice';
import type { ThemeDesignStore } from '../currentStore';

// ===== Hooks for Derived State =====

/**
 * Check if there are unsaved changes.
 * Compares current version with saved version.
 */
export function useHasUnsavedChanges(store: ThemeDesignStore): boolean {
  const currentVersion = store.version;
  const savedVersion = store.savedVersion;
  return currentVersion !== savedVersion;
}

/**
 * Get resolved code overrides as executable ThemeOptions.
 * Memoized based on codeOverridesDsl.
 * 
 * Note: This is a placeholder. Actual resolution requires
 * dslToThemeOptionsTransformer from the DSL module.
 */
export function useResolvedCodeOverrides(store: ThemeDesignStore): ThemeOptions {
  const dsl = store.codeOverridesDsl;
  
  return useMemo(() => {
    // TODO: Import and use dslToThemeOptionsTransformer
    // For now, return empty object
    // const resolved = dslToThemeOptions(dsl);
    // return resolved;
    console.log(dsl); // Prevents unused variable warning
    return {};
  }, [dsl]);
}

/**
 * Get flattened code overrides for path lookups.
 * Memoized based on resolved overrides.
 */
export function useFlattenedCodeOverrides(
  store: ThemeDesignStore
): Record<string, SerializableValue> {
  const resolved = useResolvedCodeOverrides(store);
  
  return useMemo(() => {
    return themeCompiler.flatten(resolved);
  }, [resolved]);
}

/**
 * Get all visual edits for a specific color scheme.
 * Combines global and scheme-specific edits.
 */
export function useVisualEdits(
  store: ThemeDesignStore,
  scheme: string
): Record<string, SerializableValue> {
  const globalEdits = store.colorSchemeIndependentVisualToolEdits;
  const colorSchemes = store.colorSchemes;
  
  return useMemo(() => {
    const schemeEdits = colorSchemes[scheme]?.visualToolEdits || {};
    return { ...globalEdits, ...schemeEdits };
  }, [globalEdits, colorSchemes, scheme]);
}

// ===== Non-Hook Selector Functions =====

/**
 * Check if there are unsaved changes (non-hook version).
 * Use this in callbacks or outside React components.
 */
export function hasUnsavedChanges(store: ThemeDesignStore): boolean {
  return store.version !== store.savedVersion;
}

/**
 * Check if undo is available for visual edits.
 */
export function canUndoVisual(store: ThemeDesignStore): boolean {
  return store.canUndoVisual();
}

/**
 * Check if redo is available for visual edits.
 */
export function canRedoVisual(store: ThemeDesignStore): boolean {
  return store.canRedoVisual();
}

/**
 * Check if undo is available for code overrides.
 */
export function canUndoCode(store: ThemeDesignStore): boolean {
  return store.canUndoCode();
}

/**
 * Check if redo is available for code overrides.
 */
export function canRedoCode(store: ThemeDesignStore): boolean {
  return store.canRedoCode();
}

/**
 * Get visual edit for a specific path and scheme.
 */
export function getVisualEdit(
  store: ThemeDesignStore,
  path: string,
  scheme: string
): SerializableValue {
  // Compose from domain state (no legacy helper required)
  const global = store.colorSchemeIndependentVisualToolEdits || {};
  const schemeEdits = store.colorSchemes?.[scheme]?.visualToolEdits || {};
  return { ...global, ...schemeEdits }[path];
}

/**
 * Get all visual edits (non-hook version).
 */
export function getVisualEdits(
  store: ThemeDesignStore,
  scheme: string
): Record<string, SerializableValue> {
  return {
    ...store.colorSchemeIndependentVisualToolEdits,
    ...(store.colorSchemes[scheme]?.visualToolEdits || {}),
  };
}
