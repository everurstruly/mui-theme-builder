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
        set(() => ({
          sidebarPanelsBeforeHide: get().hiddenPanels,
          hiddenPanels: [
            "properties",
            "properties.mobile",
            "explorer",
            "explorer.mobile",
          ],
        }));
      },

      restoreCanvasSidebarPanels: () => {
        set(() => ({
          hiddenPanels: get().sidebarPanelsBeforeHide,
          sidebarPanelsBeforeHide: [],
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
    })
  )
);

export default useEditor;
