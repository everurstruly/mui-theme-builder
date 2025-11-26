import { create } from "zustand";
import { createDomainSlice, type ThemeDesignDomainSlice } from "./domainSlice";
import { createUISlice, type ThemeDesignUISlice } from "./uiSlice";
import { createHistorySlice, type ThemeDesignHistorySlice } from "./historySlice";
// storage slice migrated to standalone `useStorage` store

export type ThemeDesignStore = ThemeDesignDomainSlice &
  ThemeDesignUISlice &
  ThemeDesignHistorySlice;

export const useCurrentDesign = create<ThemeDesignStore>()((...a) => {
  return {
    ...createDomainSlice(...a),
    ...createUISlice(...a),
    ...createHistorySlice(...a),
  };
});

export default useCurrentDesign;
