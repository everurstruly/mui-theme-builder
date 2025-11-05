import ColorGroupListOption from "./ColorGroupListOption";
import { Typography } from "@mui/material";
import ColorInputOption from "./ColorInputOption";

function ActionColors(props: { title?: string }) {
  return (
    <>
      <Typography
        variant="caption"
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

      <ColorGroupListOption name="Color" initValue="#000" modifiedValue="#000" />
      <ColorInputOption name={"Active"} initValue={".5"} modifiedValue={".2"} />
      <ColorInputOption name={"Hover"} initValue={".5"} modifiedValue={".5"} />
      <ColorInputOption name={"Selection"} initValue={".5"} modifiedValue={".5"} />
      <ColorInputOption name={"Disabled"} initValue={".5"} modifiedValue={".5"} />
      <ColorInputOption
        name={"Disabled Background"}
        initValue={".5"}
        modifiedValue={".5"}
      />
    </>
  );
}

export default ActionColors;
