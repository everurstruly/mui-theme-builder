import { create } from "zustand";
import { createCurrentSlice, type DesignEditCurrentSlice } from "./currentSlice";
import {
  createInterfaceSlice,
  type DesignEditInterfaceSlice,
} from "./interfaceSlice";
import { createHistorySlice, type DesignEditHistorySlice } from "./historySlice";

export type DesignEditStore = DesignEditCurrentSlice &
  DesignEditInterfaceSlice &
  DesignEditHistorySlice;

export const useEdit = create<DesignEditStore>()((...a) => {
  return {
    ...createCurrentSlice(...a),
    ...createInterfaceSlice(...a),
    ...createHistorySlice(...a),
  };
});

export default useEdit;
