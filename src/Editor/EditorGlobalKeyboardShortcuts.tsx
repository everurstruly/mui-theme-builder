import { useEffect } from "react";
import { useEditorExperienceStore } from "./useThemingExperienceStore";
import { useThemeDesignStore } from "./ThemeDesign/themeDesign.store";

export default function EditorGlobalKeyboardShortcuts() {
  const selected = useEditorExperienceStore((s) => s.selectedExperienceId);
  const undoVisual = useThemeDesignStore((s) => s.undoVisual);
  const redoVisual = useThemeDesignStore((s) => s.redoVisual);
  const undoCode = useThemeDesignStore((s) => s.undoCode);
  const redoCode = useThemeDesignStore((s) => s.redoCode);

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
