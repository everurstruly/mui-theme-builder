/**
 * Theme Serializer
 * 
 * Converts DesignEditStore state into ThemeSnapshot format.
 * Supports multiple serialization strategies (full, delta, hybrid).
 */

import type { CurrentDesignStore, SerializableValue } from "../../Current/useCurrent/types";
import type { SerializationStrategy, ThemeSnapshot } from "../types";
import { deepMerge, expandFlatThemeOptions } from "../../compiler/utilities/objectOps";

interface SerializeOptions {
  id?: string;
  title?: string;
  strategy?: SerializationStrategy;
}

export class ThemeSerializer {
  constructor(_templateRegistry?: any) {
    // Template registry not used in flattened snapshot approach
  }

  serialize(editState: CurrentDesignStore, options: SerializeOptions = {}): ThemeSnapshot {
    const strategy = options.strategy ?? this.autoDetectStrategy(editState);
    const title = options.title ?? editState.title ?? 'Untitled';
    const id = options.id;

    // Flatten edits into base theme - snapshot IS the final document
    const flattenedBase = this.flattenEditsIntoBase(editState);

    return {
      id: id ?? '', // Will be set by adapter.create if empty
      version: 1,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      strategy,
      
      // Store the flattened theme as base (with template metadata preserved)
      baseTheme: {
        type: 'inline',
        dsl: flattenedBase,
        metadata: {
          templateId: editState.baseThemeOptionSourceMetadata?.templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.label,
        },
      },
      
      // No edits - the snapshot IS the base
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
        activeColorScheme: editState.activeColorScheme ?? 'light',
      },
      
      checkpointHash: editState.contentHash ?? '',
    };
  }

  private autoDetectStrategy(editState: CurrentDesignStore): SerializationStrategy {
    const size = (editState.baseThemeOptionSource ?? '').length;
    const hasTemplateId = !!editState.baseThemeOptionSourceMetadata?.templateId;
    
    return (size < 10_000 || !hasTemplateId) ? 'full' : 'delta';
  }

  private parseThemeCode(source: string): Record<string, SerializableValue> {
    try {
      return JSON.parse(source);
    } catch {
      return {};
    }
  }

  private flattenEditsIntoBase(editState: CurrentDesignStore): Record<string, SerializableValue> {
    // Start with base theme DSL
    const baseDsl = this.parseThemeCode(editState.baseThemeOptionSource ?? '{}');
    
    let result = { ...baseDsl };
    
    // Merge neutral edits
    if (editState.neutralEdits && Object.keys(editState.neutralEdits).length > 0) {
      const expandedNeutral = expandFlatThemeOptions(editState.neutralEdits);
      result = deepMerge(result, expandedNeutral) as Record<string, SerializableValue>;
    }
    
    // Merge scheme edits (for active scheme)
    const activeScheme = editState.activeColorScheme ?? 'light';
    const schemeEdits = editState.schemeEdits?.[activeScheme]?.designer ?? {};
    if (Object.keys(schemeEdits).length > 0) {
      const expandedScheme = expandFlatThemeOptions(schemeEdits);
      result = deepMerge(result, expandedScheme) as Record<string, SerializableValue>;
    }
    
    // Merge code overrides
    if (editState.codeOverridesDsl && Object.keys(editState.codeOverridesDsl).length > 0) {
      result = deepMerge(result, editState.codeOverridesDsl) as Record<string, SerializableValue>;
    }
    
    return result;
  }
}
