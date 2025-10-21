import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeSelect from "../ToolBar/ThemeSelect";
import { HelpOutlineOutlined, ViewAgendaOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { headerHeightCss } from "../constants";
import { styled } from "@mui/material/styles";

export default function EditorMobileHeader() {
  return (
    <Box
      sx={(theme) => ({
        flexGrow: 1,
        height: headerHeightCss,
        [theme.breakpoints.up("md")]: {
          display: "none",
        },
      })}
    >
      <AppBar position="sticky" color="inherit" elevation={1}>
        <StyledToolbar>
          <Typography
            noWrap
            variant="h6"
            color="inherit"
            aria-label="open drawer"
            sx={{ py: 2, fontSize: 14, fontWeight: 500, ml: 2 }}
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

          <Box
            sx={{
              flexBasis: "100%",
              display: "flex",
              alignItems: "center",
              paddingInlineStart: 1.5,
              paddingInlineEnd: 1,
              paddingTop: 1,
              paddingBottom: 2.5,
            }}
          >
            <ThemeSelect />

            <IconButton sx={{ marginInlineStart: "auto" }}>
              <ViewAgendaOutlined />
            </IconButton>
          </Box>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexWrap: "wrap",
  alignItems: "center",
  paddingInline: 0,
  [theme.breakpoints.up("sm")]: {
    paddingInline: theme.spacing(0),
  },
}));
