import { useEffect } from "react";
import { Box, Paper, Typography, List, ListItem } from "@mui/material";
import { useShadesDrawerStore } from "./useShadesDrawerStore";
import ShadeListItem from "./ShadeMenuItem";

export default function ShadesDrawer() {
  const open = useShadesDrawerStore((s) => s.open);
  const shades = useShadesDrawerStore((s) => s.shades);
  const title = useShadesDrawerStore((s) => s.title);
  const selectedPath = useShadesDrawerStore((s) => s.selectedPath);
  const close = useShadesDrawerStore((s) => s.close);

  // register behavior (Escape key)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <Box
        aria-hidden
        data-dev-name="shades-drawer-backdrop"
        data-shades-count={shades.length}
        data-selected-path={selectedPath ?? ""}
        onClick={close}
        sx={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.2)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 380ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 1400,
        }}
      />

      <Paper
        role="dialog"
        aria-hidden={!open}
        data-dev-name="shades-drawer-panel"
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1500,
          transform: open ? "translateY(0%)" : "translateY(100%)",
          transition: "transform 320ms cubic-bezier(.2,.8,.2,1)",
          height: "max(70vh, 60%)",
          boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DrawerGrabber />

        <Box
          sx={{
            px: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              mx: "auto",
              py: 2,
            }}
          >
            {title ? `${title} Color Map` : "Shades"}
          </Typography>
        </Box>

        <Box sx={{ overflow: "auto", flex: 1, pt: 3, pb: 8 }}>
          <List disablePadding>
            {shades && shades.length > 0 ? (
              shades.map((s) => (
                <ShadeListItem key={s.path} title={s.name} path={s.path} />
              ))
            ) : (
              <ListItem>
                <Typography variant="caption">No states</Typography>
              </ListItem>
            )}
          </List>
        </Box>
      </Paper>
    </>
  );
}

function DrawerGrabber() {
  return (
    <Box
      sx={{
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 4,
          borderRadius: 999,
          background: "rgba(0,0,0,0.26)",
        }}
      />
    </Box>
  );
}
