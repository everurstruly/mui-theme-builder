import FontFamilySelectOption from "../FontFamily/FontFamilySelectOption";
import { Typography } from "@mui/material";

const fontSettings = {
  title: "Body & Captions",
  family: {
    initValue: { key: "fontFamily", value: "Roboto", title: "Roboto" },
    modifiedValue: { key: "fontFamily", value: "Arial", title: "Arial" },
  },
};

function BodyTypography() {
  return (
    <div>
      <Typography fontSize={14} fontWeight={600} marginTop={5} paddingBlock={1.5}>
        {fontSettings.title}
      </Typography>

      <FontFamilySelectOption
        name={"Font family"}
        initValue={fontSettings.family.initValue}
        modifiedValue={fontSettings.family.modifiedValue}
      />
    </div>
  );
}

export default BodyTypography;
