import type { ThemeDsl } from "../../compiler";

export type SerializableValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

export interface ColorSchemeEdits {
  designer: Record<string, SerializableValue>;
}

export interface ThemeMetadata {
  templateId?: string;
  createdAtTimestamp: number;
  lastModifiedTimestamp: number;
}

export interface ThemeCurrentState {
  title: string;
  baseThemeOptionSource: string;
  baseThemeOptionSourceMetadata: ThemeMetadata;
  neutralEdits: Record<string, SerializableValue>;
  schemeEdits: Record<string, ColorSchemeEdits>;
  codeOverridesSource: string;
  codeOverridesDsl: ThemeDsl;
  codeOverridesEdits: Record<string, SerializableValue>;
  codeOverridesError: string | null;
  contentHash: string;
  lastStoredContentHash: string;
  modificationTimestamps: Record<string, number>;
}

export interface ThemeCurrentActions {
  setTitle: (title: string) => void;
  setBaseThemeOption: (
    themeCodeOrDsl: string | ThemeDsl,
    metadata?: Partial<ThemeMetadata> & { title?: string }
  ) => void;
  addGlobalDesignerEdit: (path: string, value: SerializableValue) => void;
  addSchemeDesignerEdit: (
    scheme: string,
    path: string,
    value: SerializableValue
  ) => void;
  removeGlobalDesignerEdit: (path: string) => void;
  removeSchemeDesignerEdit: (scheme: string, path: string) => void;
  getGlobalDesignerEdit: (path: string) => SerializableValue;
  getSchemeDesignerEdit: (scheme: string, path: string) => SerializableValue;
  clearDesignerEdits: (
    scope: "global" | "current-scheme" | "all",
    scheme: string
  ) => void;
  setCodeOverrides: (
    source: string,
    dsl: ThemeDsl,
    flattened: Record<string, SerializableValue>,
    error: string | null
  ) => void;
  clearCodeOverrides: () => void;
  loadNew: (
    themeCodeOrDsl?: string | ThemeDsl,
    metadata?: Partial<ThemeMetadata> & { title?: string }
  ) => void;
  resetToBase: () => void;
  acknowledgeStoredModifications: () => void;
}

export type DesignEditCurrentSlice = ThemeCurrentState & ThemeCurrentActions;
