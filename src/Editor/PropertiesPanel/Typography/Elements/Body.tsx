import FontStyleSelectOption from "../FontStyleOption/FontStyleSelectOption";
import FontFamilyOption from "../FontFamily/FontFamilyOption";
import FontWeightOption from "../FontWeightOption/FontWeightOption";
import { Typography } from "@mui/material";

const font = {
  name: "Body (p)",
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

function BodyTypography() {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {font.name}
      </Typography>

      <FontFamilyOption
        name={"Font family"}
        initValue={font.family.initValue}
        modifiedValue={font.family.modifiedValue}
      />

      <FontWeightOption
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

export default BodyTypography;

