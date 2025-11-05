import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: "#007bff",
  height: 4,
  padding: "14px 0",
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    boxShadow: "0 0 2px 0px rgba(0, 0, 0, 0.1)",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.1)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow,
      },
    },
    "&:before": {
      boxShadow:
        "0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)",
    },
  },
  "& .MuiSlider-valueLabel": {
    top: -4,
    fontSize: 12,
    fontWeight: "normal",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    "&::before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: "#000",
      ...theme.applyStyles("dark", {
        color: "#fff",
      }),
    },
  },
  "& .MuiSlider-track": {
    border: "none",
    height: 4,
  },
  "& .MuiSlider-rail": {
    opacity: 0.5,
    boxShadow: "inset 0px 0px 4px -2px #000",
    backgroundColor: "#d0d0d0",
  },
  ...theme.applyStyles("dark", {
    color: "#0a84ff",
  }),
}));

export type RangeSliderProps = {
  defaultValue?: number;
  arialLabel?: string;
  range?: { min: number; max: number; step?: number; displayLabel?: boolean };
  marks?: { value: number; label?: string }[];
};

export default function RangeSlider({
  defaultValue,
  arialLabel,
  marks,
  range,
}: RangeSliderProps) {
  return (
    <IOSSlider
      aria-label={arialLabel}
      defaultValue={defaultValue}
      valueLabelDisplay={!range?.displayLabel ? "off" : "on"}
      min={range?.min || 0}
      step={range?.step || 1}
      max={range?.max || 100}
      marks={marks}
    />
  );
}
