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

  // Build a snapshot-like structure
  const snapshot: ThemeSnapshot = {
    id: `template-${templateId}`,
    version: 1,
    title: template.label,
    createdAt: Date.now(),
    strategy: 'full',
    baseTheme: {
      type: 'inline',
      dsl: themeDsl,
      metadata: {
        templateId,
        sourceLabel: template.label,
      },
    },
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
  const snapshot: ThemeSnapshot = {
    id: 'blank',
    version: 1,
    title: "Untitled Design",
    createdAt: Date.now(),
    strategy: 'full',
    baseTheme: {
      type: 'inline',
      dsl: {},
      metadata: {
        sourceLabel: "Blank Design",
      },
    },
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
