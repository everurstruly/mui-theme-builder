import * as React from "react";
import Button from "@mui/material/Button";
import CreationDialog from "./LoaderDialog";
import { Popover } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function LoaderDialogOpenButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-label="Create new theme"
        onClick={handleClickOpen}
        sx={{
          columnGap: 0.5,
        }}
      >
        <Add sx={{ fontSize: "1rem !important" }} />
        Create
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          root: {
            sx: { mt: 2 },
          },
          paper: {
            sx: { width: 320, borderRadius: 4 },
          },
        }}
      >
        <CreationDialog onClose={handleClose} />
      </Popover>
    </>
  );
}
