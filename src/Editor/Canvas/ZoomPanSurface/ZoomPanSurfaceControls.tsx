import DeviceToggleGroupControl from "./Controls/DeviceToggleGroupControl";
import OpenInNewTabControl from "./Controls/OpenInNewTabControl";
import CameraControls from "./Controls/CameraControls";
import AlignmentControl from "./Controls/AlignmentControl";
import { Box } from "@mui/material";

export default function ZoomPanSurfaceControls() {
  return (
    <>
      <Box
        style={{
          position: "absolute",
          left: ".5rem",
          bottom: ".25rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "end",
        }}
      >
        <DeviceToggleGroupControl />
        <OpenInNewTabControl />
      </Box>

      <Box
        sx={(theme) => ({
          position: "absolute",
          right: ".5rem",
          bottom: ".25rem",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          columnGap: 0.5,

          [theme.breakpoints.up("md")]: {
            bottom: ".5rem",
          },

          "& .MuiButtonBase-root": {
            alignSelf: "stretch",
          },
        })}
      >
        <CameraControls />
        <AlignmentControl />
      </Box>
    </>
  );
}
