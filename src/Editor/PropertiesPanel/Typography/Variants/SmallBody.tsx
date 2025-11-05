import FontStyleSelectOption from "../FontStyle/FontStyleSelectOption";
import FontFamilySelectOption from "../FontFamily/FontFamilySelectOption";
import { Typography } from "@mui/material";
import FontWeightSelectOption from "../FontWeight/FontWeightSelectOption";

const font = {
  name: "Small Body",
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

function SmallBodyTypography() {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {font.name}
      </Typography>

      <FontFamilySelectOption
        name={"Font family"}
        initValue={font.family.initValue}
        modifiedValue={font.family.modifiedValue}
      />

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

export default SmallBodyTypography;
