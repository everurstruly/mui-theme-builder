import { create } from "zustand";
import { createCurrentSlice, type ThemeCurrentSlice } from "./currentSlice";
import {
  createInterfaceSlice,
  type ThemeDesignInterfaceSlice,
} from "./interfaceSlice";
import { createHistorySlice, type ThemeDesignHistorySlice } from "./historySlice";

export type ThemeDesignStore = ThemeCurrentSlice &
  ThemeDesignInterfaceSlice &
  ThemeDesignHistorySlice;

export const useEdit = create<ThemeDesignStore>()((...a) => {
  return {
    ...createCurrentSlice(...a),
    ...createInterfaceSlice(...a),
    ...createHistorySlice(...a),
  };
});

export default useEdit;
