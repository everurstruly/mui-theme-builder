import useExport from "./useExport";
import { Tab, Tabs, type TabOwnProps } from "@mui/material";
import { ContrastOutlined, DarkMode, LightMode } from "@mui/icons-material";
import type { ExportColorScheme } from "./useExportOptions";

const colorSchemeOptions: Array<{
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
    label: "Light mode",
    icon: <LightMode fontSize="small" />,
    value: "light",
  },
  {
    label: "Dark mode",
    icon: <DarkMode fontSize="small" />,
    value: "dark",
  },
];

export default function ExportFileTabs() {
  const { colorScheme, setColorScheme } = useExport();
  return (
    <Tabs
      value={colorScheme}
      onChange={(_, value) => setColorScheme(value)}
      sx={{ flexGrow: 1, position: "relative" }}
      slotProps={{
        root: {
          sx: { p: 1, pb: 0.5 },
        },
        indicator: {
          sx: { display: "none" },
        },
      }}
    >
      {colorSchemeOptions.map((option) => {
        return (
          <Tab
            key={option.value}
            label={option.label}
            value={option.value}
            icon={option.icon}
            iconPosition="start"
            disableRipple
            sx={(theme) => ({
              py: 1.4,
              minHeight: 0,
              height: "auto",
              textTransform: "none",
              fontWeight: 600,
              position: "relative",
              zIndex: 1,
              transition:
                "transform 200ms, box-shadow 200ms, background-color 200ms",

              // Selected tab becomes a floating blob/background
              "&.Mui-selected": {
                color: theme.palette.text.primary,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : theme.palette.background.paper,
                boxShadow: theme.shadows?.[3] ?? "0 6px 18px rgba(0,0,0,0.12)",
                borderRadius: theme.shape.borderRadius ?? 8,
                transform: "translateY(-1px)",
              },
            })}
          />
        );
      })}
    </Tabs>
  );
}
