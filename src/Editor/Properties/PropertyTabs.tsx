import useEditorStore, { designProperties } from "../useEditor";
import { Tabs, Tab, alpha } from "@mui/material";

interface PropertyTabsProps {
  /** Optional: override the padding for each tab */
  sx?: any;
  tabSx?: any;
}

export default function PropertyTabs({ sx, tabSx }: PropertyTabsProps) {
  const selected = useEditorStore((s) => s.selectedPropertyTab);
  const selectTab = useEditorStore((s) => s.selectPropertyTab);

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
          // disableRipple
          sx={{
            minWidth: 0,
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
