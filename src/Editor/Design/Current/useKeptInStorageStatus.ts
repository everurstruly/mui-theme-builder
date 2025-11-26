import { useDesignStore } from "./currentStore";

/**
 * Hook: useKeptInStorageStatus
 * Selects the persistence `status` from the persistence slice.
 */

export default function useKeptInStorageStatus(): string {
  return useDesignStore((s) => s.status);
}
