import DeviceToggleGroupControl from "./Controls/DeviceToggleGroupControl";
import OpenInNewTabControl from "./Controls/OpenInNewTabControl";
import CameraControls from "./Controls/CameraControls";
import DragLockControl from "./Controls/DragLockControl";
import { Box } from "@mui/material";
import AlignmentControl from "./Controls/AlignmentControl";

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
        })}
      >
        <DragLockControl />
        <CameraControls />
        <AlignmentControl />
      </Box>
    </>
  );
}
