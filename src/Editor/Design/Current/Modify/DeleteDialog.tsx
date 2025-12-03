import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import useEditor from "../../../useEditor";
import useDelete from "./useDelete";

function DeleteDialog() {
  const { trash } = useDelete();

  const deleteConfirmationDialogOpen = useEditor(
    (s) => s.deleteConfirmationDialogOpen
  );
  
  const setDeleteConfirmationDialogOpen = useEditor(
    (s) => s.setDeleteConfirmationDialogOpen
  );

  function handleClose() {
    setDeleteConfirmationDialogOpen(false);
  }

  async function handleDeleteConfirm() {
    await trash();
    setDeleteConfirmationDialogOpen(false);
    // setSnack({ severity: "info", message: "Deleted current design" });
  };

  return (
    <Dialog open={deleteConfirmationDialogOpen} onClose={handleClose}>
      <DialogTitle>Delete current design?</DialogTitle>

      <DialogContent>
        <Typography>
          Deleting will reset the canvas to a blank design. Continue?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>
          Cancel
        </Button>
        <Button color="error" onClick={handleDeleteConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
