/**
 * Theme Serializer
 * 
 * Converts DesignEditStore state into ThemeSnapshot format.
 * Supports multiple serialization strategies (full, delta, hybrid).
 */

import type { CurrentDesignStore, SerializableValue } from "../../Current/useCurrent/types";
import type { SerializationStrategy, ThemeSnapshot } from "../types";

interface SerializeOptions {
  id?: string;
  title?: string;
  strategy?: SerializationStrategy;
}

export class ThemeSerializer {
  private templateRegistry?: any;

  constructor(templateRegistry?: any) {
    this.templateRegistry = templateRegistry;
  }

  serialize(editState: CurrentDesignStore, options: SerializeOptions = {}): ThemeSnapshot {
    const strategy = options.strategy ?? this.autoDetectStrategy(editState);
    const title = options.title ?? editState.title ?? 'Untitled';
    const id = options.id;

    return {
      id: id ?? '', // Will be set by adapter.create if empty
      version: 1,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      strategy,
      
      baseTheme: this.serializeBaseTheme(editState, strategy),
      
      edits: {
        neutral: editState.neutralEdits ?? {},
        schemes: {
          light: { 
            designer: editState.schemeEdits?.light?.designer ?? {},
          },
          dark: { 
            designer: editState.schemeEdits?.dark?.designer ?? {},
          },
        },
        codeOverrides: {
          source: editState.codeOverridesSource ?? '',
          dsl: editState.codeOverridesDsl || {},
          flattened: editState.codeOverridesEdits ?? {},
        },
      },
      
      preferences: {
        activeColorScheme: editState.activeColorScheme ?? 'light',
      },
      
      checkpointHash: editState.contentHash ?? '',
    };
  }

  private serializeBaseTheme(editState: CurrentDesignStore, strategy: SerializationStrategy): ThemeSnapshot['baseTheme'] {
    const templateId = editState.baseThemeOptionSourceMetadata?.templateId;
    const baseDsl = this.parseThemeCode(editState.baseThemeOptionSource ?? '{}');
    
    if (strategy === 'full' || !templateId) {
      return {
        type: 'inline',
        dsl: baseDsl,
        metadata: {
          templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.label
        },
      };
    }
    
    // Delta/hybrid strategy with template reference
    if (!this.templateRegistry) {
      console.warn('Template registry not available, falling back to full snapshot');
      return {
        type: 'inline',
        dsl: baseDsl,
        metadata: {
          templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.label,
        },
      };
    }
    
    const template = this.templateRegistry.get(templateId);
    if (!template) {
      console.warn(`Template ${templateId} not found, using full snapshot`);
      return {
        type: 'inline',
        dsl: baseDsl,
        metadata: {
          templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.label,
        },
      };
    }
    
    return {
      type: 'reference',
      reference: {
        templateId,
        version: template.version ?? '1.0',
        checksum: this.computeChecksum(template.themeOptions),
      },
      metadata: {
        templateId,
        sourceLabel: template.label ?? templateId,
      },
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

  private computeChecksum(themeOptions: any): string {
    // Simple hash for template verification
    const str = JSON.stringify(themeOptions);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
