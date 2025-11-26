import { useEffect } from "react";
import { useCurrentDesign } from "../Design/Current/useCurrent";

export default function EditorGlobalKeyboardShortcuts() {
  const selected = useCurrentDesign((s) => s.selectedExperienceId);
  const undoVisual = useCurrentDesign((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrentDesign((s) => s.redoVisualToolEdit);
  const undoCode = useCurrentDesign((s) => s.undoCodeOverride);
  const redoCode = useCurrentDesign((s) => s.redoCodeOverride);

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
