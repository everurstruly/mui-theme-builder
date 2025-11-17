import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useDesignStore } from "../Design/designStore";
import {
  editorExperiences,
  type EditorExperienceId,
} from "../Design/designExperience";
import { alpha, type SxProps } from "@mui/material";

type EditorThemingExperienceTabProps = {
  sx?: SxProps;
  centered?: boolean;
};

export default function ThemingExperienceTab({
  centered = false,
  ...rest
}: EditorThemingExperienceTabProps) {
  const value = useDesignStore((state) => state.selectedExperienceId);
  const setValue = useDesignStore((state) => state.selectExperience);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: EditorExperienceId
  ) => {
    void event;
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="secondary tabs example"
      centered={centered}
      sx={{
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

          // ":first-of-type": {
          //   paddingInlineStart: { lg: 0 },
          // },

          "&.Mui-selected": {
            color: (theme) => theme.palette.primary.main,
            zIndex: 2,
          },
        },

        "& .MuiTabs-indicator": {
          borderRadius: 2,
          transform: "translateY(-50%)",
          top: "50%",
          height: "100%",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        },

        ...rest.sx,
      }}
    >
      {Object.keys(editorExperiences).map((id) => {
        const tab = editorExperiences[id as EditorExperienceId];
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
