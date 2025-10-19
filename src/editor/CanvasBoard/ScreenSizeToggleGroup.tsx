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
      exclusive
      onChange={handleDevice}
      aria-label="device"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        border: "none !important",

        "& *": {
          border: "none !important",
          paddingInline: ".375rem",
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
