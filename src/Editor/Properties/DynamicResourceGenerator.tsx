import * as React from "react";
import Zoom from "@mui/material/Zoom";
import Fab, { type FabProps } from "@mui/material/Fab";
import { Box, Typography } from "@mui/material";
import { useTheme, type SxProps } from "@mui/material/styles";

export interface DynamicResourceGeneratorFabData {
  color?: FabProps["color"];
  sx?: SxProps;
  icon: React.ReactNode;
  label?: string;
  variant?: "extended";
  fullWidth?: boolean;
}

interface DynamicResourceGeneratorFabProps {
  activeKey: string;
  dataMap: Partial<Record<string, DynamicResourceGeneratorFabData>>;
  sx?: SxProps;
}

export default function DynamicResourceGeneratorFab({
  activeKey = "palette",
  dataMap: map,
  sx,
}: DynamicResourceGeneratorFabProps) {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const activeFab = map[activeKey];
  const shouldUseCustomBg = Boolean(activeFab && activeFab.sx);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        alignItems: "end",
        justifyItems: "center",
        position: "relative",
        pointerEvents: "none",
        ...sx,
      }}
    >
      {activeFab && (
        <Zoom
          key={activeKey}
          in={true}
          timeout={transitionDuration}
          unmountOnExit
          style={{ transitionDelay: `${transitionDuration.exit}ms` }}
        >
          <Box
            sx={{
              gridColumn: 1,
              gridRow: 1,
              pointerEvents: "auto",
              transform: "translate(0, 0)",
              zIndex: 10,
              width:
                activeFab?.fullWidth && activeFab.variant === "extended"
                  ? "100%"
                  : undefined,
              display: "inline-flex",
            }}
          >
            <Fab
              variant={activeFab.variant}
              aria-label={activeFab.label}
              color={shouldUseCustomBg ? "inherit" : activeFab.color}
              size="medium"
              sx={[
                {
                  columnGap: 1.6,
                  width:
                    activeFab?.fullWidth && activeFab.variant === "extended"
                      ? "100%"
                      : undefined,
                },
                ...(Array.isArray(activeFab.sx) ? activeFab.sx : [activeFab.sx]),
              ]}
            >
              {activeFab.icon}
              {activeFab.variant === "extended" && (
                <Typography variant="body2" sx={{ fontWeight: "semibold" }}>
                  {activeFab.label}
                </Typography>
              )}
            </Fab>
          </Box>
        </Zoom>
      )}
    </Box>
  );
}
