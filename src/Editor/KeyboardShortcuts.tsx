import { useEffect } from "react";
import { useDesignStore } from "./Design/designStore";

export default function EditorGlobalKeyboardShortcuts() {
  const selected = useDesignStore((s) => s.selectedExperienceId);
  const undoVisual = useDesignStore((s) => s.undoVisualToolEdit);
  const redoVisual = useDesignStore((s) => s.redoVisualToolEdit);
  const undoCode = useDesignStore((s) => s.undoCodeOverride);
  const redoCode = useDesignStore((s) => s.redoCodeOverride);

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
