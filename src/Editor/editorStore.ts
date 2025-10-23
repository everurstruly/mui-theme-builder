import { create } from "zustand";
import { combine } from "zustand/middleware";

export type Panels = "properties" | "activities";

const useEditorStore = create(
  combine(
    {
      hasSavedChanges: true,
      hiddenPanels: [] as Panels[],
    },

    (set) => ({
      hidePanel: (panel: Panels) => {
        set((state) => ({
          hiddenPanels: Array.from(new Set([...state.hiddenPanels, panel])),
        }));
      },

      hideAllPanels: () => {
        set(() => ({
          hiddenPanels: ["properties", "activities"],
        }));
      },

      showAllPanels: () => {
        set(() => ({
          hiddenPanels: [],
        }));
      },

      showPanel: (panel: Panels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },

      markUnsavedChanges: () => {
        set(() => ({
          hasSavedChanges: false,
        }));
      },

      saveChanges: () => {
        set(() => ({
          hasSavedChanges: true,
        }));
      },
    })
  )
);

export default useEditorStore;
