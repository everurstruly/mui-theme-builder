import { create } from "zustand";
import { createCurrentSlice, type DesignEditCurrentSlice } from "./currentSlice";
import {
  createInterfaceSlice,
  type DesignEditInterfaceSlice,
} from "./interfaceSlice";
import { createHistorySlice, type DesignEditHistorySlice } from "./historySlice";
import { createPreviewSlice, type PreviewSlice } from "./previewSlice";

export type DesignEditStore = DesignEditCurrentSlice &
  DesignEditInterfaceSlice &
  DesignEditHistorySlice &
  PreviewSlice;

export const useEdit = create<DesignEditStore>()((...a) => {
  return {
    ...createCurrentSlice(...a),
    ...createInterfaceSlice(...a),
    ...createHistorySlice(...a),
    ...createPreviewSlice(...a),
  };
});

export default useEdit;
