import * as React from "react";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LaptopIcon from "@mui/icons-material/Laptop";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TabletAndroidOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import useViewportSimulationStore, {
  viewportSimulationDevicePresets,
  type ViewportSimulaitonDevicePreset,
} from "../ViewportSimulation/viewportSimulationStore";

export default function DeviceToggleGroupControl() {
  const preset = useViewportSimulationStore((state) => state.preset);
  const setPreset = useViewportSimulationStore((state) => state.setPreset);

  const handlePresetChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPreset: ViewportSimulaitonDevicePreset | null
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
  value: ViewportSimulaitonDevicePreset;
};

function DeviceToggleButton({ value, Icon }: DeviceToggleButtonProps) {
  const dimensions = viewportSimulationDevicePresets[value];
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
