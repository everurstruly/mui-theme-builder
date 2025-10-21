import React from "react";
import CanvasPropertiesPanel from "../CanvasPropertiesPanel";
import { Fab, Drawer } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import { TuneOutlined } from "@mui/icons-material";

export default function CanvasPropertiesDrawer() {
  const theme = useTheme();
  const upHandheldBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  const upTabletBreakpoint = useMediaQuery(theme.breakpoints.up("md"));
  const [open, show] = React.useState(false);

  const generateSharedRootSx = (theme: Theme) => ({
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  });

  return (
    <>
      <Fab
        color="primary"
        variant="circular"
        size={upTabletBreakpoint ? "small" : "medium"}
        aria-label="edit"
        onClick={() => show(true)}
        sx={(theme) => ({
          position: "fixed",
          right: 14,
          bottom: 10,

          [theme.breakpoints.up("md")]: {
            bottom: "revert",
            top: 14,
            right: 12,
          },

          zIndex: (theme) => theme.zIndex.drawer - 1,
          ...generateSharedRootSx(theme),
        })}
      >
        <TuneOutlined />
      </Fab>

      <Drawer
        anchor={upHandheldBreakpoint ? "right" : "bottom"}
        open={open}
        onClose={() => show(false)}
        sx={(theme) => ({
          [`& .MuiDrawer-paper`]: {
            maxHeight: "85vh",
            overflow: "hidden",
            [theme.breakpoints.up("sm")]: {
              maxHeight: "revert",
              width: 350,
            },
            ...generateSharedRootSx(theme),
          },
        })}
      >
        <CanvasPropertiesPanel isVisible={true} />
      </Drawer>
    </>
  );
}
