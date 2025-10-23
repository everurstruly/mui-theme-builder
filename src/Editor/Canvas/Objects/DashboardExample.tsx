import { Box, Typography } from "@mui/material";
import useCanvasObjectViewport from "../ObjectViewport/useCanvasObjectViewport";

export default function DashboardExample() {
  const { width, height } = useCanvasObjectViewport();

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
