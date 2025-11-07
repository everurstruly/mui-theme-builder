import { colors } from "@mui/material";

const palettes = [
  {
    title: "Primary",
    colors: [
      {
        name: "main",
        path: "palette.primary.main",
        baseValue: colors.blue[600],
      },
      {
        name: "light",
        path: "palette.primary.light",
        baseValue: colors.blue[400],
      },
      {
        name: "dark",
        path: "palette.primary.dark",
        baseValue: colors.blue[800],
      },
      {
        name: "contrastText",
        path: "palette.primary.contrastText",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Secondary",
    colors: [
      {
        name: "main",
        path: "palette.secondary.main",
        baseValue: colors.pink[600],
      },
      {
        name: "light",
        path: "palette.secondary.light",
        baseValue: colors.pink[400],
      },
      {
        name: "dark",
        path: "palette.secondary.dark",
        baseValue: colors.pink[800],
      },
      {
        name: "contrastText",
        path: "palette.secondary.contrastText",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Common",
    colors: [
      {
        name: "black",
        path: "palette.common.black",
        baseValue: colors.common.black,
      },
      {
        name: "white",
        path: "palette.common.white",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Text",
    colors: [
      {
        name: "primary",
        path: "palette.text.primary",
        baseValue: "rgba(0, 0, 0, 0.87)",
      },
      {
        name: "secondary",
        path: "palette.text.secondary",
        baseValue: "rgba(0, 0, 0, 0.6)",
      },
      {
        name: "disabled",
        path: "palette.text.disabled",
        baseValue: "rgba(0, 0, 0, 0.38)",
      },
    ],
  },
  {
    title: "Background",
    colors: [
      {
        name: "default",
        path: "palette.background.default",
        baseValue: colors.common.white,
      },
      {
        name: "paper",
        path: "palette.background.paper",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Divider",
    colors: [
      {
        name: "divider",
        path: "palette.divider",
        baseValue: "rgba(0, 0, 0, 0.12)",
      },
    ],
  },
  {
    title: "Error",
    colors: [
      {
        name: "main",
        path: "palette.error.main",
        baseValue: colors.red[600],
      },
      {
        name: "light",
        path: "palette.error.light",
        baseValue: colors.red[400],
      },
      {
        name: "dark",
        path: "palette.error.dark",
        baseValue: colors.red[800],
      },
      {
        name: "contrastText",
        path: "palette.error.contrastText",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Warning",
    colors: [
      {
        name: "main",
        path: "palette.warning.main",
        baseValue: colors.orange[600],
      },
      {
        name: "light",
        path: "palette.warning.light",
        baseValue: colors.orange[400],
      },
      {
        name: "dark",
        path: "palette.warning.dark",
        baseValue: colors.orange[800],
      },
      {
        name: "contrastText",
        path: "palette.warning.contrastText",
        baseValue: "rgba(0, 0, 0, 0.87)",
      },
    ],
  },
  {
    title: "Info",
    colors: [
      {
        name: "main",
        path: "palette.info.main",
        baseValue: colors.blue[600],
      },
      {
        name: "light",
        path: "palette.info.light",
        baseValue: colors.blue[400],
      },
      {
        name: "dark",
        path: "palette.info.dark",
        baseValue: colors.blue[800],
      },
      {
        name: "contrastText",
        path: "palette.info.contrastText",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Success",
    colors: [
      {
        name: "main",
        path: "palette.success.main",
        baseValue: colors.green[600],
      },
      {
        name: "light",
        path: "palette.success.light",
        baseValue: colors.green[400],
      },
      {
        name: "dark",
        path: "palette.success.dark",
        baseValue: colors.green[800],
      },
      {
        name: "contrastText",
        path: "palette.success.contrastText",
        baseValue: colors.common.white,
      },
    ],
  },
  {
    title: "Grey",
    colors: [
      {
        name: "50",
        path: "palette.grey.50",
        baseValue: colors.grey[50],
      },
      {
        name: "100",
        path: "palette.grey.100",
        baseValue: colors.grey[100],
      },
      {
        name: "200",
        path: "palette.grey.200",
        baseValue: colors.grey[200],
      },
      {
        name: "300",
        path: "palette.grey.300",
        baseValue: colors.grey[300],
      },
      {
        name: "400",
        path: "palette.grey.400",
        baseValue: colors.grey[400],
      },
      {
        name: "500",
        path: "palette.grey.500",
        baseValue: colors.grey[500],
      },
      {
        name: "600",
        path: "palette.grey.600",
        baseValue: colors.grey[600],
      },
      {
        name: "700",
        path: "palette.grey.700",
        baseValue: colors.grey[700],
      },
      {
        name: "800",
        path: "palette.grey.800",
        baseValue: colors.grey[800],
      },
      {
        name: "900",
        path: "palette.grey.900",
        baseValue: colors.grey[900],
      },
    ],
  },
];

export default palettes;
