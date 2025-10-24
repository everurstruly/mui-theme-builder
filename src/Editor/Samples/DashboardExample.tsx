import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

export default function DashboardExample() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        p: 6,
        backgroundColor: "white",
        border: "2px solid #444",
      }}
    >
      <Typography variant="h2" marginBottom={2}>
        I am a Dashboard (allegedly)
      </Typography>

      <Box sx={{ display: "flex", gap: 1, marginBottom: 2, flexWrap: "wrap" }}>
        <Chip
          label={`Window: ${
            typeof window !== "undefined" ? window.innerWidth : 0
          }px`}
          color="primary"
          size="small"
        />
        <Chip
          label={
            isSmall
              ? "Small (< 600px)"
              : isMedium
              ? "Medium (600-900px)"
              : "Large (> 900px)"
          }
          color="secondary"
          size="small"
        />
      </Box>

      <Typography variant="body1" marginBottom={2}>
        This component responds to media queries based on the iframe viewport
        size!
        {isSmall && " 📱 You're on a small screen."}
        {isMedium && " 📱 You're on a medium screen."}
        {isLarge && " 💻 You're on a large screen."}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isSmall ? "column" : "row",
          alignItems: isSmall ? "stretch" : "center",
        }}
      >
        <Button variant="contained" color="primary" fullWidth={isSmall}>
          Click Me
        </Button>

        <Tooltip title="Delete">
          <IconButton>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
