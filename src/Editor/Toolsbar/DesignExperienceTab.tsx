import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useDesignStore } from "../Design/Current/designStore";
import {
  editorDesignExperiences,
  type EditorDesignExperienceId,
} from "../editorDesignExperience";
import { alpha, type SxProps, type Theme } from "@mui/material";

type EditorThemingExperienceTabProps = {
  centered?: boolean;
  sx?: SxProps<Theme>;
};

export default function ThemingExperienceTab({
  centered = false,
  sx,
}: EditorThemingExperienceTabProps) {
  const value = useDesignStore((state) => state.selectedExperienceId);
  const setValue = useDesignStore((state) => state.selectExperience);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: EditorDesignExperienceId
  ) => {
    void event;
    setValue(newValue);
  };

  // Base sx for this component. Keep as an array so we can append any incoming
  // `sx` from props — incoming entries are appended so they take precedence.
  const baseSx: SxProps<Theme>[] = [
    () => ({
      // fix vertical responsiveness issue
      alignItems: "center",
      minHeight: "auto",
      flexGrow: 1,

      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",

      "& .MuiTab-root": {
        minHeight: "auto", // fix vertical responsiveness issue
        flexGrow: 1,

        textWrap: "nowrap",
        position: "relative",
        zIndex: 1,

        fontSize: 12,
        fontWeight: 400,

        textTransform: "none",
        paddingInline: { xs: 1.75 },
        paddingBlock: { xs: 1.15 },

        "&.Mui-selected": {
          color: (theme: Theme) => theme.palette.primary.main,
          zIndex: 2,
        },
      },

      "& .MuiTabs-indicator": {
        borderRadius: 2,
        transform: "translateY(-50%)",
        top: "50%",
        height: "100%",
        backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.05),
      },
    }),
    (theme: any) => ({
      ...(theme?.applyStyles?.("light", {
        backgroundColor: "white",
      }) ?? {}),
    }),
  ];

  const incomingSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const mergedSx = [...baseSx, ...incomingSx];

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="secondary tabs example"
      centered={centered}
      sx={mergedSx}
    >
      {Object.keys(editorDesignExperiences).map((id) => {
        const tab = editorDesignExperiences[id as EditorDesignExperienceId];
        return (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.title}
            iconPosition="start"
            disableRipple
            // icon={<tab.icon sx={{ fontSize: 18 }} />}
          />
        );
      })}
    </Tabs>
  );
}
