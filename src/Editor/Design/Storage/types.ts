export interface SavedSessionData {
  activeColorScheme?: "light" | "dark";
  colorSchemeIndependentVisualToolEdits?: Record<string, any>;
  light?: { visualToolEdits?: Record<string, any> };
  dark?: { visualToolEdits?: Record<string, any> };
  codeOverridesSource?: string;
}

export interface SavedToStorageDesign {
  id: string;
  title: string;
  createdAt: number;
  updatedAt?: number;
  themeOptionsCode: string;
  session?: SavedSessionData;
}

export const MAX_SAVED = 50;
