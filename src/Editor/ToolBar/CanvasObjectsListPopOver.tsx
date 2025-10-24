import * as React from "react";
import Popover from "@mui/material/Popover";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemButtonWithMenu from "../../../lib/components/ListItemButtonWithMenu";
import useEditorStore from "../editorStore";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";

export default function CanvasObjectsListPopOver() {
  const theme = useTheme();
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const isVisible = useEditorStore((state) => {
    return state.hiddenPanels.includes("activities") === false;
  });

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  if (!isDesktopScreen || isVisible) {
    return null;
  }

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onClick={handlePopoverOpen}
        sx={{
          cursor: "pointer",
          minWidth: "auto",
          textTransform: "none",
          fontSize: 12,
          alignItems: "center",
        }}
      >
        Examples <ArrowDropDownOutlined />
      </Button>

      <Popover
        id="mouse-over-popover"
        disableRestoreFocus
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
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
