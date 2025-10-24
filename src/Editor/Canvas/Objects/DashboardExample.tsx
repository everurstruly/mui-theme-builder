import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import useCanvasObjectViewport from "../ObjectViewport/useCanvasObjectViewport";
import { DeleteOutline } from "@mui/icons-material";

export default function DashboardExample() {
  const { width, height } = useCanvasObjectViewport();

  return (
    <Box
      sx={{
        p: 6,
        minWidth: width,
        minHeight: height,
        backgroundColor: "white",
        border: "2px solid #444",
      }}
    >
      <Typography variant="h2" marginBottom={2}>
        I am a Dashboard (allegedly)
      </Typography>

      <Typography variant="body1" marginBottom={2}>
        I am a Dashboard (allegedly)
      </Typography>

      <Button variant="contained" color="primary">
        Click Me
      </Button>

      <Tooltip title="Delete">
        <IconButton>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
