import * as React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  ZoomInOutlined,
  AddOutlined,
  RemoveOutlined,
  FitScreenOutlined,
} from "@mui/icons-material";
import useCanvasView from "../../useCanvasView";

export default function CameraControlPopOver() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const zoom = useCanvasView((s) => s.camera.zoom);
  const zoomIn = useCanvasView((s) => s.zoomIn);
  const zoomOut = useCanvasView((s) => s.zoomOut);
  const cycleZoomPreset = useCanvasView((s) => s.cycleZoomPreset);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleZoomIn = () => {
    zoomIn();
    handleClose();
  };

  const handleZoomOut = () => {
    zoomOut();
    handleClose();
  };

  const handleCyclePreset = () => {
    cycleZoomPreset();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="Zoom controls"
        aria-controls={open ? "zoom-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          alignSelf: "stretch",
          borderRadius: 1,
          border: 1,
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(40px)",
        }}
      >
        <ZoomInOutlined fontSize="small" />
      </IconButton>

      <Menu
        id="zoom-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: "min(80vw, 200px)",
            },
          },
        }}
      >
        <MenuItem onClick={handleCyclePreset}>
          <ListItemIcon>
            <FitScreenOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Zoom Level</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {zoom}%
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleZoomIn}>
          <ListItemIcon>
            <AddOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Zoom In</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleZoomOut}>
          <ListItemIcon>
            <RemoveOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Zoom Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

