import { Typography } from "@mui/material";
import FontStyleSelectOption from "./FontStyleSelectOption";

type FontStyleProps = {
  title: string;
};

export default function FontStyle(props: FontStyleProps) {
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

      <FontStyleSelectOption
        name="lineHeight"
        initValue="1.1"
        modifiedValue="1.1"
      />

      <FontStyleSelectOption
        name="letterSpacing"
        initValue="0"
        modifiedValue="0"
      />
    </div>
  );
}
