import React from "react";
import { AutoAwesome } from "@mui/icons-material";
import type { SxProps } from "@mui/material";
import type { PropertiesTab } from "../useEditor";

type ResourceGenerator = {
  color?: string;
  sx?: (theme: any) => SxProps<any>;
  icon?: React.ReactNode;
  label?: string;
  variant?: string;
};

export const propertyToResourceGeneratorMap: Partial<
  Record<PropertiesTab, ResourceGenerator>
> = {
  palette: {
    color: "info",
    sx: (theme: any) => ({
      backgroundImage: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
      "&:hover": { filter: "brightness(0.95)" },
    }),
    icon: <AutoAwesome />,
    label: "Generate Colors",
    variant: "extended",
  },

  typography: {
    color: "primary",
    sx: (theme: any) => ({
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${
        theme.palette.secondary?.main ?? theme.palette.info.main
      })`,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
      "&:hover": { filter: "brightness(0.95)" },
    }),
    icon: <AutoAwesome />,
    label: "Generate Typography",
    variant: "extended",
  },

  appearance: {
    color: "success",
    sx: (theme: any) => ({
      backgroundImage: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
      color: theme.palette.getContrastText(theme.palette.success.main),
      boxShadow: `0 6px 18px rgba(0,0,0,0.12)`,
      "&:hover": { filter: "brightness(0.95)" },
    }),
    icon: <AutoAwesome />,
    label: "Generate Appearance",
    variant: "extended",
  },
};

export default propertyToResourceGeneratorMap;
