import Editor from "../Editor/Editor";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ColorSchemeToggle from "../ColorSchemeToggle";
import { GitHub, LogoDevRounded } from "@mui/icons-material";
import { Button, colors, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

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
        <StyledToolbar sx={{ px: { lg: 1.5 } }}>
          <Typography
            noWrap
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 0.5,
            }}
          >
            <LogoDevRounded />
            {/* MUI Theme Builder @^6 */}
            MUI Theme Editor
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            columnGap={0.5}
            marginLeft="auto"
          >
            <Button aria-label="search" color="inherit" sx={{ px: 1, minWidth: 0 }}>
              Help
            </Button>

            <Button
              href="https://github.com/everurstruly/mui-theme-builder"
              color="inherit"
              sx={{ px: 1, minWidth: 0 }}
            >
              <GitHub />
            </Button>

            <ColorSchemeToggle />
          </Stack>
        </StyledToolbar>
      </AppBar>
      <Editor />
    </>
  );
}
