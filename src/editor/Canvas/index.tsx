import DashboardExample from "./frames/DashboardExample";
import ScreenSizeToggleGroup from "./ScreenSizeToggleGroup";
import { Box } from "@mui/material";

export default function EditorCanvas() {
  return (
    <Box
      sx={(theme) => ({
        flexGrow: 1,
        minWidth: 0, // <-- ensure this flex child can shrink
        overflow: "hidden", // <-- contain expansion, create clip/scroll context
        height: `calc(100% - var(--header-height))`,

        position: "relative",
        px: "var(--canvas-brim-padding)",
        pb: "var(--canvas-brim-padding)",
        backgroundColor: "transparent",

        [theme.breakpoints.up("sm")]: {
          height: `calc(100% - var(--canvas-brim-padding) - var(--toolbar-height))`,
        },
      })}
    >
      {/* ---- Custom Scrollbar: Blurred scrollbar overlay ---- */}
      <Box
        sx={{
          pointerEvents: "none", // let mouse events pass through
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "8px",
          backdropFilter: "blur(8px)", // real blur works here
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "8px",
          opacity: 0.7,
        }}
      />

      {/* preview layer: renders the frame but does not grow the parent */}
      <Box
        sx={() => ({
          boxSizing: "border-box",
          flex: "1 1 auto",
          minWidth: 0,
          overflow: "overlay", // overlay scrollbars (non-standard; works in Chromium/WebKit)
          height: "100%",

          padding: 0,
          backgroundColor: "transparent",

          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",

          // custom scrollbars with blurred thumb background (Chromium/WebKit)
          scrollbarWidth: "thin" /* Firefox */,
          scrollbarColor: "rgba(0,0,0,0.25) transparent",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            // semi-transparent so the blur effect behind the thumb is visible
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: "999px",
            // enable backdrop blur for Chromium / Safari
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            // small transparent border so the blur doesn't bleed to the edges
            border: "1px solid rgba(0,0,0,0.0)",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0,0,0,0.48)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        })}
      >
        <DashboardExample />
      </Box>

      <ScreenSizeToggleGroup />
    </Box>
  );
}
