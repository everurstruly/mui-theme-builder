import { Box, Typography } from "@mui/material";
import useCanvasViewport from "../Viewport/useCanvasViewport";

export default function DashboardExample() {
  const { width, height } = useCanvasViewport();

  return (
    <Box
      sx={{
        p: 6,
        minWidth: width,
        minHeight: height,
        color: "white",
        backgroundColor: "dodgerblue",
      }}
    >
      <Typography>I am a Dashboard (allegedly)</Typography>
    </Box>
  );
}
