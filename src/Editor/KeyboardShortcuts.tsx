import useCurrent from "./Design/Current/useCurrent";
import useExportOptions from "./Design/Current/Export/useExportOptions";
import useEditor from "./useEditor";
import { useTemplateSelection } from "./Design/New/Template/useTemplateSelection";
import useDelete from "./Design/Current/Modify/useDelete";
import { useEffect } from "react";
import { useCollection } from "./Design/Collection";
import { useSave } from "./Design/Current/Save/useSave";

export default function EditorGlobalKeyboardShortcuts() {
  const { save, canSave } = useSave();
  const selected = useEditor((s) => s.selectedExperience);
  const selectExperience = useEditor((s) => s.selectExperience);
  const undoVisual = useCurrent((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrent((s) => s.redoVisualToolEdit);
  const undoCode = useCurrent((s) => s.undoCodeOverride);
  const redoCode = useCurrent((s) => s.redoCodeOverride);
  const setExportOpened = useExportOptions((s) => s.setOpened);
  const setCollectionOpened = useCollection((s) => s.setMenuOpened);
  const setRenameDialogOpen = useEditor((s) => s.setRenameDialogOpen);
  const { canDelete } = useDelete();
  const setDeleteConfirmationDialogOpen = useEditor(
    (s) => s.setDeleteConfirmationDialogOpen
  );
  const hiddenPanels = useEditor((s) => s.hiddenPanels);
  const hidePanel = useEditor((s) => s.hidePanel);
  const showPanel = useEditor((s) => s.showPanel);
  const toggleFullpage = useEditor((s) => s.toggleFullpage);
  const { next: nextTemplate, prev: prevTemplate } = useTemplateSelection();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isUserTyping = keyPressedWithinInteractiveField(active);

      const noModifiers =
        !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;
      const onlyCtrlOrCmd = (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey;
      const ctrlOrCmdAllowShift = (e.ctrlKey || e.metaKey) && !e.altKey;

      // don't intercept other editor typing shortcuts
      if (isUserTyping) {
        return;
      }

      // Slash (/) opens collection when NO modifiers and not typing
      if (noModifiers && e.key === "/" && !isUserTyping) {
        e.preventDefault();
        setCollectionOpened(true);
        return;
      }

      // Handle save: Ctrl/Cmd+S (no extra Shift/Alt)
      if (onlyCtrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (canSave) {
          // fire-and-forget; save() returns a promise
          void save();
        }
        return;
      }

      // Intercept print shortcut (Ctrl/Cmd + p) to open the export dialog
      // if (isMod && e.key.toLowerCase() === "p") {
      //   e.preventDefault();
      //   setExportOpened(true);
      //   return;
      // }

      // Rename: F2 (no modifiers)
      if (noModifiers && e.key === "F2") {
        e.preventDefault();
        setRenameDialogOpen(true);
        return;
      }

      // Toggle experience: Ctrl/Cmd+I (no extra Shift/Alt)
      if (onlyCtrlOrCmd && e.key.toLowerCase() === "i") {
        e.preventDefault();
        // cycle between 'designer' and 'developer'
        selectExperience(selected === "designer" ? "developer" : "designer");
        return;
      }

      // Toggle explorer collapse: Ctrl/Cmd+B (no extra Shift/Alt)
      if (onlyCtrlOrCmd && e.key.toLowerCase() === "b") {
        e.preventDefault();
        const isExplorerHidden = hiddenPanels.includes("explorer");
        if (isExplorerHidden) showPanel("explorer");
        else hidePanel("explorer");
        return;
      }

      // Fullscreen toggle: Ctrl/Cmd+Space (no extra Shift/Alt)
      if (onlyCtrlOrCmd && e.code === "Space") {
        e.preventDefault();
        // use the selector to toggle fullpage mode
        toggleFullpage();
        return;
      }

      // Cycle templates: Ctrl/Cmd + ArrowRight / ArrowLeft (no extra Shift/Alt)
      if (onlyCtrlOrCmd && e.key === "ArrowRight") {
        e.preventDefault();
        nextTemplate();
        return;
      }

      if (onlyCtrlOrCmd && e.key === "ArrowLeft") {
        e.preventDefault();
        prevTemplate();
        return;
      }

      // Delete key opens delete confirmation when NO modifiers and not typing
      if (noModifiers && e.key === "Delete") {
        if (canDelete) {
          e.preventDefault();
          setDeleteConfirmationDialogOpen(true);
        }
        return;
      }

      // Undo/Redo: Ctrl/Cmd+Z (Shift for Redo). Alt disables.
      if (ctrlOrCmdAllowShift && e.key.toLowerCase() === "z") {
        e.preventDefault();
        const isRedo = e.shiftKey;
        if (selected === "developer") {
          if (isRedo) redoCode();
          else undoCode();
        } else {
          if (isRedo) redoVisual();
          else undoVisual();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    selected,
    undoVisual,
    redoVisual,
    undoCode,
    redoCode,
    setExportOpened,
    setCollectionOpened,
    save,
    canSave,
    setRenameDialogOpen,
    canDelete,
    setDeleteConfirmationDialogOpen,
    selectExperience,
    hiddenPanels,
    hidePanel,
    showPanel,
    toggleFullpage,
    nextTemplate,
    prevTemplate,
  ]);

  return null;
}
function keyPressedWithinInteractiveField(active: Element | null) {
  return (
    active &&
    (active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      (active as HTMLElement).isContentEditable)
  );
}
