import useCurrent from "./Design/Current/useCurrent";
import useExportOptions from "./Design/Current/Export/useExportOptions";
import useEditor from "./useEditor";
import { useLaunchDialog } from "./Design/New/useLaunchDialog";
import { useTemplateSelection } from "./Design/New/Template/useTemplateSelection";
import useDelete from "./Design/Current/Modify/useDelete";
import { useCollection } from "./Design/Collection";
import { useSave } from "./Design/Current/Save/useSave";
import { useHelpDialog } from "./Help/useHelpDialog";
import { useHotkeys } from "react-hotkeys-hook";
import { keyboardMappings } from "./keyboardMappings";

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
  const requestKeyboardFocus = useEditor((s) => s.requestKeyboardFocus);
  const { next: nextTemplate, prev: prevTemplate } = useTemplateSelection();
  const openLaunchDialog = useLaunchDialog((s) => s.open);
  const openHelp = useHelpDialog((s) => s.open);

  // Common options: don't trigger when typing in inputs
  const hotkeyOptions = {
    enableOnFormTags: false,
    preventDefault: true,
  };

  // Find mappings by description keyword for easy reference
  const getMapping = (keyword: string) =>
    keyboardMappings.find((m) => m.description.toLowerCase().includes(keyword))
      ?.keys || "";

  // Help
  useHotkeys(getMapping("help"), () => openHelp(), {
    useKey: true,
    ...hotkeyOptions,
  });

  // Collection
  useHotkeys(getMapping("collection"), () => setCollectionOpened(true), {
    useKey: true,
    ...hotkeyOptions,
  });

  // Save
  useHotkeys(
    getMapping("save"),
    () => {
      if (canSave) {
        void save();
      }
    },
    { ...hotkeyOptions, enabled: canSave },
    [canSave, save]
  );

  // Export
  useHotkeys(getMapping("export"), () => setExportOpened(true), hotkeyOptions);

  // Rename
  useHotkeys(getMapping("rename"), () => setRenameDialogOpen(true), hotkeyOptions);

  // Toggle experience (designer/developer)
  useHotkeys(
    getMapping("designer/developer"),
    () => {
      requestKeyboardFocus("properties");
      selectExperience(selected === "designer" ? "developer" : "designer");
    },
    hotkeyOptions,
    [selected, selectExperience, requestKeyboardFocus]
  );

  // Toggle explorer
  useHotkeys(
    getMapping("explorer"),
    () => {
      const isExplorerHidden = hiddenPanels.includes("explorer");
      if (isExplorerHidden) {
        requestKeyboardFocus("explorer");
        showPanel("explorer");
      } else {
        hidePanel("explorer");
      }
    },
    hotkeyOptions,
    [hiddenPanels, requestKeyboardFocus, showPanel, hidePanel]
  );

  // Fullscreen
  useHotkeys(getMapping("fullscreen"), () => toggleFullpage(), hotkeyOptions);

  // Cycle templates
  useHotkeys(getMapping("next template"), () => nextTemplate(), hotkeyOptions, [
    nextTemplate,
  ]);
  useHotkeys(getMapping("previous template"), () => prevTemplate(), hotkeyOptions, [
    prevTemplate,
  ]);

  // Delete
  useHotkeys(
    getMapping("delete"),
    () => {
      if (canDelete) {
        setDeleteConfirmationDialogOpen(true);
      }
    },
    { ...hotkeyOptions, enabled: canDelete },
    [canDelete, setDeleteConfirmationDialogOpen]
  );

  // New design
  useHotkeys(getMapping("new design"), () => openLaunchDialog(), hotkeyOptions);

  // Undo
  useHotkeys(
    getMapping("undo"),
    () => {
      if (selected === "developer") {
        undoCode();
      } else {
        undoVisual();
      }
    },
    hotkeyOptions,
    [selected, undoCode, undoVisual]
  );

  // Redo
  useHotkeys(
    getMapping("redo"),
    () => {
      if (selected === "developer") {
        redoCode();
      } else {
        redoVisual();
      }
    },
    hotkeyOptions,
    [selected, redoCode, redoVisual]
  );

  return null;
}
