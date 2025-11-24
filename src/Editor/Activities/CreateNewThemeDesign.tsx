import * as React from "react";
import Button from "@mui/material/Button";
import NewDesignDialogContent from "./NewDesignDialogContent";
import { Popover } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function CreateNewThemeDesign() {
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
        startIcon={<Add sx={{ fontSize: "1rem !important" }} />}
        aria-label="Create new theme"
        sx={{
          borderRadius: 2,
        }}
        onClick={handleClickOpen}
      >
        Create
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: { width: 320, borderRadius: 4 },
          },
        }}
      >
        <NewDesignDialogContent onClose={handleClose} />
      </Popover>
    </>
  );
}
