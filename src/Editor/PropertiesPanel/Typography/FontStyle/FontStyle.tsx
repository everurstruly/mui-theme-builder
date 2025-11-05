import { Typography } from "@mui/material";
import FontStyleSelectOption from "./FontStyleSelectOption";

type FontStyleProps = {
  title: string;
};

export default function FontStyle(props: FontStyleProps) {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {props.title}
      </Typography>

      <FontStyleSelectOption name="lineHeight" initValue="1.1" modifiedValue="1.1" />
      <FontStyleSelectOption name="letterSpacing" initValue="0" modifiedValue="0" />
    </div>
  );
}
