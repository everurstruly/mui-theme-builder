import { create } from "zustand";
import { createEditSlice } from "./editSlice";
import { createPreviewSlice } from "./previewSlice";
import { createHistorySlice } from "./historySlice";
import type {
  CurrentDesignHistorySlice,
  CurrentDesignPreviewSlice,
  CurrentDesignEditStore,
} from "./types";

export type CurrentDesignStore = CurrentDesignEditStore &
  CurrentDesignPreviewSlice &
  CurrentDesignHistorySlice;

export const useCurrent = create<CurrentDesignStore>()((...a) => {
  return {
    ...createEditSlice(...a),
    ...createPreviewSlice(...a),
    ...createHistorySlice(...a),
  };
});

export default useCurrent;
