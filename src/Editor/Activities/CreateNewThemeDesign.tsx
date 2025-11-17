import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Stack, Typography } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";

export default function CreateNewThemeDesign() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        // variant="outlined"
        startIcon={<AddCircleOutline sx={{ fontSize: "1rem !important"}} />}
        aria-label="Copy and Implement Selected Theme"
        sx={{
          // px: 1,
          borderRadius: 2,
          "& .MuiButton-startIcon": {
            // marginInlineEnd: 0.5,
            // marginBottom: 0.25, // fix: ensure text alignement with icons
          },
        }}
        onClick={() => handleClickOpen()}
      >
        New
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="export-context-dialog"
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          id="new-context-dialog"
          component={"div"}
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            m: 0,
            pt: 2,
            px: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Theme Export</Typography>

            <IconButton
              size="small"
              aria-label="close"
              onClick={handleClose}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2,
            mt: 0, // fix: remove annoying jittering
            position: "relative",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
          }}
        >
          Hello
        </DialogContent>
      </Dialog>
    </>
  );
}
