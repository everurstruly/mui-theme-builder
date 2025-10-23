import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useZoomPanStore from "./zoomPanStore";

export default function ZoomPanControls() {
  const zoom = useZoomPanStore((state) => state.zoom);
  const zoomIn = useZoomPanStore((state) => state.zoomIn);
  const zoomOut = useZoomPanStore((state) => state.zoomOut);
  const cycleZoomPreset = useZoomPanStore((state) => state.cycleZoomPreset);
  const resetView = useZoomPanStore((state) => state.resetView);

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleToggle = () => cycleZoomPreset();
  const handleReset = () => resetView();

  return (
    <Box
      sx={{
        position: "absolute",
        right: "calc(var(--canvas-brim-padding) + 1px)",
        bottom: "calc(var(--canvas-brim-padding) + 1px)",
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(32px)",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.1)",
        height: 36,
      }}
    >
      {/* Zoom Out */}
      <IconButton
        size="small"
        onClick={handleZoomOut}
        sx={{
          borderRight: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 0,
        }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      {/* Zoom Level Toggle */}
      <Button
        onClick={handleToggle}
        variant="text"
        disableRipple
        size="small"
        sx={{
          mx: 1.5,
          minWidth: "48px",
          fontWeight: 500,
          textAlign: "center",
          color: "text.primary",
          textTransform: "none",
          fontSize: "0.875rem",
          lineHeight: 1.75,
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
          },
        }}
        aria-label={`Zoom level ${zoom} percent`}
      >
        {zoom}%
      </Button>

      {/* Zoom In */}
      <IconButton
        size="small"
        onClick={handleZoomIn}
        sx={{
          borderLeft: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 0,
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>

      {/* Reset View */}
      <Tooltip title="Reset View" arrow>
        <IconButton
          size="small"
          onClick={handleReset}
          sx={{
            borderLeft: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 0,
          }}
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
