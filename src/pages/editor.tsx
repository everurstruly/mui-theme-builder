import Editor from "../Editor/Editor";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ColorSchemeToggle from "../ColorSchemeToggle";
import { ArchitectureRounded, GitHub } from "@mui/icons-material";
import { Button, colors, Link, Stack } from "@mui/material";
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
        <StyledToolbar sx={{ px: { xs: 0, sm: 1.5 }, columnGap: 6 }}>
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

          <Stack direction="row" sx={{ columnGap: 4, mx: 1.5 }}>
            <Link
              href="https://zenoo.github.io/mui-theme-creator/"
              target="__blank"
              fontSize={"small"}
              // color="action"
            >
              MuiThemeEditor@v5
            </Link>

            <Link
              href="https://m2.material.io/inline-tools/color/"
              fontSize={"small"}
              // color="action"
              target="__blank"
            >
              Color Generator
            </Link>

            <Link target="__blank" fontSize={"small"}>
              Theme Migration Tool
            </Link>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            columnGap={1}
            // minWidth={{ md: "20vw" }}
          >
            <Button
              href="https://github.com/everurstruly/mui-theme-builder"
              color="inherit"
              sx={{ minWidth: 0 }}
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
