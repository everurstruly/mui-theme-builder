import * as React from "react";
import Button from "@mui/material/Button";
import { Popover } from "@mui/material";
import SavedDesignPopoverMenuList from "./StoreDesignPopoverMenuList";
import { BookmarkBorderOutlined } from "@mui/icons-material";

export default function StoreDesignPopoverMenuButton() {
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
        <BookmarkBorderOutlined sx={{ fontSize: "1rem !important" }} />
        My Saves
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          root: {
            sx: { mt: 2 }
          },
          paper: {
            sx: { width: 320, borderRadius: 4 },
          },
        }}
      >
        <SavedDesignPopoverMenuList onClose={handleClose} />
      </Popover>
    </>
  );
}
