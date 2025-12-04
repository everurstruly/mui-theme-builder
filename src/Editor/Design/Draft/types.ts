/**
 * Load Strategies
 *
 * Pure data provider functions for different load sources.
 * Each strategy fetches data and returns a ThemeSnapshot.
 *
 * This is the strategy pattern - easy to extend with new sources.
 */

import type { ThemeSnapshot } from "../Current/useCurrent/types";

/**
 * Strategy result - what all strategies must return
 */
export interface LoadData {
  snapshot: ThemeSnapshot;
  metadata: {
    snapshotId?: string;
    updatedAt?: number;
    title?: string;
    sourceType: "snapshot" | "template" | "blank" | "custom";
  };
}

/**
 * Load from custom source (for extensibility)
 * Example: load from URL, clipboard, file upload, etc.
 */
export type LoadStrategy = () => Promise<LoadData>;
