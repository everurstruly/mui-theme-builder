import * as React from "react";
import Popover from "@mui/material/Popover";
import useEditorStore from "../../editorStore";
import CanvasObjectsTree from "../../ActivitiesPanel/CanvasObjectsTree";
import {
  ArrowDropDownOutlined,
  ArrowDropUpOutlined,
} from "@mui/icons-material";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";

export default function FloatingCanvasObjectsTree() {
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
        startIcon={open ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
        size="small"
        sx={{
          minWidth: "0",
          textTransform: "none",
          fontSize: 12,
          marginRight: 1,
        }}
      >
        Samples
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
        sx={{
          marginTop: 2, // below toolbar
          marginLeft: 2.5, // relative to icon/icon-wrapper
        }}
        slotProps={{
          paper: {
            sx: {
              border: 2,
              padding: 1,
              borderColor: "divider",
              borderRadius: 0,
              minWidth: "var(--activities-panel-width, 300px)",
            },
          },
        }}
      >
        <CanvasObjectsTree />
      </Popover>
    </Box>
  );
}
