import FontStyleSelectOption from "../FontStyle/FontStyleSelectOption";
import FontWeightSelectOption from "../FontWeight/FontWeightSelectOption";
import { Typography } from "@mui/material";

const font = {
  name: "H3",
  family: {
    initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
    modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
  },
  weight: {
    initValue: { key: "fontWeight", value: "400" },
    modifiedValue: { key: "fontWeight", value: "700" },
  },
  lineHeight: {
    initValue: "1.1",
    modifiedValue: "1.1",
  },
};

function SectionSubHeadingTypography() {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1}>
        {font.name}
      </Typography>

      <FontWeightSelectOption
        name={"Font weight"}
        initValue={font.weight.initValue}
        modifiedValue={font.weight.modifiedValue}
      />

      <FontStyleSelectOption
        name={"Line height"}
        initValue={font.lineHeight.initValue}
        modifiedValue={font.lineHeight.modifiedValue}
      />
    </div>
  );
}

export default SectionSubHeadingTypography;
