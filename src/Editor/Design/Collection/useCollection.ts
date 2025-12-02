/**
 * Collection Store
 * 
 * Manages the list of all saved designs (snapshots) in storage.
 * This is separate from the current design's persistence state.
 * 
 * Responsibilities:
 * - Store the list of all saved designs
 * - Provide methods to refresh the collection
 * - Track loading state for collection operations
 */

import { create } from 'zustand';
import type { ThemeSnapshotMetadata } from "../Current/useCurrent/types";

export interface CollectionState {
  /** List of all saved designs */
  collection: ThemeSnapshotMetadata[];
  
  /** Whether collection is being fetched */
  isLoading: boolean;
  
  /** Error during collection operations */
  error: string | null;
}

export interface CollectionActions {
  setCollection: (items: ThemeSnapshotMetadata[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type CollectionStore = CollectionState & CollectionActions;

const initialState: CollectionState = {
  collection: [],
  isLoading: false,
  error: null,
};

export const useCollection = create<CollectionStore>((set) => ({
  ...initialState,

  setCollection: (collection) => set({ collection, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set(initialState),
}));
