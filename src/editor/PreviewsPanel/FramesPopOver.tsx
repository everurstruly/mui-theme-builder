import * as React from "react";
import Popover from "@mui/material/Popover";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemButtonWithMenu from "../../../lib/components/ListItemButtonWithMenu";
import useEditorStore from "../Editor.store";

export default function MinimizedPreviewsPanelPopOver() {
  const isActivityPanelVisible = useEditorStore((state) => {
    return state.hiddenPanels.includes("activities") === false;
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (isActivityPanelVisible) {
    return null;
  }

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
