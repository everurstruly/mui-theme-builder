import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Paper,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { useEffect } from "react";

export default function DevSandbox() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));

  // Debug: Log theme shape
  useEffect(() => {
    console.log('🎨 Theme Debug:', {
      borderRadius: theme.shape.borderRadius,
      spacing: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing,
      fullShape: theme.shape,
    });
  }, [theme]);

  return (
    <Box p={10}>
      <Typography variant="h2" marginBottom={2}>
        I am a Dashboard (allegedly)
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}
      >
        <Typography variant="body2" mb={1}>
          Theme borderRadius: {theme.shape.borderRadius}px
        </Typography>
        <Typography variant="body2">
          This Paper should have borderRadius from theme (default MUI behavior)
        </Typography>
      </Paper>

      {/* Test component with explicit sx using theme function */}
      <Box
        sx={(theme) => ({
          p: 2,
          mb: 2,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: theme.shape.borderRadius, // Explicitly using theme.shape.borderRadius
        })}
      >
        <Typography variant="body2">
          Box with EXPLICIT borderRadius: {theme.shape.borderRadius}px (via sx theme function)
        </Typography>
      </Box>

      {/* Test with custom borderRadius */}
      <Box
        sx={(themeObj) => ({
          p: 2,
          mb: 2,
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
          borderRadius: `${(themeObj.shape.borderRadius as number)}px`, // 2x the theme value
        })}
      >
        <Typography variant="body2">
          Box with 2x borderRadius: {(theme.shape.borderRadius as number) * 2}px
        </Typography>
      </Box>

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
        This component responds to media queries based on the iframe viewport size!
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

