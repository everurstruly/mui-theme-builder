import useEditor, { designProperties } from "../useEditor";
import { Tabs, Tab, alpha } from "@mui/material";

interface PropertiesTabsProps {
  sx?: any;
  tabSx?: any;
}

export default function PropertiesTabs({ sx, tabSx }: PropertiesTabsProps) {
  const selected = useEditor((s) => s.selectedPropertiesTab);
  const selectTab = useEditor((s) => s.selectPropertiesTab);

  return (
    <Tabs
      aria-label="Property tabs"
      value={selected}
      variant="fullWidth"
      onChange={(_, newValue) => selectTab(newValue)}
      slotProps={{
        indicator: {
          children: <span />,
        },
        list: {
          sx: {
            columnGap: 1.5,
          },
        },
      }}
      sx={{
        zIndex: 1,
        flexGrow: 1,

        "& .MuiTabs-indicator": {
          height: "1px",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.7),
        },

        ...sx,
      }}
    >
      {designProperties.map((prop) => (
        <Tab
          key={prop.value}
          label={prop.label}
          value={prop.value}
          sx={{
            minWidth: 0,
            height: "var(--activity-bar-height)",
            fontSize: "12px",
            fontWeight: "semibold",
            textTransform: "none",
            ...tabSx,
          }}
        />
      ))}
    </Tabs>
  );
}
