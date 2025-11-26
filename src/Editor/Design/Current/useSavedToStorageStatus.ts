import { useCurrentDesign } from "./useCurrent";

/**
 * Hook: useKeptInStorageStatus
 * Selects the persistence `status` from the persistence slice.
 */

export default function useSavedToStorageStatus(): string {
  return useCurrentDesign((s) => s.status);
}
