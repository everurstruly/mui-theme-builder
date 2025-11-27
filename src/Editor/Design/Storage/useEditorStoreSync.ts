import { useEffect } from "react";
import useEdit from "../Edit/useEdit";
import type { SavedToStorageDesign } from "./types";

export function useEditorStoreSync(
  savedDesigns: SavedToStorageDesign[],
  setLastSavedId: (id: string | null) => void
) {
  useEffect(() => {
    // initial check based on current editor state
    const checkAndSetId = () => {
      const current = (useEdit.getState() as any).baseThemeMetadata?.sourceTemplateId as string | undefined;
      if (!current) {
        setLastSavedId(null);
      } else {
        setLastSavedId(savedDesigns.some((d) => d.id === current) ? current : null);
      }
    };

    checkAndSetId();

    // Subscribe to editor changes for sourceTemplateId
    const unsubscribe = useEdit.subscribe((s: any) => {
      const sourceId = s.baseThemeMetadata?.sourceTemplateId as string | undefined;
      if (!sourceId) {
        setLastSavedId(null);
      } else {
        setLastSavedId(savedDesigns.some((d) => d.id === sourceId) ? sourceId : null);
      }
    });

    return () => unsubscribe();
  }, [savedDesigns, setLastSavedId]);
}
