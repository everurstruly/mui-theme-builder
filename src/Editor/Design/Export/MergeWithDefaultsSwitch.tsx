import useExport from "./useExport";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { FormControlLabel } from "@mui/material";

const BASE_WIDTH = 42;
const BASE_HEIGHT = 24;

const IOSSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== "trackHeight" && prop !== "scale",
})<{
  trackHeight?: number;
  scale?: number;
}>(({ theme, trackHeight = BASE_HEIGHT, scale }: any) => {
  // compute scale from provided height (px) or explicit scale
  const actualScale = typeof scale === "number" ? scale : trackHeight / BASE_HEIGHT;
  const width = BASE_WIDTH * actualScale;
  const height = BASE_HEIGHT * actualScale;
  const margin = 2 * actualScale; // space from track edge to thumb
  const thumbSize = 20 * actualScale;
  const translate = width - thumbSize - margin * 2; // move thumb to the other end
  const trackRadius = (BASE_HEIGHT / 2) * actualScale;
  const switchBaseTop = (height - thumbSize) / 2; // center the thumb vertically

  return {
    width,
    height,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      top: switchBaseTop,
      left: margin,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: `translateX(${translate}px)`,
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#65C466" : "#65C466",
          opacity: 1,
          border: 0,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: thumbSize,
      height: thumbSize,
      boxShadow: "none",
      border: "1px solid #BDBDBD",
    },
    "& .MuiSwitch-track": {
      borderRadius: trackRadius,
      height,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.background.paper : "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  };
});

type Props = {
  scale?: number;
  height?: number;
};

export default function MergeWithDefaultsSwitch({ scale, height }: Props) {
  const { mode, setMode } = useExport();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.checked ? "locked" : "diff");
  };

  return (
    <FormControlLabel
      control={
        <IOSSwitch
          trackHeight={height}
          scale={scale}
          checked={mode === "locked"}
          onChange={handleChange}
          size="small"
        />
      }
      label="Lock to MUI v7 Defaults"
      sx={{
        m: 0,
        columnGap: 0.75,
        color: "text.secondary",
      }}
      slotProps={{
        typography: {
          fontWeight: (theme) => theme.typography.button.fontWeight,
          fontSize: (theme) => theme.typography.button.fontSize,
          sx: {
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
      }}
    />
  );
}
