import * as React from "react";
import CopyThemeButton from "./CopyThemeButton";
import SaveThemeButton from "./SaveThemeButton";
import ChangeHistoryActions from "./ChangesHistoryActions";
import MenuItem from "@mui/material/MenuItem";
import {
  ContentCopy,
  EditDocument,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@mui/icons-material";
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
} from "@mui/material";

export default function PrimaryActionGroup() {
  const theme = useTheme();
  const isLaptopScreen = useMediaQuery(theme.breakpoints.up("md"));

  if (!isLaptopScreen) {
    return <ActionsAsMenu />;
  }

  return (
    <>
      <CopyThemeButton />
      <ChangeHistoryActions />
      <SaveThemeButton />
    </>
  );
}

export function ActionsAsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        sx={{ marginInlineStart: "auto" }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <EditDocument />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            // "aria-labelledby": "",
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          sx={{
            minWidth: "min(80vw, 300px)",
          }}
        >
          <ListItemIcon>
            <RedoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Redo</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘Y
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{
            minWidth: "min(80vw, 300px)",
          }}
        >
          <ListItemIcon>
            <UndoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Undo</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘Z
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={handleClose}
          sx={{
            minWidth: "min(80vw, 300px)",
          }}
        >
          <ListItemIcon>
            <SaveOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘S
          </Typography>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={handleClose}
          sx={{
            minWidth: "min(80vw, 300px)",
          }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText color="primary">Copy</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
