import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function EditorHeader() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ overflow: "hidden", borderBottom: 1, borderBottomColor: "divider" }}
    >
      <StyledToolbar>
        <Typography
          noWrap
          variant="h6"
          color="inherit"
          aria-label="open drawer"
          sx={{ fontSize: 14, fontWeight: 500, ml: 2 }}
        >
          MUI Theme Builder
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            marginLeft: "auto",
            marginRight: 1,
          }}
        >
          <Button
            aria-label="search"
            color="inherit"
            sx={{ px: 1, minWidth: 0 }}
          >
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
  );
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexWrap: "wrap",
  alignItems: "center",
  paddingInline: 0,
  height: "var(--header-height) !important",
  minHeight: "var(--header-height) !important",
  [theme.breakpoints.up("sm")]: {
    paddingInline: theme.spacing(0),
  },
}));
