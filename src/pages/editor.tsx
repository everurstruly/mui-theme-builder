import Editor from "../Editor/Editor";
import { Helmet } from "react-helmet";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import ColorSchemeToggle from "../ColorSchemeToggle";
import { ArrowRightAltRounded, MenuRounded } from "@mui/icons-material";
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
import { editorMiscsLinksMenu } from "../Editor/editorMiscsLinksMenu";
import { useState } from "react";
import BrandLink from "../BrandLink";
import { useHelpDialog } from "../Editor/Help/useHelpDialog";

const StyledToolbar = styled(Toolbar)(() => ({
  flexWrap: "wrap",
  alignItems: "center",
  height: "calc(var(--header-height) - 1px) !important", // 1px is size of border bottom (by parent)
  minHeight: "calc(var(--header-height) - 1px) !important", // FIXME: ensure height and border on one element
}));

export default function EditorPage() {
  const openHelp = useHelpDialog((s) => s.open);

  const handleMenuItemClick = (item: typeof editorMiscsLinksMenu[0]) => {
    if (item.key === "help") {
      openHelp();
    }
  };

  return (
    <>
      <Helmet>
        <title>Editor · MUI Theme Builder</title>
        <meta name="description" content="Design, customize and export Material UI themes with a visual editor, live preview and code export options." />
        <link
          rel="canonical"
          href={`${import.meta.env.VITE_SITE_URL || "https://mui-theme-builder.netlify.app"}/editor`}
        />
        <meta name="keywords" content="generator, mui theme creator, mui theme editor, mui v6, material ui, theme builder, theme generator, theme editor, MUI v6, MUI themes" />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Editor · MUI Theme Builder" />
        <meta property="og:description" content="Design, customize and export Material UI themes with a visual editor, live preview and code export options." />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_SITE_URL || "https://mui-theme-builder.netlify.app"}/editor-screenshot.png`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Editor · MUI Theme Builder" />
        <meta name="twitter:description" content="Design, customize and export Material UI themes with a visual editor, live preview and code export options." />
        <meta
          name="twitter:image"
          content={`${import.meta.env.VITE_SITE_URL || "https://mui-theme-builder.netlify.app"}/editor-screenshot.png`}
        />
      </Helmet>

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
        <StyledToolbar sx={{ px: { xs: 1.5, sm: 2 }, columnGap: { md: 4 } }}>
          <BrandLink />

          <Stack
            direction="row"
            alignItems={"center"}
            sx={{ columnGap: 4, display: { xs: "none", md: "flex" } }}
          >
            {editorMiscsLinksMenu.map((item) =>
              item.href ? (
                <Link
                  key={item.key}
                  href={item.href}
                  target={item.target}
                  fontSize={"small"}
                  color="text.secondary"
                  underline="none"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.key}
                  component="button"
                  onClick={() => handleMenuItemClick(item)}
                  fontSize={"small"}
                  color="text.secondary"
                  underline="none"
                  sx={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                    "&:hover": {
                      color: "text.primary",
                    },
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            columnGap={1}
          >
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
  const openHelp = useHelpDialog((s) => s.open);
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
        {editorMiscsLinksMenu.map((item) =>
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
            <MenuItem
              key={item.key}
              onClick={() => {
                handleClose();
                if (item.key === "help") openHelp();
              }}
            >
              <ListItemText>{item.label}</ListItemText>
              <ArrowRightAltRounded />
            </MenuItem>
          )
        )}
      </Menu>
    </div>
  );
}
