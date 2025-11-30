import DeviceToggleGroupControl from "./Controls/DeviceToggleGroupControl";
import OpenInNewTabControl from "./Controls/OpenInNewTabControl";
import CameraControls from "./Controls/CameraControls";
import AlignmentControl from "./Controls/AlignmentControl";
import { Box } from "@mui/material";

export interface ZoomPanSurfaceControlsProps {
  /** Custom content to render in the left slot. Replaces default device/tab controls */
  leftSlot?: React.ReactNode;
  /** Custom content to render in the right slot. Replaces default camera/alignment controls */
  rightSlot?: React.ReactNode;
}

const ZoomPanSurfaceControls = function ZoomPanSurfaceControls({
  leftSlot,
  rightSlot,
}: ZoomPanSurfaceControlsProps) {
  return (
    <>
      {/* Left controls */}
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
        {leftSlot || (
          <>
            <DeviceToggleGroupControl />
            <OpenInNewTabControl />
          </>
        )}
      </Box>

      {/* Right controls */}
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
        {rightSlot || (
          <>
            <CameraControls />
            <AlignmentControl />
          </>
        )}
      </Box>
    </>
  );
};

export default ZoomPanSurfaceControls;