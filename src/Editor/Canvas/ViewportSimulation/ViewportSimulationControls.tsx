import * as React from "react";
import TvIcon from "@mui/icons-material/Tv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TabletAndroidOutlined } from "@mui/icons-material";
import { Tooltip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import useViewportSimulationStore, {
  viewportSimulationPresets,
  type ViewportSimulaitonPreset,
} from "./viewportSimulationStore";

export default function ViewportSimulationControls() {
  const preset = useViewportSimulationStore((state) => state.preset);
  const setPreset = useViewportSimulationStore((state) => state.setPreset);
  const selectedComponent = useViewportSimulationStore(
    (state) => state.selectedComponent
  );
  const theme = useTheme();

  const handlePresetChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPreset: ViewportSimulaitonPreset | null
  ) => {
    if (newPreset) {
      setPreset(newPreset);
    }
  };

  const handleOpenInNewTab = () => {
    const encodedTheme = btoa(JSON.stringify(serializeTheme(theme)));
    const url = `/editor/viewport?component=${encodeURIComponent(
      selectedComponent
    )}&theme=${encodeURIComponent(encodedTheme)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "calc(var(--canvas-brim-padding) + .5rem)",
        bottom: "calc(var(--canvas-brim-padding) + .25rem)",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <ToggleButtonGroup
        color="primary"
        size="medium"
        value={preset}
        exclusive
        onChange={handlePresetChange}
        aria-label="viewport preset"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
        }}
      >
        <PresetButton value="phone">
          <PhoneAndroidIcon fontSize="small" />
        </PresetButton>

        <PresetButton value="tablet">
          <TabletAndroidOutlined fontSize="small" />
        </PresetButton>

        <PresetButton value="laptop">
          <LaptopIcon fontSize="small" />
        </PresetButton>

        <PresetButton value="desktop">
          <TvIcon fontSize="small" />
        </PresetButton>
      </ToggleButtonGroup>

      <Tooltip title="Open in new tab" arrow>
        <IconButton
          onClick={handleOpenInNewTab}
          size="small"
          sx={{
            alignSelf: "stretch",
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
    </div>
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

function PresetButton({
  value,
  children,
}: {
  value: ViewportSimulaitonPreset;
  children: React.ReactNode;
}) {
  const dimensions = viewportSimulationPresets[value];
  const label = `${value.charAt(0).toUpperCase() + value.slice(1)} (${
    dimensions.w
  }x${dimensions.h})`;

  return (
    <Tooltip title={label} arrow>
      <ToggleButton value={value} aria-label={label}>
        {children}
      </ToggleButton>
    </Tooltip>
  );
}
