import * as React from "react";
import TvIcon from "@mui/icons-material/Tv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TabletAndroidOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import useViewportSimulationStore, {
  viewportSimulationPresets,
  type ViewportSimulaitonPreset,
} from "./viewportSimulationStore";

export default function ViewportSimulationControls() {
  const preset = useViewportSimulationStore((state) => state.preset);
  const setPreset = useViewportSimulationStore((state) => state.setPreset);

  const handlePresetChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPreset: ViewportSimulaitonPreset | null
  ) => {
    if (newPreset) {
      setPreset(newPreset);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      size="medium"
      value={preset}
      exclusive
      onChange={handlePresetChange}
      aria-label="viewport preset"
      sx={(theme) => ({
        position: "absolute",
        left: "calc(var(--canvas-brim-padding) + .5rem)",
        bottom: "calc(var(--canvas-brim-padding) + .25rem)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(20px)",

        [theme.breakpoints.up("md")]: {
          left: "calc(var(--canvas-brim-padding) + .5rem)",
          bottom: "calc(var(--canvas-brim-padding-md, 0px) + .5rem)",
        },
      })}
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
  );
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
