import { create } from "zustand";
import { createEditSlice } from "./editSlice";
import { createPreviewSlice } from "./previewSlice";
import { createHistorySlice } from "./historySlice";
import { createPersistenceSlice } from "./persistenceSlice";
import type { CurrentDesignStore } from "./types";

export const useCurrent = create<CurrentDesignStore>()((...a) => {
  return {
    ...createEditSlice(...a),
    ...createPreviewSlice(...a),
    ...createHistorySlice(...a),
    ...createPersistenceSlice(...a),
  };
});

export default useCurrent;
