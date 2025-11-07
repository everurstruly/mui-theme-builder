import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
// import { ContentPasteGoOutlined, PublishOutlined } from "@mui/icons-material";
import { PublishOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ImportThemeAction() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Import Theme">
        <Button
          // size="small"
          color="inherit"
          variant="outlined"
          onClick={() => handleClickOpen()}
          // startIcon={<ContentPasteGoOutlined color="action" />}
          sx={{ borderRadius: 2 }}
        >
          Upload
        </Button>

        {/* <IconButton
          size="small"
          // FIXME: py style matches theme selectbox height
          sx={{ py: 0.75, borderRadius: 2, border: 1, borderColor: "divider" }}
          onClick={() => handleClickOpen()}
        >
          <ContentPasteGoOutlined fontSize="small" />
        </IconButton> */}
      </Tooltip>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Import Theme
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Select a theme file from your computer to import it into the editor.
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<PublishOutlined />}
          >
            Upload File
            <input type="file" hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
