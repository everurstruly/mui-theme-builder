/**
 * Theme Serializer
 * 
 * Converts DesignEditStore state into ThemeSnapshot format.
 * Supports multiple serialization strategies (full, delta, hybrid).
 */

import type { ThemeSnapshot, SerializationStrategy, SerializableValue } from '../types';

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

  serialize(editState: any, options: SerializeOptions = {}): ThemeSnapshot {
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
            designer: editState.colorSchemes?.light?.designer ?? {} 
          },
          dark: { 
            designer: editState.colorSchemes?.dark?.designer ?? {} 
          },
        },
        codeOverrides: {
          source: editState.codeOverridesSource ?? '',
          dsl: editState.codeOverridesDsl ?? {},
          flattened: editState.codeOverridesEdits ?? {},
        },
      },
      
      preferences: {
        activeColorScheme: editState.activeColorScheme ?? 'light',
      },
      
      checkpointHash: editState.contentHash ?? '',
    };
  }

  private serializeBaseTheme(editState: any, strategy: SerializationStrategy): ThemeSnapshot['baseTheme'] {
    const templateId = editState.baseThemeOptionSourceMetadata?.templateId;
    const baseDsl = this.parseThemeCode(editState.baseThemeOptionSource ?? '{}');
    
    if (strategy === 'full' || !templateId) {
      return {
        type: 'inline',
        dsl: baseDsl,
        metadata: {
          templateId,
          sourceLabel: editState.baseThemeOptionSourceMetadata?.sourceLabel,
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
          sourceLabel: editState.baseThemeOptionSourceMetadata?.sourceLabel,
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
          sourceLabel: editState.baseThemeOptionSourceMetadata?.sourceLabel,
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

  private autoDetectStrategy(editState: any): SerializationStrategy {
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
