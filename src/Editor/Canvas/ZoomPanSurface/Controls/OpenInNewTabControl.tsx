import { Tooltip, IconButton, type Theme, useTheme } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import useViewportSimulationStore from "../ViewportSimulation/viewportSimulationStore";

export default function OpenInNewTabControl() {
  const theme = useTheme();
  const selectedComponent = useViewportSimulationStore(
    (state) => state.selectedComponent
  );

  const handleOpenInNewTab = () => {
    const encodedTheme = btoa(JSON.stringify(serializeTheme(theme)));
    const url = `/editor/viewport?component=${encodeURIComponent(
      selectedComponent
    )}&theme=${encodeURIComponent(encodedTheme)}`;
    window.open(url, "_blank");
  };

  return (
    <Tooltip title="Open in new tab" arrow>
      <IconButton
        onClick={handleOpenInNewTab}
        size="small"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: 1,
          border: "1px solid rgba(0, 0, 0, 0.1)",
          padding: "11px",
          backdropFilter: "blur(20px)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          },
        }}
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

function serializeTheme(theme: Theme): Record<string, unknown> {
  try {
    return {
      palette: JSON.parse(JSON.stringify(theme.palette)),
      typography: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontWeightLight: theme.typography.fontWeightLight,
        fontWeightRegular: theme.typography.fontWeightRegular,
        fontWeightMedium: theme.typography.fontWeightMedium,
        fontWeightBold: theme.typography.fontWeightBold,
      },
      spacing: theme.spacing(1),
      breakpoints: {
        values: theme.breakpoints.values,
      },
      shape: theme.shape,
      shadows: theme.shadows,
      direction: theme.direction,
    };
  } catch (error) {
    console.error("Error serializing theme:", error);
    return {};
  }
}
