import { MoreVertOutlined } from "@mui/icons-material";
import {
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDesignStore } from "./designStore";
import React from "react";

function CurrentThemeDesignStatus() {
  const title = useDesignStore((s) => s.title);
  const hasUnsavedChanges = useDesignStore((s) => s.hasUnsavedChanges);
  const setTitle = useDesignStore((s) => s.setTitle);
  const loadNew = useDesignStore((s) => s.loadNew);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(title);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const [snack, setSnack] = React.useState<null | {
    severity?: "info" | "success" | "error";
    message: string;
  }>(null);

  React.useEffect(() => setRenameValue(title), [title]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRename = () => {
    setRenameOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = () => {
    setTitle(renameValue || "Untitled");
    setRenameOpen(false);
    setSnack({ severity: "success", message: `Renamed to '${renameValue}'` });
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    // reset to blank design
    loadNew("{}", { sourceTemplateId: "", title: "Untitled Design" });
    setDeleteConfirmOpen(false);
    setSnack({ severity: "info", message: "Deleted current design" });
  };

  const handleSnackClose = () => setSnack(null);

  return (
    <>
      <Stack direction="row" sx={{ px: 1, flexGrow: 1 }} onClick={handleMenuOpen}>
        <Stack sx={{ overflow: "hidden", flexGrow: 1 }}>
          <Typography
            variant="caption"
            fontWeight={"bold"}
            color="primary"
            sx={{ whiteSpace: "nowrap", p: 0 }}
          >
            You're editing
          </Typography>

          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
              mb: "3px",
              overflow: "hidden",
            }}
          >
            {title} {hasUnsavedChanges ? "(unsaved)" : ""}
          </Typography>
        </Stack>
        <IconButton
          aria-controls={menuOpen ? "design-menu" : undefined}
          aria-haspopup="true"
        >
          <MoreVertOutlined />
        </IconButton>
      </Stack>

      <Menu
        id="design-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          root: {
            sx: { top: 4 },
          },
          paper: {
            sx: {
              minWidth: 230,
            },
          },
        }}
      >
        <MenuItem dense onClick={handleRename}>
          Rename
        </MenuItem>
        <MenuItem dense onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename Current Design</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              const enterKeyCode = "Enter";
              if (e.code === enterKeyCode) {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete current design?</DialogTitle>

        <DialogContent>
          <Typography>
            Deleting will reset the canvas to a blank design. Continue?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3500} onClose={handleSnackClose}>
        {snack ? (
          <Alert
            onClose={handleSnackClose}
            severity={snack.severity ?? "info"}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}

export default CurrentThemeDesignStatus;
