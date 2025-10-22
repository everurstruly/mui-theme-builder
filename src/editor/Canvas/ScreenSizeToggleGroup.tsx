import * as React from "react";
import LaptopIcon from "@mui/icons-material/Laptop";
import TvIcon from "@mui/icons-material/Tv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ScreenSizeToggleGroup() {
  const [devices, setDevices] = React.useState(() => "phone");

  const handleDevice = (
    event: React.MouseEvent<HTMLElement>,
    device: string
  ) => {
    void event;
    setDevices(device);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={devices}
      size="small"
      exclusive
      onChange={handleDevice}
      aria-label="device"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(32px)",
        position: "absolute",
        left: "calc(var(--canvas-brim-padding) + 1px)",
        bottom: "calc(var(--canvas-brim-padding) + 1px)",
        overflow: "hidden",
        borderStartEndRadius: 12,
        borderEndEndRadius: 12,

        "& *": {
          fontSize: "1.25rem",
        },
      }}
    >
      <ToggleButton value="laptop" aria-label="laptop">
        <LaptopIcon />
      </ToggleButton>

      <ToggleButton value="tv" aria-label="tv">
        <TvIcon />
      </ToggleButton>

      <ToggleButton value="phone" aria-label="phone">
        <PhoneAndroidIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
