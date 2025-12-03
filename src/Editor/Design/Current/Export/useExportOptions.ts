import { create } from "zustand";

// Types matching the existing codebase's export hook
export type ExportMode = "diff" | "merged";
export type ExportColorScheme = "light" | "dark" | "dual";
export type ExportLanguage = "ts" | "js" | "json";

interface ExportOptionsState {
  title?: string;
  mode: ExportMode;
  colorScheme: ExportColorScheme;
  language: ExportLanguage;
  opened: boolean;

  setTitle: (title?: string) => void;
  setMode: (mode: ExportMode) => void;
  setColorScheme: (colorScheme: ExportColorScheme) => void;
  setLanguage: (language: ExportLanguage) => void;
  setOpened: (opened: boolean) => void;
  reset: () => void;
}

/**
 * Zustand store for sharing export-related options across components.
 * - Keeps the same default values as the original `useExport` hook.
 * - Exposes setters so components can update the shared state.
 */
const useExportOptions = create<ExportOptionsState>((set) => ({
  title: undefined,
  mode: "diff",
  colorScheme: "dual",
  language: "ts",
  opened: false,

  setTitle: (title) => set(() => ({ title })),
  setMode: (mode) => set(() => ({ mode })),
  setColorScheme: (colorScheme) => set(() => ({ colorScheme })),
  setLanguage: (language) => set(() => ({ language })),
  setOpened: (opened) => set(() => ({ opened })),
  reset: () =>
    set(() => ({
      title: undefined,
      mode: "diff",
      colorScheme: "dual",
      language: "ts",
      opened: false,
    })),
}));

export default useExportOptions;
