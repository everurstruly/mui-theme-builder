import { create } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import { type ThemeOptions } from "@mui/material";

type WorkfileState = {
  activePreviewId: string;
  themeModifications?: ThemeOptions;
  themeFunctionsModification: Record<string, string>;
};

type WorkfileActions = {
  selectPreview: (id: string) => void;
  resetThemeModifications: () => void;
  setThemeModifications: (modifications: ThemeOptions) => void;
  setThemeFunctionsModifications: (functions: Record<string, string>) => void;
  updateThemeFunctionModifications: (path: string, fnCode: string) => void;
  removeThemeFunctionModifications: (path: string) => void;
};

export type WorkfileStore = WorkfileState & WorkfileActions;

const localStorageKey = "workfile-storage";

const useWorkfileStore = create<WorkfileStore>()(
  persist(
    temporal(
      (set) => ({
        themeModifications: undefined,
        themeFunctionsModification: {},
        activePreviewId: "DashboardExample",

        selectPreview: (id: string) => set({ activePreviewId: id }),

        resetThemeModifications: () =>
          set({ themeModifications: undefined, themeFunctionsModification: {} }),

        setThemeModifications: (modifications: ThemeOptions) =>
          set({ themeModifications: modifications }),

        setThemeFunctionsModifications: (functions: Record<string, string>) => {
          set({ themeFunctionsModification: functions });
        },

        updateThemeFunctionModifications: (path: string, fnCode: string) => {
          set((state) => ({
            themeFunctionsModification: {
              ...state.themeFunctionsModification,
              [path]: fnCode,
            },
          }));
        },

        removeThemeFunctionModifications: (path: string) => {
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [path]: _removed, ...rest } = state.themeFunctionsModification;
            return { themeFunctionsModification: rest };
          });
        },
      }),
      {
        limit: 50, // Keep last 50 states
        equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
      }
    ),
    {
      name: localStorageKey,
      partialize: (state) => ({
        theme: state.themeModifications,
        themeFunctions: state.themeFunctionsModification,
        activePreviewId: state.activePreviewId,
      }),
    }
  )
);

export default useWorkfileStore;
