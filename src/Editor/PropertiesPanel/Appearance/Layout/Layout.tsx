import { Typography } from "@mui/material";
import PresetsToggleGroup from "./PresetsToggleGroup";

type LayoutAppearanceProps = {
  title?: string;
};

export default function LayoutAppearance(props: LayoutAppearanceProps) {
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
      <PresetsToggleGroup />
    </div>
  );
}

