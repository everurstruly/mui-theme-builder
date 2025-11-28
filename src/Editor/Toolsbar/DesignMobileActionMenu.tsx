import * as React from "react";
import ExportThemeButton from "../Design/Edit/ExportCommand";
import ChangeHistoryActions from "../Design/Edit/ModificationHistoryButtons";
import MenuItem from "@mui/material/MenuItem";
import {
  ContentCopy,
  DriveFileRenameOutline,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  Stack,
  Button,
} from "@mui/material";

export default function DesignMobileActionMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isUpSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isPopoverMenuOpened = Boolean(anchorEl);

  const handleClickMenuItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (isUpSmallScreen) {
    return (
      <Stack
        direction={"row"}
        flexShrink={0}
        columnGap={1.5}
        sx={{
          mx: 1.5,
        }}
      >
        <ChangeHistoryActions />
        <ExportThemeButton />
      </Stack>
    );
  }

  // Popover menu
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={"basic-menu"}
        aria-haspopup="true"
        aria-expanded={isPopoverMenuOpened ? "true" : undefined}
        onClick={handleClickMenuItem}
        sx={{ minWidth: 0, columnGap: 0.5 }}
      >
        <DriveFileRenameOutline sx={{ fontSize: "1rem !important" }} />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isPopoverMenuOpened}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            // "aria-labelledby": "",
          },
        }}
      >
        <MenuItem dense onClick={handleCloseMenu}>
          <ListItemIcon>
            <RedoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Redo</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘Y
          </Typography>
        </MenuItem>

        <MenuItem dense onClick={handleCloseMenu}>
          <ListItemIcon>
            <UndoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Undo</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘Z
          </Typography>
        </MenuItem>

        <MenuItem dense onClick={handleCloseMenu}>
          <ListItemIcon>
            <SaveOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save</ListItemText>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ⌘S
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem dense onClick={handleCloseMenu} sx={{ minWidth: "200px" }}>
          <ListItemIcon>
            <ContentCopy color="secondary" fontSize="small" />
          </ListItemIcon>
          <Typography color="secondary" fontSize={"small"}>
            Export Theme
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
