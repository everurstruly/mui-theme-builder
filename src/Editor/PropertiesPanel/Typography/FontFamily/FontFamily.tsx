import { Typography } from "@mui/material";
import fontFamily from "./family";
import FontFamilySelectOption from "./FontFamilySelectOption";

type FontFamilyProps = {
  title: string;
};

export default function FontFamily(props: FontFamilyProps) {
  return (
    <div>
      <Typography
        fontSize={12}
        fontWeight={500}
        paddingInline={1.5}
        marginTop={4}
        paddingBlock={2}
      >
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
