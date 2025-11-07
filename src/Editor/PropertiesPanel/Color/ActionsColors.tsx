import ColorGroupListOption from "./ColorGroupListOption";
import { Typography } from "@mui/material";
import ColorInputOption from "./ColorInputOption";
import { useThemeWorkspaceCreatedTheme } from "../../ThemeWorkspace/useCreatedTheme.hooks";

function ActionColors(props: { title?: string }) {
  const { theme } = useThemeWorkspaceCreatedTheme();

  return (
    <>
      <Typography
        variant="caption"
        component={"h6"}
        marginTop={7}
        paddingBottom={1.8}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35}
      >
        {props.title}{" "}
      </Typography>

      <ColorGroupListOption
        name="active"
        path="palette.action.active"
        resolvedValue={theme.palette.action.active}
      />
      <ColorInputOption
        name="hover"
        path="palette.action.hoverOpacity"
        resolvedValue={theme.palette.action.hoverOpacity}
      />
      <ColorInputOption
        name="selected"
        path="palette.action.selectedOpacity"
        resolvedValue={theme.palette.action.selectedOpacity}
      />
      <ColorInputOption
        name="disabled"
        path="palette.action.disabledOpacity"
        resolvedValue={theme.palette.action.disabledOpacity}
      />
      <ColorInputOption
        name="disabled background"
        path="palette.action.disabledBackground"
        resolvedValue={theme.palette.action.disabledBackground}
      />
    </>
  );
}

export default ActionColors;
