import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "./theme/ColorModeIconDropdown";
import BrandLink from "../BrandLink";
import { Stack } from "@mui/material";
import { menuLinks } from "./menuLinks";
import { Link } from "react-router";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function PageHeader() {
  const [mobileNavOpened, setMobileNavOpened] = React.useState(false);

  const displayMobileNav = (newOpen: boolean) => () => {
    setMobileNavOpened(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 20px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar
          sx={{
            columnGap: 1.4,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <BrandLink />

          <Stack
            direction="row"
            sx={{ display: { xs: "none", sm: "flex" }, px: 2, columnGap: 1 }}
          >
            {menuLinks.map(({ label, href }) => (
              <Button
                component={Link}
                key={href}
                to={href}
                size="small"
              >
                {label}
              </Button>
            ))}
          </Stack>

          <ColorModeIconDropdown size="medium" />

          <IconButton
            aria-label="Menu button"
            onClick={displayMobileNav(true)}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="top"
            open={mobileNavOpened}
            onClose={displayMobileNav(false)}
            sx={{
              top: "var(--template-frame-height, 0px)",
            }}
          >
            <Box sx={{ p: 2, backgroundColor: "background.default" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={displayMobileNav(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>

              {menuLinks.map(({ label, href }) => (
                <MenuItem key={href} onClick={displayMobileNav(false)}>
                  <Button component={Link} to={href}>
                    {label}
                  </Button>
                </MenuItem>
              ))}

              <Divider sx={{ my: 3 }} />
              <MenuItem>
                <Button
                  component={Link}
                  to="/editor"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Start Customizing
                </Button>
              </MenuItem>
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
