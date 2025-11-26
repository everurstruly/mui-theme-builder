import { create } from "zustand";
import { createDomainSlice, type ThemeDesignDomainSlice } from "./domainSlice";
import { createUISlice, type ThemeDesignUISlice } from "./uiSlice";
import { createHistorySlice, type ThemeDesignHistorySlice } from "./historySlice";
import {
  createPersistenceSlice,
  type ThemeDesignPersistenceSlice,
} from "./persistenceSlice";

export type ThemeDesignStore = ThemeDesignDomainSlice &
  ThemeDesignUISlice &
  ThemeDesignHistorySlice &
  ThemeDesignPersistenceSlice;

export const useDesignStore = create<ThemeDesignStore>()((...a) => {
  return {
    ...createDomainSlice(...a),
    ...createUISlice(...a),
    ...createHistorySlice(...a),
    ...createPersistenceSlice(...a),
  };
});

export default useDesignStore;