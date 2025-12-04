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
import { DeleteOutline } from "@mui/icons-material";
import DialogHeading from "../../../_Components/DialogHeading";

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
  }

  return (
    <Dialog open={deleteConfirmationDialogOpen} onClose={handleClose}>
      <DialogTitle>
        <DialogHeading title="Delete current design?" Icon={DeleteOutline} />
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mt: 2 }}>
          Deleting will reset the canvas to a blank design. Continue?
        </Typography>
      </DialogContent>

      <DialogActions>
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
