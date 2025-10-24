import * as React from "react";
import TvIcon from "@mui/icons-material/Tv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useCanvasObjectViewport, {
  canvasViewportPresets,
  type CanvasViewportPreset,
} from "./useCanvasObjectViewport";
import { TabletAndroidOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export default function CanvasObjectViewportControls() {
  const { preset: deviceInView, viewPreset } = useCanvasObjectViewport();

  const handleDevice = (
    event: React.MouseEvent<HTMLElement>,
    device: typeof deviceInView
  ) => {
    void event;
    viewPreset(device);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      size="medium"
      value={deviceInView}
      exclusive
      onChange={handleDevice}
      aria-label="device"
      sx={(theme) => ({
        position: "absolute",
        left: "calc(var(--canvas-brim-padding) + .5rem)",
        bottom: "calc(var(--canvas-brim-padding) + .25rem)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(20px)",

        [theme.breakpoints.up("md")]: {
          // left: "50%",
          // transform: "translateX(-50%)",
          left: "calc(var(--canvas-brim-padding) + .5rem)",
          bottom: "calc(var(--canvas-brim-padding-md, 0px) + .5rem)",
        },
      })}
    >
      <PresetViewportToggleButton value="phone">
        <PhoneAndroidIcon fontSize="small" />
      </PresetViewportToggleButton>

      <PresetViewportToggleButton value="tablet">
        <TabletAndroidOutlined fontSize="small" />
      </PresetViewportToggleButton>

      <PresetViewportToggleButton value="laptop">
        <TvIcon fontSize="small" />
      </PresetViewportToggleButton>
    </ToggleButtonGroup>
  );
}

function PresetViewportToggleButton({
  value,
  children,
}: {
  value: CanvasViewportPreset;
  children: React.ReactNode;
}) {
  const composeTitle = () => {
    const dimensions = canvasViewportPresets[value];
    return `${value.charAt(0).toUpperCase() + value.slice(1)} (${
      dimensions.w
    }x${dimensions.h})`;
  };

  return (
    <Tooltip title={composeTitle()} arrow>
      <ToggleButton value={value} aria-label={value}>
        {children}
      </ToggleButton>
    </Tooltip>
  );
}
