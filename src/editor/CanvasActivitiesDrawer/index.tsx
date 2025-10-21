import { Fab, Drawer } from "@mui/material";
import React from "react";
import CanvasPropertiesPanel from "../CanvasPropertiesPanel";
import { AutoAwesome } from "@mui/icons-material";

export default function CanvasPropertiesDrawer() {
  const [open, show] = React.useState(false);

  return (
    <>
      <Fab
        color="primary"
        size="medium"
        aria-label="edit"
        onClick={() => show(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
          borderRadius: 4,
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <AutoAwesome />
      </Fab>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => show(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            maxHeight: "85vh",
            overflow: "hidden",
          },
        }}
      >
        <CanvasPropertiesPanel isVisible={true} />
      </Drawer>
    </>
  );
}
