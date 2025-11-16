import { Typography } from "@mui/material";
import ColorOptionActionGroupItem from "./ActionColorOptionGroupItem";
import { useCreatedTheme } from "../../Design";
import ColorOptionGroupItem from "./ColorOptionGroupItem";

function ColorOptionActionGroup(props: { title?: string }) {
  const theme = useCreatedTheme();

  return (
    <>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={7}
        paddingBottom={1.8}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {props.title}{" "}
        {/* <Typography
          component="span"
          fontSize={12}
          color="success.main"
          marginLeft={1}
        >
          Component
        </Typography> */}
      </Typography>

      <ul>
        <ColorOptionGroupItem path="palette.action.active" title="Shade" />
        <ColorOptionActionGroupItem
          path="palette.action.hover"
          name="Hover"
          resolvedValue={theme.palette.action.hover}
        />
        <ColorOptionActionGroupItem
          path="palette.action.selected"
          name="Selected"
          resolvedValue={theme.palette.action.selected}
        />
        <ColorOptionActionGroupItem
          path="palette.action.disabled"
          name="Disabled"
          resolvedValue={theme.palette.action.disabled}
        />
        <ColorOptionActionGroupItem
          path="palette.action.disabledBackground"
          name="Disabled Background"
          resolvedValue={theme.palette.action.disabledBackground}
        />
        <ColorOptionActionGroupItem
          path="palette.action.focus"
          name="Focus"
          resolvedValue={theme.palette.action.focus}
        />
      </ul>
    </>
  );
}

export default ColorOptionActionGroup;
