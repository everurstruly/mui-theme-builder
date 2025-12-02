/**
 * Load Strategies
 * 
 * Pure data provider functions for different load sources.
 * Each strategy fetches data and returns a ThemeSnapshot.
 * 
 * This is the strategy pattern - easy to extend with new sources.
 */

import { serializeThemeOptions } from "../compiler";
import { getTemplateById } from "../../Templates/registry";
import type { ThemeSnapshot } from "./useCurrent/types";
import type { StorageDependencies } from "../storage";

/**
 * Strategy result - what all strategies must return
 */
export interface LoadData {
  snapshot: ThemeSnapshot;
  metadata: {
    snapshotId?: string;
    updatedAt?: number;
    title?: string;
    sourceType: "snapshot" | "template" | "blank" | "custom";
  };
}

/**
 * Create a fresh snapshot with all required fields.
 * This is the SINGLE SOURCE OF TRUTH for empty snapshot structure.
 * 
 * CRITICAL RULES:
 * 1. Unsaved designs (templates/blank) MUST have empty string ID
 * 2. All edits MUST be empty (snapshots are flattened documents)
 * 3. baseTheme contains the complete final theme
 */
function createFreshSnapshot(params: {
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

/**
 * Validate that a snapshot follows our architecture rules.
 * Throws if snapshot is malformed.
 */
function validateSnapshot(snapshot: ThemeSnapshot, sourceType: string): void {
  // Rule 1: Unsaved designs must have empty ID
  if ((sourceType === 'template' || sourceType === 'blank') && snapshot.id !== '') {
    throw new Error(
      `[${sourceType}] snapshot MUST have empty ID, got: "${snapshot.id}". ` +
      `This would make it appear as a saved design.`
    );
  }
  
  // Rule 2: Saved designs must have real ID
  if (sourceType === 'snapshot' && !snapshot.id) {
    throw new Error(
      `[${sourceType}] snapshot MUST have a real ID, got empty string. ` +
      `This is a saved design from storage.`
    );
  }
  
  // Rule 3: Edits must be empty (we use flattened snapshots)
  const hasNeutralEdits = Object.keys(snapshot.edits.neutral).length > 0;
  const hasSchemeEdits = 
    Object.keys(snapshot.edits.schemes.light?.designer || {}).length > 0 ||
    Object.keys(snapshot.edits.schemes.dark?.designer || {}).length > 0;
  const hasCodeEdits = 
    snapshot.edits.codeOverrides?.source ||
    Object.keys(snapshot.edits.codeOverrides?.dsl || {}).length > 0;
  
  if (hasNeutralEdits || hasSchemeEdits || hasCodeEdits) {
    console.warn(
      `[${sourceType}] snapshot has non-empty edits. This violates our flattened architecture. ` +
      `Edits should be merged into baseTheme during serialization. ` +
      `If this is from old storage, migration should have flattened it.`,
      { neutral: hasNeutralEdits, scheme: hasSchemeEdits, code: hasCodeEdits }
    );
  }
}

/**
 * Load from saved snapshot
 */
export async function loadFromSnapshot(
  snapshotId: string,
  storage: StorageDependencies
): Promise<LoadData> {
  const snapshot = await storage.adapter.get(snapshotId);
  if (!snapshot) {
    throw {
      code: "INVALID_DATA",
      message: "Snapshot not found",
    };
  }

  // Validate before returning
  validateSnapshot(snapshot, "snapshot");

  return {
    snapshot,
    metadata: {
      snapshotId: snapshot.id,
      updatedAt: snapshot.updatedAt,
      title: snapshot.title,
      sourceType: "snapshot",
    },
  };
}

/**
 * Load from template
 */
export async function loadFromTemplate(
  templateId: string
): Promise<LoadData> {
  const template = getTemplateById(templateId);
  if (!template) {
    throw {
      code: "TEMPLATE_MISSING",
      message: "Template not found",
    };
  }

  const themeCode = serializeThemeOptions(template.themeOptions);
  const themeDsl = JSON.parse(themeCode);

  // Use factory to ensure consistency
  const snapshot = createFreshSnapshot({
    id: '', // Empty = unsaved/template
    title: template.label,
    baseThemeDsl: themeDsl,
    templateId,
    sourceLabel: template.label,
  });

  // Validate before returning
  validateSnapshot(snapshot, "template");

  return {
    snapshot,
    metadata: {
      title: template.label,
      sourceType: "template",
    },
  };
}

/**
 * Load blank design
 */
export async function loadBlank(): Promise<LoadData> {
  // Use factory to ensure consistency
  const snapshot = createFreshSnapshot({
    id: '', // Empty = unsaved/blank
    title: "Untitled Design",
    baseThemeDsl: {},
    sourceLabel: "Blank Design",
  });

  // Validate before returning
  validateSnapshot(snapshot, "blank");

  return {
    snapshot,
    metadata: {
      title: "Untitled Design",
      sourceType: "blank",
    },
  };
}

/**
 * Load from custom source (for extensibility)
 * Example: load from URL, clipboard, file upload, etc.
 */
export type LoadStrategy = () => Promise<LoadData>;
