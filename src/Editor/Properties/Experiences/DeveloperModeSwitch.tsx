import useEditor from "../../useEditor";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { FormControlLabel } from "@mui/material";

const BASE_WIDTH = 34;
const BASE_HEIGHT = 18;

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
  const margin = 0 * actualScale; // space from track edge to thumb
  const thumbSize = 18 * actualScale;
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
      backgroundColor: theme.palette.mode === "dark" ? "#39393D" : "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  };
});

export default function DeveloperModeSwitch({
  scale,
  height,
}: {
  scale?: number;
  height?: number;
}) {
  const selectedExperienceId = useEditor((s) => s.selectedExperience);
  const selectExperience = useEditor((s) => s.selectExperience);
  const isDeveloperExperience = selectedExperienceId === "developer";

  const handleChange = () => {
    selectExperience(!isDeveloperExperience ? "developer" : "designer");
  };

  return (
    <FormControlLabel
      control={
        <IOSSwitch
          trackHeight={height}
          scale={scale}
          checked={isDeveloperExperience}
          onChange={handleChange}
        />
      }
      label={`Developer mode ${isDeveloperExperience ? "on" : "off"}`}
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
            // keep label a consistent width to avoid layout shifts when text changes
            mt: "2px",
            width: "17ch",
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
