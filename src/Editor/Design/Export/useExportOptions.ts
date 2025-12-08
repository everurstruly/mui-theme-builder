import { create } from "zustand";

// Types matching the existing codebase's export hook
export type ExportMode = "diff" | "merged";
export type ExportColorScheme = "light" | "dark" | "dual";
export type ExportFileExtension = "ts" | "js" | "json";

interface ExportOptionsState {
  title?: string;
  mode: ExportMode;
  colorScheme: ExportColorScheme;
  fileExtension: ExportFileExtension;
  opened: boolean;

  setTitle: (title?: string) => void;
  setMode: (mode: ExportMode) => void;
  setColorScheme: (colorScheme: ExportColorScheme) => void;
  setFileExtension: (language: ExportFileExtension) => void;
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
  fileExtension: "ts",
  opened: false,

  setTitle: (title) => set(() => ({ title })),
  setMode: (mode) => set(() => ({ mode })),
  setColorScheme: (colorScheme) => set(() => ({ colorScheme })),
  setFileExtension: (fileExtension) => set(() => ({ fileExtension })),
  setOpened: (opened) => set(() => ({ opened })),
  reset: () =>
    set(() => ({
      title: undefined,
      mode: "diff",
      colorScheme: "dual",
      fileExtension: "ts",
      opened: false,
    })),
}));

export default useExportOptions;
