import { useState, useCallback } from "react";
import type { SavedToStorageDesign } from "./types";

type ConflictData = { id: string; title?: string };

export function useConflictDialogHandler(
  savedDesigns: SavedToStorageDesign[],
  currentTitle: string
) {
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictItem, setConflictItem] = useState<ConflictData | null>(null);

  const closeDialog = useCallback(() => {
    setConflictOpen(false);
    setConflictItem(null);
  }, []);

  const handleConflictError = useCallback(
    (e: any): boolean => {
      if (
        e &&
        typeof e.message === "string" &&
        e.message.startsWith("TITLE_CONFLICT:")
      ) {
        const existingId = e.message.split(":")[1];
        const conflict = savedDesigns.find((d) => d.id === existingId);

        setConflictItem(
          conflict
            ? { id: conflict.id, title: conflict.title }
            : { id: existingId, title: currentTitle }
        );
        setConflictOpen(true);
        return true;
      }
      return false;
    },
    [savedDesigns, currentTitle]
  );

  return {
    conflictOpen,
    conflictItem,
    handleConflictError,
    closeDialog,
    existingTitle: conflictItem?.title ?? currentTitle,
    existingId: conflictItem?.id,
  };
}
