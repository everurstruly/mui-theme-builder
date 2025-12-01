/**
 * Theme Deserializer
 * 
 * Pure deserialization - returns EditCommand[] without side effects.
 * Resolves base theme references and generates commands to restore state.
 */

import type { ThemeSnapshot, EditCommand, PersistenceError, ThemeDsl } from '../types';

export class ThemeDeserializer {
  private templateRegistry?: any;

  constructor(templateRegistry?: any) {
    this.templateRegistry = templateRegistry;
  }

  /**
   * Pure deserialization - returns commands, no side effects
   */
  deserialize(snapshot: ThemeSnapshot): EditCommand[] {
    const commands: EditCommand[] = [];
    
    // 1. Resolve base theme
    const baseDsl = this.resolveBaseTheme(snapshot.baseTheme);
    commands.push({
      type: 'set-base-theme',
      dsl: baseDsl,
      metadata: snapshot.baseTheme.metadata,
    });
    
    // 2. Set title
    commands.push({
      type: 'set-title',
      title: snapshot.title,
    });
    
    // 3. Apply neutral edits
    Object.entries(snapshot.edits.neutral).forEach(([path, value]) => {
      commands.push({
        type: 'apply-neutral-edit',
        path,
        value,
      });
    });
    
    // 4. Apply scheme edits
    Object.entries(snapshot.edits.schemes).forEach(([scheme, schemeData]) => {
      Object.entries(schemeData.designer).forEach(([path, value]) => {
        commands.push({
          type: 'apply-scheme-edit',
          scheme,
          path,
          value,
        });
      });
    });
    
    // 5. Apply code overrides
    if (snapshot.edits.codeOverrides.source) {
      commands.push({
        type: 'apply-code-overrides',
        source: snapshot.edits.codeOverrides.source,
        dsl: snapshot.edits.codeOverrides.dsl,
        flattened: snapshot.edits.codeOverrides.flattened,
      });
    }
    
    // 6. Set active color scheme
    commands.push({
      type: 'set-active-scheme',
      scheme: snapshot.preferences.activeColorScheme,
    });
    
    // NOTE: Don't include checkpoint in commands - it's set explicitly after all edits
    // in the load() function to avoid intermediate dirty states during deserialization
    
    return commands;
  }

  private resolveBaseTheme(baseTheme: ThemeSnapshot['baseTheme']): ThemeDsl {
    if (baseTheme.type === 'inline') {
      return baseTheme.dsl;
    }
    
    // Reference type - resolve from registry
    const ref = baseTheme.reference;
    
    if (!this.templateRegistry) {
      const error: PersistenceError = {
        code: 'TEMPLATE_MISSING',
        message: `Template registry not available to resolve ${ref.templateId}`,
        context: { reference: ref },
        recoverable: false,
      };
      throw error;
    }
    
    const template = this.templateRegistry.get(ref.templateId);
    
    if (!template) {
      const error: PersistenceError = {
        code: 'TEMPLATE_MISSING',
        message: `Template ${ref.templateId} not found`,
        context: { reference: ref },
        recoverable: false,
      };
      throw error;
    }
    
    // Verify template hasn't changed (optional but recommended)
    const currentChecksum = this.computeChecksum(template.themeOptions);
    if (ref.checksum && ref.checksum !== currentChecksum) {
      const error: PersistenceError = {
        code: 'INVALID_DATA',
        message: `Template ${ref.templateId} has evolved since save`,
        context: {
          reference: ref,
          savedChecksum: ref.checksum,
          currentChecksum,
          migrateToFull: true, // Hint: convert to full snapshot
        },
        recoverable: true, // Can be migrated
      };
      console.warn(error.message, error.context);
      // Continue anyway - template may still be compatible
    }
    
    // Parse template themeOptions as DSL
    return this.parseThemeOptions(template.themeOptions);
  }

  private parseThemeOptions(themeOptions: any): ThemeDsl {
    try {
      // If themeOptions is already an object, return as-is
      if (typeof themeOptions === 'object' && themeOptions !== null) {
        return themeOptions;
      }
      // If it's a string, parse it
      if (typeof themeOptions === 'string') {
        return JSON.parse(themeOptions);
      }
      return {};
    } catch {
      return {};
    }
  }

  private computeChecksum(themeOptions: any): string {
    const str = JSON.stringify(themeOptions);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}
