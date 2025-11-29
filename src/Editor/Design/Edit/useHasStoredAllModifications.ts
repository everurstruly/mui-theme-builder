import useEdit from "./useEdit";

export default function useHasStoredAllModifications(): boolean {
  return useEdit((s) => s.contentHash === s.lastStoredContentHash);
}
