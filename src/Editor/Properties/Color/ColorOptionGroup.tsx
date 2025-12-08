import { Grid } from "@mui/material";
import type { PaletteGroup } from "./Color";
import OptionGroupCollapse from "../../Toolbar/OptionGroupCollapse";
import ColorOptionGroupItem from "./ColorOptionGroupItem";

type ColorOptionGroupProps = PaletteGroup;

export default function ColorOptionGroup(props: ColorOptionGroupProps) {
  return (
    <OptionGroupCollapse heading={props.title} defaultOpen={props.defaultOpen}>
      <Grid container spacing={{ xs: 1.8, md: 2.5 }}>
        {props.items.map((item) => (
          <Grid key={item.name ?? item.fill} size={6}>
            <ColorOptionGroupItem {...item} />
          </Grid>
        ))}
      </Grid>
    </OptionGroupCollapse>
  );
}
