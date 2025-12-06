import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { alpha, type SxProps, type Theme } from "@mui/material";
import useEditor, { type EditorExperience } from "./useEditor";

type EditorThemingExperienceTabProps = {
  centered?: boolean;
  sx?: SxProps<Theme>;
};

export default function EditorExperienceTab({
  centered = false,
  sx,
}: EditorThemingExperienceTabProps) {
  const value = useEditor((state) => state.selectedExperience);
  const setValue = useEditor((state) => state.selectExperience);

  const handleChange = (event: React.SyntheticEvent, newValue: EditorExperience) => {
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

      borderRadius: 1,
      border: "1px solid",
      borderColor: "divider",
      overflow: "hidden",

      "& .MuiTab-root": {
        minHeight: "auto", // fixes vertical responsiveness issue
        flexGrow: 1,

        whiteSpace: "nowrap",
        position: "relative",
        zIndex: 1,

        textTransform: "none",
        paddingInline: { xs: 1.75 },
        paddingBlock: { xs: 1 },

        "&.Mui-selected": {
          color: (theme: Theme) => theme.palette.primary.main,
          zIndex: 2,
        },
      },

      "& .MuiTabs-indicator": {
        borderRadius: 1,
        transform: "translateY(-50%)",
        top: "50%",
        height: "100%",
        backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
      },
    }),
  ];

  const incomingSx = Array.isArray(sx) ? sx : sx ? [sx] : [];
  const mergedSx = [...baseSx, ...incomingSx];

  return (
    <Tabs value={value} onChange={handleChange} centered={centered} sx={mergedSx}>
      <Tab value={"designer"} label={"Customize"} iconPosition="start" />
      <Tab value={"developer"} label={"Ovveride"} iconPosition="start" />
    </Tabs>
  );
}
