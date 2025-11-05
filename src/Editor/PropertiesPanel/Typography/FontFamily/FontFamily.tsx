import { Typography } from "@mui/material";
import fontFamily from "./family";
import FontFamilySelectOption from "./FontFamilySelectOption";

type FontFamilyProps = {
  title: string;
};

export default function FontFamily(props: FontFamilyProps) {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {props.title}
      </Typography>

      {fontFamily.map((font) => {
        return (
          <FontFamilySelectOption
            key={font.name}
            name={font.name}
            initValue={font.initValue}
            modifiedValue={font.modifiedValue}
          />
        );
      })}
    </div>
  );
}
