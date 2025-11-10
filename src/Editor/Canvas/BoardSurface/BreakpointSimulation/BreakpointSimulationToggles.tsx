import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Devices as DevicesIcon,
  PhoneAndroid as PhoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  DesktopWindows as DesktopIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import type { Breakpoint } from "@mui/material/styles";
import { useBreakpointSimulation } from "./useBreakpointSimulation";

const breakpointConfig: Array<{
  value: Breakpoint;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    value: "xs",
    label: "Mobile Device",
    icon: <PhoneIcon sx={{ fontSize: 16 }} />,
    description: "< 600px",
  },
  {
    value: "sm",
    label: "Tablet Screen",
    icon: <TabletIcon sx={{ fontSize: 16 }} />,
    description: "≥ 600px",
  },
  {
    value: "md",
    label: "Palmtop/Large Tablet",
    icon: <TabletIcon sx={{ fontSize: 16 }} />,
    description: "≥ 900px",
  },
  {
    value: "lg",
    label: "Laptop",
    icon: <LaptopIcon sx={{ fontSize: 16 }} />,
    description: "≥ 1200px",
  },
  {
    value: "xl",
    label: "TV/Desktop",
    icon: <DesktopIcon sx={{ fontSize: 16 }} />,
    description: "≥ 1536px",
  },
];

type BreakpointSimulationTogglesProps = {
  mouseOverPreview: boolean;
};

export default function BreakpointSimulationToggles({
  mouseOverPreview,
}: BreakpointSimulationTogglesProps) {
  const { simulatedBreakpoint, setSimulatedBreakpoint } = useBreakpointSimulation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBreakpointSelect = (breakpoint: Breakpoint | null) => {
    setSimulatedBreakpoint(breakpoint);
    handleClose();
  };

  const currentConfig = breakpointConfig.find(
    (bp) => bp.value === simulatedBreakpoint
  );

  return (
    <>
      <Tooltip title="Simulate Breakpoint">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            color: simulatedBreakpoint ? "primary.main" : "text.secondary",

            opacity: mouseOverPreview ? 1 : 0.2,
            transition: "opacity 300ms ease",
            border: 1,
            borderRadius: 1,
            fontSize: "0.75rem",
            textTransform: "none",
            borderColor: "divider",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          aria-controls={open ? "breakpoint-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          {currentConfig?.icon || <DevicesIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Tooltip>

      <Menu
        id="breakpoint-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 240,
              mt: 0.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Breakpoint Simulation
          </Typography>
        </Box>
        <Divider />

        <MenuItem
          onClick={() => handleBreakpointSelect(null)}
          selected={simulatedBreakpoint === null}
        >
          <ListItemIcon>
            {simulatedBreakpoint === null && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText
            primary="None"
            secondary="Use actual viewport"
            primaryTypographyProps={{ variant: "body2" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>

        <Divider />

        {breakpointConfig.map((config) => (
          <MenuItem
            key={config.value}
            onClick={() => handleBreakpointSelect(config.value)}
            selected={simulatedBreakpoint === config.value}
          >
            <ListItemIcon>
              {simulatedBreakpoint === config.value ? (
                <CheckIcon fontSize="small" />
              ) : (
                config.icon
              )}
            </ListItemIcon>
            <ListItemText
              primary={config.label}
              secondary={config.description}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

