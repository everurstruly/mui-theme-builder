import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import {
  ContentCopy,
  DriveFileRenameOutline,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  Button,
} from "@mui/material";
import useEditor from "../useEditor";
import useCurrent from "../Design/Current/useCurrent";
import { useSave } from "../Design/Current/Save/useSave";
import useExportOptions from "../Design/Export/useExportOptions";

export default function DesignMobileActionMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isPopoverMenuOpened = Boolean(anchorEl);

  const handleClickMenuItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Popover menu
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={"basic-menu"}
        aria-haspopup="true"
        aria-expanded={isPopoverMenuOpened ? "true" : undefined}
        onClick={handleClickMenuItem}
        sx={{ minWidth: 0, columnGap: 0.5 }}
      >
        <DriveFileRenameOutline sx={{ fontSize: { sm: "1rem !important" } }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isPopoverMenuOpened}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            // "aria-labelledby": "",
          },
        }}
      >
        <MobileMenuContent onClose={handleCloseMenu} />
      </Menu>
    </>
  );
}

function MobileMenuContent({ onClose }: { onClose: () => void }) {
  const selected = useEditor((s) => s.selectedExperience);

  const undoVisual = useCurrent((s) => s.undoVisualToolEdit);
  const redoVisual = useCurrent((s) => s.redoVisualToolEdit);
  const undoCode = useCurrent((s) => s.undoCodeOverride);
  const redoCode = useCurrent((s) => s.redoCodeOverride);

  const canUndoVisual = useCurrent((s) => s.visualHistoryPast.length > 0);
  const canRedoVisual = useCurrent((s) => s.visualHistoryFuture.length > 0);
  const canUndoCode = useCurrent((s) => s.codeHistoryPast.length > 0);
  const canRedoCode = useCurrent((s) => s.codeHistoryFuture.length > 0);

  const { save, canSave } = useSave();
  const setExportOpened = useExportOptions((s) => s.setOpened);

  const isCodeExperience = selected === "developer";
  const canUndo = isCodeExperience ? canUndoCode : canUndoVisual;
  const canRedo = isCodeExperience ? canRedoCode : canRedoVisual;

  const handleUndo = async () => {
    onClose();
    if (isCodeExperience) return undoCode();
    return undoVisual();
  };

  const handleRedo = async () => {
    onClose();
    if (isCodeExperience) return redoCode();
    return redoVisual();
  };

  const handleSave = async () => {
    onClose();
    if (canSave) {
      try {
        await save();
      } catch {
        /* ignore save errors here; UI will surface them */
      }
    }
  };

  const handleExport = () => {
    onClose();
    setExportOpened(true);
  };

  return (
    <>
      <MenuItem dense onClick={handleRedo} disabled={!canRedo}>
        <ListItemIcon>
          <RedoOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>Redo</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘Y
        </Typography>
      </MenuItem>

      <MenuItem dense onClick={handleUndo} disabled={!canUndo}>
        <ListItemIcon>
          <UndoOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>Undo</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘Z
        </Typography>
      </MenuItem>

      <MenuItem dense onClick={handleSave} disabled={!canSave}>
        <ListItemIcon>
          <SaveOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>Save</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘S
        </Typography>
      </MenuItem>

      <Divider />

      <MenuItem dense onClick={handleExport} sx={{ minWidth: "200px" }}>
        <ListItemIcon>
          <ContentCopy color="secondary" fontSize="small" />
        </ListItemIcon>
        <Typography color="secondary" fontSize={"small"}>
          Export Theme
        </Typography>
      </MenuItem>
    </>
  );
}
