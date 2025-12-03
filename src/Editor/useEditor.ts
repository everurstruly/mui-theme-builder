import { create } from "zustand";
import { combine } from "zustand/middleware";

const sidebarPanels = [
  "properties",
  "explorer",
  "properties.mobile",
  "explorer.mobile",
];

const panels = ["library", ...sidebarPanels];

export const designProperties = [
  { label: "Color", value: "palette" },
  { label: "Font", value: "typography" },
  { label: "Sizes", value: "appearance" },
  { label: "Effects", value: "effects" },
] as const;

export const editorExperiences = ["designer", "developer"];

export type PropertiesTab = (typeof designProperties)[number]["value"];
export type EditorPanels = (typeof panels)[number];
export type EditorExperience = (typeof editorExperiences)[number];

export const useEditor = create(
  combine(
    {
      mouseOverCanvas: false,
      mouseOverPropertiesPanel: false,
      selectedExperience: "designer" as EditorExperience,
      selectedPropertiesTab: "palette" as PropertiesTab,
      sidebarPanelsBeforeHide: [] as EditorPanels[],
      hiddenPanels: [
        "library",
        "properties.mobile",
        "explorer",
        "explorer.mobile",
      ] as EditorPanels[],
      isFullpage: false,
      renameDialogOpen: false,
      deleteConfirmationDialogOpen: false,
      versionHistoryOpen: false,
    },

    (set, get) => ({
      selectExperience: (experience: EditorExperience) => {
        set({ selectedExperience: experience });
      },

      selectPropertiesTab: (tab: PropertiesTab) => {
        set(() => ({
          selectedPropertiesTab: tab,
        }));
      },

      setMouseOverPropertiesPanel: (isMouseOver: boolean) => {
        set(() => ({
          mouseOverPropertiesPanel: isMouseOver,
        }));
      },

      setMouseOverCanvas: (isMouseOver: boolean) => {
        set(() => ({
          mouseOverCanvas: isMouseOver,
        }));
      },

      hidePanel: (panel: EditorPanels) => {
        set((state) => ({
          hiddenPanels: Array.from(new Set([...state.hiddenPanels, panel])),
        }));
      },

      hideCanvasSidebarPanels: () => {
        // Only record the current hiddenPanels if we aren't already in fullscreen
        const alreadySaved = get().sidebarPanelsBeforeHide && get().sidebarPanelsBeforeHide.length > 0;
        if (alreadySaved) {
          // already hidden (fullscreen) — no-op
          return;
        }

        set(() => ({
          sidebarPanelsBeforeHide: [...get().hiddenPanels],
          hiddenPanels: [
            "properties",
            "properties.mobile",
            "explorer",
            "explorer.mobile",
          ],
          isFullpage: true,
        }));
      },

      restoreCanvasSidebarPanels: () => {
        const prev = get().sidebarPanelsBeforeHide || [];
        if (!prev || prev.length === 0) {
          // Nothing to restore
          return;
        }

        set(() => ({
          hiddenPanels: [...prev],
          sidebarPanelsBeforeHide: [],
          isFullpage: false,
        }));
      },

      hideAllPanels: () => {
        set(() => ({
          hiddenPanels: [...panels],
        }));
      },

      showAllPanels: () => {
        set(() => ({
          hiddenPanels: [...panels],
        }));
      },

      showPanel: (panel: EditorPanels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },

      setRenameDialogOpen: (open: boolean) => {
        set({ renameDialogOpen: open });
      },
      setDeleteConfirmationDialogOpen: (open: boolean) => {
        set({ deleteConfirmationDialogOpen: open });
      },
      setVersionHistoryOpen: (open: boolean) => {
        set({ versionHistoryOpen: open });
      },
      setIsFullpage: (open: boolean) => {
        set({ isFullpage: open });
      },

      toggleFullpage: () => {
        const isFull = get().isFullpage;
        if (isFull) {
          // restore saved panels if present
          const prev = get().sidebarPanelsBeforeHide || [];
          if (!prev || prev.length === 0) {
            set({ isFullpage: false });
            return;
          }

          set(() => ({
            hiddenPanels: [...prev],
            sidebarPanelsBeforeHide: [],
            isFullpage: false,
          }));
          return;
        }

        // enter fullpage: save current hidden panels and hide canvas sidebars
        const alreadySaved = get().sidebarPanelsBeforeHide && get().sidebarPanelsBeforeHide.length > 0;
        if (alreadySaved) {
          set({ isFullpage: true });
          return;
        }

        set(() => ({
          sidebarPanelsBeforeHide: [...get().hiddenPanels],
          hiddenPanels: [
            "properties",
            "properties.mobile",
            "explorer",
            "explorer.mobile",
          ],
          isFullpage: true,
        }));
      },
    })
  )
);

export default useEditor;
