import * as React from "react";
import LaptopIcon from "@mui/icons-material/Laptop";
import TvIcon from "@mui/icons-material/Tv";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useTheme } from "@mui/material";

export default function ScreenSizeToggleGroup() {
  const theme = useTheme();
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
        backgroundColor: theme.palette.background.paper,
        position: "fixed",
        bottom: 0,
        left: 4,

        [theme.breakpoints.up("md")]: {
          position: "absolute",
          bottom: 0,
          left: 0,
        },

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
