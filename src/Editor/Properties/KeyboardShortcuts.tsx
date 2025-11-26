import { useEffect } from "react";
import { useEdit } from "../Design/Edit/useEdit";

export default function EditorGlobalKeyboardShortcuts() {
  const selected = useEdit((s) => s.selectedExperienceId);
  const undoVisual = useEdit((s) => s.undoVisualToolEdit);
  const redoVisual = useEdit((s) => s.redoVisualToolEdit);
  const undoCode = useEdit((s) => s.undoCodeOverride);
  const redoCode = useEdit((s) => s.redoCodeOverride);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      const key = e.key.toLowerCase();
      if (key !== "z") return;
      e.preventDefault();
      const isRedo = e.shiftKey;
      if (selected === "components") {
        if (isRedo) redoCode(); else undoCode();
      } else {
        if (isRedo) redoVisual(); else undoVisual();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, undoVisual, redoVisual, undoCode, redoCode]);

  return null;
}
