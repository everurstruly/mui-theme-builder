import { useEffect } from "react";
import useCurrent from "../Design/Current/useCurrent";
import useEditor from "../useEditor";

export default function EditorGlobalKeyboardShortcuts() {
  const selected = useEditor((s) => s.selectedExperience);
  const undoVisual = useCurrent((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrent((s) => s.redoVisualToolEdit);
  const undoCode = useCurrent((s) => s.undoCodeOverride);
  const redoCode = useCurrent((s) => s.redoCodeOverride);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      const key = e.key.toLowerCase();
      if (key !== "z") return;
      e.preventDefault();
      const isRedo = e.shiftKey;
      if (selected === "developer") {
        if (isRedo) redoCode();
        else undoCode();
      } else {
        if (isRedo) redoVisual();
        else undoVisual();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, undoVisual, redoVisual, undoCode, redoCode]);

  return null;
}
