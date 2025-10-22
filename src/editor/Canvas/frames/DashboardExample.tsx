import FrameWrapper from "../FrameWrapper";
import { Typography } from "@mui/material";

export default function DashboardExample() {
  return (
    <FrameWrapper>
      <Typography
        variant="h4"
        sx={{
          p: 6,
          width: 1400,
          height: 2000,
          backgroundColor: "limegreen",
        }}
      >
        I am a Dashboard (allegedly)
      </Typography>
    </FrameWrapper>
  );
}
