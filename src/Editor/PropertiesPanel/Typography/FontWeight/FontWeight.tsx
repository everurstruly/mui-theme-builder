import { Typography } from "@mui/material";
import fontWeights from "./weights";
import FontWeightSelectOption from "./FontWeightSelectOption";

type FontWeightProps = {
  title: string;
};

export default function FontWeight(props: FontWeightProps) {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {props.title}
      </Typography>

      {fontWeights.map((font) => {
        return (
          <FontWeightSelectOption
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
