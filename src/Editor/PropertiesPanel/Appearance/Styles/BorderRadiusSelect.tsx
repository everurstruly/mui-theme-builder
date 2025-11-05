import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function BorderRadiusSelect() {
  const [borderRadius, setborderRadius] = React.useState("0px");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newborderRadius: string
  ) => {
    void event;
    setborderRadius(newborderRadius);
  };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={borderRadius}
      onChange={handleChange}
      aria-label="Border Radius Sizes"
      size="small"
    >
      <ToggleButton sx={{ fontSize: 10 }} value="0px">
        None
      </ToggleButton>
      <ToggleButton sx={{ fontSize: 10 }} value="4px">
        SM
      </ToggleButton>
      <ToggleButton sx={{ fontSize: 10 }} value="8px">
        MD
      </ToggleButton>
      <ToggleButton sx={{ fontSize: 10 }} value="16px">
        LG
      </ToggleButton>
      <ToggleButton sx={{ fontSize: 10 }} value="100%">
        Pill
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
