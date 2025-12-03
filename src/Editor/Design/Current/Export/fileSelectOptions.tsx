import { ContrastOutlined, LightMode, DarkMode } from "@mui/icons-material";
import type { TabOwnProps } from "@mui/material";
import type { ExportColorScheme } from "./useExportOptions";

export const fileSelectOptions: Array<{
  label: string;
  icon: TabOwnProps["icon"];
  value: ExportColorScheme;
}> = [
  {
    label: "Dual mode",
    icon: <ContrastOutlined fontSize="small" />,
    value: "dual",
  },
  {
    label: "Light mode only",
    icon: <LightMode fontSize="small" />,
    value: "light",
  },
  {
    label: "Dark mode only",
    icon: <DarkMode fontSize="small" />,
    value: "dark",
  },
];
