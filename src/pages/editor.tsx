import Editor from "../Editor/Editor";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { HelpOutlineOutlined } from "@mui/icons-material";
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
        sx={{
          overflow: "hidden",
          borderBottom: 1,
          borderBottomColor: "divider",
          backgroundColor: colors.common.black,
        }}
      >
        <StyledToolbar sx={{ px: { lg: 1.5 } }}>
          <Typography
            noWrap
            variant="h6"
            color="inherit"
            aria-label="open drawer"
            sx={{ fontSize: 14, fontWeight: 500 }}
          >
            MUI Theme Builder
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              marginLeft: "auto",
              marginRight: -1, // size of button padding
            }}
          >
            <Button aria-label="search" color="inherit" sx={{ px: 1, minWidth: 0 }}>
              <HelpOutlineOutlined />
            </Button>

            <Button
              aria-label="display more actions"
              color="inherit"
              sx={{ px: 1, minWidth: 0 }}
            >
              <MenuIcon />
            </Button>
          </Stack>
        </StyledToolbar>
      </AppBar>
      <Editor />
    </>
  );
}
