import { ErrorOutline } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DialogHeading from "../../../DialogHeading";

interface TitleConflictDialogProps {
  open: boolean;
  existingTitle: string;
  existingId: string;
  onClose: () => void;
  onOverwrite: () => void;
  onSaveAsNew: () => void;
}

export default function TitleConflictDialog({
  open,
  existingTitle,
  onClose,
  onOverwrite,
  onSaveAsNew,
}: TitleConflictDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <DialogHeading title="Design Title Already Taken" Icon={ErrorOutline} />
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Uh oh! You already have a saved design with the title{" "}
          <Typography
            variant="body1"
            fontWeight={"bold"}
            fontStyle={"italic"}
            component="span"
          >
            {existingTitle}
          </Typography>
          . What would you like to do?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSaveAsNew} color="primary">
          Save as New
        </Button>
        <Button onClick={onOverwrite} color="error">
          Overwrite Existing
        </Button>
      </DialogActions>
    </Dialog>
  );
}
