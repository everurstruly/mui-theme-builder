import { AddCircleOutlineRounded, ArrowRightAltOutlined } from "@mui/icons-material";
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
  ListItemIcon,
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
    left: "0px !important",
    width: "var(--explorer-panel-width)",
    overflow: "hidden",
    minWidth: 180,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: theme.palette.divider,
    marginTop: theme.spacing(1),
    backdropFilter: "blur(20px)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

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
          px: 0
        }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        // endIcon={<MoreVertOutlined color="action" />}
      >
        <Stack
          direction={"row"}
          columnGap={0.5}
          alignItems={"center"}
          sx={{ overflow: "hidden", }}
        >
          <Typography
            variant="caption"
            color="primary"
            fontWeight={"semibold"}
            sx={{ lineHeight: 1.2, whiteSpace: "nowrap", p: 0 }}
          >
            You're editing
          </Typography>
          <Typography
            variant="caption"
            color="action.medium"
            fontWeight={"semibold"}
            sx={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            / Renna Games Dashboardslsjljsdf
          </Typography>
        </Stack>
      </Button>

      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          // list: {
          //   "aria-labelledby": "basic-button",
          // },
          paper: {
            sx: {
              // width: "var(--explorer-panel-width)",
              // borderTopLeftRadius: 0,
              // borderTopRightRadius: 0,
              // mt: (theme) => theme.spacing(0.5),
              overflow: "hidden",
            },
          },
        }}
      >
        {/* <Divider sx={{ my: 2 }} /> */}

        <MenuItem>
          <ListItemIcon>
            <AddCircleOutlineRounded />
          </ListItemIcon>
          <ListItemText
            slotProps={{ primary: { sx: { fontSize: "body2.fontSize" } } }}
          >
            Create New Theme
          </ListItemText>{" "}
        </MenuItem>

        <Divider />

        {/* <Divider /> */}
        <Tabs variant="fullWidth" value="discover">
          <Tab value="discover" label="Templates" />
          <Tab value="saves" label="My Saves" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        <MenuItem sx={{ lineHeight: 1, columnGap: 1, px: 1 }}>
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
          <ListItemText>Shadcn UI</ListItemText>
          <ListItemIcon sx={{ alignSelf: "flex-end" }}>
            <ArrowRightAltOutlined />
          </ListItemIcon>
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default CurrentThemeDesignStatus;
