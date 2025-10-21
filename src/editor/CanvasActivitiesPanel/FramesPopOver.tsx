import * as React from "react";
import Popover from "@mui/material/Popover";
import { Grid3x3 } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemButtonWithMenu from "../../../lib/components/ListItemButtonWithMenu";

export default function FramesPopOver() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
      <IconButton
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        sx={{ cursor: "pointer" }}
      >
        <Grid3x3 />
      </IconButton>

      <Popover
        id="mouse-over-popover"
        disableRestoreFocus
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FramesMenu />
      </Popover>
    </Box>
  );
}

function FramesMenu() {
  return (
    <List
      dense
      sx={{ width: "100%", minWidth: 250, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Theme Previews
        </ListSubheader>
      }
    >
      <ListItemButtonWithMenu text={{ primary: "Components" }}>
        <List dense component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Finance" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Legal" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Marketing" />
          </ListItemButton>
        </List>
      </ListItemButtonWithMenu>

      <ListItemButton>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton>
        <ListItemText primary="Social Media" />
      </ListItemButton>
    </List>
  );
}
