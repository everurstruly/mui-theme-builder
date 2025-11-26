import * as React from "react";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TabletAndroidOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import useCanvasView, { type DevicePreset } from "../../useCanvasView";

// Re-export for use in this component
const DEVICE_PRESETS = {
  phone: { w: 375, h: 667 },
  tablet: { w: 768, h: 1024 },
  laptop: { w: 1440, h: 900 },
  desktop: { w: 1920, h: 1080 },
} as const;


export default function DeviceToggleGroupControl() {
  const preset = useCanvasView((s) => s.viewport.preset);
  const setViewportPreset = useCanvasView((s) => s.setViewportPreset);

  const handlePresetChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPreset: DevicePreset | null
  ) => {
    if (newPreset) {
      setViewportPreset(newPreset);
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
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <DeviceToggleButton value="phone" Icon={PhoneAndroidIcon} />
      <DeviceToggleButton value="tablet" Icon={TabletAndroidOutlined} />
      <DeviceToggleButton value="laptop" Icon={LaptopIcon} />
    </ToggleButtonGroup>
  );
}

type DeviceToggleButtonProps = {
  Icon: React.ElementType;
  value: DevicePreset;
};

function DeviceToggleButton({ value, Icon }: DeviceToggleButtonProps) {
  const dimensions = DEVICE_PRESETS[value];
  const label = `${value.charAt(0).toUpperCase() + value.slice(1)} (${
    dimensions.w
  }x${dimensions.h})`;

  return (
    <Tooltip title={label} arrow>
      <ToggleButton value={value} aria-label={label}>
        <Icon fontSize="small" />
      </ToggleButton>
    </Tooltip>
  );
}

