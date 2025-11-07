import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEditorExperienceStore } from "../useThemingExperienceStore";
import { editorExperiences, type EditorExperienceId } from "../themingExperience";
import { alpha, type SxProps } from "@mui/material";

type EditorThemingExperienceTabProps = {
  sx?: SxProps;
  centered?: boolean;
};

export default function ThemingExperienceTab({
  centered = false,
  ...rest
}: EditorThemingExperienceTabProps) {
  const value = useEditorExperienceStore((state) => state.selectedExperienceId);
  const setValue = useEditorExperienceStore((state) => state.selectExperience);

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
        minHeight: { lg: "auto" },
        flexGrow: 1,

        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: (theme) => alpha(theme.palette.common.black, 0.0125),

        "& .MuiTab-root": {
          minHeight: "auto", // fix vertical responsiveness issue
          flexGrow: 1,

          textWrap: "nowrap",
          position: "relative",
          zIndex: 1,

          fontSize: 12,
          // fontWeight: 600,

          textTransform: "none",
          paddingInline: { xs: 1.75 },
          paddingBlock: { xs: 1.25 },

          // ":first-of-type": {
          //   paddingInlineStart: { lg: 0 },
          // },

          "&.Mui-selected": {
            color: "common.black",
            zIndex: 2,
          },
        },

        "& .MuiTabs-indicator": {
          borderRadius: 2,
          transform: "translateY(-50%)",
          top: "50%",
          height: "99%",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
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
