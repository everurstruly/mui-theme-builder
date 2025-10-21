import { create } from "zustand";
import { combine } from "zustand/middleware";

type Panels = "properties" | "activities";

const useEditorStore = create(
  combine(
    {
      hiddenPanels: [] as Panels[],
    },

    (set) => ({
      hidePanel: (panel: Panels) => {
        set((state) => ({
          hiddenPanels: Array.from(new Set([...state.hiddenPanels, panel])),
        }));
      },

      showPanel: (panel: Panels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },
    })
  )
);

export default useEditorStore;
