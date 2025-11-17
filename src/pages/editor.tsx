import Editor from "../Editor/Editor";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ColorSchemeToggle from "../ColorSchemeToggle";
import {
  ArchitectureRounded,
  ArrowRightAltRounded,
  GitHub,
  MenuRounded,
} from "@mui/icons-material";
import {
  Box,
  colors,
  IconButton,
  Link,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { EDITOR_MENU_ITEMS } from "./editorMenuItems";
import { useState } from "react";

const StyledToolbar = styled(Toolbar)(() => ({
  flexWrap: "wrap",
  alignItems: "center",
  height: "var(--header-height) !important",
  minHeight: "var(--header-height) !important",
}));

export default function EditorPage() {
  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={[
          () => ({
            overflow: "hidden",
            borderBottom: 1,
            borderBottomColor: colors.grey[300],
            backgroundColor: colors.common.white,
          }),
          (theme) =>
            theme.applyStyles("dark", {
              borderBottomColor: "divider",
              backgroundColor: colors.common.black,
            }),
        ]}
      >
        <StyledToolbar sx={{ px: { xs: 0, sm: 1.5 }, columnGap: { md: 4 } }}>
          <Typography
            noWrap
            variant="subtitle1"
            fontWeight="semibold"
            sx={{
              mr: "auto",
              display: "flex",
              alignItems: "center",
              px: (theme) => theme.spacing(1), // mimic padding of buttons
            }}
          >
            <ArchitectureRounded
              fontSize="small"
              sx={{ marginInlineStart: -0.5, mb: 0.2 }}
            />
            MUI Theme Editor
          </Typography>

          <Stack
            direction="row"
            alignItems={"center"}
            sx={{ columnGap: 4, display: { xs: "none", md: "flex" } }}
          >
            {EDITOR_MENU_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                target={item.target}
                fontSize={"small"}
                color="text.secondary"
              >
                {item.label}
              </Link>
            ))}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            columnGap={1}
          >
            <IconButton
              href="https://github.com/everurstruly/mui-theme-builder"
              color="inherit"
              sx={{ minWidth: 0 }}
            >
              <GitHub />
            </IconButton>

            <ColorSchemeToggle />

            <Box sx={{ display: { md: "none" } }}>
              <MobileMenuButton />
            </Box>
          </Stack>
        </StyledToolbar>
      </AppBar>
      <Editor />
    </>
  );
}
function MobileMenuButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ minWidth: 0 }}
      >
        <MenuRounded />
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ display: { md: "none" } }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              py: 1,
              minWidth: "min(90vw, 320px)",
            },
          },
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {EDITOR_MENU_ITEMS.map((item) =>
          item.href ? (
            <MenuItem
              key={item.key}
              component="a"
              href={item.href}
              target={item.target}
              onClick={handleClose}
            >
              <ListItemText>{item.label}</ListItemText>
              <ArrowRightAltRounded />
            </MenuItem>
          ) : (
            <MenuItem key={item.key} onClick={handleClose}>
              <ListItemText>{item.label}</ListItemText>
              <ArrowRightAltRounded />
            </MenuItem>
          )
        )}
      </Menu>
    </div>
  );
}
