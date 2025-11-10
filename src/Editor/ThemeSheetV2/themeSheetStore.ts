import { create } from "zustand";
import { temporal } from "zundo";
import type { ThemeOptions } from "@mui/material";
import { type ThemeOptionTemplateId } from "./themeOptionsTemplates";
import { deepmerge } from "@mui/utils";
import { setNestedValue } from "./utils/objectHelpers";

type ThemeSheetState = {
  activePreviewId: string;
  colorScheme: "light" | "dark";
  themeOptionsUserEditsTitle: string;
  themeOptionsUserEdits: ThemeOptions;

  selectedThemeOptionsTemplateId: ThemeOptionTemplateId;
  themeOptionsTemplateEdits: ThemeOptions;
};

type ThemeSheetActions = {
  applyThemeOptionsCodeEdits: () => void;
  writeThemeOptionsCodeEdits: (code: ThemeOptions) => void;
  discardThemeOptionsCodeEdits: () => void;
  clearThemeOptionsCodeEdits: (code: ThemeOptions) => void;

  applyThemeOptionsTemplate: (
    template: ThemeOptions,
    mode?: "merge" | "replace"
  ) => void;
  resetToThemeOptionsTemplate: () => void;

  applyAppearancePreset: (id: string) => void;
  removeAppearancePreset: (id: string) => void;

  selectThemeOptionsTemplate: (id: ThemeOptionTemplateId) => void;

  addThemeOptionsUserEdit: (path: string, value: unknown) => void;
  revertThemeOptionsUserEdit: (path: string) => void;
  clearThemeOptionsUserEdits: () => void;

  selectPreview: (id: string) => void;
  setColorScheme: (scheme: "light" | "dark") => void;
};

type ThemeSheetStore = ThemeSheetState & ThemeSheetActions;

export const useThemeSheetStore = create<ThemeSheetStore>()(
  temporal(
    (set, get) => {
      return {
        colorScheme: "light",
        activePreviewId: "DashboardExample",
        themeOptionsUserEditsTitle: "User Edits",
        themeOptionsUserEdits: {} as ThemeOptions,
        selectedThemeOptionsTemplateId: "default" as ThemeOptionTemplateId,

        applyThemeOptionsCodeEdits: () => {},
        writeThemeOptionsCodeEdits: (code: ThemeOptions) => {},
        discardThemeOptionsCodeEdits: () => {},
        clearThemeOptionsCodeEdits: (code: ThemeOptions) => {},

        selectThemeOptionsTemplate: (id: ThemeOptionTemplateId) => {
          set({ selectedThemeOptionsTemplateId: id });
        },

        applyThemeOptionsTemplate: (
          template: ThemeOptions,
          mode: "merge" | "replace" = "replace"
        ) => {
          const themeOptions =
            mode === "merge"
              ? deepmerge(get().themeOptionsUserEdits, template)
              : template;
          set({ themeOptionsUserEdits: themeOptions });
        },

        resetToThemeOptionsTemplate: () => {},

        applyAppearancePreset: (id: string) => {},
        removeAppearancePreset: (id: string) => {},

        addThemeOptionsUserEdit: (path: string, value: unknown) => {
          const updatedEdits = { ...get().themeOptionsUserEdits };
          setNestedValue(updatedEdits, path, value);
          set({ themeOptionsUserEdits: updatedEdits });
        },

        revertThemeOptionsUserEdit: (path: string) => {},
        clearThemeOptionsUserEdits: () => {},

        selectPreview: (id) => {
          set({ activePreviewId: id });
        },

        setColorScheme: (scheme) => {
          set({ colorScheme: scheme });
        },
      };
    },
    {
      // Only track persistent state in history
      partialize: (state) => ({
        themeOptionsUserEditsTitle: state.themeOptionsUserEditsTitle,
        themeOptionsUserEdits: state.themeOptionsUserEdits,
        // appliedBaseTheme: state.appliedBaseTheme,
        // appliedComposables: state.appliedComposables,
        // resolvedThemeOptionsModifications: state.resolvedThemeOptionsModifications,
        // contributions: state.contributions,
      }),
      limit: 20, // Keep last 20 committed states
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);

