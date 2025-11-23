import {
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  FormatColorFillRounded,
} from "@mui/icons-material";
import {
  alpha,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  Tab,
  Box,
  Tabs,
  Typography,
  type MenuProps,
} from "@mui/material";
import React from "react";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    left: "1px !important",
    width: "var(--explorer-panel-width)",
    overflow: "hidden",
    minWidth: 180,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: theme.palette.divider,
    marginTop: theme.spacing(0.5),
    backdropFilter: "blur(20px)",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[16],

    "& .MuiMenu-list": {
      padding: "4px 0",
      height: "50dvh",
      overflow: "hidden",
    },

    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
        ...theme.applyStyles("dark", {
          color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },

    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

function CurrentThemeDesignStatus() {
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
      <Button
        color="inherit"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "start",
          flexGrow: 1,
          borderRadius: 2,
          pt: 0,
        }}
        id="basic-button"
        aria-controls={open ? "some-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Stack sx={{ overflow: "hidden" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              fontWeight={"bold"}
              color="primary"
              sx={{ lineHeight: 1, whiteSpace: "nowrap", p: 0 }}
            >
              You're editing
            </Typography>
            {open ? (
              <ArrowDropUpRounded sx={{ color: "primary.main" }} />
            ) : (
              <ArrowDropDownRounded sx={{ color: "primary.main" }} />
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1.1,
              overflow: "hidden",
              color: open ? "text.disabled" : "text.primary",
            }}
          >
            Renna Games Dashboardslsjljsdf
          </Typography>
        </Stack>
      </Button>

      <StyledMenu
        id="some-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
          paper: {
            sx: {
              overflow: "hidden",
            },
          },
        }}
      >
        <Tabs variant="fullWidth" value="saves">
          <Tab value="saves" label="My Saves" />
          <Tab value="discover" label="Templates" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        <MenuItem>
          <Stack direction="row" spacing={0.25}>
            {new Array(4).fill(0).map(() => {
              return (
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: 1,
                    bgcolor: "grey.300",
                  }}
                />
              );
            })}
          </Stack>
          <ListItemText sx={{ mx: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
            Material Design 3
          </ListItemText>
          <FormatColorFillRounded />
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default CurrentThemeDesignStatus;
