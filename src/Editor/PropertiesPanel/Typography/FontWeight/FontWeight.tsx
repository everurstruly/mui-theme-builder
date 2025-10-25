import { Typography } from "@mui/material";
import fontWeights from "./weights";
import FontWeightSelectItem from "./FontWeightSelectOption";

type FontWeightProps = {
  title: string;
};

export default function FontWeight(props: FontWeightProps) {
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

      {fontWeights.map((font) => {
        return (
          <FontWeightSelectItem
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
