import CssStyleInputOption from "./CssStyleInputOption";
import { Typography } from "@mui/material";

type StylesAppearanceProps = {
  title: string;
};

export default function StylesAppearance(props: StylesAppearanceProps) {
  return (
    <div>
      <Typography
        variant="subtitle2"
        component={"h6"}
        marginTop={5}
        paddingBlock={1}
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

      <CssStyleInputOption name="Spacing Factor" initValue="0" modifiedValue="0" />

      <CssStyleInputOption
        name="Border Radius"
        initValue="4px"
        modifiedValue="4px"
      />
    </div>
  );
}

