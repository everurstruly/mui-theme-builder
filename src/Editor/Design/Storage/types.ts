export interface SavedSessionData {
  activeColorScheme?: "light" | "dark";
  neutralEdits?: Record<string, any>;
  light?: { designer?: Record<string, any> };
  dark?: { designer?: Record<string, any> };
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
