import List from "@mui/material/List";
import ColorGroupList from "./ColorGroupList";
import ColorGroupListOption from "./ColorGroupListOption";
import ActionColors from "./ActionsColors";
import { useMemo } from "react";
import type { Theme } from "@mui/material";
import { useThemeWorkspaceCreatedTheme } from "../../ThemeWorkspace/useCreatedTheme.hooks";

export default function ColorProperty() {
  const { theme } = useThemeWorkspaceCreatedTheme();
  const palettes = useMemo(() => {
    return mapCreatedThemePaletteToEditablePalette(theme.palette);
  }, [theme.palette]);

  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
        padding: 0,
        "& ul": { padding: 0 },
      }}
    >
      {palettes.map((palette) => (
        <li key={palette.title}>
          <ColorGroupList title={palette.title}>
            {palette.colors.map((color) => {
              return (
                <ColorGroupListOption
                  key={color.path}
                  name={color.name}
                  path={color.path}
                  resolvedValue={color.resolvedValue}
                />
              );
            })}
          </ColorGroupList>
        </li>
      ))}
      <ActionColors title="Actions States" />
    </List>
  );
}

type PaletteColor = {
  name: string;
  path: string;
  resolvedValue: string;
};

type PaletteGroup = {
  title: string;
  colors: PaletteColor[];
};

function mapCreatedThemePaletteToEditablePalette(
  palette: Theme["palette"]
): PaletteGroup[] {
  return [
    {
      title: "Primary",
      colors: [
        {
          name: "main",
          path: "palette.primary.main",
          resolvedValue: palette.primary.main,
        },
        {
          name: "light",
          path: "palette.primary.light",
          resolvedValue: palette.primary.light,
        },
        {
          name: "dark",
          path: "palette.primary.dark",
          resolvedValue: palette.primary.dark,
        },
        {
          name: "contrastText",
          path: "palette.primary.contrastText",
          resolvedValue: palette.primary.contrastText,
        },
      ],
    },
    {
      title: "Secondary",
      colors: [
        {
          name: "main",
          path: "palette.secondary.main",
          resolvedValue: palette.secondary.main,
        },
        {
          name: "light",
          path: "palette.secondary.light",
          resolvedValue: palette.secondary.light,
        },
        {
          name: "dark",
          path: "palette.secondary.dark",
          resolvedValue: palette.secondary.dark,
        },
        {
          name: "contrastText",
          path: "palette.secondary.contrastText",
          resolvedValue: palette.secondary.contrastText,
        },
      ],
    },
    {
      title: "Error",
      colors: [
        {
          name: "main",
          path: "palette.error.main",
          resolvedValue: palette.error.main,
        },
        {
          name: "light",
          path: "palette.error.light",
          resolvedValue: palette.error.light,
        },
        {
          name: "dark",
          path: "palette.error.dark",
          resolvedValue: palette.error.dark,
        },
        {
          name: "contrastText",
          path: "palette.error.contrastText",
          resolvedValue: palette.error.contrastText,
        },
      ],
    },
    {
      title: "Warning",
      colors: [
        {
          name: "main",
          path: "palette.warning.main",
          resolvedValue: palette.warning.main,
        },
        {
          name: "light",
          path: "palette.warning.light",
          resolvedValue: palette.warning.light,
        },
        {
          name: "dark",
          path: "palette.warning.dark",
          resolvedValue: palette.warning.dark,
        },
        {
          name: "contrastText",
          path: "palette.warning.contrastText",
          resolvedValue: palette.warning.contrastText,
        },
      ],
    },
    {
      title: "Info",
      colors: [
        {
          name: "main",
          path: "palette.info.main",
          resolvedValue: palette.info.main,
        },
        {
          name: "light",
          path: "palette.info.light",
          resolvedValue: palette.info.light,
        },
        {
          name: "dark",
          path: "palette.info.dark",
          resolvedValue: palette.info.dark,
        },
        {
          name: "contrastText",
          path: "palette.info.contrastText",
          resolvedValue: palette.info.contrastText,
        },
      ],
    },
    {
      title: "Success",
      colors: [
        {
          name: "main",
          path: "palette.success.main",
          resolvedValue: palette.success.main,
        },
        {
          name: "light",
          path: "palette.success.light",
          resolvedValue: palette.success.light,
        },
        {
          name: "dark",
          path: "palette.success.dark",
          resolvedValue: palette.success.dark,
        },
        {
          name: "contrastText",
          path: "palette.success.contrastText",
          resolvedValue: palette.success.contrastText,
        },
      ],
    },
    {
      title: "Text",
      colors: [
        {
          name: "primary",
          path: "palette.text.primary",
          resolvedValue: palette.text.primary,
        },
        {
          name: "secondary",
          path: "palette.text.secondary",
          resolvedValue: palette.text.secondary,
        },
        {
          name: "disabled",
          path: "palette.text.disabled",
          resolvedValue: palette.text.disabled,
        },
      ],
    },
    {
      title: "Background",
      colors: [
        {
          name: "default",
          path: "palette.background.default",
          resolvedValue: palette.background.default,
        },
        {
          name: "paper",
          path: "palette.background.paper",
          resolvedValue: palette.background.paper,
        },
      ],
    },
    {
      title: "Divider",
      colors: [
        {
          name: "divider",
          path: "palette.divider",
          resolvedValue: palette.divider,
        },
      ],
    },
    {
      title: "Common",
      colors: [
        {
          name: "black",
          path: "palette.common.black",
          resolvedValue: palette.common.black,
        },
        {
          name: "white",
          path: "palette.common.white",
          resolvedValue: palette.common.white,
        },
      ],
    },
    {
      title: "Grey",
      colors: [
        { name: "50", path: "palette.grey.50", resolvedValue: palette.grey[50] },
        {
          name: "100",
          path: "palette.grey.100",
          resolvedValue: palette.grey[100],
        },
        {
          name: "200",
          path: "palette.grey.200",
          resolvedValue: palette.grey[200],
        },
        {
          name: "300",
          path: "palette.grey.300",
          resolvedValue: palette.grey[300],
        },
        {
          name: "400",
          path: "palette.grey.400",
          resolvedValue: palette.grey[400],
        },
        {
          name: "500",
          path: "palette.grey.500",
          resolvedValue: palette.grey[500],
        },
        {
          name: "600",
          path: "palette.grey.600",
          resolvedValue: palette.grey[600],
        },
        {
          name: "700",
          path: "palette.grey.700",
          resolvedValue: palette.grey[700],
        },
        {
          name: "800",
          path: "palette.grey.800",
          resolvedValue: palette.grey[800],
        },
        {
          name: "900",
          path: "palette.grey.900",
          resolvedValue: palette.grey[900],
        },
      ],
    },
  ];
}
