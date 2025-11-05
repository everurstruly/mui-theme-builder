import FontStyleSelectOption from "../FontStyle/FontStyleSelectOption";
import { Typography } from "@mui/material";
import FontWeightSelectOption from "../FontWeight/FontWeightSelectOption";
import FontStyleInputOption from "../FontStyle/FontStyleInputOption";

const font = {
  title: "H1",
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
  letterSpacing: {
    initValue: "0",
    modifiedValue: "-12",
  },
};

function PageHeadingTypography() {
  return (
    <div>
      <Typography
        variant="caption"
        component={"h6"}
        marginTop={5}
        paddingBlock={1}
        fontWeight={500}
        color="common.black"
        paddingInlineStart={0.35} // aesthetics alignment with list items badge
      >
        {font.title}{" "}
        {/* <Typography
          component="span"
          fontSize={12}
          color="success.main"
          marginLeft={1}
        >
          Component
        </Typography> */}
      </Typography>

      <FontWeightSelectOption
        name={"Font weight"}
        initValue={font.weight.initValue}
        modifiedValue={font.weight.modifiedValue}
      />

      <FontStyleInputOption
        name={"Letter Spacing"}
        initValue={font.letterSpacing.initValue}
        modifiedValue={font.letterSpacing.modifiedValue}
      />

      <FontStyleSelectOption
        name={"Line height"}
        initValue={font.lineHeight.initValue}
        modifiedValue={font.lineHeight.modifiedValue}
      />
    </div>
  );
}

export default PageHeadingTypography;
