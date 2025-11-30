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
            // columnGap: 1.5,
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

        // make the indicator a centered dot placed vertically in the middle
        // "& .MuiTabs-indicator": {
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   backgroundColor: "transparent",
        //   bottom: "auto",
        //   transform: "translateY(-50%)",
        //   height: "auto",
        // },
        // "& .MuiTabs-indicator > span": {
        //   width: "50%",
        //   height: 3,
        //   borderRadius: "50%",
        //   backgroundColor: (theme: any) => theme.palette.primary.main,
        //   boxShadow: (theme: any) => `0 0 0 2px ${theme.palette.action.hover}`,
        // },


        // Floating background indicator: a rounded rectangle that sits behind the
        // selected tab. We keep the old dot implementation commented above.
        // "& .MuiTabs-indicator": {
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   backgroundColor: "transparent",
        //   // pull indicator slightly away from edges to create a "floating" feel
        //   top: 6,
        //   height: "calc(100% - 12px)",
        //   transition: "none",
        //   pointerEvents: "none",
        // },

        // "& .MuiTabs-indicator > span": {
        //   display: "block",
        //   width: "100%",
        //   height: "100%",
        //   borderRadius: "8px",
        //   backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        // },

        // // ensure the tab content stays above the indicator
        // "& .MuiTab-root": {
        //   zIndex: 2,
        // },

        ...sx,
      }}
    >
      {designProperties.map((prop) => (
          <Tab
          key={prop.value}
          label={prop.label}
          value={prop.value}
          disableRipple
          // no hover prefetch
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
